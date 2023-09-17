var test = require('tape')

test('opt', t => {
  var opt = require('../')

  t.equal(opt('value').value(), 'value')
  t.throws(() => opt(null).value(), /Invalid value null \(should be defined\)/)
  t.equal(opt('value').or('nope').value(), 'value')
  t.equal(opt().or('nope').value(), 'nope')
  t.equal(opt().or().or('nope').value(), 'nope')
  t.throws(() => opt(null).or(undefined).value())
  t.end()
})

test('custom', t => {
  var Base = require('../base')
  var Custom = Base.implement('custom')
  var Fail = Base.implement('fail')

  Custom.isValid = function (val) {
    return typeof val === 'string' && val.toLowerCase() === 'custom'
  }

  t.equal(Custom('custom').value(), 'custom')
  t.equal(Custom('stuff').or('custom').value(), 'custom')
  t.throws(() => Custom('stuff').value(), /Invalid value stuff \(should be custom\)/)
  t.throws(() => Fail('stuff').or('bleh').value(), /No validator for fail/)
  t.throws(() => Fail('stuff').value(), /No validator for fail/)
  t.end()
})
