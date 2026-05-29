import { P, css, type RGB } from '../art/palette';
import { Pixels, rampPick } from '../art/dither';
import { drawText } from '../art/font';
import { drawMarcos, drawMarkitos, drawCarmona } from '../art/actor';
import { MARCOS_DIALOGUE, MARKITOS_DIALOGUE, CARMONA_DIALOGUE } from '../content/dialogues';
import type { Room, NPC, Hotspot, Exit } from '../engine/types';

// EPISODE 2 opener — the door of El Godot, a heavy/metal bar, at night.
// Marcos + Markitos are outside, out of beer, and the bar is sealed.

function r(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, c: RGB) {
  ctx.fillStyle = css(c);
  ctx.fillRect(x | 0, y | 0, w | 0, h | 0);
}

export function buildGodotScene(): HTMLCanvasElement {
  const cv = document.createElement('canvas');
  cv.width = 320; cv.height = 144;
  const ctx = cv.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  r(ctx, 0, 0, 320, 144, [18, 16, 28]); // base night fill

  // night sky
  const img = ctx.createImageData(320, 44);
  const px = new Pixels(img, 320, 44);
  const sky: RGB[] = [[14, 12, 28], [26, 22, 46], [44, 36, 60]];
  for (let y = 0; y < 44; y++) for (let x = 0; x < 320; x++) px.set(x, y, rampPick(sky, y / 44, x, y));
  ctx.putImageData(img, 0, 0);
  // a couple of stars
  ctx.fillStyle = css([200, 200, 220]);
  for (const [sx, sy] of [[40, 12], [90, 20], [250, 10], [300, 24]] as [number, number][]) ctx.fillRect(sx, sy, 1, 1);

  // --- an old narrow street at night ---
  r(ctx, 0, 16, 116, 92, [66, 56, 50]);            // old building (left)
  r(ctx, 206, 16, 114, 92, [74, 62, 52]);          // old building (right)
  r(ctx, 108, 10, 104, 98, [88, 74, 60]);          // centre building (holds the pub)
  r(ctx, 108, 8, 104, 4, [58, 46, 36]);            // eave
  r(ctx, 0, 16, 116, 3, [86, 74, 64]); r(ctx, 206, 16, 114, 3, [94, 80, 66]);
  // upper-floor windows + sills (some warm-lit)
  const lit: RGB = [201, 162, 86];
  for (const [bx, bw] of [[6, 110], [114, 92], [210, 104]] as [number, number][]) {
    for (let wy = 24; wy < 52; wy += 22) for (let wx = bx + 8; wx < bx + bw - 12; wx += 22) {
      r(ctx, wx, wy, 10, 13, [34, 28, 30]); r(ctx, wx + 1, wy + 1, 8, 11, ((wx + wy) % 3 === 0) ? lit : [50, 56, 70]);
      r(ctx, wx - 1, wy + 13, 12, 1, [50, 40, 34]);
    }
  }

  // --- the pub: a small wooden storefront on the ground floor ---
  r(ctx, 114, 56, 100, 52, [58, 42, 30]);
  r(ctx, 114, 56, 100, 3, [86, 62, 42]);
  r(ctx, 114, 104, 100, 4, [40, 28, 20]);
  // warm pub window (left of the door), small panes
  r(ctx, 120, 64, 30, 34, [34, 24, 18]);
  r(ctx, 123, 67, 24, 28, [224, 168, 92]);
  ctx.fillStyle = css([92, 64, 36]); ctx.fillRect(134, 67, 2, 28); for (let yy = 67; yy < 95; yy += 9) ctx.fillRect(123, yy, 24, 1);
  // the wooden door (sticker-covered), centred under the sign
  const gx = 146, gw = 38;
  r(ctx, gx - 2, 60, gw + 4, 48, [34, 24, 16]);
  r(ctx, gx, 62, gw, 46, [96, 64, 40]);
  for (let i = 0; i < gw; i += 6) r(ctx, gx + i, 62, 1, 46, [70, 46, 28]);
  r(ctx, gx + 4, 70, 10, 6, [150, 60, 60]); r(ctx, gx + 22, 86, 10, 6, [70, 90, 130]); // stickers
  r(ctx, gx + gw - 8, 84, 3, 4, [200, 180, 90]);   // handle
  // a small hanging pub sign on a wrought-iron bracket
  r(ctx, 150, 18, 2, 6, [40, 36, 34]); r(ctx, 150, 18, 24, 2, [40, 36, 34]);
  r(ctx, 150, 24, 44, 12, [44, 30, 22]); r(ctx, 150, 24, 44, 2, [70, 50, 34]);
  drawText(ctx, 'GODOT', 153, 27, [206, 70, 64], 1, [10, 6, 8], 1);
  // an old streetlamp (left) + a barrel by the door + a few gig flyers
  r(ctx, 36, 58, 2, 50, [40, 38, 36]); r(ctx, 31, 52, 12, 7, [54, 50, 46]); r(ctx, 33, 54, 8, 4, P.winLit);
  r(ctx, 198, 96, 14, 12, [96, 66, 40]); r(ctx, 198, 96, 14, 2, [120, 86, 54]); r(ctx, 198, 100, 14, 1, [60, 42, 26]);
  const flyer: RGB[] = [[150, 40, 40], [60, 70, 120], [120, 110, 40]];
  for (let i = 0; i < 3; i++) { const fx = 92 + (i % 2) * 14, fy = 60 + i * 14; r(ctx, fx, fy, 14, 12, flyer[i % 3]); r(ctx, fx + 2, fy + 2, 10, 2, [220, 220, 210]); }

  // cobbled old street
  r(ctx, 0, 108, 320, 36, [60, 54, 56]);
  r(ctx, 0, 108, 320, 1, [84, 78, 80]);
  for (let y = 114; y < 144; y += 6) for (let x = ((y / 6) % 2) * 6; x < 320; x += 12) r(ctx, x, y, 5, 2, ((x + y) % 5 < 2) ? [48, 44, 46] : [60, 54, 56]);

  drawText(ctx, 'El Godot', 36, 7, P.inkLight, 1, P.black, 1);
  return cv;
}

