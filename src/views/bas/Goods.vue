<template>
  <el-card shadow="never">
    <el-row>
      <el-col :span="24">
        <el-form :inline="true" :model="searchForm">
          <el-form-item label="关键字">
            <el-input v-model="searchForm.text" clearable placeholder="名称、条形码"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" clearable placeholder="请选择">
              <el-option label="全部" value="0"></el-option>
              <el-option label="新增" value="1"></el-option>
              <el-option label="已上架" value="2"></el-option>
              <el-option label="已下架" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分类">
            <el-select v-model="searchForm.categoryId" clearable value-key="value" placeholder="请选择">
              <el-option
                v-for="item in categories"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="success" @click="edit()">新增</el-button>
            <el-button @click="publishGoods()">上架</el-button>
            <el-button @click="soldOutGoods()">下架</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table
          :data="rows"
          v-loading="loading"
          @selection-change="handleSelectionChange"
          style="width: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="goodsCode" label="条形码"></el-table-column>
          <el-table-column prop="goodsName" label="名称"></el-table-column>
          <el-table-column prop="categoryName" label="分类"></el-table-column>
          <el-table-column prop="qtyUnitName" label="数量单位">
            <template slot-scope="scope">
              {{ getQtyLabel(scope.row)}}
            </template>
          </el-table-column>
          <el-table-column prop="weightUnitName" label="重量单位">
            <template slot-scope="scope">
              {{ getWeightLabel(scope.row)}}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
              {{ getRowStatus(scope.row.status)}}
            </template>
          </el-table-column>
          <el-table-column width="140" prop="publishTime" label="上架时间"></el-table-column>
          <el-table-column width="140" prop="creationTime" label="创建时间"></el-table-column>
          <el-table-column width="80" prop="operator" label="操作人"></el-table-column>
          <el-table-column
            label="操作"
            width="120">
            <template slot-scope="scope">
              <el-button @click="remove(scope.row.id)" type="text">删除</el-button>
              <el-button @click="edit(scope.row.id)" type="text">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog
          title="商品编辑"
          :visible.sync="dialogVisible"
          width="40%">
          <el-form :model="editForm" :rules="rules" ref="editForm" label-width="80px">
            <el-form-item label="商品名称" prop="goodsName">
              <el-input v-model="editForm.goodsName"></el-input>
            </el-form-item>
            <el-form-item label="条形码" prop="goodsCode">
              <el-input v-model="editForm.goodsCode"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="categoryId">
              <el-select v-model="editForm.category" value-key="value" placeholder="请选择">
                <el-option
                  v-for="item in categories"
                  :key="item.value"
                  :label="item.name"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="数量单位" prop="qtyUnit">
              <el-select v-model="editForm.qtyUnit" value-key="value" placeholder="请选择">
                <el-option
                  v-for="item in qtyUnits"
                  :key="item.value"
                  :label="item.name"
                  :value="item">
                </el-option>
              </el-select>
              <el-checkbox v-model="editForm.qtyUnitLock" true-label="1" false-label="2">锁定</el-checkbox>
            </el-form-item>
            <el-form-item label="重量单位" prop="weightUnit">
              <el-select v-model="editForm.weightUnit" value-key="value" placeholder="请选择">
                <el-option
                  v-for="item in weightUnits"
                  :key="item.value"
                  :label="item.name"
                  :value="item">
                </el-option>
              </el-select>
              <el-checkbox v-model="editForm.weightUnitLock" true-label="1" false-label="2">锁定</el-checkbox>
            </el-form-item>
            <el-form-item>
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button type="primary" @click="save" :loading="editLoading">保存</el-button>
              <el-button type="primary" @click="publish" v-show="!currentId" :loading="publishLoading">直接上架
              </el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </el-col>
    </el-row>
    <el-row style="margin-top: 10px">
      <el-col :span="24">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[10,20,50,100]"
          :page-size="size"
          :background="true"
          layout="total, sizes, prev, pager, next"
          :total="total">
        </el-pagination>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
  import { DICT_TYPE, GOODS_STATUS } from '../../commons/contants'

  const baseFormData = {
    id: '',
    goodsName: '',
    goodsCode: '',
    category: '',
    qtyUnit: '',
    qtyUnitLock: '2',
    weightUnit: '',
    weightUnitLock: '2',
    status: GOODS_STATUS.NEW
  }

  export default {
    name: 'Goods',
    data () {
      return {
        searchForm: {
          text: '',
          status: '0',
          categoryId: ''
        },
        editForm: { ...baseFormData },
        rules: {
          goodsName: [
            { required: true, message: '请输入商品名称', trigger: 'blur' }
          ],
          category: [
            { required: true, message: '请选择分类', trigger: 'blur' }
          ],
          qtyUnit: [
            { required: true, message: '请选择数量单位', trigger: 'blur' }
          ],
          weightUnit: [
            { required: true, message: '请选择重量单位', trigger: 'blur' }
          ]
        },
        dialogVisible: false,
        rows: [],
        page: 1,
        size: 10,
        total: 0,
        editLoading: false,
        publishLoading: false,
        loading: false,
        categories: [],
        qtyUnits: [],
        weightUnits: [],
        selectRows: [],
        currentId: ''
      }
    },
    methods: {
      search () {
        this.loading = true
        const params = { page: this.page - 1, size: this.size }
        params.status = Number(this.searchForm.status)

        if (this.searchForm.text) {
          params.text = this.searchForm.text
        }
        if (this.searchForm.categoryId) {
          params.categoryId = this.searchForm.categoryId
        }
        this.$api.goods.getPage(params).then(result => {
          this.rows = result.rows
          this.total = result.total
          this.loading = false
        })
      },
      handleSizeChange (size) {
        this.size = size
        this.search()
      },
      handleCurrentChange (page) {
        this.page = page
        this.search()
      },
      edit (id) {
        this.dialogVisible = true
        this.currentId = id
        this.$nextTick(() => {
          this.$refs.editForm.resetFields()
          if (id) {
            this.$api.goods.get(id).then(data => {
              this.editForm = {
                id: data.id,
                goodsName: data.goodsName,
                category: {
                  name: data.categoryName,
                  value: data.categoryId
                },
                qtyUnit: {
                  name: data.qtyUnitName,
                  value: data.qtyUnit
                },
                qtyUnitLock: String(data.qtyUnitLock),
                weightUnit: {
                  name: data.weightUnitName,
                  value: data.weightUnit
                },
                weightUnitLock: String(data.weightUnitLock),
                status: data.status
              }
            })
          } else {
            this.editForm = { ...baseFormData }
          }
        })
      },
      save () {
        this.$refs['editForm'].validate((valid) => {
          if (valid) {
            this.editLoading = true
            const formData = this.getFormData()
            this.$api.goods.save(formData).then(() => {
              this.editLoading = false
              this.dialogVisible = false
              this.$message.success('保存成功')
              this.handleCurrentChange(1)
            }).catch(e => {
              this.editLoading = false
              this.$alert(e.message)
            })
          } else {
            return false
          }
        })
      },
      publish () {
        this.editForm.status = GOODS_STATUS.PUBLISH
        this.$refs['editForm'].validate((valid) => {
          if (valid) {
            this.publishLoading = true
            const formData = this.getFormData()
            formData.status = GOODS_STATUS.PUBLISH
            this.$api.goods.save(formData).then(() => {
              this.publishLoading = false
              this.dialogVisible = false
              this.$message.success('保存并上架成功')
              this.handleCurrentChange(1)
            }).catch(e => {
              this.publishLoading = false
              this.$alert(e.message)
            })
          } else {
            return false
          }
        })
      },
      remove (id) {
        this.$confirm('确定要删除吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.$api.goods.remove([id]).then(() => {
            this.$message.success('删除成功')
            this.handleCurrentChange(1)
          }).catch(e => {
            this.$alert(e.message)
          })
        }).catch(() => {})
      },
      getSelectData () {
        this.$api.dicts.getDictItems(DICT_TYPE.GOODS_CATEGORY).then(data => {
          this.categories = data
        })
        this.$api.dicts.getDictItems(DICT_TYPE.QTY_UNIT).then(data => {
          this.qtyUnits = data
        })
        this.$api.dicts.getDictItems(DICT_TYPE.WEIGHT_UNIT).then(data => {
          this.weightUnits = data
        })
      },
      getFormData () {
        return {
          id: this.editForm.id,
          goodsName: this.editForm.goodsName,
          goodsCode: this.editForm.goodsCode,
          categoryId: this.editForm.category.value,
          categoryName: this.editForm.category.name,
          qtyUnit: this.editForm.qtyUnit.value,
          qtyUnitName: this.editForm.qtyUnit.name,
          qtyUnitLock: Number(this.editForm.qtyUnitLock),
          weightUnit: this.editForm.weightUnit.value,
          weightUnitName: this.editForm.weightUnit.name,
          weightUnitLock: Number(this.editForm.weightUnitLock),
          status: this.editForm.status
        }
      },
      getRowStatus (status) {
        if (status === 1) {
          return '新增'
        } else if (status === 2) {
          return '已上架'
        } else if (status === 3) {
          return '已下架'
        }
      },
      getQtyLabel (row) {
        let lock = ''
        if (row.qtyUnitLock === 1) {
          lock = '锁定'
        } else {
          lock = '未锁定'
        }
        return `${row.qtyUnitName}(${lock})`
      },
      getWeightLabel (row) {
        let lock = ''
        if (row.weightUnitLock === 1) {
          lock = '锁定'
        } else {
          lock = '未锁定'
        }
        return `${row.weightUnitName}(${lock})`
      },
      handleSelectionChange (val) {
        this.selectRows = val
      },
      publishGoods () {
        if (this.selectRows.length === 0) {
          this.$message.error('请至少选择一条记录')
          return
        }
        const ids = this.selectRows.map(row => { return row.id })
        this.$api.goods.publish(ids).then(() => {
          this.$message.success('上架成功')
          this.handleCurrentChange(1)
        }).catch(e => {
          this.$alert(e.message)
        })
      },
      soldOutGoods () {
        if (this.selectRows.length === 0) {
          this.$message.error('请至少选择一条记录')
          return
        }
        const ids = this.selectRows.map(row => { return row.id })
        this.$api.goods.soldOut(ids).then(() => {
          this.$message.success('下架成功')
          this.handleCurrentChange(1)
        }).catch(e => {
          this.$alert(e.message)
        })
      }
    },
    created: function () {
      this.search()
      this.getSelectData()
    }
  }
</script>

<style>
</style>
