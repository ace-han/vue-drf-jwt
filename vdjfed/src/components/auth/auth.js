
import utils from './utils'
import TokenStore from './token'

const defaultOptions = {
  // Variables
  authType: 'Bearer',
  rolesVar: 'roles',
  tokenName: 'token',
  tokenStoreType: 'localStorage',
  httpDataField: 'data',
  // Objects
  authRedirect: {path: '/login'},
  notAuthRedirect: {path: '/401'},
  forbiddenRedirect: {path: '/403'},
  registerData: {
    url: '/api/v1/auth/register/',
    method: 'POST',
    redirect: '/login'
  },
  loginData: {
    url: '/api/v1/auth/login/',
    method: 'POST',
    redirect: '/',
    fetchUser: true
  },
  logoutData: {
    url: '/api/v1/auth/logout/',
    method: 'POST',
    redirect: '/',
    makeRequest: false
  },
  fetchUserData: {
    doEveryRoute: false,
    url: '/api/v1/auth/user/info/',
    method: 'GET',
    enabled: true
  },
  refreshData: {
    url: '/api/v1/auth/token/refresh/',
    method: 'POST',
    enabled: true,
    interval: 5 // minutes
  }
}

const pollingRef = Symbol('pollingRef')
const tokenStore = Symbol('tokenStore')
const router = Symbol('router')
const http = Symbol('http')
const watched = Symbol('watched')

export default class Auth {
  constructor (Vue, vueRouter, vueHttp, options) {
    this.options = utils.extend(defaultOptions, [options || {}])
    this[pollingRef] = null
    this[router] = vueRouter
    this[http] = vueHttp
    this[tokenStore] = new TokenStore(this.options.tokenStoreType,
                                  this.options.tokenName)
    // make watched to be reactive
    this[watched] = new Vue({
      data () {
        return {
          data: {},
          authenticated: false,
          refreshing: false,
          fetching: false
        }
      }
    })
    this.initBeforeEachRouteHandler()
    this.initRequestInterceptor()
    this.initResponseInterceptor()
    this.refreshTokenQuietly()
  }

  static checkAuth (one, two) {
    if (Object.prototype.toString.call(one) === '[object Object]' && Object.prototype.toString.call(two) === '[object Object]') {
      for (let key in one) {
        if (this.constructor.checkAuth(one[key], two[key])) {
          return true
        }
      }
      return false
    }
    one = utils.toArray(one)
    two = utils.toArray(two)

    if (!one || !two || one.constructor !== Array || two.constructor !== Array) {
      return false
    }
    for (let i = 0, ii = one.length; i < ii; i++) {
      if (two.indexOf(one[i]) >= 0) {
        return true
      }
    }
    return false
  }

  ready () {
    return !(this[watched].fetching || utils.isEmptyObject(this.user()))
  }

  refreshTokenQuietly () {
    if (this.options.refreshData.enabled && this[tokenStore].get()) {
      this[watched].refreshing = true
      this.doRefreshToken()
        .then(() => {
          this[watched].authenticated = true
          this.fetchUserInfo()
          this.refreshToken()
        }).catch((error) => {
          this[watched].authenticated = false
          console.error(error)
        }).then(() => {
        })
    }
  }

  refreshToken () {
    if (this.options.refreshData.enabled) {
      this[pollingRef] = setTimeout(() => {
        this.doRefreshToken()
        this.refreshToken()
      }, this.options.refreshData.interval * 60 * 1000)
    } else {
      console.warn('Enable `refreshToken` option first')
    }
  }

  doRefreshToken () {
    this[watched].refreshing = true
    return new Promise((resolve, reject) => {
      this[http]({
        method: this.options.refreshData.method,
        url: this.options.refreshData.url,
        data: {
          [this.options.tokenName]: this[tokenStore].get()
        }
      }).then((response) => {
        let token = utils.getValue(response, `${this.options.httpDataField}.${this.options.tokenName}`)
        this[tokenStore].set(token)
        resolve(response)
      }).catch((error) => {
        this[tokenStore].remove()
        reject(error)
      }).then((response) => {
        this[watched].refreshing = false
      })
    })
  }

  stopRefreshToken () {
    clearTimeout(this[pollingRef])
    this[pollingRef] = null
  }

  login (username, password) {
    // using promise style
    // followup-handling process could be
    // this.$auth.login().then((resolve, reject) => {...})
    return new Promise((resolve, reject) => {
      this[http]({
        method: this.options.loginData.method,
        url: this.options.loginData.url,
        data: {
          username,
          password
        }
      }).then((response) => {
        this[watched].authenticated = true
        let token = utils.getValue(response, `${this.options.httpDataField}.${this.options.tokenName}`)
        this[tokenStore].set(token)
        // using promise style, if not okay with this loginSuccessHandler
        // please subclass this Auth class and override it
        this.loginSuccessHandler(response)
        resolve(response)
      }).catch((error) => {
        this[watched].authenticated = false
        this[tokenStore].remove()
        reject(error)
      }).then(() => {
      })
    })
  }