export function godotOverlays(ctx: CanvasRenderingContext2D, t: number) {
  // warm light spilling from the pub window
  const f = 0.85 + 0.15 * Math.sin(t * 1.6);
  const wg = ctx.createRadialGradient(135, 80, 2, 135, 80, 28);
  wg.addColorStop(0, 'rgba(255,196,110,' + (0.26 * f).toFixed(3) + ')');
  wg.addColorStop(1, 'rgba(255,196,110,0)');
  ctx.fillStyle = wg; ctx.fillRect(106, 56, 60, 46);
  // old streetlamp glow (left)
  const lf = 0.75 + 0.25 * Math.sin(t * 7);
  const lg = ctx.createRadialGradient(37, 55, 1, 37, 55, 22);
  lg.addColorStop(0, 'rgba(255,222,150,' + (0.3 * lf).toFixed(3) + ')');
  lg.addColorStop(1, 'rgba(255,222,150,0)');
  ctx.fillStyle = lg; ctx.fillRect(15, 36, 44, 40);
}

// hazard tape across the shutter — drawn only while the bar is sealed (Ep2).
// Once you have the key (Ep3) it is gone and el Carmona fixes the rusty lock.
export function drawTape(ctx: CanvasRenderingContext2D) {
  ctx.save(); ctx.translate(164, 84); ctx.rotate(-0.25);
  ctx.fillStyle = css([206, 180, 60]); ctx.fillRect(-38, -3, 76, 6);
  ctx.fillStyle = css([30, 28, 20]);
  for (let i = -36; i < 36; i += 8) ctx.fillRect(i, -3, 4, 6);
  ctx.restore();
}

const HOTSPOTS: Hotspot[] = [
  { id: 'puerta', name: 'la puerta del Godot', x: 130, y: 56, w: 68, h: 52, walkTo: { x: 164, y: 138 },
    look: 'La puerta del Godot, el pub de toda la vida en esta calle vieja. Madera gastada, mil pegatinas y, hoy, una cinta precintándola.',
    responses: { Abrir: 'Cerrada y con la cinta puesta. Hoy no se entra.', 'Tirar de': 'Tiro de la puerta. La puerta gana. Como siempre.' } },
  { id: 'cartel', name: 'el cartel del Godot', x: 110, y: 10, w: 100, h: 26, walkTo: { x: 160, y: 138 },
    look: 'El cartel del Godot, mi local. Bueno... eso dicen que dije anoche. Que es mío. Ojalá me acordara.' },
  { id: 'flyers', name: 'los carteles', x: 16, y: 50, w: 124, h: 24, walkTo: { x: 70, y: 138 },
    look: 'Carteles de conciertos pegados unos sobre otros. Capas y capas de noches de Martorell.' },
];

