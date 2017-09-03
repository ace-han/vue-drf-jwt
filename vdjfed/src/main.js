// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import axios from 'axios'
import App from './App'
import router from './router'
import i18n from './locales'
import AuthPlugin from '@/components/auth'

let axiosInstance = axios.create({
  timeout: 2 * 60 * 1000 // milliseconds
})

Vue.config.productionTip = false

Vue.prototype.$http = axiosInstance
// use default options will be fine
Vue.use(AuthPlugin, {
  router: router,
  http: axiosInstance,
  ...{}
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  template: '<App/>',
  components: { App }
})
