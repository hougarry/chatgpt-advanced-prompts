/**
 * @typedef {import('hast').Element} Element
 */

import {convertElement} from 'hast-util-is-element'

/**
 * Check if a node is a *embedded content*.
 *
 * @type {import('hast-util-is-element').AssertPredicate<Element & {tagName: 'audio' | 'canvas' | 'embed' | 'iframe' | 'img' | 'math' | 'object' | 'picture' | 'svg' | 'video'}>}
 * @param value
 *   Thing to check (typically `Node`).
 * @returns
 *   Whether `value` is an element considered embedded content.
 *
 *   The elements `audio`, `canvas`, `embed`, `iframe`, `img`, `math`,
 *   `object`, `picture`, `svg`, and `video` are embedded content.
 */
// @ts-expect-error Sure, the assertion matches.
export const embedded = convertElement([
  'audio',
  'canvas',
  'embed',
  'iframe',
  'img',
  'math',
  'object',
  'picture',
  'svg',
  'video'
])
