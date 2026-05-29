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

// ================= Episode 2 cast =================

// El Marcos — metalhead who swears he is "el demoño"; pigeon-toed, beer in hand.
export function drawMarcos(ctx: CanvasRenderingContext2D, fx: number, fy: number, facing: 'left' | 'right' = 'right', t = 0) {
  const cx = Math.round(fx), fyR = Math.round(fy);
  const bob = Math.sin(t * 1.7) > 0.93 ? 1 : 0;
  ctx.save(); if (facing === 'left') { ctx.translate(cx * 2, 0); ctx.scale(-1, 1); }
  const TEE: RGB = [34, 30, 36], JEANS: RGB = [58, 62, 82];
  blk(ctx, cx - 5, fyR - 16, 4, 14, JEANS); blk(ctx, cx + 1, fyR - 16, 4, 14, JEANS);
  // pigeon-toed: both boots nudged toward the centre
  blk(ctx, cx - 4, fyR - 4, 6, 4, [30, 28, 32]); px(ctx, cx + 1, fyR - 3, 1, 2, [82, 80, 86]);
  blk(ctx, cx - 2, fyR - 4, 6, 4, [30, 28, 32]); px(ctx, cx - 2, fyR - 3, 1, 2, [82, 80, 86]);
  const ty = fyR - 34 + bob;
  blk(ctx, cx - 7, ty, 14, 20, TEE);
  px(ctx, cx - 2, ty + 4, 4, 8, [160, 44, 40]);   // band logo
  blk(ctx, cx - 10, ty + 2, 4, 13, TEE); blk(ctx, cx + 6, ty + 2, 4, 13, TEE);
  px(ctx, cx - 10, ty + 12, 4, 3, P.skin); px(ctx, cx + 6, ty + 12, 4, 3, P.skin);
  px(ctx, cx + 8, ty + 8, 3, 8, [54, 38, 20]);    // beer bottle in hand
  const hy = fyR - 46 + bob;
  blk(ctx, cx - 5, hy, 10, 11, P.skin); px(ctx, cx - 4, hy + 1, 3, 9, P.skinShadow);
  px(ctx, cx - 6, hy - 1, 12, 5, [28, 24, 28]);   // long dark hair
  px(ctx, cx - 7, hy + 1, 3, 13, [28, 24, 28]); px(ctx, cx + 5, hy + 1, 3, 13, [28, 24, 28]);
  px(ctx, cx + 1, hy + 5, 1, 2, P.black);
  px(ctx, cx - 4, hy - 3, 2, 2, [170, 40, 36]); px(ctx, cx + 3, hy - 3, 2, 2, [170, 40, 36]); // "demoño" horns
  ctx.restore();
}

// El Markitos — punky, shaved head, very short and stocky; studded jacket.
export function drawMarkitos(ctx: CanvasRenderingContext2D, fx: number, fy: number, facing: 'left' | 'right' = 'right', t = 0) {
  const cx = Math.round(fx), fyR = Math.round(fy);
  const bob = Math.sin(t * 2.0) > 0.9 ? 1 : 0;
  ctx.save(); if (facing === 'left') { ctx.translate(cx * 2, 0); ctx.scale(-1, 1); }
  const JACKET: RGB = [42, 40, 46], JEANS: RGB = [44, 46, 60];
  blk(ctx, cx - 4, fyR - 11, 4, 9, JEANS); blk(ctx, cx + 1, fyR - 11, 4, 9, JEANS);
  blk(ctx, cx - 5, fyR - 4, 5, 4, [26, 24, 28]); blk(ctx, cx + 1, fyR - 4, 5, 4, [26, 24, 28]);
  const ty = fyR - 26 + bob;
  blk(ctx, cx - 7, ty, 14, 16, JACKET);
  for (const sx of [cx - 4, cx, cx + 4]) px(ctx, sx, ty + 4, 1, 1, [180, 182, 190]); // studs
  blk(ctx, cx - 10, ty + 2, 4, 10, JACKET); blk(ctx, cx + 6, ty + 2, 4, 10, JACKET);
  px(ctx, cx - 10, ty + 10, 4, 2, P.skin); px(ctx, cx + 6, ty + 10, 4, 2, P.skin);
  const hy = fyR - 35 + bob;
  blk(ctx, cx - 4, hy, 9, 10, P.skin); px(ctx, cx - 3, hy + 1, 2, 8, P.skinShadow);
  px(ctx, cx - 4, hy, 9, 2, [150, 120, 96]);     // shaved-scalp shadow
  px(ctx, cx + 1, hy + 4, 1, 2, P.black);
  px(ctx, cx - 1, hy + 7, 4, 1, P.skinShadow);
  ctx.restore();
}

