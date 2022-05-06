<template>
  <div class="breadcrumb">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item v-for="bread in getBreadList()" :key="bread.title" :to="bread.path">{{bread.title}}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup>
import {useRoute,} from "vue-router";
import {watch} from "vue";

const route = useRoute()

watch(
    ()=> route,
    getBreadList
)

function getBreadList() {
  const breadList= route.matched.map(matched=>{
    return {
      title: matched.meta.title,
      path: {
        path: matched.path
      }
    }
  }).filter(bread=>bread.title)
  return breadList
}

</script>

<style scoped>
.breadcrumb{
  padding-bottom: 20px;
}
</style>