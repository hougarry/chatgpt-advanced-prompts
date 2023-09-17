/**
 * @param {string} selector
 * @returns {Selectors | RuleSet | null}
 */
export function parse(selector: string): Selectors | RuleSet | null
export type Selectors = import('./types.js').Selectors
export type RuleSet = import('./types.js').RuleSet
