var has = require('hast-util-has-property')
var url = require('url')
var opt = require('stdopt')
var visit = require('unist-util-visit')

module.exports = function transform (fn) {
  fn = fn || function () {}

  return function transformer (tree) {
    visit(tree, 'element', function (node) {
      modify(node, 'href')
      modify(node, 'src')
    })
  }

  function modify (node, prop) {
    if (has(node, prop)) {
      var obj = url.parse(node.properties[prop])
      var res = opt(fn(obj, node)).or(obj).value()
      node.properties[prop] = url.format(res)
    }
  }
}
