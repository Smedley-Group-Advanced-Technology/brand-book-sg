// The Word templates: a report with a cover page, contents and a style for every element the book
// describes, and a letter on the group letterhead. Built by tools/templates/build.mjs.
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Document, Packer, Paragraph, TextRun, ImageRun, Header, Footer, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType,
  LevelFormat, PageNumber, TabStopType, TableOfContents, VerticalAlign } from 'docx';

const INK = '0B0C0E', DIM = '585D65', RULE = 'D9DADD', RED = 'D8231A', LINE = '1F66E0', GREEN = '007A38';
const none = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const hair = { style: BorderStyle.SINGLE, size: 4, color: RULE };
const W = 9026; // A4 text width at 1 in margins, in DXA
const MONO = 'IBM Plex Mono';

const styles = {
  default: { document: { run: { font: 'Sora', size: 20, color: INK }, paragraph: { spacing: { after: 160, line: 300 } } } },
  paragraphStyles: [
    { id: 'Title', name: 'Title', basedOn: 'Normal', next: 'Subtitle', quickFormat: true, run: { font: 'Sora SemiBold', size: 64, color: INK }, paragraph: { spacing: { before: 0, after: 160, line: 252 } } },
    { id: 'Subtitle', name: 'Subtitle', basedOn: 'Normal', next: 'Body', quickFormat: true, run: { font: 'Sora Light', size: 30, color: DIM }, paragraph: { spacing: { after: 480, line: 320 } } },
    { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Body', quickFormat: true, run: { font: 'Sora SemiBold', size: 34, color: INK }, paragraph: { spacing: { before: 480, after: 160, line: 264 }, outlineLevel: 0, keepNext: true, keepLines: true } },
    { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Body', quickFormat: true, run: { font: 'Sora SemiBold', size: 24, color: INK }, paragraph: { spacing: { before: 360, after: 120 }, outlineLevel: 1, keepNext: true, keepLines: true } },
    { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Body', quickFormat: true, run: { font: MONO, size: 17, color: LINE }, paragraph: { spacing: { before: 280, after: 80 }, outlineLevel: 2, keepNext: true } },
    { id: 'Body', name: 'Body', basedOn: 'Normal', quickFormat: true, run: { font: 'Sora', size: 20, color: INK }, paragraph: { spacing: { after: 160, line: 300 } } },
    { id: 'Lead', name: 'Lead', basedOn: 'Body', next: 'Body', quickFormat: true, run: { font: 'Sora', size: 26, color: INK }, paragraph: { spacing: { after: 240, line: 336 } } },
    { id: 'Label', name: 'Label', basedOn: 'Normal', next: 'Title', quickFormat: true, run: { font: MONO, size: 17, color: LINE }, paragraph: { spacing: { after: 160 } } },
    { id: 'Caption', name: 'Caption', basedOn: 'Normal', next: 'Body', quickFormat: true, run: { font: MONO, size: 16, color: DIM }, paragraph: { spacing: { before: 80, after: 240, line: 260 } } },
    { id: 'Figure', name: 'Figure', basedOn: 'Normal', next: 'Caption', quickFormat: true, run: { font: 'Sora SemiBold', size: 72, color: INK }, paragraph: { spacing: { before: 160, after: 0, line: 240 }, keepNext: true } },
    { id: 'Note', name: 'Note', basedOn: 'Body', next: 'Body', quickFormat: true, run: { color: INK },
      paragraph: { indent: { left: 240 }, spacing: { before: 120, after: 240 }, border: { left: { style: BorderStyle.SINGLE, size: 18, color: LINE, space: 12 } } } },
    { id: 'Quote', name: 'Quote', basedOn: 'Normal', next: 'Caption', quickFormat: true, run: { font: 'Sora Light', size: 30, color: INK },
      paragraph: { spacing: { before: 360, after: 80, line: 360 }, border: { top: { style: BorderStyle.SINGLE, size: 18, color: RED, space: 14 } }, indent: { right: 1440 } } },
    { id: 'Strapline', name: 'Strapline', basedOn: 'Normal', next: 'Body', quickFormat: true, run: { font: 'Sora SemiBold', size: 22, color: 'FFFFFF' },
      paragraph: { alignment: AlignmentType.CENTER, spacing: { before: 360, after: 360 }, shading: { type: ShadingType.CLEAR, fill: '000000', color: 'auto' },
        border: { top: { style: BorderStyle.SINGLE, size: 36, color: '000000', space: 6 }, bottom: { style: BorderStyle.SINGLE, size: 36, color: '000000', space: 6 } } } },
    { id: 'Small', name: 'Small', basedOn: 'Normal', quickFormat: true, run: { font: MONO, size: 15, color: DIM }, paragraph: { spacing: { after: 0, line: 240 } } },
  ],
};
const bullets = { reference: 'sg-bullets', levels: [{ level: 0, format: LevelFormat.BULLET, text: '–', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 360, hanging: 260 } }, run: { color: RED } } }] };
const numbers = { reference: 'sg-numbers', levels: [{ level: 0, format: LevelFormat.DECIMAL_ZERO, text: '%1', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 480, hanging: 480 } }, run: { font: MONO, color: LINE } } }] };

