import { P, css, type RGB } from '../art/palette';
import { drawText } from '../art/font';
import { drawDuenoBodeguilla, drawPistolo, drawChoki, drawAlfonso } from '../art/actor';
import { DUENO_BODEGUILLA_DIALOGUE, PISTOLO_DIALOGUE, CHOKI_DIALOGUE, ALFONSO_DIALOGUE } from '../content/dialogues';
import type { Room, NPC, Hotspot, Exit } from '../engine/types';

// EPISODE 5 — la bodeguilla: a tiny hole-in-the-wall dive bar that opens onto the
// street. The dueño (behind the hatch) trades super-pota cleaner for emergency beers.
// El Pistolo (spirit) and el Choki (bravas) prop up the bar.

function r(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, c: RGB) {
  ctx.fillStyle = css(c); ctx.fillRect(x | 0, y | 0, w | 0, h | 0);
}

export function buildBodeguillaScene(): HTMLCanvasElement {
  const cv = document.createElement('canvas'); cv.width = 320; cv.height = 144;
  const ctx = cv.getContext('2d')!; ctx.imageSmoothingEnabled = false;
  r(ctx, 0, 0, 320, 144, [18, 16, 24]);
  // night sky + a few stars
  r(ctx, 0, 0, 320, 32, [26, 24, 40]);
  for (let i = 0; i < 36; i++) r(ctx, (i * 53) % 318, (i * 31) % 28, 1, 1, [70, 70, 104]);
  // building facade
  r(ctx, 0, 28, 320, 84, [46, 40, 48]);
  r(ctx, 0, 28, 320, 2, [62, 54, 64]);
  // the serving hatch (dark interior) framed in wood
  r(ctx, 94, 34, 152, 58, [28, 24, 32]);
  r(ctx, 90, 32, 6, 80, [96, 66, 42]); r(ctx, 244, 32, 6, 80, [96, 66, 42]);
  r(ctx, 90, 32, 160, 3, [120, 86, 56]);
  // bottle shelves inside the hatch
  const bot: RGB[] = [[90, 130, 90], [120, 90, 60], [80, 110, 140], [150, 70, 120]];
  for (let row = 0; row < 2; row++) {
    const sy = 44 + row * 18; r(ctx, 102, sy + 8, 136, 2, [70, 52, 38]);
    for (let i = 0; i < 11; i++) { const bx = 106 + i * 12; r(ctx, bx, sy, 4, 8, bot[i % 4]); r(ctx, bx + 1, sy + 1, 1, 6, [220, 220, 220]); }
  }
  // wooden counter across the hatch
  r(ctx, 90, 92, 160, 8, [122, 86, 54]); r(ctx, 90, 92, 160, 2, [152, 110, 72]);
  r(ctx, 90, 100, 160, 8, [82, 56, 36]);
  // entrance door (left, behind the bar)
  r(ctx, 40, 46, 34, 64, [58, 44, 32]); r(ctx, 44, 50, 26, 56, [86, 62, 42]);
  for (let yy = 54; yy < 104; yy += 6) r(ctx, 44, yy, 26, 1, [64, 46, 32]);
  r(ctx, 64, 76, 3, 4, [200, 180, 90]);
  // hanging sign
  r(ctx, 126, 12, 86, 16, [38, 28, 36]); r(ctx, 128, 14, 82, 12, [58, 44, 54]);
  drawText(ctx, 'LA BODEGUILLA', 132, 17, [232, 184, 120], 1, [10, 8, 10], 1);
  // street floor
  r(ctx, 0, 108, 320, 36, [58, 56, 64]); r(ctx, 0, 108, 320, 1, [80, 78, 88]);
  for (let x = 0; x < 320; x += 26) r(ctx, x, 108, 1, 36, [44, 42, 50]);
  drawText(ctx, 'La bodeguilla', 8, 7, P.inkLight, 1, P.black, 1);
  return cv;
}

