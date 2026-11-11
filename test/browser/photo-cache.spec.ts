import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type photoCatalog from "../../photos.manifest.json";

const manifest: typeof photoCatalog = JSON.parse(readFileSync(join(process.cwd(), "photos.manifest.json"), "utf8"));
const cover = manifest.photos.find(photo => photo.id === manifest.coverPhotoId)!;
const preview = '<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1600"><rect width="100%" height="100%" fill="#F7D6DF"/></svg>';

test("verified photos survive reload without another Google request", async ({ browser }) => {
  const context = await browser.newContext({ serviceWorkers: "allow", baseURL: "http://127.0.0.1:3200" });
  let heroRequests = 0;
  await context.route("https://lh3.googleusercontent.com/**", route => {
    if (route.request().url() === cover.fullSrc) heroRequests++;
    return route.fulfill({ contentType: "image/svg+xml", body: preview });
  });
  const page = await context.newPage();
  try {
    await page.goto("/");
    await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
    await page.reload();
    await expect.poll(() => page.evaluate(async url => Boolean(await (await caches.open("engagement-photos-v1")).match(url)), cover.fullSrc)).toBe(true);
    const before = heroRequests;
    const session = await context.newCDPSession(page);
    await session.send("Network.clearBrowserCache");
    await session.send("Network.setCacheDisabled", { cacheDisabled: true });
    const workerResponses: string[] = [];
    page.on("response", response => { if (response.fromServiceWorker()) workerResponses.push(response.url()); });
    await page.reload();
    await expect.poll(() => page.locator(".memory-hero-background img").evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
    expect(heroRequests).toBe(before);
    expect(workerResponses).toContain(cover.fullSrc);
    expect(await page.evaluate(async () => Boolean(await (await caches.open("engagement-photos-v1")).match(location.href)))).toBe(false);
  } finally { await context.close(); }
});

test("failed larger images are not cached and retries pause across reloads", async ({ browser }) => {
  const context = await browser.newContext({ serviceWorkers: "allow", baseURL: "http://127.0.0.1:3200" });
  const failedUrl = manifest.photos[0].fullSrc;
  let failedRequests = 0;
  await context.route("https://lh3.googleusercontent.com/**", route => {
    if (route.request().url() === failedUrl) {
      failedRequests++;
      return route.fulfill({ status: 429, body: "rate limited" });
    }
    return route.fulfill({ contentType: "image/svg+xml", body: preview });
  });
  const page = await context.newPage();
  try {
    await page.goto("/");
    await page.waitForFunction(() => Boolean(navigator.serviceWorker.controller));
    await page.reload();
    const open = async () => {
      await page.locator("a[data-viewer-photo]").first().click();
      await expect(page.getByRole("dialog").locator(".memory-viewer-media")).toHaveAttribute("data-upgrade-pending", "false");
      await expect(page.getByRole("dialog").locator("img")).toHaveAttribute("src", manifest.photos[0].src);
    };
    await open();
    await expect.poll(() => page.evaluate(async url => {
      const response = await (await caches.open("engagement-photo-state-v1")).match(url);
      return response ? (await response.json()).retryAfter > Date.now() : false;
    }, failedUrl)).toBe(true);
    expect(await page.evaluate(async url => Boolean(await (await caches.open("engagement-photos-v1")).match(url)), failedUrl)).toBe(false);
    const before = failedRequests;
    await page.keyboard.press("Escape");
    await open();
    expect(failedRequests).toBe(before);
    await page.keyboard.press("Escape");
    await page.reload();
    await open();
    expect(failedRequests).toBe(before);
  } finally { await context.close(); }
});
