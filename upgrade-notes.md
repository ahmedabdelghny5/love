# Editorial upgrade — local review

## Baseline audit

Inspected the source/component tree, photo manifest, scripts, TypeScript, Next, Tailwind, Playwright, Git ignores, and Vercel configuration. No repository AGENTS.md was found in the project or checked parent directories. Applied the existing fullstack-developer skill and UX Designer guidance.

The baseline retained the garden palette, Server Component sections, 18 remote photos, eager cover/lazy gallery, native dialog, progressive larger-image loading, Arabic RTL, and noindex metadata. It passed 5 navigation tests, TypeScript validation, and 12 Chromium browser scenarios.

Opportunities: the small split hero, orientation-only gallery spans, no sharing metadata, no swipe controls, no scroll reveals, earlier spelling, and external font loading. Local experimental gallery changes were incorporated rather than discarded.

## Before and after

| Area | Before | Local upgrade |
|---|---|---|
| Hero | Small cover beside text | Wide complete photograph, large names above it, date, restrained entrance, scroll cue |
| Gallery | Automatic orientation spans | Curated desktop areas by photo ID, featured couple photographs, deliberate tablet/phone composition |
| Typography | Cairo loaded with next/font/google | System Arabic font stack, clearer hierarchy, supplied spelling corrections |
| Motion | Initial entrance/hover only | Native once-only intersection reveals, capped stagger, viewer transition, reduced motion and no-JS visibility |
| Viewer | Buttons and keyboard | Existing accessibility retained; native touch swipes added; dark surround and readable text |
| Sharing | Basic title/description | Arabic OG/Twitter cards, existing cover URL, canonical URL, noindex/nofollow preserved |
| Performance | Eager/lazy strategy and reserved frames | Retained, no external font requests, no animation library; unchanged image URLs |

No new relationship memories were invented. The engagement date remains 2026-10-09. All 18 photo IDs, display/full URLs, dimensions, and ordering were compared to a saved baseline and match exactly.

## Changed files

- src/app/layout.tsx: metadata and system-font document.
- src/app/page.tsx: attaches the small scroll-observer component.
- src/app/globals.css: editorial hero/grid, system typography, viewer contrast, motion and responsive behavior.
- src/components/engagement-intro.tsx: photography-first hero and scroll cue.
- src/components/photo-gallery.tsx: curated placements and mobile pairing.
- src/components/gallery-viewer.tsx: touch swipe handling.
- src/components/scroll-reveals.tsx: native IntersectionObserver, once-only reveals and preference cleanup.
- src/components/memory-dedication.tsx and memory-footer.tsx: section reveals and dedication anchor.
- src/components/ui/memory-section.tsx and photo-card.tsx: reveal hooks and typed card placement styles.
- src/content/engagement.ts and photos.manifest.json: exact requested spelling corrections only; no photo source changes.
- test/browser/memory-page.spec.ts: updated responsive coverage plus metadata, overlap, pairing, swipe, reveal and contrast regressions.
- README.md, plan.md, steps.md and upgrade-notes.md: current content/handoff notes.

No dependency, lockfile, hosting, or Next configuration changes. No commit, push, or deployment was performed.

## Verification

- TypeScript validation and production build: passed.
- Navigation tests: 5 passed.
- Final browser suite: 17 passed (42.5 seconds), including real signed-out photo loading.
- Live signed-out photo test loaded all 18 gallery photographs and walked all active viewer images.
- Visual captures reviewed at 360, 390, 768, 1024 and 1440 pixels, with no horizontal overflow or overlapping cards.
- Native mobile swipes, RTL arrows, wrapping, Tab/Shift+Tab, Escape, focus restoration, scroll locking, reduced motion, no-JavaScript links, and slow/failing/rate-limited images were exercised.
- Social metadata checked in served HTML; canonical URL points to the existing production domain.
- An initial local performance sample recorded CLS 0 and LCP 1876 ms. This is one local browser observation, not a production performance claim.
- A throttled local reload rendered the real cover; synthetic slow/error tests verify retained frames and loading states.
- git diff --check passed.
- npm run lint was attempted and reported a missing lint script. No linter dependency was added.

## Limits

Chromium and emulated touch are covered; physical devices, Firefox, Safari, and screen-reader software were not tested. The real WhatsApp cache/preview cannot be confirmed for this un-deployed local version. Google Photos URL durability and remote cache policy remain external dependencies. Existing display URLs cap photo resolution; high-density large displays may show softness. No original photos were downloaded or committed as assets. Temporary QA screenshots are outside the repository.

## Local testing

Current preview: http://localhost:3100 (gallery: http://localhost:3100/#gallery).

Use npm.cmd run build followed by npm.cmd start -- --port 3100 for a fresh production preview. Do not run a second server on the occupied port. Run npm.cmd test, npm.cmd run typecheck, and npm.cmd run test:browser for checks.

The live website still serves the previous published release. Publishing requires explicit user approval.
