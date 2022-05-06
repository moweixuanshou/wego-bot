class EditTask{
    id = ''
    name = ''
    title = ''
    taskLabel = ''
    nextTask= ''
    lastTask= ''
    description= ''
    taskType = 0
    frequency =0
    frequencyVerify= [0,1]
    inputPara={}
    inputParaVerify ={}
    dataPoolVerify ={}
    status = TypeStatus.pending
    x = 0
    y = 0
    verify = false
    record = new Array<string>()

    constructor(options: {[propName:string]: any}) {
        for(let key in options){
            // @ts-ignore
            this[key] = options[key]
        }
    }
}

enum TypeStatus {
    pending,
    started,
    stopped,
    finished
}



class TaskFlow{
    id = ''
    title = 'unTitled'
    status = TypeStatus.pending
    tasks = new Array<EditTask>()


    addTask(task: EditTask){
        this.tasks.push(task)
    }

    removeTask(id: string){
        const index = this.tasks.findIndex(t=>t.id===id)
        if(index){
            this.tasks.splice(index,1)
        }
    }

    findTask(id: string){
        return this.tasks.find(t=>t.id===id)
    }

}

export {EditTask, TaskFlow}