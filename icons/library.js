// The Smedley Group icon library: one drawing style for every icon in the book, the post maker and the kit.
// 24 x 24 grid, 1.5 px stroke, no fill, square line ends and sharp corners; diagonals lean at 55° like the
// glyph (0.7 across for every 1 down). npm run kit writes assets/icons from this file and keeps the book's
// tool icons in step; the icon library page reads it directly.

// a 55° arrowhead: arms 0.7 back for every 1 out, so the head is as sharp as the glyph
const head = (x, y, dir, a = 6) => {
  const k = a * 0.7;
  return { right: `M${x - k} ${y - a}L${x} ${y}L${x - k} ${y + a}`, left: `M${x + k} ${y - a}L${x} ${y}L${x + k} ${y + a}`,
    up: `M${x - a} ${y + k}L${x} ${y}L${x + a} ${y + k}`, down: `M${x - a} ${y - k}L${x} ${y}L${x + a} ${y - k}` }[dir];
};
const P = d => `<path d="${d}"/>`;
const C = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}"/>`;
const F = d => `<path d="${d}" fill="currentColor" stroke="none"/>`;
const G55 = body => `<g transform="rotate(55 12 12)">${body}</g>`;
const r2 = v => Math.round(v * 100) / 100;
const pt = (cx, cy, r, deg) => [r2(cx + r * Math.cos(deg * Math.PI / 180)), r2(cy + r * Math.sin(deg * Math.PI / 180))];
const poly = pts => 'M' + pts.map(p => p.join(' ')).join('L') + 'Z';
// a five-point star, a hexagon and a gear with square teeth, computed so they are exact
const STAR = (cx, cy, R, r) => poly(Array.from({ length: 10 }, (_, i) => pt(cx, cy, i % 2 ? r : R, -90 + i * 36)));
const HEX = (cx, cy, r) => poly(Array.from({ length: 6 }, (_, i) => pt(cx, cy, r, i * 60)));
const GEAR = (cx, cy, ro, ri, n) => { const s = 360 / n, pts = []; for (let i = 0; i < n; i++) { const a = i * s - 90; pts.push(pt(cx, cy, ri, a - s * .5), pt(cx, cy, ri, a - s * .22), pt(cx, cy, ro, a - s * .16), pt(cx, cy, ro, a + s * .16), pt(cx, cy, ri, a + s * .22)); } return poly(pts); };

export const FAMILIES = [['interface', 'Interface'], ['racing', 'Racing'], ['engineering', 'Engineering'], ['media', 'Fans and media']];

