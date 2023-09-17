var Base = require('./base')
var Num = Base.implement('number')

Num.isValid = function (n) {
  return !Number.isNaN(Number(n))
}

Num.prototype.value = function () {
  return Number(Base.value(this))
}

module.exports = Num
