const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { CONDITIONS, REVIEWED_ON } = require('../conditions.data');

// Stage 4 guards: the condition pages, and the E-E-A-T markers Google requires of health
// content. Topics were chosen from Search Console demand -- hair loss 622 impressions,
// skin allergy/fungal 296, vitiligo 43, acne 25 -- restricted to conditions the clinic
// already states it treats.

const baseURL = 'http://localhost:8080';
const ROOT = path.join(__dirname, '..');
const ORIGIN = 'https://www.drvikasgupta.skin';
const BOOKING = 'https://www.eka.care/doctor/dr-vikas-gupta-dermatology-moradabad';

for (const c of CONDITIONS) {
  test(`${c.slug} is a well-formed condition page`, async ({ page }) => {
    await page.goto(baseURL + '/' + c.slug);

    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    expect(await page.locator('h1').count(), 'exactly one h1').toBe(1);
    expect(await page.locator('link[rel="canonical"]').getAttribute('href')).toBe(`${ORIGIN}/${c.slug}`);

    const title = await page.title();
    expect(title.length, `"${title}" is ${title.length} chars`).toBeLessThanOrEqual(60);
    const desc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(desc.length).toBeLessThanOrEqual(160);

    // Heading order must not skip -- these pages go h1 then h2 throughout.
    const levels = await page.evaluate(() =>
      [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(h => h.offsetParent !== null).map(h => +h.tagName[1]));
    let prev = 0;
    for (const l of levels) { if (prev) expect(l).toBeLessThanOrEqual(prev + 1); prev = l; }
  });

  test(`${c.slug} carries its E-E-A-T markers`, async ({ page }) => {
    await page.goto(baseURL + '/' + c.slug);

    // Health content is YMYL: Google expects a named, credentialed clinician and a review date.
    const byline = page.locator('.medical-byline');
    await expect(byline).toBeVisible();
    await expect(byline).toContainText('Dr. Vikas Gupta, MD');
    await expect(byline).toContainText(REVIEWED_ON.en);

    // The block is an @graph now: MedicalWebPage plus FAQPage, so they stay linked as one
    // description of the page rather than two unrelated scripts.
    const raw = JSON.parse(await page.locator('script[type="application/ld+json"]').first().textContent());
    const graph = raw['@graph'] || [raw];
    const ld = graph.find(e => e['@type'] === 'MedicalWebPage');
    expect(ld, 'page should declare MedicalWebPage').toBeTruthy();
    expect(ld.lastReviewed).toBe(REVIEWED_ON.iso);
    expect(ld.about['@type']).toBe('MedicalCondition');
    expect(ld.reviewedBy['@type']).toBe('Physician');
    expect(ld.reviewedBy.name).toBe('Dr. Vikas Gupta');
    // The @id must resolve to the Physician entity declared on the homepage.
    expect(ld.author['@id']).toBe(`${ORIGIN}/#physician`);

    await expect(page.locator('.medical-disclaimer')).toBeVisible();
  });

  test(`${c.slug} books through Eka Care and links onward`, async ({ page }) => {
    await page.goto(baseURL + '/' + c.slug);

    const book = page.locator('a[data-booking-cta]');
    await expect(book).toHaveAttribute('href', BOOKING);
    await expect(book).toHaveAttribute('target', '_blank');
    await expect(book).toHaveAttribute('rel', /noopener/);

    const dir = page.locator('a[data-directions-cta]');
    expect(await dir.getAttribute('href')).toContain('google.com/maps/dir/?api=1');

    // Cross-links to the other condition pages, so none of them is an orphan.
    for (const other of CONDITIONS.filter(o => o.slug !== c.slug)) {
      expect(await page.locator(`a[href="${other.slug}"]`).count(),
        `${c.slug} should link to ${other.slug}`).toBeGreaterThan(0);
    }
  });

  test(`${c.slug} is reachable from the rest of the site`, async ({ page }) => {
    // An orphan page does not rank. Every core page should link to it from the footer.
    for (const from of ['/', '/services.html', '/about.html']) {
      await page.goto(baseURL + from);
      expect(await page.locator(`a[href="${c.slug}"]`).count(),
        `${from} should link to ${c.slug}`).toBeGreaterThan(0);
    }
  });
}

test('condition pages state the clinic hours agreed in stage 2', async ({ page }) => {
  for (const c of CONDITIONS) {
    await page.goto(baseURL + '/' + c.slug);
    const body = await page.locator('body').innerText();
    expect(body).toContain('10:00 AM to 5:00 PM');
    expect(body).toContain('5:15 PM to 6:00 PM');
    expect(body, 'no stale 5:45 PM close').not.toContain('5:45');
  }
});

test('no page claims a service the clinic does not list', () => {
  // Search demand showed 155 impressions for laser/cosmetic work, but the clinic lists no
  // such service. Wanting a treatment is not the same as offering it.
  //
  // This originally checked /laser/i only, which is Latin script — so लेज़र survived in the
  // Hindi metadata and shipped. A guard that covers one of a bilingual site's two languages
  // is not a guard. Devanagari nukta may be one codepoint or two (ज़ = U+095B, or
  // U+091C U+093C), so the patterns are written to match either form.
  const banned = [
    [/laser/i, 'laser'],
    [/botox/i, 'botox'],
    [/ले(?:ज़|ज़|ज)र/, 'लेज़र (laser)'],
    [/बोटो(?:क्स|ॅक्स)/, 'बोटोक्स (botox)'],
    [/कीमिकल पील|केमिकल पील/, 'chemical peel'],
  ];
  // Scan the generated HTML only — both languages. The build scripts are excluded on purpose:
  // their comments say the word "laser" precisely to warn future editors off it, and a guard
  // that fails on its own documentation trains people to ignore it. `npm test` runs the build
  // first, so anything introduced in the data files reaches the HTML before this runs.
  const files = [
    ...fs.readdirSync(ROOT).filter(f => f.endsWith('.html')),
    ...fs.readdirSync(path.join(ROOT, 'hi')).filter(f => f.endsWith('.html')).map(f => 'hi/' + f),
  ];
  for (const f of files) {
    const text = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const [re, label] of banned) {
      expect(text, `${f} claims "${label}", which the clinic does not offer`).not.toMatch(re);
    }
  }
});