const HOTSPOTS: Hotspot[] = [
  { id: 'barra', name: 'la barra', x: 90, y: 88, w: 160, h: 22, walkTo: { x: 160, y: 136 },
    look: 'La barra de la bodeguilla. Caben medio bar y tres parroquianos. Milagros de la hostelería.' },
  { id: 'puerta', name: 'la puerta', x: 40, y: 46, w: 34, h: 64, walkTo: { x: 70, y: 136 },
    look: 'La puertecita de atrás, por donde entra y sale el dueño. Y poco más, que esto es un sello de correos.' },
  { id: 'sign', name: 'el cartel', x: 126, y: 12, w: 86, h: 16, walkTo: { x: 160, y: 136 },
    look: '"LA BODEGUILLA". El cartel ha visto cosas que tú no querrías ver.' },
];

const NPCS: NPC[] = [
  {
    id: 'dueno_b', name: 'el dueño', x: 50, y: 46, w: 30, h: 48,
    feet: { x: 64, y: 92 }, walkTo: { x: 96, y: 134 }, facing: 'right', color: [220, 196, 150],
    look: 'El dueño de la bodeguilla. Lleva el mismo delantal manchado desde los noventa, y a mucha honra.',
    draw: drawDuenoBodeguilla, dialogue: DUENO_BODEGUILLA_DIALOGUE,
    accepts: {
      cervezas_emergencia: {
        line: 'AH, ¡birra! Salvas la noche, chaval. Toma: el limpia-superpotas. Con esto le quitas el óxido hasta a un muerto. Suerte con esa pota.',
        give: 'limpia_superpotas', remove: ['cervezas_emergencia'], flag: 'tiene_limpiador',
      },
    },
  },
  {
    id: 'pistolo', name: 'el Pistolo', x: 138, y: 80, w: 24, h: 42,
    feet: { x: 150, y: 122 }, walkTo: { x: 150, y: 136 }, facing: 'left', color: [150, 226, 196],
    look: 'El espíritu del Pistolo, en su taburete de siempre. Sigue pidiendo rondas que ya no se puede beber.',
    draw: drawPistolo, dialogue: PISTOLO_DIALOGUE,
  },
  {
    id: 'choki', name: 'el Choki', x: 190, y: 82, w: 24, h: 42,
    feet: { x: 202, y: 124 }, walkTo: { x: 202, y: 136 }, facing: 'left', color: [230, 210, 180],
    look: 'El Choki, dándose un homenaje de bravas. Mastica con una devoción casi religiosa.',
    draw: drawChoki, dialogue: CHOKI_DIALOGUE,
  },
  {
    id: 'alfonso', name: 'el Alfonso', x: 108, y: 78, w: 26, h: 46,
    feet: { x: 120, y: 122 }, walkTo: { x: 120, y: 136 }, facing: 'right', color: [150, 226, 196],
    look: 'El espíritu del Alfonso, gordito y feliz, sufriendo porque ya no puede catar una birra. Aun así, no para de sonreír.',
    draw: drawAlfonso, dialogue: ALFONSO_DIALOGUE,
  },
];

const EXITS: Exit[] = [
  { id: 'toGodot', name: 'la calle (el Godot)', x: 300, y: 104, w: 20, h: 40, walkTo: { x: 296, y: 138 }, to: 'barra', entry: { x: 40, y: 135 }, arrow: 'right' },
  { id: 'toCesped', name: 'el césped', x: 0, y: 104, w: 16, h: 40, walkTo: { x: 22, y: 138 }, to: 'cesped', entry: { x: 280, y: 135 }, arrow: 'left' },
];

export const BODEGUILLA: Room = {
  id: 'bodeguilla',
  build: buildBodeguillaScene,
  hotspots: HOTSPOTS,
  npcs: NPCS,
  exits: EXITS,
  walk: { minX: 16, maxX: 300, minY: 118, maxY: 140 },
  start: { x: 280, y: 135 },
};
