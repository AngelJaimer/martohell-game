import { P, css, type RGB } from '../art/palette';
import { Pixels, rampPick } from '../art/dither';
import { drawText } from '../art/font';
import type { Room, Hotspot, Exit } from '../engine/types';

// EPISODE 1 — opening scene. The protagonist wakes under the Pont del Diable
// of Martorell with a mysterious note. Pick it up, then head into town.

function r(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, c: RGB) {
  ctx.fillStyle = css(c);
  ctx.fillRect(x | 0, y | 0, w | 0, h | 0);
}

function brickTex(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.fillStyle = css(P.brickShadow);
  for (let yy = y; yy < y + h; yy += 5) ctx.fillRect(x, yy, w, 1);
  for (let yy = y; yy < y + h; yy += 5) {
    const off = (((yy - y) / 5) % 2) * 8;
    for (let xx = x + off; xx < x + w; xx += 16) ctx.fillRect(xx, yy, 1, 5);
  }
}

export function buildPontScene(): HTMLCanvasElement {
  const cv = document.createElement('canvas');
  cv.width = 320; cv.height = 144;
  const ctx = cv.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  r(ctx, 0, 0, 320, 144, [126, 144, 158]); // base fill so no transparent gaps

  // dawn sky
  const img = ctx.createImageData(320, 56);
  const px = new Pixels(img, 320, 56);
  const sky: RGB[] = [P.skyTop, P.skyUpper, P.skyMid, P.skyHorizon];
  for (let y = 0; y < 56; y++) for (let x = 0; x < 320; x++) px.set(x, y, rampPick(sky, y / 56, x, y));
  ctx.putImageData(img, 0, 0);

  // low green hills behind
  ctx.fillStyle = css(P.leafDark);
  ctx.beginPath(); ctx.moveTo(0, 52); ctx.lineTo(60, 40); ctx.lineTo(130, 50); ctx.lineTo(220, 38); ctx.lineTo(320, 50); ctx.lineTo(320, 64); ctx.lineTo(0, 64); ctx.closePath(); ctx.fill();

  // --- the bridge: humped brick body spanning the river ---
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(20, 96); ctx.lineTo(20, 74); ctx.lineTo(120, 40); ctx.lineTo(168, 34);
  ctx.lineTo(300, 70); ctx.lineTo(300, 96); ctx.closePath();
  ctx.clip();                                   // clip brick + texture to the bridge outline
  ctx.fillStyle = css(P.brick); ctx.fillRect(20, 30, 280, 70);
  brickTex(ctx, 20, 30, 280, 70);
  ctx.restore();
  // lit top edge of the roadway
  ctx.strokeStyle = css(P.brickLit); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(20, 74); ctx.lineTo(120, 40); ctx.lineTo(168, 34); ctx.lineTo(300, 70); ctx.stroke();

  // tall pointed (ogival) arch — the signature of the Pont del Diable
  const carve = (path: () => void) => { ctx.save(); ctx.fillStyle = css([34, 38, 48]); ctx.beginPath(); path(); ctx.closePath(); ctx.fill(); ctx.restore(); };
  carve(() => { ctx.moveTo(128, 96); ctx.lineTo(128, 66); ctx.quadraticCurveTo(130, 50, 150, 42); ctx.quadraticCurveTo(170, 50, 172, 66); ctx.lineTo(172, 96); });
  // round arch on the left
  carve(() => { ctx.moveTo(58, 96); ctx.lineTo(58, 78); ctx.arc(76, 78, 18, Math.PI, 0); ctx.lineTo(94, 96); });
  // round arch on the right (was missing)
  carve(() => { ctx.moveTo(226, 96); ctx.lineTo(226, 80); ctx.arc(248, 80, 22, Math.PI, 0); ctx.lineTo(270, 96); });
  // voussoir highlights around the pointed arch
  ctx.strokeStyle = css(P.brickLit); ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(126, 96); ctx.lineTo(126, 66); ctx.quadraticCurveTo(128, 48, 150, 40); ctx.quadraticCurveTo(172, 48, 174, 66); ctx.lineTo(174, 96); ctx.stroke();

  // the little stone gatehouse at the apex
  r(ctx, 142, 18, 18, 18, P.brick);
  r(ctx, 142, 18, 18, 2, P.brickLit);
  r(ctx, 148, 24, 6, 9, [34, 38, 48]);  // doorway
  r(ctx, 140, 16, 22, 2, P.brickShadow);

  // --- the river Llobregat ---
  r(ctx, 0, 96, 320, 22, P.river);
  for (let yy = 98; yy < 118; yy += 3) r(ctx, 0, yy, 320, 1, ((yy / 3) % 2) ? P.river : P.riverLit);
  // reflection of the arches
  r(ctx, 140, 96, 24, 8, [60, 80, 78]);
  r(ctx, 64, 96, 24, 6, [60, 80, 78]);

  // reed banks
  ctx.fillStyle = css(P.leaf);
  for (let x = 0; x < 320; x += 6) { if (x > 96 && x < 280 && (x < 110 || x > 250) === false) { /* keep center clear-ish */ } const h = 6 + ((x * 7) % 5); r(ctx, x, 112 - h, 1, h, ((x % 12 < 6) ? P.leaf : P.leafDark)); }

  // foreground bank where you stand
  r(ctx, 0, 116, 320, 28, [108, 96, 74]);
  r(ctx, 0, 116, 320, 1, [140, 124, 100]);
  for (let y = 122; y < 144; y += 5) for (let x = ((y / 5) % 2) * 6; x < 320; x += 12) r(ctx, x, y, 4, 1, [88, 78, 60]);
  // a low promenade railing
  r(ctx, 0, 118, 320, 2, [210, 206, 198]);
  for (let x = 8; x < 320; x += 26) r(ctx, x, 118, 2, 8, [186, 182, 174]);

  drawText(ctx, 'Pont del Diable', 36, 7, P.inkLight, 1, P.black, 1);
  return cv;
}

