import { P, css, type RGB } from '../art/palette';
import { drawText } from '../art/font';
import { drawMeno, drawCongui } from '../art/actor';
import { MENO_DIALOGUE, CONGUI_TUNEL_DIALOGUE } from '../content/dialogues';
import type { Room, NPC, Hotspot, Exit } from '../engine/types';

// EPISODE 5 — el túnel del tren: a double-track railway tunnel (one track each
// way). A refuge niche (casilla) is cut into the wall to shelter in when a train
// passes — el Meno and el Petit Pulmó have made it their smoking spot. Light the
// Meno's porro (give the mechero) and he prises loose the iron you need as a lever.

function r(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, c: RGB) {
  ctx.fillStyle = css(c); ctx.fillRect(x | 0, y | 0, w | 0, h | 0);
}

export function buildTunelScene(): HTMLCanvasElement {
  const cv = document.createElement('canvas'); cv.width = 320; cv.height = 144;
  const ctx = cv.getContext('2d')!; ctx.imageSmoothingEnabled = false;
  r(ctx, 0, 0, 320, 144, [14, 12, 18]); // black (outside the bore)

  // tunnel bore: a wide arched vault
  ctx.fillStyle = css([34, 30, 40]);
  ctx.beginPath();
  ctx.moveTo(6, 144); ctx.lineTo(6, 54);
  ctx.ellipse(160, 54, 154, 46, 0, Math.PI, 0);
  ctx.lineTo(314, 144); ctx.closePath(); ctx.fill();
  // vault ribs (curved courses)
  ctx.strokeStyle = css([24, 20, 30]); ctx.lineWidth = 1;
  for (let i = 1; i <= 3; i++) { ctx.beginPath(); ctx.ellipse(160, 54, 154 - i * 10, 46 - i * 9, 0, Math.PI, 0); ctx.stroke(); }
  // side-wall brick courses
  for (let y = 56; y < 100; y += 8) { r(ctx, 6, y, 38, 1, [22, 18, 28]); r(ctx, 276, y, 38, 1, [22, 18, 28]); }

  // track bed (ballast)
  r(ctx, 0, 100, 320, 44, [46, 42, 42]);
  r(ctx, 0, 100, 320, 1, [58, 54, 52]);
  for (let i = 0; i < 130; i++) { const gx = (i * 41) % 320, gy = 102 + (i * 23) % 40; r(ctx, gx, gy, 1, 1, [34, 30, 32]); }

  // two tracks (one each direction): a far one and a near one
  function track(y: number, gauge: number) {
    for (let x = 2; x < 320; x += 12) r(ctx, x, y + 1, 8, gauge, [62, 46, 32]); // sleepers
    r(ctx, 0, y, 320, 2, [122, 124, 132]); r(ctx, 0, y + gauge, 320, 2, [122, 124, 132]); // rails
    r(ctx, 0, y, 320, 1, [156, 158, 166]); r(ctx, 0, y + gauge, 320, 1, [156, 158, 166]); // shine
  }
  track(110, 6);  // vía 1 (far)
  track(128, 9);  // vía 2 (near)

  // the refuge niche (casilla), recessed into the left wall and raised above the rails
  r(ctx, 40, 48, 86, 58, [10, 8, 14]);              // recess opening
  r(ctx, 44, 52, 78, 46, [42, 38, 48]);             // back wall (a touch lighter)
  r(ctx, 36, 46, 92, 4, [82, 74, 64]);              // lintel
  r(ctx, 36, 46, 4, 60, [82, 74, 64]); r(ctx, 124, 46, 4, 60, [82, 74, 64]); // jambs
  r(ctx, 42, 98, 82, 8, [56, 52, 58]);              // ledge / platform
  r(ctx, 42, 98, 82, 2, [74, 70, 76]);
  r(ctx, 82, 50, 3, 5, [60, 56, 50]); r(ctx, 80, 55, 6, 3, [214, 188, 104]); // little lamp

  drawText(ctx, 'El túnel del tren', 36, 7, P.inkLight, 1, P.black, 1);
  return cv;
}

