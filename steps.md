# Engagement Memory Page — Main Implementation Phases

This checklist organizes [plan.md](./plan.md) into major work phases. The original plan remains the source of truth for design tokens, Arabic copy, and requirements.

## Confirmed Personal Content

- **Display names:** على وإيمان
- **Engagement date:** 9 أكتوبر 2026 (calendar value: `2026-10-09`).
- **Main dedication (preserve exactly):** نسير معًا، آنس بك وتأنس بي
- Keep these values centrally editable and preserve the spelling supplied by the user.

Photo access, visual selection, and metadata collection have been verified as marked below. Main Plans 2–6 are complete for the approved display-URL implementation, including the viewer and Chromium verification. All 18 larger variants are now verified and enabled on demand with display-size fallback; the site is published on Vercel. Mark a task complete only after its result has been verified.

## Main Plan 1 — Verify Photos and Select the Memories

**Goal:** Confirm that the Google Photos album can supply real images through remote links.

- [x] Read the shared album publicly through a cookie-free HTTP request: https://photos.app.goo.gl/ppS7q6qhzmddpLRy9. No browser session was available.
- [x] Visually review previews of the first 300 album media records and select 18 still photographs. Additional paginated records remain unreviewed.
- [x] Choose cover engagement-210 and order the 18 selected images in photos.manifest.json.
- [x] Curate varied previews, omitting repetitive shots and videos; final thumbnail cropping still needs verification in the page.
- [x] Obtain direct Google-hosted image URLs and verify 36 display/full-size variants with cookie-free HTTP HEAD requests and a localhost Referer header.
- [x] Verify all 18 display URLs inside the page in fresh signed-out Chromium contexts. All 18 larger variants are now verified and enabled on demand with display-size fallback under the approved display-link decision.
- [x] Save source dimensions, a default centered crop position, and Arabic alt text for all 18 selected photos in photos.manifest.json; adjust crop positions during page verification.

**Deliverable:** [photos.manifest.json](./photos.manifest.json), containing 18 curated image links and metadata. [google-photos.md](./google-photos.md) records verification evidence and remaining checks. HTTP access and browser embedding of all 18 display URLs are verified, including a later fresh-browser run. All 18 larger variants are now verified and enabled on demand with display-size fallback.

**Gate:** If album access or direct image URLs fail, stop photo integration and ask the user before changing the source or adding a service. Do not download photos, introduce OAuth, or add a Google Photos API integration. API image URLs expire; browser-derived URLs cannot be promised permanent.

## Main Plan 2 — Establish the Project Foundation

**Goal:** Prepare a small, maintainable application using the approved stack.

- [x] Inspect existing files and applicable repository instructions; preserve existing work.
- [x] Scaffold only if no application exists, using Next.js App Router, TypeScript, and Tailwind CSS.
- [x] Record dependency versions in the lockfile.
- [x] Organize the application into app, components, content, and types directories.
- [x] Define EngagementContent and Photo types as described in plan.md.
- [x] Create one editable content module for names, optional date, Arabic messages, album URL, cover ID, and ordered photo metadata.
- [x] Populate the editable content module with على, إيمان, the calendar date 2026-10-09, and the exact personal message above; do not invent personal events.
- [x] Configure the document with lang="ar" and dir="rtl".
- [x] Add page metadata requesting no search indexing; document that this is not access protection.

**Deliverable:** Completed: Next.js 16.4.0, React 19.3.0, TypeScript 5.9.3, and Tailwind CSS 4.3.3 application with a lockfile, Arabic RTL preview, typed content/catalog, and no-index metadata. Run instructions are in README.md. Verification: dependency install (0 reported vulnerabilities), typecheck, production build, and local HTTP checks for names, exact dedication, date, lang/dir, metadata, and album link all passed. Full visual design and photo rendering remain later phases.

**Constraints:** No database, API routes, credentials, or environment variables are needed. Ask before adding extra libraries or services.

## Main Plan 3 — Create the Romantic Design System

