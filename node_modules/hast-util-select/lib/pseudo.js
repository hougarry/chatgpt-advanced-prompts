/**
 * @typedef {import('./types.js').Rule} Rule
 * @typedef {import('./types.js').RulePseudo} RulePseudo
 * @typedef {import('./types.js').RulePseudoSelector} RulePseudoSelector
 * @typedef {import('./types.js').Parent} Parent
 * @typedef {import('./types.js').SelectState} SelectState
 * @typedef {import('./types.js').Element} Element
 * @typedef {import('./types.js').ElementChild} ElementChild
 */

import {extendedFilter} from 'bcp-47-match'
import {parse as commas} from 'comma-separated-tokens'
import {hasProperty} from 'hast-util-has-property'
import {whitespace} from 'hast-util-whitespace'
import fauxEsmNthCheck from 'nth-check'
import {zwitch} from 'zwitch'
import {queryToSelectors, walk} from './walk.js'

/** @type {import('nth-check').default} */
// @ts-expect-error
const nthCheck = fauxEsmNthCheck.default || fauxEsmNthCheck

/** @type {(rule: Rule | RulePseudo, element: Element, index: number | undefined, parent: Parent | undefined, state: SelectState) => boolean} */
const handle = zwitch('name', {
  unknown: unknownPseudo,
  invalid: invalidPseudo,
  handlers: {
    any: matches,
    'any-link': anyLink,
    blank,
    checked,
    dir,
    disabled,
    empty,
    enabled,
    'first-child': firstChild,
    'first-of-type': firstOfType,
    has,
    lang,
    'last-child': lastChild,
    'last-of-type': lastOfType,
    matches,
    not,
    'nth-child': nthChild,
    'nth-last-child': nthLastChild,
    'nth-of-type': nthOfType,
    'nth-last-of-type': nthLastOfType,
    'only-child': onlyChild,
    'only-of-type': onlyOfType,
    optional,
    'read-only': readOnly,
    'read-write': readWrite,
    required,
    root,
    scope
  }
})

pseudo.needsIndex = [
  'any',
  'first-child',
  'first-of-type',
  'last-child',
  'last-of-type',
  'matches',
  'not',
  'nth-child',
  'nth-last-child',
  'nth-of-type',
  'nth-last-of-type',
  'only-child',
  'only-of-type'
]

/**
 * Check whether an element matches pseudo selectors.
 *
 * @param {Rule} query
 * @param {Element} element
 * @param {number | undefined} index
 * @param {Parent | undefined} parent
 * @param {SelectState} state
 * @returns {boolean}
 */
export function pseudo(query, element, index, parent, state) {
  const pseudos = query.pseudos
  let offset = -1

  while (++offset < pseudos.length) {
    if (!handle(pseudos[offset], element, index, parent, state)) return false
  }

  return true
}

/**
 * Check whether an element matches an `:any-link` pseudo.
 *
 * @param {RulePseudo} _
 * @param {Element} element
 * @returns {boolean}
 */
function anyLink(_, element) {
  return (
    (element.tagName === 'a' ||
      element.tagName === 'area' ||
      element.tagName === 'link') &&
    hasProperty(element, 'href')
  )
}

/**
 * Check whether an element matches a `:blank` pseudo.
 *
 * @param {RulePseudo} _
 * @param {Element} element
 * @returns {boolean}
 */
function blank(_, element) {
  return !someChildren(element, check)

  /**
   * @param {ElementChild} child
   * @returns {boolean}
   */
  function check(child) {
    return (
      child.type === 'element' || (child.type === 'text' && !whitespace(child))
    )
  }
}

/**
 * Check whether an element matches a `:checked` pseudo.
 *
 * @param {RulePseudo} _
 * @param {Element} element
 * @returns {boolean}
 */
function checked(_, element) {
  if (element.tagName === 'input' || element.tagName === 'menuitem') {
    return Boolean(
      element.properties &&
        (element.properties.type === 'checkbox' ||
          element.properties.type === 'radio') &&
        hasProperty(element, 'checked')
    )
  }

  if (element.tagName === 'option') {
    return hasProperty(element, 'selected')
  }

  return false
}

