import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.js',
  fullyParallel: false,
  workers: 1,
  timeout: 45000,
  use: {
    baseURL: 'http://127.0.0.1:4173/tccLola-portif-lio/',
    channel: process.env.PLAYWRIGHT_CHANNEL || (process.env.CI ? undefined : 'chrome'),
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'node node_modules/vite/bin/vite.js preview --configLoader native --host 127.0.0.1 --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173/tccLola-portif-lio/',
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
})
