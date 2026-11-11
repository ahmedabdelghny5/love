import { defineConfig } from "@playwright/test";
import { join } from "node:path";
import { tmpdir } from "node:os";

export default defineConfig({
  testDir: "./test/browser",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 30_000,
  expect: { timeout: 5_000 },
  reporter: "list",
  outputDir: join(tmpdir(), "engagement-browser-results"),
  use: {
    browserName: "chromium",
    serviceWorkers: "block",
    headless: true,
    baseURL: "http://127.0.0.1:3200",
    viewport: { width: 1440, height: 1000 },
    trace: "off",
    screenshot: "off",
    video: "off",
  },
  webServer: {
    command: "npm run start -- --port 3200",
    url: "http://127.0.0.1:3200",
    reuseExistingServer: false,
    timeout: 30_000,
  },
});
