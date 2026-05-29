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
};

export function makeItem(id: string) {
  const it = ITEMS[id];
  return { id, name: it ? it.name : id, draw: it ? it.draw : undefined };
}
