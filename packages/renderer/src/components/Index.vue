<template>
  <el-container class="container">
    <el-header>
      <Header></Header>
    </el-header>
    <el-container>
      <el-aside class="aside" width="200px">
        <AsideMenu></AsideMenu>
      </el-aside>
      <el-main class="main">
        <Breadcrumb ></Breadcrumb>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import Header from "../common/Header.vue";
import AsideMenu from "../common/AsideMenu.vue";
import Breadcrumb from "../common/Breadcrumb.vue"
import router from "../router"
import {onMounted} from "vue";

onMounted(()=>{
  router.push('/home')
})

</script>

<style scoped>
.container{
  height: 100vh;
  width: 100vw;
}


.main{
  /*background-color: aqua;*/
}
</style>