#!/usr/bin/env python3
"""
logo.svg 하나로 PWA 설치 자산을 전부 만들어 내는 스크립트.

  python3 scripts/generate-pwa-assets.py

만드는 것
  src/app/favicon.ico            브라우저 탭 (16·32·48·64 멀티사이즈)
  src/app/icon.svg               벡터 파비콘 (심볼만 잘라낸 SVG)
  src/app/apple-icon.png         iOS 홈화면 아이콘 180×180
  public/icons/icon-*.png        manifest 아이콘 192·512 (any / maskable)
  public/splash/apple-splash-*   iOS 스플래시 (기기별 세로·가로)
  src/lib/pwa/appleSplash.ts     위 스플래시의 media query 목록 (layout.tsx 가 읽는다)

전제
  - 래스터화는 macOS 기본 도구 `sips` 가 한다 (SVG → PNG). 다른 OS 에서는 동작하지 않는다.
  - 합성·리사이즈는 Pillow 가 한다 (`python3 -m pip install pillow`).

logo.svg 구조 (2048×2048 트레이싱 결과)
  - 0번 path 가 캔버스를 덮는 배경(#FDFDFB), 27~30번 path 4개가 주황 심볼, 나머지가 워드마크.
  - 그래서 "심볼만" / "로고 전체만" 은 viewBox 를 잘라서 뽑는다. 래스터를 크롭하지 않으므로
    어떤 크기로 뽑아도 경계가 깨지지 않는다.
  - 배경색은 앱 화면색(--color-background-screen = #FFFDF7)으로 치환한다. 스플래시 →
    첫 화면 전환에서 배경이 튀지 않게 하려는 것.
"""

from __future__ import annotations

import re
import shutil
import struct
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
LOGO = ROOT / "logo.svg"

# ── 색 ────────────────────────────────────────────────────────────────
SOURCE_BG = "#FDFDFB"  # logo.svg 안의 배경색
BG = "#FFFDF7"  # 앱 화면색(neutral-50). manifest background_color 와 같은 값.
BG_RGB = (0xFF, 0xFD, 0xF7)

# ── logo.svg 안에서의 좌표 (2048 단위) ────────────────────────────────
SYMBOL_BOX = (894, 752, 1168, 975)  # 주황 심볼만
LOCKUP_BOX = (152, 752, 1907, 1212)  # 심볼 + 워드마크

# 아이콘 canvas 대비 심볼 가로 비율. 용도마다 여백이 다르다.
COVERAGE = {
    "icon": 0.68,  # manifest any 아이콘
    "maskable": 0.50,  # 마스크가 잘라내는 20% 안쪽에 들어가야 한다
    "apple": 0.62,  # iOS 라운드 스퀘어 마스크
    "favicon": 0.78,  # 16px 에서도 형태가 남도록 꽉 채운다
}

# iOS 스플래시 대상 기기: (CSS 폭, CSS 높이, DPR, 설명)
APPLE_DEVICES = [
    (320, 568, 2, "iPhone SE (1st) · 5s"),
    (375, 667, 2, "iPhone SE (2nd·3rd) · 8 · 7 · 6s"),
    (414, 736, 3, "iPhone 8 Plus · 7 Plus · 6s Plus"),
    (375, 812, 3, "iPhone X · XS · 11 Pro · 12 mini · 13 mini"),
    (414, 896, 2, "iPhone XR · 11"),
    (414, 896, 3, "iPhone XS Max · 11 Pro Max"),
    (390, 844, 3, "iPhone 12 · 12 Pro · 13 · 13 Pro · 14"),
    (428, 926, 3, "iPhone 12 Pro Max · 13 Pro Max · 14 Plus"),
    (393, 852, 3, "iPhone 14 Pro · 15 · 15 Pro · 16"),
    (430, 932, 3, "iPhone 14 Pro Max · 15 Plus · 15 Pro Max · 16 Plus"),
    (402, 874, 3, "iPhone 16 Pro"),
    (440, 956, 3, "iPhone 16 Pro Max"),
    (744, 1133, 2, "iPad mini (6th)"),
    (768, 1024, 2, "iPad 9.7 · iPad mini (5th)"),
    (810, 1080, 2, "iPad 10.2"),
    (820, 1180, 2, "iPad Air 10.9 · 11″"),
    (834, 1112, 2, "iPad Pro 10.5"),
    (834, 1194, 2, "iPad Pro 11″"),
    (1024, 1366, 2, "iPad Pro 12.9″"),
    (1032, 1376, 2, "iPad Pro 13″ (M4)"),
]


# ── SVG 조립 ──────────────────────────────────────────────────────────
def read_paths() -> list[tuple[str, str]]:
    svg = LOGO.read_text(encoding="utf-8")
    paths = re.findall(r'<path fill="(#[0-9A-Fa-f]{6})" d="([^"]+)"/>', svg)
    if len(paths) < 30:
        sys.exit(f"logo.svg 를 읽지 못했습니다 (path {len(paths)}개). 파일이 바뀌었나요?")
    return paths


