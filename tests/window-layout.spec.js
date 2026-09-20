import { test, expect } from '@playwright/test'

const viewports = [
  { width: 1440, height: 900 }, { width: 1280, height: 800 },
  { width: 1024, height: 768 }, { width: 768, height: 1024 },
  { width: 430, height: 932 }, { width: 390, height: 844 },
  { width: 360, height: 800 }, { width: 1280, height: 480 },
]

test.beforeEach(async ({ page }) => {
  await page.route('https://fonts.googleapis.com/**', route => route.fulfill({ body: '', contentType: 'text/css' }))
  await page.goto('./')
  await page.getByRole('button', { name: 'OK', exact: true }).click()
})

async function enterCode(page, code) {
  for (let i = 0; i < code.length; i++) await page.getByLabel(`Dígito ${i + 1} do código`).fill(code[i])
  await page.getByRole('button', { name: 'ENTER', exact: true }).click()
}

async function checkLayout(page, name) {
  await page.screenshot({ path: `test-results/layout/${page.viewportSize().width}x${page.viewportSize().height}-${name}.png`, animations: 'disabled' })
  const issues = await page.locator('.window-content').evaluate(content => {
    const issues = []
    if (content.scrollWidth > content.clientWidth + 1) issues.push('horizontal window overflow')
    if (document.documentElement.scrollWidth > innerWidth) issues.push('horizontal page overflow')
    for (const node of content.querySelectorAll('.contact-container, .contact-main, .contact-grid, .secret-container, .secret-love, .love-card-horizontal, .love-content, .quiz-box')) {
      const style = getComputedStyle(node)
      if (['hidden', 'clip'].includes(style.overflowY) && node.scrollHeight > node.clientHeight + 1) issues.push(`clipped content: ${node.className}`)
    }
    return issues
  })
  expect(issues).toEqual([])
  await expect(page.getByRole('button', { name: 'Fechar janela', exact: true })).toBeInViewport()
}

async function checkReachable(page, locator) {
  await locator.scrollIntoViewIfNeeded()
  const bounds = await locator.boundingBox()
  const window = await page.locator('.window-content').boundingBox()
  expect(bounds.x).toBeGreaterThanOrEqual(window.x - 1)
  expect(bounds.x + bounds.width).toBeLessThanOrEqual(window.x + window.width + 1)
  expect(bounds.y).toBeGreaterThanOrEqual(window.y - 1)
  expect(bounds.y + bounds.height).toBeLessThanOrEqual(window.y + window.height + 1)
}

for (const viewport of viewports) {
  test(`contacts and every secret state fit ${viewport.width}x${viewport.height}`, async ({ page }) => {
    await page.setViewportSize(viewport)
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.getByRole('button', { name: 'Contatos', exact: true }).click()
    await checkLayout(page, 'contacts')
    for (const contact of await page.locator('.contact-item').all()) await checkReachable(page, contact)
    await page.getByRole('button', { name: 'Maximizar janela', exact: true }).click()
    await checkLayout(page, 'contacts-maximized')
    for (const contact of await page.locator('.contact-item').all()) await checkReachable(page, contact)
    await page.getByRole('button', { name: 'Fechar janela', exact: true }).click()

    await page.getByRole('button', { name: 'segredo super hiper secreto' }).click()
    await checkLayout(page, 'secret')
    await checkReachable(page, page.locator('.code-inputs'))
    await enterCode(page, '55555')
    await checkLayout(page, 'quiz')
    await checkReachable(page, page.locator('.quiz-options button').last())
    for (let i = 0; i < 5; i++) await page.locator('.quiz-options button').first().click()
    await checkLayout(page, 'result')
    await checkReachable(page, page.getByRole('button', { name: 'Fazer novamente' }))
    await page.getByRole('button', { name: 'Fazer novamente' }).click()
    await expect(page.locator('.quiz-progress')).toHaveText('Pergunta 1/5')
    await page.getByRole('button', { name: 'Fechar janela', exact: true }).click()

    await page.getByRole('button', { name: 'segredo super hiper secreto' }).click()
    await enterCode(page, '02408')
    await checkLayout(page, 'love')
    await checkReachable(page, page.getByText('Te amo ❤️', { exact: true }))
    await checkReachable(page, page.locator('.love-photo-horizontal'))
    expect(await page.locator('.love-photo-horizontal').evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true)
    expect(errors).toEqual([])
  })
}

