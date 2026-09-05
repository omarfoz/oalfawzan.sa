import assert from 'node:assert/strict';
import { chromium, launchOptions } from './browser-test-runtime.mjs';

const base = process.env.AUDIT_BASE || 'http://127.0.0.1:4173';
const browser = await chromium.launch(launchOptions);
const routes = ['/', '/experience/', '/blog/', '/social/', '/privacy/'];
try {
  // Hold the deferred application scripts: the first visible page must already
  // use the saved preference, rather than flashing the default dark palette.
  for (const route of routes) {
    const page = await browser.newPage({ colorScheme: 'dark' });
    await page.addInitScript(() => localStorage.setItem('oalfawzan-theme', 'light'));
    let release;
    const gate = new Promise(resolve => { release = resolve; });
    await page.route(/\/(theme|data)\.js$/, async request => {
      await gate;
      await request.continue();
    });
    const navigation = page.goto(`${base}${route}`);
    try {
      await page.locator('.nav').waitFor({ state: 'visible' });
      assert.equal(await page.locator('html').getAttribute('data-theme'), 'light', `${route}: light mode must apply before deferred scripts load`);
      assert.equal(await page.locator('meta[name="theme-color"]').getAttribute('content'), '#dce8f5');
    } finally {
      release();
      await navigation;
      await page.close();
    }
  }
  console.log('PASS: saved light theme applied before deferred scripts on all five routes');
} finally {
  await browser.close();
}