def svg_document(paths: list[tuple[str, str]], view_box: tuple[float, float, float, float]) -> str:
    """viewBox 로 잘라낸 SVG 한 장. 배경은 viewBox 전체를 덮도록 다시 그린다."""
    x, y, w, h = view_box
    body = "".join(
        f'<path fill="{BG if fill.upper() == SOURCE_BG else fill}" d="{d}"/>' for fill, d in paths
    )
    return (
        '<?xml version="1.0" encoding="utf-8"?>'
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{w:g}" height="{h:g}" '
        f'viewBox="{x:g} {y:g} {w:g} {h:g}">'
        f'<rect x="{x:g}" y="{y:g}" width="{w:g}" height="{h:g}" fill="{BG}"/>'
        f"{body}</svg>"
    )


def square_view_box(box: tuple[int, int, int, int], coverage: float) -> tuple[float, float, float, float]:
    """심볼이 정사각형 캔버스의 `coverage` 비율을 차지하도록 viewBox 를 넓힌다."""
    x0, y0, x1, y1 = box
    side = (x1 - x0) / coverage
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    return (cx - side / 2, cy - side / 2, side, side)


def symbol_svg(paths: list[tuple[str, str]], coverage: float) -> str:
    """심볼(주황 path 4개)만 남긴 정사각형 SVG. 워드마크는 아예 빼서 viewBox 밖 잔상이 없다."""
    orange = [(fill, d) for fill, d in paths if fill.upper() == "#F75628"]
    return svg_document(orange, square_view_box(SYMBOL_BOX, coverage))


def lockup_svg(paths: list[tuple[str, str]]) -> str:
    x0, y0, x1, y1 = LOCKUP_BOX
    return svg_document(paths, (x0, y0, x1 - x0, y1 - y0))