// La Ana — blonde waitress, apron, tray.
export function drawAna(ctx: CanvasRenderingContext2D, fx: number, fy: number, facing: 'left' | 'right' = 'right', t = 0) {
  const cx = Math.round(fx), fyR = Math.round(fy);
  const bob = Math.sin(t * 1.6) > 0.94 ? 1 : 0;
  ctx.save(); if (facing === 'left') { ctx.translate(cx * 2, 0); ctx.scale(-1, 1); }
  const TOP: RGB = [40, 44, 60], APRON: RGB = [204, 198, 182], BLOND: RGB = [226, 196, 110];
  blk(ctx, cx - 5, fyR - 16, 4, 14, [50, 52, 66]); blk(ctx, cx + 1, fyR - 16, 4, 14, [50, 52, 66]);
  blk(ctx, cx - 6, fyR - 4, 6, 4, [40, 34, 32]); blk(ctx, cx + 1, fyR - 4, 6, 4, [40, 34, 32]);
  const ty = fyR - 34 + bob;
  blk(ctx, cx - 6, ty, 13, 20, TOP);
  px(ctx, cx - 4, ty + 6, 9, 13, APRON);          // apron
  blk(ctx, cx - 9, ty + 2, 4, 12, TOP); blk(ctx, cx + 6, ty + 2, 4, 12, TOP);
  px(ctx, cx - 9, ty + 12, 4, 3, P.skin); px(ctx, cx + 6, ty + 12, 4, 3, P.skin);
  px(ctx, cx + 6, ty + 14, 6, 2, [180, 182, 188]); // tray
  const hy = fyR - 45 + bob;
  blk(ctx, cx - 5, hy, 10, 11, P.skin); px(ctx, cx - 4, hy + 1, 3, 9, P.skinShadow);
  px(ctx, cx - 6, hy - 1, 12, 4, BLOND);          // blonde hair
  px(ctx, cx - 7, hy + 1, 3, 8, BLOND); px(ctx, cx + 5, hy + 1, 3, 8, BLOND);
  px(ctx, cx + 1, hy + 4, 1, 2, P.black);
  px(ctx, cx, hy + 8, 3, 1, [180, 90, 90]);       // lips
  ctx.restore();
}

// El Angel — the DJ: big headphones, hands on the decks.
export function drawAngel(ctx: CanvasRenderingContext2D, fx: number, fy: number, facing: 'left' | 'right' = 'right', t = 0) {
  const cx = Math.round(fx), fyR = Math.round(fy);
  const nod = Math.sin(t * 4) > 0 ? 1 : 0;
  ctx.save(); if (facing === 'left') { ctx.translate(cx * 2, 0); ctx.scale(-1, 1); }
  const HOODIE: RGB = [60, 70, 96];
  blk(ctx, cx - 5, fyR - 16, 4, 14, [40, 42, 52]); blk(ctx, cx + 1, fyR - 16, 4, 14, [40, 42, 52]);
  blk(ctx, cx - 6, fyR - 4, 6, 4, [220, 222, 228]); blk(ctx, cx + 1, fyR - 4, 6, 4, [220, 222, 228]);
  const ty = fyR - 34 + nod;
  blk(ctx, cx - 7, ty, 14, 20, HOODIE);
  px(ctx, cx - 1, ty + 2, 2, 16, [44, 52, 72]);
  blk(ctx, cx - 10, ty + 3, 4, 11, HOODIE); blk(ctx, cx + 6, ty + 3, 4, 11, HOODIE);
  px(ctx, cx - 10, ty + 12, 4, 3, P.skin); px(ctx, cx + 6, ty + 12, 4, 3, P.skin);
  const hy = fyR - 46 + nod;
  blk(ctx, cx - 5, hy, 10, 11, P.skin); px(ctx, cx - 4, hy + 1, 3, 9, P.skinShadow);
  px(ctx, cx - 5, hy - 1, 11, 2, [36, 30, 28]);
  px(ctx, cx + 1, hy + 4, 1, 2, P.black);
  px(ctx, cx - 7, hy + 2, 2, 5, [30, 30, 34]); px(ctx, cx + 5, hy + 2, 2, 5, [30, 30, 34]); // headphones
  px(ctx, cx - 6, hy - 2, 12, 2, [40, 40, 46]);
  ctx.restore();
}