**Goal:** Give the page a consistent colorful garden aesthetic.

- [x] Implement the exact ivory, rose, lilac, sage, plum, surface, border, and muted-text tokens from plan.md.
- [x] Define a 4px spacing scale, generous section spacing, 20px card corners, pill buttons, and soft shadows.
- [x] Use a system Arabic font stack and logical CSS spacing for RTL layouts.
- [x] Create reusable section, button, text, and photo-card styling.
- [x] Add subtle CSS floral accents while keeping photography visually dominant.
- [x] Keep text on readable solid surfaces and verify color contrast.
- [x] Define restrained fades and hover effects with reduced-motion support.

**Deliverable:** Completed: shared Tailwind theme tokens, reusable section/heading, button/link, photo-card, and floral-accent components; styled Arabic preview; accessible focus styles; and reduced-motion support. TypeScript, production build, and served HTML/CSS checks passed. Nine text/background combinations exceed 4.5:1 contrast (lowest: muted on ivory, 5.62:1). The gallery, viewer, and responsive visuals were subsequently verified with the user-approved Playwright tooling in Main Plans 5 and 6.

## Main Plan 4 — Build the Landing Page and Gallery

**Goal:** Assemble the complete Arabic memory page.

- [x] Build the hero with the selected cover, “على وإيمان”, “9 أكتوبر 2026”, and “شاهدوا لحظاتنا” gallery link.
- [x] Add the dedication panel with “نسير معًا، آنس بك وتأنس بي” as its main message; use the general Arabic copy in plan.md only as supporting text.
- [x] Build the ordered gallery under “لحظات نحب أن تبقى”.
- [x] Use one column on phones, two on tablets, and three on wide screens.
- [x] Use reserved 4:5 frames with object-fit: contain to display complete photographs without cutting off faces; browser visual review remains pending.
- [x] Add the closing message and “الألبوم الكامل” link.
- [x] Render static sections with Server Components; limit client code to interactive behavior.
- [x] Load photographs directly from verified remote URLs without adding photo binaries to the project.
- [x] Reserve image dimensions, load the hero eagerly, and lazy-load below-fold images.
- [x] Provide readable image-loading and failure states that preserve the layout.

**Deliverable:** Implemented: header, cover hero, dedication, 18-photo gallery, and closing section. TypeScript, production build, and served HTML/CSS checks pass. Verified 19 image elements (one eager cover plus 18 lazy gallery images), manifest order, dimensions, responsive breakpoints, exact Arabic copy, and use of gallery-size URLs only. All 18 display links passed fresh individual HTTP checks; some larger variants returned HTTP 429. Loading/failure states and browser behavior are verified in Main Plans 5 and 6.

**Dependency/status:** The user approved integration with verified gallery links while larger-image checks remain pending. Signed-out browser embedding still requires verification under Main Plans 1 and 6. Gallery links now open the native viewer; without JavaScript or with modified clicks, the original verified image URL remains available.

## Main Plan 5 — Implement the Full-Screen Photo Viewer

**Goal:** Let visitors comfortably explore each memory.

- [x] Build the viewer using React state and a native modal dialog, without a gallery library.
- [x] Show the complete photograph, optional caption, and image counter.
- [x] Add Arabic previous, next, and close controls with comfortable touch targets.
- [x] Support keyboard navigation and Escape-to-close.
- [x] Wrap navigation between the first and last images.
- [x] Contain focus inside the open viewer and restore it to the triggering thumbnail on close.
- [x] Lock background scrolling while the viewer is open.
- [x] Mount only the active complete photograph on demand using the approved verified display URL. Larger image variants remain deferred until their separate checks pass.
- [x] Handle slow or broken images gracefully and respect reduced-motion preferences.

**Deliverable:** Implemented and browser-verified native dialog with captions/counter, Arabic controls, RTL arrows, first/last wrapping, explicit Tab/Shift+Tab cycling, Escape/close handling, focus restoration, scroll locking, and loading/error states. Five navigation tests and 12 Chromium browser scenarios pass. The viewer uses approved display URLs; larger variants remain pending.

