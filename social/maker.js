// The post maker: settings on the left, the post drawn live on the right, downloads at the post's real size.
// Every control is the book's own, from assets/ui.css; the few behaviours they need are wired up here.
import { FORMATS, TYPES, BUSINESSES, GROUNDS, FONTS, ROWS, defaults, variantOf, fieldsFor, render, loadLogos, fontCSS, toPNG } from './posts.js?v=b22dc69188';

import { picto, formatPicto, groundPicto } from './pictos.js?v=7e8a7453fd';

const $ = s => document.querySelector(s);
const el = (tag, attrs = {}, html = '') => { const e = document.createElement(tag); for (const [k, v] of Object.entries(attrs)) v === true ? e.setAttribute(k, '') : v !== false && v != null && e.setAttribute(k, v); if (html) e.innerHTML = html; return e; };
const ICON = {
  grip: '<svg viewBox="0 0 22 18" aria-hidden="true"><path d="M2 3l5 7.1M8 3l5 7.1M14 3l5 7.1" transform="translate(0 2.5)"/></svg>',
  remove: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  add: '<svg class="bi" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  photo: '<svg viewBox="0 0 34 34" aria-hidden="true"><path d="M3 9h7l2.5-3.5h9L24 9h7v19H3z"/><circle cx="17" cy="18" r="6"/></svg>',
};

const KEY = 'sg-social-maker';
let state = { format: 'square', type: 'headline', business: 'smedley-group', ground: 'dark', guides: false, data: {}, variant: {} };
try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s && FORMATS[s.format] && TYPES[s.type]) state = Object.assign(state, s, { variant: s.variant || {}, data: s.data || {} }); } catch {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} };
let photo = null, focus = { x: 0.5, y: 0.5 }, logos = {}, embedded = null;
const vOf = t => variantOf(t, state.variant[t]);
const dataFor = t => Object.assign(defaults(t, vOf(t)), state.data[t] || {});
const setData = (k, v) => { (state.data[state.type] ||= {})[k] = v; draw(); save(); };

// ---------- the book's buttons: a streak runs through on click ----------
document.addEventListener('click', e => { const b = e.target.closest?.('.btn:not(.t)'); if (!b || b.disabled) return; b.style.setProperty('--bw', (b.offsetWidth + 20) + 'px'); b.classList.remove('flash'); void b.offsetWidth; b.classList.add('flash'); });
document.addEventListener('animationend', e => { if (e.animationName === 'streak') e.target.classList.remove('flash'); });

// ---------- field editors ----------
const labelled = (k, label, control) => { const f = el('div', { class: 'field' }); f.append(el('label', { class: 'lab', for: 'f-' + k }, label), control); return f; };
const setRange = (r) => r.style.setProperty('--v', ((r.value - r.min) / ((r.max - r.min) || 1) * 100) + '%');

// a value on a slider with a stepper beside it, both writing the same field
function sliderField(k, label, value, max) {
  const f = el('div', { class: 'field' }), id = 'f-' + k;
  f.appendChild(el('label', { class: 'lab', for: id }, label));
  const wrap = el('div', { class: 'slide' });
  const r = el('input', { class: 'range', id, type: 'range', min: 0, max, step: 1, value: Math.min(max, parseFloat(value) || 0) });
  const st = el('div', { class: 'stepper', role: 'group', 'aria-label': label });
  const minus = el('button', { type: 'button', 'aria-label': 'Less' }, '−'), out = el('output', { 'aria-live': 'polite' }, value), plus = el('button', { type: 'button', 'aria-label': 'More' }, '+');
  st.append(minus, out, plus);
  const set = v => { v = Math.max(0, Math.min(max, Math.round(v))); r.value = v; out.textContent = v; setRange(r); minus.disabled = v <= 0; plus.disabled = v >= max; setData(k, String(v)); };
  r.addEventListener('input', () => set(+r.value));
  minus.addEventListener('click', () => set(+r.value - 1)); plus.addEventListener('click', () => set(+r.value + 1));
  setRange(r); minus.disabled = +r.value <= 0; plus.disabled = +r.value >= max;
  wrap.append(r, st); f.appendChild(wrap); return f;
}

