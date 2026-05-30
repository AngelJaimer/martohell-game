import { P, css, type RGB } from '../art/palette';
import { Pixels, rampPick, ditherPick } from '../art/dither';
import { drawCongui } from '../art/actor';
import { CONGUI_FINAL_DIALOGUE } from '../content/dialogues';
import type { Room, NPC, Hotspot, Exit } from '../engine/types';

// THE ENDING — the Pont del Diable at sunset. El Petit Pulmó (el Congui) floats
// on a cloud in the sky and says goodbye. (onEnter makes him call out on arrival.)

const HOR = 100;
const SUN_X = 150, SUN_Y = 94;

function r(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, c: RGB) {
  ctx.fillStyle = css(c);
  ctx.fillRect(x | 0, y | 0, w | 0, h | 0);
}

export function buildFinalScene(): HTMLCanvasElement {
  const cv = document.createElement('canvas');
  cv.width = 320; cv.height = 144;
  const ctx = cv.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  r(ctx, 0, 0, 320, 144, [40, 30, 50]);

  // sunset sky with a low sun glow
  const img = ctx.createImageData(320, HOR);
  const px = new Pixels(img, 320, HOR);
  const sky: RGB[] = [[40, 30, 72], [92, 52, 92], [168, 78, 84], [232, 138, 84], [252, 204, 132]];
  const glow: RGB = [255, 224, 150], core: RGB = [255, 246, 214];
  for (let y = 0; y < HOR; y++) for (let x = 0; x < 320; x++) {
    let c = rampPick(sky, y / HOR, x, y);
    const dx = x - SUN_X, dy = (y - SUN_Y) * 1.5; const d = Math.sqrt(dx * dx + dy * dy);
    const g1 = 1 - d / 80; if (g1 > 0) c = ditherPick(c, glow, g1, x, y);
    const g2 = 1 - d / 26; if (g2 > 0) c = ditherPick(c, core, g2, x, y);
    px.set(x, y, c);
  }
  ctx.putImageData(img, 0, 0);

  // hills
  ctx.fillStyle = css([54, 40, 64]);
  ctx.beginPath(); ctx.moveTo(0, HOR); ctx.lineTo(0, 84); ctx.lineTo(70, 76); ctx.lineTo(170, 82); ctx.lineTo(320, 72); ctx.lineTo(320, HOR); ctx.closePath(); ctx.fill();

  // bridge silhouette (humped) with three dark arches
  const dk: RGB = [44, 32, 40], dkLit: RGB = [78, 52, 56], hole: RGB = [22, 16, 24];
  ctx.fillStyle = css(dk);
  ctx.beginPath(); ctx.moveTo(20, 100); ctx.lineTo(20, 74); ctx.lineTo(120, 44); ctx.lineTo(168, 38); ctx.lineTo(300, 70); ctx.lineTo(300, 100); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = css(dkLit); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(20, 74); ctx.lineTo(120, 44); ctx.lineTo(168, 38); ctx.lineTo(300, 70); ctx.stroke();
  const carve = (p: () => void) => { ctx.save(); ctx.fillStyle = css(hole); ctx.beginPath(); p(); ctx.closePath(); ctx.fill(); ctx.restore(); };
  carve(() => { ctx.moveTo(130, 100); ctx.lineTo(130, 68); ctx.quadraticCurveTo(132, 52, 152, 44); ctx.quadraticCurveTo(172, 52, 174, 68); ctx.lineTo(174, 100); }); // pointed
  carve(() => { ctx.moveTo(58, 100); ctx.lineTo(58, 80); ctx.arc(76, 80, 18, Math.PI, 0); ctx.lineTo(94, 100); });   // round left
  carve(() => { ctx.moveTo(226, 100); ctx.lineTo(226, 82); ctx.arc(248, 82, 22, Math.PI, 0); ctx.lineTo(270, 100); }); // round right
  r(ctx, 144, 24, 18, 16, dk); r(ctx, 144, 24, 18, 2, dkLit); // gatehouse

  // river with the sun's reflection
  const rimg = ctx.createImageData(320, 118 - HOR);
  const rpx = new Pixels(rimg, 320, 118 - HOR);
  const sea: RGB[] = [[170, 96, 84], [110, 70, 92], [60, 50, 76]];
  for (let y = 0; y < 118 - HOR; y++) for (let x = 0; x < 320; x++) {
    let c = rampPick(sea, y / (118 - HOR), x, y);
    const adx = Math.abs(x - SUN_X), w = 6 + y * 1.6;
    if (adx < w) { const sh = Math.sin(y * 0.7 + x * 0.3) * 0.5 + 0.5; c = ditherPick(c, glow, sh * (1 - adx / w) * 0.7, x, y); }
    rpx.set(x, y, c);
  }
  ctx.putImageData(rimg, 0, HOR);

  // foreground bank where you stand + a low railing (like the opening)
  r(ctx, 0, 116, 320, 28, [70, 54, 50]);
  r(ctx, 0, 116, 320, 1, [110, 86, 72]);
  r(ctx, 0, 118, 320, 2, [150, 120, 110]);
  for (let x = 8; x < 320; x += 26) r(ctx, x, 118, 2, 8, [120, 96, 86]);

  // a soft cloud for the Petit Pulmó to perch on (upper right)
  ctx.fillStyle = css([232, 214, 220]);
  for (const [cx2, cy2, rr] of [[214, 70, 10], [232, 68, 13], [250, 71, 10], [240, 74, 9]] as [number, number, number][]) { ctx.beginPath(); ctx.arc(cx2, cy2, rr, 0, Math.PI * 2); ctx.fill(); }
  ctx.fillStyle = css([206, 184, 196]); ctx.fillRect(208, 74, 50, 3);

  return cv;
}

