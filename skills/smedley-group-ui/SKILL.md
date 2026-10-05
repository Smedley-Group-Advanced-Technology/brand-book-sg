---
name: smedley-group-ui
description: Design, build and review user interfaces on the Smedley Group brand book, and build every Back Office screen from its React component library (@/design-system). Use it for Back Office apps, pages, dashboards, forms, records, tables, charts, settings, emails, slides and graphics for Smedley Group, Advanced Technology, Insight Labs and FAT Racing. It gives a step-by-step procedure, the library's full API and which component to use for each job, screen templates and measurements, how apps share one desk through window management and drag and drop, and the brand rules: the near-monochrome palette, the white ground, the 45 degree signature surface with its edge light, rounded parts, Sora in three weights, signal colours only as labels, icons, motion and copy, with a review checklist. Not for FAT Karting League, which has its own brand.
---

# Designing UI with the Smedley Group brand book

The brand book lives at https://smedley-group-advanced-technology.github.io/brand-book-sg/ and is the source
of truth. Its identity was reconstructed from the Advanced Technology "TalentID" presentation (logo, colour,
gradients, typography, layout, components). This skill is its working summary for building screens; when the two
disagree, the book wins.

**Dark on light. Everything dark is one surface. Colour is structural.** Ink and navy build the structure, one pale
blue carries the light, and a tightly rationed green and red carry meaning rather than decoration.

## What to read

| File | Read it when |
|---|---|
| `references/library.md` | **Always, before writing any UI code.** The component library's full API and which component to use for each job |
| `references/layouts.md` | Always, before arranging a screen. Measurements, widths and seven screen templates |
| `references/ux.md` | Always for Back Office. Window management and drag and drop: what the shell does and what every app must do to take part |
| `references/tokens.md` | When you need an exact colour, radius or the surface gradient |
| `references/icons.md` | When you need an icon name (only these exist) |
| `references/components.md` | Only when you cannot use React: the book's HTML classes from `assets/ui.css` and `assets/extended.css` |

## The procedure

Follow these steps in order for every screen. Do not skip one; write down the answer to each before coding.

1. **Is it FAT Karting League?** If the work carries FKL, FAT International, the FAT Pill or FKL Blue #0000FF,
   stop: it has its own brand. Everything else continues.
2. **Choose the template** in `layouts.md`: Overview, Collection, Record, Flow, Schedule, Analysis or Settings.
   If none fits, the screen is doing too much; split it.
