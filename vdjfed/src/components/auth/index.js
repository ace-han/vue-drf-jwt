import Auth from './auth'
import utils from './utils'

export default {
  install (Vue, {router = {}, http = {}, ...options}) {
    if (utils.isEmptyObject(router)) {
      throw Error('router object must be specified and not empty')
    }
    if (utils.isEmptyObject(http)) {
      throw Error('http object must be specified and not empty')
    }
    let auth = new Auth(Vue, router, http, options)
    // 1. add global method or property
    // Vue.myGlobalMethod = function () {
    //   // something logic ...
    // }
    // 2. add a global asset
    // Vue.directive('my-directive', {
    //   bind (el, binding, vnode, oldVnode) {
    //     // something logic ...
    //   }
    //   ...
    // })
    // 3. inject some component options
    // below is global mixin, use with caution
    // let counter = 0
    // Vue.mixin({
    //   created () {
    //     console.info('xxx', counter++)
    //   }
    // })
    // 4. add an instance method
    Vue.prototype.$auth = auth
  }
}
