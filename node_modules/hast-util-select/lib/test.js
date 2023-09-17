/**
 * @typedef {import('./types.js').Rule} Rule
 * @typedef {import('./types.js').Element} Element
 * @typedef {import('./types.js').Parent} Parent
 * @typedef {import('./types.js').SelectState} SelectState
 */

import {attribute} from './attribute.js'
import {className} from './class-name.js'
import {id} from './id.js'
import {name} from './name.js'
import {pseudo} from './pseudo.js'

/**
 * Test a rule.
 *
 * @param {Rule} query
 * @param {Element} element
 * @param {number | undefined} index
 * @param {Parent | undefined} parent
 * @param {SelectState} state
 * @returns {boolean}
 */
export function test(query, element, index, parent, state) {
  return Boolean(
    (!query.tagName || name(query, element)) &&
      (!query.classNames || className(query, element)) &&
      (!query.id || id(query, element)) &&
      (!query.attrs || attribute(query, element, state.schema)) &&
      (!query.pseudos || pseudo(query, element, index, parent, state))
  )
}
