<template>
  <el-card shadow="never">
    <el-row>
      <el-col :span="24">
        <el-form :inline="true" :model="searchForm">
          <el-form-item label="创建日期">
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
          <el-form-item label="关键字">
            <el-input v-model="searchForm.text" clearable/>
          </el-form-item>
          <el-form-item label="分类">
            <el-select v-model="searchForm.categoryCode" value-key="value" clearable style="width: 100px"
                       placeholder="请选择">
              <el-option
                v-for="item in categories"
                :key="item.value"
                :label="item.name"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="searchForm.lookException">只看异常</el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查询</el-button>
            <el-button type="primary" @click="handleExport">导出</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table
          :data="rows"
          v-loading="loading"
          :row-class-name="handleRowClass"
          style="width: 100%">
          <el-table-column type="index" width="50"></el-table-column>
          <el-table-column prop="orderNo" label="采购单号" width="170"></el-table-column>
          <el-table-column prop="goodsName" label="商品名称"></el-table-column>
          <el-table-column prop="qty" label="报货数量"></el-table-column>
          <el-table-column prop="qtyPurchase" label="采购数量"></el-table-column>
          <el-table-column prop="qtyPurchaseReal" label="验收数量"></el-table-column>
          <el-table-column prop="qtyUnitName" label="单位"></el-table-column>
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
  </el-card>
</template>

<script>
  import { SHORTCUTS } from '../../commons/contants'
  import { getToken } from '../../commons/token'

  export default {
    name: 'PurchaseOrderRpt',
    data () {
      return {
        searchForm: {
          lookException: false,
          date: '',
          categoryCode: '',
          text: ''
        },
        pickerOptions2: {
          shortcuts: SHORTCUTS
        },
        rows: [],
        page: 1,
        size: 10,
        total: 0,
        loading: false,
        stores: [],
        categories: []
      }
    },
    methods: {
      getSearchParams () {
        const params = { page: this.page - 1, size: this.size }
        if (this.searchForm.date) {
          params.startTime = this.searchForm.date[0]
          params.endTime = this.searchForm.date[1]
        }
        if (this.searchForm.categoryCode) {
          params.categoryCode = this.searchForm.categoryCode
        }
        if (this.searchForm.text) {
          params.text = this.searchForm.text
        }
        params.lookException = this.searchForm.lookException
        return params
      },
      search () {
        this.loading = true
        const params = this.getSearchParams()
        this.$api.rpts.getPurchaseOrders(params).then(result => {
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
      handleRowClass ({ row }) {
        if (row.diff === 1) {
          return 'warning-row'
        }
      },
      handleExport () {
        const params = this.getSearchParams()
        params['Wkl-Auth-Token'] = getToken()
        let tmp = []
        for (let i in params) {
          tmp.push(`${i}=${params[i]}`)
        }
        const queryParams = tmp.join('&')
        window.open(`/wkl/api/rpt/purchase/orders/export?${queryParams}`)
      }
    },
    created: function () {
    },
    activated: function () {
      this.search()
      this.$api.dicts.getCategory().then(data => {
        this.categories = data
      })
    }
  }
</script>

<style>
  .el-table .warning-row {
    background: #fdf5e6;
  }
</style>
