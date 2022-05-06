import {createApp} from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import router from "./router";
import store from "./store"
import * as ElIcons from '@element-plus/icons-vue'
import {FileBox} from "file-box";

const app = createApp(App)

for (let name in ElIcons) {
    app.component(name, (ElIcons as any)[name])
}

app.use(ElementPlus)
    .use(router)
    .use(store)
    .mount('#app')
    .$nextTick(window.removeLoading).then()


window.ipcRenderer.on('main-process-message', (_event, ...args) => {
    console.log('[Receive Main-process message]:', ...args)
})

window.ipcRenderer.on('login-success',(_event,...args)=>{
    store.dispatch('scanStatus',{isScan:true}).then(()=>{
        router.push("/").then(()=>{
            store.dispatch('contactStatus',{contact:args[0]}).then()
            store.dispatch('roomStatus',{room:args[1]}).then()
        })
    })
})

window.ipcRenderer.on('logout-success',(_event,...args)=>{
    store.dispatch('scanStatus',{isScan:false}).then(()=>{
        console.log('logout success')
        router.push("/scan").then()
    })
})

