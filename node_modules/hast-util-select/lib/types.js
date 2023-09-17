/**
 * @typedef {import('hast').Root} Root
 *   Root node.
 * @typedef {import('hast').Content} Content
 *   Any child.
 * @typedef {import('hast').Element} Element
 *   Element.
 * @typedef {import('hast').ElementContent} ElementChild
 *   Element children.
 * @typedef {import('hast').Properties} Properties
 *   Element properties.
 * @typedef {Root | Content} Node
 *   Any known hast node.
 * @typedef {Extract<Node, import('hast').Parent>} Parent
 *   Any known hast parent.
 * @typedef {Properties[keyof Properties]} PropertyValue
 *   Any property value.
 *
 * @typedef {import('css-selector-parser').Selectors} Selectors
 *   Multiple selectors.
 * @typedef {import('css-selector-parser').Rule} Rule
 *   One rule.
 * @typedef {import('css-selector-parser').RuleSet} RuleSet
 *   Multiple rules.
 * @typedef {import('css-selector-parser').RulePseudo} RulePseudo
 *   Pseudo rule.
 * @typedef {import('css-selector-parser').AttrValueType} AttrValueType
 *   Attribute value type.
 *
 * @typedef RuleAttr
 *   Fix for types from `css-selector-parser`.
 * @property {string} name
 *   Attribute name.
 * @property {string | undefined} [operator]
 *   Operator, such as `'|='`, missing when for example `[x]`.
 * @property {AttrValueType | undefined} [valueType]
 *   Attribute value type.
 * @property {string | undefined} [value]
 *   Attribute value.
 *
 * @typedef RulePseudoSelector
 *   More specific type for registered selector pseudos.
 * @property {string} name
 *   Name of pseudo, such as `'matches'`.
 * @property {'selector'} valueType
 *   Set to `'selector'`, because `value` is a compiled selector.
 * @property {Selectors|RuleSet} value
 *   Selector.
 *
 * @typedef {'html' | 'svg'} Space
 *   Name of namespace.
 * @typedef {'auto' | 'ltr' | 'rtl'} Direction
 *   Direction.
 * @typedef {import('property-information').Schema} Schema
 *   A schema.
 * @typedef {import('property-information').Info} Info
 *   Info on a property.
 *
 * @typedef SelectState
 *   Current state.
 * @property {Selectors} rootQuery
 *   Original root selectors.
 * @property {Array<Element>} results
 *   Matches.
 * @property {Array<Element>} scopeElements
 *   Elements in scope.
 * @property {boolean} one
 *   Whether we can stop looking after we found one element.
 * @property {boolean} shallow
 *   Whether we only allow selectors without nesting.
 * @property {boolean} found
 *   Whether we found at least one match.
 * @property {Schema} schema
 *   Current schema.
 * @property {string | undefined} language
 *   Current language.
 * @property {Direction} direction
 *   Current direction.
 * @property {boolean} editableOrEditingHost
 *   Whether we’re in `contentEditable`.
 * @property {number | undefined} typeIndex
 *   Track siblings: this current element has `n` elements with its tag name
 *   before it.
 * @property {number | undefined} elementIndex
 *   Track siblings: this current element has `n` elements before it.
 * @property {number | undefined} typeCount
 *   Track siblings: there are `n` siblings with this element’s tag name.
 * @property {number | undefined} elementCount
 *   Track siblings: there are `n` siblings.
 */

export {}
