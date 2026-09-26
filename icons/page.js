// The icon library page: search and filter the library, pick an icon, copy or download it.
import { ICONS, FAMILIES, svgOf, bodyOf } from './library.js?v=4d617bed0d';

const $ = s => document.querySelector(s);
const svg = (body, size, extra = '') => `<svg viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true"${extra}>${body}</svg>`;
let fam = 'all', chosen = ICONS[0], tone = 'ink';
try { const s = JSON.parse(localStorage.getItem('sg-icons') || 'null'); if (s) { chosen = ICONS.find(i => i[0] === s.chosen) || chosen; tone = s.tone || tone; } } catch {}
const save = () => { try { localStorage.setItem('sg-icons', JSON.stringify({ chosen: chosen[0], tone })); } catch {} };

$('#lede').textContent = `${ICONS.length} icons in one style: a 24 px grid, a 1.5 px stroke, square ends and diagonals at 55°, like the glyph. Pick one to copy its SVG or download it.`;
$('#sicon').innerHTML = bodyOf('search');
$('#dl').innerHTML = svg(bodyOf('download'), 16, ' class="bi"') + 'Download SVG';

// the book's streak on every button
document.addEventListener('click', e => { const b = e.target.closest?.('.btn:not(.t)'); if (!b) return; b.style.setProperty('--bw', (b.offsetWidth + 20) + 'px'); b.classList.remove('flash'); void b.offsetWidth; b.classList.add('flash'); });
document.addEventListener('animationend', e => { if (e.animationName === 'streak') e.target.classList.remove('flash'); });

// families as the book's chips
for (const [k, label] of [['all', 'All'], ...FAMILIES]) {
  const c = document.createElement('button'); c.className = 'chip'; c.type = 'button'; c.dataset.k = k; c.textContent = label; c.setAttribute('aria-pressed', String(k === fam));
  c.addEventListener('click', () => { fam = k; document.querySelectorAll('#fams .chip').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.k === k))); list(); });
  $('#fams').appendChild(c);
}

function list() {
  const q = $('#q').value.trim().toLowerCase(), box = $('#families'); box.innerHTML = ''; let n = 0;
  for (const [fk, flabel] of FAMILIES) {
    if (fam !== 'all' && fam !== fk) continue;
    const items = ICONS.filter(i => i[2] === fk && (!q || `${i[0]} ${i[1]} ${i[3]}`.toLowerCase().includes(q)));
    if (!items.length) continue; n += items.length;
    const sec = document.createElement('section'); sec.className = 'fam';
    sec.innerHTML = `<h2>${flabel}, ${items.length}</h2>`;
    const grid = document.createElement('div'); grid.className = 'grid';
    for (const ic of items) {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'ic'; b.dataset.k = ic[0]; b.setAttribute('aria-pressed', String(ic === chosen)); b.title = ic[1];
      b.innerHTML = svg(ic[4], 28) + `<span>${ic[0]}</span>`;
      b.addEventListener('click', () => { chosen = ic; document.querySelectorAll('.ic').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.k === ic[0]))); show(); save(); });
      grid.appendChild(b);
    }
    sec.appendChild(grid); box.appendChild(sec);
  }
  if (!n) box.innerHTML = `<p class="none">Nothing matches “${q.replace(/</g, '&lt;')}”. Try a shorter word.</p>`;
  $('#count').textContent = `${n} of ${ICONS.length} icons`;
}

const TONES = [['ink', 'Ink', 'var(--ink)'], ['red', 'Red', 'var(--red)'], ['blue', 'Blue', 'var(--blue)']];
for (const [k, label] of TONES) {
  const c = document.createElement('button'); c.className = 'chip'; c.type = 'button'; c.dataset.k = k; c.textContent = label;
  c.addEventListener('click', () => { tone = k; show(); save(); }); $('#tones').appendChild(c);
}
function show() {
  const [name, label, family, , body] = chosen, t = TONES.find(x => x[0] === tone)[2];
  $('#detail').style.setProperty('--tone', t);
  $('#big').innerHTML = svg(body, '100%');
  $('#dname').textContent = label;
  $('#dmeta').textContent = `${name}.svg, ${FAMILIES.find(f => f[0] === family)[1].toLowerCase()}`;
  $('#sizes').innerHTML = [16, 24, 32, 48].map(s => `<figure>${svg(body, s, s < 20 ? ' style="stroke-width:1.8"' : '')}<figcaption>${s}</figcaption></figure>`).join('');
  document.querySelectorAll('#tones .chip').forEach(x => x.setAttribute('aria-pressed', String(x.dataset.k === tone)));
}

const status = t => { $('#status').textContent = t; };
const file = () => { const colour = { ink: 'currentColor', red: '#D8231A', blue: '#2F80FF' }[tone]; return svgOf(chosen).replace('stroke="currentColor"', `stroke="${colour}"`); };
$('#dl').addEventListener('click', () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([file()], { type: 'image/svg+xml' })); a.download = `${chosen[0]}.svg`; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); status(`Saved ${chosen[0]}.svg`); });
$('#cp').addEventListener('click', async () => { try { await navigator.clipboard.writeText(file()); status('SVG copied'); } catch { status('This browser will not copy; use Download SVG'); } });
$('#cn').addEventListener('click', async () => { try { await navigator.clipboard.writeText(chosen[0]); status(`Copied “${chosen[0]}”`); } catch { status(chosen[0]); } });
$('#q').addEventListener('input', list);
list(); show();
document.documentElement.dataset.ready = '1';
