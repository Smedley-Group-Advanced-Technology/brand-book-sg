# UX: window management and drag and drop

How Back Office apps share one desk and hand records to each other. These two behaviours are the Back
Office user experience; every app is built to take part in them.

Part A is what the shell does. Part B is what every app must do to take part. Part C lists the exact values,
for anyone building or changing the shell itself.

# Part A. Window management

## A1. The desk

- The desk holds **spaces**. A space is one window showing one app. Two windows of the same app may be open
  at once, each with its own state.
- The windows form a tree of splits: a split lays its children side by side (`row`) or stacked (`col`), each
  with a share (`fr`). A window is never narrower or shorter than **260 px**.
- An empty space shows "What goes here?" with the line "Pick an app for this space. Hover any gap to open
  another." ("Tap any gap for its +" on touch) and a grid of every app. Picking one fills it.
- With no windows the desk shows the launcher: "Good to see you. Where to?", the app grid, and what is coming.

## A2. Gaps and the +

- Windows sit with a **12 px gap** around them (16 px on touch). Every gap is live: along the desk edges and
  between windows.
- Hovering a gap widens it to **120 px** at once, shows a blue 55° hatch and a 48 px **+** that grows in
  (red while hovered). It closes 140 ms after the pointer leaves.
- Keyboard: every gap is a button ("Open a new space here"); focus opens it, Enter or Space inserts.
- Touch: the first tap opens a gap ("Tap the + to open a new space here"), the second inserts. The right edge
  shows a faint + at rest.
- **Inserting in Tile:** at an edge gap the new space goes on that side, at the average share of its row or
  column. Between two windows it takes one third of their combined room, half from each.
- **Inserting in Scroll:** a new column half the desk wide, after the gap; nothing else resizes. The gap under
  a column stacks a new space into it.
- A new window grows out of the gap that opened it while the others make room.

## A3. Resizing

- Drag the gap between two windows to share the room differently. The drag starts after **5 px** along the
  gap's axis; both sides stay at least 260 px. No snapping while dragging.
- In Scroll, dragging the gap after a column sets that column's width; the columns to its right move along.
- Presets are the column width button in the bar, the window menu, and Alt R: **1/3, 1/2, 2/3, Full**.

## A4. Two layouts

- **Tile** shares the desk between every window.
- **Scroll** puts windows in columns on a strip that grows to the right.
  Opening another adds a column beside the one in focus and nothing is squeezed; the view scrolls to show it.
  The strip moves with a sideways trackpad swipe, Shift and the wheel, the wheel over the ground, or the mini
  map in the top bar (press or drag to centre that point). Focus follows: the least scroll that shows the
  focused column whole.
- Switching Tile to Scroll turns the top row into columns (a stacked split becomes a stacked column), keeping
  shares where it can. Scroll is off on screens under 760 px.

## A5. Focus

- Pressing inside a window focuses it (a finger focuses on release, unless it was part of a gesture). The
  focused window shows a **36 × 3 px red lead** at its top left and a stronger rule.
- The space in focus decides where "Apps" and "Open in a new space" insert: beside it, on its right.

## A6. The window bar

- 44 px tall (52 px on touch): the app's icon, its name (13 px semibold), its owner in mono ("Advanced
  Technology"), and three buttons: **Column width** (Scroll only), **Swap app** (the window becomes an empty
  space to choose again), **Close**.
- **Drag the bar** (or tap and hold it on touch) onto another window and the two swap places: "Swap places with
  {name}". Sizes stay with the positions.
- The **window menu** (right-click the bar, hold and release, or Shift F10 in the bar): "Swap places with" each
  other window, the column width presets (Scroll), Swap app, Overview, and Close (in yellow).
- Closing: the window fades behind the others as they slide in; focus goes to its neighbour. "Window closed".

## A7. Overview

- Every space at once, scaled to fit: the whole desk in Tile, the whole strip in Scroll, a grid of cards on a
  phone. Open with the Overview button, Alt O, a pinch, or three fingers up; leave with Escape, a spread,
  three fingers down, or by choosing a window.
- Inside it a window is one target: tap to go to it, or drag its bar onto another to swap them.

## A8. Narrow screens (under 760 px)

- One window at a time, inset 12 px, with a **tab for each space** at the bottom and a red **+** tab to add
  one. The incoming space slides in 24 px from its tab's side.
- Swipe along the tabs, across a window's bar, or with two fingers to change space. Menus become bottom sheets.

## A9. Keys

| Keys | Does |
|---|---|
| Alt O | the overview, and back (Escape also leaves) |
| Alt ← → | the column to the left or right (Scroll) |
| Alt ↑ ↓ | the window above or below, in a stacked column |
| Alt Shift ← → | moves the column |
| Alt R | cycles the column width: 1/3, 1/2, 2/3, Full |
| Alt F | full width, and back |
| Alt C | centres the column |
| Enter or Space on a gap | opens a new space there |
| Shift F10 or the menu key | the Send to menu on a record, the window menu on a bar |
| Escape | closes the innermost menu; during a drag, puts the record back |

