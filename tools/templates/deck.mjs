// The slide template: layouts with real placeholders on the book's slide grid, a cover for each business,
// and worked example slides that show how to use them. Built by tools/templates/build.mjs.
import pptxgen from 'pptxgenjs';
import { join } from 'node:path';
import { BUSINESSES } from './images.mjs';

const C = { red: 'D8231A', blue: '2F80FF', line: '7FB2FF', lineInk: '1F66E0', bp: '0B2D63', ink: '0B0C0E', dimD: '9DA1A8', dimL: '585D65', rule: 'D9DADD', steel: '4A4F57', white: 'FFFFFF', black: '000000', green: '007A38', bpLine: '3E5F95', bpText: 'A9CCFF' };
const F = { semi: 'Sora SemiBold', reg: 'Sora', light: 'Sora Light', mono: 'IBM Plex Mono', monoM: 'IBM Plex Mono Medium' };
const M = 0.46, W = 10, H = 5.625, TW = W - 2 * M;

export async function buildDeck(img, sizes, out) {
  const I = f => join(img, f);
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';
  pres.author = 'Smedley Group'; pres.company = 'Smedley Group'; pres.title = 'Smedley Group presentation template';
  pres.theme = { headFontFace: F.semi, bodyFontFace: F.reg };

  // the scale rule: a red lead into a blue line, ticked every 0.4 in
  const rule = (y, dark, x = M, w = TW) => {
    const c = dark ? C.blue : C.lineInk;
    const o = [{ rect: { x, y, w, h: 0.01, fill: { color: c } } }, { rect: { x, y: y - 0.035, w: 0.53, h: 0.045, fill: { color: C.red } } }];
    for (let t = x; t < x + w; t += 0.4) o.push({ rect: { x: t, y: y - 0.07, w: 0.008, h: 0.07, fill: { color: c } } });
    return o;
  };
  // every slide after the cover carries the glyph, so one deck serves every business
  const glyph = dark => ({ image: { path: I(dark ? 'glyph-white.png' : 'glyph-ink.png'), x: M, y: 4.99, h: 0.36, w: 0.36 * sizes.glyph, altText: 'Smedley Group' } });
  const num = dark => ({ x: W - M - 0.8, y: 5.04, w: 0.8, h: 0.26, align: 'right', fontFace: F.mono, fontSize: 8, color: dark ? C.dimD : C.dimL });
  const ph = (name, type, o, text) => ({ placeholder: { options: Object.assign({ name, type, align: 'left', valign: 'top', margin: 0 }, o), text } });
  const title = (dark, o = {}) => ph('title', 'title', Object.assign({ x: M, y: 0.44, w: TW, h: 0.55, fontFace: F.semi, fontSize: 24, color: dark ? C.white : C.ink }, o), 'Slide title');

  // ---------- layouts ----------
  for (const b of BUSINESSES) pres.defineSlideMaster({ title: `Cover, ${b.name}`, background: { path: I(`cover-${b.lean}.png`) },
    objects: [{ image: { path: I(`${b.key}-white.png`), x: M, y: 0.44, h: 0.5, w: 0.5 * sizes[b.key], altText: `Smedley Group, ${b.name}` } },
      ph('title', 'title', { x: M, y: 1.55, w: 5.0, h: 1.9, fontFace: F.semi, fontSize: 40, color: C.white, valign: 'bottom' }, 'Presentation title'),
      ph('sub', 'body', { x: M, y: 3.6, w: 5.0, h: 0.7, fontFace: F.light, fontSize: 18, color: C.dimD }, 'Subtitle'),
      ...rule(4.62, true, M, 4.4),
      ph('meta', 'body', { x: M, y: 4.8, w: 4.4, h: 0.3, fontFace: F.mono, fontSize: 9, color: C.line }, 'Business, month year')] });

  pres.defineSlideMaster({ title: 'Agenda', background: { color: C.white },
    objects: [title(false), ...rule(1.2, false),
      ph('body', 'body', { x: M, y: 1.5, w: 6.4, h: 3.2, fontFace: F.reg, fontSize: 18, color: C.ink, lineSpacingMultiple: 1.25 }, 'Agenda items'), glyph(false)], slideNumber: num(false) });

  pres.defineSlideMaster({ title: 'Section', background: { color: C.black },
    objects: [{ image: { path: I('board-red.png'), x: M, y: 1.72, w: 0.95, h: 0.5 } },
      ph('no', 'body', { x: M, y: 1.72, w: 0.95, h: 0.5, fontFace: F.semi, fontSize: 20, color: C.white, align: 'center', valign: 'middle' }, '01'),
      ph('title', 'title', { x: M, y: 2.45, w: 8.4, h: 1.0, fontFace: F.semi, fontSize: 36, color: C.white }, 'Section title'),
      ...rule(4.6, true), glyph(true)], slideNumber: num(true) });

  for (const dark of [false, true]) pres.defineSlideMaster({ title: dark ? 'Title and content, dark' : 'Title and content', background: { color: dark ? C.black : C.white },
    objects: [title(dark), ph('body', 'body', { x: M, y: 1.12, w: TW, h: 3.5, fontFace: F.reg, fontSize: 12, color: dark ? C.white : C.ink }, 'Content'), glyph(dark)], slideNumber: num(dark) });

  pres.defineSlideMaster({ title: 'Two columns', background: { color: C.white },
    objects: [title(false),
      ph('left head', 'body', { x: M, y: 1.12, w: 4.4, h: 0.4, fontFace: F.semi, fontSize: 15, color: C.ink }, 'Left heading'),
      { line: { x: M, y: 1.58, w: 4.4, h: 0, line: { color: C.rule, width: 0.75 } } },
      ph('left', 'body', { x: M, y: 1.72, w: 4.4, h: 2.9, fontFace: F.reg, fontSize: 12, color: C.dimL }, 'Left column'),
      ph('right head', 'body', { x: M + 4.68, y: 1.12, w: 4.4, h: 0.4, fontFace: F.semi, fontSize: 15, color: C.ink }, 'Right heading'),
      { line: { x: M + 4.68, y: 1.58, w: 4.4, h: 0, line: { color: C.rule, width: 0.75 } } },
      ph('right', 'body', { x: M + 4.68, y: 1.72, w: 4.4, h: 2.9, fontFace: F.reg, fontSize: 12, color: C.dimL }, 'Right column'), glyph(false)], slideNumber: num(false) });

  pres.defineSlideMaster({ title: 'Statement and figure', background: { color: C.white },
    objects: [title(false),
      ph('body', 'body', { x: M, y: 1.12, w: 4.4, h: 3.3, fontFace: F.reg, fontSize: 14, color: C.ink }, 'The point, in a sentence or two'),
      ph('figure', 'body', { x: 5.6, y: 1.1, w: 3.94, h: 1.5, fontFace: F.semi, fontSize: 96, color: C.ink, valign: 'bottom', charSpacing: -3 }, '00'),
      ph('caption', 'body', { x: 5.65, y: 2.75, w: 3.8, h: 0.7, fontFace: F.reg, fontSize: 11, color: C.dimL }, 'What the figure measures'),
      { line: { x: 5.65, y: 3.6, w: 3.89, h: 0, line: { color: C.rule, width: 0.75 } } },
      ph('source', 'body', { x: 5.65, y: 3.7, w: 3.89, h: 0.3, fontFace: F.mono, fontSize: 8, color: C.dimL }, 'Source'), glyph(false)], slideNumber: num(false) });

  pres.defineSlideMaster({ title: 'Quote', background: { color: C.white },
    objects: [{ rect: { x: M, y: 1.28, w: 0.53, h: 0.045, fill: { color: C.red } } },
      ph('quote', 'body', { x: M, y: 1.5, w: 7.6, h: 2.2, fontFace: F.light, fontSize: 28, color: C.ink, lineSpacingMultiple: 1.1 }, 'Quote'),
      ph('who', 'body', { x: M, y: 3.9, w: 7.6, h: 0.5, fontFace: F.mono, fontSize: 10, color: C.dimL }, 'Name, role'), glyph(false)], slideNumber: num(false) });

  pres.defineSlideMaster({ title: 'Image and text', background: { color: C.white },
    objects: [title(false, { w: 4.2, h: 1.0 }),
      ph('body', 'body', { x: M, y: 1.6, w: 4.2, h: 2.9, fontFace: F.reg, fontSize: 12, color: C.dimL }, 'Text'),
      ph('picture', 'pic', { x: 5.0, y: 0, w: 5.0, h: H }, ''), glyph(false)] });

  pres.defineSlideMaster({ title: 'Blueprint', background: { path: I('grid.png') },
    objects: [title(true, { color: C.white }), glyph(true)], slideNumber: num(true) });

  pres.defineSlideMaster({ title: 'Closing', background: { color: C.black },
    objects: [{ image: { path: I('glyph-white.png'), x: M, y: 1.2, h: 0.9, w: 0.9 * sizes.glyph, altText: 'Smedley Group' } },
      ph('title', 'title', { x: M, y: 2.3, w: 8.4, h: 1.0, fontFace: F.semi, fontSize: 32, color: C.white }, 'Closing line'),
      ph('body', 'body', { x: M, y: 3.35, w: 8.4, h: 0.5, fontFace: F.mono, fontSize: 10, color: C.line }, 'Contact'), ...rule(4.6, true)] });

  // ---------- helpers for example content ----------
  const T = (s, text, o) => s.addText(text, Object.assign({ isTextBox: true, margin: 0, fontFace: F.reg, fontSize: 12, color: C.ink, valign: 'top' }, o));
  const board = (s, x, y, h, text, fill, color = C.white) => {
    s.addShape(pres.shapes.PARALLELOGRAM, { x, y, w: h * 2.1, h, fill: { color: fill }, flipH: true, line: { type: 'none' } });
    T(s, text, { x, y, w: h * 2.1, h, align: 'center', valign: 'middle', fontFace: F.semi, fontSize: Math.round(h * 36), color });
  };
  const hair = (s, x, y, w, color = C.rule) => s.addShape(pres.shapes.LINE, { x, y, w, h: 0, line: { color, width: 0.75 } });

  // 1 cover
  let s = pres.addSlide({ masterName: 'Cover, Smedley Group' });
  s.addText('Season review 2026', { placeholder: 'title' });
  s.addText('What the driver programme delivered, and what comes next', { placeholder: 'sub' });
  s.addText('Smedley Group, September 2026', { placeholder: 'meta' });
  s.addNotes('Cover. Pick the cover for the business presenting from Layout: Smedley Group, Advanced Technology, Insight Labs or FAT Racing. Each leans to its world. One title in sentence case, no full stop. FAT Karting League material uses the FKL brand and its own templates, not this deck.');

  // 2 agenda
  s = pres.addSlide({ masterName: 'Agenda' });
  s.addText('Today', { placeholder: 'title' });
  s.addText(['Where the season ended', 'What TalentID told us', 'The F4 shortlist', 'Next season'].flatMap((t, i) => [
    { text: String(i + 1).padStart(2, '0') + '   ', options: { fontFace: F.mono, fontSize: 14, color: i === 0 ? C.red : C.dimL } },
    { text: t, options: { breakLine: i < 3 } }]), { placeholder: 'body' });
  s.addNotes('Agenda. Four or five items, numbered in mono. The one you are on can go red when you reuse this slide between sections.');

  // 3 section
  s = pres.addSlide({ masterName: 'Section' });
  s.addText('01', { placeholder: 'no' }); s.addText('Where the season ended', { placeholder: 'title' });
  s.addNotes('Section divider. The red board carries the section number.');

  // 4 statement and figure
  s = pres.addSlide({ masterName: 'Statement and figure' });
  s.addText('One slide, one point: say it in the title', { placeholder: 'title' });
  s.addText([{ text: 'Lead with the conclusion. The reader should be able to stop after the title and still act.', options: { breakLine: true, paraSpaceAfter: 12 } },
    { text: 'Supporting points in plain sentences', options: { bullet: { indent: 14 }, breakLine: true, fontSize: 12, color: C.dimL } },
    { text: 'Numbers with units: 0.18 s, 57 %, 1,406 sessions', options: { bullet: { indent: 14 }, breakLine: true, fontSize: 12, color: C.dimL } },
    { text: 'Sentence case everywhere', options: { bullet: { indent: 14 }, fontSize: 12, color: C.dimL } }], { placeholder: 'body' });
  s.addText([{ text: '57' }, { text: ' %', options: { fontSize: 32, color: C.red } }], { placeholder: 'figure' });
  s.addText('of the way to F1: the one figure this slide is about', { placeholder: 'caption' });
  s.addText('Source: TalentID, season 2026', { placeholder: 'source' });
  s.addNotes('Statement and figure. One hero number per slide in Sora SemiBold, its unit in Race Red.');

  // 5 comparison
  s = pres.addSlide({ masterName: 'Two columns' });
  s.addText('TalentID replaces guesswork with laps', { placeholder: 'title' });
  s.addText('Before', { placeholder: 'left head' });
  s.addText(['Drivers picked on a single race weekend', 'Scouts in the paddock, notes on paper', 'No common measure across hubs'].map((t, i, a) => ({ text: t, options: { bullet: { indent: 14 }, breakLine: i < a.length - 1, paraSpaceAfter: 6 } })), { placeholder: 'left' });
  s.addText('With TalentID', { placeholder: 'right head' });
  s.addText(['Every lap of every session counts', 'Pace, consistency, racecraft and adaptability, scored', 'One index, comparable from Lagos to Łódź'].map((t, i, a) => ({ text: t, options: { bullet: { indent: 14 }, breakLine: i < a.length - 1, paraSpaceAfter: 6, color: C.ink } })), { placeholder: 'right' });
  s.addNotes('Two columns: comparisons, before and after, options. The column that wins is set in Ink; the other stays dim.');

  // 6 four columns
  s = pres.addSlide({ masterName: 'Title and content' });
  s.addText('The route from a hub to an F4 seat', { placeholder: 'title' });
  [['01', 'Hub trial', 'A first timed session at any FKL hub.'], ['02', 'League season', 'A full season with the index tracked every lap.'], ['03', 'F4 test day', 'An index above 85 earns a day in an F4 car.'], ['04', 'F4 seat', 'FAT Racing funds the season that follows.']]
    .forEach((c, i) => { const x = M + i * (2.05 + 0.27);
      board(s, x, 1.25, 0.3, c[0], i === 2 ? C.red : C.ink);
      T(s, c[1], { x, y: 1.8, w: 2.05, h: 0.4, fontFace: F.semi, fontSize: 15 });
      hair(s, x, 2.28, 2.05);
      T(s, c[2], { x, y: 2.4, w: 2.05, h: 1.0, fontSize: 11, color: C.dimL }); });
  s.addNotes('Four columns: 2.05 in wide with 0.27 in gutters. Boards are cut at 55 degrees; the one that matters goes red.');

  // 7 timeline
  s = pres.addSlide({ masterName: 'Title and content' });
  s.addText('Four steps to the 2027 grid', { placeholder: 'title' });
  const tl = [['Oct 2026', 'Shortlist', 'Twelve drivers above the F4 line.'], ['Dec 2026', 'Test days', 'Two days each at Silverstone.'], ['Feb 2027', 'Selection', 'Four seats, chosen on the index.'], ['Apr 2027', 'Season one', 'British F4 opener, Donington.']];
  const ty = 2.75, span = TW / tl.length;
  s.addShape(pres.shapes.RECTANGLE, { x: M, y: ty, w: TW, h: 0.01, fill: { color: C.lineInk }, line: { type: 'none' } });
  s.addShape(pres.shapes.RECTANGLE, { x: M, y: ty - 0.035, w: span * 0.5, h: 0.045, fill: { color: C.red }, line: { type: 'none' } });
  tl.forEach((m, i) => { const x = M + i * span;
    s.addShape(pres.shapes.RECTANGLE, { x, y: ty - 0.16, w: 0.012, h: 0.16, fill: { color: i === 0 ? C.red : C.lineInk }, line: { type: 'none' } });
    T(s, m[0], { x, y: ty - 0.5, w: span - 0.2, h: 0.3, fontFace: F.mono, fontSize: 10, color: i === 0 ? C.red : C.dimL });
    T(s, m[1], { x, y: ty + 0.2, w: span - 0.2, h: 0.4, fontFace: F.semi, fontSize: 15 });
    T(s, m[2], { x, y: ty + 0.62, w: span - 0.3, h: 0.8, fontSize: 11, color: C.dimL }); });
  s.addNotes('Timeline on the scale rule. The red lead marks where we are now; everything ahead runs on in blue.');

  // 8 chart
  s = pres.addSlide({ masterName: 'Title and content' });
  s.addText('Maja is closing on the F4 entry line', { placeholder: 'title' });
  const lab = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10', 'S11', 'S12'];
  s.addChart(pres.charts.LINE, [
    { name: 'Maja Kowalczyk', labels: lab, values: [.62, .55, .51, .44, .47, .38, .35, .31, .28, .24, .22, .18] },
    { name: 'Class reference', labels: lab, values: [.6, .58, .57, .55, .55, .53, .52, .51, .5, .49, .49, .48] },
    { name: 'F4 entry', labels: lab, values: Array(12).fill(.3) }],
    { x: M, y: 1.12, w: 6.2, h: 3.4, chartColors: [C.red, C.steel, C.blue], lineSize: 2, lineDataSymbol: 'none',
      catAxisLabelFontFace: F.mono, valAxisLabelFontFace: F.mono, catAxisLabelFontSize: 8, valAxisLabelFontSize: 8, catAxisLabelColor: C.dimL, valAxisLabelColor: C.dimL,
      valAxisLabelFormatCode: '+0.00"s"', valAxisMinVal: 0, valAxisMaxVal: 0.7, valAxisMajorUnit: 0.35, valGridLine: { color: 'E6E7EA', size: 0.5 }, catGridLine: { style: 'none' },
      catAxisLineColor: C.rule, valAxisLineShow: false, showLegend: true, legendPos: 'b', legendFontFace: F.reg, legendFontSize: 9, legendColor: C.dimL,
      showTitle: false, altText: 'Line chart: gap to the class reference over 12 sessions, falling from 0.62 s to 0.18 s, below the F4 entry line of 0.30 s' });
  T(s, '+0.18 s', { x: 7.0, y: 1.3, w: 2.5, h: 0.6, fontFace: F.monoM, fontSize: 28 });
  T(s, 'gap to the class reference after 12 sessions, down from +0.62 s', { x: 7.0, y: 1.95, w: 2.5, h: 0.8, fontSize: 11, color: C.dimL });
  s.addNotes('Charts: the subject in Race Red, comparisons in Steel, the line to beat in Engineering Blue. Mono for ticks and readouts. The chart is native: right-click, Edit data.');

  // 9 table
  s = pres.addSlide({ masterName: 'Title and content' });
  s.addText('Qualifying, cadet class, round 7', { placeholder: 'title' });
  const bd = [{ type: 'none' }, { type: 'none' }, { pt: 0.75, color: C.rule }, { type: 'none' }];
  const hd = { fontFace: F.mono, fontSize: 8, color: C.dimL, border: bd };
  const cell = (t, o) => ({ text: t, options: Object.assign({ fontFace: F.mono, fontSize: 11, color: C.ink, border: bd }, o) });
  const R = { align: 'right' };
  s.addTable([
    ['Pos', 'Driver', 'Best', 'Gap', 'S1', 'S2', 'S3'].map((t, i) => ({ text: t, options: Object.assign({ align: i > 1 ? 'right' : 'left' }, hd) })),
    [cell('1', { bold: true, color: C.red }), cell('Maja Kowalczyk', { fontFace: F.reg }), cell('1:02.418', R), cell('Leader', R), cell('20.904', R), cell('20.771', { ...R, color: C.green }), cell('20.743', R)],
    [cell('2'), cell('Leo Hartmann', { fontFace: F.reg }), cell('1:02.521', R), cell('+0.103', R), cell('20.951', R), cell('20.868', R), cell('20.702', { ...R, color: C.green })],
    [cell('3'), cell('Aarav Mehta', { fontFace: F.reg }), cell('1:02.977', R), cell('+0.559', R), cell('20.887', { ...R, color: C.green }), cell('21.101', R), cell('20.989', R)]],
    { x: M, y: 1.2, w: TW, colW: [0.6, 2.9, 1.2, 1.0, 1.1, 1.1, 1.18], rowH: 0.42, valign: 'middle', margin: [0, 0.05, 0, 0.05] });
  T(s, 'The leader in red. The fastest time in each sector is the only green on the slide.', { x: M, y: 3.3, w: 6, h: 0.4, fontSize: 10, color: C.dimL });
  s.addNotes('Tables: hairlines, no boxes. Times in mono, names in Sora.');

  // 10 image
  s = pres.addSlide({ masterName: 'Image and text' });
  s.addText('Trackside, the brand at full size', { placeholder: 'title' });
  s.addText('Kerbs at 55°, barrier boards alternating the lockup and the glyph. Pictures run to the edge of the slide; text never sits on them.', { placeholder: 'body' });
  s.addImage({ path: join(img, 'example-trackside.jpg'), placeholder: 'picture', sizing: { type: 'cover', w: 5.0, h: H }, altText: 'Concept image: trackside kerbs at 55 degrees and barrier boards carrying the Smedley Group lockup' });
  s.addNotes('Image and text. Click the picture, then Change picture: it fills the right half and crops to fit. Use real photography where you have it.');

  // 11 quote
  s = pres.addSlide({ masterName: 'Quote' });
  s.addText('“The index told us what the stopwatch never could: who gets faster when it matters.”', { placeholder: 'quote' });
  s.addText('Head of driver development, FAT Racing', { placeholder: 'who' });
  s.addNotes('Quote. Real words from a real person, attributed by name and role. Keep it under 25 words.');

  // 12 blueprint
  s = pres.addSlide({ masterName: 'Blueprint' });
  s.addText('The glyph is built on one module', { placeholder: 'title' });
  s.addImage({ path: join(img, 'blueprint.png'), x: M, y: 1.12, h: 3.2, w: 3.2 * 0.867, altText: 'Construction drawing of the glyph: three bars at 55 degrees on a 23.75 unit module' });
  [['Module', '23.75'], ['Long bar, F4', '71.3 × 14.2, three modules'], ['Short bars', '47.7 × 14.2, two modules'], ['Lean', '55°']].forEach((r, i) => {
    const y = 1.3 + i * 0.5;
    hair(s, 4.2, y - 0.08, 5.3, C.bpLine);
    T(s, r[0], { x: 4.2, y, w: 1.8, h: 0.35, fontFace: F.semi, fontSize: 11, color: C.white });
    T(s, r[1], { x: 6.1, y, w: 3.4, h: 0.35, fontFace: F.mono, fontSize: 11, color: C.bpText }); });
  s.addNotes('Blueprint layout for drawings, setup sheets and anything built to a dimension. Line work in white and light blue; never red type on blue.');

  // 13 dark figure with strapline band
  s = pres.addSlide({ masterName: 'Title and content, dark' });
  s.addText('A dark slide for moments that need weight', { placeholder: 'title' });
  s.addText('Dark slides open and close a deck, or frame a single figure. Keep them rare, so they still mean something.', { placeholder: 'body' });
  T(s, '12', { x: M, y: 2.2, w: 2, h: 1.1, fontFace: F.semi, fontSize: 72, color: C.white });
  T(s, 'drivers ready for F4 this season', { x: 2.1, y: 2.75, w: 3, h: 0.5, fontSize: 11, color: C.dimD });
  s.addShape(pres.shapes.RECTANGLE, { x: 0, y: 4.37, w: W, h: 0.45, fill: { color: C.white }, line: { type: 'none' } });
  T(s, 'Strapline band: the conclusion in one sentence', { x: M, y: 4.37, w: TW, h: 0.45, align: 'center', valign: 'middle', fontFace: F.semi, fontSize: 13 });
  s.addNotes('Strapline band: optional, full bleed at 4.37 in, 0.45 in tall. It states the conclusion, never restates the title.');

  // 14 closing
  s = pres.addSlide({ masterName: 'Closing' });
  s.addText('Four seats, chosen on the index.', { placeholder: 'title' });
  s.addText('name@smedleygroup.com', { placeholder: 'body' });
  s.addNotes('Closing. End on the point, in one sentence. Replace the contact line with the presenter.');

  // 15 to 17: the other covers, to pick from
  for (const b of BUSINESSES.slice(1)) {
    s = pres.addSlide({ masterName: `Cover, ${b.name}` });
    s.addText({ 'advanced-technology': 'Telemetry platform, phase two', 'insight-labs': 'Fan engagement, season insights', 'fat-racing': '2027 F4 driver line-up' }[b.key], { placeholder: 'title' });
    s.addText({ 'advanced-technology': 'Hardware and software for the 2027 season', 'insight-labs': 'What the simulation says about the title race', 'fat-racing': 'Four drivers promoted from the league' }[b.key], { placeholder: 'sub' });
    s.addText(`${b.name}, September 2026`, { placeholder: 'meta' });
    s.addNotes(`${b.name} cover. ${b.lean === 'blue' ? 'Engineering leans blue: more grid, a small red cut.' : 'Racing leans red: the red cut leads, the grid follows.'} Delete the covers you do not use.`);
  }

  await pres.writeFile({ fileName: out });
}
