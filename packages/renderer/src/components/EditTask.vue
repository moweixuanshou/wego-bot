<template>
  <div>
    <el-row>
      <el-col :span="4">
        <el-card class="task-aside">
          <el-scrollbar height="800px">
            <div class="aside-title">
              <span>任务列表</span>
            </div>
            <el-divider></el-divider>
            <template v-for="(task,index) in singleTask">
              <div v-if="task.name !== 'Header'" draggable="true" @dragstart="dragstart($event, task)"
                   :ref="el => {if(el) tasksRef[task.name]=el}">
                <TaskCard :task="task"></TaskCard>
              </div>
            </template>
            <div class="aside-title">
              <span>触发器任务</span>
            </div>
            <el-divider></el-divider>
            <template v-for="(task,index) in triggerTask">
              <div v-if="task.name !== 'Header'" draggable="true" @dragstart="dragstart($event, task)"
                   :ref="el => {if(el) tasksRef[task.name]=el}">
                <TaskCard :task="task"></TaskCard>
              </div>
            </template>
          </el-scrollbar>
        </el-card>
      </el-col>
      <el-col :span="20">
        <div class="edit-menu-box">
          <div class="edit-menu">
            <el-tooltip placement="bottom-start" content="新建" :show-after="1000">
              <el-icon class="menu-icon" :size="20" >
                <DocumentAdd></DocumentAdd>
              </el-icon>
            </el-tooltip>
            <el-tooltip placement="bottom-start" content="使用模板" :show-after="1000">
              <el-icon class="menu-icon" :size="20" @click="handleTaskFlowTemplateUse">
                <Tickets></Tickets>
              </el-icon>
            </el-tooltip>
            <el-tooltip placement="bottom-start" content="编辑" :show-after="1000">
              <el-icon class="menu-icon" :size="20" @click="handleTaskFlowEdit">
                <Edit></Edit>
              </el-icon>
            </el-tooltip>
            <el-tooltip placement="bottom-start" content="保存为模板" :show-after="1000">
              <el-icon class="menu-icon" :size="20" @click="handleTaskFlowTemplateSaved">
                <DocumentChecked></DocumentChecked>
              </el-icon>
            </el-tooltip>
            <el-tooltip placement="bottom-start" content="保存并运行" :show-after="1000">
              <el-icon class="menu-icon" :size="20" @click="handleSaveTaskFlow">
                <VideoPlay></VideoPlay>
              </el-icon>
            </el-tooltip>
            <el-divider class="icon-divider" direction="vertical"></el-divider>
            <el-tooltip placement="bottom-start" content="撤销" :show-after="1000">
              <el-icon class="menu-icon" :size="20" >
                <el-image class="image-icon" :src="Undo"></el-image>
              </el-icon>
            </el-tooltip>
            <el-tooltip placement="bottom-start" content="重做" :show-after="1000">
              <el-icon class="menu-icon" :size="20" >
                <el-image class="image-icon" :src="Redo"></el-image>
              </el-icon>
            </el-tooltip>
            <el-divider class="icon-divider" direction="vertical"></el-divider>
            <el-tooltip placement="bottom-start" content="放大" :show-after="1000">
              <el-icon class="menu-icon" :size="20" >
                <ZoomIn></ZoomIn>
              </el-icon>
            </el-tooltip>
            <el-tooltip placement="bottom-start" content="缩小" :show-after="1000">
              <el-icon class="menu-icon" :size="20" >
                <ZoomOut></ZoomOut>
              </el-icon>
            </el-tooltip>
            <el-tooltip placement="bottom-start" content="美化" :show-after="1000">
              <el-icon class="menu-icon" :size="20" @click="handleBeautify">
                <el-image class="image-icon" :src="Beautify" ></el-image>
              </el-icon>
            </el-tooltip>
            <el-divider class="icon-divider" direction="vertical"></el-divider>
            <el-tooltip placement="bottom-start" content="删除" :show-after="1000">
              <el-icon class="menu-icon" :size="20" >
                <Delete></Delete>
              </el-icon>
            </el-tooltip>
            <el-tooltip placement="bottom-start" content="设置" :show-after="1000">
              <el-icon class="menu-icon" :size="20" >
                <Tools></Tools>
              </el-icon>
            </el-tooltip>
          </div>
        </div>
        <el-divider class="menu-divider"></el-divider>
        <div style="position: relative" @dragover="dragover">
          <div id="mountGraph"></div>
          <span class="task-flow-title">{{taskFlow.title}}</span>
        </div>
      </el-col>
    </el-row>
  </div>
  <el-drawer v-model="editTaskDrawer" direction="rtl" :before-close="handleClose">
    <template #title>
      <h4>{{ editTask.name }} - {{ editTask.id }}</h4>
    </template>
    <template #default>
      <div>
        <el-form :model="editTask" label-width="120px">
          <el-form-item label="名称">
            <el-input v-model="editTask.title" placeholder="标题"></el-input>
          </el-form-item>
          <template v-if="editTask.taskType===1">
            <el-form-item label="频率">
              <el-select v-model="editTask.frequency" placeholder="执行频率">
                <el-option
                    v-for="value in editTask.frequencyVerify"
                    :key="value"
                    :label="frequencyOptions[value]"
                    :value="value"/>
              </el-select>
            </el-form-item>
          </template>
          <template v-if="editTask.name==='Header'">
            <el-form-item v-for="(data,key) in editTask.inputParaVerify" :label="data.label">
              <el-select v-model="tagsSelected" multiple collapse-tags>
                <el-option v-for="v in contactTags" :label="v" :value="v"></el-option>
              </el-select>
            </el-form-item>
          </template>
          <template v-else-if="editTask.inputParaVerify && editTask.inputParaVerify!=={}">
            <el-form-item v-for="(data,key) in editTask.inputParaVerify" :label="data.label">
              <el-select v-model="editTask.inputPara[key]" v-if="data.dataPool">
                <template v-if="dataPool[editTask.lastTask]">
                  <el-option
                      v-for="(v,k) in dataPool[editTask.lastTask]"
                      :label="k"
                      :value="k"
                  ></el-option>
                </template>
              </el-select>
              <el-input v-else v-model="editTask.inputPara[key]"></el-input>
            </el-form-item>
          </template>
        </el-form>
      </div>
    </template>
  </el-drawer>
  <el-drawer v-model="editTaskFlowDrawer" direction="rtl" :before-close="handleTaskFlowClose">
    <template #title>
      <h4>任务流编辑</h4>
    </template>
    <el-form :model="taskFlow" label-width="120px">
      <el-form-item label="任务名">
        <el-input v-model="taskFlow.title"></el-input>
      </el-form-item>
    </el-form>
  </el-drawer>
  <el-drawer v-model="editTaskFlowTemplateDrawer" direction="rtl" :before-close="handleTaskFlowTemplateClose">
    <template #title>
      <h4>使用模板</h4>
    </template>
    <el-form :model="store.getters.taskFlowTemplate" label-width="120px">
      <template v-for="t in store.getters.taskFlowTemplate">
        <el-form-item :label="t.title">
          <el-button @click="handleTaskFlowTemplateClick(t)">使用</el-button>
          <el-button @click="handleTaskFlowTemplateDelete(t)">删除</el-button>
        </el-form-item>
      </template>
    </el-form>
  </el-drawer>
