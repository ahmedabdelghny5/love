import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import type photoCatalog from "../../photos.manifest.json";
import { readFileSync } from "node:fs";
const manifest: typeof photoCatalog = JSON.parse(readFileSync(join(process.cwd(), "photos.manifest.json"), "utf8"));

const imagePattern = "https://lh3.googleusercontent.com/**";
const previewSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000"><rect width="100%" height="100%" fill="#F7D6DF"/></svg>';

async function mockPhotos(page: Page) {
  await page.route(imagePattern, (route) => route.fulfill({ contentType: "image/svg+xml", body: previewSvg }));
}

const trigger = (page: Page, index = 0) => page.locator("a[data-viewer-photo]").nth(index);
const dialog = (page: Page) => page.getByRole("dialog", { name: "لحظاتنا" });

async function openFirst(page: Page) {
  await page.goto("/");
  await trigger(page).click();
  await expect(dialog(page)).toBeVisible();
}

test("viewer opens, navigates and wraps in Arabic reading order", async ({ page }) => {
  await mockPhotos(page);
  await openFirst(page);
  await expect(dialog(page).getByText(`الصورة 1 من ${manifest.photos.length}`, { exact: true })).toBeVisible();
  await dialog(page).getByRole("button", { name: "اللي قبلها" }).click();
  await expect(dialog(page).getByText(`الصورة ${manifest.photos.length} من ${manifest.photos.length}`, { exact: true })).toBeVisible();
  await page.keyboard.press("ArrowLeft");
  await expect(dialog(page).getByText(`الصورة 1 من ${manifest.photos.length}`, { exact: true })).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(dialog(page).getByText(`الصورة ${manifest.photos.length} من ${manifest.photos.length}`, { exact: true })).toBeVisible();
  await dialog(page).getByRole("button", { name: "اللي بعدها" }).click();
  await expect(dialog(page).getByText(`الصورة 1 من ${manifest.photos.length}`, { exact: true })).toBeVisible();
  await expect(dialog(page).locator("img")).toHaveAttribute("alt", manifest.photos[0].alt);
});

