<template>
  <div class="header">
    <div class="header-left" @click="handleLogo">
      <el-image class="logo" :src="logo" fit="cover"></el-image>
      <span class="header-span">wego</span>
    </div>
    <div class="header-center"></div>
    <div class="header-right">
      <el-icon :size="24" class="right-icon"><setting></setting></el-icon>
      <el-icon :size="24" class="right-icon"><bell-filled></bell-filled></el-icon>
      <div class="login-avatar">
        <el-avatar :src="Avatar"></el-avatar>
        <span>末位选手</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import {BellFilled, ChatRound, HomeFilled, Setting, UserFilled} from "@element-plus/icons-vue";
import logo from "/images/logo.png"
import Avatar from "../../public/images/userAvatar.png"
import router from "../router";

function handleLogo(){
  router.push("/hello")
}

</script>

<style scoped>
.header{
  display: flex;
  height: 60px;
  padding: 0 !important;
  /*background-color: #00aaff;*/
}

.header .header-left{
  height: 60px;
  flex: 0 0 150px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.header .header-center{
  flex: 1 1 auto;
}

.header .header-right{
  flex: 0 0 300px;
  display: flex;
  align-items: center;
  justify-content: right;
}

.header .logo{
  width: 50px;
  height: 50px;
  margin:5px 10px;
}

.header-left .header-span{
  display: inline-block;
  line-height: 50px;
  text-align: center;
  height: 50px;
  font-size: 44px;
}

.header-right .right-icon{
  margin: 0 15px;
}

.header-right .login-avatar{
  width: 150px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}
</style>