export function tunelOverlays(ctx: CanvasRenderingContext2D, t: number) {
  // a warm headlight glow pulsing from the right mouth — a train could come
  const f = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 0.7));
  const g = ctx.createRadialGradient(316, 118, 4, 316, 118, 86);
  g.addColorStop(0, 'rgba(244,232,180,' + (0.16 * f).toFixed(3) + ')');
  g.addColorStop(1, 'rgba(244,232,180,0)');
  ctx.fillStyle = g; ctx.fillRect(214, 56, 106, 88);
  // a soft glow inside the refuge lamp
  const lg = ctx.createRadialGradient(83, 58, 1, 83, 58, 22);
  lg.addColorStop(0, 'rgba(240,214,130,0.22)'); lg.addColorStop(1, 'rgba(240,214,130,0)');
  ctx.fillStyle = lg; ctx.fillRect(60, 44, 48, 40);
}

// the prised-up iron on the near rail, until it is taken.
export function tunelDynamic(ctx: CanvasRenderingContext2D, state: any) {
  if (state.flags.took_hierro) return;
  ctx.fillStyle = css([42, 38, 40]); ctx.fillRect(206, 128, 30, 4);          // a gap broken in the near rail
  ctx.strokeStyle = css([122, 124, 132]); ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(208, 132); ctx.lineTo(222, 120); ctx.lineTo(228, 113); ctx.stroke(); // bar prised up
  ctx.fillStyle = css([152, 154, 162]); ctx.fillRect(226, 111, 4, 3);
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 'hierro', name: 'el hierro de la vía', x: 200, y: 108, w: 38, h: 28, walkTo: { x: 218, y: 138 },
    look: 'Un trozo de hierro de la vía, medio suelto. Sería una palanca perfecta... si lograra arrancarlo.',
    pickup: { id: 'hierro', name: 'un hierro (palanca)' },
    pickupIf: 'meno_ayuda',
    pickupBlocked: 'Está bien encajado. Yo solo no puedo con él. A ver si el Meno me echa un cable.',
    responses: { Coger: 'Cojo el hierro suelto. Pesa lo suyo, pero hará de palanca de lujo.' },
  },
  { id: 'casilla', name: 'la casilla', x: 36, y: 46, w: 92, h: 18, walkTo: { x: 120, y: 138 },
    look: 'Una casilla en la pared, de esas donde te metes cuando pasa el tren. El Congui y el Meno la han hecho su salón particular.' },
  { id: 'via', name: 'las dos vías', x: 0, y: 106, w: 320, h: 30, walkTo: { x: 200, y: 138 },
    look: 'Dos vías, una para cada sentido. Por aquí pasan trenes, así que mejor no entretenerse en medio.' },
  { id: 'fondo', name: 'el fondo del túnel', x: 278, y: 52, w: 40, h: 48, walkTo: { x: 270, y: 138 },
    look: 'El túnel se pierde en la negrura. De ahí puede salir un tren en cualquier momento. Por algo está la casilla.' },
];

const NPCS: NPC[] = [
  {
    id: 'congui_t', name: 'el Petit Pulmó', x: 52, y: 58, w: 26, h: 48,
    feet: { x: 66, y: 104 }, walkTo: { x: 118, y: 138 }, facing: 'right', color: [150, 222, 170],
    look: 'El Petit Pulmó, repantingado en la casilla. Hace de maestro espiritual del Meno entre tren y tren.',
    draw: drawCongui, dialogue: CONGUI_TUNEL_DIALOGUE,
  },
  {
    id: 'meno', name: 'el Meno', x: 84, y: 58, w: 26, h: 48,
    feet: { x: 98, y: 104 }, walkTo: { x: 122, y: 138 }, facing: 'left', color: [230, 224, 208],
    look: 'El Meno, en la casilla con el porro liado y cara de necesitar fuego con urgencia. Buen chaval, eso sí.',
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
  walk: { minX: 16, maxX: 300, minY: 120, maxY: 140 },
  start: { x: 280, y: 135 },
};
