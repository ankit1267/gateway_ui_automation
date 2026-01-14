import { chromium } from '@playwright/test';

async function globalSetup() {
  const context = await chromium.launchPersistentContext(
    'C:/Users/Tilakraj/chrome-playwright-profile', // ✅ NEW PROFILE
    {
      channel: 'chrome',
      headless: false,
      args: ['--disable-blink-features=AutomationControlled']
    }
  );

  const page = await context.newPage();
  await page.goto('https://app.gtwy.ai/login');

  // 🔐 LOGIN MANUALLY WITH GOOGLE
  await page.waitForURL('**/org');

  await context.storageState({ path: 'auth.json' });
  await context.close();
}

export default globalSetup;
