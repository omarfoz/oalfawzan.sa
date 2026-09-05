import { chromium, axePath, launchOptions } from './browser-test-runtime.mjs';
import fs from 'node:fs/promises';

const base = process.env.AUDIT_BASE || 'http://127.0.0.1:4173';
const out = process.env.AUDIT_OUT || '/tmp/oalfawzan-light-audit';
const theme = process.env.AUDIT_THEME || 'light';
const routes = ['/', '/experience/', '/blog/', '/social/', '/privacy/'];
const viewports = {
  desktop: { width: 1440, height: 1000 },
  mobile: { width: 375, height: 812 },
};
const selectors = [
  'body', '.nav', '.nav-name', '.btn-sm', '.btn-sm.active', '.theme-toggle',
  '.hero', '.hero-sub', '.section-title', '.glass-card', '.logo-pill',
  '.timeline', '.tl-title', '.tl-body', '.project-card', '.project-banner',
  '.project-learned', '.project-link', '.filter-pill', '.filter-pill.active',
  '.blog-card', '.blog-cover', '.blog-title', '.blog-excerpt', '.blog-meta',
  '.social-link', '.pill', '.social-btn', '.social-icon', '.meta-pill',
  '.photo-item', '.gallery-counter', '.action-btn', '.action-btn.primary',
  'article', 'article a', 'footer'
];

await fs.mkdir(`${out}/screenshots`, { recursive: true });
const browser = await chromium.launch(launchOptions);
const report = { base, routes, runs: [], failures: [] };

