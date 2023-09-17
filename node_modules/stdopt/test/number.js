var { number } = require('../')
var test = require('tape')

test('number', t => {
  t.equal(number(5).value(), 5)
  t.equal(number(Infinity).value(), Infinity)
  t.equal(number(new Number(5)).value(), 5) // eslint-disable-line
  t.equal(number('blarf').or(5).value(), 5)
  t.equal(number('5').value(), 5)
  t.end()
})