/**
 * Check whether an element matches a `:dir()` pseudo.
 *
 * @param {RulePseudo} query
 * @param {Element} _1
 * @param {number | undefined} _2
 * @param {Parent | undefined} _3
 * @param {SelectState} state
 * @returns {boolean}
 */
function dir(query, _1, _2, _3, state) {
  return state.direction === query.value
}

/**
 * Check whether an element matches a `:disabled` pseudo.
 *
 * @param {RulePseudo} _
 * @param {Element} element
 * @returns {boolean}
 */
function disabled(_, element) {
  return (
    (element.tagName === 'button' ||
      element.tagName === 'input' ||
      element.tagName === 'select' ||
      element.tagName === 'textarea' ||
      element.tagName === 'optgroup' ||
      element.tagName === 'option' ||
      element.tagName === 'menuitem' ||
      element.tagName === 'fieldset') &&
    hasProperty(element, 'disabled')
  )
}

/**
 * Check whether an element matches an `:empty` pseudo.
 *
 * @param {RulePseudo} _
 * @param {Element} element
 * @returns {boolean}
 */
function empty(_, element) {
  return !someChildren(element, check)

  /**
   * @param {ElementChild} child
   * @returns {boolean}
   */
  function check(child) {
    return child.type === 'element' || child.type === 'text'
  }
}

/**
 * Check whether an element matches an `:enabled` pseudo.
 *
 * @param {RulePseudo} query
 * @param {Element} element
 * @returns {boolean}
 */
function enabled(query, element) {
  return !disabled(query, element)
}

/**
 * Check whether an element matches a `:first-child` pseudo.
 *
 * @param {RulePseudo} query
 * @param {Element} _1
 * @param {number | undefined} _2
 * @param {Parent | undefined} _3
 * @param {SelectState} state
 * @returns {boolean}
 */
function firstChild(query, _1, _2, _3, state) {
  assertDeep(state, query)
  return state.elementIndex === 0
}

/**
 * Check whether an element matches a `:first-of-type` pseudo.
 *
 * @param {RulePseudo} query
 * @param {Element} _1
 * @param {number | undefined} _2
 * @param {Parent | undefined} _3
 * @param {SelectState} state
 * @returns {boolean}
 */
function firstOfType(query, _1, _2, _3, state) {
  assertDeep(state, query)
  return state.typeIndex === 0
}

/**
 * @param {RulePseudoSelector} query
 * @param {Element} element
 * @param {number | undefined} _1
 * @param {Parent | undefined} _2
 * @param {SelectState} state
 * @returns {boolean}
 */
function has(query, element, _1, _2, state) {
  /** @type {SelectState} */
  const childState = {
    ...state,
    // Not found yet.
    found: false,
    // Do walk deep.
    shallow: false,
    // One result is enough.
    one: true,
    scopeElements: [element],
    results: [],
    rootQuery: queryToSelectors(query.value)
  }

  walk(childState, {type: 'root', children: element.children})

  return childState.results.length > 0
}

/**
 * Check whether an element matches a `:lang()` pseudo.
 *
 * @param {RulePseudo} query
 * @param {Element} _1
 * @param {number | undefined} _2
 * @param {Parent | undefined} _3
 * @param {SelectState} state
 * @returns {boolean}
 */
function lang(query, _1, _2, _3, state) {
  return (
    state.language !== '' &&
    state.language !== undefined &&
    // @ts-expect-error never `selectors`.
    extendedFilter(state.language, commas(query.value)).length > 0
  )
}

/**
 * Check whether an element matches a `:last-child` pseudo.
 *
 * @param {RulePseudo} query
 * @param {Element} _1
 * @param {number | undefined} _2
 * @param {Parent | undefined} _3
 * @param {SelectState} state
 * @returns {boolean}
 */
function lastChild(query, _1, _2, _3, state) {
  assertDeep(state, query)
  return Boolean(
    state.elementCount && state.elementIndex === state.elementCount - 1
  )
}

/**
 * Check whether an element matches a `:last-of-type` pseudo.
 *
 * @param {RulePseudo} query
 * @param {Element} _1
 * @param {number | undefined} _2
 * @param {Parent | undefined} _3
 * @param {SelectState} state
 * @returns {boolean}
 */
