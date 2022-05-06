<template>
  <div>
    <div class="graph-container">
      <div id="mountGraph"></div>
      <div class="graph-fresh">
        <el-tooltip placement="bottom-start" content="刷新" :show-after="1000">
          <el-icon class="menu-icon" :size="20" @click="handleFresh">
            <Refresh></Refresh>
          </el-icon>
        </el-tooltip>
      </div>
    </div>
    <el-divider></el-divider>
    <el-scrollbar height="500px">
      <div class="task-flow-list">
        <TaskFlowCard class="task-flow" v-for="taskFlow in taskFlowList"
                      :task-flow="taskFlow" @viewTaskFlow="handleView"
                      @startTaskFlow="handleStart" @deleteTaskFlow="handleDelete"
                      @stopTaskFlow="handleStop"></TaskFlowCard>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup>

import store from "../store";
import TaskFlowCard from "../common/TaskFlowCard.vue";
import {computed, onMounted, ref, toRaw, watch} from "vue";
import G6 from "@antv/g6";
import {getUuiD} from "../ts/util";
import {TaskFlow} from "../ts/Tasks";
import {ElMessage} from "element-plus";
import {Refresh} from "@element-plus/icons-vue";

const taskFlowList = ref(initializeTaskFlow())


let graph;
let currentTaskFlowId = ''

async function handleView(id) {
  // console.log(taskFlowList.value)
  // initializeGraph(id)
  currentTaskFlowId = id
  await handleFresh()
}

async function handleStart(id) {
  const res = await window.ipcRenderer.invoke('startTaskFlow', id)
  resMessage(res)
  currentTaskFlowId = id

  await handleFresh()
}

async function handleStop(id) {
  const res = await window.ipcRenderer.invoke('stopTaskFlow', id)
  resMessage(res)
  currentTaskFlowId = id

  await handleFresh()

}

async function handleDelete(id) {
  const res = await window.ipcRenderer.invoke('deleteTaskFlow', id)
  console.log(res)
  resMessage(res)
  await getAllTaskFlow()
}

async function getAllTaskFlow() {
  const taskFlow = JSON.parse(await window.ipcRenderer.invoke('getAllTaskFlow'))
  console.log(taskFlow)
  await store.dispatch('taskFlowStatus', {taskFlow}).then(() => {
    taskFlowList.value = initializeTaskFlow()
    if (taskFlowList.value.length > 0 && currentTaskFlowId === '') {
      initializeGraph(taskFlowList.value[0].id)
    }
  })
}

async function handleFresh() {
  // console.log(currentTaskFlowId)
  const newTaskFlow = JSON.parse(await window.ipcRenderer.invoke('getTaskFlow',currentTaskFlowId))
  const taskFlow = taskFlowList.value.find(t=>t.id===currentTaskFlowId)
  Object.assign(taskFlow,newTaskFlow)
  initializeGraph(currentTaskFlowId)
}

function initializeTaskFlow() {
  return store.state.taskFlow.map(t => {
    const taskFlow = new TaskFlow()
    Object.assign(taskFlow,t)
    return taskFlow
  })
}

function initializeGraph(id) {
  const taskFlow = taskFlowList.value.find(t => t.id === id)
  const data = {
    nodes: taskFlow.tasks.map(t => {
      return {
        id: t.id,
        ...t
      }
    }),
    edges: getEdges(taskFlow)
  }
  // console.log(data)
  graph.data(data)
  graph.render()
  // currentTaskFlowId = id
}

function resMessage(res) {
  if (res && res.code === '100') {
    ElMessage({
      message: res.msg,
      type: 'success',
    })
  } else if (res && res.code === '101') {
    ElMessage({
      message: res.msg,
      type: 'error'
    })
  } else {
    ElMessage({
      message: '操作失败',
      type: 'error',
    })
  }
}

function getEdges(taskFlow) {
  const edges = []
  let task = taskFlow.findTask('header')
  while (task) {
    const nextTask = taskFlow.findTask(task.nextTask)
    if (nextTask) {
      edges.push({
        id: getUuiD(8),
        source: task.id,
        target: nextTask.id,
        sourceAnchor: 1,
        targetAnchor: 0,
      })
    }
    task = nextTask
  }
  return edges
}

watch(() => store.state.taskFlow, () => {
  console.log('watch')
  taskFlowList.value = initializeTaskFlow()
})

onMounted(() => {
  const tooltip = new G6.Tooltip({
    offsetX: 10,
    offsetY: 20,
    getContent(e) {
      const outDiv = document.createElement('div');
      const model = e.item.getModel()
      let statusText = '初始化'
      switch (model.status) {
        case 0:
          statusText = '初始化';
          break;
        case 1:
          statusText = '开始';
          break;
        case 2:
          statusText = '终止';
          break;
        case 3:
          statusText = '结束';
          break
      }

      let frequencyText = ''
      switch (model.frequency) {
        case 0:
          frequencyText = '一次性';
          break;
        case 1:
          frequencyText = '无限';
          break;
        case 2:
          frequencyText = '定时';
          break;
        case 3:
          frequencyText = '间隔';
          break
      }

      // console.log('model', model)
      outDiv.style.width = '180px';
      let innerHTML = `<span>${model.title || model.id}</span><br>
      <span>状态：${statusText} ${frequencyText}</span>`
      for(let para in model.inputPara){
        innerHTML += `<br><span>${para}: ${JSON.stringify(model.inputPara[para])}</span>`
      }
      for(let record of model.records){
        innerHTML += `<br><span>${record}</span>`
      }
      outDiv.innerHTML = innerHTML
      return outDiv
    },
    trigger: "click",
    itemTypes: ['node'],
  });

  graph = new G6.Graph({
    container: "mountGraph",
    height: 300,
    renderer: "canvas",
    // fitView: true,
    // fitViewPadding: true,
    // fitCenter: true,
    defaultNode: {
      type: "card-node",
      anchorPoints: [
        [0, 0.5],
        [1, 0.5]
      ]
    },
    defaultEdge: {
      type: 'cubic',
      style: {
        stroke: 'rgba(0,149,255,0.66)',
        endArrow: true
      }
    },
    nodeStateStyles: {
      active: {
        'shadowBlur': 5,
        'shadowColor': '#0655ff'
      },
      selected: {
        'shadowBlur': 5,
        'shadowColor': '#ff7606'
      }
    },
    layout: {
      type: 'dagre',
      begin: [0, 50],
      rankdir: 'LR', // 可选，默认为图的中心
      align: 'DR', // 可选
      nodesep: 20, // 可选
      ranksep: 80, // 可选
      controlPoints: true, // 可选
    },
    modes: {
      // 支持的 behavior
      default: [
        'zoom-canvas',
        'drag-canvas',
      ],
    },
    plugins: [tooltip]
  })
  if (taskFlowList.value.length > 0) {
    const taskFlow = taskFlowList.value[0]
    initializeGraph(taskFlow.id)
  }


})

</script>

<style scoped>
.graph-container {
  position: relative;
}

.graph-fresh {
  position: absolute;
  top: 20px;
  right: 20px;
}

.task-flow-list .task-flow {
  margin: 20px 10px;
}

.menu-icon{
  cursor: pointer;
}
</style>