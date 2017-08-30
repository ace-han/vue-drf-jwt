import Vue from 'vue'
import Router from 'vue-router'

import MiscTemplate from '@/views/misc/Template'
import Misc404 from '@/views/misc/404'
import Misc403 from '@/views/misc/403'
import BaseTemplate from '@/components/template/Base'

import Login from '@/views/login/Login'
import Home from '@/views/Home'

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
          path: '/404',
          name: 'misc.404',
          component: Misc404
        },
        {
          path: '/403',
          name: 'misc.403',
          component: Misc403
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
        }
      ]
    },
    {
      path: '*',
      redirect: { name: 'misc.404' }
    }
  ]
})
