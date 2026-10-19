/* TransLine — scroll-scrubbed frame sequence. Plain JS, no dependencies.
   Desktop (non-iOS, H.264 capable): all-keyframe MP4 scrubbed via currentTime, drawn to canvas.
   Mobile / fallback: WebP frames fetched as compressed blobs, decoded off-thread with
   createImageBitmap in a sliding window around the current frame (+ low-res keyframes as fallback). */
(function () {
  'use strict';
  var BASE = 'assets/concepts/transline/';  // asset base relative to the page
  var FRAME_COUNT = 482;          // total frames in frames/{d,m}
  var WHITE_FROM = 478;           // frames >= this are pure #ffffff -> drawn as a solid fill
  var END_AT = 0.965;             // scroll progress at which the last frame is reached
  var BG = '#ffffff';             // must equal body background
  var VIDEO_FPS = 30;             // fps of seq-*.mp4 (frames 0..WHITE_FROM-1, every frame a keyframe)
  var EASE = 9;                   // time-based smoothing toward the scroll target (per second)
  var STEP = 2;                   // load every 2nd frame; in-between positions are cross-faded
  var HEAD = 40;                  // first frames loaded in order so the start is instantly smooth
  var KEY_STEP = 8;               // «каркас»: кожен 8-й кадр по всьому ролику, тримається декодованим (зменшеним)

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canvas = document.getElementById('seq');
  var small = Math.min(screen.width, screen.height) < 768 || window.innerWidth < 900;
  // desynchronized на частині Android вимикає GPU-композицію полотна — на телефонах не вмикаємо
  var ctx = canvas.getContext('2d', small ? { alpha: false } : { alpha: false, desynchronized: true });
  var section = document.getElementById('scrolly');
  var shade = document.getElementById('shade');
  var hint = document.getElementById('hint');
  var loader = document.getElementById('loader');
  var loaderBar = document.getElementById('loaderBar');
  var topbar = document.getElementById('topbar');
  var beats = Array.prototype.slice.call(document.querySelectorAll('.beat'));

  var iOS = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  // Телефон вертикально — окремі кадри (frames/p, 540x474): смуга з фурою на всю ширину,
  // яку малюємо одразу під шапкою, без розмиття; поля над і під нею — суцільний темний колір.
  // Горизонтально — як було (frames/m).
  function isPortrait() { return small && window.innerHeight > window.innerWidth; }
  var portrait = isPortrait();
  var P_W = 540, P_H = 474;       // розмір frames/p
  var P_VER = '?v=20261019';      // нові кадри frames/p — не брати старі з кешу
  var SURROUND = [20, 23, 28];    // #14171c — тло навколо смуги на вертикальному телефоні
  var bandTop = 0;                // висота шапки в пікселях полотна
  var dir = BASE + (portrait ? 'frames/p/' : small ? 'frames/m/' : 'frames/d/');
  function src(i) { return dir + String(i).padStart(4, '0') + '.webp' + (portrait ? P_VER : ''); }
  var hasBitmap = typeof createImageBitmap === 'function' && typeof fetch === 'function';
  var probe = document.createElement('video');
  var useVideo = !small && !iOS && !reduce && typeof fetch === 'function' &&
    !!probe.canPlayType && probe.canPlayType('video/mp4; codecs="avc1.640028"') !== '';
  var forced = (location.search.match(/[?&]seq=(img|video)\b/) || [])[1];   // debug override
  // Measured in Chrome: bitmap frames draw in ~0.1 ms vs 7-11 ms for drawImage(video) + seek latency,
  // so images are the default everywhere; the MP4 path stays available for A/B checks via ?seq=video.
  useVideo = useVideo && forced === 'video';
  // decoded full-res frames kept around the current one (memory: desktop ~3.7 MB, mobile ~2 MB each)
  // На телефонах вікно менше: кожен кадр 540x1170 — ~2,5 МБ памʼяті, а iOS вбиває вкладку при перевитраті
  var BEHIND = small ? 14 : 30, AHEAD = small ? 40 : 80;

  // ---------- state ----------
  var blobs = new Array(FRAME_COUNT);     // compressed bytes (Blob) or HTMLImageElement in fallback
  var bitmaps = new Array(FRAME_COUNT);   // decoded full-res frames (sliding window)
  var keys = new Array(FRAME_COUNT);      // decoded low-res keyframes (permanent)
  var fetching = new Uint8Array(FRAME_COUNT), decoding = new Uint8Array(FRAME_COUNT);
  var current = 0, target = 0, dirSign = 1, lastIdx = -1, lastSrc = null;

  // ---------- canvas sizing (DPR aware, only on resize) ----------
  var cw = 0, ch = 0;
  function resize() {
    if (small && isPortrait() !== portrait) { switchSet(); }
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var W = Math.round(canvas.clientWidth * dpr), H = Math.round(canvas.clientHeight * dpr);
    if (small && W > 0) {
      // Полотно не більше за самі кадри: малюємо майже 1:1 (швидке копіювання),
      // а до розміру екрана розтягує вже GPU-композитор. Раніше кожен кадр
      // перемасштабовувався з «high»-якістю — на телефоні це 30–90 мс на кадр.
      var maxW = portrait ? P_W : 960;
      if (W > maxW) { H = Math.round(H * maxW / W); W = maxW; }
    }
    if (W === cw && H === ch) return;
    if (cw && W === cw && Math.abs(H - ch) < 160 * dpr && 'ontouchstart' in window) return;  // address bar show/hide
    cw = canvas.width = W; ch = canvas.height = H;     // resets context state, so set smoothing here once
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = small ? 'low' : 'high';
    bandTop = portrait ? Math.round(topbar.offsetHeight * cw / Math.max(1, canvas.clientWidth)) : 0;
    lastIdx = -1; lastSrc = null; lastBlend = -1; render(true);
  }

  // ---------- drawing (object-fit: cover) ----------
  function cover(img, iw, ih) {
    if (portrait) { band(img); return; }
    var s = Math.max(cw / iw, ch / ih), dw = iw * s, dh = ih * s;
    var fx = cw < ch ? 0.56 : 0.5;
    ctx.drawImage(img, (cw - dw) * fx, (ch - dh) / 2, dw, dh);
  }
  // Вертикальний телефон: кадр на всю ширину одразу під шапкою, без розмиття.
  // Заливаємо лише поля над і під смугою — так перехресне згасання кадрів лишається чистим.
  function band(img) {
    var dh = Math.round(cw * P_H / P_W), top = Math.min(bandTop, Math.max(0, ch - dh));
    ctx.fillStyle = surround();
    if (top > 0) ctx.fillRect(0, 0, cw, top);
    if (top + dh < ch) ctx.fillRect(0, top + dh, cw, ch - top - dh);
    ctx.drawImage(img, 0, top, cw, dh);
  }
  // наприкінці ролик вибілюється (кадри ~462–471) — поля вибілюються разом із ним
  function surround() {
    var k = Math.min(1, Math.max(0, (current - 462) / 9));
    k = k * k * (3 - 2 * k);
    return 'rgb(' + SURROUND.map(function (c) { return Math.round(c + (255 - c) * k); }).join(',') + ')';
  }
  function white() { ctx.fillStyle = BG; ctx.fillRect(0, 0, cw, ch); }
  function nearestDecoded(i) {
    if (bitmaps[i]) return bitmaps[i];
    var best = null, bd = 1e9, d, k;
    for (d = 1; d <= AHEAD + BEHIND; d++) {
      if (i - d >= 0 && bitmaps[i - d]) { best = bitmaps[i - d]; bd = d; break; }
      if (i + d < WHITE_FROM && bitmaps[i + d]) { best = bitmaps[i + d]; bd = d; break; }
    }
    // a low-res keyframe that is much closer beats a far full-res frame
    for (d = 0; d < KEY_STEP * 2 && d < bd; d++) {
      k = i - d; if (k >= 0 && keys[k]) return keys[k];
      k = i + d; if (k < WHITE_FROM && keys[k]) return keys[k];
    }
    if (best) return best;
    for (d = 0; d < WHITE_FROM; d++) {
      if (i - d >= 0 && keys[i - d]) return keys[i - d];
      if (i + d < WHITE_FROM && keys[i + d]) return keys[i + d];
    }
    return null;
  }
  var video = null, videoReady = false, seeking = false, vidWant = -1, vidShown = -1;
  function drawFrame(i, force) {
    if (!cw) return;
    if (i >= WHITE_FROM) {
      if (lastSrc !== 'white') { white(); lastSrc = 'white'; }
      lastIdx = i; window.__tlFrame = i; return;
    }
    if (videoReady) {
      lastIdx = i;
      if (i === vidShown && !seeking && (lastSrc !== video || force)) { cover(video, video.videoWidth, video.videoHeight); lastSrc = video; window.__tlFrame = i; }
      else seekVideo(i);
      return;
    }
    var img = nearestDecoded(i);
    if (!img || (img === lastSrc && !force)) { lastIdx = i; return; }
    cover(img, img.width || img.naturalWidth, img.height || img.naturalHeight);
    lastSrc = img; lastIdx = i; window.__tlFrame = img.__i;
  }
  var lastBlend = -1, lastPair = '';
  // готовий кадр для індексу: повнорозмірний, а поки його нема — зменшений «каркасний»
  function readyAt(i) { return bitmaps[i] || keys[i] || null; }
  function render(force) {
    if (!videoReady && cw && current < WHITE_FROM - 1) {
      // Найближчі готові кадри позаду й попереду — між ними плавне перетікання.
      // Поки ролик ще докачується, картинка рухається, а не стоїть і не стрибає «слайдами».
      var c0 = Math.floor(current), lo = -1, hi = -1, j;
      for (j = c0; j >= 0 && j > c0 - 48; j--) if (readyAt(j)) { lo = j; break; }
      for (j = c0 + 1; j < WHITE_FROM && j < c0 + 48; j++) if (readyAt(j)) { hi = j; break; }
      if (lo >= 0 && hi > lo) {
        var a = (current - lo) / (hi - lo), b0 = readyAt(lo), b1 = readyAt(hi);
        if (a > 0.02 && a < 0.98) {
          var pair = lo + ':' + hi + ':' + (b0 === bitmaps[lo]) + (b1 === bitmaps[hi]);
          if (!force && pair === lastPair && Math.abs(current - lastBlend) < 0.004) return;
          cover(b0, b0.width, b0.height);
          ctx.globalAlpha = a;
          cover(b1, b1.width, b1.height);
          ctx.globalAlpha = 1;
          lastBlend = current; lastPair = pair; lastSrc = null; lastIdx = -1; window.__tlFrame = a < 0.5 ? lo : hi;
          return;
        }
      }
    }
    lastBlend = -1; lastPair = '';
    var i = Math.min(FRAME_COUNT - 1, Math.round(current));
    if (force || i !== lastIdx) drawFrame(i, force);
  }

  // ---------- video scrubbing (desktop) ----------
  function seekVideo(i) {
    vidWant = i;
    if (seeking || i === vidShown) return;
    seeking = true;
    video.currentTime = (i + 0.5) / VIDEO_FPS;
  }
  function onVideoFrame() {
    seeking = false;
    var shown = Math.min(WHITE_FROM - 1, Math.floor(video.currentTime * VIDEO_FPS));
    if (lastIdx < WHITE_FROM) {            // never paint video over the white end state
      cover(video, video.videoWidth, video.videoHeight);
      lastSrc = video; window.__tlFrame = shown;
    }
    vidShown = shown;
    if (vidWant !== vidShown && vidWant < WHITE_FROM) seekVideo(vidWant);
  }
  function startVideo() {
    var url = BASE + 'seq-d.mp4?v=20261011';
    return fetch(url).then(function (res) {
      if (!res.ok) throw new Error('video ' + res.status);
      var total = +res.headers.get('Content-Length') || 0;
      if (!res.body || !total || typeof Response === 'undefined') return res.blob();
      var reader = res.body.getReader(), got = 0, chunks = [];
      function pump() {
        return reader.read().then(function (r) {
          if (r.done) return new Blob(chunks, { type: 'video/mp4' });
          chunks.push(r.value); got += r.value.length; setProgress(0.25 + 0.75 * got / total);
          return pump();
        });
      }
      return pump();
    }).then(function (blob) {
      return new Promise(function (resolve, reject) {
        video = document.createElement('video');
        video.muted = true; video.playsInline = true; video.preload = 'auto';
        video.setAttribute('muted', ''); video.setAttribute('playsinline', ''); video.setAttribute('aria-hidden', 'true');
        video.style.cssText = 'position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;left:0;top:0';
        video.addEventListener('seeked', onVideoFrame);
        video.addEventListener('error', function () { reject(new Error('video decode')); }, { once: true });
        video.addEventListener('loadeddata', function () { resolve(); }, { once: true });
        video.src = URL.createObjectURL(blob);
        section.appendChild(video);
      });
    }).then(function () {
      videoReady = true; setProgress(1);
      // free full-res image bitmaps, keep the low-res keyframes
      for (var i = 0; i < FRAME_COUNT; i++) if (bitmaps[i]) { if (bitmaps[i].close) bitmaps[i].close(); bitmaps[i] = null; }
      lastIdx = -1; render(true);
    });
  }

  // ---------- image pipeline (fetch blob -> decode in window) ----------
  var gen = 0;   // номер набору кадрів; після повороту телефона старі запити ігноруються
  function loadOne(i) {
    fetching[i] = 1;
    var g = gen;
    if (hasBitmap) {
      return fetch(src(i)).then(function (r) { return r.ok ? r.blob() : null; })
        .then(function (b) { if (b && g === gen) blobs[i] = b; }, function () {})
        .then(function () { if (g !== gen) return; fetching[i] = 2; onFetched(i); });
    }
    return new Promise(function (res) {
      var img = new Image(); img.decoding = 'async';
      img.onload = function () { var ok = function () { img.__i = i; blobs[i] = img; bitmaps[i] = img; if (i % KEY_STEP === 0) keys[i] = img; fetching[i] = 2; onFetched(i); res(); }; if (img.decode) img.decode().then(ok, ok); else ok(); };
      img.onerror = function () { fetching[i] = 2; res(); };
      img.src = src(i);
    });
  }
  function decodeOne(i, low) {
    decoding[i] = 1;
    var opts = low ? { resizeWidth: small ? 480 : 640, resizeQuality: 'medium' } : undefined;
    var g = gen;
    return (opts ? createImageBitmap(blobs[i], opts) : createImageBitmap(blobs[i])).then(function (bm) {
      if (g !== gen) { if (bm.close) bm.close(); return; }
      bm.__i = i;
      if (low) keys[i] = bm;
      else if (inWindow(i)) bitmaps[i] = bm;
      else if (bm.close) bm.close();
    }, function () {}).then(function () {
      decoding[i] = 0;
      var want = Math.round(current);
      if (Math.abs(i - want) <= Math.abs((lastSrc && lastSrc.__i !== undefined ? lastSrc.__i : 1e9) - want) && !videoReady) render(true);
    });
  }
  function inWindow(i) {
    var c = Math.round(current);
    return dirSign >= 0 ? (i >= c - BEHIND && i <= c + AHEAD) : (i <= c + BEHIND && i >= c - AHEAD);
  }
  // fetch order: head frames, then keyframes, then frames ahead of the reader (images only if no video)
  var headDone = 0, keyTotal = Math.ceil(WHITE_FROM / KEY_STEP), keyDone = 0, inflight = 0, CONC = 10;
  // Порядок: початок ролика → «каркас» (кожен 8-й кадр по всьому ролику, найближчі до читача першими:
  // у будь-якому місці є між чим плавно перетікати) → кожен 4-й → кожен 2-й. Повільний інтернет
  // не встигає за швидкою прокруткою, тож спершу покриваємо весь ролик, а вже потім густішаємо.
  function nextToFetch() {
    var i, n, c = Math.round(current + dirSign * lead());
    for (i = 0; i < HEAD; i += STEP) if (!fetching[i]) return i;
    if ((n = nearestMissing(c, KEY_STEP)) >= 0) return n;
    if (useVideo) return -1;
    if ((n = nearestMissing(c, 4)) >= 0) return n;
    return nearestMissing(c, STEP);
  }
  // найближчий ще не запитаний кадр із кроком step; позаду читача — утричі «далі»
  function nearestMissing(c, step) {
    var best = -1, bs = 1e9, i, d, s;
    for (i = 0; i < WHITE_FROM; i += step) {
      if (fetching[i]) continue;
      d = i - c; s = (d * dirSign >= 0) ? Math.abs(d) : Math.abs(d) * 3;
      if (s < bs) { bs = s; best = i; }
    }
    return best;
  }
  // на скільки кадрів читач проїде, поки прийде запит (~0,3 с), — вантажимо з таким запасом
  var vel = 0, lastScrollT = 0;
  function lead() { return performance.now() - lastScrollT > 300 ? 0 : Math.min(48, vel * 0.3); }
  function pumpFetch() {
    while (inflight < CONC) {
      var i = nextToFetch(); if (i < 0) return;
      inflight++;
      loadOne(i).then(function () { inflight--; pumpFetch(); });
    }
  }
  function onFetched(i) {
    if (i < HEAD) headDone += STEP;
    if (i % KEY_STEP === 0) keyDone++;
    if (!useVideo) setProgress((headDone + keyDone) / (HEAD + keyTotal));
    else setProgress(0.25 * (headDone + keyDone) / (HEAD + keyTotal));
    if (i === 0 && !lastSrc) { if (hasBitmap) decodeOne(0, false).then(function () { render(true); }); else render(true); }
    scheduleDecode();
  }
  function setProgress(p) {
    p = Math.min(1, p);
    loaderBar.style.width = (p * 100).toFixed(1) + '%';
    loader.setAttribute('aria-valuenow', Math.round(p * 100));
    if (p >= 1) loader.classList.add('done');
  }
  // decode scheduler: keyframes (low-res) + sliding window of full-res bitmaps, nearest-first in scroll direction
  var decInflight = 0, DEC_CONC = 3, decScheduled = false;
  var idle = window.requestIdleCallback || function (fn) { return setTimeout(fn, 16); };
  function scheduleDecode() {
    if (!hasBitmap || decScheduled) return;
    decScheduled = true;
    idle(function () { decScheduled = false; pumpDecode(); }, { timeout: 50 });
  }
  function evict() {
    for (var i = 0; i < WHITE_FROM; i++) if (bitmaps[i] && !inWindow(i)) { if (bitmaps[i] !== lastSrc && bitmaps[i].close) bitmaps[i].close(); bitmaps[i] = null; }
  }
  function nextToDecode() {
    var c = Math.round(current), d, i, k;
    if (!videoReady) {
      for (d = 0; d <= AHEAD; d++) {
        i = c + d * dirSign; if (i >= 0 && i < WHITE_FROM && !(i % STEP) && blobs[i] && !bitmaps[i] && !decoding[i]) return [i, false];
        if (d <= BEHIND) { i = c - d * dirSign; if (i >= 0 && i < WHITE_FROM && !(i % STEP) && blobs[i] && !bitmaps[i] && !decoding[i]) return [i, false]; }
      }
    }
    for (k = 0; k < WHITE_FROM; k += KEY_STEP) if (blobs[k] && !keys[k] && !decoding[k]) return [k, true];
    return null;
  }
  function pumpDecode() {
    if (!videoReady) evict();
    while (decInflight < DEC_CONC) {
      var n = nextToDecode(); if (!n) return;
      decInflight++;
      decodeOne(n[0], n[1]).then(function () { decInflight--; scheduleDecode(); });
    }
  }

  // Поворот телефона: перемикаємо набір кадрів (p <-> m) і вантажимо заново
  function switchSet() {
    portrait = isPortrait(); gen++;
    dir = BASE + (portrait ? 'frames/p/' : 'frames/m/');
    for (var i = 0; i < FRAME_COUNT; i++) {
      if (bitmaps[i] && bitmaps[i].close) bitmaps[i].close();
      if (keys[i] && keys[i].close && keys[i] !== bitmaps[i]) keys[i].close();
      bitmaps[i] = keys[i] = blobs[i] = null; fetching[i] = 0; decoding[i] = 0;
    }
    headDone = 0; keyDone = 0; lastSrc = null; lastIdx = -1; lastBlend = -1;
    pumpFetch();
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
      if (el.__o === o) continue;          // skip style writes when nothing changes
      el.__o = o;
      el.style.opacity = o.toFixed(3);
      el.style.visibility = o > 0.001 ? 'visible' : 'hidden';
      el.style.transform = (el.classList.contains('beat-hero') && window.innerWidth > 720 ? 'translateY(-50%) ' : '') + 'translateY(' + ((1 - o) * 24).toFixed(1) + 'px)';
    }
    // darkening gradient behind text fades away before the white flash
    var sh = p < 0.82 ? 1 : Math.max(0, 1 - (p - 0.82) / 0.06);
    if (shade.__o !== sh) { shade.__o = sh; shade.style.opacity = sh.toFixed(3); }
    var ho = p > 0.02 ? 0 : 1;
    if (hint.__o !== ho) { hint.__o = ho; hint.style.opacity = ho; }
  }
  function updateTopbar(p) {
    var r = section.getBoundingClientRect();
    // на вертикальному телефоні шапка світлішає разом із полями навколо смуги (кадри ~462–471)
    var solid = (p === undefined ? progress() : p) > (portrait ? 0.935 : 0.9) || r.bottom < 80;
    topbar.classList.toggle('solid', solid);
  }

  // ---------- render loop (lerp toward target frame, stops when settled) ----------
  var running = false;
  var lastT = 0;
  function tick(now) {
    var dt = lastT ? Math.min(0.05, (now - lastT) / 1000) : 1 / 60;
    lastT = now;
    var diff = target - current;
    current += diff * (1 - Math.exp(-EASE * dt));
    if (Math.abs(diff) < 0.02) current = target;
    render(false);
    if (current !== target) requestAnimationFrame(tick);
    else { running = false; lastT = 0; scheduleDecode(); }
  }
  var lastTarget = 0;
  function onScroll() {
    var p = progress(), prev = target;
    target = Math.min(1, p / END_AT) * (FRAME_COUNT - 1);
    var now = performance.now(), dts = (now - lastScrollT) / 1000;
    if (lastScrollT && dts > 0.004) vel += (Math.min(400, Math.abs(target - prev) / dts) - vel) * 0.25;
    lastScrollT = now;
    if (target !== lastTarget) { dirSign = target > lastTarget ? 1 : -1; lastTarget = target; }
    updateOverlays(p);
    updateTopbar(p);
    scheduleDecode();
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
    still.onload = function () { still.__i = 0; bitmaps[0] = still; resize(); drawFrame(0, true); };
    still.src = src(0);
    loader.classList.add('done');
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', function () { updateTopbar(); }, { passive: true });
    updateTopbar();
    return;
  }
  resize();
  pumpFetch();
  if (useVideo) startVideo().catch(function () { useVideo = false; videoReady = false; pumpFetch(); });
  window.addEventListener('resize', function () { resize(); onScroll(); });
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  current = target; render(true);
})();
