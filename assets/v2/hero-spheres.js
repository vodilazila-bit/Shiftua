/*! WEBWORK hero: glossy spheres with soft physics. Plain WebGL2, no libraries. */
(function () {
  'use strict';

  var hero = document.querySelector('[data-hero]');
  var canvas = hero && hero.querySelector('.hero-canvas');
  if (!hero || !canvas) return;

  var root = document.documentElement;
  var query = new URLSearchParams(location.search);
  var reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var still = reduceMotion || query.has('still');

  function fail() { root.classList.add('no-webgl'); }

  var gl = null;
  try {
    gl = canvas.getContext('webgl2', {
      alpha: true, premultipliedAlpha: true, antialias: false, depth: false,
      stencil: false, powerPreference: 'high-performance'
    });
  } catch (e) { gl = null; }
  if (!gl) { fail(); return; }

  /* ---------------- shaders ---------------- */

  var MAXS = 32;

  var VS = [
    '#version 300 es',
    'precision highp float;',
    'layout(location=0) in vec2 aQ;',
    'layout(location=1) in vec4 aSph;',
    'layout(location=2) in vec4 aCol;',
    'layout(location=3) in float aIdx;',
    'uniform mat4 uVP;',
    'uniform vec3 uEye;',
    'uniform float uPix;',
    'out vec3 vPos;',
    'flat out vec4 vSph;',
    'flat out vec4 vCol;',
    'flat out int vIdx;',
    'void main(){',
    '  vec3 c = aSph.xyz; float r = aSph.w;',
    '  vec3 toE = uEye - c; float d = length(toE); toE /= d;',
    '  vec3 upv = abs(toE.y) > 0.98 ? vec3(1.0,0.0,0.0) : vec3(0.0,1.0,0.0);',
    '  vec3 rt = normalize(cross(upv, toE));',
    '  vec3 up = cross(toE, rt);',
    '  float s = r * d / sqrt(max(d*d - r*r, 1e-4)) + 2.5 * uPix * d;',
    '  vec3 p = c + (rt * aQ.x + up * aQ.y) * s;',
    '  vPos = p; vSph = aSph; vCol = aCol; vIdx = int(aIdx + 0.5);',
    '  gl_Position = uVP * vec4(p, 1.0);',
    '}'
  ].join('\n');

  var FS = [
    '#version 300 es',
    'precision highp float;',
    '#define MAXS ' + MAXS,
    'in vec3 vPos;',
    'flat in vec4 vSph;',
    'flat in vec4 vCol;',
    'flat in int vIdx;',
    'uniform vec3 uEye;',
    'uniform int uCount;',
    'uniform vec4 uS[MAXS];',
    'uniform vec4 uC[MAXS];',
    'uniform vec3 uL;',
    'uniform float uPix;',
    'uniform float uExpo;',
    'out vec4 outColor;',

    'const vec3 SKY = vec3(0.98, 0.99, 0.975);',
    'const vec3 GND = vec3(0.36, 0.37, 0.34);',

    'float hash12(vec2 p){ vec3 p3 = fract(vec3(p.xyx) * 0.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }',

    'float sphHit(vec3 ro, vec3 rd, vec4 s){',
    '  vec3 oc = ro - s.xyz; float b = dot(oc, rd); float c = dot(oc, oc) - s.w*s.w; float h = b*b - c;',
    '  if (h < 0.0) return -1.0;',
    '  return -b - sqrt(h);',
    '}',

    /* Analytic sphere occlusion (Quilez / Lagarde). */
    'float sphOcc(vec3 pos, vec3 nor, vec4 s){',
    '  vec3 di = s.xyz - pos; float l = length(di); float nl = dot(nor, di / l);',
    '  float h = max(l / s.w, 1.0005); float h2 = h*h; float k2 = 1.0 - h2*nl*nl;',
    '  float res = max(0.0, nl) / h2;',
    '  if (k2 > 0.001){',
    '    res = nl*acos(clamp(-nl*sqrt((h2 - 1.0) / max(1.0 - nl*nl, 1e-4)), -1.0, 1.0)) - sqrt(k2*(h2 - 1.0));',
    '    res = res / h2 + atan(sqrt(k2 / (h2 - 1.0)));',
    '    res /= 3.141593;',
    '  }',
    '  return clamp(res, 0.0, 1.0);',
    '}',

    'float sphShadow(vec3 ro, vec3 rd, vec4 s, float k){',
    '  vec3 oc = ro - s.xyz; float b = dot(oc, rd); float c = dot(oc, oc) - s.w*s.w; float h = b*b - c;',
    '  float d = sqrt(max(0.0, s.w*s.w - h)) - s.w;',
    '  float t = -b - sqrt(max(h, 0.0));',
    '  return (t < 0.0) ? 1.0 : smoothstep(0.0, 1.0, 2.5*k*d/t);',
    '}',

    /* Procedural photo-studio environment: two softboxes, a rim light and a darker floor. */
    'vec3 envMap(vec3 d, float rough){',
    '  vec3 col = mix(GND, SKY, smoothstep(-0.45, 0.6, d.y));',
    '  float e = 0.02 + 0.42*rough;',
    '  float fall = 1.0 - 0.75*rough;',
    '  vec3 n1 = normalize(vec3(-0.5, 0.62, 0.6));',
    '  float k1 = dot(d, n1);',
    '  if (k1 > 0.05){',
    '    vec3 t1 = normalize(cross(vec3(0.0,1.0,0.0), n1)); vec3 b1 = cross(n1, t1);',
    '    vec3 q = d / k1; float u = abs(dot(q, t1)); float v = abs(dot(q, b1));',
    '    float m = (1.0 - smoothstep(0.36 - e, 0.36 + e, u)) * (1.0 - smoothstep(0.25 - e, 0.25 + e, v));',
    '    col += vec3(13.0) * m * fall;',
    '  }',
    '  vec3 n2 = normalize(vec3(0.95, 0.14, 0.27));',
    '  float k2 = dot(d, n2);',
    '  if (k2 > 0.05){',
    '    vec3 t2 = normalize(cross(vec3(0.0,1.0,0.0), n2)); vec3 b2 = cross(n2, t2);',
    '    vec3 q = d / k2; float u = abs(dot(q, t2)); float v = abs(dot(q, b2));',
    '    float m = (1.0 - smoothstep(0.07 - e*0.5, 0.07 + e, u)) * (1.0 - smoothstep(0.7 - e, 0.7 + e, v));',
    '    col += vec3(6.0) * m * fall;',
    '  }',
    '  col += vec3(1.4) * smoothstep(0.55, 0.95, dot(d, normalize(vec3(0.25, 0.35, -1.0))));',
    '  return col;',
    '}',

    'void main(){',
    '  vec3 ro = uEye;',
    '  vec3 rd = normalize(vPos - uEye);',
    '  vec3 c = vSph.xyz; float r = vSph.w;',
    '  vec3 oc = ro - c;',
    '  float b = dot(oc, rd);',
    '  float h = b*b - (dot(oc, oc) - r*r);',
    '  float dperp = sqrt(max(dot(oc, oc) - b*b, 0.0));',
    '  float a = clamp((r - dperp) / (uPix * -b) + 0.5, 0.0, 1.0);',
    '  if (a <= 0.003) discard;',
    '  vec3 pos; vec3 nor;',
    '  if (h > 0.0){ pos = ro + rd*(-b - sqrt(h)); nor = (pos - c) / r; }',
    '  else { nor = normalize(ro + rd*(-b) - c); pos = c + nor*r; }',
    '  vec3 V = -rd;',
    '  vec3 Po = pos + nor*0.003;',
    '  vec3 R = reflect(rd, nor);',
    '  float occ = 1.0; float sha = 1.0; float tr = 1e9; int hit = -1;',
    '  for (int j = 0; j < MAXS; j++){',
    '    if (j >= uCount) break;',
    '    if (j == vIdx) continue;',
    '    vec4 s = uS[j];',
    '    if (s.w < 0.002) continue;',
    '    occ *= 1.0 - 0.92*sphOcc(pos, nor, s);',
    '    sha = min(sha, sphShadow(Po, uL, s, 2.2));',
    '    float t = sphHit(Po, R, s);',
    '    if (t > 0.0 && t < tr){ tr = t; hit = j; }',
    '  }',
    '  vec3 alb = vCol.rgb; float gls = vCol.a; float rough = 1.0 - gls;',
    '  float NdV = clamp(dot(nor, V), 0.0, 1.0);',
    '  float NdL = dot(nor, uL);',
    '  vec3 amb = mix(GND, SKY, 0.5 + 0.5*nor.y);',
    '  float wrap = clamp((NdL + 0.3) / 1.3, 0.0, 1.0);',
    '  vec3 dif = alb * (amb*0.78*occ + vec3(1.2)*wrap*sha);',
    '  vec3 Rb = normalize(mix(nor, R, 0.3 + 0.7*gls));',
    '  vec3 env = envMap(Rb, rough);',
    '  if (hit >= 0){',
    '    vec4 s = uS[hit];',
    '    vec3 hn = normalize(Po + R*tr - s.xyz);',
    '    vec3 hamb = mix(GND, SKY, 0.5 + 0.5*hn.y);',
    '    vec3 hcol = uC[hit].rgb * (hamb*0.78 + vec3(1.2)*clamp((dot(hn, uL) + 0.3) / 1.3, 0.0, 1.0));',
    '    hcol += envMap(reflect(R, hn), 0.4) * 0.05;',
    '    env = mix(env, hcol, 0.25 + 0.75*gls);',
    '  }',
    '  float F = 0.04 + 0.96*pow(1.0 - NdV, 5.0);',
    '  float specOcc = clamp(occ*1.2, 0.0, 1.0);',
    '  vec3 H = normalize(uL + V);',
    '  float spec = pow(max(dot(nor, H), 0.0), mix(14.0, 260.0, gls*gls)) * mix(0.08, 0.6, gls) * sha;',
    '  vec3 col = dif*(1.0 - F) + env*F*mix(0.5, 1.0, gls)*specOcc + vec3(spec);',
    '  col *= uExpo;',
    '  col = (col*(2.51*col + 0.03)) / (col*(2.43*col + 0.59) + 0.14);',
    '  col = pow(clamp(col, 0.0, 1.0), vec3(1.0/2.2));',
    '  col += (hash12(gl_FragCoord.xy) - 0.5) / 255.0;',
    '  outColor = vec4(col*a, a);',
    '}'
  ].join('\n');

  function compile(type, src) {
    var sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(sh) || 'shader');
    return sh;
  }

  var prog;
  try {
    prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VS));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog) || 'link');
  } catch (e) {
    if (window.console) console.warn('[hero]', e);
    fail();
    return;
  }

  var U = {};
  ['uVP', 'uEye', 'uPix', 'uCount', 'uS', 'uC', 'uL', 'uExpo'].forEach(function (n) {
    U[n] = gl.getUniformLocation(prog, n);
  });

  var vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  var quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  var STRIDE = 9;
  var inst = new Float32Array(MAXS * STRIDE);
  var instBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, instBuf);
  gl.bufferData(gl.ARRAY_BUFFER, inst.byteLength, gl.DYNAMIC_DRAW);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 4, gl.FLOAT, false, STRIDE * 4, 0);
  gl.vertexAttribDivisor(1, 1);
  gl.enableVertexAttribArray(2);
  gl.vertexAttribPointer(2, 4, gl.FLOAT, false, STRIDE * 4, 16);
  gl.vertexAttribDivisor(2, 1);
  gl.enableVertexAttribArray(3);
  gl.vertexAttribPointer(3, 1, gl.FLOAT, false, STRIDE * 4, 32);
  gl.vertexAttribDivisor(3, 1);
  gl.bindVertexArray(null);

  /* ---------------- scene ---------------- */

  function lin(hex) {
    var n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(function (v) {
      v /= 255;
      return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
  }

  var MATS = {
    lime: { c: lin('#b5c24a'), g: 0.8 },
    limeSoft: { c: lin('#a9b53f'), g: 0.22 },
    ink: { c: [0.012, 0.013, 0.011], g: 1.0 },
    pearl: { c: [0.79, 0.8, 0.775], g: 0.55 }
  };
  var RADII = [1.0, 0.93, 0.87, 0.82, 0.78, 0.74, 0.7, 0.67, 0.64, 0.61, 0.58, 0.56, 0.53, 0.5,
    0.48, 0.46, 0.44, 0.42, 0.4, 0.38, 0.36, 0.34, 0.33, 0.31, 0.3, 0.29, 0.28, 0.27];
  var KINDS = ['lime', 'ink', 'pearl', 'pearl', 'ink', 'limeSoft', 'pearl', 'ink', 'lime', 'pearl',
    'ink', 'pearl', 'lime', 'ink', 'pearl', 'limeSoft', 'ink', 'pearl', 'lime', 'pearl', 'ink',
    'pearl', 'lime', 'ink', 'pearl', 'limeSoft', 'ink', 'pearl'];

  var FOV = 30 * Math.PI / 180;
  var TAN = Math.tan(FOV / 2);
  var LIGHT = (function () { var v = [-0.5, 0.62, 0.6], l = Math.hypot(v[0], v[1], v[2]); return [v[0] / l, v[1] / l, v[2] / l]; })();

  var K_ATTR = 6.5, DAMP = 2.8, SWIRL = 0.55, NOISE = 0.35;

  function rng(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  var spheres = [];
  var Rw = 2.2;
  var center = { x: 0, y: 0, z: 0 };
  var layout = { W: 1, H: 1, camZ: 14, halfH: 3, halfW: 3, wide: true };
  var time = 0;
  var scroll = 0;

  function build(count) {
    var rand = rng(11);
    spheres = [];
    var vol = 0;
    for (var i = 0; i < count; i++) {
      var R = RADII[i];
      vol += R * R * R;
      var u = rand() * 2 - 1, th = rand() * Math.PI * 2, s = Math.sqrt(1 - u * u);
      var dist = 7 + rand() * 5;
      spheres.push({
        x: s * Math.cos(th) * dist, y: u * dist, z: s * Math.sin(th) * dist * 0.5,
        vx: 0, vy: 0, vz: 0, R: R, r: still ? R : 0,
        delay: 0.05 + i * 0.03 + rand() * 0.12,
        m: MATS[KINDS[i]], idx: i,
        p0: rand() * 6.283, p1: rand() * 6.283, p2: rand() * 6.283
      });
    }
    Rw = Math.cbrt(vol / 0.56);
    if (still) {
      for (var j = 0; j < spheres.length; j++) {
        var q = spheres[j];
        q.x *= Rw / 10; q.y *= Rw / 10; q.z *= Rw / 10;
      }
    }
  }

  /* Where the cluster lives on screen, measured from the real layout. */
  function measure() {
    var hr = hero.getBoundingClientRect();
    var W = Math.max(1, hr.width), H = Math.max(1, hr.height);
    var header = document.querySelector('.site-header');
    var hb = header ? Math.max(56, header.getBoundingClientRect().bottom) : 72;
    var title = hero.querySelector('.hero-title');
    var tr = title ? title.getBoundingClientRect() : { top: H * 0.6, right: W * 0.5 };
    var gutter = Math.max(16, Math.min(48, W * 0.032));
    var wide = W >= 900 && W / H >= 1.05;
    var cx, cy, rp;
    if (wide) {
      var left = Math.max(tr.right - hr.left + 16, W * 0.46);
      var right = W - gutter;
      var top = hb + 8, bottom = H - 48;
      cx = (left + right) / 2; cy = (top + bottom) / 2;
      rp = Math.min(right - left, bottom - top) / 2 * 0.86;
    } else {
      var t2 = hb + 6, b2 = (tr.top - hr.top) - 14;
      var avail = Math.max(b2 - t2, H * 0.24);
      cx = W / 2; cy = t2 + avail / 2;
      rp = Math.min(W - gutter * 2, avail) / 2 * 0.92;
    }
    rp = Math.max(rp, 90);
    var halfH = Rw * (H / 2) / rp;
    layout = { W: W, H: H, wide: wide, halfH: halfH, halfW: halfH * W / H, camZ: halfH / TAN };
    center.x = (cx / W - 0.5) * 2 * layout.halfW;
    center.y = (0.5 - cy / H) * 2 * layout.halfH;
    center.z = 0;
  }

  /* ---------------- physics ---------------- */

  var pointer = { on: false, x: 0, y: 0, z: 0, tx: 0, ty: 0, vx: 0, vy: 0, r: 1.15, nx: 0, ny: 0 };

  function easeOutBack(t) { var c1 = 1.5, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); }

  function step(dt) {
    var n = spheres.length, i, j, s, o;
    var k = K_ATTR * (1 - 0.55 * scroll);
    var cy = center.y + scroll * Rw * 1.1;
    var damp = Math.exp(-DAMP * dt);
    for (i = 0; i < n; i++) {
      s = spheres[i];
      if (s.r < s.R) {
        var tt = (time - s.delay) / 0.85;
        s.r = tt <= 0 ? 0 : (tt >= 1 ? s.R : s.R * Math.max(0, easeOutBack(tt)));
      }
      var dx = center.x - s.x, dy = cy - s.y, dz = center.z - s.z;
      var ax = dx * k - dz * SWIRL + Math.sin(time * 0.9 + s.p0) * NOISE;
      var ay = dy * k + Math.sin(time * 0.73 + s.p1) * NOISE;
      var az = dz * k * 1.2 + dx * SWIRL + Math.sin(time * 0.81 + s.p2) * NOISE;
      s.vx = (s.vx + ax * dt) * damp;
      s.vy = (s.vy + ay * dt) * damp;
      s.vz = (s.vz + az * dt) * damp;
      s.x += s.vx * dt; s.y += s.vy * dt; s.z += s.vz * dt;
    }
    if (pointer.on) {
      var pr = pointer.r;
      for (i = 0; i < n; i++) {
        s = spheres[i];
        if (s.r <= 0) continue;
        var px = s.x - pointer.x, py = s.y - pointer.y, pz = s.z - pointer.z;
        var d = Math.sqrt(px * px + py * py + pz * pz), min = s.r + pr;
        if (d < min && d > 1e-5) {
          px /= d; py /= d; pz /= d;
          var pen = min - d;
          s.x += px * pen; s.y += py * pen; s.z += pz * pen;
          var vn = (s.vx - pointer.vx) * px + (s.vy - pointer.vy) * py + s.vz * pz;
          if (vn < 0) { s.vx -= 1.3 * vn * px; s.vy -= 1.3 * vn * py; s.vz -= 1.3 * vn * pz; }
        }
      }
    }
    for (var iter = 0; iter < 2; iter++) {
      for (i = 0; i < n; i++) {
        s = spheres[i];
        if (s.r <= 0) continue;
        var ws = 1 / (s.r * s.r * s.r);
        for (j = i + 1; j < n; j++) {
          o = spheres[j];
          if (o.r <= 0) continue;
          var ex = o.x - s.x, ey = o.y - s.y, ez = o.z - s.z;
          var md = s.r + o.r;
          var d2 = ex * ex + ey * ey + ez * ez;
          if (d2 >= md * md || d2 < 1e-10) continue;
          var dd = Math.sqrt(d2);
          ex /= dd; ey /= dd; ez /= dd;
          var wo = 1 / (o.r * o.r * o.r), wsum = ws + wo;
          var over = (md - dd) / wsum;
          s.x -= ex * over * ws; s.y -= ey * over * ws; s.z -= ez * over * ws;
          o.x += ex * over * wo; o.y += ey * over * wo; o.z += ez * over * wo;
          var rv = (o.vx - s.vx) * ex + (o.vy - s.vy) * ey + (o.vz - s.vz) * ez;
          if (rv < 0) {
            var J = -1.25 * rv / wsum;
            s.vx -= ex * J * ws; s.vy -= ey * J * ws; s.vz -= ez * J * ws;
            o.vx += ex * J * wo; o.vy += ey * J * wo; o.vz += ez * J * wo;
          }
        }
      }
    }
  }

  function burst(x, y, z, power) {
    for (var i = 0; i < spheres.length; i++) {
      var s = spheres[i];
      var dx = s.x - x, dy = s.y - y, dz = s.z - z;
      var d = Math.sqrt(dx * dx + dy * dy + dz * dz) + 1e-4;
      var f = power * Math.exp(-(d * d) / (Rw * Rw * 1.1));
      s.vx += dx / d * f; s.vy += dy / d * f; s.vz += (dz / d + 0.35) * f;
    }
  }

  /* ---------------- camera & drawing ---------------- */

  var P = new Float32Array(16), Vm = new Float32Array(16), VP = new Float32Array(16);
  var eye = [0, 0, 14], basis = { x: [1, 0, 0], y: [0, 1, 0], z: [0, 0, 1] };
  var par = { x: 0, y: 0, tx: 0, ty: 0 };

  function perspective(out, fovy, aspect, near, far) {
    var f = 1 / Math.tan(fovy / 2), nf = 1 / (near - far);
    out.fill(0);
    out[0] = f / aspect; out[5] = f; out[10] = (far + near) * nf; out[11] = -1; out[14] = 2 * far * near * nf;
  }
  function lookAt(out, e, t) {
    var zx = e[0] - t[0], zy = e[1] - t[1], zz = e[2] - t[2], l = Math.hypot(zx, zy, zz);
    zx /= l; zy /= l; zz /= l;
    var xx = zz, xy = 0, xz = -zx; l = Math.hypot(xx, xy, xz); xx /= l; xz /= l;
    var yx = zy * xz - zz * xy, yy = zz * xx - zx * xz, yz = zx * xy - zy * xx;
    out[0] = xx; out[1] = yx; out[2] = zx; out[3] = 0;
    out[4] = xy; out[5] = yy; out[6] = zy; out[7] = 0;
    out[8] = xz; out[9] = yz; out[10] = zz; out[11] = 0;
    out[12] = -(xx * e[0] + xy * e[1] + xz * e[2]);
    out[13] = -(yx * e[0] + yy * e[1] + yz * e[2]);
    out[14] = -(zx * e[0] + zy * e[1] + zz * e[2]);
    out[15] = 1;
    basis.x = [xx, xy, xz]; basis.y = [yx, yy, yz]; basis.z = [zx, zy, zz];
  }
  function mul(out, a, b) {
    for (var c = 0; c < 4; c++) for (var r = 0; r < 4; r++) {
      out[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3];
    }
  }

  var uS = new Float32Array(MAXS * 4), uC = new Float32Array(MAXS * 4);
  var order = [];
  var quality = 1;
  var dprCap = 1.75;

  function resizeCanvas() {
    var dpr = Math.min(window.devicePixelRatio || 1, dprCap) * quality;
    var w = Math.max(1, Math.round(layout.W * dpr)), h = Math.max(1, Math.round(layout.H * dpr));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
  }

  function draw() {
    var W = layout.W, H = layout.H;
    par.x += (par.tx - par.x) * 0.06;
    par.y += (par.ty - par.y) * 0.06;
    var ex = par.x * Rw * 0.35, ey = par.y * Rw * 0.25 - scroll * Rw * 0.4;
    eye[0] = ex; eye[1] = ey; eye[2] = layout.camZ;
    perspective(P, FOV, W / H, 0.5, layout.camZ + 40);
    lookAt(Vm, eye, [ex * 0.15, ey * 0.15, 0]);
    mul(VP, P, Vm);

    var n = spheres.length, i, s;
    order.length = 0;
    for (i = 0; i < n; i++) {
      s = spheres[i];
      var dx = s.x - eye[0], dy = s.y - eye[1], dz = s.z - eye[2];
      s.pw = dx * dx + dy * dy + dz * dz - s.r * s.r;
      uS[i * 4] = s.x; uS[i * 4 + 1] = s.y; uS[i * 4 + 2] = s.z; uS[i * 4 + 3] = s.r;
      uC[i * 4] = s.m.c[0]; uC[i * 4 + 1] = s.m.c[1]; uC[i * 4 + 2] = s.m.c[2]; uC[i * 4 + 3] = s.m.g;
      if (s.r > 0.01) order.push(s);
    }
    // Power of the eye against each sphere gives an exact back-to-front order for spheres that do not intersect.
    order.sort(function (a, b) { return b.pw - a.pw; });
    for (i = 0; i < order.length; i++) {
      s = order[i];
      var o = i * STRIDE;
      inst[o] = s.x; inst[o + 1] = s.y; inst[o + 2] = s.z; inst[o + 3] = s.r;
      inst[o + 4] = s.m.c[0]; inst[o + 5] = s.m.c[1]; inst[o + 6] = s.m.c[2]; inst[o + 7] = s.m.g;
      inst[o + 8] = s.idx;
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    if (!order.length) return;
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(prog);
    gl.uniformMatrix4fv(U.uVP, false, VP);
    gl.uniform3fv(U.uEye, eye);
    gl.uniform1f(U.uPix, 2 * TAN / canvas.height);
    gl.uniform1i(U.uCount, n);
    gl.uniform4fv(U.uS, uS);
    gl.uniform4fv(U.uC, uC);
    gl.uniform3fv(U.uL, LIGHT);
    gl.uniform1f(U.uExpo, 1.0);
    gl.bindBuffer(gl.ARRAY_BUFFER, instBuf);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, inst.subarray(0, order.length * STRIDE));
    gl.bindVertexArray(vao);
    gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, order.length);
    gl.bindVertexArray(null);
  }

  /* ---------------- input ---------------- */

  function toWorld(clientX, clientY, planeZ) {
    var hr = hero.getBoundingClientRect();
    var nx = ((clientX - hr.left) / layout.W) * 2 - 1;
    var ny = 1 - ((clientY - hr.top) / layout.H) * 2;
    var a = layout.W / layout.H;
    var dx = basis.x[0] * nx * TAN * a + basis.y[0] * ny * TAN - basis.z[0];
    var dy = basis.x[1] * nx * TAN * a + basis.y[1] * ny * TAN - basis.z[1];
    var dz = basis.x[2] * nx * TAN * a + basis.y[2] * ny * TAN - basis.z[2];
    var t = (planeZ - eye[2]) / dz;
    return { x: eye[0] + dx * t, y: eye[1] + dy * t, z: planeZ, nx: nx, ny: ny };
  }

  var lastPointer = 0;
  function onMove(e) {
    if (still) return;
    var w = toWorld(e.clientX, e.clientY, center.z + Rw * 0.35);
    pointer.tx = w.x; pointer.ty = w.y; pointer.z = w.z;
    if (!pointer.on) { pointer.x = w.x; pointer.y = w.y; pointer.on = true; }
    par.tx = w.nx; par.ty = w.ny;
    lastPointer = performance.now();
    wake();
  }
  function onLeave() { pointer.on = false; par.tx = 0; par.ty = 0; }
  function onDown(e) {
    if (still) return;
    if (e.target.closest && e.target.closest('a,button,input,textarea,select,label')) return;
    var w = toWorld(e.clientX, e.clientY, center.z);
    burst(w.x, w.y, w.z, e.pointerType === 'touch' ? 9 : 7);
    wake();
  }
  hero.addEventListener('pointermove', onMove, { passive: true });
  hero.addEventListener('pointerleave', onLeave, { passive: true });
  hero.addEventListener('pointercancel', onLeave, { passive: true });
  hero.addEventListener('pointerdown', onDown, { passive: true });

  function onScroll() {
    var h = layout.H || 1;
    var s = Math.min(1, Math.max(0, window.scrollY / (h * 0.9)));
    if (s !== scroll) { scroll = s; wake(); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------------- loop ---------------- */

  var raf = 0, last = 0, visible = true, slow = 0, ready = false;

  function frame(now) {
    raf = 0;
    if (!visible || document.hidden) return;
    var dtRaw = last ? (now - last) / 1000 : 1 / 60;
    last = now;
    var dt = Math.min(dtRaw, 1 / 30);
    time += dt;

    if (pointer.on) {
      var ox = pointer.x, oy = pointer.y;
      pointer.x += (pointer.tx - pointer.x) * 0.45;
      pointer.y += (pointer.ty - pointer.y) * 0.45;
      pointer.vx = (pointer.x - ox) / dt * 0.6;
      pointer.vy = (pointer.y - oy) / dt * 0.6;
      if (now - lastPointer > 2500 && matchMedia('(hover: none)').matches) onLeave();
    }
    var sub = 2, h = dt / sub;
    for (var i = 0; i < sub; i++) step(h);
    draw();

    if (!ready) { ready = true; hero.classList.add('is-3d'); }

    // Adaptive resolution: if frames keep running long, render fewer pixels.
    if (dtRaw > 0.026 && dtRaw < 0.25) slow++; else if (slow > 0) slow--;
    if (slow > 50 && quality > 0.6) { quality = Math.max(0.6, quality - 0.15); slow = 0; resizeCanvas(); }

    raf = requestAnimationFrame(frame);
  }
  function wake() {
    if (still) return;
    if (!raf && visible && !document.hidden) { last = 0; raf = requestAnimationFrame(frame); }
  }

  function settle(steps) {
    for (var i = 0; i < steps; i++) { time += 1 / 120; step(1 / 120); }
  }

  function relayout() {
    measure();
    resizeCanvas();
    if (still) { settle(30); draw(); hero.classList.add('is-3d'); }
  }

  var isSmall = Math.min(screen.width, screen.height) < 700 || window.innerWidth < 700;
  var count = isSmall ? 18 : 28;
  if (isSmall && navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) count = 16;
  dprCap = isSmall ? 1.6 : 1.75;
  build(count);
  measure();
  resizeCanvas();

  if (still) {
    settle(600);
    draw();
    hero.classList.add('is-3d');
    root.setAttribute('data-hero-ready', '1');
  } else {
    raf = requestAnimationFrame(frame);
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible) wake();
    }, { rootMargin: '80px' }).observe(hero);
  }
  document.addEventListener('visibilitychange', function () { if (!document.hidden) wake(); });

  var rzTimer = 0;
  function queueLayout() { clearTimeout(rzTimer); rzTimer = setTimeout(relayout, 60); }
  if ('ResizeObserver' in window) {
    var ro = new ResizeObserver(queueLayout);
    ro.observe(hero);
    var t = hero.querySelector('.hero-title');
    if (t) ro.observe(t);
  } else {
    window.addEventListener('resize', queueLayout);
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(queueLayout);

  canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); cancelAnimationFrame(raf); raf = 0; fail(); }, false);

  // Debug hook for automated screenshots.
  window.__heroSettle = function (n) { settle(n || 300); draw(); };
})();
