import { P, css, type RGB } from '../art/palette';
import { Pixels, rampPick, ditherPick } from '../art/dither';

const HOR = 150;
const SUN_X = 152, SUN_Y = 132;

// Title background: the Pont del Diable at dusk, with a small devil on the arch
// (it IS the Devil's Bridge — and "Martohell"). The logo text is drawn over this
// by main.ts, so the upper third is kept open.
export function buildTitleScene(): HTMLCanvasElement {
  const cv = document.createElement('canvas');
  cv.width = 320; cv.height = 200;
  const ctx = cv.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;

  const img = ctx.createImageData(320, HOR);
  const px = new Pixels(img, 320, HOR);
  const sky: RGB[] = [[30, 22, 58], [74, 40, 80], [150, 66, 78], [222, 120, 78], [248, 192, 120]];
  const glow: RGB = [255, 220, 146], core: RGB = [255, 244, 210];
  for (let y = 0; y < HOR; y++) {
    for (let x = 0; x < 320; x++) {
      let c = rampPick(sky, y / HOR, x, y);
      const dx = x - SUN_X, dy = (y - SUN_Y) * 1.5;
      const d = Math.sqrt(dx * dx + dy * dy);
      const g1 = 1 - d / 92; if (g1 > 0) c = ditherPick(c, glow, g1, x, y);
      const g2 = 1 - d / 30; if (g2 > 0) c = ditherPick(c, core, g2, x, y);
      px.set(x, y, c);
    }
  }
  ctx.putImageData(img, 0, 0);

  // distant hills
  const hill: RGB = [46, 34, 56];
  ctx.fillStyle = css(hill);
  ctx.beginPath(); ctx.moveTo(0, HOR); ctx.lineTo(0, 116); ctx.lineTo(80, 104); ctx.lineTo(180, 112); ctx.lineTo(320, 100); ctx.lineTo(320, HOR); ctx.closePath(); ctx.fill();

  // --- the bridge in silhouette (arches reveal the glowing sky behind) ---
  const dk: RGB = [38, 26, 36], dkLit: RGB = [70, 44, 50];
  ctx.fillStyle = css(dk);
  ctx.beginPath();
  ctx.moveTo(28, HOR); ctx.lineTo(28, 96); ctx.lineTo(120, 58); ctx.lineTo(170, 52);
  ctx.lineTo(300, 92); ctx.lineTo(300, HOR); ctx.closePath(); ctx.fill();
  // carve the arches back to the glowing sky (clip + redraw a clean sky copy)
  const clean = document.createElement('canvas'); clean.width = 320; clean.height = HOR;
  clean.getContext('2d')!.putImageData(img, 0, 0);
  const carve = (path: () => void) => { ctx.save(); ctx.beginPath(); path(); ctx.closePath(); ctx.clip(); ctx.drawImage(clean, 0, 0); ctx.restore(); };
  carve(() => { ctx.moveTo(146, HOR); ctx.lineTo(146, 92); ctx.quadraticCurveTo(148, 70, 168, 60); ctx.quadraticCurveTo(188, 70, 190, 92); ctx.lineTo(190, HOR); }); // pointed arch
  carve(() => { ctx.moveTo(66, HOR); ctx.lineTo(66, 104); ctx.arc(88, 104, 22, Math.PI, 0); ctx.lineTo(110, HOR); }); // round arch

  // bridge lit top edge
  ctx.strokeStyle = css(dkLit); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(28, 96); ctx.lineTo(120, 58); ctx.lineTo(170, 52); ctx.lineTo(300, 92); ctx.stroke();

  // gatehouse at the apex
  ctx.fillStyle = css(dk); ctx.fillRect(156, 34, 22, 22);
  ctx.fillStyle = css(dkLit); ctx.fillRect(156, 34, 22, 2);

  // a little devil perched on top
  ctx.fillStyle = css([120, 30, 28]);
  ctx.fillRect(163, 24, 6, 10);                 // body
  ctx.fillRect(161, 30, 2, 5); ctx.fillRect(169, 30, 2, 5); // arms
  ctx.fillRect(160, 22, 2, 2); ctx.fillRect(170, 22, 2, 2); // horns
  ctx.fillStyle = css([90, 22, 20]); ctx.fillRect(171, 28, 4, 2); // tail
  ctx.fillStyle = css([255, 210, 80]); ctx.fillRect(164, 27, 1, 1); ctx.fillRect(167, 27, 1, 1); // glowing eyes

  // river with the sun's reflection
  const rimg = ctx.createImageData(320, 200 - HOR);
  const rpx = new Pixels(rimg, 320, 200 - HOR);
  const sea: RGB[] = [[150, 96, 78], [96, 70, 84], [54, 48, 70], [34, 34, 54]];
  for (let y = 0; y < 200 - HOR; y++) for (let x = 0; x < 320; x++) {
    let c = rampPick(sea, y / (200 - HOR), x, y);
    const adx = Math.abs(x - SUN_X), w = 8 + y * 1.5;
    if (adx < w) { const sh = Math.sin(y * 0.7 + x * 0.3) * 0.5 + 0.5; c = ditherPick(c, glow, sh * (1 - adx / w) * 0.7, x, y); }
    rpx.set(x, y, c);
  }
  ctx.putImageData(rimg, 0, HOR);

  // dark foreground bank
  ctx.fillStyle = css([22, 18, 28]); ctx.fillRect(0, 184, 320, 16);
  ctx.fillStyle = css([34, 28, 40]); ctx.fillRect(0, 182, 320, 3);

  return cv;
}
