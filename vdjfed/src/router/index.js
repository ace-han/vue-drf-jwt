import Vue from 'vue'
import Router from 'vue-router'

import MiscTemplate from '@/views/misc/Template'
import Misc401 from '@/views/misc/401'
import Misc403 from '@/views/misc/403'
import Misc404 from '@/views/misc/404'
import BaseTemplate from '@/components/template/Base'

import Login from '@/views/login/Login'
import Home from '@/views/Home'

import AccountRoutes from '@/views/account/routes'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: MiscTemplate,
      children: [
        {
          path: '',
          redirect: 'index'
        },
        {
          path: '/login',
          name: 'login',
          component: Login
        },
        {
          path: '/401',
          name: 'misc.401',
          component: Misc401
        },
        {
          path: '/403',
          name: 'misc.403',
          component: Misc403
        },
        {
          path: '/404',
          name: 'misc.404',
          component: Misc404
        }
      ]
    },
    {
      path: '/',
      meta: {
        auth: true
      },
      component: BaseTemplate,
      children: [
        {
          path: 'index',
          name: 'index',
          component: Home
        },
        AccountRoutes
      ]
    },
    {
      path: '*',
      redirect: { name: 'misc.404' }
    }
  ]
})