## Main Plan 6 — Verify Quality and Prepare Handoff

**Goal:** Deliver a polished, locally runnable production preview.

- [x] Run final production build, TypeScript validation, five navigation tests, and 12 Playwright browser scenarios. All pass; no additional lint framework is configured.
- [x] Verify layouts near 360px, 768px, and 1440px widths without overflow or clipped text.
- [x] Check Arabic reading order, captions, photo cropping, exact names/message, and the displayed date “9 أكتوبر 2026” without timezone shifts.
- [x] Verify all 18 display photos in fresh signed-out Chromium contexts, including a later repeat run. All 18 larger variants are now verified and enabled on demand with display-size fallback; permanent availability is not guaranteed.
- [x] Test viewer navigation, wrapping, keyboard-only use, focus restoration, and touch controls.
- [x] Test slow connections, broken images, and reduced motion.
- [x] Verify one eager cover, 18 lazy gallery images, no initial viewer image, and on-demand mounting of the active complete image using its verified display URL.
- [x] Confirm no engagement photo binaries or Google authentication secrets are included.
- [x] Document development and production commands, Arabic content editing, and remote URL replacement.
- [x] Record remote-link durability as an external dependency; repeated successful checks do not guarantee permanence.

**Deliverable:** Verified local production preview and maintenance instructions in README.md. See verification.md for evidence, browser coverage, visual review, and accepted limits. The user approved development-only Playwright. QA artifacts are stored in the system temporary directory, not as project photo assets.

**Release status:** The display-URL page and viewer passed signed-out browser verification. Larger variants are verified and enabled on demand, and remote links may change or be rate-limited later. Hosting and publication require the user to choose a provider; neither was configured.

## Execution Order and Boundaries

1. Start photo feasibility checks and project inspection.
2. Establish the foundation and design system.
3. Integrate verified photos into the page and gallery.
4. Connect the full-screen viewer.
5. Complete quality checks and handoff documentation.

The first release is a single Arabic page accessible to anyone with its link. Music, guestbook, timeline, counter, authentication, and extra hosting services are outside the agreed first release.




## Final release verification — 13 October 2026

Published: https://ali-eman-memory-2026.vercel.app (Vercel project ali-eman-memory-2026, production deployment READY).

All 18 display and larger variants passed signed-out browser checks. The viewer immediately displays the gallery image, then upgrades only its active photo after decoding the larger variant. Errors or an eight-second timeout retain the display image. Five navigation tests, 12 Chromium scenarios, TypeScript validation, and production build passed.

A fresh anonymous browser verified the production URL returned HTTP 200, all 18 gallery photos loaded, exact Arabic content appeared, viewer navigation and Escape worked, focus returned correctly, and the 360px layout had no horizontal overflow or JavaScript errors. The public response includes X-Robots-Tag: noindex, nofollow. No original photo binaries or local credentials were uploaded.

Earlier investigation notes are historical; this final release verification supersedes pending-photo and unpublished-status statements above.

## Main Plan 7 — Publish and Verify Production

- [x] Use the user-selected Vercel provider and authenticated CLI.
- [x] Create and link the dedicated ali-eman-memory-2026 project.
- [x] Verify upload excludes credentials, local build files, and photo binaries.
- [x] Publish the production build and confirm READY status.
- [x] Verify the public URL in an anonymous browser with real photos and viewer interactions.
- [x] Update handoff documentation with the live URL and completed checks.

The website implementation and publication are complete. Optional agent MCP tool activation is tracked separately in vercel-setup.md.


## Current editorial upgrade (local, not published)

The latest requested upgrade supersedes historical typography and spelling notes above. Corrected groom name and dedication, immersive hero, curated Bento gallery, native reveals/swipes, system fonts, and sharing metadata are implemented locally. See [upgrade-notes.md](./upgrade-notes.md) for audit, files, verification, and limitations. No push or deployment is authorized for this revision.
