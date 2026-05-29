import { P, css, type RGB } from './palette';

// Shared pixel helpers. px = flat rect; blk = rect with a 1px dark outline.
function px(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, c: RGB) {
  ctx.fillStyle = css(c);
  ctx.fillRect(x | 0, y | 0, w | 0, h | 0);
}
function blk(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, c: RGB, o: RGB = P.black) {
  ctx.fillStyle = css(o);
  ctx.fillRect(x | 0, y | 0, w | 0, h | 0);
  ctx.fillStyle = css(c);
  ctx.fillRect((x | 0) + 1, (y | 0) + 1, Math.max(0, (w | 0) - 2), Math.max(0, (h | 0) - 2));
}

// All characters are drawn from the feet up at (fx,fy); `facing` mirrors the
// sprite; `t` (seconds) drives walk / idle. ~50px tall is the baseline.

const JACKET: RGB = [96, 112, 84];     // protagonist's olive bomber
const JACKET_D: RGB = [70, 84, 62];
const HAIR_DK: RGB = [56, 42, 32];

// ---- The protagonist: a modern guy who woke up under the bridge ----
export function drawActor(
  ctx: CanvasRenderingContext2D, fx: number, fy: number,
  facing: 'left' | 'right' = 'right', moving = false, t = 0, idleBob = 0,
) {
  const cx = Math.round(fx);
  const fyR = Math.round(fy);
  ctx.save();
  if (facing === 'left') { ctx.translate(cx * 2, 0); ctx.scale(-1, 1); }

  const swing = moving ? Math.round(Math.sin(t * 11) * 2) : 0;
  const aswing = moving ? Math.round(Math.sin(t * 11) * 1.5) : 0;
  const bob = moving ? (Math.sin(t * 11) > 0 ? 1 : 0) : Math.round(idleBob);

  // jeans + trainers
  blk(ctx, cx - 6 + swing, fyR - 20, 5, 16, P.pants);
  blk(ctx, cx + 1 - swing, fyR - 20, 5, 16, P.pants);
  px(ctx, cx - 5 + swing, fyR - 19, 2, 14, P.pantsShadow);
  px(ctx, cx + 2 - swing, fyR - 19, 2, 14, P.pantsShadow);
  blk(ctx, cx - 7 + swing, fyR - 5, 7, 5, [232, 228, 220]); // white trainers
  blk(ctx, cx + 0 - swing, fyR - 5, 7, 5, [232, 228, 220]);

  // bomber jacket torso
  const ty = fyR - 38 + bob;
  blk(ctx, cx - 7, ty, 14, 19, JACKET);
  px(ctx, cx - 6, ty + 1, 3, 17, JACKET_D);
  px(ctx, cx + 4, ty + 1, 2, 17, JACKET_D);
  px(ctx, cx - 1, ty + 1, 2, 17, [120, 138, 108]); // zip
  px(ctx, cx - 7, ty + 17, 14, 2, JACKET_D);        // hem band
  // arms
  blk(ctx, cx - 10, ty + 2 + aswing, 4, 13, JACKET);
  blk(ctx, cx + 6, ty + 2 - aswing, 4, 13, JACKET);
  px(ctx, cx - 10, ty + 13 + aswing, 4, 3, P.skin);
  px(ctx, cx + 6, ty + 13 - aswing, 4, 3, P.skin);

  // head
  px(ctx, cx - 2, ty - 2, 4, 3, P.skin);
  const hy = fyR - 50 + bob;
  blk(ctx, cx - 5, hy, 10, 11, P.skin);
  px(ctx, cx - 4, hy + 1, 3, 9, P.skinShadow);
  px(ctx, cx - 5, hy - 1, 11, 3, HAIR_DK);   // hair
  px(ctx, cx - 6, hy + 1, 2, 4, HAIR_DK);
  px(ctx, cx + 1, hy + 4, 1, 2, P.black);    // eye
  px(ctx, cx + 1, hy + 8, 3, 1, P.skinShadow);
  px(ctx, cx - 1, hy + 9, 5, 1, [150, 120, 96]); // stubble jaw

  ctx.restore();
}