const NPCS: NPC[] = [
  // --- Episode 2: the heavies out front (gone once you hold the key) ---
  {
    id: 'marcos', name: 'el Marcos', x: 84, y: 82, w: 26, h: 50,
    feet: { x: 98, y: 132 }, walkTo: { x: 78, y: 138 }, facing: 'right', color: [220, 150, 150],
    look: 'El Marcos. Melenas, camiseta negra y, según él, medio demonio. Lo de los pies torcidos hacia adentro, eso sí es verdad.',
    draw: drawMarcos, dialogue: MARCOS_DIALOGUE, hideIf: 'tiene_llave_godot',
  },
  {
    id: 'markitos', name: 'el Markitos', x: 116, y: 92, w: 22, h: 40,
    feet: { x: 128, y: 134 }, walkTo: { x: 146, y: 138 }, facing: 'left', color: [200, 200, 210],
    look: 'El Markitos. Punky, cabeza rapada y un palmo de estatura. Pequeño pero correoso.',
    draw: drawMarkitos, dialogue: MARKITOS_DIALOGUE, hideIf: 'tiene_llave_godot',
  },
  // --- Episode 3: el Carmona, who can fix the rusty lock for a Mazinger ---
  {
    id: 'carmona', name: 'el Carmona', x: 84, y: 82, w: 28, h: 50,
    feet: { x: 100, y: 132 }, walkTo: { x: 124, y: 138 }, facing: 'right', color: [232, 172, 150],
    look: 'El Carmona, manitas y coleccionista. Mira mi llave del Godot como quien dice "esa cerradura la arreglo yo... por un precio".',
    draw: drawCarmona, dialogue: CARMONA_DIALOGUE, showIf: 'tiene_llave_godot',
    accepts: {
      mazinger: {
        needAlso: 'llave_godot',
        missing: 'Bonito robot, pero ¿y la llave del Godot? Sin llave no hay cerradura que limar.',
        line: 'AAANDA, un Mazinger del 74... (lo abraza) Trato es trato. Trae esa llave... lima, lima... clic. ¡Ya gira! El Godot es todo tuyo.',
        remove: ['mazinger'],
        flag: 'godot_abierto',
        card: ['EPISODIO 3 COMPLETADO', '', 'El Carmona lima el óxido, mete tu llave y...', 'CLAC. La persiana del Godot por fin sube.', '', 'Dentro te espera lo que buscas desde que', 'despertaste bajo el Pont del Diable...', '', 'CONTINUARÁ... Episodio 4: Dentro del Godot'],
        goto: 'barra',
      },
    },
  },
];

const EXITS: Exit[] = [
  { id: 'toGato', name: 'el Gato Negro', x: 300, y: 108, w: 20, h: 36, walkTo: { x: 296, y: 138 }, to: 'gatonegro', entry: { x: 28, y: 135 }, arrow: 'right', hideIf: 'tiene_llave_godot' },
  { id: 'toGaraje', name: 'el Garaje San Cristóbal', x: 0, y: 108, w: 16, h: 36, walkTo: { x: 22, y: 138 }, to: 'garaje', entry: { x: 30, y: 135 }, arrow: 'left', showIf: 'tiene_llave_godot' },
];

export const GODOT: Room = {
  id: 'godot',
  build: buildGodotScene,
  overlays: godotOverlays,
  dynamic: (ctx, state) => { if (!state.flags.tiene_llave_godot) drawTape(ctx); },
  hotspots: HOTSPOTS,
  npcs: NPCS,
  exits: EXITS,
  walk: { minX: 16, maxX: 300, minY: 120, maxY: 140 },
  start: { x: 60, y: 135 },
};
