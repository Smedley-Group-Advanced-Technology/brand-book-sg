---
name: smedley-group-ui
description: Design, build and review user interfaces on the Smedley Group brand book, for Smedley Group, Advanced Technology, Insight Labs and FAT Racing. Use it for screens, web pages, dashboards, apps, components, emails, slides and graphics - choosing the ground, Race Red and Engineering Blue roles, Sora and IBM Plex Mono, the 55 degree cut, buttons and controls, icons, separators (a chequered strip is itself a separator), motion, copy and accessibility. Not for FAT Karting League, which has its own brand.
---

# Designing UI with the Smedley Group brand book

The brand book lives at https://smedley-group-advanced-technology.github.io/brand-book-sg/ and is the source of truth. This skill is its working summary for building screens. When the two disagree, the book wins.

Two worlds, one car. **Red is the track**: speed, heat, the driver, whoever leads. **Blue is the garage**: the blueprint, the data, the model. Both stand on a pure ground that belongs to neither. **Blue measures, red leads.**

## 1. Decide the context first

The context decides which colour leads. The ground and the type never change.

| Context | Who | Leads | Supports, once per view | Share of a screen |
|---|---|---|---|---|
| Engineering | Advanced Technology, Insight Labs, specs, product pages | Engineering Blue: fills, blueprint grid, dimension lines, blue boards | Red as the lead of the scale rule, or the one live value | 64 ground, 16 type, 17 blue, 3 red |
| Racing | FAT Racing, events, results, driver and fan content | Race Red: fills, number boards, kerbs, chequers, the leader | Blue as the reference line: the pace to beat, the model, focus | 64 ground, 16 type, 5 blue, 15 red |
| Group | Smedley Group, investor and corporate, the book | Neither: ground, white and the logo | Red and blue in balance, meeting at the seam | 72 ground, 18 type, 6 blue, 4 red |

