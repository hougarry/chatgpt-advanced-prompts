# rehype-document

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

**[rehype][]** plugin to wrap a fragment in a document.

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`unified().use(rehypeDocument[, options])`](#unifieduserehypedocument-options)
*   [Example](#example)
    *   [Example: language](#example-language)
    *   [Example: CSS](#example-css)
    *   [Example: JS](#example-js)
    *   [Example: metadata and links](#example-metadata-and-links)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Security](#security)
*   [Related](#related)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This package is a [unified][] ([rehype][]) plugin to wrap a fragment in a
document.
It’s especially useful when going from a markdown file that represents an
article and turning it into a complete HTML document.

**unified** is a project that transforms content with abstract syntax trees
(ASTs).
**rehype** adds support for HTML to unified.
**hast** is the HTML AST that rehype uses.
This is a rehype plugin that wraps a fragment in a document.

## When should I use this?

This project is useful when you want to turn a fragment (specifically, some
nodes that can exist in a `<body>` element) into a whole document (a `<html>`,
`<head>`, and `<body>`, where the latter will contain the fragment).

This plugin can make fragments valid whole documents.
It’s not a (social) metadata manager.
That’s done by [`rehype-meta`][rehype-meta].
You can use both together.

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).
In Node.js (version 12.20+, 14.14+, 16.0+, 18.0+), install with [npm][]:

```sh
npm install rehype-document
```

In Deno with [`esm.sh`][esmsh]:

```js
import rehypeDocument from 'https://esm.sh/rehype-document@6'
```

In browsers with [`esm.sh`][esmsh]:

```html
<script type="module">
  import rehypeDocument from 'https://esm.sh/rehype-document@6?bundle'
</script>
```

## Use

Say we have the following file `example.md`:

```markdown
## Hello world!

This is **my** document.
```

And our module `example.js` looks as follows:

```js
import {read} from 'to-vfile'
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeDocument from 'rehype-document'
import rehypeStringify from 'rehype-stringify'

const file = await unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeDocument, {title: 'Hi!'})
  .use(rehypeStringify)
  .process(await read('example.md'))

console.log(String(file))
```

Now running `node example.js` yields:

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Hi!</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
<h2>Hello world!</h2>
<p>This is <strong>my</strong> document.</p>
</body>
</html>
```

## API

This package exports no identifiers.
The default export is `rehypeDocument`.

### `unified().use(rehypeDocument[, options])`

Wrap a fragment in a document.

##### `options`

Configuration (optional).

###### `options.title`

Text to use as title (`string`, default: `stem` of file).

###### `options.language`

Natural language of document (`string`, default: `'en'`).
should be a [BCP 47][bcp47] language tag.

> 👉 **Note**: you should set this if the content isn’t in English.

##### `options.dir`

Direction of text in the document (`'ltr'`, `'rtl'`, `'auto'`, optional).

###### `options.responsive`

Whether to insert a `meta[viewport]` (`boolean`, default: `true`).

###### `options.style`

CSS to include in `head` in `<style>` elements (`string` or `Array<string>`,
default: `[]`).

###### `options.css`

Links to stylesheets to include in `head` (`string` or `Array<string>`,
default: `[]`).

###### `options.meta`

Metadata to include in `head` (`Object` or `Array<Object>`, default: `[]`).
Each object is passed as [`properties`][props] to [`hastscript`][h] with a
`meta` element.

###### `options.link`

Link tags to include in `head` (`Object` or `Array<Object>`, default: `[]`).
Each object is passed as [`properties`][props] to [`hastscript`][h] with a
`link` element.

###### `options.script`

Inline scripts to include at end of `body` (`string` or `Array<string>`,
default: `[]`).

###### `options.js`

External scripts to include at end of `body` (`string` or `Array<string>`,
default: `[]`).

## Example

### Example: language

This example shows how to set a language:

```js
import {unified} from 'unified'
import rehypeParse from 'rehype-parse'
import rehypeDocument from 'rehype-document'
import rehypeStringify from 'rehype-stringify'

const file = await unified()
  .use(rehypeParse, {fragment: true})
  .use(rehypeDocument, {title: 'Плутон', language: 'ru'})
  .use(rehypeStringify)
  .process('<h1>Привет, Плутон!</h1>')

console.log(String(file))
```

Yields:

```html
<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<title>Плутон</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
<h1>Привет, Плутон!</h1>
</body>
</html>
```

### Example: CSS

This example shows how to reference CSS files and include stylesheets:

```js
import {unified} from 'unified'
import rehypeParse from 'rehype-parse'
import rehypeDocument from 'rehype-document'
import rehypeStringify from 'rehype-stringify'

const file = await unified()
  .use(rehypeParse, {fragment: true})
  .use(rehypeDocument, {
    css: 'https://example.com/index.css',
    style: 'body { color: red }'
  })
  .use(rehypeStringify)
  .process('')

console.log(String(file))
```

Yields:

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>body { color: red }</style>
<link rel="stylesheet" href="https://example.com/index.css">
</head>
<body>
</body>
</html>
```

### Example: JS

This example shows how to reference JS files and include scripts:

```js
import {unified} from 'unified'
import rehypeParse from 'rehype-parse'
import rehypeDocument from 'rehype-document'
import rehypeStringify from 'rehype-stringify'

const file = await unified()
  .use(rehypeParse, {fragment: true})
  .use(rehypeDocument, {
    js: 'https://example.com/index.js',
    script: 'console.log(1)'
  })
  .use(rehypeStringify)
  .process('')

console.log(String(file))
```

Yields:

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
<script>console.log(1)</script>
<script src="https://example.com/index.js"></script>
</body>
</html>
```

### Example: metadata and links

This example shows how to define metadata and include links (other than styles):

```js
import {unified} from 'unified'
import rehypeParse from 'rehype-parse'
import rehypeDocument from 'rehype-document'
import rehypeStringify from 'rehype-stringify'

const file = await unified()
  .use(rehypeParse, {fragment: true})
  .use(rehypeDocument, {
    link: [
      {rel: 'icon', href: '/favicon.ico', sizes: 'any'},
      {rel: 'icon', href: '/icon.svg', type: 'image/svg+xml'}
    ],
    meta: [{name: 'generator', content: 'rehype-document'}]
  })
  .use(rehypeStringify)
  .process('')

console.log(String(file))
```

Yields:

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="generator" content="rehype-document">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
</head>
<body>
</body>
</html>
```

> 💡 **Tip**: [`rehype-meta`][rehype-meta] is a (social) metadata manager.

## Types

This package is fully typed with [TypeScript][].
It exports an `Options` type, which specifies the interface of the accepted
options.

## Compatibility

Projects maintained by the unified collective are compatible with all maintained
versions of Node.js.
As of now, that is Node.js 12.20+, 14.14+, 16.0+, and 18.0+.
Our projects sometimes work with older versions, but this is not guaranteed.

This plugin works with `rehype-parse` version 3+, `rehype-stringify` version 3+,
`rehype` version 5+, and `unified` version 6+.

## Security

Use of `rehype-document` can open you up to a [cross-site scripting (XSS)][xss]
attack if you pass user provided content in options.
Always be wary of user input and use [`rehype-sanitize`][rehype-sanitize].

## Related

*   [`rehype-meta`](https://github.com/rehypejs/rehype-meta)
    — add metadata to the head of a document
*   [`rehype-format`](https://github.com/rehypejs/rehype-format)
    — format HTML
*   [`rehype-minify`](https://github.com/rehypejs/rehype-minify)
    — minify HTML

## Contribute

See [`contributing.md`][contributing] in [`rehypejs/.github`][health] for ways
to get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://github.com/rehypejs/rehype-document/workflows/main/badge.svg

[build]: https://github.com/rehypejs/rehype-document/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/rehypejs/rehype-document.svg

[coverage]: https://codecov.io/github/rehypejs/rehype-document

[downloads-badge]: https://img.shields.io/npm/dm/rehype-document.svg

[downloads]: https://www.npmjs.com/package/rehype-document

[size-badge]: https://img.shields.io/bundlephobia/minzip/rehype-document.svg

[size]: https://bundlephobia.com/result?p=rehype-document

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/rehypejs/rehype/discussions

[esmsh]: https://esm.sh

[npm]: https://docs.npmjs.com/cli/install

[health]: https://github.com/rehypejs/.github

[contributing]: https://github.com/rehypejs/.github/blob/HEAD/contributing.md

[support]: https://github.com/rehypejs/.github/blob/HEAD/support.md

[coc]: https://github.com/rehypejs/.github/blob/HEAD/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[unified]: https://github.com/unifiedjs/unified

[rehype]: https://github.com/rehypejs/rehype

[bcp47]: https://tools.ietf.org/html/bcp47

[props]: https://github.com/syntax-tree/hastscript#hselector-properties-children

[h]: https://github.com/syntax-tree/hastscript

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting

[typescript]: https://www.typescriptlang.org

[rehype-sanitize]: https://github.com/rehypejs/rehype-sanitize

[rehype-meta]: https://github.com/rehypejs/rehype-meta
