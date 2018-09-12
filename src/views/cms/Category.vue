<template>
  <el-row>
    <el-col :span="8">
      <el-card shadow="never" class="card">
        <el-tree
          :props="columns"
          node-key="id"
          ref="tree"
          @node-click="onNodeClick"
          :load="load"
          lazy
          :default-expand-all="true"
          v-if="show"
          :expand-on-click-node="false"
          highlight-current>
            <span class="custom-tree-node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span>
              <el-button
                type="text"
                size="mini"
                @click.stop="() => addChild(node, data)">
                <i class="el-icon-plus"></i>
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click.stop="() => remove(node, data)">
                <i class="el-icon-delete"></i>
              </el-button>
            </span>
          </span>
        </el-tree>
      </el-card>
    </el-col>
    <el-col :span="14">
      <el-card shadow="never" class="card right-card">
        <el-form :model="editForm" :rules="rules" ref="editForm" label-width="80px">
          <el-form-item label="父">
            <el-input v-model="editForm.parentName" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="名称" prop="name">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>
          <el-form-item label="代码">
            <el-input v-model="editForm.code"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="save()" :loading="editLoading">保存</el-button>
            <el-button type="success" @click="newRoot">新增分类</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    name: 'Category',
    data () {
      return {
        columns: {
          label: 'name',
          id: 'id'
        },
        editForm: {
          id: '',
          name: '',
          code: '',
          position: '',
          pid: '',
          parentName: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          code: [
            { required: true, message: '请输入代码', trigger: 'blur' }
          ]
        },
        editLoading: false,
        treeData: [],
        currentNode: null,
        show: true
      }
    },
    methods: {
      onNodeClick (data, node) {
        const parentName = node.parent.data && node.parent.data.name
        Object.assign(this.editForm, data, { parentName: parentName })
      },
      newRoot () {
        this.editForm = {
          id: '',
          name: '',
          code: '',
          pid: '',
          position: '',
          parentName: '根节点'
        }
      },
      save () {
        this.$refs['editForm'].validate((valid) => {
          if (valid) {
            this.editLoading = true
            this.$api.cate.save(this.editForm).then(() => {
              this.editLoading = false
              this.reload()
              this.$message.success('保存成功')
            }).catch(e => {
              this.editLoading = false
              this.$alert(e.message)
            })
          } else {
            return false
          }
        })
      },
      load (node, resolve) {
        let pid = ''
        if (node.data) {
          pid = node.data.id
        }
        this.$api.cate.getList(pid).then(data => {
          resolve(data)
        })
      },
      reload () {
        this.show = false
        this.$nextTick(() => {
          this.show = true
        })
      },
      remove (node, data) {
        this.$confirm('确定要删除吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.$api.cate.remove([data.id]).then(() => {
            this.$refs.tree.remove(node, data)
            this.$message.success('删除成功')
          }).catch(e => {
            this.$alert(e.message)
          })
        }).catch(() => {})
      },
      addChild (node, data) {
        let position = data.childNum && !isNaN(data.childNum) ? data.childNum + 1 : 1
        this.editForm = {
          id: '',
          name: '',
          code: '',
          position: position,
          pid: data.id,
          parentName: data.name
        }
        this.currentNode = node
      }
    },
    created: function () {
    }
  }
</script>

<style>
  .card {
    min-height: 550px;
  }

  .right-card {
    margin-left: 10px;
  }
</style>
