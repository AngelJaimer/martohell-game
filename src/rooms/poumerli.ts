import { P, css, type RGB } from '../art/palette';
import { Pixels, rampPick } from '../art/dither';
import { drawText } from '../art/font';
import { drawVigilante, drawCaledonia, drawCurro } from '../art/actor';
import { VIGILANTE_DIALOGUE, CALEDONIA_DIALOGUE, CURRO_DIALOGUE } from '../content/dialogues';
import type { Room, NPC, Hotspot, Exit } from '../engine/types';

// Pou del Merli — a posh villa at night. The bouncer needs the Cuco's card;
// inside, the spirits Caledonia + Curro argue over the stolen key of El Godot.
// Show la Caledonia the nota (its code = proof of ownership) and she hands it over.

function r(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, c: RGB) {
  ctx.fillStyle = css(c);
  ctx.fillRect(x | 0, y | 0, w | 0, h | 0);
}

export function buildPoumerliScene(): HTMLCanvasElement {
  const cv = document.createElement('canvas');
  cv.width = 320; cv.height = 144;
  const ctx = cv.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  r(ctx, 0, 0, 320, 144, [16, 16, 28]); // base night fill

  // night sky
  const img = ctx.createImageData(320, 50);
  const px = new Pixels(img, 320, 50);
  const sky: RGB[] = [[12, 12, 28], [22, 20, 42], [40, 34, 56]];
  for (let y = 0; y < 50; y++) for (let x = 0; x < 320; x++) px.set(x, y, rampPick(sky, y / 50, x, y));
  ctx.putImageData(img, 0, 0);
  ctx.fillStyle = css([220, 220, 180]); ctx.beginPath(); ctx.arc(280, 24, 8, 0, Math.PI * 2); ctx.fill(); // moon
  ctx.fillStyle = css([200, 200, 220]);
  for (const [sx, sy] of [[40, 14], [120, 10], [180, 22]] as [number, number][]) ctx.fillRect(sx, sy, 1, 1);

  // the posh villa (right two-thirds)
  r(ctx, 96, 36, 224, 72, [206, 198, 178]);
  r(ctx, 96, 32, 224, 6, [150, 142, 124]);       // flat modern roof slab
  r(ctx, 96, 36, 4, 72, [180, 172, 152]);
  // big warm-lit windows
  for (let i = 0; i < 4; i++) { const wx = 120 + i * 46; r(ctx, wx, 50, 30, 28, [60, 54, 50]); r(ctx, wx + 2, 52, 26, 24, [248, 216, 140]); r(ctx, wx + 14, 52, 2, 24, [60, 54, 50]); }
  // a hedge along the base of the house
  r(ctx, 96, 100, 224, 8, [46, 78, 50]);
  for (let x = 98; x < 320; x += 6) r(ctx, x, 99, 4, 3, ((x % 12 < 6) ? [58, 96, 60] : [40, 70, 44]));

  // the gate / verja on the left (the bouncer stands here)
  r(ctx, 30, 52, 56, 56, [40, 40, 50]);          // gate pillar shadow / opening
  r(ctx, 28, 48, 60, 4, [70, 70, 84]);
  ctx.fillStyle = css([90, 90, 104]);
  for (let bx = 34; bx < 84; bx += 8) ctx.fillRect(bx, 56, 2, 50);  // vertical bars
  r(ctx, 26, 50, 4, 58, [110, 108, 100]); r(ctx, 86, 50, 4, 58, [110, 108, 100]); // posts

  // a palm tree (front-left, posh touch)
  r(ctx, 16, 70, 4, 38, [90, 68, 44]);
  ctx.fillStyle = css([54, 96, 58]);
  for (const a of [-0.9, -0.3, 0.3, 0.9]) { ctx.save(); ctx.translate(18, 70); ctx.rotate(a); ctx.fillRect(0, -2, 18, 4); ctx.restore(); }

  // driveway / paving
  r(ctx, 0, 108, 320, 36, [70, 66, 72]);
  r(ctx, 0, 108, 320, 1, [96, 92, 98]);
  for (let y = 116; y < 144; y += 8) for (let x = ((y / 8) % 2) * 14; x < 320; x += 28) r(ctx, x, y, 24, 1, [54, 50, 56]);

  drawText(ctx, 'Pou del Merli', 36, 7, P.inkLight, 1, P.black, 1);
  return cv;
}

