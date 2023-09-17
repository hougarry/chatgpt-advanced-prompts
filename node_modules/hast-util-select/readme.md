# hast-util-select

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[hast][] utility with equivalents for `querySelector`, `querySelectorAll`,
and `matches`.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`matches(selector, node[, space])`](#matchesselector-node-space)
    *   [`select(selector, tree[, space])`](#selectselector-tree-space)
    *   [`selectAll(selector, tree[, space])`](#selectallselector-tree-space)
    *   [`Space`](#space)
*   [Support](#support)
*   [Unsupported](#unsupported)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Security](#security)
*   [Related](#related)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This package lets you find nodes in a tree, similar to how `querySelector`,
`querySelectorAll`, and `matches` work with the DOM.

One notable difference between DOM and hast is that DOM nodes have references
to their parents, meaning that `document.body.matches(':last-child')` can
be evaluated to check whether the body is the last child of its parent.
This information is not stored in hast, so selectors like that don’t work.

## When should I use this?

This is a small utility that is quite useful, but is rather slow if you use it a
lot.
For each call, it has to walk the entire tree.
In some cases, walking the tree once with [`unist-util-visit`][unist-util-visit]
is smarter, such as when you want to change certain nodes.
On the other hand, this is quite powerful and fast enough for many other cases.

This utility is similar to [`unist-util-select`][unist-util-select], which can
find and match any unist node.

## Install

This package is [ESM only][esm].
In Node.js (version 14.14+ and 16.0+), install with [npm][]:

```sh
npm install hast-util-select
```

In Deno with [`esm.sh`][esmsh]:

```js
import {matches, select, selectAll} from "https://esm.sh/hast-util-select@5"
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import {matches, select, selectAll} from "https://esm.sh/hast-util-select@5?bundle"
</script>
```

## Use

```js
import {h} from 'hastscript'
import {matches, select, selectAll} from 'hast-util-select'

const tree = h('section', [
  h('p', 'Alpha'),
  h('p', 'Bravo'),
  h('h1', 'Charlie'),
  h('p', 'Delta'),
  h('p', 'Echo'),
  h('p', 'Foxtrot'),
  h('p', 'Golf')
])

matches('section', tree) // `true`

console.log(select('h1 ~ :nth-child(even)', tree))
// The paragraph with `Delta`

console.log(selectAll('h1 ~ :nth-child(even)', tree))
// The paragraphs with `Delta` and `Foxtrot`
```

## API

This package exports the identifiers [`matches`][matches], [`select`][select],
and [`selectAll`][selectall].
There is no default export.

### `matches(selector, node[, space])`

Check that the given `node` matches `selector`.

This only checks the element itself, not the surrounding tree.
Thus, nesting in selectors is not supported (`p b`, `p > b`), neither are
selectors like `:first-child`, etc.
This only checks that the given element matches the selector.

###### Parameters

*   `selector` (`string`)
    — CSS selector, such as (`h1`, `a, b`)
*   `node` ([`Node`][node], optional)
    — node that might match `selector`, should be an element
*   `space` ([`Space`][space], default: `'html'`)
    — name of namespace

###### Returns

Whether `node` matches `selector` (`boolean`).

###### Example

```js
import {h} from 'hastscript'
import {matches} from 'hast-util-select'

matches('b, i', h('b')) // => true
matches(':any-link', h('a')) // => false
matches(':any-link', h('a', {href: '#'})) // => true
matches('.classy', h('a', {className: ['classy']})) // => true
matches('#id', h('a', {id: 'id'})) // => true
matches('[lang|=en]', h('a', {lang: 'en'})) // => true
matches('[lang|=en]', h('a', {lang: 'en-GB'})) // => true
```

### `select(selector, tree[, space])`

Select the first element that matches `selector` in the given `tree`.
Searches the tree in *[preorder][]*.

###### Parameters

*   `selector` (`string`)
    — CSS selector, such as (`h1`, `a, b`)
*   `tree` ([`Node`][node], optional)
    — tree to search
*   `space` ([`Space`][space], default: `'html'`)
    — name of namespace

###### Returns

First element in `tree` that matches `selector` or `null` if nothing is found.
This could be `tree` itself.

###### Example

```js
import {h} from 'hastscript'
import {select} from 'hast-util-select'

console.log(
  select(
    'h1 ~ :nth-child(even)',
    h('section', [
      h('p', 'Alpha'),
      h('p', 'Bravo'),
      h('h1', 'Charlie'),
      h('p', 'Delta'),
      h('p', 'Echo')
    ])
  )
)
```

Yields:

```js
{ type: 'element',
  tagName: 'p',
  properties: {},
  children: [ { type: 'text', value: 'Delta' } ] }
```

### `selectAll(selector, tree[, space])`

Select all elements that match `selector` in the given `tree`.
Searches the tree in *[preorder][]*.

###### Parameters

*   `selector` (`string`)
    — CSS selector, such as (`h1`, `a, b`)
*   `tree` ([`Node`][node], optional)
    — tree to search
*   `space` ([`Space`][space], default: `'html'`)
    — name of namespace

###### Returns

Elements in `tree` that match `selector`.
This could include `tree` itself.

###### Example

```js
import {h} from 'hastscript'
import {selectAll} from 'hast-util-select'

console.log(
  selectAll(
    'h1 ~ :nth-child(even)',
    h('section', [
      h('p', 'Alpha'),
      h('p', 'Bravo'),
      h('h1', 'Charlie'),
      h('p', 'Delta'),
      h('p', 'Echo'),
      h('p', 'Foxtrot'),
      h('p', 'Golf')
    ])
  )
)
```

Yields:

```js
[ { type: 'element',
    tagName: 'p',
    properties: {},
    children: [ { type: 'text', value: 'Delta' } ] },
  { type: 'element',
    tagName: 'p',
    properties: {},
    children: [ { type: 'text', value: 'Foxtrot' } ] } ]
```

### `Space`

Namespace (TypeScript type).

###### Type

```ts
type Space = 'html' | 'svg'
```

## Support

*   [x] `*` (universal selector)
*   [x] `,` (multiple selector)
*   [x] `p` (type selector)
*   [x] `.class` (class selector)
*   [x] `#id` (id selector)
*   [x] `article p` (combinator: descendant selector)
*   [x] `article > p` (combinator: child selector)
*   [x] `h1 + p` (combinator: next-sibling selector)
*   [x] `h1 ~ p` (combinator: subsequent sibling selector)
*   [x] `[attr]` (attribute existence)
*   [x] `[attr=value]` (attribute equality)
*   [x] `[attr~=value]` (attribute contains in space-separated list)
*   [x] `[attr|=value]` (attribute equality or prefix)
*   [x] `[attr^=value]` (attribute begins with)
*   [x] `[attr$=value]` (attribute ends with)
*   [x] `[attr*=value]` (attribute contains)
*   [x] `:any()` (functional pseudo-class, use `:matches` instead)
*   [x] `:dir()` (functional pseudo-class)
*   [x] `:has()` (functional pseudo-class)
*   [x] `:lang()` (functional pseudo-class)
*   [x] `:matches()` (functional pseudo-class)
*   [x] `:not()` (functional pseudo-class)
*   [x] `:any-link` (pseudo-class)
*   [x] `:blank` (pseudo-class)
*   [x] `:checked` (pseudo-class)
*   [x] `:disabled` (pseudo-class)
*   [x] `:empty` (pseudo-class)
*   [x] `:enabled` (pseudo-class)
*   [x] `:optional` (pseudo-class)
*   [x] `:read-only` (pseudo-class)
*   [x] `:read-write` (pseudo-class)
*   [x] `:required` (pseudo-class)
*   [x] `:root` (pseudo-class)
*   [x] `:scope` (pseudo-class):
*   [x] \* `:first-child` (pseudo-class)
*   [x] \* `:first-of-type` (pseudo-class)
*   [x] \* `:last-child` (pseudo-class)
*   [x] \* `:last-of-type` (pseudo-class)
*   [x] \* `:only-child` (pseudo-class)
*   [x] \* `:only-of-type` (pseudo-class)
*   [x] \* `:nth-child()` (functional pseudo-class)
*   [x] \* `:nth-last-child()` (functional pseudo-class)
*   [x] \* `:nth-last-of-type()` (functional pseudo-class)
*   [x] \* `:nth-of-type()` (functional pseudo-class)

## Unsupported

*   [ ] † `||` (column combinator)
*   [ ] ‡ `ns|E` (namespace type selector)
*   [ ] ‡ `*|E` (any namespace type selector)
*   [ ] ‡ `|E` (no namespace type selector)
*   [ ] ‡ `[ns|attr]` (namespace attribute)
*   [ ] ‡ `[*|attr]` (any namespace attribute)
*   [ ] ‡ `[|attr]` (no namespace attribute)
*   [ ] ‡ `[attr=value i]` (attribute case-insensitive)
*   [ ] ‡ `:has()` (functional pseudo-class, note: relative selectors such as
    `:has(> img)` are not supported, but scope is: `:has(:scope > img)`)
*   [ ] ‖ `:nth-child(n of S)` (functional pseudo-class, note: scoping to
    parents is not supported)
*   [ ] ‖ `:nth-last-child(n of S)` (functional pseudo-class, note: scoping to
    parents is not supported)
*   [ ] † `:active` (pseudo-class)
*   [ ] † `:current` (pseudo-class)
*   [ ] † `:current()` (functional pseudo-class)
*   [ ] † `:default` (pseudo-class)
*   [ ] † `:defined` (pseudo-class)
*   [ ] † `:drop` (pseudo-class)
*   [ ] † `:drop()` (functional pseudo-class)
*   [ ] † `:focus` (pseudo-class)
*   [ ] † `:focus-visible` (pseudo-class)
*   [ ] † `:focus-within` (pseudo-class)
*   [ ] † `:fullscreen` (pseudo-class)
*   [ ] † `:future` (pseudo-class)
*   [ ] ‖ `:host()` (functional pseudo-class)
*   [ ] ‖ `:host-context()` (functional pseudo-class)
*   [ ] † `:hover` (pseudo-class)
*   [ ] § `:in-range` (pseudo-class)
*   [ ] † `:indeterminate` (pseudo-class)
*   [ ] § `:invalid` (pseudo-class)
*   [ ] † `:link` (pseudo-class)
*   [ ] † `:local-link` (pseudo-class)
*   [ ] † `:nth-column()` (functional pseudo-class)
*   [ ] † `:nth-last-column()` (functional pseudo-class)
*   [ ] § `:out-of-range` (pseudo-class)
*   [ ] † `:past` (pseudo-class)
*   [ ] † `:paused` (pseudo-class)
*   [ ] † `:placeholder-shown` (pseudo-class)
*   [ ] † `:playing` (pseudo-class)
*   [ ] ‖ `:something()` (functional pseudo-class)
*   [ ] † `:target` (pseudo-class)
*   [ ] † `:target-within` (pseudo-class)
*   [ ] † `:user-error` (pseudo-class)
*   [ ] † `:user-invalid` (pseudo-class)
*   [ ] § `:valid` (pseudo-class)
*   [ ] † `:visited` (pseudo-class)
*   [ ] † `::before` (pseudo-elements: none are supported)

###### Notes

*   \* — not supported in `matches`
*   † — needs a user, browser, interactivity, or scripting to make sense
*   ‡ — not supported by the underlying algorithm
*   § — not very interested in writing / including the code for this
*   ‖ — too new, the spec is still changing

## Types

This package is fully typed with [TypeScript][].
It exports the additional type [`Space`][space].

## Compatibility

Projects maintained by the unified collective are compatible with all maintained
versions of Node.js.
As of now, that is Node.js 14.14+ and 16.0+.
Our projects sometimes work with older versions, but this is not guaranteed.

## Security

This package does not change the syntax tree so there are no openings for
[cross-site scripting (XSS)][xss] attacks.

## Related

*   [`unist-util-select`](https://github.com/syntax-tree/unist-util-select)
    — select unist nodes with CSS-like selectors
*   [`hast-util-find-and-replace`](https://github.com/syntax-tree/hast-util-find-and-replace)
    — find and replace text in a hast tree
*   [`hast-util-parse-selector`](https://github.com/syntax-tree/hast-util-parse-selector)
    — create an element from a simple CSS selector
*   [`hast-util-from-selector`](https://github.com/syntax-tree/hast-util-from-selector)
    — create an element from a complex CSS selector

## Contribute

See [`contributing.md`][contributing] in [`syntax-tree/.github`][health] for
ways to get started.
See [`support.md`][help] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://github.com/syntax-tree/hast-util-select/workflows/main/badge.svg

[build]: https://github.com/syntax-tree/hast-util-select/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/syntax-tree/hast-util-select.svg

[coverage]: https://codecov.io/github/syntax-tree/hast-util-select

[downloads-badge]: https://img.shields.io/npm/dm/hast-util-select.svg

[downloads]: https://www.npmjs.com/package/hast-util-select

[size-badge]: https://img.shields.io/bundlephobia/minzip/hast-util-select.svg

[size]: https://bundlephobia.com/result?p=hast-util-select

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/syntax-tree/unist/discussions

[npm]: https://docs.npmjs.com/cli/install

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[esmsh]: https://esm.sh

[typescript]: https://www.typescriptlang.org

[license]: license

[author]: https://wooorm.com

[health]: https://github.com/syntax-tree/.github

[contributing]: https://github.com/syntax-tree/.github/blob/main/contributing.md

[help]: https://github.com/syntax-tree/.github/blob/main/support.md

[coc]: https://github.com/syntax-tree/.github/blob/main/code-of-conduct.md

[preorder]: https://github.com/syntax-tree/unist#preorder

[hast]: https://github.com/syntax-tree/hast

[node]: https://github.com/syntax-tree/hast#nodes

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting

[unist-util-visit]: https://github.com/syntax-tree/unist-util-visit

[unist-util-select]: https://github.com/syntax-tree/unist-util-select

[matches]: #matchesselector-node-space

[select]: #selectselector-tree-space

[selectall]: #selectallselector-tree-space

[space]: #space
