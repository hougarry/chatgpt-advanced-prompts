var { string } = require('../')
var test = require('tape')

test('string', t => {
  t.equal(string('blarf').value(), 'blarf')
  t.equal(string().or('blarf').value(), 'blarf')
  t.equal(string(new String('a')).value(), 'a') // eslint-disable-line
  t.equal(string(5).value(), '5')
  t.equal(string().or(5).value(), '5')
  t.end()
})