</template>
<script setup>
import {computed, onMounted, reactive, ref, shallowRef, watch} from "vue";
import TaskCard from "../common/TaskCard.vue"
import {getUuiD} from "../ts/util";
import G6 from "@antv/g6"
import {useStore} from 'vuex'
import {EditTask, TaskFlow} from "../ts/Tasks";
import {debounce} from '../ts/common.js'
import {DocumentChecked, VideoPlay,} from '@element-plus/icons-vue'
import Undo from '/images/undo.png'
import Redo from '/images/redo.png'
import Beautify from '/images/beautify.png'
// import  from '../ts/g6node.js'

const store = useStore()

const tasksData = store.getters.tasks
const singleTask = store.getters.singleTask
const triggerTask = store.getters.triggerTask
const headerData = new EditTask({
  x: 120,
  y: 300,
  ...tasksData.find(task=>task.name==='Header')
})

// const taskFlow = reactive([headerData])
const taskFlow = reactive(new TaskFlow())
taskFlow.id = getUuiD(8)
let graph
const tasksRef = ref([])
let dropTask = null
const editTaskDrawer = ref(false)
const editTaskFlowDrawer = ref(false)
const frequencyOptions = ['一次性', '无限循环']
const editTask = ref(headerData)
const tagsSelected = ref([])

