import request from '@/utils/request'

export function getArticleList(params) {
  return request({
    url: '/admin/article/page',
    method: 'post',
    params
  })
}

//获取标签列表
export const aiticleTagsList = () => {
  return request({
    url: '/tags/list',
    method: 'get'
  })
}
//获取分类列表
export const aiticleCategoryList = () => {
  return request({
    url: '/admin/category/list',
    method: 'get'
  })
};
//根据关键字搜索标签
export const aiticleTagsSearch = (param) => {
  return request({
    url: '/tags/search?tagTitle='+param,
    method: 'get'
  })
};
//根据id获取文章
export const aiticleGet = (param) => {
  return request({
    url: '/admin/article/'+param,
    method: 'get'
  })
};
//保存文章
export const aiticleSave= (param) => {
  return request({
    url: '/admin/article/edit',
    method: 'post',
    param
  })
};
//删除文章
export const aiticleDelete= (id) => {
  return request({
    url: '/admin/article/delete?id='+id,
    method: 'post'
  })
};
