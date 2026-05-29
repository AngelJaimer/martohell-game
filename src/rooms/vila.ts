import { P, css, type RGB } from '../art/palette';
import { Pixels, rampPick } from '../art/dither';
import { drawText } from '../art/font';
import { drawCongui, drawFrutero } from '../art/actor';
import { CONGUI_DIALOGUE, FRUTERO_DIALOGUE } from '../content/dialogues';
import type { Room, NPC, Hotspot, Exit } from '../engine/types';

// Plaça de la Vila / de l'Ajuntament — el Congui (spirit) + the frutero.
// Give the porro to el Congui here to finish the episode.

function r(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, c: RGB) {
  ctx.fillStyle = css(c);
  ctx.fillRect(x | 0, y | 0, w | 0, h | 0);
}

function facade(ctx: CanvasRenderingContext2D, x: number, w: number, top: number, body: RGB, balconies: boolean) {
  r(ctx, x, top, w, 96 - top, body);
  r(ctx, x, top, 2, 96 - top, [body[0] + 20, body[1] + 18, body[2] + 16]);
  r(ctx, x, top, w, 4, [body[0] - 30, body[1] - 28, body[2] - 24]); // eave
  for (let wy = top + 12; wy < 88; wy += 22) {
    for (let wx = x + 6; wx < x + w - 8; wx += 18) {
      r(ctx, wx, wy, 9, 13, [46, 38, 40]);
      r(ctx, wx + 1, wy + 1, 7, 11, P.winLit);
      r(ctx, wx + 4, wy + 1, 1, 11, [70, 58, 50]);
      if (balconies) { r(ctx, wx - 2, wy + 13, 13, 1, [40, 34, 32]); for (let b = 0; b < 5; b++) r(ctx, wx - 1 + b * 3, wy + 13, 1, 4, [40, 34, 32]); }
    }
  }
}

export function buildVilaScene(): HTMLCanvasElement {
  const cv = document.createElement('canvas');
  cv.width = 320; cv.height = 144;
  const ctx = cv.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  r(ctx, 0, 0, 320, 144, [126, 144, 158]); // base fill so no transparent gaps

  const img = ctx.createImageData(320, 26);
  const px = new Pixels(img, 320, 26);
  const sky: RGB[] = [P.skyUpper, P.skyMid, P.skyHorizon];
  for (let y = 0; y < 26; y++) for (let x = 0; x < 320; x++) px.set(x, y, rampPick(sky, y / 26, x, y));
  ctx.putImageData(img, 0, 0);

  // a row of old town houses with balconies
  facade(ctx, -4, 92, 22, [186, 158, 120], true);   // left (the Ajuntament)
  facade(ctx, 92, 80, 14, [196, 170, 132], true);
  facade(ctx, 176, 150, 18, [178, 150, 116], true);  // right block

  // Ajuntament marker: a senyera + a small clock
  r(ctx, 26, 24, 16, 11, [214, 196, 120]);
  for (let i = 0; i < 4; i++) r(ctx, 26, 25 + i * 3, 16, 1, P.flagRed);
  r(ctx, 24, 22, 20, 2, [60, 48, 36]);
  // a hanging shop sign (yellow, like the ref)
  r(ctx, 120, 60, 18, 9, [232, 196, 70]);
  r(ctx, 121, 61, 16, 7, [240, 212, 110]);

  // cobbled ground
  r(ctx, 0, 96, 320, 48, [126, 112, 94]);
  r(ctx, 0, 96, 320, 1, [156, 142, 122]);
  for (let y = 102; y < 144; y += 6) for (let x = ((y / 6) % 2) * 6; x < 320; x += 12) r(ctx, x, y, 5, 2, ((x + y) % 5 < 2) ? [102, 90, 74] : [126, 112, 94]);

  // central lamp post
  r(ctx, 158, 60, 3, 40, [54, 50, 46]);
  r(ctx, 154, 56, 11, 6, [70, 64, 58]);
  r(ctx, 156, 57, 7, 4, P.winLit);

  // --- market stall (left) with crates of fruit ---
  r(ctx, 24, 70, 60, 6, [150, 90, 70]);        // awning
  r(ctx, 24, 70, 60, 2, [186, 120, 96]);
  for (let i = 0; i < 5; i++) r(ctx, 26 + i * 12, 76, 8, 2, ((i % 2) ? [150, 90, 70] : [200, 200, 196])); // stripes
  r(ctx, 28, 100, 52, 16, [120, 86, 56]);      // table
  // crates of produce
  const fruit = [[232, 146, 44], [206, 64, 56], [120, 168, 78], [232, 196, 70]] as RGB[];
  for (let i = 0; i < 4; i++) {
    const bx = 30 + i * 13;
    r(ctx, bx, 102, 11, 12, [92, 64, 40]);
    for (let k = 0; k < 4; k++) { const f = fruit[(i + k) % 4]; ctx.fillStyle = css(f); ctx.beginPath(); ctx.arc(bx + 2 + (k % 2) * 5, 104 + Math.floor(k / 2) * 5, 2, 0, Math.PI * 2); ctx.fill(); }
  }

  // café umbrellas (right)
  for (const ux of [232, 270]) {
    ctx.fillStyle = css([224, 220, 210]);
    ctx.beginPath(); ctx.moveTo(ux - 14, 86); ctx.lineTo(ux, 74); ctx.lineTo(ux + 14, 86); ctx.closePath(); ctx.fill();
    r(ctx, ux - 1, 86, 2, 14, [120, 112, 100]);
  }

  drawText(ctx, 'Ajuntament', 36, 7, P.inkLight, 1, P.black, 1);
  return cv;
}

