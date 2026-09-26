// Social posts on the Smedley Group brand. One renderer for the post maker and for the SVG frames in
// assets/templates, so both always draw the same thing. Runs in a browser: text is measured with canvas.

export const FORMATS = {
  square: { w: 1080, h: 1080, m: 96, top: 96, bottom: 96, u: 1, big: 1, label: 'Square', ratio: '1:1', note: '1080 × 1080. Instagram, LinkedIn and X feeds.' },
  portrait: { w: 1080, h: 1350, m: 96, top: 96, bottom: 96, u: 1, big: 1.12, label: 'Portrait', ratio: '4:5', note: '1080 × 1350. The most space in Instagram and LinkedIn feeds.' },
  story: { w: 1080, h: 1920, m: 96, top: 250, bottom: 380, u: 1.06, big: 1.3, label: 'Story', ratio: '9:16', note: '1080 × 1920. Stories and reels: the app covers the top 250 px and bottom 380 px.' },
  landscape: { w: 1200, h: 627, m: 64, top: 56, bottom: 56, u: 0.62, big: 1, label: 'Landscape', ratio: '1.91:1', note: '1200 × 627. Link posts on LinkedIn, X and Facebook.' },
};

export const BUSINESSES = [
  { key: 'smedley-group', name: 'Smedley Group', lean: 'balance' },
  { key: 'advanced-technology', name: 'Advanced Technology', lean: 'blue' },
  { key: 'insight-labs', name: 'Insight Labs', lean: 'blue' },
  { key: 'fat-racing', name: 'FAT Racing', lean: 'red' },
];

// red never touches blue: on the blueprint ground every red accent turns white
export const GROUNDS = {
  dark: { label: 'Black', bg: '#000000', ink: '#FFFFFF', dim: '#9DA1A8', rule: 'rgba(205,207,212,.24)', line: '#2F80FF', lineText: '#7FB2FF', accent: '#D8231A', onAccent: '#FFFFFF', board: '#2E3137', onBoard: '#FFFFFF', track: '#1C1E22', logo: 'white', grid: 'rgba(47,128,255,' },
  light: { label: 'White', bg: '#FFFFFF', ink: '#0B0C0E', dim: '#585D65', rule: 'rgba(28,30,34,.16)', line: '#1F66E0', lineText: '#1F66E0', accent: '#D8231A', onAccent: '#FFFFFF', board: '#0B0C0E', onBoard: '#FFFFFF', track: '#E6E7EA', logo: 'ink', grid: 'rgba(31,102,224,' },
  blueprint: { label: 'Blueprint', bg: '#0B2D63', ink: '#FFFFFF', dim: 'rgba(255,255,255,.72)', rule: 'rgba(255,255,255,.26)', line: '#FFFFFF', lineText: '#A9CCFF', accent: '#FFFFFF', onAccent: '#0B2D63', board: '#0E3673', onBoard: '#FFFFFF', track: '#0E3673', logo: 'white', blueprint: true },
};