const editTaskFlowTemplateDrawer = ref(false)

function dragstart(event, task) {
  event.dataTransfer.setData('task', JSON.stringify(task));
  event.dataTransfer.setDragImage(tasksRef.value[task.name], 0, 0);
  dropTask = task
}

function dragover(e) {
  e.preventDefault();
}

function drop(e) {
  addNode(e)
}

function addNode(e) {
  if (!dropTask) return

  const id = getUuiD(8)
  let inputPara = {}
  for(let key in dropTask.inputParaVerify){
    inputPara[key] = ''
  }
  const task = new EditTask({
    ...dropTask,
    id: id, // String，该节点存在则必须，节点的唯一标识
    x: e.x, // Number，可选，节点位置的 x 值
    y: e.y, // Number，可选，节点位置的 y 值
    frequency: 0,
    inputPara: inputPara,
    title: 'unTitled',
  })

  taskFlow.addTask(task)
  dropTask = null
}


function handleClose(done){
  const findNode = graph.findById(editTask.value.id)
  if(findNode){
    findNode.update(editTask.value)
    findNode.refresh()
  }
  if(editTask.value.id === 'header'){
    editTask.value.inputPara['contacts'] = store.state.contact.filter(c=>{
      for(let t of c.tags){
        if(tagsSelected.value.includes(t)){
          return true
        }
      }
      return false
    }).map(c=>c.id)
  }
  done()
}

function handleTaskFlowEdit(){
  editTaskFlowDrawer.value = true
}

function handleTaskFlowClose(){
  editTaskFlowDrawer.value = false
}

function handleTaskFlowTemplateUse(){
  editTaskFlowTemplateDrawer.value = true
}

function handleTaskFlowTemplateClose(){
  editTaskFlowTemplateDrawer.value = false
}

function handleTaskFlowTemplateClick(newTaskFlow){
  const tasks = taskFlow.tasks
  Object.assign(taskFlow,newTaskFlow)
  taskFlow.id = getUuiD(8)
  taskFlow.tasks = tasks
  for(let task of taskFlow.tasks){
    taskFlow.removeTask(task.id)
    graph.removeItem(task.id)
  }
  for(let task of newTaskFlow.tasks){
    const t = new EditTask({
      ...task,
    })
    // t.id=getUuiD(8)
    taskFlow.addTask(t)
  }
}

function handleTaskFlowTemplateDelete(dtf){
  store.dispatch('taskFlowTemplateStatus',{taskFlowTemplate:dtf,flag:false})
}

function handleTaskFlowTemplateSaved(){
  store.dispatch('taskFlowTemplateStatus',{taskFlowTemplate:taskFlow,flag:true})
}

function handleSaveTaskFlow() {
  const data = {
    id: taskFlow.id,
    title: taskFlow.title,
    tasks:[]
  }
  let task = taskFlow.findTask('header')
  while(task){
    const t = {}
    for(let key of ['id','name','title','nextTask','lastTask','frequency','taskType','inputPara']){
      t[key] = task[key]
    }
    // t['inputPara'] = JSON.stringify(task.inputPara)
    data.tasks.push(t)
    task = taskFlow.findTask(task.nextTask)
  }
  console.log(data)
  window.ipcRenderer.invoke('addTaskFlow',JSON.stringify(data))
}

