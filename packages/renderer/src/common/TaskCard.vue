<template>
  <div class="task-card" ref="root">
    <el-tooltip placement="bottom-start" :content="task.description" :show-after="1000">
      <el-card shadow="hover">
        <div class="title">
          <span>{{ task.taskLabel }}</span>
        </div>
      </el-card>
    </el-tooltip>
  </div>
</template>

<script setup>
import {ref} from "vue";

const props = defineProps({
  task:Object,
})

const root = ref(null)
</script>

<style scoped>
.task-card{
  margin: 10px 5px;
  -webkit-user-select:none; /*webkit浏览器*/
  user-select:none;
}

.task-card :deep(.el-card__header){
  padding: 2px ;
}

.task-card .title{
  font-size: 14px;
}

.task-card .describe{
  font-size: 12px;
}
</style>