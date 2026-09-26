// Guardrails for the brand book. Serves the repo, then for each browser checks console errors,
// failed requests, broken links and anchors, duplicate IDs, horizontal overflow on phones,
// accessibility (axe, WCAG 2.1 AA), requests to other sites and the key interactions. Also checks that
// tokens.json, the book's colours, the generated kit files, the ZIP and its download card agree. Also scans the text files for em dashes.
//   npm run check                   every browser
//   BROWSERS=chromium npm run check just one
import { createServer } from 'node:http';
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import * as pw from 'playwright';
import { kitFiles, readZip, tokensCss, bookVersion, kitStat, STAT, ZIP, downloadLabels, uiCss, pageStamps, syncBookTools, iconCount, syncIcons, ICON_PAGES } from '../tools/kit.mjs';
import { ICONS } from '../icons/library.js';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const AXE = await readFile(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8');
const BROWSERS = (process.env.BROWSERS || 'chromium,firefox,webkit').split(',');
const failures = [];
const fail = (where, msg) => { failures.push(`${where}: ${msg}`); console.log(`  FAIL ${msg}`); };
const ok = msg => console.log(`  ok   ${msg}`);

// ---------- text files: no em dashes ----------
console.log('text');
const TEXT = new Set(['.html', '.css', '.js', '.mjs', '.json', '.md', '.svg', '.yml']);
const skip = new Set(['.git', 'node_modules', 'drift-assets']);
async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    if (skip.has(e.name) || e.name === 'drift-mark.html') continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p); else if (TEXT.has(extname(e.name))) yield p;
  }
}
const EM = String.fromCharCode(0x2014);
let dashes = 0;
for await (const f of walk(ROOT)) {
  if (f.endsWith('package-lock.json')) continue;
  const lines = (await readFile(f, 'utf8')).split('\n');
  lines.forEach((l, i) => { if (l.includes(EM)) { dashes++; fail('text', `em dash in ${f.slice(ROOT.length)}:${i + 1}`); } });
}
if (!dashes) ok('no em dashes');

