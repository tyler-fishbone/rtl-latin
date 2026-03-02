# RTL Latin Demo

Local proof-of-concept site for Biblical and liturgical Hebrew glossing using the RTL Latin mirrored font.

## Run locally

```bash
npm install
npm run dev
```

Vite will start a dev server on localhost, typically `http://localhost:5173`.

## What the demo shows

- A side-by-side comparison between a conventional gloss layout and an aligned RTL-reading layout
- A Hebrew phrase with transliteration and English translation
- A toggle between:
  - Mode A: mirrored font + RTL
  - Mode B: normal Latin font + LTR
- A font-size slider for visual comparison
- A copy button for the aligned three-line block
- A specimen section for inspecting mirrored Latin glyphs

## Reading-path idea

The core argument of the site is not just that the font exists, but that it may improve the reading experience for Hebrew learners.

- Conventional layouts often place transliteration on the left, Hebrew on the right, and translation below
- That forces the eye to jump between separate zones to connect one phrase
- RTL Latin tries to keep Hebrew, transliteration, and English glosses on the same right-anchored reading path
- The site is designed to make that contrast visible immediately

## RTL CSS notes

The native script line uses:

```css
direction: rtl;
text-align: right;
```

The mirrored gloss lines use:

```css
direction: rtl;
unicode-bidi: bidi-override;
text-align: right;
```

That combination forces Latin gloss text to visually stack and align with the RTL source line. The mirrored font family is centralized in `src/App.tsx` so you can change the name in one place:

```ts
const MIRROR_FONT_STACK =
  '"RTL Latin", "RTLLatin", system-ui, sans-serif';
```

This repo now bundles the real `RTL Latin` font files in `public/fonts/`:

- `RTLLatin-Regular.woff2` for browser use
- `RTLLatin-Regular.otf` for download and installation
- `OFL.txt` for redistribution and license packaging

The site loads the font with `@font-face` and also exposes direct download links from the page.

## Font metadata and packaging

- Family name: `RTL Latin`
- Full name: `RTL Latin Regular`
- PostScript name: `RTLLatin-Regular`
- Designer: `Rasmus Andersson`
- Manufacturer: `rsms`
- License: `SIL Open Font License 1.1`

If you redistribute the font files, include `public/OFL.txt` with them.

## Bundled font setup

The app loads the font from `src/styles.css`:

```css
@font-face {
  font-family: "RTL Latin";
  src:
    url("/fonts/RTLLatin-Regular.woff2") format("woff2"),
    url("/fonts/RTLLatin-Regular.otf") format("opentype");
  font-style: normal;
  font-weight: 400;
  font-display: swap;
}
```

If you replace the files later:

1. Drop the replacement `.woff2` and `.otf` files into `public/fonts/`.
2. Update the URLs in `@font-face` if the filenames change.
3. Keep the family name aligned with `MIRROR_FONT_STACK` in `src/App.tsx`.

No backend or external assets are required for the demo itself.
