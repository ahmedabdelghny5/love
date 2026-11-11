# Arabic Engagement Memory Page

## 1. Goal and agreed choices

Create a romantic landing page that celebrates your engagement through beautiful photography, meaningful Arabic messages, and a colorful garden-inspired design.

- **Stack:** Next.js App Router, TypeScript, and Tailwind CSS. The user subsequently approved Playwright for development-only browser verification.
- **Content:** Cover photo, editable names/date, short dedication, curated gallery, full-screen photo viewer, and closing message.
- **Photos:** Remote Google Photos image URLs only; no downloaded photo assets in the project.
- **Access:** Anyone with the website link can view it. Request search engines not to index it; this does not make it private.
- **Additional tools:** Ask you before adding libraries, external services, or a hosting provider.

### Confirmed personal details

- **Name:** على
- **Fiancée:** إيمان
- **Display names:** على وإيمان
- **Engagement date:** 9 أكتوبر 2026
- **Date value:** `2026-10-09` (calendar date, without timezone conversion).
- **Personal message (preserve exactly):** نسير معًا، آنس بك وتأنس بي
- Use this personal message as the main dedication; the suggested general copy below may remain supporting text.

**Google Photos status:** Shared album access is verified through cookie-free HTTP requests. Previews of the first 300 media records were visually reviewed in memory, and 18 still photographs were selected. Their URLs, dimensions, Arabic captions, and verification results are saved in [photos.manifest.json](./photos.manifest.json). Cover: `engagement-210`. All 36 display/full-size URL HEAD checks returned successful image responses. No photo binaries were saved. Browser embedding of all 18 display images and a later fresh-browser check now pass in Chromium. All 18 larger variants are now verified and enabled on demand with display-size fallback due to rate limiting, and additional paginated album records were not reviewed. See [google-photos.md](./google-photos.md).

## 2. Visual design and Arabic content

Use warm ivory backgrounds, soft rose and lilac surfaces, sage accents, and deep plum text. Photos should remain the main visual focus, with subtle floral decoration created in CSS.

### Design tokens

| Token | Value | Purpose |
|---|---|---|
| Background | `#FFF9F3` | Warm ivory page |
| Surface | `#FFFFFF` | Photo cards and content panels |
| Rose | `#F7D6DF` | Romantic section accents |
| Lilac | `#E9DDF7` | Secondary backgrounds |
| Sage | `#DDE9DB` | Botanical accents |
| Primary | `#8B3655` | Buttons and links |
| Text | `#392B3A` | Headings and body |
| Muted text | `#6F606F` | Dates and captions |
| Border | `#EADDE3` | Soft separators |

