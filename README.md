# Smedley Group Brand Book

The Smedley Group brand book: identity, colour, typography, logo usage and
application guidance across the group and its businesses.

Published via GitHub Pages from `index.html` on the `main` branch.

## Editing

The brand book is a single self-contained HTML file, [`index.html`](index.html).
All styles and artwork are inline; the only external dependencies are the Sora
and IBM Plex Mono webfonts from Google Fonts. Edit the file directly and push to `main` to publish.

## Themes

The book has a dark and a light theme. It follows the reader's system setting until
they pick one with the Dark / Light switch in the index; the choice is remembered in
the browser. The cover and motion animations follow the same theme. Colours are CSS
custom properties on `:root` (`--ink`, `--bg1`, `--flame`, `--line` and so on), redefined
for light under `:root[data-theme="light"]`.
