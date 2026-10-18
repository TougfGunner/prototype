#!/usr/bin/env python3
"""
Extract crisp circular portrait crops of all 8 top-notch avatars from frame 738
of the reference video (before cursor overlap) into public/avatars/avatar-1.png..avatar-8.png.
"""

from pathlib import Path
import cv2
import numpy as np
from PIL import Image

ROOT = Path("/Users/lashperera/Downloads/Ajbell")
VIDEO_PATH = ROOT / "references" / "93f37755fd19926a8a827c5719a7c7e2.mp4"
OUT_DIR = ROOT / "public" / "avatars"


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    cap = cv2.VideoCapture(str(VIDEO_PATH))
    cap.set(cv2.CAP_PROP_POS_FRAMES, 825)
    ret, frame = cap.read()
    cap.release()
    if not ret:
        raise RuntimeError("Could not read frame 825")

    # In frame 825 (seen in seq_06), the cursor is down on Estimate Resolution Time (y~600),
    # so all 8 top-notch avatars at y=80..158 are completely unobstructed!
    # Let's inspect the full notch strip x=340..1360, y=72..164
    strip = frame[72:164, 340:1360]
    Image.fromarray(cv2.cvtColor(strip, cv2.COLOR_BGR2RGB)).save(OUT_DIR / "_strip_825_full.png")

    # Let's locate the 8 white circular backgrounds / face centers along y=116
    # In _strip_753.png (which started at x=540), we saw avatars #3, #4, #5, #6, #7:
    # Avatar #3 center was at x_rel=71 -> x = 540 + 71 = 611
    # Avatar #4 center was at x_rel=202 -> x = 540 + 202 = 742
    # Avatar #5 center was at x_rel=333 -> x = 540 + 333 = 873
    # Avatar #6 center was at x_rel=464 -> x = 540 + 464 = 1004
    # Step between avatars is 131.0 px!
    # Therefore the 8 centers in frame 753 / 825 are:
    # #1: 349, #2: 480, #3: 611, #4: 742, #5: 873, #6: 1004, #7: 1135, #8: 1266
    # And vertical center cy = 115, radius r = 38 px!
    centers_x = [349, 480, 611, 742, 873, 1004, 1135, 1266]
    cy = 115
    r = 37

    for idx, cx in enumerate(centers_x, start=1):
        crop = frame[cy - r : cy + r, cx - r : cx + r]
        rgb = cv2.cvtColor(crop, cv2.COLOR_BGR2RGB)
        pil_img = Image.fromarray(rgb).resize((128, 128), Image.Resampling.LANCZOS)
        pil_img.save(OUT_DIR / f"avatar-{idx}.png", optimize=True)

    # Clean up debug strips
    for dbg in OUT_DIR.glob("_*"):
        dbg.unlink()

    print("Saved avatar-1.png .. avatar-8.png successfully.")


if __name__ == "__main__":
    main()
