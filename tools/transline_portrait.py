"""TransLine: вертикальні кадри для телефонів (frames/p, 540x1170 — пропорція сучасних телефонів 19.5:9).

Джерело — seq-d.mp4 (1280x720, 478 кадрів). Альбомний кадр у вертикальному екрані
раніше просто обрізався по центру — видно було лише шматок борту фури.
Тут кожен кадр компонується так:
  • фон — той самий кадр, збільшений на весь екран, сильно розмитий і притемнений;
  • по центру — смуга з фурою майже на всю ширину (вікно 880 px слідкує за фурою),
    з мʼякими краями, що переходять у фон.
Кадри 478+ — суцільний білий (як і в d/m), їх малює сам скрипт.

Запуск: python3 tools/transline_portrait.py  (потрібні ffmpeg, Pillow, numpy)
"""
import os, subprocess, tempfile
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance

ROOT = os.path.join(os.path.dirname(__file__), '..', 'assets', 'concepts', 'transline')
SRC = os.path.join(ROOT, 'seq-d.mp4')
OUT = os.path.join(ROOT, 'frames', 'p')
W, H = 540, 1170            # розмір вертикального кадру
CROP_W = 820                # ширина вікна з джерела для центральної смуги
BAND_TOP = 118              # де починається смуга (px від верху кадру)
FEATHER = 70                # мʼякий перехід смуги у фон
FRAMES = 478                # решта до 482 — білі

os.makedirs(OUT, exist_ok=True)
tmp = tempfile.mkdtemp()
subprocess.run(['ffmpeg', '-v', 'error', '-i', SRC, '-vsync', '0', os.path.join(tmp, '%04d.png')], check=True)
files = sorted(f for f in os.listdir(tmp) if f.endswith('.png'))[:FRAMES]

# ── де фура: центр «маси» контрастних країв по горизонталі, згладжений у часі ──
cx = []
for f in files:
    g = np.asarray(Image.open(os.path.join(tmp, f)).convert('L').resize((320, 180)), np.float32)
    g = g[25:150]
    gx = np.abs(np.diff(g, axis=1))[:-1, :] + np.abs(np.diff(g, axis=0))[:, :-1]
    prof = gx.sum(0)
    prof = np.maximum(prof - np.percentile(prof, 30), 0)
    xs = np.arange(len(prof))
    cx.append(float((prof * xs).sum() / (prof.sum() + 1e-6)) / len(prof) * 1280)
cx = np.array(cx)
k = np.exp(-0.5 * (np.arange(-24, 25) / 9.0) ** 2); k /= k.sum()
pad = np.pad(cx, 24, mode='edge')
cx = np.convolve(pad, k, mode='valid')
cx = np.clip(cx, CROP_W / 2, 1280 - CROP_W / 2)

band_h = round(720 * W / CROP_W)
mask = np.ones((band_h, W), np.float32)
ramp = np.linspace(0, 1, FEATHER) ** 1.6
mask[:FEATHER] *= ramp[:, None]
mask[-FEATHER:] *= ramp[::-1][:, None]
mask_img = Image.fromarray((mask * 255).astype(np.uint8), 'L')

for i, f in enumerate(files):
    src = Image.open(os.path.join(tmp, f)).convert('RGB')
    c = cx[i]
    # фон: кадр на весь екран (cover), розмитий і притемнений — розмиваємо в малому розмірі
    s = H / 720
    bw = round(1280 * s)
    left = int(np.clip(c * s - W / 2, 0, bw - W))
    bg = src.resize((bw, H), Image.BILINEAR).crop((left, 0, left + W, H))
    bg = bg.resize((W // 3, H // 3), Image.BILINEAR).filter(ImageFilter.GaussianBlur(14)).resize((W, H), Image.BICUBIC)
    bg = ImageEnhance.Brightness(ImageEnhance.Color(bg).enhance(0.85)).enhance(0.78)
    # кінцівка ролика вибілюється — фон вибілюємо так само, інакше під білою смугою лишається сіре
    m = float(np.asarray(src.convert('L').resize((64, 36)), np.float32).mean())
    wk = min(1.0, max(0.0, (m - 170) / 70))
    if wk > 0:
        bg = Image.blend(bg, Image.new('RGB', (W, H), (255, 255, 255)), wk)
    # смуга з фурою
    x0 = int(round(c - CROP_W / 2))
    band = src.crop((x0, 0, x0 + CROP_W, 720)).resize((W, band_h), Image.LANCZOS)
    bg.paste(band, (0, BAND_TOP), mask_img)
    bg.save(os.path.join(OUT, f'{i:04d}.webp'), 'WEBP', quality=72, method=5)

# білі кадри — щоб усі папки мали однаковий набір файлів
white = Image.new('RGB', (W, H), (255, 255, 255))
for i in range(FRAMES, 482):
    white.save(os.path.join(OUT, f'{i:04d}.webp'), 'WEBP', quality=80)
sizes = [os.path.getsize(os.path.join(OUT, f)) for f in os.listdir(OUT)]
print('кадрів', len(sizes), 'середній розмір', round(sum(sizes) / len(sizes) / 1024, 1), 'КБ', 'смуга', band_h, 'px')
