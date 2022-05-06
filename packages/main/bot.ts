import {Contact, log, Message, ScanStatus, WechatyBuilder} from "wechaty";
import {PuppetXp} from "wechaty-puppet-xp";
import { win, app} from './index'
import {FileBox} from "file-box";
import {ipcMain} from "electron"
import {Parameter, TaskFrequency, TaskType} from "./TaskInterface";
import {TaskFlow} from "./TaskFlow";
import {Header, MessageSenderContacts, MessageTriggerContacts, classMap} from './Task'
import Store from "electron-store";
import {flatten} from "./util";
import {data} from "jquery";
const store = new Store()


interface ContactSerialize {
    id:string;
    name:string;
    alias:string;
    gender:string;
    avatar: string;
}

let loginStatus = false

async function onScan (qrcode: string, status: ScanStatus) {
    if (qrcode) {
        console.info(`[${status}] ${qrcode}\nScan QR Code above to log in: `)
    } else {
        console.info(`[${status}]`)
    }
}

async function onLogin (user: Contact) {
    log.info('StarterBot', '%s login', user)
    const contactSerializeList = await getAllContact()
    const room = await getAllRoom()
    win?.webContents.send('login-success',contactSerializeList, room)
    loginStatus = true
}

function onLogout (user: Contact) {
    log.info('StarterBot', '%s logout', user)
    const contact = bot.Contact.findAll()
    win?.webContents.send('logout-success')
    loginStatus = false
}


async function onMessage (msg: Message) {
    log.info('StarterBot', msg.toString())
}

const puppet = new PuppetXp()
const bot = WechatyBuilder.build({
    name: 'ding-dong-bot',
    puppet,
})

bot.on('scan', onScan)
bot.on('login', onLogin)
bot.on('logout', onLogout)
bot.on('message', onMessage)

async function getAllContact(){
    const contactList = await bot.Contact.findAll()
    const contactSerializeList =await Promise.all(contactList.filter(contact =>{
        return contact.type() === bot.Contact.Type.Individual && contact.friend() || true
    }).map(async (contact)=>{
        const url =await contact.avatar()
        return {
            id:contact.id,
            name:contact.name(),
            alias:await contact.alias(),
            // @ts-ignore
            avatar: url[0]
        }
    }))

    return contactSerializeList
}

async function getAllRoom(){
    const roomList = await bot.Room.findAll()
    const roomSerializeList = await Promise.all(roomList.map(async (room)=>{
        return {
            id:room.id,
            topic:await room.topic(),
            // member:await room.memberAll()
        }
    }))
    return roomSerializeList
}

function getAllTasks(){
    const args = {
        id: 'header',
        title: 'Header',
        dataPool:{},
        nextTask:'',
        lastTask:'',
    }
    const res = []
    for(let name in classMap){
        res.push(new classMap[name](args))
    }
    return res
}

ipcMain.handle('getAllContact', async (event,arg)=>{
    const contacts = await getAllContact()
    event.returnValue = contacts
    return contacts
})

ipcMain.handle('getAllRoom', async (event,arg)=>{
    const room = await getAllRoom()
    event.returnValue = room
    return room
})

ipcMain.handle('getAllTasks',  (event,arg)=>{
    const tasks = getAllTasks()
    event.returnValue = tasks
    return JSON.stringify(tasks.map(t=>{return {...t}}))
})


const taskFlowRunner = initializeTaskFlow()
MessageTriggerContacts.bot = bot
MessageSenderContacts.bot = bot

function initializeTaskFlow(){
    const taskFlowRunner = new Array<TaskFlow>()
    const saveJson = JSON.parse(store.get('taskFlow','[]') as string)
    console.log(saveJson)
    for(let taskFlow of saveJson){
        const newTaskFlow = createTaskFlow(taskFlow,true)
        taskFlowRunner.push(newTaskFlow)
    }
    return taskFlowRunner
}

function saveFlowJson(){
    const res = taskFlowRunner.map(taskFlow=>{
        const tasks = taskFlow.tasks.map(t=>{return{...t}})
        return {
            ...taskFlow,
            tasks
        }
    })
    const saveJson = JSON.stringify(res)
    store.set('taskFlow',saveJson)
}

app.on('before-quit',(event)=>{
    saveFlowJson()
    console.log('quit')
})