export function vilaOverlays(ctx: CanvasRenderingContext2D, t: number) {
  const f = 0.6 + 0.4 * Math.sin(t * 6);
  const g = ctx.createRadialGradient(159, 58, 1, 159, 58, 12);
  g.addColorStop(0, 'rgba(255,220,130,' + (0.28 * f).toFixed(3) + ')');
  g.addColorStop(1, 'rgba(255,220,130,0)');
  ctx.fillStyle = g; ctx.fillRect(146, 46, 26, 26);
}

const HOTSPOTS: Hotspot[] = [
  { id: 'ayto', name: 'el Ajuntament', x: 0, y: 18, w: 88, h: 78, walkTo: { x: 40, y: 138 },
    look: 'El Ayuntamiento de Martorell, con su señera. Cerrado a estas horas. Y yo sin saber ni qué día es.' },
  { id: 'parada', name: 'la parada de fruta', x: 22, y: 68, w: 64, h: 48, walkTo: { x: 78, y: 138 },
    look: 'Una parada de fruta de las de toda la vida. Huele a naranja y a melón maduro. El estómago me ruge.' },
  { id: 'farola', name: 'la farola', x: 152, y: 54, w: 14, h: 46, walkTo: { x: 159, y: 138 },
    look: 'Una farola modernista. Da una luz cálida que no termina de espantar a los fantasmas, por lo que veo.' },
];

const NPCS: NPC[] = [
  {
    id: 'frutero', name: 'el frutero', x: 50, y: 80, w: 26, h: 48,
    feet: { x: 64, y: 124 }, walkTo: { x: 86, y: 138 }, facing: 'right', color: [206, 176, 130],
    look: 'El frutero, delantal verde y bigote de autoridad. Sabe el precio de todo y la vida de todos.',
    draw: drawFrutero, dialogue: FRUTERO_DIALOGUE,
  },
  {
    id: 'congui', name: 'el Congui', x: 196, y: 86, w: 26, h: 46,
    feet: { x: 210, y: 130 }, walkTo: { x: 232, y: 138 }, facing: 'left', color: [180, 230, 200],
    look: 'El espíritu del Congui. Flaco, bajito, nariz de campeonato. Translúcido, pero con más vidilla que muchos vivos.',
    draw: drawCongui, dialogue: CONGUI_DIALOGUE,
    accepts: {
      porro: {
        line: 'Aaah... (da una calada espectral) Esto sí que es de la buena. A ver... ya, ya me va volviendo.',
        remove: ['porro'],
        flag: 'congui_recuerda',
        card: [
          'EPISODIO 1 COMPLETADO',
          '',
          'El Congui abre mucho los ojos.',
          '"Ya me acuerdo, noi. Anoche venías del Godot,',
          'flipando. Decías que habías visto algo allí',
          'dentro... algo que no tendría que existir."',
          '',
          'El código de la nota empieza a cobrar sentido.',
          '',
          'EPISODIO 2: El Godot',
        ],
      },
    },
  },
];

const EXITS: Exit[] = [
  { id: 'toPont', name: 'el Pont del Diable', x: 0, y: 104, w: 16, h: 40, walkTo: { x: 22, y: 138 }, to: 'pont', entry: { x: 292, y: 136 }, arrow: 'left' },
  { id: 'toEsglesia', name: 'la plaza de la Iglesia', x: 300, y: 100, w: 20, h: 44, walkTo: { x: 298, y: 138 }, to: 'esglesia', entry: { x: 28, y: 135 }, arrow: 'right' },
];

export const VILA: Room = {
  id: 'vila',
  build: buildVilaScene,
  overlays: vilaOverlays,
  hotspots: HOTSPOTS,
  npcs: NPCS,
  exits: EXITS,
  walk: { minX: 16, maxX: 300, minY: 120, maxY: 140 },
  start: { x: 30, y: 135 },
};