const P = (text, style = 'Body', o = {}) => new Paragraph(Object.assign({ style, children: [new TextRun(text)] }, o));
const runs = (style, parts, o = {}) => new Paragraph(Object.assign({ style, children: parts.map(p => typeof p === 'string' ? new TextRun(p) : new TextRun(p)) }, o));

export async function buildDocuments(img, sizes, outDir) {
  const pic = async (f, h, alt) => { const hPx = h; return new ImageRun({ type: 'png', data: await readFile(join(img, f)), transformation: { width: Math.round(hPx * (f.startsWith('glyph') ? sizes.glyph : sizes['smedley-group'])), height: hPx }, altText: { title: alt, description: alt, name: alt } }); };
  const ruleImg = new ImageRun({ type: 'png', data: await readFile(join(img, 'rule.png')), transformation: { width: 602, height: 9 }, altText: { title: 'Scale rule', description: 'Red lead into a blue scale rule', name: 'Rule' } });
  const footerLine = (left) => new Footer({ children: [new Paragraph({ style: 'Small', tabStops: [{ type: TabStopType.RIGHT, position: W }], border: { top: { style: BorderStyle.SINGLE, size: 4, color: RULE, space: 8 } },
    children: [new TextRun(left), new TextRun({ children: ['\t', PageNumber.CURRENT, ' / ', PageNumber.TOTAL_PAGES] })] })] });

  // ---------- report ----------
  const cell = (text, w, o = {}) => new TableCell({ width: { size: w, type: WidthType.DXA }, borders: { top: none, left: none, right: none, bottom: hair }, margins: { top: 90, bottom: 90, left: 0, right: 120 }, verticalAlign: VerticalAlign.CENTER,
    children: [new Paragraph({ style: o.style || 'Body', spacing: { after: 0 }, alignment: o.right ? AlignmentType.RIGHT : AlignmentType.LEFT, keepNext: o.keep !== false, keepLines: true,
      children: [new TextRun({ text, bold: !!o.bold, font: o.font, color: o.color })] })] });
  const cols = [3200, 2626, 1600, 1600];
  const table = new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: cols, borders: { top: none, bottom: none, left: none, right: none, insideHorizontal: none, insideVertical: none },
    rows: [new TableRow({ tableHeader: true, cantSplit: true, children: ['Driver', 'Hub', 'Index', 'Change'].map((t, i) => cell(t, cols[i], { style: 'Small', right: i > 1 })) }),
      ...[['Maja Kowalczyk', 'Łódź', '91.4', '+3.2'], ['Leo Hartmann', 'Milton Keynes', '88.9', '+1.1'], ['Aarav Mehta', 'Dubai', '86.2', '+4.6']].map((r, ri, all) =>
        new TableRow({ cantSplit: true, children: r.map((t, i) => cell(t, cols[i], { keep: ri < all.length - 1, bold: i === 0, font: i > 1 ? MONO : undefined, color: i === 3 ? GREEN : undefined, right: i > 1 })) }))] });

  const report = new Document({
    creator: 'Smedley Group', title: 'Smedley Group report template', description: 'Report template on the Smedley Group brand', styles,
    numbering: { config: [bullets, numbers] },
    features: { updateFields: true },
    sections: [
      { // cover page: no header or footer
        properties: { page: { margin: { top: 1080, bottom: 1080, left: 1440, right: 1440 } }, titlePage: true },
        headers: { first: new Header({ children: [] }) }, footers: { first: new Footer({ children: [] }) },
        children: [
          new Paragraph({ children: [await pic('smedley-group-ink.png', 60, 'Smedley Group')], spacing: { after: 3600 } }),
          P('Report', 'Label'),
          P('Document title in sentence case', 'Title'),
          P('A subtitle that says who it is for and why', 'Subtitle'),
          new Paragraph({ children: [ruleImg], spacing: { after: 200 } }),
          runs('Small', ['Smedley Group', { text: '   September 2026   ', color: DIM }, 'Version 1.0']),
          runs('Small', ['Author name, role'], { spacing: { before: 60 } }),
        ] },
      { // contents and body
        properties: { page: { margin: { top: 1440, bottom: 1300, left: 1440, right: 1440, header: 600, footer: 560 } } },
        headers: { default: new Header({ children: [new Paragraph({ tabStops: [{ type: TabStopType.RIGHT, position: W }], children: [await pic('glyph-ink.png', 30, 'Smedley Group'), new TextRun({ text: '\tDocument title', font: MONO, size: 15, color: DIM })] })] }) },
        footers: { default: footerLine('Smedley Group') },
        children: [
          P('Contents', 'Heading1', { spacing: { before: 0, after: 200 } }),
          new TableOfContents('Contents', { hyperlink: true, headingStyleRange: '1-2' }),
          P('If the contents are empty, right-click them and choose Update field.', 'Caption'),
          P('Summary', 'Heading1'),
          P('Lead with the conclusion. The reader should be able to stop after this paragraph and still act on it.', 'Lead'),
          P('Body text is Sora Regular, 10 pt on 15 pt. Write in plain words and full sentences, in sentence case. Put numbers with their units: 0.18 s, 57 %, 1,406 sessions.'),
          P('Notes carry an aside the reader should not miss: a caveat, a dependency, a decision still open. They sit on a blue rule.', 'Note'),
          P('Section heading', 'Heading1'),
          P('Subheading', 'Heading2'),
          P('Heading 3 labels a group of paragraphs', 'Heading3'),
          ...['Lists use an en rule in Race Red, never a literal bullet character', 'One point per item, as a full sentence', 'Keep lists short: three to five items'].map(t => new Paragraph({ style: 'Body', numbering: { reference: 'sg-bullets', level: 0 }, spacing: { after: 80 }, children: [new TextRun(t)] })),
          P('Steps in order are numbered in mono.', 'Body', { spacing: { before: 200 } }),
          ...['Book the test day', 'Confirm the driver and the car', 'Send the setup sheet the day before'].map(t => new Paragraph({ style: 'Body', numbering: { reference: 'sg-numbers', level: 0 }, spacing: { after: 80 }, children: [new TextRun(t)] })),
          P('Figures', 'Heading2'),
          runs('Figure', ['57', { text: ' %', color: RED, size: 36 }]),
          P('Figure: one hero number, Sora SemiBold, with its unit in red', 'Caption'),
          P('Tables', 'Heading2'),
          table,
          P('Tables use hairlines, not boxes. Measured values are set in IBM Plex Mono and aligned right.', 'Caption'),
          P('Quotes', 'Heading2'),
          P('“The index told us what the stopwatch never could: who gets faster when it matters.”', 'Quote'),
          P('Head of driver development, FAT Racing', 'Caption'),
          P('Maja is ready for an F4 test day this winter', 'Strapline'),
          P('The strapline closes a document or a section with its conclusion, in one sentence. It never restates the title.', 'Caption'),
        ] },
    ],
  });
  await writeFile(join(outDir, 'smedley-group-document.docx'), await Packer.toBuffer(report));

  // ---------- letter ----------
  const letter = new Document({
    creator: 'Smedley Group', title: 'Smedley Group letter template', styles,
    sections: [{
      properties: { page: { margin: { top: 1300, bottom: 1440, left: 1440, right: 1440, header: 700, footer: 500 } }, titlePage: true },
      headers: { first: new Header({ children: [new Paragraph({ children: [await pic('smedley-group-ink.png', 52, 'Smedley Group')] })] }),
        default: new Header({ children: [new Paragraph({ children: [await pic('glyph-ink.png', 30, 'Smedley Group')] })] }) },
      footers: {
        first: new Footer({ children: [
          new Paragraph({ style: 'Small', border: { top: { style: BorderStyle.SINGLE, size: 4, color: RULE, space: 8 } }, children: [new TextRun('[Registered company name]. Registered in England and Wales, company number [00000000].')] }),
          new Paragraph({ style: 'Small', children: [new TextRun('Registered office: [address]. smedleygroup.com')] })] }),
        default: footerLine('Smedley Group') },
      children: [
        new Paragraph({ spacing: { before: 600, after: 0 } }),
        new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [5626, 3400], borders: { top: none, bottom: none, left: none, right: none, insideHorizontal: none, insideVertical: none },
          rows: [new TableRow({ children: [
            new TableCell({ width: { size: 5626, type: WidthType.DXA }, borders: { top: none, bottom: none, left: none, right: none },
              children: ['[Recipient name]', '[Role]', '[Organisation]', '[Street]', '[Town]  [Postcode]'].map((t, i) => P(t, 'Body', { spacing: { after: 0, line: 300 }, children: [new TextRun({ text: t, bold: i === 0 })] })) }),
            new TableCell({ width: { size: 3400, type: WidthType.DXA }, borders: { top: none, bottom: none, left: none, right: none },
              children: [['From', '[Your name], [role]'], ['Email', '[name]@smedleygroup.com'], ['Phone', '[+44 0000 000000]'], ['Our ref', '[REF-000]']].flatMap(([k, v]) => [
                P(k, 'Small', { spacing: { after: 0 } }), P(v, 'Small', { spacing: { after: 120 }, children: [new TextRun({ text: v, color: INK })] })]) })] })] }),
        P('26 September 2026', 'Small', { spacing: { before: 480, after: 480 }, children: [new TextRun({ text: '26 September 2026', color: INK })] }),
        P('Subject line in sentence case, saying what the letter is about', 'Heading2', { spacing: { before: 0, after: 240 } }),
        P('Dear [Name],'),
        P('Open with the point of the letter in one or two sentences, so the reader knows at once what you need from them or what you are telling them.'),
        P('Use the paragraphs that follow for the detail: what has happened, what it means and what happens next. Plain words, full sentences, sentence case. Put numbers with their units, and dates as 26 September 2026.'),
        P('Close with the next step and who takes it.'),
        P('Yours sincerely,', 'Body', { spacing: { before: 240, after: 720 } }),
        P('[Your name]', 'Body', { spacing: { after: 0 }, children: [new TextRun({ text: '[Your name]', bold: true })] }),
        P('[Role], [Business]', 'Small'),
      ],
    }],
  });
  await writeFile(join(outDir, 'smedley-group-letter.docx'), await Packer.toBuffer(letter));
}
