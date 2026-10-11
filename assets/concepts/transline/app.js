/* TransLine — scroll-scrubbed frame sequence. Plain JS, no dependencies. */
(function () {
  'use strict';
  var FRAME_COUNT = 482;          // total frames in assets/concepts/transline/frames/{d,m}
  var WHITE_FROM = 478;           // frames >= this are pure #ffffff -> drawn as a solid fill
  var END_AT = 0.965;             // scroll progress at which the last frame is reached
  var BG = '#ffffff';             // must equal body background

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canvas = document.getElementById('seq');
  var ctx = canvas.getContext('2d', { alpha: false });
  var section = document.getElementById('scrolly');
  var shade = document.getElementById('shade');
  var hint = document.getElementById('hint');
  var loader = document.getElementById('loader');
  var loaderBar = document.getElementById('loaderBar');
  var topbar = document.getElementById('topbar');
  var beats = Array.prototype.slice.call(document.querySelectorAll('.beat'));

  // pick frame set: mobile (960x540) on small screens, desktop (1280x720) otherwise
  var small = Math.min(screen.width, screen.height) < 768 || window.innerWidth < 900;
  var dir = small ? 'assets/concepts/transline/frames/m/' : 'assets/concepts/transline/frames/d/';
  function src(i) { return dir + String(i).padStart(4, '0') + '.webp'; }

  var images = new Array(FRAME_COUNT);
  var loaded = new Uint8Array(FRAME_COUNT);
  var current = 0, target = 0, lastDrawn = -1, lastDrawnImg = null;

  // ---------- canvas sizing (DPR aware) ----------
  var cw = 0, ch = 0;
  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = canvas.clientWidth, h = canvas.clientHeight;
    var W = Math.round(w * dpr), H = Math.round(h * dpr);
    if (W === cw && H === ch) return;
    cw = canvas.width = W; ch = canvas.height = H;
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    lastDrawn = -1; draw(Math.round(current));
  }

  // ---------- drawing (object-fit: cover) ----------
  function nearestLoaded(i) {
    if (loaded[i]) return i;
    for (var d = 1; d < FRAME_COUNT; d++) {
      if (i - d >= 0 && loaded[i - d]) return i - d;
      if (i + d < FRAME_COUNT && loaded[i + d]) return i + d;
    }
    return -1;
  }
  function draw(i) {
    if (!cw) return;
    if (i >= WHITE_FROM) {
      if (lastDrawn === -2) return;
      ctx.fillStyle = BG; ctx.fillRect(0, 0, cw, ch); lastDrawn = -2; return;
    }
    var n = nearestLoaded(i);
    if (n < 0 || n === lastDrawn) return;
    var img = images[n];
    var iw = img.naturalWidth, ih = img.naturalHeight;
    var s = Math.max(cw / iw, ch / ih);
    var dw = iw * s, dh = ih * s;
    // portrait screens: keep the truck a bit right of centre so the cab stays visible
    var fx = cw < ch ? 0.56 : 0.5;
    var dx = (cw - dw) * fx, dy = (ch - dh) / 2;
    ctx.drawImage(img, dx, dy, dw, dh);
    lastDrawn = n;
  }

  // ---------- progressive loading ----------
  function buildOrder() {
    var seen = new Uint8Array(FRAME_COUNT), order = [];
    function add(i) { if (i >= 0 && i < FRAME_COUNT && !seen[i]) { seen[i] = 1; order.push(i); } }
    add(0);
    [64, 32, 16, 8, 4, 2, 1].forEach(function (step) {
      for (var i = 0; i < WHITE_FROM; i += step) add(i);
    });
    return order;
  }
  var KEY_STEP = 8, keyTotal = Math.ceil(WHITE_FROM / KEY_STEP), keyLoaded = 0, totalLoaded = 0;
  function onLoad(i, img) {
    images[i] = img; loaded[i] = 1; totalLoaded++;
    if (i % KEY_STEP === 0) keyLoaded++;
    var p = Math.min(1, keyLoaded / keyTotal);
    loaderBar.style.width = (p * 100).toFixed(1) + '%';
    loader.setAttribute('aria-valuenow', Math.round(p * 100));
    if (p >= 1) loader.classList.add('done');
    // redraw if this frame is closer to what we want than what is on screen
    var want = Math.round(current);
    if (want < WHITE_FROM && Math.abs(i - want) < Math.abs(lastDrawn - want)) { lastDrawn = -1; draw(want); }
  }
  function loadFrame(i) {
    return new Promise(function (res) {
      var img = new Image();
      img.decoding = 'async';
      img.onload = function () {
        var done = function () { onLoad(i, img); res(); };
        if (img.decode) img.decode().then(done, done); else done();
      };
      img.onerror = function () { res(); };
      img.src = src(i);
    });
  }
  function preload() {
    var order = buildOrder(), idx = 0, CONC = 6;
    function next() { if (idx >= order.length) return; var i = order[idx++]; return loadFrame(i).then(next); }
    loadFrame(order[idx++]).then(function () {
      draw(0);
      for (var k = 0; k < CONC; k++) next();
    });
  }

  // ---------- scroll -> progress ----------
  function progress() {
    var r = section.getBoundingClientRect();
    var total = section.offsetHeight - window.innerHeight;
    return total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
  }
  function smooth(x) { return x * x * (3 - 2 * x); }
  function updateOverlays(p) {
    for (var b = 0; b < beats.length; b++) {
      var el = beats[b], from = +el.dataset.from, to = +el.dataset.to;
      var fade = 0.035, o;
      var holdStart = el.hasAttribute('data-hold-start');
      if (p < from - (holdStart ? 1 : 0)) o = 0;
      else if (p < from + fade && !holdStart) o = (p - from) / fade;
      else if (p <= to - fade) o = 1;
      else if (p < to) o = (to - p) / fade;
      else o = 0;
      o = smooth(Math.max(0, Math.min(1, o)));
      el.style.opacity = o.toFixed(3);
      el.style.visibility = o > 0.001 ? 'visible' : 'hidden';
      el.style.transform = (el.classList.contains('beat-hero') && window.innerWidth > 720 ? 'translateY(-50%) ' : '') + 'translateY(' + ((1 - o) * 24).toFixed(1) + 'px)';
    }
    // darkening gradient behind text fades away before the white flash
    var sh = p < 0.82 ? 1 : Math.max(0, 1 - (p - 0.82) / 0.06);
    shade.style.opacity = sh.toFixed(3);
    hint.style.opacity = p > 0.02 ? 0 : 1;
  }
  function updateTopbar() {
    var r = section.getBoundingClientRect();
    var solid = progress() > 0.9 || r.bottom < 80;
    topbar.classList.toggle('solid', solid);
  }

  // ---------- render loop (lerp toward target frame) ----------
  var running = false;
  function tick() {
    var diff = target - current;
    current += diff * 0.14;
    if (Math.abs(diff) < 0.05) current = target;
    draw(Math.round(current));
    if (current !== target) requestAnimationFrame(tick); else running = false;
  }
  function onScroll() {
    var p = progress();
    target = Math.min(1, p / END_AT) * (FRAME_COUNT - 1);
    updateOverlays(p);
    updateTopbar();
    if (!running) { running = true; requestAnimationFrame(tick); }
  }

  // ---------- form (front-end only) ----------
  var form = document.getElementById('form');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    Array.prototype.forEach.call(form.elements, function (el) {
      if (el.tagName !== 'INPUT') return;
      var bad = !el.value.trim() || (el.name === 'phone' && el.value.replace(/\D/g, '').length < 9);
      el.classList.toggle('err', bad); if (bad) ok = false;
    });
    var msg = document.getElementById('formMsg');
    if (!ok) { msg.textContent = 'Будь ласка, заповніть усі поля коректно.'; return; }
    msg.textContent = '';
    form.hidden = true;
    document.getElementById('thanks').hidden = false;
  });

  // ---------- init ----------
  if (reduce) {
    // static frame, no scrubbing, no bulk loading
    var still = new Image();
    still.onload = function () { images[0] = still; loaded[0] = 1; resize(); draw(0); };
    still.src = src(0);
    loader.classList.add('done');
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', updateTopbar, { passive: true });
    updateTopbar();
    return;
  }
  resize();
  preload();
  window.addEventListener('resize', function () { resize(); onScroll(); });
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  current = target; draw(Math.round(current));
})();
