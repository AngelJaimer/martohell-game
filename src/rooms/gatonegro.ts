import { P, css, type RGB } from '../art/palette';
import { drawText } from '../art/font';
import { drawAna, drawAngel, drawMarcos, drawMarkitos, drawCuco, drawCeuta } from '../art/actor';
import { ANA_DIALOGUE, ANGEL_DIALOGUE, MARCOS_DIALOGUE, MARKITOS_DIALOGUE, CUCO_DIALOGUE, CEUTA_DIALOGUE } from '../content/dialogues';
import type { Room, NPC, Hotspot, Exit } from '../engine/types';

// El Gato Negro — a small, dark electronic-music bar. Compliment Angel the DJ
// for free beers (give them to Marcos for the lore); knock the toilet for the card.

function r(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, c: RGB) {
  ctx.fillStyle = css(c);
  ctx.fillRect(x | 0, y | 0, w | 0, h | 0);
}

export function buildGatonegroScene(): HTMLCanvasElement {
  const cv = document.createElement('canvas');
  cv.width = 320; cv.height = 144;
  const ctx = cv.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  r(ctx, 0, 0, 320, 144, [22, 18, 30]); // base dark interior

  // back wall
  r(ctx, 0, 18, 320, 90, [40, 34, 48]);
  r(ctx, 0, 18, 320, 2, [56, 48, 64]);
  // neon "GATO NEGRO" + a cat silhouette
  drawText(ctx, 'GATO NEGRO', 96, 24, [96, 220, 224], 1, [10, 30, 32], 1);
  ctx.fillStyle = css([16, 14, 22]);
  ctx.beginPath(); ctx.arc(196, 40, 6, 0, Math.PI * 2); ctx.fill();           // cat head
  ctx.fillRect(190, 44, 14, 8); ctx.fillRect(204, 46, 4, 6);                  // body + tail
  ctx.fillStyle = css([200, 60, 140]); ctx.fillRect(193, 38, 1, 1); ctx.fillRect(198, 38, 1, 1); // pink eyes
  // pink/cyan neon strips
  r(ctx, 20, 32, 60, 1, [220, 60, 150]); r(ctx, 240, 30, 60, 1, [96, 220, 224]);

  // --- bar counter (left), bottles behind ---
  r(ctx, 14, 60, 4, 40, [54, 40, 30]);              // back shelf post
  r(ctx, 18, 58, 96, 3, [70, 50, 36]);
  const bottle: RGB[] = [[90, 130, 90], [120, 90, 60], [80, 110, 140], [150, 70, 120]];
  for (let i = 0; i < 9; i++) { const bx = 22 + i * 10; r(ctx, bx, 46, 5, 12, bottle[i % 4]); r(ctx, bx + 1, 48, 1, 8, [220, 220, 220]); }
  r(ctx, 16, 96, 104, 12, [78, 54, 38]);            // counter top
  r(ctx, 16, 96, 104, 2, [104, 74, 52]);
  r(ctx, 16, 108, 104, 4, [50, 34, 24]);

  // --- DJ booth (centre-back) ---
  r(ctx, 168, 86, 56, 22, [30, 28, 38]);            // booth box
  r(ctx, 168, 86, 56, 2, [60, 56, 72]);
  for (const dx of [180, 208]) { ctx.fillStyle = css([20, 18, 26]); ctx.beginPath(); ctx.arc(dx, 92, 5, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = css([70, 66, 80]); ctx.beginPath(); ctx.arc(dx, 92, 2, 0, Math.PI * 2); ctx.fill(); } // turntables
  r(ctx, 160, 78, 8, 30, [28, 26, 34]); r(ctx, 224, 78, 8, 30, [28, 26, 34]); // speaker stacks
  for (const sx of [161, 225]) { r(ctx, sx, 82, 6, 6, [16, 14, 20]); r(ctx, sx, 92, 6, 6, [16, 14, 20]); }

  // --- toilet (right): a door frame + WC sign; el Cuco is drawn as the door ---
  r(ctx, 254, 54, 36, 54, [34, 30, 40]);
  drawText(ctx, 'WC', 264, 44, [180, 180, 190], 1, P.black, 1);

  // floor
  r(ctx, 0, 108, 320, 36, [40, 34, 44]);
  r(ctx, 0, 108, 320, 1, [60, 52, 66]);
  for (let y = 116; y < 144; y += 8) for (let x = ((y / 8) % 2) * 12; x < 320; x += 24) r(ctx, x, y, 1, 8, [30, 26, 34]);

  drawText(ctx, 'El Gato Negro', 36, 7, P.inkLight, 1, P.black, 1);
  return cv;
}

export function gatonegroOverlays(ctx: CanvasRenderingContext2D, t: number) {
  // sweeping disco light spots
  for (let i = 0; i < 3; i++) {
    const x = 160 + Math.sin(t * 1.6 + i * 2.1) * 130;
    const hue = ['rgba(96,220,224,', 'rgba(220,60,150,', 'rgba(220,200,80,'][i];
    const g = ctx.createRadialGradient(x, 30, 2, x, 30, 40);
    g.addColorStop(0, hue + '0.12)'); g.addColorStop(1, hue + '0)');
    ctx.fillStyle = g; ctx.fillRect(x - 40, 14, 80, 96);
  }
}

const HOTSPOTS: Hotspot[] = [
  { id: 'barra', name: 'la barra', x: 16, y: 56, w: 104, h: 52, walkTo: { x: 70, y: 138 },
    look: 'La barra del Gato Negro, pegajosa de mil copas. Detrás, la Ana, que no fía ni a su madre.' },
  { id: 'cabina', name: 'la cabina', x: 160, y: 78, w: 72, h: 30, walkTo: { x: 196, y: 138 },
    look: 'La cabina del DJ. Platos, luces y un ritmo electrónico que no para. Aquí manda el Angel.' },
  { id: 'gato', name: 'el gato de neón', x: 184, y: 32, w: 28, h: 24, walkTo: { x: 196, y: 138 },
    look: 'El gato negro de neón, mascota del local. Te mira con dos ojos rosas, juzgándote en silencio.' },
];

const NPCS: NPC[] = [
  {
    id: 'ana', name: 'la Ana', x: 42, y: 74, w: 26, h: 44,
    feet: { x: 54, y: 116 }, walkTo: { x: 74, y: 138 }, facing: 'right', color: [232, 210, 140],
    look: 'La Ana, camarera rubia y de gatillo fácil con el "no". Lleva la barra como un sargento.',
    draw: drawAna, dialogue: ANA_DIALOGUE,
  },
  {
    id: 'angel', name: 'el Angel', x: 178, y: 74, w: 26, h: 44,
    feet: { x: 190, y: 116 }, walkTo: { x: 190, y: 138 }, facing: 'left', color: [150, 200, 230],
    look: 'El Angel, el DJ. Auriculares enormes y la cabeza siempre al ritmo. Buen tío si le ríes la música.',
    draw: drawAngel, dialogue: ANGEL_DIALOGUE,
  },
  {
    id: 'marcos', name: 'el Marcos', x: 100, y: 84, w: 26, h: 50,
    feet: { x: 114, y: 134 }, walkTo: { x: 96, y: 138 }, facing: 'right', color: [220, 150, 150],
    look: 'El Marcos, ya dentro y con menos sed que fuera. Le brillan los ojos al ver acercarse algo que beber.',
    draw: drawMarcos, dialogue: MARCOS_DIALOGUE,
    accepts: {
      cervezas: {
        line: 'Aaah, por fin. (trago) Vale, ya me acuerdo de anoche: yo, el demoño, eché la pota en el Godot... y salió RARO, chaval, como de otro mundo. Una tal Caledonia se llevó la llave y cerró el local porque aquello se descontroló del todo. Y tú estabas allí, ¿no te acuerdas? Ibas cagado de miedo.',
        remove: ['cervezas'],
        flag: 'sabe_espiritus',
      },
    },
  },
  {
    id: 'markitos', name: 'el Markitos', x: 76, y: 96, w: 22, h: 38,
    feet: { x: 88, y: 135 }, walkTo: { x: 70, y: 138 }, facing: 'right', color: [200, 200, 210],
    look: 'El Markitos, de puntillas para llegar a la barra. Espera su cerveza como agua de mayo.',
    draw: drawMarkitos, dialogue: MARKITOS_DIALOGUE,
  },
  {
    id: 'cuco', name: 'la puerta del lavabo', x: 258, y: 60, w: 24, h: 48,
    feet: { x: 270, y: 140 }, walkTo: { x: 250, y: 138 }, facing: 'left', color: [200, 200, 200],
    look: 'La puerta del lavabo, cerrada por dentro. Asoman dos zapatos y sube un humillo. Alguien anda a lo suyo ahí dentro.',
    draw: drawCuco, dialogue: CUCO_DIALOGUE,
  },
  {
    id: 'ceuta', name: 'el Ceuta', x: 128, y: 82, w: 24, h: 48,
    feet: { x: 140, y: 130 }, walkTo: { x: 140, y: 138 }, facing: 'right', color: [150, 226, 196],
    look: 'El espíritu del Ceuta, dando vueltas y buscando a alguien. Mira por todas partes... menos donde debe.',
    draw: drawCeuta, dialogue: CEUTA_DIALOGUE,
  },
];

const EXITS: Exit[] = [
  { id: 'toGodot', name: 'la calle (el Godot)', x: 0, y: 108, w: 14, h: 36, walkTo: { x: 20, y: 138 }, to: 'godot', entry: { x: 290, y: 136 }, arrow: 'left' },
  { id: 'toPou', name: 'el Pou del Merli', x: 306, y: 108, w: 14, h: 36, walkTo: { x: 300, y: 138 }, to: 'poumerli', entry: { x: 30, y: 135 }, arrow: 'right', showIf: 'has_tarjeta' },
];

export const GATONEGRO: Room = {
  id: 'gatonegro',
  build: buildGatonegroScene,
  overlays: gatonegroOverlays,
  hotspots: HOTSPOTS,
  npcs: NPCS,
  exits: EXITS,
  walk: { minX: 16, maxX: 300, minY: 120, maxY: 140 },
  start: { x: 30, y: 135 },
};
