var Base = require('./base')
var Boolean = Base.implement('boolean')

Boolean.isValid = function (b) {
  if (typeof b !== 'string') {
    return b === false || b === true
  }
  return b.toLowerCase() === 'false' || b.toLowerCase() === 'true'
}

Boolean.prototype.value = function () {
  var str = String(Base.value(this))
  switch (str.toLowerCase()) {
    case 'false': return false
    case 'true': return true
    default: throw new Error('Illegal state')
  }
}

module.exports = Boolean
