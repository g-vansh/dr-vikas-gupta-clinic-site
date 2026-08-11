const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Stage 2 guards: the clinic's own facts, and the accessibility fixes.
// Before this, the site stated its opening hours five different ways, spelled the landmark
// differently from Google, and placed itself ~1.3km from where it actually is.

const baseURL = 'http://localhost:8080';
const ROOT = path.join(__dirname, '..');
const pages = ['/', '/about.html', '/services.html', '/testimonials.html', '/appointment.html', '/faq.html'];
const htmlFiles = ['index.html', 'about.html', 'services.html', 'testimonials.html', 'appointment.html', 'faq.html'];

// Verified against Google's own record for the business (feature id 0x390afbbed7350391:0x2a1463f8d1daaba2).
const CLINIC_LAT = 28.8285263;
const CLINIC_LNG = 78.7752077;

function allSources() {
  return [...htmlFiles, 'local-business-schema.json']
    .map(f => ({ file: f, text: fs.readFileSync(path.join(ROOT, f), 'utf8') }));
}

test('landmark is spelled the way Google spells it', () => {
  // Google Business Profile says "Wajid Nagar Complex". NAP consistency is a local ranking
  // factor, and there is a second Dr. Vikas Gupta in Moradabad to be distinguished from.
  for (const { file, text } of allSources()) {
    expect(text, `${file} must not use the old "Wazid" spelling`).not.toMatch(/Wazid/i);
  }
  const hits = allSources().filter(s => /Wajid Nagar/i.test(s.text));
  expect(hits.length, 'at least one page should name the landmark').toBeGreaterThan(0);
});

test('clinic coordinates are the real ones, not the rounded service-area midpoint', () => {
  const idx = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const schema = fs.readFileSync(path.join(ROOT, 'local-business-schema.json'), 'utf8');

  expect(idx, 'geo.position meta').toContain(`${CLINIC_LAT};${CLINIC_LNG}`);
  expect(idx, 'ICBM meta').toContain(`${CLINIC_LAT}, ${CLINIC_LNG}`);

  const parsed = JSON.parse(schema);
  expect(parsed.geo.latitude).toBe(CLINIC_LAT);
  expect(parsed.geo.longitude).toBe(CLINIC_LNG);

  // The 200km service-area midpoint may legitimately stay rounded -- that is what it is for.
  expect(parsed.serviceArea[0].geoMidpoint.latitude).toBe(28.84);
});

test('opening hours agree everywhere', () => {
  const parsed = JSON.parse(fs.readFileSync(path.join(ROOT, 'local-business-schema.json'), 'utf8'));
  const specs = parsed.openingHoursSpecification;

  const inClinic = specs.find(s => s.opens === '10:00');
  expect(inClinic, 'in-clinic spec').toBeTruthy();
  expect(inClinic.closes).toBe('17:00');

  const video = specs.find(s => s.opens === '17:15');
  expect(video, 'weekday video spec').toBeTruthy();
  expect(video.closes).toBe('18:00');

  const sunday = specs.find(s => s.dayOfWeek.includes('Sunday'));
  expect(sunday.opens).toBe('11:00');
  expect(sunday.closes).toBe('11:30');

  // The stale variants that used to contradict each other.
  for (const { file, text } of allSources()) {
    expect(text, `${file} still claims a 5:45 PM close`).not.toMatch(/5:45 PM|17:45/);
    expect(text, `${file} still claims all-day video hours`).not.toMatch(/"opens": "09:00"/);
  }
});

test('experience is stated as 31+ years everywhere', () => {
  for (const { file, text } of allSources()) {
    expect(text, `${file} still says 30+`).not.toMatch(/30\+\s*(Years|years|वर्ष|साल)/);
  }
});

