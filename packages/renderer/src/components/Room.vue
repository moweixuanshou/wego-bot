<template>
  <div>
    <el-table :data="filterRoomData">
      <el-table-column label="room_id" prop="id"></el-table-column>
      <el-table-column label="群名" prop="topic"></el-table-column>
      <el-table-column align="right">
        <template #header>
          <el-input v-model="search" size="small" placeholder="Type to search" />
        </template>
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
          >Edit</el-button
          >
          <el-button
              size="small"
              @click="handleTags(scope.$index, scope.row)"
          >Tags</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import {useStore} from "vuex";
import {computed, ref} from "vue";

const store = useStore()
const roomData = store.getters.room
const search = ref('')
const filterRoomData = computed(()=>{
  const s = search.value.toLowerCase()
  return roomData.filter(data => !s ||
  data.id.toLowerCase().includes(s) ||
  data.topic.toLowerCase().includes(s))
})

function handleEdit(){}

function handleTags() {

}
</script>

<style scoped>

</style>