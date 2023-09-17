var Base = require('./base')
var Str = Base.implement('string')

Str.isValid = function (s) {
  return typeof s === 'string' || typeof s === 'number' || s instanceof String
}

Str.prototype.value = function () {
  return String(Base.value(this))
}

module.exports = Str
