const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

// Stage 3 guards. Before this, both languages shared one URL: / and /?lang=hi returned
// byte-identical HTML, both declaring <html lang="en">, with no hreflang. Search Console
// showed Hindi queries ranking on page one -- position 1.0 for स्किन रोग विशेषज्ञ -- and
// earning almost nothing, because the snippet shown was English.

const baseURL = 'http://localhost:8080';
const ROOT = path.join(__dirname, '..');
const ORIGIN = 'https://www.drvikasgupta.skin';
const PAGES = ['index.html', 'about.html', 'services.html', 'testimonials.html', 'appointment.html', 'faq.html'];

const enUrl = f => (f === 'index.html' ? '/' : `/${f}`);
const hiUrl = f => (f === 'index.html' ? '/hi/' : `/hi/${f}`);

for (const f of PAGES) {
  test(`${hiUrl(f)} is a real Hindi page`, async ({ page }) => {
    await page.goto(baseURL + hiUrl(f));

    // The three things that let Google serve this to a Hindi searcher.
    await expect(page.locator('html')).toHaveAttribute('lang', 'hi');
    expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toBe(ORIGIN + hiUrl(f));
    const title = await page.title();
    expect(title, 'title must be in Devanagari').toMatch(/[ऀ-ॿ]/);
    expect(title.length, `"${title}" is ${title.length} chars`).toBeLessThanOrEqual(60);

    const desc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(desc, 'description must be in Devanagari').toMatch(/[ऀ-ॿ]/);
    expect(desc.length).toBeLessThanOrEqual(160);
  });

  test(`${enUrl(f)} and ${hiUrl(f)} point at each other`, async ({ page }) => {
    // hreflang only counts if it is reciprocal; a one-way declaration is ignored.
    for (const url of [enUrl(f), hiUrl(f)]) {
      await page.goto(baseURL + url);
      const alts = await page.locator('link[rel="alternate"][hreflang]').evaluateAll(
        ls => ls.map(l => ({ lang: l.getAttribute('hreflang'), href: l.getAttribute('href') })));
      expect(alts.length, `${url} should declare exactly 3 alternates`).toBe(3);
      expect(alts.find(a => a.lang === 'en-IN')?.href).toBe(ORIGIN + enUrl(f));
      expect(alts.find(a => a.lang === 'hi-IN')?.href).toBe(ORIGIN + hiUrl(f));
      expect(alts.find(a => a.lang === 'x-default')?.href).toBe(ORIGIN + enUrl(f));
    }
  });

  test(`${hiUrl(f)} loads its assets from the site root`, async ({ page }) => {
    // Relative paths silently break one directory down.
    const broken = [];
    page.on('response', r => { if (r.status() >= 400) broken.push(r.status() + ' ' + r.url()); });
    await page.goto(baseURL + hiUrl(f), { waitUntil: 'networkidle' });
    expect(broken, 'no asset should 404 under /hi/').toEqual([]);
  });
}

test('English pages still declare English', async ({ page }) => {
  for (const f of PAGES) {
    await page.goto(baseURL + enUrl(f));
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toBe(ORIGIN + enUrl(f));
  }
});

test('legacy ?lang=hi URLs forward to the real Hindi page', async ({ page }) => {
  // These are indexed and earned 249 clicks last quarter; they must not be stranded.
  for (const f of PAGES) {
    await page.goto(baseURL + enUrl(f) + '?lang=hi');
    await page.waitForURL(u => u.pathname.startsWith('/hi/'), { timeout: 5000 });
    expect(new URL(page.url()).pathname).toBe(hiUrl(f));
  }
});

test('the language toggle navigates between the two URLs', async ({ page }) => {
  await page.goto(baseURL + '/about.html');
  await page.locator('.lang-btn[data-lang="hi"]').click();
  await page.waitForURL('**/hi/about.html');
  await expect(page.locator('html')).toHaveAttribute('lang', 'hi');

  await page.locator('.lang-btn[data-lang="en"]').click();
  await page.waitForURL(u => !u.pathname.startsWith('/hi/'));
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('nothing rewrites the canonical at runtime', async ({ page }) => {
  // A script used to set canonical.href to a ?lang= URL after load. Googlebot renders JS,
  // so that is how /?lang=hi got indexed as its own page with 12,317 impressions.
  for (const url of ['/', '/hi/', '/hi/about.html']) {
    await page.goto(baseURL + url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(900); // the old script fired on a 500ms timer
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canonical, `${url} canonical drifted after load`).not.toContain('lang=');
    expect(canonical).toBe(ORIGIN + (url === '/' ? '/' : url));
  }
});

test('sitemap lists both languages with hreflang and no ?lang= URLs', () => {
  const xml = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  expect(xml, 'sitemap must not list query-parameter URLs').not.toContain('?lang=');
  for (const f of PAGES) {
    expect(xml).toContain(`<loc>${ORIGIN}${enUrl(f)}</loc>`);
    expect(xml).toContain(`<loc>${ORIGIN}${hiUrl(f)}</loc>`);
  }
  expect((xml.match(/<loc>/g) || []).length).toBe(PAGES.length * 2);
  expect((xml.match(/hreflang="hi-IN"/g) || []).length).toBe(PAGES.length * 2);
});

test('/hi/ is in sync with its English source', () => {
  // /hi/ is generated and committed. If someone edits an English page without re-running
  // the build, the two drift apart silently. Re-run it and check nothing changed.
  const before = PAGES.map(f => fs.readFileSync(path.join(ROOT, 'hi', f), 'utf8'));
  execFileSync('node', [path.join(ROOT, 'build-hi.js')], { cwd: ROOT, env: { ...process.env, BUILD_DATE: '2026-08-11' } });
  const after = PAGES.map(f => fs.readFileSync(path.join(ROOT, 'hi', f), 'utf8'));
  PAGES.forEach((f, i) => {
    expect(after[i], `hi/${f} is stale — run "npm run build:hi" and commit the result`).toBe(before[i]);
  });
});
