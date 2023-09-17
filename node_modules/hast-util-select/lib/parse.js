/**
 * @typedef {import('./types.js').Selectors} Selectors
 * @typedef {import('./types.js').RuleSet} RuleSet
 */

import {CssSelectorParser} from 'css-selector-parser'

const parser = new CssSelectorParser()

parser.registerAttrEqualityMods('~', '|', '^', '$', '*')
parser.registerSelectorPseudos('any', 'matches', 'not', 'has')
parser.registerNestingOperators('>', '+', '~')

/**
 * @param {string} selector
 * @returns {Selectors | RuleSet | null}
 */
export function parse(selector) {
  if (typeof selector !== 'string') {
    throw new TypeError('Expected `string` as selector, not `' + selector + '`')
  }

  return parser.parse(selector)
}
