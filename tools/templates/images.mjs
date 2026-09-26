// Renders the pictures the templates embed: business lockups, the glyph, signature lockups and the cover
// backgrounds, from the SVGs in assets/logo so the templates always carry the current artwork.
import { readFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium } from 'playwright';

export const BUSINESSES = [
  { key: 'smedley-group', name: 'Smedley Group', lean: 'balance' },
  { key: 'advanced-technology', name: 'Advanced Technology', lean: 'blue' },
  { key: 'insight-labs', name: 'Insight Labs', lean: 'blue' },
  { key: 'fat-racing', name: 'FAT Racing', lean: 'red' },
];

// where the grid's 55° edge starts along the top, and how wide the red wedge is, on a 1920 x 1080 slide
const LEANS = { balance: { grid: 1060, red: 420 }, blue: { grid: 900, red: 200 }, red: { grid: 1160, red: 560 } };
export const coverTextLimit = lean => LEANS[lean].grid; // px at the top; the edge only moves right further down

const seam = lean => {
  const { grid, red } = LEANS[lean], W = 1920, H = 1080, run = H * 0.7;
  return `<div style="position:relative;width:${W}px;height:${H}px;background:#000;overflow:hidden">
  <div style="position:absolute;inset:0;clip-path:polygon(${grid}px 0,${W}px 0,${W}px ${H}px,${grid + run}px ${H}px);
    background:linear-gradient(rgba(47,128,255,.16) 1px,transparent 1px) 0 0/16px 16px,linear-gradient(90deg,rgba(47,128,255,.16) 1px,transparent 1px) 0 0/16px 16px,
    linear-gradient(rgba(47,128,255,.42) 2px,transparent 2px) 0 0/80px 80px,linear-gradient(90deg,rgba(47,128,255,.42) 2px,transparent 2px) 0 0/80px 80px,#000"></div>
  <svg width="${W}" height="${H}" style="position:absolute;inset:0"><line x1="${grid}" y1="0" x2="${grid + run}" y2="${H}" stroke="#2F80FF" stroke-width="3"/>
    <polygon points="${W - red},0 ${W},0 ${W},${red / 0.7}" fill="#D8231A"/></svg></div>`;
};

export async function renderImages(dir) {
  await mkdir(dir, { recursive: true });
  const browser = await chromium.launch(); const page = await browser.newPage();
  const shot = async (html, w, h, file, transparent = true) => {
    await page.setViewportSize({ width: Math.ceil(w), height: Math.ceil(h) });
    await page.setContent(`<html><body style="margin:0;background:transparent">${html}</body></html>`);
    await page.screenshot({ path: join(dir, file), omitBackground: transparent, clip: { x: 0, y: 0, width: Math.ceil(w), height: Math.ceil(h) } });
  };
  const svgAt = async (file, h) => {
    const svg = await readFile(new URL(`../../assets/logo/${file}`, import.meta.url), 'utf8');
    const [, , vw, vh] = svg.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
    const w = Math.round(h * vw / vh);
    return { html: svg.replace(/width="[^"]*" height="[^"]*"/, `width="${w}" height="${h}"`), w, h, ratio: vw / vh };
  };
  const sizes = {};
  for (const b of BUSINESSES) for (const tone of ['white', 'ink']) {
    const s = await svgAt(`${b.key}-${tone}.svg`, 360); await shot(s.html, s.w, s.h, `${b.key}-${tone}.png`); sizes[b.key] = s.ratio;
  }
  for (const tone of ['white', 'ink']) { const s = await svgAt(`glyph-${tone}.svg`, 460); await shot(s.html, s.w, s.h, `glyph-${tone}.png`); sizes.glyph = s.ratio; }
  // email signatures: ink lockups at twice their 49 px display height
  for (const b of BUSINESSES) { const s = await svgAt(`${b.key}-ink.svg`, 98); await shot(s.html, s.w, s.h, `signature-${b.key}.png`); }
  for (const lean of Object.keys(LEANS)) await shot(seam(lean), 1920, 1080, `cover-${lean}.png`, false);
  await browser.close();
  return sizes;
}
