// post types and layouts are picked by pictogram: each is a symbol of the post, not the post itself.
// Drawn on a 60 x 60 grid in the page's own colours: ink, the quiet text colour, the selected fill and Pale Blue,
// with rounded parts throughout.
const R = (x, y, w, h, c, r = 0) => `<rect class="${c}" x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/>`;
// a rounded bar: half its height as the radius
const B = (x, y, w, h, c) => R(x, y, Math.max(w, h), h, c, h / 2);
const T = (x, y, s, t, c) => `<text class="${c}" x="${x}" y="${y}" font-size="${s}" font-family="Sora" font-weight="600" letter-spacing="-0.04em">${t}</text>`;
const MARK = '<g class="mk" transform="translate(8 7) scale(.115)"><line x1="21.31" y1="2.59" x2="48.89" y2="41.71"/><line x1="6.71" y1="12.79" x2="47.59" y2="71.21"/><line x1="5.51" y1="42.39" x2="32.89" y2="81.41"/></g>';
// the footer: the fading Pale Blue divider
const FOOT = (w = 44) => `<rect class="p" x="8" y="50.5" width="${w}" height="1"/>`;
// the strapline band, full bleed
const BAND = y => R(0, y, 60, 6, 's') + R(18, y + 2.4, 24, 1.2, 'on');
// a photo: hills and a sun, sized by the photo's width so tall photos keep low hills
const PHOTO = (x, y, w, h) => { const m = Math.min(h, w * .62), b = y + h, sy = y + Math.min(h * .28, w * .3);
  return R(x, y, w, h, 'ph') + `<polygon class="mt" points="${x},${b} ${x + w * .34},${b - m * .58} ${x + w * .58},${b - m * .26} ${x + w * .74},${b - m * .46} ${x + w},${b - m * .12} ${x + w},${b}"/><circle class="mt" cx="${x + w * .78}" cy="${sy}" r="${Math.min(w, h) * .09}"/>`; };
