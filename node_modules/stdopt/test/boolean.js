var { boolean } = require('../')
var test = require('tape')

test('boolean', t => {
  t.equal(boolean(false).value(), false)
  t.equal(boolean(true).value(), true)
  t.equal(boolean('False').value(), false)
  t.equal(boolean('True').value(), true)
  t.equal(boolean('Truthy').or(false).value(), false)
  t.end()
})
