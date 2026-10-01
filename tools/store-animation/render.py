from PIL import Image, ImageDraw, ImageFont, ImageFilter
from pathlib import Path
import math

ROOT = Path(__file__).parent
FRAMES = Path("/tmp/webwork-uk-animation-frames")
FRAMES.mkdir(exist_ok=True)
W, H = 960, 360
FPS, TOTAL = 20, 160
BG = (8, 9, 10)
ACID = (217, 255, 63)
WHITE = (246, 245, 239)
MUTED = (158, 161, 166)
REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

def font(size, bold=False):
    return ImageFont.truetype(BOLD if bold else REG, size)

def clamp(v):
    return max(0.0, min(1.0, v))

def ease(v):
    v = clamp(v)
    return 1 - (1 - v) ** 3

def smooth(v):
    v = clamp(v)
    return v * v * (3 - 2 * v)

def prog(t, a, b, fn=ease):
    return fn((t - a) / (b - a))

def alpha_scale(color, a):
    return (*color[:3], int(255 * clamp(a)))

def layer():
    return Image.new("RGBA", (W, H), (0, 0, 0, 0))

def rounded_outline(draw, box, radius, fill, width=1):
    draw.rounded_rectangle(box, radius=radius, outline=fill, width=width)

photo_src = Image.open(ROOT / "assets" / "architecture-hero.png").convert("RGB")

def cover_crop(img, size, zoom=1.0, shift_x=0):
    tw, th = size
    ratio = max(tw / img.width, th / img.height) * zoom
    nw, nh = int(img.width * ratio), int(img.height * ratio)
    im = img.resize((nw, nh), Image.Resampling.LANCZOS)
    left = int((nw - tw) * .72 + shift_x)
    top = int((nh - th) * .56)
    left = max(0, min(nw - tw, left)); top = max(0, min(nh - th, top))
    return im.crop((left, top, left + tw, top + th))

def draw_tracking(draw, xy, text, fnt, fill, spacing=2):
    x, y = xy
    for ch in text:
        draw.text((x, y), ch, font=fnt, fill=fill)
        x += draw.textlength(ch, font=fnt) + spacing

def text_slide(base, text, xy, fnt, fill, amount, outline=False):
    x, y = xy
    bbox = ImageDraw.Draw(base).textbbox((x, y), text, font=fnt, stroke_width=1 if outline else 0)
    h = bbox[3] - bbox[1] + 8
    mask = Image.new("L", (W, H), 0)
    md = ImageDraw.Draw(mask)
    md.rectangle((x - 4, y - 3, W, y + h), fill=255)
    content = layer(); cd = ImageDraw.Draw(content)
    yy = y + int((1 - amount) * (h + 10))
    if outline:
        cd.text((x, yy), text, font=fnt, fill=BG + (255,), stroke_width=1, stroke_fill=(205, 208, 210, 220))
    else:
        cd.text((x, yy), text, font=fnt, fill=fill)
    content.putalpha(Image.composite(content.getchannel("A"), Image.new("L", (W, H), 0), mask))
    base.alpha_composite(content)

def delicate_cursor(alpha):
    """Render a small cursor at 6x and downsample for smooth, fine edges."""
    scale = 6
    cw, ch = 13, 18
    cursor = Image.new("RGBA", (cw * scale, ch * scale), (0, 0, 0, 0))
    draw = ImageDraw.Draw(cursor)
    raw = [(1.2, .8), (1.7, 14.8), (4.8, 11.6), (7.9, 17.0),
           (10.2, 15.7), (7.1, 10.4), (12.0, 9.9)]
    pts = [(round(x * scale), round(y * scale)) for x, y in raw]
    fill = (252, 252, 250, int(242 * alpha))
    edge = (24, 25, 26, int(210 * alpha))
    draw.polygon(pts, fill=fill)
    draw.line(pts + [pts[0]], fill=edge, width=3, joint="curve")
    return cursor.resize((cw, ch), Image.Resampling.LANCZOS)

