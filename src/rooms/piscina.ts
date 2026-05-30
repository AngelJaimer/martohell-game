import { P, css, type RGB } from '../art/palette';
import { Pixels, rampPick } from '../art/dither';
import { drawText } from '../art/font';
import { drawJoan, drawIvan } from '../art/actor';
import { JOAN_DIALOGUE, IVAN_DIALOGUE } from '../content/dialogues';
import type { Room, NPC, Hotspot, Exit } from '../engine/types';

// Entrada de la piscina municipal — a modern street. El Joan, the lifeguard,
// is here having a smoke. Give him the burger and he hands over the porro.

function r(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, c: RGB) {
  ctx.fillStyle = css(c);
  ctx.fillRect(x | 0, y | 0, w | 0, h | 0);
}

function youngTree(ctx: CanvasRenderingContext2D, x: number, baseY: number, h: number) {
  r(ctx, x - 1, baseY - h, 2, h, P.trunk);
  ctx.fillStyle = css(P.leafDark);
  ctx.beginPath(); ctx.arc(x, baseY - h - 4, 8, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = css(P.leaf);
  ctx.beginPath(); ctx.arc(x - 2, baseY - h - 5, 5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = css(P.leafLit);
  ctx.beginPath(); ctx.arc(x + 1, baseY - h - 7, 3, 0, Math.PI * 2); ctx.fill();
}

export function buildPiscinaScene(): HTMLCanvasElement {
  const cv = document.createElement('canvas');
  cv.width = 320; cv.height = 144;
  const ctx = cv.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  r(ctx, 0, 0, 320, 144, [126, 144, 158]); // base fill so no transparent gaps

  // bright daytime sky
  const img = ctx.createImageData(320, 40);
  const px = new Pixels(img, 320, 40);
  const sky: RGB[] = [P.skyTop, P.skyUpper, P.skyMid];
  for (let y = 0; y < 40; y++) for (let x = 0; x < 320; x++) px.set(x, y, rampPick(sky, y / 40, x, y));
  ctx.putImageData(img, 0, 0);

  // --- left: brick apartment block ---
  r(ctx, 0, 20, 130, 80, [156, 96, 74]);
  r(ctx, 0, 20, 130, 3, [186, 124, 96]);
  ctx.fillStyle = css([130, 78, 60]);
  for (let yy = 24; yy < 100; yy += 4) ctx.fillRect(0, yy, 130, 1);
  for (let wy = 28; wy < 92; wy += 20) for (let wx = 10; wx < 122; wx += 24) {
    r(ctx, wx, wy, 12, 13, [60, 70, 78]); r(ctx, wx + 1, wy + 1, 10, 11, [150, 178, 196]);
    r(ctx, wx - 2, wy + 13, 16, 2, [70, 58, 50]);    // balcony slab
    for (let b = 0; b < 7; b++) r(ctx, wx - 1 + b * 2, wy + 13, 1, 4, [60, 50, 44]);
  }

  // --- right: the big concrete wall of the municipal pool ---
  r(ctx, 168, 14, 152, 86, P.concrete);
  r(ctx, 168, 14, 152, 3, P.concreteLit);
  r(ctx, 168, 14, 3, 86, P.concreteLit);
  ctx.fillStyle = css(P.concreteDark);
  for (let yy = 30; yy < 100; yy += 18) ctx.fillRect(168, yy, 152, 1);   // panel seams
  for (let xx = 200; xx < 320; xx += 40) ctx.fillRect(xx, 14, 1, 86);
  // entrance recess + glass doors
  r(ctx, 236, 52, 52, 48, P.concreteDark);
  r(ctx, 240, 56, 44, 44, [120, 170, 188]);   // glass
  r(ctx, 261, 56, 2, 44, [180, 210, 220]);
  for (let gx = 244; gx < 284; gx += 8) r(ctx, gx, 58, 1, 40, [150, 192, 206]);
  // sign over the door
  r(ctx, 232, 40, 60, 11, [40, 96, 150]);
  r(ctx, 232, 40, 60, 1, [80, 140, 196]);
  drawText(ctx, 'PISCINA', 240, 42, [235, 240, 248], 1, [20, 40, 70], 1);

  // --- paved pedestrian street ---
  r(ctx, 0, 100, 320, 44, [150, 148, 150]);
  r(ctx, 0, 100, 320, 1, [178, 176, 178]);
  // perspective paving lines converging to the centre
  ctx.strokeStyle = css([124, 122, 126]); ctx.lineWidth = 1;
  for (let i = -4; i <= 4; i++) { ctx.beginPath(); ctx.moveTo(160 + i * 12, 100); ctx.lineTo(160 + i * 40, 144); ctx.stroke(); }
  for (let yy = 110; yy < 144; yy += 9) ctx.fillRect(0, yy, 320, 1);

  // street furniture
  youngTree(ctx, 150, 100, 30);
  youngTree(ctx, 116, 100, 26);
  for (const lx of [196, 300]) { r(ctx, lx, 56, 2, 44, [70, 72, 78]); r(ctx, lx - 2, 54, 7, 3, [90, 92, 98]); }
  // a bench against the wall
  r(ctx, 300, 112, 20, 2, [104, 100, 96]); r(ctx, 300, 106, 20, 2, [120, 116, 110]);

  drawText(ctx, 'Piscina Municipal', 36, 7, P.inkLight, 1, P.black, 1);
  return cv;
}

export function piscinaOverlays(ctx: CanvasRenderingContext2D, t: number) {
  // a faint wisp of smoke rising near Joan
  const a = 0.10 + 0.06 * Math.sin(t * 1.4);
  ctx.fillStyle = 'rgba(210,210,210,' + a.toFixed(3) + ')';
  ctx.fillRect(218, 92 - Math.round((t * 6) % 10), 1, 2);
  ctx.fillRect(220, 86 - Math.round((t * 5) % 12), 1, 2);
}

const HOTSPOTS: Hotspot[] = [
  { id: 'entrada', name: 'la entrada de la piscina', x: 232, y: 40, w: 60, h: 60, walkTo: { x: 250, y: 138 },
    look: 'La entrada de la piscina municipal. Cerrada al público hasta las cuatro, dice el cartel. El socorrista, en cambio, abierto a todo.' },
  { id: 'bloque', name: 'el bloque de pisos', x: 0, y: 20, w: 130, h: 80, walkTo: { x: 60, y: 138 },
    look: 'Un bloque de pisos de ladrillo, con la ropa tendida y una parabólica torcida. Hogar, dulce hogar para alguien.' },
  { id: 'arbol', name: 'un arbolito', x: 142, y: 64, w: 18, h: 34, walkTo: { x: 150, y: 138 },
    look: 'Un arbolito recién plantado, atado a su tutor. Aún no da sombra ni para una hormiga.' },
];

const NPCS: NPC[] = [
  {
    id: 'joan', name: 'el Joan', x: 196, y: 78, w: 28, h: 56,
    feet: { x: 210, y: 132 }, walkTo: { x: 184, y: 138 }, facing: 'left', color: [240, 200, 170],
    look: 'El Joan, el socorrista. Calvo, cachas y con un porro en la oreja. Vigila la piscina con la misma intensidad con la que la ignora.',
    draw: drawJoan, dialogue: JOAN_DIALOGUE,
    accepts: {
      hamburguesa: {
        line: '¡Una burger! Eres un fenómeno, de verdad. Toma, un piti de los míos de premio. Te lo has ganado, máquina.',
        give: 'porro',
        remove: ['hamburguesa'],
        flag: 'has_porro',
      },
    },
  },
  {
    id: 'ivan', name: 'el Iván', x: 236, y: 80, w: 24, h: 50,
    feet: { x: 248, y: 122 }, walkTo: { x: 236, y: 138 }, facing: 'left', color: [232, 212, 212],
    look: 'El Iván, un guaperas del Atleti con gafas de sol hasta de noche. Habla de fútbol, de fichajes y poco más.',
    draw: drawIvan, dialogue: IVAN_DIALOGUE,
  },
];

const EXITS: Exit[] = [
  { id: 'toEsglesia', name: 'la plaza de la Iglesia', x: 0, y: 104, w: 16, h: 40, walkTo: { x: 22, y: 138 }, to: 'esglesia', entry: { x: 290, y: 136 }, arrow: 'left' },
];

export const PISCINA: Room = {
  id: 'piscina',
  build: buildPiscinaScene,
  overlays: piscinaOverlays,
  hotspots: HOTSPOTS,
  npcs: NPCS,
  exits: EXITS,
  walk: { minX: 16, maxX: 300, minY: 122, maxY: 140 },
  start: { x: 30, y: 135 },
};
