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
          <el-form-item label="权限">
            <el-input v-model="editForm.permission"></el-input>
          </el-form-item>
          <el-form-item label="服务地址">
            <el-input v-model="editForm.url"></el-input>
          </el-form-item>
          <el-form-item label="页面地址">
            <el-input v-model="editForm.path"></el-input>
          </el-form-item>
          <el-form-item label="组件">
            <el-input v-model="editForm.component"></el-input>
          </el-form-item>
          <el-form-item label="图标">
            <el-input v-model="editForm.icon"></el-input>
          </el-form-item>
          <el-form-item label="位置">
            <el-input-number v-model="editForm.position" controls-position="right" :min="1"></el-input-number>
          </el-form-item>
          <el-form-item label="类型" prop="type">
            <el-radio v-model="editForm.type" label="MENU" border size="medium">菜单</el-radio>
            <el-radio v-model="editForm.type" label="BUTTON" border size="medium">按钮</el-radio>
            <el-radio v-model="editForm.type" label="RESOURCE" border size="medium">资源</el-radio>
            <el-radio v-model="editForm.type" label="PERM_ROW" border size="medium">行权限</el-radio>
            <el-radio v-model="editForm.type" label="PERM_CELL" border size="medium">列权限</el-radio>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="save()" :loading="editLoading">保存</el-button>
            <el-button type="success" @click="newRoot">新增根节点</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
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
          position: 1,
          type: 'MENU',
          url: '',
          path: '',
          component: '',
          pid: '',
          parentName: '',
          icon: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请选择类型', trigger: 'blur' }
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
          permission: '',
          position: 1,
          type: 'MENU',
          url: '',
          path: '',
          component: '',
          pid: '',
          parentName: '根节点',
          icon: ''
        }
      },
      save () {
        this.$refs['editForm'].validate((valid) => {
          if (valid) {
            this.editLoading = true
            this.$api.resources.save(this.editForm).then((data) => {
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
        this.$api.resources.getTreeByPid(pid).then(data => {
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
          this.$api.resources.remove([data.id]).then(() => {
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
          permission: '',
          position: position,
          type: data.type,
          url: '',
          path: '',
          component: '',
          pid: data.id,
          parentName: data.name,
          icon: ''
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