// rows of inputs for the results, the schedule and the scores; stored as "a; b; c" lines.
// Each row has a drag handle: drag it with a pointer or finger, or focus it and use the arrow keys.
function rowsField(k, label, value, spec) {
  const f = el('div', { class: 'field' }), max = spec.max(vOf(state.type));
  f.appendChild(el('span', { class: 'lab' }, label));
  const list = el('div', { class: 'rows', role: 'list' }); f.appendChild(list);
  const live = el('span', { class: 'vh', 'aria-live': 'polite' }); f.appendChild(live);
  let rows = String(value || '').split('\n').filter(Boolean).map(r => r.split(';').map(s => s.trim()));
  const write = () => setData(k, rows.map(r => r.join('; ')).join('\n'));
  const add = el('button', { class: 'btn g sm add', type: 'button' }, ICON.add + spec.add);
  const moveRow = (from, to) => { if (to < 0 || to >= rows.length || to === from) return false; const [r] = rows.splice(from, 1); rows.splice(to, 0, r); write(); return true; };
  const name = i => rows[i]?.[0] || `Row ${i + 1}`;
  const paint = (focusAt = -1) => {
    list.innerHTML = '';
    rows.forEach((r, i) => {
      const line = el('div', { class: 'rw' + (spec.numbered ? ' num' : ''), role: 'listitem' });
      const grip = el('button', { class: 'grip', type: 'button', 'aria-label': `Move ${name(i)}: drag, or use the arrow keys`, 'aria-describedby': '' }, ICON.grip);
      line.appendChild(grip);
      if (spec.numbered) line.appendChild(el('span', { class: 'n' + (i === 0 ? ' lead' : ''), 'aria-hidden': 'true' }, String(i + 1)));
      const cells = el('div', { class: 'cells' + (spec.wide ? ' wide' : '') }); cells.style.gridTemplateColumns = spec.grid; line.appendChild(cells);
      spec.cols.forEach(([colName, kind], c) => {
        if (kind === 'range') {
          const rg = el('input', { class: 'range', type: 'range', min: 0, max: 100, step: 1, value: parseFloat(r[c]) || 0, 'aria-label': `${r[0] || 'Score'}, value` }), out = el('output', {}, r[c] || '0');
          setRange(rg); rg.addEventListener('input', () => { r[c] = rg.value; out.textContent = rg.value; setRange(rg); write(); });
          cells.append(rg, out);
        } else {
          const inp = el('input', { class: 'inp' + (kind === 'mono' ? ' mono' : ''), value: r[c] || '', 'aria-label': `${colName}, row ${i + 1}`, placeholder: colName });
          inp.addEventListener('input', () => { r[c] = inp.value; write(); });
          cells.appendChild(inp);
        }
      });
      const rm = el('button', { class: 'ibtn', type: 'button', 'aria-label': `Remove ${name(i)}` }, ICON.remove);
      rm.addEventListener('click', () => { rows.splice(i, 1); write(); paint(); });
      line.appendChild(rm); list.appendChild(line);

      // keyboard: arrows move the row, focus stays on its handle
      grip.addEventListener('keydown', e => {
        const to = { ArrowUp: i - 1, ArrowDown: i + 1, Home: 0, End: rows.length - 1 }[e.key]; if (to === undefined) return;
        e.preventDefault(); if (moveRow(i, to)) { paint(to); live.textContent = `${name(to)} moved to position ${to + 1} of ${rows.length}`; }
      });
      // pointer and touch: the row follows the finger, the others make way
      grip.addEventListener('pointerdown', e => {
        if (e.button > 0) return; e.preventDefault(); grip.setPointerCapture(e.pointerId);
        const items = [...list.children], rects = items.map(x => x.getBoundingClientRect()), step = rects.length > 1 ? rects[1].top - rects[0].top : rects[0].height;
        const y0 = e.clientY; let to = i;
        line.classList.add('dragging'); list.classList.add('sorting');
        const move = ev => {
          const dy = Math.max(rects[0].top - rects[i].top, Math.min(rects[rects.length - 1].top - rects[i].top, ev.clientY - y0));
          line.style.transform = `translateY(${dy}px)`;
          to = Math.max(0, Math.min(items.length - 1, i + Math.round(dy / step)));
          items.forEach((it, j) => {
            const s = j === i ? 0 : i < to && j > i && j <= to ? -step : i > to && j < i && j >= to ? step : 0;
            if (j !== i) it.style.transform = s ? `translateY(${s}px)` : '';
            // the numbers are positions: they follow where each row will land
            const n = it.querySelector('.n'); if (n) { const at = j === i ? to : j + Math.sign(s); n.textContent = at + 1; n.classList.toggle('lead', at === 0); }
          });
        };
        const end = () => {
          grip.removeEventListener('pointermove', move); grip.removeEventListener('pointerup', end); grip.removeEventListener('pointercancel', end);
          list.classList.remove('sorting'); items.forEach(it => { it.style.transform = ''; it.classList.remove('dragging'); });
          if (moveRow(i, to)) { live.textContent = `${name(to)} moved to position ${to + 1} of ${rows.length}`; paint(to); }
        };
        grip.addEventListener('pointermove', move); grip.addEventListener('pointerup', end); grip.addEventListener('pointercancel', end);
      });
    });
    add.disabled = rows.length >= max;
    if (focusAt >= 0) list.children[focusAt]?.querySelector('.grip')?.focus();
  };
  add.addEventListener('click', () => { rows.push(spec.cols.map(([, kind]) => kind === 'range' ? '80' : '')); write(); paint(); list.querySelector('.rw:last-child input')?.focus(); });
  paint(); f.appendChild(add);
  if (rows.length > max) f.appendChild(el('span', { class: 'help' }, `This layout shows the first ${max}.`));
  return f;
}

