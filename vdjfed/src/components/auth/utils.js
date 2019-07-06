function isObject (val) {
  if (val !== null && typeof val === 'object' && val.constructor !== Array) {
    return true
  }
  return false
}

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

function extend (target, src) {
  let data = {}
  let ii = src.length
  for (let key in target) {
    if (isObject(target[key]) && target[key].constructor.name !== 'FormData') {
      data[key] = extend(target[key], {})
    } else {
      data[key] = target[key]
    }
  }
  for (let i = 0; i < ii; i++) {
    for (let key in src[i]) {
      if (isObject(src[i][key]) && src[i][key].constructor.name !== 'FormData') {
        data[key] = extend(target[key] || {}, [src[i][key]])
      } else {
        data[key] = src[i][key]
      }
    }
  }
  return data
}

function getValue (obj, attrStr) {
  let attrs = attrStr.split('.')
  let result = obj
  for (let key of attrs) {
    if (!(key in result)) {
      return undefined
    }
    result = result[key]
  }
  return result
}

function toArray (val) {
  return (typeof val) === 'string' || (typeof val) === 'number' ? [val] : val
}

export default {
  isObject,
  isEmptyObject,
  extend,
  getValue,
  toArray
}