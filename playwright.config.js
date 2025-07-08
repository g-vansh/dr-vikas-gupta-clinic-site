// Playwright configuration for local testing
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  timeout: 30000,
  retries: 0,
  use: {
    headless: true,
  },
  webServer: {
    command: 'npx http-server -p 8080',
    port: 8080,
    reuseExistingServer: !process.env.CI,
  },
});