## A10. Touch gestures

| Gesture | Does |
|---|---|
| Tap | everything a click does; on a gap, the first tap opens it, the second opens a space |
| Tap and hold, 0.45 s | a record or a window's bar lifts (a red rule fills while you hold, with a short vibration); move to carry it, or let go for its menu. Moving 10 px before the hold fires cancels it and scrolls |
| Two fingers sideways | in Scroll the strip follows the fingers, glides on with a flick and settles on a column; elsewhere, the next space |
| Pinch in, spread out | the overview, following the fingers; it commits past 40 %, or on a flick |
| Two- or three-finger tap | the Apps sheet |
| Three fingers sideways | the next or previous space |
| Three fingers up or down | the overview, and back |
| One finger across a window's bar (phone) | the next or previous space |

Three-finger gestures stand down while a field is being typed in. No gesture starts during a drag, a menu, the
Apps sheet or the tour.

## A11. What is remembered

The layout (the tree, the focus, the mode, the strip position) is saved on every change and restored on load.
The overview and hover state are not.

# Part B. Drag and drop, and what an app must do

## B1. Records

- A **record** is a driver, a venue, a session or a range of dates. Anything that shows a record can be picked
  up and dropped into any app, and every app says what it would do with it.
- Records keep one look everywhere: `RecordChip` (in `library.md`). People on red initials, sessions on a blue
  stopwatch, venues on an ink pin, dates on a grey calendar, then the name and one mono line of context.
- A record is identified by its drag key: `person:{id}`, `venue:{id}`, `session:{id}`, or
  `range:YYYY-MM-DD..YYYY-MM-DD`. Window bars use `window:{id}`.

## B2. Picking up

- **Mouse or pen:** the drag starts after the pointer moves **6 px**.
- **Touch:** a `RecordChip` lifts at once. Anything else that carries a record (a table row, a list row, an
  event) needs a **0.45 s hold**, so a swipe still scrolls the list.
- Presses on inputs, selects, textareas and on buttons in the window bar never start a drag.
- While dragging, the source dims to 40 %, the cursor is a closed hand, and a **ghost** of the record follows
  the pointer 14 px below and right (flipping near the edges). Its bottom rule turns red and runs full width
  over anything that will take it. "Picked up {name}. Drop it on an app, or on a gap for a new space."

## B3. Every app says what it would do

- As a drag starts, every other window shows an overlay below its bar: a blue 55° hatch, the app's icon, and
  the **verb**, what the app would do with this record ("See Maja’s laps"), with the app's name below.
- Under the pointer the overlay goes **hot**: a 2 px red outline, the icon red and a little larger.
- An app that has nothing for the record says so: "Nothing for a driver here" (a session, a venue, these dates).
- **Gaps are targets too:** hovering one opens it with "{Home app} in a new space": People for a person,
  Venues for a venue, Booking for a session, the Calendar for dates. An empty space offers "Open in {Home app}".
- Near the edge of the strip (56 px) the desk scrolls towards the pointer; near the top or bottom of a list
  (48 px) the list scrolls.

## B4. Dropping

| Dropped on | Result |
|---|---|
| a window that takes it | the app receives it, the window takes focus, and the changed region shows the landing mark: "{verb}: done, in {App}" |
| a gap | a new space opens there with the home app, grown from the gap, and receives it |
| a phone tab | that space comes forward and receives it |
| anywhere else, or its own window | nothing; the ghost flies back to where it came from |
| Escape during the drag | the same: "Put back" |

The ghost flies into its target (0.2 s, ease-in, shrinking) or back to its source (0.3 s, braking).

## B5. Nothing needs a drag (WCAG 2.2, 2.5.7)

Everything a drag does also works with one tap or key, through the **Send to** menu:

- It opens on a click, Enter or Space on a `RecordChip`, a right-click or Shift F10 or the menu key on anything
  that carries a record, or a touch hold released without moving.
