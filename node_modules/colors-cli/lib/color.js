/**
 *
 * [The opaque named colors](https://drafts.csswg.org/css-color/#named-colors)
 * [ANSI Escape sequences](http://ascii-table.com/ansi-escape-sequences.php)
 * [ANSI escape code](https://en.wikipedia.org/wiki/ANSI_escape_code)
 * [Linux Shell Scripting Tutorial](http://www.freeos.com/guides/lsst/misc.htm#colorfunandmore)
 *
 * [tip colors and formatting](http://misc.flogisoft.com/bash/tip_colors_and_formatting)
 *
 */

var _styles = require('./styles-name')
var isSupported = require('./supports-colors')
var colors = _styles.colors;
var styles = _styles.styles;

exports.color = {}

function Colors(str){
  this.string = str;
  this.styles = [];
  this.fgcolor = null;    // Foreground
  this.bgcolor = null;    // Background
  this.fgcolor_bt = null; // Bright Foreground
  this.bgcolor_bt = null; // Bright Background
  this.fgcolor_x = null;  // 256 Foreground
  this.bgcolor_x = null; // 256 Background
}

// 字背景颜色范围:40~49
// 40:黑, 41:深红, 42:绿, 43:黄色, 44:蓝色, 45:紫色, 46:深绿, 47:白色,
// 字颜色:30~39
// 30:黑, 31:红, 32:绿, 33:黄, 34:蓝色, 35:紫色, 36:深绿, 37:白色,
//
// echo -e "\x1b[31;1m color red underline \x1b[0m"
// 1m 亮的颜色，默认不给是暗淡的颜色
//
// |    ANSI |    ANSI |    ANSI    |                | Aixterm | Aixterm
// |   Color | FG Code | BG Code    | Bright Color   | FG Code | BG Code
// +---------+---------+--------    +----------------+---------+--------
// |   Black |      30 |      40    |   Bright Black |      90 |     100
// |     Red |      31 |      41    |     Bright Red |      91 |     101
// |   Green |      32 |      42    |   Bright Green |      92 |     102
// |  Yellow |      33 |      43    |  Bright Yellow |      93 |     103
// |    Blue |      34 |      44    |    Bright Blue |      94 |     104
// | Magenta |      35 |      45    | Bright Magenta |      95 |     105
// |    Cyan |      36 |      46    |    Bright Cyan |      96 |     106
// |   White |      37 |      47    |   Bright White |      97 |     107
//

for (var i = 0; i < colors.length; i++) {
  (function(i){
    var name = colors[i];
    Object.defineProperty(Colors.prototype, name, {
      get: function() {
        // Foreground 前景色
        this.fgcolor = i;
        return this;
      }
    });
    Object.defineProperty(Colors.prototype, name + '_b', {
      get: function () {
        // Background 背景色
        this.bgcolor = i;
        return this;
      }
    });
    Object.defineProperty(Colors.prototype, name + '_bt', {
      get: function () {
        // Bright Foreground 明亮 前景色
        this.fgcolor_bt = i;
        return this;
      }
    });
    Object.defineProperty(Colors.prototype, name + '_bbt', {
      get: function () {
        // Bright Background 明亮 背景色
        this.bgcolor_bt = i;
        return this;
      }
    });

    exports.color[name] = exports[name] = function(text) {
      if (!isSupported) return text;
      return '\x1b[' + (30 + i) + 'm' + text + '\x1b[0m';
    };
    exports.color[name + '_b'] = exports[name + '_b'] = function(text) {
      if (!isSupported) return text;
      return '\x1b[' + (40 + i) + 'm' + text + '\x1b[0m';
    };

    exports.color[name + '_bt'] = exports[name + '_bt'] = function(text) {
      if (!isSupported) return text;
      return '\x1b[' + (90 + i) + 'm' + text + '\x1b[0m';
    };
    exports.color[name + '_bbt'] = exports[name + '_bbt'] = function(text) {
      if (!isSupported) return text;
      return '\x1b[' + (100 + i) + 'm' + text + '\x1b[0m';
    };
  })(i)
}


