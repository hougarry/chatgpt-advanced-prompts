Markdown Style
===

[![CI](https://github.com/jaywcjlove/markdown-style/actions/workflows/ci.yml/badge.svg)](https://github.com/jaywcjlove/markdown-style/actions/workflows/ci.yml)
[![jsDelivr CDN](https://data.jsdelivr.com/v1/package/npm/@wcj/markdown-style/badge?style=rounded)](https://www.jsdelivr.com/package/npm/@wcj/markdown-style)
[![npm version](https://img.shields.io/npm/v/@wcj/markdown-style.svg)](https://www.npmjs.com/package/@wcj/markdown-style)
[![Open in unpkg](https://img.shields.io/badge/Open%20in-unpkg-blue)](https://uiwjs.github.io/npm-unpkg/#/pkg/@wcj/markdown-style/file/README.md)

Integrate markdown styles into web components, Markdown CSS styles will not be conflicted. The minimal amount of CSS to replicate the GitHub Markdown style. Support dark-mode/night mode.

## Installation

```bash
npm install --save @wcj/markdown-style
```

Or load the ES module directly through unpkg

unpkg.com CDN:

```html
<script src="https://unpkg.com/@wcj/markdown-style"></script>
```

Skypack CDN:

```html
<script src="https://cdn.skypack.dev/@wcj/markdown-style"></script>
```

## Usage

Use it in your HTML:

```html
<markdown-style>
  <!-- markdown html is here -->
  <h1>Markdown HTML</h1>
</markdown-style>
```

Learn about web components [here](https://developer.mozilla.org/en-US/docs/Web/Web_Components).

Using it in your React:

```jsx
import React from 'react';
import '@wcj/markdown-style';

function Demo() {
  return (
    <markdown-style>
      <h1>Markdown Style</h1>
    </markdown-style>
  );
}
```

Convert markdown to html and add markdown style to it:

```html
<script src="https://unpkg.com/@wcj/markdown-to-html/dist/markdown.min.js"></script>
<script src="https://unpkg.com/@wcj/markdown-style"></script>
<markdown-style>
\```jsx
import React from 'react';
import 'markdown-style';

function Demo() {
  return (
    <markdown-style>
      <h1>Markdown Style</h1>
    </markdown-style>
  );
}
\```
</markdown-style>
<script>
  const mdstr = document.querySelector('markdown-style');
  mdstr.innerHTML = markdown.default(mdstr.textContent);
</script>
```

## Support dark-mode/night-mode

By default, the [dark-mode](https://github.com/jaywcjlove/dark-mode/) is automatically switched according to the system. If you need to switch manually, just set the `data-color-mode="dark"` parameter for `<html>`.

```html
<html data-color-mode="dark">
```

```js
document.documentElement.setAttribute('data-color-mode', 'dark')
document.documentElement.setAttribute('data-color-mode', 'light')
```

Set the theme, do not automatically switch with the system:

```html
<markdown-style theme="dark">
  <h1>Markdown Style</h1>
</markdown-style>
```

## Contributors

As always, thanks to our amazing contributors!

<a href="https://github.com/jaywcjlove/markdown-style/graphs/contributors">
  <img src="https://jaywcjlove.github.io/markdown-style/CONTRIBUTORS.svg" />
</a>

Made with [github-action-contributors](https://github.com/jaywcjlove/github-action-contributors).

## License

Licensed under the [MIT License](https://opensource.org/licenses/MIT).
