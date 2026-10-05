// Renders the pictures the templates embed: business lockups, the glyph, signature lockups and white icons for the
// icon tiles, from the SVGs in assets/logo and the icon library, so the templates always carry the current artwork.
import { readFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium } from 'playwright';
import { bodyOf } from '../../icons/library.js';

export const BUSINESSES = [
  { key: 'smedley-group', name: 'Smedley Group' },
  { key: 'advanced-technology', name: 'Advanced Technology' },
  { key: 'insight-labs', name: 'Insight Labs' },
  { key: 'fat-racing', name: 'FAT Racing' },
];
// the icons the worked slides put in icon tiles
export const TILE_ICONS = ['stopwatch', 'chart-line', 'position', 'rain', 'gauge', 'helmet'];

export async function renderImages(dir) {
  await mkdir(dir, { recursive: true });
  const browser = await chromium.launch(); const page = await browser.newPage();
  const shot = async (html, w, h, file) => {
    await page.setViewportSize({ width: Math.ceil(w), height: Math.ceil(h) });
    await page.setContent(`<html><body style="margin:0;background:transparent">${html}</body></html>`);
    await page.screenshot({ path: join(dir, file), omitBackground: true, clip: { x: 0, y: 0, width: Math.ceil(w), height: Math.ceil(h) } });
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
  // icons, white monoline, for the icon tiles on the slides
  for (const name of TILE_ICONS) await shot(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="192" height="192" fill="none" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${bodyOf(name)}</svg>`, 192, 192, `icon-${name}.png`);
  await browser.close();
  return sizes;
}
