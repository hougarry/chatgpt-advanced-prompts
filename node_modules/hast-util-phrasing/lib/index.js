/**
 * @typedef {import('hast').Root} Root
 * @typedef {import('hast').Content} Content
 */

/**
 * @typedef {Root | Content} Node
 */

import {convertElement} from 'hast-util-is-element'
import {hasProperty} from 'hast-util-has-property'
import {embedded} from 'hast-util-embedded'
import {isBodyOkLink} from 'hast-util-is-body-ok-link'

const basic = convertElement([
  'a',
  'abbr',
  // `area` is in fact only phrasing if it is inside a `map` element.
  // However, since `area`s are required to be inside a `map` element, and it’s
  // a rather involved check, it’s ignored here for now.
  'area',
  'b',
  'bdi',
  'bdo',
  'br',
  'button',
  'cite',
  'code',
  'data',
  'datalist',
  'del',
  'dfn',
  'em',
  'i',
  'input',
  'ins',
  'kbd',
  'keygen',
  'label',
  'map',
  'mark',
  'meter',
  'noscript',
  'output',
  'progress',
  'q',
  'ruby',
  's',
  'samp',
  'script',
  'select',
  'small',
  'span',
  'strong',
  'sub',
  'sup',
  'template',
  'textarea',
  'time',
  'u',
  'var',
  'wbr'
])

const meta = convertElement('meta')

/**
 * Check if the given value is *phrasing* content.
 *
 * @param {unknown} value
 *   Thing to check, typically `Node`.
 * @returns {boolean}
 *   Whether `value` is phrasing content.
 */
export function phrasing(value) {
  return Boolean(
    node(value) &&
      (value.type === 'text' ||
        basic(value) ||
        embedded(value) ||
        isBodyOkLink(value) ||
        (meta(value) && hasProperty(value, 'itemProp')))
  )
}

/**
 * @param {unknown} value
 * @returns {value is Node}
 */
function node(value) {
  // @ts-expect-error: looks like an object.
  return value && typeof value === 'object' && 'type' in value
}