- It lists the record, then "Send to" and one item per open window with its verb and app name (disabled, "Nothing
  for this here", if it cannot take it), and last "Open in a new space" ("{Home}, beside the space in focus").
- Up and down move through the items and wrap, Tab is trapped, Escape closes, and focus returns to the record.
  On a desk it opens beside the record; on a phone it is a bottom sheet.
- Window bars have the same through the window menu (A6).

## B6. Dates

- In the Calendar, press a day and drag across others to mark a range (on touch, hold a day 0.38 s and slide).
  Or pick a start and an end day; Shift and click extends.
- Marked days, and the range chip beside them, are a record: drag them onto any app to filter it to those dates.

## B7. What every app must do

The shell (windows, gaps, drag and drop, Send to) is the library's `Desk`, and the signed-in home page is a desk.
An app takes part by calling `useDeskApp({ accepts, receive })` inside itself (the React form of
`el._office = { accepts(record), receive(record) }`) and marking what changed with `useLandingMark()`.
`record` is `{ type, id, name, context?, rec? }`; `rec` is the app's data from the desk's `resolveRecord`, or
`{ id, from, to, days }` for a range. See `library.md`, Records and drops.

1. **Show every record as a `RecordChip`**, or as a focusable row carrying the same `data-drag` key
   (`DataTable rowDragKey`, with `data-drag-name` and `data-drag-context` when the row has no chip).
2. **Say what it would do.** Register with the shell an `accepts(record)` that returns `{ verb, icon }` for
   every record type the app can act on, and nothing for the rest. It runs for every window as a drag starts,
   so keep it quick and without side effects.
3. **Write the verb** as an imperative that names the record, without a full stop: people by first name, a
   range appended after a comma. "Book a session for Maja", "See the week at Heyford Park", "Pin Cadet
   qualifying to the dashboard", "See what was invoiced, 22 Sep to 28 Sep", "Open Maja’s record".
4. **Receive it.** `receive(record)` changes the app's state, redraws, and marks the region that changed with the
   landing mark (a red bar drawing across its top and fading over 1.1 s), scrolled into view.
5. **Show a dropped range as a `FilterBar`**, with the range as a `RecordChip` that can be picked up again and a
   cross that clears it. Never filter silently. One bar per filter.
6. **Invite drops while waiting** with a `Hint` that names what to drop and what it will do. Remove it once
   something has been dropped.
7. **Follow the window's width.** Build the app in `AppScreen` and lay it out for any width from 260 px.
8. **Keep state per window**, because the same app can be open twice and each copy receives its own drops.
   Use `useCollectionState` without `url` inside apps.
9. **Leave the shell's keys and gestures alone:** never bind Alt with the arrows, Alt O, Alt R, Alt F, Alt C,
   Shift F10, the menu key or Escape; never cancel pointer presses on records unless the app handles the
   gesture itself (as the Calendar does for marking days); never put a drag key on an input.

# Part C. Exact values, for the shell

| Thing | Value |
|---|---|
| Gap at rest, on touch, open | 12 px, 16 px, 120 px; hit area 4 px (8 px on touch) beyond the gap |
| Gap close delay | 140 ms |
| The + | 48 px, stroke 1.1; opacity 0 → 1 over 0.2 s, scale 0.5 → 1 over 0.38 s braking; faint at rest on touch (0.4, scale 0.42) |
| Narrowest window | 260 px |
| Resize threshold | 5 px |
| Column width presets | 1/3, 1/2, 2/3, Full; new columns 1/2 |
| Window bar | 44 px (52 on touch); buttons 32 px (40 on touch); focus lead 36 × 3 px red |
| Window moves and resizes | 0.38 s `cubic-bezier(.16, 1, .3, 1)`; overview transform 0.42 s |
| New window | fades in 0.3 s, content 0.34 s after 0.12 s, grown from the gap or tile |
| Closing window | 0.17 s `cubic-bezier(.5, 0, 1, 1)` to opacity 0 and scale 0.97, behind the others |
| Swapped app | fades in 0.24 s |
| Narrow screen | under 760 px; window inset 12 px; tabs 40 px (48 on touch); slide 24 px over 0.34 s |
| Drag threshold, mouse | 6 px |
| Touch hold | 0.45 s (Calendar days 0.38 s); cancelled by 10 px of movement; 12 ms vibration |
| Ghost | offset 14 px; at most 300 px wide; arrives 0.22 s from scale 0.85 |
| Drop overlay | from 44 px below the window's top; fades in 0.25 s; hot outline 2 px red; icon 34 px, scaled 1.12 when hot |
| Auto-scroll | 56 px from the strip's edge, 48 px from a list's edge; a third of the distance per frame |
| Ghost flight | to target 0.2 s ease-in to scale 0.6; back 0.3 s braking |
| Overlays leave | 0.15 s ease-in |
| Landing mark | 3 px red bar, 1.1 s braking |
| Send to menu | at most 340 px wide; items at least 48 px; arrives 0.4 s; closes 0.14 s; phone bottom sheet at most 78 % high |
| Gestures | mode decided after 12 px of movement or 8 % of scale; flicks at 0.45 px per ms; overview commits past 40 %; swipes commit past 25 % of the width |
| Reduced motion | every animation above removed; the end state shows at once |
| Live announcements | every action above is announced politely: "Picked up …", "{verb}: done, in {App}", "Put back", "Window closed", "{A} and {B} swapped places", "Column width 1/2" |