def refined_cta(alpha, hover):
    """Draw the CTA at 4x and downsample for clean type and rounded edges."""
    scale = 4
    bw = int(158 * (1 + .025 * hover))
    bh = int(38 * (1 + .025 * hover))
    pad = 4
    canvas = Image.new(
        "RGBA",
        ((bw + pad * 2) * scale, (bh + pad * 2) * scale),
        (0, 0, 0, 0),
    )
    draw = ImageDraw.Draw(canvas)
    box = (
        pad * scale,
        pad * scale,
        (pad + bw) * scale,
        (pad + bh) * scale,
    )
    bcol = tuple(int(ACID[k] + (255 - ACID[k]) * hover) for k in range(3))
    draw.rounded_rectangle(
        box,
        radius=19 * scale,
        fill=(*bcol, int(255 * alpha)),
    )

    label = "ДИВИТИСЬ ПРОЄКТ"
    label_font = font(8 * scale, True)
    label_color = (8, 9, 10, int(250 * alpha))
    x = (pad + 16) * scale
    y = (pad + 13) * scale
    for ch in label:
        draw.text((x, y), ch, font=label_font, fill=label_color)
        x += draw.textlength(ch, font=label_font) + 1.05 * scale

    # Thin open arrow, also supersampled so it stays crisp after video scaling.
    ax = (pad + bw - 25) * scale
    ay = (pad + 12) * scale
    arrow_color = (8, 9, 10, int(245 * alpha))
    stroke = 1 * scale
    draw.line((ax, ay + 11 * scale, ax + 12 * scale, ay - 1 * scale), fill=arrow_color, width=stroke)
    draw.line((ax + 5 * scale, ay - 1 * scale, ax + 12 * scale, ay - 1 * scale), fill=arrow_color, width=stroke)
    draw.line((ax + 12 * scale, ay - 1 * scale, ax + 12 * scale, ay + 6 * scale), fill=arrow_color, width=stroke)

    return canvas.resize((bw + pad * 2, bh + pad * 2), Image.Resampling.LANCZOS), pad

def refined_project_tag(alpha):
    """Render the project badge at 4x for legible micro-type and fine detail."""
    scale = 4
    bw, bh, pad = 170, 24, 3
    canvas = Image.new(
        "RGBA",
        ((bw + pad * 2) * scale, (bh + pad * 2) * scale),
        (0, 0, 0, 0),
    )
    draw = ImageDraw.Draw(canvas)
    box = (
        pad * scale,
        pad * scale,
        (pad + bw) * scale,
        (pad + bh) * scale,
    )
    draw.rounded_rectangle(
        box,
        radius=12 * scale,
        fill=(8, 9, 10, int(205 * alpha)),
        outline=(255, 255, 255, int(70 * alpha)),
        width=scale,
    )

    # Small status light gives the badge a purposeful interface detail.
    dot_x = (pad + 13) * scale
    dot_y = (pad + 12) * scale
    dot_r = 2 * scale
    draw.ellipse(
        (dot_x - dot_r, dot_y - dot_r, dot_x + dot_r, dot_y + dot_r),
        fill=(217, 255, 63, int(245 * alpha)),
    )

    label_font = font(7 * scale, True)
    label_color = (229, 231, 232, int(238 * alpha))
    accent_color = (217, 255, 63, int(238 * alpha))
    x = (pad + 24) * scale
    y = (pad + 8) * scale
    for ch in "ДІМ НА ПІВНОЧІ":
        draw.text((x, y), ch, font=label_font, fill=label_color)
        x += draw.textlength(ch, font=label_font) + .8 * scale
    x += 5 * scale
    draw.line((x, (pad + 7) * scale, x, (pad + 17) * scale), fill=(255, 255, 255, int(65 * alpha)), width=scale)
    x += 7 * scale
    for ch in "01":
        draw.text((x, y), ch, font=label_font, fill=accent_color)
        x += draw.textlength(ch, font=label_font) + .8 * scale

    return canvas.resize((bw + pad * 2, bh + pad * 2), Image.Resampling.LANCZOS), pad

