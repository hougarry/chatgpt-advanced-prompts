/**
 * @typedef {import('./types.js').Rule} Rule
 * @typedef {import('./types.js').RuleAttr} RuleAttr
 * @typedef {import('./types.js').Element} Element
 * @typedef {import('./types.js').Schema} Schema
 * @typedef {import('./types.js').Info} Info
 * @typedef {import('./types.js').PropertyValue} PropertyValue
 */

import {stringify as commas} from 'comma-separated-tokens'
import {hasProperty} from 'hast-util-has-property'
import {find} from 'property-information'
import {stringify as spaces} from 'space-separated-tokens'
import {zwitch} from 'zwitch'

/** @type {(query: RuleAttr, element: Element, info: Info) => boolean} */
const handle = zwitch('operator', {
  unknown: unknownOperator,
  // @ts-expect-error: hush.
  invalid: exists,
  handlers: {
    '=': exact,
    '~=': spaceSeparatedList,
    '|=': exactOrPrefix,
    '^=': begins,
    '$=': ends,
    '*=': contains
  }
})

/**
 * @param {Rule} query
 * @param {Element} element
 * @param {Schema} schema
 * @returns {boolean}
 */
export function attribute(query, element, schema) {
  const attrs = query.attrs
  let index = -1

  while (++index < attrs.length) {
    if (!handle(attrs[index], element, find(schema, attrs[index].name))) {
      return false
    }
  }

  return true
}

/**
 * Check whether an attribute exists.
 *
 * `[attr]`
 *
 * @param {RuleAttr} _
 * @param {Element} element
 * @param {Info} info
 * @returns {boolean}
 */
function exists(_, element, info) {
  return hasProperty(element, info.property)
}

/**
 * Check whether an attribute has an exact value.
 *
 * `[attr=value]`
 *
 * @param {RuleAttr} query
 * @param {Element} element
 * @param {Info} info
 * @returns {boolean}
 */
function exact(query, element, info) {
  return Boolean(
    hasProperty(element, info.property) &&
      element.properties &&
      normalizeValue(element.properties[info.property], info) === query.value
  )
}

/**
 * Check whether an attribute, interpreted as a space-separated list, contains
 * a value.
 *
 * `[attr~=value]`
 *
 * @param {RuleAttr} query
 * @param {Element} element
 * @param {Info} info
 * @returns {boolean}
 */
function spaceSeparatedList(query, element, info) {
  const value = element.properties && element.properties[info.property]

  return (
    // If this is a space-separated list, and the query is contained in it, return
    // true.
    (!info.commaSeparated &&
      value &&
      typeof value === 'object' &&
      query.value &&
      value.includes(query.value)) ||
    // For all other values (including comma-separated lists), return whether this
    // is an exact match.
    (hasProperty(element, info.property) &&
      normalizeValue(value, info) === query.value)
  )
}

/**
 * Check whether an attribute has a substring as either the exact value or a
 * prefix.
 *
 * `[attr|=value]`
 *
 * @param {RuleAttr} query
 * @param {Element} element
 * @param {Info} info
 * @returns {boolean}
 */
function exactOrPrefix(query, element, info) {
  const value = normalizeValue(
    element.properties && element.properties[info.property],
    info
  )

  return Boolean(
    hasProperty(element, info.property) &&
      query.value &&
      (value === query.value ||
        (value.slice(0, query.value.length) === query.value &&
          value.charAt(query.value.length) === '-'))
  )
}

/**
 * Check whether an attribute has a substring as its start.
 *
 * `[attr^=value]`
 *
 * @param {RuleAttr} query
 * @param {Element} element
 * @param {Info} info
 * @returns {boolean}
 */
function begins(query, element, info) {
  return Boolean(
    hasProperty(element, info.property) &&
      element.properties &&
      query.value &&
      normalizeValue(element.properties[info.property], info).slice(
        0,
        query.value.length
      ) === query.value
  )
}

/**
 * Check whether an attribute has a substring as its end.
 *
 * `[attr$=value]`
 *
 * @param {RuleAttr} query
 * @param {Element} element
 * @param {Info} info
 * @returns {boolean}
 */
function ends(query, element, info) {
  return Boolean(
    hasProperty(element, info.property) &&
      element.properties &&
      query.value &&
      normalizeValue(element.properties[info.property], info).slice(
        -query.value.length
      ) === query.value
  )
}

/**
 * Check whether an attribute contains a substring.
 *
 * `[attr*=value]`
 *
 * @param {RuleAttr} query
 * @param {Element} element
 * @param {Info} info
 * @returns {boolean}
 */
function contains(query, element, info) {
  return Boolean(
    hasProperty(element, info.property) &&
      element.properties &&
      query.value &&
      normalizeValue(element.properties[info.property], info).includes(
        query.value
      )
  )
}

// Shouldn’t be called, Parser throws an error instead.
/**
 * @param {unknown} query
 * @returns {never}
 */
/* c8 ignore next 4 */
function unknownOperator(query) {
  // @ts-expect-error: `operator` guaranteed.
  throw new Error('Unknown operator `' + query.operator + '`')
}

/**
 * Stringify a hast value back to its HTML form.
 *
 * @param {PropertyValue} value
 * @param {Info} info
 * @returns {string}
 */
function normalizeValue(value, info) {
  if (typeof value === 'boolean') {
    return info.attribute
  }

  if (Array.isArray(value)) {
    return (info.commaSeparated ? commas : spaces)(value)
  }

  return String(value)
}
