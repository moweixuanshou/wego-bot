import {createStore} from "vuex";
import {FileBox} from "file-box";
import {Contact} from "./ts/contact";
import {Room} from "./ts/room";

const store = createStore({
    state: {
        isScan: false,
        isLogin: true,
        contact: new Array<Contact>(),
        room: new Array<Room>(),
        tasks: new Array<any>(),
        taskFlow: new Array<any>(),
        taskFlowTemplate: new Array<any>()
    },

    getters: {
        isLogin: state => state.isLogin,
        isScan: state => state.isScan,
        contact: state => {
            return state.contact
        },
        room: state => state.room,
        tasks: state => state.tasks,
        taskFlow: state => state.taskFlow,
        taskFlowTemplate: state => state.taskFlowTemplate,
        singleTask: state => state.tasks.filter(t=>t.taskType === 0 && t.name!=='Header'),
        triggerTask: state => state.tasks.filter(t=>t.taskType === 1)
    },

    mutations: {
        loginStatus(state, payload) {
            state.isLogin = payload.isLogin
        },
        scanStatus(state, payload) {
            state.isScan = payload.isScan
        },
        contactStatus(state, payload) {
            for(let contact of state.contact){
                // @ts-ignore
                let res = payload.contact.find(t => t.id === contact.id)
                if(!res){
                    const index = state.contact.findIndex(t=>t.id===contact.id)
                    state.contact.splice(index,1)
                }
            }
            for (let contact of payload.contact) {
                let res = state.contact.find(c => c.id === contact.id)
                if (res) {
                    Object.assign(res, contact)
                } else {
                    const c = new Contact(contact)
                    Object.assign(c, contact)
                    state.contact.push(c)
                }
            }
            window.localStorage.setItem('contact', JSON.stringify(state.contact))
        },
        roomStatus(state, payload) {
            for(let room of state.room){
                // @ts-ignore
                let res = payload.room.find(t => t.id === room.id)
                if(!res){
                    const index = state.room.findIndex(t=>t.id===room.id)
                    state.room.splice(index,1)
                }
            }
            for (let room of payload.room) {
                let res = state.room.find(r => r.id === room.id)
                if (res) {
                    Object.assign(res, room)
                } else {
                    const r = new Room(room)
                    Object.assign(r, room)
                    state.room.push(r)
                }
            }
            window.localStorage.setItem('room', JSON.stringify(state.room))
        },
        taskStatus(state, payload){
            // console.log(payload)
            for(let task of state.tasks){
                // @ts-ignore
                let res = payload.tasks.find(t => t.name === task.name)
                if(!res){
                    const index = state.tasks.findIndex(t=>t.name===task.name)
                    state.tasks.splice(index,1)
                }
            }
            for (let task of payload.tasks){
                let res = state.tasks.find(t => t.name === task.name)
                if(res){
                    Object.assign(res,task)
                }else{
                    state.tasks.push(task)
                }
            }
            window.localStorage.setItem('tasks', JSON.stringify(state.tasks))
        },

        taskFlowStatus(state, payload){
            // console.log(payload)
            for(let taskFlow of state.taskFlow){
                // @ts-ignore
                let res = payload.taskFlow.find(t => t.id === taskFlow.id)
                if(!res){
                    const index = state.taskFlow.findIndex(t=>t.id===taskFlow.id)
                    state.taskFlow.splice(index,1)
                }
            }
            for (let taskFlow of payload.taskFlow){
                let res = state.taskFlow.find(t => t.id === taskFlow.id)
                if(res){
                    Object.assign(res,taskFlow)
                }else{
                    state.taskFlow.push(taskFlow)
                }
            }
            window.localStorage.setItem('taskFlow', JSON.stringify(state.taskFlow))
        },
        taskFlowTemplateStatus(state, payload){
            if(payload.flag){
                state.taskFlowTemplate.push(payload.taskFlowTemplate)
            }else{
                let index = state.taskFlowTemplate.findIndex(t => t.id === payload.taskFlowTemplate.id)
                if(index>-1){
                    state.taskFlowTemplate.splice(index,1)
                }
            }
            window.localStorage.setItem('taskFlowTemplate',JSON.stringify(state.taskFlowTemplate))
        },
    },
    actions: {
        loginStatus({commit}, payload) {
            commit('loginStatus', payload)
        },
        scanStatus({commit}, payload) {
            commit('scanStatus', payload)
        },
        contactStatus({commit}, payload) {
            commit('contactStatus', payload)
        },
        roomStatus({commit}, payload) {
            commit('roomStatus', payload)
        },
        taskStatus({commit}, payload) {
            commit('taskStatus', payload)
        },
        taskFlowStatus({commit}, payload){
            commit('taskFlowStatus', payload)
        },
        taskFlowTemplateStatus({commit}, payload){
            commit('taskFlowTemplateStatus', payload)
        }
    }
})


export default store