// the photo: a drop area of its own; once a photo is in, it becomes the picture, still taking drops to replace it,
// and a click on it sets the point the crop keeps in view
function takePhoto(file) {
  if (!file || !/^image\/(jpeg|png|webp|gif|avif)$/.test(file.type)) { status('That file is not a JPG, PNG or WebP picture'); return; }
  const rd = new FileReader();
  rd.onload = () => { const img = new Image(); img.onload = () => { photo = { src: rd.result, w: img.naturalWidth, h: img.naturalHeight, name: file.name || 'Pasted picture', size: file.size }; focus = { x: 0.5, y: 0.5 }; buildFields(); draw(); status(`Added ${photo.name}`); }; img.src = rd.result; };
  rd.readAsDataURL(file);
}
const takesPhoto = () => fieldsFor(state.type, vOf(state.type)).some(f => f[3] === 'file');
function dropTarget(node) {
  let depth = 0;
  node.addEventListener('dragenter', e => { if (![...(e.dataTransfer?.types || [])].includes('Files')) return; e.preventDefault(); depth++; node.classList.add('over'); });
  node.addEventListener('dragover', e => { if ([...(e.dataTransfer?.types || [])].includes('Files')) { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; } });
  node.addEventListener('dragleave', () => { if (--depth <= 0) { depth = 0; node.classList.remove('over'); } });
  node.addEventListener('drop', e => { e.preventDefault(); depth = 0; node.classList.remove('over'); takePhoto(e.dataTransfer.files[0]); });
}
function photoField(k, label) {
  const f = el('div', { class: 'field' }); f.appendChild(el('span', { class: 'lab', id: 'photoL' }, label));
  const input = el('input', { class: 'vh', type: 'file', accept: 'image/jpeg,image/png,image/webp', tabindex: -1, 'aria-hidden': 'true' });
  input.addEventListener('change', () => takePhoto(input.files[0]));
  f.appendChild(input);
  if (!photo) {
    const zone = el('div', { class: 'drop', role: 'button', tabindex: 0, 'aria-labelledby': 'photoL', 'aria-describedby': 'photoH' },
      `<span class="dz-i">${ICON.photo}</span><b class="dz-t">Drop a photo here</b><span class="dz-s">or <u>choose a file</u>, or paste one</span><small class="dz-h" id="photoH">JPG, PNG or WebP, at least 1080 px on the short side</small><b class="dz-o" aria-hidden="true">Release to add the photo</b>`);
    zone.addEventListener('click', () => input.click());
    zone.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); } });
    dropTarget(zone); f.appendChild(zone); return f;
  }
  const pic = el('div', { class: 'pic' });
  const zone = el('div', { class: 'drop has' });
  const thumb = el('div', { class: 'thumb', tabindex: 0, role: 'slider', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-label': 'Focal point: click the picture, or use the arrow keys' });
  const img = el('img', { src: photo.src, alt: '' }), fp = el('i', { class: 'fp' });
  thumb.append(img, fp); zone.append(thumb, el('b', { class: 'dz-o', 'aria-hidden': 'true' }, 'Release to replace the photo'));
  dropTarget(zone);
  const mark = () => { fp.style.left = focus.x * 100 + '%'; fp.style.top = focus.y * 100 + '%'; thumb.setAttribute('aria-valuenow', Math.round(focus.x * 100)); thumb.setAttribute('aria-valuetext', `${Math.round(focus.x * 100)} % across, ${Math.round(focus.y * 100)} % down`); };
  thumb.addEventListener('click', e => { const r = img.getBoundingClientRect(); focus = { x: Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)), y: Math.max(0, Math.min(1, (e.clientY - r.top) / r.height)) }; mark(); draw(); });
  thumb.addEventListener('keydown', e => { const d = { ArrowLeft: [-.05, 0], ArrowRight: [.05, 0], ArrowUp: [0, -.05], ArrowDown: [0, .05] }[e.key]; if (!d) return; e.preventDefault(); focus = { x: Math.max(0, Math.min(1, focus.x + d[0])), y: Math.max(0, Math.min(1, focus.y + d[1])) }; mark(); draw(); });
  mark();
  const short = Math.min(photo.w, photo.h), need = Math.min(FORMATS[state.format].w, FORMATS[state.format].h);
  pic.append(zone, el('div', { class: 'meta' }, `${photo.name.replace(/</g, '&lt;')}<br>${photo.w} × ${photo.h} px, ${Math.max(1, Math.round(photo.size / 1024))} KB`));
  if (short < need * 0.75) pic.appendChild(el('div', { class: 'warn' }, `This photo is ${short} px on its short side; this format wants about ${need} px, so it may look soft.`));
  pic.appendChild(el('span', { class: 'help' }, 'Click the picture to choose the point the crop keeps in view. Drop another photo on it to replace it.'));
  const actions = el('div', { class: 'bgroup', role: 'group', 'aria-label': 'Photo' });
  const replace = el('button', { class: 'btn g sm', type: 'button' }, 'Replace'), remove = el('button', { class: 'btn g sm', type: 'button' }, 'Remove');
  replace.addEventListener('click', () => input.click());
  remove.addEventListener('click', () => { photo = null; buildFields(); draw(); status('Photo removed'); });
  actions.append(replace, remove); pic.appendChild(actions);
  f.appendChild(pic); return f;
}

