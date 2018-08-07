<template>
  <el-card shadow="never">
    <el-row>
      <el-col :span="12">
        <el-card shadow="never" class="card">
          <div slot="header" class="clearfix">
            <span>字典类别</span>
          </div>
          <el-form :inline="true" :model="baseDictForm" :rules="rules" ref="baseDictForm">
            <el-form-item prop="name">
              <el-input class="input-small" v-model="baseDictForm.name" placeholder="名称" clearable></el-input>
            </el-form-item>
            <el-form-item prop="value">
              <el-input class="input-small" v-model="baseDictForm.value" placeholder="代码" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveBase">新增</el-button>
            </el-form-item>
          </el-form>
          <el-table
            :data="base.rows"
            v-loading="base.loading"
            highlight-current-row
            @row-click="baseRowClick"
            style="width: 100%">
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="value" label="代码"></el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChangeBase"
            @current-change="handleCurrentChangeBase"
            :current-page="base.page"
            :page-sizes="[10,20,50,100]"
            :page-size="base.size"
            :background="true"
            layout="total, sizes, prev, pager, next"
            :total="base.total">
          </el-pagination>
        </el-card>
      </el-col>

      <el-col :span="12">
        <el-card shadow="never" class="card right-card">
          <div slot="header" class="clearfix">
            <span>字典值</span>
          </div>
          <el-form :inline="true" :model="childDictForm" :rules="rules" ref="childDictForm">
            <el-form-item prop="name">
              <el-input class="input-small" v-model="childDictForm.name" placeholder="名称" clearable></el-input>
            </el-form-item>
            <el-form-item prop="value">
              <el-input class="input-small" v-model="childDictForm.value" placeholder="代码" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveChild">新增</el-button>
            </el-form-item>
          </el-form>
          <el-table
            :data="child.rows"
            v-loading="child.loading"
            style="width: 100%">
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="value" label="代码"></el-table-column>
            <el-table-column
              label="操作"
              width="200">
              <template slot-scope="scope">
                <el-button @click="removeChild(scope.row.id)" type="text">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            @size-change="handleSizeChangeChild"
            @current-change="handleCurrentChangeChild"
            :current-page="child.page"
            :page-sizes="[10,20,50,100]"
            :page-size="child.size"
            :background="true"
            layout="total, sizes, prev, pager, next"
            :total="child.total">
          </el-pagination>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
  export default {
    name: 'Dict',
    data () {
      let checkCode = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入代码'))
        }
        if (!/^[A-Za-z_]+$/.test(value)) {
          callback(new Error('代码由英文字母和下划线组成'))
        } else {
          callback()
        }
      }
      return {
        baseDictForm: {
          id: '',
          name: '',
          value: ''
        },
        childDictForm: {
          id: '',
          name: '',
          value: '',
          pid: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          value: [
            { required: true, validator: checkCode, trigger: 'blur' }
          ]
        },
        base: {
          rows: [],
          page: 1,
          size: 10,
          total: 0,
          loading: false
        },
        child: {
          rows: [],
          page: 1,
          size: 10,
          total: 0,
          loading: false
        }
      }
    },
    watch: {
      'baseDictForm.value' (newVal) {
        this.baseDictForm.value = newVal.toUpperCase()
      },
      'childDictForm.value' (newVal) {
        this.childDictForm.value = newVal.toUpperCase()
      }
    },
    methods: {
      searchBase () {
        this.base.loading = true
        const params = { page: this.base.page - 1, size: this.base.size }
        this.$api.dicts.getPage(params).then(result => {
          this.base.rows = result.rows
          this.base.total = result.total
          this.base.loading = false
        })
      },
      handleSizeChangeBase (size) {
        this.base.size = size
        this.searchBase()
      },
      handleCurrentChangeBase (page) {
        this.base.page = page
        this.searchBase()
      },
      saveBase () {
        this.$refs['baseDictForm'].validate((valid) => {
          if (valid) {
            this.$api.dicts.save(this.baseDictForm).then(() => {
              this.$message.success('保存成功')
              this.$refs.baseDictForm.resetFields()
              this.handleCurrentChangeBase(1)
            }).catch(e => {
              this.$alert(e.message)
              this.$refs.baseDictForm.resetFields()
            })
          } else {
            return false
          }
        })
      },
      baseRowClick (row, event, column) {
        this.$refs.childDictForm.resetFields()
        this.childDictForm.pid = row.id
        this.searchChild()
      },
      searchChild () {
        this.child.loading = true
        const params = {
          page: this.child.page - 1,
          size: this.child.size,
          pid: this.childDictForm.pid
        }
        this.$api.dicts.getPage(params).then(result => {
          this.child.rows = result.rows
          this.child.total = result.total
          this.child.loading = false
        })
      },
      handleSizeChangeChild (size) {
        this.child.size = size
        this.searchChild()
      },
      handleCurrentChangeChild (page) {
        this.child.page = page
        this.searchChild()
      },
      saveChild () {
        if (!this.childDictForm.pid) {
          this.$message.error('请先选择字典类型')
          return
        }
        this.$refs['childDictForm'].validate((valid) => {
          if (valid) {
            this.$api.dicts.save(this.childDictForm).then(() => {
              this.$message.success('保存成功')
              const pid = this.childDictForm.pid
              this.$refs.childDictForm.resetFields()
              this.childDictForm.pid = pid
              this.handleCurrentChangeChild(1)
            }).catch(e => {
              this.$alert(e.message)
            })
          } else {
            return false
          }
        })
      },
      removeChild (id) {
        this.$confirm('确定要删除吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.$api.dicts.remove([id]).then(() => {
            this.$message.success('删除成功')
            this.handleCurrentChangeChild(1)
          }).catch(e => {
            this.$alert(e.message)
          })
        }).catch(() => {})
      }
    },
    created: function () {
      this.searchBase()
    }
  }
</script>

<style>
  .input-small {
    width: 160px;
  }

  .card {
    min-height: 550px;
  }

  .right-card {
    margin-left: 10px;
  }
</style>