export function pontOverlays(ctx: CanvasRenderingContext2D, t: number) {
  // faint morning mist drifting over the water
  const a = 0.06 + 0.04 * Math.sin(t * 0.8);
  ctx.fillStyle = 'rgba(220,224,228,' + a.toFixed(3) + ')';
  ctx.fillRect(0, 100, 320, 14);
}

// the note lies on the bank until picked up
export function drawNota(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = css([226, 214, 180]);
  ctx.save(); ctx.translate(176, 132); ctx.rotate(-0.12);
  ctx.fillRect(-7, -5, 14, 10);
  ctx.fillStyle = css([150, 138, 110]); ctx.fillRect(-7, 0, 14, 1);
  ctx.fillStyle = css([100, 88, 72]); ctx.fillRect(-5, -3, 8, 1); ctx.fillRect(-5, -1, 5, 1);
  ctx.restore();
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 'nota', name: 'la nota misteriosa', x: 166, y: 124, w: 22, h: 14, walkTo: { x: 176, y: 138 },
    look: 'Saco la nota que llevaba encima al despertar: un código rarísimo. Y la letra no es la mía... juraría que es la del Kilian. (¿Quién es el Kilian? Ni idea, pero el nombre me sale solo.)',
  },
  { id: 'puente', name: 'el Pont del Diable', x: 40, y: 18, w: 240, h: 78, walkTo: { x: 150, y: 138 },
    look: 'El Pont del Diable. Dicen que lo construyó el diablo en una noche a cambio de un alma. Mira que hay sitios donde despertar resacoso...' },
  { id: 'rio', name: 'el río', x: 0, y: 98, w: 320, h: 18, walkTo: { x: 90, y: 138 },
    look: 'El Llobregat, bajando turbio. Por un momento pienso en meter la cabeza, pero ya bastante mojado fue anoche, por lo visto.' },
];

const EXITS: Exit[] = [
  { id: 'toVila', name: 'el pueblo', x: 300, y: 116, w: 20, h: 28, walkTo: { x: 296, y: 138 }, to: 'vila', entry: { x: 28, y: 135 }, arrow: 'right' },
];

export const PONT: Room = {
  id: 'pont',
  build: buildPontScene,
  overlays: pontOverlays,
  hotspots: HOTSPOTS,
  npcs: [],
  exits: EXITS,
  walk: { minX: 16, maxX: 300, minY: 122, maxY: 140 },
  start: { x: 120, y: 134 },
};
