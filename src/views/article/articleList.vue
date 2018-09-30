<template>
  <div class="app-container">
    <el-table
      v-loading="loading"
      :data="tableData"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ (currentPage>0?(currentPage-1):0)*pageSize+scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column label="标题">
        <template slot-scope="scope">
          <a :href="articleUrl+scope.row.id" class="link-plain" target="_blank">{{ scope.row.articleTitle }}</a>
        </template>
      </el-table-column>
      <el-table-column
        prop="articleCategoryName"
        label="分类">
      </el-table-column>
      <el-table-column
        prop="articleTags"
        label="标签">
      </el-table-column>
      <el-table-column
        width="80"
        prop="articleCommentCount"
        label="回复数">
      </el-table-column>
      <el-table-column
        width="80"
        prop="articleViewCount"
        label="阅读数">
      </el-table-column>
      <el-table-column
        prop="articleCreateDate"
        label="创建时间">
      </el-table-column>
      <el-table-column label="操作" class-name="text-nowrap">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row type="flex" class="row-bg" justify="end">
      <el-col :span="24">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageSize"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { getArticleList } from '@/api/article'

  export default {
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'gray',
          deleted: 'danger'
        }
        return statusMap[status]
      }
    },
    data() {
      return {
        loading: true,
        currentPage: 1,
        articleUrl : "http://localhost:8080/article/",
        getTopicListUrl: 'http://localhost:8080/admin/article/page',
        tableData: [],
        total:0,
        pageSize:10
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      handleEdit(index, row) {
        // this.$router.push({ path: '/dashboard' })
        // this.$router.push({ path: '/article/articleEdit?fads' })
        this.$router.push({ path: '/article/articleEdit/'+row.id })
        // this.$router.push('/aitlcleEdit/'+row.id)  //将你的跳转写在这里。
      },
      handleDelete(index, row) {
        this.loading = true;
        aiticleDelete(row.id).then(res =>{
          this.loading = false;
          this.fetchData();
        });
      },
      handleSizeChange(val) {
        this.pageSize = val;
        this.fetchData();
      },
      handleCurrentChange(val) {
        this.currentPage = val;
        this.fetchData();
      },
      fetchData: function () {
        this.loading = true;
        var params = { rows: this.pageSize, page: this.currentPage };

        getArticleList(params).then(response => {
          this.loading = false
          this.tableData = response.data.rows
          this.total = response.data.total;
          this.currentPage = response.data.currentPage;
          this.pageSize = response.data.pageSize;
        })
        // axios.post(that.getTopicListUrl + "?accesstoken=33771e44-2688-4e8c-b5a1-822026574be5").then(res => {
        //     console.log(res);
        //     that.tableData = res.data.rows;
        //     that.total = res.data.total;
        //     that.currentPage = res.data.currentPage;
        //     that.pageSize = res.data.pageSize;
        // })
      }
    }
  }
</script>
