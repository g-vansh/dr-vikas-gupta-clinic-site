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

const teleconsultationUrl = 'https://www.eka.care/dr-vikas-gupta-dermatology-moradabad';

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

test('appointment page shows teleconsultation fallback in English', async ({ page }) => {
  await page.goto(baseURL + '/appointment.html');

  const callout = page.locator('.teleconsultation-callout').first();
  await expect(callout.locator('p .lang-en')).toContainText('Teleconsultation cannot currently be booked inside the embedded Eka Care applet');

  const button = callout.locator('a.teleconsultation-btn');
  await expect(button).toHaveAttribute('href', teleconsultationUrl);
  await expect(button).toHaveAttribute('target', '_blank');
  await expect(button).toHaveAttribute('rel', /noopener/);
  await expect(button).toHaveAttribute('rel', /noreferrer/);
});

test('appointment page teleconsultation fallback switches to Hindi', async ({ page }) => {
  await page.goto(baseURL + '/appointment.html');
  await page.locator('.lang-btn[data-lang="hi"]').click();

  const callout = page.locator('.teleconsultation-callout').first();
  await expect(callout.locator('p .lang-hi')).toContainText('वीडियो परामर्श अभी एम्बेडेड एका केयर ऐपलेट के अंदर बुक नहीं किया जा सकता');
  await expect(page.locator('body')).toHaveClass(/lang-hi/);
});

test('teleconsultation and in-clinic CTAs keep separate destinations', async ({ page }) => {
  await page.goto(baseURL + '/appointment.html');

  await expect(page.locator('.appointment-option').first().locator('a.btn')).toHaveAttribute('href', teleconsultationUrl);
  await expect(page.locator('.appointment-option').first().locator('a.btn')).toHaveAttribute('target', '_blank');
  await expect(page.locator('.appointment-option').nth(1).locator('a.btn')).toHaveAttribute('href', '#book-online');
});
