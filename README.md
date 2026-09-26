# Smedley Group Brand Book

The Smedley Group brand book: identity, colour, typography, logo usage and
application guidance across the group and its businesses.

Published via GitHub Pages from `index.html` on the `main` branch.

## Editing

The brand book is [`index.html`](index.html). Styles and artwork are inline; the only
external dependencies are the Sora and IBM Plex Mono webfonts from Google Fonts.
Edit the file directly and push to `main` to publish. The stylesheet is grouped by
component, with a list of the groups at its top; put new rules in the group they
belong to, after the rules they override.

[`assets/`](assets) holds what the book links to: the hero animation (`mark.html`,
loaded by the cover and the Motion section), outlined logo SVGs for every business,
the tool icons, colour tokens (`tokens.css`, `tokens.json`), templates for slides,
documents, email signatures and social posts, the favicon and link-preview image,
and a ZIP of all of them.

Preview through a local server, for example `python3 -m http.server`, rather than
opening the file directly: browsers block the page from talking to the animation
over `file://`, so the theme switch and Replay only reach it over HTTP.

Photographs go in as WebP with the JPEG kept as a fallback: a showcase image needs
`name.jpg`, `name.webp` (1600 px) and `name-800.webp`, wired up with `<picture>`
like the existing ones.

## Checks

Every push and pull request runs [`tests/check.mjs`](tests/check.mjs) in Chromium,
Firefox and WebKit (see the Actions tab). It fails on console errors, missing files
or anchors, duplicate IDs, sideways scrolling on phones, accessibility violations
(axe, WCAG 2.1 AA), broken interactions, a failed print, or an em dash anywhere in
the text. To run it locally:

```
npm install
npx playwright install chromium firefox
npm run check                      # or BROWSERS=chromium npm run check
```

## Themes

The book has a dark and a light theme. It follows the reader's system setting until
they pick one with the Dark / Light switch in the index; the choice is remembered in
the browser. The cover and motion animations follow the same theme. Colours are CSS
custom properties on `:root` (`--ink`, `--bg1`, `--flame`, `--line` and so on), redefined
for light under `:root[data-theme="light"]`.
