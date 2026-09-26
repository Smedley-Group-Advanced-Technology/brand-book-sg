// post types and layouts are picked by pictogram: each is a symbol of the post, not the post itself.
// Drawn on a 60 x 60 grid in the page's own colours: ink, dim, red, blue, with every cut at 55°.
const R = (x, y, w, h, c) => `<rect class="${c}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
const B = (x, y, w, h, c) => { const k = h * 0.7; return `<polygon class="${c}" points="${x},${y} ${x + w - k},${y} ${x + w},${y + h} ${x + k},${y + h}"/>`; };
const T = (x, y, s, t, c) => `<text class="${c}" x="${x}" y="${y}" font-size="${s}" font-family="Sora" font-weight="600" letter-spacing="-0.04em">${t}</text>`;
const MARK = '<g class="mk" transform="translate(8 7) scale(.115)"><line x1="21.31" y1="2.59" x2="48.89" y2="41.71"/><line x1="6.71" y1="12.79" x2="47.59" y2="71.21"/><line x1="5.51" y1="42.39" x2="32.89" y2="81.41"/></g>';
const FOOT = (w = 44) => R(8, 51, w, 1, 'b') + R(8, 50, 8, 2, 'r');
const PHOTO = (x, y, w, h) => R(x, y, w, h, 'ph') + `<polygon class="mt" points="${x},${y + h} ${x + w * .34},${y + h * .42} ${x + w * .58},${y + h * .74} ${x + w * .74},${y + h * .54} ${x + w},${y + h * .88} ${x + w},${y + h}"/><circle class="mt" cx="${x + w * .78}" cy="${y + h * .28}" r="${Math.min(w, h) * .09}"/>`;
const SEAM = (gw = 24, rw = 10) => `<polygon class="gr" points="${60 - gw},0 60,0 60,${gw / .7}"/><line class="gl" x1="${60 - gw}" y1="0" x2="60" y2="${gw / .7}"/>` + `<polygon class="r" points="${60 - rw},0 60,0 60,${rw / .7}"/>`;
const STRIPES = y => { let s = ''; for (let x = -6; x < 60; x += 4.5) s += B(x, y, 2.2 + 5.6, 8, x < 26 ? 'b' : x > 29 ? 'r' : 'no'); return `<g>${s}</g>`; };
const SCORE = (y, v) => R(8, y, 8, 1.6, 'd') + B(19, y - .4, 28, 2.4, 'f') + B(19, y - .4, 28 * v, 2.4, 'i') + R(49, y - .2, 3, 2, 'i');
export const PICTOS = {
  'headline.seam': SEAM() + MARK + R(8, 29, 40, 5, 'i') + R(8, 36, 30, 5, 'i') + R(8, 44, 26, 2, 'd') + FOOT(),
  'headline.stripes': MARK + STRIPES(15) + R(8, 29, 40, 5, 'i') + R(8, 36, 30, 5, 'i') + R(8, 44, 26, 2, 'd') + FOOT(),
  'headline.plain': MARK + R(8, 20, 44, 6, 'i') + R(8, 28, 40, 6, 'i') + R(8, 36, 24, 6, 'i') + R(8, 45, 30, 2, 'd') + FOOT(),
  'figure.big': MARK + T(6.5, 39, 27, '57', 'i') + T(37, 39, 9, '%', 'r') + R(8, 43, 36, 2, 'd') + FOOT(),
  'figure.progress': MARK + T(6.5, 31, 21, '57', 'i') + T(31, 31, 7, '%', 'r') + B(8, 35, 44, 4, 'f') + B(8, 35, 27, 4, 'r') + R(8, 43, 32, 2, 'd') + FOOT(),
  'figure.compare': MARK + T(7.5, 23, 9, '+.62', 'd') + R(8, 26, 44, .6, 'f') + T(6.5, 40, 18, '+.18', 'i') + R(8, 44, 32, 2, 'd') + FOOT(),
  'quote.plain': MARK + R(8, 19, 8, 1.6, 'r') + T(5.5, 31, 13, '“', 'i') + R(14, 24, 36, 3, 'i') + R(8, 30, 40, 3, 'i') + R(8, 36, 30, 3, 'i') + R(8, 43, 16, 2, 'i') + FOOT(),
  'quote.photo': PHOTO(0, 0, 60, 25) + R(8, 29, 8, 1.6, 'r') + R(8, 33, 40, 2.6, 'i') + R(8, 38, 32, 2.6, 'i') + R(8, 44, 14, 2, 'd') + FOOT(),
  'photo.below': PHOTO(0, 0, 60, 32) + B(8, 30, 17, 5, 'r') + R(8, 39, 40, 4, 'i') + R(8, 45, 26, 4, 'i') + R(8, 52, 44, 1, 'b') + R(8, 51, 8, 2, 'r'),
  'photo.split': PHOTO(33, 0, 27, 60) + MARK + B(8, 18, 15, 4, 'r') + R(8, 26, 20, 4, 'i') + R(8, 32, 18, 4, 'i') + R(8, 38, 12, 4, 'i') + FOOT(20),
  'photo.frame': MARK + PHOTO(8, 16, 44, 19) + B(8, 32.5, 15, 4, 'r') + R(8, 41, 36, 4, 'i') + FOOT(),
  'results.table': MARK + R(8, 16, 26, 4, 'i') + [24, 30, 36, 42].map((y, i) => B(8, y, 7, 3.4, i ? 'd' : 'r') + R(18, y + .5, 20, 2.4, 'i') + R(44, y + .5, 8, 2.4, 'd')).join('') + FOOT(),
  'results.podium': MARK + R(8, 16, 24, 4, 'i') + R(8, 31, 10, 2, 'i') + R(23, 23, 10, 2, 'i') + R(38, 36, 10, 2, 'i') + R(8, 35, 13, 17, 'd') + R(23, 27, 13, 25, 'r') + R(38, 40, 13, 12, 'd'),
  'date.day': SEAM(20, 8) + MARK + B(8, 16, 13, 4, 'r') + T(6.5, 38, 20, '17', 'i') + R(8, 41, 14, 2, 'b') + R(8, 45, 26, 3, 'i') + FOOT(),
  'date.countdown': SEAM(20, 8) + MARK + B(8, 16, 15, 4, 'r') + T(6.5, 38, 22, '5', 'i') + R(8, 41, 16, 2, 'b') + R(8, 45, 26, 3, 'i') + FOOT(),
  'date.schedule': MARK + R(8, 16, 30, 4, 'i') + [25, 31, 37].map(y => R(8, y, 8, 3, 'b') + R(19, y, 22, 3, 'i')).join('') + B(8, 43, 10, 3.6, 'r') + R(19, 43.3, 16, 3, 'i'),
  'profile.card': MARK + B(8, 15, 14, 4, 'r') + R(8, 22, 36, 5, 'i') + R(8, 29, 20, 2, 'b') + SCORE(35, .9) + SCORE(39.5, .8) + SCORE(44, .85) + SCORE(48.5, .75),
  'profile.photo': PHOTO(0, 0, 60, 24) + B(8, 21.5, 12, 4, 'r') + R(8, 29, 28, 4, 'i') + SCORE(38, .9) + SCORE(42.5, .8) + SCORE(47, .85),
  'carousel.default': R(20, 8, 32, 40, 'f') + R(14, 11, 32, 40, 'f') + R(8, 14, 32, 40, 'card') + R(12, 36, 22, 3.6, 'i') + R(12, 41, 16, 3.6, 'i') + R(12, 49, 24, .8, 'b') + T(44, 55, 8, '→', 'i'),
};
export const picto = key => `<svg viewBox="0 0 60 60" aria-hidden="true">${PICTOS[key] || ''}</svg>`;
