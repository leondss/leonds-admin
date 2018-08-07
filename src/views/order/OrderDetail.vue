<template>
  <el-card shadow="never" v-loading="loading">
    <el-row>
      <el-col :span="24">
        <el-button type="success" @click="addRow" style="margin-left: 10px" v-if="this.order.status === 1">添加商品
        </el-button>
        <el-button type="primary" @click="saveOrder" :loading="savedLoading" v-if="this.order.status === 1">保存
        </el-button>
        <el-button type="primary" @click="submitOrder" :loading="submitLoading" v-if="this.order.status === 1">提交报货
        </el-button>
      </el-col>
    </el-row>

    <el-card shadow="never" style="margin-bottom: 10px" v-if="!!this.order.id">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <el-row style="font-size: 12px">
        <el-col :span="6">
          <b>报货单号：</b> {{this.order.orderNo}}
        </el-col>
        <el-col :span="6">
          <b>报货日期：</b> {{this.order.submitTime}}
        </el-col>
        <el-col :span="6">
          <b>报货人：</b> {{this.order.operator}}
        </el-col>
        <el-col :span="6">
          <b>状态：</b> {{getRowStatus()}}
        </el-col>
      </el-row>
    </el-card>

    <el-card shadow="never" style="margin-bottom: 10px">
      <div slot="header" class="clearfix">
        <span>商品信息</span>
      </div>
      <el-table
        :data="order.details"
        max-height="450"
        style="width: 100%">
        <el-table-column type="index" width="20"></el-table-column>
        <el-table-column label="商品名称" width="300">
          <template slot-scope="scope">
            <div class="cell">{{scope.row.goodsName}}</div>
          </template>
        </el-table-column>
        <el-table-column label="报货数量" width="200" v-perm="'qty'">
          <template slot-scope="scope">
            <div v-if="orderStatus() === 1">
              <el-input v-model="scope.row.qty" class="wkl-input-mini"></el-input>
              <span v-if="scope.row.qtyUnitLock === 1">{{scope.row.qtyUnit.name}}</span>
              <el-select v-if="scope.row.qtyUnitLock === 2" v-model="scope.row.qtyUnit" class="wkl-select"
                         value-key="value" placeholder="单位">
                <el-option
                  v-for="item in qtyUnits"
                  :key="item.value"
                  :label="item.name"
                  :value="item">
                </el-option>
              </el-select>
            </div>
            <div v-if="orderStatus() > 1" class="cell">{{scope.row.qty}}/{{scope.row.qtyUnit.name}}</div>
          </template>
        </el-table-column>

        <el-table-column label="实收数量" v-if="hasPerm('qtyReal') && isShowQtyReal()">
          <template slot-scope="scope">
            <el-input v-if="orderStatus()=== 3 && scope.row.received === 1" v-model="scope.row.qtyReal"
                      class="wkl-input-mini"></el-input>
            <div class="cell" v-if="orderStatus() >= 3 && scope.row.received === 2">{{scope.row.qtyReal}}</div>
          </template>
        </el-table-column>

        <el-table-column label="重量" v-if="hasPerm('bhWeight') && isShowQtyReal()">
          <template slot-scope="scope">
            <el-input v-if="orderStatus()=== 3 && scope.row.received === 1" v-model="scope.row.weight"
                      class="wkl-input-mini"></el-input>
            <div class="cell" v-if="orderStatus() >= 3 && scope.row.received === 2">{{scope.row.weight}} {{scope.row.weightUnit.name}}</div>
            <span v-if="scope.row.weightUnitLock === 1">{{scope.row.weightUnit.name}}</span>
            <el-select v-if="scope.row.weightUnitLock === 2 && scope.row.received === 1" v-model="scope.row.weightUnit" class="wkl-select"
                       value-key="value" placeholder="单位">
              <el-option
                v-for="item in weightUnits"
                :key="item.value"
                :label="item.name"
                :value="item">
              </el-option>
            </el-select>
          </template>
        </el-table-column>

        <el-table-column label="实送数量" v-if="hasPerm('qtySend') && isShowQtyReal()">
          <template slot-scope="scope">
            <el-input v-if="orderStatus() === 3 && scope.row.delivery === 1" v-model="scope.row.qtySend"
                      class="wkl-input-mini"></el-input>
            <div class="cell" v-if="orderStatus() >= 3 && scope.row.delivery === 2">{{scope.row.qtySend}}</div>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status === 1" @click.native.prevent="deleteRow(scope.$index,scope.row.id)"
                       type="text">删除
            </el-button>
            <el-button v-if="hasPerm('qtyReal') && orderStatus() === 3 && scope.row.received === 1"
                       @click.native.prevent="confirmReceive(scope.row)"
                       type="text">确认收货
            </el-button>
            <el-button v-if="hasPerm('qtySend') && orderStatus() === 3 && scope.row.delivery === 1"
                       @click.native.prevent="confirmSend(scope.row.id,scope.row.qtySend)"
                       type="text">确认送达
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      title="选择商品"
      :visible.sync="goodsDialogVisible"
      width="70%">
      <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="goods.searchForm">
            <el-form-item label="关键字">
              <el-input v-model="goods.searchForm.text" clearable placeholder="名称、条形码"></el-input>
            </el-form-item>
            <el-form-item label="分类">
              <el-select v-model="goods.searchForm.categoryId" clearable value-key="value" placeholder="请选择">
                <el-option
                  v-for="item in categories"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchGoods">查询</el-button>
              <el-button type="success" @click="confirmSelect">确定</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table
            :data="goods.rows"
            v-loading="goods.loading"
            height="300"
            @selection-change="handleGoodsSelectionChange"
            style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="goodsNo" label="编号"></el-table-column>
            <el-table-column prop="goodsName" label="名称"></el-table-column>
            <el-table-column prop="categoryName" label="分类"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px">
        <el-col :span="24">
          <el-pagination
            @size-change="handleGoodsSizeChange"
            @current-change="handleGoodsCurrentChange"
            :current-page="goods.page"
            :page-sizes="[10,20,50,100]"
            :page-size="goods.size"
            :background="true"
            layout="total, sizes, prev, pager, next"
            :total="goods.total">
          </el-pagination>
        </el-col>
      </el-row>
    </el-dialog>

    <el-card shadow="never" style="margin-bottom: 10px">
      <div slot="header" class="clearfix">
        <span>备注</span>
      </div>
      <el-input type="textarea" v-model="order.remark" rows="4"></el-input>
    </el-card>

    <el-card shadow="never" style="margin-bottom: 10px">
      <div slot="header" class="clearfix">
        <span>修改日志</span>
      </div>
      <div v-for="row in orderLogs" class="text item">
        {{ getOrderDetail(row) }}
      </div>
    </el-card>
  </el-card>
