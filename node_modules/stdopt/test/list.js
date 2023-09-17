var opt = require('../')
var test = require('tape')

test('list', t => {
  var { list } = opt
  t.deepEqual(list([]).value(), [])
  t.deepEqual(list({ 0: 1, length: 1 }).value(), [1])
  t.deepEqual(list('blerf').or([]).value(), [])
  t.deepEqual(list('blerf').or({ 0: 1, length: 1 }).value(), [1])

  t.throws(() => opt().list())
  t.deepEqual(opt('any').list(), ['any'])
  t.deepEqual(opt.boolean(true).list(), [true])
  t.deepEqual(opt.hash({}).list(), [{}])
  t.deepEqual(opt.number(5).list(), [5])
  t.deepEqual(opt.string('arf').list(), ['arf'])

  var v = ['one', 'two', 'three']
  t.equal(list(v).value(), list(v).list())
  t.end()
})