// El Cuco — never seen: a locked toilet stall, shoes under the door, smoke.
export function drawCuco(ctx: CanvasRenderingContext2D, fx: number, fy: number, _facing: 'left' | 'right' = 'right', t = 0) {
  const cx = Math.round(fx), fyR = Math.round(fy);
  const DOOR: RGB = [120, 96, 64], DOOR_D: RGB = [86, 66, 42];
  blk(ctx, cx - 11, fyR - 46, 22, 46, DOOR);
  px(ctx, cx - 9, fyR - 44, 2, 42, [150, 122, 84]);
  px(ctx, cx - 11, fyR - 24, 22, 1, DOOR_D); px(ctx, cx - 11, fyR - 12, 22, 1, DOOR_D);
  px(ctx, cx + 6, fyR - 26, 3, 2, [200, 200, 90]); // latch
  px(ctx, cx - 7, fyR - 2, 5, 2, [30, 28, 30]); px(ctx, cx + 2, fyR - 2, 5, 2, [30, 28, 30]); // shoes
  const s = Math.round((t * 6) % 8);
  ctx.fillStyle = 'rgba(210,210,210,0.5)';
  ctx.fillRect(cx + 2, fyR - 50 - s, 1, 2); ctx.fillRect(cx + 4, fyR - 53 - s, 1, 2);
}

// El vigilante — the bouncer at Pou del Merli: stocky, arms folded, gold chain.
export function drawVigilante(ctx: CanvasRenderingContext2D, fx: number, fy: number, facing: 'left' | 'right' = 'right', t = 0) {
  const cx = Math.round(fx), fyR = Math.round(fy);
  const bob = Math.sin(t * 1.3) > 0.96 ? 1 : 0;
  ctx.save(); if (facing === 'left') { ctx.translate(cx * 2, 0); ctx.scale(-1, 1); }
  const TRACK: RGB = [38, 40, 46], STRIPE: RGB = [200, 200, 206];
  blk(ctx, cx - 6, fyR - 18, 5, 16, [44, 46, 54]); blk(ctx, cx + 1, fyR - 18, 5, 16, [44, 46, 54]);
  blk(ctx, cx - 7, fyR - 4, 7, 4, [220, 222, 228]); blk(ctx, cx + 0, fyR - 4, 7, 4, [220, 222, 228]);
  const ty = fyR - 38 + bob;
  blk(ctx, cx - 9, ty, 18, 22, TRACK);
  px(ctx, cx - 7, ty + 1, 1, 20, STRIPE); px(ctx, cx + 6, ty + 1, 1, 20, STRIPE);
  px(ctx, cx - 8, ty + 8, 16, 1, P.black);        // folded arms
  px(ctx, cx - 5, ty + 9, 3, 2, P.skin); px(ctx, cx + 3, ty + 9, 3, 2, P.skin);
  px(ctx, cx - 1, ty + 4, 2, 4, [220, 190, 90]);  // gold chain
  const hy = fyR - 49 + bob;
  blk(ctx, cx - 5, hy, 11, 11, P.skin); px(ctx, cx - 4, hy + 1, 3, 9, P.skinShadow);
  px(ctx, cx - 5, hy - 1, 11, 3, [30, 26, 24]);
  px(ctx, cx + 2, hy + 4, 1, 2, P.black);
  px(ctx, cx - 2, hy + 8, 7, 1, [120, 96, 72]);   // goatee
  ctx.restore();
}

