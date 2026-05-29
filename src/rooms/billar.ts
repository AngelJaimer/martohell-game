import { P, css, type RGB } from '../art/palette';
import { drawText } from '../art/font';
import { drawEspiritu, drawDueno } from '../art/actor';
import { ESPIRITU_DIALOGUE, DUENO_DIALOGUE } from '../content/dialogues';
import type { Room, NPC, Hotspot, Exit } from '../engine/types';

// EPISODE 4 — the back room: two pool tables, spirits partying, the old owner.
// Grab the cubo here; the door at the back leads to the vomit-portal.

function r(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, c: RGB) {
  ctx.fillStyle = css(c);
  ctx.fillRect(x | 0, y | 0, w | 0, h | 0);
}

function pool(ctx: CanvasRenderingContext2D, x: number, y: number) {
  r(ctx, x, y, 70, 18, [92, 60, 40]);
  r(ctx, x + 3, y + 3, 64, 12, [40, 120, 70]);
  const balls: [number, RGB][] = [[x + 16, [222, 84, 60]], [x + 34, [230, 200, 80]], [x + 50, [60, 92, 182]]];
  for (const [bx, c] of balls) { ctx.fillStyle = css(c); ctx.beginPath(); ctx.arc(bx, y + 9, 2, 0, Math.PI * 2); ctx.fill(); }
  r(ctx, x + 2, y + 18, 4, 10, [60, 40, 28]); r(ctx, x + 64, y + 18, 4, 10, [60, 40, 28]);
}

export function buildBillarScene(): HTMLCanvasElement {
  const cv = document.createElement('canvas');
  cv.width = 320; cv.height = 144;
  const ctx = cv.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  r(ctx, 0, 0, 320, 144, [26, 24, 36]); // base dark interior

  r(ctx, 0, 16, 320, 92, [42, 38, 54]);
  r(ctx, 0, 16, 320, 2, [58, 52, 70]);
  // a low hanging lamp over each table
  for (const lx of [95, 185]) { r(ctx, lx, 18, 1, 14, [40, 36, 30]); r(ctx, lx - 5, 32, 12, 4, [60, 54, 44]); r(ctx, lx - 4, 36, 10, 2, [240, 220, 150]); }

  // the door at the back (spirits pour out) — drawn dark/glowy
  r(ctx, 286, 50, 30, 58, [20, 18, 28]);
  r(ctx, 290, 54, 22, 50, [60, 40, 90]);
  r(ctx, 296, 58, 10, 44, [120, 90, 170]);

  // floor
  r(ctx, 0, 108, 320, 36, [44, 40, 50]);
  r(ctx, 0, 108, 320, 1, [62, 56, 70]);
  for (let x = 0; x < 320; x += 24) r(ctx, x, 108, 1, 36, [34, 30, 40]);

  // two pool tables
  pool(ctx, 60, 86);
  pool(ctx, 150, 90);

  drawText(ctx, 'El Godot', 36, 7, P.inkLight, 1, P.black, 1);
  return cv;
}

export function billarOverlays(ctx: CanvasRenderingContext2D, t: number) {
  // party lights + the glow from the back door
  for (let i = 0; i < 2; i++) {
    const x = 160 + Math.sin(t * 1.8 + i * 2.5) * 120;
    const hue = ['rgba(120,90,200,', 'rgba(90,200,180,'][i];
    const g = ctx.createRadialGradient(x, 36, 2, x, 36, 44); g.addColorStop(0, hue + '0.12)'); g.addColorStop(1, hue + '0)');
    ctx.fillStyle = g; ctx.fillRect(x - 44, 16, 88, 90);
  }
  const f = 0.6 + 0.4 * Math.sin(t * 2);
  const dg = ctx.createRadialGradient(301, 80, 2, 301, 80, 26);
  dg.addColorStop(0, 'rgba(150,110,210,' + (0.3 * f).toFixed(3) + ')'); dg.addColorStop(1, 'rgba(150,110,210,0)');
  ctx.fillStyle = dg; ctx.fillRect(276, 50, 44, 60);
}

