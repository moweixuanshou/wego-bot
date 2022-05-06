import {BaseTask, classMap, MessageSenderContacts, MessageTriggerContacts, TaskSingle, TaskTrigger} from './Task'
import {subjectTask} from "./Subject";
import {DataPool, Parameter, TaskData, TaskStatus, TaskType} from './TaskInterface';

class TaskFlow {
    id = ''
    title = 'unTitled'
    tasks = new Array<BaseTask>()
    singleTask = new Array<TaskSingle>()
    triggerTask = new Array<TaskTrigger>()
    status = TaskStatus.pending
    dataPool: DataPool = {}

    constructor(data: Array<TaskData>) {
        for (let d of data) {
            if (d.taskType === TaskType.single) {
                const newTask:TaskSingle = this.createTask(d.name,d) as TaskSingle
                this.tasks.push(newTask)
                this.singleTask.push(newTask)
                newTask.initialize()
            } else if (d.taskType === TaskType.trigger) {
                const newTask: TaskTrigger = this.createTask(d.name,d) as TaskTrigger
                this.tasks.push(newTask)
                this.triggerTask.push(newTask)
                newTask.initialize()
            }
        }
        for(let task of this.tasks){
            const input:Parameter = {}
            const inputPara = data.find(d=> d.id === task.id)?.inputPara as Parameter
            for(let key in task.inputParaVerify){
                if(task.inputParaVerify[key].dataPool){
                    input[key] = this.dataPool[inputPara[key]]
                }else{
                    input[key] = inputPara[key]
                }
            }
            task.inputPara = input
            task.verifyPara()
        }
    }

    createTask(name: string, data: TaskData ){
        const args = {
            id: data.id,
            title: data.title,
            dataPool: this.dataPool,
            lastTask: data.lastTask,
            nextTask: data.nextTask
        }
        if(name in classMap){
            return new classMap[name](args)
        }else {
            return new BaseTask(args)
        }
    }

    start() {
        for(let trigger of this.triggerTask){
            subjectTask.subscribe(trigger.id,this.subscribe(trigger.id))
        }
        this.runTask(this.tasks[0],{})
        this.status = TaskStatus.started
    }

    runTask(task: BaseTask, options: any){
        if(task.taskType === TaskType.single){
             task.execute(options)
            if(task?.nextTask){
                const nextTask = this.tasks.find(t=>t.id === task.nextTask)
                if(nextTask) this.runTask(nextTask, options)
            }
        }else if(task.taskType === TaskType.trigger){
            task.execute(options)
        }
        if(!this.verifyStatus()){
            this.status = TaskStatus.finished
        }
    }

    subscribe(id: string){
        return (options: any)=>{
            const task = this.tasks.find(t=>t.id === id)
            if(task?.nextTask){
                const nextTask = this.tasks.find(t=>t.id === task.nextTask)
                if(nextTask) this.runTask(nextTask, options)
            }
        }
    }

    stopped(){
        this.destroy()
        this.status = TaskStatus.stopped
    }

    destroy(){
        for(let task of this.tasks){
            task.destroy()
        }
        for(let trigger of this.triggerTask){
            subjectTask.removeEvent(trigger.id)
        }
        this.status = TaskStatus.finished
    }

    verifyStatus(){
        for(let task of this.tasks){
            if(task.status===TaskStatus.pending || task.status===TaskStatus.started){
                return true
            }
        }
        return false
    }
}


export {TaskFlow}