for idx in range(TOTAL):
    t = idx / FPS
    fade_out = 1 - prog(t, 7.35, 7.98, smooth)
    im = Image.new("RGBA", (W, H), BG + (255,))

    # Atmospheric wash
    wa = prog(t, .25, 1.15) * fade_out
    if wa:
        glow = layer()
        gd = ImageDraw.Draw(glow)
        gd.ellipse((485, -90, 1050, 455), fill=(44, 76, 97, int(44 * wa)))
        gd.ellipse((-180, 205, 300, 565), fill=(140, 170, 40, int(12 * wa)))
        glow = glow.filter(ImageFilter.GaussianBlur(78))
        im.alpha_composite(glow)

    # Grid construction lines
    ga = prog(t, .35, 1.25) * (1 - .48 * prog(t, 2.65, 3.8)) * fade_out
    g = layer(); d = ImageDraw.Draw(g)
    for x in range(0, W + 1, 60): d.line((x, 0, x, H), fill=(255, 255, 255, int(32 * ga)), width=1)
    for y in range(0, H + 1, 60): d.line((0, y, W, y), fill=(255, 255, 255, int(32 * ga)), width=1)
    im.alpha_composite(g)

    # Outer browser frame
    fa = prog(t, .55, 1.25) * fade_out
    fr = layer(); fd = ImageDraw.Draw(fr)
    rounded_outline(fd, (18, 18, 941, 341), 20, (255, 255, 255, int(31 * fa)), 1)
    im.alpha_composite(fr)

    # Scan line during construction
    sp = prog(t, .55, 3.35, smooth)
    if 0 < sp < 1:
        sy = int(sp * H)
        sc = layer(); sd = ImageDraw.Draw(sc)
        sd.line((90, sy, 870, sy), fill=(217, 255, 63, 145), width=1)
        sc = sc.filter(ImageFilter.GaussianBlur(2)); im.alpha_composite(sc)

    # Navigation
    na = prog(t, 1.05, 1.85) * fade_out
    nav = layer(); nd = ImageDraw.Draw(nav)
    ny = int(36 + (1 - na) * -10)
    nd.line((43, ny + 5, 61, ny + 5), fill=alpha_scale(ACID, na), width=2)
    nd.line((50, ny + 15, 68, ny + 15), fill=alpha_scale(WHITE, na), width=2)
    draw_tracking(nd, (77, ny), "ФОРМА", font(11, True), alpha_scale(WHITE, na), 2)
    x = 724
    for label, color in [("ПРОЄКТИ", WHITE), ("СТУДІЯ", WHITE), ("КОНТАКТИ", ACID)]:
        draw_tracking(nd, (x, ny + 2), label, font(7), alpha_scale(color, na), 1)
        x += 78
    im.alpha_composite(nav)

    # Temporary wireframes
    wire_a = prog(t, .75, 1.35) * (1 - prog(t, 2.65, 3.25)) * fade_out
    wr = layer(); wd = ImageDraw.Draw(wr)
    wd.rectangle((41, 89, 463, 314), outline=(217, 255, 63, int(95 * wire_a)), width=1)
    wd.rectangle((487, 82, 918, 320), outline=(255, 255, 255, int(60 * wire_a)), width=1)
    draw_tracking(wd, (42, 76), "01 / ЗМІСТ", font(6), (217, 255, 63, int(180 * wire_a)), 1)
    draw_tracking(wd, (488, 69), "02 / ФОТО", font(6), (210, 212, 215, int(160 * wire_a)), 1)
    im.alpha_composite(wr)

    # Photo reveals from left to right
    pp = prog(t, 2.35, 3.62)
    if pp > 0:
        pw, ph = 431, 238
        moving = cover_crop(photo_src, (pw, ph), zoom=1.07 - .035 * prog(t, 3.6, 7.2), shift_x=int(7 * (1 - prog(t, 3.6, 7.2))))
        reveal_w = max(1, int(pw * pp))
        part = moving.crop((0, 0, reveal_w, ph)).convert("RGBA")
        shade = Image.new("RGBA", (reveal_w, ph), (0, 0, 0, 22))
        part = Image.alpha_composite(part, shade)
        im.alpha_composite(part, (487, 82))

    # Copy builds in sequence
    ea = prog(t, 1.65, 2.35) * fade_out
    cp = layer(); cd = ImageDraw.Draw(cp)
    cd.line((42, 101, 66, 101), fill=alpha_scale(ACID, ea), width=1)
    draw_tracking(cd, (77, 96), "АРХІТЕКТУРА / 2026", font(7), alpha_scale(ACID, ea), 1)
    im.alpha_composite(cp)
    p1 = prog(t, 1.95, 2.95) * fade_out
    p2 = prog(t, 2.18, 3.18) * fade_out
    text_slide(im, "ПРОСТІР", (41, 128), font(45, True), alpha_scale(WHITE, p1), p1)
    text_slide(im, "ДЛЯ ЖИТТЯ.", (41, 170), font(45, True), alpha_scale(WHITE, p2), p2, outline=True)

    da = prog(t, 3.0, 3.85) * fade_out
    desc = layer(); dd = ImageDraw.Draw(desc)
    desc_lines = ["Архітектура, що поєднує світло, природу", "та комфорт щоденного життя."]
    for j, line in enumerate(desc_lines): dd.text((42, 228 + j * 15 + int((1-da)*8)), line, font=font(9), fill=alpha_scale(MUTED, da))
    im.alpha_composite(desc)

    # CTA, image tag, counter
    ba = prog(t, 3.5, 4.3) * fade_out
    hover = prog(t, 6.46, 6.68) * (1 - prog(t, 6.86, 7.1))
    bt = layer(); bd = ImageDraw.Draw(bt)
    bx, by = 42, 273
    cta, cta_pad = refined_cta(ba, hover)
    bt.alpha_composite(cta, (bx - cta_pad, by - cta_pad))
    tag_a = prog(t, 3.72, 4.45) * fade_out
    project_tag, tag_pad = refined_project_tag(tag_a)
    bt.alpha_composite(project_tag, (501 - tag_pad, 91 - tag_pad))
    cnt_a = prog(t, 4.15, 4.85) * fade_out
    bd.line((844, 329, 872, 329), fill=(217,255,63,int(230*cnt_a)), width=1)
    draw_tracking(bd, (882, 325), "01 / 04", font(6), (225,225,225,int(235*cnt_a)), 1)
    im.alpha_composite(bt)

    # Cursor arrives and clicks
    ca = prog(t, 5.25, 5.55) * (1 - prog(t, 7.0, 7.2)) * fade_out
    if ca > 0:
        move = prog(t, 5.35, 6.58, smooth)
        cx = int(545 + (151 - 545) * move); cy = int(220 + (286 - 220) * move)
        im.alpha_composite(delicate_cursor(ca), (cx, cy))

    note_a = prog(t, .6, 1.2) * (1 - prog(t, 3.25, 4.0)) * fade_out
    nt = layer(); ntd = ImageDraw.Draw(nt)
    draw_tracking(ntd, (27, 337), "СТВОРЕННЯ САЙТУ / КРОК ЗА КРОКОМ", font(5), (120,124,129,int(220*note_a)), 1)
    im.alpha_composite(nt)

    im.crop((0, 72, 960, 360)).convert("RGB").save(FRAMES / f"frame_{idx:04d}.png", optimize=False)

print(f"Rendered {TOTAL} frames to {FRAMES}")
