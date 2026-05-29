import { P, css, type RGB } from '../art/palette';
import { drawText } from '../art/font';
import { drawKilian, drawSopas } from '../art/actor';
import { KILIAN_DIALOGUE, SOPAS_DIALOGUE } from '../content/dialogues';
import type { Room, NPC, Hotspot, Exit } from '../engine/types';

// EPISODE 4 — inside the Godot, the bar. El Kilian (drinking since last night)
// and el Sopas (bald punky spirit). Show Kilian the nota and he opens the back room.

function r(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, c: RGB) {
  ctx.fillStyle = css(c);
  ctx.fillRect(x | 0, y | 0, w | 0, h | 0);
}

// a quick spray-paint tag
function tag(ctx: CanvasRenderingContext2D, x: number, y: number, c: RGB) {
  ctx.strokeStyle = css(c); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(x, y + 8); ctx.lineTo(x + 4, y); ctx.lineTo(x + 8, y + 8); ctx.lineTo(x + 12, y); ctx.lineTo(x + 16, y + 8); ctx.stroke();
}

export function buildBarraScene(): HTMLCanvasElement {
  const cv = document.createElement('canvas');
  cv.width = 320; cv.height = 144;
  const ctx = cv.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  r(ctx, 0, 0, 320, 144, [26, 22, 30]); // base dark interior

  // back wall, grimy, with graffiti
  r(ctx, 0, 16, 320, 92, [44, 38, 50]);
  r(ctx, 0, 16, 320, 2, [60, 52, 66]);
  tag(ctx, 150, 30, [200, 70, 90]); tag(ctx, 210, 26, [90, 200, 180]); tag(ctx, 264, 34, [220, 200, 80]);
  drawText(ctx, 'GODOT', 150, 46, [180, 70, 70], 1, [10, 6, 8], 1);
  r(ctx, 200, 44, 40, 1, [200, 60, 140]); // a sprayed underline

  // bar counter (left) + bottle shelf + a neon
  r(ctx, 8, 58, 4, 42, [40, 30, 24]);
  r(ctx, 8, 56, 110, 3, [70, 50, 36]);
  const bottle: RGB[] = [[90, 130, 90], [120, 90, 60], [80, 110, 140], [150, 70, 120]];
  for (let i = 0; i < 9; i++) { const bx = 14 + i * 11; r(ctx, bx, 44, 5, 12, bottle[i % 4]); r(ctx, bx + 1, 46, 1, 8, [220, 220, 220]); }
  r(ctx, 10, 96, 116, 12, [86, 60, 42]);
  r(ctx, 10, 96, 116, 2, [116, 84, 58]);
  r(ctx, 10, 108, 116, 4, [54, 38, 26]);

  // the back-room door (right)
  r(ctx, 288, 56, 26, 52, [54, 42, 34]);
  r(ctx, 290, 58, 22, 48, [80, 60, 44]);
  for (let y = 60; y < 104; y += 4) r(ctx, 290, y, 22, 1, [60, 46, 34]);
  r(ctx, 306, 80, 3, 4, [200, 180, 90]); // handle

  // floor
  r(ctx, 0, 108, 320, 36, [50, 42, 38]);
  r(ctx, 0, 108, 320, 1, [72, 60, 54]);
  for (let x = 0; x < 320; x += 24) r(ctx, x, 108, 1, 36, [38, 32, 30]);

  drawText(ctx, 'El Godot', 36, 7, P.inkLight, 1, P.black, 1);
  return cv;
}

const HOTSPOTS: Hotspot[] = [
  { id: 'barra', name: 'la barra', x: 8, y: 56, w: 118, h: 52, walkTo: { x: 70, y: 138 },
    look: 'La barra del Godot. Vasos a medias, ceniceros llenos y la huella pegajosa de mil conciertos.' },
  { id: 'grafiti', name: 'los grafitis', x: 140, y: 24, w: 140, h: 28, walkTo: { x: 200, y: 138 },
    look: 'Grafitis encima de grafitis. Hay nombres de grupos que ya no existen y de gente que ya tampoco, por lo visto.' },
  { id: 'puerta', name: 'la puerta de atrás', x: 286, y: 54, w: 30, h: 54, walkTo: { x: 280, y: 138 },
    look: 'La puerta de la sala de atrás. El Kilian la cerró anoche, dice que por algo que no recuerda. Mal asunto.' },
];

const NPCS: NPC[] = [
  {
    id: 'kilian', name: 'el Kilian', x: 82, y: 82, w: 26, h: 50,
    feet: { x: 96, y: 132 }, walkTo: { x: 118, y: 138 }, facing: 'right', color: [230, 210, 170],
    look: 'El Kilian, atrincherado en la barra desde anoche. Más birras que neuronas le quedan ya.',
    draw: drawKilian, dialogue: KILIAN_DIALOGUE,
    accepts: {
      nota: {
        line: '¡ESA! Trae... (la lee) Ah, no: es mi lista de la compra, que la escribo al revés. "Sajnaran, sallo;bec"... naranjas, cebollas y algo más. Me mola escribir del revés. Gracias, majo: te abro la sala de atrás, échale un ojo.',
        remove: [],
        flag: 'sala_abierta',
      },
    },
  },
  {
    id: 'sopas', name: 'el Sopas', x: 50, y: 84, w: 26, h: 48,
    feet: { x: 64, y: 130 }, walkTo: { x: 86, y: 138 }, facing: 'right', color: [150, 226, 196],
    look: 'El espíritu del Sopas. Punky, calvo y translúcido. La muerte no le ha quitado ni un piercing.',
    draw: drawSopas, dialogue: SOPAS_DIALOGUE,
  },
];

const EXITS: Exit[] = [
  { id: 'toBillar', name: 'la sala de atrás', x: 300, y: 104, w: 20, h: 40, walkTo: { x: 296, y: 138 }, to: 'billar', entry: { x: 28, y: 135 }, arrow: 'right', showIf: 'sala_abierta' },
];

export const BARRA: Room = {
  id: 'barra',
  build: buildBarraScene,
  hotspots: HOTSPOTS,
  npcs: NPCS,
  exits: EXITS,
  walk: { minX: 16, maxX: 300, minY: 120, maxY: 140 },
  start: { x: 60, y: 135 },
};
