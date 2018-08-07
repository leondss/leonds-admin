<template>
  <el-card shadow="never">
    <el-row>
      <el-col :span="24">
        <el-form :inline="true" :model="searchForm">
          <el-form-item label="采购单号">
            <el-input v-model="searchForm.orderNo" clearable></el-input>
          </el-form-item>
          <el-form-item label="报货日期">
            <el-date-picker
              v-model="searchForm.date"
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
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="success" @click="newOrder">新增</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table
          :data="rows"
          v-loading="loading"
          style="width: 100%">
          <el-table-column prop="orderNo" label="采购单号" width="170"></el-table-column>
          <el-table-column prop="goodsCount" label="商品数量" width="100"></el-table-column>
          <el-table-column width="140" prop="creationTime" label="创建日期"></el-table-column>
          <el-table-column width="80" prop="operator" label="操作人"></el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <!--<el-button @click="remove(scope.row.id)" type="text">删除</el-button>-->
              <el-button @click="edit(scope.row.id)" type="text">详情</el-button>
              <router-link :to="{ path: `/purchase/order/print/${scope.row.id}` }" target="_blank">
                <el-button type="text">打印</el-button>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
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

    <el-dialog
      title="选择报货单"
      :visible.sync="bhDialogVisible"
      width="70%">
      <el-row v-if="diffStores && diffStores.length > 0">
        <el-col :span="24" style="margin-bottom: 10px">
          <el-alert
            :title="`以下门店还没有报货：${diffStores}`"
            :closable="false"
            type="error">
          </el-alert>
        </el-col>
      </el-row>
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
  import { ORDER_STATUS, SHORTCUTS } from '../../commons/contants'

  export default {
    name: 'PurchaseOrder',
    data () {
      return {
        searchForm: {
          orderNo: '',
          status: '0',
          date: ''
        },
        pickerOptions2: {
          shortcuts: SHORTCUTS,
          disabledDate: (time) => {
            const perms = this.$store.getters.dataPerms
            const maxDay = perms && perms['maxDay']
            if (maxDay) {
              const maxDayInt = maxDay && Number(maxDay)
              const maxTime = (new Date()).getTime()
              const minTime = moment().subtract(maxDayInt, 'days').toDate().getTime()
              return time.getTime() > maxTime || time.getTime() < minTime
            } else {
              return false
            }
          }
        },
        rows: [],
        page: 1,
        size: 10,
        total: 0,
        loading: false,
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
        stores: [],
        diffStores: []
      }
    },
    methods: {
      search () {
        this.loading = true
        const params = { page: this.page - 1, size: this.size }
        if (this.searchForm.orderNo) {
          params.orderNo = this.searchForm.orderNo
        }
        if (this.searchForm.date) {
          params.startTime = this.searchForm.date[0]
          params.endTime = this.searchForm.date[1]
        }
        this.$api.orders.getPurchasePage(params).then(result => {
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
        this.$api.orders.getPage(params).then(result => {
          this.bh.rows = result.rows
          this.bh.total = result.total
          this.bh.loading = false
          this.getTips()
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
      edit (id) {
        let orderId = id || ''
        this.$router.push({ name: 'PurchaseOrderDetail', params: { orderId: orderId } })
      },
      remove (id) {
        this.$confirm('确定要删除吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.$api.orders.removePurchaseOrder([id]).then(() => {
            this.$message.success('删除成功')
            this.handleCurrentChange(1)
          }).catch(e => {
            this.$alert(e.message)
          })
        }).catch(() => {})
      },
      newOrder () {
        this.bhDialogVisible = true
        this.handleBhCurrentChange(1)
      },
      confirmBhSelect () {
        const rows = this.bh.selectRows
        if (rows.length === 0) {
          this.$message.error('请选择报货单')
          return
        }
        this.bh.confirmLoading = true
        const orderIds = rows.map(row => { return row.id })
        this.$api.orders.getOrderSummaryAssign(orderIds).then(data => {
          this.bh.confirmLoading = false
          this.bhDialogVisible = false
          this.$router.push({ name: 'PurchaseOrderDetail', params: { orderSummary: data, bhOrderIds: orderIds } })
        })
      },
      getTips () {
        const allStoreNames = this.stores.map(i => { return i.name })
        const currentStoreNames = this.bh.rows.map(i => { return i.storeName })
        this.diffStores = allStoreNames.filter(i => currentStoreNames.indexOf(i) === -1)
      }
    },
    created: function () {
    },
    activated: function () {
      const defaultDate = moment().format('YYYY-MM-DD')
      this.bh.searchForm.date = [defaultDate, defaultDate]
      this.search()

      this.$api.stores.getAll().then(data => {
        this.stores = data
      })
    }
  }
</script>

<style>
</style>
