module.exports = {
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
  colors: [
    'black',
    'red',
    'green',
    'yellow',
    'blue',
    'magenta',
    'cyan',
    'white'
  ],
  styles:[
    'bold', //粗体
    'faint',
    'italic',
    'underline',
    'blink',
    'overline',
    'inverse',
    'conceal',
    'strike'
  ]
}
