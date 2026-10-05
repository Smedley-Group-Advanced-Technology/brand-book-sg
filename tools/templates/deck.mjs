// The slide template, built to the brand book's slide system (the TalentID deck): 10 x 5.625 in, the Canvas on every
// content slide, the title at 0.44 in, a four-column grid, the strapline band full bleed at 4.37 in and the logo
// fixed bottom left at 0.50, 4.96 in. Layouts with real placeholders, a cover for each business and worked slides.
// Built by tools/templates/build.mjs, which swaps the SURF fill for the 45 degree signature gradient and the EDGE line
// for the edge light (pptxgenjs cannot write gradients); if that step is skipped the solid fallbacks stand.
import pptxgen from 'pptxgenjs';
import { join } from 'node:path';
import { BUSINESSES } from './images.mjs';

export const SURF = '111820', EDGE = 'ABC0E5'; // sentinels: the signature surface and its edge light
const C = { ink: '000000', navy: '222A35', slate: '333F50', steel: '44546A', mist: '8497B0', pale: 'ABC0E4', cloud: 'D6DCE5', canvas: 'F0F0F0', white: 'FFFFFF', caption: '9AA0A8',
  pos: '007A3D', posT: 'E2F0D9', neg: 'C00000', negT: 'FBE5D6' };
const F = { semi: 'Sora SemiBold', reg: 'Sora', light: 'Sora Light' };
const M = 0.46, W = 10, H = 5.625, TW = W - 2 * M, COLS = [0.46, 2.78, 5.10, 7.42], CW = 2.05;
const BAND_Y = 4.37, BAND_H = 0.45, LOGO = { x: 0.5, y: 4.96, h: 0.44 };