// Ghost helper: a slow float offset, shared by the Ep2 spirits.
// (Alpha is set inside each drawer's save/restore, not here.)
function ghost(fy: number, t: number): number {
  return Math.round(fy) - Math.round(Math.sin(t * 1.5) * 1.5) - 2;
}

// La Caledonia — large woman in a housecoat (bata), shaved head; a spirit.
export function drawCaledonia(ctx: CanvasRenderingContext2D, fx: number, fy: number, facing: 'left' | 'right' = 'right', t = 0) {
  const cx = Math.round(fx); const fyR = ghost(fy, t);
  ctx.save(); ctx.globalAlpha = 0.82;
  if (facing === 'left') { ctx.translate(cx * 2, 0); ctx.scale(-1, 1); }
  const BATA: RGB = [120, 196, 168], BATA_D: RGB = [86, 158, 132], GSKIN: RGB = [176, 226, 196], GOUT: RGB = [40, 80, 64];
  blk(ctx, cx - 11, fyR - 34, 22, 32, BATA, GOUT);
  px(ctx, cx - 9, fyR - 32, 3, 28, BATA_D);
  for (const fxp of [cx - 5, cx + 3]) { px(ctx, fxp, fyR - 26, 2, 2, GSKIN); px(ctx, fxp + 1, fyR - 18, 1, 2, GSKIN); }
  px(ctx, cx - 1, fyR - 33, 2, 31, BATA_D);
  blk(ctx, cx - 6, fyR - 4, 5, 4, BATA_D, GOUT); blk(ctx, cx + 1, fyR - 4, 5, 4, BATA_D, GOUT);
  blk(ctx, cx - 14, fyR - 32, 4, 14, BATA, GOUT); blk(ctx, cx + 10, fyR - 32, 4, 14, BATA, GOUT);
  px(ctx, cx - 14, fyR - 20, 4, 3, GSKIN); px(ctx, cx + 10, fyR - 20, 4, 3, GSKIN);
  const hy = fyR - 46;
  blk(ctx, cx - 6, hy, 12, 12, GSKIN, GOUT);
  px(ctx, cx - 6, hy, 12, 2, [150, 200, 176]);
  px(ctx, cx - 2, hy + 5, 1, 2, GOUT); px(ctx, cx + 3, hy + 5, 1, 2, GOUT);
  px(ctx, cx - 2, hy + 9, 6, 1, GOUT);
  ctx.globalAlpha = 1; ctx.restore();
}

// El Curro — old, corrupt policeman; a spirit. Police cap + paunch + moustache.
export function drawCurro(ctx: CanvasRenderingContext2D, fx: number, fy: number, facing: 'left' | 'right' = 'right', t = 0) {
  const cx = Math.round(fx); const fyR = ghost(fy, t);
  ctx.save(); ctx.globalAlpha = 0.82;
  if (facing === 'left') { ctx.translate(cx * 2, 0); ctx.scale(-1, 1); }
  const UNI: RGB = [96, 150, 150], UNI_D: RGB = [66, 116, 118], GSKIN: RGB = [176, 226, 196], GOUT: RGB = [40, 80, 64];
  blk(ctx, cx - 5, fyR - 16, 5, 14, UNI_D, GOUT); blk(ctx, cx + 1, fyR - 16, 5, 14, UNI_D, GOUT);
  blk(ctx, cx - 6, fyR - 4, 6, 4, [40, 70, 60], GOUT); blk(ctx, cx + 1, fyR - 4, 6, 4, [40, 70, 60], GOUT);
  const ty = fyR - 36;
  blk(ctx, cx - 8, ty, 16, 22, UNI, GOUT);
  px(ctx, cx - 6, ty + 2, 3, 18, UNI_D);
  px(ctx, cx - 1, ty + 2, 2, 20, UNI_D);
  px(ctx, cx - 8, ty + 9, 16, 2, [60, 100, 100]);
  blk(ctx, cx - 11, ty + 2, 4, 13, UNI, GOUT); blk(ctx, cx + 7, ty + 2, 4, 13, UNI, GOUT);
  px(ctx, cx - 11, ty + 13, 4, 2, GSKIN); px(ctx, cx + 7, ty + 13, 4, 2, GSKIN);
  const hy = fyR - 47;
  blk(ctx, cx - 5, hy, 11, 11, GSKIN, GOUT); px(ctx, cx - 4, hy + 1, 3, 9, [150, 200, 176]);
  px(ctx, cx - 4, hy + 7, 10, 2, [150, 200, 176]); // white moustache
  px(ctx, cx + 1, hy + 4, 1, 2, GOUT);
  px(ctx, cx - 6, hy - 2, 13, 3, UNI_D); px(ctx, cx + 4, hy, 4, 2, UNI_D);
  px(ctx, cx - 2, hy - 2, 4, 2, [220, 210, 120]); // cap badge
  ctx.globalAlpha = 1; ctx.restore();
}

