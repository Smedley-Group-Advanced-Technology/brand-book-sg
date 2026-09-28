# The Back Office component library

The brand book in React. Every Back Office screen is built from it. This file is the complete public API:
if something is not listed here, it does not exist, so do not import it and do not invent props.

## Where it is and how to import it

- It lives in the `back-office` repository at `frontend/design-system`. Its catalogue runs at `/design-system`
  in that app (`npm run dev` in `frontend`), with a live example and the code of every component.
- Import from the barrel only, with the `@/` alias:

  ```tsx
  import { Button, Field, Input, Section, Select, useToast } from "@/design-system";
  ```

  Never import from `@/design-system/components/...`, never copy a component's markup into a screen, never
  restyle a component with your own CSS. If a component almost fits, use its props; if none fits, see
  "When nothing fits" at the end.
- The stylesheet is already loaded by `app/globals.css`. Do not link `ui.css`, fonts or tokens again.
- Stack: Next.js (App Router), React 19, TypeScript, Tailwind CSS 4. No other UI library is installed and none
  may be added: no Radix, shadcn, MUI, Headless UI, date, chart, icon or class-merging packages.
- Server and client: primitives and form wrappers work in server components. Stateful widgets already carry
  `"use client"`. A page only needs `"use client"` if the page itself holds state or handlers.
- `ToastProvider` must wrap the app once (in the root layout) before any screen calls `useToast()`.

## Which component for which job

Pick from this table before writing any markup. The left column is the need; use exactly the component named.

| The screen needs | Use | Not |
|---|---|---|
| The root of an app screen | `AppScreen` | a `div` with your own padding |
| A driver, venue, session or range of dates shown anywhere | `RecordChip` | plain text or a link |
| What a dropped record narrows the app to | `FilterBar` holding the `RecordChip` | a `Badge` next to the title |
| The invitation to drop a record | `Hint` | an `EmptyState` |
| An action | `Button` (`primary` once per view; `secondary` for the rest) | a styled `<a>` or `<div>` |
| Navigation that looks like a button | `ButtonLink` | `Button` with `onClick={() => router.push()}` |
| An icon-only action | `IconButton` with a `label` | `Button` with only an icon |
| Actions that belong together | `ButtonGroup` | a flex row of buttons |
| An irreversible action (delete, remove, revoke) | `HoldToConfirm`, or `Dialog` with a `warning` button | a plain `Button` |
| Any labelled input | `Field` wrapping `Input`, `Textarea`, `Select` or `DateInput` | a bare `<label>` and `<input>` |
| A number with a unit | `UnitInput` | `Input` plus a text suffix |
| A search box | `IconInput icon="search"` with `type="search"` | `Input` with a placeholder only |
| One choice from 2 to 5 short options, always visible | `SegmentedControl` | `Select` |
| One choice from 6 to about 15 options | `Select` | `RadioGroup` |
| One choice from a long or searchable list (people, venues) | `Combobox` | `Select` |
| One choice where every option needs explanation | `RadioGroup` of `Radio` | `Select` |
| On or off that applies at once | `Switch` | `Checkbox` |
| Agreeing, or several independent options in a form | `Checkbox` | `Switch` |
| Filters that toggle | `Chip` | `Checkbox` |
| A date | `DateInput` (or `Calendar` when the month is the content) | `<input type="date">` |
| A date range | `Calendar` with `end` and `onRangeChange` | two `DateInput`s |
| A whole number within bounds (laps, seats) | `Stepper` | `Input type="number"` |
| A value on a continuous scale | `Slider` | `Input type="number"` |
| Files | `FileDrop` | `<input type="file">` |
| A status word next to an item | `Badge` (`success`, `warning`, `neutral`, `info`) | coloured text |
| A live state with a dot (online, idle) | `Status` | `Badge` |
| A message about the page or a form | `Alert` | a coloured `<p>` |
| A passing confirmation ("Saved") | `useToast()` | `Alert` |
| An unread count | `CountBadge` | `Badge` |
| Loading a region | `Skeleton` in the shape of the content | `Spinner` over a blank area |
| Loading inside a button | `Button loading` | swapping the label for a spinner |
| A task with known progress | `Progress` or `LinearProgress value` | `Spinner` |
| A task with unknown progress | `LinearProgress` without `value`, or `Spinner` | a looping animation of your own |
| Nothing to show yet | `EmptyState` | an empty table |
| Rows of records with columns | `Table` | a grid of `div`s |
| A short list of records (up to about 12) | `List` | `Table` |
| Dated items | `Agenda` | `List` with dates in the title |
| History or milestones | `Timeline` | `List` |
| Headline numbers | `Metric` (with a trend) or `Stat` | a big `<b>` |
| Switching views of the same content | `Tabs` | `SegmentedControl` |
| Sections a person opens one by one (FAQ, advanced settings) | `Accordion` | `Tabs` |
| More actions behind one control | `Dropdown` (links and buttons) or `Menu` (menu items) | a custom popup |
| Explaining a term | `Tooltip` | the `title` attribute |
| Content that scrolls inside a fixed area | `ScrollArea` | `overflow: auto` |
| Where the person is | `Breadcrumbs` (pages) or `SideNavigation` (sections) | a row of links |
| Progress through a multi-step flow | `Steps` | numbered headings |
| Many pages of results | `Pagination` | "Load more" without a count |
| A group of content with a title | `Section` | a `Card` |
| Something a person picks up or opens (a download, a pinned item) | `Card` | `Section` |
| A focused decision | `Dialog` | a new page |
| Space between items | `Stack` | margins on children |
| The page width and gutters | `Container` | fixed widths |
| The end of a page | `FinishSeparator` | a hairline |

