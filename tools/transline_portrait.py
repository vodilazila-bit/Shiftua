"""TransLine: кадри для телефона вертикально (frames/p, 540x474).

Джерело — seq-d.mp4 (1280x720, 478 кадрів). На вертикальному екрані сторінка показує
відео смугою на всю ширину одразу під шапкою, без розмитого фону: смугу малює app.js,
а поля над і під нею заливає суцільним темним кольором.
Тут кожен кадр — вікно 820x720 з джерела, що слідкує за фурою, зменшене до 540x474.
Кадри 478+ — суцільний білий (як і в d/m).

Запуск: python3 tools/transline_portrait.py  (потрібні ffmpeg, Pillow, numpy)
"""
import os, subprocess, tempfile
import numpy as np
from PIL import Image

ROOT = os.path.join(os.path.dirname(__file__), '..', 'assets', 'concepts', 'transline')
SRC = os.path.join(ROOT, 'seq-d.mp4')
OUT = os.path.join(ROOT, 'frames', 'p')
W = 540                     # ширина кадру
CROP_W = 820                # ширина вікна з джерела (фура майже на всю ширину)
H = round(720 * W / CROP_W) # 474 — висота кадру
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

for f in os.listdir(OUT):
    if f.endswith('.webp'):
        os.remove(os.path.join(OUT, f))

for i, f in enumerate(files):
    src = Image.open(os.path.join(tmp, f)).convert('RGB')
    x0 = int(round(cx[i] - CROP_W / 2))
    band = src.crop((x0, 0, x0 + CROP_W, 720)).resize((W, H), Image.LANCZOS)
    band.save(os.path.join(OUT, f'{i:04d}.webp'), 'WEBP', quality=76, method=5)

# білі кадри — щоб усі папки мали однаковий набір файлів
white = Image.new('RGB', (W, H), (255, 255, 255))
for i in range(FRAMES, 482):
    white.save(os.path.join(OUT, f'{i:04d}.webp'), 'WEBP', quality=80)
sizes = [os.path.getsize(os.path.join(OUT, f)) for f in os.listdir(OUT)]
print('кадрів', len(sizes), 'середній розмір', round(sum(sizes) / len(sizes) / 1024, 1), 'КБ', 'кадр', W, 'x', H)
