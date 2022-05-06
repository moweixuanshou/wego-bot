<template>
  <div>
    <el-table :data="filterContactData" class="contact-table">
      <el-table-column label="头像" >
        <template #default="scope">
          <div>
            <el-image v-if="filterContactData.avatar" class="avatar" :src="filterContactData.avatar" fit="fill"></el-image>
            <el-image v-else class="avatar" :src="avatarDefault" fit="fill"></el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="wx_id" prop="id"></el-table-column>
      <el-table-column label="昵称" prop="name"></el-table-column>
      <el-table-column label="备注" prop="alias"></el-table-column>
      <el-table-column label="标签">
        <template #default="scope">
          <div>
            <el-tag closable v-for="(tag,index) in scope.row.tags" :key="index" @close="tagClose(scope.row,index)">{{tag}}</el-tag>
          </div>
        </template>
      </el-table-column>
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
  <el-dialog v-model="contactDialogVisible" title="编辑联系人">
    <div class="dialog-main">
      <el-row>
        <el-col :span="4">Tags</el-col>
        <el-col :span="20">
          <el-row class="tag-edit-dialog" v-for="(tag,index) in editContact.tags" :key="index">
            <el-col :span="8">
              <div>
                <el-input v-if="editTagVisible===index" v-model="editTagValue" @change="tagEditChange(editContact,index)"></el-input>
                <span v-else>
                  <el-tag>
                    {{tag}}
                  </el-tag>
                </span>
              </div>
            </el-col>
            <el-col :span="2">
              <el-icon class="icon-button" :size="20" @click="tagEdit(editContact,tag,index)">
                <EditPen ></EditPen>
              </el-icon>
            </el-col>
            <el-col :span="2">
              <el-icon class="icon-button" :size="20" @click="tagDelete(editContact,index)">
                <SemiSelect ></SemiSelect>
              </el-icon>
            </el-col>
            <el-col :span="12"></el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-icon class="icon-button" :size="24" @click="tagAdd(editContact)">
                <Plus></Plus>
              </el-icon>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="contactDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleConfirm"
        >Confirm</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import {computed, onMounted, reactive, ref} from "vue";
import {useStore} from "vuex";
const store = useStore()
const contactData = store.getters.contact
import avatarDefault from "/images/avatar.png"
import {EditPen, Plus, SemiSelect} from "@element-plus/icons-vue";
import {Contact} from "../ts/contact";

const search = ref('')
const filterContactData = computed(()=> {
  const s = search.value.toLowerCase()
  return contactData.filter(data => !s ||
      data.name.toLowerCase().includes(s) ||
      data.alias.toLowerCase().includes(s) ||
      data.id.toLowerCase().includes(s)
  )
})

let contactDialogVisible = ref(false)
let editContact = ref(new Contact({id:"",name:"",alias:""}))
let editTagVisible = ref(-1)
let editTagValue = ref('')

function handleEdit(index,row) {
  contactDialogVisible.value = true
  editContact.value = row
  // console.log(row)
}

function tagEdit(contact,tag,index) {
  editTagVisible.value = index
  editTagValue.value = tag
}

function tagEditChange(contact,index) {
  editTagVisible.value = -1
  contact.tags[index] = editTagValue.value
  editTagValue.value = ''
}

function tagDelete(contact,index) {
  contact.tags.splice(index,1)
}

function tagAdd(contact){
  // console.log(contact.tags)
  contact.tags.push('untitled')
}

function handleConfirm(){
  contactDialogVisible.value = false
  editContact.value.tags = [...new Set(editContact.value.tags)]
}

function handleTags(index,contact) {

}

function tagClose(contact, index) {
  contact.tags.splice(index,1)
}

onMounted(()=>{
})

</script>

<style scoped>

.contact-table .avatar{
  height: 20px;
  width: 20px
}

.tag-edit-dialog{
  margin: 10px 10px;
}

.icon-button{
  size: 20px !important;
}


</style>