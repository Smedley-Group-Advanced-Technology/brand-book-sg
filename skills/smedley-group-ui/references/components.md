# The book's controls, in HTML

For work outside React only (a static page, an email, a prototype). Every Back Office screen uses the React
library instead: see `library.md`. These are the same controls; the library wraps these classes.

Link the fonts, `ui.css` (the controls, with the `--sg-*` tokens included) and `extended.css` (the interface
patterns: navigation, feedback, data, calendar, overlays), then use these classes. The light theme on white is the
default; `data-theme="dark"` on `<html>` switches to the dark theme on #10141A. Anything you draw in the signature
surface takes `.sg-dark` so what sits inside it reads on dark; `.toast`, `.tip`, `.menu`, `.pop` and `.modal`
already do.

```html
<link rel="stylesheet" href="fonts/fonts.css">
<link rel="stylesheet" href="ui.css">
<link rel="stylesheet" href="extended.css">
```

## Buttons

```html
<button class="btn p" type="button">Add to F4 shortlist</button>
<button class="btn g" type="button">Open sessions</button>
<a class="btn t" href="#">Read the specs</a>
<button class="btn neg" type="button">Remove driver</button>
<button class="btn p lg" type="button">Download the brand kit</button>
<button class="btn g sm" type="button">Replace</button>
```

- `.p` primary in the selected fill (the signature gradient with white type on light, Pale Blue with black type on
  dark), `.g` secondary with a Steel hairline, `.t` text link with a grey underline that turns to the accent on
  hover, `.neg` warning in the negative pair (#C00000 on #FBE5D6) for destructive actions.
- Heights: `.sm` 34 px, default 44 px, `.lg` 52 px. Corners 8 px.
- An icon leads the label: `<svg class="bi" viewBox="0 0 24 24">...</svg>`, 16 px, 8 px gap.
- A press scales the button to 98 % for 80 ms. No script is needed.

## Button group

```html
<div class="bgroup" role="group" aria-label="Save">
  <button class="btn p" type="button">Download PNG</button>
  <button class="btn g" type="button">Copy</button>
</div>
```

Buttons that belong together sit 8 px apart, the primary first.

## Inputs

```html
<div class="field">
  <label class="lab" for="name">Driver</label>
  <input class="inp" id="name">
  <span class="help">As it appears on the licence</span>
</div>
<div class="field err">...</div>            <!-- the edge and the help turn negative red -->
<div class="unit"><input class="inp mono" value="1.40"><span>bar</span></div>   <!-- .mono: tabular figures -->
<div class="inpicon"><svg viewBox="0 0 24 24">...</svg><input class="inp" type="search"></div>
<select class="inp">...</select>
```

Fields are white (4 % white on dark) with a Steel edge, 8 px corners and a SemiBold 12 px label above.

## Choices

```html
<div class="seg" role="radiogroup" aria-label="Period">
  <label><input type="radio" name="per"><span><i>Week</i></span></label>
  <label><input type="radio" name="per" checked><span><i>Month</i></span></label>
</div>
<button class="chip" type="button" aria-pressed="true">Cadet</button>
<label class="toggle"><input type="checkbox" checked><span class="tr"></span>Live timing</label>
<label class="check"><input type="checkbox">Email me new candidates</label>
<label class="radio"><input type="radio" name="r">Dry</label>
<input class="range" type="range" min="0" max="100" value="70" style="--v:70%">
<div class="stepper" role="group" aria-label="Laps"><button type="button">−</button><output>12</output><button type="button">+</button></div>
<span class="tag pos">Ready for F4</span> <span class="tag neg">Late</span> <span class="tag neu">Reserve</span>
```

- Checked, pressed and chosen states take the selected fill. The segmented control's fill slides under the choice
  when a script adds `.js` and a `<i class="segind">` positioned under the checked label.
- The slider's filled part is set with `--v` (percentage).

## Icon buttons

```html
<div class="bgroup" role="group" aria-label="Session tools">
  <button class="ibtn on" type="button" aria-label="Filter" aria-pressed="true"><svg viewBox="0 0 24 24">...</svg></button>
  <button class="ibtn" type="button" aria-label="Download"><svg viewBox="0 0 24 24">...</svg></button>
</div>
```

## Section headers and separators

```html
<div class="shead"><b>Lap times</b><small>Season 2026, 12 hubs</small></div>   <!-- the divider is drawn beneath -->
<p class="eyebrow">03 · Identity</p>                                         <!-- over a title -->
<hr class="fade">                                                            <!-- the divider on its own -->
<hr style="border:0;border-top:1px solid var(--sg-rule)">                    <!-- a plain hairline -->
```

- `.shead` opens every block: a 15 px SemiBold label, a quiet subtitle, and the divider under it, a grey hairline solid to
  83 % of its length, then fading. `hr.fade` is the same divider alone. It never closes a box.
- `.eyebrow` is 11 px SemiBold uppercase, tracked +0.2 em, in Steel. Uppercase is for eyebrows and card titles only.

## Identity

```html
<p class="strap">Maja is 0.18 s off the F4 cut and closing.</p>
<p class="strap light">Three hubs are over budget this month.</p>
<span class="itile"><svg viewBox="0 0 24 24">...</svg></span>
<span class="itile sm"><svg viewBox="0 0 24 24">...</svg></span>
<div class="ccard sg-dark">
  <span class="itile sm"><svg viewBox="0 0 24 24">...</svg></span>
  <span><b>Telemetry</b><small>Lap traces and sector deltas</small></span>
</div>
<ul class="sigs" aria-label="Strengths">
  <li class="sig pos">Braking</li><li class="sig pos">Consistency</li><li class="sig pos">Racecraft</li><li class="sig pos">Feedback</li>
</ul>
<div class="sg-surface sg-dark">...</div>
```

- `.strap` is the strapline: one sentence, one per view, dark on the signature surface; `.light` sets it in black on
  Cloud when the area above is already dense with dark cards.
- `.itile` seats one white icon in the signature surface (44 by 46 px, 10 px corners); `.sm` is 32 by 34 px.
- `.ccard` is the content card: an icon tile, an uppercase title and a Light caption on the signature surface.
- `.sigs` is a 2 by 2 block of signal chips: `.sig.pos` or `.sig.neg`, four of one tone. Green and red never share
  a block.
- `.sg-surface` applies the signature surface (the 45 degree gradient from #000 to #222A35) inside its 1 px edge
  light. Add `.sg-dark` so the contents take the dark theme.

## Scroll area

Native scrolling with a thin overlay thumb. The book's script (or the library's `ScrollArea`) writes
`--sa-y-size` and `--sa-y-pos`, sets `data-state="visible"` on hover or scroll and back to `hidden` after a moment.

```html
<div class="sg-scroll" data-state="hidden" style="height:320px">
  <div class="sg-scroll-viewport" data-axes="vertical">…content…</div>
  <div class="sg-scroll-bar sg-scroll-y" aria-hidden="true"><div class="sg-scroll-thumb"></div></div>
</div>
```

## Focus and accessibility

- Focus is a 2 px outline in the accent (Steel on light, Pale Blue on dark), 2 px out. Inputs turn their edge ink and
  add a Pale Blue halo instead.
- Icon-only buttons need `aria-label`; toggles and chips carry `aria-pressed` or native checked state.
- Respect `prefers-reduced-motion`: the stylesheet already removes transitions, the sliding indicators and the
  loader's motion.
