# Procesa la foto del producto: quita el fondo blanco del original 1500px
# (flood-fill desde los bordes para preservar el texto blanco de la etiqueta),
# recorta y suaviza el borde alfa.
from PIL import Image, ImageDraw, ImageFilter

SRC = r"C:\Users\houdr\Downloads\zma-zinc-magnesio-vitamina-b6-120-capsulas-bodyathlon-00.jpg"
DST = r"C:\Users\houdr\Desktop\ZMA\bodyathlon-zma\public\product\zma-bottle.png"

KEY = (255, 0, 255)  # color de marcado que no existe en la foto
THRESH = 85          # absorbe también la sombra gris clara del fondo

img = Image.open(SRC).convert("RGB")
w, h = img.size

# Flood-fill del fondo desde los 4 bordes (cada 40 px por si hay zonas aisladas)
seeds = [(x, 0) for x in range(0, w, 40)] + [(x, h - 1) for x in range(0, w, 40)]
seeds += [(0, y) for y in range(0, h, 40)] + [(w - 1, y) for y in range(0, h, 40)]
for seed in seeds:
    if img.getpixel(seed) != KEY:
        ImageDraw.floodfill(img, seed, KEY, thresh=THRESH)

# Convertir el color de marcado en transparencia
rgba = img.convert("RGBA")
pixels = rgba.load()
for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        if (r, g, b) == KEY:
            pixels[x, y] = (0, 0, 0, 0)

# Suavizar el borde del alfa (anti-aliasing) sin tocar el interior
alpha = rgba.getchannel("A")
alpha_smooth = alpha.filter(ImageFilter.GaussianBlur(1.2))
rgba.putalpha(alpha_smooth)

# Recortar al contenido con un margen
bbox = rgba.getbbox()
pad = 24
bbox = (max(0, bbox[0] - pad), max(0, bbox[1] - pad), min(w, bbox[2] + pad), min(h, bbox[3] + pad))
rgba = rgba.crop(bbox)

# Nitidez ligera (mejora percibida de calidad)
rgb = rgba.convert("RGB").filter(ImageFilter.UnsharpMask(radius=1.6, percent=70, threshold=3))
final = Image.merge("RGBA", (*rgb.split(), rgba.getchannel("A")))

final.save(DST, "PNG", optimize=True)
print(f"OK: {final.size[0]}x{final.size[1]} -> {DST}")
