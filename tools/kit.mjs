// The brand kit: tokens.css and the tool icons are generated, the ZIP bundles them with the logos and
// templates, and the book's download card states the ZIP's file count and size.
//   npm run kit    rebuild everything after changing tokens.json, an icon in the book, a logo or a template
// tokens.json is the source for colours; the book's tool icons are the source for assets/icons.
// tests/check.mjs imports the same functions and fails if anything has drifted.
import { readFile, writeFile, readdir, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateRawSync, inflateRawSync, crc32 } from 'node:zlib';
import { createHash } from 'node:crypto';
import { ICONS, svgOf, sprite, bodyOf } from '../icons/library.js';

export const ROOT = fileURLToPath(new URL('..', import.meta.url));
export const A = join(ROOT, 'assets');
export const ZIP = join(A, 'smedley-group-brand-assets.zip');

export function tokensCss(t) {
  const block = (o, pad) => Object.entries(o).map(([k, v]) => `${pad}--sg-${k}:${v};\n`).join('');
  return '/* Smedley Group colour tokens. Fixed colours never change; the rest follow the theme. */\n'
    + ':root{\n' + block(t.fixed, '  ') + block(t.dark, '  ') + '}\n'
    + '@media (prefers-color-scheme: light){\n  :root:not([data-theme="dark"]){\n' + block(t.light, '    ') + '  }\n}\n'
    + ':root[data-theme="light"]{\n' + block(t.light, '  ') + '}\n'
    + `/* The cut: every accent end leans at ${t.angle.degrees} degrees. cut = height x ${t.angle.cutPerHeight} */\n`
    + `.sg-cut{clip-path:polygon(0 0,calc(100% - var(--sg-h,44px) * ${String(t.angle.cutPerHeight).replace(/^0/, '')}) 0,100% 100%,calc(var(--sg-h,44px) * ${String(t.angle.cutPerHeight).replace(/^0/, '')}) 100%)}\n`;
}

// the book's tool figures draw from the icon library: this puts each library drawing into its figure
// every icon in the pages names its library drawing (data-icon="name"); this redraws each from the library
export const ICON_PAGES = ['index.html', 'assets/mark.html', 'social/index.html', 'icons/index.html'];
export const syncIcons = html => html.replace(/(<svg[^>]*\bdata-icon="([\w-]+)"[^>]*>)(.*?)(<\/svg>)/gs, (all, open, name, body, close) => { const b = bodyOf(name); return b ? open + b + close : all; });
// the book says how many icons the library holds
export const iconCount = html => html.replace(/\b\d+ icons in one style/g, `${ICONS.length} icons in one style`);
export const syncBookTools = html => html.replace(/(<figure class="tl"><div class="kg"><svg class="tool" viewBox="0 0 24 24"[^>]*>)(.*?)(<\/svg><\/div><figcaption>([^<]+)<\/figcaption>)/gs,
  (all, open, body, close, name) => { const b = bodyOf(name.toLowerCase().replace(/ /g, '-')); return b ? open + b + close : all; });

// every file the ZIP should hold, by its path inside the ZIP, as it should read
export async function kitFiles() {
  const tokens = await readFile(join(A, 'tokens.json'), 'utf8');
  const files = new Map();
  for (const f of (await readdir(join(A, 'logo'))).sort()) files.set('logo/' + f, await readFile(join(A, 'logo', f)));
  files.set('tokens.css', Buffer.from(tokensCss(JSON.parse(tokens))));
  files.set('tokens.json', Buffer.from(tokens));
  for (const ic of [...ICONS].sort((a, b) => a[0].localeCompare(b[0]))) files.set(`icons/${ic[0]}.svg`, Buffer.from(svgOf(ic)));
  files.set('icons/sprite.svg', Buffer.from(sprite()));
  for (const f of (await readdir(join(A, 'templates'))).sort()) files.set('templates/' + f, await readFile(join(A, 'templates', f)));
  return files;
}

