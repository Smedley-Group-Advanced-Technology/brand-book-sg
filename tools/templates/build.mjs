// npm run templates: rebuilds everything in assets/templates from the logos in assets/logo, then the kit.
// Run it after changing a logo, the glyph or anything in tools/templates. Needs the dev dependencies
// (npm install) and Chromium for Playwright; LibreOffice, if installed, also refreshes the preview thumbnails.
import { copyFile, readFile, writeFile, mkdir, rm, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { renderImages, BUSINESSES } from './images.mjs';
import { buildDeck } from './deck.mjs';
import { buildDocuments } from './document.mjs';
import { readZip, writeZip } from '../kit.mjs';
import { chromium } from 'playwright';

// 640 x 360 cards, as JPEG and WebP, drawn on a canvas so both encodings come from one render
async function thumbnails(pdf) {
  const first = async p => { const f = (await readdir(pdf)).find(n => n.startsWith(p) && n.endsWith('.png')); return 'data:image/png;base64,' + (await readFile(join(pdf, f))).toString('base64'); };
  const [slides, report, letter] = [await first('slides'), await first('report'), await first('letter')];
  const browser = await chromium.launch(); const page = await browser.newPage();
  const out = await page.evaluate(async ({ slides, report, letter }) => {
    const load = src => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = src; });
    const draw = async fn => { const c = document.createElement('canvas'); c.width = 640; c.height = 360; const x = c.getContext('2d'); await fn(x); return [c.toDataURL('image/jpeg', .88), c.toDataURL('image/webp', .82)]; };
    const s = await load(slides), r = await load(report), l = await load(letter);
    const page = (x, img, px, py, h) => { const w = h * img.width / img.height; x.fillStyle = 'rgba(0,0,0,.08)'; x.fillRect(px + 3, py + 3, w, h); x.drawImage(img, px, py, w, h); };
    return { slides: await draw(x => x.drawImage(s, 0, 0, 640, 360)),
      document: await draw(x => { x.fillStyle = '#F0F0F0'; x.fillRect(0, 0, 640, 360); page(x, l, 330, 44, 330); page(x, r, 150, 26, 334); }) };
  }, { slides, report, letter });
  await browser.close();
  for (const [k, [jpg, webp]] of Object.entries(out)) {
    await writeFile(join(ROOT, `assets/resources/thumb-${k}.jpg`), Buffer.from(jpg.split(',')[1], 'base64'));
    await writeFile(join(ROOT, `assets/resources/thumb-${k}.webp`), Buffer.from(webp.split(',')[1], 'base64'));
  }
}

const HERE = fileURLToPath(new URL('.', import.meta.url));
const ROOT = join(HERE, '../..');
const OUT = join(ROOT, 'assets/templates');
const B = join(HERE, '.build');
await rm(B, { recursive: true, force: true }); await mkdir(B, { recursive: true });

const sizes = await renderImages(B);
for (const f of ['blueprint.png', 'board-red.png', 'grid.png', 'rule.png']) await copyFile(join(HERE, 'img', f), join(B, f));
await copyFile(join(ROOT, 'assets/showcase/trackside.jpg'), join(B, 'example-trackside.jpg'));

// slides, with every parallelogram cut at the brand's 55° (offset = 0.7 x height)
const deck = join(OUT, 'smedley-group-slides.pptx');
await buildDeck(B, sizes, deck);
const files = readZip(await readFile(deck)); let cut = 0;
for (const [name, data] of files) if (name.endsWith('.xml') && data.includes('parallelogram')) {
  const xml = data.toString().replace(/<a:prstGeom prst="parallelogram">\s*<a:avLst\s*(?:\/>|><\/a:avLst>)/g, () => { cut++; return '<a:prstGeom prst="parallelogram"><a:avLst><a:gd name="adj" fmla="val 70000"/></a:avLst>'; });
  files.set(name, Buffer.from(xml));
}
await writeFile(deck, writeZip(files, new Date()));
console.log(`slides: ${[...files.keys()].filter(k => /^ppt\/slides\/slide\d+\.xml$/.test(k)).length} slides, ${[...files.keys()].filter(k => /slideLayout\d+\.xml$/.test(k)).length} layouts, ${cut} boards cut at 55°`);

await buildDocuments(B, sizes, OUT);
console.log('documents: report and letter');

// email signature lockups: the group's keeps its original file name, so signatures already in use keep working
for (const b of BUSINESSES) await copyFile(join(B, `signature-${b.key}.png`), join(OUT, b.key === 'smedley-group' ? 'signature-lockup.png' : `signature-${b.key}.png`));
const base = 'https://smedley-group-advanced-technology.github.io/brand-book-sg/assets/templates/';
const sig = await readFile(join(HERE, 'email-signature.html'), 'utf8');
await writeFile(join(OUT, 'email-signature.html'), sig.replace('{{variants}}', BUSINESSES.map(b => `     ${b.name.padEnd(20)} ${base}${b.key === 'smedley-group' ? 'signature-lockup.png' : `signature-${b.key}.png`}  width ${Math.round(49 * sizes[b.key])}`).join('\n')).replaceAll('{{base}}', base));
console.log('email signature: 4 lockups');

