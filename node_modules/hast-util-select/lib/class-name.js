/**
 * @typedef {import('./types.js').Rule} Rule
 * @typedef {import('./types.js').Element} Element
 */

/**
 * Check whether an element has all class names.
 *
 * @param {Rule} query
 * @param {Element} element
 * @returns {boolean}
 */
export function className(query, element) {
  /** @type {readonly string[]} */
  // @ts-expect-error Assume array.
  const value = element.properties.className || []
  let index = -1

  if (query.classNames) {
    while (++index < query.classNames.length) {
      if (!value.includes(query.classNames[index])) return false
    }
  }

  return true
}
