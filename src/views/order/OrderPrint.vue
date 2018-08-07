<template>
  <div>
    <el-row style="font-size: 10px;margin-bottom: 5px">
      <el-col :span="8">
        <b>报货单号：</b> {{this.order.orderNo}}
      </el-col>
      <el-col :span="8">
        <b>提交日期：</b> {{this.order.submitTime ? this.order.submitTime.substring(0,16):this.order.submitTime}}
      </el-col>
      <el-col :span="8">
        <b>操作人：</b> {{this.order.operator}}
      </el-col>
    </el-row>
    <el-row style="font-size: 10px">
      <el-table
        :data="order.details"
        border
        style="width: 710px">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goodsName"></el-table-column>
        <el-table-column label="报货数量">
          <template slot-scope="scope">
            <span>{{scope.row.qty}}/{{scope.row.qtyUnit.name}}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'OrderPrint',
    data () {
      return {
        order: {
          id: null,
          details: []
        }
      }
    },
    methods: {
      initRows () {
        const orderId = this.$route.params.id
        if (orderId) {
          this.$api.orders.get(orderId).then(data => {
            Object.assign(this.order, data)
            this.$nextTick(() => {
              window.print()
            })
          })
        }
      }
    },
    created: function () {
      this.initRows()
    }
  }
</script>

<style media="print" type="text/css">
  @page {
    size: auto;
    margin: 0 10mm 0 10mm;
  }

  body {
    background-color: #FFFFFF;
    margin: 0;
    padding: 30px 0 0 0;
  }
</style>

