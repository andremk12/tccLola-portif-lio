import assert from 'node:assert/strict'
import test from 'node:test'
import { restoreContactOrder } from '../src/utils/contacts.js'
import { collectPack, purchaseSticker } from '../src/utils/stickers.js'
import { canvasPoint } from '../src/utils/canvas.js'

const contacts = [{ name: 'A', link: 'https://example.com/a' }, { name: 'B', link: 'https://example.com/b' }]
test('contact order migrates old objects, ignores injected URLs, duplicates and unknown entries', () => {
  assert.deepEqual(restoreContactOrder(contacts, [{ name: 'B', link: 'javascript:alert(1)' }, null, 'B', 'unknown']), [contacts[1], contacts[0]])
  for (const invalid of [null, {}, 'broken', 42]) assert.deepEqual(restoreContactOrder(contacts, invalid), contacts)
})
test('collecting packs awards duplicate coins once without mutating previous state', () => {
  const previous = { collected: [1], coins: 0 }
  const result = collectPack(previous, [{ id: 1, rarity: 'legendary' }, { id: 2, rarity: 'rare' }])
  assert.deepEqual(result, { collected: [1, 2], coins: 9 })
  assert.deepEqual(previous, { collected: [1], coins: 0 })
})
test('buying requires enough coins and cannot charge for owned stickers', () => {
  const sticker = { id: 1, rarity: 'rare' }
  assert.deepEqual(purchaseSticker({ collected: [], coins: 12 }, sticker), { collected: [1], coins: 0 })
  const poor = { collected: [], coins: 11 }
  assert.equal(purchaseSticker(poor, sticker), poor)
  const owned = { collected: [1], coins: 50 }
  assert.equal(purchaseSticker(owned, sticker), owned)
})
test('canvas coordinates scale with the displayed canvas', () => {
  assert.deepEqual(canvasPoint(185, 110, { left: 10, top: 10, width: 350, height: 200 }, 700, 400), { x: 350, y: 200 })
})
