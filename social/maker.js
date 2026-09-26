// The post maker: settings on the left, the post drawn live on the right, downloads at the post's real size.
import { FORMATS, TYPES, BUSINESSES, GROUNDS, FONTS, defaults, variantOf, fieldsFor, render, loadLogos, fontCSS, toPNG } from './posts.js';

const $ = s => document.querySelector(s);
const KEY = 'sg-social-maker';
let state = { format: 'square', type: 'headline', business: 'smedley-group', ground: 'dark', guides: false, data: {}, variant: {} };
try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s && FORMATS[s.format] && TYPES[s.type]) state = Object.assign(state, s, { variant: s.variant || {} }); } catch {}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {} };
let photo = null, logos = {}, embedded = null;
const vOf = t => variantOf(t, state.variant[t]);
const dataFor = t => Object.assign(defaults(t, vOf(t)), state.data[t] || {});

const seg = (el, items, key) => {
  el.innerHTML = '';
  for (const [k, v] of Object.entries(items)) {
    const b = document.createElement('button'); b.type = 'button'; b.textContent = v.label; b.dataset.k = k;
    b.setAttribute('aria-pressed', state[key] === k);
    b.addEventListener('click', () => { state[key] = k; el.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x.dataset.k === k)); if (key === 'type') { buildVariants(); buildFields(); } draw(); save(); });
    el.appendChild(b);
  }
};

// the layouts a post type offers; hidden when it has only one
function buildVariants() {
  const box = $('#variant'), list = TYPES[state.type].variants || [];
  box.closest('fieldset').hidden = list.length < 2; box.innerHTML = '';
  for (const [k, label] of list) {
    const b = document.createElement('button'); b.type = 'button'; b.textContent = label; b.dataset.k = k;
    b.setAttribute('aria-pressed', vOf(state.type) === k);
    b.addEventListener('click', () => { state.variant[state.type] = k; box.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x.dataset.k === k)); buildFields(); draw(); save(); });
    box.appendChild(b);
  }
}

function buildFields() {
  const box = $('#fields'); box.innerHTML = '';
  const d = dataFor(state.type);
  for (const [k, label, , kind] of fieldsFor(state.type, vOf(state.type))) {
    const wrap = document.createElement('div'); wrap.className = 'field';
    const id = 'f-' + k;
    wrap.innerHTML = `<label class="lab" for="${id}">${label}</label>`;
    let el;
    if (kind === 'file') {
      el = document.createElement('input'); el.type = 'file'; el.accept = 'image/*';
      el.addEventListener('change', () => { const f = el.files[0]; if (!f) return; const r = new FileReader(); r.onload = () => { photo = r.result; draw(); }; r.readAsDataURL(f); });
    } else {
      el = document.createElement(kind === 'area' ? 'textarea' : 'input'); el.value = d[k] ?? '';
      if (kind === 'area') el.rows = k === 'rows' ? 5 : 3;
      el.addEventListener('input', () => { (state.data[state.type] ||= {})[k] = el.value; draw(); save(); });
    }
    el.className = 'inp'; el.id = id; wrap.appendChild(el); box.appendChild(wrap);
  }
  $('#typeNote').textContent = TYPES[state.type].hint;
}

const opts = extra => Object.assign({ format: state.format, type: state.type, variant: vOf(state.type), business: state.business, ground: state.ground, data: dataFor(state.type) }, extra);
function draw() {
  const f = FORMATS[state.format];
  const frame = $('#frame'); frame.style.setProperty('--ar', `${f.w} / ${f.h}`); frame.style.setProperty('--arn', f.w / f.h);
  frame.innerHTML = render(opts({ guides: state.guides }), { logos, photo });
  const svg = frame.querySelector('svg'); svg.setAttribute('role', 'img'); svg.setAttribute('aria-label', svg.querySelector('title')?.textContent || 'Post preview');
  $('#formatNote').textContent = f.note;
  $('#meta').textContent = `${f.w} × ${f.h} px, ${BUSINESSES.find(b => b.key === state.business).name}, ${GROUNDS[state.ground].label.toLowerCase()} ground`;
}

const fileName = ext => `${state.business}-${state.type}${(TYPES[state.type].variants || []).length > 1 ? '-' + vOf(state.type) : ''}-${state.format}.${ext}`;
const finished = async () => { embedded ||= await fontCSS('../assets/fonts/'); return render(opts({}), { logos, photo, fontCSS: embedded }); };
const download = (blob, name) => { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); };
const status = t => { $('#status').textContent = t; };

$('#png').addEventListener('click', async () => { status('Drawing…'); try { download(await toPNG(await finished()), fileName('png')); status(`Saved ${fileName('png')}`); } catch (e) { status('Could not draw the picture: ' + e.message); } });
$('#svg').addEventListener('click', async () => { download(new Blob([await finished()], { type: 'image/svg+xml' }), fileName('svg')); status(`Saved ${fileName('svg')}, editable, fonts included`); });
$('#copy').addEventListener('click', async () => {
  try { const blob = await toPNG(await finished()); await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]); status('Copied, paste it into your post'); }
  catch { status('This browser cannot copy pictures; use Download PNG'); }
});
$('#guides').checked = state.guides;
$('#guides').addEventListener('change', e => { state.guides = e.target.checked; draw(); save(); });
const sel = $('#business');
for (const b of BUSINESSES) sel.add(new Option(b.name, b.key));
sel.value = state.business;
sel.addEventListener('change', () => { state.business = sel.value; draw(); save(); });

seg($('#format'), FORMATS, 'format');
seg($('#type'), TYPES, 'type');
seg($('#ground'), GROUNDS, 'ground');
buildVariants();
buildFields();
await Promise.all(FONTS.map(f => document.fonts.load(f)));
logos = await loadLogos('../assets/logo/');
draw();
document.documentElement.dataset.ready = '1';
// for the automated check and for scripting: the finished post as a PNG blob
window.sgPost = { state, render: opts, png: async () => toPNG(await finished()) };
