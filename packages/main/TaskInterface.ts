interface ParaVerify {
    [propName: string]: {
        required: boolean
        dataPool: boolean
        type: string
    }
}

interface Parameter {
    [propName: string]: DataPoolValue | any
}

interface DataPoolVerify {
    [propName: string]: {
        type: string,
        label: string
    }
}

interface DataPoolValue{
    value: any,
    source: string
}

interface DataPool {
    [propName: string]: DataPoolValue
}

enum TaskFrequency {
    once,   //  一次结束
    continue,   //  无限，执行结束重新启动（经过考虑，目前不允许）
    timing,     //  定时
    interval,   //  固定间隔时间
}

enum TaskStatus {
    pending,    //  初始化，还未开始
    started,
    stopped,
    finished,
}

enum TaskType {
    single,
    trigger,
    taskFlow
}

interface TaskInterface {
    id: string
    title: string
    status: TaskStatus
    inputParaVerify: ParaVerify
    inputPara: Parameter
    dataPool: DataPool
    lastTask: string
    nextTask: string
}

interface TaskOptions {
    id: string,
    title: string
    dataPool: DataPool
    lastTask: string,
    nextTask: string
}

interface TaskData {
    id: string
    name: string
    title: string
    taskType: TaskType
    inputPara: {
        [propName: string]: any
    }
    lastTask: string
    nextTask: string

}

export {TaskData, DataPool, DataPoolVerify, ParaVerify, TaskType, TaskStatus, TaskInterface, TaskOptions, Parameter, TaskFrequency}