// ---- El Congui: a wiry ghost à la Moe — skinny, big nose, short white hair ----
export function drawCongui(ctx: CanvasRenderingContext2D, fx: number, fy: number, facing: 'left' | 'right' = 'right', t = 0) {
  const cx = Math.round(fx);
  const fyR = Math.round(fy) - Math.round(Math.sin(t * 1.6) * 1.5) - 2; // floats
  ctx.save();
  ctx.globalAlpha = 0.82;
  if (facing === 'left') { ctx.translate(cx * 2, 0); ctx.scale(-1, 1); }
  // ghost-tinted palette
  const GJEANS: RGB = [96, 150, 132], GTEE: RGB = [168, 214, 190], GSKIN: RGB = [176, 226, 196], GHAIR: RGB = [228, 250, 236], GOUT: RGB = [40, 80, 64];
  // thin jeans legs (short, skinny)
  blk(ctx, cx - 4, fyR - 15, 3, 14, GJEANS, GOUT);
  blk(ctx, cx + 1, fyR - 15, 3, 14, GJEANS, GOUT);
  // narrow grey tee
  const ty = fyR - 28;
  blk(ctx, cx - 5, ty, 10, 15, GTEE, GOUT);
  px(ctx, cx - 4, ty + 1, 2, 13, [140, 188, 166]);
  // thin arms
  blk(ctx, cx - 8, ty + 1, 3, 12, GTEE, GOUT);
  blk(ctx, cx + 5, ty + 1, 3, 12, GTEE, GOUT);
  px(ctx, cx - 8, ty + 11, 3, 2, GSKIN);
  px(ctx, cx + 5, ty + 11, 3, 2, GSKIN);
  // head with a big nose
  const hy = fyR - 39;
  blk(ctx, cx - 4, hy, 9, 10, GSKIN, GOUT);
  px(ctx, cx + 4, hy + 4, 3, 3, GSKIN);          // big nose pokes out (right)
  px(ctx, cx + 6, hy + 5, 1, 2, GSKIN);
  px(ctx, cx - 4, hy - 1, 9, 2, GHAIR);          // short white hair
  px(ctx, cx - 5, hy, 2, 3, GHAIR);
  px(ctx, cx + 1, hy + 3, 1, 2, GOUT);           // eye
  px(ctx, cx - 1, hy + 7, 4, 1, GOUT);           // mouth
  ctx.globalAlpha = 1;
  ctx.restore();
}

// ---- El Zerry: moreno, modern grey tee, handing out burgers ----
export function drawZerry(ctx: CanvasRenderingContext2D, fx: number, fy: number, facing: 'left' | 'right' = 'right', t = 0) {
  const cx = Math.round(fx);
  const fyR = Math.round(fy);
  const bob = Math.sin(t * 1.7) > 0.9 ? 1 : 0;
  ctx.save();
  if (facing === 'left') { ctx.translate(cx * 2, 0); ctx.scale(-1, 1); }
  const TEE: RGB = [156, 158, 162], PANTS: RGB = [58, 60, 70];
  blk(ctx, cx - 6, fyR - 18, 5, 16, PANTS);
  blk(ctx, cx + 1, fyR - 18, 5, 16, PANTS);
  blk(ctx, cx - 7, fyR - 4, 7, 4, [40, 40, 46]);
  blk(ctx, cx + 0, fyR - 4, 7, 4, [40, 40, 46]);
  const ty = fyR - 36 + bob;
  blk(ctx, cx - 7, ty, 14, 20, TEE);
  px(ctx, cx - 6, ty + 1, 3, 18, [128, 130, 134]);
  px(ctx, cx - 2, ty + 3, 4, 6, [70, 74, 92]);   // a navy graphic on the tee
  // arms; right arm holds a little burger out
  blk(ctx, cx - 10, ty + 2, 4, 12, TEE);
  blk(ctx, cx + 6, ty + 2, 4, 9, TEE);
  px(ctx, cx - 10, ty + 12, 4, 3, P.skin);
  px(ctx, cx + 6, ty + 9, 4, 3, P.skin);
  px(ctx, cx + 6, ty + 11, 5, 3, [206, 152, 88]); // burger in hand
  px(ctx, cx + 7, ty + 13, 4, 1, [120, 168, 78]);
  // head
  const hy = fyR - 48 + bob;
  blk(ctx, cx - 5, hy, 10, 11, P.skin);
  px(ctx, cx - 4, hy + 1, 3, 9, P.skinShadow);
  px(ctx, cx - 5, hy - 1, 11, 3, [38, 32, 28]);   // short dark hair
  px(ctx, cx + 1, hy + 4, 1, 2, P.black);
  px(ctx, cx - 1, hy + 9, 5, 1, [150, 120, 96]);  // stubble
  ctx.restore();
}

