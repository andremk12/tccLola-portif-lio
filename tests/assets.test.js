import assert from 'node:assert/strict'
import test from 'node:test'
import fs from 'node:fs'
import crypto from 'node:crypto'
import { casinoFrames } from '../src/data/casinoFrames.js'

test('casino deduplication preserves every original animation frame', () => {
  const hash = path => crypto.createHash('sha256').update(fs.readFileSync(new URL('../public/' + path, import.meta.url))).digest('hex')
  assert.equal(casinoFrames.length, 4)
  casinoFrames.forEach((group, g) => {
    assert.equal(group.length, 71)
    group.forEach((path, index) => assert.equal(hash(path), hash(`cassinoAssets/grupo${g + 1}/grupo${g + 1}foto${index}.jpg`)))
  })
})
