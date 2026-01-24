import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',

  fullyParallel: true,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: process.env.CI ? 1 : undefined,

  reporter: 'html',

  timeout: 60_000,

  expect: {
    timeout: 5_000,
  },

  use: {
    headless: true,
    trace: 'on-first-retry',
    baseURL: 'http://localhost:3000',
  },

  webServer: {
    command: 'npm run dev-server',
    url: 'http://localhost:3000',
    timeout: 30_000,
    reuseExistingServer: !process.env.CI,
  },

  projects: [
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
});