// ---- El Joan: tall, bald, strong; lifeguard kit ----
export function drawJoan(ctx: CanvasRenderingContext2D, fx: number, fy: number, facing: 'left' | 'right' = 'right', t = 0) {
  const cx = Math.round(fx);
  const fyR = Math.round(fy);
  const bob = Math.sin(t * 1.4) > 0.92 ? 1 : 0;
  ctx.save();
  if (facing === 'left') { ctx.translate(cx * 2, 0); ctx.scale(-1, 1); }
  const RED: RGB = P.lifeRed, RED_D: RGB = [160, 44, 38];
  // legs (bare, athletic) + flip-flops
  blk(ctx, cx - 6, fyR - 16, 5, 14, P.skin);
  blk(ctx, cx + 1, fyR - 16, 5, 14, P.skin);
  px(ctx, cx - 5, fyR - 15, 2, 12, P.skinShadow);
  px(ctx, cx + 2, fyR - 15, 2, 12, P.skinShadow);
  px(ctx, cx - 7, fyR - 2, 7, 2, [60, 50, 44]);
  px(ctx, cx + 0, fyR - 2, 7, 2, [60, 50, 44]);
  // red lifeguard shorts
  blk(ctx, cx - 7, fyR - 22, 14, 8, RED);
  px(ctx, cx - 1, fyR - 22, 1, 8, RED_D);
  // broad red tank top (strong build = wider torso)
  const ty = fyR - 42 + bob;
  blk(ctx, cx - 9, ty, 18, 22, RED);
  px(ctx, cx - 7, ty + 1, 3, 20, RED_D);
  px(ctx, cx + 5, ty + 1, 3, 20, RED_D);
  px(ctx, cx - 3, ty + 3, 6, 4, [240, 230, 220]); // white cross emblem
  px(ctx, cx - 1, ty + 2, 2, 6, [240, 230, 220]);
  // a whistle on a cord
  px(ctx, cx - 2, ty, 4, 1, [40, 40, 44]);
  px(ctx, cx + 2, ty + 5, 2, 2, [220, 210, 90]);
  // thick arms
  blk(ctx, cx - 12, ty + 2, 4, 14, P.skin);
  blk(ctx, cx + 8, ty + 2, 4, 14, P.skin);
  px(ctx, cx - 12, ty + 13, 4, 3, P.skinShadow);
  px(ctx, cx + 8, ty + 13, 4, 3, P.skinShadow);
  // bald head + stubble
  const hy = fyR - 53 + bob;
  blk(ctx, cx - 5, hy, 11, 11, P.skin);
  px(ctx, cx - 4, hy + 1, 3, 9, P.skinShadow);
  px(ctx, cx - 4, hy, 9, 2, [240, 196, 156]);    // bald shine
  px(ctx, cx + 2, hy + 4, 1, 2, P.black);        // eye
  px(ctx, cx - 2, hy + 8, 7, 2, [150, 120, 96]); // beard stubble
  ctx.restore();
}

