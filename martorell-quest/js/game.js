/* =====================================================================
 *  MARTORELL QUEST  ·  La Leyenda del Puente del Diablo
 *  game.js  —  a small, dependency-free top-down action-adventure engine.
 *
 *  Zelda-style: walk the map, swing your sword (J/Z/Space), talk (E),
 *  gather the 5 Devil's Stones and rebuild the Pont del Diable.
 *
 *  Trilingual (ES default · CA · EN) — chosen from the start menu or with L.
 *  Everything is code-drawn on a <canvas>. No assets, no build step.
 * ===================================================================== */

(() => {
  'use strict';

  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const VIEW_W = canvas.width;
  const VIEW_H = canvas.height;

  const map = buildMap();

  /* ---------------- Game state ---------------- */
  const state = {
    lang: 'es',           // default Spanish
    scene: 'menu',        // 'menu' | 'play'
    stones: 0,
    flags: {},            // landmark id -> stone/heal already given
    visited: {},
    won: false,
  };

  // i18n helpers
  const ui = () => I18N[state.lang];
  const t = (field) => {
    if (field == null) return '';
    if (typeof field === 'string') return field;
    return field[state.lang] != null ? field[state.lang] : field.es;
  };
  function setLang(l) { state.lang = l; refreshChrome(); }
  function cycleLang() {
    const i = LANG_ORDER.indexOf(state.lang);
    setLang(LANG_ORDER[(i + 1) % LANG_ORDER.length]);
  }
  function refreshChrome() {
    const h = document.getElementById('help'); if (h) h.textContent = ui().controls;
    const g = document.getElementById('tag');  if (g) g.textContent  = ui().tagline;
  }
  function currentObjective() {
    if (state.won) return ui().objectiveWon;
    if (state.stones >= STONES_NEEDED) return ui().objectiveGo;
    return ui().objective;
  }

  /* ---------------- World helpers ---------------- */
  const tileAt = (px, py) => {
    const tx = Math.floor(px / TILE), ty = Math.floor(py / TILE);
    if (tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H) return 'M';
    return map[ty][tx];
  };
  const isSolid = (px, py) => { const t2 = tileAt(px, py); return TILES[t2] ? TILES[t2].solid : true; };

  /* ---------------- Player ---------------- */
  const player = {
    x: 24 * TILE, y: 14 * TILE, w: 20, h: 24, speed: 2.4, dir: 'down',
    hp: 6, maxhp: 6, attack: 0, cooldown: 0, hurt: 0, anim: 0,
  };

  /* ---------------- Enemies: the imps (diablillos) ---------------- */
  const enemies = [];
  (function spawn() {
    [[45,14],[43,12],[49,8],[44,18],[46,22],[42,9],[50,13]].forEach(([tx, ty], i) => {
      enemies.push({ x: tx * TILE, y: ty * TILE, w: 22, h: 22, hp: 2,
        dir: Math.random() * Math.PI * 2, speed: 0.9 + Math.random() * 0.4,
        wob: i, dead: false, hurt: 0 });
    });
  })();

  /* ---------------- Input ---------------- */
  const keys = {}, pressed = {};
  window.addEventListener('keydown', e => {
    if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key)) e.preventDefault();
    if (!keys[e.key]) pressed[e.key] = true;
    keys[e.key] = true;
  });
  window.addEventListener('keyup', e => { keys[e.key] = false; });

  function bindTouch(id, key) {
    const el = document.getElementById(id); if (!el) return;
    const down = e => { e.preventDefault(); if (!keys[key]) pressed[key] = true; keys[key] = true; };
    const up   = e => { e.preventDefault(); keys[key] = false; };
    el.addEventListener('touchstart', down); el.addEventListener('mousedown', down);
    el.addEventListener('touchend', up);     el.addEventListener('mouseup', up);
    el.addEventListener('mouseleave', up);   el.addEventListener('touchcancel', up);
  }
  bindTouch('btn-up','ArrowUp'); bindTouch('btn-down','ArrowDown');
  bindTouch('btn-left','ArrowLeft'); bindTouch('btn-right','ArrowRight');
  bindTouch('btn-a','j'); bindTouch('btn-b','e');

  // Pointer clicks (used by the menu's language buttons / play button)
  let menuRegions = { play: null, langs: [] };
  function canvasPoint(e) {
    const r = canvas.getBoundingClientRect();
    const p = e.touches && e.touches[0] ? e.touches[0] : e;
    return { x: (p.clientX - r.left) * (VIEW_W / r.width),
             y: (p.clientY - r.top)  * (VIEW_H / r.height) };
  }
  function inRect(p, b) { return b && p.x >= b.x && p.x <= b.x + b.w && p.y >= b.y && p.y <= b.y + b.h; }
  function handlePoint(p) {
    if (state.scene !== 'menu') return;
    for (const L of menuRegions.langs) if (inRect(p, L)) { setLang(L.lang); return; }
    if (inRect(p, menuRegions.play)) startGame();
  }
  canvas.addEventListener('click', e => handlePoint(canvasPoint(e)));
  canvas.addEventListener('touchstart', e => {
    if (state.scene === 'menu') { e.preventDefault(); handlePoint(canvasPoint(e)); }
  }, { passive: false });

  const downHeld  = () => keys['ArrowDown']  || keys['s'] || keys['S'];
  const upHeld    = () => keys['ArrowUp']    || keys['w'] || keys['W'];
  const leftHeld  = () => keys['ArrowLeft']  || keys['a'] || keys['A'];
  const rightHeld = () => keys['ArrowRight'] || keys['d'] || keys['D'];
  const hitPressed = () => pressed['j']||pressed['J']||pressed['z']||pressed['Z']||pressed[' '];
  const talkPressed = () => pressed['e']||pressed['E']||pressed['Enter'];
  const clearPressed = () => Object.keys(pressed).forEach(k => pressed[k] = false);

  function startGame() { state.scene = 'play'; clearPressed(); }

  /* ---------------- Dialogue ---------------- */
  const dialog = { active: false, lines: [], i: 0, after: null };
  function say(lines, after) {
    dialog.active = true; dialog.lines = lines.slice(); dialog.i = 0; dialog.after = after || null;
  }
  function advanceDialog() {
    dialog.i++;
    if (dialog.i >= dialog.lines.length) {
      dialog.active = false;
      const cb = dialog.after; dialog.after = null; if (cb) cb();
    }
  }

  /* ---------------- Interaction ---------------- */
  function nearestLandmark() {
    const cx = player.x + player.w / 2, cy = player.y + player.h / 2;
    let best = null, bd = 1e9;
    for (const L of LANDMARKS) {
      const lx = L.x * TILE + TILE / 2, ly = L.y * TILE + TILE / 2;
      const d = Math.hypot(cx - lx, cy - ly);
      if (d < TILE * 1.6 && d < bd) { bd = d; best = L; }
    }
    return best;
  }

  function interact(L) {
    state.visited[L.id] = true;

    if (L.isGoal) {
      if (state.won) { say(t(L.lines)); return; }
      if (state.stones >= STONES_NEEDED) {
        state.won = true; sfx('win'); say(t(L.goalDone));
      } else {
        say([ui().stonesCount(state.stones), ...t(L.goalLocked)]);
      }
      return;
    }

    if (L.stone && !state.flags[L.id]) {
      say(t(L.lines), () => {
        state.flags[L.id] = true; state.stones++; sfx('stone');
        say([t(L.stoneLine),
             state.stones >= STONES_NEEDED ? ui().haveAll : ui().stonesCount(state.stones)]);
      });
      return;
    }

    if (L.heal) {
      if (player.hp < player.maxhp) {
        say(t(L.lines), () => { player.hp = player.maxhp; sfx('heal'); say([t(L.healLine)]); });
      } else {
        say([t(L.lines)[0], ui().fullHeart]);
      }
      return;
    }

    say(t(L.lines));
  }

  /* ---------------- Audio (tiny Web Audio blips) ---------------- */
  let actx = null;
  function sfx(kind) {
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const o = actx.createOscillator(), g = actx.createGain();
      o.connect(g); g.connect(actx.destination);
      const now = actx.currentTime;
      const tbl = { hit:[220,'square',0.08], hurt:[140,'sawtooth',0.18], stone:[660,'triangle',0.18],
        heal:[880,'sine',0.22], talk:[440,'sine',0.05], win:[523,'triangle',0.5], slash:[330,'square',0.06] };
      const [f, type, dur] = tbl[kind] || [440,'sine',0.1];
      o.type = type; o.frequency.setValueAtTime(f, now);
      if (kind === 'win') o.frequency.exponentialRampToValueAtTime(f * 2, now + dur);
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.18, now + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      o.start(now); o.stop(now + dur + 0.02);
    } catch (e) { /* no audio */ }
  }

  /* ---------------- Movement & collision ---------------- */
  function tryMove(dx, dy) {
    const corners = (x, y) => [[x,y],[x+player.w,y],[x,y+player.h],[x+player.w,y+player.h]];
    const nx = player.x + dx;
    if (!corners(nx, player.y).some(([cx, cy]) => isSolid(cx, cy))) player.x = nx;
    const ny = player.y + dy;
    if (!corners(player.x, ny).some(([cx, cy]) => isSolid(cx, cy))) player.y = ny;
    player.x = Math.max(0, Math.min((MAP_W - 1) * TILE, player.x));
    player.y = Math.max(0, Math.min((MAP_H - 1) * TILE, player.y));
  }
  function swordBox() {
    const r = 26, cx = player.x + player.w / 2, cy = player.y + player.h / 2;
    if (player.dir === 'up')   return { x: cx-12, y: cy-r, w: 24, h: r };
    if (player.dir === 'down') return { x: cx-12, y: cy,   w: 24, h: r };
    if (player.dir === 'left') return { x: cx-r,  y: cy-12, w: r, h: 24 };
    return { x: cx, y: cy-12, w: r, h: 24 };
  }
  const overlap = (a, b) => a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y;

  /* ---------------- Update ---------------- */
  function updateMenu() {
    if (pressed['l'] || pressed['L']) cycleLang();
    if (pressed['1']) setLang('es');
    if (pressed['2']) setLang('ca');
    if (pressed['3']) setLang('en');
    if (talkPressed() || pressed[' ']) startGame();
    clearPressed();
  }

  function update() {
    if (state.scene === 'menu') { updateMenu(); return; }

    if (pressed['r'] || pressed['R']) location.reload();
    if (pressed['l'] || pressed['L']) cycleLang();

    if (dialog.active) {
      if (talkPressed() || hitPressed()) { sfx('talk'); advanceDialog(); }
      clearPressed(); return;
    }

    let dx = 0, dy = 0;
    if (leftHeld())  { dx -= 1; player.dir = 'left'; }
    if (rightHeld()) { dx += 1; player.dir = 'right'; }
    if (upHeld())    { dy -= 1; player.dir = 'up'; }
    if (downHeld())  { dy += 1; player.dir = 'down'; }
    if (dx || dy) {
      const len = Math.hypot(dx, dy) || 1;
      tryMove((dx/len)*player.speed, (dy/len)*player.speed);
      player.anim += 0.2;
    } else player.anim = 0;

    if (player.cooldown > 0) player.cooldown--;
    if (hitPressed() && player.cooldown === 0) { player.attack = 12; player.cooldown = 20; sfx('slash'); }
    if (player.attack > 0) {
      player.attack--;
      const sb = swordBox();
      enemies.forEach(en => {
        if (!en.dead && !en.hurt && overlap(sb, en)) {
          en.hp--; en.hurt = 20; sfx('hit');
          en.x += (en.x - player.x) * 0.3; en.y += (en.y - player.y) * 0.3;
          if (en.hp <= 0) en.dead = true;
        }
      });
    }

    if (talkPressed()) { const L = nearestLandmark(); if (L) interact(L); }

    if (player.hurt > 0) player.hurt--;
    enemies.forEach(en => {
      if (en.dead) return;
      if (en.hurt > 0) en.hurt--;
      const cx = player.x + player.w/2, cy = player.y + player.h/2;
      const ex = en.x + en.w/2, ey = en.y + en.h/2;
      const d = Math.hypot(cx - ex, cy - ey);
      if (d < TILE * 5) en.dir = Math.atan2(cy - ey, cx - ex);
      else en.dir += (Math.random() - 0.5) * 0.4;
      const mvx = Math.cos(en.dir) * en.speed, mvy = Math.sin(en.dir) * en.speed;
      if (!isSolid(en.x + mvx, ey) && !isSolid(en.x + en.w + mvx, ey)) en.x += mvx;
      if (!isSolid(ex, en.y + mvy) && !isSolid(ex, en.y + en.h + mvy)) en.y += mvy;
      en.wob += 0.2;
      if (player.hurt === 0 && overlap(player, en)) {
        player.hp--; player.hurt = 60; sfx('hurt');
        const ang = Math.atan2(player.y - en.y, player.x - en.x);
        tryMove(Math.cos(ang) * 16, Math.sin(ang) * 16);
        if (player.hp <= 0) {
          player.hp = player.maxhp; player.hurt = 90;
          player.x = 24 * TILE; player.y = 14 * TILE;
          say(ui().deathT);
        }
      }
    });
    clearPressed();
  }

  /* =====================================================================
   *  RENDERING
   * =================================================================== */
  let cam = { x: 0, y: 0 };

  function drawTile(tk, sx, sy) {
    const colors = { G:'#6fae54', P:'#7cc05f', R:'#cbb892', S:'#c2bfb4',
      W:'#3f7fd1', '#':'#e3d8a8', '~':'#a98c63', F:'#9aa6b0', M:'#7d7a6f' };
    ctx.fillStyle = colors[tk] || '#6fae54';
    ctx.fillRect(sx, sy, TILE, TILE);
    if (tk === 'G' || tk === 'P') {
      ctx.fillStyle = tk === 'P' ? '#6bb24f' : '#62a049';
      ctx.fillRect(sx+6, sy+8, 3, 3); ctx.fillRect(sx+20, sy+18, 3, 3);
    } else if (tk === 'R') {
      ctx.fillStyle = '#bfa97e'; ctx.fillRect(sx, sy, TILE, 2); ctx.fillRect(sx, sy, 2, TILE);
    } else if (tk === 'S') {
      ctx.strokeStyle = '#a8a59a'; ctx.lineWidth = 1; ctx.strokeRect(sx+0.5, sy+0.5, TILE-1, TILE-1);
    } else if (tk === 'W') {
      ctx.fillStyle = '#5a93dd'; const o = (Date.now()/400 + sx + sy) % TILE;
      ctx.fillRect(sx, sy + o % TILE, TILE, 2);
    } else if (tk === '~') {
      ctx.fillStyle = '#8a6f4d'; for (let i = 0; i < TILE; i += 8) ctx.fillRect(sx+i, sy, 2, TILE);
      ctx.fillStyle = '#cdbf9e'; ctx.fillRect(sx, sy, TILE, 3);
    } else if (tk === 'F') {
      ctx.strokeStyle = '#7e8a94'; ctx.strokeRect(sx+4, sy+4, TILE-8, TILE-8);
    } else if (tk === 'M') {
      ctx.fillStyle = '#6b6857'; ctx.fillRect(sx+4, sy+16, TILE-8, 6);
    } else if (tk === 'T') {
      ctx.fillStyle = '#6fae54'; ctx.fillRect(sx, sy, TILE, TILE);
      ctx.fillStyle = '#6b4a2b'; ctx.fillRect(sx+13, sy+18, 6, 12);
      ctx.fillStyle = '#2f7d32'; ctx.beginPath(); ctx.arc(sx+16, sy+14, 12, 0, 7); ctx.fill();
      ctx.fillStyle = '#3a9440'; ctx.beginPath(); ctx.arc(sx+12, sy+12, 7, 0, 7); ctx.fill();
    }
  }

  function drawLandmark(L) {
    if (L.building) {
      const bx = L.building.x*TILE - cam.x, by = L.building.y*TILE - cam.y;
      const bw = L.building.w*TILE, bh = L.building.h*TILE;
      ctx.fillStyle = L.color; ctx.fillRect(bx, by, bw, bh);
      ctx.strokeStyle = 'rgba(0,0,0,0.25)'; ctx.strokeRect(bx+0.5, by+0.5, bw-1, bh-1);
      ctx.fillStyle = 'rgba(0,0,0,0.18)'; ctx.fillRect(bx, by, bw, 10);
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      for (let wx = bx+8; wx < bx+bw-8; wx += 22) ctx.fillRect(wx, by+16, 8, 8);
      drawIcon(L, bx + bw/2, by);
    }
    const dx = L.x*TILE - cam.x, dy = L.y*TILE - cam.y;
    ctx.fillStyle = L.isGoal ? '#ffd34d' : (L.stone && !state.flags[L.id] ? '#ffe08a' : '#e8e3d4');
    ctx.fillRect(dx+8, dy+6, 16, 26);
    ctx.fillStyle = '#5a4632'; ctx.fillRect(dx+11, dy+12, 10, 20);
    if ((L.stone && !state.flags[L.id]) || (L.isGoal && !state.won)) {
      const bob = Math.sin(Date.now()/250) * 3;
      ctx.fillStyle = L.isGoal ? '#ff5a3c' : '#ffd34d';
      ctx.font = 'bold 18px monospace'; ctx.textAlign = 'center';
      ctx.fillText(L.isGoal ? '★' : '!', dx+16, dy-6+bob);
    }
  }

  function drawIcon(L, cx, top) {
    ctx.save(); ctx.translate(cx, top); ctx.textAlign = 'center';
    switch (L.icon) {
      case 'tower': ctx.fillStyle='#7a4a1f'; ctx.fillRect(-6,-22,12,22);
        ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(0,-14,5,0,7); ctx.fill();
        ctx.fillStyle='#000'; ctx.fillRect(-1,-16,2,4); break;
      case 'church': case 'chapel': ctx.fillStyle='#cdbfa3'; ctx.fillRect(-4,-20,8,20);
        ctx.fillStyle='#7a4a1f'; ctx.fillRect(-1,-28,2,8); ctx.fillRect(-3,-25,6,2); break;
      case 'townhall': ctx.fillStyle='#caa84e'; ctx.fillRect(-14,-8,28,8);
        ctx.fillStyle='#a8862f'; ctx.fillRect(-12,-16,24,8); break;
      case 'market': ctx.fillStyle='#e07a3e'; for (let i=-12;i<12;i+=8) ctx.fillRect(i,-10,4,10); break;
      case 'museum': ctx.fillStyle='#fff'; for (let i=-12;i<12;i+=8) ctx.fillRect(i,-14,4,14);
        ctx.fillStyle='#8e7cc3'; ctx.fillRect(-14,-18,28,4); break;
      case 'factory': ctx.fillStyle='#5b7fa6'; ctx.fillRect(-16,-12,32,12);
        ctx.fillStyle='#3f5a78'; ctx.fillRect(8,-22,6,10); break;
      case 'station': ctx.fillStyle='#445'; ctx.fillRect(-14,-6,28,6);
        ctx.fillStyle='#ffd34d'; ctx.fillRect(-10,-4,4,3); break;
      case 'bakery': ctx.fillStyle='#e8b04b'; ctx.beginPath(); ctx.arc(0,-8,8,0,7); ctx.fill();
        ctx.fillStyle='#a8742a'; ctx.fillRect(-6,-9,12,2); break;
      case 'bar': ctx.fillStyle='#c0504d'; ctx.fillRect(-8,-10,16,10);
        ctx.fillStyle='#fff'; ctx.fillRect(-6,-8,3,6); break;
    }
    ctx.restore();
  }

  function drawHero(px, py) {
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath(); ctx.ellipse(px+10, py+24, 11, 4, 0, 0, 7); ctx.fill();
    const step = Math.sin(player.anim) * 3;
    ctx.fillStyle = '#3a2a1a'; ctx.fillRect(px+4, py+18+step, 5, 7); ctx.fillRect(px+12, py+18-step, 5, 7);
    ctx.fillStyle = '#2e8b3d'; ctx.fillRect(px+3, py+8, 15, 12);
    ctx.fillStyle = '#236e30'; ctx.fillRect(px+3, py+16, 15, 3);
    ctx.fillStyle = '#f0c89a'; ctx.fillRect(px+5, py+1, 11, 9);
    ctx.fillStyle = '#1f6e2c'; ctx.fillRect(px+4, py-1, 13, 4); ctx.fillRect(px+4, py+2, 4, 3);
    ctx.fillStyle = '#222';
    if (player.dir === 'down')  { ctx.fillRect(px+7, py+6, 2, 2); ctx.fillRect(px+12, py+6, 2, 2); }
    if (player.dir === 'left')  { ctx.fillRect(px+6, py+6, 2, 2); }
    if (player.dir === 'right') { ctx.fillRect(px+13, py+6, 2, 2); }
  }

  function drawPlayer() {
    const px = player.x - cam.x, py = player.y - cam.y;
    if (player.hurt > 0 && Math.floor(player.hurt/4) % 2) return;
    drawHero(px, py);
    if (player.attack > 0) {
      ctx.strokeStyle = '#dfe9ef'; ctx.lineWidth = 3;
      const sb = swordBox(); ctx.strokeRect(sb.x - cam.x, sb.y - cam.y, sb.w, sb.h);
    }
  }

  function drawEnemy(en) {
    if (en.dead) return;
    const ex = en.x - cam.x, ey = en.y - cam.y;
    if (en.hurt > 0 && Math.floor(en.hurt/3) % 2) return;
    ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.beginPath(); ctx.ellipse(ex+11, ey+22, 10, 3, 0, 0, 7); ctx.fill();
    const bob = Math.sin(en.wob) * 2;
    ctx.fillStyle = '#c0322b'; ctx.beginPath(); ctx.arc(ex+11, ey+12+bob, 10, 0, 7); ctx.fill();
    ctx.fillStyle = '#8e1f1a';
    ctx.beginPath(); ctx.moveTo(ex+4, ey+4+bob); ctx.lineTo(ex+7, ey+9+bob); ctx.lineTo(ex+1, ey+8+bob); ctx.fill();
    ctx.beginPath(); ctx.moveTo(ex+18, ey+4+bob); ctx.lineTo(ex+15, ey+9+bob); ctx.lineTo(ex+21, ey+8+bob); ctx.fill();
    ctx.fillStyle = '#ffd34d'; ctx.fillRect(ex+6, ey+10+bob, 3, 3); ctx.fillRect(ex+13, ey+10+bob, 3, 3);
  }

  function drawHeart(x, y, fill) {
    ctx.save(); ctx.translate(x, y);
    const path = (c) => { ctx.fillStyle = c; ctx.beginPath(); ctx.moveTo(0,4);
      ctx.bezierCurveTo(-8,-5,-16,5,0,16); ctx.bezierCurveTo(16,5,8,-5,0,4); ctx.fill(); };
    path('#5a1f1f');
    if (fill >= 1) path('#e23b3b');
    else if (fill === 0.5) { ctx.save(); ctx.beginPath(); ctx.rect(-16,-6,16,24); ctx.clip(); path('#e23b3b'); ctx.restore(); }
    ctx.restore();
  }

  function drawMinimap() {
    const mw = 120, mh = Math.round(120 * MAP_H / MAP_W), ox = VIEW_W - mw - 10, oy = 44;
    ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.fillRect(ox-2, oy-2, mw+4, mh+4);
    const sx = mw / MAP_W, sy = mh / MAP_H;
    for (let y = 0; y < MAP_H; y++) for (let x = 0; x < MAP_W; x++) {
      const tk = map[y][x]; if (tk === 'G' || tk === 'P') continue;
      ctx.fillStyle = ({ W:'#3f7fd1','#':'#e3d8a8',R:'#cbb892',S:'#ddd','~':'#caa',B:'#caa37a',F:'#9aa6b0',M:'#6b6857',T:'#2f7d32',D:'#caa37a' })[tk] || '#888';
      ctx.fillRect(ox + x*sx, oy + y*sy, Math.ceil(sx), Math.ceil(sy));
    }
    LANDMARKS.forEach(L => {
      if (L.isGoal) ctx.fillStyle = '#ff5a3c';
      else if (L.stone && !state.flags[L.id]) ctx.fillStyle = '#ffd34d';
      else return;
      ctx.fillRect(ox + L.x*sx - 1, oy + L.y*sy - 1, 3, 3);
    });
    ctx.fillStyle = '#fff';
    ctx.fillRect(ox + (player.x/TILE)*sx - 1, oy + (player.y/TILE)*sy - 1, 3, 3);
  }

  function drawHUD() {
    for (let i = 0; i < player.maxhp; i += 2) {
      const f = player.hp - i;
      drawHeart(14 + (i/2)*26, 16, f >= 2 ? 1 : f === 1 ? 0.5 : 0);
    }
    ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.fillRect(VIEW_W-168, 8, 160, 28);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 15px monospace'; ctx.textAlign = 'left';
    ctx.fillText(`🪨 ${ui().stones} ${state.stones}/${STONES_NEEDED}`, VIEW_W-160, 27);

    ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.fillRect(0, VIEW_H-26, VIEW_W, 26);
    ctx.fillStyle = '#ffe9a8'; ctx.font = '13px monospace'; ctx.textAlign = 'center';
    ctx.fillText(currentObjective(), VIEW_W/2, VIEW_H-8);

    if (!dialog.active) {
      const L = nearestLandmark();
      if (L) {
        const label = `[E] ${t(L.name)}`;
        ctx.font = 'bold 14px monospace'; ctx.textAlign = 'center';
        const w = ctx.measureText(label).width + 18;
        ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(VIEW_W/2 - w/2, 40, w, 24);
        ctx.fillStyle = '#fff'; ctx.fillText(label, VIEW_W/2, 57);
      }
    }
    drawMinimap();
  }

  function wrapText(text, x, y, maxW, lh) {
    const words = String(text).split(' '); let line = '', yy = y;
    for (const w of words) {
      const test = line + w + ' ';
      if (ctx.measureText(test).width > maxW && line) { ctx.fillText(line, x, yy); line = w + ' '; yy += lh; }
      else line = test;
    }
    ctx.fillText(line, x, yy);
  }

  function drawDialog() {
    if (!dialog.active) return;
    const h = 110, y = VIEW_H - h - 30;
    ctx.fillStyle = 'rgba(10,14,22,0.92)'; ctx.fillRect(30, y, VIEW_W-60, h);
    ctx.strokeStyle = '#ffd34d'; ctx.lineWidth = 2; ctx.strokeRect(30, y, VIEW_W-60, h);
    ctx.fillStyle = '#fff'; ctx.font = '15px monospace'; ctx.textAlign = 'left';
    wrapText(dialog.lines[dialog.i], 48, y+30, VIEW_W-96, 22);
    ctx.fillStyle = '#ffd34d'; ctx.font = '12px monospace'; ctx.textAlign = 'right';
    ctx.fillText(ui().contDialog, VIEW_W-48, y+h-12);
  }

  /* ---------------- Menu screen ---------------- */
  function renderMenu() {
    // sky + ground backdrop
    const grad = ctx.createLinearGradient(0, 0, 0, VIEW_H);
    grad.addColorStop(0, '#2a3a63'); grad.addColorStop(0.55, '#5a6fa0'); grad.addColorStop(0.56, '#6fae54'); grad.addColorStop(1, '#4e8a3c');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, VIEW_W, VIEW_H);

    // a little river + bridge silhouette
    ctx.fillStyle = '#3f7fd1'; ctx.fillRect(0, 300, VIEW_W, 36);
    ctx.fillStyle = '#7a5c39';
    ctx.beginPath(); ctx.moveTo(300, 312);
    ctx.bezierCurveTo(360, 270, 440, 270, 500, 312); ctx.lineTo(500, 330); ctx.lineTo(300, 330); ctx.fill();
    ctx.fillStyle = '#9b8b6e'; ctx.fillRect(290, 304, 220, 8);

    // moon
    ctx.fillStyle = '#f4e9b8'; ctx.beginPath(); ctx.arc(660, 90, 34, 0, 7); ctx.fill();

    // title
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffd34d'; ctx.font = 'bold 52px monospace';
    ctx.fillText('MARTORELL QUEST', VIEW_W/2, 130);
    ctx.fillStyle = '#fff'; ctx.font = '20px monospace';
    ctx.fillText(ui().subtitle, VIEW_W/2, 165);

    // blinking play prompt
    if (Math.floor(Date.now()/500) % 2 === 0) {
      ctx.fillStyle = '#fff'; ctx.font = 'bold 20px monospace';
      const coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
      ctx.fillText(coarse ? ui().playTouch : ui().play, VIEW_W/2, 235);
    }
    // invisible play hit-area (whole upper band)
    menuRegions.play = { x: VIEW_W/2 - 180, y: 205, w: 360, h: 44 };

    // language selector
    ctx.fillStyle = '#ffe9a8'; ctx.font = '16px monospace';
    ctx.fillText(ui().language, VIEW_W/2, 430);
    menuRegions.langs = [];
    const bw = 150, gap = 16, total = LANG_ORDER.length * bw + (LANG_ORDER.length - 1) * gap;
    let bx = VIEW_W/2 - total/2; const by = 448;
    LANG_ORDER.forEach(code => {
      const sel = state.lang === code;
      ctx.fillStyle = sel ? '#ffd34d' : 'rgba(0,0,0,0.45)';
      ctx.fillRect(bx, by, bw, 40);
      ctx.strokeStyle = sel ? '#fff' : 'rgba(255,255,255,0.4)'; ctx.lineWidth = 2;
      ctx.strokeRect(bx, by, bw, 40);
      ctx.fillStyle = sel ? '#3a2a00' : '#fff'; ctx.font = 'bold 16px monospace';
      ctx.fillText(LANG_NAMES[code], bx + bw/2, by + 26);
      menuRegions.langs.push({ lang: code, x: bx, y: by, w: bw, h: 40 });
      bx += bw + gap;
    });

    ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = '12px monospace';
    ctx.fillText('1 · 2 · 3  /  L', VIEW_W/2, 512);
    ctx.fillText(ui().tagline, VIEW_W/2, 560);
  }

  function renderPlay() {
    cam.x = Math.max(0, Math.min(MAP_W*TILE - VIEW_W, player.x + player.w/2 - VIEW_W/2));
    cam.y = Math.max(0, Math.min(MAP_H*TILE - VIEW_H, player.y + player.h/2 - VIEW_H/2));
    ctx.clearRect(0, 0, VIEW_W, VIEW_H);

    const x0 = Math.floor(cam.x/TILE), y0 = Math.floor(cam.y/TILE);
    const x1 = Math.ceil((cam.x+VIEW_W)/TILE), y1 = Math.ceil((cam.y+VIEW_H)/TILE);
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      if (x < 0 || y < 0 || x >= MAP_W || y >= MAP_H) continue;
      drawTile(map[y][x], x*TILE - cam.x, y*TILE - cam.y);
    }
    LANDMARKS.forEach(drawLandmark);
    enemies.forEach(drawEnemy);
    drawPlayer();
    drawHUD();
    drawDialog();

    if (state.won) {
      ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.fillRect(0, 0, VIEW_W, VIEW_H);
      ctx.fillStyle = '#ffd34d'; ctx.font = 'bold 34px monospace'; ctx.textAlign = 'center';
      ctx.fillText(ui().won1, VIEW_W/2, VIEW_H/2 - 10);
      ctx.fillStyle = '#fff'; ctx.font = '16px monospace';
      ctx.fillText(ui().won2, VIEW_W/2, VIEW_H/2 + 24);
    }
  }

  function render() { if (state.scene === 'menu') renderMenu(); else renderPlay(); }

  /* ---------------- Main loop ---------------- */
  refreshChrome();
  (function loop() { update(); render(); requestAnimationFrame(loop); })();
})();
