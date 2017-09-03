
import utils from './utils'
import TokenStore from './token'

const defaultOptions = {
  // Variables
  authType: 'bearer',
  rolesVar: 'groups',
  tokenName: 'token',
  tokenStoreType: 'localStorage',
  httpDataField: 'data',
  // Objects
  authRedirect: {path: '/login'},
  forbiddenRedirect: {path: '/403'},
  notFoundRedirect: {path: '/404'},
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
    url: '/api/v1/auth/refresh/',
    method: 'GET',
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
    this.options = utils.extend(defaultOptions, options || {})
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
          loaded: false,
          authenticated: false,
          refreshing: false
        }
      }
    })

    vueRouter.beforeEach(this.beforeEachRouteHandler.bind(this))

    this[http].interceptors.request.use(this.httpRequestInterceptor.bind(this))
    this[http].interceptors.response.use(this.httpResponseInterceptor.bind(this))

    this.refreshTokenQuietly()
  }

  ready () {
    return this[watched].loaded
  }

  refreshTokenQuietly () {
    if (this.options.refreshData.enable && this[tokenStore].get()) {
      this[watched].refreshing = true
      this.doRefreshToken()
        .then(() => {
          this[watched].authenticated = true
          this.refreshToken()
        }).catch(() => {
          this[watched].authenticated = false
        }).then(() => {
          this[watched].loaded = true
          this[watched].refreshing = false
        })
    }
  }

  refreshToken () {
    if (this.options.refreshData.enable) {
      this[pollingRef] = setTimeout(() => {
        this.doRreshToken()
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
        reject(error)
      }).then(() => {
        this[watched].loaded = true
      })
    })
  }

  loginSuccessHandler (data) {
    // if any next go to next,
    // otherwise go to this.options.loginData.redirect
    let next = this[router].currentRoute.query.next || data.redirect
    if (next) {
      this[router].push(next)
    } else {
      this[router].push(this.options.loginData.redirect)
    }
  }

  user () {
    return this[watched].data
  }

  fetchUser () {
    return new Promise((resolve, reject) => {
      this[http]({
        method: this.options.fetchUserData.method,
        url: this.options.fetchUserData.url
      }).then((response) => {
        this[watched].authenticated = true
        let userData = utils.getValue(response, `${this.options.httpDataField}`)
        userData = this.parseUserData(userData)
        this[watched].data = userData
        resolve(userData)
      }).catch((error) => {
        this[watched].authenticated = false
        reject(error)
      }).then(() => {
        this[watched].loaded = true
      })
    })
  }

  parseUserData (data) {
    return data
  }

  beforeEachRouteHandler (to, from, next) {
    // let go all for the time being
    next()
  }

  httpRequestInterceptor (config) {

  }

  httpResponseInterceptor (response) {

  }
}
