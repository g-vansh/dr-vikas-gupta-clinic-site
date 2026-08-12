const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');
const { CONDITIONS, FAQS } = require('../conditions.data');

// Guards for AI answer-engine visibility (GEO).
//
// The overlap between Google's top organic rankings and AI-cited sources has fallen from
// roughly 70% to under 20%, so ranking well no longer implies being quoted. What the evidence
// supports is: machine-readable entity data, question-and-answer blocks (the most frequently
// extracted content type in AI Overviews), and crawler access. Those are what these test.

const baseURL = 'http://localhost:8080';
const ROOT = path.join(__dirname, '..');
const ORIGIN = 'https://www.drvikasgupta.skin';

const CORE = ['index.html', 'about.html', 'services.html', 'testimonials.html', 'appointment.html', 'faq.html'];
const ALL = [...CORE, ...CONDITIONS.map(c => c.slug)];
const urlFor = (f, hi) => (hi ? (f === 'index.html' ? '/hi/' : `/hi/${f}`) : (f === 'index.html' ? '/' : `/${f}`));

function ldBlocks(html) {
  return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
}
const entities = obj => (obj['@graph'] ? obj['@graph'] : [obj]);

for (const f of ALL) {
  test(`${f} declares machine-readable structured data`, () => {
    const html = fs.readFileSync(path.join(ROOT, f), 'utf8');
    const blocks = ldBlocks(html);
    expect(blocks.length, `${f} has no JSON-LD; AI engines lean on entity data far more than prose`).toBeGreaterThan(0);
    const types = blocks.flatMap(entities).map(e => e['@type']).flat();
    expect(types.filter(Boolean).length).toBeGreaterThan(0);
  });
}

test('every page in both languages has valid JSON-LD', () => {
  const files = [...ALL, ...ALL.map(f => 'hi/' + f)];
  for (const f of files) {
    const html = fs.readFileSync(path.join(ROOT, f), 'utf8');
    expect(() => ldBlocks(html), `${f} has malformed JSON-LD`).not.toThrow();
    expect(ldBlocks(html).length, `${f} has no JSON-LD`).toBeGreaterThan(0);
  }
});

for (const c of CONDITIONS) {
  test(`${c.slug} publishes its FAQs as FAQPage in both languages`, () => {
    for (const hi of [false, true]) {
      const file = hi ? 'hi/' + c.slug : c.slug;
      const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
      const faq = ldBlocks(html).flatMap(entities).find(e => e['@type'] === 'FAQPage');
      expect(faq, `${file} should declare FAQPage`).toBeTruthy();
      expect(faq.inLanguage, `${file} FAQ language`).toBe(hi ? 'hi-IN' : 'en-IN');
      expect(faq.mainEntity.length).toBe(FAQS[c.slug].length);

      // The structured data must describe the page it is on, not its counterpart.
      const first = faq.mainEntity[0].name;
      const devanagari = /[ऀ-ॿ]/.test(first);
      expect(devanagari, `${file} FAQ questions should be ${hi ? 'Hindi' : 'English'}`).toBe(hi);

      const page = ldBlocks(html).flatMap(entities).find(e => e['@type'] === 'MedicalWebPage');
      expect(page.url, `${file} MedicalWebPage url`).toBe(ORIGIN + urlFor(c.slug, hi));
      expect(page.inLanguage).toBe(hi ? 'hi-IN' : 'en-IN');
    }
  });

  test(`${c.slug} answers are in the DOM, not hidden behind JS`, async ({ page }) => {
    // A crawler that does not run scripts must still be able to read the answer.
    await page.goto(baseURL + '/' + c.slug);
    const answers = await page.locator('.faq-item p').allTextContents();
    expect(answers.length).toBe(FAQS[c.slug].length);
    for (const a of answers) expect(a.trim().length).toBeGreaterThan(40);
  });
}

test('FAQ questions match what people actually ask', () => {
  // Fees dominate the question-shaped queries in Search Console -- 115 of 138 impressions,
  // with "dr vikas gupta moradabad fees" alone at 82. Every condition page must answer it.
  for (const c of CONDITIONS) {
    const qs = FAQS[c.slug].map(f => f.q.en.toLowerCase() + ' ' + f.a.en.toLowerCase()).join(' ');
    expect(qs, `${c.slug} should answer the cost question`).toMatch(/cost|fee|₹800/);
    expect(qs, `${c.slug} should state the actual fee`).toContain('₹800');
  }
});

