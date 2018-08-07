<template>
  <el-card shadow="never">
    <el-row>
      <el-col :span="24">
        <el-form :inline="true" :model="searchForm">
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
            <el-button type="success" @click="savePurchaseOrder()">生成采购单</el-button>
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
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column prop="goodsName" label="商品名称" width="100"></el-table-column>
          <el-table-column prop="qty" label="报货数量"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
  import moment from 'moment'

  export default {
    name: 'OrderSummary',
    data () {
      return {
        searchForm: {
          date: ''
        },
        pickerOptions2: {
          shortcuts: [{
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        rows: [],
        loading: false
      }
    },
    methods: {
      search () {
        this.loading = true
        this.$api.orders.getOrderSummary({
          startTime: this.searchForm.date[0],
          endTime: this.searchForm.date[1]
        }).then(data => {
          this.rows = data
          this.loading = false
        })
      },
      savePurchaseOrder () {
        this.$router.push({ name: 'PurchaseOrderDetail', params: { orderSummary: this.rows } })
      }
    },
    created: function () {
    },
    activated: function () {
      const defaultDate = moment().format('YYYY-MM-DD')
      this.searchForm.date = [defaultDate, defaultDate]
      this.search()
    }
  }
</script>

<style>
</style>
