var Base = require('./base')
var isArrayish = require('is-arrayish')

var Hash = Base.implement('hash')

Hash.isValid = function (o) {
  return typeof o === 'object' && !isArrayish(o)
}

module.exports = Hash