Define these centrally as Tailwind theme variables, alongside spacing, typography, radii, and shadows. [Tailwind theme documentation](https://tailwindcss.com/docs/theme)

- Use a 4px spacing scale, generous section spacing, 20px card corners, and pill-shaped buttons.
- Use a system Arabic font stack initially, avoiding another font service.
- Set `lang="ar"` and `dir="rtl"`, with logical spacing properties throughout.
- Use subtle fades and hover effects; respect reduced-motion preferences.
- Keep text on solid surfaces so photography does not reduce readability.

### Page sequence

1. **Hero:** Large cover photo, `على وإيمان`, engagement date “9 أكتوبر 2026”, and a “شاهدوا لحظاتنا” button.
2. **Dedication:** The personal message “نسير معًا، آنس بك وتأنس بي” in an airy rose or lilac panel.
3. **Gallery:** A carefully ordered selection of photographs with short Arabic captions.
4. **Closing:** A heartfelt sentence and “الألبوم الكامل” link.

Suggested original copy:

> **ومن هنا بدأت حكايتنا**  
> في هذا اليوم، احتفلنا بوعدٍ جميل، وبداية طريق نختار أن نمشيه معًا.

Gallery heading:

> **لحظات نحب أن تبقى**

Closing message:

> **لكل صورة حكاية، وأجمل حكاياتنا ما زالت تُكتب.**

Use the confirmed names, date, and personal message above as editable content defaults. Preserve the supplied spelling and message; do not invent relationship events or personal memories.

## 3. Implementation steps

### Step 1 — Verify album access and image feasibility

Use the shared album:

`https://photos.app.goo.gl/ppS7q6qhzmddpLRy9`

Once browser access is available:

- Open the album and visually review its photographs.
- Select approximately 12–18 images, or fewer if appropriate.
- Favor clear expressions, sharp focus, flattering light, varied compositions, and meaningful moments.
- Choose one strong cover image; avoid duplicates and crops that cut off faces.
- Obtain actual image URLs rather than album or photo-viewer page URLs.
- Test each URL in a signed-out browser and inside the website.

**Your chosen rule:** If access or direct image links fail, stop the affected photo integration and ask you before changing the photo source or adding a service. Follow-up decision: all 18 gallery-size URLs passed rechecking, but some larger variants returned HTTP 429 (rate limiting). The user approved using verified gallery links while larger-image verification remains pending. Do not fetch the failing larger variants during initial page load.

Google’s official API image URLs expire after 60 minutes; browser-derived URLs must be evaluated separately and cannot be promised permanent. Do not introduce OAuth or a Photos API integration without your approval. [Google Photos URL documentation](https://developers.google.com/photos/library/guides/access-media-items)

### Step 2 — Inspect and prepare the project

Inspect the workspace and applicable repository instructions before changing anything. Preserve existing work; scaffold only if no application exists.

Use the approved Next.js, TypeScript, and Tailwind setup, recording dependency versions in the lockfile. [Next.js installation documentation](https://nextjs.org/docs/app/getting-started/installation)

Suggested organization:

```text
src/
  app/          Page composition, layout, metadata, global tokens
  components/   Hero, dedication, gallery, photo viewer, footer
  content/      Editable engagement content and photo manifest
  types/        Content and photo types
```

No database, API routes, credentials, or environment variables are needed for the planned page.

### Step 3 — Define the content interface

Keep personalization and photo ordering in one typed content module.

- `EngagementContent`: names, optional date, dedication, closing message, album URL, and cover-photo ID.
- `Photo`: ID, display URL, optional larger viewer URL, Arabic alt text, optional caption, dimensions, and crop position.

Store only URLs and descriptive metadata. Use photos.manifest.json as the verified initial selection when creating the typed content module; its audit fields are documentation, not required component props. Editing the content module should update the page without changing components.

### Step 4 — Build the responsive page

- Render the static page content with Server Components.
- Use CSS Grid for one gallery column on phones, two on tablets, and three on wide screens.
- Preserve the curated reading order.
- Use controlled cropping for thumbnails and show complete photographs in the viewer.
- Add an album link that remains available throughout the page.

Use direct browser image loading to preserve the remote-only requirement. Reserve image dimensions, load the hero eagerly, and lazy-load gallery images. Load larger viewer images when needed rather than loading every full-resolution photo on arrival.

### Step 5 — Add the photo viewer

Build the viewer with React state and a native modal dialog; no gallery library.

Include:

- Full photograph, caption, and image counter.
- Previous, next, and close buttons with Arabic labels.
- Escape-to-close and keyboard navigation.
- Focus containment, focus restoration, and background scroll locking.
- First/last navigation wrapping through the selected photos.
- A readable loading or failure state without breaking the layout.

Keep animations restrained and disable them when reduced motion is requested.

## 4. Verification and acceptance

Run the production build, TypeScript checks, and configured lint checks. Use the user-approved development-only Playwright tool for browser verification and visual captures, plus five focused navigation tests using Node.js. Testing code does not ship in the page.

Check:

- Arabic layout at approximately 360px, 768px, and 1440px widths.
- No horizontal overflow, clipped headings, or cropped faces.
- All selected image URLs work without Google login.
- URLs still work in a later fresh session; record that this does not guarantee permanence.
- Gallery order, captions, cover selection, and confirmed personal details, including the exact message and date without timezone shifts.
- Viewer navigation, Escape, focus restoration, and touch-sized controls.
- Slow connections, broken images, reduced motion, and keyboard-only use.
- Below-fold images load lazily and full-size viewer images load on demand.
- No engagement photo binaries or Google authentication secrets enter the repository.

**Completion criteria:** A polished local production preview with verified real photographs, functioning RTL interactions, and documented content-editing instructions. Failed image verification blocks photo integration and release.

## 5. Delivery and defaults

Deliver the project with instructions for running development, building production, changing Arabic copy, and replacing remote photo URLs.

The first release remains a single page without music, guestbook, timeline, or counter. Hosting selection and publication are deferred until you choose a provider; no additional service is assumed.

The remote-only approach keeps repository photo assets light. Visitors still download image data, and Google Photos link durability remains an external dependency.



## Implementation and Verification Status

The landing page, design system, gallery, native full-screen viewer, and local handoff are implemented. TypeScript, production build, five navigation tests, and 12 Chromium scenarios pass. All 18 display images rendered without Google login across 360px, 768px, and 1440px layouts, which were visually reviewed. A reproduced focus boundary issue was fixed and covered by regression tests.

The viewer uses the approved display URL and mounts only its active image. All 18 larger variants passed HTTP and signed-out browser verification. No deployment, additional photo hosting, OAuth, or engagement photo binaries in the project were introduced. See verification.md for evidence and current limits.

## Final release verification — 13 October 2026

Published: https://ali-eman-memory-2026.vercel.app (Vercel project ali-eman-memory-2026, production deployment READY).

All 18 display and larger variants passed signed-out browser checks. The viewer immediately displays the gallery image, then upgrades only its active photo after decoding the larger variant. Errors or an eight-second timeout retain the display image. Five navigation tests, 12 Chromium scenarios, TypeScript validation, and production build passed.

A fresh anonymous browser verified the production URL returned HTTP 200, all 18 gallery photos loaded, exact Arabic content appeared, viewer navigation and Escape worked, focus returned correctly, and the 360px layout had no horizontal overflow or JavaScript errors. The public response includes X-Robots-Tag: noindex, nofollow. No original photo binaries or local credentials were uploaded.

Earlier investigation notes are historical; this final release verification supersedes pending-photo and unpublished-status statements above.


## Current editorial upgrade (local, not published)

The latest requested upgrade supersedes historical typography and spelling notes above. Corrected groom name and dedication, immersive hero, curated Bento gallery, native reveals/swipes, system fonts, and sharing metadata are implemented locally. See [upgrade-notes.md](./upgrade-notes.md) for audit, files, verification, and limitations. No push or deployment is authorized for this revision.