// ================= EPISODE 3 cast =================

// El Carmona — figure-collector handyman at the Godot door; cap, flannel, a toy in hand.
export function drawCarmona(ctx: CanvasRenderingContext2D, fx: number, fy: number, facing: 'left' | 'right' = 'right', t = 0) {
  const cx = Math.round(fx), fyR = Math.round(fy);
  const bob = Math.sin(t * 1.6) > 0.94 ? 1 : 0;
  ctx.save(); if (facing === 'left') { ctx.translate(cx * 2, 0); ctx.scale(-1, 1); }
  const SHIRT: RGB = [150, 80, 70], JEANS: RGB = [66, 70, 92], CAP: RGB = [58, 70, 110];
  blk(ctx, cx - 6, fyR - 18, 5, 16, JEANS); blk(ctx, cx + 1, fyR - 18, 5, 16, JEANS);
  blk(ctx, cx - 7, fyR - 4, 7, 4, [60, 50, 42]); blk(ctx, cx + 0, fyR - 4, 7, 4, [60, 50, 42]);
  const ty = fyR - 36 + bob;
  blk(ctx, cx - 7, ty, 14, 20, SHIRT);
  px(ctx, cx - 6, ty + 3, 12, 1, [110, 56, 50]); px(ctx, cx - 6, ty + 9, 12, 1, [110, 56, 50]); // flannel checks
  px(ctx, cx - 1, ty + 1, 1, 18, [110, 56, 50]);
  blk(ctx, cx - 10, ty + 2, 4, 12, SHIRT); blk(ctx, cx + 6, ty + 2, 4, 12, SHIRT);
  px(ctx, cx - 10, ty + 12, 4, 3, P.skin); px(ctx, cx + 6, ty + 12, 4, 3, P.skin);
  px(ctx, cx + 6, ty + 13, 4, 3, [178, 184, 198]); // a little robot figure in hand
  const hy = fyR - 47 + bob;
  blk(ctx, cx - 5, hy, 10, 11, P.skin); px(ctx, cx - 4, hy + 1, 3, 9, P.skinShadow);
  px(ctx, cx + 1, hy + 4, 1, 2, P.black);
  px(ctx, cx - 2, hy + 8, 6, 1, [150, 120, 96]);
  px(ctx, cx - 6, hy - 2, 13, 3, CAP); px(ctx, cx + 5, hy, 4, 2, CAP); // cap + brim
  ctx.restore();
}

