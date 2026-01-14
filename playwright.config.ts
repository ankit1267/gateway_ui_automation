import { defineConfig } from '@playwright/test';

export default defineConfig({
  globalSetup: './tests/auth/global-setup.ts',

  // 🔥 Smoke tests must be stable
  workers: 1,

  // 📊 HTML Report
  reporter: [['html', { open: 'on-failure' }]],

  use: {
    storageState: 'auth.json',

    // 🐞 Debug helpers
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // Optional but good
    headless: true
  }
});
