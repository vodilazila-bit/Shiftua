/*! WEBWORK hero: a living neural network. Canvas 2D, no libraries. */
(function () {
  'use strict';

  var hero = document.querySelector('[data-hero]');
  var canvas = hero && hero.querySelector('.hero-canvas');
  var ctx = canvas && canvas.getContext && canvas.getContext('2d');
  if (!ctx) return;

  var still = /[?&]still\b/.test(location.search) ||
    !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  var small = Math.min(screen.width, screen.height) < 700 || window.innerWidth < 700;
  var N = small ? 92 : 168;
  var F = 3.4;                 // perspective focal length, cloud radius = 1
  var MAXP = small ? 46 : 80;  // signals alive at once

  var seed = 20261015;
  function rnd() {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }

  /* ---------- graph: neurons in a loose ellipsoid, denser in the middle ---------- */
  var nodes = [], edges = [], adj = [];
  (function build() {
    var i, j, k;
    for (i = 0; i < N; i++) {
      var x, y, z, l;
      do { x = rnd() * 2 - 1; y = rnd() * 2 - 1; z = rnd() * 2 - 1; l = x * x + y * y + z * z; }
      while (l > 1 || rnd() > 1 - 0.5 * l);
      nodes.push({ x: x * 1.18, y: y * 0.92, z: z * 0.95, a: 0, ref: 0, sx: 0, sy: 0, d: 0.5, g: still ? 1 : 0,
        born: 0.1 + Math.sqrt(l) * 0.9 + rnd() * 0.25, big: rnd() < 0.12 });
      adj.push([]);
    }
    var seen = {};
    function link(a, b) {
      if (a === b) return;
      var key = a < b ? a + '_' + b : b + '_' + a;
      if (seen[key]) return;
      seen[key] = 1;
      var p = nodes[a], q = nodes[b];
      var ex = q.x - p.x, ey = q.y - p.y, ez = q.z - p.z, len = Math.sqrt(ex * ex + ey * ey + ez * ez);
      var px = ey * 0.3 - ez * 0.9, py = ez * 0.2 - ex * 0.3, pz = ex * 0.9 - ey * 0.2;
      var pl = Math.sqrt(px * px + py * py + pz * pz) || 1, bend = (rnd() - 0.5) * 0.55 * len;
      edges.push({ a: a, b: b, len: Math.max(len, 0.12),
        cx: (p.x + q.x) / 2 + px / pl * bend, cy: (p.y + q.y) / 2 + py / pl * bend, cz: (p.z + q.z) / 2 + pz / pl * bend,
        csx: 0, csy: 0, heat: 0 });
      adj[a].push(edges.length - 1);
      adj[b].push(edges.length - 1);
    }
    for (i = 0; i < N; i++) {
      var near = [];
      for (j = 0; j < N; j++) {
        if (j === i) continue;
        var dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y, dz = nodes[i].z - nodes[j].z;
        near.push([dx * dx + dy * dy + dz * dz, j]);
      }
      near.sort(function (m, n) { return m[0] - n[0]; });
      for (k = 0; k < 3; k++) link(i, near[k][1]);
      if (rnd() < 0.1) link(i, near[4 + Math.floor(rnd() * 10)][1]);
    }
  })();

  /* ---------- sprites ---------- */
  function glowSprite(rgb, size) {
    var c = document.createElement('canvas');
    c.width = c.height = size;
    var g = c.getContext('2d');
    var grd = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    grd.addColorStop(0, 'rgba(' + rgb + ',0.95)');
    grd.addColorStop(0.3, 'rgba(' + rgb + ',0.4)');
    grd.addColorStop(1, 'rgba(' + rgb + ',0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, size, size);
    return c;
  }
  var GLOW = glowSprite('181,194,74', 64);
  var CS = getComputedStyle(document.documentElement);
  var NET = (CS.getPropertyValue('--net-rgb') || '').trim() || '18,21,16';
  var HOT = (CS.getPropertyValue('--net-hot') || '').trim() || '122,138,30';
  var DOT = (CS.getPropertyValue('--net-dot') || '').trim() || '#5c6914';

  /* ---------- layout: the cloud sits in the free space next to / above the headline ---------- */
  var L = { W: 1, H: 1, cx: 0, cy: 0, r: 100, dpr: 1 };
  var quality = 1;
  function measure() {
    var hr = hero.getBoundingClientRect();
    var W = Math.max(1, hr.width), H = Math.max(1, hr.height);
    var header = document.querySelector('.site-header');
    var hb = header ? Math.max(56, header.getBoundingClientRect().bottom) : 72;
    var title = hero.querySelector('.hero-title');
    var tr = title ? title.getBoundingClientRect() : null;
    var g = Math.max(16, Math.min(48, W * 0.032));
    var cx, cy, hw, hh;
    if (W >= 900 && W / H >= 1.05) {
      var left = Math.max((tr ? tr.right - hr.left : W * 0.5) + 24, W * 0.46), right = W - g;
      var top = hb + 10, bottom = H - 40;
      cx = (left + right) / 2; cy = (top + bottom) / 2; hw = (right - left) / 2; hh = (bottom - top) / 2;
    } else {
      var t2 = hb + 6, b2 = (tr ? tr.top - hr.top : H * 0.5) - 10;
      var avail = Math.max(b2 - t2, H * 0.26);
      cx = W / 2; cy = t2 + avail / 2; hw = (W - 2 * g) / 2; hh = avail / 2;
    }
    var dpr = Math.min(window.devicePixelRatio || 1, 2) * quality;
    L = { W: W, H: H, cx: cx, cy: cy, r: Math.max(70, Math.min(hw / 1.25, hh / 1.02)), dpr: dpr };
    canvas.width = Math.max(1, Math.round(W * dpr));
    canvas.height = Math.max(1, Math.round(H * dpr));
  }

  /* ---------- signals ---------- */
  var pulses = [];
  function fire(i, str, fromEdge) {
    var n = nodes[i];
    if (n.ref > 0) return;
    n.a = 1;
    n.ref = 0.5;
    var list = adj[i];
    for (var k = 0; k < list.length; k++) {
      var ei = list[k];
      if (ei === fromEdge) continue;
      if (pulses.length >= MAXP) break;
      if (Math.random() < 0.62 * str) {
        var e = edges[ei];
        pulses.push({ e: ei, dir: e.a === i ? 1 : -1, t: 0, str: str * 0.86, sp: 0.8 + Math.random() * 0.5 });
      }
    }
  }

  var t = 0, yaw = 0.5, yawOff = 0, pitchOff = 0, tyaw = 0, tpitch = 0;
  var scroll = 0, spont = 0.4, introFired = false, pointer = null;
  var hover = !!(window.matchMedia && matchMedia('(hover: hover)').matches);
  var R = small ? 80 : 120;

  function ease(x) { x = x < 0 ? 0 : x > 1 ? 1 : x; return 1 - Math.pow(1 - x, 3); }

  function update(dt, now) {
    t += dt;
    yaw += dt * (0.085 + scroll * 0.35);
    yawOff += (tyaw - yawOff) * Math.min(1, dt * 3);
    pitchOff += (tpitch - pitchOff) * Math.min(1, dt * 3);
    var i, n;
    for (i = 0; i < N; i++) {
      n = nodes[i];
      if (n.g < 1) n.g = ease((t - n.born * 0.55) / 0.8);
      n.a *= Math.exp(-2.3 * dt);
      n.ref -= dt;
    }
    if (!introFired && t > 0.75) {
      introFired = true;
      var best = 0, bd = 9;
      for (i = 0; i < N; i++) { var q = nodes[i], d = q.x * q.x + q.y * q.y + q.z * q.z; if (d < bd) { bd = d; best = i; } }
      fire(best, 1.5);
    }
    spont -= dt;
    if (spont <= 0 && t > 1) {
      fire(Math.floor(Math.random() * N), 0.9);
      spont = (small ? 0.4 : 0.26) + Math.random() * 0.45;
    }
    for (i = pulses.length - 1; i >= 0; i--) {
      var p = pulses[i], e = edges[p.e];
      p.t += dt * p.sp / e.len;
      if (p.t >= 1) {
        pulses.splice(i, 1);
        var target = p.dir > 0 ? e.b : e.a;
        e.heat = 1;
        fire(target, p.str, p.e);
      }
    }
    for (i = 0; i < edges.length; i++) if (edges[i].heat > 0) edges[i].heat *= Math.exp(-3 * dt);
    if (pointer) {
      if (!hover && now - pointer.time > 1200) pointer = null;
      else {
        for (i = 0; i < N; i++) {
          n = nodes[i];
          var dx = n.sx - pointer.x, dy = n.sy - pointer.y, d2 = dx * dx + dy * dy;
          if (d2 < R * R) {
            var k = 1 - Math.sqrt(d2) / R;
            if (n.a < 0.6 * k) n.a = 0.6 * k;
            if (Math.random() < dt * 1.6 * k) fire(i, 0.85);
          }
        }
      }
    }
  }

  /* ---------- drawing ---------- */
  var cyw = 1, syw = 0, cp = 1, sp = 0;
  function proj(x, y, z, g, out, cx, cy) {
    x *= g; y *= g; z *= g;
    var X = x * cyw - z * syw, Z = x * syw + z * cyw;
    var Y = y * cp - Z * sp; Z = y * sp + Z * cp;
    var s = F / (F - Z);
    out[cx] = L.cx + X * s * L.r;
    out[cy] = L.cy - scroll * L.H * 0.22 - Y * s * L.r;
    return Z;
  }

  var ALPHA = [0.06, 0.1, 0.15, 0.23], WIDTH = [0.6, 0.75, 0.9, 1.05];
  var NODE_A = [0.22, 0.36, 0.52, 0.7, 0.88];
  var buckets = [[], [], [], []], nb = [[], [], [], [], []];

  function render() {
    var i, j, n, e, a, b;
    ctx.setTransform(L.dpr, 0, 0, L.dpr, 0, 0);
    ctx.clearRect(0, 0, L.W, L.H);
    ctx.globalAlpha = 1 - 0.6 * scroll;

    var Y = yaw + yawOff, Pt = -0.16 + pitchOff;
    cyw = Math.cos(Y); syw = Math.sin(Y); cp = Math.cos(Pt); sp = Math.sin(Pt);

    for (i = 0; i < N; i++) {
      n = nodes[i];
      n.d = (proj(n.x, n.y, n.z, n.g, n, 'sx', 'sy') + 1) / 2;
    }
    for (i = 0; i < 4; i++) buckets[i].length = 0;
    for (i = 0; i < edges.length; i++) {
      e = edges[i]; a = nodes[e.a]; b = nodes[e.b];
      var g = Math.min(a.g, b.g);
      if (g < 0.05) continue;
      proj(e.cx, e.cy, e.cz, g, e, 'csx', 'csy');
      var bi = Math.min(3, Math.floor((a.d + b.d) * 2));
      buckets[bi].push(e);
    }

    // connections, far ones fainter
    ctx.lineCap = 'round';
    for (j = 0; j < 4; j++) {
      var list = buckets[j];
      if (!list.length) continue;
      ctx.beginPath();
      for (i = 0; i < list.length; i++) {
        e = list[i]; a = nodes[e.a]; b = nodes[e.b];
        ctx.moveTo(a.sx, a.sy);
        ctx.quadraticCurveTo(e.csx, e.csy, b.sx, b.sy);
      }
      ctx.strokeStyle = 'rgba(' + NET + ',' + ALPHA[j] + ')';
      ctx.lineWidth = WIDTH[j];
      ctx.stroke();
    }
    // paths a signal just crossed
    for (i = 0; i < edges.length; i++) {
      e = edges[i];
      if (e.heat < 0.04) continue;
      a = nodes[e.a]; b = nodes[e.b];
      if (Math.min(a.g, b.g) < 0.05) continue;
      ctx.beginPath();
      ctx.moveTo(a.sx, a.sy);
      ctx.quadraticCurveTo(e.csx, e.csy, b.sx, b.sy);
      ctx.strokeStyle = 'rgba(' + HOT + ',' + (0.75 * e.heat).toFixed(3) + ')';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }

    // neurons
    for (i = 0; i < 5; i++) nb[i].length = 0;
    for (i = 0; i < N; i++) { n = nodes[i]; if (n.g > 0.02) nb[Math.min(4, Math.floor(n.d * 5))].push(n); }
    for (j = 0; j < 5; j++) {
      if (!nb[j].length) continue;
      ctx.beginPath();
      for (i = 0; i < nb[j].length; i++) {
        n = nb[j][i];
        var r = (0.9 + 1.9 * n.d) * (n.big ? 1.7 : 1) * n.g;
        ctx.moveTo(n.sx + r, n.sy);
        ctx.arc(n.sx, n.sy, r, 0, 6.2832);
      }
      ctx.fillStyle = 'rgba(' + NET + ',' + NODE_A[j] + ')';
      ctx.fill();
    }

    // signals
    for (i = 0; i < pulses.length; i++) {
      var p = pulses[i];
      e = edges[p.e]; a = nodes[e.a]; b = nodes[e.b];
      var tt = p.dir > 0 ? p.t : 1 - p.t;
      ctx.beginPath();
      for (j = 0; j <= 5; j++) {
        var u = tt - p.dir * 0.28 * (j / 5);
        if (u < 0 || u > 1) continue;
        var w = 1 - u, x = w * w * a.sx + 2 * w * u * e.csx + u * u * b.sx, y = w * w * a.sy + 2 * w * u * e.csy + u * u * b.sy;
        if (j === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        if (j === 0) { p.x = x; p.y = y; }
      }
      ctx.strokeStyle = 'rgba(' + HOT + ',0.9)';
      ctx.lineWidth = 1.7;
      ctx.stroke();
    }
    for (i = 0; i < pulses.length; i++) {
      p = pulses[i];
      if (p.x == null) continue;
      ctx.drawImage(GLOW, p.x - 9, p.y - 9, 18, 18);
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.2, 0, 6.2832);
      ctx.fillStyle = DOT;
      ctx.fill();
    }

    // firing neurons
    for (i = 0; i < N; i++) {
      n = nodes[i];
      if (n.a < 0.03 || n.g < 0.05) continue;
      var s = (10 + 20 * n.a) * (0.7 + 0.5 * n.d);
      ctx.globalAlpha = (1 - 0.6 * scroll) * Math.min(1, n.a * 1.2);
      ctx.drawImage(GLOW, n.sx - s / 2, n.sy - s / 2, s, s);
      ctx.globalAlpha = 1 - 0.6 * scroll;
      ctx.beginPath();
      ctx.arc(n.sx, n.sy, (1.6 + 2.2 * n.d) * (0.6 + 0.6 * n.a), 0, 6.2832);
      ctx.fillStyle = n.a > 0.45 ? '#b5c24a' : 'rgba(' + HOT + ',' + (n.a * 1.6).toFixed(3) + ')';
      ctx.fill();
      if (n.a > 0.45) { ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(' + NET + ',0.55)'; ctx.stroke(); }
    }
    ctx.globalAlpha = 1;
  }

  /* ---------- loop ---------- */
  var raf = 0, last = 0, visible = true, slow = 0, ready = false;
  function frame(now) {
    raf = 0;
    if (!visible || document.hidden) return;
    var dtRaw = last ? (now - last) / 1000 : 1 / 60;
    last = now;
    update(Math.min(dtRaw, 1 / 20), now);
    render();
    if (!ready) { ready = true; hero.classList.add('is-3d'); }
    if (dtRaw > 0.028 && dtRaw < 0.25) slow++; else if (slow > 0) slow--;
    if (slow > 45 && quality > 0.6) { quality = Math.max(0.6, quality - 0.2); slow = 0; measure(); }
    raf = requestAnimationFrame(frame);
  }
  function wake() {
    if (still || raf || !visible || document.hidden) return;
    last = 0;
    raf = requestAnimationFrame(frame);
  }

  /* ---------- input ---------- */
  function local(e) { var r = hero.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
  hero.addEventListener('pointermove', function (e) {
    if (still) return;
    var p = local(e);
    pointer = { x: p.x, y: p.y, time: performance.now() };
    tyaw = (p.x / L.W - 0.5) * 0.7;
    tpitch = (p.y / L.H - 0.5) * 0.4;
    wake();
  }, { passive: true });
  hero.addEventListener('pointerleave', function () { pointer = null; tyaw = 0; tpitch = 0; }, { passive: true });
  hero.addEventListener('pointerdown', function (e) {
    if (still || (e.target.closest && e.target.closest('a,button,input,textarea,select,label'))) return;
    var p = local(e), best = -1, bd = 1e12;
    for (var i = 0; i < N; i++) {
      var dx = nodes[i].sx - p.x, dy = nodes[i].sy - p.y, d = dx * dx + dy * dy;
      if (d < bd) { bd = d; best = i; }
    }
    if (best >= 0) { nodes[best].ref = 0; fire(best, 1.7); }
    wake();
  }, { passive: true });

  window.addEventListener('scroll', function () {
    var s = Math.min(1, Math.max(0, window.scrollY / ((L.H || 1) * 0.9)));
    if (s !== scroll) { scroll = s; wake(); }
  }, { passive: true });

  /* ---------- boot ---------- */
  function relayout() { measure(); if (still) render(); }
  measure();
  if (still) {
    // A calm frame with a few signals in flight: for reduced motion and screenshots.
    for (var s0 = 0; s0 < 140; s0++) update(1 / 60, 0);
    render();
    hero.classList.add('is-3d');
  } else {
    raf = requestAnimationFrame(frame);
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) { visible = entries[0].isIntersecting; if (visible) wake(); },
      { rootMargin: '60px' }).observe(hero);
  }
  document.addEventListener('visibilitychange', function () { if (!document.hidden) wake(); });
  var rz = 0;
  function queue() { clearTimeout(rz); rz = setTimeout(relayout, 80); }
  if ('ResizeObserver' in window) {
    var ro = new ResizeObserver(queue);
    ro.observe(hero);
    var ttl = hero.querySelector('.hero-title');
    if (ttl) ro.observe(ttl);
  } else {
    window.addEventListener('resize', queue);
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(queue);
})();
