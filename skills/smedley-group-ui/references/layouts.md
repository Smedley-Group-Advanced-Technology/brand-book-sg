# Layouts for Back Office screens

How to arrange a screen. Pick one template below, build it from `library.md`, and keep the order of its
regions. The brand book's rules apply throughout: the white ground, lines rather than boxes, one bold element
per view, calmer content around it, and only things you pick up drawn dark.

## Design for the window, not the device

Back Office apps share one desk (see `ux.md`): an app may fill the screen, share it, or sit in a column as
narrow as 260 px. So an app is laid out by **the width of its own window**:

- The root of every app is `AppScreen`. Inside it, respond to width with Tailwind container variants
  (`@min-[640px]:grid-cols-2`), never viewport breakpoints (`md:`, `lg:`).
- Pages that are not apps (sign-in, settings pages, the catalogue) use `Container` and may use viewport
  breakpoints.
- Test every app at 260, 320, 480, 800, 1200 and 1440 px.

| App width | Name | What changes |
|---|---|---|
| 260 to 479 px | narrow | one column; section actions drop under the heading; a `DataTable` hides its `medium` and `low` columns and stacks its rows (a plain `Table` becomes a `List`); `Metric`s two across; dialogs full width with stacked buttons |
| 480 to 799 px | half | two columns of supporting content; forms stay one column; a side column becomes a section below |
| 800 to 1199 px | wide | a main column with a 280 to 320 px side column; `Metric`s four across; forms may pair two short fields |
| 1200 px and over | desk | the same layout with more room; never stretch paragraphs past 76 characters |

Nothing scrolls sideways except inside a `Table`, a chart that says so, or a
`ScrollArea orientation="horizontal"`.

## The page shell

Pages outside the desk (the component library, the brand book, settings pages) share one shell:

| Part | Rule |
|---|---|
| Top bar | Sticky, edge to edge, 72 px (60 on phones), the white ground, a hairline at its foot. Its contents keep the page's container width and gutters, so the lockup lines up with the sidebar and content below |
| Lockup | Left in the bar, about 40 px high (34 on phones), linking back to the top |
| Bar tools | Right: a quiet 12 px label, the theme switch, and on phones the menu button |
| Progress | Optional: a 2 px ink line along the bar's foot, for long reading pages |
| Sidebar | About 220 px, sticky under the bar: the search field (40 px), then the chapters in a `ScrollArea` |
| Chapter list | Small tracked uppercase group labels (11 px SemiBold, Steel); items 13 px, 32 px tall, 8 px radius; the current one in the quiet tint and SemiBold; no numbers |
| Phones | The sidebar opens as a full panel under the bar from the menu button; items grow to 44 px |

## The measurements

Use only these.

| What | Value |
|---|---|
| Spacing steps | 4, 8, 12, 16, 24, 32, 48 px (`Stack gap` takes 8, 12, 16, 24, 32) |
| App padding | 24 px, 16 px under 480 px (`AppScreen` sets it) |
| Page gutter | 32 px, 16 px on phones (`Container` sets it); page width at most 1200 px |
| Between sections | 32 px, each opening with its section header and the fading divider (`Section` sets both) |
| Between a heading and its content | 16 to 24 px |
| Between fields in a form | 16 px; between groups of fields, a new `Section` |
| Form and reading width | at most 720 px |
| Control heights | 44 px default, 34 px small, 52 px large; never under 44 px on touch |
| Hairline | 1 px in the rule colour (black at 14 %; 28 % Pale Blue on dark) |
| Radii | controls 8 px, chips 6 px, tiles 10 px, cards and windows 12 px |
| Paragraph measure | at most 76 characters |
| Type | page title 32, figure 28, dialog title 20, section title 15, body 13, field label 12 SemiBold, help 12, caption 11 (the floor); measured values in tabular figures |

## The order of a screen

Top to bottom. Leave out what you do not need; never reorder.

```
AppScreen
├─ Heading + one muted line of context (period, count, place)      controls on the right (≤ 3)
├─ FilterBar × n ─── only while a dropped record narrows the view
├─ Hint ─── only while the app waits for a drop
├─ Metrics ─── 2 or 4 headline numbers, when the screen has them
├─ The lead ─── the one chart, table, list or form that answers the screen's question
├─ Sections ─── calmer supporting content, each opened by its section header and divider
└─ Strapline ─── at most one, the view's conclusion, when it needs one
```

- **Heading.** `PageHeader` with a noun `title` ("Driver pool") and a `context` line with the period, count or
  place ("Season 2026, 248 drivers in 12 hubs"). Controls on the right: a `SegmentedControl` for the period
  or view, a search, one action. They drop under the heading when narrow.
- **Metrics.** Two or four `Metric`s, never three, never more than four. Each has a unit; a change is green
  when good, negative red when not, as short bold text, never a fill.
- **The lead.** One per view, given the full main column. Lit by space, not boxed.
- **Sections.** `Section` with a noun title and, when useful, a one-line description, opened by the section
  header and its fading divider; space between them. `Card` (dark) only for something a person picks up or opens
  (a download, a pinned record).
