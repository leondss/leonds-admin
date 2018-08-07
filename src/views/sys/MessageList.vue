<template>
  <el-card shadow="never">
    <el-row>
      <el-col>
        <el-table
          :data="rows"
          v-loading="loading"
          style="width: 100%">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="content" label="公告内容"></el-table-column>
          <el-table-column label="图片" width="250">
            <template slot-scope="scope">
              <div v-viewer>
                <img v-for="src in getImages(scope.row.images)" :src="src" width="50" height="50"
                     class="row-image"/>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="publishTime" label="发布时间" width="150"></el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="openFiles(scope.row.msgId)" type="text">查看附件</el-button>
            </template>
          </el-table-column>
        </el-table>

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

        <el-dialog
          title="附件"
          :visible.sync="filesDialogVisible"
          width="50%">
          <el-row>
            <el-col :span="24">
              <ul>
                <li v-for="item in filesRows">
                  <a :href="'wkl/'+item.path" class="file-link" target="_blank">{{item.alias}}</a>
                </li>
              </ul>
            </el-col>
          </el-row>
        </el-dialog>

      </el-col>
    </el-row>
  </el-card>
</template>

<script>
  import { FILE_TYPE } from '../../commons/contants'

  export default {
    name: 'MessageList',
    data () {
      return {
        searchForm: {
          status: 1
        },
        rows: [],
        page: 1,
        size: 10,
        total: 0,
        editLoading: false,
        loading: false,
        filesDialogVisible: false,
        filesRows: []
      }
    },
    methods: {
      search () {
        this.loading = true
        const params = { page: this.page - 1, size: this.size }
        this.$api.msgs.getUserMessage(params).then(result => {
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
      openFiles (id) {
        this.filesDialogVisible = true
        this.$api.uploads.getFiles(id, FILE_TYPE.FILE).then(result => {
          this.filesRows = result
        })
      },
      getImages (images) {
        const urls = (images && images.split(',')) || []
        return urls.map(i => { return 'wkl' + i })
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
  .row-image {
    margin-left: 5px;
    cursor: pointer;
  }

  .row-image:hover {
    border: 1px #0d6aad solid;
  }
</style>
