/**
 * @typedef {import('./types.js').Rule} Rule
 * @typedef {import('./types.js').Element} Element
 */

/**
 * Check whether an element has an ID.
 *
 * @param {Rule} query
 * @param {Element} element
 * @returns {boolean}
 */
export function id(query, element) {
  return Boolean(element.properties && element.properties.id === query.id)
}
