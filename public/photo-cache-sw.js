/* Native image-only caching. HTML, scripts and deployment responses are untouched. */
const IMAGE_CACHE = "engagement-photos-v1";
const STATE_CACHE = "engagement-photo-state-v1";
const MAX_IMAGES = 24;
const IMAGE_AGE = 30 * 24 * 60 * 60 * 1000;
const RETRY_DELAY = 2 * 60 * 1000;
const pending = new Map();
let writes = Promise.resolve();

function photoUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "lh3.googleusercontent.com"
      && url.pathname.startsWith("/pw/") && /=(w1200-h1200|w2400-h2400)$/.test(url.href);
  } catch { return false; }
}

function serial(task) {
  const result = writes.then(task);
  writes = result.catch(() => {});
  return result;
}

async function stateFor(url) {
  const cache = await caches.open(STATE_CACHE);
  const response = await cache.match(url);
  return response ? response.json() : null;
}

async function writeState(url, state) {
  const cache = await caches.open(STATE_CACHE);
  await cache.put(url, new Response(JSON.stringify(state), {
    headers: { "Content-Type": "application/json" },
  }));
}

async function trim(target = MAX_IMAGES) {
  const cache = await caches.open(IMAGE_CACHE);
  const keys = await cache.keys();
  if (keys.length <= target) return;
  const entries = await Promise.all(keys.map(async key => ({
    key, state: await stateFor(key.url),
    larger: key.url.endsWith("=w2400-h2400"),
  })));
  // Keep the commonly reused gallery variants; evict old larger variants first.
  entries.sort((a, b) => Number(b.larger) - Number(a.larger)
    || (a.state?.lastUsed ?? 0) - (b.state?.lastUsed ?? 0));
  for (const entry of entries.slice(0, entries.length - target)) {
    await cache.delete(entry.key);
    const metadata = await caches.open(STATE_CACHE);
    await metadata.delete(entry.key);
  }
}

self.addEventListener("install", event => event.waitUntil(self.skipWaiting()));
self.addEventListener("activate", event => event.waitUntil(self.clients.claim()));

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET" || request.destination !== "image" || !photoUrl(request.url)) return;
  event.respondWith((async () => {
    const now = Date.now();
    try {
      const state = await stateFor(request.url);
      const cache = await caches.open(IMAGE_CACHE);
      const cached = state?.expiresAt > now ? await cache.match(request) : null;
      if (cached) {
        event.waitUntil(serial(() => writeState(request.url, { ...state, lastUsed: now })));
        return cached;
      }
      if (state?.retryAfter > now) return Response.error();
      if (state?.expiresAt) await cache.delete(request);
    } catch { /* Storage unavailable: ordinary browser loading still works. */ }

    try {
      const response = await fetch(request);
      if (response.ok || response.type === "opaque") {
        // Opaque status cannot be inspected. Commit only after the page decodes it.
        pending.set(request.url, { response: response.clone(), receivedAt: now });
        for (const [url, entry] of pending) {
          if (pending.size > MAX_IMAGES || now - entry.receivedAt > 60_000) pending.delete(url);
        }
      }
      return response;
    } catch { return Response.error(); }
  })());
});

self.addEventListener("message", event => {
  const { type, url } = event.data ?? {};
  if (!photoUrl(url) || !["PHOTO_LOADED", "PHOTO_FAILED"].includes(type)) return;
  if (!event.source?.url || new URL(event.source.url).origin !== self.location.origin) return;

  // Pull out the successfully decoded response before another message arrives.
  const entry = pending.get(url);
  pending.delete(url);
  event.waitUntil(serial(async () => {
    const cache = await caches.open(IMAGE_CACHE);
    if (type === "PHOTO_FAILED") {
      await cache.delete(url);
      const previous = await stateFor(url);
      await writeState(url, {
        retryAfter: previous?.retryAfter > Date.now() ? previous.retryAfter : Date.now() + RETRY_DELAY,
      });
      return;
    }
    if (!entry) return; // No duplicate fetch for first-visit or already cached images.
    const now = Date.now();
    try {
      await cache.put(url, entry.response.clone());
    } catch {
      // Browser quotas include padding for opaque images. Free space and retry once.
      await trim(Math.floor(MAX_IMAGES / 2));
      try { await cache.put(url, entry.response.clone()); } catch { return; }
    }
    await writeState(url, { expiresAt: now + IMAGE_AGE, lastUsed: now });
    await trim();
  }).catch(() => {}));
});
