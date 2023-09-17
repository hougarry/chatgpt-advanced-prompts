var Base = require('./base')
var Opt = Base.implement('defined')

Opt.isValid = function (val) {
  return val !== undefined && val !== null
}

module.exports = Opt