// ---- El frutero: market fruit-seller, cap + apron + moustache ----
export function drawFrutero(ctx: CanvasRenderingContext2D, fx: number, fy: number, facing: 'left' | 'right' = 'right', t = 0) {
  const cx = Math.round(fx);
  const fyR = Math.round(fy);
  const bob = Math.sin(t * 1.5) > 0.94 ? 1 : 0;
  ctx.save();
  if (facing === 'left') { ctx.translate(cx * 2, 0); ctx.scale(-1, 1); }
  const SHIRT: RGB = [180, 130, 92], APRON: RGB = [78, 110, 84], CAP: RGB = [120, 70, 56];
  blk(ctx, cx - 6, fyR - 18, 5, 16, [86, 72, 58]);
  blk(ctx, cx + 1, fyR - 18, 5, 16, [86, 72, 58]);
  blk(ctx, cx - 7, fyR - 4, 7, 4, P.black);
  blk(ctx, cx + 0, fyR - 4, 7, 4, P.black);
  const ty = fyR - 36 + bob;
  blk(ctx, cx - 7, ty, 14, 20, SHIRT);
  px(ctx, cx - 5, ty + 5, 10, 14, APRON);         // apron
  px(ctx, cx - 5, ty + 5, 10, 1, [98, 132, 104]);
  blk(ctx, cx - 10, ty + 2, 4, 12, SHIRT);
  blk(ctx, cx + 6, ty + 2, 4, 12, SHIRT);
  px(ctx, cx - 10, ty + 12, 4, 3, P.skin);
  px(ctx, cx + 6, ty + 12, 4, 3, P.skin);
  const hy = fyR - 47 + bob;
  blk(ctx, cx - 5, hy, 10, 11, P.skin);
  px(ctx, cx - 4, hy + 1, 3, 9, P.skinShadow);
  px(ctx, cx - 4, hy + 7, 10, 2, [120, 90, 64]);  // moustache
  px(ctx, cx + 1, hy + 4, 1, 2, P.black);
  px(ctx, cx - 6, hy - 2, 13, 3, CAP);            // flat cap
  px(ctx, cx + 5, hy, 4, 2, CAP);                 // cap brim
  ctx.restore();
}

// ---- Un viejo: old man gossiping in the square (boina + cardigan + cane) ----
export function drawViejo(ctx: CanvasRenderingContext2D, fx: number, fy: number, facing: 'left' | 'right' = 'right', t = 0) {
  const cx = Math.round(fx);
  const fyR = Math.round(fy);
  const bob = Math.sin(t * 1.2 + fx) > 0.95 ? 1 : 0;
  ctx.save();
  if (facing === 'left') { ctx.translate(cx * 2, 0); ctx.scale(-1, 1); }
  const TROUS: RGB = [92, 86, 78], CARD: RGB = [120, 104, 80], BOINA: RGB = [70, 62, 54];
  blk(ctx, cx - 5, fyR - 16, 5, 14, TROUS);
  blk(ctx, cx + 1, fyR - 16, 5, 14, TROUS);
  blk(ctx, cx - 6, fyR - 4, 6, 4, [50, 42, 36]);
  blk(ctx, cx + 1, fyR - 4, 6, 4, [50, 42, 36]);
  // a cane
  px(ctx, cx + 8, fyR - 20, 1, 18, [110, 80, 50]);
  px(ctx, cx + 7, fyR - 21, 3, 1, [110, 80, 50]);
  const ty = fyR - 32 + bob;
  blk(ctx, cx - 6, ty, 13, 18, CARD);             // cardigan
  px(ctx, cx - 1, ty + 1, 1, 16, [96, 82, 62]);   // button line
  blk(ctx, cx - 9, ty + 2, 4, 11, CARD);
  blk(ctx, cx + 6, ty + 2, 3, 11, CARD);
  px(ctx, cx - 9, ty + 11, 4, 2, P.skin);
  px(ctx, cx + 6, ty + 11, 3, 2, P.skin);
  const hy = fyR - 43 + bob;
  blk(ctx, cx - 4, hy, 9, 10, P.skin);
  px(ctx, cx - 3, hy + 1, 2, 8, P.skinShadow);
  px(ctx, cx - 4, hy + 2, 1, 7, [220, 216, 210]); // white sideburn
  px(ctx, cx + 5, hy + 2, 1, 7, [220, 216, 210]);
  px(ctx, cx + 1, hy + 4, 1, 2, P.black);
  px(ctx, cx - 5, hy - 2, 11, 3, BOINA);          // boina
  px(ctx, cx + 5, hy - 1, 2, 1, BOINA);
  ctx.restore();
}