// [name, label, family, search words, drawing]
export const ICONS = [
  // ---------- interface ----------
  ['arrow-right', 'Arrow right', 'interface', 'next forward go', P('M4 12H19') + P(head(19.5, 12, 'right'))],
  ['arrow-left', 'Arrow left', 'interface', 'back previous', P('M5 12H20') + P(head(4.5, 12, 'left'))],
  ['arrow-up', 'Arrow up', 'interface', 'top increase', P('M12 5V20') + P(head(12, 4.5, 'up'))],
  ['arrow-down', 'Arrow down', 'interface', 'bottom decrease', P('M12 4V19') + P(head(12, 19.5, 'down'))],
  ['arrow-up-right', 'Arrow up right', 'interface', 'open go out diagonal', P('M8.2 20L17.3 7') + P('M9 5.5H18.5V15')],
  ['chevron-right', 'Chevron right', 'interface', 'next more', P(head(15, 12, 'right', 6.5))],
  ['chevron-left', 'Chevron left', 'interface', 'back', P(head(9, 12, 'left', 6.5))],
  ['chevron-up', 'Chevron up', 'interface', 'collapse', P(head(12, 9, 'up', 6.5))],
  ['chevron-down', 'Chevron down', 'interface', 'expand open select', P(head(12, 15, 'down', 6.5))],
  ['plus', 'Plus', 'interface', 'add new create', P('M12 4.5V19.5M4.5 12H19.5')],
  ['minus', 'Minus', 'interface', 'remove less', P('M4.5 12H19.5')],
  ['close', 'Close', 'interface', 'cancel remove delete x cross', P('M6 6L18 18M18 6L6 18')],
  ['check', 'Check', 'interface', 'done tick confirm yes', P('M4.5 12.8L9 17.3L17.4 5.3')],
  ['search', 'Search', 'interface', 'find magnifier look', C(10.5, 10.2, 6.5) + P('M14.2 15.6L17.8 20.7')],
  ['filter', 'Filter', 'interface', 'funnel refine', P('M3.5 5H20.5L14 12.5V19L10 21V12.5Z')],
  ['menu', 'Menu', 'interface', 'hamburger navigation', P('M4 6.5H20M4 12H20M4 17.5H20')],
  ['more', 'More', 'interface', 'dots overflow options', F('M4.5 11H7V13.5H4.5ZM10.75 11H13.25V13.5H10.75ZM17 11H19.5V13.5H17Z')],
  ['drag', 'Drag', 'interface', 'handle reorder grip move', P('M4.6 8.5L9.5 15.5M9.6 8.5L14.5 15.5M14.6 8.5L19.5 15.5')],
  ['download', 'Download', 'interface', 'save get', P('M12 3.5V15') + P(head(12, 15.5, 'down', 5)) + P('M4.5 16V20.5H19.5V16')],
  ['upload', 'Upload', 'interface', 'send add file', P('M12 16V4.5') + P(head(12, 4, 'up', 5)) + P('M4.5 16V20.5H19.5V16')],
  ['external', 'Open elsewhere', 'interface', 'external new tab link out', P('M10.5 5H5V19H19V13.5') + P('M11.5 14.5L18.5 4.5') + P('M13.5 4H19V9.5')],
  ['link', 'Link', 'interface', 'chain url copy link', P('M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7L11.5 6.8') + P('M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1.5-1.5')],
  ['copy', 'Copy', 'interface', 'duplicate clipboard', P('M8.5 8V3.5H20.5V15.5H16') + P('M3.5 8.5H15.5V20.5H3.5Z')],
  ['edit', 'Edit', 'interface', 'pencil write change', P('M15.6 4.4L19.6 7.2L10 20.9L5.1 21.5L6 16.9Z') + P('M13.4 7.6L17.4 10.4')],
  ['delete', 'Delete', 'interface', 'bin trash remove', P('M4 6.5H20') + P('M9.5 6.5V3.5H14.5V6.5') + P('M6.5 6.5L7.5 20.5H16.5L17.5 6.5') + P('M10.5 10.5V16.5M13.5 10.5V16.5')],
  ['share', 'Share', 'interface', 'send network', C(18, 5.5, 2.3) + C(6, 12, 2.3) + C(18, 18.5, 2.3) + P('M8.1 10.9L15.9 6.6M8.1 13.1L15.9 17.4')],
  ['refresh', 'Refresh', 'interface', 'reload sync again', P('M19.5 12a7.5 7.5 0 1 1-2.2-5.3') + P('M18 3.5V7.5H14')],
  ['replay', 'Replay', 'interface', 'again restart back undo', P('M4.5 12a7.5 7.5 0 1 0 2.2-5.3') + P('M6 3.5V7.5H10')],
  ['settings', 'Settings', 'interface', 'sliders preferences adjust controls', P('M4 7H20M4 12H20M4 17H20') + P('M7.6 5L9 9M14.6 10L16 14M9.6 15L11 19')],
  ['info', 'Information', 'interface', 'about help details', C(12, 12, 9) + P('M12 11V17') + P('M12 7.4V8.2')],
  ['alert', 'Warning', 'interface', 'alert error caution triangle', P('M12 3.5L21 20H3Z') + P('M12 9.5V14.5') + P('M12 17V17.8')],
  ['eye', 'Show', 'interface', 'view visible preview eye', P('M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z') + C(12, 12, 3)],
  ['lock', 'Lock', 'interface', 'private secure password', P('M5 11H19V20.5H5Z') + P('M8 11V7.5a4 4 0 0 1 8 0V11')],
  ['mail', 'Email', 'interface', 'mail message envelope', P('M3 5.5H21V18.5H3Z') + P('M3 6.5L12 13.5L21 6.5')],
  ['phone', 'Phone', 'interface', 'mobile call device', P('M6.5 2.5H17.5V21.5H6.5Z') + P('M10.5 5.5H13.5') + P('M10.5 18.5H13.5')],
  ['location', 'Location', 'interface', 'pin map place hub venue', P('M12 21S5.5 15 5.5 9.8a6.5 6.5 0 0 1 13 0C18.5 15 12 21 12 21Z') + C(12, 9.8, 2.3)],
  ['calendar', 'Calendar', 'interface', 'date schedule event day', P('M3.5 5H20.5V20.5H3.5Z') + P('M3.5 10H20.5') + P('M8.5 3V7M15.5 3V7')],
  ['clock', 'Time', 'interface', 'clock hour duration', C(12, 12, 9) + P('M12 6.5V12L15.5 14.5')],
  ['user', 'Person', 'interface', 'user account driver profile', C(12, 8, 4) + P('M4 21C4 16.6 7.6 14 12 14S20 16.6 20 21')],
  ['users', 'People', 'interface', 'team group users drivers', C(9, 8.5, 3.5) + P('M2.5 20.5C2.5 16.6 5.4 14.5 9 14.5S15.5 16.6 15.5 20.5') + P('M15 5.2a3.5 3.5 0 0 1 0 6.6M17.5 14.8C19.8 15.6 21.5 17.5 21.5 20.5')],
  ['home', 'Home', 'interface', 'start house main', P('M3.5 11L12 4L20.5 11') + P('M6 9.5V20H18V9.5') + P('M10 20V15H14V20')],
  ['grid', 'Grid', 'interface', 'tiles gallery layout', P('M4 4H10.5V10.5H4ZM13.5 4H20V10.5H13.5ZM4 13.5H10.5V20H4ZM13.5 13.5H20V20H13.5Z')],
  ['list', 'List', 'interface', 'rows items lines', P('M9.5 6H20M9.5 12H20M9.5 18H20') + P('M4 5L5.4 7M4 11L5.4 13M4 17L5.4 19')],
  ['bell', 'Notification', 'interface', 'bell alert notify', P('M6 17V11a6 6 0 0 1 12 0v6l1.5 2h-15Z') + P('M10 21.5H14')],
  ['image', 'Picture', 'interface', 'image photo gallery', P('M3 4.5H21V19.5H3Z') + P('M3 17L8.5 11.5L12.5 15.5L15.5 12.5L21 17.5') + C(15.5, 9, 1.5)],
  ['camera', 'Camera', 'interface', 'photo shoot picture', P('M3 7.5H7L9 4.5H15L17 7.5H21V19.5H3Z') + C(12, 13.3, 3.8)],
  ['file', 'File', 'interface', 'document page', P('M6 3H14L18.5 7.5V21H6Z') + P('M14 3V7.5H18.5')],
  ['folder', 'Folder', 'interface', 'directory files', P('M3 5.5H9L11 8H21V19.5H3Z')],
  ['sun', 'Light', 'interface', 'sun light theme day', C(12, 12, 4) + P('M12 2.5V4.5M12 19.5V21.5M2.5 12H4.5M19.5 12H21.5M5.3 5.3L6.7 6.7M17.3 17.3L18.7 18.7M5.3 18.7L6.7 17.3M17.3 6.7L18.7 5.3')],
  ['moon', 'Dark', 'interface', 'moon dark theme night', P('M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z')],
  ['play', 'Play', 'interface', 'start video run', P('M7 4.5V19.5L19.5 12Z')],
  ['pause', 'Pause', 'interface', 'stop hold', P('M6.5 5H10V19H6.5ZM14 5H17.5V19H14Z')],

  ['star', 'Favourite', 'interface', 'star favourite rating best', P(STAR(12, 12.6, 9.2, 3.9))],
  ['bookmark', 'Bookmark', 'interface', 'save later mark', P('M6.5 3.5H17.5V20.5L12 16.5L6.5 20.5Z')],
  ['tag', 'Tag', 'interface', 'label category price', P('M3.5 3.5H11L20.5 13L13 20.5L3.5 11Z') + C(7.8, 7.8, 1.3)],
  ['send', 'Send', 'interface', 'paper plane message submit', P('M3.5 10.8L20.5 3.5L14 20.5L11 13Z') + P('M11 13L20.5 3.5')],
  ['attach', 'Attach', 'interface', 'paperclip attachment file', P('M17.5 9.5L10.2 16.8a3 3 0 0 1-4.2-4.2L13.6 5a2 2 0 0 1 2.8 2.8L9 15.2a1 1 0 0 1-1.4-1.4L14.5 7')],
  ['message', 'Message', 'interface', 'chat comment speech', P('M3.5 4.5H20.5V16.5H11L6.5 20.5V16.5H3.5Z')],
  ['globe', 'Web', 'interface', 'globe world language website', C(12, 12, 9) + P('M12 3C9.5 5.5 8.5 8.5 8.5 12S9.5 18.5 12 21C14.5 18.5 15.5 15.5 15.5 12S14.5 5.5 12 3Z') + P('M3.5 9H20.5M3.5 15H20.5')],
  ['sort', 'Sort', 'interface', 'order arrange up down', P('M8 5V20') + P(head(8, 4.5, 'up', 4)) + P('M16 4V19') + P(head(16, 19.5, 'down', 4))],
  ['zoom-in', 'Zoom in', 'interface', 'magnify enlarge bigger', C(10.5, 10.2, 6.5) + P('M14.2 15.6L17.8 20.7') + P('M10.5 7.5V12.9M7.8 10.2H13.2')],
  ['zoom-out', 'Zoom out', 'interface', 'smaller reduce', C(10.5, 10.2, 6.5) + P('M14.2 15.6L17.8 20.7') + P('M7.8 10.2H13.2')],
  ['expand', 'Full screen', 'interface', 'expand maximise enlarge', P('M14 4H20V10M10 20H4V14') + P('M20 4L13.5 10.5M4 20L10.5 13.5')],
  ['collapse', 'Exit full screen', 'interface', 'collapse minimise shrink', P('M20 4L14 10M4 20L10 14') + P('M14 5V10H19M10 19V14H5')],
  ['login', 'Sign in', 'interface', 'login enter account', P('M13 4H20V20H13') + P('M3.5 12H14') + P(head(14.5, 12, 'right', 4))],
  ['logout', 'Sign out', 'interface', 'logout leave exit', P('M11 4H4V20H11') + P('M9.5 12H20') + P(head(20.5, 12, 'right', 4))],
  ['help', 'Help', 'interface', 'question support faq', C(12, 12, 9) + P('M9.3 9.5a2.8 2.8 0 1 1 3.9 2.6c-.8.4-1.2 1-1.2 1.9V15') + P('M12 17.5V18.3')],
  ['print', 'Print', 'interface', 'printer paper', P('M7 9V3.5H17V9') + P('M7 16.5H4V9H20V16.5H17') + P('M7 13.5H17V20.5H7Z')],
  ['cloud', 'Cloud', 'interface', 'online storage sync', P('M7 19H17.5a4 4 0 0 0 .6-7.95A6 6 0 0 0 6.5 10.2 4.4 4.4 0 0 0 7 19Z')],
  ['eye-off', 'Hide', 'interface', 'hidden invisible private', P('M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z') + C(12, 12, 3) + P('M4 3.5L20 20.5')],
  ['unlock', 'Unlock', 'interface', 'open public access', P('M5 11H19V20.5H5Z') + P('M8 11V7.5a4 4 0 0 1 7.7-1.5')],
  ['sidebar', 'Sidebar', 'interface', 'panel layout navigation', P('M3.5 4.5H20.5V19.5H3.5Z') + P('M9.5 4.5V19.5')],
  ['table', 'Table', 'interface', 'spreadsheet rows columns data', P('M3.5 4.5H20.5V19.5H3.5Z') + P('M3.5 9.5H20.5M3.5 14.5H20.5M10 9.5V19.5')],
  // ---------- racing ----------
  ['flag', 'Chequered flag', 'racing', 'finish race end win', P('M5 21V3.5') + P('M5 4H19.5V13.5H5') + F('M5 4H8.6V8.75H5ZM12.2 4H15.8V8.75H12.2ZM8.6 8.75H12.2V13.5H8.6ZM15.8 8.75H19.5V13.5H15.8Z')],
  ['helmet', 'Helmet', 'racing', 'driver safety kart race', P('M3.5 16.5C3.5 9.8 7.4 5.5 12.8 5.5C17.6 5.5 20.5 9 20.5 13.5V16.5L18.5 18.5H5.5Z') + P('M10.5 9.5H18.9L20.3 13H12Z') + P('M3.8 14.5H9')],
  ['position', 'Position board', 'racing', 'number grid slot p1 board', P('M3 6.5H15.5L21 17.5H8.5Z') + P('M11 9.5L12 9V15')],
  ['podium', 'Podium', 'racing', 'results winners top three', P('M2.5 20.5H21.5') + P('M3.5 20.5V14H9V20.5M9 20.5V8.5H15V20.5M15 20.5V16H20.5V20.5')],
  ['trophy', 'Trophy', 'racing', 'win cup champion', P('M7 4H17V9a5 5 0 0 1-10 0Z') + P('M7 6H4V7.5a3 3 0 0 0 3 3M17 6H20V7.5a3 3 0 0 1-3 3') + P('M12 14V17.5') + P('M8 17.5H16V20.5H8Z')],
  ['tyre', 'Tyre', 'racing', 'tire wheel rubber', C(12, 12, 9) + C(12, 12, 5) + C(12, 12, 1.4) + P([0, 45, 90, 135, 180, 225, 270, 315].map(a => { const [x1, y1] = pt(12, 12, 9, a + 22.5), [x2, y2] = pt(12, 12, 7.2, a + 22.5); return `M${x1} ${y1}L${x2} ${y2}`; }).join(''))],
  ['kart', 'Kart', 'racing', 'go kart vehicle league plan', P('M4 4.5H7.5V9.5H4ZM16.5 4.5H20V9.5H16.5ZM3 14.5H7.5V20.5H3ZM16.5 14.5H21V20.5H16.5Z') + P('M7.5 7H9M15 7H16.5M7.5 17.5H9M15 17.5H16.5') + P('M10 3H14L15 7V17.5L14 21H10L9 17.5V7Z') + C(12, 12.5, 1.8)],
  ['circuit', 'Circuit', 'racing', 'track lap course venue chicane', P('M4 19.5V9.5L8.2 4H12V9.5L15 12H20V19.5Z') + P('M9.5 17.5V21.5')],
  ['gauge', 'Speed', 'racing', 'gauge speedometer pace', P('M4 17.5a8.5 8.5 0 1 1 16 0') + P('M12 16L15.5 11') + P('M12 7V8.5M6.3 9.8L7.4 10.8M17.7 9.8L16.6 10.8')],
  ['lights', 'Start lights', 'racing', 'start lights go race', P('M3 6.5H21V16.5H3Z') + C(7, 11.5, 2) + C(12, 11.5, 2) + C(17, 11.5, 2) + P('M12 16.5V21')],
  ['battery', 'Battery', 'racing', 'electric power charge energy', P('M3 7.5H19V16.5H3Z') + P('M21 10.5V13.5') + P('M11.8 8.8L9.4 12.4H12.6L10.2 15.2')],

  ['medal', 'Medal', 'racing', 'award prize podium', P('M8 3.5L10.6 10.4M16 3.5L13.4 10.4') + C(12, 15, 5) + P('M11 13.2L12.2 12.6V17.3')],
  ['lap', 'Lap', 'racing', 'lap loop again circuit count', P('M19 12a7 7 0 1 1-7-7H15') + P(head(15.5, 5, 'right', 3.5))],
  ['sector', 'Sectors', 'racing', 'split timing sectors', P('M3.5 12H20.5') + P('M3.5 8.5V15.5M9.2 9.5V14.5M14.8 9.5V14.5M20.5 8.5V15.5')],
  ['thermometer', 'Temperature', 'racing', 'track temperature heat weather', P('M10 13.5V4.5a2 2 0 0 1 4 0V13.5a4 4 0 1 1-4 0Z') + P('M12 9V16.5')],
  ['rain', 'Rain', 'racing', 'wet weather conditions', P('M7 14H17a3.5 3.5 0 0 0 .4-7A5 5 0 0 0 7.8 6.7 3.7 3.7 0 0 0 7 14Z') + P('M8.8 16.5L7.4 18.5M12.8 16.5L11.4 18.5M16.8 16.5L15.4 18.5')],
  ['wind', 'Wind', 'racing', 'weather conditions breeze', P('M3.5 9H14a2.5 2.5 0 1 0-2.5-2.5') + P('M3.5 14H17.5a2.5 2.5 0 1 1-2.5 2.5') + P('M3.5 11.5H8.5')],
  ['car', 'Race car', 'racing', 'single seater f4 formula car plan', P('M5.5 2.5H18.5') + P('M11.2 2.5L10.8 8.5M12.8 2.5L13.2 8.5') + P('M4.5 5H7.5V9.5H4.5ZM16.5 5H19.5V9.5H16.5Z') + P('M10.8 8.5L8.5 12V17L10 20.5H14L15.5 17V12L13.2 8.5Z') + C(12, 13.5, 1.6) + P('M3.5 15H7V20.5H3.5ZM17 15H20.5V20.5H17Z') + P('M7 22H17')],
  ['plug', 'Charging', 'racing', 'plug charge electric power', P('M9 3.5V8M15 3.5V8') + P('M6.5 8H17.5V11.5a5.5 5.5 0 0 1-11 0Z') + P('M12 17V20.5')],
  ['headset', 'Team radio', 'racing', 'radio headset pit wall comms', P('M4.5 14V12a7.5 7.5 0 0 1 15 0V14') + P('M4.5 13.5H7.5V19H4.5ZM16.5 13.5H19.5V19H16.5Z') + P('M18 19V20.5H13.5')],
  ['start-grid', 'Grid', 'racing', 'starting grid slots positions', P('M4.5 4.5H10.5V8M13.5 9H19.5V12.5M4.5 13.5H10.5V17M13.5 18H19.5V21.5')],
  // ---------- engineering: the tools ----------
  ['spanner', 'Spanner', 'engineering', 'wrench tool fix', G55(P('M8.77 10.7H16.43A2.7 2.7 0 1 1 16.43 13.3H8.77A3.8 3.8 0 0 1 1.67 13.4H5.2V10.6H1.67A3.8 3.8 0 0 1 8.77 10.7Z') + C(18.8, 12, 1))],
  ['ratchet', 'Ratchet', 'engineering', 'socket tool wrench', G55(P('M13.5 10.6H3.5V13.4H13.5') + C(16.9, 12, 3.4) + P('M16 11.1H17.8V12.9H16Z'))],
  ['torque-wrench', 'Torque wrench', 'engineering', 'torque tool setting', G55(P('M2 10.4H8.5V13.6H2Z') + P('M8.5 11.1H15.9M8.5 12.9H15.9') + C(18.3, 12, 2.5))],
  ['hex-key', 'Hex key', 'engineering', 'allen key tool', G55(P('M3.5 10.3H19.5V17.5H16.5V13.3H3.5Z'))],
  ['calliper', 'Calliper', 'engineering', 'caliper measure vernier', P('M3.5 7.5H11.5M15.5 7.5H21.5') + P('M3.5 7.5V20.5H6.5') + P('M11.5 5.5H15.5V9.5H11.5Z') + P('M12.5 9.5V20.5H9.5') + P('M13.5 5.5V3.5')],
  ['tyre-gauge', 'Tyre gauge', 'engineering', 'pressure tyre gauge', C(12, 10, 6.5) + P('M12 10L9.2 7.2') + P('M12 16.5V21M9.5 21H14.5')],
  ['stopwatch', 'Stopwatch', 'engineering', 'timer lap time', C(12, 13.5, 7) + P('M12 13.5V9.5') + P('M12 6.5V3.5M10 3.5H14')],
  ['data-logger', 'Data logger', 'engineering', 'telemetry screen trace', P('M3 4.5H21V16.5H3Z') + P('M6.5 13L9.5 10L11.5 11.5L14.5 8L17.5 10') + P('M12 16.5V19.5M9 19.5H15')],
  // ---------- engineering: data and software ----------
  ['chip', 'Chip', 'engineering', 'processor hardware electronics', P('M7 7H17V17H7Z') + P('M10 10H14V14H10Z') + P('M9.5 3.5V7M14.5 3.5V7M9.5 17V20.5M14.5 17V20.5M3.5 9.5H7M3.5 14.5H7M17 9.5H20.5M17 14.5H20.5')],
  ['signal', 'Telemetry', 'engineering', 'signal wireless live data', P('M12 21V12') + C(12, 10.5, 1.5) + P('M8.3 6.8a5.2 5.2 0 0 1 7.4 0M5.6 4.1a9 9 0 0 1 12.8 0')],
  ['laptop', 'Laptop', 'engineering', 'computer screen app', P('M5 5H19V15H5Z') + P('M2.5 18.5H21.5L20 15H4Z')],
  ['code', 'Code', 'engineering', 'software developer brackets', P(head(4.5, 12, 'left', 6)) + P(head(19.5, 12, 'right', 6)) + P('M13.6 6.5L10.4 17.5')],
  ['database', 'Database', 'engineering', 'data storage records', P('M4.5 6C4.5 4.3 7.9 3 12 3S19.5 4.3 19.5 6 16.1 9 12 9 4.5 7.7 4.5 6Z') + P('M4.5 6V18C4.5 19.7 7.9 21 12 21S19.5 19.7 19.5 18V6') + P('M4.5 12C4.5 13.7 7.9 15 12 15S19.5 13.7 19.5 12')],
  ['chart-line', 'Line chart', 'engineering', 'trend graph data analytics', P('M3.5 4V20.5H21') + P('M7 15L11 10.5L14 13L19.5 6.5')],
  ['chart-bar', 'Bar chart', 'engineering', 'graph data results', P('M3.5 20.5H21') + P('M5.5 13H8.5V20.5H5.5ZM10.5 8H13.5V20.5H10.5ZM15.5 11H18.5V20.5H15.5Z')],
  ['set-square', 'Set square', 'engineering', 'drawing blueprint 55 degrees design', P('M4.5 3.5V20.5H16.4Z') + P('M8 12V17H11.5Z')],
  ['cube', 'Simulation', 'engineering', 'cube 3d model simulation', P('M12 3L20 7.5V16.5L12 21L4 16.5V7.5Z') + P('M4 7.5L12 12L20 7.5') + P('M12 12V21')],
  ['nut', 'Nut', 'engineering', 'bolt hex fastener', P(HEX(12, 12, 8.8)) + C(12, 12, 3.6)],
  ['gear', 'Gear', 'engineering', 'cog mechanism gearbox', P(GEAR(12, 12, 9.2, 7, 8)) + C(12, 12, 3)],
  ['ruler', 'Ruler', 'engineering', 'measure scale length', G55(P('M1.5 9.5H22.5V14.5H1.5Z') + P('M5.5 9.5V12M9.5 9.5V11M13.5 9.5V12M17.5 9.5V11'))],
  ['compass', 'Compass', 'engineering', 'drawing drafting design', P('M12 3V5.5') + C(12, 7.2, 1.7) + P('M11.1 8.8L6.5 20.5M12.9 8.8L17.5 20.5') + P('M8.2 16.2H15.8')],
  ['waveform', 'Signal trace', 'engineering', 'waveform oscilloscope data sensor', P('M2.5 12H5.5L7.5 6L10.5 18L13.5 8L15.5 15L17 12H21.5')],
  ['server', 'Server', 'engineering', 'backend hosting infrastructure', P('M4 4H20V10H4ZM4 14H20V20H4Z') + P('M7 7H8.5M7 17H8.5')],
  ['network', 'Network', 'engineering', 'nodes connection system', C(12, 5, 2) + C(5, 19, 2) + C(19, 19, 2) + P('M12 7V12M12 12L6.5 17.5M12 12L17.5 17.5')],
  ['radar', 'Sensor', 'engineering', 'radar sensor scan detection', P('M20.5 12a8.5 8.5 0 1 1-2.5-6M16.8 12a4.8 4.8 0 1 1-1.4-3.4') + P('M12 12L18.8 5.2') + C(12, 12, 1)],
  ['flask', 'Lab', 'engineering', 'flask experiment research insight labs', P('M9.5 3.5V9L4.5 19.5H19.5L14.5 9V3.5') + P('M8.5 3.5H15.5') + P('M7 14.5H17')],
  ['lightbulb', 'Idea', 'engineering', 'lightbulb insight idea', P('M9 17V14.8a6 6 0 1 1 6 0V17Z') + P('M9.5 20.5H14.5')],
  ['target', 'Target', 'engineering', 'goal aim objective', C(12, 12, 9) + C(12, 12, 5.5) + C(12, 12, 2)],
  ['chart-pie', 'Pie chart', 'engineering', 'share proportion data', P('M12 3.5V12H20.5A8.5 8.5 0 1 1 12 3.5Z') + P('M15 3.9A8.5 8.5 0 0 1 20.1 9H15Z')],
  ['layers', 'Layers', 'engineering', 'stack levels cad', P('M12 3.5L21 8L12 12.5L3 8Z') + P('M3 12L12 16.5L21 12') + P('M3 16L12 20.5L21 16')],

  // ---------- fans and media ----------
  ['megaphone', 'Announcement', 'media', 'megaphone news shout campaign', P('M3.5 10H7L17.5 4.5V19.5L7 14H3.5Z') + P('M7 14L8.5 20H11L9.8 14.8') + P('M20.5 10V14')],
  ['ticket', 'Ticket', 'media', 'event entry admission', P('M3.5 6.5H20.5V10a2 2 0 0 0 0 4V17.5H3.5V14a2 2 0 0 0 0-4Z') + P('M14.5 6.5V8M14.5 11V13M14.5 16V17.5')],
  ['video', 'Video', 'media', 'film camera stream footage', P('M3 6H16V18H3Z') + P('M16 10.5L21 7.5V16.5L16 13.5')],
  ['broadcast', 'Live', 'media', 'live broadcast stream on air', C(12, 12, 2) + P('M8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7M5.6 5.6a9 9 0 0 0 0 12.8M18.4 5.6a9 9 0 0 1 0 12.8')],
  ['stadium', 'Venue', 'media', 'stadium crowd arena venue', P('M2.5 12C2.5 8.4 6.8 5.5 12 5.5S21.5 8.4 21.5 12 17.2 18.5 12 18.5 2.5 15.6 2.5 12Z') + P('M7 9.5H17V14.5H7Z') + P('M12 9.5V14.5')],
  ['poll', 'Poll', 'media', 'vote survey results', P('M3.5 4H14V7H3.5ZM3.5 10.5H20.5V13.5H3.5ZM3.5 17H10V20H3.5Z')],
  ['heart', 'Like', 'media', 'heart like love fan', P('M12 20S3.5 14.8 3.5 9A4.5 4.5 0 0 1 12 6.8 4.5 4.5 0 0 1 20.5 9C20.5 14.8 12 20 12 20Z')],
  ['newspaper', 'News', 'media', 'article press story', P('M4 4.5H17V19.5H6a2 2 0 0 1-2-2Z') + P('M17 8.5H20V17.5a2 2 0 0 1-2 2') + P('M7 8H14M7 11.5H14M7 15H11')],
  ['microphone', 'Interview', 'media', 'microphone audio podcast voice', P('M9 4.5a3 3 0 0 1 6 0V11a3 3 0 0 1-6 0Z') + P('M5.5 11a6.5 6.5 0 0 0 13 0') + P('M12 17.5V21')],
  ['hashtag', 'Hashtag', 'media', 'social tag topic', P('M10.2 4L7.4 20M16.6 4L13.8 20') + P('M4.5 9H20M4 15H19.5')],
];

export const svgOf = ([name, label, , , body], extra = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" stroke-linejoin="miter"${extra}><title>${label}</title>${body}</svg>`;
export const bodyOf = name => (ICONS.find(i => i[0] === name) || [])[4] || '';
export const sprite = () => `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">${ICONS.map(([n, l, , , b]) => `<symbol id="sg-${n}" viewBox="0 0 24 24"><title>${l}</title>${b}</symbol>`).join('')}</svg>`;
