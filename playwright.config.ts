import { defineConfig } from '@playwright/test';
import 'dotenv/config';
export default defineConfig({
  globalSetup: './Auth/global-setup.ts',

  timeout: 120_000,           // per test
  expect: {
    timeout: 30_000          // for expect()
  },
  // 🔥 Smoke tests must be stable
  workers: 5,

  // 📊 HTML Report
  reporter: [
    ['html', { open: 'on-failure' }],
    ['json', { outputFile: 'test-results.json' }],
  ],

  use: {
    baseURL: process.env.BASE_URL!,
    storageState: 'auth.json',

    // 🐞 Debug helpers
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    launchOptions:{
      slowMo:1000
    },
    actionTimeout: 15_000,   // click, fill, press
    navigationTimeout: 30_000,

    // Optional but good
    headless: true
  }
});
