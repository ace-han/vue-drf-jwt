import Auth from './auth'

function isEmptyObject (obj) {
  // because Object.keys(new Date()).length === 0;
  // we have to do some additional check
  // isEmptyObject(""), // false
  // isEmptyObject(33), // false
  // isEmptyObject([]), // false
  // isEmptyObject({}), // true
  // isEmptyObject({length: 0, custom_property: []}), // false
  if (obj == null) {
    // null and undefined are "empty"
    return true
  }
  return Object.keys(obj).length === 0 && obj.constructor === Object
}

export default {
  install (Vue, {router = {}, http = {}, ...options}) {
    if (isEmptyObject(router)) {
      throw Error('router object must be specified and not empty')
    }
    if (isEmptyObject(http)) {
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
