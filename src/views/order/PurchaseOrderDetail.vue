<template>
  <el-card shadow="never" v-loading="loading">
    <el-row>
      <el-col :span="18">
        <el-button type="primary" @click="submitOrder" :loading="submitLoading">保存</el-button>
        <el-button type="success" @click="importGoods" v-if="!!this.order.id">从报货单导入商品</el-button>
      </el-col>
      <el-col :span="6">
        <el-alert v-if="hasPerm('qtyPurchase')" title="注意：采购数量填写后不可修改" type="warning" :closable="false"></el-alert>
        <el-alert v-if="hasPerm('qtyPurchaseRel')" title="注意：验收数量填写后不可修改" type="warning" :closable="false"></el-alert>
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
          <b>创建日期：</b> {{this.order.creationTime}}
        </el-col>
        <el-col :span="6">
          <b>创建人：</b> {{this.order.operator}}
        </el-col>
        <el-col :span="6">

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
        <el-table-column label="商品名称" prop="goodsName"></el-table-column>
        <el-table-column label="报货数量">
          <template slot-scope="scope">
            <span>{{scope.row.qty}}/{{scope.row.qtyUnitName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="采购数量" v-if="hasPerm('qtyPurchase')">
          <template slot-scope="scope">
            <el-input v-if="scope.row.qtyPurchaseStatus !== 2" v-model="scope.row.qtyPurchase"
                      class="wkl-input-mini"></el-input>
            <span v-if="scope.row.qtyPurchaseStatus === 2">{{scope.row.qtyPurchase}}</span>
          </template>
        </el-table-column>
        <el-table-column label="验收数量" v-if="hasPerm('qtyPurchaseRel')">
          <template slot-scope="scope">
            <el-input v-if="scope.row.qtyPurchaseRealStatus !== 2" v-model="scope.row.qtyPurchaseReal"
                      class="wkl-input-mini"></el-input>
            <span v-if="scope.row.qtyPurchaseRealStatus === 2">{{scope.row.qtyPurchaseReal}}</span>
          </template>
        </el-table-column>
        <el-table-column label="重量" v-if="hasPerm('cgWeight')">
          <template slot-scope="scope">
            <el-input v-if="scope.row.qtyPurchaseRealStatus !== 2" v-model="scope.row.weight"
                      class="wkl-input-mini"></el-input>
            <span v-if="scope.row.qtyPurchaseRealStatus === 2">{{scope.row.weight}}</span>
            <span>{{scope.row.weightUnitName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="进价" v-if="hasPerm('purchasePrice')">
          <template slot-scope="scope">
            <el-input v-model="scope.row.purchasePrice"
                      class="wkl-input-mini"></el-input>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card shadow="never" style="margin-bottom: 10px">
      <div slot="header" class="clearfix">
        <span>修改日志</span>
      </div>
      <div v-for="row in orderLogs" class="text item">
        {{ getOrderDetailLog(row) }}
      </div>
    </el-card>

    <el-dialog
      title="选择报货单"
      :visible.sync="bhDialogVisible"
      width="70%">
      <el-row>
        <el-col :span="24">
          <el-form :inline="true" :model="bh.searchForm">
            <el-form-item label="报货单号">
              <el-input v-model="bh.searchForm.orderNo" clearable></el-input>
            </el-form-item>
            <el-form-item label="报货日期">
              <el-date-picker
                v-model="bh.searchForm.date"
                type="daterange"
                align="right"
                unlink-panels
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                :picker-options="pickerOptions2">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchBhOrder">查询</el-button>
              <el-button type="success" @click="confirmBhSelect" :loading="bh.confirmLoading">确定</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table
            :data="bh.rows"
            v-loading="bh.loading"
            @selection-change="handleBhSelectionChange"
            style="width: 100%">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="orderNo" label="报货单号" width="170"></el-table-column>
            <el-table-column prop="goodsCount" label="商品数量" width="100"></el-table-column>
            <el-table-column prop="storeName" label="门店" width="100"></el-table-column>
            <el-table-column prop="submitTime" label="报货日期" width="140"></el-table-column>
            <el-table-column prop="remark" label="备注"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <el-row style="margin-top: 10px">
        <el-col :span="24">
          <el-pagination
            @size-change="handleBhSizeChange"
            @current-change="handleBhCurrentChange"
            :current-page="bh.page"
            :page-sizes="[10,20,50,100]"
            :page-size="bh.size"
            :background="true"
            layout="total, sizes, prev, pager, next"
            :total="bh.total">
          </el-pagination>
        </el-col>
      </el-row>
    </el-dialog>

  </el-card>
</template>

<script>
  import moment from 'moment'
  import { DICT_TYPE, ORDER_STATUS, SHORTCUTS } from '../../commons/contants'

  export default {
    name: 'PurchaseOrderDetail',
    data () {
      return {
        order: {
          id: null,
          details: [],
          bhOrderIds: []
        },
        pickerOptions2: {
          shortcuts: SHORTCUTS
        },
        orderId: '',
        submitLoading: false,
        loading: false,
        orderLogs: [],
        orderSummary: [],
        bhDialogVisible: false,
        bh: {
          searchForm: {
            date: ''
          },
          rows: [],
          page: 1,
          size: 10,
          total: 0,
          loading: false,
          selectRows: [],
          confirmLoading: false
        },
        weightUnits: []
      }
    },
    methods: {
      initRows () {
        if (this.orderId) {
          this.loading = true
          this.$api.orders.getPurchaseOrder(this.orderId).then(data => {
            Object.assign(this.order, data)
            this.loading = false
          })
          this.$api.orders.getPurchaseOrderLogs(this.orderId).then(data => {
            this.orderLogs = data
          })
        } else {
          this.order.id = null
          this.order.details = []
          this.orderSummary.forEach((item) => {
            this.order.details.push({
              id: null,
              goodsId: item.goodsId,
              goodsName: item.goodsName,
              qty: item.qty,
              qtyUnit: item.qtyUnit,
              qtyUnitName: item.qtyUnitName,
              qtyPurchase: '',
              qtyPurchaseStatus: 1,
              qtyPurchaseReal: '',
              qtyPurchaseRealStatus: 1,
              purchasePrice: '',
              weightUnit: item.weightUnit,
              weightUnitName: item.weightUnitName
            })
          })
        }
      },
      submitOrder () {
        this.submitLoading = true
        this.$api.orders.savePurchaseOrder(this.order).then((data) => {
          this.submitLoading = false
          this.$message.success('保存成功')
          this.orderId = data
          this.initRows()
        }).catch(e => {
          this.submitLoading = false
          this.$alert(e.message)
        })
      },
      getOrderDetailLog (row) {
        let result = `[${row.creationTime}][${row.operator}]: `
        if (row.type === 1) {
          result += `新增: ${row.oldValue}`
        } else if (row.type === 2) {
          result += `修改${row.sourceName || ''}的${row.fieldName}: ${row.oldValue} 修改为 ${row.newValue}`
        } else if (row.type === 3) {
          result += `删除商品: ${row.oldValue}`
        }
        return result
      },
      handleBhSelectionChange (val) {
        this.bh.selectRows = val
      },
      searchBhOrder () {
        this.bh.loading = true
        const params = { page: this.bh.page - 1, size: this.bh.size }
        if (this.bh.searchForm.orderNo) {
          params.orderNo = this.bh.searchForm.orderNo
        }
        params.status = ORDER_STATUS.SUBMIT
        if (this.bh.searchForm.date) {
          params.startTime = this.bh.searchForm.date[0]
          params.endTime = this.bh.searchForm.date[1]
        }
        if (this.order.bhOrderIds.length > 0) {
          params.excludeIds = this.order.bhOrderIds.join(',')
        }
        this.$api.orders.getPage(params).then(result => {
          this.bh.rows = result.rows
          this.bh.total = result.total
          this.bh.loading = false
        })
      },
      handleBhSizeChange (size) {
        this.bh.size = size
        this.searchBhOrder()
      },
      handleBhCurrentChange (page) {
        this.bh.page = page
        this.searchBhOrder()
      },
      confirmBhSelect () {
        const rows = this.bh.selectRows
        if (rows.length === 0) {
          this.$message.error('请选择报货单')
          return
        }
        this.bh.confirmLoading = true
        const orderIds = rows.map(row => { return row.id })
        this.order.bhOrderIds = this.order.bhOrderIds.concat(orderIds)
        this.$api.orders.getOrderSummaryAssign(orderIds).then(data => {
          data.forEach(goods => {
            let tmpRow = this.order.details.filter(row => { return row.goodsId === goods.goodsId })
            if (tmpRow !== null && tmpRow.length > 0) {
              this.order.details.forEach(row => {
                if (row.goodsId === goods.goodsId) {
                  row.qty += goods.qty
                }
              })
            } else {
              this.order.details.push({
                id: null,
                goodsId: goods.goodsId,
                goodsName: goods.goodsName,
                qty: goods.qty,
                qtyUnit: goods.qtyUnit,
                qtyUnitName: goods.qtyUnitName,
                qtyPurchase: '',
                qtyPurchaseStatus: 1,
                qtyPurchaseReal: '',
                qtyPurchaseRealStatus: 1,
                purchasePrice: ''
              })
            }
          })
          this.bh.confirmLoading = false
          this.bhDialogVisible = false
        })
      },
      importGoods () {
        this.bhDialogVisible = true
        const defaultDate = moment().format('YYYY-MM-DD')
        this.bh.searchForm.date = [defaultDate, defaultDate]
        this.handleBhCurrentChange(1)
      }
    },
    created: function () {
    },
    activated: function () {
      if (this.$route) {
        this.orderId = this.$route.params.orderId
        this.orderSummary = this.$route.params.orderSummary || []
        this.order.bhOrderIds = this.$route.params.bhOrderIds || []
      }
      this.$api.dicts.getDictItems(DICT_TYPE.WEIGHT_UNIT).then(data => {
        this.weightUnits = data
      })
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
