<template>
  <el-card shadow="never">
    <el-row>
      <el-col :span="24">
        <el-form :inline="true" :model="searchForm">
          <el-form-item label="报货单号">
            <el-input v-model="searchForm.orderNo" clearable></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="searchForm.status" placeholder="请选择" style="width: 100px">
              <el-option label="全部" value="0"></el-option>
              <el-option label="暂存" value="1"></el-option>
              <el-option label="已提交" value="2"></el-option>
              <el-option label="已完成" value="4"></el-option>
            </el-select>
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
            <el-button type="success" @click="edit()" v-perm="'order:add'">新增</el-button>
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
          <el-table-column prop="orderNo" label="报货单号" width="170"></el-table-column>
          <el-table-column prop="goodsCount" label="商品数量" width="100"></el-table-column>
          <el-table-column prop="storeName" label="门店" width="100"></el-table-column>
          <el-table-column prop="remark" label="备注"></el-table-column>
          <el-table-column width="140" prop="submitTime" label="报货日期"></el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template slot-scope="scope">
              {{ getRowStatus(scope.row.status)}}
            </template>
          </el-table-column>
          <el-table-column width="80" prop="operator" label="操作人"></el-table-column>
          <el-table-column
            label="操作"
            width="120">
            <template slot-scope="scope">
              <el-button @click="remove(scope.row.id)" type="text" v-if="scope.row.status < 2">删除</el-button>
              <el-button @click="edit(scope.row.id)" type="text">详情</el-button>
              <router-link :to="{ path: `/order/print/${scope.row.id}` }" target="_blank">
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
  </el-card>
</template>

<script>
  import { SHORTCUTS } from '../../commons/contants'
  import moment from 'moment'

  export default {
    name: 'Order',
    data () {
      return {
        searchForm: {
          orderNo: '',
          status: '0'
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
        loading: false
      }
    },
    methods: {
      search () {
        this.loading = true
        const params = { page: this.page - 1, size: this.size }
        if (this.searchForm.orderNo) {
          params.orderNo = this.searchForm.orderNo
        }
        params.status = Number(this.searchForm.status)
        if (this.searchForm.date) {
          params.startTime = this.searchForm.date[0]
          params.endTime = this.searchForm.date[1]
        }
        this.$api.orders.getPage(params).then(result => {
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
        let orderId = id || ''
        this.$router.push({ name: 'OrderDetail', params: { orderId: orderId } })
      },
      remove (id) {
        this.$confirm('确定要删除吗？', '提示', {
          type: 'warning'
        }).then(() => {
          this.$api.orders.remove([id]).then(() => {
            this.$message.success('删除成功')
            this.handleCurrentChange(1)
          }).catch(e => {
            this.$alert(e.message)
          })
        }).catch(() => {})
      },
      getRowStatus (status) {
        if (status === 1) {
          return '暂存'
        } else if (status === 2) {
          return '已提交'
        } else if (status === 3) {
          return '配送中'
        } else if (status === 4) {
          return '已完成'
        }
      }
    },
    created: function () {
    },
    activated: function () {
      this.search()
    }
  }
</script>

<style>
</style>
