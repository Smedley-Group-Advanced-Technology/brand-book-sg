# The book's controls

Link the fonts and `ui.css` (and the tokens if you need the `--sg-*` names), then use these classes. Themes follow `data-theme="dark"` or `"light"` on `<html>`, or the reader's system setting.

```html
<link rel="stylesheet" href="fonts/fonts.css">
<link rel="stylesheet" href="ui.css">
```

## Buttons

```html
<button class="btn p" type="button">Add to F4 shortlist</button>
<button class="btn g" type="button">Open sessions</button>
<a class="btn t" href="#">Read the specs</a>
<button class="btn p lg" type="button">Download the brand kit</button>
<button class="btn g sm" type="button">Replace</button>
```

- `.p` primary (Race Red, white type), `.g` ghost, `.t` text link with a red lead underline.
- Heights: `.sm` 34 px, default 44 px, `.lg` 52 px. The 55° cut follows the height.
- An icon leads the label: `<svg class="bi" viewBox="0 0 24 24">...</svg>`, 16 px, 8 px gap.
- The click streak needs a small script: on click add the `flash` class and set `--bw` to the button width plus 20 px; remove `flash` on `animationend` of `streak`.

## Button group

```html
<div class="bgroup" role="group" aria-label="Save">
  <button class="btn p" type="button">Download PNG</button><button class="btn g" type="button">Copy</button>
</div>
```

Buttons that belong together touch: their cuts run parallel 3 px apart.

## Inputs

```html
<div class="field">
  <label class="lab" for="name">Driver</label>
  <input class="inp" id="name">
  <span class="help">As it appears on the licence</span>
</div>
<div class="field err">...</div>            <!-- the help turns yellow -->
<div class="unit"><input class="inp mono" value="1.40"><span>bar</span></div>
<div class="inpicon"><svg viewBox="0 0 24 24">...</svg><input class="inp" type="search"></div>
<select class="inp">...</select>
```

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

- The segmented control's red indicator slides under the choice when a script adds `.js` and a `<i class="segind">` positioned under the checked label.
- The slider's filled part is set with `--v` (percentage).

## Icon buttons

```html
<div class="bgroup" role="group" aria-label="Session tools">
  <button class="ibtn on" type="button" aria-label="Filter" aria-pressed="true"><svg viewBox="0 0 24 24">...</svg></button>
  <button class="ibtn" type="button" aria-label="Download"><svg viewBox="0 0 24 24">...</svg></button>
</div>
```

## Separators

```html
<hr style="border:0;border-top:.75px solid var(--rule)">   <!-- a hairline between sections -->
<div class="finish" aria-hidden="true"><div class="chq"></div></div>   <!-- the checker: the end -->
```

The checker is a separator on its own. Do not put a hairline or border above or below it; the element before it drops its bottom border. Chequers mark a finish only.

## Focus and accessibility

- Buttons show an inset ring on keyboard focus; inputs switch their brackets and rule to blue.
- Icon-only buttons need `aria-label`; toggles and chips carry `aria-pressed` or native checked state.
- Respect `prefers-reduced-motion`: the stylesheet already removes the wipes and streaks.
