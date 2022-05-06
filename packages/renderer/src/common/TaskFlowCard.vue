<template>
  <div class="task-flow-card">
    <el-card shadow="hover">
      <el-row>
        <el-col :span="4">
          <div class="text-title">
            <span>{{ taskFlow.title }}</span>
          </div>
        </el-col>
        <el-col :span="4">
          <div class="text-title">
            <span>{{ taskFlow.id }}</span>
          </div>
        </el-col>
        <el-col :span="4">
          <div v-if="taskFlow.status===0">
            <el-icon class="menu-icon" :size="20">
              <el-image class="image-icon" :src="PendingIcon"></el-image>
            </el-icon>
            <span>初始化</span>
          </div>
          <div v-if="taskFlow.status===1">
            <el-icon class="menu-icon" :size="20">
              <el-image class="image-icon" :src="StartIcon"></el-image>
            </el-icon>
            <span>运行中</span>
          </div>
          <div v-if="taskFlow.status===2">
            <el-icon class="menu-icon" :size="20">
              <el-image class="image-icon" :src="StopIcon"></el-image>
            </el-icon>
            <span>终止</span>
          </div>
          <div v-if="taskFlow.status===3">
            <el-icon class="menu-icon" :size="20">
              <el-image class="image-icon" :src="FinishIcon"></el-image>
            </el-icon>
            <span>结束</span>
          </div>
        </el-col>
        <el-col :span="8"></el-col>
        <el-col :span="1">
          <el-tooltip placement="bottom-start" content="查看" :show-after="1000">
            <el-icon class="menu-icon" :size="20" @click='handleView'>
              <View></View>
            </el-icon>
          </el-tooltip>
        </el-col>
        <el-col :span="1">
          <el-tooltip placement="bottom-start" content="启动" :show-after="1000">
            <el-icon class="menu-icon" :size="20" @click="handleStart">
              <VideoPlay></VideoPlay>
            </el-icon>
          </el-tooltip>
        </el-col>
        <el-col :span="1">
          <el-tooltip placement="bottom-start" content="终止" :show-after="1000">
            <el-icon class="menu-icon" :size="20" @click="handleStop">
              <VideoPause></VideoPause>
            </el-icon>
          </el-tooltip>
        </el-col>
        <el-col :span="1">
          <el-tooltip placement="bottom-start" content="删除" :show-after="1000">
            <el-icon class="menu-icon" :size="20" @click="handleDelete">
              <Delete></Delete>
            </el-icon>
          </el-tooltip>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script setup>
import {defineProps, defineEmits} from "vue";
import {Delete, Remove, VideoPause, VideoPlay} from "@element-plus/icons-vue";
import StartIcon from '/images/start.png';
import PendingIcon from '/images/pending.png';
import FinishIcon from '/images/finish.png';
import StopIcon from '/images/stop.png';

const props = defineProps({
  taskFlow: {
    required: true,
    type: Object
  }
})

const emit = defineEmits(['viewTaskFlow', 'deleteTaskFlow', 'startTaskFlow', 'stopTaskFlow'])

function handleView() {
  emit('viewTaskFlow', props.taskFlow.id)
}

function handleStart() {
  emit('startTaskFlow', props.taskFlow.id)

}

function handleDelete() {
  emit('deleteTaskFlow', props.taskFlow.id)

}

function handleStop() {
  emit('stopTaskFlow', props.taskFlow.id)

}

</script>

<style scoped>
.task-flow-card .text-title{
  margin: 10px;
}

.task-flow-card .menu-icon {
  cursor: pointer;
  margin: 10px;
}

.task-flow-card .image-icon {
  width: 20px;
  height: 20px;
}
</style>