const HANDLE = ['handle', 'Handle or website', 'smedleygroup.com'];
// fields: [key, label, default, kind, the layouts that use it (all when left out)]
export const TYPES = {
  headline: { label: 'Headline', hint: 'News and announcements. One idea, said in the headline.',
    variants: [['seam', 'Seam'], ['stripes', 'Stripes'], ['plain', 'Plain']],
    fields: [['kicker', 'Label', 'News'], ['headline', 'Headline', 'Four drivers promoted to F4 for 2027', 'area'], ['support', 'Supporting line', 'Chosen on the TalentID index, funded by FAT Racing'], HANDLE] },
  figure: { label: 'Figure', hint: 'One number worth stopping for, with its unit and its source.',
    variants: [['big', 'Big'], ['progress', 'Progress'], ['compare', 'Before and after']],
    fields: [['from', 'Before', '+0.62', '', ['compare']], ['fromLabel', 'Before, label', 'Session 1', '', ['compare']], ['figure', 'Figure', '57'], ['unit', 'Unit', '%'], ['toLabel', 'Figure, label', 'Session 12', '', ['compare']],
      ['max', 'Out of', '100', '', ['progress']], ['caption', 'What it measures', 'of the way to F1 for the drivers on this year’s F4 shortlist', 'area'], ['source', 'Source', 'TalentID, season 2026'], HANDLE],
    variantDefaults: { compare: { figure: '+0.18', unit: 's', caption: 'gap to the class reference, cut by more than two thirds in one season' } } },
  quote: { label: 'Quote', hint: 'Real words from a real person, under 25 words, named.',
    variants: [['plain', 'Plain'], ['photo', 'With photo']],
    fields: [['photo', 'Photo', '', 'file', ['photo']], ['quote', 'Quote', 'The index told us what the stopwatch never could: who gets faster when it matters.', 'area'], ['name', 'Name', 'Name Surname'], ['role', 'Role', 'Head of driver development, FAT Racing'], HANDLE] },
  photo: { label: 'Photo', hint: 'The picture runs to the edge or sits in the margins. The words sit beside or below it, never on it.',
    variants: [['below', 'Below'], ['split', 'Split'], ['frame', 'Framed']],
    fields: [['photo', 'Photo', '', 'file'], ['kicker', 'Label', 'Race report'], ['headline', 'Headline', 'A first F4 podium at Donington Park', 'area'], HANDLE] },
  results: { label: 'Results', hint: 'The leader goes red. The table takes five rows, the podium three.',
    variants: [['table', 'Table'], ['podium', 'Podium']],
    fields: [['title', 'Title', 'Qualifying, round 7'], ['event', 'Event', 'British F4, Donington Park'], ['rows', 'Results', 'Maja Kowalczyk; FAT Racing; 1:02.418\nLeo Hartmann; FAT Racing; +0.103\nAarav Mehta; Hitech; +0.559\nElin Berg; Rodin; +0.611\nTomás Duarte; Virtuosi; +0.774', 'area'], HANDLE],
    variantDefaults: { podium: { title: 'Race 2, round 7' } } },
  date: { label: 'Date', hint: 'Save the date, count down to it, or set out the day.',
    variants: [['day', 'Day'], ['countdown', 'Countdown'], ['schedule', 'Schedule']],
    fields: [['kicker', 'Label', 'Race day', '', ['day', 'countdown']], ['day', 'Day', '17', '', ['day']], ['month', 'Month and year', 'October 2026', '', ['day']], ['days', 'Number', '5', '', ['countdown']], ['daysLabel', 'Under the number', 'days to go', '', ['countdown']],
      ['title', 'Event', 'British F4, round 9', 'area'], ['place', 'Place and time', 'Brands Hatch, 14:20'], ['rows', 'Sessions', '09:10; Free practice\n11:45; Qualifying\n14:20; Race 1\n16:05; Race 2', 'area', ['schedule']], HANDLE],
    variantDefaults: { countdown: { kicker: 'Countdown' }, schedule: { place: 'Brands Hatch, Saturday 17 October' } } },
  profile: { label: 'Profile', hint: 'A driver, scored the TalentID way: four bars, one name.',
    variants: [['card', 'Card'], ['photo', 'With photo']],
    fields: [['photo', 'Photo', '', 'file', ['photo']], ['kicker', 'Label', 'Driver profile'], ['name', 'Name', 'Maja Kowalczyk'], ['team', 'Team or hub', 'FAT Racing, F4 shortlist'],
      ['metrics', 'Scores, out of 100', 'Pace; 94\nConsistency; 88\nRacecraft; 90\nAdaptability; 86', 'area'], HANDLE] },
  carousel: { label: 'Carousel', hint: 'Page 1 is the cover; later pages carry one point each.',
    fields: [['page', 'Page', '1'], ['total', 'Of', '5'], ['headline', 'Heading', 'How TalentID picks an F4 driver', 'area'], ['body', 'Text, pages 2 onwards', 'Every lap of every session counts. Pace, consistency, racecraft and adaptability are scored against the class, so one index compares drivers from Lagos to Łódź.', 'area'], HANDLE] },
};

export const variantOf = (type, v) => (TYPES[type].variants || [['default']]).some(x => x[0] === v) ? v : (TYPES[type].variants || [['default']])[0][0];
export const fieldsFor = (type, v) => TYPES[type].fields.filter(f => !f[4] || f[4].includes(variantOf(type, v)));
// the columns of each row field, for the maker's row editor; rows are stored as "a; b; c" lines
export const ROWS = {
  // grid: the columns of the row's cells; the first cell spans the row when wide is set
  'results.rows': { cols: [['Driver'], ['Team'], ['Time', 'mono']], grid: 'minmax(0,1.15fr) minmax(0,1fr)', wide: true, numbered: true, max: v => v === 'podium' ? 3 : 5, add: 'Add a driver' },
  'date.rows': { cols: [['Time', 'mono'], ['Session']], grid: '82px minmax(0,1fr)', max: () => 7, add: 'Add a session' },
  'profile.metrics': { cols: [['Score'], ['Value', 'range']], grid: 'minmax(0,1.3fr) minmax(0,1fr) 30px', max: () => 5, add: 'Add a score' },
};
export const defaults = (type, v) => Object.assign(Object.fromEntries(TYPES[type].fields.map(f => [f[0], f[2]])), TYPES[type].variantDefaults?.[variantOf(type, v)]);

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
    const wide = lines.some(l => measure(l, size, weight, family, ls) > max);
    if ((lines.length <= maxLines && lines.length * size * lh <= height && !wide) || size <= min) return { size, lines, h: lines.length * size * lh, lh };
  }
}
const textBlock = (lines, x, y, size, lh, attrs, anchor = 'start') => lines.length
  ? `<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}" ${attrs}>${lines.map((l, i) => `<tspan x="${x}" dy="${i ? size * lh : 0}">${esc(l)}</tspan>`).join('')}</text>` : '';
