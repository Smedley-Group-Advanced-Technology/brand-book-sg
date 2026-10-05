// npm run templates: rebuilds everything in assets/templates from the logos in assets/logo, then the kit.
// Run it after changing a logo, the glyph or anything in tools/templates. Needs the dev dependencies
// (npm install) and Chromium for Playwright; LibreOffice, if installed, also refreshes the preview thumbnails.
import { copyFile, readFile, writeFile, mkdir, rm, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { renderImages, BUSINESSES } from './images.mjs';
import { buildDeck, SURF, EDGE } from './deck.mjs';
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
    const page = (x, img, px, py, h) => { const w = h * img.width / img.height; x.drawImage(img, px, py, w, h); x.strokeStyle = '#ABC0E4'; x.lineWidth = 1; x.strokeRect(px + .5, py + .5, w - 1, h - 1); };
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

// slides: the SURF sentinel becomes the signature surface (the 45 degree gradient from #000000 to #222A35) and the
// EDGE sentinel the edge light (Mist, Pale Blue at 53 %, Slate, top to foot). Anything the swap misses keeps its
// solid fallback: #111820 and a Pale Blue line.
const deck = join(OUT, 'smedley-group-slides.pptx');
await buildDeck(B, sizes, deck);
const files = readZip(await readFile(deck)); let surf = 0, edge = 0;
const GRAD = '<a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:srgbClr val="000000"/></a:gs><a:gs pos="100000"><a:srgbClr val="222A35"/></a:gs></a:gsLst><a:lin ang="2700000" scaled="0"/></a:gradFill>';
const EDGE_GRAD = '<a:gradFill rotWithShape="1"><a:gsLst><a:gs pos="0"><a:srgbClr val="8497B0"/></a:gs><a:gs pos="53000"><a:srgbClr val="ABC0E4"/></a:gs><a:gs pos="100000"><a:srgbClr val="333F50"/></a:gs></a:gsLst><a:lin ang="5400000" scaled="0"/></a:gradFill>';
for (const [name, data] of files) if (name.endsWith('.xml') && (data.includes(SURF) || data.includes(EDGE))) {
  const xml = data.toString()
    .replace(new RegExp(`<a:solidFill>\\s*<a:srgbClr val="${EDGE}"\\s*(?:/>|>\\s*</a:srgbClr>)\\s*</a:solidFill>`, 'g'), () => { edge++; return EDGE_GRAD; })
    .replace(new RegExp(`<a:solidFill>\\s*<a:srgbClr val="${SURF}"\\s*(?:/>|>\\s*</a:srgbClr>)\\s*</a:solidFill>`, 'g'), () => { surf++; return GRAD; });
  files.set(name, Buffer.from(xml));
}
await writeFile(deck, writeZip(files, new Date()));
console.log(`slides: ${[...files.keys()].filter(k => /^ppt\/slides\/slide\d+\.xml$/.test(k)).length} slides, ${[...files.keys()].filter(k => /slideLayout\d+\.xml$/.test(k)).length} layouts, ${surf} surfaces and ${edge} edge lights as gradients`);

await buildDocuments(B, sizes, OUT);
console.log('documents: report and letter');

// email signature lockups: the group's keeps its original file name, so signatures already in use keep working
for (const b of BUSINESSES) await copyFile(join(B, `signature-${b.key}.png`), join(OUT, b.key === 'smedley-group' ? 'signature-lockup.png' : `signature-${b.key}.png`));
const base = 'https://smedley-group-advanced-technology.github.io/brand-book-sg/assets/templates/';
const sig = await readFile(join(HERE, 'email-signature.html'), 'utf8');
const signature = sig.replace('{{variants}}', BUSINESSES.map(b => `     ${b.name.padEnd(20)} ${base}${b.key === 'smedley-group' ? 'signature-lockup.png' : `signature-${b.key}.png`}  width ${Math.round(49 * sizes[b.key])}`).join('\n')).replaceAll('{{base}}', base).replaceAll('{{w}}', String(Math.round(49 * sizes['smedley-group'])));
await writeFile(join(OUT, 'email-signature.html'), signature);
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
    for (const format of Object.keys(m.FORMATS)) frames[format] = m.render({ format, type: 'headline', variant: 'band', business: 'smedley-group', ground: 'light', guides: true,
      comment: `Smedley Group social frame, ${m.FORMATS[format].w} x ${m.FORMATS[format].h}. Keep text inside the dashed safe area and delete the guides group before export. Easier: the post maker at https://smedley-group-advanced-technology.github.io/brand-book-sg/social/`,
      data: { ...m.defaults('headline', 'band'), kicker: 'Label', headline: 'Headline in sentence case', support: 'The strapline: the conclusion in one sentence', handle: '[website or handle]' } }, { logos });
    // the card in the book: three posts on the canvas grey
    const pic = async (o, h) => { const blob = await m.toPNG(m.render({ ...o, data: m.defaults(o.type, o.variant) }, { logos, fontCSS: fonts })); const img = new Image(); img.src = URL.createObjectURL(blob); await img.decode(); return img; };
    const a = await pic({ format: 'portrait', type: 'headline', variant: 'band', business: 'fat-racing', ground: 'light' }), b = await pic({ format: 'square', type: 'figure', business: 'advanced-technology', ground: 'dark' }), c = await pic({ format: 'story', type: 'date', business: 'insight-labs', ground: 'light' });
    const cv = document.createElement('canvas'); cv.width = 640; cv.height = 360; const x = cv.getContext('2d');
    x.fillStyle = '#F0F0F0'; x.fillRect(0, 0, 640, 360);
    const put = (img, px, py, h) => { const w = h * img.width / img.height; x.drawImage(img, px, py, w, h); x.strokeStyle = '#ABC0E4'; x.lineWidth = 1; x.strokeRect(px + .5, py + .5, w - 1, h - 1); };
    put(c, 452, 30, 300); put(a, 40, 38, 284); put(b, 240, 70, 222);
    return { frames, jpg: cv.toDataURL('image/jpeg', .88), webp: cv.toDataURL('image/webp', .82) };
  });
  await browser.close(); server.close();
  for (const [format, svg] of Object.entries(made.frames)) await writeFile(join(OUT, `social-${format}.svg`), svg);
  await writeFile(join(ROOT, 'assets/resources/thumb-social.jpg'), Buffer.from(made.jpg.split(',')[1], 'base64'));
  await writeFile(join(ROOT, 'assets/resources/thumb-social.webp'), Buffer.from(made.webp.split(',')[1], 'base64'));
  console.log('social: 4 frames and the preview');
}