// ---------- the kit agrees with the book ----------
console.log('kit');
{
  const html = await readFile(join(ROOT, 'index.html'), 'utf8');
  const tokens = JSON.parse(await readFile(join(ROOT, 'assets/tokens.json'), 'utf8'));
  const K = msg => fail('kit', msg);
  let bad = failures.length;
  // the book's own theme variables, outside print and other media queries except the system light theme
  const css = html.slice(html.indexOf('<style>'), html.indexOf('</style>'));
  const topLevel = []; let depth = 0, media = '', start = 0;
  for (let i = 0; i < css.length; i++) {
    if (css[i] === '{') { const pre = css.slice(start, i).trim(); if (pre.startsWith('@')) { media = pre; depth++; start = i + 1; continue; } topLevel.push({ media: depth ? media : '', sel: pre.replace(/^.*[}]/s, '').trim(), i }); }
    if (css[i] === '}') { const last = topLevel[topLevel.length - 1]; if (last && last.end === undefined && last.i < i && !css.slice(last.i + 1, i).includes('{')) last.end = i; else if (depth) { depth--; media = ''; } }
    if (css[i] === '{' || css[i] === '}') start = i + 1;
  }
  const vars = (sel, med = '') => { const r = topLevel.find(b => b.sel === sel && b.media === med && /--ink:/.test(css.slice(b.i, b.end))); if (!r) return null;
    return Object.fromEntries([...css.slice(r.i + 1, r.end).matchAll(/(--[\w-]+):([^;}]+)/g)].map(m => [m[1], m[2].trim()])); };
  const MAP = { ink: '--ink', inv: '--inv', ground: '--bg1', dim: '--dim', faint: '--faint', rule: '--rule', flame: '--flame', line: '--line', green: '--green', amber: '--amber' };
  const cmp = (label, v, want) => { for (const [k, p] of Object.entries(MAP)) if (!v || (v[p] || '').toUpperCase() !== want[k].toUpperCase()) K(`${label} ${p} is ${v && v[p]}, tokens.json says ${want[k]}`); };
  cmp('dark theme', vars(':root'), tokens.dark);
  cmp('light theme', vars(':root[data-theme="light"]'), tokens.light);
  cmp('system light theme', vars(':root:not([data-theme="dark"])', '@media (prefers-color-scheme:light)') || vars(':root:not([data-theme="dark"])', '@media (prefers-color-scheme: light)'), tokens.light);
  const root = vars(':root') || {};
  if ((root['--red'] || '').toUpperCase() !== tokens.fixed['race-red']) K(`--red is ${root['--red']}, tokens.json says ${tokens.fixed['race-red']}`);
  if ((root['--blue'] || '').toUpperCase() !== tokens.fixed['engineering-blue']) K(`--blue is ${root['--blue']}, tokens.json says ${tokens.fixed['engineering-blue']}`);
  for (const [k, hex] of Object.entries(tokens.fixed)) {
    const name = k.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
    const m = html.match(new RegExp(`\\['${name}','(#[0-9A-Fa-f]{6})'`));
    if (!m) K(`no swatch named ${name} in the colour section`); else if (m[1].toUpperCase() !== hex.toUpperCase()) K(`swatch ${name} shows ${m[1]}, tokens.json says ${hex}`);
  }
  // generated files, the ZIP and the download card
  const want = await kitFiles();
  for (const k of ['tokens.css', ...[...want.keys()].filter(k => k.startsWith('icons/'))]) {
    let disk = null; try { disk = await readFile(join(ROOT, 'assets', k)); } catch {}
    if (!disk || !disk.equals(want.get(k))) K(`assets/${k} is out of date, run npm run kit`);
  }
  const zipBuf = await readFile(ZIP), have = readZip(zipBuf);
  for (const [k, v] of want) { const got = have.get(k); if (!got) K(`ZIP is missing ${k}, run npm run kit`); else if (!got.equals(v)) K(`ZIP holds an old ${k}, run npm run kit`); }
  for (const k of have.keys()) if (!want.has(k)) K(`ZIP holds ${k}, which is no longer in assets, run npm run kit`);
  const bv = bookVersion(html), stat = (html.match(STAT) || [''])[0];
  if (!bv) K('no "Version x.y, d Month yyyy." line in the book');
  else if (stat !== kitStat(have.size, zipBuf.length, bv.v)) K(`download card reads ${stat.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()}, expected ${have.size} files, ${Math.round(zipBuf.length / 1024)} KB, v${bv.v}; run npm run kit`);
  { let ui = ''; try { ui = await readFile(join(ROOT, 'assets/ui.css'), 'utf8'); } catch {} if (ui !== uiCss(html)) K('assets/ui.css no longer matches the book\'s controls, run npm run kit'); }
  for (const [f, s] of Object.entries(await pageStamps())) if (s !== await readFile(join(ROOT, f), 'utf8')) K(`${f} has out-of-date cache stamps, run npm run kit`);
  if (syncBookTools(html) !== html) K('the book\'s tool icons differ from the icon library, run npm run kit');
  if (iconCount(html) !== html) K('the book gives the wrong number of icons, run npm run kit');
  // every icon on the 24 px grid names its library drawing and matches it, so refining an icon updates it everywhere
  { const stray = [];
    for (const f of ICON_PAGES) {
      const s = await readFile(join(ROOT, f), 'utf8');
      if (syncIcons(s) !== s) stray.push(`${f}: an icon differs from its library drawing, run npm run kit`);
      for (const m of s.matchAll(/<svg([^>]*viewBox="0 0 24 24"[^>]*)>(.*?)<\/svg>/gs)) if (!/data-icon=|class="tool"|id="sicon"/.test(m[1]) && m[2]) stray.push(`${f}: an icon without data-icon: ${m[2].slice(0, 40)}`);
    }
    stray.length ? stray.slice(0, 5).forEach(s => K(s)) : ok('every icon comes from the icon library'); }
  for (const w of (await downloadLabels(html)).wrong) K(`download button for ${w}; run npm run kit`);
  if (failures.length === bad) ok(`tokens, book, generated files and the ${have.size}-file ZIP agree, download sizes are right`);
}

// ---------- static server ----------
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.ico': 'image/x-icon', '.zip': 'application/zip',
  '.pptx': 'application/octet-stream', '.docx': 'application/octet-stream', '.woff2': 'font/woff2' };
