import { chromium } from '@playwright/test';

async function globalSetup() {
  const context = await chromium.launchPersistentContext(
    process.env.PLAYWRIGHT_USER_DATA_DIR!, // ⬅️ user-specific → env
    {
      channel: process.env.PLAYWRIGHT_BROWSER_CHANNEL || 'chrome',
      headless: process.env.PLAYWRIGHT_HEADLESS === 'true',
      args: ['--disable-blink-features=AutomationControlled'],
    }
  );

  const page = await context.newPage();

  await page.goto(process.env.PLAYWRIGHT_LOGIN_URL!);

  // 🔐 LOGIN MANUALLY WITH GOOGLE (unchanged logic)
  await page.waitForURL(process.env.PLAYWRIGHT_SUCCESS_URL || '**/org');

  await context.storageState({
    path: process.env.PLAYWRIGHT_AUTH_STATE || 'auth.json',
  });

  await context.close();
}

export default globalSetup;