</template>

<script>
  import { DICT_TYPE, GOODS_STATUS, ORDER_DETAIL_STATUS, ORDER_STATUS, WHETHER } from '../../commons/contants'

  export default {
    name: 'OrderDetail',
    data () {
      return {
        order: {
          id: null,
          remark: null,
          status: ORDER_STATUS.NEW,
          details: []
        },
        categories: [],
        qtyUnits: [],
        weightUnits: [],
        goodsDialogVisible: false,
        goods: {
          rows: [],
          loading: false,
          page: 1,
          size: 10,
          total: 0,
          searchForm: {
            text: '',
            categoryId: ''
          },
          selectRows: []
        },
        orderId: '',
        submitLoading: false,
        savedLoading: false,
        updateLoading: false,
        loading: false,
        orderLogs: []
      }
    },
    methods: {
      orderStatus () {
        return this.order.status
      },
      isShowQtyReal () {
        return this.order.status > 1
      },
      initRows () {
        if (this.orderId) {
          this.loading = true
          this.$api.orders.get(this.orderId).then(data => {
            Object.assign(this.order, data)
            this.loading = false
          })
          this.$api.orders.getLogs(this.orderId).then(data => {
            this.orderLogs = data
          })
        } else {
          this.order = {
            id: null,
            remark: null,
            status: ORDER_STATUS.NEW,
            details: []
          }
        }
      },
      getSelectData () {
        this.$api.dicts.getCategory().then(data => {
          this.categories = data
        })
        this.$api.dicts.getDictItems(DICT_TYPE.QTY_UNIT).then(data => {
          this.qtyUnits = data
        })
        this.$api.dicts.getDictItems(DICT_TYPE.WEIGHT_UNIT).then(data => {
          this.weightUnits = data
        })
      },
      handleGoodsSizeChange (size) {
        this.goods.size = size
        this.searchGoods()
      },
      handleGoodsCurrentChange (page) {
        this.goods.page = page
        this.searchGoods()
      },
      handleGoodsSelectionChange (val) {
        this.goods.selectRows = val
      },
      confirmSelect () {
        const rows = this.goods.selectRows
        if (rows.length === 0) {
          this.$message.error('请选择商品')
          return
        }
        rows.forEach(row => {
          const detail = {
            id: '',
            orderId: '',
            goodsId: row.id,
            goodsName: row.goodsName,
            qty: '',
            qtyReal: '',
            qtySend: '',
            weight: '',
            qtyUnit: {
              name: row.qtyUnitName,
              value: row.qtyUnit
            },
            qtyUnitLock: row.qtyUnitLock,
            weightUnitLock: row.weightUnitLock,
            status: ORDER_DETAIL_STATUS.NEW,
            received: WHETHER.N,
            delivery: WHETHER.N
          }
          this.order.details.push(Object.assign({}, detail))
        })
        this.goodsDialogVisible = false
      },
      searchGoods () {
        this.goods.loading = true
        const params = { page: this.goods.page - 1, size: this.goods.size }
        if (this.goods.searchForm.text) {
          params.text = this.goods.searchForm.text
        }
        if (this.goods.searchForm.categoryId) {
          params.categoryId = this.goods.searchForm.categoryId
        }
        params.status = GOODS_STATUS.PUBLISH

        const excludeIds = this.order.details.map(i => { return i.goodsId })

        if (excludeIds.length > 0) {
          params.excludeIds = excludeIds.join(',')
        }
        params.filterCategory = 'true'
        this.$api.goods.getPage(params).then(result => {
          this.goods.rows = result.rows
          this.goods.total = result.total
          this.goods.loading = false
        })
      },
      addRow () {
        this.goodsDialogVisible = true
        this.goods.searchForm.text = ''
        this.handleGoodsCurrentChange(1)
      },
      deleteRow (index, id) {
        this.$confirm('确定要删除吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.order.details.splice(index, 1)
          if (id) {
            this.$api.orders.removeDetail([id]).then(() => {
              this.$message.success('删除成功')
            }).catch(e => {
              this.$alert(e.message)
            })
          }
        }).catch(() => {})
      },
      validate () {
        const rows = this.order.details
        if (rows.length === 0) {
          this.$message.error('请至少添加一条商品')
          return
        }
        let error = ''
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i]
          let msg = ''
          if (!row.goodsName) {
            msg += '商品名称为空<br/>'
          }
          if (!row.qty) {
            msg += '报货数量为空<br/>'
          }
          if (msg) {
            error += `<span style="color: #000;">第<b>${i + 1}</b>行数据不完整：</span><br/><span style="color: red;">${msg}</span><br/>`
          }
        }
        if (error) {
          this.$message({
            dangerouslyUseHTMLString: true,
            message: error,
            type: 'error'
          })
          return false
        }
        return true
      },
      submitOrder () {
        if (this.validate()) {
          this.$confirm('提交报货后，信息不可修改，是否确定提交？', '提示', {
            type: 'warning'
          }).then(() => {
            this.submitLoading = true
            this.order.status = ORDER_STATUS.SUBMIT
            this.order.details.map(item => { item.status = ORDER_DETAIL_STATUS.SUBMIT })
            this.$api.orders.save(this.order).then((data) => {
              this.submitLoading = false
              this.$message.success('提交成功')
              this.orderId = data
              this.initRows()
            }).catch(e => {
              this.submitLoading = false
              this.$alert(e.message)
            })
          }).catch(() => {})
        }
      },
      saveOrder () {
        if (this.validate()) {
          this.savedLoading = true
          this.order.status = ORDER_STATUS.NEW
          this.$api.orders.save(this.order).then((data) => {
            this.savedLoading = false
            this.$message.success('保存成功')
            this.orderId = data
            this.initRows()
          }).catch(e => {
            this.savedLoading = false
            this.$alert(e.message)
          })
        }
      },
      getOrderDetail (row) {
        let result = `[${row.creationTime}][${row.operator}]: `
        if (row.type === 1) {
          result += `新增商品: ${row.oldValue}`
        } else if (row.type === 2) {
          result += `修改${row.sourceName || ''}的${row.fieldName}: ${row.oldValue ? row.oldValue : '空'} 修改为 ${row.newValue}`
        } else if (row.type === 3) {
          result += `删除商品: ${row.oldValue}`
        }
        return result
      },
      confirmReceive (row) {
        console.log(row)
        if (row.qtyReal === 0) {
          this.$message.error('实际收货数量不能为空')
          return
        }
        this.$confirm('确定收货吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.$api.orders.confirmReceive({
            detailId: row.id,
            qtyReal: row.qtyReal,
            weight: row.weight,
            weightUnit: row.weightUnit.value,
            weightUnitName: row.weightUnit.name
          }).then(() => {
            this.$message.success('收货成功')
            this.initRows()
          }).catch(e => {
            this.$alert(e.message)
          })
        }).catch(() => {})
      },
      confirmSend (id, qtySend) {
        if (qtySend === 0) {
          this.$message.error('实际送货数量不能为空')
          return
        }
        this.$confirm('确定送达吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.$api.orders.confirmSend(id, qtySend).then(() => {
            this.$message.success('操作成功')
            this.initRows()
          }).catch(e => {
            this.$alert(e.message)
          })
        }).catch(() => {})
      },
      getRowStatus () {
        const status = this.order.status
        if (status === 1) {
          return '暂存'
        } else if (status === 2) {
          return '已提交'
        } else if (status === 3) {
          return '采购已审核，配送中'
        } else if (status === 4) {
          return '已完成'
        }
      }
    },
    created: function () {

    },
    activated: function () {
      this.orderId = this.$route && this.$route.params.orderId
      this.getSelectData()
      this.initRows()
    }
  }
</script>

<style scoped>
  .wkl-input-mini {
    width: 60px;
    padding: 0;
    font-size: 12px;
    text-align: center;
  }

  .wkl-select {
    width: 78px;
  }

  .el-row {
    margin-bottom: 10px;
  }

  .text {
    font-size: 12px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both
  }
</style>
