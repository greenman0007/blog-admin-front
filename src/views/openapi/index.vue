<template>
  <el-card shadow="hover">
    <div slot="header" class="clearfix">
      <span>Bing Open API 调用统计</span>
      <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
    </div>
    <el-table
      :data="tableData"
      :show-header="false"
      style="width: 100%">
      <el-table-column
        prop="text"
        width="100"
        align="right"
        label="项目">
      </el-table-column>
      <el-table-column
        prop="value"
        label="姓名">
      </el-table-column>
    </el-table>
  </el-card>
</template>
<script>
  import $scriptjs from 'scriptjs'
  import {aiticleTagsList, aiticleCategoryList, aiticleTagsSearch, aiticleGet, aiticleSave} from '@/api/article';
  import { mapGetters } from 'vuex'
  import store from '../../store'

  export default {
    data() {
      return {
        tableData: [{
          text: "邮箱",
          value: store.getters.userInfo.email
        }, {
          text: "注册时间",
          value: store.getters.userInfo.createTime
        }, {
          text: "app secret",
          value: store.getters.userInfo.appSecret
        }, {
          text: "请求限额",
          value: store.getters.userInfo.minuteLimit+' 次/分钟 '+store.getters.userInfo.minuteLimit+' 次/天'
        }]
      }
    },
    computed: {
      ...mapGetters([
        'userInfo',
        'roles'
      ])
    },
    methods: {
      cancel() {
        this.$router.push('/aitlcle')
      },
      remoteMethod(query) {
        if (query !== '') {
          aiticleTagsSearch(query).then(res => {
            this.articleTagsOptions = res.data.map(item => {
              return {value: item, label: item};
            });
          });
        } else {
          this.articleTagsOptions = this.articleTagsOptionsBackup;
        }
      }
    },
    mounted: function () {
    },
    created: function () {
    }
  }
</script>
<style>
  @import '../../../static/js/plugins/editormd/css/editormd.css';
</style>