**FAT Karting League is out of scope.** FKL has its own brand (FAT Pill, FKL Blue #0000FF, ST Rapid). Never restyle FKL-owned material in Smedley Group colours; use the FKL brand guidelines.

## 2. Ground and surfaces

- The ground is flat: **#000000 in the dark theme, #FFFFFF in the light one**. No gradients, no tints, no washes.
- **Blueprint #0B2D63** ruled in white (8 px and 40 px) is the one coloured ground, and only for drawings, setup sheets, simulations and anything built to a dimension.
- Raised things are separated by a hairline, not a shadow. No drop shadows or bevels.
- A hero sits on the page lit (a soft Silver pool at 9 %), not framed. One per view.
- Red and blue appear as marks and line work, never as a ground or a glow behind something.

## 3. Colour

Use the tokens in `assets/tokens.css` (`--sg-*`) or, when using the book's controls, the variables in `assets/ui.css`. Full values are in `references/tokens.md`.

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

Rules:
- **Red and blue meet only across a 55° cut, or with the ground between them.** Never edge to edge.
- **Never red type on blue, blue type on red.** On Blueprint, red accents become white.
- **Red never means wrong.** Gains are green (#3DDC84 dark, #007A38 light), losses and errors yellow (#FFB547 dark, #9C6300 light), as text on the ground or on their tint, never as fills.
- Blue may cover ground as line work (a grid, a whole drawing); red never does, even on track it stays in marks.
- The **temperature ramp** (Engineering Blue through Steel to Flame) is the only gradient, and only for data with a temperature or a speed.
- Contrast pairs that pass WCAG AA: white on Race Red 5.0:1, Flame on black 6.3:1, Race Red on white 5.0:1, Line Blue on black 9.7:1, #1F66E0 on white 5.2:1, white on #1F66E0 5.2:1. Engineering Blue on white is 3.7:1: marks only, never text.

## 4. Type

- **Sora** for everything we say, in three weights: Light 300 (captions), Regular 400 (body, labels), SemiBold 600 (titles, numbers). Set tight at display sizes (about -0.03 em). Numbers tabular.
- **IBM Plex Mono** for everything we measure: Regular 400 for ticks, units, annotations; Medium 500 for times and readouts. Never for sentences longer than a line, never above 24 px in interface.
- No italics, no capitals for labels, no third family. Weight and size do the work.
- Interface scale (px): hero number 84, page title 34, figure 28, section title 14, body 13, label 11 to 12 in dim, readout 11 to 14 mono.
- The fonts ship with the book (`assets/fonts`, SIL Open Font Licence); self-host them, do not call a font CDN.

## 5. The 55° cut

Every accent that marks, selects or measures carries the cut, leaning with the glyph: **top left to bottom right**, 55° from horizontal.
- Button and bar ends: `clip-path: polygon(0 0, calc(100% - c) 0, 100% 100%, c 100%)` with **c = height x 0.7**. Set the height and derive the cut; never a fixed cut.
- Vertical markers and indicators: `transform: skewX(35deg)`.
- Stripes: `repeating-linear-gradient(55deg, ...)`, whole stripes only, inside the margins.
- A mirrored cut reads as another brand. Sharp corners everywhere: no border radius on buttons, inputs, cards or tags.

## 6. Layout and separators

- **Lines, not boxes.** Hairlines (0.75 px, the hairline colour) and space separate sections. Cards only for things you pick up, such as downloads.
- **Section openers** use the scale rule: a red lead into a blue line with ticks, not a plain hairline.
- **A chequered strip is a separator.** It marks a finish: the end of a page before the footer, or the end of a race. **When a checker separates two areas, add nothing else**: no hairline, border or rule above or below it, and the element before it drops its bottom border. Never put chequers on anything unfinished.
- Race marks mean something: boards mark a place, kerbs a limit, chequers a finish.
- Usually one bold element per view, with calmer content around it. Close with the conclusion where it helps (an optional strapline band that states it, never restates the title).
- Keep the logo's clear space and a steady size and position within one product.
- Phones: a 16 px side gutter, no sideways scrolling, targets at least 44 px.

## 7. Controls

Use the book's own controls from `assets/ui.css` rather than drawing new ones. Markup and variants are in `references/components.md`.
- Buttons `.btn` with `.p` (primary, Race Red), `.g` (ghost), `.t` (text link); `.sm` 34 px, default 44 px, `.lg` 52 px. On hover a wipe runs through; on click a light streak crosses.
- Buttons that belong together sit in a `.bgroup`: their cuts run parallel 3 px apart and read as one bar.
- Inputs `.inp` with corner brackets and a red lead into a blue rule on focus; labels in mono above.
- Segmented control `.seg`, chips `.chip`, toggle `.toggle`, check and radio, slider `.range`, stepper `.stepper`, icon button `.ibtn`, tags `.tag`.
- One primary action per view. A pressed or selected state goes red; focus rings are blue.

## 8. Icons

Every icon comes from the icon library (https://smedley-group-advanced-technology.github.io/brand-book-sg/icons/, catalogue in `references/icons.md`, sprite in `assets/sprite.svg`).
- 24 px grid, 1.5 px stroke, no fill, **square ends, sharp corners, diagonals at 55°**.
- Use `<svg><use href="sprite.svg#sg-NAME"/></svg>` or the individual SVGs. Scale in steps: 16, 24, 32, 48; below 20 px a 1.8 px stroke reads better.
- Ink by default; red marks the one icon that matters; blue is for engineering data.
- If an icon is missing, draw it in the same style and propose it for the library. Workshop tools lean with the glyph; instruments sit level.

## 9. Motion

- Motion brakes: fast in, hard stop. Easing `cubic-bezier(.16, 1, .3, 1)` for anything arriving.
- One moment per view. No loops outside loaders, no blinking, no hover choreography.
- With reduced motion, show the end state at once.

## 10. Words

- Point first, specific, calm, like a race engineer on the radio.
- Sentence case everywhere, no full stop in headlines, no exclamation marks, no capitals for emphasis, no hype words.
- **No em dashes.** Use commas, colons or full stops.
- Numbers with units (0.18 s, 57 %), dates as 26 September 2026, names with places.
- Buttons say what happens ("Add to F4 shortlist", not "Submit"). Errors say what is wrong and how to fix it ("The transponder ID is missing. Add it and save again."), in yellow, never red.
- Engineering: precise, show the method. Racing: direct, short, present tense. Group: considered, the long view.

## 11. Imagery

- Text never sits on a photo. Pictures run to the edge or sit in the margins; words go beside or below.
- Authentic and specific over staged; real people named, real numbers sourced.

## Review checklist

Before handing over a design, check:
1. The context is chosen and the lead colour matches it; the share of red and blue is about right.
2. The ground is flat black or white; only drawings sit on Blueprint.
3. Red and blue never touch edge to edge, no red type on blue, red never means an error.
4. Sora and IBM Plex Mono only, in their roles; no italics or capital labels.
5. Every accent is cut at 55° leaning with the glyph; no rounded corners.
6. Sections are separated by hairlines or space, not boxes; **no hairline or border next to a checker**; chequers only at a finish.
7. Controls and icons come from the book's kit; one primary action per view.
8. Motion brakes, one moment per view, respects reduced motion.
9. Copy is sentence case, specific, with units, and has no em dashes.
10. Contrast meets WCAG AA in both themes; focus is visible; targets are 44 px on touch.
11. FAT Karting League material is left to the FKL brand.

## Files in this skill

- `references/tokens.md`: every colour and theme token, generated from the book.
- `references/components.md`: markup for the book's controls.
- `references/icons.md`: the icon catalogue, generated from the library.
- `assets/ui.css`, `assets/tokens.css`, `assets/sprite.svg`: the book's own files, ready to link.
