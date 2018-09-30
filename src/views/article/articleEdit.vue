<template>
  <el-card shadow="never">
    <!--<div slot="header" class="clearfix">-->
      <!--<el-breadcrumb separator="/">-->
        <!--<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>-->
        <!--<el-breadcrumb-item :to="{path:'/aitlcleEdit'}">文章编辑</el-breadcrumb-item>-->
      <!--</el-breadcrumb>-->
    <!--</div>-->
    <el-form ref="form" :model="form" v-loading="loading"
             label-width="80px" label-position="top">
      <el-input v-model="form.id" type="hidden"></el-input>
      <el-form-item label="标题">
        <el-input v-model="form.articleTitle"></el-input>
      </el-form-item>
      <el-form-item label="摘要">
        <el-input type="textarea" v-model="form.articleAbstract"></el-input>
      </el-form-item>
      <el-form-item label="内容">
        <div class="editormd" id="editormd">
                    <textarea class="editormd-markdown-textarea" name="test-editormd-markdown-doc"
                              v-model="form.articleContent"></textarea>
          <!-- 第二个隐藏文本域，用来构造生成的HTML代码，方便表单POST提交，这里的name可以任意取，后台接受时以这个name键为准 -->
          <textarea name="articleContent" id="articleContent" placeholder="请输入内容" rows="10"
                    class="editormd-html-textarea" required
                    v-model="form.articleContent"></textarea>
        </div>
        <!--<el-input type="textarea" v-model="form.articleContent"></el-input>-->
      </el-form-item>
      <el-form-item label="分类">
        <el-select v-model="form.articleCategoryId" name="articleCategoryId" placeholder="请选择分类">
          <el-option
            v-for="item in articleCategoryOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标签">
        <el-select
          v-model="form.tags" name="articleTags"
          multiple filterable remote allow-create
          default-first-option
          placeholder="请选择文章标签" :remote-method="remoteMethod">
          <el-option
            v-for="item in articleTagsOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="form.articleCreateDate"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>
<script>
  // let $ = require('../static/js/jquery-2.2.3.min.js');
  // let editormd = require('../static/js/plugins/editormd/js/editormd.js');
  // import $ from '../static/js/jquery-2.2.3.min.js'
  // import editormd from '../static/js/plugins/editormd/js/editormd.js'
  import $scriptjs from 'scriptjs'
  import {aiticleTagsList, aiticleCategoryList, aiticleTagsSearch, aiticleGet, aiticleSave} from '@/api/article';
  var editor;
  export default {
    data() {
      return {
        form: {
          id: "",
          articleTitle: '',
          articleAbstract: '',
          articleContent: '',
          articleCategoryId: '',
          articleTags: '',
          articleCreateDate: ''
        },
        loading: false,
        articleTagsOptions: [],
        articleTagsOptionsBackup: [],
        articleCategoryOptions: []
      }
    },
    methods: {
      onSubmit() {
        this.loading = true;
        this.form.articleContent = editor.getMarkdown();
        this.form.articleTags = this.form.tags.join(",");
        aiticleSave(stringify(this.form)).then(res =>{
          this.loading = false;
          if (res.data.status=='success') {
            this.$message({
              showClose: true,
              message: '保存成功',
              type: 'success'
            });
            this.$router.push('/aitlcle')  //将你的跳转写在这里。
          } else {
            this.$message({
              showClose: true,
              type: 'error',
              dangerouslyUseHTMLString: true,
              message: res.status+" : "+res.statusText+(undefined==res.data.errorMsg?"":"<br/>"+res.data.errorMsg),
              duration:0
            });
          }
        }).catch(function (error) {
          this.$message({
            showClose: true,
            type: 'error',
            dangerouslyUseHTMLString: true,
            message: res.status+" : "+res.statusText+(undefined==res.data.errorMsg?"":"<br/>"+res.data.errorMsg),
            duration:0
          });
        })
      },
      cancel() {
        this.$router.push('/aitlcle')
      },
      remoteMethod(query) {
        if (query !== '') {
          aiticleTagsSearch(query).then(res =>{
            this.articleTagsOptions = res.data.map(item => {
              return { value: item, label: item };
            });
          });
        } else {
          this.articleTagsOptions = this.articleTagsOptionsBackup;
        }
      }
    },
    mounted:function(){
    },
    created: function () {
      $scriptjs('static/js/jquery-2.2.3.min.js', function () {
        $scriptjs('static/js/plugins/editormd/js/editormd.js', function () {
          editor = window.editormd("editormd", {
            width   : "100%",
            height  : 640,
            syncScrolling : "single",
            path: "static/js/plugins/editormd/js/lib/",
            saveHTMLToTextarea : true,
            /**上传图片相关配置如下*/
            imageUpload : true,
            imageFormats : ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
            imageUploadURL : "/file/upload",//注意你后端的上传图片服务地址
            onload : function() {
              // this.setMarkdown("### onloaded");
              // console.log("onload =>", this, this.id, this.settings);
            }
          });
        })
      })
      // $scriptjs('src/static/js/jquery-2.2.3.min.js');
      // $scriptjs('src/static/js/plugins/editormd/js/editormd.js');
      var id = this.$route.params.id;
      if (id) {
        this.id=id;
        aiticleGet(id).then(res =>{
          const data = res.data;
          this.form.id = data.id;
          this.form.articleTitle = data.articleTitle;
          this.form.articleAbstract = data.articleAbstract;
          this.form.articleContent = data.articleContent;
          this.form.articleCategoryId = data.articleCategoryId;
          this.form.articleTags = data.articleTags;
          this.form.tags = null==data.tags?[]:data.data.tags;
          this.form.articleCreateDate = data.articleCreateDate;
        })
      } else {
        this.id="";
      }
      aiticleTagsList().then(res =>{
        console.log(res)
        this.articleTagsOptions = res.data.map(item => {
          return { value: item, label: item };
        });
        this.articleTagsOptionsBackup = this.articleTagsOptions;
      });
      aiticleCategoryList().then(res =>{
        console.log(res)
        this.articleCategoryOptions = res.data.map(item => {
          return { value: item.id, label: item.categoryName };
        });
      });
    }
  }
</script>
<style>
  @import '../../../static/js/plugins/editormd/css/editormd.css';
</style>
