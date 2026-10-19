/*! WEBWORK hero: цифрове ядро на Three.js (WebGL). Ініціалізується в секції [data-hero]. */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.min.js';
import { RoundedBoxGeometry } from 'https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/postprocessing/OutputPass.js';
import { ShaderPass } from 'https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/postprocessing/ShaderPass.js';
import { Pass, FullScreenQuad } from 'https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/postprocessing/Pass.js';

// ───────────── Налаштування ─────────────
const CONFIG = {
  background: '#1e1f1b',  // тло секції (те саме, що --bg)
  lime: '#b9d531',        // акцент: сяйво, лінії, скло
  cream: '#e4dfd2',       // світлий бетон
  graphite: '#383934',    // темні куби
  shiftX: 0.24,           // 0…0.3 — зсунути ядро вправо (частка ширини), коли зліва текст
  seed: 20261017,         // інше число — інша форма кластера
  beatEvery: [4.8, 7.0],  // інтервал «серцебиття» ядра, секунди
  glow: 0.6,              // яскравість світла й сяйва: 1 — як було, менше — спокійніше
};

const TAU = Math.PI * 2;
const WAVE = 5.2; // швидкість хвилі від ядра, одиниць/с
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const smoothstep = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function dominantAxis(v) {
  const ax = Math.abs(v.x), ay = Math.abs(v.y), az = Math.abs(v.z);
  if (ax >= ay && ax >= az) return new THREE.Vector3(Math.sign(v.x) || 1, 0, 0);
  if (ay >= az) return new THREE.Vector3(0, Math.sign(v.y) || 1, 0);
  return new THREE.Vector3(0, 0, Math.sign(v.z) || 1);
}

// ACES із three.js — щоб підібрати лінійний фон, який після тонмапінгу дає рівно CONFIG.background
function acesFilmic(r, g, b, exposure) {
  const k = exposure / 0.6;
  r *= k; g *= k; b *= k;
  let x = 0.59719 * r + 0.35458 * g + 0.04823 * b;
  let y = 0.076 * r + 0.90834 * g + 0.01566 * b;
  let z = 0.0284 * r + 0.13383 * g + 0.83777 * b;
  const f = (v) => (v * (v + 0.0245786) - 0.000090537) / (v * (0.983729 * v + 0.432951) + 0.238081);
  x = f(x); y = f(y); z = f(z);
  return [
    clamp(1.60475 * x - 0.53108 * y - 0.07367 * z, 0, 1),
    clamp(-0.10208 * x + 1.10813 * y - 0.00605 * z, 0, 1),
    clamp(-0.00327 * x - 0.07276 * y + 1.07602 * z, 0, 1),
  ];
}
function sceneColorFor(hex, exposure) {
  const c = new THREE.Color(hex);
  const target = [c.r, c.g, c.b];
  let v = target.map((x) => x * 2.4 + 1e-4);
  for (let i = 0; i < 80; i++) {
    const o = acesFilmic(v[0], v[1], v[2], exposure);
    v = v.map((x, k) => clamp(x * Math.pow((target[k] + 1e-5) / (o[k] + 1e-5), 0.6), 0, 64));
  }
  return new THREE.Color().setRGB(v[0], v[1], v[2], THREE.LinearSRGBColorSpace);
}

// ───────────── Процедурні текстури ─────────────
function makeSurface(rng) {
  const S = 512;
  const pores = [];
  for (let i = 0; i < 2300; i++) {
    const big = rng() < 0.07;
    pores.push({ x: rng() * S, y: rng() * S, r: big ? 1.3 + rng() * 1.9 : 0.45 + rng() * 0.9, a: big ? 0.32 + rng() * 0.32 : 0.1 + rng() * 0.36 });
  }
  const blobs = [];
  for (let i = 0; i < 70; i++) blobs.push({ x: rng() * S, y: rng() * S, r: 24 + rng() * 110, light: rng() < 0.5, a: 0.02 + rng() * 0.045 });
  const wrap = (x, y, r, fn) => {
    for (let ox = -S; ox <= S; ox += S) for (let oy = -S; oy <= S; oy += S) {
      const X = x + ox, Y = y + oy;
      if (X + r < 0 || X - r > S || Y + r < 0 || Y - r > S) continue;
      fn(X, Y);
    }
  };
  const canvas = () => { const c = document.createElement('canvas'); c.width = c.height = S; return c; };

  const detail = canvas();
  let g = detail.getContext('2d');
  g.fillStyle = '#f5f4f1';
  g.fillRect(0, 0, S, S);
  for (const b of blobs) wrap(b.x, b.y, b.r, (X, Y) => {
    const grd = g.createRadialGradient(X, Y, 0, X, Y, b.r);
    const v = b.light ? '255,255,255' : '70,66,60';
    grd.addColorStop(0, `rgba(${v},${b.light ? b.a : b.a * 0.5})`);
    grd.addColorStop(1, `rgba(${v},0)`);
    g.fillStyle = grd;
    g.fillRect(X - b.r, Y - b.r, b.r * 2, b.r * 2);
  });
  for (const p of pores) wrap(p.x, p.y, p.r, (X, Y) => {
    g.fillStyle = `rgba(38,36,32,${p.a})`;
    g.beginPath(); g.arc(X, Y, p.r, 0, TAU); g.fill();
  });

  const bump = canvas();
  g = bump.getContext('2d');
  g.fillStyle = '#7c7c7c';
  g.fillRect(0, 0, S, S);
  for (const b of blobs) wrap(b.x, b.y, b.r, (X, Y) => {
    const grd = g.createRadialGradient(X, Y, 0, X, Y, b.r);
    const v = b.light ? '255,255,255' : '0,0,0';
    grd.addColorStop(0, `rgba(${v},${b.a * 1.4})`);
    grd.addColorStop(1, `rgba(${v},0)`);
    g.fillStyle = grd;
    g.fillRect(X - b.r, Y - b.r, b.r * 2, b.r * 2);
  });
  for (const p of pores) wrap(p.x, p.y, p.r, (X, Y) => {
    g.fillStyle = `rgba(0,0,0,${Math.min(1, 0.45 + p.a)})`;
    g.beginPath(); g.arc(X, Y, p.r * 1.05, 0, TAU); g.fill();
  });
  return { detail, bump, S };
}

function roundRectPath(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

// Іконки послуг: кошик (магазин), картка (оплати), графік (аналітика), шестерня (автоматизація)
function drawIcon(g, kind, S, w = 1) {
  const u = S / 512;
  g.save();
  g.translate(S / 2, S / 2);
  g.lineCap = 'round';
  g.lineJoin = 'round';
  const poly = (pts, close) => {
    g.beginPath();
    g.moveTo(pts[0][0] * u, pts[0][1] * u);
    for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0] * u, pts[i][1] * u);
    if (close) g.closePath();
    g.stroke();
  };
  if (kind === 'cart') {
    g.translate(-6 * u, -14 * u);
    g.lineWidth = 19 * u * w;
    poly([[-172, -122], [-132, -122], [-98, 72], [130, 72]]);
    poly([[-123, -72], [152, -72], [124, 40], [-103, 40]], true);
    g.lineWidth = 11 * u * w;
    poly([[-113, -16], [138, -16]]);
    for (const x of [-42, 14, 70]) poly([[x + 6, -72], [x - 2, 40]]);
    g.lineWidth = 19 * u * w;
    for (const x of [-66, 104]) { g.beginPath(); g.arc(x * u, 124 * u, 24 * u, 0, TAU); g.stroke(); }
  } else if (kind === 'chart') {
    const base = 128, bw = 56;
    for (const [x, top] of [[-160, 48], [-76, -8], [8, -70], [92, -136]]) {
      roundRectPath(g, x * u, top * u, bw * u, (base - top) * u, 14 * u);
      g.fill();
    }
    g.lineWidth = 15 * u * w;
    poly([[-176, 166], [176, 166]]);
  } else if (kind === 'gear') {
    const n = 8, Ro = 152, Rb = 116, tw = 0.16, bw = 0.25;
    g.lineWidth = 19 * u * w;
    g.beginPath();
    for (let i = 0; i < n; i++) {
      const a = (i / n) * TAU - Math.PI / 2;
      const P = (r, ang) => [Math.cos(ang) * r * u, Math.sin(ang) * r * u];
      const p1 = P(Rb, a - bw), p2 = P(Ro, a - tw), p3 = P(Ro, a + tw), p4 = P(Rb, a + bw);
      if (i === 0) g.moveTo(p1[0], p1[1]); else g.lineTo(p1[0], p1[1]);
      g.lineTo(p2[0], p2[1]); g.lineTo(p3[0], p3[1]); g.lineTo(p4[0], p4[1]);
      const next = ((i + 1) / n) * TAU - Math.PI / 2;
      g.arc(0, 0, Rb * u, a + bw, next - bw);
    }
    g.closePath();
    g.stroke();
    g.beginPath(); g.arc(0, 0, 50 * u, 0, TAU); g.stroke();
  } else if (kind === 'card') {
    g.lineWidth = 18 * u * w;
    roundRectPath(g, -172 * u, -114 * u, 344 * u, 228 * u, 30 * u);
    g.stroke();
    g.lineWidth = 26 * u * w;
    poly([[-160, -50], [160, -50]]);
    g.lineWidth = 14 * u * w;
    roundRectPath(g, -130 * u, 12 * u, 66 * u, 48 * u, 10 * u);
    g.stroke();
    poly([[30, 56], [128, 56]]);
  }
  g.restore();
}