test("native modal contains focus and restores focus and scrolling on Escape", async ({ page }) => {
  await mockPhotos(page);
  await openFirst(page);
  const close = dialog(page).getByRole("button", { name: "اقفل الصورة" });
  await expect(close).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(dialog(page).getByRole("button", { name: "اللي بعدها" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  for (let index = 0; index < 8; index++) {
    await page.keyboard.press("Tab");
    expect(await page.evaluate(() => document.querySelector("dialog")?.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press("Shift+Tab");
  expect(await page.evaluate(() => document.querySelector("dialog")?.contains(document.activeElement))).toBe(true);
  expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe("hidden");
  const scrollBefore = await page.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, 800);
  expect(await page.evaluate(() => window.scrollY)).toBe(scrollBefore);
  await page.keyboard.press("Escape");
  await expect(page.locator("dialog")).not.toBeVisible();
  await expect(trigger(page)).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe("");
  expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
});

test("close button restores the selected gallery link", async ({ page }) => {
  await mockPhotos(page);
  await page.goto("/");
  await trigger(page, 8).click();
  await expect(dialog(page).getByText(`الصورة 9 من ${manifest.photos.length}`, { exact: true })).toBeVisible();
  await dialog(page).getByRole("button", { name: "اقفل الصورة" }).click();
  await expect(page.locator("dialog")).not.toBeVisible();
  await expect(trigger(page, 8)).toBeFocused();
});

test("viewer exposes loading state while a photo is slow", async ({ page }) => {
  let release!: () => void;
  const pending = new Promise<void>((resolve) => { release = resolve; });
  await page.route(imagePattern, async (route) => {
    if ([manifest.photos[0].src, manifest.photos[0].fullSrc].includes(route.request().url())) await pending;
    await route.fulfill({ contentType: "image/svg+xml", body: previewSvg });
  });
  try {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await trigger(page).click();
    await expect(dialog(page).getByText("بنحمّل الصورة…", { exact: true })).toBeVisible();
    expect(await dialog(page).locator(".memory-viewer-stage").evaluate((element) => element.getBoundingClientRect().height)).toBeGreaterThan(100);
    release();
    await expect(dialog(page).getByText("بنحمّل الصورة…", { exact: true })).toHaveCount(0);
    expect(await dialog(page).locator("img").evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  } finally { release(); }
});

test("broken image keeps controls usable and preserves focus after navigation", async ({ page }) => {
  await page.route(imagePattern, (route) => [manifest.photos[0].src, manifest.photos[0].fullSrc].includes(route.request().url())
    ? route.fulfill({ status: 404, body: "not found" })
    : route.fulfill({ contentType: "image/svg+xml", body: previewSvg }));
  await page.goto("/");
  await trigger(page).focus();
  await trigger(page).press("Enter");
  await expect(dialog(page).getByText("الصورة مش بتفتح دلوقتي.", { exact: true })).toBeVisible();
  await dialog(page).getByRole("link", { name: "شوفها في الألبوم كله (بيفتح في صفحة جديدة)" }).focus();
  await page.keyboard.press("ArrowLeft");
  await expect(dialog(page).getByText(`الصورة 2 من ${manifest.photos.length}`, { exact: true })).toBeVisible();
  await expect(dialog(page).getByRole("button", { name: "اقفل الصورة" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(trigger(page)).toBeFocused();
});

test("reduced motion disables animation and transitions", async ({ page }) => {
  await mockPhotos(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(await page.locator(".animate-memory-enter").first().evaluate((element) => getComputedStyle(element).animationName)).toBe("none");
  expect(await page.locator(".memory-button").first().evaluate((element) => getComputedStyle(element).transitionDuration)).toBe("0s");
});

test("touch controls work on a phone-sized viewport", async ({ browser }) => {
  const context = await browser.newContext({ serviceWorkers: "block", viewport: { width: 360, height: 800 }, isMobile: true, hasTouch: true, baseURL: "http://127.0.0.1:3200" });
  const page = await context.newPage();
  try {
    await mockPhotos(page);
    await page.goto("/");
    await trigger(page).tap();
    await expect(dialog(page)).toBeVisible();
    await dialog(page).getByRole("button", { name: "اللي بعدها" }).tap();
    await expect(dialog(page).getByText(`الصورة 2 من ${manifest.photos.length}`, { exact: true })).toBeVisible();
    await dialog(page).getByRole("button", { name: "اقفل الصورة" }).tap();
    await expect(page.locator("dialog")).not.toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  } finally { await context.close(); }
});

test("without JavaScript the photos and original image links remain available", async ({ browser }) => {
  const context = await browser.newContext({ serviceWorkers: "block", javaScriptEnabled: false, baseURL: "http://127.0.0.1:3200" });
  const page = await context.newPage();
  try {
    await mockPhotos(page);
    await page.goto("/");
    await expect(page.locator("img")).toHaveCount(manifest.photos.length + 1);
    await expect(trigger(page)).toHaveAttribute("href", manifest.photos[0].src);
    await expect(page.locator("dialog")).not.toBeVisible();
    await expect(page.getByText("نسير معًا، آنس بك وتأنس بي", { exact: true }).first()).toBeVisible();
  } finally { await context.close(); }
});

test("live signed-out photos render across phone, tablet and desktop layouts", async ({ page, context }) => {
  test.setTimeout(1_200_000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  for (const image of await page.locator("#gallery img").all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 0), { timeout: 15_000 }).toBe(true);
    expect(await image.evaluate((node) => getComputedStyle(node).objectFit)).toBe("contain");
  }
  // Wait for decoded pixels and the finite entry animation before visual capture.
  await page.locator("img").evaluateAll((images) => Promise.all(images.map((image) => (image as HTMLImageElement).decode())));
  await expect.poll(() => page.locator(".animate-memory-enter").evaluateAll((nodes) => nodes.every((node) => getComputedStyle(node).opacity === "1"))).toBe(true);
  const folder = join(tmpdir(), "engagement-browser-review");
  await mkdir(folder, { recursive: true });
  for (const [width, columns] of [[360, 1], [390, 1], [768, 2], [1024, 3], [1440, 3]]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.evaluate(() => window.scrollTo(0, 0));
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    const actualColumns = await page.locator(".memory-gallery").evaluate((node) => Number(getComputedStyle(node).columnCount));
    expect(actualColumns).toBe(columns);
    await page.screenshot({ path: join(folder, `page-${width}.png`) });
  }
  await trigger(page).click();
  const largerResults: { id: string; usedLarger: boolean; rendered: boolean }[] = [];
  for (let index = 0; index < manifest.photos.length; index++) {
    await expect(dialog(page).locator(".memory-viewer-media")).toHaveAttribute("data-upgrade-pending", "false", { timeout: 10_000 });
    const image = dialog(page).locator("img");
    await expect.poll(() => image.evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 0), { timeout: 15_000 }).toBe(true);
    await image.evaluate((node: HTMLImageElement) => node.decode());
    const source = await image.getAttribute("src");
    expect([manifest.photos[index].src, manifest.photos[index].fullSrc]).toContain(source);
    largerResults.push({ id: manifest.photos[index].id, usedLarger: source === manifest.photos[index].fullSrc, rendered: true });
    await dialog(page).getByRole("button", { name: "اللي بعدها" }).click();
  }
  await expect.poll(() => dialog(page).locator("img").evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 0)).toBe(true);
  await dialog(page).locator("img").evaluate((node: HTMLImageElement) => node.decode());
  await writeFile(join(folder, "larger-image-results.json"), JSON.stringify(largerResults, null, 2));
  await page.screenshot({ path: join(folder, "viewer-desktop.png") });
  await page.keyboard.press("Escape");
  expect(errors).toEqual([]);
  expect((await context.cookies()).filter((cookie) => cookie.domain.includes("google"))).toEqual([]);
});

test("a rate-limited larger image falls back to the verified gallery photo", async ({ page }) => {
  await page.route(imagePattern, (route) => route.request().url() === manifest.photos[0].fullSrc
    ? route.fulfill({ status: 429, body: "rate limited" })
    : route.fulfill({ contentType: "image/svg+xml", body: previewSvg }));
  await openFirst(page);
  await expect(dialog(page).locator(".memory-viewer-media")).toHaveAttribute("data-upgrade-pending", "false");
  await expect(dialog(page).locator("img")).toHaveAttribute("src", manifest.photos[0].src);
  await expect.poll(() => dialog(page).locator("img").evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 0)).toBe(true);
  await expect(dialog(page).getByText("الصورة مش بتفتح دلوقتي.", { exact: true })).toHaveCount(0);
  await expect(dialog(page).getByText(`الصورة 1 من ${manifest.photos.length}`, { exact: true })).toBeVisible();
});

test("larger URLs are requested only for the hero and active viewer photo", async ({ page }) => {
  const requested = new Set<string>();
  const largerSources = new Set(manifest.photos.map((photo) => photo.fullSrc));
  await page.route(imagePattern, (route) => {
    if (largerSources.has(route.request().url())) requested.add(route.request().url());
    return route.fulfill({ contentType: "image/svg+xml", body: previewSvg });
  });
  await page.goto("/");
  expect(requested).toEqual(new Set([manifest.photos.find(photo => photo.id === manifest.coverPhotoId)!.fullSrc]));
  await trigger(page).click();
  await expect.poll(() => requested.has(manifest.photos[0].fullSrc)).toBe(true);
  expect(requested).toEqual(new Set([manifest.photos.find(photo => photo.id === manifest.coverPhotoId)!.fullSrc, manifest.photos[0].fullSrc]));
  await dialog(page).getByRole("button", { name: "اللي بعدها" }).click();
  await expect.poll(() => requested.has(manifest.photos[1].fullSrc)).toBe(true);
  expect(requested).toEqual(new Set([manifest.photos.find(photo => photo.id === manifest.coverPhotoId)!.fullSrc, manifest.photos[0].fullSrc, manifest.photos[1].fullSrc]));
});
test("a slow larger variant never hides the already loaded gallery photograph", async ({ page }) => {
  let release!: () => void;
  const pending = new Promise<void>((resolve) => { release = resolve; });
  await page.route(imagePattern, async (route) => {
    if (route.request().url() === manifest.photos[0].fullSrc) await pending;
    await route.fulfill({ contentType: "image/svg+xml", body: previewSvg });
  });
  try {
    await openFirst(page);
    await expect(dialog(page).locator("img")).toHaveAttribute("src", manifest.photos[0].src);
    await expect.poll(() => dialog(page).locator("img").evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 0)).toBe(true);
    await expect(dialog(page).getByText("بنحمّل الصورة…", { exact: true })).toHaveCount(0);
    release();
    await expect(dialog(page).locator("img")).toHaveAttribute("src", manifest.photos[0].fullSrc);
  } finally { release(); }
});
test("sharing metadata preserves noindex and points to the existing cover", async ({ page }) => {
  await mockPhotos(page);
  await page.goto("/");
  await expect(page).toHaveTitle("علي وإيمان | حكايتنا الحلوة");
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", manifest.photos.find(p => p.id === manifest.coverPhotoId)!.src);
  await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute("content", "ar_EG");
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", "علي وإيمان | حكايتنا الحلوة");
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", "https://ali-eman-memory-2026.vercel.app");
});

test("album layout has all photos, no overlaps, and usable targets at five widths", async ({ page }) => {
  await mockPhotos(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  for (const width of [360, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const rectangles = await page.locator(".memory-gallery .memory-photo-card").evaluateAll(nodes => nodes.map(node => {
      const { x, y, width, height } = node.getBoundingClientRect();
      return { x, y, width, height };
    }));
    expect(rectangles).toHaveLength(manifest.photos.length);
    const collisions: number[][] = [];
    for (let i = 0; i < rectangles.length; i++) {
      for (let j = i + 1; j < rectangles.length; j++) {
        const a = rectangles[i], b = rectangles[j];
        const overlaps = a.x < b.x + b.width - 1 && a.x + a.width > b.x + 1 && a.y < b.y + b.height - 1 && a.y + a.height > b.y + 1;
        if (overlaps) collisions.push([i, j]);
      }
    }
    expect(collisions, "Cards overlap at " + width).toEqual([]);
    const targetHeights = await page.locator(".memory-photo-open-label").evaluateAll(nodes => nodes.map(node => node.getBoundingClientRect().height));
    expect(Math.min(...targetHeights)).toBeGreaterThanOrEqual(44);
  }
});

test("native mobile swipe navigates, reverses, and ignores vertical scrolling", async ({ browser }) => {
  const context = await browser.newContext({ serviceWorkers: "block", viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, baseURL: "http://127.0.0.1:3200" });
  const page = await context.newPage();
  try {
    await mockPhotos(page);
    await openFirst(page);
    const session = await context.newCDPSession(page);
    async function swipe(fromX: number, fromY: number, toX: number, toY: number) {
      await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: fromX, y: fromY }] });
      await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: toX, y: toY }] });
      await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    }
    await swipe(300, 350, 90, 355);
    await expect(dialog(page).getByText(`الصورة 2 من ${manifest.photos.length}`, { exact: true })).toBeVisible();
    await swipe(90, 350, 300, 355);
    await expect(dialog(page).getByText(`الصورة 1 من ${manifest.photos.length}`, { exact: true })).toBeVisible();
    await swipe(180, 350, 185, 500);
    await expect(dialog(page).getByText(`الصورة 1 من ${manifest.photos.length}`, { exact: true })).toBeVisible();
  } finally { await context.close(); }
});

test("scroll reveals stay readable without motion and keyboard focus remains visible", async ({ page }) => {
  await mockPhotos(page);
  await page.goto("/");
  await page.locator("#gallery-title").scrollIntoViewIfNeeded();
  await expect(page.locator("#gallery header[data-reveal]")).toHaveAttribute("data-revealed", "true");
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(await page.locator("#gallery header[data-reveal]").evaluate(node => getComputedStyle(node).animationName)).toBe("none");
  await trigger(page, 17).focus();
  expect(await trigger(page, 17).evaluate(node => node === document.activeElement)).toBe(true);
  expect(await trigger(page, 17).evaluate(node => getComputedStyle(node.closest("figure")!).opacity)).toBe("1");
});

test("dark viewer text and focus styling remain readable", async ({ page }) => {
  await mockPhotos(page);
  await openFirst(page);
  const color = await dialog(page).getByRole("heading").evaluate(node => getComputedStyle(node).color);
  expect(color).toBe("rgb(255, 249, 243)");
  expect(await dialog(page).locator("#viewer-caption").evaluate(node => getComputedStyle(node).color)).toBe("rgb(233, 221, 247)");
});