function handleBeautify(){
  graph.layout()
}

const dataPool = computed(() => {
  const pool = {}
  const value = {}
  let task = taskFlow.tasks.find(t=>t.id==='header')
  while (task) {
    if (task.dataPoolVerify) {
      for (let key in task.dataPoolVerify) {
        value[task.id + '-' + key] = task.dataPoolVerify[key]
      }
    }
    pool[task.id] = Object.assign({}, value)
    task = taskFlow.findTask(task.nextTask)
  }
  return pool
})

const contactTags = computed(()=>{
  const tags = []
  for(let contacts of store.state.contact){
    for(let tag of contacts.tags){
      if(!tags.includes(tag)){
        tags.push(tag)
      }
    }
  }
  return tags
})

const taskList = store.state.tasks

onMounted(() => {
  let sourceAnchorIdx, targetAnchorIdx, removeItem, sourceId, targetId;

  graph = new G6.Graph({
    container: "mountGraph",
    height: 800,
    renderer: "canvas",
    fitView: true,
    fitViewPadding: true,
    fitCenter: true,
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
      begin: [120,300],
      rankdir: 'LR', // 可选，默认为图的中心
      align: 'DR', // 可选
      nodesep: 20, // 可选
      ranksep: 100, // 可选
      controlPoints: true, // 可选
    },
    modes: {
      // 支持的 behavior
      default: [
        'zoom-canvas',
        'drag-canvas',
        {
          type: 'drag-node',
          shouldBegin: e => !e.target.get('name').includes('anchor-point')
        },
        'click-select',
        {
          type: 'brush-select',
          includeEdges: false
        },
        {
          type: "create-edge",
          trigger: 'drag',
          shouldBegin: e => {
            // avoid beginning at other shapes on the node
            if (e.target && e.target.get('name') !== 'anchor-point-right') return false;
            if (e.target.get('links') >= 1) return false
            sourceAnchorIdx = e.target.get('anchorPointIdx');
            sourceId = e.item._cfg.id
            e.target.set('links', e.target.get('links') + 1); // cache the number of edge connected to this anchor-point circle
            return true;
          },
          shouldEnd: e => {
            // avoid ending at other shapes on the node
            if (e.target && e.target.get('name') !== 'anchor-point-left') return false;
            if (e.target.get('links') >= 1) return false
            targetId = e.item._cfg.id
            if (sourceId === targetId) return false
            if (e.target) {
              targetAnchorIdx = e.target.get('anchorPointIdx');
              e.target.set('links', e.target.get('links') + 1);  // cache the number of edge connected to this anchor-point circle
              return true;
            }
            targetAnchorIdx = undefined;
            return true;
          },
        }
      ],
    },
  })
  // graph.data(data)
  graph.render()

  graph.on('drop', drop)
  graph.on('aftercreateedge', (e) => {
    // update the sourceAnchor and targetAnchor for the newly added edge
    graph.updateItem(e.edge, {
      sourceAnchor: sourceAnchorIdx,
      targetAnchor: targetAnchorIdx
    })
    // const source = taskFlow.find(task => task.id === sourceId)
    // const target = taskFlow.find(task => task.id === targetId)
    const source = taskFlow.findTask(sourceId)
    const target = taskFlow.findTask(targetId)
    if (source && target) {
      source.nextTask = targetId
      target.lastTask = sourceId
    }
  });

  // after drag from the first node, the edge is created, update the sourceAnchor
  graph.on('afteradditem', e => {
    if (e.item && e.item.getType() === 'edge') {
      graph.updateItem(e.item, {
        sourceAnchor: sourceAnchorIdx
      });
    }
  })

// if create-edge is canceled before ending, update the 'links' on the anchor-point circles
  graph.on('afterremoveitem', e => {
    if (e.item && e.item.source && e.item.target) {
      const sourceNode = graph.findById(e.item.source);
      const targetNode = graph.findById(e.item.target);
      const {sourceAnchor, targetAnchor} = e.item;
      if (sourceNode && !isNaN(sourceAnchor)) {
        const sourceAnchorShape = sourceNode.getContainer().find(ele => (ele.get('name').includes('anchor-point') && ele.get('anchorPointIdx') === sourceAnchor));
        sourceAnchorShape.set('links', sourceAnchorShape.get('links') - 1);
      }
      if (targetNode && !isNaN(targetAnchor)) {
        const targetAnchorShape = targetNode.getContainer().find(ele => (ele.get('name').includes('anchor-point') && ele.get('anchorPointIdx') === targetAnchor));
        targetAnchorShape.set('links', targetAnchorShape.get('links') - 1);
      }
    }
  })

  graph.on('keydown', e => {
    if (e.keyCode === 46) {
      for (let key in removeItem) {
        for (let item of removeItem[key]) {
          if (item._cfg.id !== 'header') {
            taskFlow.removeTask(item._cfg.id)
            graph.removeItem(item)
          }
        }
      }
      removeItem = {}
    }
  })

// some listeners to control the state of nodes to show and hide anchor-point circles
  graph.on('node:mouseenter', e => {
    graph.setItemState(e.item, 'showAnchors', true);
    graph.setItemState(e.item, 'active', true);
  })
  graph.on('node:mouseleave', e => {
    graph.setItemState(e.item, 'showAnchors', false);
    graph.setItemState(e.item, 'active', false);
  })
  graph.on('node:dragenter', e => {
    graph.setItemState(e.item, 'showAnchors', true);
  })
  graph.on('node:dragleave', e => {
    graph.setItemState(e.item, 'showAnchors', false);
  })
  graph.on('node:dragstart', e => {
    graph.setItemState(e.item, 'showAnchors', true);
  })
  graph.on('node:dragout', e => {
    graph.setItemState(e.item, 'showAnchors', false);
  })
  graph.on('node:click', e => {
    const task = taskFlow.findTask(e.item._cfg.id)
    if(task){
      editTask.value = task
      editTaskDrawer.value = true
    }
  })

  graph.on('nodeselectchange', (e) => {
    removeItem = e.selectedItems
  });
  taskFlow.addTask(headerData)
})