## Rules that apply to every component

- One `Button variant="primary"` per view. Everything else is `secondary`, or `text` for low-weight links.
- Every control has a visible label. `IconButton`, `Tooltip`, `ScrollArea` (when focusable), charts and
  `Table` take the text that names them; always pass it.
- `Field` connects the label, `hint` and `error` to the control through the render prop. Always spread the
  props it gives you onto the control: `{(props) => <Input {...props} />}`.
- Errors are sentences that say what is wrong and how to fix it, passed as `error` to `Field` (they show in
  yellow). Never colour anything red to mean wrong.
- IDs you pass (`id` on `Field`, `Combobox`, `Select`, `DateInput`, `FileDrop`; option and tab ids) must be
  unique on the page and stable across renders.
- Dates in and out of components are local `YYYY-MM-DD` strings.
- Controlled components (`value` plus `onValueChange`) need both. Keep the state in the screen.
- Pass `className` only for layout (margins, grid placement, width). Never for colour, font, border or radius.
  The one exception: `className="mono"` on `Input`, for codes, phone numbers, licences and times.

## Records and drops

Back Office apps share one desk and hand records to each other by drag and drop (see `ux.md`). These are the
pieces an app needs to take part.

**AppScreen** the root of every app. It fills its parent and is the container its layout measures, so the
app follows the width of its window, from a 260 px column to a full desk. It pads 24 px (16 px under
480 px) with 24 px between children. Never put a `Container` inside it.