// the signature card in the book: the signature as it reads in a message, on the Canvas
{
  const browser = await chromium.launch(); const page = await browser.newPage({ viewport: { width: 640, height: 360 }, deviceScaleFactor: 1 });
  const font = f => `url(data:font/woff2;base64,${f.toString('base64')}) format('woff2')`;
  const sora = [await readFile(join(ROOT, 'assets/fonts/sora-latin.woff2')), await readFile(join(ROOT, 'assets/fonts/sora-latin-ext.woff2'))];
  const lockup = 'data:image/png;base64,' + (await readFile(join(OUT, 'signature-lockup.png'))).toString('base64');
  await page.setContent(`<style>@font-face{font-family:Sora;font-weight:300 700;src:${font(sora[0])}}@font-face{font-family:Sora;font-weight:300 700;src:${font(sora[1])}}
    body{margin:0;width:640px;height:360px;background:#F0F0F0;font-family:Sora;display:grid;place-items:center}
    .m{width:540px;height:290px;box-sizing:border-box;padding:26px 30px;background:#fff;border:1px solid #D6DCE5;border-radius:12px}
    .h{font-size:11px;color:#333F50;padding:6px 0;border-bottom:1px solid #D6DCE5}.h b{display:inline-block;width:62px;font-weight:400;color:#44546A}
    p{font-size:12px;margin:14px 0 18px;color:#000}</style>
    <div class="m"><div class="h"><b>To</b>Maja Kowalczyk</div><div class="h"><b>Subject</b>Your F4 test day at Silverstone</div><p>Hi Maja, your test day is confirmed for Tuesday 8 December 2026.</p>${signature.replace(/<!--[\s\S]*?-->/, '').replace(/\[First Last\]/, 'Mateusz Jaśkiewicz').replace('[Role], [Business]', 'Head of engineering, Advanced Technology').replace('[+44 0000 000000]', '+44 20 7946 0000').replaceAll('[name]', 'mateusz.jaskiewicz').replace(/src="[^"]+"/, `src="${lockup}"`)}</div>`);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: join(ROOT, 'assets/resources/thumb-signature.jpg'), type: 'jpeg', quality: 88 });
  await browser.close();
  // the WebP from the JPEG, drawn on a canvas
  const b2 = await chromium.launch(); const p2 = await b2.newPage();
  const jpg = 'data:image/jpeg;base64,' + (await readFile(join(ROOT, 'assets/resources/thumb-signature.jpg'))).toString('base64');
  const w = await p2.evaluate(async src => { const i = new Image(); i.src = src; await i.decode(); const c = document.createElement('canvas'); c.width = 640; c.height = 360; c.getContext('2d').drawImage(i, 0, 0); return c.toDataURL('image/webp', .82); }, jpg);
  await b2.close();
  await writeFile(join(ROOT, 'assets/resources/thumb-signature.webp'), Buffer.from(w.split(',')[1], 'base64'));
  console.log('signature: preview refreshed');
}