function iconCanvases(kind, baseHex, isDark, surf) {
  const S = 512;
  const mk = () => { const c = document.createElement('canvas'); c.width = c.height = S; return c; };
  const color = mk();
  let g = color.getContext('2d');
  g.fillStyle = baseHex;
  g.fillRect(0, 0, S, S);
  g.globalCompositeOperation = 'multiply';
  g.drawImage(surf.detail, 0, 0);
  g.globalCompositeOperation = 'source-over';
  g.strokeStyle = g.fillStyle = isDark ? 'rgba(206,208,196,0.66)' : 'rgba(86,82,72,0.4)';
  drawIcon(g, kind, S);

  const bump = mk();
  g = bump.getContext('2d');
  g.drawImage(surf.bump, 0, 0);
  g.filter = 'blur(3px)';
  g.strokeStyle = g.fillStyle = '#000';
  drawIcon(g, kind, S, 1.05);
  g.filter = 'none';

  const emit = mk();
  g = emit.getContext('2d');
  g.fillStyle = '#000';
  g.fillRect(0, 0, S, S);
  g.strokeStyle = g.fillStyle = '#fff';
  drawIcon(g, kind, S, 0.85);
  return { color, bump, emit };
}

function radialTexture() {
  const S = 256;
  const c = document.createElement('canvas'); c.width = c.height = S;
  const g = c.getContext('2d');
  const grd = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  grd.addColorStop(0, 'rgba(255,255,255,1)');
  grd.addColorStop(0.16, 'rgba(255,255,255,0.5)');
  grd.addColorStop(0.42, 'rgba(255,255,255,0.12)');
  grd.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grd;
  g.fillRect(0, 0, S, S);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function streakTexture() {
  const W = 512, H = 64;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  const gx = g.createLinearGradient(0, 0, W, 0);
  [[0, 0], [0.28, 0.04], [0.44, 0.3], [0.5, 1], [0.56, 0.3], [0.72, 0.04], [1, 0]].forEach(([o, a]) => gx.addColorStop(o, `rgba(255,255,255,${a})`));
  g.fillStyle = gx;
  g.fillRect(0, 0, W, H);
  g.globalCompositeOperation = 'destination-in';
  const gy = g.createLinearGradient(0, 0, 0, H);
  [[0, 0], [0.38, 0.25], [0.5, 1], [0.62, 0.25], [1, 0]].forEach(([o, a]) => gy.addColorStop(o, `rgba(0,0,0,${a})`));
  g.fillStyle = gy;
  g.fillRect(0, 0, W, H);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

// ───────────── Форма кластера ─────────────
function buildLayout(rng, toCam, right, up) {
  const cubes = [];
  const add = (x, y, z, size, type, extra) => {
    const c = Object.assign({ home: new THREE.Vector3(x, y, z), size, type, glow: 0, rn: 1 }, extra || {});
    cubes.push(c);
    return c;
  };
  const pick = (weights) => {
    const r = rng();
    let acc = 0;
    for (const [k, w] of weights) { acc += w; if (r < acc) return k; }
    return null;
  };
  const OCT = [];
  for (const a of [-1, 1]) for (const b of [-1, 1]) for (const c of [-1, 1]) OCT.push([a, b, c]);
  const N = 3, R = 2.78;
  const v = new THREE.Vector3();

  for (let i = -N; i <= N; i++) for (let j = -N; j <= N; j++) for (let k = -N; k <= N; k++) {
    if (!i && !j && !k) { add(0, 0, 0, 0.9, 'glass', { glow: 1, rn: 0, core: true }); continue; }
    v.set(i, j, k);
    const len = v.length();
    const d = len * 0.55 + ((Math.abs(i) + Math.abs(j) + Math.abs(k)) / 1.6) * 0.45 + (rng() - 0.5) * 0.7;
    if (d > R) continue;
    const rn = d / R;
    const facing = v.clone().divideScalar(len).dot(toCam);
    const shell = rn < 0.42 ? 0 : rn < 0.72 ? 1 : 2;
    const glowFor = () => (shell === 0 ? 0.7 + rng() * 0.3 : shell === 1 ? 0.35 + rng() * 0.3 : 0.12 + rng() * 0.2);
    const sub = (weights) => {
      for (const [a, b, c] of OCT) {
        const t = pick(weights);
        if (!t) continue;
        const x = i + a * 0.25, y = j + b * 0.25, z = k + c * 0.25;
        if (t === 'micro') {
          for (const [p, q, r] of OCT) {
            if (rng() < 0.45) continue;
            add(x + p * 0.125, y + q * 0.125, z + r * 0.125, 0.205, pick([['dark', 0.45], ['glass', 0.3], ['cream', 0.25]]) || 'dark', { glow: glowFor(), rn });
          }
        } else add(x, y, z, 0.44, t, { glow: glowFor(), rn });
      }
    };
    const windowed = (shell === 0 && facing > 0.5) || (shell === 1 && facing > 0.7) || (shell === 2 && facing > 0.8);
    if (windowed) {
      if (rng() < 0.35) continue;
      sub([['glass', 0.3], ['dark', 0.24], ['micro', 0.04]]);
      continue;
    }
    if (shell === 0) { sub([['glass', 0.3], ['dark', 0.34], ['cream', 0.08], ['micro', 0.08]]); continue; }
    const r = rng();
    if (shell === 1) {
      if (r < 0.36) add(i, j, k, 0.93, pick([['dark', 0.55], ['cream', 0.33], ['glass', 0.12]]) || 'dark', { glow: glowFor(), rn });
      else sub([['dark', 0.34], ['glass', 0.16], ['cream', 0.24], ['micro', 0.04]]);
      continue;
    }
    if (r < 0.62) {
      const ax = dominantAxis(v);
      const push = rng() < 0.16 ? 0.22 + rng() * 0.32 : rng() * 0.09;
      add(i + ax.x * push, j + ax.y * push, k + ax.z * push, 0.93, pick([['cream', 0.6], ['dark', 0.32], ['glass', 0.08]]) || 'cream', { glow: glowFor(), rn });
    } else if (r < 0.88) sub([['cream', 0.32], ['dark', 0.34], ['glass', 0.08], ['micro', 0.03]]);
  }

  // виступи — щоб силует був «рваний», а не кулею
  const outer = cubes.filter((c) => c.size > 0.9 && c.rn > 0.72 && dominantAxis(c.home).dot(toCam) < 0.6);
  for (let n = 0; n < 7 && outer.length; n++) {
    const base = outer.splice(Math.floor(rng() * outer.length), 1)[0];
    const ax = dominantAxis(base.home);
    const s = rng() < 0.5 ? 0.44 : 0.6;
    const pos = base.home.clone().addScaledVector(ax, 0.465 + s / 2 + 0.05);
    const perp = ax.x ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
    pos.addScaledVector(perp, (rng() - 0.5) * 0.5);
    add(pos.x, pos.y, pos.z, s, pick([['cream', 0.45], ['dark', 0.4], ['glass', 0.15]]) || 'dark', { glow: 0.2, rn: 1 });
  }

  // кубики-послуги з гравіюванням
  const FEATURES = [
    { icon: 'cart', type: 'cream', size: 1.12, sx: 0.62, sy: 0.6, depth: 1.25 },
    { icon: 'chart', type: 'dark', size: 0.94, sx: 1.0, sy: 0.06, depth: 0.55 },
    { icon: 'gear', type: 'dark', size: 1.0, sx: -0.72, sy: -0.52, depth: 1.15 },
    { icon: 'card', type: 'cream', size: 1.26, sx: 0.5, sy: -0.78, depth: 1.25 },
  ];
  const snap = (x) => Math.round(x * 4) / 4;
  const feats = [];
  const w = new THREE.Vector3();
  for (const f of FEATURES) {
    const p = new THREE.Vector3().addScaledVector(right, f.sx * 3).addScaledVector(up, f.sy * 3).addScaledVector(toCam, f.depth);
    p.set(snap(p.x), snap(p.y), snap(p.z));
    for (let n = cubes.length - 1; n >= 0; n--) {
      const c = cubes[n];
      if (c.core || c.icon) continue;
      const lim = (c.size + f.size) / 2 + 0.03;
      const overlap = Math.abs(c.home.x - p.x) < lim && Math.abs(c.home.y - p.y) < lim && Math.abs(c.home.z - p.z) < lim;
      w.subVectors(c.home, p);
      const along = w.dot(toCam);
      const lateral = w.clone().addScaledVector(toCam, -along).length();
      const blocking = along > 0 && along < 3.5 && lateral < (f.size + c.size) * 0.5;
      if (overlap || blocking) cubes.splice(n, 1);
    }
    feats.push(add(p.x, p.y, p.z, f.size, f.type, { icon: f.icon, rn: 1 }));
  }

  // супутники навколо
  let guard = 0, satCount = 0;
  while (satCount < 30 && guard++ < 800) {
    const d = new THREE.Vector3(rng() * 2 - 1, (rng() * 2 - 1) * 0.8, rng() * 2 - 1);
    const l2 = d.lengthSq();
    if (l2 < 0.05 || l2 > 1) continue;
    d.normalize();
    if (d.dot(toCam) > 0.5) continue;
    const p = d.multiplyScalar(4.1 + rng() * 3.6);
    if (p.y < -3.9) continue;
    const s = 0.11 + rng() * rng() * 0.36;
    add(p.x, p.y, p.z, s, pick([['dark', 0.44], ['cream', 0.38], ['glass', 0.18]]) || 'dark', { sat: true, glow: 0.25, rn: 1.3 });
    satCount++;
  }

  // лінії-траси даних
  const AX = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]].map((a) => new THREE.Vector3(...a));
  const starts = cubes.filter((c) => !c.sat && c.rn > 0.6 && c.size > 0.4);
  for (let n = starts.length - 1; n > 0; n--) { const m = Math.floor(rng() * (n + 1)); [starts[n], starts[m]] = [starts[m], starts[n]]; }
  const paths = [];
  for (const c of starts) {
    if (paths.length >= 24) break;
    const a = dominantAxis(c.home);
    if (a.dot(toCam) > 0.6 && rng() < 0.85) continue;
    const start = c.home.clone().addScaledVector(a, c.size / 2);
    if (paths.some((p) => p.pts[0].distanceTo(start) < 0.9)) continue;
    const pts = [start];
    let cur = start.clone().addScaledVector(a, 0.9 + rng() * 2.4);
    pts.push(cur);
    let dir = a;
    const turns = rng() < 0.62 ? (rng() < 0.35 ? 2 : 1) : 0;
    for (let n = 0; n < turns; n++) {
      const here = cur.clone().normalize();
      let best = null, bestScore = -Infinity;
      for (const b of AX) {
        if (Math.abs(b.dot(dir)) > 0.5 || b.dot(toCam) > 0.6) continue;
        const score = b.dot(here) + (rng() - 0.5) * 1.6;
        if (score > bestScore) { bestScore = score; best = b; }
      }
      if (!best) break;
      dir = best;
      cur = cur.clone().addScaledVector(dir, 0.6 + rng() * 1.9);
      pts.push(cur);
    }
    if (pts.slice(1).some((p) => p.length() < 2.9)) continue;
    let total = 0;
    for (let n = 1; n < pts.length; n++) total += pts[n].distanceTo(pts[n - 1]);
    const endCube = rng() < 0.35;
    paths.push({ pts, total, r0: start.length(), speed: 1.7 + rng() * 1.6, phase: rng(), endCube });
    if (endCube) {
      const s = 0.14 + rng() * 0.14;
      const end = pts[pts.length - 1].clone().addScaledVector(dir, s / 2);
      add(end.x, end.y, end.z, s, pick([['dark', 0.4], ['cream', 0.35], ['glass', 0.25]]) || 'dark', { sat: true, anchored: true, glow: 0.35, rn: 1.3 });
    }
  }
  return { cubes, paths, feats };
}

