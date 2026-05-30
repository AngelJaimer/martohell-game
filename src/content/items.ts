import { P, css, type RGB } from '../art/palette';

type Draw = (ctx: CanvasRenderingContext2D, x: number, y: number) => void;

const PAPER: RGB = [226, 214, 180];
const ORANGE: RGB = [232, 146, 44];
const ORANGE_D: RGB = [192, 110, 26];
const BUN: RGB = [208, 152, 88];
const BUN_D: RGB = [170, 116, 64];
const PATTY: RGB = [96, 58, 38];
const LETTUCE: RGB = [120, 168, 78];

// Each icon draws inside a 20x20 inventory slot anchored at (x,y).
export const ITEMS: Record<string, { name: string; draw: Draw }> = {
  // The mysterious note with a code — the MacGuffin that starts it all.
  nota: {
    name: 'la nota misteriosa',
    draw: (ctx, x, y) => {
      ctx.fillStyle = css(P.stoneShadow); ctx.fillRect(x + 3, y + 4, 15, 13);
      ctx.fillStyle = css(PAPER); ctx.fillRect(x + 4, y + 5, 13, 11);
      ctx.fillStyle = css([150, 138, 110]); ctx.fillRect(x + 4, y + 10, 13, 1); // fold
      ctx.fillStyle = css([92, 80, 66]);                                        // scribbled lines
      ctx.fillRect(x + 6, y + 7, 9, 1); ctx.fillRect(x + 6, y + 8, 6, 1);
      ctx.fillStyle = css(P.flagRed);                                           // the code, in red
      ctx.fillRect(x + 6, y + 12, 2, 2); ctx.fillRect(x + 9, y + 12, 2, 2); ctx.fillRect(x + 12, y + 12, 2, 2);
    },
  },
  // Oranges from the frutero — "para que te recuperes".
  naranjas: {
    name: 'unas naranjas',
    draw: (ctx, x, y) => {
      ctx.fillStyle = css(ORANGE_D);
      ctx.beginPath(); ctx.arc(x + 8, y + 12, 5, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x + 13, y + 9, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = css(ORANGE);
      ctx.beginPath(); ctx.arc(x + 8, y + 12, 4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(x + 13, y + 9, 4, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = css([250, 198, 102]); ctx.fillRect(x + 6, y + 10, 1, 1); ctx.fillRect(x + 11, y + 7, 1, 1);
      ctx.fillStyle = css(P.leaf); ctx.fillRect(x + 13, y + 4, 3, 2);
    },
  },
  // Burger the Zerry hands out.
  hamburguesa: {
    name: 'una hamburguesa',
    draw: (ctx, x, y) => {
      const cx = x + 10;
      ctx.fillStyle = css(BUN);
      ctx.beginPath(); ctx.arc(cx, y + 9, 7, Math.PI, 0); ctx.fill(); // top bun
      ctx.fillStyle = css([242, 214, 156]);
      ctx.fillRect(cx - 3, y + 6, 1, 1); ctx.fillRect(cx + 1, y + 5, 1, 1); ctx.fillRect(cx + 3, y + 7, 1, 1);
      ctx.fillStyle = css(LETTUCE); ctx.fillRect(cx - 7, y + 9, 14, 2);
      ctx.fillStyle = css(PATTY); ctx.fillRect(cx - 7, y + 11, 14, 3);
      ctx.fillStyle = css(BUN); ctx.fillRect(cx - 7, y + 14, 14, 3);
      ctx.fillStyle = css(BUN_D); ctx.fillRect(cx - 7, y + 16, 14, 1);
    },
  },
  // The joint Joan shares. (Comedy item — straight from Angel's notes.)
  porro: {
    name: 'un porro',
    draw: (ctx, x, y) => {
      ctx.strokeStyle = css([240, 234, 218]); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x + 5, y + 15); ctx.lineTo(x + 14, y + 7); ctx.stroke();
      ctx.fillStyle = css([70, 58, 46]); ctx.fillRect(x + 4, y + 14, 2, 3);      // twisted end
      ctx.fillStyle = css([242, 120, 40]); ctx.fillRect(x + 14, y + 6, 2, 2);    // ember
      ctx.fillStyle = css([255, 206, 96]); ctx.fillRect(x + 14, y + 6, 1, 1);
      ctx.fillStyle = css([198, 198, 198]);                                      // smoke
      ctx.fillRect(x + 16, y + 4, 1, 1); ctx.fillRect(x + 17, y + 2, 1, 1);
    },
  },
  // ---------- Episode 2 ----------
  cervezas: {
    name: 'unas cervezas',
    draw: (ctx, x, y) => {
      for (const bx of [x + 6, x + 13]) {
        ctx.fillStyle = css([54, 38, 20]); ctx.fillRect(bx - 2, y + 5, 4, 12);   // brown bottle
        ctx.fillStyle = css([92, 64, 34]); ctx.fillRect(bx - 1, y + 6, 1, 10);
        ctx.fillStyle = css([40, 28, 16]); ctx.fillRect(bx - 1, y + 2, 2, 3);    // neck
        ctx.fillStyle = css([238, 214, 110]); ctx.fillRect(bx - 2, y + 9, 4, 3); // label
      }
    },
  },
  tarjeta: {
    name: 'una tarjeta',
    draw: (ctx, x, y) => {
      ctx.fillStyle = css([18, 18, 22]); ctx.fillRect(x + 3, y + 6, 14, 9);
      ctx.fillStyle = css([198, 44, 44]); ctx.fillRect(x + 4, y + 7, 12, 2);
      ctx.fillStyle = css([200, 200, 206]); ctx.fillRect(x + 5, y + 10, 9, 1); ctx.fillRect(x + 5, y + 12, 6, 1);
    },
  },
  llave_godot: {
    name: 'la llave del Godot',
    draw: (ctx, x, y) => {
      const steel: RGB = [156, 158, 168];
      ctx.strokeStyle = css(steel); ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(x + 6, y + 8, 3, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = css(steel);
      ctx.fillRect(x + 8, y + 7, 9, 2);
      ctx.fillRect(x + 15, y + 9, 2, 3); ctx.fillRect(x + 12, y + 9, 2, 2);
      ctx.fillStyle = css([96, 96, 104]); ctx.fillRect(x + 5, y + 7, 1, 2);
    },
  },
  // ---------- Episode 3 ----------
  monedas: {
    name: 'unas monedas',
    draw: (ctx, x, y) => {
      for (let i = 0; i < 3; i++) {
        const cy = y + 15 - i * 3;
        ctx.fillStyle = css(P.stoneShadow); ctx.beginPath(); ctx.ellipse(x + 10, cy, 6, 2.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = css(P.winLit); ctx.beginPath(); ctx.ellipse(x + 10, cy - 1, 6, 2.5, 0, 0, Math.PI * 2); ctx.fill();
      }
      ctx.fillStyle = css(P.sunCore); ctx.fillRect(x + 7, y + 6, 2, 1);
    },
  },
  mazinger: {
    name: 'un robot Mazinger',
    draw: (ctx, x, y) => {
      const SIL: RGB = [178, 184, 198], RED: RGB = [198, 52, 48], BLUE: RGB = [58, 92, 182];
      ctx.fillStyle = css(SIL); ctx.fillRect(x + 6, y + 13, 3, 5); ctx.fillRect(x + 11, y + 13, 3, 5); // legs
      ctx.fillRect(x + 6, y + 7, 8, 7);                                  // torso
      ctx.fillStyle = css(RED); ctx.fillRect(x + 7, y + 8, 6, 3);        // chest
      ctx.fillStyle = css(SIL); ctx.fillRect(x + 4, y + 7, 2, 5); ctx.fillRect(x + 14, y + 7, 2, 5); // arms
      ctx.fillStyle = css(RED); ctx.fillRect(x + 4, y + 11, 2, 2); ctx.fillRect(x + 14, y + 11, 2, 2); // fists
      ctx.fillStyle = css(BLUE); ctx.fillRect(x + 7, y + 2, 6, 5);       // helmet
      ctx.fillStyle = css([232, 200, 90]); ctx.fillRect(x + 8, y + 4, 4, 3); // face
      ctx.fillStyle = css(RED); ctx.fillRect(x + 8, y + 1, 4, 1);        // crest
      ctx.fillStyle = css(BLUE); ctx.fillRect(x + 5, y + 3, 2, 2); ctx.fillRect(x + 13, y + 3, 2, 2); // side fins
    },
  },
  // ---------- Episode 4 ----------
  cubo: {
    name: 'un cubo de fregar',
    draw: (ctx, x, y) => {
      ctx.fillStyle = css([150, 154, 162]);
      ctx.beginPath(); ctx.moveTo(x + 6, y + 9); ctx.lineTo(x + 15, y + 9); ctx.lineTo(x + 14, y + 18); ctx.lineTo(x + 7, y + 18); ctx.closePath(); ctx.fill();
      ctx.fillStyle = css([184, 188, 196]); ctx.fillRect(x + 6, y + 9, 9, 2);   // rim
      ctx.fillStyle = css([110, 162, 202]); ctx.fillRect(x + 8, y + 11, 5, 3);  // soapy water
      ctx.strokeStyle = css([120, 124, 132]); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(x + 10, y + 9, 4, Math.PI, 0); ctx.stroke();     // handle
      ctx.fillStyle = css([150, 110, 70]); ctx.fillRect(x + 12, y + 2, 2, 8);   // mop stick
      ctx.fillStyle = css([224, 214, 184]); ctx.fillRect(x + 10, y + 1, 5, 3);  // mop head
    },
  },
  // ---------- Episodes 5 & 6 ----------
  mechero: {
    name: 'un mechero',
    draw: (ctx, x, y) => {
      ctx.fillStyle = css([180, 40, 44]); ctx.fillRect(x + 7, y + 8, 6, 9);    // red body
      ctx.fillStyle = css([150, 28, 32]); ctx.fillRect(x + 7, y + 8, 2, 9);
      ctx.fillStyle = css([182, 186, 194]); ctx.fillRect(x + 7, y + 5, 6, 3);  // metal top
      ctx.fillStyle = css([120, 124, 132]); ctx.fillRect(x + 8, y + 4, 2, 1);  // striker
      ctx.fillStyle = css([242, 150, 40]); ctx.fillRect(x + 9, y + 1, 2, 3);   // flame
      ctx.fillStyle = css([255, 224, 130]); ctx.fillRect(x + 9, y + 2, 1, 2);
    },
  },
  hierro: {
    name: 'un hierro (palanca)',
    draw: (ctx, x, y) => {
      ctx.strokeStyle = css([96, 98, 106]); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(x + 4, y + 17); ctx.lineTo(x + 13, y + 7); ctx.lineTo(x + 16, y + 4); ctx.stroke();
      ctx.fillStyle = css([140, 142, 150]); ctx.fillRect(x + 14, y + 2, 4, 3); // hooked tip
      ctx.fillStyle = css([70, 72, 80]); ctx.fillRect(x + 3, y + 15, 3, 4);    // foot end
      ctx.fillStyle = css([162, 164, 172]); ctx.fillRect(x + 8, y + 11, 1, 1); ctx.fillRect(x + 11, y + 8, 1, 1); // shine
      ctx.fillStyle = css([150, 92, 52]); ctx.fillRect(x + 6, y + 14, 1, 1); ctx.fillRect(x + 10, y + 9, 1, 1);   // rust
    },
  },
  cervezas_emergencia: {
    name: 'una caja de cervezas',
    draw: (ctx, x, y) => {
      for (const bx of [x + 4, x + 8, x + 12, x + 16]) {
        ctx.fillStyle = css([54, 38, 20]); ctx.fillRect(bx - 1, y + 4, 2, 6);     // bottle necks
        ctx.fillStyle = css([238, 214, 110]); ctx.fillRect(bx - 1, y + 4, 2, 1);  // caps
      }
      ctx.fillStyle = css([120, 80, 46]); ctx.fillRect(x + 2, y + 9, 16, 9);      // wooden crate
      ctx.fillStyle = css([96, 62, 34]); ctx.fillRect(x + 2, y + 9, 16, 1); ctx.fillRect(x + 2, y + 13, 16, 1);
      ctx.fillStyle = css([150, 104, 60]); ctx.fillRect(x + 2, y + 17, 16, 1);
    },
  },
  limpia_superpotas: {
    name: 'limpia-superpotas',
    draw: (ctx, x, y) => {
      ctx.fillStyle = css([60, 170, 120]); ctx.fillRect(x + 6, y + 7, 8, 11);    // green bottle
      ctx.fillStyle = css([40, 140, 96]); ctx.fillRect(x + 6, y + 7, 2, 11);
      ctx.fillStyle = css([230, 232, 235]); ctx.fillRect(x + 7, y + 10, 6, 5);   // white label
      ctx.fillStyle = css([200, 60, 56]); ctx.fillRect(x + 8, y + 11, 4, 1); ctx.fillRect(x + 8, y + 13, 3, 1);
      ctx.fillStyle = css([70, 74, 82]); ctx.fillRect(x + 8, y + 3, 5, 4);       // trigger
      ctx.fillStyle = css([90, 94, 102]); ctx.fillRect(x + 5, y + 4, 4, 2);      // nozzle
      ctx.fillStyle = css([180, 240, 255]); ctx.fillRect(x + 3, y + 4, 2, 1);    // spray mist
    },
  },
};

export function makeItem(id: string) {
  const it = ITEMS[id];
  return { id, name: it ? it.name : id, draw: it ? it.draw : undefined };
}
