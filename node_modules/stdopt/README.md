# stdopt

Wrap and validate optional values

## Usage

This package provides wrappers to check inputs and provide fallbacks. There is a general `opt` wrapper to check if a value is defined or not, as well as a handful of others for various primitives. The chained syntax is more verbose than the standard JS way (i.e. `var str = opts.str || 'default'`), but it is more solid and predictable.

```js
var opt = require('stdopt/opt')
opt('some data').value() // => 'some data'
opt(null).or('other data').value() // => 'other data'
opt(null).or(undefined).value() // => throws error

// string primitive
var string = require('stdopt/string')
string('some text').value() // => 'some text'
string(true).or('other text').value() // => 'other text'
string(5).value() // => '5'

// number primitive
var number = require('stdopt/number')
number(5).value() // => 5
number(true).or(7).value() // => 7
number('11').value() // => 11

// boolean primitive
var boolean = require('stdopt/boolean')
boolean(false).value() // => false
boolean(null).or(true).value() // => true
boolean('True').value() // => true
boolean('fAlSe').value() // => false

// hash primitive
var hash = require('stdopt/hash')
hash({stuff: true}).value() // => {stuff: true}
hash(true).or({other: false}).value() // => {other: false}
hash([1, 2, 3]).value() // => throws error

// list primitive
var list = require('stdopt/list')
list([1, 2, 3]).value() // => [1, 2, 3]
list(true).or([4, 5, 6]).value() // => [4, 5, 6]
list({0: 'stuff', length: 1}).value() // => ['stuff']

// convert any type to singleton list
opt('some data').list() // => ['some data']
string('some string').list() // => ['some string']
number(5).list() // => [5]
boolean(true).list() // => [true]
hash({stuff: true}).list() // => [{stuff: true}]
list([1, 2, 3]).list() // same as list#value
```

## Custom

You can also create your own custom primitives, using the `Base` class and a custom `isValid` method.

```js
var Base = require('stdopt/base')
var lowercase = Base.implement('lowercase string')

lowercase.isValid = function (value) {
  return typeof value === 'string' && value.toLowerCase() === value
}

lowercase('oh.').value() // => 'oh.'
lowercase('AHA!').or('oh.').value() // => 'oh.'
lowercase('AHA!').value() // => throws error
```

## License

Apache-2.0