export function finalOverlays(ctx: CanvasRenderingContext2D, t: number) {
  // a heavenly glow around the cloud / Petit Pulmó
  const f = 0.7 + 0.3 * Math.sin(t * 1.4);
  const g = ctx.createRadialGradient(232, 52, 4, 232, 52, 40);
  g.addColorStop(0, 'rgba(255,240,180,' + (0.28 * f).toFixed(3) + ')');
  g.addColorStop(1, 'rgba(255,240,180,0)');
  ctx.fillStyle = g; ctx.fillRect(192, 14, 80, 70);
}

const HOTSPOTS: Hotspot[] = [
  { id: 'puente', name: 'el Pont del Diable', x: 30, y: 40, w: 270, h: 60, walkTo: { x: 150, y: 138 },
    look: 'El Pont del Diable al atardecer. Donde empezó todo esta mañana... y donde, por lo visto, no acaba.' },
  { id: 'cielo', name: 'el cielo', x: 0, y: 0, w: 320, h: 40, walkTo: { x: 200, y: 138 },
    look: 'Un atardecer de escándalo sobre Martorell. Y en una nube, una figurilla flacucha que me saluda.' },
];

const NPCS: NPC[] = [
  {
    id: 'petitpulmo', name: 'el Petit Pulmó', x: 214, y: 16, w: 40, h: 52,
    feet: { x: 232, y: 64 }, walkTo: { x: 198, y: 138 }, facing: 'left', color: [150, 230, 200],
    look: 'El Petit Pulmó, en su nube, recortado contra el sol. Nunca lo había visto tan en paz.',
    draw: drawCongui, dialogue: CONGUI_FINAL_DIALOGUE,
  },
];

const EXITS: Exit[] = []; // the end

export const FINAL: Room = {
  id: 'final',
  build: buildFinalScene,
  overlays: finalOverlays,
  hotspots: HOTSPOTS,
  npcs: NPCS,
  exits: EXITS,
  walk: { minX: 16, maxX: 300, minY: 122, maxY: 140 },
  start: { x: 120, y: 135 },
  onEnter: (state: any) => {
    state.npcSpeech = { lines: ['¡Eh, noi! ¡Mira hacia arriba!'], until: state.now + 9000, color: [150, 230, 200], x: 232, headY: 60 };
  },
};
