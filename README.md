# Smedley Group Brand Book

The Smedley Group brand book: identity, colour, typography, logo usage and
application guidance across the group and its businesses.

Published via GitHub Pages from `index.html` on the `main` branch.

## Editing

The brand book is [`index.html`](index.html). Styles and artwork are inline, and it loads
nothing from other sites: Sora and IBM Plex Mono are served from [`assets/fonts`](assets/fonts)
(Latin and Latin Extended, SIL Open Font Licence).
Edit the file directly and push to `main` to publish. The stylesheet is grouped by
component, with a list of the groups at its top; put new rules in the group they
belong to, after the rules they override.

[`assets/`](assets) holds what the book links to: the hero animation (`mark.html`,
loaded by the cover and the Motion section), outlined logo SVGs for every business,
the tool icons, colour tokens (`tokens.css`, `tokens.json`), templates for slides,
documents, email signatures and social posts, the favicon and link-preview image,
and a ZIP of all of them.

[`social/`](social) is the social post maker, linked from Resources: eight post types and 19
layouts in four formats for each business, downloaded as PNG or SVG. Add a layout by listing
it in a type's `variants` and drawing it in `render`; the check draws every combination. Its renderer, `social/posts.js`, also
draws the SVG frames in `assets/templates`, so the two never drift apart.

Every icon comes from [`icons/library.js`](icons/library.js): 24 px grid, 1.5 px stroke, square
ends, sharp corners, diagonals at 55°. [`icons/`](icons) is the icon library page. `npm run kit`
writes `assets/icons` (one SVG per icon and `sprite.svg`), keeps the book's tool icons in step and
updates the icon count; the check fails on any icon in the book, the hero animation or the tool
pages that is not drawn from the library. To add an icon, add a line to `ICONS` and run the kit.

The templates in `assets/templates` (slides, report, letter, email signature lockups, social frames) are
built by [`tools/templates`](tools/templates): run `npm run templates` after changing a logo
or the template code. It also refreshes the Resources previews when LibreOffice and Poppler
are installed, then runs the kit.

Colours live in [`assets/tokens.json`](assets/tokens.json). After changing it, a logo, a
template or a tool icon in the book, run `npm run kit`: it regenerates `tokens.css` and
`assets/icons`, rebuilds the ZIP and updates the file count and size on the book's
download card, and the size on every download button. Update the matching colours in the book by hand; the check below fails
until the book, the tokens and the ZIP agree.

Preview through a local server, for example `python3 -m http.server`, rather than
opening the file directly: browsers block the page from talking to the animation
over `file://`, so the theme switch and Replay only reach it over HTTP.

Photographs go in as WebP with the JPEG kept as a fallback: a showcase image needs
`name.jpg`, `name.webp` (1600 px) and `name-800.webp`, wired up with `<picture>`
like the existing ones.

## Checks

Every push and pull request runs [`tests/check.mjs`](tests/check.mjs) in Chromium,
Firefox and WebKit (see the Actions tab). It fails on console errors, requests to other
sites, missing files or anchors, duplicate IDs, sideways scrolling on phones,
accessibility violations (axe, WCAG 2.1 AA), broken interactions, a failed print,
an em dash anywhere in the text, or colours, generated files or the ZIP that no longer
match `tokens.json`. To run it locally:

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
