import { P, css, type RGB } from '../art/palette';
import { drawText } from '../art/font';
import { drawSkaters } from '../art/actor';
import { SKATERS_DIALOGUE } from '../content/dialogues';
import type { Room, NPC, Hotspot, Exit } from '../engine/types';

// EPISODE 5 — el césped: a scrap of public garden. Three skaters on a bench, a
// fountain with a heavy grate (rendija) hiding the hidden beers, and a lighter
// in the grass. The grate needs a lever (the hierro from the train tunnel).

function r(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, c: RGB) {
  ctx.fillStyle = css(c); ctx.fillRect(x | 0, y | 0, w | 0, h | 0);
}

export function buildCespedScene(): HTMLCanvasElement {
  const cv = document.createElement('canvas'); cv.width = 320; cv.height = 144;
  const ctx = cv.getContext('2d')!; ctx.imageSmoothingEnabled = false;
  r(ctx, 0, 0, 320, 144, [30, 34, 44]);
  // dusk sky
  for (let i = 0; i < 5; i++) r(ctx, 0, i * 6, 320, 6, [40 - i * 2, 44 + i * 6, 70 + i * 8] as RGB);
  // hedge / back wall
  r(ctx, 0, 30, 320, 18, P.leafDark);
  for (let x = 0; x < 320; x += 7) r(ctx, x, 30 + ((x / 7) % 2) * 3, 5, 4, P.leaf);
  // grass
  r(ctx, 0, 46, 320, 66, [58, 96, 58]);
  r(ctx, 0, 46, 320, 2, [78, 122, 74]);
  for (let i = 0; i < 90; i++) { const gx = (i * 37) % 320, gy = 50 + (i * 17) % 56; r(ctx, gx, gy, 1, 2, [48, 84, 48]); }
  // a tree (right)
  r(ctx, 280, 40, 7, 50, P.trunk);
  ctx.fillStyle = css(P.leaf); ctx.beginPath(); ctx.arc(284, 34, 22, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = css(P.leafLit); ctx.beginPath(); ctx.arc(278, 30, 9, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = css(P.leafDark); ctx.beginPath(); ctx.arc(294, 40, 9, 0, Math.PI * 2); ctx.fill();
  // the fountain (center-right): a stone basin + little spout
  r(ctx, 188, 70, 60, 22, P.concrete); r(ctx, 188, 70, 60, 2, P.concreteLit);
  r(ctx, 192, 74, 52, 12, [70, 110, 130]);           // water
  r(ctx, 214, 56, 6, 16, P.concrete); r(ctx, 210, 54, 14, 3, P.concreteLit); // spout column
  r(ctx, 188, 90, 60, 4, P.concreteDark);
  // floor / path
  r(ctx, 0, 108, 320, 36, [86, 92, 80]); r(ctx, 0, 108, 320, 1, [108, 116, 100]);
  // the grate (rendija) in the path in front of the fountain
  r(ctx, 194, 120, 48, 14, [96, 98, 104]); r(ctx, 194, 120, 48, 2, [120, 122, 128]);
  for (let gx = 198; gx < 242; gx += 6) r(ctx, gx, 122, 2, 10, [60, 62, 68]);
  drawText(ctx, 'El césped', 8, 7, P.inkLight, 1, P.black, 1);
  return cv;
}

// loose props: the lighter (until taken) and the opened grate (once levered).
export function cespedDynamic(ctx: CanvasRenderingContext2D, state: any) {
  if (!state.flags.took_mechero) {
    const x = 134, y = 126;
    ctx.fillStyle = css([180, 40, 44]); ctx.fillRect(x, y, 6, 8);
    ctx.fillStyle = css([182, 186, 194]); ctx.fillRect(x, y - 2, 6, 2);
  }
  if (state.flags.fuente_abierta) {
    ctx.fillStyle = css([20, 22, 26]); ctx.fillRect(196, 122, 44, 11); // open dark slot
    ctx.fillStyle = css([96, 98, 104]); ctx.fillRect(194, 118, 48, 3); // lifted grate edge
  }
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 'rendija', name: 'la rendija', x: 192, y: 116, w: 52, h: 20, walkTo: { x: 220, y: 138 },
    look: 'Una rendija metálica en el suelo, delante de la fuente. Algo se esconde debajo... pero pesa lo suyo.',
    needs: ['hierro'],
    needsBlocked: 'La rendija pesa una barbaridad. A pulso, nada. Necesito una buena palanca.',
    responses: { Usar: 'Meto el hierro bajo la rendija y hago palanca... ¡CLONC! Debajo asoma una caja de cervezas bien fresca. La cojo.', Abrir: 'Meto el hierro bajo la rendija y hago palanca... ¡CLONC! Debajo asoma una caja de cervezas bien fresca. La cojo.' },
    flag: 'fuente_abierta', give: 'cervezas_emergencia',
  },
  {
    id: 'mechero', name: 'un mechero', x: 128, y: 120, w: 18, h: 16, walkTo: { x: 138, y: 138 },
    look: 'Un mechero tirado en la hierba. Igual me hace falta más tarde.',
    pickup: { id: 'mechero', name: 'un mechero' },
    responses: { Coger: 'Cojo el mechero. Nunca se sabe cuándo va a hacer falta una chispa.' },
  },
  { id: 'fuente', name: 'la fuente', x: 188, y: 54, w: 60, h: 40, walkTo: { x: 210, y: 138 },
    look: 'Una fuente de las de siempre. El agua sabe a tubería, pero refresca.' },
];

const NPCS: NPC[] = [
  {
    id: 'skaters', name: 'los skaters', x: 54, y: 86, w: 70, h: 36,
    feet: { x: 88, y: 116 }, walkTo: { x: 88, y: 138 }, facing: 'right', color: [220, 220, 230],
    look: 'Tres skaters en el banco, arreglando el mundo y los motores de Honda. Llevan aquí desde que tienen memoria.',
    draw: drawSkaters, dialogue: SKATERS_DIALOGUE,
  },
];

const EXITS: Exit[] = [
  { id: 'toBodeguilla', name: 'la bodeguilla', x: 300, y: 104, w: 20, h: 40, walkTo: { x: 296, y: 138 }, to: 'bodeguilla', entry: { x: 30, y: 135 }, arrow: 'right' },
  { id: 'toTunel', name: 'el túnel del tren', x: 0, y: 104, w: 16, h: 40, walkTo: { x: 22, y: 138 }, to: 'tunel', entry: { x: 280, y: 135 }, arrow: 'left' },
];

export const CESPED: Room = {
  id: 'cesped',
  build: buildCespedScene,
  dynamic: cespedDynamic,
  hotspots: HOTSPOTS,
  npcs: NPCS,
  exits: EXITS,
  walk: { minX: 16, maxX: 300, minY: 118, maxY: 140 },
  start: { x: 280, y: 135 },
};
