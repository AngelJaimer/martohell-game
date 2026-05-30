import { P, css, type RGB } from '../art/palette';
import { drawText } from '../art/font';
import type { Room, Hotspot, Exit } from '../engine/types';

// EPISODE 4 finale — the back door: el Marcos's vomit tore a portal to another
// dimension and spirits pour through. Mop it with the cubo to close it and win.

function r(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, c: RGB) {
  ctx.fillStyle = css(c);
  ctx.fillRect(x | 0, y | 0, w | 0, h | 0);
}

export function buildPortalScene(): HTMLCanvasElement {
  const cv = document.createElement('canvas');
  cv.width = 320; cv.height = 144;
  const ctx = cv.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  r(ctx, 0, 0, 320, 144, [18, 14, 26]); // dark tunnel base

  // rough brick tunnel walls
  r(ctx, 0, 12, 320, 96, [34, 28, 42]);
  ctx.fillStyle = css([26, 22, 34]);
  for (let y = 18; y < 104; y += 8) ctx.fillRect(0, y, 320, 1);
  for (let y = 18; y < 104; y += 8) { const off = (((y - 18) / 8) % 2) * 12; for (let x = off; x < 320; x += 24) ctx.fillRect(x, y, 1, 8); }

  // the portal: concentric rings in the back wall
  for (let i = 5; i >= 0; i--) {
    const col: RGB = [60 + i * 18, 30 + i * 12, 90 + i * 22];
    ctx.fillStyle = css(col); ctx.beginPath(); ctx.ellipse(160, 64, 38 - i * 5, 30 - i * 4, 0, 0, Math.PI * 2); ctx.fill();
  }
  ctx.fillStyle = css([16, 10, 22]); ctx.beginPath(); ctx.ellipse(160, 64, 9, 7, 0, 0, Math.PI * 2); ctx.fill();

  // floor
  r(ctx, 0, 108, 320, 36, [30, 26, 34]);
  r(ctx, 0, 108, 320, 1, [50, 44, 56]);

  drawText(ctx, 'El Godot', 36, 7, P.inkLight, 1, P.black, 1);
  return cv;
}

export function portalOverlays(ctx: CanvasRenderingContext2D, t: number, state?: any) {
  if (state && state.flags && state.flags.portal_cerrado) return;
  // swirling portal glow
  const f = 0.6 + 0.4 * Math.sin(t * 2.5);
  const g = ctx.createRadialGradient(160, 64, 4, 160, 64, 46);
  g.addColorStop(0, 'rgba(170,120,230,' + (0.4 * f).toFixed(3) + ')');
  g.addColorStop(1, 'rgba(170,120,230,0)');
  ctx.fillStyle = g; ctx.fillRect(110, 18, 100, 92);
  // a couple of spirit wisps drifting out
  ctx.fillStyle = 'rgba(170,235,205,0.5)';
  for (let i = 0; i < 3; i++) {
    const p = (t * 24 + i * 90) % 180;
    const wx = 160 + Math.sin((p + i) * 0.05) * (10 + p * 0.3);
    ctx.fillRect(Math.round(wx), Math.round(64 + p * 0.3), 2, 3);
  }
}

// the bubbling vomit-portal puddle on the floor (until mopped)
export function drawVomito(ctx: CanvasRenderingContext2D, t: number) {
  ctx.fillStyle = css([90, 150, 70]);
  ctx.beginPath(); ctx.ellipse(164, 124, 22, 7, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = css([130, 190, 90]);
  ctx.beginPath(); ctx.ellipse(164, 123, 16, 4, 0, 0, Math.PI * 2); ctx.fill();
  // bubbles
  ctx.fillStyle = css([180, 220, 130]);
  for (let i = 0; i < 4; i++) { const bx = 150 + i * 9; const by = 123 - Math.round(Math.abs(Math.sin(t * 3 + i)) * 3); ctx.fillRect(bx, by, 2, 2); }
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 'vomito', name: 'la pota dimensional', x: 140, y: 116, w: 50, h: 20, walkTo: { x: 164, y: 138 },
    look: 'El charco que lo empezó todo: la pota del Marcos, burbujeando y escupiendo espíritus. Repugnante y cósmico a partes iguales.',
    needs: ['cubo'],
    needsBlocked: 'Hay que fregar esto para cerrar el portal, pero a mano ni de broma. Necesito un cubo y una fregona.',
    responses: { Usar: 'Meto la fregona a fondo. El charco chisporrotea, se encoge y, con un último eructo, el portal se traga a sí mismo.', Abrir: 'Meto la fregona a fondo. El charco chisporrotea, se encoge y, con un último eructo, el portal se traga a sí mismo.' },
    flag: 'portal_cerrado',
    card: [
      'Friegas la pota a conciencia.',
      '',
      'El portal se cierra con un eructo cósmico',
      'y los espíritus, por fin, descansan en paz.',
    ],
    goto: 'final',
  },
  { id: 'portal', name: 'el portal', x: 120, y: 34, w: 80, h: 64, walkTo: { x: 160, y: 138 },
    look: 'Un portal a otra dimensión, abierto en canal por una pota épica. Por él se cuela medio más allá, en plan after.' },
];

const EXITS: Exit[] = [
  { id: 'toBillar', name: 'los billares', x: 0, y: 104, w: 16, h: 40, walkTo: { x: 22, y: 138 }, to: 'billar', entry: { x: 288, y: 135 }, arrow: 'left' },
];

export const PORTAL: Room = {
  id: 'portal',
  build: buildPortalScene,
  overlays: portalOverlays,
  dynamic: (ctx, state, t) => { if (!state.flags.portal_cerrado) drawVomito(ctx, t); },
  hotspots: HOTSPOTS,
  npcs: [],
  exits: EXITS,
  walk: { minX: 16, maxX: 300, minY: 120, maxY: 140 },
  start: { x: 36, y: 135 },
};