// social frames and the social preview, drawn by the post maker's own renderer
{
  const { createServer } = await import('node:http');
  const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.webp': 'image/webp' };
  const server = createServer(async (req, res) => {
    try { const p = join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname).replace(/\.\.+/g, '')); res.writeHead(200, { 'content-type': TYPES[p.slice(p.lastIndexOf('.'))] || 'application/octet-stream' }); res.end(await readFile(p)); }
    catch { res.writeHead(404); res.end(); }
  });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  const browser = await chromium.launch(); const page = await browser.newPage();
  await page.goto(`http://127.0.0.1:${server.address().port}/social/index.html`);
  await page.waitForFunction(() => document.documentElement.dataset.ready === '1');
  const made = await page.evaluate(async () => {
    const m = await import('./posts.js'); const logos = await m.loadLogos('../assets/logo/'), fonts = await m.fontCSS('../assets/fonts/');
    const frames = {};
    for (const format of Object.keys(m.FORMATS)) frames[format] = m.render({ format, type: 'headline', business: 'smedley-group', ground: 'dark', guides: true,
      comment: `Smedley Group social frame, ${m.FORMATS[format].w} x ${m.FORMATS[format].h}. Keep text inside the dashed safe area and delete the guides group before export. Easier: the post maker at https://smedley-group-advanced-technology.github.io/brand-book-sg/social/`,
      data: { ...m.defaults('headline'), kicker: 'Label', headline: 'Headline in sentence case', support: 'One supporting line, plain words', handle: '[website or handle]' } }, { logos });
    // the card in the book: three posts on the canvas grey
    const pic = async (o, h) => { const blob = await m.toPNG(m.render({ ...o, data: m.defaults(o.type) }, { logos, fontCSS: fonts })); const img = new Image(); img.src = URL.createObjectURL(blob); await img.decode(); return img; };
    const a = await pic({ format: 'portrait', type: 'headline', business: 'fat-racing', ground: 'dark' }), b = await pic({ format: 'square', type: 'figure', business: 'advanced-technology', ground: 'blueprint' }), c = await pic({ format: 'story', type: 'date', business: 'insight-labs', ground: 'light' });
    const cv = document.createElement('canvas'); cv.width = 640; cv.height = 360; const x = cv.getContext('2d');
    x.fillStyle = '#F0F0F0'; x.fillRect(0, 0, 640, 360);
    const put = (img, px, py, h) => { const w = h * img.width / img.height; x.fillStyle = 'rgba(0,0,0,.1)'; x.fillRect(px + 3, py + 3, w, h); x.drawImage(img, px, py, w, h); };
    put(c, 452, 30, 300); put(a, 40, 38, 284); put(b, 240, 70, 222);
    return { frames, jpg: cv.toDataURL('image/jpeg', .88), webp: cv.toDataURL('image/webp', .82) };
  });
  await browser.close(); server.close();
  for (const [format, svg] of Object.entries(made.frames)) await writeFile(join(OUT, `social-${format}.svg`), svg);
  await writeFile(join(ROOT, 'assets/resources/thumb-social.jpg'), Buffer.from(made.jpg.split(',')[1], 'base64'));
  await writeFile(join(ROOT, 'assets/resources/thumb-social.webp'), Buffer.from(made.webp.split(',')[1], 'base64'));
  console.log('social: 4 frames and the preview');
}

// preview thumbnails for the book's Resources section, when LibreOffice is available
try {
  const pdf = join(B, 'pdf'); await mkdir(pdf);
  for (const f of ['smedley-group-slides.pptx', 'smedley-group-document.docx', 'smedley-group-letter.docx'])
    execFileSync('soffice', ['--headless', '--convert-to', 'pdf', '--outdir', pdf, join(OUT, f)], { stdio: 'ignore', timeout: 120000 });
  execFileSync('pdftoppm', ['-png', '-r', '110', '-f', '1', '-l', '1', join(pdf, 'smedley-group-slides.pdf'), join(pdf, 'slides')]);
  execFileSync('pdftoppm', ['-png', '-r', '60', '-f', '1', '-l', '1', join(pdf, 'smedley-group-document.pdf'), join(pdf, 'report')]);
  execFileSync('pdftoppm', ['-png', '-r', '60', '-f', '1', '-l', '1', join(pdf, 'smedley-group-letter.pdf'), join(pdf, 'letter')]);
  await thumbnails(pdf);
  console.log('previews: slides and documents thumbnails refreshed');
} catch { console.log('previews: LibreOffice not found, thumbnails left as they are'); }

execFileSync('node', [join(ROOT, 'tools/kit.mjs')], { stdio: 'inherit' });