**RecordChip** `type: "person" | "venue" | "session" | "range"`, `id` (ranges as
`"YYYY-MM-DD..YYYY-MM-DD"`), `name`, `context?` (one line: "FKL Łódź, cadet", "Heyford Park, Fri 26 Sep,
16:00", "Oxfordshire, United Kingdom", "7 days, 18 sessions"), `large?` (in a record's header),
`onActivate?()`. It renders `data-drag="type:id"`, which the shell reads to make it draggable and to give it
the Send to menu. Every record an app shows is a `RecordChip`, or a row carrying the same `data-drag` key.

**FilterBar** `label` (what the filter does: "Sessions in", "Drivers at", "Laps between"), children (the
dropped record, as a `RecordChip` so it can be picked up again), `onClear()`, `clearLabel?` (default "Clear
this filter"). One bar per filter; they stack.

**Hint** `icon?` (default `drag`), children: what to drop and what it will do ("Drag a driver here for their
account, a venue for its books, or a range of dates from the Calendar."). Remove it once something has been
dropped.

```tsx
<AppScreen>
  {range ? (
    <FilterBar label="Sessions in" onClear={() => setRange(null)}>
      <RecordChip type="range" id={range.id} name={range.label} context={range.summary} />
    </FilterBar>
  ) : (
    <Hint>Drag a range of dates here to see only those sessions.</Hint>
  )}
  {/* the app's content */}
</AppScreen>
```

## Actions

**Button** `variant?: "primary" | "secondary" | "text" | "engineering" | "warning"` (default `primary`),
`size?: "small" | "medium" | "large"` (34, 44, 52 px; default `medium`), `loading?: boolean`, plus every
native button prop. `type` defaults to `"button"`; set `type="submit"` in forms. `engineering` is the blue fill
for the lead action in an Engineering context; `warning` is the yellow action for destructive confirmation.
While `loading` the button is disabled and keeps its label.

**ButtonLink** the same `variant` and `size`, plus every native `<a>` prop (`href`).

**IconButton** `icon: IconName`, `label: string` (the accessible name, required), plus native button props.
`aria-pressed` makes it a toggle.

**ButtonGroup** `label: string`. Buttons inside touch, their cuts parallel. Put the primary first.

**Chip** `pressed: boolean`, `onPressedChange(pressed)`, children as the label.

**HoldToConfirm** `label` (for example "Hold to remove driver"), `onConfirm()`, `onUndo?()`,
`doneLabel?` (default "Removed, tap to undo"), `disabled?`. The person holds for 1.1 s; letting go early
drains the fill and nothing happens.

**StartLights** `label?` (default "Start session"), `onStart()`, `onReset?()`. Only for starting something
live (a session, a timer).

**Dropdown** `label` (the trigger text), `align?: "start" | "end"`, children: `<button>` and `<a>` elements,
`<hr />` between groups, `className="neg"` on a destructive one.

**Menu** `label`, `items: { label, onSelect(), checked?, disabled?, warning?, shortcut? }[]`. Use `checked`
for a choice among items (sorting), `warning` for a destructive item.

## Forms

**Field** `id`, `label`, `hint?`, `error?`, children as a render prop receiving
`{ id, "aria-describedby", "aria-invalid" }`.

```tsx
<Field id="driver-email" label="Email" hint="Where session reminders go." error={errors.email}>
  {(props) => <Input {...props} type="email" name="email" autoComplete="email" required />}
</Field>
```

**Input** every native input prop. **Textarea** every native textarea prop (2 rows by default).
**UnitInput** `unit: string` plus input props: `<UnitInput unit="bar" defaultValue="1.40" />`.
**IconInput** `icon: IconName` plus input props.

**Select** (inside `Field`) `options: { value, label, description?, disabled? }[]`, `value: string | null`,
`onValueChange(value)`, `placeholder?` (default "Choose"), `name?` (submits with a form), `disabled?`.

**Combobox** (has its own label; do not wrap in `Field`) `id`, `label`, `hint?`, `error?`,
`options: { value, label, description?, disabled? }[]`, `value: string | null`,
`onValueChange(value | null)`, `placeholder?` (default "Search"), `emptyText?`, `disabled?`. Search ignores
case and accents and also matches `description`.

**DateInput** (inside `Field`) `value: string | null`, `onValueChange(value | null)`, `placeholder?`
(default "dd/mm/yyyy"), `disabled?`, `invalidText?`. Shows "26 September 2026"; accepts 26/09/2026,
26-9-26, 2026-09-26 and 26 Sep 2026.

**FileDrop** (has its own label) `id`, `label`, `files: File[]`, `onFilesChange(files)`, `icon?` (default
`upload`), `title?` (default "Drop a file here"), `action?` (default "choose a file"), `prompt?` (replaces the
whole "or choose a file" line), `hint?` (types and limits, for example "PDF or DOCX, up to 10 MB each"),
`dropText?` (default "Release to add the file"), `rejectText?(name)`, `accept?`, `multiple?`, `disabled?`.

**Checkbox** `label`, `indeterminate?`, native checkbox props. **Radio** `label`, native radio props.
**RadioGroup** `label` (the legend), children `Radio`s sharing a `name`.
**Switch** `label`, native checkbox props (`checked`, `onChange`).

**SegmentedControl** `label`, `value`, `onValueChange`, `options: { value, label, disabled? }[]`, `name?`.
**Slider** `label`, `value`, `onValueChange`, `min?`, `max?`, `step?`, `disabled?`.
**Stepper** `label`, `value`, `onValueChange`, `min?`, `max?`, `step?`, `disabled?`.

## Feedback

**Alert** `title` (required, the point), children (the detail and the fix), `tone?: "info" | "success" |
"warning"`, `dismissible?`, `onDismiss?`.

**useToast()** returns `notify(message, tone?, action?)`; `tone` is `"info" | "success" | "warning"`,
`action` is `{ label, onClick }` (for example Undo). Success and info leave after 6 s, warnings stay.

```tsx
const notify = useToast();
notify("Session archived", "info", { label: "Undo", onClick: restore });
```

**Badge** `tone?: "neutral" | "success" | "warning" | "info"`, children. **Status** `tone?: "success" |
"warning" | "neutral"`, children. **CountBadge** children (the number).

**Spinner** `label?` (default "Loading"; pass `""` only inside a button). **Skeleton** size it with
`className` (for example `className="h-4 w-2/3"`). **Progress** `value`, `max?`, `label`.
**LinearProgress** `label`, `value?` (omit for unknown progress). **KerbProgress** `label`, `value`,
`limitStart`, `max?`, `valueLabel?`: a value against a limit band.

**EmptyState** `title`, children (what will appear and why it is empty), `action?` (usually a `Button`).

## Navigation and overlays

**Tabs** `label`, `items: { id, label, content }[]`, `defaultValue?`. **Accordion**
`items: { id, title, content }[]`. **Breadcrumbs** `items: { label, href? }[]` (the last is the current page).
**SideNavigation** `label`, `items: { label, href, current?, count? }[]`. **Steps** `items: string[]`,
`current` (zero-based). **Pagination** `page` (one-based), `pages`, `onPageChange(page)`.
**TabBar** (phone apps only) `label`, `value`, `onValueChange`, `items: { value, label, icon }[]`.

**Dialog** `open`, `onOpenChange(open)`, `title` (a question for decisions: "Remove from shortlist?"),
`description?` (the concrete effect), children, `footer?` (the buttons; the safe choice last).

**Tooltip** `label` (one short line), `placement?: "top" | "bottom"`, children (the trigger text).
**Popover** `title`, children: a static explanation surface.

**ThemeSwitch** no props. Place it once, in the app bar.

## Layout and content

**Container** the page width with gutters (32 px, 16 px on phones), at most 1200 px. Use it for pages
outside an app (sign-in, the catalogue); inside an app use `AppScreen`. **Stack** `gap?: 8 | 12 | 16 | 24 | 32`
(default 16), `direction?: "row" | "column"` (row wraps). **Section** `title`, `description?`, `actions?`
(buttons at the right of the heading), children, `id?`: a hairline above, space around.
**Card** an `<article>` with a hairline border, for one thing a person picks up or opens. **Separator** `scale?` (the red-into-blue scale rule for a
section opener). **FinishSeparator** the checker: the last thing before the footer, nothing next to it.
**Heading** `level?: 1 | 2 | 3 | 4` (34, 14, 14, 13 px). **Text** `as?: "p" | "span"`, `muted?`, `measure?`
(IBM Plex Mono, for values). **Kbd** a key. **Avatar** `name`, `src?`, `size?: 32 | 36 | 40 | 48`.
**BrandLogo** the Smedley Group logo for the theme. **AppIcon** `size?`, `theme?`.

**Table** `caption` (required, names the table), children `<thead>`, `<tbody>` with native `<tr>`, `<th>`,
`<td>`. It scrolls sideways inside itself on narrow screens. Sorting and filtering live in the screen.

**List** `items: { id, title, description?, value?, leading? }[]` (leading defaults to an `Avatar`).
**Agenda** `items: { id, date, title, description, status? }[]`. **Timeline**
`items: { title, description?, planned? }[]`.

**ScrollArea** `orientation?: "vertical" | "horizontal" | "both"`, `type?: "hover" | "scroll" | "always"`,
`label?` (makes it a focusable region; pass it when the content is not otherwise reachable by keyboard), and
a size through `style` or `className` (for example `style={{ height: 320 }}`).

**AppShell** `title`, `actions?`, `navigation`, children: a phone app frame. **BrowserFrame** and
**EmailPreview** are for showing designs inside the catalogue, not for product screens.

## Data and charts

Every chart takes a `label` that names it for screen readers; write it as the finding ("Sessions per week,
rising from 212 to 312"). Colours are fixed by the components: do not pass colours.

- **Metric** `label`, `value` (a formatted string), `change?: { label, positive }`, `values?` (a sparkline).
- **Stat** `label`, `value`, `unit?`. **Sparkline** `values`, `label`.
- **LineChart** `label`, `series: { label, values }[]` (the first is the subject), `labels` (x axis),
  `domain?`, `referenceValue?` (the blue line to beat), `invert?` (lower is better, as for lap times),
  `formatValue?`.
- **BarChart**, **ActivityChart** `label`, `data: { label, value }[]`, `max?`. **DivergingChart** `data`,
  `scale?`: gains and losses around zero. **RingChart** `data`, `center?`, `unit?`: parts of a whole, up to 4.
  **RadarChart** `data`, `max?`, `reference?`. **Podium** `data` (the top three). **DistributionChart**
  `data`, `density?`, `reference?`, `subject?`. **ScatterChart** `points: { x, y, subject? }[]`,
  `reference?`, `band?`.
- **TelemetryChart** `label`, `labels`, `channels: { label, subject, reference? }[]`, `cursor?`,
  `onCursorChange?`. **TrackMap** `label`, `points: { x, y }[]`, `speeds?`, `cursor?`, `onCursorChange?`.
  Share one `cursor` state between them to link the views.
- **Calendar** `value`, `onValueChange`, `end?` and `onRangeChange?` (for ranges), `events?` (dates that get
  the booked bar), `today?`, `note?` (range calendars show the book's guiding note; `false` hides it).
- **WeekSchedule** `days: { label, date, today? }[]`, `events: { id, day, hour, duration, title, detail?,
  leading? }[]`, `startHour?`, `endHour?`, `onEventClick?`. `leading` marks the one event that leads (red).

## Icons

`Icon` `name: IconName`, `size?: 16 | 24 | 32 | 48` (default 24), `label?` (only when the icon alone carries
meaning). The names are the library's 134 icons, listed in `icons.md`; `iconNames` exports them all.
Inside buttons use 16. Never draw an inline SVG icon.

## When nothing fits

1. Compose existing components (a `Section` of `List`s, a `Card` holding a `Metric` and a `Button`).
2. Lay them out with `Stack`, `Container` and Tailwind layout utilities (`grid`, `grid-cols-*`, `gap-*`,
   `flex`, `min-w-0`) and the theme utilities `bg-background`, `text-foreground`, `text-muted`,
   `text-subtle`, `text-reference`, `text-warning`, `text-success`, `border-rule`, `font-sans`, `font-mono`.
3. Only if a real control is missing, build it in `frontend/design-system/components` from the book's classes
   in `ui.css` (see `components.md`), export it from `index.ts`, add it to the catalogue, and say so in your
   reply. Never build a one-off control inside a screen.
