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