3. **Name the one lead element** (the one chart, list, table or form that answers the screen's question).
   Everything else supports it.
4. **List the regions** in the template's order (`layouts.md`, "The order of a screen") and what goes in
   each. The root is `AppScreen`.
5. **Pick every component from the table in `library.md`.** Import only from `@/design-system`. If you are
   about to write a `<button>`, `<input>`, `<select>`, `<table>` or a styled `<div>` yourself, stop and find
   the component.
6. **Decide what is dark.** Only things you pick up or that float are drawn in the signature surface: cards,
   app tiles, menus, dialogs, toasts, tooltips. The working area stays on white.
7. **Write the copy** by section 10: noun titles, a context line with period, count and place, buttons that
   say what happens, units on every number, dates in full. If the view needs a conclusion, write one `Strapline`.
8. **Make it take part in the desk** (`ux.md` Part B): every record a `RecordChip`, a verb for each record type
   the app can act on, a `receive` that marks what changed, dropped ranges as `FilterBar`s, a `Hint` while
   waiting. Design loading (`Skeleton`), empty (`EmptyState`) and error (`Alert tone="warning"`) too.
9. **Check the widths** 260, 320, 480, 800, 1200 and 1440 px: no overlap, no sideways scrolling, every action
   reachable, targets 44 px on touch.
10. **Run the review checklist** at the end of this file and fix everything that fails.

## Hard rules

These are never broken. A screen that breaks one is not finished.

- **Use the library.** Every Back Office screen is built from `@/design-system` (`frontend/design-system` in the
  `back-office` repository). No other UI library, no hand-made controls, no copied markup, no restyling a
  component with colours, fonts, borders or radii. Layout utilities only.
- **One primary action per view.** The signature fill (`Button variant="primary"`) once. Everything else secondary or text.
- **The ground is white.** #FFFFFF in the light theme (the default), #10141A in the dark one. Canvas #F0F0F0 is a soft
  panel and the slide background, not the screen ground.
- **One surface for everything dark:** the 45 degree gradient from #000000 to #222A35 with its edge light. No other
  gradient, no gradient at any other angle, no drop shadows, no bevels, no glows.
- **Signal colours only label.** Green and red appear as short bold text on their own tint, never as a fill, a
  surface, a background or a chart fill. Errors, losses and warnings use the negative pair; gains and success the
  positive pair. No orange or yellow anywhere.
- **Rounded, never cut.** Controls 8 px, chips 6 px, tiles 10 px, cards 12 px. No skewed or slanted shapes.
- **Sora only**, in three weights: Light 300, Regular 400, SemiBold 600. No second family, no italics.
- **Every control has a visible label**, every icon-only control an accessible name, every chart and table a
  name that states the finding.
- **Apps are laid out by their own width** from 260 px up (`AppScreen`); no viewport breakpoints inside an app.
- **Nothing needs a drag or a hover.** Every such action also works with one tap and from the keyboard.
- **No em dashes** in any copy. Use commas, colons or full stops. No exclamation marks.

## 1. The palette

| Group | Colours |
|---|---|
| Core, the spine | Ink #000000, Deep Navy #222A35, Slate #333F50, Steel #44546A, Mist #8497B0, Pale Blue #ABC0E4 |
| Surface and neutral | Cloud #D6DCE5, Plate #BFBFBF, Canvas #F0F0F0, Off-white #F3F2F2, White #FFFFFF, Caption #9AA0A8 |
| Signal, in pairs | Positive #00B050 on #E2F0D9, Negative #C00000 on #FBE5D6; Product Blue #ADB9CA for a product name only |

Everything structural is built from Ink, Deep Navy and Pale Blue. Pale Blue is the one highlight: the edge light, the
divider, the apex of the edge light.

**FAT Karting League is out of scope.** FKL has its own brand (FAT Pill, FKL Blue #0000FF, ST Rapid). Never
restyle FKL-owned material in Smedley Group colours; use the FKL brand guidelines. Showing FKL data (a hub
name, a driver's class) inside a Back Office app is fine: it stays in Smedley Group styling.

## 2. Themes and surfaces

The library applies these for you through the `--sg-*` tokens in `assets/tokens.css` (full list in
`references/tokens.md`).

| Role | Light (default) | Dark |
|---|---|---|
| Ground | White #FFFFFF | #10141A |
| Panel (windows, alternate fills) | #F7F7F7 | #171C24 |
| Text | Ink #000000 | #FFFFFF |
| Secondary text | Slate #333F50 | Cloud #D6DCE5 |
| Quiet text and labels | Steel #44546A | Mist #8497B0 |
| Hairline | Black at 14 % (about #CECECE) | Pale Blue at 28 % |
| Quiet tint (current item, chips, hovers, tracks) | Canvas #F0F0F0 | Pale Blue at 14 % |
| Field | White with a Steel edge | 4 % white with a Pale Blue edge |
| Accent (focus, references) | Steel #44546A | Pale Blue #ABC0E4 |
| Selected (primary, checked, current) | the signature surface, white type | Pale Blue, black type |
| Positive text, tint | #007A3D on #E2F0D9 | #4CD98A on 16 % green |
| Negative text, tint | #C00000 on #FBE5D6 | #FF8A8A on 24 % red |

- **The signature surface** is `--sg-surface` (`linear-gradient(135deg,#000 0%,#222A35 100%)`) inside a 1 px
  edge light, `--sg-edge`: Mist at the top, Pale Blue at 53 %, Slate at the foot. It reads as one light source above
  the page and is what separates a card from the ground. `.sg-surface` applies both.
- **Dark surfaces carry the dark theme.** Menus, dialogs, toasts, tooltips and popovers do so by class; anything
  else drawn in the surface takes `.sg-dark`, so what sits inside it (text, fields, buttons) reads on it. `Card`,
  `ContentCard`, desk tiles, the desk menu and the date picker already do.
- The light theme is the default; the dark theme applies only when the person picks it (`data-theme="dark"`).
- No tinted washes, no glows, no shadows. Panels are separated by a hairline or by being dark on light.

## 3. Colour rules

- **Mist and Caption are never text on white** (3.0 : 1 and 2.6 : 1). Use Slate or Steel. Caption is for small
  type on dark only.
- **#00B050 is too light for small type on screen**; the library sets positive text in #007A3D (4.6 : 1 on its tint).
  #00B050 stays the print value.
- **Green and red never share a block** of signal chips.
- Records keep one fill everywhere (`RecordChip`): people in the signature surface, sessions in Steel, venues in
  Pale Blue, date ranges in the quiet tint.
- Charts: structure in Ink, Navy and Pale Blue. The subject series is the text colour, the reference is the accent,
  comparisons are Mist. The one ramp for speed or temperature runs Pale Blue, Mist, Slate. Gains and losses are
  told by the numbers in the signal colours, never by filled bars in green or red.
- Contrast pairs that pass WCAG AA: Ink on white 21 : 1, Slate on white 10.7 : 1, Steel on white 7.7 : 1, white
  on the surface 14.5 : 1 at its navy end, black on Pale Blue 11.4 : 1, Negative on its tint 5.3 : 1, #007A3D on the
  positive tint 4.6 : 1.

## 4. Type

- **Sora** for everything, three weights: Light 300 (card captions, small descriptors), Regular 400 (running text,
  labels), SemiBold 600 (titles, labels, numbers, straplines). Regular may be set bold for emphasis in a sentence.
- Measured values (times, amounts, codes) are Sora with tabular figures; there is no mono family.
- Display sizes are tracked tight, -0.024 em (the book's -0.68 pt at 28 pt); 16 px and below are tracked normally.
- Interface scale (px): page title 32, figure 28, dialog title 20, section label 15, body 13, field label 12
  SemiBold, help 12, caption 11 (the floor for interface text).
- Uppercase is for two things only: card titles (12 px SemiBold, +0.02 em) and eyebrows over a title
  ("03 · Identity", 11 px SemiBold, +0.2 em, Steel).
- Sentence case for titles, no terminal full stop. The fonts ship with the book and the library (SIL Open Font
  Licence); self-host them, never call a font CDN.

## 5. Shapes

- Radii: `--sg-radius-control` 8 px (buttons, fields, menu rows), `--sg-radius-chip` 6 px (tags, chips, signal
  chips, the strapline band), `--sg-radius-tile` 10 px (icon tiles, alerts, segmented controls), `--sg-radius-card`
  12 px (cards, menus, dialogs, toasts, windows).
- Markers are small rounded bars: 3 px wide, 16 px tall, 2 px radius (the current side navigation item, an open
  accordion row, a toast's tone). Underlines for the current tab or page are 2 px, rounded.
- The circle appears once per view at most, to mark the centre of a process. Everything else is a rounded rectangle.

## 6. Layout and separators

The full rules and templates are in `references/layouts.md`. The essentials:
- **Lines, not boxes.** Hairlines and space separate sections. Cards only for things you pick up.
- **The section header opens every block**: a bold label, a quiet subtitle, and the divider under it, a grey hairline solid to 83 % of its length, then fading (`Section` and `Separator scale` draw it). It never closes a box.
- **One strapline per view at most** (`Strapline`): the conclusion, not a caption that restates the title. Dark by
  default; light when the area above is already dense with dark cards.
- **No more than four columns.** Nothing but full-bleed imagery and the strapline touches the edge.
- Keep the logo's clear space (the cap height of the wordmark on every side), its size and its corner steady within
  one product. The logo is monochrome: ink on white, white on dark. Never recolour it, box it or separate the glyph.
- **The logo is the drawn asset, never redrawn.** Use `assets/logo/*.svg` (or `BrandLogo`). If the glyph has to be
  drawn in code (a loader, a progress gauge, an animation), copy the three bars exactly as they are in the asset
  (`21.31 2.59 48.89 41.71`, `6.71 12.79 47.59 71.21`, `5.51 42.39 32.89 81.41`, stroke 14.2, square ends): no
  approximate coordinates, no rounded caps, no lengthened or shortened bars. To draw a bar on, give each line
  `pathLength="1"` and animate `stroke-dashoffset` from 1 to 0; a shared dash length cuts the long bar short.
- **The page shell** (the component library and the brand book share it): a top bar that runs edge to edge, 72 px
  (60 on phones), the white ground and a hairline at its foot; its contents keep the page's container and gutters,
  so the lockup lines up with the sidebar and content below. On the right a quiet label, the theme switch and, on
  phones, the menu. Under it a sidebar about 220 px wide: the search field, then the chapters with small tracked
  uppercase group labels, the current one in the quiet tint and SemiBold, all inside a `ScrollArea`. No chapter
  or section numbers.
- A 16 px side gutter on phones, no sideways scrolling, targets at least 44 px.

## 7. Controls

Use the library's components, chosen with the table in `references/library.md`. Never draw a control.
- Buttons: `primary` (the signature fill with white type, Pale Blue with black type on dark) once per view,
  `secondary` (a Steel hairline), `text` (a grey underline that turns to the accent on hover), `warning` (the
  negative pair, for destructive actions); 34, 44 and 52 px.
- Buttons that belong together sit in a `ButtonGroup`, 8 px apart, the primary first.
- Fields are white, rounded, with a Steel edge and a SemiBold label above. Focus turns the edge ink and adds a Pale
  Blue halo; an error turns the edge and the message negative.
- Checked, pressed and current states take the selected fill. Focus rings are 2 px in the accent.
- Anything that scrolls inside the page (a sidebar, a long menu, a panel) is a `ScrollArea`: native scrolling with a
  thin rounded overlay thumb that shows on hover or scroll and fades, never a browser scrollbar. Its styles are part
  of `assets/ui.css` (`.sg-scroll`, `.sg-scroll-viewport`, `.sg-scroll-bar`, `.sg-scroll-thumb`).

## 8. Icons

Every icon comes from the icon library (catalogue in `references/icons.md`; `Icon` in the library).
- One monoline set on a 24 px grid (the book's 96 px grid): 1.5 px stroke, rounded ends and joins, no fill.
  Geometric drawing: right-angled chevrons and arrowheads, rectangles with small rounded corners, circles for
  joints and points, no slanted 55 degree geometry. Hand tools lie on the 45 degree diagonal; instruments sit level.
- Sizes 16, 24, 32, 48. Inside buttons 16. Below 20 px a 1.8 px stroke reads better (the library does it).
- An icon that stands for an idea sits in an `IconTile`: white on the signature surface. One icon per idea; if an
  idea needs two, it needs two cards. Icons are never drawn in a signal colour.
- If an icon is missing, say so and propose it for the library; never draw an inline SVG in a screen.

## 9. Motion

- Motion brakes: fast in, hard stop. Easing `cubic-bezier(.16, 1, .3, 1)` for anything arriving.
- A press scales the control to 98 % for 80 ms. The primary action's hover gradient fades in over its resting one in 0.45 s; nothing moves. Nothing else has hover choreography.
- Window and drag motion has exact values in `references/ux.md` Part C.
- One moment per view. No loops outside loaders (the logo's three bars, the gliding progress segment).
- The cover's moment is the lockup drawing itself, flat, ink on white (white on dark), large and centred, with no
  tile, box or glow: the bars in turn, the group name, the divider from its centre, the division, then stillness.
- With reduced motion, show the end state at once. The library already does for its own components.

## 10. Words

- Point first, specific, calm, like an engineer explaining a result.
- Sentence case everywhere, no full stop in headlines, no exclamation marks, no capitals for emphasis, no hype.
- **No em dashes.** Use commas, colons or full stops. Ranges use "to": "22 Sep to 5 Oct".
- Numbers with units (0.18 s, 57 %, £2,400), dates as 26 September 2026, names with places.
- Buttons say what happens ("Add to F4 shortlist", "Book for Maja"), not "Submit" or "OK".
- Errors say what is wrong and how to fix it ("The transponder ID is missing. Add it and save again."), in the
  negative pair.
- A strapline is one sentence, one idea, no punctuation beyond a full stop.

## 11. Imagery

- Documentary photography of the real environment: track-side, the paddock, in the seat. Available light, no
  filters, no stock gloss.
- Images are hard-edged rectangles or full bleed. A caption may sit in white SemiBold over the lower left of a photo
  with no plate behind it; any other text goes beside or below.
- Real people named, real numbers sourced.

## Review checklist

Before handing over, check every line. Report any you could not check.

1. The screen follows one template from `layouts.md`, with its regions in order and one lead element.
2. Every control, list, table, chart and message is a library component imported from `@/design-system`;
   nothing is restyled; no other UI package was added.
3. One primary button in the view. Destructive actions are confirmed (`ConfirmDialog` or `HoldToConfirm`) and
   sit apart from Save.
4. The ground is white (or #10141A in the dark theme); only cards, tiles and floating things are dark, all in the
   one signature surface with its edge light.
5. Green and red only as labels on their tints, never fills; no orange or yellow; Mist and Caption never text on white.
6. Sora only, in its three weights; uppercase only for card titles and eyebrows.
7. Rounded corners at the four radii; no skewed or cut shapes; no shadows.
8. Sections open with the section header and its fading divider; no boxes around sections; at most one strapline.
9. Loading, empty and error states are designed: `DataTable loading` and `empty`, `ScreenSkeleton`,
   `StatusPage`, `ErrorSummary`. Lists of records use `DataTable`, forms end in `FormActions`.
10. The app works at 260, 320, 480, 800, 1200 and 1440 px: no overlap, no sideways scroll, metrics 2 or 4.
11. It takes part in the desk (`ux.md` Part B): records are `RecordChip`s, verbs for what it accepts, the landing
    mark on receive, dropped ranges as `FilterBar`s, no shell keys bound.
12. Everything works by keyboard and by one tap: no drag-only, no hover-only; focus visible; 44 px on touch.
13. Motion brakes, one moment per view, respects reduced motion.
14. Copy is sentence case, specific, with units and full dates, and has no em dashes.
15. Contrast meets WCAG AA in both themes; check light and dark.
16. FAT Karting League material is left to the FKL brand.

## Files in this skill

- `references/library.md`: the React component library, its API, and which component to use for each job.
- `references/layouts.md`: measurements, widths, the order of a screen and seven templates.
- `references/ux.md`: window management and drag and drop: what the shell does and what every app must do.
- `references/tokens.md`: every colour, theme token, radius and the surface, generated from the book.
- `references/icons.md`: the icon catalogue, generated from the library.
- `references/components.md`: the book's HTML controls, for work outside React.
- `assets/ui.css`, `assets/extended.css`, `assets/tokens.css`, `assets/sprite.svg`, `assets/fonts`: the book's own
  files, ready to link when you cannot use the library.
