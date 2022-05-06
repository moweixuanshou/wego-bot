<template>
  <el-menu class="aside-menu" :collaspa="true" :router="true"
           :background-color="'#15ce7a'" text-color="#fff"
           active-text-color="#ffd04b" :default-active="$route.path">
    <el-menu-item index="/home" :router="{path: '/home'}">
      <el-icon><House></House></el-icon>
      <template #title>主页</template>
    </el-menu-item>
    <el-menu-item index="/contact" :router="{path: '/contact'}">
      <el-icon><Avatar></Avatar></el-icon>
      <template #title>好友管理</template>
    </el-menu-item>
    <el-menu-item index="/room">
      <el-icon><chat-round></chat-round></el-icon>
      <template #title>群组管理</template>
    </el-menu-item>
    <el-sub-menu index="/task">
      <template #title>
        <el-icon><list></list></el-icon>
        <span>任务流</span>
      </template>
      <el-menu-item index="/task">
        <el-icon><list></list></el-icon>
        <template #title>任务流管理</template>
      </el-menu-item>
      <el-menu-item index="/edit">
        <el-icon><edit></edit></el-icon>
        <template #title>编辑任务流</template>
      </el-menu-item>
    </el-sub-menu>
    <el-menu-item index="/setting">
      <el-icon><setting></setting></el-icon>
      <template #title>设置</template>
    </el-menu-item>
  </el-menu>
</template>

<script setup>
import {BellFilled, ChatRound, Edit, HomeFilled, Setting, UserFilled, House, Avatar} from "@element-plus/icons-vue";

</script>

<style scoped>
.aside{
}

.aside .aside-menu{
  height: 100%;
}
</style>