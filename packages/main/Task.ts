import {getUuiD} from "./util";
import {subjectTask} from "./Subject";
import {Message, WechatyBuilder} from "wechaty";
import {
    DataPool,
    DataPoolVerify,
    Parameter,
    ParaVerify,
    TaskFrequency,
    TaskInterface,
    TaskOptions,
    TaskStatus,
    TaskType
} from "./TaskInterface"


class BaseTask implements TaskInterface {
    id = getUuiD(8)
    name = 'BaseTask'
    title = ''
    taskLabel = '基础节点'
    description = 'baseTask'
    taskType = TaskType.single
    status = TaskStatus.pending
    inputParaVerify: ParaVerify = {}
    inputPara: Parameter = {}
    dataPoolVerify: DataPoolVerify = {}
    dataPool: DataPool = {}
    lastTask = ''
    nextTask = ''
    records = new Array<string>()

    constructor({id, title, lastTask, nextTask, dataPool}: TaskOptions) {
        this.id = id
        this.title = title
        this.dataPool = dataPool
        this.lastTask = lastTask
        this.nextTask = nextTask
    }

    initialize(){
        this.initializeDataPool()
    }

    start() {
        this.status = TaskStatus.started
    }

    stop() {
        this.status = TaskStatus.stopped
    }

    finished() {
        this.status = TaskStatus.finished
    }

    execute(options: any) {
        console.log(this.id,'execute')
    }

    destroy() {
        this.status = TaskStatus.finished
    }

    verifyPara() {
        let flag = true
        for (let key in this.inputParaVerify) {
            if (this.inputPara.hasOwnProperty(key)) {
            } else {
                flag = !this.inputParaVerify[key].required
            }
            if (!flag) {
                throw new Error('参数错误，缺少必要参数或参数类型不正确')
            }
        }
    }

    initializeDataPool(){
        //  初始化dataPool
        for (let dv in this.dataPoolVerify) {
            if (this.dataPoolVerify[dv].type === 'Array') {
                // console.log(this.id + '-' + dv)
                this.dataPool[this.id + '-' + dv] = {
                    value: [],
                    source: this.id
                }
            } else if (this.dataPoolVerify[dv].type === 'String') {
                this.dataPool[this.id + '-' + dv]= {
                    value: '',
                    source: this.id
                }
            } else if (this.dataPoolVerify[dv].type === 'Object') {
                this.dataPool[this.id + '-' + dv] = {
                    value: {},
                    source: this.id
                }
            }
        }
    }
}

class TaskSingle extends BaseTask {
    name = 'TaskSingle'
}


class TaskTrigger extends BaseTask {
    name = 'TaskTrigger'
    taskType = TaskType.trigger
    frequencyVerify = [TaskFrequency.once, TaskFrequency.timing, TaskFrequency.interval, TaskFrequency.continue]
    frequency = TaskFrequency.once
    static readonly subject = subjectTask

    trigger(options: any) {
        subjectTask.publish(this.id, options)
    }

}

class Header extends TaskSingle{
    id = 'header'
    name = 'Header'
    title = '头节点'
    taskLabel = '头节点'
    description = '初始节点,可以控制参数输入'
    inputParaVerify = {
        contacts: {
            required: true,
            type: 'Array',
            label: '联系人列表',
            dataPool: false
        }
    }
    dataPoolVerify =  {
        contacts: {
            type: 'Array',
            label: '联系人列表',
        }
    }

    constructor(options: TaskOptions) {
        super(options);
        // this.initializeDataPool()
    }

    execute(options: any) {
        this.start()
        this.dataPool[this.id+'-'+'contacts'].value.push(...this.inputPara.contacts)
        // let recordString = this.inputPara.contacts.reduce((pre:string,cur:string)=>pre+cur)
        // this.records.push(recordString)
        for(let c of this.inputPara.contacts){
            this.records.push(c)
        }
        this.finished()
    }
}

class MessageTriggerContacts extends TaskTrigger {
    name = 'MessageTriggerContacts'
    taskLabel = '监听消息'
    description = '监听消息，并且抛出一个联系人列表'
    frequencyVerify = [TaskFrequency.once, TaskFrequency.continue]
    frequency = TaskFrequency.continue
    inputParaVerify = {
        contacts: {
            required: true,
            dataPool: true,
            type: 'Array',
            label:'联系人列表'
        },
        keyword: {
            required: true,
            dataPool: false,
            type: 'String',
            label: '关键词'
        }
    }
    dataPoolVerify = {
        contacts: {
            type: 'Array',
            label: '联系人列表'
        }
    }
    static bot = WechatyBuilder.build()

    constructor(options: TaskOptions) {
        super(options);
    }

    initialize() {
        super.initialize();
        MessageTriggerContacts.bot.on('message', this.run)
    }

    execute(options: any) {
        super.execute(options)
        this.start()
        // this.inputPara.contacts.push(options.contactId)
    }