const SCORE = (y, v) => R(8, y, 9, 1.6, 'd') + B(21, y - .5, 31, 2.6, 'f') + B(21, y - .5, 31 * v, 2.6, 'i');
const EYE = (y, w = 12) => R(8, y, w, 1.6, 'd');
// the mark sits in the top left corner down to y 17; content starts at y 20, the divider sits at y 50.5
export const PICTOS = {
  'headline.band': MARK + EYE(22) + R(8, 26, 40, 5, 'i') + R(8, 33, 30, 5, 'i') + BAND(41) + FOOT(),
  'headline.card': MARK + R(8, 20, 44, 28, 's', 3) + R(12, 24, 6, 6, 'cd', 1.5) + R(12, 34, 32, 4, 'on') + R(12, 40, 22, 4, 'on') + FOOT(),
  'headline.plain': MARK + R(8, 21, 44, 6, 'i') + R(8, 29, 40, 6, 'i') + R(8, 37, 24, 6, 'i') + R(8, 46, 30, 1.6, 'd') + FOOT(),
  'figure.big': MARK + T(6.5, 40, 27, '57', 'i') + T(37, 40, 9, '%', 'd') + R(8, 44, 36, 2, 'd') + FOOT(),
  'figure.progress': MARK + T(6.5, 35, 20, '57', 'i') + T(30.5, 35, 7, '%', 'd') + B(8, 38.5, 44, 4, 'f') + B(8, 38.5, 27, 4, 's') + R(8, 45.5, 30, 1.6, 'd') + FOOT(),
  'figure.compare': MARK + T(7.5, 27, 8.5, '+.62', 'd') + R(8, 29.5, 44, .6, 'p') + T(6.5, 43, 15, '+.18', 'i') + R(8, 46, 30, 1.6, 'd') + FOOT(),
  'quote.plain': MARK + R(8, 20, 8, 1.6, 'p', .8) + T(6, 35, 12, '“', 'i') + R(15, 26, 35, 3, 'i') + R(8, 32, 40, 3, 'i') + R(8, 38, 30, 3, 'i') + R(8, 44.5, 16, 1.8, 'd') + FOOT(),
  'quote.photo': PHOTO(0, 0, 60, 25) + R(8, 29, 8, 1.6, 'p', .8) + R(8, 33, 40, 2.6, 'i') + R(8, 38, 32, 2.6, 'i') + R(8, 44, 14, 1.8, 'd') + FOOT(),
  'photo.below': PHOTO(0, 0, 60, 32) + EYE(35) + R(8, 39, 40, 4, 'i') + R(8, 45, 26, 3.4, 'i') + FOOT(),
  'photo.split': PHOTO(33, 0, 27, 60) + MARK + EYE(22, 10) + R(8, 28, 20, 4, 'i') + R(8, 34, 18, 4, 'i') + R(8, 40, 12, 4, 'i') + FOOT(20),
  'photo.frame': MARK + PHOTO(8, 20, 44, 17) + EYE(39) + R(8, 42, 36, 3.6, 'i') + FOOT(),
  'results.table': MARK + R(8, 20, 26, 3.6, 'i') + [27, 32.5, 38, 43.5].map((y, i) => R(8, y, 6, 3.2, i ? 'f' : 's', 1) + R(18, y + .5, 20, 2.2, 'i') + R(44, y + .5, 8, 2.2, 'd')).join('') + FOOT(),
  'results.podium': MARK + R(8, 20, 22, 3.6, 'i') + R(8, 34, 10, 1.8, 'i') + R(23.5, 27.5, 10, 1.8, 'i') + R(39, 38, 10, 1.8, 'i') + R(8, 38, 13, 14, 'f', 2) + R(23.5, 31, 13, 21, 's', 2) + R(39, 42, 13, 10, 'f', 2),
  'date.day': MARK + EYE(20) + T(6.5, 40, 17, '17', 'i') + R(8, 42.5, 14, 1.6, 'd') + R(8, 45.5, 24, 2.4, 'i') + FOOT(),
  'date.countdown': MARK + EYE(20) + T(6.5, 40, 18, '5', 'i') + R(8, 42.5, 16, 1.6, 'd') + R(8, 45.5, 24, 2.4, 'i') + FOOT(),
  'date.schedule': MARK + R(8, 20, 30, 3.6, 'i') + [27, 33, 39].map(y => R(8, y, 8, 2.8, 'd') + R(19, y, 22, 2.8, 'i')).join('') + R(7, 44.4, 10, 4, 's', 1) + R(19, 45.3, 16, 2.8, 'i'),
  'profile.card': MARK + EYE(20) + R(8, 25, 34, 4.4, 'i') + R(8, 31.5, 20, 1.6, 'd') + SCORE(39, .9) + SCORE(43.5, .78) + SCORE(48, .85),
  'profile.photo': PHOTO(0, 0, 60, 22) + EYE(25) + R(8, 28, 28, 4, 'i') + R(8, 34, 18, 1.6, 'd') + SCORE(40, .9) + SCORE(44.5, .78) + SCORE(49, .85),
  'carousel.default': R(20, 8, 32, 40, 'f', 3) + R(14, 11, 32, 40, 'f', 3) + R(8, 14, 32, 40, 'card', 3) + R(12, 36, 22, 3.6, 'i') + R(12, 41, 16, 3.6, 'i') + R(12, 49, 24, .8, 'p') + T(44, 55, 8, '→', 'i'),
};
export const picto = key => `<svg viewBox="0 0 60 60" aria-hidden="true">${PICTOS[key] || ''}</svg>`;

// formats: the post's own shape, with its proportion written inside
export function formatPicto(f) {
  const ar = f.w / f.h, W_ = ar >= 1 ? 46 : 46 * ar, H_ = ar >= 1 ? 46 / ar : 46, x = (60 - W_) / 2, y = (60 - H_) / 2;
  const size = Math.min(8.6, (W_ - 8) / (f.ratio.length * 0.62)); // the number fits inside the shape with room either side
  return `<svg viewBox="0 0 60 60" aria-hidden="true"><rect class="card" x="${x}" y="${y}" width="${W_}" height="${H_}" rx="3"/>`
    + `<text class="i" x="30" y="${30 + size * 0.36}" font-size="${size}" font-family="Sora" font-weight="600" text-anchor="middle" style="font-variant-numeric:tabular-nums">${f.ratio}</text></svg>`;
}

// grounds: a swatch of the ground itself with its name written inside, in the ground's own ink
const GROUND_COLOURS = {
  light: { bg: '#F0F0F0', ink: '#000000', name: '#F0F0F0' },
  dark: { bg: 'url(#gsf)', ink: '#FFFFFF', name: '45°' },
};
export function groundPicto(key) {
  const c = GROUND_COLOURS[key] || GROUND_COLOURS.light;
  return `<svg viewBox="0 0 60 60" aria-hidden="true"><defs><linearGradient id="gsf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#000000"/><stop offset="1" stop-color="#222A35"/></linearGradient></defs>`
    + `<rect width="60" height="60" rx="6" fill="${c.bg}" stroke="#ABC0E4" stroke-width=".75"/>`
    + `<text x="30" y="${30 + 7.6 * 0.36}" font-size="7.6" font-family="Sora" font-weight="600" text-anchor="middle" fill="${c.ink}">${c.name}</text></svg>`;
}
