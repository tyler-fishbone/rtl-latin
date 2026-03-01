# Nital LTR Demo

Local proof-of-concept site for interlinear glossing under Hebrew and Arabic using a mirrored Latin font.

## Run locally

```bash
npm install
npm run dev
```

Vite will start a dev server on localhost, typically `http://localhost:5173`.

## What the demo shows

- A native Hebrew or Arabic line rendered in RTL with right alignment
- A phonetic/transliteration gloss line underneath
- A meaning/translation gloss line underneath
- A toggle between:
  - Mode A: mirrored font + RTL
  - Mode B: normal Latin font + LTR
- A font-size slider for quick visual comparison
- A copy button per card that copies the three-line block as plain text with line breaks

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
  '"Inter Mirror", "Nital LTR", "InterMirror", system-ui, sans-serif';
```

This repo assumes the mirrored font is already installed on your system. If it is not installed, the demo still runs using fallback fonts, but the true mirrored effect will not appear.

## Optional: bundle a local font file

If you want the repo to ship with a local font instead of depending on a system-installed font:

1. Put a `.woff2` file in `public/fonts/`, for example `public/fonts/nital-ltr.woff2`.
2. Add an `@font-face` block near the top of `src/styles.css`:

```css
@font-face {
  font-family: "Nital LTR";
  src: url("/fonts/nital-ltr.woff2") format("woff2");
  font-style: normal;
  font-weight: 400;
}
```

3. Keep `"Nital LTR"` in the `MIRROR_FONT_STACK` constant.

No backend or external assets are required for the demo itself.
