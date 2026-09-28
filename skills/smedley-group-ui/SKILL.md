---
name: smedley-group-ui
description: Design, build and review user interfaces on the Smedley Group brand book, and build every Back Office screen from its React component library (@/design-system). Use it for Back Office apps, pages, dashboards, forms, records, tables, charts, settings, emails, slides and graphics for Smedley Group, Advanced Technology, Insight Labs and FAT Racing. It gives a step-by-step procedure, the library's full API and which component to use for each job, screen templates and measurements, how apps share one desk through window management and drag and drop, and the brand rules: context and lead colour, ground, Race Red and Engineering Blue, Sora and IBM Plex Mono, the 55 degree cut, icons, motion and copy, with a review checklist. Not for FAT Karting League, which has its own brand.
---

# Designing UI with the Smedley Group brand book

The brand book lives at https://smedley-group-advanced-technology.github.io/brand-book-sg/ and is the source
of truth. This skill is its working summary for building screens; when the two disagree, the book wins.

Two worlds, one car. **Red is the track**: speed, heat, the driver, whoever leads. **Blue is the garage**: the
blueprint, the data, the model. Both stand on a pure ground that belongs to neither. **Blue measures, red leads.**

## What to read

| File | Read it when |
|---|---|
| `references/library.md` | **Always, before writing any UI code.** The component library's full API and which component to use for each job |
| `references/layouts.md` | Always, before arranging a screen. Measurements, widths and seven screen templates |
| `references/ux.md` | Always for Back Office. Window management and drag and drop: what the shell does and what every app must do to take part |
| `references/tokens.md` | When you need an exact colour |
| `references/icons.md` | When you need an icon name (only these 134 exist) |
| `references/components.md` | Only when you cannot use React: the book's HTML classes from `assets/ui.css` |

## The procedure

Follow these steps in order for every screen. Do not skip one; write down the answer to each before coding.

1. **Is it FAT Karting League?** If the work carries FKL, FAT International, the FAT Pill or FKL Blue #0000FF,
   stop: it has its own brand. Everything else continues.
2. **Choose the context** from the table in section 1 (Engineering, Racing or Group). It decides which colour
   leads. Write it down.
3. **Choose the template** in `layouts.md`: Overview, Collection, Record, Flow, Schedule, Analysis or Settings.
   If none fits, the screen is doing too much; split it.
