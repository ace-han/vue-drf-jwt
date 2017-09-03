
const storeType = Symbol('storeType')
const tokenName = Symbol('tokenName')

export default class TokenStore {
  constructor (storeTypeStr, tokenNameStr) {
    this[storeType] = storeTypeStr
    this[tokenName] = tokenNameStr
  }

  get () {
    let result
    switch (this[storeType]) {
      case 'localStorage':
        result = window.localStorage.getItem(this[tokenName])
        break
      default:
        throw Error(`storeType: ${this['storeType']} not supported`)
    }
    return result
  }

  set (token) {
    switch (this[storeType]) {
      case 'localStorage':
        window.localStorage.setItem(this[tokenName], token)
        break
      default:
        throw Error(`storeType: ${this['storeType']} not supported`)
    }
  }

  remove () {
    switch (this[storeType]) {
      case 'localStorage':
        window.localStorage.removeItem(this[tokenName])
        break
      default:
        throw Error(`storeType: ${this['storeType']} not supported`)
    }
  }
}
