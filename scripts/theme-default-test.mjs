import assert from 'node:assert/strict';
import { chromium, launchOptions } from './browser-test-runtime.mjs';
const browser = await chromium.launch(launchOptions);
const base = process.env.AUDIT_BASE || 'http://127.0.0.1:4173';
try {
  for (const route of ['/', '/experience/', '/blog/', '/social/', '/privacy/']) {
    const page = await browser.newPage({ colorScheme: 'light' });
    await page.goto(base + route);
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark', `${route}: default must be dark even on a light OS`);
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.emulateMedia({ colorScheme: 'light' });
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
    await page.locator('#themeToggle').click();
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'light', `${route}: first click must switch to light`);
    assert.equal(await page.locator('#themeToggle').getAttribute('aria-label'), 'Switch to dark mode');
    await page.locator('#themeToggle').click();
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark', `${route}: second click must switch back to dark`);
    assert.equal(await page.locator('#themeToggle').getAttribute('aria-label'), 'Switch to light mode');
    await page.reload();
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark', `${route}: explicit dark preference must persist`);
    await page.locator('#themeToggle').click();
    await page.reload();
    assert.equal(await page.locator('html').getAttribute('data-theme'), 'light', `${route}: explicit light preference must persist`);
    await page.close();
  }
  console.log('PASS: dark default, OS independence, and saved light preference on all five routes');
} finally {
  await browser.close();
}
