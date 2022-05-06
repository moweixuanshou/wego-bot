
interface EventList{
    [propName: string]: Array<(options:any)=>void>
}

class Subject{
    eventList: EventList = {}
    subscribe(eventName:string,fn:(options: any)=>void){
        if (!this.eventList.hasOwnProperty(eventName)) {
            this.eventList[eventName] = new Array<()=>void>()
        }
        this.eventList[eventName].push(fn)
        // console.log('this.eventList: ', this.eventList);
    }
    unsubscribe(eventName:string,fn:(options: any)=>void) {
        let fns = this.eventList[eventName];
        if (!fns || fns.length == 0) { // 如果没有订阅该事件,直接返回
            return false
        }
        if (!fn) { // 如果传入具体函数,表示取消所有对应name的订阅
            fns.length = 0
        } else {
            for (let i = 0; i < fns.length; i++) {
                if (fn == fns[i]) {
                    fns.splice(i, 1);
                }
            }
        }
    }
    publish(...args: any[]) {
        let name = Array.prototype.shift.call(args)	// 获取事件名称
        let options = Array.prototype.shift.call(args)	// 获取事件名称
        let fns = this.eventList[name]
        if (!fns || fns.length == 0) { // 没有订阅该事件
            return false
        }
        for (let i = 0, fn; i < fns.length; i++) {
            fn = fns[i]
            fn.apply(this, [options])
        }
    }
    removeEvent(event:string){
        delete this.eventList[event]
    }
}

const subjectTask = new Subject()

export {subjectTask}