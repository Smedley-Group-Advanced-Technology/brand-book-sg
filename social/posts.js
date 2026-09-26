// Social posts on the Smedley Group brand. One renderer for the post maker and for the SVG frames in
// assets/templates, so both always draw the same thing. Runs in a browser: text is measured with canvas.

export const FORMATS = {
  square: { w: 1080, h: 1080, m: 96, top: 96, bottom: 96, u: 1, big: 1, label: 'Square', note: '1080 × 1080. Instagram, LinkedIn and X feeds.' },
  portrait: { w: 1080, h: 1350, m: 96, top: 96, bottom: 96, u: 1, big: 1.12, label: 'Portrait', note: '1080 × 1350. The most space in Instagram and LinkedIn feeds.' },
  story: { w: 1080, h: 1920, m: 96, top: 250, bottom: 380, u: 1.06, big: 1.3, label: 'Story', note: '1080 × 1920. Stories and reels: the app covers the top 250 px and bottom 380 px.' },
  landscape: { w: 1200, h: 627, m: 64, top: 56, bottom: 56, u: 0.62, big: 1, label: 'Landscape', note: '1200 × 627. Link posts on LinkedIn, X and Facebook.' },
};

export const BUSINESSES = [
  { key: 'smedley-group', name: 'Smedley Group', lean: 'balance' },
  { key: 'advanced-technology', name: 'Advanced Technology', lean: 'blue' },
  { key: 'insight-labs', name: 'Insight Labs', lean: 'blue' },
  { key: 'fat-racing', name: 'FAT Racing', lean: 'red' },
];

// red never touches blue: on the blueprint ground every red accent turns white
export const GROUNDS = {
  dark: { label: 'Black', bg: '#000000', ink: '#FFFFFF', dim: '#9DA1A8', rule: 'rgba(205,207,212,.24)', line: '#2F80FF', lineText: '#7FB2FF', accent: '#D8231A', onAccent: '#FFFFFF', board: '#2E3137', onBoard: '#FFFFFF', logo: 'white', grid: 'rgba(47,128,255,' },
  light: { label: 'White', bg: '#FFFFFF', ink: '#0B0C0E', dim: '#585D65', rule: 'rgba(28,30,34,.16)', line: '#1F66E0', lineText: '#1F66E0', accent: '#D8231A', onAccent: '#FFFFFF', board: '#0B0C0E', onBoard: '#FFFFFF', logo: 'ink', grid: 'rgba(31,102,224,' },
  blueprint: { label: 'Blueprint', bg: '#0B2D63', ink: '#FFFFFF', dim: 'rgba(255,255,255,.72)', rule: 'rgba(255,255,255,.26)', line: '#FFFFFF', lineText: '#A9CCFF', accent: '#FFFFFF', onAccent: '#0B2D63', board: '#0E3673', onBoard: '#FFFFFF', logo: 'white', blueprint: true },
};