function createTaskFlow(taskFlowConfig: any, load: boolean){
    // console.log(taskFlowConfig)
    const taskList = []
    for(let task of taskFlowConfig['tasks']){
        taskList.push({
            id:task['id'],
            name:task['name'],
            title: task['title'],
            nextTask:task['nextTask'],
            lastTask:task['lastTask'],
            frequency:task['frequency'],
            inputPara: task['inputPara'],
            taskType: task['taskType'],
        })
    }
    const newTaskFlow = new TaskFlow(taskList)

    newTaskFlow.id = taskFlowConfig['id']
    newTaskFlow.title = taskFlowConfig['title']
    if(load){
        newTaskFlow.status = taskFlowConfig['status']
        Object.assign(newTaskFlow.dataPool,taskFlowConfig['dataPool'])
        for(let task of newTaskFlow.tasks){
            // @ts-ignore
            let oldTask = taskFlowConfig['tasks'].find(t=>t.id===task.id)
            if(oldTask){
                task.status = oldTask.status
                task.records = oldTask.records
                const input:Parameter = {}
                for(let key in task.inputParaVerify){
                    if(task.inputParaVerify[key].dataPool){
                        console.log(oldTask.inputPara)
                        input[key] = newTaskFlow.dataPool[oldTask.inputPara[key].source+'-'+key]
                    }else{
                        input[key] = oldTask.inputPara[key]
                    }
                }
                task.inputPara = input
            }
        }
    }

    return newTaskFlow
}


ipcMain.handle('addTaskFlow',(event,...args)=>{
    const taskFlowConfig = JSON.parse(args[0])
    const newTaskFlow = createTaskFlow(taskFlowConfig,false)
    if(taskFlowRunner.find(t=>t.id===newTaskFlow.id)){
        const index = taskFlowRunner.findIndex(t=>t.id===newTaskFlow.id)
        taskFlowRunner[index] = newTaskFlow
    }else{
        taskFlowRunner.push(newTaskFlow)
    }
    saveFlowJson()
    return {
        code:'100',
        msg: '保存成功',
    }
})

ipcMain.handle('deleteTaskFlow',(event,...args)=>{
    const index = taskFlowRunner.findIndex(t=>t.id===args[0])
    console.log(index,taskFlowRunner.length)
    let res = {
        code: '101',
        msg:'找不到对象',
    }
    if(index!==-1){
        taskFlowRunner[index].destroy()
        taskFlowRunner.splice(index,1)
        res =  {
            code: '100',
            msg:'成功删除',
        }
    }
    saveFlowJson()
    return res
})

ipcMain.handle('startTaskFlow',(event,...args)=>{
    const taskFlow = taskFlowRunner.find(t=>t.id===args[0])
    let res = {
        code: '101',
        msg:'找不到对象',
    }
    if(taskFlow){
        console.log(taskFlow.id)
        taskFlow.start()
        res =  {
            code: '100',
            msg:'成功',
        }
    }
    saveFlowJson()
    return res
})

ipcMain.handle('stopTaskFlow',(event,...args)=>{
    const taskFlow = taskFlowRunner.find(t=>t.id===args[0])
    let res = {
        code: '101',
        msg:'找不到对象',
    }
    if(taskFlow){
        console.log(taskFlow.id)
        taskFlow.destroy()
        res =  {
            code: '100',
            msg:'成功',
        }
    }
    saveFlowJson()
    return res
})

ipcMain.handle('getAllTaskFlow',(event,...args)=>{
    const data = []
    for(let taskFlow of taskFlowRunner){
        data.push({
            id: taskFlow.id,
            title: taskFlow.title,
            tasks: taskFlow.tasks.map(t=>{return{...t}}),
            status: taskFlow.status,
            dataPool: taskFlow.dataPool
        })
    }
    // console.log(JSON.stringify(data))
    return JSON.stringify(data)
})

ipcMain.handle('getSelfData',async (event,...args)=>{
    const contactList = await bot.Contact.findAll()
    let self =await contactList[0].avatar()
    // @ts-ignore
    self = self[1]
    // const self = contactList.find(c=>c.self())
    // let data = {}
    // if(self){
    //     data = Object.assign(data,{
    //         id: self.id,
    //         name: self.name(),
    //         avatar: await self.avatar()
    //     })
    //     console.log(JSON.stringify(data))
    // }
    return JSON.stringify(self)
})

ipcMain.handle('checkLogin',()=>{
    return loginStatus
})

ipcMain.handle('getTaskFlow', (event,...args)=>{
    const id = args[0]
    if(id){
        const taskFlow = taskFlowRunner.find(t=>t.id===id)
        if(taskFlow){
            if(!taskFlow.verifyStatus()){
                taskFlow.destroy()
            }
            return JSON.stringify({
                id: taskFlow.id,
                title: taskFlow.title,
                tasks: taskFlow.tasks.map(t=>{return{...t}}),
                status: taskFlow.status,
                dataPool: taskFlow.dataPool
            })
        }
    }
})

export {bot}