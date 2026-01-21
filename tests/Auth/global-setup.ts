import 'dotenv/config';
import fs from 'fs';
import { chromium } from '@playwright/test';

async function globalSetup() {
  const authFile = process.env.PLAYWRIGHT_AUTH_STATE || 'auth.json';

  // ✅ If auth already exists, skip login
  if (fs.existsSync(authFile)) {
    console.log('🔐 Auth state already exists. Skipping login.');
    return;
  }

  const context = await chromium.launchPersistentContext(
    process.env.PLAYWRIGHT_USER_DATA_DIR!,
    {
      channel: process.env.PLAYWRIGHT_BROWSER_CHANNEL || 'chrome',
      headless: process.env.PLAYWRIGHT_HEADLESS === 'true',
      args: ['--disable-blink-features=AutomationControlled'],
    }
  );

  const page = await context.newPage();
  await page.goto(process.env.PLAYWRIGHT_LOGIN_URL!);

  // 🔐 Manual Google Login
  await page.waitForURL(process.env.PLAYWRIGHT_SUCCESS_URL || '**/org');

  await context.storageState({ path: authFile });
  await context.close();
}

export default globalSetup;