function lastOfType(query, _1, _2, _3, state) {
  assertDeep(state, query)
  return (
    typeof state.typeIndex === 'number' &&
    typeof state.typeCount === 'number' &&
    state.typeIndex === state.typeCount - 1
  )
}

/**
 * Check whether an element `:matches` further selectors.
 *
 * @param {RulePseudoSelector} query
 * @param {Element} element
 * @param {number | undefined} _
 * @param {Parent | undefined} parent
 * @param {SelectState} state
 * @returns {boolean}
 */
function matches(query, element, _, parent, state) {
  /** @type {SelectState} */
  const childState = {
    ...state,
    // Not found yet.
    found: false,
    // Do walk deep.
    shallow: false,
    // One result is enough.
    one: true,
    scopeElements: [element],
    results: [],
    rootQuery: queryToSelectors(query.value)
  }

  walk(childState, element)

  return childState.results[0] === element
}

/**
 * Check whether an element does `:not` match further selectors.
 *
 * @param {RulePseudoSelector} query
 * @param {Element} element
 * @param {number | undefined} index
 * @param {Parent | undefined} parent
 * @param {SelectState} state
 * @returns {boolean}
 */
function not(query, element, index, parent, state) {
  return !matches(query, element, index, parent, state)
}

/**
 * Check whether an element matches an `:nth-child` pseudo.
 *
 * @param {RulePseudo} query
 * @param {Element} _1
 * @param {number | undefined} _2
 * @param {Parent | undefined} _3
 * @param {SelectState} state
 * @returns {boolean}
 */
function nthChild(query, _1, _2, _3, state) {
  const fn = getCachedNthCheck(query)
  assertDeep(state, query)
  return typeof state.elementIndex === 'number' && fn(state.elementIndex)
}

/**
 * Check whether an element matches an `:nth-last-child` pseudo.
 *
 * @param {RulePseudo} query
 * @param {Element} _1
 * @param {number | undefined} _2
 * @param {Parent | undefined} _3
 * @param {SelectState} state
 * @returns {boolean}
 */
function nthLastChild(query, _1, _2, _3, state) {
  const fn = getCachedNthCheck(query)
  assertDeep(state, query)
  return Boolean(
    typeof state.elementCount === 'number' &&
      typeof state.elementIndex === 'number' &&
      fn(state.elementCount - state.elementIndex - 1)
  )
}

/**
 * Check whether an element matches a `:nth-last-of-type` pseudo.
 *
 * @param {RulePseudo} query
 * @param {Element} _1
 * @param {number | undefined} _2
 * @param {Parent | undefined} _3
 * @param {SelectState} state
 * @returns {boolean}
 */
function nthLastOfType(query, _1, _2, _3, state) {
  const fn = getCachedNthCheck(query)
  assertDeep(state, query)
  return (
    typeof state.typeCount === 'number' &&
    typeof state.typeIndex === 'number' &&
    fn(state.typeCount - 1 - state.typeIndex)
  )
}

/**
 * Check whether an element matches an `:nth-of-type` pseudo.
 *
 * @param {RulePseudo} query
 * @param {Element} _1
 * @param {number | undefined} _2
 * @param {Parent | undefined} _3
 * @param {SelectState} state
 * @returns {boolean}
 */
function nthOfType(query, _1, _2, _3, state) {
  const fn = getCachedNthCheck(query)
  assertDeep(state, query)
  return typeof state.typeIndex === 'number' && fn(state.typeIndex)
}

/**
 * Check whether an element matches an `:only-child` pseudo.
 *
 * @param {RulePseudo} query
 * @param {Element} _1
 * @param {number | undefined} _2
 * @param {Parent | undefined} _3
 * @param {SelectState} state
 * @returns {boolean}
 */
function onlyChild(query, _1, _2, _3, state) {
  assertDeep(state, query)
  return state.elementCount === 1
}

/**
 * Check whether an element matches an `:only-of-type` pseudo.
 *
 * @param {RulePseudo} query
 * @param {Element} _1
 * @param {number | undefined} _2
 * @param {Parent | undefined} _3
 * @param {SelectState} state
 * @returns {boolean}
 */