for (var i = 0; i < 256; i++) {
  (function(i){
    Object.defineProperty(Colors.prototype, 'x'+i, {
      get: function() {
        this.fgcolor_x = i;
        return this;
      }
    });
    Object.defineProperty(Colors.prototype, 'xb'+i, {
      get: function() {
        this.bgcolor_x = i;
        return this;
      }
    });

    exports.color['x'+i] = exports['x'+i] = function(text) {
      if (!isSupported) return text;
      return '\x1b[38;5;' + i + 'm' + text + '\x1b[0m';
    };

    exports.color['xb'+i] = exports['xb'+i] = function(text) {
      if (!isSupported) return text;
      return '\x1b[48;5;' + i + 'm' + text + '\x1b[0m';
    };
  })(i)
}
/**
 * ANSI控制码的说明
 *
 * 33[0m 关闭所有属性
 * 33[1m 设置高亮度
 * 33[4m 下划线
 * 33[5m 闪烁
 * 33[7m 反显
 * 33[8m 消隐
 * 33[30m -- 33[37m 设置前景色
 * 33[40m -- 33[47m 设置背景色
 * 33[nA 光标上移n行
 * 33[nB 光标下移n行
 * 33[nC 光标右移n行
 * 33[nD 光标左移n行
 * 33[y;xH设置光标位置
 * 33[2J 清屏
 * 33[K 清除从光标到行尾的内容
 * 33[s 保存光标位置
 * 33[u 恢复光标位置
 * 33[?25l 隐藏光标
 * 33[?25h 显示光标
 */

for (var i = 0; i < styles.length; i++) {
  (function(i) {
    var name = styles[i];
    Object.defineProperty(Colors.prototype, name, {
      get: function() {
        if (this.styles.indexOf(i) === -1) {
          this.styles = this.styles.concat(i + 1);
        }
        return this;
      }
    });
    exports.color[name] = exports[name] = function(text) {
      if (!isSupported) return text;
      return '\x1b[' + (i + 1) + 'm' + text + '\x1b[0m';
    };
  })(i);
}

Colors.prototype.colored = function (text) {
  var reset = '\x1b[0m';
  var is256 = isSupported;
  // 256 Foreground 256 前景色
  if (this.fgcolor_x && this.fgcolor_x !== null && is256) {
    text = '\x1b[38;5;' + this.fgcolor_x + 'm' + text + reset;
  }
  // 256 Foreground 256 前景色
  if (this.bgcolor_x && this.bgcolor_x !== null && is256) {
    text = '\x1b[48;5;' + this.bgcolor_x + 'm' + text + reset;
  }
  // Foreground 前景色
  if (this.fgcolor !== null && this.fgcolor < 8) {
    text = '\x1b[' + (30 + this.fgcolor) + 'm' + text + reset;
  }
  // Bright Foreground 亮 前景色
  if (this.fgcolor_bt !== null && this.fgcolor_bt < 8) {
    text = '\x1b[' + (90 + this.fgcolor_bt) + 'm' + text + reset;
  }
  // Background 背景色
  if (this.bgcolor !== null && this.bgcolor < 8) {
    text = '\x1b[' + (40 + this.bgcolor) + 'm' + text + reset;
  }
  // Bright Background 亮 背景色
  if (this.bgcolor_bt !== null && this.bgcolor_bt < 8) {
    text = '\x1b[' + (100 + this.bgcolor_bt) + 'm' + text + reset;
  }

  if (this.styles && this.styles.length) {
    text = '\x1b[' + this.styles.join(';') + 'm' + text + reset;
  }
  return text;
}

Colors.prototype.valueOf = function(type){
  var text = this.string;
  text = this.colored(text);
  return text;
}

exports.Colors = Colors;
