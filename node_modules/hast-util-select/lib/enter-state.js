/**
 * @typedef {import('./types.js').SelectState} SelectState
 * @typedef {import('./types.js').Node} Node
 * @typedef {import('./types.js').ElementChild} ElementChild
 * @typedef {import('./types.js').Direction} Direction
 * @typedef {import('unist-util-visit/complex-types.js').Visitor<ElementChild>} Visitor
 */

import {direction} from 'direction'
import {toString} from 'hast-util-to-string'
import {svg} from 'property-information'
import {visit, EXIT, SKIP} from 'unist-util-visit'

/**
 * Enter a node.
 *
 * The caller is responsible for calling the return value `exit`.
 *
 * @param {SelectState} state
 *   Current state.
 *
 *   Will be mutated: `exit` undos the changes.
 * @param {Node} node
 *   Node to enter.
 * @returns {() => void}
 *   Call to exit.
 */
// eslint-disable-next-line complexity
export function enterState(state, node) {
  const schema = state.schema
  const language = state.language
  const currentDirection = state.direction
  const editableOrEditingHost = state.editableOrEditingHost
  /** @type {Direction | undefined} */
  let dirInferred

  if (node.type === 'element' && node.properties) {
    const lang = node.properties.xmlLang || node.properties.lang
    const type = node.properties.type || 'text'
    const dir = dirProperty(node)

    if (lang !== undefined && lang !== null) {
      state.language = String(lang)
    }

    if (schema && schema.space === 'html') {
      if (node.properties.contentEditable === 'true') {
        state.editableOrEditingHost = true
      }

      if (node.tagName === 'svg') {
        state.schema = svg
      }

      // See: <https://html.spec.whatwg.org/#the-directionality>.
      // Explicit `[dir=rtl]`.
      if (dir === 'rtl') {
        dirInferred = dir
      } else if (
        // Explicit `[dir=ltr]`.
        dir === 'ltr' ||
        // HTML with an invalid or no `[dir]`.
        (dir !== 'auto' && node.tagName === 'html') ||
        // `input[type=tel]` with an invalid or no `[dir]`.
        (dir !== 'auto' && node.tagName === 'input' && type === 'tel')
      ) {
        dirInferred = 'ltr'
        // `[dir=auto]` or `bdi` with an invalid or no `[dir]`.
      } else if (dir === 'auto' || node.tagName === 'bdi') {
        if (node.tagName === 'textarea') {
          // Check contents of `<textarea>`.
          dirInferred = dirBidi(toString(node))
        } else if (
          node.tagName === 'input' &&
          (type === 'email' ||
            type === 'search' ||
            type === 'tel' ||
            type === 'text')
        ) {
          // Check value of `<input>`.
          dirInferred = node.properties.value
            ? // @ts-expect-error Assume string
              dirBidi(node.properties.value)
            : 'ltr'
        } else {
          // Check text nodes in `node`.
          visit(node, inferDirectionality)
        }
      }

      if (dirInferred) {
        state.direction = dirInferred
      }
    }
    // Turn off editing mode in non-HTML spaces.
    else if (state.editableOrEditingHost) {
      state.editableOrEditingHost = false
    }
  }

  return reset

  function reset() {
    state.schema = schema
    state.language = language
    state.direction = currentDirection
    state.editableOrEditingHost = editableOrEditingHost
  }

  /** @type {Visitor} */
  function inferDirectionality(child) {
    if (child.type === 'text') {
      dirInferred = dirBidi(child.value)
      return dirInferred ? EXIT : undefined
    }

    if (
      child !== node &&
      child.type === 'element' &&
      (child.tagName === 'bdi' ||
        child.tagName === 'script' ||
        child.tagName === 'style' ||
        child.tagName === 'textare' ||
        dirProperty(child))
    ) {
      return SKIP
    }
  }
}

/**
 * @param {string} value
 * @returns {Direction | undefined}
 */
function dirBidi(value) {
  const result = direction(value)
  return result === 'neutral' ? undefined : result
}

/**
 * @param {ElementChild} node
 * @returns {Direction | undefined}
 */
function dirProperty(node) {
  const value =
    node.type === 'element' &&
    node.properties &&
    typeof node.properties.dir === 'string'
      ? node.properties.dir.toLowerCase()
      : undefined

  return value === 'auto' || value === 'ltr' || value === 'rtl'
    ? value
    : undefined
}
