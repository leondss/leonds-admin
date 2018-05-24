<template>
  <section class="content">
    <el-row>
      <el-col :span="24">
        <el-button type="primary" @click="onNew()">新增</el-button>
      </el-col>
    </el-row>
    <br>
    <br>
    <el-row>
      <el-col :span="8">
        <el-tree
          :props="columns"
          :data="treeData"
          node-key="id"
          ref="tree"
          @node-click="onNodeClick"
          default-expand-all
          :expand-on-click-node="false"
          highlight-current>
        </el-tree>
      </el-col>
      <el-col :span="8">
        <el-form :model="editForm" :rules="rules" ref="editForm" label-width="80px">
          <el-form-item label="父">
            <el-input v-model="editForm.parentName" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
          <el-form-item label="权限" prop="permission">
            <el-input v-model="editForm.permission"></el-input>
          </el-form-item>
          <el-form-item label="位置">
            <el-input-number v-model="editForm.position" controls-position="right" :min="1"></el-input-number>
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="editForm.link"></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-select v-model="editForm.type" placeholder="请选择">
              <el-option label="菜单" value="MENU"></el-option>
              <el-option label="按钮" value="BUTTON"></el-option>
              <el-option label="资源" value="RESOURCE"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="save()" :loading="editLoading">保存</el-button>
            <el-button type="primary" @click="remove()" :loading="editLoading" v-show="isShow()">删除</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </section>
</template>

<script>
  export default {
    name: 'Resource',
    data () {
      return {
        columns: {
          id: 'id',
          label: 'name'
        },
        editForm: {
          id: '',
          name: '',
          permission: '',
          position: 0,
          type: 'MENU',
          link: '',
          pid: '',
          parentName: ''
        },
        rules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'}
          ],
          permission: [
            {required: true, message: '请输入权限代码', trigger: 'blur'}
          ],
          type: [
            {required: true, message: '请选择类型', trigger: 'blur'}
          ]
        },
        editLoading: false,
        treeData: []
      }
    },
    methods: {
      onNodeClick (data, node) {
        const parentName = node.parent.data && node.parent.data.name
        Object.assign(this.editForm, data, {parentName: parentName})
      },
      onNew () {
        const node = this.$refs.tree.getCurrentNode()
        this.editForm = {
          type: 'MENU'
        }
        if (node) {
          this.editForm.parentName = node.name
          this.editForm.pid = node.id
        } else {
          this.editForm.parentName = '根节点'
        }
      },
      save () {
        this.$refs['editForm'].validate((valid) => {
          if (valid) {
            this.editLoading = true
            this.$api.resources.save(this.editForm).then(result => {
              this.editLoading = false
              if (result.data && result.data.status === 0) {
                this.$message.success('保存成功')
                this.load()
              } else {
                this.$alert(result.data.message)
              }
            })
          } else {
            return false
          }
        })
      },
      load () {
        this.$api.resources.getList().then(data => {
          this.treeData = data
        })
      },
      isShow () {
        return !!this.editForm.id
      },
      remove () {
        this.$confirm('确认删除吗？')
          .then(() => {
            this.$api.resources.remove([this.editForm.id]).then(result => {
              if (result.data && result.data.status === 0) {
                this.$message.success('删除成功')
                this.load()
                this.editForm = {
                  type: 'MENU'
                }
              } else {
                this.$alert(result.data.message)
              }
            })
          })
      }
    },
    created: function () {
      this.load()
    }
  }
</script>

<style>
</style>
