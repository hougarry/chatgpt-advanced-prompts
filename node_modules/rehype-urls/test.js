var rehype = require('rehype')
var tape = require('tape')
var urls = require('./')

tape('return', t => {
  var href = '<a href="http://example.com/page.html">text</a>'
  var src = '<img src="http://example.com/image.jpg">'
  var p = rehype().use(urls, url => url.path).freeze()

  t.equal(p.processSync(href).contents, wrap('<a href="/page.html">text</a>'), 'return href string')
  t.equal(p.processSync(src).contents, wrap('<img src="/image.jpg">'), 'return src string')
  t.end()
})

tape('mutate', t => {
  var input = '<a href="/page.html">link</a>'
  var p = rehype().use(urls, function (url, node) {
    node.properties.target = '_blank'
    url.protocol = 'http'
    url.host = 'example.org'
  })

  t.equal(p.processSync(input).contents, wrap('<a href="http://example.org/page.html" target="_blank">link</a>'), 'mutate node & url object')
  t.end()
})

function wrap (html) {
  return `<html><head></head><body>${html}</body></html>`
}
