<template>
  <div>
    <el-row style="font-size: 10px;margin-bottom: 5px">
      <el-col :span="8">
        <b>采购单号：</b> {{this.order.orderNo}}
      </el-col>
      <el-col :span="8">
        <b>创建日期：</b> {{this.order.creationTime ? this.order.creationTime.substring(0,16):this.order.creationTime}}
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
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column label="商品名称" prop="goodsName"></el-table-column>
        <el-table-column label="报货数量">
          <template slot-scope="scope">
            <span>{{scope.row.qty}}/{{scope.row.qtyUnitName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="采购数量" prop="qtyPurchase"></el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
  export default {
    name: 'PurchaseOrderPrint',
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
          this.$api.orders.getPurchaseOrder(orderId).then(data => {
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