    run = async (msg: Message) =>{
        const from = msg.talker()
        const text = msg.text()
        let contacts = this.inputPara.contacts
        if (!from || !contacts.value.includes(from.id)) return
        // if(this.frequency === TaskFrequency.once && this.record.find(r=>r.contactId === from.id)) return
        if (this.inputPara.keyword) {
            if (text.includes(this.inputPara.keyword)) {
                this.trigger({
                    contactId: from.id,
                    text: text
                })
            }
        }else{
            this.trigger({
                contactId: from.id,
                text: ''
            })
        }
    }

    trigger(options: any) {
        if (this.frequency === TaskFrequency.once) {
            if(!this.dataPool[this.id + '-' + 'contacts'].value.includes(options.contactId)){
                this.dataPool[this.id + '-' + 'contacts'].value.push(options.contactId)
                this.records.push(options.contactId+': '+options.text)
            }
            const recordContacts = [...new Set(this.records.map(r=>{
                return r.split(": ")[0]
            }))]
            console.log(recordContacts)
            if(recordContacts.length === this.inputPara.contacts.value.length){
                this.finished()
            }
        }else{
            this.dataPool[this.id + '-' + 'contacts'].value.push(options.contactId)
            this.records.push(options.contactId+': '+options.text)
        }
        super.trigger(options)
    }

    destroy() {
        MessageTriggerContacts.bot.off('message', this.run)
        super.destroy()
    }
}

class MessageSenderContacts extends TaskSingle {
    name = 'MessageSenderContacts'
    taskLabel = '发送消息'
    description = '向某个联系人发送指定消息'
    inputParaVerify = {
        contacts: {
            required: true,
            dataPool: true,
            type: 'Array',
            label: '联系人列表'
        },
        reply: {
            required: true,
            dataPool: false,
            type: 'String',
            label: '回复内容'
        },
    }
    static bot = WechatyBuilder.build()

    constructor(options: TaskOptions) {
        super(options);
        // this.initializeDataPool()
    }

    execute(options: any) {
        super.execute(options);
        this.run().then(() => {
            this.finished()
        })
    }

    run =async ()=> {
        // @ts-ignore
        const remain = this.inputPara.contacts.value.slice(this.records.length)
        for (let id of remain) {
            const contact = await MessageSenderContacts.bot.Contact.find({id: id})
            if (contact) {
                await contact.say(this.inputPara.reply).then(()=>{
                    this.records.push(id)
                })
            }
        }
    }
}

class TimingTask extends TaskTrigger{
    name = 'TimingTask'
    taskLabel = '定时器'
    description = '定时任务/间隔任务'
}

class FilterTask extends TaskSingle{
    name = 'FilterTask'
    taskLabel = '分流/过滤'
    description = '分流/过滤，可以连接多个节点'
}

class MessageSenderRoom extends TaskSingle{
    name = 'MessageSenderRoom'
    taskLabel = '发送群消息'
    description = '发送群消息，可以@某个对象'
}

class MessageTriggerRoom extends TaskTrigger{
    name = 'MessageTriggerRoom'
    taskLabel = '监听群消息'
    description = '监听群聊某部分成员的消息'
}

class ContactsAdd extends TaskSingle{
    name = 'ContactAdd'
    taskLabel = '好友添加'
    description = '添加好友'
}

class ContactsApply extends TaskTrigger{
    name = 'ContactsApply'
    taskLabel = '好友申请'
    description = '收到好友申请触发'
}

class RoomInvitation extends TaskSingle{
    name = 'RoomInvitation'
    taskLabel = '群邀请'
    description = '发送群邀请'
}

class SmartReply extends TaskTrigger{
    name = 'SmartReply'
    taskLabel = '智能对话'
    description = '智能对话，触发后进入智能对话系统，可以实时聊天'
}

class TianXingAPI extends TaskSingle{
    name = 'TianXingAPI'
    taskLabel = '其他功能API'
    description = '天行API，接入API后可以实现百科、翻译、新闻、天气等等功能'
}

class MessageCollection extends TaskSingle{
    name = 'MessageCollection'
    taskLabel = '消息收集'
    description = '消息汇总，将接收到的消息汇总成表格，支持导出'
}

const classMap:{[propName: string]: any} = {
    'Header': Header,
    'MessageSenderContacts': MessageSenderContacts,
    'MessageTriggerContacts': MessageTriggerContacts,
    'TimingTask' : TimingTask,
    'FilterTask': FilterTask,
    'MessageSenderRoom': MessageSenderRoom,
    'MessageTriggerRoom': MessageTriggerRoom,
    'ContactsAdd': ContactsAdd,
    'RoomInvitation': RoomInvitation,
    'SmartReply': SmartReply,
    'TianXingAPI': TianXingAPI,
    'MessageCollection': MessageCollection,
}

export {TaskTrigger, TaskSingle, BaseTask}
export {Header,MessageSenderContacts, MessageTriggerContacts, classMap}