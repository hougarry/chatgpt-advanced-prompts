/**
 * @typedef {import('./types.js').Element} Element
 * @typedef {import('./types.js').Node} Node
 * @typedef {import('./types.js').Space} Space
 * @typedef {import('./types.js').SelectState} SelectState
 */

import {html, svg} from 'property-information'
import {queryToSelectors, walk} from './walk.js'
import {parse} from './parse.js'

/**
 * Check that the given `node` matches `selector`.
 *
 * This only checks the element itself, not the surrounding tree.
 * Thus, nesting in selectors is not supported (`p b`, `p > b`), neither are
 * selectors like `:first-child`, etc.
 * This only checks that the given element matches the selector.
 *
 * @param {string} selector
 *   CSS selector, such as (`h1`, `a, b`).
 * @param {Node | null | undefined} [node]
 *   Node that might match `selector`, should be an element.
 * @param {Space | null | undefined} [space='html']
 *   Name of namespace (`'svg'` or `'html'`).
 * @returns {boolean}
 *   Whether `node` matches `selector`.
 */
export function matches(selector, node, space) {
  const state = createState(selector, node, space)
  state.one = true
  state.shallow = true
  walk(state, node || undefined)
  return state.results.length > 0
}

/**
 * Select the first element that matches `selector` in the given `tree`.
 * Searches the tree in *preorder*.
 *
 * @param {string} selector
 *   CSS selector, such as (`h1`, `a, b`).
 * @param {Node | null | undefined} [tree]
 *   Tree to search.
 * @param {Space | null | undefined} [space='html']
 *   Name of namespace (`'svg'` or `'html'`).
 * @returns {Element | null}
 *   First element in `tree` that matches `selector` or `null` if nothing is
 *   found.
 *   This could be `tree` itself.
 */
export function select(selector, tree, space) {
  const state = createState(selector, tree, space)
  state.one = true
  walk(state, tree || undefined)
  // To do in major: return `undefined` instead.
  return state.results[0] || null
}

/**
 * Select all elements that match `selector` in the given `tree`.
 * Searches the tree in *preorder*.
 *
 * @param {string} selector
 *   CSS selector, such as (`h1`, `a, b`).
 * @param {Node | null | undefined} [tree]
 *   Tree to search.
 * @param {Space | null | undefined} [space='html']
 *   Name of namespace (`'svg'` or `'html'`).
 * @returns {Array<Element>}
 *   Elements in `tree` that match `selector`.
 *   This could include `tree` itself.
 */
export function selectAll(selector, tree, space) {
  const state = createState(selector, tree, space)
  walk(state, tree || undefined)
  return state.results
}

/**
 * @param {string} selector
 *   Tree to search.
 * @param {Node | null | undefined} [tree]
 *   Tree to search.
 * @param {Space | null | undefined} [space='html']
 *   Name of namespace (`'svg'` or `'html'`).
 * @returns {SelectState} SelectState
 */
function createState(selector, tree, space) {
  return {
    // State of the query.
    rootQuery: queryToSelectors(parse(selector)),
    results: [],
    // @ts-expect-error assume elements.
    scopeElements: tree ? (tree.type === 'root' ? tree.children : [tree]) : [],
    one: false,
    shallow: false,
    found: false,
    // State in the tree.
    schema: space === 'svg' ? svg : html,
    language: undefined,
    direction: 'ltr',
    editableOrEditingHost: false,
    typeIndex: undefined,
    elementIndex: undefined,
    typeCount: undefined,
    elementCount: undefined
  }
}