// El juguetero — the old toy-shop owner: cardigan, white hair, glasses.
export function drawJuguetero(ctx: CanvasRenderingContext2D, fx: number, fy: number, facing: 'left' | 'right' = 'left', t = 0) {
  const cx = Math.round(fx), fyR = Math.round(fy);
  const bob = Math.sin(t * 1.4) > 0.96 ? 1 : 0;
  ctx.save(); if (facing === 'left') { ctx.translate(cx * 2, 0); ctx.scale(-1, 1); }
  const CARD: RGB = [110, 96, 120], TROUS: RGB = [80, 76, 70];
  blk(ctx, cx - 5, fyR - 16, 5, 14, TROUS); blk(ctx, cx + 1, fyR - 16, 5, 14, TROUS);
  blk(ctx, cx - 6, fyR - 4, 6, 4, [50, 44, 40]); blk(ctx, cx + 1, fyR - 4, 6, 4, [50, 44, 40]);
  const ty = fyR - 33 + bob;
  blk(ctx, cx - 6, ty, 13, 18, CARD);
  px(ctx, cx - 1, ty + 1, 1, 16, [90, 78, 98]);
  blk(ctx, cx - 9, ty + 2, 4, 12, CARD); blk(ctx, cx + 6, ty + 2, 4, 12, CARD);
  px(ctx, cx - 9, ty + 12, 4, 2, P.skin); px(ctx, cx + 6, ty + 12, 4, 2, P.skin);
  const hy = fyR - 44 + bob;
  blk(ctx, cx - 5, hy, 10, 11, P.skin); px(ctx, cx - 4, hy + 1, 3, 9, P.skinShadow);
  px(ctx, cx - 5, hy - 1, 11, 2, [222, 218, 212]); // white hair
  px(ctx, cx - 5, hy + 1, 2, 3, [222, 218, 212]); px(ctx, cx + 5, hy + 1, 2, 3, [222, 218, 212]);
  px(ctx, cx, hy + 3, 2, 2, [40, 40, 46]); px(ctx, cx + 3, hy + 3, 2, 2, [40, 40, 46]); px(ctx, cx + 2, hy + 4, 1, 1, [40, 40, 46]); // glasses
  px(ctx, cx - 2, hy + 8, 6, 1, P.skinShadow);
  ctx.restore();
}

// El Petito — the foreman: hard hat, hi-vis vest, moustache, shortish.
export function drawPetito(ctx: CanvasRenderingContext2D, fx: number, fy: number, facing: 'left' | 'right' = 'left', t = 0) {
  const cx = Math.round(fx), fyR = Math.round(fy);
  const bob = Math.sin(t * 1.8) > 0.9 ? 1 : 0;
  ctx.save(); if (facing === 'left') { ctx.translate(cx * 2, 0); ctx.scale(-1, 1); }
  const VEST: RGB = [228, 142, 40], SHIRT: RGB = [70, 80, 110], HAT: RGB = [230, 198, 60];
  blk(ctx, cx - 5, fyR - 14, 5, 12, [60, 62, 76]); blk(ctx, cx + 1, fyR - 14, 5, 12, [60, 62, 76]);
  blk(ctx, cx - 6, fyR - 4, 6, 4, [40, 36, 32]); blk(ctx, cx + 1, fyR - 4, 6, 4, [40, 36, 32]);
  const ty = fyR - 30 + bob;
  blk(ctx, cx - 7, ty, 14, 17, SHIRT);
  px(ctx, cx - 6, ty + 1, 12, 15, VEST);
  px(ctx, cx - 6, ty + 5, 12, 1, [245, 245, 245]); px(ctx, cx - 6, ty + 10, 12, 1, [245, 245, 245]); // reflective stripes
  px(ctx, cx - 1, ty + 1, 2, 15, SHIRT);  // open front
  blk(ctx, cx - 10, ty + 2, 4, 11, SHIRT); blk(ctx, cx + 6, ty + 2, 4, 11, SHIRT);
  px(ctx, cx - 10, ty + 11, 4, 2, P.skin); px(ctx, cx + 6, ty + 11, 4, 2, P.skin);
  const hy = fyR - 40 + bob;
  blk(ctx, cx - 5, hy, 10, 10, P.skin); px(ctx, cx - 4, hy + 1, 3, 8, P.skinShadow);
  px(ctx, cx + 1, hy + 4, 1, 2, P.black);
  px(ctx, cx - 3, hy + 7, 7, 1, [120, 90, 64]); // moustache
  px(ctx, cx - 6, hy - 1, 13, 2, HAT); px(ctx, cx - 4, hy - 3, 9, 2, HAT); px(ctx, cx + 5, hy, 3, 1, HAT); // hard hat
  ctx.restore();
}

// ================= EPISODE 4 cast =================