export const bookVersion = html => {
  const m = html.match(/Version (\d+\.\d+), (\d+) (\w+) (\d{4})\./);
  return m && { v: m[1], date: new Date(`${m[2]} ${m[3]} ${m[4]} 12:00`) };
};
export const kitStat = (count, bytes, v) => `<div class="rstat"><span><b>${count}</b>files</span><span><b>${Math.round(bytes / 1024)} KB</b>ZIP</span><span><b>v${v}</b>version</span></div>`;
export const STAT = /<div class="rstat">.*?<\/div>/;

// the size printed on each download button in the book, from the file itself
const DL = /(<a class="dlb" href="(assets\/[^"]+)" download>(?:(?!<\/a>).)*?<span class="dlt"><b>[^<]*<\/b><span>)([A-Z0-9]+), (\d+) KB(<\/span>)/gs;
export async function downloadLabels(html) {
  const wrong = []; let out = html;
  for (const m of html.matchAll(DL)) {
    let size; try { size = (await readFile(join(ROOT, m[2]))).length; } catch { wrong.push(`${m[2]} is linked but missing`); continue; }
    const kb = Math.max(1, Math.round(size / 1024)), type = m[2].split('.').pop().toUpperCase();
    if (Number(m[4]) !== kb || m[3] !== type) { wrong.push(`${m[2]} reads ${m[3]}, ${m[4]} KB, is ${type}, ${kb} KB`); out = out.replace(m[0], `${m[1]}${type}, ${kb} KB${m[5]}`); }
  }
  return { html: out, wrong };
}

