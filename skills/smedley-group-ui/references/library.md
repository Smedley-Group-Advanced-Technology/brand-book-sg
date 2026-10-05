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
  `"use client"`. A page only needs `"use client"` if the page itself holds state or handlers. The pure helpers
  (`parseCollectionState`, `serializeCollectionState`, `sortRows`, `pageRows`, `restore`, `serialise`, `panes`)
  come from modules without a directive, so a server component or a route handler can call them.
- `ToastProvider` must wrap the app once (in the root layout) before any screen calls `useToast()`.

## Which component for which job

Pick from this table before writing any markup. The left column is the need; use exactly the component named.

| The screen needs | Use | Not |
|---|---|---|
| The desk that holds the apps | `Desk` with a `DeskAppDefinition` per app | your own windows or tabs |
| An app taking part in drag and drop | `useDeskApp({ accepts, receive })` and `useLandingMark()` | reading `data-drag` yourself |
| The root of an app screen | `AppScreen` | a `div` with your own padding |
| The heading of a screen (title, context line, up to 3 controls) | `PageHeader` | a `Heading` and a flex row |
| A driver, venue, session or range of dates shown anywhere | `RecordChip` | plain text or a link |
| What a dropped record narrows the app to | `FilterBar` holding the `RecordChip` | a `Badge` next to the title |
| The invitation to drop a record | `Hint` | an `EmptyState` |
| An action | `Button` (`primary` once per view; `secondary` for the rest) | a styled `<a>` or `<div>` |
| Navigation that looks like a button | `ButtonLink` | `Button` with `onClick={() => router.push()}` |
| An icon-only action | `IconButton` with a `label` | `Button` with only an icon |
| Actions that belong together | `ButtonGroup` | a flex row of buttons |
| An irreversible action (delete, remove, revoke) | `HoldToConfirm`, or `ConfirmDialog` | a plain `Button`, or a `Dialog` you wire yourself |
| Any labelled input | `Field` wrapping `Input`, `Textarea`, `Select` or `DateInput` | a bare `<label>` and `<input>` |
| A number with a unit | `UnitInput` | `Input` plus a text suffix |
| A search box | `SearchField` (labelled, reports after typing pauses) | `Input` with a placeholder only |
| The row of search, chips and sorting above a collection | `CollectionToolbar` | a flex row of controls |
| The buttons at the end of a form | `FormActions` | a row of `Button`s |
| Read-only facts on a record | `FactList` | disabled inputs |
| The errors after a failed save | `ErrorSummary` at the top, plus `error` on each `Field` | an `Alert` listing them |
| Work that would be lost by leaving | `UnsavedChangesGuard when={dirty}` | `window.confirm` |
| A term explained beside a field's label | `Field tip="..."` | text in the label |
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
| Loading a whole screen (`loading.tsx`, Suspense) | `ScreenSkeleton` | a centred `Spinner` |
| A page that does not exist, may not be opened, or failed | `StatusPage` | an `Alert` on an empty page |
| The bar across the signed-in workspace | `WorkspaceBar` with `UserMenu` | your own header |
| Loading inside a button | `Button loading` | swapping the label for a spinner |
| A task with known progress | `Progress` or `LinearProgress value` | `Spinner` |
| A task with unknown progress | `LinearProgress` without `value`, or `Spinner` | a looping animation of your own |
| Nothing to show yet | `EmptyState` | an empty table |
| Rows of records that sort, select, open or carry drag keys | `DataTable` | `Table` with your own sorting and checkboxes |
| Acting on the selected rows | `BulkActionBar` | buttons that appear in the header |
| The count and pages under a collection | `PaginationBar` | `Pagination` with a count beside it |
| Search, sort, page and filters of a collection | `useCollectionState` (`url: true` on pages, off in desk apps) | several `useState`s |
| Static rows with columns (no sorting or selection) | `Table` | a grid of `div`s |
| A short list of records (up to about 12) | `List` | `Table` |
| Dated items | `Agenda` | `List` with dates in the title |
| History or milestones | `Timeline` | `List` |
| Headline numbers | `Metric` (with a trend) or `Stat` | a big `<b>` |
| Switching views of the same content | `Tabs` | `SegmentedControl` |
| Sections a person opens one by one (FAQ, advanced settings) | `Accordion` | `Tabs` |
| More actions behind one control | `Dropdown` (links and buttons) or `Menu` (menu items) | a custom popup |
| Explaining a term | `Tooltip` on the term, or `Tooltip icon="help"` / `"info"` beside it | the `title` attribute |
| Content that scrolls inside a fixed area | `ScrollArea` | `overflow: auto` |
| Where the person is | `Breadcrumbs` (pages) or `SideNavigation` (sections) | a row of links |
| Progress through a multi-step flow | `Steps` | numbered headings |
| Many pages of results | `Pagination` | "Load more" without a count |
| A group of content with a title | `Section` | a `Card` |
| Something a person picks up or opens (a download, a pinned item) | `Card` (dark, the signature surface) | `Section` |
| One idea with an icon, a title and a caption (an app, a capability) | `ContentCard` | a `Card` you lay out yourself |
| An icon that stands for an idea | `IconTile` | a loose `Icon` |
| The one conclusion of a view | `Strapline` (at most one per view) | a `Heading` or an `Alert` |
| Four strengths or four risks at a glance | `SignalChips` (one tone, 2 by 2) | `Badge`s in a row |
| A focused decision | `Dialog` | a new page |
| Space between items | `Stack` | margins on children |
| The page width and gutters | `Container` | fixed widths |