// El Kilian — has been drinking inside the Godot all night; tipsy sway, beer in hand.
export function drawKilian(ctx: CanvasRenderingContext2D, fx: number, fy: number, facing: 'left' | 'right' = 'right', t = 0) {
  const cx = Math.round(fx), fyR = Math.round(fy);
  const sway = Math.round(Math.sin(t * 1.3));
  ctx.save(); if (facing === 'left') { ctx.translate(cx * 2, 0); ctx.scale(-1, 1); }
  const TEE: RGB = [60, 64, 78], JEANS: RGB = [70, 72, 90];
  blk(ctx, cx - 6 + sway, fyR - 17, 5, 15, JEANS); blk(ctx, cx + 1 + sway, fyR - 17, 5, 15, JEANS);
  blk(ctx, cx - 7 + sway, fyR - 4, 7, 4, [40, 36, 40]); blk(ctx, cx + 0 + sway, fyR - 4, 7, 4, [40, 36, 40]);
  const ty = fyR - 35 + sway;
  blk(ctx, cx - 7, ty, 14, 20, TEE);
  px(ctx, cx - 2, ty + 4, 4, 7, [150, 60, 60]);  // faded band print
  blk(ctx, cx - 10, ty + 2, 4, 12, TEE); blk(ctx, cx + 6, ty + 2, 4, 12, TEE);
  px(ctx, cx - 10, ty + 12, 4, 3, P.skin); px(ctx, cx + 6, ty + 12, 4, 3, P.skin);
  px(ctx, cx + 8, ty + 8, 3, 8, [54, 38, 20]);   // beer bottle
  const hy = fyR - 47 + sway;
  blk(ctx, cx - 5, hy, 10, 11, P.skin); px(ctx, cx - 4, hy + 1, 3, 9, P.skinShadow);
  px(ctx, cx - 5, hy - 1, 11, 2, [70, 54, 40]);  // short hair
  px(ctx, cx + 1, hy + 4, 1, 2, P.black);
  px(ctx, cx - 2, hy + 8, 6, 1, [150, 120, 96]); // stubble grin
  ctx.restore();
}

// El Sopas — bald punky spirit; studded vest, ear stud, ghost-green.
export function drawSopas(ctx: CanvasRenderingContext2D, fx: number, fy: number, facing: 'left' | 'right' = 'left', t = 0) {
  const cx = Math.round(fx); const fyR = ghost(fy, t);
  ctx.save(); ctx.globalAlpha = 0.82; if (facing === 'left') { ctx.translate(cx * 2, 0); ctx.scale(-1, 1); }
  const VEST: RGB = [92, 150, 126], GSKIN: RGB = [176, 226, 196], GOUT: RGB = [40, 80, 64];
  blk(ctx, cx - 5, fyR - 15, 4, 13, [80, 140, 116], GOUT); blk(ctx, cx + 1, fyR - 15, 4, 13, [80, 140, 116], GOUT);
  blk(ctx, cx - 6, fyR - 4, 6, 4, [40, 80, 64], GOUT); blk(ctx, cx + 1, fyR - 4, 6, 4, [40, 80, 64], GOUT);
  const ty = fyR - 30;
  blk(ctx, cx - 6, ty, 13, 16, VEST, GOUT);
  for (const sx of [cx - 3, cx + 1, cx + 4]) px(ctx, sx, ty + 4, 1, 1, [206, 232, 218]); // studs
  blk(ctx, cx - 9, ty + 2, 3, 11, VEST, GOUT); blk(ctx, cx + 6, ty + 2, 3, 11, VEST, GOUT);
  px(ctx, cx - 9, ty + 11, 3, 2, GSKIN); px(ctx, cx + 6, ty + 11, 3, 2, GSKIN);
  const hy = fyR - 39;
  blk(ctx, cx - 4, hy, 9, 10, GSKIN, GOUT);
  px(ctx, cx - 4, hy, 9, 2, [150, 200, 176]);    // bald scalp shine
  px(ctx, cx + 1, hy + 4, 1, 2, GOUT);
  px(ctx, cx - 2, hy + 7, 4, 1, GOUT);
  px(ctx, cx - 5, hy + 4, 1, 1, [206, 232, 218]); // ear stud
  ctx.globalAlpha = 1; ctx.restore();
}