// ---------- the book's controls as a stylesheet other pages can use ----------
// assets/ui.css is cut from the book: its tokens and themes, the animated properties and keyframes the
// controls need, and the whole Controls group. The social post maker links it; the check keeps it current.
export function uiCss(html) {
  const css = html.slice(html.indexOf('<style>') + 7, html.indexOf('</style>'));
  const out = [], KEEP_BASE = /^(select\.inp|button, input, select, textarea|::selection)/;
  let group = '', i = 0;
  while (i < css.length) {
    const ws = css.slice(i).match(/^\s+/); if (ws) { i += ws[0].length; continue; }
    if (css.startsWith('/*', i)) { const e = css.indexOf('*/', i) + 2, c = css.slice(i, e); const g = c.match(/\/\* =+ (.*?) =+ \*\//); if (g) group = g[1]; i = e; continue; }
    // one top-level statement, braces balanced
    let j = css.indexOf('{', i), depth = 0, k = j;
    for (; k < css.length; k++) { if (css[k] === '{') depth++; else if (css[k] === '}' && --depth === 0) break; }
    const stmt = css.slice(i, k + 1).trim(), head = css.slice(i, j).trim(); i = k + 1;
    const keep = group === 'Controls'
      || (group === 'Tokens and themes' && (/^:root/.test(head) || (/^@media \(prefers-color-scheme/.test(head) && stmt.includes(':root')) || /^@property/.test(head) || /^@keyframes (ld|pop|popk|streak)\b/.test(head)))
      || (group === 'Base' && KEEP_BASE.test(head));
    if (keep) out.push(stmt);
  }
  return '/* Smedley Group controls, cut from the brand book by npm run kit. Do not edit: change the book and rebuild. */\n'
    + out.join('\n') + '\n';
}

// ---------- cache stamps for the post maker ----------
// Browsers keep scripts for a while, so a new page could run an old script. Each file the maker loads is
// addressed with a stamp of its content: change the file and the address changes with it.
const stamp = s => createHash('sha1').update(s).digest('hex').slice(0, 10);
export const PAGES = [['social', 'maker.js'], ['icons', 'page.js']];
export async function pageStamps() {
  const read = p => readFile(join(ROOT, p), 'utf8'), out = {};
  for (const [dir, entry] of PAGES) {
    // every script the page's entry imports, then the entry itself, then the stylesheets it links
    let js = await read(`${dir}/${entry}`);
    for (const [, p] of [...js.matchAll(/from '(\.\.?\/[^'?]+\.js)(?:\?v=\w+)?'/g)]) {
      const s = stamp(await read(join(dir, p)));
      js = js.replace(new RegExp(`from '${p.replace(/[.\/]/g, m => '\\' + m)}(\\?v=\\w+)?'`), `from '${p}?v=${s}'`);
    }
    let page = await read(`${dir}/index.html`);
    page = page.replace(new RegExp(`src="${entry.replace('.', '\\.')}(\\?v=\\w+)?"`), `src="${entry}?v=${stamp(js)}"`);
    for (const [, css] of [...page.matchAll(/href="\.\.\/assets\/([\w/.-]+\.css)(?:\?v=\w+)?"/g)])
      page = page.replace(new RegExp(`href="\\.\\./assets/${css.replace(/[.\/]/g, m => '\\' + m)}(\\?v=\\w+)?"`), `href="../assets/${css}?v=${stamp(await read('assets/' + css))}"`);
    out[`${dir}/${entry}`] = js; out[`${dir}/index.html`] = page;
  }
  return out;
}

// ---------- the Claude skill ----------
// skills/smedley-group-ui holds the hand-written guidance; the kit adds what must match the book exactly
// (the tokens and icon references, the book's stylesheet, tokens, sprite and fonts) and zips it for Resources.
export const SKILL = join(ROOT, 'skills/smedley-group-ui');
export const SKILL_ZIP = join(A, 'skills/smedley-group-ui.zip');
export async function skillGenerated(html) {
  const t = JSON.parse(await readFile(join(A, 'tokens.json'), 'utf8')), g = new Map();
  const rows = o => Object.entries(o).map(([k, v]) => `| \`--sg-${k}\` | ${v} |`).join('\n');
  g.set('references/tokens.md', `# Colour and theme tokens\n\nGenerated from the brand book's tokens.json by npm run kit. Use the CSS in \`assets/tokens.css\`.\n\n## Fixed colours, the same in both themes\n\n| Token | Value |\n|---|---|\n${rows(t.fixed)}\n\n## Dark theme (the default)\n\n| Token | Value |\n|---|---|\n${rows(t.dark)}\n\n## Light theme\n\n| Token | Value |\n|---|---|\n${rows(t.light)}\n\n## The cut\n\n${t.angle.degrees} degrees; the cut is the height x ${t.angle.cutPerHeight}. Type: ${t.type.display} and ${t.type.readout}.\n`);
  const fam = Object.fromEntries((await import('../icons/library.js')).FAMILIES);
  g.set('references/icons.md', `# Icon catalogue\n\nGenerated from the brand book's icon library by npm run kit: ${ICONS.length} icons, 24 px grid, 1.5 px stroke, square ends, sharp corners, diagonals at 55 degrees. Use \`assets/sprite.svg\`: \`<svg viewBox="0 0 24 24"><use href="sprite.svg#sg-NAME"/></svg>\`.\n\n| Name | Label | Family | Search words |\n|---|---|---|---|\n${ICONS.map(i => `| \`${i[0]}\` | ${i[1]} | ${fam[i[2]]} | ${i[3]} |`).join('\n')}\n`);
  g.set('assets/ui.css', uiCss(html));
  g.set('assets/tokens.css', tokensCss(t));
  g.set('assets/sprite.svg', sprite());
  for (const f of (await readdir(join(A, 'fonts'))).sort()) g.set(`assets/fonts/${f}`, await readFile(join(A, 'fonts', f)));
  return new Map([...g].map(([k, v]) => [k, Buffer.isBuffer(v) ? v : Buffer.from(v)]));
}
async function* walkFiles(dir, base = dir) {
  for (const e of (await readdir(dir, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
    const p = join(dir, e.name); if (e.isDirectory()) yield* walkFiles(p, base); else yield [p.slice(base.length + 1), p];
  }
}
export async function skillFiles() { const m = new Map(); for await (const [rel, p] of walkFiles(SKILL)) m.set('smedley-group-ui/' + rel, await readFile(p)); return m; }

// ---------- a small ZIP writer and reader, deflate only ----------
export function writeZip(files, date) {
  const time = (date.getHours() << 11) | (date.getMinutes() << 5), day = ((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
  const local = [], central = []; let offset = 0;
  for (const [name, data] of files) {
    const n = Buffer.from(name), z = deflateRawSync(data, { level: 9 }), c = crc32(data);
    const h = Buffer.alloc(30); h.writeUInt32LE(0x04034b50, 0); h.writeUInt16LE(20, 4); h.writeUInt16LE(0x0800, 6); h.writeUInt16LE(8, 8);
    h.writeUInt16LE(time, 10); h.writeUInt16LE(day, 12); h.writeUInt32LE(c, 14); h.writeUInt32LE(z.length, 18); h.writeUInt32LE(data.length, 22); h.writeUInt16LE(n.length, 26);
    const e = Buffer.alloc(46); e.writeUInt32LE(0x02014b50, 0); e.writeUInt16LE(20, 4); e.writeUInt16LE(20, 6); h.copy(e, 8, 6, 30); e.writeUInt32LE(offset, 42);
    local.push(h, n, z); central.push(e, n); offset += 30 + n.length + z.length;
  }
  const cd = Buffer.concat(central), end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(files.size, 8); end.writeUInt16LE(files.size, 10); end.writeUInt32LE(cd.length, 12); end.writeUInt32LE(offset, 16);
  return Buffer.concat([...local, cd, end]);
}
export function readZip(buf) {
  const e = buf.lastIndexOf(Buffer.from([0x50, 0x4b, 0x05, 0x06])), n = buf.readUInt16LE(e + 10), out = new Map();
  for (let i = 0, p = buf.readUInt32LE(e + 16); i < n; i++) {
    const method = buf.readUInt16LE(p + 10), size = buf.readUInt32LE(p + 20), nl = buf.readUInt16LE(p + 28), xl = buf.readUInt16LE(p + 30), cl = buf.readUInt16LE(p + 32), off = buf.readUInt32LE(p + 42);
    const name = buf.toString('utf8', p + 46, p + 46 + nl), start = off + 30 + buf.readUInt16LE(off + 26) + buf.readUInt16LE(off + 28);
    const raw = buf.subarray(start, start + size);
    out.set(name, method === 8 ? inflateRawSync(raw) : raw);
    p += 46 + nl + xl + cl;
  }
  return out;
}

// ---------- build ----------
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const files = await kitFiles();
  await writeFile(join(A, 'tokens.css'), files.get('tokens.css'));
  for (const [k, v] of files) if (k.startsWith('icons/')) await writeFile(join(A, k), v);
  const htmlPath = join(ROOT, 'index.html'); let html = syncBookTools(await readFile(htmlPath, 'utf8'));
  const { v, date } = bookVersion(html);
  for (const [k, v] of await skillGenerated(html)) { await mkdir(join(SKILL, k, '..'), { recursive: true }); await writeFile(join(SKILL, k), v); }
  await mkdir(join(A, 'skills'), { recursive: true }); await writeFile(SKILL_ZIP, writeZip(await skillFiles(), date));
  const zip = writeZip(files, date);
  await writeFile(ZIP, zip);
  html = html.replace(STAT, kitStat(files.size, zip.length, v));
  html = (await downloadLabels(html)).html;
  html = iconCount(html);
  html = syncIcons(html);
  for (const f of ICON_PAGES.slice(1)) await writeFile(join(ROOT, f), syncIcons(await readFile(join(ROOT, f), 'utf8')));
  await writeFile(join(A, 'ui.css'), uiCss(html));
  for (const [f, s] of Object.entries(await pageStamps())) await writeFile(join(ROOT, f), s);
  await writeFile(htmlPath, html);
  console.log(`kit: ${files.size} files, ${Math.round(zip.length / 1024)} KB, v${v}`);
}