// the mop bucket on the floor, until taken
export function drawCubo(ctx: CanvasRenderingContext2D) {
  const x = 32, y = 120;
  ctx.fillStyle = css([150, 154, 162]);
  ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 12, y); ctx.lineTo(x + 10, y + 12); ctx.lineTo(x + 2, y + 12); ctx.closePath(); ctx.fill();
  ctx.fillStyle = css([184, 188, 196]); ctx.fillRect(x, y, 12, 2);
  ctx.fillStyle = css([110, 162, 202]); ctx.fillRect(x + 2, y + 3, 8, 3);
  ctx.strokeStyle = css([120, 124, 132]); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(x + 6, y, 5, Math.PI, 0); ctx.stroke();
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 'cubo', name: 'un cubo de fregar', x: 28, y: 116, w: 20, h: 18, walkTo: { x: 44, y: 138 },
    look: 'Un cubo de fregar con su fregona, olvidado en un rincón. Justo lo que el muerto recetó.',
    pickup: { id: 'cubo', name: 'un cubo de fregar' },
    responses: { Coger: 'Cojo el cubo de fregar. Nunca pensé que salvaría el mundo con una fregona.' },
  },
  { id: 'billares', name: 'los billares', x: 56, y: 84, w: 168, h: 30, walkTo: { x: 140, y: 138 },
    look: 'Dos billares, y espíritus echando una partida. Juegan fatal, pero llevan toda la eternidad para mejorar.' },
  { id: 'puertafondo', name: 'la puerta del fondo', x: 286, y: 48, w: 30, h: 60, walkTo: { x: 278, y: 138 },
    look: 'Una puerta al fondo de la que no paran de salir espíritus. De ahí viene toda esta fiesta... y el problema.' },
];

const NPCS: NPC[] = [
  {
    id: 'dueno', name: 'el antiguo dueño', x: 244, y: 82, w: 26, h: 52,
    feet: { x: 256, y: 130 }, walkTo: { x: 234, y: 138 }, facing: 'left', color: [150, 226, 196],
    look: 'El espíritu del antiguo dueño del Godot. Cuarenta años al frente de la barra y ni la muerte lo jubila.',
    draw: drawDueno, dialogue: DUENO_DIALOGUE,
  },
  {
    id: 'esp1', name: 'un espíritu', x: 96, y: 84, w: 22, h: 50,
    feet: { x: 108, y: 128 }, walkTo: { x: 120, y: 138 }, facing: 'right', color: [160, 230, 200],
    look: 'Un espíritu de buen rollo, dándolo todo entre birra fantasma y birra fantasma.',
    draw: drawEspiritu, dialogue: ESPIRITU_DIALOGUE,
  },
  {
    id: 'esp2', name: 'una espíritu', x: 170, y: 84, w: 22, h: 50,
    feet: { x: 182, y: 132 }, walkTo: { x: 196, y: 138 }, facing: 'left', color: [160, 230, 200],
    look: 'Otra espíritu bailando sola junto al billar. La eternidad se lleva mejor con ritmo.',
    draw: drawEspiritu, dialogue: ESPIRITU_DIALOGUE,
  },
];

const EXITS: Exit[] = [
  { id: 'toBarra', name: 'la barra', x: 0, y: 104, w: 16, h: 40, walkTo: { x: 22, y: 138 }, to: 'barra', entry: { x: 280, y: 135 }, arrow: 'left' },
  { id: 'toPortal', name: 'la puerta del fondo', x: 300, y: 104, w: 20, h: 40, walkTo: { x: 290, y: 138 }, to: 'portal', entry: { x: 36, y: 135 }, arrow: 'right' },
];

export const BILLAR: Room = {
  id: 'billar',
  build: buildBillarScene,
  overlays: billarOverlays,
  dynamic: (ctx, state) => { if (!state.flags.took_cubo) drawCubo(ctx); },
  hotspots: HOTSPOTS,
  npcs: NPCS,
  exits: EXITS,
  walk: { minX: 16, maxX: 300, minY: 120, maxY: 140 },
  start: { x: 30, y: 135 },
};
