# Google Photos — Access and Photo Selection

## Verified Result

- Shared album: https://photos.app.goo.gl/ppS7q6qhzmddpLRy9
- Album title: خطوبتى
- The album returned HTTP 200 without Google login or cookies.
- Visually reviewed in-memory contact sheets of the first 300 media records, followed by larger previews of the 18 shortlisted photographs.
- Selected 18 still photographs with a mix of couple portraits, ring details, family moments, celebration, and evening scenes.
- Selected cover: engagement-210, a landscape couple portrait against the floral backdrop.
- Saved only URLs and metadata in [photos.manifest.json](./photos.manifest.json). No photo files were written to disk or added to the project. Temporary album HTML and preview scripts are outside the project; preview image bytes were held only in memory.
- All 36 selected display/full-size URLs returned HTTP 200 with image content types in cookie-free HEAD checks, including a localhost Referer header.
- Exact check timestamps and individual results are in the manifest.

## Use in the Application

Use the manifest's ordered photos array to populate the typed content module described in plan.md. Use coverPhotoId to identify the hero photograph.

Each photo provides id, src, fullSrc, width, height, alt, caption, and objectPosition. Source album index and Google media ID preserve provenance; verification fields record HTTP checks and do not need to be passed to UI components.

Display URLs request a maximum 1200-by-1200 bounding box; viewer URLs request a maximum 2400-by-2400 bounding box. These URL variants preserve aspect ratio. Use direct browser image loading and reserve layout dimensions. Adjust thumbnail crops after visually testing the finished page, while displaying the full image in the viewer.

## Remaining Checks and Limits

- No browser was connected during investigation. HTTP success and visual preview loading do not prove that embedding works in every browser.
- Test all selected images in a signed-out browser inside the actual Next.js page.
- Repeat the checks in a later fresh session; no permanent lifetime guarantee is available for these unofficial web image URLs.
- The album includes a pagination token. This selection is based on the first 300 records, not an exhaustive review of every album item.
- The website will still transfer photo data to visitors. Keeping photo binaries out of the repository reduces project asset size, not necessarily page download size.
- Replacing album sharing permissions or Google changing its web URLs may invalidate the links. Do not use temporary API base URLs as permanent assets or automatically introduce OAuth.
- If image links fail, pause photo integration and ask the user before using another source, downloading project photo assets, or adding a service.

## Status

The original album-access blocker is resolved. A curated remote-link photo selection is ready for implementation. Browser integration and durability checks remain pending; do not mark the photo release gate complete until those required checks pass.

## Landing-page Integration Update

The landing page renders the verified display URLs for its cover and all 18 gallery photos. Fresh individual checks returned HTTP 200 for all 18 display URLs. Eight larger variants returned HTTP 429 Too Many Requests during the later individual check; their IDs are recorded in the manifest's latestIntegrationCheck. The user explicitly approved continuing with verified gallery links while larger-image checks remain pending.

The page reserves image dimensions, eagerly loads the cover, and lazy-loads all gallery photographs. Gallery frames use object-fit: contain to preserve the complete image. “عرض الصورة” opens the verified display URL until the in-page viewer is implemented. Larger image URLs are not used in image src attributes or initial image requests.

TypeScript, production build, and served HTML/CSS checks passed. No browser is connected, so image embedding, loading/failure interactions, and visual checks at 360px, 768px, and 1440px remain pending. Do not treat HTTP checks as completed browser verification or a guarantee of permanent hosting.
## Final browser verification

The user approved development-only Playwright. All 18 real display images rendered inside the page in fresh signed-out Chromium contexts, including a later repeat run. No Google authentication cookies were present. Layouts at 360px, 768px, and 1440px and phone/desktop viewer captures were reviewed.

The native viewer shows the complete active photograph using its verified display URL, with captions, counter, RTL controls, focus handling, and loading/error states. No viewer image mounts before opening. All 18 larger variants are now verified and enabled on demand with display-size fallback by user decision.

Earlier pending notes describe the historical investigation state; this section and verification.md describe the current result. Temporary QA screenshots are outside the project. No engagement photograph assets were added to the repository.

## Final release verification — 13 October 2026

Published: https://ali-eman-memory-2026.vercel.app (Vercel project ali-eman-memory-2026, production deployment READY).

All 18 display and larger variants passed signed-out browser checks. The viewer immediately displays the gallery image, then upgrades only its active photo after decoding the larger variant. Errors or an eight-second timeout retain the display image. Five navigation tests, 12 Chromium scenarios, TypeScript validation, and production build passed.

A fresh anonymous browser verified the production URL returned HTTP 200, all 18 gallery photos loaded, exact Arabic content appeared, viewer navigation and Escape worked, focus returned correctly, and the 360px layout had no horizontal overflow or JavaScript errors. The public response includes X-Robots-Tag: noindex, nofollow. No original photo binaries or local credentials were uploaded.

Earlier investigation notes are historical; this final release verification supersedes pending-photo and unpublished-status statements above.

## Complete album import — 13 October 2026

The gallery now includes all 321 unique photos from the shared album: 300 initial records and 21 from its final pagination response, which returned no continuation token. The existing 18 opening photographs, captions, and selected cover remain first; the remaining photos follow album order. Fresh anonymous HEAD checks passed for all 321 display URLs after retrying four transient server/connection errors. These checks verify current access, not permanent URL lifetime.

Gallery cards now follow each photograph's natural proportions in one, two, or three responsive columns. Fixed editorial row heights and portrait frames were removed, eliminating empty bands without cropping photographs. Photos remain remote and lazy-loaded; no photo binaries were added to the repository. The viewer still shows the complete image and upgrades its active photo on demand.

### Still photos only

The complete album contains 309 still photos and 12 videos. Records with video duration metadata (`76647426`) are now excluded from the manifest and gallery, including their preview thumbnails. The current gallery contains 309 photos; the selected cover and original opening photos remain.

## Current selection — 50 visually reviewed photos

Reviewed the complete scraped still-photo catalog in contact sheets: 308 previews loaded and source record 163 did not. Selected 50 images for composition, clarity, varied moments, and limited repetition; all 50 larger selected previews loaded and were inspected. Each selected photo has a short Egyptian Arabic caption. Full descriptions are in selected-gallery.md. The current hero record, source URLs, cover ID, and hero styling were preserved exactly. This curated selection supersedes the prior full-album gallery.
