// post types and layouts are picked by pictogram: each is a symbol of the post, not the post itself.
// Drawn on a 60 x 60 grid in the page's own colours: ink, dim, red, blue, with every cut at 55°.
const R = (x, y, w, h, c) => `<rect class="${c}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
const B = (x, y, w, h, c) => { const k = h * 0.7; return `<polygon class="${c}" points="${x},${y} ${x + w - k},${y} ${x + w},${y + h} ${x + k},${y + h}"/>`; };
const T = (x, y, s, t, c) => `<text class="${c}" x="${x}" y="${y}" font-size="${s}" font-family="Sora" font-weight="600" letter-spacing="-0.04em">${t}</text>`;
const MARK = '<g class="mk" transform="translate(8 7) scale(.115)"><line x1="21.31" y1="2.59" x2="48.89" y2="41.71"/><line x1="6.71" y1="12.79" x2="47.59" y2="71.21"/><line x1="5.51" y1="42.39" x2="32.89" y2="81.41"/></g>';
const FOOT = (w = 44) => R(8, 51, w, 1, 'b') + R(8, 50, 8, 2, 'r');
// a photo: mountains and a sun, sized by the photo's width so tall photos keep low hills
const PHOTO = (x, y, w, h) => { const m = Math.min(h, w * .62), b = y + h, sy = y + Math.min(h * .28, w * .3);
  return R(x, y, w, h, 'ph') + `<polygon class="mt" points="${x},${b} ${x + w * .34},${b - m * .58} ${x + w * .58},${b - m * .26} ${x + w * .74},${b - m * .46} ${x + w},${b - m * .12} ${x + w},${b}"/><circle class="mt" cx="${x + w * .78}" cy="${sy}" r="${Math.min(w, h) * .09}"/>`; };
const SEAM = (gw = 24, rw = 10) => `<polygon class="gr" points="${60 - gw},0 60,0 60,${gw / .7}"/><line class="gl" x1="${60 - gw}" y1="0" x2="60" y2="${gw / .7}"/>` + `<polygon class="r" points="${60 - rw},0 60,0 60,${rw / .7}"/>`;
const STRIPES = y => { let s = ''; for (let x = -6; x < 60; x += 4.5) s += B(x, y, 2.2 + 5.6, 8, x < 26 ? 'b' : x > 29 ? 'r' : 'no'); return `<g>${s}</g>`; };
const SCORE = (y, v) => R(8, y, 9, 1.6, 'd') + B(21, y - .5, 31, 2.6, 'f') + B(21, y - .5, 31 * v, 2.6, 'i');
// the mark sits in the top left corner down to y 17; content starts at y 20, the scale rule sits at y 50 to 52
export const PICTOS = {
  'headline.seam': SEAM() + MARK + R(8, 29, 40, 5, 'i') + R(8, 36, 30, 5, 'i') + R(8, 44, 26, 2, 'd') + FOOT(),
  'headline.stripes': MARK + STRIPES(20) + R(8, 31, 40, 5, 'i') + R(8, 38, 28, 5, 'i') + R(8, 46, 24, 1.6, 'd') + FOOT(),
  'headline.plain': MARK + R(8, 21, 44, 6, 'i') + R(8, 29, 40, 6, 'i') + R(8, 37, 24, 6, 'i') + R(8, 46, 30, 1.6, 'd') + FOOT(),
  'figure.big': MARK + T(6.5, 40, 27, '57', 'i') + T(37, 40, 9, '%', 'r') + R(8, 44, 36, 2, 'd') + FOOT(),
  'figure.progress': MARK + T(6.5, 35, 20, '57', 'i') + T(30.5, 35, 7, '%', 'r') + B(8, 38.5, 44, 4, 'f') + B(8, 38.5, 27, 4, 'r') + R(8, 45.5, 30, 1.6, 'd') + FOOT(),
  'figure.compare': MARK + T(7.5, 27, 8.5, '+.62', 'd') + R(8, 29.5, 44, .6, 'f') + T(6.5, 43, 15, '+.18', 'i') + R(8, 46, 30, 1.6, 'd') + FOOT(),
  'quote.plain': MARK + R(8, 20, 8, 1.6, 'r') + T(6, 35, 12, '“', 'i') + R(15, 26, 35, 3, 'i') + R(8, 32, 40, 3, 'i') + R(8, 38, 30, 3, 'i') + R(8, 44.5, 16, 1.8, 'd') + FOOT(),
  'quote.photo': PHOTO(0, 0, 60, 25) + R(8, 29, 8, 1.6, 'r') + R(8, 33, 40, 2.6, 'i') + R(8, 38, 32, 2.6, 'i') + R(8, 44, 14, 1.8, 'd') + FOOT(),
  'photo.below': PHOTO(0, 0, 60, 32) + B(8, 30, 17, 5, 'r') + R(8, 39, 40, 4, 'i') + R(8, 45, 26, 3.4, 'i') + R(8, 52, 44, 1, 'b') + R(8, 51, 8, 2, 'r'),
  'photo.split': PHOTO(33, 0, 27, 60) + MARK + B(8, 21, 15, 4, 'r') + R(8, 28, 20, 4, 'i') + R(8, 34, 18, 4, 'i') + R(8, 40, 12, 4, 'i') + FOOT(20),
  'photo.frame': MARK + PHOTO(8, 20, 44, 17) + B(8, 34.5, 15, 4, 'r') + R(8, 42, 36, 3.6, 'i') + FOOT(),
  'results.table': MARK + R(8, 20, 26, 3.6, 'i') + [27, 32.5, 38, 43.5].map((y, i) => B(8, y, 7, 3.2, i ? 'd' : 'r') + R(18, y + .5, 20, 2.2, 'i') + R(44, y + .5, 8, 2.2, 'd')).join('') + FOOT(),
  'results.podium': MARK + R(8, 20, 22, 3.6, 'i') + R(8, 34, 10, 1.8, 'i') + R(23.5, 27.5, 10, 1.8, 'i') + R(39, 38, 10, 1.8, 'i') + R(8, 38, 13, 14, 'd') + R(23.5, 31, 13, 21, 'r') + R(39, 42, 13, 10, 'd'),
  'date.day': SEAM(18, 7) + MARK + B(8, 20, 13, 4, 'r') + T(6.5, 40, 17, '17', 'i') + R(8, 42.5, 14, 1.6, 'b') + R(8, 45.5, 24, 2.4, 'i') + FOOT(),
  'date.countdown': SEAM(18, 7) + MARK + B(8, 20, 15, 4, 'r') + T(6.5, 40, 18, '5', 'i') + R(8, 42.5, 16, 1.6, 'b') + R(8, 45.5, 24, 2.4, 'i') + FOOT(),
  'date.schedule': MARK + R(8, 20, 30, 3.6, 'i') + [27, 33, 39].map(y => R(8, y, 8, 2.8, 'b') + R(19, y, 22, 2.8, 'i')).join('') + B(8, 45, 10, 3.4, 'r') + R(19, 45.3, 16, 2.8, 'i'),
  'profile.card': MARK + B(8, 20, 14, 4, 'r') + R(8, 27, 34, 4.4, 'i') + R(8, 33.5, 20, 1.6, 'b') + SCORE(39, .9) + SCORE(43.5, .78) + SCORE(48, .85),
  'profile.photo': PHOTO(0, 0, 60, 22) + B(8, 20, 12, 4, 'r') + R(8, 28, 28, 4, 'i') + R(8, 34, 18, 1.6, 'b') + SCORE(40, .9) + SCORE(44.5, .78) + SCORE(49, .85),
  'carousel.default': R(20, 8, 32, 40, 'f') + R(14, 11, 32, 40, 'f') + R(8, 14, 32, 40, 'card') + R(12, 36, 22, 3.6, 'i') + R(12, 41, 16, 3.6, 'i') + R(12, 49, 24, .8, 'b') + T(44, 55, 8, '→', 'i'),
};
export const picto = key => `<svg viewBox="0 0 60 60" aria-hidden="true">${PICTOS[key] || ''}</svg>`;
