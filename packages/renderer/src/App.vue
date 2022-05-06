<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import {onBeforeMount,onUnmounted, onBeforeUnmount} from "vue";
import store from "./store";

onBeforeMount(()=>{
  const contactJSON = window.localStorage.getItem('contact') as string
  if(contactJSON){
    const contact = JSON.parse(contactJSON)
    store.dispatch('contactStatus',{contact})
  }
  const roomJSON = window.localStorage.getItem('room') as string
  if(roomJSON){
    const room = JSON.parse(roomJSON)
    store.dispatch('roomStatus',{room})
  }
  const taskJson = window.localStorage.getItem('tasks') as string
  if(taskJson){
    const tasks = JSON.parse(taskJson)
    store.dispatch('taskStatus',{tasks})
  }
  const taskFlowJson = window.localStorage.getItem('taskFlow') as string
  if(taskFlowJson){
    const taskFlow = JSON.parse(taskFlowJson)
    store.dispatch('taskFlowStatus',{taskFlow})
  }
  const taskFlowTemplateJson = window.localStorage.getItem('taskFlowTemplate') as string
  if(taskFlowTemplateJson){
    const taskFlowTemplate = JSON.parse(taskFlowTemplateJson)
    for(let t of taskFlowTemplate){
      store.dispatch('taskFlowTemplateStatus',{taskFlowTemplate:t,flag:true})
    }
  }
})

window.onbeforeunload=()=>{
  const contact = store.state.contact
  window.localStorage.setItem('contact',JSON.stringify(contact))
  const room = store.state.room
  window.localStorage.setItem('room',JSON.stringify(room))
}

</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  background-color: #fff;
}

</style>
