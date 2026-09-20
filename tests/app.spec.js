import { test, expect } from '@playwright/test'

async function boot(page) {
  await page.goto('./')
  await page.getByRole('button', { name: 'OK', exact: true }).click()
}
async function openWorks(page) {
  await page.getByRole('button', { name: 'Trabalhos', exact: true }).click()
}
test.beforeEach(async ({ page }) => {
  await page.route('https://fonts.googleapis.com/**', route => route.fulfill({ body: '', contentType: 'text/css' }))
})

for (const viewport of [{ width: 1440, height: 900 }, { width: 1366, height: 768 }, { width: 768, height: 1024 }, { width: 390, height: 844 }]) {
  test(`desktop and main windows fit ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport)
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await boot(page)
    await expect(page.getByRole('button', { name: 'Relógio' })).toBeVisible()
    for (const name of ['Contatos', 'Curriculum', 'Trabalhos', 'Projetos', 'Personalizar']) {
      await page.getByRole('button', { name, exact: true }).click()
      const bounds = await page.locator('.window').boundingBox()
      expect(bounds.x).toBeGreaterThanOrEqual(0)
      expect(bounds.y).toBeGreaterThanOrEqual(0)
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(viewport.width + 1)
      expect(bounds.y + bounds.height).toBeLessThanOrEqual(viewport.height + 1)
      const overflow = await page.locator('.window-content').evaluate(node => node.scrollWidth > node.clientWidth + 2)
      expect(overflow, `${name} overflows`).toBe(false)
      await page.getByRole('button', { name: 'Fechar janela', exact: true }).click()
    }
    await page.screenshot({ path: `test-results/desktop-${viewport.width}.png` })
    expect(errors).toEqual([])
  })
}
test('customization stays selected after reopening and drag controls remain reachable', async ({ page }) => {
  await boot(page)
  await page.getByRole('button', { name: 'Personalizar', exact: true }).click()
  await page.getByRole('button', { name: 'Night', exact: true }).click()
  await page.getByRole('button', { name: 'Crosshair', exact: true }).click()
  await page.getByRole('button', { name: 'Dark', exact: true }).click()
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: 'Personalizar', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Night', exact: true })).toHaveClass(/active/)
  await expect(page.getByRole('button', { name: 'Dark', exact: true })).toHaveClass(/active/)
  await expect(page.getByRole('button', { name: 'Crosshair', exact: true })).toHaveClass(/active/)
  const title = await page.locator('.window-title').boundingBox()
  await page.mouse.move(title.x + 10, title.y + 5)
  await page.mouse.down()
  await page.mouse.move(-50, -50)
  await page.mouse.up()
  await expect(page.getByRole('button', { name: 'Fechar janela', exact: true })).toBeInViewport()
})
test('invalid saved contacts cannot crash the window or inject a URL', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('contactsOrder', '{invalid'))
  await boot(page)
  await page.getByRole('button', { name: 'Contatos', exact: true }).click()
  await expect(page.locator('.contact-item')).toHaveCount(6)
  await page.keyboard.press('Escape')
  await page.evaluate(() => localStorage.setItem('contactsOrder', JSON.stringify([{ name: 'Github', link: 'javascript:alert(1)' }])))
  await page.getByRole('button', { name: 'Contatos', exact: true }).click()
  await expect(page.locator('.contact-item').first()).toHaveAttribute('href', 'https://github.com')
})
test('feedback preserves text on failure and blocks concurrent sends', async ({ page }) => {
  let requests = 0
  await page.route('https://api.emailjs.com/**', async route => {
    requests++
    await new Promise(resolve => setTimeout(resolve, 300))
    await route.fulfill({ status: requests === 1 ? 500 : 200, body: requests === 1 ? 'Failed' : 'OK' })
  })
  await boot(page)
  await page.getByRole('button', { name: 'Colabore!', exact: true }).click()
  await page.getByLabel('Seu nome', { exact: true }).fill('Teste automatizado')
  await page.getByLabel('Descreva seu feedback').fill('Mensagem de teste, envio simulado.')
  await page.getByRole('button', { name: 'Enviar', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Enviando...' })).toBeDisabled()
  await expect(page.getByRole('alert')).toBeVisible()
  await expect(page.getByLabel('Descreva seu feedback')).toHaveValue('Mensagem de teste, envio simulado.')
  await page.getByRole('button', { name: 'Enviar', exact: true }).click()
  await expect(page.getByText('✔ Feedback enviado!')).toBeVisible()
  expect(requests).toBe(2)
})
test('terminal ignores inherited object properties and clear empties history', async ({ page }) => {
  await boot(page)
  for (const key of ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'a']) await page.keyboard.press(key)
  const input = page.getByLabel('Comando do terminal')
  await input.fill('constructor')
  await input.press('Enter')
  await expect(page.getByText('Comando não encontrado')).toBeVisible()
  await input.fill('clear')
  await input.press('Enter')
  await expect(page.locator('.terminal-body')).toBeEmpty()
})
test('album collects one pack and releases its animation loop on close', async ({ page }) => {
  await page.addInitScript(() => {
    const request = window.requestAnimationFrame.bind(window)
    const cancel = window.cancelAnimationFrame.bind(window)
    window.pendingFrames = new Set()
    window.requestAnimationFrame = callback => {
      const id = request(time => { window.pendingFrames.delete(id); callback(time) })
      window.pendingFrames.add(id)
      return id
    }
    window.cancelAnimationFrame = id => { window.pendingFrames.delete(id); cancel(id) }
  })
  await boot(page)
  const initial = await page.evaluate(() => window.pendingFrames.size)
  await page.getByRole('button', { name: 'Albúm de figurinhas', exact: true }).click()
  await page.getByRole('button', { name: '🎁 Abrir pacote', exact: true }).click()
  await page.getByRole('button', { name: 'Rasgar pacote' }).press('Enter')
  await page.getByRole('button', { name: 'Guardar', exact: true }).click()
  await page.getByRole('button', { name: '🛒 Loja', exact: true }).click()
  await expect(page.getByText('💰 Moedas: 3')).toBeVisible()
  await page.locator('.close-shop').click()
  await page.locator('.close-book').click()
  await expect.poll(() => page.evaluate(() => window.pendingFrames.size)).toBe(initial)
})
test('Pong restarts without accumulating loops and releases them on close', async ({ page }) => {
  await page.addInitScript(() => {
    const request = window.requestAnimationFrame.bind(window), cancel = window.cancelAnimationFrame.bind(window)
    window.pendingFrames = new Set()
    window.requestAnimationFrame = callback => { const id = request(time => { window.pendingFrames.delete(id); callback(time) }); window.pendingFrames.add(id); return id }
    window.cancelAnimationFrame = id => { window.pendingFrames.delete(id); cancel(id) }
  })
  await boot(page)
  await openWorks(page)
  await page.getByRole('button', { name: /Ping pong com estética/ }).click()
  await page.getByRole('button', { name: '▶ Jogar' }).click()
  await expect(page.locator('.game-screen canvas')).toBeVisible()
  await page.locator('.game-screen canvas').focus()
  for (let i = 0; i < 10; i++) await page.keyboard.press('r')
  expect(await page.evaluate(() => window.pendingFrames.size)).toBeLessThanOrEqual(1)
  await page.locator('.game-header button').click()
  await expect.poll(() => page.evaluate(() => window.pendingFrames.size)).toBe(0)
})
test('paint scaled coordinates and secret quiz work on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await boot(page)
  await page.getByRole('button', { name: 'Mostre seu talento' }).click()
  const canvas = page.locator('.paint-canvas')
  const box = await canvas.boundingBox()
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width / 2 + 20, box.y + box.height / 2 + 20)
  await page.mouse.up()
  expect(await canvas.evaluate(node => node.getContext('2d').getImageData(0, 0, node.width, node.height).data.some((value, i) => i % 4 === 3 && value > 0))).toBe(true)
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: 'segredo super hiper secreto' }).click()
  for (let i = 1; i <= 5; i++) await page.getByLabel(`Dígito ${i} do código`).fill('5')
  await page.getByRole('button', { name: 'ENTER', exact: true }).click()
  for (let i = 0; i < 5; i++) await page.locator('.quiz-box button').first().click()
  await expect(page.getByText('✨ Resultado ✨')).toBeVisible()
})


for (const viewport of [{ width: 1366, height: 768 }, { width: 390, height: 844 }]) {
  for (const game of [{ title: 'Matar homis', canvas: '.alien-game-canvas canvas', close: '.alien-game-header button' }, { title: 'Cassino Zee', canvas: '.cassino-game canvas', close: '.cassino-header button' }]) {
    test(`p5 ${game.title} loads all assets and closes at ${viewport.width}px`, async ({ page }) => {
      await page.setViewportSize(viewport)
      const errors = [], missing = []
      page.on('pageerror', error => errors.push(error.message))
      page.on('response', response => {
        if (response.url().includes('127.0.0.1') && response.status() >= 400) missing.push(response.url())
      })
      await boot(page)
      await openWorks(page)
      await page.locator('.work-card').filter({ hasText: game.title }).click()
      await page.getByRole('button', { name: '▶ Jogar' }).click()
      const canvas = page.locator(game.canvas)
      await expect(canvas).toBeVisible({ timeout: 20000 })
      await canvas.focus()
      await canvas.press('Space')
      const bounds = await canvas.boundingBox()
      expect(bounds.x).toBeGreaterThanOrEqual(0)
      expect(bounds.x + bounds.width).toBeLessThanOrEqual(viewport.width + 1)
      await page.screenshot({ path: `test-results/p5-${game.title.replaceAll(' ', '-')}-${viewport.width}.png` })
      await page.locator(game.close).click()
      await expect(canvas).toHaveCount(0)
      expect(missing).toEqual([])
      expect(errors).toEqual([])
    })
  }
}
test('album fits a phone, can turn pages and closes with Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await boot(page)
  await page.getByRole('button', { name: 'Albúm de figurinhas', exact: true }).click()
  await expect(page.locator('.stf__parent')).toBeVisible()
  await page.locator('.nav-right').click()
  await page.screenshot({ path: 'test-results/album-mobile.png' })
  await expect(page.locator('.close-book')).toBeInViewport()
  await page.keyboard.press('Escape')
  await expect(page.locator('.stickerbook-overlay')).toHaveCount(0)
})
test('hash URL survives direct loading and refresh under the Pages base', async ({ page }) => {
  await page.goto('./#/desktop')
  await page.getByRole('button', { name: 'OK', exact: true }).click()
  await page.reload()
  await page.getByRole('button', { name: 'OK', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Contatos', exact: true })).toBeVisible()
  expect(page.url()).toContain('/tccLola-portif-lio/#/desktop')
})

test('start menu, pet activation, movement and removal remain functional', async ({ page }) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await boot(page)
  await page.getByRole('button', { name: 'Iniciar', exact: true }).click()
  await expect(page.locator('.start-menu')).toBeVisible()
  await page.locator('.start-menu').getByRole('button', { name: /Contatos/ }).click()
  await expect(page.locator('.contact-item')).toHaveCount(6)
  await expect(page.locator('.start-menu')).toHaveCount(0)
  await page.keyboard.press('Escape')
  const openTerminal = async () => {
    for (const key of ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'a']) await page.keyboard.press(key)
    return page.getByLabel('Comando do terminal')
  }
  let input = await openTerminal()
  await input.fill('futebol')
  await input.press('Enter')
  const pet = page.locator('.pet')
  await expect(pet).toBeVisible()
  const initialX = await pet.evaluate(node => node.style.left)
  await expect.poll(() => pet.evaluate(node => node.style.left)).not.toBe(initialX)
  await page.keyboard.press('Escape')
  await page.locator('.desktop').click({ position: { x: 700, y: 300 } })
  await expect(page.locator('.ball')).toBeVisible()
  await page.screenshot({ path: 'test-results/pet-desktop.png' })
  input = await openTerminal()
  await input.fill('tchaufutebol')
  await input.press('Enter')
  await expect(pet).toHaveCount(0)
  await expect(page.locator('.ball')).toHaveCount(0)
  expect(errors).toEqual([])
})
