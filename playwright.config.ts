import { defineConfig, devices } from '@playwright/test'

const clientUrl = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5173'
const apiUrl = process.env.PLAYWRIGHT_API_URL ?? 'http://localhost:4000'

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  reporter: [['list'], ['html', { open: 'never' }]],
  globalSetup: './tests/global-setup.ts',
  use: {
    baseURL: clientUrl,
    headless: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
  webServer: [
    {
      command: 'npm run start',
      cwd: './server',
      url: `${apiUrl}/api/health`,
      timeout: 120_000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npm run dev -- --host 127.0.0.1 --port 5173',
      cwd: './client',
      url: `${clientUrl}/login`,
      timeout: 120_000,
      reuseExistingServer: !process.env.CI,
      env: {
        ...process.env,
        VITE_API_URL: apiUrl,
      },
    },
  ],
})
