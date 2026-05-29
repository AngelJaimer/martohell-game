import { P, css, type RGB } from '../art/palette';
import { drawText } from '../art/font';
import { drawJuguetero } from '../art/actor';
import { JUGUETERO_DIALOGUE } from '../content/dialogues';
import type { Room, NPC, Hotspot, Exit } from '../engine/types';

// EPISODE 3 — Garaje San Cristóbal, a dusty old toy shop. The owner sells you a
// vintage Mazinger (50 years old, so it counts as "new" by his standards) for coins.

function r(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, c: RGB) {
  ctx.fillStyle = css(c);
  ctx.fillRect(x | 0, y | 0, w | 0, h | 0);
}

export function buildGarajeScene(): HTMLCanvasElement {
  const cv = document.createElement('canvas');
  cv.width = 320; cv.height = 144;
  const ctx = cv.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  r(ctx, 0, 0, 320, 144, [46, 38, 32]); // base dim interior

  // back wall + ceiling beam
  r(ctx, 0, 16, 320, 92, [78, 64, 50]);
  r(ctx, 0, 16, 320, 3, [98, 82, 64]);
  r(ctx, 0, 14, 320, 2, [40, 32, 24]);

  // shelves crammed with dusty old toys
  const box: RGB[] = [[170, 70, 64], [70, 110, 150], [200, 170, 70], [90, 140, 90], [150, 100, 160]];
  for (let s = 0; s < 3; s++) {
    const sy = 28 + s * 24;
    r(ctx, 8, sy + 16, 304, 3, [58, 46, 34]);       // plank
    for (let i = 0; i < 17; i++) {
      const bx = 12 + i * 18, c = box[(i + s) % 5];
      if ((i + s) % 4 === 0) { ctx.fillStyle = css(c); ctx.beginPath(); ctx.arc(bx + 6, sy + 11, 5, 0, Math.PI * 2); ctx.fill(); } // a ball
      else { r(ctx, bx, sy + 4, 12, 12, c); r(ctx, bx + 1, sy + 5, 10, 3, [c[0] + 30, c[1] + 30, c[2] + 30]); } // a box
    }
  }
  // dust haze over the shelves
  ctx.fillStyle = 'rgba(60,50,38,0.25)'; ctx.fillRect(0, 18, 320, 70);

  // the prized Mazinger, on a little pedestal under glass (right shelf)
  r(ctx, 244, 36, 16, 16, [40, 50, 70]);
  r(ctx, 247, 38, 10, 12, [178, 184, 198]); r(ctx, 249, 40, 6, 4, [232, 200, 90]); r(ctx, 248, 44, 8, 3, [198, 52, 48]);
  r(ctx, 243, 35, 18, 1, [150, 170, 200]);          // glass glint

  // counter (centre) with a till
  r(ctx, 116, 98, 108, 12, [96, 70, 48]);
  r(ctx, 116, 98, 108, 2, [128, 96, 66]);
  r(ctx, 116, 110, 108, 4, [62, 44, 30]);
  r(ctx, 188, 90, 18, 9, [60, 56, 60]); r(ctx, 190, 92, 6, 4, [120, 120, 128]); // cash register

  // wooden floor
  r(ctx, 0, 108, 320, 36, [92, 72, 52]);
  r(ctx, 0, 108, 320, 1, [120, 96, 70]);
  for (let x = 0; x < 320; x += 26) r(ctx, x, 108, 1, 36, [70, 54, 38]);

  drawText(ctx, 'Garaje San Cristóbal', 36, 7, P.inkLight, 1, P.black, 1);
  return cv;
}

const HOTSPOTS: Hotspot[] = [
  { id: 'estante', name: 'las estanterías', x: 8, y: 24, w: 230, h: 64, walkTo: { x: 120, y: 138 },
    look: 'Estanterías hasta el techo, con juguetes de hace cuarenta años y polvo de hace cincuenta. Un paraíso, si tuviera nostalgia y dinero.' },
  { id: 'mazinger', name: 'el Mazinger', x: 242, y: 34, w: 20, h: 20, walkTo: { x: 250, y: 138 },
    look: 'Un Mazinger Z viejísimo en su vitrina. Para el Carmona valdría un riñón. Para el dueño, cinco monedas.' },
  { id: 'mostrador', name: 'el mostrador', x: 116, y: 90, w: 108, h: 20, walkTo: { x: 150, y: 138 },
    look: 'El mostrador, con una caja registradora que parece de cuando Franco era cabo.' },
];

const NPCS: NPC[] = [
  {
    id: 'juguetero', name: 'el juguetero', x: 150, y: 74, w: 26, h: 44,
    feet: { x: 162, y: 116 }, walkTo: { x: 150, y: 138 }, facing: 'right', color: [220, 214, 200],
    look: 'El dueño del Garaje San Cristóbal. Bata gris, gafas de culo de vaso y memoria de catálogo de 1975.',
    draw: drawJuguetero, dialogue: JUGUETERO_DIALOGUE,
    accepts: {
      monedas: {
        line: 'Cinco monedas, perfecto. (sopla el polvo) Aquí tienes tu Mazinger del año de la pera. Que lo disfrutes, que ya no se hacen.',
        give: 'mazinger',
        remove: ['monedas'],
        flag: 'tiene_mazinger',
      },
    },
  },
];

const EXITS: Exit[] = [
  { id: 'toGodot', name: 'la puerta del Godot', x: 0, y: 108, w: 16, h: 36, walkTo: { x: 22, y: 138 }, to: 'godot', entry: { x: 130, y: 135 }, arrow: 'left' },
  { id: 'toObra', name: 'la obra', x: 300, y: 108, w: 20, h: 36, walkTo: { x: 298, y: 138 }, to: 'obra', entry: { x: 30, y: 135 }, arrow: 'right' },
];

export const GARAJE: Room = {
  id: 'garaje',
  build: buildGarajeScene,
  hotspots: HOTSPOTS,
  npcs: NPCS,
  exits: EXITS,
  walk: { minX: 16, maxX: 300, minY: 120, maxY: 140 },
  start: { x: 50, y: 135 },
};
