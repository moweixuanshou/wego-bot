import {createRouter, createWebHistory} from "vue-router";
import store from "./store";
const Home = ()=> import("./components/Home.vue");
const Contact = ()=>  import("./components/Contact.vue");
const Index = ()=> import("./components/Index.vue")
const Room = ()=> import("./components/Room.vue")
const Task = ()=> import("./components/Task.vue")
const EditTask = ()=> import("./components/EditTask.vue")
const Setting = ()=> import("./components/Setting.vue")
const Hello = ()=> import("./components/Hello.vue")
const NoFound = ()=> import("./common/NotFound.vue")


const routes = [
    {
        path:"/",
        name:'index',
        component: Index,
        meta: {
            isScan:false,
            title:'首页',
        },
        children: [
            {
                path: "home",
                component: Home,
                meta: {
                    isScan:true,
                    title:'主页'
                },
                props:true
            },
            {
                path: "contact",
                component: Contact,
                meta: {
                    isScan:true,
                    title:'联系人管理'
                },
                props:true
            },
            {
                path: "room",
                component: Room,
                meta: {
                    isScan:true,
                    title: '群组管理'
                }
            },
            {
                path: "task",
                component: Task,
                meta: {
                    isScan:true,
                    title: '任务管理'
                },
                children: [
                ]
            },
            {
                path: "edit",
                component: EditTask,
                meta: {
                    isScan:true,
                    title: '创建任务'
                }
            },
            {
                path: "setting",
                component: Setting,
                meta: {
                    isScan:false,
                    title: '设置'
                }
            },
        ]
    },
    {
        path: "/hello",
        component: Hello,
        meta: {
            isScan:false
        }
    },
    {
      path:"/404",
      component: NoFound,
      meta: {
          isScan: false
      }
    },
    {
        path: "/*",
        redirect:"/404",
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from)=>{
    if(to.meta.isScan){
        if(!store.state.isScan){
            console.log(store.state.isScan)
            return '/hello'
        }
    }
    if(to.path === '/'){
        return '/home'
    }
})

router.beforeResolve( async to =>{
    if(to.path==='/contact'){
        // if(store.state.contact.length===0){
            const contact = await window.ipcRenderer.invoke('getAllContact')
        console.log(contact)
            await store.dispatch('contactStatus',{contact})
        // }
    }else if(to.path==='/room'){
        // if(store.state.room.length===0){
            const room = await window.ipcRenderer.invoke('getAllRoom')
            console.log(room)
            await store.dispatch('roomStatus',{room})
        // }
    }else if(to.path === '/edit'){
        // if(store.state.tasks.length===0){
            const tasks = JSON.parse(await window.ipcRenderer.invoke('getAllTasks'))
            console.log(tasks)
            await store.dispatch('taskStatus',{tasks})
        // }
    }else if(to.path === '/task' || to.path === '/home'){
        // if(store)
        const taskFlow = JSON.parse(await window.ipcRenderer.invoke('getAllTaskFlow'))
        console.log(taskFlow)
        await store.dispatch('taskFlowStatus', {taskFlow})
    }
})

export default router