test('reset clears secret feedback and a full pasted code keeps its leading zero', async ({ page }) => {
  await page.getByRole('button', { name: 'segredo super hiper secreto' }).click()
  await enterCode(page, '12345')
  await expect(page.locator('.hint')).toBeVisible()
  await page.getByRole('button', { name: 'RESET', exact: true }).click()
  await expect(page.locator('.hint')).toHaveCount(0)
  await expect(page.locator('.secret-container')).not.toHaveClass(/shake/)
  await expect(page.getByLabel('Dígito 1 do código')).toBeFocused()
  expect(await page.locator('.code-inputs input').evaluateAll(inputs => inputs.map(input => input.value))).toEqual(['', '', '', '', ''])
  await page.getByLabel('Dígito 2 do código').focus()
  await page.keyboard.press('Backspace')
  await expect(page.getByLabel('Dígito 1 do código')).toBeFocused()
  await page.getByLabel('Dígito 1 do código').evaluate(input => {
    const data = new DataTransfer()
    data.setData('text/plain', '02408')
    input.dispatchEvent(new ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData: data }))
  })
  await expect.poll(() => page.locator('.code-inputs input').evaluateAll(inputs => inputs.map(input => input.value))).toEqual(['0', '2', '4', '0', '8'])
  await page.getByRole('button', { name: 'ENTER', exact: true }).click()
  await expect(page.getByText('De André para Lola')).toBeVisible()
})

test('contact reordering preserves keyboard focus, persists and does not navigate on drop', async ({ page }) => {
  await page.getByRole('button', { name: 'Contatos', exact: true }).click()
  const linkedIn = page.locator('.contact-item').filter({ hasText: 'LinkedIn' })
  await linkedIn.focus()
  await page.keyboard.press('Alt+ArrowRight')
  await expect(page.locator('.contact-item').nth(1)).toHaveText('LinkedIn')
  await expect(linkedIn).toBeFocused()
  await page.keyboard.press('Alt+ArrowRight')
  await expect(page.locator('.contact-item').nth(2)).toHaveText('LinkedIn')
  await expect(linkedIn).toBeFocused()
  const url = page.url()
  await linkedIn.dragTo(page.locator('.contact-item').first())
  await expect(page.locator('.contact-item').first()).toHaveText('LinkedIn')
  expect(page.url()).toBe(url)
  const order = await page.locator('.contact-item').allTextContents()
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: 'Contatos', exact: true }).click()
  expect(await page.locator('.contact-item').allTextContents()).toEqual(order)
  await expect(page.locator('.contact-toolbar button')).toHaveCount(3)
  for (const button of await page.locator('.contact-toolbar button').all()) await expect(button).toBeDisabled()
})

test('targeted windows adapt when the viewport becomes short and narrow', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.getByRole('button', { name: 'Contatos', exact: true }).click()
  await page.getByRole('button', { name: 'Maximizar janela', exact: true }).click()
  await page.setViewportSize({ width: 360, height: 420 })
  await checkLayout(page, 'contacts-resized')
  await checkReachable(page, page.locator('.contact-item').last())
  await page.getByRole('button', { name: 'Fechar janela', exact: true }).click()
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.getByRole('button', { name: 'segredo super hiper secreto' }).click()
  await enterCode(page, '02408')
  await page.setViewportSize({ width: 360, height: 420 })
  await checkLayout(page, 'love-resized')
  await checkReachable(page, page.getByText('Te amo ❤️', { exact: true }))
})

test('contact panels retain their colors and layout in the alternate themes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  for (const theme of ['Dark', 'Neon', 'Cyber']) {
    await page.getByRole('button', { name: 'Personalizar', exact: true }).click()
    await page.getByRole('button', { name: theme, exact: true }).click()
    await page.getByRole('button', { name: 'Fechar janela', exact: true }).click()
    await page.getByRole('button', { name: 'Contatos', exact: true }).click()
    await expect(page.locator('.contact-container')).toHaveClass(new RegExp(`theme-${theme.toLowerCase()}`))
    await checkLayout(page, `contacts-${theme.toLowerCase()}`)
    const colors = await page.locator('.contact-toolbar').evaluate(node => ({ text: getComputedStyle(node).color, background: getComputedStyle(node).backgroundColor }))
    expect(colors.text).not.toBe(colors.background)
    await page.getByRole('button', { name: 'Fechar janela', exact: true }).click()
  }
})
