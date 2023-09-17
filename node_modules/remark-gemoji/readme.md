# remark-gemoji

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

**[remark][]** plugin to turn gemoji shortcodes (`:+1:`) into emoji (`👍`).

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`unified().use(remarkGemoji)`](#unifieduseremarkgemoji)
*   [Syntax](#syntax)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Security](#security)
*   [Related](#related)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This package is a [unified][] ([remark][]) plugin to turn gemoji shortcodes into
emoji.

**unified** is a project that transforms content with abstract syntax trees
(ASTs).
**remark** adds support for markdown to unified.
**mdast** is the markdown AST that remark uses.
This is a remark plugin that transforms mdast.

## When should I use this?

You can use this plugin to match how GitHub turns gemoji (**G**itHub **E**moji)
shortcodes into emoji.
This plugin does not support other platforms such as Slack and what labels they
support.

A different plugin, [`remark-gfm`][remark-gfm], adds support for GFM (GitHub
Flavored Markdown).
GFM is a set of extensions (autolink literals, footnotes, strikethrough, tables,
and tasklists) to markdown that are supported everywhere on GitHub.

Another plugin, [`remark-frontmatter`][remark-frontmatter], adds support for
YAML frontmatter.
GitHub supports frontmatter for files in Gists and repos.

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm][]:

```sh
npm install remark-gemoji
```

In Deno with [Skypack][]:

```js
import remarkGemoji from 'https://cdn.skypack.dev/remark-gemoji@7?dts'
```

In browsers with [Skypack][]:

```html
<script type="module">
  import remarkGemoji from 'https://cdn.skypack.dev/remark-gemoji@7?min'
</script>
```

## Use

Say we have the following file `example.md`:

```markdown
Thumbs up: :+1:, thumbs down: :-1:.

Families: :family_man_man_boy_boy:

Some flags: :wales:, :scotland:, :england:.
```

And our module `example.js` looks as follows:

```js
import {read} from 'to-vfile'
import {unified} from 'unified'
import remarkParse from 'remark-parse'
import remarkGemoji from 'remark-gemoji'
import remarkStringify from 'remark-stringify'

main()

async function main() {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGemoji)
    .use(remarkStringify)
    .process(await read('example.md'))

  console.log(String(file))
}
```

Now running `node example.js` yields:

```markdown
Thumbs up: 👍, thumbs down: 👎.

Families: 👨‍👨‍👦‍👦

Some flags: 🏴󠁧󠁢󠁷󠁬󠁳󠁿, 🏴󠁧󠁢󠁳󠁣󠁴󠁿, 🏴󠁧󠁢󠁥󠁮󠁧󠁿.
```

## API

This package exports no identifiers.
The default export is `remarkGemoji`.

### `unified().use(remarkGemoji)`

Plugin to turn gemoji shortcodes (`:+1:`) into emoji (`👍`).
There are no options.

## Syntax

This plugin looks for the regular expression `/:(\+1|[-\w]+):/g` in text in
markdown (excluding code and such).
If the value between the two colons matches a know gemoji shortcode, then its
replaced by the corresponding emoji.

In EBNF, the grammar looks as follows:

<pre><code class=language-ebnf><a id=s-gemoji href=#s-gemoji>gemoji</a> ::=  ':' ('+' '1' | <a href=#s-character>character</a>+) ':'
<a id=s-character href=#s-character>character</a> ::= '-' | '_' | <a href=#s-letter>letter</a> | <a href=#s-digit>digit</a>
<a id=s-letter href=#s-letter>letter</a> ::= <a href=#s-letter-lowercase>letterLowercase</a> | <a href=#s-letter-uppercase>letterUppercase</a>
<a id=s-letter-lowercase href=#s-letter-lowercase>letterLowercase</a> ::= 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z'
<a id=s-letter-uppercase href=#s-letter-uppercase>letterUppercase</a> ::= 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z'
<a id=s-digit href=#s-digit>digit</a> ::= '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'
</code></pre>

## Types

This package is fully typed with [TypeScript][].
There are no extra exported types.

## Compatibility

Projects maintained by the unified collective are compatible with all maintained
versions of Node.js.
As of now, that is Node.js 12.20+, 14.14+, and 16.0+.
Our projects sometimes work with older versions, but this is not guaranteed.

This plugin works with `unified` version 3+ and `remark` version 4+.

## Security

Use of `remark-gemoji` does not involve **[rehype][]** (**[hast][]**) or user
content so there are no openings for [cross-site scripting (XSS)][xss] attacks.

## Related

*   [`remark-gfm`](https://github.com/remarkjs/remark-gfm)
    — support GFM (autolink literals, footnotes, strikethrough, tables,
    tasklists)
*   [`remark-github`](https://github.com/remarkjs/remark-github)
    — link references to commits, issues, pull-requests, and users, like on
    GitHub
*   [`remark-breaks`](https://github.com/remarkjs/remark-frontmatter)
    — support hard breaks without needing spaces or escapes
*   [`remark-frontmatter`](https://github.com/remarkjs/remark-frontmatter)
    — support frontmatter (YAML, TOML, and more)

## Contribute

See [`contributing.md`][contributing] in [`remarkjs/.github`][health] for ways
to get started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://github.com/remarkjs/remark-gemoji/workflows/main/badge.svg

[build]: https://github.com/remarkjs/remark-gemoji/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/remarkjs/remark-gemoji.svg

[coverage]: https://codecov.io/github/remarkjs/remark-gemoji

[downloads-badge]: https://img.shields.io/npm/dm/remark-gemoji.svg

[downloads]: https://www.npmjs.com/package/remark-gemoji

[size-badge]: https://img.shields.io/bundlephobia/minzip/remark-gemoji.svg

[size]: https://bundlephobia.com/result?p=remark-gemoji

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/remarkjs/remark/discussions

[npm]: https://docs.npmjs.com/cli/install

[skypack]: https://www.skypack.dev

[health]: https://github.com/remarkjs/.github

[contributing]: https://github.com/remarkjs/.github/blob/HEAD/contributing.md

[support]: https://github.com/remarkjs/.github/blob/HEAD/support.md

[coc]: https://github.com/remarkjs/.github/blob/HEAD/code-of-conduct.md

[license]: license

[author]: https://wooorm.com

[remark]: https://github.com/remarkjs/remark

[unified]: https://github.com/unifiedjs/unified

[xss]: https://en.wikipedia.org/wiki/Cross-site_scripting

[typescript]: https://www.typescriptlang.org

[rehype]: https://github.com/rehypejs/rehype

[hast]: https://github.com/syntax-tree/hast

[remark-gfm]: https://github.com/remarkjs/remark-gfm

[remark-frontmatter]: https://github.com/remarkjs/remark-frontmatter
