import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/Login.vue'
import Main from '../views/Main2.vue'
import User from '../views/sys/User.vue'
import Role from '../views/sys/Role.vue'
import Resource from '../views/sys/Resource.vue'
import Store from '../views/sys/Store.vue'
import Dict from '../views/bas/Dict'
import Goods from '../views/bas/Goods'
import Order from '../views/order/Order'
import OrderDetail from '../views/order/OrderDetail'
import Message from '../views/sys/Message'
import ModifyPassword from '../views/sys/ModifyPassword'
import MessageList from '../views/sys/MessageList'
import OrderSummary from '../views/order/OrderSummary'
import PurchaseOrder from '../views/order/PurchaseOrder'
import PurchaseOrderDetail from '../views/order/PurchaseOrderDetail'
import PurchaseOrderPrint from '../views/order/PurchaseOrderPrint'
import OrderPrint from '../views/order/OrderPrint'
import OrderRpt from '../views/rpt/OrderRpt'
import PurchaseOrderRpt from '../views/rpt/PurchaseOrderRpt'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/purchase/order/print/:id',
      name: 'PurchaseOrderPrint',
      component: PurchaseOrderPrint
    },
    {
      path: '/order/print/:id',
      name: 'OrderPrint',
      component: OrderPrint
    },
    {
      path: '/',
      name: 'Main',
      component: Main,
      children: [
        {
          path: '/sys/user',
          name: 'User',
          component: User,
          meta: { title: '用户管理' }
        },
        {
          path: '/sys/role',
          name: 'Role',
          component: Role
        },
        {
          path: '/sys/store',
          name: 'Store',
          component: Store
        },
        {
          path: '/sys/resource',
          name: 'Resource',
          component: Resource
        },
        {
          path: '/bas/dict',
          name: 'Dict',
          component: Dict
        },
        {
          path: '/bas/goods',
          name: 'Goods',
          component: Goods
        },
        {
          path: '/order',
          name: 'Order',
          component: Order
        },
        {
          path: '/order/summary',
          name: 'OrderSummary',
          component: OrderSummary
        },
        {
          path: '/order/detail',
          name: 'OrderDetail',
          component: OrderDetail
        },
        {
          path: '/sys/message',
          name: 'Message',
          component: Message
        },
        {
          path: '/sys/modify/password',
          name: 'ModifyPassword',
          component: ModifyPassword
        },
        {
          path: '/sys/message/list',
          name: 'MessageList',
          component: MessageList
        },
        {
          path: '/purchase/order',
          name: 'PurchaseOrder',
          component: PurchaseOrder
        },
        {
          path: '/purchase/order/detail',
          name: 'PurchaseOrderDetail',
          component: PurchaseOrderDetail
        },
        {
          path: '/rpt/order',
          name: 'OrderRpt',
          component: OrderRpt
        },
        {
          path: '/rpt/purchase/order',
          name: 'PurchaseOrderRpt',
          component: PurchaseOrderRpt
        }
      ]
    }
  ]
})