// Об'ємні промені від ядра: яскрава маска в 1/4 роздільності → радіальний марш у 1/2 → додаємо до кадру
class LightShaftsPass extends Pass {
  constructor(samples) {
    super();
    this.needsSwap = false;
    const opts = { type: THREE.HalfFloatType, depthBuffer: false };
    this.maskRT = new THREE.WebGLRenderTarget(1, 1, opts);
    this.rayRT = new THREE.WebGLRenderTarget(1, 1, opts);
    this.uniforms = {
      tDiffuse: { value: null }, tMask: { value: this.maskRT.texture }, uTexel: { value: new THREE.Vector2(1, 1) },
      uLight: { value: new THREE.Vector2(0.5, 0.5) }, uAmount: { value: 0 }, uAspect: { value: 1 },
      uTime: { value: 0 }, uCoreR: { value: 0.07 }, uFall: { value: 0.3 },
    };
    const vertexShader = 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }';
    this.maskMat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader: /* glsl */`
        uniform sampler2D tDiffuse; uniform vec2 uTexel; uniform vec2 uLight; uniform float uAspect; uniform float uCoreR;
        varying vec2 vUv;
        vec3 tap(vec2 o) {
          vec3 c = min(texture2D(tDiffuse, vUv + o * uTexel).rgb, vec3(8.0));
          float l = dot(c, vec3(0.2126, 0.7152, 0.0722));
          return c * smoothstep(1.2, 3.0, l);
        }
        void main() {
          vec3 c = (tap(vec2(-1.0, -1.0)) + tap(vec2(1.0, -1.0)) + tap(vec2(-1.0, 1.0)) + tap(vec2(1.0, 1.0))) * 0.25;
          float nearCore = 1.0 - smoothstep(uCoreR * 0.5, uCoreR * 1.6, length((vUv - uLight) * vec2(uAspect, 1.0)));
          gl_FragColor = vec4(c * nearCore, 1.0);
        }`,
    });
    this.rayMat = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      defines: { SAMPLES: samples },
      vertexShader,
      fragmentShader: /* glsl */`
        uniform sampler2D tMask; uniform vec2 uLight; uniform float uAmount; uniform float uAspect;
        uniform float uTime; uniform float uFall;
        varying vec2 vUv;
        float hash(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
        void main() {
          vec2 toL = uLight - vUv;
          float dist = length(toL * vec2(uAspect, 1.0));
          vec2 stepUv = toL / float(SAMPLES);
          vec2 uv = vUv + stepUv * (0.5 + 0.5 * hash(vUv * 731.0 + fract(uTime * 0.37) * 17.0));
          vec3 acc = vec3(0.0);
          float w = 1.0;
          for (int i = 0; i < SAMPLES; i++) {
            acc += texture2D(tMask, uv).rgb * w;
            w *= 0.975;
            uv += stepUv;
          }
          gl_FragColor = vec4(acc * uAmount * exp(-dist / uFall) / float(SAMPLES), 1.0);
        }`,
    });
    this.addMat = new THREE.ShaderMaterial({
      uniforms: { tRays: { value: this.rayRT.texture } },
      vertexShader,
      fragmentShader: 'uniform sampler2D tRays; varying vec2 vUv; void main() { gl_FragColor = vec4(texture2D(tRays, vUv).rgb, 1.0); }',
      blending: THREE.AdditiveBlending, transparent: true, depthTest: false, depthWrite: false,
    });
    this.quad = new FullScreenQuad(this.maskMat);
  }
  setSize(width, height) {
    this.maskRT.setSize(Math.max(1, Math.round(width / 4)), Math.max(1, Math.round(height / 4)));
    this.rayRT.setSize(Math.max(1, Math.round(width / 2)), Math.max(1, Math.round(height / 2)));
    this.uniforms.uTexel.value.set(1 / Math.max(1, width), 1 / Math.max(1, height));
  }
  render(renderer, writeBuffer, readBuffer) {
    const autoClear = renderer.autoClear;
    renderer.autoClear = false;
    this.uniforms.tDiffuse.value = readBuffer.texture;
    renderer.setRenderTarget(this.maskRT);
    this.quad.material = this.maskMat;
    this.quad.render(renderer);
    renderer.setRenderTarget(this.rayRT);
    this.quad.material = this.rayMat;
    this.quad.render(renderer);
    renderer.setRenderTarget(readBuffer);
    this.quad.material = this.addMat;
    this.quad.render(renderer);
    renderer.autoClear = autoClear;
  }
}

