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
          node-key="id"
          ref="tree"
          @node-click="onNodeClick"
          :load="load"
          lazy
          :expand-on-click-node="false"
          highlight-current>
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <el-button
                type="text"
                size="mini"
                @click="() => remove(node, data)">
                <i class="el-icon-delete"></i>
              </el-button>
            </span>
          </span>
        </el-tree>
      </el-col>
      <el-col :span="16">
        <el-form :model="editForm" :rules="rules" ref="editForm" label-width="80px">
          <el-form-item label="父">
            <el-input v-model="editForm.parentName" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
          <el-form-item label="权限">
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
          label: 'name',
          id: 'id'
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
      load (node, resolve) {
        console.log(node)
        let pid = ''
        if (node.data) {
          pid = node.data.id
        }
        this.$api.resources.getTreeByPid(pid).then(data => {
          resolve(data)
        })
      },
      remove (node, data) {
        this.$confirm('确定要删除吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.$api.resources.remove([data.id]).then(() => {
            this.$message.success('删除成功')
          }).catch(err => {
            this.$alert(err)
          })
        }).catch(() => {})
      }
    },
    created: function () {
    }
  }
</script>

<style>
</style>
