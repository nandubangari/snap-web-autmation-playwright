import { defineConfig, devices } from '@playwright/test';
import fs from 'fs';
const storageStatePath = 'storageState.json'

export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 1 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */

  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
   timeout: 10000000, 


  use: {
    baseURL: 'https://www.linkedin.com/',
    headless: false, // run visible to look more human
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    locale: 'en-US',
    timezoneId: 'Asia/Kolkata',   // ⏰ India Standard Time
    colorScheme: 'light',
    storageState: fs.existsSync(storageStatePath) ? storageStatePath : undefined, // <-- dynamic
    actionTimeout: 300000,         // Default for actions like click/fill
    navigationTimeout: 300000, 

    launchOptions: {
      slowMo: 1000, // slow down actions slightly
      args: [
        '--disable-blink-features=AutomationControlled',
        '--start-maximized',
      ],
    },
  },




  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        headless: false, // Run with UI
        launchOptions: {
          args: [
            '--disable-blink-features=AutomationControlled',
            '--start-maximized',
          ],
          slowMo: 50,
        },
        viewport: null,
      },
    },

  ],
});