// ───────────── Сцена ─────────────
async function createDigitalCore(container, cfg = CONFIG) {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const motion = reduceMotion ? 0 : 1;
  const G = cfg.glow ?? 1; // загальна яскравість світлових ефектів

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance', stencil: false });
  } catch (err) {
    container.classList.add('is-fallback');
    return null;
  }
  let dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.75 : 2);
  renderer.setPixelRatio(dpr);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  const rng = mulberry32(cfg.seed);
  const scene = new THREE.Scene();
  const bg = sceneColorFor(cfg.background, renderer.toneMappingExposure);
  scene.background = bg;
  scene.fog = new THREE.FogExp2(bg.clone(), 0.014);
  const lime = new THREE.Color(cfg.lime);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();

  // базовий ракурс камери: трохи згори і праворуч, як на референсі
  const AZ = THREE.MathUtils.degToRad(28), EL = THREE.MathUtils.degToRad(16);
  const Y_AXIS = new THREE.Vector3(0, 1, 0);
  const toCam = new THREE.Vector3(Math.sin(AZ) * Math.cos(EL), Math.sin(EL), Math.cos(AZ) * Math.cos(EL));
  const right = new THREE.Vector3().crossVectors(toCam.clone().negate(), Y_AXIS).normalize();
  const up = new THREE.Vector3().crossVectors(right, toCam.clone().negate()).normalize();
  const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 200);
  const rig = new THREE.Group();
  scene.add(rig);

  // світло
  const key = new THREE.DirectionalLight(0xfff0d8, 3.2);
  key.position.set(-6.5, 10, 7.5);
  key.castShadow = true;
  const smap = coarse ? 1024 : 2048;
  key.shadow.mapSize.set(smap, smap);
  Object.assign(key.shadow.camera, { left: -6, right: 6, top: 6, bottom: -6, near: 1, far: 30 });
  key.shadow.camera.updateProjectionMatrix();
  key.shadow.bias = -0.0004;
  key.shadow.normalBias = 0.03;
  scene.add(key);
  const rimLime = new THREE.DirectionalLight(0xc9e85c, 1.0);
  rimLime.position.set(8, 3, -8);
  scene.add(rimLime);
  const rimWarm = new THREE.DirectionalLight(0xf2e8d4, 0.7);
  rimWarm.position.set(-9, 1.5, -5);
  scene.add(rimWarm);
  scene.add(new THREE.HemisphereLight(0xdfe3d2, 0x161713, 0.4));
  const coreLight = new THREE.PointLight(0xd8f25c, 0, 0, 2);
  rig.add(coreLight);
  const sweep = new THREE.PointLight(0xfff3e0, 0, 0, 2);
  scene.add(sweep);

  // матеріали
  const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const tex = (canvas, srgb, repeat) => {
    const t = new THREE.CanvasTexture(canvas);
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = aniso;
    return t;
  };
  const surf = makeSurface(rng);
  const detailTex = tex(surf.detail, true, true);
  const bumpTex = tex(surf.bump, false, true);

  const creamParams = { color: cfg.cream, map: detailTex, bumpMap: bumpTex, bumpScale: 0.55, roughness: 0.84, metalness: 0, envMap: envTex, envMapIntensity: 0.25 };
  const darkParams = { color: cfg.graphite, map: detailTex, bumpMap: bumpTex, bumpScale: 0.45, roughness: 0.5, metalness: 0.1, envMap: envTex, envMapIntensity: 0.55 };
  const seedUv = (mat) => {
    mat.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nattribute float aSeed;')
        .replace('#include <uv_vertex>', `#include <uv_vertex>
          vec2 seedOffset = vec2(fract(aSeed * 7.137), fract(aSeed * 3.711));
          #ifdef USE_MAP
            vMapUv += seedOffset;
          #endif
          #ifdef USE_BUMPMAP
            vBumpMapUv += seedOffset;
          #endif`);
    };
    mat.customProgramCacheKey = () => 'webwork-seed-uv';
    return mat;
  };
  const creamMat = seedUv(new THREE.MeshStandardMaterial(creamParams));
  const darkMat = seedUv(new THREE.MeshStandardMaterial(darkParams));
  const plainCream = new THREE.MeshStandardMaterial(creamParams);
  const plainDark = new THREE.MeshStandardMaterial(darkParams);

  const glassU = {
    uGlowColor: { value: lime.clone() },
    uCore: { value: new THREE.Vector3() },
    uCoreI: { value: 0 },
    uBeatR: { value: -10 },
    uBeatAmp: { value: 0 },
  };
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x9cc240, roughness: 0.12, metalness: 0, envMap: envTex, envMapIntensity: 0.9,
    transparent: true, depthWrite: false, side: THREE.DoubleSide, fog: false,
    blending: THREE.CustomBlending,
    blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor,
    blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneMinusSrcAlphaFactor,
  });
  glassMat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, glassU);
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', `#include <common>
        attribute float aGlow;
        varying float vGlow;
        varying vec3 vLocalPos;
        varying vec3 vWorldG;`)
      .replace('#include <project_vertex>', `#include <project_vertex>
        vGlow = aGlow;
        vLocalPos = position;
        vec4 wG = vec4(transformed, 1.0);
        #ifdef USE_INSTANCING
          wG = instanceMatrix * wG;
        #endif
        vWorldG = (modelMatrix * wG).xyz;`);
    shader.fragmentShader = shader.fragmentShader
      .replace('#include <common>', `#include <common>
        uniform vec3 uGlowColor;
        uniform vec3 uCore;
        uniform float uCoreI;
        uniform float uBeatR;
        uniform float uBeatAmp;
        varying float vGlow;
        varying vec3 vLocalPos;
        varying vec3 vWorldG;`)
      .replace('#include <opaque_fragment>', `
        vec3 gA = abs(vLocalPos) * 2.0;
        float gMx = max(gA.x, max(gA.y, gA.z));
        float gMn = min(gA.x, min(gA.y, gA.z));
        float gMd = gA.x + gA.y + gA.z - gMx - gMn;
        float gEdge = smoothstep(0.84, 0.982, gMd);
        float gSide = gl_FrontFacing ? 1.0 : 0.45;
        float gFres = pow(1.0 - abs(dot(normalize(normal), normalize(vViewPosition))), 3.0);
        float gDist = length(vWorldG - uCore);
        float gCore = uCoreI * exp(-gDist * 1.4);
        float gW = (gDist - uBeatR) / 0.75;
        float gWave = uBeatAmp * exp(-gW * gW);
        float gGlow = vGlow * (0.35 + gCore) + gWave * 0.6;
        float gAlpha = clamp(0.06 + gFres * 0.55 + gEdge * gSide * (0.26 + 0.3 * vGlow), 0.0, 1.0);
        vec3 gEmit = uGlowColor * (gEdge * gSide * (0.05 + 1.5 * gGlow) + gGlow * 0.06 + gFres * gGlow * 0.25);
        outgoingLight = outgoingLight * gAlpha + gEmit;
        diffuseColor.a = gAlpha;
        #include <opaque_fragment>`);
  };
  glassMat.customProgramCacheKey = () => 'webwork-glass';

  // геометрія і розкладка
  const layout = buildLayout(rng, toCam, right, up);
  const records = layout.cubes;
  const cubeGeo = new RoundedBoxGeometry(1, 1, 1, 3, 0.065);
  const groups = { cream: [], dark: [], glass: [] };
  const featured = {};
  for (const c of records) {
    if (c.icon) featured[c.icon] = c;
    else groups[c.type].push(c);
  }
  const instanced = [];
  const tmpColor = new THREE.Color();
  const makeInstanced = (list, mat, shadows) => {
    const geo = cubeGeo.clone();
    const seeds = new Float32Array(list.length), glows = new Float32Array(list.length);
    const mesh = new THREE.InstancedMesh(geo, mat, list.length);
    list.forEach((c, i) => {
      seeds[i] = rng();
      glows[i] = c.glow || 0;
      c.mesh = mesh;
      c.index = i;
      if (c.type !== 'glass') {
        const v = c.type === 'cream' ? 0.93 + rng() * 0.1 : 0.82 + rng() * 0.32;
        tmpColor.setRGB(v, v * (0.99 + rng() * 0.02), v * (0.97 + rng() * 0.04));
        mesh.setColorAt(i, tmpColor);
      }
    });
    geo.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seeds, 1));
    geo.setAttribute('aGlow', new THREE.InstancedBufferAttribute(glows, 1));
    mesh.frustumCulled = false;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.castShadow = shadows;
    mesh.receiveShadow = shadows;
    rig.add(mesh);
    instanced.push(mesh);
    return mesh;
  };
  makeInstanced(groups.cream, creamMat, true);
  makeInstanced(groups.dark, darkMat, true);
  const glassMesh = makeInstanced(groups.glass, glassMat, false);
  glassMesh.renderOrder = 1;

  const iconOrder = ['cart', 'card', 'chart', 'gear'];
  for (const name of iconOrder) {
    const c = featured[name];
    if (!c) continue;
    const isDark = c.type === 'dark';
    const cv = iconCanvases(name, isDark ? cfg.graphite : cfg.cream, isDark, surf);
    const iconMat = new THREE.MeshStandardMaterial(Object.assign({}, isDark ? darkParams : creamParams, {
      color: 0xffffff, map: tex(cv.color, true, false), bumpMap: tex(cv.bump, false, false), bumpScale: 0.75,
      emissive: lime.clone(), emissiveMap: tex(cv.emit, true, false), emissiveIntensity: 0,
    }));
    const side = isDark ? plainDark : plainCream;
    const mesh = new THREE.Mesh(cubeGeo, [side, side, side, side, iconMat, side]);
    mesh.castShadow = mesh.receiveShadow = true;
    c.obj = mesh;
    c.iconMat = iconMat;
    c.actAt = -100;
    c.sparked = true;
    rig.add(mesh);
  }

  // серце ядра
  const heartMat = new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false });
  const heartBase = new THREE.Color(1.0, 1.12, 0.5);
  const heart = new THREE.Mesh(new RoundedBoxGeometry(1, 1, 1, 2, 0.08), heartMat);
  heart.scale.setScalar(0.38);
  rig.add(heart);
  const coreGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: radialTexture(), color: lime.clone(), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, fog: false }));
  coreGlow.scale.setScalar(4.4);
  coreGlow.renderOrder = 5;
  rig.add(coreGlow);
  const streak = new THREE.Sprite(new THREE.SpriteMaterial({ map: streakTexture(), color: 0xffffff, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false, transparent: true, fog: false }));
  streak.scale.set(11, 0.3, 1);
  streak.renderOrder = 6;
  rig.add(streak);

  // стан кожного куба
  for (const c of records) {
    c.r = c.home.length();
    c.dir = c.r > 1e-4 ? c.home.clone().divideScalar(c.r) : new THREE.Vector3();
    c.axis = dominantAxis(c.home);
    c.facing = c.dir.dot(toCam);
    c.cur = c.home.clone();
    c.slide = 0;
    c.pop = 0;
    c.phase = rng() * TAU;
    const far = c.sat ? 5 + rng() * 5 : 2.6 + rng() * 4.2;
    c.from = c.r > 1e-4 ? c.dir.clone().multiplyScalar(far).add(new THREE.Vector3(rng() - 0.5, rng() - 0.5, rng() - 0.5).multiplyScalar(2.2)) : new THREE.Vector3();
    c.delay = c.sat ? 1.15 + rng() * 0.9 : c.icon ? 1.05 + rng() * 0.35 : 0.3 + c.rn * 0.9 + rng() * 0.3;
    c.dur = 1.25 + rng() * 0.5;
    const ax = new THREE.Vector3(rng() - 0.5, rng() - 0.5, rng() - 0.5).normalize();
    c.q0 = new THREE.Quaternion().setFromAxisAngle(ax, (0.7 + rng() * 1.3) * (rng() < 0.5 ? -1 : 1));
  }

  // лінії
  const uScale = { value: 1 };
  const lineU = {
    uColor: { value: lime.clone() },
    uTime: { value: 0 }, uReveal: { value: 0 }, uBeatT: { value: 100 }, uBeatAmp: { value: 0 }, uMotion: { value: motion },
  };
  const paths = layout.paths;
  let segCount = 0;
  for (const p of paths) segCount += p.pts.length - 1;
  const lineGeo = new THREE.BoxGeometry(1, 1, 1);
  lineGeo.translate(0.5, 0, 0);
  const lineAttr = { aStart: [], aLen: [], aTotal: [], aPhase: [], aSpeed: [], aR0: [] };
  const lineMat = new THREE.ShaderMaterial({
    uniforms: lineU,
    vertexShader: /* glsl */`
      attribute float aStart; attribute float aLen; attribute float aTotal; attribute float aPhase; attribute float aSpeed; attribute float aR0;
      varying float vD; varying float vTotal; varying float vPhase; varying float vSpeed; varying float vR0;
      void main() {
        vD = aStart + position.x * aLen;
        vTotal = aTotal; vPhase = aPhase; vSpeed = aSpeed; vR0 = aR0;
        vec4 p = vec4(position, 1.0);
        #ifdef USE_INSTANCING
          p = instanceMatrix * p;
        #endif
        gl_Position = projectionMatrix * modelViewMatrix * p;
      }`,
    fragmentShader: /* glsl */`
      uniform vec3 uColor; uniform float uTime; uniform float uReveal; uniform float uBeatT; uniform float uBeatAmp; uniform float uMotion;
      varying float vD; varying float vTotal; varying float vPhase; varying float vSpeed; varying float vR0;
      void main() {
        float shown = uReveal * vTotal;
        if (vD > shown) discard;
        float period = vTotal / vSpeed + 1.8 + vPhase * 3.5;
        float head = mod(uTime + vPhase * 23.0, period) * vSpeed;
        float dd = head - vD;
        float packet = exp(-dd * dd * 70.0) + (dd > 0.0 ? exp(-dd * 2.8) * 0.4 : 0.0);
        float hb = uBeatT * ${WAVE.toFixed(2)} - vR0 - vD;
        float beat = uBeatAmp * (exp(-hb * hb * 30.0) + (hb > 0.0 ? exp(-hb * 1.6) * 0.3 : 0.0));
        float fd = shown - vD;
        float front = exp(-fd * fd * 40.0) * (1.0 - step(0.999, uReveal)) * 2.2;
        float tip = 1.0 - smoothstep(vTotal - 0.6, vTotal, vD) * 0.45;
        float b = 0.14 * tip + uMotion * (packet * 2.4 + beat * 2.6) + front;
        gl_FragColor = vec4(uColor * b, 1.0);
      }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  const lineMesh = new THREE.InstancedMesh(lineGeo, lineMat, Math.max(1, segCount));
  {
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), X = new THREE.Vector3(1, 0, 0), d = new THREE.Vector3(), s = new THREE.Vector3();
    let k = 0;
    const W = 0.013;
    for (const p of paths) {
      let acc = 0;
      for (let i = 0; i < p.pts.length - 1; i++) {
        const a = p.pts[i], b = p.pts[i + 1];
        d.subVectors(b, a);
        const L = d.length();
        d.normalize();
        q.setFromUnitVectors(X, d);
        s.set(L, W, W);
        m.compose(a, q, s);
        lineMesh.setMatrixAt(k, m);
        lineAttr.aStart.push(acc); lineAttr.aLen.push(L); lineAttr.aTotal.push(p.total);
        lineAttr.aPhase.push(p.phase); lineAttr.aSpeed.push(p.speed); lineAttr.aR0.push(p.r0);
        acc += L;
        k++;
      }
    }
    for (const [name, arr] of Object.entries(lineAttr)) lineGeo.setAttribute(name, new THREE.InstancedBufferAttribute(new Float32Array(arr.length ? arr : [0]), 1));
  }
  lineMesh.frustumCulled = false;
  lineMesh.renderOrder = 2;
  rig.add(lineMesh);

  // вузли на кінцях і зламах ліній
  const dotData = { position: [], aSize: [], aAt: [], aTotal: [], aPhase: [], aSpeed: [], aR0: [] };
  for (const p of paths) {
    let acc = 0;
    for (let i = 1; i < p.pts.length; i++) {
      acc += p.pts[i].distanceTo(p.pts[i - 1]);
      const isEnd = i === p.pts.length - 1;
      if (isEnd && p.endCube) continue;
      dotData.position.push(p.pts[i].x, p.pts[i].y, p.pts[i].z);
      dotData.aSize.push(isEnd ? 0.085 : 0.05);
      dotData.aAt.push(acc); dotData.aTotal.push(p.total); dotData.aPhase.push(p.phase); dotData.aSpeed.push(p.speed); dotData.aR0.push(p.r0);
    }
  }
  const dotGeo = new THREE.BufferGeometry();
  dotGeo.setAttribute('position', new THREE.Float32BufferAttribute(dotData.position, 3));
  for (const name of ['aSize', 'aAt', 'aTotal', 'aPhase', 'aSpeed', 'aR0']) dotGeo.setAttribute(name, new THREE.Float32BufferAttribute(dotData[name], 1));
  const dotMat = new THREE.ShaderMaterial({
    uniforms: { uColor: lineU.uColor, uTime: lineU.uTime, uReveal: lineU.uReveal, uBeatT: lineU.uBeatT, uBeatAmp: lineU.uBeatAmp, uMotion: lineU.uMotion, uScale },
    vertexShader: /* glsl */`
      uniform float uScale; uniform float uTime; uniform float uReveal; uniform float uBeatT; uniform float uBeatAmp; uniform float uMotion;
      attribute float aSize; attribute float aAt; attribute float aTotal; attribute float aPhase; attribute float aSpeed; attribute float aR0;
      varying float vI;
      void main() {
        float period = aTotal / aSpeed + 1.8 + aPhase * 3.5;
        float head = mod(uTime + aPhase * 23.0, period) * aSpeed;
        float dd = head - aAt;
        float flash = exp(-dd * dd * 5.0) * uMotion;
        float hb = uBeatT * ${WAVE.toFixed(2)} - aR0 - aAt;
        float beat = uBeatAmp * exp(-hb * hb * 3.0);
        float vis = smoothstep(aAt - 0.05, aAt + 0.05, uReveal * aTotal);
        vI = (0.5 + flash * 2.6 + beat * 2.2) * vis;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = min(aSize * (1.0 + 0.7 * flash + 0.5 * beat) * vis * uScale / -mv.z, 256.0);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */`
      uniform vec3 uColor;
      varying float vI;
      void main() {
        vec2 p = gl_PointCoord * 2.0 - 1.0;
        float r = length(p);
        float a = smoothstep(0.5, 0.28, r) + exp(-r * r * 6.0) * 0.45;
        if (a < 0.004) discard;
        gl_FragColor = vec4(uColor * vI * a, 1.0);
      }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  const dots = new THREE.Points(dotGeo, dotMat);
  dots.frustumCulled = false;
  dots.renderOrder = 3;
  rig.add(dots);

  // відблиски-зірочки
  const SPARKS = 24;
  const sparkGeo = new THREE.BufferGeometry();
  const sparkPos = new Float32Array(SPARKS * 3), sparkBirth = new Float32Array(SPARKS).fill(-100), sparkLife = new Float32Array(SPARKS).fill(1), sparkSize = new Float32Array(SPARKS), sparkRot = new Float32Array(SPARKS);
  sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPos, 3));
  sparkGeo.setAttribute('aBirth', new THREE.BufferAttribute(sparkBirth, 1));
  sparkGeo.setAttribute('aLife', new THREE.BufferAttribute(sparkLife, 1));
  sparkGeo.setAttribute('aSize', new THREE.BufferAttribute(sparkSize, 1));
  sparkGeo.setAttribute('aRot', new THREE.BufferAttribute(sparkRot, 1));
  const sparkMat = new THREE.ShaderMaterial({
    uniforms: { uTime: lineU.uTime, uScale, uColor: { value: new THREE.Color(1.0, 0.97, 0.82) } },
    vertexShader: /* glsl */`
      uniform float uTime; uniform float uScale;
      attribute float aBirth; attribute float aLife; attribute float aSize; attribute float aRot;
      varying float vA; varying float vRot;
      void main() {
        float t = (uTime - aBirth) / aLife;
        float env = (t > 0.0 && t < 1.0) ? sin(3.14159265 * t) : 0.0;
        env *= env;
        vA = env;
        vRot = aRot + t * 0.7;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = env > 0.0 ? min(aSize * (0.35 + 0.65 * env) * uScale / -mv.z, 320.0) : 0.0;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */`
      uniform vec3 uColor;
      varying float vA; varying float vRot;
      void main() {
        vec2 p = gl_PointCoord * 2.0 - 1.0;
        float c = cos(vRot), s = sin(vRot);
        p = mat2(c, -s, s, c) * p;
        float ax = abs(p.x), ay = abs(p.y);
        float star = exp(-ay * 46.0) * pow(max(0.0, 1.0 - ax), 3.0) + exp(-ax * 46.0) * pow(max(0.0, 1.0 - ay), 3.0);
        vec2 q = mat2(0.7071, -0.7071, 0.7071, 0.7071) * p;
        float qx = abs(q.x), qy = abs(q.y);
        float diag = (exp(-qy * 70.0) * pow(max(0.0, 1.0 - qx * 1.7), 3.0) + exp(-qx * 70.0) * pow(max(0.0, 1.0 - qy * 1.7), 3.0)) * 0.45;
        float core = exp(-dot(p, p) * 30.0);
        float v = (star + diag + core * 1.6) * vA;
        if (v < 0.002) discard;
        gl_FragColor = vec4(uColor * v * 3.2, 1.0);
      }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  const sparks = new THREE.Points(sparkGeo, sparkMat);
  sparks.frustumCulled = false;
  sparks.renderOrder = 4;
  rig.add(sparks);
  let sparkIdx = 0;
  const spawnSpark = (pos, t, size = 0.55, life = 0.7) => {
    const i = sparkIdx++ % SPARKS;
    sparkPos[i * 3] = pos.x; sparkPos[i * 3 + 1] = pos.y; sparkPos[i * 3 + 2] = pos.z;
    sparkBirth[i] = t;
    sparkLife[i] = life;
    sparkSize[i] = size;
    sparkRot[i] = Math.random() * 0.8 - 0.4;
    for (const name of ['position', 'aBirth', 'aLife', 'aSize', 'aRot']) sparkGeo.attributes[name].needsUpdate = true;
  };
  const sparkOuter = records.filter((c) => !c.sat && c.rn > 0.5 && c.facing > 0.15 && c.size > 0.3);
  const sparkInner = records.filter((c) => c.type === 'glass' && !c.sat && c.r < 1.8 && c.facing > -0.1);
  const camLocal = new THREE.Vector3();
  const cornerOf = (c, out) => {
    // кут, що дивиться в камеру (у локальних координатах rig)
    camLocal.copy(camera.position);
    rig.worldToLocal(camLocal);
    camLocal.sub(c.cur);
    const h = c.size * c.scaleNow * 0.49;
    out.set(Math.sign(camLocal.x) * h, Math.sign(camLocal.y) * h, Math.sign(camLocal.z) * h);
    const flip = Math.floor(Math.random() * 4);
    if (flip < 3) out.setComponent(flip, -out.getComponent(flip));
    out.add(c.cur);
    return out;
  };

  // пил і боке в повітрі
  const DUST = coarse ? 100 : 170;
  const dustPos = new Float32Array(DUST * 3), dustSize = new Float32Array(DUST), dustSeed = new Float32Array(DUST), dustSoft = new Float32Array(DUST), dustColor = new Float32Array(DUST * 3);
  {
    const camPos0 = toCam.clone().multiplyScalar(19);
    const fwd = toCam.clone().negate();
    const tanH = Math.tan(THREE.MathUtils.degToRad(14));
    const warm = new THREE.Color(1.0, 0.94, 0.82);
    for (let i = 0; i < DUST; i++) {
      const near = Math.random() < 0.1;
      const depth = near ? 4.5 + Math.random() * 6 : 9 + Math.random() * 34;
      const hh = tanH * depth * 1.25, hw = hh * 2.2;
      const p = camPos0.clone().addScaledVector(fwd, depth).addScaledVector(right, (Math.random() * 2 - 1) * hw).addScaledVector(up, (Math.random() * 2 - 1) * hh);
      dustPos.set([p.x, p.y, p.z], i * 3);
      dustSize[i] = near ? 0.12 + Math.random() * 0.22 : 0.018 + Math.random() * 0.035;
      dustSeed[i] = Math.random();
      dustSoft[i] = near ? 1 : 0;
      const col = Math.random() < 0.32 ? lime : warm;
      const k = 0.55 + Math.random() * 0.45;
      dustColor.set([col.r * k, col.g * k, col.b * k], i * 3);
    }
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  dustGeo.setAttribute('aSize', new THREE.BufferAttribute(dustSize, 1));
  dustGeo.setAttribute('aSeed', new THREE.BufferAttribute(dustSeed, 1));
  dustGeo.setAttribute('aSoft', new THREE.BufferAttribute(dustSoft, 1));
  dustGeo.setAttribute('aColor', new THREE.BufferAttribute(dustColor, 3));
  const dustMat = new THREE.ShaderMaterial({
    uniforms: { uTime: lineU.uTime, uScale, uMotion: lineU.uMotion },
    vertexShader: /* glsl */`
      uniform float uTime; uniform float uScale; uniform float uMotion;
      attribute float aSize; attribute float aSeed; attribute float aSoft; attribute vec3 aColor;
      varying float vSoft; varying vec3 vColor; varying float vTw;
      void main() {
        vec3 p = position;
        float s = aSeed * 6.2831853;
        p += uMotion * vec3(sin(uTime * 0.11 + s) * 0.35, sin(uTime * 0.08 + s * 1.7) * 0.45, cos(uTime * 0.09 + s * 0.6) * 0.3);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = clamp(aSize * uScale / -mv.z, 1.5, 420.0);
        vTw = 0.55 + 0.45 * sin(uTime * (0.6 + aSeed * 1.7) * (0.3 + 0.7 * uMotion) + s * 3.0);
        vSoft = aSoft;
        vColor = aColor;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */`
      varying float vSoft; varying vec3 vColor; varying float vTw;
      void main() {
        vec2 p = gl_PointCoord * 2.0 - 1.0;
        float r = length(p);
        if (r > 1.0) discard;
        float a = vSoft > 0.5
          ? smoothstep(1.0, 0.84, r) * (0.55 + 0.45 * smoothstep(0.5, 0.92, r)) * 0.035
          : exp(-r * r * 7.0) * 0.7;
        gl_FragColor = vec4(vColor * a * vTw, 1.0);
      }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  const dust = new THREE.Points(dustGeo, dustMat);
  dust.frustumCulled = false;
  dust.renderOrder = 7;
  scene.add(dust);

  // м'який ореол позаду і світло на підлозі
  const hazeMat = new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(0.017, 0.019, 0.011) }, uLime: { value: lime.clone() }, uI: { value: 0 } },
    vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */`
      uniform vec3 uColor; uniform vec3 uLime; uniform float uI;
      varying vec2 vUv;
      void main() {
        vec2 p = vUv - 0.5;
        float r2 = dot(p, p);
        vec3 col = uColor * exp(-r2 * 36.0) * (0.6 + 0.4 * uI) + uLime * 0.016 * uI * exp(-r2 * 90.0);
        gl_FragColor = vec4(col, 1.0);
      }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });
  const haze = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), hazeMat);
  haze.scale.setScalar(34);
  haze.renderOrder = -1;
  scene.add(haze);

  const floorMat = new THREE.ShaderMaterial({
    uniforms: { uBg: { value: bg.clone() }, uLime: { value: lime.clone() }, uGlow: { value: 0 }, uCenter: { value: new THREE.Vector2() } },
    vertexShader: `varying vec3 vW; void main() { vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: /* glsl */`
      uniform vec3 uBg; uniform vec3 uLime; uniform float uGlow; uniform vec2 uCenter;
      varying vec3 vW;
      void main() {
        vec2 d = vW.xz - uCenter;
        float r2 = dot(d, d);
        float shade = exp(-r2 * 0.09) * 0.5;
        float glow = (exp(-r2 * 0.05) * 0.05 + exp(-r2 * 0.4) * 0.12) * uGlow;
        gl_FragColor = vec4(uBg * (1.0 - shade) + uLime * glow, 1.0);
      }`,
    depthWrite: false,
  });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(90, 90), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -4.8;
  floor.renderOrder = -2;
  scene.add(floor);

  // постобробка
  const ext = renderer.extensions;
  const floatRT = ext.has('EXT_color_buffer_float') || ext.has('EXT_color_buffer_half_float');
  const rt = new THREE.WebGLRenderTarget(1, 1, { type: floatRT ? THREE.HalfFloatType : THREE.UnsignedByteType, samples: coarse ? 2 : 4 });
  const composer = new EffectComposer(renderer, rt);
  composer.addPass(new RenderPass(scene, camera));
  // промені світла від ядра крізь щілини між кубами (у половинній роздільності)
  const shafts = new LightShaftsPass(coarse ? 32 : 48);
  composer.addPass(shafts);
  const bloom = new UnrealBloomPass(new THREE.Vector2(512, 512), 0.55, 0.35, 1.0);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());
  const finish = new ShaderPass({
    uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uGrain: { value: 0.022 }, uCA: { value: 0.7 }, uRes: { value: new THREE.Vector2(1, 1) } },
    vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */`
      uniform sampler2D tDiffuse; uniform float uTime; uniform float uGrain; uniform float uCA; uniform vec2 uRes;
      varying vec2 vUv;
      float hash(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
      void main() {
        vec2 c = vUv - 0.5;
        vec2 off = c * dot(c, c) * uCA * 0.018;
        vec3 col = vec3(texture2D(tDiffuse, vUv - off).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv + off).b);
        col += (hash(vUv * uRes + fract(uTime * 7.31) * 113.0) - 0.5) * uGrain;
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
  composer.addPass(finish);

  // розмір і кадрування
  let baseDist = 18;
  const fovRad = THREE.MathUtils.degToRad(camera.fov);
  function resize() {
    const w = Math.max(1, container.clientWidth), h = Math.max(1, container.clientHeight);
    renderer.setSize(w, h, false);
    composer.setPixelRatio(dpr);
    composer.setSize(w, h);
    camera.aspect = w / h;
    const hFov = 2 * Math.atan(Math.tan(fovRad / 2) * camera.aspect);
    baseDist = 4.9 / Math.sin(Math.min(fovRad, hFov) / 2);
    // на вузьких екранах ядро піднімаємо вгору, щоб не лягало на заголовок
    const portrait = w < h * 0.9;
    const sx = portrait ? 0 : cfg.shiftX, sy = portrait ? 0.13 : 0;
    if (sx || sy) camera.setViewOffset(w, h, -sx * w, sy * h, w, h);
    else camera.clearViewOffset();
    camera.updateProjectionMatrix();
    uScale.value = renderer.domElement.height / (2 * Math.tan(fovRad / 2));
    finish.uniforms.uRes.value.set(renderer.domElement.width, renderer.domElement.height);
    shafts.uniforms.uAspect.value = camera.aspect;
  }
  resize();
  new ResizeObserver(resize).observe(container);

  // взаємодія
  const pointer = new THREE.Vector2(), pointerTarget = new THREE.Vector2();
  let pointerInside = false;
  window.addEventListener('pointermove', (e) => {
    const r = container.getBoundingClientRect();
    pointerTarget.set(clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1.2, 1.2), clamp(-(((e.clientY - r.top) / r.height) * 2 - 1), -1.2, 1.2));
    pointerInside = e.pointerType === 'mouse';
  }, { passive: true });
  document.documentElement.addEventListener('mouseleave', () => { pointerTarget.set(0, 0); pointerInside = false; });

  // ритм: серцебиття, ковзання блоків, іконки
  let t = 0;
  let beatTime = -100, beatStrength = 0, beatCount = 0, nextBeat = motion ? 2.9 : 1.2;
  let nextSlide = 3.4, nextSpark = 2.4, hover = 0;
  const slides = [];
  const slideCands = records.filter((c) => !c.sat && !c.icon && !c.core && c.rn > 0.62 && c.size > 0.4);
  const featuredList = iconOrder.map((n) => featured[n]).filter(Boolean);
  const triggerBeat = (strength) => {
    beatTime = t;
    beatStrength = strength;
    beatCount++;
    nextBeat = t + lerp(cfg.beatEvery[0], cfg.beatEvery[1], Math.random());
    if (beatCount % 2 === 1) featuredList.forEach((c, i) => { c.actAt = t + 0.55 + i * 0.42; c.sparked = false; });
  };
  container.addEventListener('pointerdown', () => { if (t > 2.2 && t - beatTime > 0.6) triggerBeat(1.35); });

  function ignite(x) {
    if (!motion) return 1;
    if (x < 0.15) return 0;
    if (x < 0.85) {
      const u = (x - 0.15) / 0.7;
      const flick = 0.55 + 0.45 * Math.sign(Math.sin(u * 41 + Math.sin(u * 13) * 2));
      return u * u * flick * 1.4;
    }
    return 1 + 0.8 * Math.exp(-(x - 0.85) * 2.6);
  }

  const _m = new THREE.Matrix4(), _p = new THREE.Vector3(), _q = new THREE.Quaternion(), _qi = new THREE.Quaternion(), _s = new THREE.Vector3();
  const _v = new THREE.Vector3(), _w = new THREE.Vector3(), camDir = new THREE.Vector3();

  function update(dt) {
    t += dt;
    pointer.lerp(pointerTarget, 1 - Math.exp(-dt * 2.6));
    if (t >= nextBeat) triggerBeat(beatCount === 0 ? 1.25 : 0.85 + Math.random() * 0.3);

    // камера: в'їзд, повільний дрейф, паралакс
    const intro = motion ? 1 - easeOutCubic(clamp(t / 3.6, 0, 1)) : 0;
    const dist = baseDist * (1 + 0.15 * intro);
    camDir.copy(toCam).applyAxisAngle(Y_AXIS, intro * 0.18);
    camera.position.copy(camDir).multiplyScalar(dist)
      .addScaledVector(right, pointer.x * 0.6 * motion)
      .addScaledVector(up, pointer.y * 0.4 * motion);
    camera.lookAt(0, 0, 0);

    rig.rotation.y = motion * (0.17 * Math.sin(t * 0.1) + pointer.x * 0.16);
    rig.rotation.x = motion * (0.045 * Math.sin(t * 0.083 + 1.3) - pointer.y * 0.07);
    rig.position.y = motion * 0.08 * Math.sin(t * 0.42);
    rig.updateMatrixWorld();

    // курсор біля ядра — конструкція розкривається
    _v.set(0, 0, 0).applyMatrix4(rig.matrixWorld).project(camera);
    const pd = Math.hypot((pointer.x - _v.x) * camera.aspect, pointer.y - _v.y);
    const rC = 3.6 / (dist * Math.tan(fovRad / 2));
    const hoverTarget = pointerInside && motion ? smoothstep(rC * 1.25, rC * 0.3, pd) : 0;
    hover = lerp(hover, hoverTarget, 1 - Math.exp(-dt * 2.2));

    // пульс ядра
    const bt = t - beatTime;
    const lub = bt >= 0 ? Math.exp(-bt * 5.5) : 0;
    const dub = bt > 0.24 ? Math.exp(-(bt - 0.24) * 6.5) * 0.55 : 0;
    const pulse = beatStrength * (lub + dub);
    const ign = ignite(t);
    const shimmer = 1 + 0.05 * Math.sin(t * 17.3) * Math.sin(t * 7.1) * motion;
    const core = ign * (1 + 0.14 * Math.sin(t * 1.3) + 1.1 * pulse) * shimmer;
    coreLight.intensity = 6 * core * G;
    heartMat.color.copy(heartBase).multiplyScalar((2.8 + 2.2 * core) * clamp(ign, 0, 1) * G);
    heart.rotation.x += dt * 0.35 * motion;
    heart.rotation.y += dt * 0.55 * motion;
    coreGlow.material.color.copy(lime).multiplyScalar(0.38 * core * G);
    streak.material.color.setRGB(1, 1, 0.78).multiplyScalar((0.09 + 0.22 * pulse) * Math.min(ign, 1.4) * G);
    hazeMat.uniforms.uI.value = core * G;
    floorMat.uniforms.uGlow.value = core * G;
    floorMat.uniforms.uCenter.value.set(rig.position.x, rig.position.z);
    bloom.strength = (0.55 + 0.18 * Math.min(pulse, 1.5)) * G;
    _w.setFromMatrixPosition(rig.matrixWorld).project(camera);
    shafts.uniforms.uLight.value.set(_w.x * 0.5 + 0.5, _w.y * 0.5 + 0.5);
    shafts.uniforms.uAmount.value = (1.8 + 1.8 * pulse) * Math.min(ign, 1.5) * G;
    shafts.uniforms.uTime.value = t;
    const uvPerUnit = 1 / (2 * dist * Math.tan(fovRad / 2));
    shafts.uniforms.uCoreR.value = 0.75 * uvPerUnit;
    shafts.uniforms.uFall.value = 2.8 * uvPerUnit;

    const waveAmp = beatStrength * motion;
    const waveR = bt * WAVE;
    glassU.uCore.value.setFromMatrixPosition(rig.matrixWorld);
    glassU.uCoreI.value = 0.6 * core * G;
    glassU.uBeatR.value = waveR;
    glassU.uBeatAmp.value = beatStrength * Math.exp(-bt * 0.5);
    lineU.uTime.value = t;
    lineU.uBeatT.value = bt;
    lineU.uBeatAmp.value = beatStrength;
    lineU.uReveal.value = motion ? easeInOutCubic(clamp((t - 1.6) / 1.5, 0, 1)) : 1;
    finish.uniforms.uTime.value = t;

    // світлова «розгортка» по фасаду
    const sp = t > 4 ? ((t - 4) % 10.5) / 3.4 : 2;
    if (motion && sp < 1) {
      sweep.position.copy(toCam).multiplyScalar(6.5).addScaledVector(right, lerp(-7, 7, easeInOutCubic(sp))).addScaledVector(up, 2.2);
      sweep.intensity = 18 * G * Math.sin(Math.PI * sp);
    } else sweep.intensity = 0;

    // ковзання окремих блоків по осі
    if (motion && t > nextSlide && slides.length < 3 && slideCands.length) {
      const c = slideCands[Math.floor(Math.random() * slideCands.length)];
      if (!c.sliding) {
        c.sliding = true;
        slides.push({ c, t0: t, amt: (0.3 + Math.random() * 0.35) * Math.max(c.size, 0.6), hold: 1.4 + Math.random() * 1.8, dur: 0.85 });
      }
      nextSlide = t + 0.6 + Math.random() * 1.2;
    }
    for (let i = slides.length - 1; i >= 0; i--) {
      const s = slides[i], u = t - s.t0;
      let k;
      if (u < s.dur) k = easeInOutCubic(u / s.dur);
      else if (u < s.dur + s.hold) k = 1;
      else if (u < 2 * s.dur + s.hold) k = 1 - easeInOutCubic((u - s.dur - s.hold) / s.dur);
      else { s.c.slide = 0; s.c.sliding = false; slides.splice(i, 1); continue; }
      s.c.slide = s.amt * k;
    }

    // іконки спалахують по черзі: магазин → оплата → аналітика → автоматизація
    for (const c of featuredList) {
      const u = t - c.actAt;
      const env = u > 0 ? (1 - Math.exp(-u * 14)) * Math.exp(-u * 1.5) : 0;
      c.iconMat.emissiveIntensity = 0.03 + 3.0 * env * G;
      c.pop = 0.03 * env * motion;
      if (u > 0 && !c.sparked && c.scaleNow) {
        c.sparked = true;
        spawnSpark(cornerOf(c, _w), t, 0.75, 0.8);
      }
    }

    // позиції кубів
    for (const c of records) {
      let e = 1;
      if (motion && t < 4.5) {
        const u = (t - c.delay) / c.dur;
        e = u <= 0 ? 0 : u >= 1 ? 1 : easeOutExpo(u);
      }
      _p.copy(c.home).addScaledVector(c.from, 1 - e);
      const wv = (waveR - c.r) / 0.85;
      const wave = waveAmp * Math.exp(-wv * wv);
      const breath = motion * 0.02 * Math.sin(t * 0.9 - c.r * 0.9 + c.phase * 0.3);
      _p.addScaledVector(c.dir, wave * 0.14 + breath + hover * (0.05 + 0.2 * Math.min(c.rn, 1)));
      if (c.slide) _p.addScaledVector(c.axis, c.slide);
      if (c.sat && !c.anchored) _p.y += Math.sin(t * 0.55 + c.phase) * 0.09 * motion;
      if (e < 1) _q.copy(c.q0).slerp(_qi, e); else _q.identity();
      c.scaleNow = e <= 0 ? 0 : lerp(0.4, 1, e) * (1 + c.pop);
      _s.setScalar(Math.max(1e-4, c.size * c.scaleNow));
      c.cur.copy(_p);
      if (c.obj) { c.obj.position.copy(_p); c.obj.quaternion.copy(_q); c.obj.scale.copy(_s); }
      else { _m.compose(_p, _q, _s); c.mesh.setMatrixAt(c.index, _m); }
    }
    for (const m of instanced) m.instanceMatrix.needsUpdate = true;

    // відблиски на гранях
    if (t > 2.4 && t >= nextSpark && sparkOuter.length) {
      const pool = Math.random() < 0.3 && sparkInner.length ? sparkInner : sparkOuter;
      const c = pool[Math.floor(Math.random() * pool.length)];
      if (c.scaleNow > 0.9) spawnSpark(cornerOf(c, _w), t, 0.4 + Math.random() * 0.35, 0.55 + Math.random() * 0.35);
      nextSpark = t + (motion ? 0.12 + Math.random() * 0.34 : 1.2 + Math.random());
    }

    // ореол завжди дивиться в камеру
    haze.position.setFromMatrixPosition(rig.matrixWorld).addScaledVector(camDir, -7);
    haze.quaternion.copy(camera.quaternion);
  }

  // адаптивна якість: якщо пристрій не тягне 45+ fps — знижуємо роздільність
  let perfAcc = 0, perfFrames = 0, perfChecks = 0;
  function adapt(dt) {
    if (t < 4 || perfChecks > 6) return;
    perfAcc += dt;
    perfFrames++;
    if (perfAcc < 2) return;
    const avg = perfAcc / perfFrames;
    perfAcc = 0; perfFrames = 0; perfChecks++;
    if (avg > 1 / 42 && dpr > 1) {
      dpr = Math.max(1, dpr - 0.35);
      renderer.setPixelRatio(dpr);
      resize();
    } else if (avg > 1 / 34 && key.castShadow) {
      key.castShadow = false;
    }
  }

  await renderer.compileAsync(scene, camera);
  container.classList.add('is-live');

  let raf = 0, last = performance.now(), visible = true;
  function loop(now) {
    raf = 0;
    if (!visible) return;
    raf = requestAnimationFrame(loop);
    const dt = Math.min(Math.max((now - last) / 1000, 0), 1 / 20);
    last = now;
    update(dt);
    composer.render(dt);
    adapt(dt);
  }
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !raf) { last = performance.now(); raf = requestAnimationFrame(loop); }
  }).observe(container);
  raf = requestAnimationFrame(loop);

  return { pulse: () => triggerBeat(1.35) };
}


(function mountHeroCore() {
  var hero = document.querySelector('[data-hero]');
  if (!hero) return;
  var stage = document.createElement('div');
  stage.className = 'core-stage';
  stage.setAttribute('aria-hidden', 'true');
  hero.insertBefore(stage, hero.firstChild);
  createDigitalCore(stage).then(function (api) {
    if (api) stage.core = api;
  }).catch(function (err) {
    console.error(err);
    stage.classList.add('is-fallback');
  });
})();
