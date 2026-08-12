const { test, expect } = require('@playwright/test');

// Base URL for local server
const baseURL = 'http://localhost:8080';

const pages = [
  '/',
  '/about.html',
  '/services.html',
  '/testimonials.html',
  '/appointment.html',
  '/faq.html'
];

// Canonical Eka Care profile. The pre-/doctor/ form 301s here, so link straight to this one.
const bookingUrl = 'https://www.eka.care/doctor/dr-vikas-gupta-dermatology-moradabad';

for (const path of pages) {
  test(`page ${path} loads`, async ({ page }) => {
    await page.goto(baseURL + path);
    await expect(page).toHaveTitle(/Vikas|Gupta|Dermatologist/i);
    await expect(page.locator('body')).not.toBeEmpty();
  });
}

// Simple language toggle test on homepage

test('language toggle switches to Hindi', async ({ page }) => {
  await page.goto(baseURL + '/');
  const hindiBtn = page.locator('.lang-btn[data-lang="hi"]');
  await hindiBtn.click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'hi');
});

// The embedded Eka Care applet was removed: it let patients book without a phone number,
// and the field could not be made required from our side (cross-origin iframe). Booking now
// happens on Eka Care itself. These tests keep the applet from creeping back in and keep every
// booking CTA pointed at the canonical URL.

const widgetPages = ['/', '/appointment.html'];

for (const path of widgetPages) {
  test(`${path} embeds no Eka booking widget`, async ({ page }) => {
    await page.goto(baseURL + path);
    // Give any stray lazy-loader a chance to run before asserting absence.
    await page.waitForTimeout(1000);

    expect(await page.locator('iframe[src*="eka.care"]').count()).toBe(0);
    expect(await page.locator('#eka-appointment-widget-container').count()).toBe(0);
    expect(await page.evaluate(() => typeof window.ekaconfig)).toBe('undefined');
    expect(await page.evaluate(
      () => [...document.scripts].some(s => s.src.includes('eka-widget-init'))
    )).toBe(false);
  });
}

// The CTA rules below apply to every page, not just the two that once carried the widget.
// They originally ran over widgetPages only, and that blind spot let about/services/faq keep
// a "Call Now" button sitting beside their booking button long after phone booking was dropped.
const ctaPages = [...pages, ...pages.map(p => (p === '/' ? '/hi/' : '/hi' + p))];

for (const path of ctaPages) {
  test(`${path} sends every booking CTA to Eka Care in a new tab`, async ({ page }) => {
    await page.goto(baseURL + path);

    const ctas = page.locator('a[data-booking-cta]');
    const count = await ctas.count();
    expect(count, 'page should have booking CTAs').toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      const cta = ctas.nth(i);
      const label = await cta.getAttribute('data-booking-cta');
      await expect(cta, `CTA "${label}"`).toHaveAttribute('href', bookingUrl);
      await expect(cta, `CTA "${label}"`).toHaveAttribute('target', '_blank');
      await expect(cta, `CTA "${label}"`).toHaveAttribute('rel', /noopener/);
      await expect(cta, `CTA "${label}"`).toHaveAttribute('rel', /noreferrer/);
    }
  });

  // The clinic does not want bookings taken over the phone, so no booking CTA may be a
  // tel: link and no button may invite the patient to call in order to book.
  test(`${path} offers no way to book by phone`, async ({ page }) => {
    await page.goto(baseURL + path);

    expect(
      await page.locator('a[data-booking-cta][href^="tel:"]').count(),
      'no booking CTA should be a phone link'
    ).toBe(0);

    const bookByPhoneCopy = page.getByText(/Call to Book|कॉल करके बुक/);
    expect(await bookByPhoneCopy.count(), 'no "Call to Book" copy').toBe(0);

    // A tel: BUTTON standing next to the booking button reads as "or just call us to book",
    // which is the arrangement the clinic asked us to drop. A phone number written out in a
    // contact block is ordinary detail, not a booking route, so only .btn links count here.
    const callButtonsBesideBooking = await page.evaluate(() => {
      const out = [];
      for (const tel of document.querySelectorAll('a[href^="tel:"].btn')) {
        if (tel.closest('footer')) continue;
        const block = tel.closest('.booking-actions, .cta-content, section, div');
        if (block && block.querySelector('a[href*="eka.care/doctor"]')) {
          out.push((tel.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 30));
        }
      }
      return out;
    });
    expect(
      callButtonsBesideBooking,
      `${path} pairs a phone button with the booking button`
    ).toEqual([]);
  });

  test(`${path} offers directions via the canonical Google Maps route link`, async ({ page }) => {
    await page.goto(baseURL + path);

    const dirs = page.locator('a[data-directions-cta]');
    const count = await dirs.count();

    // Every page that sends people to the clinic must offer directions. Testimonials is the
    // exception: its job is social proof, and its only Maps link is the review page.
    const needsDirections = !/testimonials/.test(path);
    if (needsDirections) {
      expect(count, `${path} should offer directions`).toBeGreaterThan(0);
    }

    for (let i = 0; i < count; i++) {
      const d = dirs.nth(i);
      const label = await d.getAttribute('data-directions-cta');
      const href = await d.getAttribute('href');

      // Must be the directions endpoint, not a place page: /maps/dir/ with api=1.
      expect(href, `directions "${label}" uses the Maps URLs API`).toContain('google.com/maps/dir/?api=1');
      expect(href, `directions "${label}" names the clinic`).toContain('Skin%20Care%20Clinic');
      await expect(d, `directions "${label}"`).toHaveAttribute('target', '_blank');
      await expect(d, `directions "${label}"`).toHaveAttribute('rel', /noopener/);
      await expect(d, `directions "${label}"`).toHaveAttribute('rel', /noreferrer/);
    }
  });
}

test('no booking link points at the removed on-page widget anchor', async ({ page }) => {
  for (const path of ['/', '/appointment.html']) {
    await page.goto(baseURL + path);
    expect(
      await page.locator('a[href="#book-online"]').count(),
      `${path} should have no #book-online links left`
    ).toBe(0);
  }
});

test('both appointment options book on Eka Care', async ({ page }) => {
  await page.goto(baseURL + '/appointment.html');

  const options = page.locator('.appointment-option');
  await expect(options.first().locator('a.btn')).toHaveAttribute('href', bookingUrl);
  await expect(options.nth(1).locator('a.btn')).toHaveAttribute('href', bookingUrl);
});

test('booking CTA copy renders in Hindi', async ({ page }) => {
  await page.goto(baseURL + '/appointment.html');
  await page.locator('.lang-btn[data-lang="hi"]').click();

  await expect(page.locator('body')).toHaveClass(/lang-hi/);
  await expect(page.locator('.booking-actions .lang-hi').first()).toContainText('एका केयर पर बुक करें');
});