# ── 래스터화 ──────────────────────────────────────────────────────────
def rasterize(svg_text: str, width: int, work: Path, name: str) -> Image.Image:
    svg_file = work / f"{name}.svg"
    png_file = work / f"{name}-{width}.png"
    svg_file.write_text(svg_text, encoding="utf-8")
    subprocess.run(
        ["sips", "-s", "format", "png", "--resampleWidth", str(width), str(svg_file), "--out", str(png_file)],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    with Image.open(png_file) as im:
        return im.convert("RGB")


def save_png(im: Image.Image, path: Path, palette: bool = True) -> None:
    """색이 서너 가지뿐이라 팔레트 PNG 로 저장한다 (같은 그림에 용량 1/5)."""
    path.parent.mkdir(parents=True, exist_ok=True)
    out = im.convert("P", palette=Image.Palette.ADAPTIVE, colors=128) if palette else im
    out.save(path, format="PNG", optimize=True)


def write_ico(frames: list[tuple[int, Image.Image]], path: Path) -> None:
    """PNG 를 그대로 품는 ICO 컨테이너를 직접 쓴다 (Pillow 의 ICO 리사이즈보다 선명하다).

    프레임은 RGBA 로 넣는다. Next.js 의 ICO 디코더가 RGBA PNG 만 받기 때문이다.
    """
    blobs = []
    for size, frame in frames:
        buf = tempfile.SpooledTemporaryFile()
        frame.convert("RGBA").save(buf, format="PNG", optimize=True)
        buf.seek(0)
        blobs.append((size, buf.read()))

    header = struct.pack("<HHH", 0, 1, len(blobs))
    offset = len(header) + 16 * len(blobs)
    entries, payload = b"", b""
    for size, blob in blobs:
        entries += struct.pack(
            "<BBBBHHII", size if size < 256 else 0, size if size < 256 else 0, 0, 0, 1, 32, len(blob), offset
        )
        payload += blob
        offset += len(blob)
    path.write_bytes(header + entries + payload)


# ── 스플래시 ──────────────────────────────────────────────────────────
def splash_image(master: Image.Image, width: int, height: int) -> Image.Image:
    """배경 위에 로고를 가운데 놓는다. 폭이 좁은 쪽 62%, 다만 긴 쪽의 30% 를 넘지 않게."""
    canvas = Image.new("RGB", (width, height), BG_RGB)
    logo_w = int(min(min(width, height) * 0.62, max(width, height) * 0.30))
    logo_h = max(1, round(logo_w * master.height / master.width))
    logo = master.resize((logo_w, logo_h), Image.Resampling.LANCZOS)
    canvas.paste(logo, ((width - logo_w) // 2, (height - logo_h) // 2))
    return canvas


def splash_entries() -> list[dict[str, object]]:
    entries = []
    for css_w, css_h, dpr, label in APPLE_DEVICES:
        for orientation in ("portrait", "landscape"):
            w, h = (css_w * dpr, css_h * dpr) if orientation == "portrait" else (css_h * dpr, css_w * dpr)
            entries.append(
                {
                    "file": f"apple-splash-{w}x{h}.png",
                    "width": w,
                    "height": h,
                    "media": (
                        f"(device-width: {css_w}px) and (device-height: {css_h}px) "
                        f"and (-webkit-device-pixel-ratio: {dpr}) and (orientation: {orientation})"
                    ),
                    "label": f"{label} · {orientation}",
                }
            )
    return entries


def write_splash_module(entries: list[dict[str, object]], path: Path) -> None:
    lines = [
        "/**",
        " * iOS 홈화면 스플래시 목록 — `scripts/generate-pwa-assets.py` 가 생성한다. 직접 고치지 말 것.",
        " *",
        " * iOS 는 Android 처럼 manifest 로 스플래시를 만들어 주지 않아서, 기기 해상도마다",
        " * 이미지와 media query 를 하나씩 붙여 줘야 한다. 목록에 없는 기기는 배경색만 보인다.",
        " */",
        "export const appleSplashScreens = [",
    ]
    for e in entries:
        lines.append(f"  // {e['label']}")
        lines.append(f"  {{ url: '/splash/{e['file']}', media: '{e['media']}' }},")
    lines += ["] as const;", ""]
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(lines), encoding="utf-8")


# ── 실행 ──────────────────────────────────────────────────────────────
def main() -> None:
    if not LOGO.exists():
        sys.exit(f"{LOGO} 가 없습니다.")
    if shutil.which("sips") is None:
        sys.exit("sips 를 찾을 수 없습니다. 이 스크립트는 macOS 에서만 동작합니다.")

    paths = read_paths()
    made: list[tuple[Path, tuple[int, int]]] = []

    with tempfile.TemporaryDirectory() as tmp:
        work = Path(tmp)

        # 아이콘 — 용도별 여백이 달라서 SVG 를 각각 뽑는다.
        icon_master = rasterize(symbol_svg(paths, COVERAGE["icon"]), 1024, work, "symbol-icon")
        maskable_master = rasterize(symbol_svg(paths, COVERAGE["maskable"]), 1024, work, "symbol-maskable")
        apple_master = rasterize(symbol_svg(paths, COVERAGE["apple"]), 1024, work, "symbol-apple")
        # 파비콘은 16px 까지 내려가므로 줄이지 않고 크기마다 벡터에서 바로 그린다.
        favicon_svg = symbol_svg(paths, COVERAGE["favicon"])
        favicon_frames = [(s, rasterize(favicon_svg, s, work, "symbol-favicon")) for s in (16, 32, 48, 64)]

        icons_dir = ROOT / "public" / "icons"
        for size in (192, 512):
            target = icons_dir / f"icon-{size}.png"
            save_png(icon_master.resize((size, size), Image.Resampling.LANCZOS), target)
            made.append((target, (size, size)))

            target = icons_dir / f"icon-maskable-{size}.png"
            save_png(maskable_master.resize((size, size), Image.Resampling.LANCZOS), target)
            made.append((target, (size, size)))

        apple_icon = ROOT / "src" / "app" / "apple-icon.png"
        save_png(apple_master.resize((180, 180), Image.Resampling.LANCZOS), apple_icon)
        made.append((apple_icon, (180, 180)))

        favicon = ROOT / "src" / "app" / "favicon.ico"
        write_ico(favicon_frames, favicon)
        made.append((favicon, (64, 64)))

        icon_svg = ROOT / "src" / "app" / "icon.svg"
        icon_svg.write_text(symbol_svg(paths, COVERAGE["favicon"]), encoding="utf-8")
        made.append((icon_svg, (0, 0)))

        # 스플래시 — 로고 전체를 한 번만 크게 뽑고 기기별로 줄여 붙인다.
        lockup_master = rasterize(lockup_svg(paths), 2048, work, "lockup")
        splash_dir = ROOT / "public" / "splash"
        if splash_dir.exists():
            for stale in splash_dir.glob("apple-splash-*.png"):
                stale.unlink()

        entries = splash_entries()
        for e in entries:
            target = splash_dir / str(e["file"])
            save_png(splash_image(lockup_master, int(e["width"]), int(e["height"])), target)
            made.append((target, (int(e["width"]), int(e["height"]))))

        write_splash_module(entries, ROOT / "src" / "lib" / "pwa" / "appleSplash.ts")

    total = sum(p.stat().st_size for p, _ in made)
    for path, (w, h) in made:
        size = "" if w == 0 else f"{w}×{h}  "
        print(f"  {size}{path.relative_to(ROOT)}  ({path.stat().st_size / 1024:.1f} KB)")
    print(f"\n{len(made)}개 파일 · 합계 {total / 1024 / 1024:.2f} MB")


if __name__ == "__main__":
    main()
