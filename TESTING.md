# Comprehensive Testing Guide

This guide describes a thorough manual testing sequence for the **Dr. Vikas Gupta Skin Care Clinic** website. Run these tests after any code changes to ensure that all features continue to work as expected.

Automated smoke tests are available via [Playwright](https://playwright.dev/). After installing dependencies, execute `npm test` to run these quick checks in a headless browser.

## 1. Environment Setup

1. Install dependencies (optional):
   ```bash
   npm install
   ```
2. Start a local server from the project root:
   ```bash
   npm run start
   ```
   or
   ```bash
   python -m http.server 8080
   ```
3. Navigate to `http://localhost:8080` in your browser.

## 2. Page Load Verification

1. Open each of the following pages in both English and Hindi:
   - `/index.html`
   - `/about.html`
   - `/services.html`
   - `/testimonials.html`
   - `/appointment.html`
   - `/faq.html`
2. Confirm that all pages load without 404 errors.
3. Check that the correct page title and meta description appear in the browser tab.

## 3. Language Toggle

1. On every page, click the **हिंदी** button to switch to Hindi.
2. Verify that all text content switches to Hindi.
3. Click the **English** button to switch back.
4. Confirm that language preference persists when navigating between pages.

## 4. Navigation and Smooth Scrolling

1. Click each navigation link in the header and footer.
2. Ensure the active link is highlighted for the current page.
3. Test internal anchor links and verify that scrolling is smooth.

## 5. Mobile Menu

1. Resize the browser window to a width below 768&nbsp;px.
2. Open the mobile menu and verify that all navigation links are accessible.
3. Close the menu and confirm that page scrolling is enabled again.

## 6. Testimonials Carousel

1. Visit the homepage and testimonials page.
2. Observe the carousel auto-rotating every 4 seconds.
3. Hover over the carousel to ensure it pauses.
4. Click the navigation dots to manually change slides.

## 7. Interactive Map

1. Scroll to the patient origin map on the homepage.
2. Confirm the map loads with markers for all listed cities.
3. Zoom and pan to verify map interaction works on both desktop and mobile.

## 8. Doctor Image Flip Animation

1. On the homepage, watch the doctor image to confirm it flips every few seconds.
2. Ensure the animation does not interfere with page layout on mobile.

## 9. WhatsApp Assistant

1. Click the WhatsApp floating button.
2. Verify that a new tab opens to `https://wa.me/918273112888` with a pre-filled greeting.

## 10. Links and Phone Numbers

1. Test all external links (Eka Care, social media, maps) to ensure they open in a new tab.
2. Click the phone number links on mobile to confirm they prompt a call.

## 11. Responsive Design

1. Test the site in common resolutions: 320&nbsp;px, 768&nbsp;px, 1024&nbsp;px, and 1920&nbsp;px.
2. Check that text remains legible and that no layout elements overlap or break.

## 12. Cross-Browser Compatibility

1. Repeat these tests in the latest versions of Chrome, Firefox, and Edge.
2. Optionally test on Safari on macOS/iOS if available.

## 13. Accessibility Checks

1. Use browser dev tools or extensions (e.g., Lighthouse, axe) to scan each page.
2. Verify color contrast, keyboard navigation, and alt text for images.

## 14. Performance Checks

1. Run Lighthouse performance reports for the homepage and note the score.
2. Ensure page load time is under two seconds on a typical broadband connection.

## 15. Broken Link Scan (Optional)

Run `npx linkinator http://localhost:8080` to scan for broken internal and external links.

---

Performing this full sequence after each change helps maintain the quality and usability of the website.