  loginSuccessHandler (data) {
    // if any next go to next,
    // otherwise go to this.options.loginData.redirect
    this.fetchUserInfo().then(() => {
      let next = this[router].currentRoute.query.next || data.redirect
      if (next) {
        this[router].push(next)
      } else {
        this[router].push(this.options.loginData.redirect)
      }
    })
  }

  user () {
    // sync version
    return this[watched].data
  }

  fetchUserInfo () {
    // promise version
    if (!this.options.fetchUserData.doEveryRoute) {
      if (this[watched].fetching) {
        return new Promise((resolve) => {
          let loopFetching = () => {
            setTimeout(() => {
              if (this[watched].fetching) {
                loopFetching()
              } else {
                resolve(this.user())
              }
            }, 500)
          }
          loopFetching()
        })
      }
      let userData = this.user()
      if (!(utils.isEmptyObject(userData) || this.options.fetchUserData.doEveryRoute)) {
        return Promise.resolve(this.user())
      }
    }
    this[watched].fetching = true
    return new Promise((resolve, reject) => {
      this[http]({
        method: this.options.fetchUserData.method,
        url: this.options.fetchUserData.url
      }).then((response) => {
        let userData = utils.getValue(response, `${this.options.httpDataField}`)
        userData = this.parseUserData(userData)
        this[watched].data = userData
        resolve(userData)
      }).catch((error) => {
        // empty it for the time being
        this[watched].data = {}
        reject(error)
      }).then(() => {
        this[watched].fetching = false
      })
    })
  }

  parseUserData (data) {
    return data
  }

  logout () {
    this[tokenStore].remove()
    this[watched].authenticated = false
    this[watched].data = {}

    if (this.options.logoutData.makeRequest) {
      // no matter ajax or not
      this[http]({
        method: this.options.logoutData.method,
        url: this.options.logoutData.url
      }).then((response) => {
        console.debug('logout successfully')
      }).catch((error) => {
        console.error('logout failed', error)
      })
    }

    if (this.options.loginData.redirect) {
      this[router].push(this.options.loginData.redirect)
    }
  }

  initBeforeEachRouteHandler () {
    // get router auth config
    // current route necessary to check then get user data otherwise just next
    // we get userData
    // compare auth settings
    this[router].beforeEach((to, from, next) => {
      let auth = false
       // as detailed in https://router.vuejs.org/en/api/route-object.html, the last one is the exactRoute
      // When the URL is /foo/bar, $route.matched will be an Array containing both objects (cloned),
      // in parent to child order.
      // typeof only usage to see if a variable is undefined
      // please refer to http://bonsaiden.github.io/JavaScript-Garden/#types.typeof
      to.matched.filter(function (route) {
        if (route.meta && route.meta.hasOwnProperty('auth')) {
          auth = route.meta.auth
        }
      })

      if (!auth) {
        next()
        return
      }
      // token is null and authenticated = true means expiration
      // token is not null and authenticated = true means 403
      // token is null and authenticated = false means login failure or hard logout
      // token is not null and authencation = false means logout soft

      // for the first time the page is loaded,
      // probably `authenticated` not yet loaded
      // token in tokenStore is much more reliable to demo the user was login some time ago
      if (this[watched].authenticated || this[tokenStore].get()) {
        if (auth === true) {
          next()
        } else if (auth.constructor === Array) {
          this.fetchUserInfo()
            .then((userData) => {
              if (this.constructor.checkAuth(auth, userData[this.options.rolesVar])) {
                next()
              } else {
                next({
                  path: this.options.forbiddenRedirect.path,
                  query: {
                    refer: to.fullPath
                  }
                })
              }
            }).catch((error) => {
              console.error('fetchUserInfo error in router.beforeEach', error)
              next(this.options.notAuthRedirect)
            })
        }
      } else {
        next({
          path: this.options.authRedirect.path,
          query: {
            next: to.fullPath
          }
        })
      }
      if (this[watched].authenticated && !this[tokenStore].get()) {
        // we need to logout this invalid state
        this.logout()
      }
    })
  }

  initRequestInterceptor () {
    this[http].interceptors.request.use((config) => {
      if (!this[tokenStore].get() || config.url === this.options.refreshData.url) {
        return Promise.resolve(config)
      }

      return new Promise((resolve, reject) => {
        let refreshingLoop = () => {
          setTimeout(() => {
            if (this[watched].refreshing) {
              refreshingLoop()
            } else {
              let token = this[tokenStore].get()
              config.headers.common = Object.assign(config.headers.common, {Authorization: `${this.options.authType} ${token}`})
              resolve(config)
            }
          }, 500)
        }
        refreshingLoop()
      })
    }, (error) => {
      return Promise.reject(error)
    })
  }

  initResponseInterceptor () {
    this[http].interceptors.response.use((response) => {
      let headers = response.headers
      let token = headers.Authorization || headers.authorization

      if (token) {
        let pattern = new RegExp(`${this.options.authType}\\:?\\s?`, 'i')
        token = token.split(pattern)
        token = token[token.length > 1 ? 1 : 0].trim()
        this[tokenStore].set(token)
      }
      return Promise.resolve(response)
    }, (error) => {
      // Generally speaking, no redirect for these ajax errors
      // for redirect to login page, please do it in ajax error handler individually
      return Promise.reject(error)
    })
  }
}
