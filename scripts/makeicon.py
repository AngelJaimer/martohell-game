#!/usr/bin/env python3
"""Generate the PWA icons (public/icon-180.png and icon-512.png) for Martohell.

A bold pixel rendering of the Pont del Diable's pointed arch at dusk, with two
glowing devil eyes in the gatehouse. Re-run after edits:  python scripts/makeicon.py
"""
import math, os
from PIL import Image, ImageDraw

N = 64
img = Image.new("RGB", (N, N), (40, 24, 52))
cx, cy = N / 2, N * 0.66

# dusk radial sky: warm sun low-centre fading to deep purple
for y in range(N):
    for x in range(N):
        r = min(1.0, math.hypot(x - cx, (y - cy) * 1.25) / (N * 0.72))
        col = [int(250 - 196 * r), int(192 - 168 * r), int(128 - 70 * r)]
        if ((x ^ y) & 1) and r < 0.85:
            col = [min(255, col[0] + 8), col[1] + 6, col[2] + 8]
        img.putpixel((x, y), tuple(max(0, c) for c in col))

d = ImageDraw.Draw(img)
# distant hills
d.polygon([(0, 44), (22, 39), (44, 42), (64, 37), (64, 64), (0, 64)], fill=(46, 32, 54))

BRICK = (150, 72, 54)
DARK = (54, 28, 38)
# humped bridge mass
d.polygon([(4, 54), (4, 40), (30, 22), (36, 22), (60, 40), (60, 54)], fill=BRICK)
d.line([(4, 40), (30, 22), (36, 22), (60, 40)], fill=(190, 110, 84))
# tall pointed arch (carved to dark)
d.polygon([(27, 54), (27, 40), (32, 28), (37, 40), (37, 54)], fill=DARK)
# small round arch on the left
d.pieslice([12, 36, 26, 50], 180, 360, fill=DARK)
d.rectangle([12, 43, 26, 54], fill=DARK)
# gatehouse + glowing devil eyes
d.rectangle([29, 15, 35, 24], fill=BRICK)
d.rectangle([29, 15, 35, 16], fill=(190, 110, 84))
for ex in (30, 33):
    d.point((ex, 19), fill=(255, 214, 90))
    img.putpixel((ex, 18), (255, 170, 40))
# river glint
d.line([(28, 58), (36, 58)], fill=(210, 150, 90))

out = os.path.join(os.path.dirname(__file__), "..", "public")
for size in (180, 512):
    img.resize((size, size), Image.NEAREST).save(os.path.join(out, f"icon-{size}.png"))
print("wrote public/icon-180.png and icon-512.png")