// El antiguo dueño — old bar-owner spirit: waistcoat, bowtie, apron, grey moustache.
export function drawDueno(ctx: CanvasRenderingContext2D, fx: number, fy: number, facing: 'left' | 'right' = 'left', t = 0) {
  const cx = Math.round(fx); const fyR = ghost(fy, t);
  ctx.save(); ctx.globalAlpha = 0.82; if (facing === 'left') { ctx.translate(cx * 2, 0); ctx.scale(-1, 1); }
  const VEST: RGB = [86, 150, 128], APRON: RGB = [150, 210, 186], GSKIN: RGB = [176, 226, 196], GOUT: RGB = [40, 80, 64];
  blk(ctx, cx - 5, fyR - 16, 5, 14, [70, 120, 100], GOUT); blk(ctx, cx + 1, fyR - 16, 5, 14, [70, 120, 100], GOUT);
  blk(ctx, cx - 6, fyR - 4, 6, 4, [40, 80, 64], GOUT); blk(ctx, cx + 1, fyR - 4, 6, 4, [40, 80, 64], GOUT);
  const ty = fyR - 36;
  blk(ctx, cx - 8, ty, 16, 22, VEST, GOUT);       // stout waistcoat torso
  px(ctx, cx - 5, ty + 8, 10, 12, APRON);         // apron
  px(ctx, cx - 1, ty + 1, 2, 7, [60, 110, 92]);   // waistcoat seam
  px(ctx, cx - 2, ty, 4, 2, GOUT);                // bowtie
  blk(ctx, cx - 11, ty + 2, 4, 13, VEST, GOUT); blk(ctx, cx + 7, ty + 2, 4, 13, VEST, GOUT);
  px(ctx, cx - 11, ty + 13, 4, 2, GSKIN); px(ctx, cx + 7, ty + 13, 4, 2, GSKIN);
  const hy = fyR - 47;
  blk(ctx, cx - 5, hy, 11, 11, GSKIN, GOUT);
  px(ctx, cx - 5, hy, 11, 2, [150, 200, 176]);    // balding shine
  px(ctx, cx - 5, hy + 1, 2, 4, [150, 200, 176]); px(ctx, cx + 5, hy + 1, 2, 4, [150, 200, 176]); // grey sides
  px(ctx, cx - 4, hy + 7, 10, 2, [150, 200, 176]); // moustache
  px(ctx, cx + 1, hy + 4, 1, 2, GOUT);
  ctx.globalAlpha = 1; ctx.restore();
}

// A generic happy party spirit (billiards crowd) — sways/dances, arms up.
export function drawEspiritu(ctx: CanvasRenderingContext2D, fx: number, fy: number, _facing: 'left' | 'right' = 'right', t = 0) {
  const cx = Math.round(fx) + Math.round(Math.sin(t * 3 + fx) * 2); // dancing sway
  const fyR = ghost(fy, t);
  ctx.save(); ctx.globalAlpha = 0.8;
  const G: RGB = [150, 224, 190], GD: RGB = [112, 190, 160], GOUT: RGB = [40, 80, 64];
  blk(ctx, cx - 5, fyR - 16, 11, 16, G, GOUT);
  px(ctx, cx - 4, fyR - 14, 3, 12, GD);
  px(ctx, cx - 5, fyR - 1, 3, 1, GOUT); px(ctx, cx, fyR - 2, 3, 1, GOUT); px(ctx, cx + 4, fyR - 1, 2, 1, GOUT); // wavy hem
  blk(ctx, cx - 8, fyR - 23, 3, 9, G, GOUT); blk(ctx, cx + 5, fyR - 25, 3, 9, G, GOUT); // arms up
  blk(ctx, cx - 4, fyR - 26, 9, 9, G, GOUT);
  px(ctx, cx - 1, fyR - 22, 1, 2, GOUT); px(ctx, cx + 2, fyR - 22, 1, 2, GOUT);
  px(ctx, cx - 1, fyR - 19, 3, 1, GOUT);
  ctx.globalAlpha = 1; ctx.restore();
}
