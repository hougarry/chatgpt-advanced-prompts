@uiw/github-corners
===

[![CI](https://github.com/uiwjs/react-github-corners/actions/workflows/ci.yml/badge.svg)](https://github.com/uiwjs/react-github-corners/actions/workflows/ci.yml)
[![jsDelivr CDN](https://data.jsdelivr.com/v1/package/npm/@uiw/github-corners/badge?style=rounded)](https://www.jsdelivr.com/package/npm/@uiw/github-corners)
[![NPM Downloads](https://img.shields.io/npm/dm/@uiw/github-corners.svg?style=flat)](https://www.npmjs.com/package/@uiw/github-corners)
[![npm version](https://img.shields.io/npm/v/@uiw/github-corners.svg?label=github-corners)](https://www.npmjs.com/package/@uiw/github-corners)
[![Open in unpkg](https://img.shields.io/badge/Open%20in-unpkg-blue)](https://uiwjs.github.io/npm-unpkg/#/pkg/@uiw/github-corners/file/README.md)

Add a Github corner to your project page, This [GitHub corners](https://uiwjs.github.io/react-github-corners) for [**@react**](https://github.com/facebook/react) component. Visit [https://uiwjs.github.io/react-github-corners](https://uiwjs.github.io/react-github-corners) to preview the example effects.

## Installation

Add `@uiw/github-corners` to your project:

```bash
npm i @uiw/github-corners
```

Or load the directly through unpkg

unpkg.com CDN:

```html
<script src="https://unpkg.com/@uiw/github-corners"></script>
```

Skypack CDN:

```html
<script src="https://cdn.skypack.dev/@uiw/github-corners"></script>
```

## Usage

Import into your script:

```jsx
import "@uiw/github-corners";
```

Use it in your HTML:

```html
<github-corners target="__blank" position="fixed" href="https://github.com/uiwjs/react-github-corners"></github-corners>
```

Learn about web components [here](https://developer.mozilla.org/en-US/docs/Web/Web_Components).

Using web components in React:

```jsx
import React from 'react';
import '@uiw/github-corners';

function Demo() {
  return (
    <github-corners target="__blank" position="fixed" href="https://github.com/uiwjs/react-github-corners"></github-corners>
  );
}
```

## Contributors

As always, thanks to our amazing contributors!

<a href="https://github.com/uiwjs/react-github-corners/graphs/contributors">
  <img src="https://uiwjs.github.io/react-github-corners/CONTRIBUTORS.svg" />
</a>

Made with [action-contributors](https://github.com/jaywcjlove/github-action-contributors).

## License

Licensed under the MIT License.