export function poumerliOverlays(ctx: CanvasRenderingContext2D, t: number) {
  // warm glow from the villa windows
  const f = 0.85 + 0.15 * Math.sin(t * 1.2);
  for (let i = 0; i < 4; i++) {
    const wx = 135 + i * 46;
    const g = ctx.createRadialGradient(wx, 64, 2, wx, 64, 22);
    g.addColorStop(0, 'rgba(255,220,140,' + (0.14 * f).toFixed(3) + ')');
    g.addColorStop(1, 'rgba(255,220,140,0)');
    ctx.fillStyle = g; ctx.fillRect(wx - 22, 44, 44, 40);
  }
}

const HOTSPOTS: Hotspot[] = [
  { id: 'casa', name: 'la casa', x: 96, y: 32, w: 224, h: 70, walkTo: { x: 200, y: 138 },
    look: 'Un caserón de ricos en el Pou del Merli. Ventanas enormes, luz cálida y, esta noche, dos inquilinos que no pagan alquiler.' },
  { id: 'verja', name: 'la verja', x: 26, y: 48, w: 64, h: 60, walkTo: { x: 60, y: 138 },
    look: 'Una verja de hierro forjado. Detrás, el vigilante; delante, mis ganas de pasar.' },
  { id: 'palmera', name: 'la palmera', x: 8, y: 30, w: 28, h: 78, walkTo: { x: 30, y: 138 },
    look: 'Una palmera importada, de las que gritan "aquí vive alguien con dinero". O vivía.' },
];

const NPCS: NPC[] = [
  {
    id: 'vigilante', name: 'el Joche', x: 64, y: 84, w: 28, h: 50,
    feet: { x: 78, y: 134 }, walkTo: { x: 52, y: 138 }, facing: 'right', color: [220, 200, 170],
    look: 'El Joche, el vigilante gitano de la urbanización. Cadenón de oro, brazos cruzados y un ichillerato a sus espaldas, según dice.',
    draw: drawVigilante, dialogue: VIGILANTE_DIALOGUE,
    accepts: {
      tarjeta: { line: 'Del Cuco, ¿eh? Habérmelo dicho antes. Pasa, anda, pero no toques nada de los señores.', remove: ['tarjeta'], flag: 'entered_poumerli' },
    },
  },
  {
    id: 'caledonia', name: 'la Caledonia', x: 186, y: 82, w: 36, h: 52,
    feet: { x: 206, y: 132 }, walkTo: { x: 174, y: 138 }, facing: 'right', color: [150, 230, 196],
    look: 'La Caledonia. Un espíritu enorme en bata y con la cabeza rapada. Aprieta una llave contra el pecho.',
    draw: drawCaledonia, dialogue: CALEDONIA_DIALOGUE, showIf: 'entered_poumerli',
  },
  {
    id: 'curro', name: 'el Curro', x: 238, y: 82, w: 26, h: 52,
    feet: { x: 250, y: 132 }, walkTo: { x: 272, y: 138 }, facing: 'left', color: [150, 230, 196],
    look: 'El Curro. Espíritu de policía viejo y corrupto, con la gorra calada y el bigote blanco. Quiere esa llave a toda costa.',
    draw: drawCurro, dialogue: CURRO_DIALOGUE, showIf: 'entered_poumerli',
  },
];

// One-way: from the spirits you can only finish the episode (no going back).
const EXITS: Exit[] = [];

export const POUMERLI: Room = {
  id: 'poumerli',
  build: buildPoumerliScene,
  overlays: poumerliOverlays,
  hotspots: HOTSPOTS,
  npcs: NPCS,
  exits: EXITS,
  walk: { minX: 16, maxX: 300, minY: 120, maxY: 140 },
  start: { x: 30, y: 135 },
};
