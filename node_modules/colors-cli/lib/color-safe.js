var colors = {};
module.exports = colors;

var defineProps = Object.defineProperties;
var styles_data = require('./styles-name')
var ansiRegex = require('./ansi-regex');
var ansiColors = styles_data.colors;
var ansiStyles = styles_data.styles;

var Colors = require('./color').Colors
var color = require('./color').color

// Get all the color attribute.
ansiColors = Object.keys(color)

var styles = (function () {
  var ret = {};
  var retarr = ansiStyles.concat(ansiColors)
  retarr.forEach(function (key) {
    ret[key] = {
      get: function () {
        return build(this._styles.concat(key));
      }
    };
  });
  return ret;
})();

var proto = defineProps(function colors() {}, styles);


function build(_styles_more) {
  var builder = function builder() {
    return applyStyle.apply(builder, arguments);
  };
  builder._styles = _styles_more;
  // 使用它 __proto__ 是必须返回一个函数
  builder.__proto__ = proto;
  return builder;
}

function applyStyleCallback(str, _sty) {
  var _Colors = new Colors()
  for (var i = 0; i < _sty.length; i++) {
    _Colors.string = str;
    if (_sty[i]) str = _Colors[_sty[i]].valueOf(_sty[i]);
  }
  return str;
}

function regexReplace(str) {
  return str.replace(/(\[)/ig, '\\[').replace(/(\])/ig, '\\]');
}

// 应用 Ansi 样式
function applyStyle(){
  var args_len = arguments.length;
  var str = args_len !== 0 && String(arguments[0]);
  var _sty = this._styles;
  var ansiArray = str.match(ansiRegex());
  // 文本中是否带 ANSI 控制码
  if (ansiRegex().test(str) && ansiArray) {
    var leftReg = regexReplace(ansiArray[0]);
    var rightReg = regexReplace(ansiArray[ansiArray.length - 1]);
    var centerReg = new RegExp(leftReg + '(.*)' + rightReg, "g");
    var centerStr = str.match(centerReg);
    var sidesStr = str.split(centerStr);
    str = applyStyleCallback(sidesStr[0], _sty) + centerStr + applyStyleCallback(sidesStr[1], _sty);
  } else {
    str = applyStyleCallback(str, _sty);
  }
  return str;
}

function init() {
  var ret = {};
  Object.keys(styles).forEach(function (name) {
    ret[name] = {
      get: function () {
        return build([name]);
      }
    };
  });
  return ret;
}

defineProps(colors, init());