- **Strapline.** One `Strapline` at most, the conclusion, not a caption that restates the title.

## Templates

### A. Overview

"How is it going": the group, a hub, a driver.

```
Heading   "Group overview" · "Week 39, 22 to 28 September 2026"          [Week|Month|Season]
Metrics   4 × Metric
Lead      LineChart (main column)                  │ side (wide+): List of the next 5
Sections  two smaller charts or lists, two across from 480 px
```

### B. Collection

Many records: drivers, venues, invoices, accounts.

```
PageHeader        "People" · "248 drivers in 12 hubs"                        [primary action]
CollectionToolbar SearchField · Chips for quick filters · sort Menu
FilterBar         (when a record was dropped)
BulkActionBar     (while rows are selected)
Lead              DataTable (it stacks its rows when narrow)
                  PaginationBar with the count
```

- State: `useCollectionState` (`url: true` on a page, off in a desk app).

- The first column is the record as a `RecordChip` (or its name with an `Avatar`), then attributes, status
  as a `Badge` last. Numbers right-aligned in tabular figures, with units.
- A row opens its record on click or Enter. Row actions: one `IconButton` or a `Dropdown align="end"` at the
  end of the row, never a row of buttons.
- No results: an `EmptyState`, passed as `DataTable empty`, that repeats the search and offers to clear it.
- Loading: `DataTable loading` inside the screen, `ScreenSkeleton` for the whole page.

### C. Record

One driver, one venue, one account.

```
Breadcrumbs  People / Maja Kowalczyk
Heading      RecordChip large · "Member, FKL Łódź"                    [Dropdown: more]
Tabs         Details · Sessions · Account · History
Lead         <form>, one column, max 720 px
               Section "Details"   Full name · Email · Hub (Select)
               Section "Licence"   Number (tabular) · Expires (DateInput)
             FormActions [Save changes] [Cancel]
```

- The form opens with `ErrorSummary` after a failed save and holds an `UnsavedChangesGuard` while dirty.

- Fields in one column; two short fields may share a row from 800 px, never three.
- Group fields in `Section`s of three to six, titled with a noun.
- Read-only facts are a `FactList`, never disabled inputs.
- Destructive actions sit apart from Save: in the header `Dropdown` or a last `Section`, confirmed with
  `HoldToConfirm` or a `ConfirmDialog`.

### D. Flow

A task with an end: add a driver, book a session, set up a hub.

```
Steps     Driver · Licence · Hub · Review
Heading   "Add a driver" · "Step 2 of 4, the licence"
Lead      the fields of this step, max 720 px
          [Continue] [Back]
```

- Up to four steps. One primary per step; the last says what happens ("Add Maja to FKL Łódź").
- The last step reviews every answer, each with a "Change" link. Going back keeps what was entered.

### E. Schedule

```
Heading   "Booking" · "Week 39, 22 to 28 September 2026"    [‹] [Today] [›]  [Week|Month]
Lead      WeekSchedule (wide, desk) or Agenda (narrow, half)
Side      Calendar (range), then the selected session
```

- The next or leading session is the one event in the selected fill (`leading`); booked time is the quiet
  tint with an accent bar.

### F. Analysis

```
Heading   "Telemetry" · "Maja Kowalczyk, best lap 58.412 s"          [lap Select]
Lead      TelemetryChart linked to TrackMap by one cursor state
Sections  sector table with gains green and losses negative red, as text
```

- The subject is the text colour, the reference the accent, comparisons Mist. The legend says so.

### G. Settings (a page, not an app)

```
Container  SideNavigation (wide) · Sections of Switches and Fields
```

- A `Switch` applies at once and confirms with a toast. A section that needs Save has buttons and no switches.

## Ideas that fit the brand

One per view, for the lead.

- **The pace to beat.** `LineChart` with `referenceValue`: the subject in the text colour, the target the
  accent line.
- **A number board.** One `Metric` alone as the lead, with a `Sparkline` of the season.
- **A podium for the top three.** `Podium` when only the first three matter.
- **Strengths and risks.** `SignalChips`, four of one tone, beside the record they describe.
- **Capabilities as cards.** A row of up to four `ContentCard`s, each one idea with its `IconTile`.
- **A conclusion.** One `Strapline` under the lead that says what it means.
- **Hold for the irreversible.** `HoldToConfirm` for a quick, final action.

## Never

- Two primary buttons in one view.
- Cards inside cards, a card around a whole screen, boxes around sections, dark surfaces for the working area.
- Two straplines, or a strapline that restates the title.
- A grid of equal cards with nothing leading.
- Three metrics, or more than four.
- Viewport breakpoints inside an app, or sideways scrolling of the whole screen.
- Actions that only appear on hover.
- Placeholder text as the only label, centred body text, text over a photo.
- A spinner in an empty area when the shape of the content is known (use `Skeleton`).
