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

  // bar facade
  r(ctx, 0, 40, 320, 68, [46, 42, 52]);
  r(ctx, 0, 40, 320, 3, [64, 58, 70]);
  r(ctx, 0, 104, 320, 4, [30, 28, 36]);
  // grime / brick courses
  ctx.fillStyle = css([38, 34, 44]);
  for (let y = 48; y < 104; y += 8) ctx.fillRect(0, y, 320, 1);

  // band-flyer posters slapped on the wall
  const flyer: RGB[] = [[150, 40, 40], [60, 70, 120], [120, 110, 40], [80, 60, 110]];
  for (let i = 0; i < 5; i++) { const fx = 18 + i * 26; r(ctx, fx, 52, 16, 20, flyer[i % 4]); r(ctx, fx + 2, 54, 12, 3, [220, 220, 210]); }
  for (let i = 0; i < 4; i++) { const fx = 250 + (i % 2) * 22; r(ctx, fx, 56 + (i % 2) * 6, 16, 18, flyer[(i + 1) % 4]); }

  // the GODOT sign (red, with a small skull dot on the O)
  r(ctx, 110, 12, 100, 22, [24, 16, 20]);
  r(ctx, 110, 12, 100, 2, [70, 30, 34]);
  drawText(ctx, 'GODOT', 124, 16, [206, 48, 44], 2, [10, 6, 8], 1);

  // sealed roll-down metal shutter (the door)
  const gx = 134, gw = 60;
  r(ctx, gx - 4, 56, gw + 8, 52, [30, 28, 34]);
  r(ctx, gx, 60, gw, 48, [70, 70, 80]);
  for (let y = 62; y < 108; y += 4) r(ctx, gx, y, gw, 2, [54, 54, 64]);
  r(ctx, gx, 60, gw, 2, [96, 96, 108]);
  // (the hazard tape is drawn live in `dynamic`, only while the bar is sealed in Ep2)
  // a bare bulb over the door
  r(ctx, gx + gw / 2 - 1, 50, 2, 6, [60, 56, 50]);
  r(ctx, gx + gw / 2 - 2, 54, 4, 4, P.winLit);

  // pavement
  r(ctx, 0, 108, 320, 36, [54, 52, 60]);
  r(ctx, 0, 108, 320, 1, [78, 76, 84]);
  for (let y = 116; y < 144; y += 8) for (let x = ((y / 8) % 2) * 10; x < 320; x += 20) r(ctx, x, y, 16, 1, [42, 40, 48]);

  drawText(ctx, 'El Godot', 36, 7, P.inkLight, 1, P.black, 1);
  return cv;
}

export function godotOverlays(ctx: CanvasRenderingContext2D, t: number) {
  const f = 0.55 + 0.45 * (Math.sin(t * 3) > 0.7 ? 1 : 0.5); // flickering neon
  const g = ctx.createRadialGradient(160, 22, 2, 160, 22, 50);
  g.addColorStop(0, 'rgba(220,60,56,' + (0.22 * f).toFixed(3) + ')');
  g.addColorStop(1, 'rgba(220,60,56,0)');
  ctx.fillStyle = g; ctx.fillRect(96, 2, 128, 48);
  // door bulb glow
  const bg = ctx.createRadialGradient(164, 56, 1, 164, 56, 14);
  bg.addColorStop(0, 'rgba(255,220,150,0.35)'); bg.addColorStop(1, 'rgba(255,220,150,0)');
  ctx.fillStyle = bg; ctx.fillRect(150, 44, 28, 26);
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
    look: 'La persiana del Godot, bajada y precintada con cinta. Dentro, oscuridad y algo que no me da buena espina.',
    responses: { Abrir: 'Ni se mueve. Y la cinta dice bien claro que hoy no es el día.', 'Tirar de': 'Tiro de la persiana. La persiana se queda. Yo me quedo en ridículo.' } },
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
