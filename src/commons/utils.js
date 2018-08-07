export function isString (value) {
  return Object.prototype.toString.call(value) === '[object String]'
}

export function isArray (value) {
  return Object.prototype.toString.call(value) === '[object Array]'
}

export function isFunction (value) {
  return Object.prototype.toString.call(value) === '[object Function]'
}
