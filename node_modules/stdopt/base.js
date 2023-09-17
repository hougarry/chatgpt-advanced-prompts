var NO_VALIDATOR = 'No validator for '
var DESCRIPTION = Symbol('description')
var VALUE = Symbol('value')

function Base () {}

Base.implement = function (name) {
  function Opt (val) {
    if (!(this instanceof Opt)) return new Opt(val)
    this[VALUE] = val
    this[DESCRIPTION] = name || 'stdopt'
  }

  Object.setPrototypeOf(Opt.prototype, Base.prototype)
  Object.defineProperty(Opt, 'super_', {
    value: Base,
    configurable: true,
    writable: true
  })

  return Opt
}

Base.unwrap = function (opt) {
  return opt[VALUE]
}

Base.value = function (opt) {
  return Base.prototype.value.call(opt)
}

Base.prototype.or = function (fallback) {
  if (typeof this.constructor.isValid !== 'function') {
    throw new TypeError(NO_VALIDATOR + this[DESCRIPTION])
  }
  return this.constructor.isValid(this[VALUE]) ? this : new this.constructor(fallback)
}

Base.prototype.value = function () {
  if (typeof this.constructor.isValid !== 'function') {
    throw new TypeError(NO_VALIDATOR + this[DESCRIPTION])
  }
  if (this.constructor.isValid(this[VALUE])) {
    return this[VALUE]
  }
  throw new TypeError(`Invalid value ${this} (should be ${this[DESCRIPTION]})`)
}

Base.prototype.list = function () {
  return [this.value()]
}

Base.prototype.toString = function () {
  var val = this[VALUE]
  var ellipsis = ''

  if (typeof val === 'string' || val instanceof String) {
    val = val.substring(0, 27)
    ellipsis = val.length > 27 ? '...' : ''
  } else if (Array.isArray(val)) {
    val = val.slice(0, 2)
    ellipsis = val.length > 2 ? ',...' : ''
  }
  return String(val) + ellipsis
}

module.exports = Base
