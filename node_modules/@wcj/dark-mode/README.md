dark-mode
===

[![CI](https://github.com/jaywcjlove/dark-mode/actions/workflows/ci.yml/badge.svg)](https://github.com/jaywcjlove/dark-mode/actions/workflows/ci.yml)
[![jsDelivr CDN](https://data.jsdelivr.com/v1/package/npm/@wcj/dark-mode/badge?style=rounded)](https://www.jsdelivr.com/package/npm/@wcj/dark-mode)
[![NPM Downloads](https://img.shields.io/npm/dm/@wcj/dark-mode.svg?style=flat)](https://www.npmjs.com/package/@wcj/dark-mode)
[![npm version](https://img.shields.io/npm/v/@wcj/dark-mode.svg)](https://www.npmjs.com/package/@wcj/dark-mode)
[![Open in unpkg](https://img.shields.io/badge/Open%20in-unpkg-blue)](https://uiwjs.github.io/npm-unpkg/#/pkg/@wcj/dark-mode/file/README.md)

A custom element that allows you to easily put a Dark Mode 🌒 toggle. so you can initially adhere to your users' preferences according to [`prefers-color-scheme`](https://drafts.csswg.org/mediaqueries-5/#prefers-color-scheme), but also allow them to (optionally permanently) override their system setting for just your site.

## Installation

Install from npm:

```bash
npm install --save @wcj/dark-mode
```

Or, alternatively, use a `<script defer>` tag (served from unpkg's CDN):

CDN: [UNPKG](https://unpkg.com/@wcj/dark-mode/dist/) | [jsDelivr](https://cdn.jsdelivr.net/npm/@wcj/dark-mode/) | [Githack](https://raw.githack.com/jaywcjlove/dark-mode/gh-pages/dark-mode.min.js) | [Statically](https://cdn.statically.io/gh/jaywcjlove/dark-mode/gh-pages/dark-mode.min.js)

```html
<script src="https://unpkg.com/@wcj/dark-mode"></script>
```

## Usage

There are two ways how you can use `<dark-mode>`:

```html
<dark-mode></dark-mode>
<dark-mode light="Dark" dark="Light"></dark-mode>
<dark-mode dark="Dark" light="Light" style="border: 1px solid red; font-size: 12px;"></dark-mode>
```

Use in [React](https://github.com/facebook/react):

```jsx
import React from 'react';
import '@wcj/dark-mode';

function Demo() {
  return (
    <div>
      <dark-mode permanent light="Light" dark="Dark"></dark-mode>
    </div>
  );
}
```

Toggle in JavaScript: 

```js
const toggle = document.querySelector('dark-mode');
const button = document.createElement('button');
button.textContent = 'Change Theme';
button.onclick = () => {
  const theme = document.documentElement.dataset.colorMode;
  // or => const theme = toggle.mode
  document.documentElement.setAttribute('data-color-mode', theme === 'light' ? 'dark' : 'light');
}
document.body.appendChild(button);
// Listen for toggle changes
// and toggle the `dark` class accordingly.
document.addEventListener('colorschemechange', (e) => {
  console.log(`Color scheme changed to "${e.detail.colorScheme}" or "${toggle.mode}".`);
  button.textContent = toggle.mode === 'dark' ? 'Change Theme 🌞' : 'Change Theme 🌒';
});
```

Interacting with the custom element:

```js
const darkMode = document.querySelector('dark-mode');

// Set the mode to dark
darkMode.mode = 'dark';
// Set the mode to light
darkMode.mode = 'light';
// Set the mode to dark
document.documentElement.setAttribute('data-color-mode', 'dark');
// Set the mode to light
document.documentElement.setAttribute('data-color-mode', 'light');

// Set the light label to "off"
darkMode.light = 'off';
// Set the dark label to "on"
darkMode.dark = 'on';

// Set a "remember the last selected mode" label
darkMode.permanent = true;

// Remember the user's last color scheme choice
darkModeToggle.setAttribute('permanent', false);
// Forget the user's last color scheme choice
darkModeToggle.removeAttribute('permanent');
```

Reacting on color scheme changes:

```js
/* On the page */
document.addEventListener('colorschemechange', (e) => {
  console.log(`Color scheme changed to ${e.detail.colorScheme}.`);
});
```

Reacting on "remember the last selected mode" functionality changes:

```js
/* On the page */
document.addEventListener('permanentcolorscheme', (e) => {
  console.log(`${e.detail.permanent ? 'R' : 'Not r'}emembering the last selected mode.`);
});
```

## Properties

Properties can be set directly on the custom element at creation time, or dynamically via JavaScript.

```typescript
export type ColorScheme = 'light' | 'dark';
export class DarkMode extends HTMLElement {
  mode?: ColorScheme;
  /**
   * Defaults to not remember the last choice.
   * If present remembers the last selected mode (`dark` or `light`),
   * which allows the user to permanently override their usual preferred color scheme.
   */
  permanent?: boolean;
  /**
   * Any string value that represents the label for the "dark" mode.
   */
  dark?: string;
  /**
   * Any string value that represents the label for the "light" mode.
   */
  light?: string;
  style?: React.CSSProperties;
}
```

## Events

- `colorschemechange`: Fired when the color scheme gets changed.
- `permanentcolorscheme`: Fired when the color scheme should be permanently remembered or not.

## Alternatives

- [dark-mode-toggle](https://github.com/GoogleChromeLabs/dark-mode-toggle) <img align="bottom" height="13" src="https://img.shields.io/github/stars/GoogleChromeLabs/dark-mode-toggle.svg?label=" /> A custom element that allows you to easily put a Dark Mode 🌒 toggle or switch on your site
- [Darkmode.js](https://github.com/sandoche/Darkmode.js) <img align="bottom" height="13" src="https://img.shields.io/github/stars/sandoche/Darkmode.js.svg?label=" /> Add a dark-mode / night-mode to your website in a few seconds
- [darken](https://github.com/ColinEspinas/darken) <img align="bottom" height="13" src="https://img.shields.io/github/stars/ColinEspinas/darken.svg?label=" /> Dark mode made easy
- [use-dark-mode](https://github.com/donavon/use-dark-mode) <img align="bottom" height="13" src="https://img.shields.io/github/stars/donavon/use-dark-mode.svg?label=" /> A custom React Hook to help you implement a "dark mode" component.
- [Dark Mode Switch](https://github.com/coliff/dark-mode-switch) <img align="bottom" height="13" src="https://img.shields.io/github/stars/coliff/dark-mode-switch.svg?label=" /> Add a dark-mode theme toggle with a Bootstrap Custom Switch

## Contributors

As always, thanks to our amazing contributors!

<a href="https://github.com/jaywcjlove/dark-mode/graphs/contributors">
  <img src="https://jaywcjlove.github.io/dark-mode/CONTRIBUTORS.svg" />
</a>

Made with [github-action-contributors](https://github.com/jaywcjlove/github-action-contributors).

## License

Licensed under the [MIT License](https://opensource.org/licenses/MIT).
