const fs = require('node:fs')
const crypto = require('node:crypto')
const byHash = new Map()
const groups = Array.from({ length: 4 }, (_, group) => Array.from({ length: 71 }, (_, index) => {
  const path = `cassinoAssets/grupo${group + 1}/grupo${group + 1}foto${index}.jpg`
  const hash = crypto.createHash('sha256').update(fs.readFileSync('public/' + path)).digest('hex')
  if (!byHash.has(hash)) byHash.set(hash, path)
  return byHash.get(hash)
}))
fs.writeFileSync('src/data/casinoFrames.js', '// Identical files share one decoded image. Frame order and timing are preserved.\nexport const casinoFrames = ' + JSON.stringify(groups, null, 2) + '\n')
console.log(`284 frames reference ${byHash.size} unique images.`)
