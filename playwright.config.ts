import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load environment-specific .env file based on TEST_ENV (default: prod)
// Usage: TEST_ENV=dev npx playwright test
const testEnv = process.env.TEST_ENV || 'dev';
dotenv.config({ path: path.resolve(__dirname, `.env.${testEnv}`), override: true });
// Fallback to .env for any missing vars
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  timeout: 120_000,

  expect: {
    timeout: 30_000,
  },
  workers: 1,
  retries: 1,

 reporter: [
    ['html', { open: 'on-failure' }],
    ['json', { outputFile: 'test-results.json' }],
  ],

  use: {
    baseURL: process.env.BASE_URL!,
    headless: true,

    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    actionTimeout: 15_000,
    navigationTimeout: 30_000,

    permissions: ['clipboard-read', 'clipboard-write'],
  },

  projects: [
    { name: 'tests' },
  ],
});