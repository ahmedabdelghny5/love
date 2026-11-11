# Engagement Memory Website

Arabic RTL engagement album for على وإيمان, dated 9 October 2026. Built with the existing Next.js App Router, TypeScript, and Tailwind stack.

## Current release

The current release uses a clearer portrait hero, modern rose/lilac/sage surfaces, Egyptian Arabic copy, and native browser image caching. The user approved publishing these changes. Earlier audit history is in upgrade-notes.md.

- Photography-first hero with an unobstructed full cover photograph.
- Curated six-column desktop Bento, three-column tablet layout, and full-width landscapes with paired portraits on phones.
- Amiri headings and Cairo body/button typography, with Egyptian Arabic copy.
- Native scroll reveals and reduced-motion support.
- Full-screen viewer with touch swipes, RTL keyboard navigation, focus trapping, Escape, focus restoration, and scroll locking.
- Open Graph/Twitter metadata, canonical production URL, and noindex/nofollow.

## Run locally

Verified with Node.js 24; package requirement is Node.js 20.9 or newer.

~~~powershell
npm.cmd ci
npm.cmd run dev -- --port 3100
~~~

Open http://localhost:3100. Stop any existing preview on that port before starting another server.

For a production preview:

~~~powershell
npm.cmd run build
npm.cmd start -- --port 3100
~~~

The application needs no database, API, or runtime secrets. Vercel CLI linking created an ignored local .env.local file, excluded from source control and deployment.

## Verify

~~~powershell
npm.cmd test
npm.cmd run typecheck
npm.cmd run build
npm.cmd run test:browser
~~~

Playwright is an approved development-only dependency. If its browser is missing, run npx.cmd playwright install chromium --only-shell. Tests manage a production server on port 3200. Keep that port available.

No lint script or linter is configured; adding a lint dependency requires approval. QA screenshots and test results stay in the system temporary directory, outside project assets.

## Edit content

- src/content/engagement.ts: personal copy and calendar date.
- photos.manifest.json: the 50 selected still photos, URLs, dimensions, alt text, captions, order, and cover selection.
- src/components/photo-gallery.tsx: responsive gallery cards that preserve each photo's natural proportions.
- src/app/globals.css: garden tokens, typography, responsive layouts, and motion.

Keep dates as calendar strings without timezone conversion. All photo IDs, image URLs, dimensions, and ordering are preserved in this upgrade.

## Photos and sharing

Images remain remotely hosted by Google Photos. No original photo assets are stored in the project. The hero uses its verified display URL with high priority. Gallery images are lazy-loaded. The viewer requests only its active larger image and retains the display-size version if the upgrade errors or times out after eight seconds.

Google Photos URLs may change or be rate-limited; their lifetime is not guaranteed. Sharing metadata uses the existing public cover URL. WhatsApp's actual preview cache must be checked after an explicitly approved deployment. Noindex is not password protection.

## GitHub and deployment

Private repository: https://github.com/alihgad/ali-eman-memory-2026

Vercel is connected to main. A push triggers deployment. Pushes to main deploy automatically; publish future changes when authorized by the user.

After approval and verification:

~~~powershell
git add .
git commit -m "Upgrade the engagement album experience"
git push
~~~

Existing live page: https://ali-eman-memory-2026.vercel.app.

## Notes

- plan.md and steps.md: original requirements and implementation history.
- google-photos.md: photo source and verification history.
- verification.md: previous published release checks.
- upgrade-notes.md: current local upgrade audit and results.
- vercel-setup.md: CLI and optional agent-tool setup.

## Browser photo cache

The native image-only service worker stores successfully decoded Google Photos responses. It does not prefetch the album, copy assets into the repository, cache HTML, or add a backend/service.

- Reuses up to 24 decoded image variants for up to 30 days per browser.
- Prioritizes keeping common gallery variants when evicting older larger images.
- Failed images are discarded; retrying the same URL pauses for two minutes, including after page reloads.
- Storage/quota failures fall back to ordinary browser loading.
- New visitors still need network requests. This reduces repeat requests and 429 risk; it does not guarantee Google availability or prevent every rate limit.
- Unsupported browsers and private sessions may not retain the cache.

Implementation: public/photo-cache-sw.js, src/components/photo-cache.tsx, and src/lib/photo-cache.ts.
Cross-origin responses can be opaque; they are committed only after browser image decoding confirms success. See [MDN Cache.put](https://developer.mozilla.org/en-US/docs/Web/API/Cache/put) and [Chrome cross-origin caching guidance](https://developer.chrome.com/docs/workbox/caching-resources-during-runtime/).

## Latest verification

5 navigation tests, 19 Chromium browser scenarios, TypeScript validation, and production build passed. The cache scenarios disable HTTP cache to verify worker-backed reuse and confirm failed images are not cached and repeated requests pause. Layouts at 360, 390, 768, 1024 and 1440 pixels were visually reviewed. All 18 photo IDs, dimensions, image URLs and ordering remain unchanged; captions/alt text are now Egyptian Arabic.


The personal dedication and matching photo caption remain exactly: نسير معًا، آنس بك وتأنس بي. Other interface copy stays in Egyptian Arabic. Browser-extension body annotations are tolerated only on the body host element; child hydration diagnostics remain enabled.

## Complete album gallery

The gallery includes all 309 still photos from the complete 321-item shared Google Photos album, including its final pagination page. The 12 video records and their thumbnails are excluded. The original curated 18 photos remain first, followed by the remaining album photos. Images use natural proportions in one column on phones, two on tablets, and three on desktop, without fixed-height empty frames. All 321 display links passed anonymous HEAD checks; the production build and 18 mocked browser scenarios passed. Earlier 18-photo verification notes describe the previous gallery. Google Photos image URLs remain unofficial remote links.

## Current curated gallery

The gallery now shows 50 still photos selected through visual review, with a short Egyptian Arabic caption for every card. The 12 videos are excluded. One of the 309 still-photo previews was unavailable during review and was not selected. The current hero photo record and hero styles were preserved. See [selected-gallery.md](./selected-gallery.md) for all 50 captions and image descriptions. Previous complete-album gallery notes describe the earlier implementation.