test('robots.txt lets AI answer engines in', () => {
  const robots = fs.readFileSync(path.join(ROOT, 'robots.txt'), 'utf8');
  const bots = ['GPTBot', 'OAI-SearchBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended', 'Bingbot'];
  for (const bot of bots) {
    const block = new RegExp(`User-agent:\\s*${bot}[\\s\\S]*?(?=User-agent:|Sitemap:|$)`, 'i');
    const m = robots.match(block);
    expect(m, `${bot} should be named explicitly so allowing it is a recorded decision`).toBeTruthy();
    expect(m[0], `${bot} must not be disallowed`).not.toMatch(/Disallow:\s*\//);
  }
  // Nothing anywhere may block the crawlable surface.
  const disallows = robots.split('\n').filter(l => /^\s*Disallow:\s*\S/.test(l));
  expect(disallows, `robots.txt should disallow nothing: ${disallows.join(', ')}`).toEqual([]);
});

test('entity references resolve to something real', () => {
  // Pages point at the Physician and MedicalBusiness by @id instead of restating them.
  // If the homepage stops declaring those ids, every reference silently dangles.
  const home = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const ids = new Set(ldBlocks(home).flatMap(entities).map(e => e['@id']).filter(Boolean));
  expect(ids, 'homepage must declare the Physician entity').toContain(`${ORIGIN}/#physician`);

  for (const f of ['about.html', 'services.html', 'testimonials.html', 'appointment.html', ...CONDITIONS.map(c => c.slug)]) {
    const html = fs.readFileSync(path.join(ROOT, f), 'utf8');
    const refs = JSON.stringify(ldBlocks(html)).match(/"@id":"([^"]+)"/g) || [];
    for (const r of refs) {
      const id = r.slice(7, -1);
      if (!id.startsWith(ORIGIN + '/#')) continue;
      expect([`${ORIGIN}/#physician`, `${ORIGIN}/#localbusiness`], `${f} references unknown entity ${id}`).toContain(id);
    }
  }
});

test('there is no llms.txt cargo cult', () => {
  // Deliberate: measured crawler logs show the AI bots skip llms.txt and read HTML, and no
  // major provider honours it. If one ever does, add it then -- with evidence.
  expect(fs.existsSync(path.join(ROOT, 'llms.txt')),
    'llms.txt adds maintenance with no measured benefit; see robots.txt for the reasoning').toBe(false);
});

test('Bing site verification stays in place', () => {
  // ChatGPT's search runs on Bing's index, so Bing Webmaster Tools access is what makes the
  // site eligible to be cited there at all. Bing's instruction is explicit: do not remove the
  // verification even after it succeeds. Deleting this file silently un-verifies the site.
  const p = path.join(ROOT, 'BingSiteAuth.xml');
  expect(fs.existsSync(p), 'BingSiteAuth.xml must stay at the site root').toBe(true);
  const xml = fs.readFileSync(p, 'utf8');
  expect(xml).toMatch(/<user>[A-F0-9]{32}<\/user>/);
});

test('sitemap.xml is well-formed XML, not just plausible-looking', async ({ page }) => {
  // Bing rejected the sitemap outright over this and Google silently tolerated it, so
  // "Google accepted it" was not evidence of validity. The offender was the generated
  // header comment: XML forbids the string "--" INSIDE a comment, and it read
  // "<!-- Generated by build-hi.js -- do not edit by hand -->".
  //
  // Parsed with a real browser XML parser rather than a regex, because the whole point is
  // to catch things a hand-rolled check would wave through.
  const xml = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  const err = await page.evaluate(src => {
    const doc = new DOMParser().parseFromString(src, 'application/xml');
    const bad = doc.querySelector('parsererror');
    return bad ? bad.textContent.replace(/\s+/g, ' ').slice(0, 200) : null;
  }, xml);
  expect(err, `sitemap.xml does not parse: ${err}`).toBeNull();

  // Same rule applies to the comments injected into every page.
  for (const f of [...ALL, ...ALL.map(x => 'hi/' + x)]) {
    const html = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const c of html.match(/<!--[\s\S]*?-->/g) || []) {
      expect(c.slice(4, -3), `${f} has a comment containing "--", which is invalid`).not.toContain('--');
    }
  }
});