## Rules that apply to every component

- One `Button variant="primary"` per view. Everything else is `secondary`, or `text` for low-weight links.
- Every control has a visible label. `IconButton`, `Tooltip`, `ScrollArea` (when focusable), charts,
  `Table` and `DataTable` take the text that names them; always pass it. An icon `Tooltip` is named by its
  children ("About the performance index").
- `Field` connects the label, `hint` and `error` to the control through the render prop. Always spread the
  props it gives you onto the control: `{(props) => <Input {...props} />}`.
- Errors are sentences that say what is wrong and how to fix it, passed as `error` to `Field` (they show in
  the negative pair, #C00000 on #FBE5D6). Never show an error in any other colour.
- `id` is optional on `Field`, `SearchField`, `Select`, `Combobox`, `DateInput` and `FileDrop`: without one the
  control makes its own with `useId`, so the same app can be open in two windows. Pass one only where something
  else must link to the control (an `ErrorSummary` to its field). Any id you do pass, and option and tab ids,
  must be unique on the page and stable across renders.
- Dates in and out of components are local `YYYY-MM-DD` strings.
- Controlled components (`value` plus `onValueChange`) need both. Keep the state in the screen.
- Pass `className` only for layout (margins, grid placement, width). Never for colour, font, border or radius.
  The one exception: `className="mono"` on `Input` (tabular figures), for codes, phone numbers, licences and times.

## Records and drops

Back Office apps share one desk and hand records to each other by drag and drop (see `ux.md`). These are the
pieces an app needs to take part.

**Desk** `apps: DeskAppDefinition[]`, `initialApps?` (ids to open side by side on first use), `storageKey?`
(remembers the layout in this browser; include the person's id), `initialLayout?: string | null` (a saved
layout to start from, as `onLayoutChange` gave it; it wins over `storageKey`), `onLayoutChange?(layout: string)`
(after each settled change, to save the layout elsewhere, such as per person in the API), `onAppIntent?(appId)`
(when a person points at or focuses an app tile, a moment to prefetch its data), `homeApps?` (`{ person, venue,
session, range }`: the app id each record opens in on a gap), `resolveRecord?(type, id)` (the app's data,
passed as `record.rec`), `comingSoon?`, `label?` (default "Workspace"), `className?`. The whole of `ux.md`
Part A: Tile and Scroll, gaps, resizing, window bars and menus, the overview, narrow tabs under 760 px of desk
width, the A10 touch gestures, drag and drop and Send to. It fills its parent, which must have a height. A gap
that cannot make room for another 260 px window says "No room for another space here" and opens nothing.

For the application's own persistence the barrel also exports **restore**`(text, appIds)` (a saved layout as a
`DeskState`, or `null` for anything malformed; windows of an app that no longer exists become new spaces),
**serialise**`(state)` (the string `onLayoutChange` gives) and **panes**`(state)` (the windows in it, each
`{ id, app }`), plus the `DeskState` type. They have no client directive, so a route handler can validate a
layout before saving it.

**DeskAppDefinition** `{ id, name, owner, icon, description?, render() }`. `owner` is the business shown
quietly in the window bar ("Advanced Technology").

