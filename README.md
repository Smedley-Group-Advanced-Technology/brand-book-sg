# Smedley Group Brand Book

The Smedley Group brand book: identity, colour, typography, logo usage and
application guidance across the group and its businesses.

Published via GitHub Pages from `index.html` on the `main` branch.

## Editing

The brand book is [`index.html`](index.html). Styles and artwork are inline; the only
external dependencies are the Sora and IBM Plex Mono webfonts from Google Fonts.
Edit the file directly and push to `main` to publish.

[`assets/`](assets) holds what the book links to: the hero animation (`mark.html`,
loaded by the cover and the Motion section), outlined logo SVGs for every business,
the tool icons, colour tokens (`tokens.css`, `tokens.json`) and a ZIP of all of them.

Preview through a local server, for example `python3 -m http.server`, rather than
opening the file directly: browsers block the page from talking to the animation
over `file://`, so the theme switch and Replay only reach it over HTTP.

## Themes

The book has a dark and a light theme. It follows the reader's system setting until
they pick one with the Dark / Light switch in the index; the choice is remembered in
the browser. The cover and motion animations follow the same theme. Colours are CSS
custom properties on `:root` (`--ink`, `--bg1`, `--flame`, `--line` and so on), redefined
for light under `:root[data-theme="light"]`.
