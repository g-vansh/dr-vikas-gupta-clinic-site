const { test, expect } = require('@playwright/test');
const { CONDITIONS } = require('../conditions.data');

// 96.7% of this site's search clicks are mobile (44,114 of 45,570 impressions), so the phone
// layout is the primary layout. These tests run at the narrowest widths still in common use.

const baseURL = 'http://localhost:8080';
const CORE = ['/', '/about.html', '/services.html', '/testimonials.html', '/appointment.html', '/faq.html'];
const PAGES = [...CORE, ...CONDITIONS.map(c => '/' + c.slug)];
const ALL = [...PAGES, ...PAGES.map(p => (p === '/' ? '/hi/' : '/hi' + p))];

const PHONE = { width: 390, height: 844 };
const NARROW = { width: 320, height: 568 };   // smallest width worth supporting

test.use({ viewport: PHONE, isMobile: true, hasTouch: true });

for (const p of ALL) {
  test(`${p} does not scroll sideways on a phone`, async ({ page }) => {
    await page.goto(baseURL + p, { waitUntil: 'networkidle' });
    const r = await page.evaluate(() => ({
      doc: document.documentElement.scrollWidth,
      view: window.innerWidth
    }));
    expect(r.doc, `${p} is ${r.doc - r.view}px wider than the viewport`).toBeLessThanOrEqual(r.view + 1);
  });
}