**useDeskApp** `({ accepts?(record), receive?(record) })`, called inside the app. `record` is `{ type, id,
name, context?, rec? }`; `accepts` returns `{ verb, icon }` or nothing. Each window registers separately,
and outside a `Desk` it does nothing, so the app also works as a page. **useLandingMark** returns a function
taking the changed element (or a function that finds it after the redraw) and draws the landing mark;
**markLanding**`(target)` is the same function outside a hook. **parseRange**`(id)` reads a range id
("2026-09-22..2026-09-28", either way round) as `{ id, from, to, days }`, or `null` when it is not one.

```tsx
function Booking() {
  const [driver, setDriver] = useState<string | null>(null);
  const mark = useLandingMark();
  const lead = useRef<HTMLDivElement>(null);
  useDeskApp({
    accepts: (r) => (r.type === "person" ? { verb: `Book a session for ${r.name.split(" ")[0]}`, icon: "calendar" } : null),
    receive: (r) => { setDriver(r.name); mark(() => lead.current); },
  });
  return <AppScreen>{/* ... */}<div ref={lead}>{/* the lead */}</div></AppScreen>;
}
```

**AppScreen** the root of every app. It fills its parent and is the container its layout measures, so the
app follows the width of its window, from a 260 px column to a full desk. It pads 24 px (16 px under
480 px) with 24 px between children. Never put a `Container` inside it.

**RecordChip** `type: "person" | "venue" | "session" | "range"`, `id` (ranges as
`"YYYY-MM-DD..YYYY-MM-DD"`), `name`, `context?` (one line: "FKL Łódź, cadet", "Heyford Park, Friday 26
September 2026, 16:00", "Oxfordshire, United Kingdom", "7 days, 18 sessions"), `large?` (in a record's
header), `onActivate?()`. It renders `data-drag="type:id"`, which the desk reads to make it draggable and to
give it the Send to menu. Inside a desk a click opens Send to, so leave `onActivate` unset there. It claims
`role="button"` only when it can act (inside a desk, or with `onActivate`); on a plain page without a handler
it is a focusable record that promises nothing. Every record an app
shows is a `RecordChip`, or a row carrying the same `data-drag` key (`DataTable rowDragKey`); a row without a
chip names its record with `data-drag-name` and `data-drag-context`.

