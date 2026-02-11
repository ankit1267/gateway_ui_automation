import { defineConfig } from '@playwright/test';
import 'dotenv/config';
export default defineConfig({
  globalSetup: './Auth/global-setup.ts',

  timeout: 60_000,           // per test
  expect: {
    timeout: 15_000          // for expect()
  },
  // 🔥 Smoke tests must be stable
  workers: 1,

  // 📊 HTML Report
  reporter: [['html', { open: 'on-failure' }]],

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