const HANDLE = ['handle', 'Handle or website', 'smedleygroup.com'];
export const TYPES = {
  headline: { label: 'Headline', hint: 'News and announcements. One idea, said in the headline.',
    fields: [['kicker', 'Label', 'News'], ['headline', 'Headline', 'Four drivers promoted to F4 for 2027', 'area'], ['support', 'Supporting line', 'Chosen on the TalentID index, funded by FAT Racing'], HANDLE] },
  figure: { label: 'Figure', hint: 'One number worth stopping for, with its unit and its source.',
    fields: [['figure', 'Figure', '57'], ['unit', 'Unit', '%'], ['caption', 'What it measures', 'of the way to F1 for the drivers on this year’s F4 shortlist', 'area'], ['source', 'Source', 'TalentID, season 2026'], HANDLE] },
  quote: { label: 'Quote', hint: 'Real words from a real person, under 25 words, named.',
    fields: [['quote', 'Quote', 'The index told us what the stopwatch never could: who gets faster when it matters.', 'area'], ['name', 'Name', 'Name Surname'], ['role', 'Role', 'Head of driver development, FAT Racing'], HANDLE] },
  photo: { label: 'Photo', hint: 'The picture runs to the edge. The words sit below it, never on it.',
    fields: [['photo', 'Photo', '', 'file'], ['kicker', 'Label', 'Race report'], ['headline', 'Headline', 'A first F4 podium at Donington Park', 'area'], HANDLE] },
  results: { label: 'Results', hint: 'Up to five rows. The leader’s board goes red.',
    fields: [['title', 'Title', 'Qualifying, round 7'], ['event', 'Event', 'British F4, Donington Park'], ['rows', 'Rows: driver; team; time, one per line', 'Maja Kowalczyk; FAT Racing; 1:02.418\nLeo Hartmann; FAT Racing; +0.103\nAarav Mehta; Hitech; +0.559\nElin Berg; Rodin; +0.611\nTomás Duarte; Virtuosi; +0.774', 'area'], HANDLE] },
  date: { label: 'Date', hint: 'Save the date: events, launches and race days.',
    fields: [['kicker', 'Label', 'Race day'], ['day', 'Day', '17'], ['month', 'Month and year', 'October 2026'], ['title', 'Event', 'British F4, round 9', 'area'], ['place', 'Place and time', 'Brands Hatch, 14:20'], HANDLE] },
  carousel: { label: 'Carousel', hint: 'Page 1 is the cover; later pages carry one point each.',
    fields: [['page', 'Page', '1'], ['total', 'Of', '5'], ['headline', 'Heading', 'How TalentID picks an F4 driver', 'area'], ['body', 'Text, pages 2 onwards', 'Every lap of every session counts. Pace, consistency, racecraft and adaptability are scored against the class, so one index compares drivers from Lagos to Łódź.', 'area'], HANDLE] },
};

export const defaults = type => Object.fromEntries(TYPES[type].fields.map(f => [f[0], f[2]]));

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
let ctx;
const measure = (text, size, weight = 400, family = 'Sora', ls = 0) => {
  ctx = ctx || document.createElement('canvas').getContext('2d');
  ctx.font = `${weight} ${size}px "${family}"`;
  return ctx.measureText(text).width + ls * size * Math.max(0, [...text].length - 1);
};
export const FONTS = ['300 40px Sora', '400 40px Sora', '600 40px Sora', '400 40px "IBM Plex Mono"', '500 40px "IBM Plex Mono"'];

// words into lines no wider than max; blank input gives no lines
function wrap(text, max, size, weight, family, ls) {
  const out = [];
  for (const para of String(text || '').split('\n')) {
    let line = '';
    for (const word of para.split(/\s+/).filter(Boolean)) {
      const t = line ? line + ' ' + word : word;
      if (line && measure(t, size, weight, family, ls) > max) { out.push(line); line = word; } else line = t;
    }
    if (line) out.push(line);
  }
  return out;
}
// the largest size from start down to min at which the text fits in lines and height
function fit(text, { max, start, min, lines: maxLines, height = Infinity, lh = 1.08, weight = 600, family = 'Sora', ls = 0 }) {
  for (let size = start; ; size = Math.floor(size * 0.95)) {
    const lines = wrap(text, max, size, weight, family, ls);
    if ((lines.length <= maxLines && lines.length * size * lh <= height) || size <= min) return { size, lines, h: lines.length * size * lh, lh };
  }
}
const textBlock = (lines, x, y, size, lh, attrs, anchor = 'start') => lines.length
  ? `<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}" ${attrs}>${lines.map((l, i) => `<tspan x="${x}" dy="${i ? size * lh : 0}">${esc(l)}</tspan>`).join('')}</text>` : '';
const SEMI = 'font-family="Sora" font-weight="600"', REG = 'font-family="Sora" font-weight="400"', LIGHT = 'font-family="Sora" font-weight="300"', MONO = 'font-family="IBM Plex Mono" font-weight="400"', MONOM = 'font-family="IBM Plex Mono" font-weight="500"';

// a board cut at 55° both ends: the offset is 0.7 of its height
const board = (x, y, h, text, fill, color, size) => {
  const w = measure(text, size, 600) + h * 1.6, c = h * 0.7;
  return { w, svg: `<polygon points="${x},${y + h} ${x + c},${y} ${x + w},${y} ${x + w - c},${y + h}" fill="${fill}"/><text x="${x + w / 2}" y="${y + h / 2 + size * 0.36}" font-size="${size}" text-anchor="middle" ${SEMI} fill="${color}">${esc(text)}</text>` };
};