test('Hindi metadata uses the term this clinic\'s searchers actually type', () => {
  // चर्म रोग draws 36 impressions across 17 queries here; त्वचा रोग only 13 across 8.
  // Both are correct Hindi, but the titles should lead with the one people type.
  const hiFiles = fs.readdirSync(path.join(ROOT, 'hi')).filter(f => f.endsWith('.html'));
  const titles = hiFiles.map(f => {
    const m = fs.readFileSync(path.join(ROOT, 'hi', f), 'utf8').match(/<title>([\s\S]*?)<\/title>/);
    return { f, t: m ? m[1] : '' };
  });
  const usingCharm = titles.filter(x => /चर्म रोग/.test(x.t)).length;
  expect(usingCharm, 'at least some Hindi titles should use चर्म रोग').toBeGreaterThan(0);

  // The biggest non-branded Hindi query on the site is सफेद दाग (31 impressions).
  const vit = titles.find(x => x.f.startsWith('vitiligo'));
  expect(vit.t, 'the vitiligo page must use the words patients type').toContain('सफेद दाग');
  expect(vit.t, 'and name a डॉक्टर, which is what they search for').toContain('डॉक्टर');
});

test('condition pages are in sync with their source data', () => {
  // Deliberately does NOT re-run the build. Spec files run in parallel, and regenerating
  // files mid-suite briefly leaves them half-written for whichever test is reading them.
  // Asserting that the committed HTML still contains the current data catches the same
  // staleness without touching the working tree.
  for (const c of CONDITIONS) {
    const html = fs.readFileSync(path.join(ROOT, c.slug), 'utf8');
    const stale = `${c.slug} is stale — run "npm run build" and commit the result`;
    expect(html, stale).toContain(`<title>${c.title.en}</title>`);
    expect(html, stale).toContain(c.desc.en);
    expect(html, stale).toContain(c.h1.en);
    expect(html, stale).toContain(c.h1.hi);
    expect(html, stale).toContain(REVIEWED_ON.iso);
    for (const item of [...c.treats.en, ...c.seeDoctor.en]) expect(html, stale).toContain(item);
    for (const item of [...c.treats.hi, ...c.seeDoctor.hi]) expect(html, stale).toContain(item);
  }
});

test('the Hindi twins exist and are genuinely in Hindi', async ({ page }) => {
  for (const c of CONDITIONS) {
    await page.goto(baseURL + '/hi/' + c.slug);
    await expect(page.locator('html')).toHaveAttribute('lang', 'hi');
    expect(await page.title()).toMatch(/[ऀ-ॿ]/);
    // The visible body must be Hindi, not English left showing.
    const h1 = await page.locator('h1').innerText();
    expect(h1, `${c.slug} h1 should render in Devanagari`).toMatch(/[ऀ-ॿ]/);
  }
});
