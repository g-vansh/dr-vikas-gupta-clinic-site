const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Stage 1 SEO guards. Google Search Console showed the site ranking well (avg position 4.49)
// but converting non-branded searches at 1.15% against 8.47% branded -- a snippet problem,
// not a ranking problem. These tests keep the snippet fixes from regressing.

const baseURL = 'http://localhost:8080';
const ROOT = path.join(__dirname, '..');
const pages = ['/', '/about.html', '/services.html', '/testimonials.html', '/appointment.html', '/faq.html'];

// Google truncates around 60 chars / ~600px, and sooner on mobile where 96.7% of this
// site's clicks come from. Titles were 87-141 chars before Stage 1.
const TITLE_MAX = 60;
// Descriptions were 178-426 chars. Google shows roughly 155-160.
const DESC_MAX = 160;

for (const p of pages) {
  test(`${p} title fits in a mobile SERP`, async ({ page }) => {
    await page.goto(baseURL + p);
    const title = await page.title();
    expect(title.length, `"${title}" is ${title.length} chars`).toBeLessThanOrEqual(TITLE_MAX);
    expect(title.length, 'title should not be empty or stubby').toBeGreaterThan(20);
  });

  test(`${p} description fits in a mobile SERP`, async ({ page }) => {
    await page.goto(baseURL + p);
    const desc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(desc, 'description must exist').toBeTruthy();
    expect(desc.length, `description is ${desc.length} chars`).toBeLessThanOrEqual(DESC_MAX);
  });

  test(`${p} states the real rating, never the old inflated one`, async ({ page }) => {
    await page.goto(baseURL + p);
    const html = await page.content();
    // 4.8 was never true and overstating aggregateRating breaks Google's structured-data policy.
    expect(html, 'no stale 4.8 rating').not.toMatch(/4\.8\s*[★\/]|"ratingValue":\s*4\.8/);
    expect(html, 'no stale "500+" review count').not.toContain('500+');
  });

  test(`${p} links home with "/" so the homepage is one URL`, async ({ page }) => {
    await page.goto(baseURL + p);
    // Ten nav links pointed at index.html, teaching Google a duplicate homepage that
    // accumulated 23,838 impressions of its own.
    expect(await page.locator('a[href="index.html"]').count()).toBe(0);
    expect(await page.locator('a[href$="/index.html"]').count()).toBe(0);
  });
}

test('homepage aggregateRating matches Google exactly', async ({ page }) => {
  await page.goto(baseURL + '/');
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const ratings = [];
  for (const b of blocks) {
    let data; try { data = JSON.parse(b); } catch { continue; }
    JSON.stringify(data, (k, v) => {
      if (k === 'aggregateRating' && v) ratings.push(v);
      return v;
    });
  }
  expect(ratings.length, 'homepage should declare an aggregateRating').toBeGreaterThan(0);
  for (const r of ratings) {
    expect(Number(r.ratingValue)).toBe(4.6);
    expect(Number(r.reviewCount)).toBe(619);
  }
});

test('robots.txt lets Google render the page', () => {
  const robots = fs.readFileSync(path.join(ROOT, 'robots.txt'), 'utf8');
  // Blocking CSS/JS stops Googlebot rendering; and because the language toggle is
  // CSS-driven, it made both languages visible at once.
  const disallows = robots
    .split('\n')
    .filter(l => /^\s*Disallow:/i.test(l))
    .map(l => l.replace(/^\s*Disallow:\s*/i, '').trim())
    .filter(Boolean);
  for (const rule of disallows) {
    expect(rule, `robots.txt must not block "${rule}"`).not.toMatch(/\.css|\.js|assets/i);
  }
  expect(robots).toMatch(/Sitemap:\s*https:\/\/www\.drvikasgupta\.skin\/sitemap\.xml/);
});

test('no page invites patients to book by phone', async ({ page }) => {
  // The clinic does not take bookings over the phone; the FAQ used to say otherwise.
  for (const p of ['/', '/appointment.html', '/faq.html']) {
    await page.goto(baseURL + p);
    const html = await page.content();
    expect(html, `${p} should not tell patients to call for an appointment`)
      .not.toMatch(/Call\s+<?\/?strong>?\s*8273112888<?\/?strong>?\s*for in-clinic appointment/i);
  }
});
