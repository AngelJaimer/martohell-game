import { P, css, type RGB } from '../art/palette';
import { Pixels, rampPick } from '../art/dither';
import { drawText } from '../art/font';
import { drawPetito } from '../art/actor';
import { PETITO_DIALOGUE } from '../content/dialogues';
import type { Room, NPC, Hotspot, Exit } from '../engine/types';

// EPISODE 3 — a building site on the street. Help el Petito (the Manu overslept)
// and he pays you a few coins for the toy shop.

function r(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, c: RGB) {
  ctx.fillStyle = css(c);
  ctx.fillRect(x | 0, y | 0, w | 0, h | 0);
}

export function buildObraScene(): HTMLCanvasElement {
  const cv = document.createElement('canvas');
  cv.width = 320; cv.height = 144;
  const ctx = cv.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  r(ctx, 0, 0, 320, 144, [150, 168, 188]); // base daytime fill

  // bright sky
  const img = ctx.createImageData(320, 56);
  const px = new Pixels(img, 320, 56);
  const sky: RGB[] = [P.skyTop, P.skyUpper, P.skyMid];
  for (let y = 0; y < 56; y++) for (let x = 0; x < 320; x++) px.set(x, y, rampPick(sky, y / 56, x, y));
  ctx.putImageData(img, 0, 0);

  // a half-built brick building rising at the back
  r(ctx, 40, 40, 150, 68, [168, 96, 70]);
  ctx.fillStyle = css([130, 74, 54]);
  for (let y = 44; y < 100; y += 6) ctx.fillRect(40, y, 150, 1);
  for (let y = 44; y < 100; y += 6) { const off = (((y - 44) / 6) % 2) * 10; for (let x = 40 + off; x < 190; x += 20) ctx.fillRect(x, y, 1, 6); }
  // jagged unfinished top course
  ctx.fillStyle = css([150, 168, 188]);
  for (let x = 40; x < 190; x += 20) ctx.fillRect(x + 10, 40, 10, 6);
  // window holes
  for (const [wx, wy] of [[70, 56], [120, 56], [70, 80], [120, 80]] as [number, number][]) r(ctx, wx, wy, 18, 16, [40, 38, 44]);

  // scaffolding over the building
  ctx.fillStyle = css([120, 96, 50]);
  for (const sx of [38, 110, 188]) r(ctx, sx, 36, 3, 72, [120, 96, 50]);
  for (let y = 48; y < 108; y += 22) r(ctx, 38, y, 153, 3, [140, 112, 60]);

  // a crane arm + a tower crane mast (right)
  r(ctx, 250, 20, 4, 88, [210, 170, 60]);
  r(ctx, 200, 20, 80, 4, [210, 170, 60]);
  ctx.strokeStyle = css([90, 80, 60]); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(214, 22); ctx.lineTo(214, 44); ctx.stroke();
  r(ctx, 210, 44, 8, 6, [120, 110, 90]);

  // a site hoarding / fence with a sign on the right edge
  r(ctx, 282, 70, 38, 38, [150, 120, 70]);
  for (let x = 282; x < 320; x += 8) r(ctx, x, 70, 1, 38, [120, 94, 54]);
  r(ctx, 286, 78, 30, 11, [220, 170, 50]); drawText(ctx, 'OBRES', 290, 80, [40, 30, 16], 1, [220, 200, 120], 1);

  // ground / rubble
  r(ctx, 0, 108, 320, 36, [120, 108, 88]);
  r(ctx, 0, 108, 320, 1, [150, 136, 112]);
  for (let y = 114; y < 144; y += 6) for (let x = ((y / 6) % 2) * 6; x < 320; x += 12) r(ctx, x, y, 4, 2, ((x + y) % 5 < 2) ? [98, 88, 70] : [120, 108, 88]);

  // a cement mixer (left of centre)
  r(ctx, 30, 96, 3, 14, [80, 80, 88]); r(ctx, 44, 96, 3, 14, [80, 80, 88]);
  ctx.fillStyle = css([120, 122, 130]); ctx.beginPath(); ctx.ellipse(38, 96, 12, 9, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = css([90, 92, 100]); ctx.beginPath(); ctx.ellipse(38, 96, 6, 5, 0, 0, Math.PI * 2); ctx.fill();

  drawText(ctx, 'La obra', 36, 7, P.inkLight, 1, P.black, 1);
  return cv;
}

// the pile of bricks + plaster the Manu left undone
export function drawLadrillos(ctx: CanvasRenderingContext2D) {
  const BR: RGB = [176, 100, 72], BR_D: RGB = [136, 76, 54];
  for (let row = 0; row < 3; row++) for (let i = 0; i < 4 - row; i++) {
    const bx = 120 + i * 11 + row * 5, by = 130 - row * 5;
    ctx.fillStyle = css(BR); ctx.fillRect(bx, by, 10, 4);
    ctx.fillStyle = css(BR_D); ctx.fillRect(bx, by + 3, 10, 1);
  }
  // a sack of plaster leaning on it
  ctx.fillStyle = css([214, 208, 192]); ctx.fillRect(150, 122, 10, 14);
  ctx.fillStyle = css([180, 174, 158]); ctx.fillRect(150, 122, 10, 3);
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 'ladrillos', name: 'los ladrillos', x: 116, y: 118, w: 50, h: 22, walkTo: { x: 138, y: 138 },
    look: 'Una pila de ladrillos y un saco de yeso. El curro que le tocaba al Manu, que hoy duerme la mona.',
    pickup: { id: 'monedas', name: 'unas monedas' },
    pickupIf: 'ayudando',
    pickupBlocked: 'No voy a ponerme a mover ladrillos porque sí. A ver qué dice el Petito primero.',
    responses: { Coger: 'Muevo la pila de ladrillos y doy unos toques de yeso. El Petito, satisfecho, me suelta unas monedas para el bocata.' },
  },
  { id: 'edificio', name: 'el edificio', x: 38, y: 36, w: 154, h: 72, walkTo: { x: 110, y: 138 },
    look: 'Un edificio a medio construir. A este ritmo lo acaban para la jubilación del Petito. O la mía.' },
  { id: 'grua', name: 'la grúa', x: 200, y: 18, w: 80, h: 40, walkTo: { x: 240, y: 138 },
    look: 'Una grúa torre que no se ha movido en todo el día. Como el Manu, vamos.' },
];

const NPCS: NPC[] = [
  {
    id: 'petito', name: 'el Petito', x: 196, y: 86, w: 26, h: 48,
    feet: { x: 208, y: 132 }, walkTo: { x: 186, y: 138 }, facing: 'left', color: [240, 200, 120],
    look: 'El Petito, el encargado. Casco, chaleco reflectante y la moral por los suelos desde que faltó el Manu.',
    draw: drawPetito, dialogue: PETITO_DIALOGUE,
  },
];

const EXITS: Exit[] = [
  { id: 'toGaraje', name: 'el Garaje San Cristóbal', x: 0, y: 108, w: 16, h: 36, walkTo: { x: 22, y: 138 }, to: 'garaje', entry: { x: 280, y: 135 }, arrow: 'left' },
];

export const OBRA: Room = {
  id: 'obra',
  build: buildObraScene,
  dynamic: (ctx, state) => { if (!state.flags.took_monedas) drawLadrillos(ctx); },
  hotspots: HOTSPOTS,
  npcs: NPCS,
  exits: EXITS,
  walk: { minX: 16, maxX: 300, minY: 120, maxY: 140 },
  start: { x: 30, y: 135 },
};