function buildFields() {
  const box = $('#fields'); box.innerHTML = '';
  const t = state.type, v = vOf(t), d = dataFor(t);
  for (const [k, label, , kind] of fieldsFor(t, v)) {
    const spec = ROWS[`${t}.${k}`];
    if (kind === 'file') box.appendChild(photoField(k, label));
    else if (spec) box.appendChild(rowsField(k, label.replace(/:.*$/, ''), d[k], spec));
    else if (t === 'figure' && v === 'progress' && k === 'figure') box.appendChild(sliderField(k, 'Value', d.figure, Math.max(1, parseFloat(d.max) || 100)));
    else {
      const inp = el(kind === 'area' ? 'textarea' : 'input', { class: 'inp' + (k === 'max' || k === 'from' || k === 'figure' || k === 'days' || k === 'day' ? ' mono' : ''), id: 'f-' + k });
      inp.value = d[k] ?? ''; if (kind === 'area') inp.rows = 3;
      inp.addEventListener('input', () => { setData(k, inp.value); if (k === 'max') buildFields(); });
      box.appendChild(labelled(k, label, inp));
    }
  }
  $('#typeNote').textContent = TYPES[t].hint;
}

// post types and layouts are picked by pictogram, from pictos.js
// the preview's ids are prefixed so nothing else on the page can collide with them
const own = (svg, p) => svg.replace(/id="([^"]+)"/g, `id="${p}$1"`).replace(/url\(#([^)]+)\)/g, `url(#${p}$1)`);
function tile(k, label, desc, art, pressed, onPick) {
  const b = el('button', { class: 'tile', type: 'button', 'aria-pressed': String(pressed), 'data-k': k, title: desc || label });
  b.append(el('span', { class: 'tt' }, art), el('span', { class: 'tl' }, label));
  b.addEventListener('click', onPick); return b;
}
const press = (box, k) => box.querySelectorAll('.tile').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.k === k)));
const pictoOf = t => picto(`${t}.${vOf(t)}`);

function buildVariants() {
  const box = $('#variant'), list = TYPES[state.type].variants || [];
  $('#variantGrp').hidden = list.length < 2; box.innerHTML = '';
  for (const [k, label] of list) box.appendChild(tile(k, label, '', picto(`${state.type}.${k}`), vOf(state.type) === k, () => {
    state.variant[state.type] = k; press(box, k);
    const tt = $(`#type .tile[data-k="${state.type}"] .tt`); if (tt) tt.innerHTML = pictoOf(state.type); // the type shows its chosen layout
    buildFields(); draw(); save();
  }));
}

