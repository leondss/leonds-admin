import BasicLayout from '../layouts/BasicLayout';

import Analysis from '../routes/Dashboard/Analysis';

import Role from '../routes/System/Role';
import Posts from '../routes/Cms/Posts';

const data = [{
  component: BasicLayout,
  layout: 'BasicLayout',
  name: '首页', // for breadcrumb
  path: '',
  children: [{
    name: 'Dashboard',
    icon: 'dashboard',
    path: 'dashboard',
    children: [{
      name: '分析页',
      path: 'analysis',
      component: Analysis,
    }],
  }, {
    name: '系统管理',
    path: 'system',
    icon: 'windows',
    children: [{
      name: '角色管理',
      path: 'role',
      component: Role,
    }],
  }, {
    name: '内容管理',
    path: 'content',
    icon: 'windows',
    children: [{
      name: '文章',
      path: 'posts',
      component: Posts,
    }],
  }],
}];

export function getNavData() {
  return data;
}

export default data;
