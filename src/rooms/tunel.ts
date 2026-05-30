import { P, css, type RGB } from '../art/palette';
import { drawText } from '../art/font';
import { drawMeno, drawCongui } from '../art/actor';
import { MENO_DIALOGUE, CONGUI_TUNEL_DIALOGUE } from '../content/dialogues';
import type { Room, NPC, Hotspot, Exit } from '../engine/types';

// EPISODE 5 — el túnel del tren: two tracks in the dark. El Meno wants fire for his
// porro; light it (give him the mechero) and he yanks loose the iron you need as a
// lever for the fountain grate. El Petit Pulmó (spirit) keeps him company.

function r(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, c: RGB) {
  ctx.fillStyle = css(c); ctx.fillRect(x | 0, y | 0, w | 0, h | 0);
}

export function buildTunelScene(): HTMLCanvasElement {
  const cv = document.createElement('canvas'); cv.width = 320; cv.height = 144;
  const ctx = cv.getContext('2d')!; ctx.imageSmoothingEnabled = false;
  r(ctx, 0, 0, 320, 144, [16, 14, 20]);
  // tunnel vault (brick arch receding) — concentric darker rings toward a far light
  for (let i = 0; i < 6; i++) {
    const w = 320 - i * 40, h = 112 - i * 14, x = (320 - w) / 2, y = 4 + i * 6;
    ctx.fillStyle = css([34 - i * 3, 30 - i * 3, 40 - i * 4] as RGB);
    ctx.fillRect(x, y, w, h);
  }
  r(ctx, 150, 36, 20, 14, [60, 60, 54]); // faint daylight at the far end
  // brick courses on the side walls
  for (let yy = 14; yy < 96; yy += 8) { r(ctx, 0, yy, 70, 1, [24, 20, 28]); r(ctx, 250, yy, 70, 1, [24, 20, 28]); }
  // ground / track bed
  r(ctx, 0, 96, 320, 48, [38, 34, 36]); r(ctx, 0, 96, 320, 2, [54, 48, 48]);
  // railway sleepers + two rails, converging toward the centre
  for (let i = 0; i < 9; i++) { const y = 100 + i * 5; const inset = (8 - i) * 6; r(ctx, 40 + inset, y, 240 - inset * 2, 2, [70, 54, 40]); }
  ctx.strokeStyle = css([120, 122, 130]); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(40, 142); ctx.lineTo(150, 100); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(280, 142); ctx.lineTo(170, 100); ctx.stroke();
  // a broken rail section (right), with the iron prised up
  r(ctx, 196, 120, 44, 4, [60, 44, 36]);
  ctx.strokeStyle = css([96, 98, 106]); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(196, 122); ctx.lineTo(214, 121); ctx.stroke();   // rail breaks off
  drawText(ctx, 'El túnel del tren', 36, 7, P.inkLight, 1, P.black, 1);
  return cv;
}

export function tunelOverlays(ctx: CanvasRenderingContext2D, t: number) {
  // a dim, slowly pulsing glow at the far end (a far-off train light)
  const f = 0.5 + 0.5 * Math.sin(t * 0.8);
  const g = ctx.createRadialGradient(160, 43, 2, 160, 43, 40);
  g.addColorStop(0, 'rgba(150,150,120,' + (0.18 * f).toFixed(3) + ')');
  g.addColorStop(1, 'rgba(150,150,120,0)');
  ctx.fillStyle = g; ctx.fillRect(110, 14, 100, 70);
}

// the loose iron sticking out of the broken rail, until it is taken.
export function tunelDynamic(ctx: CanvasRenderingContext2D, state: any) {
  if (state.flags.took_hierro) return;
  ctx.strokeStyle = css([110, 112, 120]); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(214, 124); ctx.lineTo(226, 114); ctx.lineTo(230, 109); ctx.stroke();
  ctx.fillStyle = css([140, 142, 150]); ctx.fillRect(228, 107, 4, 3);
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 'hierro', name: 'el hierro de la vía', x: 206, y: 104, w: 32, h: 26, walkTo: { x: 224, y: 138 },
    look: 'Un trozo de hierro de la vía, medio suelto. Sería una palanca perfecta... si lograra arrancarlo.',
    pickup: { id: 'hierro', name: 'un hierro (palanca)' },
    pickupIf: 'meno_ayuda',
    pickupBlocked: 'Está bien encajado. Yo solo no puedo con él. A ver si el Meno me echa un cable.',
    responses: { Coger: 'Cojo el hierro suelto. Pesa lo suyo, pero hará de palanca de lujo.' },
  },
  { id: 'via', name: 'las vías', x: 40, y: 100, w: 240, h: 30, walkTo: { x: 160, y: 138 },
    look: 'Dos vías que se pierden en lo oscuro. Más vale no entretenerse aquí en medio.' },
  { id: 'fondo', name: 'el fondo del túnel', x: 130, y: 30, w: 60, h: 30, walkTo: { x: 160, y: 138 },
    look: 'Al fondo se ve un puntito de luz. O es la salida... o es un tren. Mejor no comprobarlo.' },
];

const NPCS: NPC[] = [
  {
    id: 'congui_t', name: 'el Petit Pulmó', x: 70, y: 78, w: 26, h: 46,
    feet: { x: 84, y: 124 }, walkTo: { x: 104, y: 138 }, facing: 'right', color: [150, 222, 170],
    look: 'El Petit Pulmó, haciendo de maestro espiritual del Meno. Da clases magistrales de no hacer nada.',
    draw: drawCongui, dialogue: CONGUI_TUNEL_DIALOGUE,
  },
  {
    id: 'meno', name: 'el Meno', x: 110, y: 80, w: 26, h: 48,
    feet: { x: 124, y: 128 }, walkTo: { x: 146, y: 138 }, facing: 'left', color: [230, 224, 208],
    look: 'El Meno, con el porro liado y cara de necesitar fuego con urgencia. Buen chaval, eso sí.',
    draw: drawMeno, dialogue: MENO_DIALOGUE,
    accepts: {
      mechero: {
        line: '¡Eso es! (da una calada larguísima) Aaah... ahora sí me viene la fuerza. Venga, ese hierro... (TIRA) ...¡toma ya! Está suelto, cógelo, máquina.',
        remove: ['mechero'], flag: 'meno_ayuda',
      },
    },
  },
];

const EXITS: Exit[] = [
  { id: 'toCesped', name: 'el césped', x: 300, y: 104, w: 20, h: 40, walkTo: { x: 296, y: 138 }, to: 'cesped', entry: { x: 30, y: 135 }, arrow: 'right' },
];

export const TUNEL: Room = {
  id: 'tunel',
  build: buildTunelScene,
  overlays: tunelOverlays,
  dynamic: tunelDynamic,
  hotspots: HOTSPOTS,
  npcs: NPCS,
  exits: EXITS,
  walk: { minX: 16, maxX: 300, minY: 118, maxY: 140 },
  start: { x: 280, y: 135 },
};
