<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card class="card-pane">
          <div class="card-title">
            <h5>机器人</h5>
          </div>
          <el-row>
            <el-col :span="8">
              <el-image class="bot-head" :src="botData['head_img_url']"></el-image>
            </el-col>
            <el-col :span="2"></el-col>
            <el-col :span="8">
              <div class="bot-name">
                <span>{{botData['name']}}</span>
              </div>
              <div class="bot-id">
                <span>{{botData['id']}}</span>
              </div>
            </el-col>
          </el-row>
<!--          <div class="bot-time">-->
<!--            <span>开始工作时间:  </span>-->
<!--            <span style="font-size: 14px">{{startTime}}</span>-->
<!--          </div>-->
          <el-divider class="little-divider"></el-divider>
          <el-row :gutter="20" class="icon-item-list">
            <el-col :span="8">
              <el-row>
                <el-col :span="12">
                  <el-image class="icon-item-image" :src="ContactImg"></el-image>
                </el-col>
                <el-col class="icon-item-text" :span="12">
                  <h5 style="margin: 15px 0">联系人</h5>
                </el-col>
              </el-row>
              <h1 class="icon-item-number">{{store.getters.contact.length}}</h1>
            </el-col>
            <el-col class="bot-icon-list" :span="8">
              <el-row>
                <el-col :span="12">
                  <el-image class="icon-item-image" :src="RoomImg"></el-image>
                </el-col>
                <el-col class="icon-item-text" :span="12">
                  <h5 style="margin: 15px 0">群聊</h5>
                </el-col>
              </el-row>
              <h1 class="icon-item-number">{{store.getters.room.length}}</h1>
            </el-col>
            <el-col :span="8">
              <el-row>
                <el-col :span="12">
                  <el-image class="icon-item-image" :src="TaskImg"></el-image>
                </el-col>
                <el-col class="icon-item-text" :span="12">
                  <h5 style="margin: 15px 0">任务</h5>
                </el-col>
              </el-row>
              <h1 class="icon-item-number">{{store.getters.taskFlow.length}}</h1>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="card-pane">
          <div class="card-title">
            <h5>工作区</h5>
          </div>
          <el-row class="work-row" :gutter="20" >
            <el-col :span="12">
              <div class="work-item" @click="handleContact">
                <el-image class="work-item-image" :src="ContactManageImg"></el-image>
                <h1 class="work-item-text">联系人管理</h1>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="work-item" @click="handleRoom">
                <el-image class="work-item-image" :src="RoomManageImg"></el-image>
                <h1 class="work-item-text">群组管理</h1>
              </div>
            </el-col>
          </el-row>
          <el-row class="work-row" :gutter="20">
            <el-col :span="12">
              <div class="work-item" @click="handleTaskFlow">
                <el-image class="work-item-image" :src="TaskManageImg"></el-image>
                <h1 class="work-item-text">任务流管理</h1>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="work-item" @click="handleTaskEdit">
                <el-image class="work-item-image" :src="TaskEditImg"></el-image>
                <h1 class="work-item-text">编排任务流</h1>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="card-pane">
          <div class="card-title">
            <h5>最近消息</h5>
          </div>
          <div v-if="messages10.length===0">
            暂无消息
          </div>
          <div v-else>
            <div v-for="message in messages10">
              <span>{{message.text}}</span>
              <span>{{message.sender}}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-card class="workflow">
      <div class="card-title">
        <h5>工作流</h5>
      </div>
      <el-scrollbar height="350px">
        <div class="task-flow-list">
          <TaskFlowCard class="task-flow" v-for="taskFlow in taskFlowList"
                        :task-flow="taskFlow"></TaskFlowCard>
          <span v-for="t in taskFlowList">{{t.name}}</span>
        </div>
      </el-scrollbar>
    </el-card>
  </div>
</template>

<script setup>

import {computed, onMounted, reactive, ref} from "vue";
import {useStore} from "vuex";
import TaskFlowCard from "../common/TaskFlowCard.vue"
import ContactImg from "../../public/images/contact.png"
import RoomImg from "../../public/images/room.png"
import TaskImg from "../../public/images/task.png"
import ContactManageImg from "../../public/images/contactManage.png"
import RoomManageImg from "../../public/images/roomManage.png"
import TaskManageImg from "../../public/images/taskManage.png"
import TaskEditImg from "../../public/images/taskEdit.png"
import {TaskFlow} from "../ts/Tasks";
import router from "../router";

const store = useStore()
const messages = []

let botData = reactive({})
const startTime = new Date().toISOString()
const taskFlowList = reactive(initializeTaskFlow())

function initializeTaskFlow(){
  return store.state.taskFlow.map(t => {
    const taskFlow = new TaskFlow()
    taskFlow.id = t.id
    taskFlow.title = t.title
    taskFlow.tasks = t.tasks
    return taskFlow
  })
}

onMounted(async () => {
  botData = Object.assign(botData, await getBotData())
  console.log(taskFlowList)
})

async function getBotData() {
  let data = JSON.parse(await window.ipcRenderer.invoke('getSelfData'))
  console.log(data)
  return data
}

function handleContact(){
  router.push('/contact')
}

function handleRoom(){
  router.push('/room')
}

function handleTaskFlow(){
  router.push('/task')
}

function handleTaskEdit(){
  router.push('/edit')
}

const messages10 = computed(()=>{
  if(messages.length>10){
    return messages.slice(0,10)
  }else{
    return messages
  }
})
</script>

<style scoped>
.card-title{
  width: 100px;
  height: 30px;
  margin-bottom: 20px;
}

.card-title h5{
  margin: 0;
  line-height: 30px;
  font-size: 20px;
}

.card-pane{
  height: 350px;
}

.card-pane .bot-head{
  width: 80px;
  height: 80px;
}
.bot-name{
  font-size: 14px;
  margin: 20px 0 10px 0;
}
.bot-id{
  font-size: 14px;
  color: #8c939d;
  margin: 10px 0 20px 0;
}

.bot-time{
  margin-top: 10px;
}

.icon-item-list{
  margin: 35px 0;
}

.icon-item{
  height: 60px;
}

.icon-item-image{
  width: 50px;
  height: 50px;
}

.icon-item-text{
  font-size: 20px;
}

.icon-item-number{
  font-size: 30px;
  margin: 10px 0;
  padding: 0;
}

.work-row{
  margin: 60px 0;
}

.work-item{
  position: relative;
  width: 150px;
  height: 60px;
  margin: 0 40px;
  cursor: pointer;

}

.work-item-image{
  position: absolute;
  width: 50px;
  height: 50px;
  top: 5px;
  left: 0;
}

.work-item-text{
  position: absolute;
  top: 10px;
  left: 50px;
  font-size: 15px;
  width: 100px;

}

.work-item-info{
  position: absolute;
  top: 30px;
  font-size: 10px;
  width: 100px;
}

.workflow{
  min-height: 400px;
}

.little-divider{
  margin: 10px 0;
}

.task-flow-list .task-flow {
  margin: 2px 2px;
}
</style>