// LibreOffice renders the previews: give it Sora through a private font configuration, mapping the face names the
// templates use (Sora Light, Sora SemiBold) onto the variable font's weights, so the system fonts stay untouched
function soraFontconfig() {
  const dir = join(tmpdir(), 'sg-templates-fonts'); execFileSync('mkdir', ['-p', dir]);
  // decompressed in the temporary folder, so nothing is written next to the book's fonts
  for (const f of ['sora-latin', 'sora-latin-ext']) { execFileSync('cp', [join(ROOT, 'assets/fonts', `${f}.woff2`), dir]); execFileSync('woff2_decompress', [join(dir, `${f}.woff2`)]); }
  const alias = (name, weight) => `<match target="pattern"><test name="family"><string>${name}</string></test><edit name="family" mode="assign" binding="strong"><string>Sora</string></edit><edit name="weight" mode="assign"><const>${weight}</const></edit></match>`;
  const conf = join(dir, 'fonts.conf');
  return writeFile(conf, `<?xml version="1.0"?><!DOCTYPE fontconfig SYSTEM "fonts.dtd"><fontconfig><include ignore_missing="yes">/etc/fonts/fonts.conf</include><dir>${dir}</dir><cachedir>${dir}/cache</cachedir>${alias('Sora Light', 'light')}${alias('Sora SemiBold', 'semibold')}</fontconfig>`).then(() => conf);
}

// preview thumbnails for the book's Resources section, when LibreOffice is available
try {
  const pdf = join(B, 'pdf'); await mkdir(pdf); let conf; try { conf = await soraFontconfig(); } catch { conf = undefined; }
  for (const f of ['smedley-group-slides.pptx', 'smedley-group-document.docx', 'smedley-group-letter.docx'])
    execFileSync('soffice', ['--headless', '--convert-to', 'pdf', '--outdir', pdf, join(OUT, f)], { stdio: 'ignore', timeout: 120000, env: conf ? { ...process.env, FONTCONFIG_FILE: conf } : process.env });
  execFileSync('pdftoppm', ['-png', '-r', '110', '-f', '1', '-l', '1', join(pdf, 'smedley-group-slides.pdf'), join(pdf, 'slides')]);
  execFileSync('pdftoppm', ['-png', '-r', '60', '-f', '1', '-l', '1', join(pdf, 'smedley-group-document.pdf'), join(pdf, 'report')]);
  execFileSync('pdftoppm', ['-png', '-r', '60', '-f', '1', '-l', '1', join(pdf, 'smedley-group-letter.pdf'), join(pdf, 'letter')]);
  await thumbnails(pdf);
  console.log('previews: slides and documents thumbnails refreshed');
} catch (e) { console.log('previews: LibreOffice not found or failed, thumbnails left as they are: ' + e.message.split('\n')[0]); }

execFileSync('node', [join(ROOT, 'tools/kit.mjs')], { stdio: 'inherit' });