const server = createServer(async (req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
  let file = join(ROOT, path);
  try { if ((await stat(file)).isDirectory()) file = join(file, 'index.html'); res.writeHead(200, { 'content-type': TYPES[extname(file)] || 'application/octet-stream' }); res.end(await readFile(file)); }
  catch { res.writeHead(404); res.end(); }
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const BASE = `http://127.0.0.1:${server.address().port}`;
const URL_ = BASE + '/index.html';

// ---------- per browser ----------
for (const name of BROWSERS) {
  console.log(name);
  let browser;
  try { browser = await pw[name].launch(); } catch (e) { fail(name, 'could not launch: ' + e.message.split('\n')[0]); continue; }
  const W = (where, msg) => fail(`${name} ${where}`, msg);

  const open = async (theme, width, extra = {}) => {
    const phone = width < 800;
    const ctx = await browser.newContext({ viewport: { width, height: phone ? 844 : 900 }, colorScheme: theme, reducedMotion: 'reduce',
      ...(phone && name !== 'firefox' ? { isMobile: true, hasTouch: true } : {}), ...extra });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('requestfailed', r => { if (r.url().startsWith(BASE)) errors.push('request failed ' + r.url().slice(BASE.length)); });
    page.on('request', r => { const u = r.url(); if (!u.startsWith(BASE) && !/^(data|blob|about):/.test(u)) errors.push('third-party request ' + u.split('?')[0]); });
    page.on('response', r => { if (r.url().startsWith(BASE) && r.status() >= 400) errors.push(`${r.status()} ${r.url().slice(BASE.length)}`); });
    await page.goto(URL_, { waitUntil: 'load' });
    await page.waitForTimeout(1500);
    return { ctx, page, errors };
  };

  for (const [theme, width] of [['dark', 1440], ['light', 1440], ['light', 390], ['dark', 320]]) {
    const where = `${theme} ${width}`;
    const { ctx, page, errors } = await open(theme, width);
    // scroll through so lazy images and iframes load
    await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += innerHeight) { scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); } scrollTo(0, 0); });
    await page.waitForTimeout(800);

    const got = await page.evaluate(() => document.documentElement.dataset.theme);
    got === theme ? ok(`${where} theme follows the system`) : W(where, `theme is ${got}, expected ${theme}`);

    const sw = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
    sw[0] <= sw[1] ? ok(`${where} no horizontal overflow`) : W(where, `page is ${sw[0]} px wide in a ${sw[1]} px viewport`);

    const broken = await page.evaluate(() => [...document.images].filter(i => i.getAttribute('src') && i.complete && i.naturalWidth === 0 && !i.closest('[hidden]')).map(i => i.currentSrc || i.src));
    broken.length ? W(where, 'images that failed to decode: ' + broken.join(', ')) : ok(`${where} every image decodes`);

    if (width === 1440 && theme === 'dark') {
      const dup = await page.evaluate(() => { const c = {}; document.querySelectorAll('[id]').forEach(e => c[e.id] = (c[e.id] || 0) + 1); return Object.keys(c).filter(k => c[k] > 1); });
      dup.length ? W(where, 'duplicate ids: ' + dup.join(', ')) : ok('ids are unique');

      const anchors = await page.evaluate(() => [...document.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute('href')).filter(h => h.length > 1 && !document.getElementById(decodeURIComponent(h.slice(1)))));
      anchors.length ? W(where, 'links to missing anchors: ' + [...new Set(anchors)].join(', ')) : ok('every in-page link has a target');

      const local = await page.evaluate(() => [...new Set([...document.querySelectorAll('a[href],img[src],source[srcset],iframe[src],link[href],script[src]')]
        .flatMap(e => (e.getAttribute('href') || e.getAttribute('src') || e.getAttribute('srcset')).split(',').map(s => s.trim().split(/\s+/)[0]))
        .filter(u => u && !/^(#|[a-z]+:|\/\/)/i.test(u)))]);
      const missing = [];
      for (const u of local) { const r = await page.request.get(new URL(u, URL_).href); if (!r.ok()) missing.push(u); }
      missing.length ? W(where, 'missing files: ' + missing.join(', ')) : ok(`all ${local.length} local files exist`);
    }

    if (name === 'chromium' && width !== 320) {
      await page.addScriptTag({ content: AXE });
      const v = await page.evaluate(async () => (await axe.run(document, { resultTypes: ['violations'], runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] } }))
        .violations.map(v => `${v.id} x${v.nodes.length} (${v.nodes.slice(0, 3).map(n => n.target.join(' ')).join('; ')})`));
      v.length ? v.forEach(x => W(where, 'axe ' + x)) : ok(`${where} axe finds no violations`);
    }

    errors.length ? W(where, 'console: ' + [...new Set(errors)].join(' | ')) : ok(`${where} no console errors`);
    await ctx.close();
  }

  // ---------- interactions ----------
  {
    const where = 'interactions';
    const { ctx, page, errors } = await open('dark', 1440, { reducedMotion: 'no-preference' });
    const step = async (label, fn) => { try { const r = await fn(); r === true ? ok(label) : W(where, `${label}: ${r}`); } catch (e) { W(where, `${label}: ${e.message.split('\n')[0]}`); } };

    await step('primary button runs its highlight on click', async () => {
      const b = page.locator('#components .kit .cell .btn.p').first(); await b.scrollIntoViewIfNeeded(); await b.click();
      return (await b.evaluate(x => x.classList.contains('flash'))) || 'no flash class';
    });
    await step('hold to confirm completes', async () => {
      const b = page.locator('#holdBtn'); await b.scrollIntoViewIfNeeded(); const before = await b.textContent();
      await b.hover(); await page.mouse.down(); await page.waitForTimeout(1400); await page.mouse.up();
      return (await b.textContent()) !== before || 'label did not change';
    });
    await step('tabs move their indicator', async () => {
      const i = page.locator('.tabind'); const a = await i.evaluate(x => x.getBoundingClientRect().left);
      await page.locator('#tabs button').nth(1).click(); await page.waitForTimeout(500);
      return (await i.evaluate(x => x.getBoundingClientRect().left)) !== a || 'indicator did not move';
    });
    await step('calendar selects a range', async () => {
      await page.locator('#calDays button').nth(9).click();
      return /Selected/.test(await page.textContent('#calNote')) || 'note not updated';
    });
    await step('TalentID switches driver', async () => {
      const n = await page.textContent('#tName'); await page.locator('#tRank button[data-i="5"]').click();
      return (await page.textContent('#tName')) !== n || 'name unchanged';
    });
    await step('search finds sections and jumps', async () => {
      await page.fill('#srch', 'kerb'); await page.waitForTimeout(200);
      const n = await page.locator('#srchr a').count(); if (!n) return 'no results';
      await page.keyboard.press('Enter'); await page.waitForTimeout(800);
      return (await page.evaluate(() => location.hash)).length > 1 || 'no jump';
    });
    await step('showcase opens and closes the lightbox', async () => {
      const s = page.locator('.scb').first(); await s.scrollIntoViewIfNeeded(); await s.click(); await page.waitForTimeout(300);
      if (!(await page.evaluate(() => document.querySelector('dialog.lbx').open))) return 'did not open';
      await page.keyboard.press('Escape'); await page.waitForTimeout(200);
      return !(await page.evaluate(() => document.querySelector('dialog.lbx').open)) || 'did not close';
    });
    await step('theme switch reaches the page and the hero', async () => {
      await page.locator('.themes button[data-t=light]').click(); await page.waitForTimeout(400);
      const t = await page.evaluate(() => [document.documentElement.dataset.theme, document.querySelector('.cover iframe').contentDocument.documentElement.dataset.theme]);
      return (t[0] === 'light' && t[1] === 'light') || 'got ' + t.join('/');
    });
    errors.length ? W(where, 'console: ' + [...new Set(errors)].join(' | ')) : ok('no console errors while interacting');
    await ctx.close();

    const m = await open('dark', 390);
    await (async () => {
      const w = 'phone menu';
      try {
        await m.page.locator('#mbtn').click(); await m.page.waitForTimeout(300);
        if (!(await m.page.evaluate(() => document.querySelector('.index').classList.contains('open')))) return W(w, 'menu did not open');
        await m.page.locator('#toc a[href="#calendar-sec"]').click(); await m.page.waitForTimeout(1200);
        const closed = !(await m.page.evaluate(() => document.querySelector('.index').classList.contains('open')));
        const cur = await m.page.textContent('#mcur');
        closed && /Calendar/.test(cur) ? ok('phone menu opens, jumps and closes') : W(w, `closed ${closed}, header reads "${cur}"`);
        await m.page.locator('#mbtn').click(); await m.page.waitForTimeout(300);
        // the header bar must not be a scroll container, and a wheel over it must not move it or the locked page
        const before = await m.page.evaluate(() => scrollY);
        try { await m.page.mouse.move(200, 30); await m.page.mouse.wheel(0, 300); await m.page.waitForTimeout(300); } catch {}
        const bar = await m.page.evaluate(y => { const ix = document.querySelector('.index'); return { ov: getComputedStyle(ix).overflowY, top: ix.scrollTop, page: scrollY - y }; }, before);
        /auto|scroll/.test(bar.ov) || bar.top || bar.page ? W(w, `with the menu open the header is overflow ${bar.ov}, scrolled ${bar.top} px, page moved ${bar.page} px`) : ok('with the menu open the header and the page stay put');
      } catch (e) { W(w, e.message.split('\n')[0]); }
    })();
    await m.ctx.close();
  }

  // ---------- the social post maker ----------
  for (const [theme, width] of [['dark', 1440], ['light', 390]]) {
    const where = `post maker ${theme} ${width}`;
    const ctx = await browser.newContext({ viewport: { width, height: width < 800 ? 844 : 900 }, colorScheme: theme, reducedMotion: 'reduce', ...(width < 800 && name !== 'firefox' ? { isMobile: true, hasTouch: true } : {}) });
    const page = await ctx.newPage(); const errors = [];
    page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('request', r => { const u = r.url(); if (!u.startsWith(BASE) && !/^(data|blob|about):/.test(u)) errors.push('third-party request ' + u.split('?')[0]); });
    try {
      await page.goto(BASE + '/social/'); await page.waitForFunction(() => document.documentElement.dataset.ready === '1', null, { timeout: 20000 });
      const sw = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
      sw[0] <= sw[1] ? ok(`${where} no horizontal overflow`) : W(where, `page is ${sw[0]} px wide in a ${sw[1]} px viewport`);
      // the preview fits its post exactly in every format: no letterbox bands
      const boxed = await page.evaluate(async () => { const out = [];
        for (const k of ['square', 'portrait', 'story', 'landscape']) { document.querySelector(`#format [data-k="${k}"]`).click(); await new Promise(r => requestAnimationFrame(r));
          const f = document.querySelector('#frame').getBoundingClientRect(), s = document.querySelector('#frame svg').getBoundingClientRect();
          if (Math.abs(f.width - s.width) > 1.5 || Math.abs(f.height - s.height) > 1.5) out.push(`${k} ${Math.round(f.width)}x${Math.round(f.height)} around ${Math.round(s.width)}x${Math.round(s.height)}`); }
        document.querySelector('#format [data-k="square"]').click(); return out; });
      boxed.length ? W(where, 'preview letterboxes: ' + boxed.join(', ')) : ok(`${where} the preview fits its post in every format`);
      if (width === 1440) {
        const bad = await page.evaluate(async () => { const m = await import('./posts.js'), logos = await m.loadLogos('../assets/logo/'), out = [];
          for (const type of Object.keys(m.TYPES)) for (const [variant] of (m.TYPES[type].variants || [['default']])) for (const format of Object.keys(m.FORMATS)) for (const ground of Object.keys(m.GROUNDS)) {
            const at = `${type} ${variant} ${format} ${ground}`;
            try { const svg = m.render({ type, variant, format, ground, business: 'fat-racing', data: m.defaults(type, variant) }, { logos });
              const doc = new DOMParser().parseFromString(svg, 'image/svg+xml'); if (doc.querySelector('parsererror') || !doc.querySelector('text') || /NaN|undefined/.test(svg)) out.push(at); }
            catch (e) { out.push(`${at}: ${e.message}`); } }
          return out; });
        bad.length ? W(where, 'posts that fail to draw: ' + bad.join(', ')) : ok('every post type and layout draws in every format and ground');
        // the photo field takes a dropped file, and a row moves by its handle from the keyboard
        await page.click('#type [data-k="photo"]');
        const dt = await page.evaluateHandle(async () => { const b = await (await fetch('../assets/showcase/race-suit-800.webp')).blob(); const d = new DataTransfer(); d.items.add(new File([b], 'suit.webp', { type: 'image/webp' })); return d; });
        await page.locator('.drop').dispatchEvent('drop', { dataTransfer: dt });
        await page.waitForSelector('.pic .thumb img', { timeout: 5000 }).catch(() => {});
        (await page.evaluate(() => !!document.querySelector('#frame svg image'))) ? ok('a dropped photo lands in the post') : W(where, 'a dropped photo did not reach the post');
        await page.click('#type [data-k="results"]');
        const before = await page.evaluate(() => document.querySelector('.rw .cells .inp').value);
        await page.locator('.rw .grip').first().focus(); await page.keyboard.press('ArrowDown');
        const after = await page.evaluate(() => [...document.querySelectorAll('.rw .cells .inp:first-child')].map(i => i.value));
        after[1] === before ? ok('rows reorder by their handles') : W(where, `moving the first row down gave ${after.join(', ')}`);
        const shown = await page.evaluate(() => [...document.querySelectorAll('.vh')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 1 || r.height > 1; }).map(e => e.textContent.slice(0, 40) || e.tagName));
        shown.length ? W(where, 'screen-reader-only text is visible: ' + shown.join(', ')) : ok('screen-reader-only text stays hidden');
        const size = await page.evaluate(async () => (await window.sgPost.png()).size);
        size > 20000 ? ok(`PNG export works (${Math.round(size / 1024)} KB)`) : W(where, `PNG export is only ${size} bytes`);
      }
      if (name === 'chromium') {
        await page.addScriptTag({ content: AXE });
        const v = await page.evaluate(async () => (await axe.run(document, { resultTypes: ['violations'], runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] } })).violations.map(v => `${v.id} x${v.nodes.length} (${v.nodes.slice(0, 3).map(n => n.target.join(' ')).join('; ')})`));
        v.length ? v.forEach(x => W(where, 'axe ' + x)) : ok(`${where} axe finds no violations`);
      }
    } catch (e) { W(where, e.message.split('\n')[0]); }
    errors.length ? W(where, 'console: ' + [...new Set(errors)].join(' | ')) : ok(`${where} no console errors`);
    await ctx.close();
  }

  for (const [theme, width] of [['dark', 1440], ['light', 390]]) {
    const where = `icon library ${theme} ${width}`;
    const ctx = await browser.newContext({ viewport: { width, height: width < 800 ? 844 : 900 }, colorScheme: theme, reducedMotion: 'reduce', ...(width < 800 && name !== 'firefox' ? { isMobile: true, hasTouch: true } : {}) });
    const page = await ctx.newPage(); const errors = [];
    page.on('pageerror', e => errors.push(e.message)); page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    try {
      await page.goto(BASE + '/icons/'); await page.waitForFunction(() => document.documentElement.dataset.ready === '1', null, { timeout: 20000 });
      const sw = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
      sw[0] <= sw[1] ? ok(`${where} no horizontal overflow`) : W(where, `page is ${sw[0]} px wide in a ${sw[1]} px viewport`);
      const all = await page.evaluate(() => document.querySelectorAll('.ic').length);
      all === ICONS.length ? ok(`all ${all} icons listed`) : W(where, `${all} icons listed, the library has ${ICONS.length}`);
      await page.fill('#q', 'flag'); await page.waitForTimeout(100);
      (await page.evaluate(() => document.querySelectorAll('.ic').length)) >= 1 ? ok('search finds icons') : W(where, 'searching for flag found nothing');
      await page.click('.ic[data-k="flag"]');
      (await page.textContent('#dname')) === 'Chequered flag' ? ok('choosing an icon shows it') : W(where, 'the chosen icon did not show');
      if (name === 'chromium') {
        await page.addScriptTag({ content: AXE });
        const v = await page.evaluate(async () => (await axe.run(document, { resultTypes: ['violations'], runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] } })).violations.map(v => `${v.id} x${v.nodes.length} (${v.nodes.slice(0, 3).map(n => n.target.join(' ')).join('; ')})`));
        v.length ? v.forEach(x => W(where, 'axe ' + x)) : ok(`${where} axe finds no violations`);
      }
    } catch (e) { W(where, e.message.split('\n')[0]); }
    errors.length ? W(where, 'console: ' + [...new Set(errors)].join(' | ')) : ok(`${where} no console errors`);
    await ctx.close();
  }

  if (name === 'chromium') {
    const { ctx, page } = await open('light', 1440);
    try { const pdf = await page.pdf({ format: 'A4', printBackground: true }); pdf.length > 100000 ? ok(`prints (${Math.round(pdf.length / 1024)} KB PDF)`) : fail('print', 'PDF suspiciously small'); }
    catch (e) { fail('print', e.message.split('\n')[0]); }
    await ctx.close();
  }
  await browser.close();
}

server.close();
console.log(failures.length ? `\n${failures.length} problem(s):\n` + failures.join('\n') : '\nall checks passed');
process.exit(failures.length ? 1 : 0);