function buildTypes() {
  const box = $('#type'); box.innerHTML = '';
  for (const [k, tp] of Object.entries(TYPES)) box.appendChild(tile(k, tp.label, tp.hint, pictoOf(k), state.type === k, () => { state.type = k; press(box, k); buildVariants(); buildFields(); draw(); save(); }));
}

const env = extra => Object.assign({ logos, photo: photo?.src, photoSize: photo && { w: photo.w, h: photo.h }, focus }, extra);
const opts = extra => Object.assign({ format: state.format, type: state.type, variant: vOf(state.type), business: state.business, ground: state.ground, data: dataFor(state.type) }, extra);
function draw() {
  const f = FORMATS[state.format], frame = $('#frame');
  frame.style.setProperty('--ar', `${f.w} / ${f.h}`);
  frame.innerHTML = own(render(opts({ guides: state.guides }), env()), 'pv-');
  const svg = frame.querySelector('svg'); svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', `Preview: ${TYPES[state.type].label.toLowerCase()} post`);
  $('#formatNote').textContent = f.note;
  $('#meta').textContent = `${f.w} × ${f.h} px, ${BUSINESSES.find(b => b.key === state.business).name}, ${GROUNDS[state.ground].label.toLowerCase()} ground`;
}

const fileName = ext => `${state.business}-${state.type}${(TYPES[state.type].variants || []).length > 1 ? '-' + vOf(state.type) : ''}-${state.format}.${ext}`;
const finished = async () => { embedded ||= await fontCSS('../assets/fonts/'); return render(opts({}), env({ fontCSS: embedded })); };
const download = (blob, name) => { const a = el('a', { href: URL.createObjectURL(blob), download: name }); document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); };
const status = t => { $('#status').textContent = t; };

$('#png').addEventListener('click', async () => { status('Drawing…'); try { download(await toPNG(await finished()), fileName('png')); status(`Saved ${fileName('png')}`); } catch (e) { status('Could not draw the picture: ' + e.message); } });
$('#svg').addEventListener('click', async () => { download(new Blob([await finished()], { type: 'image/svg+xml' }), fileName('svg')); status(`Saved ${fileName('svg')}, editable, fonts included`); });
$('#copy').addEventListener('click', async () => {
  try { const blob = await toPNG(await finished()); await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]); status('Copied, paste it into your post'); }
  catch { status('This browser cannot copy pictures; use Download PNG'); }
});
const frameDrop = $('#frame');
['dragenter', 'dragover'].forEach(t => frameDrop.addEventListener(t, e => { if (takesPhoto() && [...(e.dataTransfer?.types || [])].includes('Files')) { e.preventDefault(); frameDrop.classList.add('over'); } }));
['dragleave', 'drop'].forEach(t => frameDrop.addEventListener(t, () => frameDrop.classList.remove('over')));
frameDrop.addEventListener('drop', e => { if (!takesPhoto()) return; e.preventDefault(); takePhoto(e.dataTransfer.files[0]); });
document.addEventListener('paste', e => { if (!takesPhoto() || /^(INPUT|TEXTAREA)$/.test(document.activeElement?.tagName)) return; const it = [...(e.clipboardData?.items || [])].find(i => i.type.startsWith('image/')); if (it) { e.preventDefault(); takePhoto(it.getAsFile()); } });
$('#guides').checked = state.guides;
$('#guides').addEventListener('change', e => { state.guides = e.target.checked; draw(); save(); });
const sel = $('#business');
for (const b of BUSINESSES) sel.add(new Option(b.name, b.key));
sel.value = state.business;
sel.addEventListener('change', () => { state.business = sel.value; draw(); save(); });

// format and ground are picked by pictogram too
for (const [k, f] of Object.entries(FORMATS)) $('#format').appendChild(tile(k, f.label, f.note, formatPicto(f), state.format === k, () => { state.format = k; press($('#format'), k); if (photo) buildFields(); draw(); save(); }));
for (const [k, g] of Object.entries(GROUNDS)) $('#ground').appendChild(tile(k, g.label, `${g.label} ground`, groundPicto(k), state.ground === k, () => { state.ground = k; press($('#ground'), k); draw(); save(); }));
buildTypes(); buildVariants(); buildFields();
await Promise.all(FONTS.map(f => document.fonts.load(f)));
logos = await loadLogos('../assets/logo/');
draw();
document.documentElement.dataset.ready = '1';
// for the automated check and for scripting: the finished post as a PNG blob
window.sgPost = { state, render: opts, png: async () => toPNG(await finished()) };