const SEMI = 'font-family="Sora" font-weight="600"', REG = 'font-family="Sora" font-weight="400"', LIGHT = 'font-family="Sora" font-weight="300"', MONO = 'font-family="IBM Plex Mono" font-weight="400"', MONOM = 'font-family="IBM Plex Mono" font-weight="500"';

// a board cut at 55° both ends, leaning like the glyph (top left to bottom right): the offset is 0.7 of its height
const board = (x, y, h, text, fill, color, size) => {
  const w = measure(text, size, 600) + h * 1.6, c = h * 0.7;
  return { w, svg: `<polygon points="${x},${y} ${x + w - c},${y} ${x + w},${y + h} ${x + c},${y + h}" fill="${fill}"/><text x="${x + w / 2}" y="${y + h / 2 + size * 0.36}" font-size="${size}" text-anchor="middle" ${SEMI} fill="${color}">${esc(text)}</text>` };
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

  const v = variantOf(o.type, o.variant);
  const semi = (lines, x, y, size, lh, fill = g.ink) => parts.push(textBlock(lines, x, y + size * 0.86, size, lh, `${SEMI} fill="${fill}" letter-spacing="-0.02em"`));
  const mono = (text, x, y, size, fill = g.dim, extra = '') => text && parts.push(`<text x="${x}" y="${y}" font-size="${size}" ${MONO} fill="${fill}" ${extra}>${esc(text)}</text>`);
  const cut = h => h * 0.7;
  const bar = (x, y, w, h, fill) => w > cut(h) && parts.push(`<polygon points="${x},${y} ${x + w - cut(h)},${y} ${x + w},${y + h} ${x + cut(h)},${y + h}" fill="${fill}"/>`);
  let clip = 0;
  const photoBox = (px, py, pw, ph) => {
    const id = 'pc' + clip++;
    defs.push(`<clipPath id="${id}"><rect x="${px}" y="${py}" width="${pw}" height="${ph}"/></clipPath>`);
    if (env.photo && env.photoSize) {
      // cover the box, keeping the focal point (0 to 1 across and down the photo) in view
      const { w: iw, h: ih } = env.photoSize, fx = env.focus?.x ?? 0.5, fy = env.focus?.y ?? 0.5, s = Math.max(pw / iw, ph / ih), dw = iw * s, dh = ih * s;
      const dx = px + Math.min(0, Math.max(pw - dw, pw / 2 - fx * dw)), dy = py + Math.min(0, Math.max(ph - dh, ph / 2 - fy * dh));
      parts.push(`<image href="${env.photo}" x="${dx}" y="${dy}" width="${dw}" height="${dh}" preserveAspectRatio="none" clip-path="url(#${id})"/>`);
    } else if (env.photo) parts.push(`<image href="${env.photo}" x="${px}" y="${py}" width="${pw}" height="${ph}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${id})"/>`);
    else parts.push(`<rect x="${px}" y="${py}" width="${pw}" height="${ph}" fill="${o.ground === 'light' ? '#F0F0F0' : g.blueprint ? '#0E3673' : '#1C1E22'}"/><text x="${px + pw / 2}" y="${py + ph / 2}" font-size="${28 * u}" ${MONO} fill="${g.dim}" text-anchor="middle">Add a photo</text>`);
  };

  // a band of 55° stripes inside the margins: whole stripes only, blue for engineering, red for racing,
  // one stripe's worth of ground between the two groups
  const stripes = (y, h) => {
    const sw = 16 * ub, per = 38 * ub, k = cut(h), n = Math.floor((TW - sw - k) / per) + 1;
    const blue = Math.max(1, Math.min(n - 3, Math.round((n - 1) * { balance: 0.5, blue: 0.68, red: 0.32 }[biz.lean])));
    const x = x0 + (TW - sw - k - (n - 1) * per) / 2;
    for (let i = 0; i < n; i++) {
      if (i === blue) continue;
      const sx = x + i * per, c = i < blue ? g.line : g.blueprint ? g.line : g.accent;
      parts.push(`<polygon points="${sx},${y} ${sx + sw},${y} ${sx + sw + k},${y + h} ${sx + k},${y + h}" fill="${c}"/>`);
    }
    return y + h;
  };

  const headlineStack = ({ kicker, headline, support, counter }, deco = 'seam') => {
    let ceiling = below + 40 * u, maxW = TW;
    if (deco === 'seam') { const th = seam(); if (land) maxW = TW - Math.min(W, H) * 0.29 * 1.25 - 20; else ceiling = Math.max(ceiling, th + 40 * u); }
    logo(x0, top, logoH);
    if (deco === 'stripes') ceiling = stripes(below + (land ? 36 : 60) * ub, (land ? 90 : 150) * ub) + 50 * u;
    const floor = footer(counter);
    const sup = fit(support, { max: maxW, start: 36 * ub, min: 24 * u, lines: 3, weight: 300, lh: 1.3 });
    const kick = kicker ? 58 * ub : 0;
    const hl = fit(headline, { max: maxW, start: (land ? 118 : 104) * ub * (deco === 'plain' ? 1.2 : 1), min: 44 * u, lines: land ? 3 : 6, height: floor - ceiling - sup.h - kick - 30 * u, ls: -0.02 });
    let y = floor - sup.h - (sup.lines.length ? 26 * u : 0) - hl.h;
    if (kicker) mono(kicker, x0, y - 28 * ub, 28 * ub, g.lineText);
    semi(hl.lines, x0, y, hl.size, hl.lh);
    y += hl.h + 26 * u;
    parts.push(textBlock(sup.lines, x0, y + sup.size * 0.9, sup.size, sup.lh, `${LIGHT} fill="${g.dim}"`));
  };

  // a figure with its unit tucked against it; returns its width
  const figureAt = (text, unit, x, y, size, fill = g.ink, unitFill = g.accent) => {
    const fw = measure(text || '', size, 600) - size * 0.04 * ([...(text || '')].length + 1), us = size * 0.34;
    parts.push(`<text x="${x - size * 0.04}" y="${y}" font-size="${size}" ${SEMI} fill="${fill}" letter-spacing="-0.04em">${esc(text)}</text>`);
    if (unit) parts.push(`<text x="${x + fw + us * 0.06}" y="${y}" font-size="${us}" ${SEMI} fill="${unitFill}">${esc(unit)}</text>`);
    return fw + (unit ? measure(unit, us, 600) + us * 0.06 : 0);
  };
  const figureSize = (text, unit, start, maxW) => { let s = start; while (s > 60 && measure(text || '0', s, 600, 'Sora', -0.04) + measure(' ' + (unit || ''), s * 0.34, 600) > maxW) s *= 0.95; return s; };
  const captionAndSource = (floor, x, w, capStart = 44 * ub) => {
    const cap = fit(d.caption, { max: w, start: capStart, min: 26 * u, lines: 4, weight: 400, lh: 1.3 });
    const srcH = d.source ? 64 * u : 0, top_ = floor - srcH - cap.h;
    parts.push(textBlock(cap.lines, x, top_ + cap.size * 0.9, cap.size, cap.lh, `${REG} fill="${g.ink}"`));
    if (d.source) { parts.push(`<rect x="${x}" y="${top_ + cap.h + 22 * u}" width="${w}" height="${1.5 * u}" fill="${g.rule}"/>`); mono('Source: ' + d.source, x, top_ + cap.h + 60 * u, 24 * u); }
    return top_;
  };
  // big figure, a place, a title: the date and countdown share this layout
  const dayLayout = (big_, under) => {
    seam(); logo(x0, top, logoH);
    const floor = footer();
    const cx = land ? x0 + TW * 0.46 : x0, cw = land ? TW * 0.54 : TW;
    const pl = fit(d.place, { max: cw, start: 32 * ub, min: 22 * u, lines: 2, weight: 400, family: 'IBM Plex Mono', lh: 1.3 });
    const ti = fit(d.title, { max: cw, start: 72 * ub, min: 38 * u, lines: 3, ls: -0.02 });
    const y = floor - pl.h - 24 * ub - ti.h;
    semi(ti.lines, cx, y, ti.size, ti.lh);
    parts.push(textBlock(pl.lines, cx, y + ti.h + 24 * ub + pl.size * 0.9, pl.size, pl.lh, `${MONO} fill="${g.dim}"`));
    const daySize = figureSize(big_, '', (land ? 300 : 340) * ub, land ? TW * 0.42 : TW), dayBase = land ? floor - 50 * u : y - 90 * ub;
    figureAt(big_, '', x0, dayBase, daySize);
    parts.push(`<text x="${x0}" y="${dayBase + 50 * ub}" font-size="${34 * ub}" ${MONOM} fill="${g.lineText}">${esc(under)}</text>`);
    if (d.kicker) parts.push(board(x0, dayBase - daySize * 0.72 - 110 * ub, 60 * ub, d.kicker, g.accent, g.onAccent, 28 * ub).svg);
  };
  const lines = s => String(s || '').split('\n').map(r => r.split(';').map(x => x.trim())).filter(r => r[0]);

  const t = o.type;
  if (t === 'headline') headlineStack(d, v);

  else if (t === 'carousel' && Number(d.page || 1) <= 1) headlineStack({ kicker: 'Swipe', headline: d.headline, support: '', counter: `01 / ${String(d.total || 1).padStart(2, '0')}  →` });

  else if (t === 'carousel') {
    logo(x0, top, logoH);
    const n = String(d.page).padStart(2, '0'), last = Number(d.page) >= Number(d.total);
    const floor = footer(`${n} / ${String(d.total || 1).padStart(2, '0')}${last ? '' : '  →'}`);
    parts.push(board(x0, below + 70 * u, 64 * u, n, g.accent, g.onAccent, 34 * u).svg);
    let y = below + 70 * u + 64 * u + 56 * u;
    const hl = fit(d.headline, { max: TW, start: 76 * ub, min: 40 * u, lines: 3, ls: -0.02 });
    semi(hl.lines, x0, y, hl.size, hl.lh);
    y += hl.h + 34 * u;
    const bd = fit(d.body, { max: land ? TW * 0.8 : TW, start: 40 * ub, min: 24 * u, lines: 12, height: floor - y, weight: 400, lh: 1.4 });
    parts.push(textBlock(bd.lines, x0, y + bd.size * 0.9, bd.size, bd.lh, `${REG} fill="${g.dim}"`));
  }

  else if (t === 'figure' && v === 'compare') {
    logo(x0, top, logoH);
    const floor = footer();
    if (land) {
      const colW = TW * 0.3, s1 = figureSize(d.from, d.unit, 150 * ub, colW), s2 = figureSize(d.figure, d.unit, 300 * ub, TW * 0.5);
      const base = below + (floor - below) * 0.62;
      mono(d.fromLabel, x0, base - s2 * 0.8, 26 * u); figureAt(d.from, d.unit, x0, base - s2 * 0.8 + s1 * 0.9, s1, g.dim, g.dim);
      mono(d.toLabel, x0 + TW * 0.36, base - s2 * 0.8, 26 * u, g.lineText); figureAt(d.figure, d.unit, x0 + TW * 0.36, base, s2);
      parts.push(`<rect x="${x0 + TW * 0.36 - 40 * u}" y="${base - s2 * 0.9}" width="${1.5 * u}" height="${s2 * 0.95}" fill="${g.rule}"/>`);
      const cap = fit(d.caption, { max: TW * 0.9, start: 30 * u * 1.2, min: 22 * u, lines: 1, weight: 400 });
      parts.push(textBlock(cap.lines, x0, base + 60 * u, cap.size, 1.2, `${REG} fill="${g.ink}"`));
      mono(d.source && 'Source: ' + d.source, x0, base + 100 * u, 22 * u);
    } else {
      const capTop = captionAndSource(floor, x0, TW);
      const room = capTop - 60 * ub - (below + 80 * u) - 146 * ub;
      const s2 = Math.min(figureSize(d.figure, d.unit, 330 * ub, TW), room / 1.11), s1 = s2 * 0.42;
      const base2 = capTop - 60 * ub;
      mono(d.toLabel, x0, base2 - s2 * 0.78, 28 * ub, g.lineText);
      figureAt(d.figure, d.unit, x0, base2, s2);
      const base1 = base2 - s2 * 0.78 - 70 * ub;
      parts.push(`<rect x="${x0}" y="${base1 + 34 * ub}" width="${TW}" height="${1.5 * u}" fill="${g.rule}"/>`);
      figureAt(d.from, d.unit, x0, base1, s1, g.dim, g.dim);
      mono(d.fromLabel, x0, base1 - s1 * 0.78 - 20 * ub, 28 * ub);
    }
  }

  else if (t === 'figure') {
    logo(x0, top, logoH);
    const floor = footer();
    const prog = v === 'progress', pct = Math.max(0, Math.min(1, parseFloat(String(d.figure).replace(/[^\d.-]/g, '')) / (parseFloat(d.max) || 100))) || 0;
    const trackH = 40 * ub, trackBlock = prog ? trackH + 70 * u : 0;
    let size = figureSize(d.figure, d.unit, (land ? 330 : prog ? 330 : 400) * ub, TW * (land ? 0.55 : 1)), y;
    const track = (ty) => {
      bar(x0, ty, TW, trackH, g.track); bar(x0, ty, Math.max(cut(trackH) * 2, TW * pct), trackH, g.accent);
      mono('0', x0, ty + trackH + 36 * u, 22 * ub); mono(d.max || '100', x1, ty + trackH + 36 * u, 22 * ub, g.dim, 'text-anchor="end"');
    };
    if (land) {
      y = below + (floor - trackBlock - below) / 2 + size * 0.36;
      const cx = x0 + TW * 0.56;
      const cap = fit(d.caption, { max: TW * 0.42, start: 44 * ub, min: 26 * u, lines: 4, weight: 400, lh: 1.3 });
      parts.push(textBlock(cap.lines, cx, y - size * 0.36 - cap.h / 2 + cap.size * 0.9, cap.size, cap.lh, `${REG} fill="${g.ink}"`));
      mono(d.source && 'Source: ' + d.source, cx, y - size * 0.36 + cap.h / 2 + 50 * u, 22 * u);
      if (prog) track(floor - trackH - 40 * u);
    } else {
      const capTop = captionAndSource(floor, x0, TW);
      if (prog) track(capTop - 50 * u - trackBlock);
      y = capTop - 50 * u - trackBlock - (prog ? 70 * u : 0);
    }
    figureAt(d.figure, d.unit, x0, y, size);
  }

  else if (t === 'quote') {
    let qTop = below + 120 * u, qx = x0, qw = land ? TW * 0.86 : TW, topPhoto = false;
    if (v === 'photo' && land) { const pw = Math.round(W * 0.42); photoBox(W - pw, 0, pw, H); qw = W - pw - 2 * m; }
    else if (v === 'photo') { const ph = Math.round(H * (o.format === 'story' ? 0.4 : 0.44)); photoBox(0, 0, W, ph); qTop = ph + 110 * u; topPhoto = true; }
    // with a photo across the top, the lockup moves to the foot, as on the photo post
    if (topPhoto) { const lw = env.logos[`${biz.key}-${g.logo}`]?.ratio * 44 * u || 0; logo(x1 - lw, y1 - 44 * u + 4 * u, 44 * u); } else logo(x0, top, logoH);
    const floor = footer('', x0, v === 'photo' && land ? x0 + qw : x1);
    const attrH = (d.name ? 44 * ub : 0) + (d.role ? 38 * ub : 0);
    const q = fit(d.quote ? `“${d.quote.replace(/^[“"]|[”"]$/g, '')}”` : '', { max: qw, start: (land ? 64 : 68) * ub * (v === 'photo' ? 0.8 : 1), min: 28 * u, lines: land ? 5 : 8, height: floor - qTop - attrH - 50 * u, weight: 300, lh: 1.22, ls: -0.01 });
    let y = floor - attrH - 50 * u - q.h;
    parts.push(`<rect x="${qx}" y="${y - 56 * u}" width="${110 * u}" height="${8 * u}" fill="${g.accent}"/>`);
    parts.push(textBlock(q.lines, qx - q.size * 0.3, y + q.size * 0.86, q.size, q.lh, `${LIGHT} fill="${g.ink}" letter-spacing="-0.01em"`).replace(/<tspan x="[^"]+" dy="([^"]+)">/g, (s, dy) => dy === '0' ? s : `<tspan x="${qx}" dy="${dy}">`));
    y += q.h + 50 * u;
    if (d.name) { parts.push(`<text x="${qx}" y="${y + 30 * ub}" font-size="${32 * ub}" ${SEMI} fill="${g.ink}">${esc(d.name)}</text>`); y += 44 * ub; }
    mono(d.role, qx, y + 28 * ub, 24 * ub);
  }

  else if (t === 'photo') {
    const story = o.format === 'story', split = (v === 'split' || land) && !story && v !== 'frame';
    let lmax = TW, textTop, colR = x1;
    if (v === 'frame') {
      logo(x0, top, logoH);
      if (land) { const px = x0 + TW * 0.5; photoBox(px, top, x1 - px, H - top - bottom); lmax = TW * 0.5 - 40 * u; colR = x0 + lmax; textTop = below + 60 * u; }
      else { const ph = Math.round((H - top - bottom) * (story ? 0.46 : o.format === 'square' ? 0.4 : 0.46)); photoBox(x0, below + 40 * u, TW, ph); textTop = below + 40 * u + ph + 40 * u; }
    } else if (split) {
      const pw = Math.round(W * (land ? 0.5 : 0.44)); photoBox(W - pw, 0, pw, H); lmax = W - pw - 2 * m + 20 * u; colR = x0 + lmax; textTop = below + 60 * u; logo(x0, top, logoH * (land ? 1 : 0.8));
    } else {
      const ph = Math.round(H * (story ? 0.5 : 0.58)); photoBox(0, 0, W, ph); textTop = ph - 38 * u;
    }
    const floor = footer('', x0, colR);
    let y = textTop;
    if (d.kicker) parts.push(board(x0, y, 64 * u, d.kicker, g.accent, g.onAccent, 30 * u).svg);
    y += 64 * u + 44 * u;
    const hl = fit(d.headline, { max: lmax, start: (split ? 76 : 80) * ub, min: 30 * u, lines: split ? 7 : 3, height: floor - y, ls: -0.02 });
    semi(hl.lines, x0, y, hl.size, hl.lh);
    if (!split && v !== 'frame') { const lw = env.logos[`${biz.key}-${g.logo}`]?.ratio * 44 * u || 0; logo(x1 - lw, y1 - 44 * u + 4 * u, 44 * u); }
  }

  else if (t === 'results') {
    logo(x0, top, logoH);
    const floor = footer();
    let y = below + 90 * u;
    const tt = fit(d.title, { max: TW, start: 72 * ub, min: 46 * u, lines: 1, ls: -0.02 });
    parts.push(textBlock(tt.lines, x0, y, tt.size, tt.lh, `${SEMI} fill="${g.ink}" letter-spacing="-0.02em"`));
    y += 50 * ub;
    if (d.event) { mono(d.event, x0, y, 26 * ub, g.lineText); y += 44 * ub; }
    const rows = lines(d.rows);
    if (v === 'podium') {
      const top3 = rows.slice(0, 3), gap = 20 * u, cw = (TW - 2 * gap) / 3, order = [1, 0, 2];
      const nameBlock = 150 * ub, area = floor - y - nameBlock - 20 * u, hs = [0.62, 0.44, 0.3];
      order.forEach((i, col) => {
        const r = top3[i]; if (!r) return;
        const x = x0 + col * (cw + gap), hb = area * hs[i], yt = floor - hb, c = cw * 0.16;
        parts.push(`<polygon points="${x},${yt} ${x + cw - c},${yt} ${x + cw},${yt + c / 0.7} ${x + cw},${floor} ${x},${floor}" fill="${i === 0 ? g.accent : g.board}"/>`);
        const ns = Math.min(hb * 0.55, 150 * ub);
        parts.push(`<text x="${x + 24 * u}" y="${yt + ns * 0.95 + 14 * u}" font-size="${ns}" ${SEMI} fill="${i === 0 ? g.onAccent : g.onBoard}" letter-spacing="-0.04em">${i + 1}</text>`);
        const nm = fit(r[0], { max: cw - 8 * u, start: 38 * ub, min: 22 * u, lines: 2, lh: 1.08 });
        let ty = yt - 24 * u - (r[2] ? 40 * ub : 0) - (r[1] ? 34 * ub : 0) - nm.h;
        semi(nm.lines, x, ty, nm.size, nm.lh); ty += nm.h + 30 * ub;
        if (r[1]) { mono(r[1], x, ty, 22 * ub); ty += 36 * ub; }
        if (r[2]) parts.push(`<text x="${x}" y="${ty + 4 * u}" font-size="${30 * ub}" ${MONOM} fill="${g.ink}">${esc(r[2])}</text>`);
      });
    } else {
      const show = rows.slice(0, land ? 3 : 5);
      const rh = Math.min(128 * ub * (big > 1 ? 1.25 : 1), (floor - y) / Math.max(show.length, 1));
      show.forEach((r, i) => {
        const ry = y + i * rh, mid = ry + rh / 2, bh = Math.min(56 * ub, rh * 0.5);
        parts.push(`<rect x="${x0}" y="${ry + rh}" width="${TW}" height="${1.5 * u}" fill="${g.rule}"/>`);
        const b = board(x0, mid - bh / 2, bh, String(i + 1), i === 0 ? g.accent : g.board, i === 0 ? g.onAccent : g.onBoard, bh * 0.5);
        parts.push(b.svg);
        const nx = x0 + b.w + 28 * ub, vs = 38 * ub, vw = measure(r[2] || '', vs, 500, 'IBM Plex Mono');
        const ns = fit(r[0], { max: x1 - vw - 30 * u - nx, start: 40 * ub, min: 24 * u, lines: 1 }).size;
        parts.push(`<text x="${nx}" y="${r[1] ? mid - 4 * ub : mid + ns * 0.36}" font-size="${ns}" ${SEMI} fill="${g.ink}">${esc(r[0])}</text>`);
        mono(r[1], nx, mid + 34 * ub, 24 * ub);
        if (r[2]) parts.push(`<text x="${x1}" y="${mid + vs * 0.36}" font-size="${vs}" ${MONOM} fill="${g.ink}" text-anchor="end">${esc(r[2])}</text>`);
      });
    }
  }

  else if (t === 'date' && v === 'schedule') {
    logo(x0, top, logoH);
    const floor = footer();
    const cx = land ? x0 : x0, colW = land ? TW * 0.42 : TW;
    let y = below + 80 * u;
    const ti = fit(d.title, { max: colW, start: 72 * ub, min: 38 * u, lines: 3, ls: -0.02 });
    semi(ti.lines, cx, y, ti.size, ti.lh); y += ti.h + 26 * ub;
    const pl = fit(d.place, { max: colW, start: 30 * ub, min: 22 * u, lines: 2, weight: 400, family: 'IBM Plex Mono', lh: 1.3 });
    parts.push(textBlock(pl.lines, cx, y + pl.size * 0.9, pl.size, pl.lh, `${MONO} fill="${g.lineText}"`)); y += pl.h + 40 * ub;
    const rows = lines(d.rows).slice(0, land ? 5 : 7), rx = land ? x0 + TW * 0.5 : x0, rw = land ? TW * 0.5 : TW;
    const ry0 = land ? below + 40 * u : y, rh = Math.min(110 * ub * (big > 1 ? 1.3 : 1), (floor - ry0) / Math.max(rows.length, 1));
    const ts = 36 * ub, bh = 50 * ub, tw = Math.max(0, ...rows.map(r => measure(r[0], ts, 500, 'IBM Plex Mono'))) + 2 * cut(bh) + 12 * ub, nx = rx + tw + 30 * ub;
    rows.forEach((r, i) => {
      const ry = ry0 + i * rh, mid = ry + rh / 2, lead = i === rows.length - 1;
      parts.push(`<rect x="${rx}" y="${ry}" width="${rw}" height="${1.5 * u}" fill="${g.rule}"/>`);
      if (lead) bar(rx, mid - bh / 2, tw, bh, g.accent);
      parts.push(`<text x="${rx + tw / 2}" y="${mid + ts * 0.36}" font-size="${ts}" ${MONOM} fill="${lead ? g.onAccent : g.lineText}" text-anchor="middle">${esc(r[0])}</text>`);
      const nm = fit(r[1] || '', { max: x0 + (land ? TW : TW) - nx, start: 40 * ub, min: 24 * u, lines: 1 });
      parts.push(`<text x="${nx}" y="${mid + nm.size * 0.36}" font-size="${nm.size}" ${SEMI} fill="${g.ink}">${esc(r[1] || '')}</text>`);
    });
  }

  else if (t === 'date') v === 'countdown' ? dayLayout(d.days, d.daysLabel) : dayLayout(d.day, d.month);

  else if (t === 'profile') {
    let contentTop = below + 60 * u, colR = x1, cx = x0;
    if (v === 'photo') {
      if (land) { const pw = Math.round(W * 0.38); photoBox(W - pw, 0, pw, H); colR = W - pw - m; }
      else { const ph = Math.round(H * (o.format === 'story' ? 0.36 : 0.4)); photoBox(0, 0, W, ph); contentTop = ph + 50 * u; }
    }
    if (v === 'photo' && !land) { const lw = env.logos[`${biz.key}-${g.logo}`]?.ratio * 44 * u || 0; logo(x1 - lw, y1 - 44 * u + 4 * u, 44 * u); } else logo(x0, top, logoH);
    const cw = colR - cx, floor = footer('', x0, colR);
    const ms = lines(d.metrics).slice(0, 5);
    const rowH = Math.min(92 * ub, (floor - contentTop) * 0.5 / Math.max(ms.length, 1)), msTop = floor - ms.length * rowH;
    const labW = cw * 0.34, valW = 90 * ub, bx = cx + labW, bw = cw - labW - valW;
    ms.forEach((r, i) => {
      const mid = msTop + i * rowH + rowH / 2, val = Math.max(0, Math.min(100, parseFloat(r[1]) || 0));
      parts.push(`<text x="${cx}" y="${mid + 11 * ub}" font-size="${30 * ub}" ${REG} fill="${g.dim}">${esc(r[0])}</text>`);
      bar(bx, mid - 14 * ub, bw, 28 * ub, g.track); bar(bx, mid - 14 * ub, Math.max(cut(28 * ub) * 2, bw * val / 100), 28 * ub, g.ink);
      parts.push(`<text x="${cx + cw}" y="${mid + 13 * ub}" font-size="${36 * ub}" ${MONOM} fill="${g.ink}" text-anchor="end">${esc(r[1] || '')}</text>`);
    });
    const tm = fit(d.team, { max: cw, start: 30 * ub, min: 22 * u, lines: 2, weight: 400, family: 'IBM Plex Mono', lh: 1.3 });
    const nm = fit(d.name, { max: cw, start: (v === 'photo' ? 84 : 110) * ub, min: 40 * u, lines: 2, height: msTop - 60 * ub - tm.h - contentTop - 100 * ub, ls: -0.02 });
    let y = msTop - 60 * ub - tm.h - 26 * ub - nm.h;
    if (d.kicker) parts.push(board(cx, y - 100 * ub, 60 * ub, d.kicker, g.accent, g.onAccent, 28 * ub).svg);
    semi(nm.lines, cx, y, nm.size, nm.lh); y += nm.h + 26 * ub;
    parts.push(textBlock(tm.lines, cx, y + tm.size * 0.9, tm.size, tm.lh, `${MONO} fill="${g.lineText}"`));
  }

  // safe area, for the frames only
  if (o.guides) parts.push(`<g id="guides"><rect x="${x0}" y="${top}" width="${TW}" height="${y1 - top}" fill="none" stroke="#2F80FF" stroke-width="2" stroke-dasharray="12 8" opacity=".7"/>${o.format === 'story' ? `<rect width="${W}" height="${top}" fill="#2F80FF" opacity=".12"/><rect y="${y1}" width="${W}" height="${H - y1}" fill="#2F80FF" opacity=".12"/>` : ''}</g>`);

  const style = env.fontCSS ? `<style>${env.fontCSS}</style>` : '';
  const title = { headline: d.headline, carousel: d.headline, figure: `${d.figure}${d.unit} ${d.caption}`, quote: d.quote, photo: d.headline, results: d.title, date: d.title, profile: d.name }[t] || '';
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