test('no page scrolls sideways at 320px either', async ({ browser }) => {
  // A grid whose items keep min-width:auto burst the row at 375px once and produced real
  // sideways scrolling, so the narrow case is checked explicitly.
  const ctx = await browser.newContext({ viewport: NARROW, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  for (const p of ['/', '/about.html', '/services.html', '/hi/', ...CONDITIONS.slice(0, 2).map(c => '/' + c.slug)]) {
    await page.goto(baseURL + p, { waitUntil: 'networkidle' });
    const r = await page.evaluate(() => ({ doc: document.documentElement.scrollWidth, view: window.innerWidth }));
    expect(r.doc, `${p} overflows at 320px by ${r.doc - r.view}px`).toBeLessThanOrEqual(r.view + 1);
  }
  await ctx.close();
});

test('tap targets are big enough to hit', async ({ page }) => {
  // WCAG 2.2 sets 24px as the minimum; 44px is comfortable, and a dermatology audience
  // skews older. Links inline within a sentence are exempt under the standard.
  for (const p of ['/', '/services.html', '/appointment.html', '/hair-loss-treatment-moradabad.html']) {
    await page.goto(baseURL + p, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    const small = await page.evaluate(() => {
      const out = [];
      for (const el of document.querySelectorAll('a, button')) {
        if (el.offsetParent === null) continue;
        const b = el.getBoundingClientRect();
        if (!b.width || !b.height) continue;
        // Skip links are deliberately parked off-screen (top:-40px) and only appear on
        // keyboard focus, so they are visible to offsetParent but not to a thumb.
        if (b.bottom + window.scrollY < 0 || b.right + window.scrollX < 0) continue;
        // Inline links sitting inside a paragraph or list item are exempt.
        if (el.closest('p, li') && getComputedStyle(el).display.startsWith('inline')) continue;
        if (b.height < 32) out.push({ t: (el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 30), h: Math.round(b.height) });
      }
      return out;
    });
    expect(small, `${p} has undersized tap targets: ${JSON.stringify(small)}`).toEqual([]);
  }
});

test('body text is readable without zooming', async ({ page }) => {
  await page.goto(baseURL + '/');
  const size = await page.evaluate(() => parseFloat(getComputedStyle(document.body).fontSize));
  expect(size, 'body copy should be at least 16px on mobile').toBeGreaterThanOrEqual(16);
});

test('the sticky bar never covers the end of the page', async ({ page }) => {
  await page.goto(baseURL + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  const r = await page.evaluate(() => {
    const bar = document.querySelector('#stickyBookBar');
    if (!bar || getComputedStyle(bar).display === 'none') return null;
    return {
      barH: bar.getBoundingClientRect().height,
      pad: parseFloat(getComputedStyle(document.body).paddingBottom) || 0
    };
  });
  if (!r) test.skip(true, 'sticky bar not shown at this width');
  expect(r.pad, 'body needs clearance for the fixed bar').toBeGreaterThanOrEqual(r.barH);
});

test('images reserve their space so the layout does not jump', async ({ page }) => {
  for (const p of ['/', '/about.html']) {
    await page.goto(baseURL + p, { waitUntil: 'domcontentloaded' });
    const missing = await page.evaluate(() =>
      [...document.images]
        .filter(i => !/leaflet|basemaps|tile/.test(i.src))          // third-party map tiles
        .filter(i => !i.getAttribute('width') && !i.getAttribute('height'))
        .map(i => i.src.split('/').pop()));
    expect(missing, `${p} images without intrinsic dimensions`).toEqual([]);
  }
});

test('the mobile booking path works end to end', async ({ page }) => {
  await page.goto(baseURL + '/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);

  // The sticky bar is the main booking route on a phone.
  const bar = page.locator('#stickyBookBar');
  await expect(bar).toBeVisible();
  const book = bar.locator('a[data-booking-cta]');
  await expect(book).toHaveAttribute('href', /eka\.care\/doctor/);
  const box = await book.boundingBox();
  expect(box.height, 'sticky book button height').toBeGreaterThanOrEqual(44);

  const dirs = bar.locator('a[data-directions-cta]');
  const dbox = await dirs.boundingBox();
  expect(dbox.height, 'sticky directions button height').toBeGreaterThanOrEqual(44);
  expect(dbox.width, 'sticky directions button width').toBeGreaterThanOrEqual(44);
});

test('no image is squashed out of its natural proportions', async ({ page }) => {
  // width/height attributes are presentational HINTS, not inert metadata. Where CSS sets only
  // the width, the attribute supplies the height and the image distorts -- the about-page
  // portrait rendered 300x956 instead of 300x383 after intrinsic dimensions were added for
  // layout stability. Images using object-fit are excluded: cover/contain change the box
  // shape deliberately and handle the crop themselves.
  for (const p of ALL) {
    await page.goto(baseURL + p, { waitUntil: 'networkidle' });
    const squashed = await page.evaluate(() =>
      [...document.images]
        .filter(i => i.naturalWidth && i.getBoundingClientRect().width)
        .filter(i => getComputedStyle(i).objectFit === 'fill')
        .map(i => {
          const b = i.getBoundingClientRect();
          return {
            src: i.src.split('/').pop(),
            rendered: Math.round(b.width) + 'x' + Math.round(b.height),
            natural: i.naturalWidth + 'x' + i.naturalHeight,
            off: Math.abs(b.width / b.height - i.naturalWidth / i.naturalHeight)
          };
        })
        .filter(x => x.off > 0.02));
    expect(squashed, `${p} renders distorted images: ${JSON.stringify(squashed)}`).toEqual([]);
  }
});

test('the hero coin styles the photo and the logo by what they are', async ({ page }) => {
  // These rules used to key off .front / .back, so swapping the doctor's photo to the front
  // left it wearing the logo's treatment: letterboxed with 20px padding on a white ground.
  await page.goto(baseURL + '/');
  const s = await page.evaluate(() => {
    const g = sel => { const e = document.querySelector(sel); const c = getComputedStyle(e); return { fit: c.objectFit, pad: c.padding }; };
    return { photo: g('.coin img.coin-photo'), logo: g('.coin img.coin-logo') };
  });
  expect(s.photo.fit, 'a photograph should fill the circle').toBe('cover');
  expect(s.photo.pad, 'a photograph needs no inset').toBe('0px');
  expect(s.logo.fit, 'a logo should sit inside the circle whole').toBe('contain');
});