for (const [viewportName, viewport] of Object.entries(viewports)) {
  const context = await browser.newContext({ viewport, colorScheme: theme, reducedMotion: 'reduce' });
  await context.addInitScript(savedTheme => localStorage.setItem('oalfawzan-theme', savedTheme), theme);
  for (const route of routes) {
    const page = await context.newPage();
    const consoleErrors = [];
    const pageErrors = [];
    page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
    page.on('pageerror', err => pageErrors.push(String(err)));
    const response = await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    const slug = route === '/' ? 'home' : route.split('/').filter(Boolean).join('-');
    await page.screenshot({ path: `${out}/screenshots/${slug}-${viewportName}.png`, fullPage: true });

    const snapshot = await page.evaluate((selectors) => {
      function details(el) {
        const s = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return {
          tag: el.tagName.toLowerCase(),
          classes: el.className?.baseVal ?? el.className ?? '',
          text: (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 100),
          color: s.color,
          backgroundColor: s.backgroundColor,
          backgroundImage: s.backgroundImage,
          borderColor: s.borderColor,
          boxShadow: s.boxShadow,
          opacity: s.opacity,
          display: s.display,
          visible: r.width > 0 && r.height > 0 && s.visibility !== 'hidden',
          rect: { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) }
        };
      }
      const selected = {};
      for (const selector of selectors) {
        selected[selector] = [...document.querySelectorAll(selector)].slice(0, 4).map(details);
      }
      const overflow = [...document.querySelectorAll('body *')].filter(el => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && (r.left < -1 || r.right > innerWidth + 1);
      }).slice(0, 30).map(details);
      return {
        theme: document.documentElement.dataset.theme || null,
        themeColor: document.querySelector('meta[name="theme-color"]')?.content || null,
        themeToggleCount: document.querySelectorAll('#themeToggle').length,
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth,
        selected,
        overflow,
      };
    }, selectors);

    await page.addScriptTag({ path: axePath });
    const contrastAudit = await page.evaluate(async () => {
      const result = await axe.run(document, { runOnly: { type: 'rule', values: ['color-contrast'] } });
      const compact = entries => entries.map(entry => ({
        id: entry.id,
        impact: entry.impact,
        nodes: entry.nodes.map(node => ({ target: node.target, html: node.html, summary: node.failureSummary }))
      }));
      return { violations: compact(result.violations), incomplete: compact(result.incomplete) };
    });

    const states = {};
    const toggle = page.locator('#themeToggle');
    await toggle.click();
    states.themeToggle = { afterFirstClick: await page.locator('html').getAttribute('data-theme') };
    await toggle.click();
    states.themeToggle.afterSecondClick = await page.locator('html').getAttribute('data-theme');

    const stateSelectors = ['.btn-sm:not(.active)', '.theme-toggle', '.filter-pill:not(.active)', '.blog-card', '.project-link', '.social-link', '.social-btn', '.action-btn:not(.primary)', 'article a'];
    for (const selector of stateSelectors) {
      const el = page.locator(selector).first();
      if (await el.count() && await el.isVisible()) {
        await el.hover();
        await page.waitForTimeout(350);
        states[`${selector}:hover`] = await el.evaluate(e => { const s=getComputedStyle(e); return {color:s.color,backgroundColor:s.backgroundColor,backgroundImage:s.backgroundImage,borderColor:s.borderColor,outline:s.outline,boxShadow:s.boxShadow}; });
        await el.focus();
        states[`${selector}:focus`] = await el.evaluate(e => { const s=getComputedStyle(e); return {color:s.color,backgroundColor:s.backgroundColor,borderColor:s.borderColor,outline:s.outline,boxShadow:s.boxShadow}; });
      }
    }

    if (route === '/blog/') {
      const filterCounts = {};
      for (const label of ['All', 'AI & LLMs', 'Cloud', 'Product', 'Containers']) {
        await page.locator('.filter-pill').filter({ hasText: label }).click();
        await page.waitForTimeout(300);
        filterCounts[label] = await page.locator('.blog-card:visible').count();
      }
      states.blogFilterCounts = filterCounts;
      await page.locator('.filter-pill').filter({ hasText: 'Cloud' }).click();
      await page.waitForTimeout(300);
      states.blogFilter = await page.evaluate(() => ({
        active: document.querySelector('.filter-pill.active')?.textContent.trim(),
        visibleCards: [...document.querySelectorAll('.blog-card')].filter(e => getComputedStyle(e).display !== 'none').length,
        activeStyle: (() => { const s=getComputedStyle(document.querySelector('.filter-pill.active')); return {color:s.color,backgroundColor:s.backgroundColor,borderColor:s.borderColor}; })()
      }));
      await page.locator('.filter-pill.active').hover();
      states.blogFilter.activeHoverStyle = await page.locator('.filter-pill.active').evaluate(e => {
        const s=getComputedStyle(e); return {color:s.color,backgroundColor:s.backgroundColor,borderColor:s.borderColor};
      });
      states.blogCoverIcons = await page.locator('.blog-cover .site-svg-icon').evaluateAll(elements =>
        elements.map(e => getComputedStyle(e).color)
      );
    }
    if (route === '/experience/') {
      states.mailIcon = await page.locator('a[href^="mailto:"] svg').evaluate(e => getComputedStyle(e).fill);
    }
    if (route === '/social/') {
      await page.locator('#loadMoreBtn').click();
      states.loadMoreCount = await page.locator('.photo-item').count();
      await page.locator('#shuffleBtn').click();
      states.newMixCount = await page.locator('.photo-item').count();
      await page.locator('.photo-item').first().click();
      await page.waitForTimeout(200);
      states.lightbox = await page.evaluate(() => {
        const box=document.querySelector('.lightbox'), control=document.querySelector('.lightbox-control'), info=document.querySelector('.lightbox-info');
        return [box,control,info].map(e => { const s=getComputedStyle(e); return {classes:e.className,color:s.color,backgroundColor:s.backgroundColor,borderColor:s.borderColor,display:s.display}; });
      });
      await page.screenshot({ path: `${out}/screenshots/social-lightbox-${viewportName}.png`, fullPage: false });
      await page.keyboard.press('Escape');
    }

    const run = { route, viewport: viewportName, status: response?.status(), consoleErrors, pageErrors, snapshot, states, contrastAudit };
    report.runs.push(run);
    if (response?.status() !== 200) report.failures.push(`${route} ${viewportName}: HTTP ${response?.status()}`);
    if (snapshot.theme !== theme) report.failures.push(`${route} ${viewportName}: theme is ${snapshot.theme || 'unset'}, expected ${theme}`);
    if (!snapshot.themeToggleCount) report.failures.push(`${route} ${viewportName}: missing theme toggle`);
    const expectedThemeColor = theme === 'light' ? '#dce8f5' : '#010204';
    if (snapshot.themeColor !== expectedThemeColor) report.failures.push(`${route} ${viewportName}: browser theme color does not match the ${theme} canvas`);
    if (snapshot.scrollWidth > snapshot.innerWidth + 1) report.failures.push(`${route} ${viewportName}: horizontal overflow ${snapshot.scrollWidth} > ${snapshot.innerWidth}`);
    if (consoleErrors.length || pageErrors.length) report.failures.push(`${route} ${viewportName}: console/page errors`);
    if (contrastAudit.violations.length) report.failures.push(`${route} ${viewportName}: axe color-contrast violation`);
    const bodyBackground = snapshot.selected.body[0]?.backgroundImage || '';
    if (theme === 'light' && (bodyBackground.includes('gradient(') || !bodyBackground.includes('/image-1600.webp'))) {
      report.failures.push(`${route} ${viewportName}: light mode must preserve the natural background photo without color overlays`);
    }
    if (theme === 'light' && route === '/') {
      const projectHover = states['.project-link:hover'];
      if (projectHover && projectHover.backgroundColor === 'rgb(0, 98, 204)' && projectHover.color !== 'rgb(255, 255, 255)') {
        report.failures.push(`${route} ${viewportName}: project link hover uses dark text on blue`);
      }
    }
    if (theme === 'light' && route === '/blog/') {
      if (states.blogFilter.activeHoverStyle.backgroundColor !== 'rgb(0, 98, 204)') {
        report.failures.push(`${route} ${viewportName}: active filter loses its selected background on hover`);
      }
      if (states.blogCoverIcons.some(color => color === 'rgb(17, 24, 39)')) {
        report.failures.push(`${route} ${viewportName}: dark SVG cover icon is unreadable on dark artwork`);
      }
    }
    if (theme === 'light' && route === '/experience/' && states.mailIcon === 'rgb(255, 255, 255)') {
      report.failures.push(`${route} ${viewportName}: white mail icon disappears on light card`);
    }
    if (theme === 'light' && route === '/privacy/') {
      const linkColor = snapshot.selected['article a'][0]?.color;
      if (linkColor === 'rgb(123, 188, 255)') report.failures.push(`${route} ${viewportName}: pale article link has poor light-mode contrast`);
    }
    await page.close();
  }
  await context.close();
}
await browser.close();
await fs.writeFile(`${out}/audit.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ runs: report.runs.length, failures: report.failures, output: out }, null, 2));
if (report.failures.length) process.exitCode = 1;