4. **Name the one lead element** (the one chart, list, table or form that answers the screen's question).
   Everything else supports it.
5. **List the regions** in the template's order (`layouts.md`, "The order of a screen") and what goes in
   each. The root is `AppScreen`.
6. **Pick every component from the table in `library.md`.** Import only from `@/design-system`. If you are
   about to write a `<button>`, `<input>`, `<select>`, `<table>` or a styled `<div>` yourself, stop and find
   the component.
7. **Write the copy** by section 10: noun titles, a context line with period, count and place, buttons that
   say what happens, units on every number, dates in full.
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
- **One primary action per view.** Red fill (`Button variant="primary"`) once. Everything else secondary or text.
- **Red never means wrong.** Errors, losses and warnings are yellow; gains and success are green. Never red text,
  never a red badge for a problem.
- **The ground is flat** black (dark) or white (light). No gradients, glows, shadows or tinted backgrounds.
- **Sharp corners, 55 degree cuts.** No border radius anywhere, avatars included.
- **Sora for words, IBM Plex Mono for measures.** No third typeface, no italics, no capital-letter labels.
- **Every control has a visible label**, every icon-only control an accessible name, every chart and table a
  name that states the finding.
- **Apps are laid out by their own width** from 260 px up (`AppScreen`); no viewport breakpoints inside an app.
- **Nothing needs a drag or a hover.** Every such action also works with one tap and from the keyboard.
- **No em dashes** in any copy. Use commas, colons or full stops. No exclamation marks.

## 1. Decide the context first

The context decides which colour leads. The ground and the type never change.

| Context | Who | Leads | Supports, once per view | Share of a screen |
|---|---|---|---|---|
| Engineering | Advanced Technology, Insight Labs, telemetry, specs, product pages | Engineering Blue: fills, blueprint grid, dimension lines, blue boards | Red as the lead of the scale rule, or the one live value | 64 ground, 16 type, 17 blue, 3 red |
| Racing | FAT Racing, events, results, driver and fan content | Race Red: fills, number boards, kerbs, chequers, the leader | Blue as the reference line: the pace to beat, the model, focus | 64 ground, 16 type, 5 blue, 15 red |
| Group | Smedley Group, investor and corporate, the book | Neither: ground, white and the logo | Red and blue in balance, meeting at the seam | 72 ground, 18 type, 6 blue, 4 red |

**FAT Karting League is out of scope.** FKL has its own brand (FAT Pill, FKL Blue #0000FF, ST Rapid). Never
restyle FKL-owned material in Smedley Group colours; use the FKL brand guidelines. Showing FKL data (a hub
name, a driver's class) inside a Back Office app is fine: it stays in Smedley Group styling.

## 2. Ground and surfaces

- The ground is flat: **#000000 in the dark theme, #FFFFFF in the light one**. No gradients, no tints, no washes.
- **Blueprint #0B2D63** ruled in white (8 px and 40 px) is the one coloured ground, and only for drawings, setup
  sheets, simulations and anything built to a dimension.
- Raised things are separated by a hairline, not a shadow. No drop shadows or bevels.
- A hero sits on the page lit (a soft Silver pool at 9 %), not framed. One per view.
- Red and blue appear as marks and line work, never as a ground or a glow behind something.

## 3. Colour

The library applies these for you. When you need a value, use the tokens in `assets/tokens.css` (`--sg-*`);
the full list is in `references/tokens.md`.

| Role | Dark | Light |
|---|---|---|
| Ground | #000000 | #FFFFFF |
| Ink (text) | #FFFFFF | #0B0C0E |
| Dim text | #9DA1A8 | #585D65 |
| Faint text | #777B82 | #686B71 |
| Hairline | rgba(205,207,212,.14) | rgba(28,30,34,.13) |
| Race Red, fills and the leader | #D8231A | #D8231A |
| Flame, red as a line or figure | #FF4B3E | #D8231A |
| Engineering Blue, references and focus | #2F80FF | #2F80FF |
| Line Blue, drawing lines and annotation | #7FB2FF | #1F66E0 |
| Blue behind white type | #1F66E0 | #1F66E0 |
| Green, gains and success | #3DDC84 | #007A38 |
| Yellow, losses, warnings and errors | #FFB547 | #9C6300 |

Rules:
- **Red and blue meet only across a 55° cut, or with the ground between them.** Never edge to edge.
- **Never red type on blue, blue type on red.** On Blueprint, red accents become white.
- **Red never means wrong.** Gains green, losses and errors yellow, as text on the ground or on their tint,
  never as fills.
- Blue may cover ground as line work (a grid, a whole drawing); red never does, even on track it stays in marks.
- The **temperature ramp** (Engineering Blue through Steel to Flame) is the only gradient, and only for data with
  a temperature or a speed.
- Records keep one colour everywhere (`RecordChip`): people red, sessions blue, venues ink, dates grey.
- Contrast pairs that pass WCAG AA: white on Race Red 5.0:1, Flame on black 6.3:1, Race Red on white 5.0:1, Line
  Blue on black 9.7:1, #1F66E0 on white 5.2:1, white on #1F66E0 5.2:1. Engineering Blue on white is 3.7:1: marks
  only, never text.

## 4. Type

- **Sora** for everything we say, in three weights: Light 300 (captions), Regular 400 (body, labels), SemiBold
  600 (titles, numbers). Set tight at display sizes (about -0.03 em). Numbers tabular.
- **IBM Plex Mono** for everything we measure: Regular 400 for ticks, units, annotations, subtitles and codes;
  Medium 500 for times and readouts. Never for sentences longer than a line, never above 24 px in interface.
- No italics, no capitals for labels, no third family. Weight and size do the work.
- Interface scale (px): hero number 84, page title 34, figure 28, section title 14, body 13, label 11 to 12 in
  dim, readout 11 to 14 mono.
- The fonts ship with the book and the library (SIL Open Font Licence); self-host them, never call a font CDN.

## 5. The 55° cut

Every accent that marks, selects or measures carries the cut, leaning with the glyph: **top left to bottom
right**, 55° from horizontal. The library's buttons, tags, tabs and markers already do; you only need this when
drawing something new.
- Button and bar ends: `clip-path: polygon(0 0, calc(100% - c) 0, 100% 100%, c 100%)` with **c = height x 0.7**.
  Set the height and derive the cut; never a fixed cut.
- Vertical markers and indicators: `transform: skewX(35deg)`.
- Stripes: `repeating-linear-gradient(55deg, ...)`, whole stripes only, inside the margins.
- A mirrored cut reads as another brand. Sharp corners everywhere: no border radius on buttons, inputs, cards
  or tags.

## 6. Layout and separators

The full rules and templates are in `references/layouts.md`. The essentials:
- **Lines, not boxes.** Hairlines and space separate sections. Cards only for things you pick up.
- **One bold element per view**, calmer content around it.
- **Section openers** on a page use the scale rule (`Separator scale`): a red lead into a blue line with ticks.
- **A chequered strip is a separator** (`FinishSeparator`). It marks a finish: the end of a page before the
  footer, or the end of a race. When a checker separates two areas, add nothing else: no hairline, border or
  rule above or below it. Never put chequers on anything unfinished.
- Race marks mean something: boards mark a place, kerbs a limit, chequers a finish.
- Keep the logo's clear space and a steady size and position within one product.
- A 16 px side gutter on phones, no sideways scrolling, targets at least 44 px.

## 7. Controls

Use the library's components, chosen with the table in `references/library.md`. Never draw a control.
- Buttons: `primary` (Race Red) once per view, `secondary` (ghost), `text` (red lead underline); 34, 44, 52 px.
  On hover a wipe runs through; on click a light streak crosses.
- Buttons that belong together sit in a `ButtonGroup`: their cuts run parallel and read as one bar.
- Inputs have corner brackets and a red lead into a blue rule on focus; labels in mono above.
- A pressed or selected state goes red; focus rings are blue.

## 8. Icons

Every icon comes from the icon library (catalogue in `references/icons.md`; `Icon` in the library).
- 24 px grid, 1.5 px stroke, no fill, **square ends, sharp corners, diagonals at 55°**.
- Sizes 16, 24, 32, 48. Inside buttons 16. Below 20 px a 1.8 px stroke reads better (the library does it).
- Ink by default; red marks the one icon that matters; blue is for engineering data.
- If an icon is missing, say so and propose it for the library; never draw an inline SVG in a screen.

## 9. Motion

- Motion brakes: fast in, hard stop. Easing `cubic-bezier(.16, 1, .3, 1)` for anything arriving.
- Window and drag motion has exact values in `references/ux.md` Part C.
- One moment per view. No loops outside loaders, no blinking, no hover choreography.
- With reduced motion, show the end state at once. The library already does for its own components.

## 10. Words

- Point first, specific, calm, like a race engineer on the radio.
- Sentence case everywhere, no full stop in headlines, no exclamation marks, no capitals for emphasis, no hype.
- **No em dashes.** Use commas, colons or full stops. Ranges use "to": "22 Sep to 5 Oct".
- Numbers with units (0.18 s, 57 %, £2,400), dates as 26 September 2026, names with places.
- Buttons say what happens ("Add to F4 shortlist", "Book for Maja"), not "Submit" or "OK".
- Errors say what is wrong and how to fix it ("The transponder ID is missing. Add it and save again."), in
  yellow, never red.
- Engineering: precise, show the method. Racing: direct, short, present tense. Group: considered, the long view.

## 11. Imagery

- Text never sits on a photo. Pictures run to the edge or sit in the margins; words go beside or below.
- Authentic and specific over staged; real people named, real numbers sourced.

## Review checklist

Before handing over, check every line. Report any you could not check.

1. The context is chosen and the lead colour matches it; the share of red and blue is about right.
2. The screen follows one template from `layouts.md`, with its regions in order and one lead element.
3. Every control, list, table, chart and message is a library component imported from `@/design-system`;
   nothing is restyled; no other UI package was added.
4. One primary button in the view. Destructive actions are confirmed (`ConfirmDialog` or `HoldToConfirm`) and
   sit apart from Save.
5. The ground is flat black or white; only drawings sit on Blueprint.
6. Red and blue never touch edge to edge, no red type on blue, red never means an error.
7. Sora and IBM Plex Mono only, in their roles; no italics or capital labels.
8. Every accent is cut at 55° leaning with the glyph; no rounded corners.
9. Sections are separated by hairlines or space, not boxes; no hairline or border next to a checker; chequers only
   at a finish.
10. Loading, empty and error states are designed: `DataTable loading` and `empty`, `ScreenSkeleton`,
    `StatusPage`, `ErrorSummary`. Lists of records use `DataTable`, forms end in `FormActions`.
11. The app works at 260, 320, 480, 800, 1200 and 1440 px: no overlap, no sideways scroll, metrics 2 or 4.
12. It takes part in the desk (`ux.md` Part B): records are `RecordChip`s, verbs for what it accepts, the landing
    mark on receive, dropped ranges as `FilterBar`s, no shell keys bound.
13. Everything works by keyboard and by one tap: no drag-only, no hover-only; focus visible; 44 px on touch.
14. Motion brakes, one moment per view, respects reduced motion.
15. Copy is sentence case, specific, with units and full dates, and has no em dashes.
16. Contrast meets WCAG AA in both themes; check dark and light.
17. FAT Karting League material is left to the FKL brand.

## Files in this skill

- `references/library.md`: the React component library, its API, and which component to use for each job.
- `references/layouts.md`: measurements, widths, the order of a screen and seven templates.
- `references/ux.md`: window management and drag and drop: what the shell does and what every app must do.
- `references/tokens.md`: every colour and theme token, generated from the book.
- `references/icons.md`: the icon catalogue, generated from the library.
- `references/components.md`: the book's HTML controls, for work outside React.
- `assets/ui.css`, `assets/tokens.css`, `assets/sprite.svg`, `assets/fonts`: the book's own files, ready to link
  when you cannot use the library.