export function render(o, env) {
  const f = FORMATS[o.format], g = GROUNDS[o.ground], biz = BUSINESSES.find(b => b.key === o.business) || BUSINESSES[0];
  const { w: W, h: H, m, top, bottom, u, big } = f, ub = u * big, x0 = m, x1 = W - m, y1 = H - bottom, TW = x1 - x0;
  const d = o.data || {}, parts = [], defs = [];
  const land = o.format === 'landscape';

  // ground
  parts.push(`<rect width="${W}" height="${H}" fill="${g.bg}"/>`);
  if (g.blueprint) {
    defs.push(`<pattern id="bpm" width="${8 * u * 2}" height="${8 * u * 2}" patternUnits="userSpaceOnUse"><path d="M${16 * u} 0H0V${16 * u}" fill="none" stroke="rgba(255,255,255,.05)" stroke-width="1"/></pattern>`,
      `<pattern id="bpM" width="${80 * u}" height="${80 * u}" patternUnits="userSpaceOnUse"><path d="M${80 * u} 0H0V${80 * u}" fill="none" stroke="rgba(255,255,255,.11)" stroke-width="1.5"/></pattern>`);
    parts.push(`<rect width="${W}" height="${H}" fill="url(#bpm)"/><rect width="${W}" height="${H}" fill="url(#bpM)"/>`);
  }

  // the seam in the top corner, leaning to the business: a blue grid cut at 55° with a red wedge
  const seam = () => {
    if (g.blueprint) return 0;
    const gw = Math.round(Math.min(W, H) * 0.29 * (land ? 1.25 : big)), th = gw / 0.7, rw = gw * { balance: 0.45, blue: 0.2, red: 0.72 }[biz.lean];
    defs.push(`<pattern id="sg" width="${80 * u}" height="${80 * u}" patternUnits="userSpaceOnUse"><path d="M${80 * u} 0H0V${80 * u}" fill="none" stroke="${g.grid}.45)" stroke-width="2"/><path d="M${40 * u} 0V${80 * u}M0 ${40 * u}H${80 * u}" fill="none" stroke="${g.grid}.16)" stroke-width="1"/></pattern>`);
    parts.push(`<polygon points="${W - gw},0 ${W},0 ${W},${th}" fill="url(#sg)"/><line x1="${W - gw}" y1="0" x2="${W}" y2="${th}" stroke="${g.line}" stroke-width="${3 * u}"/><polygon points="${W - rw},0 ${W},0 ${W},${rw / 0.7}" fill="${g.accent}"/>`);
    return th;
  };

  // lockup, top left
  const logo = (x, y, h, tone = g.logo) => {
    const l = env.logos[`${biz.key}-${tone}`]; if (!l) return 0;
    const lw = h * l.ratio; parts.push(`<svg x="${x}" y="${y}" width="${lw}" height="${h}" viewBox="${l.viewBox}">${l.inner}</svg>`); return lw;
  };
  // footer: the scale rule with its red lead, the handle below, an optional right-hand readout
  const footer = (right = '', xa = x0, xb = x1) => {
    const ry = y1 - 46 * u;
    parts.push(`<rect x="${xa}" y="${ry}" width="${xb - xa}" height="${2 * u}" fill="${g.line}"/>`);
    for (let t = xa; t <= xb; t += 40 * u) parts.push(`<rect x="${t}" y="${ry - 10 * u}" width="${1.5 * u}" height="${10 * u}" fill="${g.line}"/>`);
    parts.push(`<polygon points="${xa},${ry - 7 * u} ${xa + 110 * u},${ry - 7 * u} ${xa + 110 * u + 7 * u * 0.7},${ry + 2 * u} ${xa},${ry + 2 * u}" fill="${g.accent}"/>`);
    parts.push(`<text x="${xa}" y="${y1}" font-size="${26 * u}" ${MONO} fill="${g.lineText}">${esc(d.handle)}</text>`);
    if (right) parts.push(`<text x="${xb}" y="${y1}" font-size="${26 * u}" ${MONOM} fill="${g.ink}" text-anchor="end">${esc(right)}</text>`);
    return ry - 40 * u; // the lowest point content may reach
  };
  const logoH = 60 * u, below = top + logoH;

  const headlineStack = ({ kicker, headline, support, counter }) => {
    const th = seam(); logo(x0, top, logoH);
    const floor = footer(counter);
    const maxW = land ? TW - Math.min(W, H) * 0.29 * 1.25 - 20 : TW;
    const ceiling = Math.max(below + 40 * u, land ? below + 40 * u : th + 40 * u);
    const sup = fit(support, { max: maxW, start: 36 * ub, min: 24 * u, lines: 3, weight: 300, lh: 1.3 });
    const kick = kicker ? 58 * ub : 0;
    const hl = fit(headline, { max: maxW, start: (land ? 118 : 104) * ub, min: 44 * u, lines: land ? 3 : 5, height: floor - ceiling - sup.h - kick - 30 * u, ls: -0.02 });
    let y = floor - sup.h - (sup.lines.length ? 26 * u : 0) - hl.h;
    if (kicker) parts.push(`<text x="${x0}" y="${y - 28 * ub}" font-size="${28 * ub}" ${MONO} fill="${g.lineText}">${esc(kicker)}</text>`);
    parts.push(textBlock(hl.lines, x0, y + hl.size * 0.86, hl.size, hl.lh, `${SEMI} fill="${g.ink}" letter-spacing="-0.02em"`));
    y += hl.h + 26 * u;
    parts.push(textBlock(sup.lines, x0, y + sup.size * 0.9, sup.size, sup.lh, `${LIGHT} fill="${g.dim}"`));
  };

  const t = o.type;
  if (t === 'headline') headlineStack(d);

  else if (t === 'carousel' && Number(d.page || 1) <= 1) headlineStack({ kicker: 'Swipe', headline: d.headline, support: '', counter: `01 / ${String(d.total || 1).padStart(2, '0')}  →` });

  else if (t === 'carousel') {
    logo(x0, top, logoH);
    const n = String(d.page).padStart(2, '0'), last = Number(d.page) >= Number(d.total);
    const floor = footer(`${n} / ${String(d.total || 1).padStart(2, '0')}${last ? '' : '  →'}`);
    const b = board(x0, below + 70 * u, 64 * u, n, g.accent, g.onAccent, 34 * u); parts.push(b.svg);
    let y = below + 70 * u + 64 * u + 56 * u;
    const hl = fit(d.headline, { max: TW, start: 76 * u, min: 40 * u, lines: 3, ls: -0.02 });
    parts.push(textBlock(hl.lines, x0, y + hl.size * 0.86, hl.size, hl.lh, `${SEMI} fill="${g.ink}" letter-spacing="-0.02em"`));
    y += hl.h + 34 * u;
    const bd = fit(d.body, { max: land ? TW * 0.8 : TW, start: 40 * u, min: 24 * u, lines: 12, height: floor - y, weight: 400, lh: 1.4 });
    parts.push(textBlock(bd.lines, x0, y + bd.size * 0.9, bd.size, bd.lh, `${REG} fill="${g.dim}"`));
  }

  else if (t === 'figure') {
    logo(x0, top, logoH);
    const floor = footer();
    const unitSize = (s) => s * 0.34;
    let size = (land ? 330 : 400) * ub;
    while (size > 80 && measure(d.figure || '0', size, 600, 'Sora', -0.04) + measure(' ' + (d.unit || ''), unitSize(size), 600) > TW * (land ? 0.55 : 1)) size *= 0.95;
    const cap = fit(d.caption, { max: land ? TW * 0.42 : TW, start: 44 * ub, min: 26 * u, lines: 4, weight: 400, lh: 1.3 });
    const srcH = d.source ? 60 * u : 0;
    let y;
    if (land) {
      y = below + (floor - below) / 2 + size * 0.36;
      const cx = x0 + TW * 0.56;
      parts.push(textBlock(cap.lines, cx, y - size * 0.36 - cap.h / 2 + cap.size * 0.9, cap.size, cap.lh, `${REG} fill="${g.ink}"`));
      if (d.source) parts.push(`<text x="${cx}" y="${y - size * 0.36 + cap.h / 2 + 50 * u}" font-size="${22 * u}" ${MONO} fill="${g.dim}">${esc('Source: ' + d.source)}</text>`);
    } else {
      y = floor - srcH - cap.h - 50 * u;
      parts.push(textBlock(cap.lines, x0, y + 50 * u + cap.size * 0.9, cap.size, cap.lh, `${REG} fill="${g.ink}"`));
      if (d.source) { parts.push(`<rect x="${x0}" y="${y + 50 * u + cap.h + 24 * u}" width="${TW}" height="${1.5 * u}" fill="${g.rule}"/>`);
        parts.push(`<text x="${x0}" y="${y + 50 * u + cap.h + 24 * u + 40 * u}" font-size="${24 * u}" ${MONO} fill="${g.dim}">${esc('Source: ' + d.source)}</text>`); }
    }
    const fw = measure(d.figure || '', size, 600) - size * 0.04 * ([...(d.figure || '')].length + 1);
    parts.push(`<text x="${x0 - size * 0.04}" y="${y}" font-size="${size}" ${SEMI} fill="${g.ink}" letter-spacing="-0.04em">${esc(d.figure)}</text>`);
    if (d.unit) parts.push(`<text x="${x0 + fw + unitSize(size) * 0.06}" y="${y}" font-size="${unitSize(size)}" ${SEMI} fill="${g.accent}">${esc(d.unit)}</text>`);
  }

  else if (t === 'quote') {
    logo(x0, top, logoH);
    const floor = footer();
    const attrH = (d.name ? 44 * ub : 0) + (d.role ? 38 * ub : 0);
    const q = fit(d.quote ? `“${d.quote.replace(/^[“"]|[”"]$/g, '')}”` : '', { max: land ? TW * 0.86 : TW, start: (land ? 64 : 68) * ub, min: 30 * u, lines: land ? 4 : 8, height: floor - below - 120 * u - attrH - 50 * u, weight: 300, lh: 1.22, ls: -0.01 });
    let y = floor - attrH - 50 * u - q.h;
    parts.push(`<rect x="${x0}" y="${y - 56 * u}" width="${110 * u}" height="${8 * u}" fill="${g.accent}"/>`);
    parts.push(textBlock(q.lines, x0 - q.size * 0.3, y + q.size * 0.86, q.size, q.lh, `${LIGHT} fill="${g.ink}" letter-spacing="-0.01em"`).replace(/<tspan x="[^"]+" dy="([^"]+)">/g, (s, dy) => dy === '0' ? s : `<tspan x="${x0}" dy="${dy}">`));
    y += q.h + 50 * u;
    if (d.name) { parts.push(`<text x="${x0}" y="${y + 30 * ub}" font-size="${32 * ub}" ${SEMI} fill="${g.ink}">${esc(d.name)}</text>`); y += 44 * ub; }
    if (d.role) parts.push(`<text x="${x0}" y="${y + 28 * ub}" font-size="${24 * ub}" ${MONO} fill="${g.dim}">${esc(d.role)}</text>`);
  }

  else if (t === 'photo') {
    const ph = Math.round(land ? H : H * (o.format === 'story' ? 0.5 : 0.58)), pw = land ? Math.round(W * 0.5) : W;
    const px = land ? W - pw : 0;
    defs.push(`<clipPath id="pc"><rect x="${px}" y="0" width="${pw}" height="${ph}"/></clipPath>`);
    if (env.photo) parts.push(`<image href="${env.photo}" x="${px}" y="0" width="${pw}" height="${ph}" preserveAspectRatio="xMidYMid slice" clip-path="url(#pc)"/>`);
    else {
      parts.push(`<rect x="${px}" y="0" width="${pw}" height="${ph}" fill="${o.ground === 'light' ? '#F0F0F0' : '#1C1E22'}"/>`);
      parts.push(`<text x="${px + pw / 2}" y="${ph / 2}" font-size="${28 * u}" ${MONO} fill="${g.dim}" text-anchor="middle">Add a photo</text>`);
    }
    const lx = x0, lmax = land ? W - pw - 2 * m : TW;
    const floor = footer('', x0, land ? W - pw - m : x1);
    const boardY = land ? top + logoH + 60 * u : ph - 32 * u * 1.2;
    let y = boardY;
    if (d.kicker) { const b = board(lx, boardY, 64 * u, d.kicker, g.accent, g.onAccent, 30 * u); parts.push(b.svg); }
    y = boardY + 64 * u + 44 * u;
    const hl = fit(d.headline, { max: lmax, start: (land ? 100 : 80) * u, min: 38 * u, lines: land ? 4 : 3, height: (land ? H - bottom - 60 * u : floor) - y, ls: -0.02 });
    parts.push(textBlock(hl.lines, lx, y + hl.size * 0.86, hl.size, hl.lh, `${SEMI} fill="${g.ink}" letter-spacing="-0.02em"`));
    if (land) logo(x0, top, logoH);
    else { const lw = env.logos[`${biz.key}-${g.logo}`]?.ratio * 44 * u || 0; logo(x1 - lw, y1 - 44 * u + 4 * u, 44 * u); }
  }

  else if (t === 'results') {
    logo(x0, top, logoH);
    const floor = footer();
    let y = below + 90 * u;
    const tt = fit(d.title, { max: TW, start: 72 * ub, min: 46 * u, lines: 1, ls: -0.02 });
    parts.push(textBlock(tt.lines, x0, y, tt.size, tt.lh, `${SEMI} fill="${g.ink}" letter-spacing="-0.02em"`));
    y += (tt.lines.length - 1) * tt.size * tt.lh + 50 * ub;
    if (d.event) { parts.push(`<text x="${x0}" y="${y}" font-size="${26 * ub}" ${MONO} fill="${g.lineText}">${esc(d.event)}</text>`); y += 44 * ub; }
    const rows = String(d.rows || '').split('\n').map(r => r.split(';').map(s => s.trim())).filter(r => r[0]).slice(0, land ? 3 : 5);
    const rh = Math.min(128 * ub * (big > 1 ? 1.25 : 1), (floor - y) / Math.max(rows.length, 1));
    rows.forEach((r, i) => {
      const ry = y + i * rh, mid = ry + rh / 2, bh = Math.min(56 * ub, rh * 0.5);
      parts.push(`<rect x="${x0}" y="${ry + rh}" width="${TW}" height="${1.5 * u}" fill="${g.rule}"/>`);
      const b = board(x0, mid - bh / 2, bh, String(i + 1), i === 0 ? g.accent : g.board, i === 0 ? g.onAccent : g.onBoard, bh * 0.5);
      parts.push(b.svg);
      const nx = x0 + b.w + 28 * ub, vx = x1;
      const vs = 38 * ub, vw = measure(r[2] || '', vs, 500, 'IBM Plex Mono');
      const nameMax = vx - vw - 30 * u - nx;
      const ns = fit(r[0], { max: nameMax, start: 40 * ub, min: 24 * u, lines: 1 }).size;
      parts.push(`<text x="${nx}" y="${r[1] ? mid - 4 * ub : mid + ns * 0.36}" font-size="${ns}" ${SEMI} fill="${g.ink}">${esc(r[0])}</text>`);
      if (r[1]) parts.push(`<text x="${nx}" y="${mid + 34 * ub}" font-size="${24 * ub}" ${MONO} fill="${g.dim}">${esc(r[1])}</text>`);
      if (r[2]) parts.push(`<text x="${vx}" y="${mid + vs * 0.36}" font-size="${vs}" ${MONOM} fill="${g.ink}" text-anchor="end">${esc(r[2])}</text>`);
    });
  }

  else if (t === 'date') {
    seam(); logo(x0, top, logoH);
    const floor = footer();
    const cx = land ? x0 + TW * 0.46 : x0, cw = land ? TW * 0.54 : TW;
    const pl = fit(d.place, { max: cw, start: 32 * ub, min: 22 * u, lines: 2, weight: 400, family: 'IBM Plex Mono', lh: 1.3 });
    const ti = fit(d.title, { max: cw, start: 72 * ub, min: 38 * u, lines: 3, ls: -0.02 });
    const y = floor - pl.h - 24 * ub - ti.h;
    parts.push(textBlock(ti.lines, cx, y + ti.size * 0.86, ti.size, ti.lh, `${SEMI} fill="${g.ink}" letter-spacing="-0.02em"`));
    parts.push(textBlock(pl.lines, cx, y + ti.h + 24 * ub + pl.size * 0.9, pl.size, pl.lh, `${MONO} fill="${g.dim}"`));
    const daySize = (land ? 300 : 340) * ub, dayBase = land ? floor - 50 * u : y - 90 * ub;
    parts.push(`<text x="${x0 - daySize * 0.04}" y="${dayBase}" font-size="${daySize}" ${SEMI} fill="${g.ink}" letter-spacing="-0.04em">${esc(d.day)}</text>`);
    parts.push(`<text x="${x0}" y="${dayBase + 50 * ub}" font-size="${34 * ub}" ${MONOM} fill="${g.lineText}">${esc(d.month)}</text>`);
    if (d.kicker) parts.push(board(x0, dayBase - daySize * 0.72 - 110 * ub, 60 * ub, d.kicker, g.accent, g.onAccent, 28 * ub).svg);
  }

  // safe area, for the frames only
  if (o.guides) parts.push(`<g id="guides"><rect x="${x0}" y="${top}" width="${TW}" height="${y1 - top}" fill="none" stroke="#2F80FF" stroke-width="2" stroke-dasharray="12 8" opacity=".7"/>${o.format === 'story' ? `<rect width="${W}" height="${top}" fill="#2F80FF" opacity=".12"/><rect y="${y1}" width="${W}" height="${H - y1}" fill="#2F80FF" opacity=".12"/>` : ''}</g>`);

  const style = env.fontCSS ? `<style>${env.fontCSS}</style>` : '';
  const title = { headline: d.headline, carousel: d.headline, figure: `${d.figure}${d.unit} ${d.caption}`, quote: d.quote, photo: d.headline, results: d.title, date: `${d.day} ${d.month}, ${d.title}` }[t] || '';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><title>${esc(biz.name)}: ${esc(title)}</title>${o.comment ? `<!-- ${o.comment} -->` : ''}<defs>${style}${defs.join('')}</defs>${parts.join('')}</svg>`;
}

// the logos, fetched once: each becomes a nested SVG with its colour set
export async function loadLogos(base) {
  const out = {};
  await Promise.all(BUSINESSES.flatMap(b => ['white', 'ink'].map(async tone => {
    const s = await (await fetch(`${base}${b.key}-${tone}.svg`)).text();
    const vb = s.match(/viewBox="([^"]+)"/)[1], [, , vw, vh] = vb.split(/\s+/).map(Number);
    const col = tone === 'white' ? '#FFFFFF' : '#000000';
    out[`${b.key}-${tone}`] = { viewBox: vb, ratio: vw / vh, inner: `<g style="color:${col}" fill="${col}">${s.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '').replace(/<title>.*?<\/title>/, '')}</g>` };
  })));
  return out;
}

// the fonts as data URLs, so an exported SVG or PNG renders the same anywhere
export async function fontCSS(base) {
  const faces = [['Sora', '300 700', 'sora-latin'], ['Sora', '300 700', 'sora-latin-ext'], ['IBM Plex Mono', 400, 'ibm-plex-mono-400-latin'], ['IBM Plex Mono', 400, 'ibm-plex-mono-400-latin-ext'], ['IBM Plex Mono', 500, 'ibm-plex-mono-500-latin'], ['IBM Plex Mono', 500, 'ibm-plex-mono-500-latin-ext']];
  const css = await Promise.all(faces.map(async ([fam, w, f]) => {
    const buf = new Uint8Array(await (await fetch(`${base}${f}.woff2`)).arrayBuffer()); let bin = '';
    for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode.apply(null, buf.subarray(i, i + 0x8000));
    return `@font-face{font-family:'${fam}';font-weight:${w};src:url(data:font/woff2;base64,${btoa(bin)}) format('woff2')}`;
  }));
  return css.join('');
}

// an SVG string to a PNG blob at its own size
export async function toPNG(svg) {
  const img = new Image(); const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = url; });
  const c = document.createElement('canvas'); c.width = img.naturalWidth || img.width; c.height = img.naturalHeight || img.height;
  c.getContext('2d').drawImage(img, 0, 0); URL.revokeObjectURL(url);
  return new Promise(r => c.toBlob(r, 'image/png'));
}
