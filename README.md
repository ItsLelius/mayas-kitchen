# Maya's Kitchen Secrets — Landing Page

A single-page, mobile-first sales page for the "Maya's Kitchen Secrets" cookbook. Static HTML/CSS/JS — no build step, no framework, just upload and go.

## Folder structure

```
site/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
├── assets/
│   └── images/
│       ├── book-cover.png       ← hero image (book cover)
│       ├── maya-hero.png        ← hero image (Maya photo, alternates with cover)
│       └── recipes/
│           ├── preview-1.jpg    ← carousel: Rise & Shine
│           ├── preview-2.jpg    ← carousel: Midday Cravings
│           ├── preview-3.jpg    ← carousel: Dinner Time
│           ├── preview-4.jpg    ← carousel: Fast Food Secrets
│           ├── preview-5.jpg    ← carousel: The Bake Shop
│           ├── preview-6.jpg    ← carousel: Dessert Hour
│           ├── preview-7.jpg    ← carousel: Something Sweet
│           ├── preview-8.jpg    ← carousel: Sip & Enjoy
│           ├── preview-9.jpg    ← carousel: Little Bites
│           └── preview-10.jpg   ← carousel: Maya's Specials
└── sample/
    └── mayas-kitchen-sample.pdf ← free sample download
```

Everything referenced by `index.html` uses these exact relative paths and filenames — keep the folder structure intact when you upload.

## Before you launch — required edits

1. **Payhip checkout link.** Search `index.html` for `https://payhip.com/YOUR_LINK` (appears 4 times: nav button, hero CTA, final CTA, footer) and replace with your real checkout URL.
2. **Facebook link.** In the footer, replace `https://www.facebook.com/MayasKitchen` with your real page.
3. **Images.** Drop your files into `assets/images/` and `assets/images/recipes/` using the exact filenames above (see image specs below).
4. **Sample PDF.** Add your free-sample PDF at `sample/mayas-kitchen-sample.pdf`.

## Image specs

| Asset | Recommended size | Notes |
|---|---|---|
| `book-cover.png` / `maya-hero.png` | ~1200×1600px (3:4 portrait) | Shown in the hero frame; the two fade in/out every 5s. `object-fit: cover`, so slightly off-ratio is fine — the frame will crop to fill. |
| `preview-1.jpg` … `preview-10.jpg` | **A4 portrait, 210×297mm ratio** (e.g. 1240×1754px @150dpi or 1654×2339px @200dpi) | These render at the exact A4 aspect ratio with `object-fit: contain`, so the full page always shows with no cropping — just export your recipe pages as A4 JPGs. |
| `mayas-kitchen-sample.pdf` | — | Whatever page size your book uses; not displayed, only downloaded. |

## What's in the page

- **Nav** — sticky, brand + buy button, shadow appears on scroll.
- **Hero** — headline, trust badges, star rating, two CTAs (buy / free sample), alternating book/author photo.
- **Stats strip** — 300 recipes / 10 categories / 300+ pages / $9.99.
- **What's Inside** — 10 category cards (Rise & Shine, Midday Cravings, Dinner Time, Fast Food Secrets, The Bake Shop, Dessert Hour, Something Sweet, Sip & Enjoy, Little Bites, Maya's Specials).
- **Free Preview carousel** — 10 slides, one per category, auto-advances every 3 seconds in a seamless infinite loop. Supports swipe, arrow buttons, dot navigation, and keyboard arrows; manual interaction restarts the autoplay timer rather than stopping it permanently.
- **Value props** — 4 reasons the book is easy to actually use.
- **Final CTA** — big buy block + secure-checkout note + link to the free sample.
- **Footer** — brand, links, copyright.

## Behavior notes

- **Buyers counter** persists in the visitor's browser via `localStorage` and slowly increments over time up to a randomly-chosen cap — it's a lightweight social-proof touch, not a live server count.
- **Mobile-first**: base styles target phones; layout upgrades at `640px` (tablet — buttons go side-by-side, grids widen) and `900px` (desktop — hero becomes a two-column layout).
- **No rubber-band scroll / no tap flash**: `overscroll-behavior: none` stops the bounce-scroll on iOS/Android, and buttons, cards, images, and headings have tap-highlight and text-selection-callout disabled so nothing flashes or pops up a selection menu on tap.
- **Reduced motion**: all transitions/animations are disabled site-wide for visitors with `prefers-reduced-motion` set.

## Fonts & icons (loaded via CDN — need internet access)

- **Fraunces** (display/headings) + **Inter** (body) via Google Fonts.
- **Lucide** icons via `unpkg.com`.

If you're hosting somewhere that blocks external requests, download these and self-host, updating the `<link>`/`<script>` tags in `index.html` accordingly.

## Customizing

- **Colors, fonts, spacing** — all defined as CSS variables at the top of `css/style.css` under `:root`. Change `--red`, `--gold`, `--cream`, `--font-display`, `--font-body`, etc. to restyle the whole site from one place.
- **Carousel timing** — in `js/main.js`, adjust `AUTOPLAY_MS` (default `3000`) and `TRANSITION_MS` (default `500`).
- **Category cards / carousel slides** — edit directly in `index.html`; icons use [Lucide icon names](https://lucide.dev/icons).

## Deploying

This is a static site — upload the whole `site/` folder as-is to any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages, or your own server). No build step, no dependencies to install.