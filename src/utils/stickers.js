export const stickerPrices = { common: 5, rare: 12, legendary: 25 }
const duplicateCoins = { common: 1, rare: 3, legendary: 8 }

export function collectPack(collection, pack) {
  const ids = new Set(collection.collected)
  let coins = collection.coins
  for (const sticker of pack) {
    coins += ids.has(sticker.id) ? duplicateCoins[sticker.rarity] : 1
    ids.add(sticker.id)
  }
  return { collected: [...ids], coins }
}

export function purchaseSticker(collection, sticker) {
  const price = stickerPrices[sticker.rarity]
  if (collection.collected.includes(sticker.id) || !price || collection.coins < price) return collection
  return { collected: [...collection.collected, sticker.id], coins: collection.coins - price }
}
