var { hash } = require('../')
var test = require('tape')

test('hash', t => {
  t.deepEqual(hash({}).value(), {})
  t.deepEqual(hash('barf').or({}).value(), {})
  t.deepEqual(hash([]).or({}).value(), {})
  t.deepEqual(hash({ 0: 1, length: 1 }).or({}).value(), {})
  t.deepEqual(hash({ length: 1 }).value(), { length: 1 })
  t.end()
})
