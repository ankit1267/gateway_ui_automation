import { defineConfig } from '@playwright/test';
import 'dotenv/config';

export default defineConfig({
  timeout: 120_000,

  expect: {
    timeout: 30_000,
  },
  // 🔥 Smoke tests must be stable
  workers: 1,

  reporter: [['html', { open: 'on-failure' }]],

  use: {
    baseURL: process.env.BASE_URL!,
    headless: true,

    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },

  projects: [
    { name: 'tests' },
  ],
});
