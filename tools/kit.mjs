// The brand kit: tokens.css and the tool icons are generated, the ZIP bundles them with the logos and
// templates, and the book's download card states the ZIP's file count and size.
//   npm run kit    rebuild everything after changing tokens.json, an icon in the book, a logo or a template
// tokens.json is the source for colours; the book's tool icons are the source for assets/icons.
// tests/check.mjs imports the same functions and fails if anything has drifted.
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateRawSync, inflateRawSync, crc32 } from 'node:zlib';

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

// the tool icons exactly as the book draws them
export function iconsFromBook(html) {
  const out = {};
  for (const m of html.matchAll(/<figure class="tl"><div class="kg"><svg class="tool" viewBox="0 0 24 24"[^>]*>(.*?)<\/svg><\/div><figcaption>([^<]+)<\/figcaption>/gs)) {
    const [, body, name] = m;
    out[name.toLowerCase().replace(/ /g, '-') + '.svg'] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><title>${name}</title>${body}</svg>`;
  }
  return out;
}

// every file the ZIP should hold, by its path inside the ZIP, as it should read
export async function kitFiles() {
  const html = await readFile(join(ROOT, 'index.html'), 'utf8');
  const tokens = await readFile(join(A, 'tokens.json'), 'utf8');
  const files = new Map();
  for (const f of (await readdir(join(A, 'logo'))).sort()) files.set('logo/' + f, await readFile(join(A, 'logo', f)));
  files.set('tokens.css', Buffer.from(tokensCss(JSON.parse(tokens))));
  files.set('tokens.json', Buffer.from(tokens));
  for (const [f, svg] of Object.entries(iconsFromBook(html)).sort()) files.set('icons/' + f, Buffer.from(svg));
  for (const f of (await readdir(join(A, 'templates'))).sort()) files.set('templates/' + f, await readFile(join(A, 'templates', f)));
  return files;
}

export const bookVersion = html => {
  const m = html.match(/Version (\d+\.\d+), (\d+) (\w+) (\d{4})\./);
  return m && { v: m[1], date: new Date(`${m[2]} ${m[3]} ${m[4]} 12:00`) };
};
export const kitStat = (count, bytes, v) => `<div class="rstat"><span><b>${count}</b>files</span><span><b>${Math.round(bytes / 1024)} KB</b>ZIP</span><span><b>v${v}</b>version</span></div>`;
export const STAT = /<div class="rstat">.*?<\/div>/;

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
  const htmlPath = join(ROOT, 'index.html'); let html = await readFile(htmlPath, 'utf8');
  const { v, date } = bookVersion(html);
  const zip = writeZip(files, date);
  await writeFile(ZIP, zip);
  html = html.replace(STAT, kitStat(files.size, zip.length, v));
  await writeFile(htmlPath, html);
  console.log(`kit: ${files.size} files, ${Math.round(zip.length / 1024)} KB, v${v}`);
}