for (const p of pages) {
  test(`${p} has exactly one h1`, async ({ page }) => {
    await page.goto(baseURL + p);
    // The header logo used to be an <h1> alongside the page heading.
    expect(await page.locator('h1').count()).toBe(1);
  });

  test(`${p} heading levels never skip`, async ({ page }) => {
    await page.goto(baseURL + p);
    const levels = await page.evaluate(() =>
      [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')]
        .filter(h => h.offsetParent !== null)
        .map(h => +h.tagName[1]));
    let prev = 0;
    for (const l of levels) {
      if (prev) expect(l, `jumped from h${prev} to h${l}`).toBeLessThanOrEqual(prev + 1);
      prev = l;
    }
  });
}

test('carousel dots are reachable and labelled', async ({ page }) => {
  await page.goto(baseURL + '/');
  await page.waitForTimeout(800);
  const dots = page.locator('.testimonial-dot');
  const n = await dots.count();
  expect(n, 'carousel should render dots').toBeGreaterThan(0);
  for (let i = 0; i < n; i++) {
    const d = dots.nth(i);
    await expect(d).toHaveAttribute('aria-label', /Show review/);
    const box = await d.boundingBox();
    // WCAG 2.2 target size minimum is 24px; these were 10px.
    expect(box.width, 'dot hit area width').toBeGreaterThanOrEqual(24);
    expect(box.height, 'dot hit area height').toBeGreaterThanOrEqual(24);
  }
});

test('no Font Awesome is loaded for a single icon', () => {
  for (const { file, text } of allSources()) {
    expect(text, `${file} still loads Font Awesome`).not.toMatch(/font-awesome/i);
  }
  const js = fs.readFileSync(path.join(ROOT, 'assets/js/script.js'), 'utf8');
  expect(js, 'script.js still references fa- classes').not.toMatch(/["'\s]fa-(solid|regular|brands|[a-z]+-)/);
});

test('the doctor photo exists once, not three times', () => {
  const dir = path.join(ROOT, 'assets/images');
  const files = fs.readdirSync(dir);
  expect(files).not.toContain('dr-vikas-gupta-profile.jpg');
  expect(files).not.toContain('dr-vikas-gupta-cropped.jpg');
  expect(files).toContain('dr-vikas-gupta.jpg');
  for (const { file, text } of allSources()) {
    expect(text, `${file} references a deleted duplicate`).not.toMatch(/dr-vikas-gupta-(profile|cropped)\.jpg/);
  }
});

test('map markers carry accessible names', async ({ page }) => {
  await page.goto(baseURL + '/');
  await page.waitForTimeout(2500);
  const markers = page.locator('.leaflet-marker-icon');
  const n = await markers.count();
  if (n === 0) test.skip(true, 'map did not render in this environment');
  for (let i = 0; i < Math.min(n, 6); i++) {
    const t = await markers.nth(i).getAttribute('title');
    expect(t, `marker ${i} needs an accessible name`).toBeTruthy();
  }
});

test('the hero coin flips on a timer, and holds still for reduced motion', async ({ page }) => {
  // The auto-flip is wanted. What must not come back is the old behaviour for people who
  // have asked their device for less motion: the CSS rule killed the transition but not the
  // timer, so they got an abrupt swap every 3 seconds -- jerkier than the animation itself.
  await page.goto(baseURL + '/');

  // The doctor's face leads: 60% of this site's impressions come from people searching his
  // name, and a real photo of the clinician is the strongest trust signal a medical page has.
  await expect(page.locator('.coin .front img')).toHaveAttribute('src', /dr-vikas-gupta\.jpg/);
  await expect(page.locator('.coin')).toHaveAttribute('tabindex', '0');

  // It should be still on arrival, then start flipping.
  expect(await page.locator('.coin').getAttribute('class')).not.toContain('flipped');
  await page.waitForTimeout(4200);
  expect(await page.locator('.coin').getAttribute('class'),
    'the hero coin should flip on a timer').toContain('flipped');
});

test('the hero coin stays still when the visitor asks for reduced motion', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(baseURL + '/');
  const before = await page.locator('.coin').getAttribute('class');
  await page.waitForTimeout(4200);
  const after = await page.locator('.coin').getAttribute('class');
  expect(after, 'nothing should auto-animate under prefers-reduced-motion').toBe(before);
  await ctx.close();
});