**FilterBar** `label` (what the filter does: "Sessions in", "Drivers at", "Laps between"), children (the
dropped record, as a `RecordChip` so it can be picked up again), `onClear()`, `clearLabel?` (default "Clear
this filter"), shown as a quiet cross. One bar per filter; they stack. In an app under 400 px wide the
record takes its own line under the label.

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

**Button** `variant?: "primary" | "secondary" | "text" | "warning"` (default `primary`),
`size?: "small" | "medium" | "large"` (34, 44, 52 px; default `medium`), `loading?: boolean`, plus every
native button prop. `type` defaults to `"button"`; set `type="submit"` in forms. `primary` wears the selected
fill (the signature gradient with white type on light, Pale Blue with black type on dark), `secondary` a Steel
hairline, `text` a Pale Blue underline that turns to the accent on hover, and `warning` the negative pair
(#C00000 on #FBE5D6) for destructive confirmation.
While `loading` the button keeps its label and its focus and ignores presses (`aria-busy`, `aria-disabled`);
it is not `disabled`, so focus does not fall to the page while the work runs.

**ButtonLink** the same `variant` and `size`, plus every native `<a>` prop (`href`).

**IconButton** `icon: IconName`, `label: string` (the accessible name, required), plus native button props.
`aria-pressed` makes it a toggle.

**ButtonGroup** `label: string`. Buttons inside sit 8 px apart. Put the primary first.

**Chip** `pressed: boolean`, `onPressedChange(pressed)`, children as the label.

**HoldToConfirm** `label` (for example "Hold to remove driver"), `onConfirm()`, `onUndo?()`,
`doneLabel?` (default "Removed, tap to undo"), `armedLabel?` (default "Press again to confirm"), `disabled?`.
The person holds for 1.1 s; letting go early drains the fill and nothing happens. Assistive technology
cannot hold: a click that arrives without a press (a screen reader's activate, iOS double tap) arms the button
with `armedLabel` for four seconds, and a second such click confirms.

**Dropdown** `label` (the trigger text), `align?: "start" | "end"`, children: `<button>` and `<a>` elements,
`<hr />` between groups, `className="neg"` on a destructive one. The open panel is placed against the
viewport, so it is never clipped by a table or a window, and opens above when there is no room below.
Choosing an item or Escape closes it and puts focus back on the trigger.

**Menu** `label`, `items: { label, onSelect(), checked?, disabled?, warning?, shortcut? }[]`. Use `checked`
for a choice among items (sorting), `warning` for a destructive item.

## Forms

**Field** `id?` (generated with `useId` when left out), `label`, `hint?`, `error?`, `tip?` (a help mark beside
the label for a term the hint cannot carry), children as a render prop receiving `{ id, "aria-describedby",
"aria-invalid" }`.

```tsx
<Field id="driver-email" label="Email" hint="Where session reminders go." error={errors.email}>
  {(props) => <Input {...props} type="email" name="email" autoComplete="email" required />}
</Field>
```

**Input** every native input prop. **Textarea** every native textarea prop (2 rows by default).
**UnitInput** `unit: string` plus input props: `<UnitInput unit="bar" type="number" step=".01"
defaultValue="1.40" />`. With `type="number"` it has the brand's minus and plus instead of the browser's
spin arrows; holding repeats, decimals are kept and `min`/`max` hold.
**IconInput** `icon: IconName` plus input props.

**Select** (inside `Field`) `options: { value, label, description?, disabled? }[]`, `value: string | null`,
`onValueChange(value)`, `placeholder?` (default "Choose"), `name?` (submits with a form), `disabled?`,
`className?`, `id?` (from `Field`, or generated).

**Combobox** (has its own label; do not wrap in `Field`) `id?`, `label`, `hint?`, `error?`,
`options: { value, label, description?, disabled? }[]`, `value: string | null`,
`onValueChange(value | null)`, `placeholder?` (default "Search"), `emptyText?`, `disabled?`, `className?`.
Search ignores case and accents and also matches `description`. The clear cross is a tab stop of its own, and
Escape with the list closed clears the choice.

**DateInput** (inside `Field`) `value: string | null`, `onValueChange(value | null)`, `placeholder?`
(default "dd/mm/yyyy"), `disabled?`, `invalidText?`, `className?`, `id?` (from `Field`, or generated). Shows
"26 September 2026"; accepts 26/09/2026, 26-9-26, 2026-09-26 and 26 Sep 2026.

**FileDrop** (has its own label) `id?`, `label`, `files: File[]`, `onFilesChange(files)`, `icon?` (default
`upload`), `title?` (default "Drop a file here"), `action?` (default "choose a file"), `prompt?` (replaces the
whole "or choose a file" line), `hint?` (types and limits, for example "PDF or DOCX, up to 10 MB each"),
`dropText?` (default "Release to add the file"), `rejectText?(name)`, `accept?`, `multiple?`, `disabled?`.

**Checkbox** `label`, `indeterminate?`, native checkbox props. **Radio** `label`, native radio props.
**RadioGroup** `label` (the legend), children `Radio`s sharing a `name`.
**Switch** `label`, native checkbox props (`checked`, `onChange`).

**SegmentedControl** `label`, `value`, `onValueChange`, `options: { value, label, disabled? }[]`, `name?`.
**Slider** `label`, `value`, `onValueChange`, `min?`, `max?`, `step?`, `disabled?`.
**Stepper** `label`, `value`, `onValueChange`, `min?`, `max?`, `step?`, `disabled?`. At a bound the button that
can go no further disables, after moving focus to the other one.

**FormActions** `submitLabel` (what happens: "Save changes", "Add Maja to FKL Łódź"), `pending?`,
`disabled?`, `cancelHref?` or `onCancel?`, `cancelLabel?`
(default "Cancel"), `status?` (one short line: "Unsaved changes"). The submit is the view's primary.

**ErrorSummary** `errors: { id, message }[]` (the field ids), `title?`. It takes focus when errors arrive and
links to each field. Renders nothing without errors.

**FactList** `items: { label, value, measure? }[]`. Read-only facts, a quiet 12 px label above each value;
`measure` (tabular figures) for codes, licences and amounts. An empty value reads "Not set".

**UnsavedChangesGuard** `when` (the form is dirty), `title?`, `description?`, `leaveLabel?`, `stayLabel?`.
Asks before a tab close or a link discards the work. Navigation the screen starts itself is not
intercepted.

```tsx
<form onSubmit={save} noValidate>
  <UnsavedChangesGuard when={dirty} />
  <ErrorSummary errors={errors} />
  <Section title="Licence">
    <FactList items={[{ label: "Licence number", value: "PL-C-2026-0412", measure: true }]} />
  </Section>
  <FormActions submitLabel="Save changes" pending={saving} cancelHref="/drivers/mk" />
</form>
```

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
**LinearProgress** `label`, `value?` (omit for unknown progress).

**EmptyState** `title`, children (what will appear and why it is empty), `action?` (usually a `Button`).

**StatusPage** `code?` ("404", "403"), `title` (what happened), children (why, and how to continue),
`actions?`. For `not-found.tsx`, `error.tsx` and a page the person may not open. **ScreenSkeleton** `label`
(announced), `layout?: "collection" | "record"`, `rows?`. For `loading.tsx`.

## Navigation and overlays

**Tabs** `label`, `items: { id, label, content }[]`, `defaultValue?`, or controlled with `value` and
`onValueChange(id)` so a tab can be deep-linked or kept in `useCollectionState`. **Accordion**
`items: { id, title, content }[]`. **Breadcrumbs** `items: { label, href? }[]` (the last is the current page),
`linkAs?` (the app's router link, as on `WorkspaceBar`). **SideNavigation** `label`,
`items: { label, href, current?, count? }[]`. **Steps** `items: string[]`, `current` (zero-based; earlier steps
are announced as done, not only shown in colour). **Pagination** `page` (one-based), `pages`, `onPageChange(page)`;
Previous and Next move focus to the other arrow before disabling at an end.
**TabBar** (phone apps only) `label`, `value`, `onValueChange`, `items: { value, label, icon }[]`.

**Dialog** `open`, `onOpenChange(open)`, `title` (a question for decisions: "Remove from shortlist?"),
`description?` (the concrete effect), children, `footer?` (the buttons; the safe choice last, marked
`data-dialog-initial-focus`), `id?`, `className?`. A close it did not start reports through `onOpenChange(false)`;
keep `open` true and it shows again.

**ConfirmDialog** `open`, `onOpenChange`, `title` (the question), `description?`, `confirmLabel` ("Remove
driver"), `cancelLabel?`, `onConfirm()`, `tone?: "warning" | "primary"`, `pending?`, `error?`, `children?`.
The action comes first and the safe choice last with focus. If `onConfirm` returns a promise it stays busy and
cannot be dismissed, closes on success and shows the error on failure; a close the dialog did not start while
busy is undone by showing it again.

**Tooltip** `label` (a short note, one or two lines), `placement?: "top" | "bottom"`, `icon?: "help" |
"info"`, children (the trigger text, or with `icon` the mark's accessible name). The note is the signature
surface with 12 px text, up to 260 px wide; the trigger is ink text with a dotted rule in the accent. In a form use
`Field tip` rather than placing one yourself.
**Popover** `title`, children: a static explanation surface.

**ThemeSwitch** `onThemeChange?(theme)` (to remember the choice, for example in a cookie the server reads).
Place it once, in the app bar; on phones it may move into the `UserMenu`. Switches on one page stay in step.

**WorkspaceBar** `navigation: { label, href, current? }[]`, `actions?` (the `ThemeSwitch` and `UserMenu`),
`homeHref?`, `mainId?` (the skip link's target, default "main"), `linkAs?` (the app's router link for the logo
and destinations, so they navigate without a reload). The current destination is SemiBold ink with a 2 px rounded ink underline; on phones the
destinations take a second row. **UserMenu** `name`, `detail?` (the role), children (links,
and a sign-out form).

## Layout and content

**Container** the page width with gutters (32 px, 16 px on phones), at most 1200 px. Use it for pages
outside an app (sign-in, the catalogue); inside an app use `AppScreen`. **Stack** `gap?: 8 | 12 | 16 | 24 | 32`
(default 16), `direction?: "row" | "column"` (row wraps). **Section** `title`, `description?`, `actions?`
(buttons at the right of the heading), children, `id?`: it opens with the section header (the title, a quiet
description) and the divider beneath it, with space around.
**Card** an `<article>` on the signature surface with its edge light, carrying the dark theme for what sits inside,
for one thing a person picks up or opens. **Separator** `scale?` (the divider on its own: Pale Blue solid to 83 %
of its length, then fading; without `scale` a plain hairline).
**Heading** `level?: 1 | 2 | 3 | 4` (32, 15, 14, 13 px). **Text** `as?: "p" | "span"`, `muted?`, `measure?`
(SemiBold with tabular figures, for values). **Kbd** a key. **Avatar** `name`, `src?`, `size?: 32 | 36 | 40 | 48`.
**BrandLogo** the Smedley Group logo for the theme. **AppIcon** `size?`, `theme?`.

**Table** `caption` (required, names the table), children `<thead>`, `<tbody>` with native `<tr>`, `<th>`,
`<td>`. It scrolls sideways inside itself on narrow screens, and its scroll box is a tab stop only while it
actually overflows. For records that sort, select or open, use `DataTable`.

**List** `items: { id, title, description?, value?, leading? }[]` (leading defaults to an `Avatar`), rendered
as a `ul` of `li`.
**Agenda** `items: { id, date, title, description, status? }[]`. **Timeline**
`items: { title, description?, planned? }[]`.

**ScrollArea** `orientation?: "vertical" | "horizontal" | "both"`, `type?: "hover" | "scroll" | "always"`,
`label?` (makes it a focusable region; pass it when the content is not otherwise reachable by keyboard), and
a size through `style` or `className` (for example `style={{ height: 320 }}`).

**AppShell** `title`, `actions?`, `navigation`, children: a phone app frame. **BrowserFrame** and
**EmailPreview** are for showing designs inside the catalogue, not for product screens.

## Collections

The blocks of the Collection template (`layouts.md`, B). Filtering, sorting and fetching stay with the
screen; these show the result and report what the person asked for.

**PageHeader** `title`, `context?`, `actions?` (up to three), `breadcrumbs?: { label, href? }[]`.

**CollectionToolbar** `label?`, children: `SearchField` first, then `Chip`s and a sort `Menu` or `Dropdown`.
**SearchField** `id?`, `label`, `value`, `onValueChange`, `placeholder?`, `hint?`, `delay?` (250 ms).

**DataTable** `caption`, `columns: { key, header, cell(row), sortable?, numeric?, priority?: "high" |
"medium" | "low" }[]`, `rows` (already filtered, sorted and paged), `rowKey(row)`, `rowLabel(row)` (names the
row for its checkbox and actions), `sort?` and `onSortChange?`, `selected?: Set<string>` and
`onSelectedChange?`, `onRowActivate?(row)` (click or Enter opens the record), `rowActions?(row)` (one
`IconButton` or a `Dropdown align="end"`), `rowDragKey?(row)` ("person:mk"), `loading?`, `skeletonRows?` (5),
`empty?` (an `EmptyState` that replaces the table), `className?`. The first column is the record, as a
`RecordChip`. `low` columns hide under 800 px of app width; under 480 px the rows stack with the headers as
labels, `medium` columns kept as labelled rows, and the column header leaves the tab order, so offer sorting in
the toolbar too. **SortHeader** `label`, `sortKey`, `sort`, `onSortChange`, `numeric?` is its sortable header,
for a hand-built `Table`.

**BulkActionBar** `count`, `noun: { one, other }`, `onClear()`, children (the actions). Shown only while
rows are selected. **PaginationBar** `page`, `pageSize`, `total`, `noun`, `onPageChange` ("21 to 40 of 248
drivers").

**useCollectionState** `(defaults?, { url?, prefix?, initialSearch? })` returns `query`, `sort`, `page`,
`filters` and `setQuery`, `setSort`, `setPage`, `setFilter(name, value | null)`, `reset()`. Search, sort and
filter changes return to page 1. `url: true` keeps it in the address on pages
(`?q=maja&sort=-best&page=2&f.hub=lodz`); pass the page's `searchParams` (as a string) as `initialSearch` so the
server render and the hydration show the same page. Leave `url` off in desk apps, where each window keeps its
own. `reset()` returns to the defaults, default filters included, in both modes; clearing a filter with
`setFilter(name, null)` returns it to its default, or removes it when it has none. `sortRows(rows, sort, value)`
and `pageRows(rows, page, size)` handle short lists loaded whole; `parseCollectionState(search, defaults?)` and
`serializeCollectionState(state, defaults?)` read and write the same query string, on the server too.

```tsx
const state = useCollectionState({ sort: { key: "name", direction: "asc" } });
const rows = pageRows(sortRows(drivers, state.sort, (d, key) => d[key]), state.page, 20);
<PageHeader title="Driver pool" context="Season 2026, 248 drivers in 12 hubs" />
<CollectionToolbar>
  <SearchField id="driver-search" label="Search drivers" value={state.query} onValueChange={state.setQuery} />
</CollectionToolbar>
<DataTable caption="Drivers by best lap" columns={columns} rows={rows} rowKey={(d) => d.id}
  rowLabel={(d) => d.name} rowDragKey={(d) => `person:${d.id}`} sort={state.sort} onSortChange={state.setSort}
  onRowActivate={(d) => open(d.id)} empty={<EmptyState title="No drivers match">...</EmptyState>} />
<PaginationBar page={state.page} pageSize={20} total={drivers.length} noun={{ one: "driver", other: "drivers" }}
  onPageChange={state.setPage} />
```

## Identity

The book's own pieces. Each sits on the signature surface or its own tint; none takes colour props.

**IconTile** `name: IconName`, `size?: "small" | "medium"` (32 by 34 px with a 16 px icon, or 44 by 46 px with
24 px), `label?` (only when the tile alone carries meaning; without it the tile is hidden from assistive
technology). One white icon on the signature surface, 10 px corners. One icon per idea.

**ContentCard** `icon?: IconName`, `title` (set uppercase, 12 px SemiBold), `caption?` (Light, up to two lines),
plus native `div` props. An icon tile, the title and the caption on the signature surface; it carries the dark
theme. The desk's app tiles are content cards.

**Strapline** `tone?: "dark" | "light"` (default `dark`), children: one sentence that concludes the view, with no
punctuation beyond a full stop. At most one per view. `light` (black on Cloud) when the area above is already dense
with dark cards.

**SignalChips** `tone: "positive" | "negative"`, `items` (exactly four strings), `label` (names the block): short
bold labels on their own tint in a 2 by 2 grid. One tone per block; green and red never share one.

```tsx
<ContentCard icon="data-logger" title="Telemetry" caption="Lap traces and sector deltas for every session" />
<SignalChips tone="positive" label="Strengths" items={["Braking", "Consistency", "Racecraft", "Feedback"]} />
<Strapline>Maja is 0.18 s off the F4 cut and closing.</Strapline>
```

## Data and charts

Every chart takes a `label` that names it for screen readers; write it as the finding ("Sessions per week,
rising from 212 to 312"). Colours are fixed by the components: do not pass colours. Charts are monochrome: the
subject in the text colour, the reference in the accent, comparisons in Mist, and the one ramp (speed, temperature)
Pale Blue to Mist to Slate. Gains and losses are told by the numbers, never by green or red fills.

- **Metric** `label`, `value` (a formatted string), `change?: { label, positive }`, `values?` (a sparkline).
- **Stat** `label`, `value`, `unit?`. **Sparkline** `values`, `label`.
- **LineChart** `label`, `series: { label, values }[]` (the first is the subject), `labels` (x axis),
  `domain?`, `referenceValue?` (the line to beat, in the accent), `invert?` (lower is better, as for lap times),
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
  the booked bar), `today?`, `note?` (range calendars show the book's guiding note; `false` hides it). The grid
  follows `value` when the screen changes it; booked days and days inside the range say so in their labels.
- **WeekSchedule** `days: { label, date, today? }[]`, `events: { id, day, hour, duration, title, detail?,
  leading? }[]`, `startHour?`, `endHour?`, `onEventClick?`. `leading` marks the one event that leads (the selected fill).

## Icons

`Icon` `name: IconName`, `size?: 16 | 24 | 32 | 48` (default 24), `label?` (only when the icon alone carries
meaning). The names are the library's 134 icons, listed in `icons.md`; `iconNames` exports them all.
Inside buttons use 16. Never draw an inline SVG icon.

## When nothing fits

1. Compose existing components (a `Section` of `List`s, a `Card` holding a `Metric` and a `Button`).
2. Lay them out with `Stack`, `Container` and Tailwind layout utilities (`grid`, `grid-cols-*`, `gap-*`,
   `flex`, `min-w-0`) and the theme utilities `bg-background`, `text-foreground`, `text-muted`,
   `text-subtle`, `text-accent`, `text-warning`, `text-success`, `border-rule`, `font-sans`. There is no mono
   utility.
3. Only if a real control is missing, build it in `frontend/design-system/components` from the book's classes
   in `ui.css` and `extended.css` (see `components.md`), export it from `index.ts`, add it to the catalogue, and say so in your
   reply. Never build a one-off control inside a screen.
