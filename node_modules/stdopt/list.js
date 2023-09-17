var Base = require('./base')
var isArrayish = require('is-arrayish')

var List = Base.implement('list')

List.isValid = isArrayish

List.prototype.value = List.prototype.list = function () {
  var list = Base.value(this)
  return Array.isArray(list) ? list : Array.from(list)
}

module.exports = List
