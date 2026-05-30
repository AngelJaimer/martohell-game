import { P, css, type RGB } from '../art/palette';
import { Pixels, rampPick } from '../art/dither';
import { drawText } from '../art/font';
import { drawZerry, drawSiles, drawKapa } from '../art/actor';
import { ZERRY_DIALOGUE, KAPA_DIALOGUE, SILES_DIALOGUE } from '../content/dialogues';
import type { Room, NPC, Hotspot, Exit } from '../engine/types';

// Plaça de l'Església — el Zerry hands out burgers (swaps one for the oranges);
// two old men gossip about el Congui's ghost.

function r(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, c: RGB) {
  ctx.fillStyle = css(c);
  ctx.fillRect(x | 0, y | 0, w | 0, h | 0);
}

function tree(ctx: CanvasRenderingContext2D, x: number, baseY: number) {
  r(ctx, x - 3, baseY - 48, 6, 48, P.trunk);
  r(ctx, x - 3, baseY - 48, 2, 48, [96, 72, 50]);
  ctx.fillStyle = css(P.leafDark);
  for (const [dx, dy, rr] of [[-13, -52, 16], [13, -54, 16], [0, -64, 18], [-17, -64, 12], [15, -66, 12]]) { ctx.beginPath(); ctx.arc(x + dx, baseY + dy, rr, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = css(P.leaf);
  for (const [dx, dy, rr] of [[-8, -56, 10], [9, -58, 10], [0, -66, 12]]) { ctx.beginPath(); ctx.arc(x + dx, baseY + dy, rr, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = css(P.leafLit);
  for (const [dx, dy, rr] of [[-5, -62, 5], [6, -64, 5]]) { ctx.beginPath(); ctx.arc(x + dx, baseY + dy, rr, 0, Math.PI * 2); ctx.fill(); }
}

function bench(ctx: CanvasRenderingContext2D, x: number, y: number) {
  r(ctx, x, y, 24, 2, [104, 82, 58]);
  r(ctx, x, y - 7, 24, 2, [116, 92, 64]);
  r(ctx, x + 1, y + 2, 2, 6, [72, 56, 40]); r(ctx, x + 21, y + 2, 2, 6, [72, 56, 40]);
  r(ctx, x + 1, y - 7, 2, 9, [72, 56, 40]); r(ctx, x + 21, y - 7, 2, 9, [72, 56, 40]);
}

export function buildEsglesiaScene(): HTMLCanvasElement {
  const cv = document.createElement('canvas');
  cv.width = 320; cv.height = 144;
  const ctx = cv.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  r(ctx, 0, 0, 320, 144, [150, 110, 110]); // base fill so no transparent gaps

  // dusk sky (warm, lamps starting to glow)
  const img = ctx.createImageData(320, 30);
  const px = new Pixels(img, 320, 30);
  const sky: RGB[] = [[88, 78, 110], [150, 110, 110], [206, 158, 120]];
  for (let y = 0; y < 30; y++) for (let x = 0; x < 320; x++) px.set(x, y, rampPick(sky, y / 30, x, y));
  ctx.putImageData(img, 0, 0);

  // flanking buildings
  r(ctx, 0, 18, 96, 78, [188, 150, 150]);     // left (pinkish, sgraffito-ish)
  r(ctx, 0, 18, 96, 4, [150, 116, 116]);
  for (let wy = 30; wy < 86; wy += 20) for (let wx = 10; wx < 86; wx += 22) { r(ctx, wx, wy, 9, 12, [60, 46, 48]); r(ctx, wx + 1, wy + 1, 7, 10, P.winLit); }
  r(ctx, 224, 18, 96, 78, [196, 168, 132]);    // right
  r(ctx, 224, 18, 96, 4, [156, 128, 96]);
  for (let wy = 30; wy < 86; wy += 20) for (let wx = 234; wx < 312; wx += 22) { r(ctx, wx, wy, 9, 12, [60, 46, 48]); r(ctx, wx + 1, wy + 1, 7, 10, P.winLit); }

  // the church (centre): plaster facade + round-arch portal + stone flanks
  r(ctx, 104, 28, 112, 68, [208, 198, 172]);
  r(ctx, 104, 24, 116, 6, [150, 70, 56]);       // tiled roof
  r(ctx, 96, 40, 12, 56, P.brick);              // stone buttress L
  r(ctx, 212, 40, 12, 56, P.brick);             // stone buttress R
  ctx.fillStyle = css([58, 48, 44]);            // arch recess
  ctx.beginPath(); ctx.moveTo(140, 96); ctx.lineTo(140, 64); ctx.arc(160, 64, 20, Math.PI, 0); ctx.lineTo(180, 96); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = css(P.brickLit); ctx.lineWidth = 2;     // voussoirs
  ctx.beginPath(); ctx.arc(160, 64, 21, Math.PI, 0); ctx.stroke();
  r(ctx, 144, 72, 15, 24, P.woodDark);          // doors
  r(ctx, 160, 72, 15, 24, P.wood);
  for (let i = 0; i < 15; i += 4) r(ctx, 144 + i, 72, 1, 24, [40, 26, 16]);
  // a small rose oculus
  ctx.fillStyle = css(P.winLit); ctx.beginPath(); ctx.arc(160, 40, 5, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = css([60, 50, 46]); ctx.beginPath(); ctx.arc(160, 40, 5, 0, Math.PI * 2); ctx.stroke();

  // packed-earth square
  r(ctx, 0, 96, 320, 48, [150, 128, 96]);
  r(ctx, 0, 96, 320, 1, [176, 154, 120]);
  for (let y = 104; y < 144; y += 7) for (let x = ((y / 7) % 2) * 8; x < 320; x += 16) r(ctx, x, y, 6, 1, [128, 108, 80]);

  // benches
  bench(ctx, 52, 116);
  bench(ctx, 250, 116);

  // big plane trees framing the square
  tree(ctx, 34, 100);
  tree(ctx, 290, 100);

  // a couple of street lamps
  for (const lx of [110, 210]) { r(ctx, lx, 64, 2, 34, [54, 50, 46]); r(ctx, lx - 3, 60, 8, 5, [70, 64, 58]); r(ctx, lx - 2, 61, 6, 3, P.winLit); }

  drawText(ctx, 'Iglesia de la Vila', 36, 7, P.inkLight, 1, P.black, 1);
  return cv;
}

export function esglesiaOverlays(ctx: CanvasRenderingContext2D, t: number) {
  for (const lx of [111, 211]) {
    const f = 0.6 + 0.4 * Math.sin(t * 7 + lx);
    const g = ctx.createRadialGradient(lx, 62, 1, lx, 62, 16);
    g.addColorStop(0, 'rgba(255,214,120,' + (0.3 * f).toFixed(3) + ')');
    g.addColorStop(1, 'rgba(255,214,120,0)');
    ctx.fillStyle = g; ctx.fillRect(lx - 16, 48, 32, 30);
  }
}

const HOTSPOTS: Hotspot[] = [
  { id: 'iglesia', name: 'la iglesia', x: 96, y: 24, w: 128, h: 72, walkTo: { x: 160, y: 138 },
    look: 'La iglesia de la plaza, románica y seria. Llevo aquí cinco minutos y ya me ha mirado mal el rosetón.' },
  { id: 'arbol', name: 'el plátano', x: 16, y: 36, w: 40, h: 60, walkTo: { x: 56, y: 138 },
    look: 'Un plátano de sombra enorme. Debajo se está fresco y se cuece todo el cotilleo del pueblo.' },
  { id: 'banco', name: 'el banco', x: 248, y: 108, w: 28, h: 14, walkTo: { x: 262, y: 138 },
    look: 'Un banco de madera. Me sentaría, pero como me siente igual no me vuelvo a levantar en el día.' },
];

const NPCS: NPC[] = [
  {
    id: 'zerry', name: 'el Zerry', x: 138, y: 84, w: 26, h: 50,
    feet: { x: 152, y: 130 }, walkTo: { x: 176, y: 138 }, facing: 'left', color: [180, 200, 210],
    look: 'El Zerry, repartiendo hamburguesas con cara de no querer ver una hamburguesa nunca más.',
    draw: drawZerry, dialogue: ZERRY_DIALOGUE,
    accepts: {
      naranjas: {
        line: '¡Fruta! ¡Por fin algo que no rebota! Toma, una hamburguesa bien cargada. Encantado del cambio, en serio.',
        give: 'hamburguesa',
        remove: ['naranjas'],
        flag: 'has_burger',
      },
    },
  },
  {
    id: 'kapa', name: 'el Kapa', x: 40, y: 80, w: 26, h: 48,
    feet: { x: 54, y: 126 }, walkTo: { x: 72, y: 138 }, facing: 'right', color: [230, 214, 180],
    look: 'El Kapa, dándole a la lengua. De recados por la vila, dice, pero no para de hablar de espíritus.',
    draw: drawKapa, dialogue: KAPA_DIALOGUE,
  },
  {
    id: 'siles', name: 'el Siles', x: 72, y: 80, w: 26, h: 48,
    feet: { x: 86, y: 126 }, walkTo: { x: 104, y: 138 }, facing: 'left', color: [200, 210, 200],
    look: 'El Siles, callado como una tumba. Asiente, gruñe y poco más. Un fenómeno para los recados.',
    draw: drawSiles, dialogue: SILES_DIALOGUE,
  },
];

const EXITS: Exit[] = [
  { id: 'toVila', name: 'la plaza de la Vila', x: 0, y: 104, w: 16, h: 40, walkTo: { x: 22, y: 138 }, to: 'vila', entry: { x: 290, y: 136 }, arrow: 'left' },
  { id: 'toPiscina', name: 'la piscina', x: 300, y: 104, w: 20, h: 40, walkTo: { x: 298, y: 138 }, to: 'piscina', entry: { x: 28, y: 135 }, arrow: 'right' },
];

export const ESGLESIA: Room = {
  id: 'esglesia',
  build: buildEsglesiaScene,
  overlays: esglesiaOverlays,
  hotspots: HOTSPOTS,
  npcs: NPCS,
  exits: EXITS,
  walk: { minX: 16, maxX: 300, minY: 120, maxY: 140 },
  start: { x: 30, y: 135 },
};