function onlyOfType(query, _1, _2, _3, state) {
  assertDeep(state, query)
  return state.typeCount === 1
}

/**
 * Check whether an element matches an `:optional` pseudo.
 *
 * @param {RulePseudo} query
 * @param {Element} element
 * @returns {boolean}
 */
function optional(query, element) {
  return !required(query, element)
}

/**
 * Check whether an element matches a `:read-only` pseudo.
 *
 * @param {RulePseudo} query
 * @param {Element} element
 * @param {number | undefined} index
 * @param {Parent | undefined} parent
 * @param {SelectState} state
 * @returns {boolean}
 */
function readOnly(query, element, index, parent, state) {
  return !readWrite(query, element, index, parent, state)
}

/**
 * Check whether an element matches a `:read-write` pseudo.
 *
 * @param {RulePseudo} _
 * @param {Element} element
 * @param {number | undefined} _1
 * @param {Parent | undefined} _2
 * @param {SelectState} state
 * @returns {boolean}
 */
function readWrite(_, element, _1, _2, state) {
  return element.tagName === 'input' || element.tagName === 'textarea'
    ? !hasProperty(element, 'readOnly') && !hasProperty(element, 'disabled')
    : Boolean(state.editableOrEditingHost)
}

/**
 * Check whether an element matches a `:required` pseudo.
 *
 * @param {RulePseudo} _
 * @param {Element} element
 * @returns {boolean}
 */
function required(_, element) {
  return (
    (element.tagName === 'input' ||
      element.tagName === 'textarea' ||
      element.tagName === 'select') &&
    hasProperty(element, 'required')
  )
}

/**
 * Check whether an element matches a `:root` pseudo.
 *
 * @param {RulePseudo} _
 * @param {Element} element
 * @param {number | undefined} _1
 * @param {Parent | undefined} parent
 * @param {SelectState} state
 * @returns {boolean}
 */
function root(_, element, _1, parent, state) {
  return Boolean(
    (!parent || parent.type === 'root') &&
      state.schema &&
      (state.schema.space === 'html' || state.schema.space === 'svg') &&
      (element.tagName === 'html' || element.tagName === 'svg')
  )
}

/**
 * Check whether an element matches a `:scope` pseudo.
 *
 * @param {RulePseudo} _
 * @param {Element} element
 * @param {number | undefined} _1
 * @param {Parent | undefined} _2
 * @param {SelectState} state
 * @returns {boolean}
 */
function scope(_, element, _1, _2, state) {
  return state.scopeElements.includes(element)
}

// Shouldn’t be called, parser gives correct data.
/* c8 ignore next 3 */
function invalidPseudo() {
  throw new Error('Invalid pseudo-selector')
}

/**
 * @param {unknown} query
 * @returns {never}
 */
function unknownPseudo(query) {
  // @ts-expect-error: indexable.
  if (query.name) {
    // @ts-expect-error: indexable.
    throw new Error('Unknown pseudo-selector `' + query.name + '`')
  }

  throw new Error('Unexpected pseudo-element or empty pseudo-class')
}

/**
 * Check children.
 *
 * @param {Element} element
 * @param {(child: ElementChild) => boolean} check
 * @returns {boolean}
 */
function someChildren(element, check) {
  const children = element.children
  let index = -1

  while (++index < children.length) {
    if (check(children[index])) return true
  }

  return false
}

/**
 * @param {SelectState} state
 * @param {RulePseudo} query
 */
function assertDeep(state, query) {
  if (state.shallow) {
    throw new Error('Cannot use `:' + query.name + '` without parent')
  }
}

/**
 * @param {RulePseudo} query
 * @returns {(value: number) => boolean}
 */
function getCachedNthCheck(query) {
  /** @type {(value: number) => boolean} */
  // @ts-expect-error: cache.
  let fn = query._cachedFn

  if (!fn) {
    // @ts-expect-error: always string.
    fn = nthCheck(query.value)
    // @ts-expect-error: cache.
    query._cachedFn = fn
  }

  return fn
}
