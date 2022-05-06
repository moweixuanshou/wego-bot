<template>
<div class="hello">
<!--  <el-image class="header-logo" :src="Logo" fit="cover"></el-image>-->
  <div class="center-pane">
      <div class="center-title" >
        <el-image class="title-logo" :src="Logo" fit="cover"></el-image>
        <span class="title-text">W e g o</span>
      </div>
    <div class="center-info">
      <span>wego是一个可以把你的微信变成机器人的应用！</span>
      <br>
      <br>
      <span>高度自由定制化的任务流编排！</span>
      <br>
      <br>
      <span>各式各样富有趣味的任务卡！</span>
      <br>
      <br>
      <span>随心所欲的世界！赶快加入吧！</span>
    </div>
    <div class="center-button">
      <el-button class="button" type="success" round size="large" @click="handleStart">开 始</el-button>
    </div>
  </div>
</div>
</template>

<script setup>

import store from "../store";
import router from "../router";
import Logo from "../../public/images/logo.png"
import {ElMessage} from "element-plus";

async function handleStart(){
  const status = await window.ipcRenderer.invoke('checkLogin')
  if(status){
    store.dispatch('scanStatus',{isScan:true}).then(()=>{
      router.push("/")
    })
  }else{
    ElMessage({
      type: "warning",
      message: '请先登录微信'
    })
  }
}

</script>

<style scoped>
.hello{
  position: relative;
  width: 100vw;
  height: 100vh;
  background: url("https://res.wx.qq.com/t/wx_fed/webwx/res/static/img/2zrdI1g.jpg") round;
}

.header-logo{
  position: absolute;
  top: 20px;
  left: 20px;
  height: 80px;
  width: 80px;
}

.center-pane{
  width: 600px;
  height: 500px;
  position: absolute;
  top:50%;
  left: 50%;
  transform: translate(-50%,-50%);
  /*border:1px blue solid;*/
}

.center-title{
  position: relative;
  height: 80px;
  margin: 40px 0;
}

.title-logo{
  width: 80px;
  height: 80px;
  position: absolute;
  left: 30%;
}

.title-text{
  font-size: 55px;
  color: #f3f0f0;
  font-family: "Times New Roman";
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-0%,-50%);
}

.center-info{
  color: #f3f0f0;
  font-size: 20px;
  font-family: "Times New Roman";
  margin: 40px 0;
}

.center-button .button{
  width: 150px;
  height: 40px;
  background-color: #15ce7a;
}
</style>