export async function buildDeck(img, sizes, out) {
  const I = f => join(img, f);
  const pres = new pptxgen();
  pres.layout = 'LAYOUT_16x9';
  pres.author = 'Smedley Group'; pres.company = 'Smedley Group'; pres.title = 'Smedley Group presentation template';
  pres.theme = { headFontFace: F.semi, bodyFontFace: F.reg };

  // the logo: same size, same corner, every content slide
  const logo = (tone = 'ink') => ({ image: { path: I(`smedley-group-${tone}.png`), x: LOGO.x, y: LOGO.y, h: LOGO.h, w: LOGO.h * sizes['smedley-group'], altText: 'Smedley Group' } });
  const num = { x: W - M - 0.8, y: 5.06, w: 0.8, h: 0.24, align: 'right', fontFace: F.semi, fontSize: 8, color: C.steel };
  const ph = (name, type, o, text) => ({ placeholder: { options: Object.assign({ name, type, align: 'left', valign: 'top', margin: 0 }, o), text } });
  const title = (o = {}) => ph('title', 'title', Object.assign({ x: M, y: 0.44, w: TW, h: 0.55, fontFace: F.semi, fontSize: 28, charSpacing: -0.68, color: C.ink }, o), 'Slide title in sentence case');
  // the divider: Pale Blue hairline (the fade is drawn in the book; a solid hairline in the deck)
  const rule = (x, y, w) => ({ line: { x, y, w, h: 0, line: { color: C.pale, width: 0.75 } } });
  // the strapline band: full bleed, the conclusion in one sentence
  const band = [{ rect: { x: 0, y: BAND_Y, w: W, h: BAND_H, fill: { color: SURF } } }];
  const bandText = ph('band', 'body', { x: M, y: BAND_Y, w: TW, h: BAND_H, align: 'center', valign: 'middle', fontFace: F.semi, fontSize: 16, color: C.white }, 'The conclusion, in one sentence');
  const canvas = { color: C.canvas };

  // ---------- layouts ----------
  for (const b of BUSINESSES) pres.defineSlideMaster({ title: `Cover, ${b.name}`, background: { color: SURF },
    objects: [{ image: { path: I(`${b.key}-white.png`), x: LOGO.x, y: 0.5, h: LOGO.h, w: LOGO.h * sizes[b.key], altText: `Smedley Group, ${b.name}` } },
      ph('eyebrow', 'body', { x: M, y: 1.95, w: 6, h: 0.3, fontFace: F.semi, fontSize: 9, charSpacing: 2, color: C.pale }, 'EYEBROW'),
      ph('title', 'title', { x: M, y: 2.25, w: 6.6, h: 0.75, fontFace: F.semi, fontSize: 34.2, charSpacing: -0.68, color: C.white, valign: 'bottom' }, 'Presentation title'),
      ph('sub', 'body', { x: M, y: 3.0, w: 6.6, h: 0.65, fontFace: F.light, fontSize: 34.2, charSpacing: -0.68, color: C.pale }, 'Second line'),
      { rect: { x: M, y: 3.9, w: 2.6, h: 0.012, fill: { color: C.pale } } },
      ph('meta', 'body', { x: M, y: 4.98, w: 5, h: 0.3, fontFace: F.reg, fontSize: 8, color: C.caption }, 'Business, date in full')] });

  pres.defineSlideMaster({ title: 'Section', background: canvas,
    objects: [ph('no', 'body', { x: M, y: 1.9, w: 6, h: 0.3, fontFace: F.semi, fontSize: 9, charSpacing: 2, color: C.steel }, '01 · SECTION'),
      ph('title', 'title', { x: M, y: 2.2, w: 8.4, h: 0.8, fontFace: F.semi, fontSize: 34.2, charSpacing: -0.68, color: C.ink }, 'Section title'),
      rule(M, 3.15, 4.4), logo()], slideNumber: num });

  pres.defineSlideMaster({ title: 'Title and content', background: canvas,
    objects: [title(), ph('body', 'body', { x: M, y: 1.12, w: TW, h: 3.1, fontFace: F.reg, fontSize: 12, color: C.ink }, 'Content'), logo()], slideNumber: num });

  pres.defineSlideMaster({ title: 'Title, content and strapline', background: canvas,
    objects: [title(), ph('body', 'body', { x: M, y: 1.12, w: TW, h: 3.1, fontFace: F.reg, fontSize: 12, color: C.ink }, 'Content'), ...band, bandText, logo()], slideNumber: num });

  pres.defineSlideMaster({ title: 'Four columns and strapline', background: canvas,
    objects: [title(), ...COLS.flatMap((x, i) => [
      ph(`head ${i + 1}`, 'body', { x, y: 2.05, w: CW, h: 0.3, fontFace: F.semi, fontSize: 11, color: C.ink }, 'Column header'), rule(x, 2.4, CW),
      ph(`col ${i + 1}`, 'body', { x, y: 2.5, w: CW, h: 1.7, fontFace: F.reg, fontSize: 10, color: C.slate, lineSpacingMultiple: 1.2 }, 'Column text')]),
      ...band, bandText, logo()], slideNumber: num });

  pres.defineSlideMaster({ title: 'Two columns', background: canvas,
    objects: [title(),
      ph('left head', 'body', { x: M, y: 1.12, w: 4.4, h: 0.3, fontFace: F.semi, fontSize: 12, color: C.ink }, 'Left heading'), rule(M, 1.48, 4.4),
      ph('left', 'body', { x: M, y: 1.6, w: 4.4, h: 2.6, fontFace: F.reg, fontSize: 11, color: C.slate }, 'Left column'),
      ph('right head', 'body', { x: 5.1, y: 1.12, w: 4.44, h: 0.3, fontFace: F.semi, fontSize: 12, color: C.ink }, 'Right heading'), rule(5.1, 1.48, 4.44),
      ph('right', 'body', { x: 5.1, y: 1.6, w: 4.44, h: 2.6, fontFace: F.reg, fontSize: 11, color: C.slate }, 'Right column'), logo()], slideNumber: num });

  pres.defineSlideMaster({ title: 'Statement and figure', background: canvas,
    objects: [title(),
      ph('body', 'body', { x: M, y: 1.12, w: 4.4, h: 3.1, fontFace: F.reg, fontSize: 14, color: C.ink }, 'The point, in a sentence or two'),
      ph('figure', 'body', { x: 5.1, y: 1.0, w: 4.44, h: 1.5, fontFace: F.semi, fontSize: 96, color: C.ink, valign: 'bottom', charSpacing: -3 }, '00'),
      ph('caption', 'body', { x: 5.1, y: 2.65, w: 4.44, h: 0.6, fontFace: F.reg, fontSize: 11, color: C.slate }, 'What the figure measures'),
      rule(5.1, 3.4, 4.44),
      ph('source', 'body', { x: 5.1, y: 3.5, w: 4.44, h: 0.3, fontFace: F.reg, fontSize: 8, color: C.steel }, 'Source'), logo()], slideNumber: num });

  // two-up: the grid split down the middle, a 4.62 x 2.95 in image on one side
  pres.defineSlideMaster({ title: 'Image and text', background: canvas,
    objects: [title(),
      ph('label', 'body', { x: M, y: 1.12, w: 4.2, h: 0.3, fontFace: F.semi, fontSize: 11, color: C.ink }, 'Label'), rule(M, 1.48, 4.2),
      ph('body', 'body', { x: M, y: 1.6, w: 4.2, h: 2.5, fontFace: F.reg, fontSize: 11, color: C.slate }, 'Text'),
      ph('picture', 'pic', { x: 4.92, y: 1.12, w: 4.62, h: 2.95 }, ''), logo()], slideNumber: num });

  pres.defineSlideMaster({ title: 'Quote', background: canvas,
    objects: [{ rect: { x: M, y: 1.28, w: 0.53, h: 0.04, fill: { color: C.pale } } },
      ph('quote', 'body', { x: M, y: 1.5, w: 7.6, h: 2.0, fontFace: F.light, fontSize: 26, color: C.ink, lineSpacingMultiple: 1.1 }, 'Quote'),
      ph('who', 'body', { x: M, y: 3.65, w: 7.6, h: 0.5, fontFace: F.semi, fontSize: 10, color: C.slate }, 'Name, role'), logo()], slideNumber: num });

  pres.defineSlideMaster({ title: 'Closing', background: { color: SURF },
    objects: [{ image: { path: I('glyph-white.png'), x: M, y: 1.3, h: 0.8, w: 0.8 * sizes.glyph, altText: 'Smedley Group' } },
      ph('title', 'title', { x: M, y: 2.35, w: 8.4, h: 0.8, fontFace: F.semi, fontSize: 28, charSpacing: -0.68, color: C.white }, 'Closing line'),
      { rect: { x: M, y: 3.3, w: 2.6, h: 0.012, fill: { color: C.pale } } },
      ph('body', 'body', { x: M, y: 3.45, w: 8.4, h: 0.4, fontFace: F.reg, fontSize: 10, color: C.cloud }, 'Contact')] });

  // ---------- helpers for example content ----------
  const T = (s, text, o) => s.addText(text, Object.assign({ isTextBox: true, margin: 0, fontFace: F.reg, fontSize: 11, color: C.ink, valign: 'top' }, o));
  const hair = (s, x, y, w) => s.addShape(pres.shapes.LINE, { x, y, w, h: 0, line: { color: C.pale, width: 0.75 } });
  // a content card: the signature surface with the edge light, an icon tile, an uppercase title and a Light caption
  const card = (s, x, y, w, h, icon, head, cap) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.12, fill: { color: SURF }, line: { color: EDGE, width: 0.5 } });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + 0.13, y: y + (h - 0.51) / 2, w: 0.49, h: 0.51, rectRadius: 0.1, fill: { color: SURF }, line: { color: EDGE, width: 0.5 } });
    s.addImage({ path: I(`icon-${icon}.png`), x: x + 0.22, y: y + (h - 0.31) / 2, w: 0.31, h: 0.31, altText: icon });
    T(s, head.toUpperCase(), { x: x + 0.74, y: y + 0.17, w: w - 0.84, h: 0.2, fontFace: F.semi, fontSize: 9, charSpacing: 0.2, color: C.white });
    T(s, cap, { x: x + 0.74, y: y + 0.38, w: w - 0.84, h: 0.3, fontFace: F.light, fontSize: 7, color: C.cloud, lineSpacingMultiple: 1.3 });
  };
  // a signal chip: bold signal colour on its own tint, never a fill on its own
  const chip = (s, x, y, text, good) => {
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 1.79, h: 0.4, rectRadius: 0.08, fill: { color: good ? C.posT : C.negT }, line: { type: 'none' } });
    T(s, text, { x, y, w: 1.79, h: 0.4, align: 'center', valign: 'middle', fontFace: F.semi, fontSize: 9, color: good ? C.pos : C.neg });
  };

  // 1 cover
  let s = pres.addSlide({ masterName: 'Cover, Smedley Group' });
  s.addText('SEASON REVIEW', { placeholder: 'eyebrow' });
  s.addText('Season review 2026', { placeholder: 'title' });
  s.addText('The driver programme', { placeholder: 'sub' });
  s.addText('Smedley Group, 5 October 2026', { placeholder: 'meta' });
  s.addNotes('Cover. The one slide in the signature surface, with the closing slide. Pick the cover for the business presenting from Layout: Smedley Group, Advanced Technology, Insight Labs or FAT Racing; the business sits in the lockup. The deck is set in Sora: install it (Google Fonts, Sora, Light, Regular and SemiBold) before editing, or PowerPoint falls back to Calibri. FAT Karting League material uses the FKL brand and its own templates, not this deck.');

  // 2 agenda
  s = pres.addSlide({ masterName: 'Title and content' });
  s.addText('Today', { placeholder: 'title' });
  s.addText(['Where the season ended', 'What TalentID told us', 'The F4 shortlist', 'Next season'].flatMap((t, i) => [
    { text: String(i + 1).padStart(2, '0') + '   ', options: { fontFace: F.semi, fontSize: 16, color: C.steel } },
    { text: t, options: { breakLine: i < 3, fontSize: 18 } }]), { placeholder: 'body' });
  s.addNotes('Agenda. Four or five items, numbered in SemiBold Steel. One title per slide, in sentence case, with no full stop.');

  // 3 section
  s = pres.addSlide({ masterName: 'Section' });
  s.addText('01 · SEASON', { placeholder: 'no' }); s.addText('Where the season ended', { placeholder: 'title' });
  s.addNotes('Section divider: the eyebrow names the number and the part, the title the section. It stays on the Canvas.');

  // 4 four columns with content cards and the strapline band
  s = pres.addSlide({ masterName: 'Four columns and strapline' });
  s.addText('How TalentID scores a driver', { placeholder: 'title' });
  [['stopwatch', 'Pace', 'Laps, sectors, split times', 'Raw speed', 'Best laps against the class reference, session by session.'],
    ['chart-line', 'Consistency', 'Spread over a stint', 'Repeatable', 'How tightly the laps cluster once the tyres are in.'],
    ['position', 'Racecraft', 'Places won and held', 'In traffic', 'Overtakes made, positions defended, incidents avoided.'],
    ['rain', 'Adaptability', 'New track, new weather', 'Learning rate', 'Laps needed to reach pace on a new circuit or in the wet.']].forEach((c, i) => {
    card(s, COLS[i], 1.12, CW, 0.74, c[0], c[1], c[2]);
    s.addText(c[3], { placeholder: `head ${i + 1}` }); s.addText(c[4], { placeholder: `col ${i + 1}` });
  });
  s.addText('One index compares drivers from Lagos to Łódź', { placeholder: 'band' });
  s.addNotes('Four columns, 2.05 in wide with 0.27 in gutters. Content cards are 2.05 × 0.74 in in the signature surface with the edge light, an icon tile on the left, an uppercase title and a two-line Light caption. One icon per idea. The strapline band states the conclusion; it never restates the title. One band per slide at most.');

  // 5 statement and figure
  s = pres.addSlide({ masterName: 'Statement and figure' });
  s.addText('One slide, one point: say it in the title', { placeholder: 'title' });
  s.addText([{ text: 'Lead with the conclusion. The reader should be able to stop after the title and still act.', options: { breakLine: true, paraSpaceAfter: 12 } },
    { text: 'Supporting points in plain sentences', options: { bullet: { indent: 14 }, breakLine: true, fontSize: 11, color: C.slate } },
    { text: 'Numbers with units: 0.18 s, 57 %, 1,406 sessions', options: { bullet: { indent: 14 }, breakLine: true, fontSize: 11, color: C.slate } },
    { text: 'Sentence case everywhere', options: { bullet: { indent: 14 }, fontSize: 11, color: C.slate } }], { placeholder: 'body' });
  s.addText([{ text: '57' }, { text: ' %', options: { fontSize: 32, color: C.steel } }], { placeholder: 'figure' });
  s.addText('of the way to F1: the one figure this slide is about', { placeholder: 'caption' });
  s.addText('Source: TalentID, season 2026', { placeholder: 'source' });
  s.addNotes('Statement and figure. One hero number per slide in Sora SemiBold, its unit in Steel.');

  // 6 comparison with signal chips
  s = pres.addSlide({ masterName: 'Two columns' });
  s.addText('TalentID replaces guesswork with laps', { placeholder: 'title' });
  s.addText('Scouting on a race weekend', { placeholder: 'left head' });
  s.addText('Drivers picked on a single weekend, from notes in the paddock, with no common measure across hubs.', { placeholder: 'left' });
  s.addText('The TalentID index', { placeholder: 'right head' });
  s.addText('Every lap of every session counts: pace, consistency, racecraft and adaptability, scored against the class.', { placeholder: 'right', color: C.ink });
  [['Resource heavy', 'Biased'], ['Fragmented', 'Just data points']].forEach((r, j) => r.forEach((t, k) => chip(s, M + k * 1.95, 2.55 + j * 0.5, t, false)));
  [['Scalable', 'Objective'], ['Global', 'Real insights']].forEach((r, j) => r.forEach((t, k) => chip(s, 5.1 + k * 1.95, 2.55 + j * 0.5, t, true)));
  s.addNotes('Comparisons. Signal chips are 1.79 × 0.49 in, the bold signal colour on its own tint, always in a 2 × 2 block. Green and red never share a block, and never fill a shape on their own.');

  // 7 timeline
  s = pres.addSlide({ masterName: 'Title and content' });
  s.addText('Four steps to the 2027 grid', { placeholder: 'title' });
  const tl = [['October 2026', 'Shortlist', 'Twelve drivers above the F4 line.'], ['December 2026', 'Test days', 'Two days each at Silverstone.'], ['February 2027', 'Selection', 'Four seats, chosen on the index.'], ['April 2027', 'Season one', 'British F4 opener, Donington Park.']];
  const ty = 2.4;
  hair(s, M, ty, TW);
  tl.forEach((m, i) => { const x = COLS[i];
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: ty - 0.08, w: 0.16, h: 0.16, rectRadius: 0.04, fill: { color: i === 0 ? SURF : C.pale }, line: i === 0 ? { color: EDGE, width: 0.5 } : { type: 'none' } });
    T(s, m[0], { x, y: ty - 0.5, w: CW, h: 0.3, fontFace: F.semi, fontSize: 9, color: C.steel });
    T(s, m[1], { x, y: ty + 0.25, w: CW, h: 0.35, fontFace: F.semi, fontSize: 14 });
    T(s, m[2], { x, y: ty + 0.65, w: CW, h: 0.8, fontSize: 10, color: C.slate }); });
  s.addNotes('Timeline on the four-column grid. Where we are now takes the signature surface; the steps ahead are Pale Blue.');

  // 8 chart
  s = pres.addSlide({ masterName: 'Title and content' });
  s.addText('Maja is closing on the F4 entry line', { placeholder: 'title' });
  const lab = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10', 'S11', 'S12'];
  s.addChart(pres.charts.LINE, [
    { name: 'Maja Kowalczyk', labels: lab, values: [.62, .55, .51, .44, .47, .38, .35, .31, .28, .24, .22, .18] },
    { name: 'Class reference', labels: lab, values: [.6, .58, .57, .55, .55, .53, .52, .51, .5, .49, .49, .48] },
    { name: 'F4 entry', labels: lab, values: Array(12).fill(.3) }],
    { x: M, y: 1.12, w: 6.2, h: 3.1, chartColors: [C.ink, C.steel, C.mist], lineSize: 2, lineDataSymbol: 'none',
      catAxisLabelFontFace: F.reg, valAxisLabelFontFace: F.reg, catAxisLabelFontSize: 8, valAxisLabelFontSize: 8, catAxisLabelColor: C.slate, valAxisLabelColor: C.slate,
      valAxisLabelFormatCode: '+0.00"s"', valAxisMinVal: 0, valAxisMaxVal: 0.7, valAxisMajorUnit: 0.35, valGridLine: { color: C.pale, size: 0.5 }, catGridLine: { style: 'none' },
      catAxisLineColor: C.pale, valAxisLineShow: false, showLegend: true, legendPos: 'b', legendFontFace: F.reg, legendFontSize: 9, legendColor: C.slate,
      showTitle: false, altText: 'Line chart: gap to the class reference over 12 sessions, falling from 0.62 s to 0.18 s, below the F4 entry line of 0.30 s' });
  T(s, '+0.18 s', { x: 7.0, y: 1.3, w: 2.5, h: 0.6, fontFace: F.semi, fontSize: 28 });
  T(s, 'gap to the class reference after 12 sessions, down from +0.62 s', { x: 7.0, y: 1.95, w: 2.5, h: 0.6, fontSize: 10, color: C.slate });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 7.0, y: 2.65, w: 1.4, h: 0.32, rectRadius: 0.06, fill: { color: C.posT }, line: { type: 'none' } });
  T(s, '0.44 s faster', { x: 7.0, y: 2.65, w: 1.4, h: 0.32, align: 'center', valign: 'middle', fontFace: F.semi, fontSize: 9, color: C.pos });
  s.addNotes('Charts: structure in Pale Blue, the subject in ink, the reference in Steel, comparisons in Mist. A gain is told by a label in the positive pair, never by a green line or bar. The chart is native: right-click, Edit data.');

  // 9 table
  s = pres.addSlide({ masterName: 'Title and content' });
  s.addText('Qualifying, cadet class, round 7', { placeholder: 'title' });
  const bd = [{ type: 'none' }, { type: 'none' }, { pt: 0.75, color: C.pale }, { type: 'none' }];
  const hd = { fontFace: F.semi, fontSize: 8, color: C.steel, border: bd };
  const cell = (t, o) => ({ text: t, options: Object.assign({ fontFace: F.reg, fontSize: 11, color: C.ink, border: bd }, o) });
  const R = { align: 'right' }, best = { align: 'right', color: C.pos, fontFace: F.semi };
  s.addTable([
    ['Pos', 'Driver', 'Best', 'Gap', 'S1', 'S2', 'S3'].map((t, i) => ({ text: t, options: Object.assign({ align: i > 1 ? 'right' : 'left' }, hd) })),
    [cell('1', { fontFace: F.semi }), cell('Maja Kowalczyk', { fontFace: F.semi }), cell('1:02.418', R), cell('Leader', R), cell('20.904', R), cell('20.771', best), cell('20.743', R)],
    [cell('2'), cell('Leo Hartmann'), cell('1:02.521', R), cell('+0.103', R), cell('20.951', R), cell('20.868', R), cell('20.702', best)],
    [cell('3'), cell('Aarav Mehta'), cell('1:02.977', R), cell('+0.559', R), cell('20.887', best), cell('21.101', R), cell('20.989', R)]],
    { x: M, y: 1.2, w: TW, colW: [0.6, 2.9, 1.2, 1.0, 1.1, 1.1, 1.18], rowH: 0.42, valign: 'middle', margin: [0, 0.05, 0, 0.05] });
  T(s, 'The leader in SemiBold. The fastest time in each sector is the only green on the slide, as a label, never a filled cell.', { x: M, y: 3.3, w: 7, h: 0.4, fontSize: 10, color: C.slate });
  s.addNotes('Tables: Pale Blue hairlines, no boxes, no fills. Times in Sora with tabular figures, aligned right.');

  // 10 quote
  s = pres.addSlide({ masterName: 'Quote' });
  s.addText('“The index told us what the stopwatch never could: who gets faster when it matters.”', { placeholder: 'quote' });
  s.addText('Head of driver development, FAT Racing', { placeholder: 'who' });
  s.addNotes('Quote. Real words from a real person, attributed by name and role. Keep it under 25 words.');

  // 11 closing
  s = pres.addSlide({ masterName: 'Closing' });
  s.addText('Four seats, chosen on the index', { placeholder: 'title' });
  s.addText('name@smedleygroup.com', { placeholder: 'body' });
  s.addNotes('Closing. End on the point, in one sentence. Replace the contact line with the presenter. The Image and text layout (two-up, a 4.62 × 2.95 in picture) is under Layout.');

  // 12 to 14: the other covers, to pick from
  for (const b of BUSINESSES.slice(1)) {
    s = pres.addSlide({ masterName: `Cover, ${b.name}` });
    s.addText({ 'advanced-technology': 'ENGINEERING', 'insight-labs': 'FAN ENGAGEMENT', 'fat-racing': 'DRIVER PROGRAMME' }[b.key], { placeholder: 'eyebrow' });
    s.addText({ 'advanced-technology': 'Telemetry platform', 'insight-labs': 'Season insights', 'fat-racing': 'Four drivers for F4' }[b.key], { placeholder: 'title' });
    s.addText({ 'advanced-technology': 'Phase two, 2027', 'insight-labs': 'The title race, simulated', 'fat-racing': 'The 2027 line-up' }[b.key], { placeholder: 'sub' });
    s.addText(`${b.name}, 5 October 2026`, { placeholder: 'meta' });
    s.addNotes(`${b.name} cover. Delete the covers you do not use.`);
  }

  await pres.writeFile({ fileName: out });
}
