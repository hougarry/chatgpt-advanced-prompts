/**
 * @typedef {import('mdast').Root} Root
 */

import {nameToEmoji} from 'gemoji'
import {visit} from 'unist-util-visit'

const find = /:(\+1|[-\w]+):/g

const own = {}.hasOwnProperty

/**
 * Plugin to turn gemoji shortcodes (`:+1:`) into emoji (`👍`).
 *
 * @type {import('unified').Plugin<void[], Root>}
 */
export default function remarkGemoji() {
  return (tree) => {
    visit(tree, 'text', (node) => {
      const value = node.value
      /** @type {string[]} */
      const slices = []
      find.lastIndex = 0
      let match = find.exec(value)
      let start = 0

      while (match) {
        const emoji = /** @type {keyof nameToEmoji} */ (match[1])
        const position = match.index

        if (own.call(nameToEmoji, emoji)) {
          if (start !== position) {
            slices.push(value.slice(start, position))
          }

          slices.push(nameToEmoji[emoji])
          start = position + match[0].length
        } else {
          find.lastIndex = position + 1
        }

        match = find.exec(value)
      }

      if (slices.length > 0) {
        slices.push(value.slice(start))
        node.value = slices.join('')
      }
    })
  }
}