const debounceTaskFlow = debounce(()=>{
  for(let task of taskFlow.tasks){
    const findNode = graph.findById(task.id)
    if(findNode){
      // graph.updateItem(findNode,task.task)
    }else{
      graph.addItem('node',task)
    }
  }
},100, false)

watch(taskFlow.tasks,(taskList, preTaskList)=>{
  debounceTaskFlow()
})


</script>

<style scoped>
.canvas-panel {
  width: 100%;
  height: 100%;
}

.task-aside {
  height: 98%;
}

.task-aside .aside-title {
  display: flex;
  justify-content: start;
}

.drag {
  height: 700px;
  min-width: 500px;
  width: 100%;
  display: block;
  position: relative;
}

#contextMenu {
  position: absolute;
  list-style-type: none;
  padding: 10px 8px;
  left: -150px;
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid #e2e2e2;
  border-radius: 4px;
  font-size: 12px;
  color: #545454;
}

.edit-menu-box{
  height: 30px;
  margin: 10px 0 10px 30px;
}

.edit-menu {

  /*background-color: #0488f3;*/
  position: absolute;
}

.edit-menu .menu-icon {
  line-height: 30px;
  margin: 2px 5px;
}

.edit-menu .menu-icon:hover {
  box-shadow: 0 0 1px 1px #3c4b54;
}

.edit-menu .image-icon {
  width: 20px;
  height: 20px;
}

.icon-divider {
  height: 20px;
  margin-bottom: 10px;
}

.menu-divider{
  padding: 0;
  margin: 5px 0;
}

.task-flow-title{
  position: absolute;
  top: 0;
  left: 5px;
  opacity: 0.5;
}
</style>