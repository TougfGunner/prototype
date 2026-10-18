#!/usr/bin/env python3
"""
Build aligned interface crop comparison boards between the reference image/video frames
and the live running React + TypeScript + Vite prototype at 1600x1200 viewport.
"""

import os
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageChops, ImageStat
import cv2
import numpy as np
import json

ROOT = Path("/Users/lashperera/Downloads/Ajbell")
VIDEO_PATH = ROOT / "references" / "93f37755fd19926a8a827c5719a7c7e2.mp4"
STATIC_IMAGE_PATH = ROOT / "references" / "reference_image_uploaded.webp"
SCREENSHOT_DIR = ROOT / "analysis" / "screenshots"
CROPS_DIR = ROOT / "analysis" / "crops"
CROPS_DIR.mkdir(parents=True, exist_ok=True)


def extract_video_frame(frame_idx: int) -> Image.Image:
    cap = cv2.VideoCapture(str(VIDEO_PATH))
    cap.set(cv2.CAP_PROP_POS_FRAMES, frame_idx)
    ok, frame_bgr = cap.read()
    cap.release()
    if not ok:
        raise RuntimeError(f"Could not decode frame {frame_idx}")
    frame_rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
    return Image.fromarray(frame_rgb)


def get_font(size: int, bold: bool = False):
    candidates = [
        "/System/Library/Fonts/SFNS.ttf",
        "/System/Library/Fonts/SFNSDisplay.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
        "/Library/Fonts/Arial.ttf",
    ]
    for c in candidates:
        if os.path.exists(c):
            try:
                return ImageFont.truetype(c, size)
            except Exception:
                pass
    return ImageFont.load_default()


def make_comparison_board(
    title: str,
    subtitle: str,
    ref_img: Image.Image,
    proto_img: Image.Image,
    crop_box: tuple[int, int, int, int],
    ref_label: str,
    proto_label: str,
    notes: list[str],
    out_path: Path,
) -> dict:
    ref_crop = ref_img.crop(crop_box)
    proto_crop = proto_img.crop(crop_box)

    cw, ch = ref_crop.size
    diff_img = ImageChops.difference(ref_crop.convert("RGB"), proto_crop.convert("RGB"))
    stat = ImageStat.Stat(diff_img)
    mean_abs_diff_rgb = round(sum(stat.mean) / 3.0, 2)

    # Scale crop if wider than 720px per column for clean side-by-side layout
    target_col_w = 720
    scale = min(1.0, target_col_w / cw)
    disp_w = int(round(cw * scale))
    disp_h = int(round(ch * scale))

    ref_disp = ref_crop.resize((disp_w, disp_h), Image.Resampling.LANCZOS)
    proto_disp = proto_crop.resize((disp_w, disp_h), Image.Resampling.LANCZOS)

    pad = 28
    header_h = 86
    footer_h = 96
    board_w = pad * 3 + disp_w * 2
    board_h = header_h + 36 + disp_h + footer_h

    board = Image.new("RGB", (board_w, board_h), (242, 243, 247))
    draw = ImageDraw.Draw(board)

    font_title = get_font(20, bold=True)
    font_sub = get_font(13)
    font_label = get_font(13, bold=True)
    font_note = get_font(12)

    draw.text((pad, 20), title, fill=(20, 21, 24), font=font_title)
    draw.text(
        (pad, 48),
        f"{subtitle}  |  Aligned Crop Box: {crop_box} ({cw}x{ch}px)",
        fill=(94, 98, 110),
        font=font_sub,
    )

    col1_x = pad
    col2_x = pad * 2 + disp_w
    img_y = header_h + 30

    draw.text((col1_x, header_h + 6), ref_label, fill=(31, 33, 38), font=font_label)
    draw.text((col2_x, header_h + 6), proto_label, fill=(31, 33, 38), font=font_label)

    # Subtle border around crops
    draw.rectangle(
        [col1_x - 2, img_y - 2, col1_x + disp_w + 1, img_y + disp_h + 1],
        outline=(205, 209, 218),
        width=2,
    )
    draw.rectangle(
        [col2_x - 2, img_y - 2, col2_x + disp_w + 1, img_y + disp_h + 1],
        outline=(205, 209, 218),
        width=2,
    )

    board.paste(ref_disp, (col1_x, img_y))
    board.paste(proto_disp, (col2_x, img_y))

    note_y = img_y + disp_h + 16
    for idx, line in enumerate(notes):
        draw.text((pad, note_y + idx * 20), f"• {line}", fill=(60, 64, 75), font=font_note)

    board.save(out_path, format="PNG")
    return {
        "title": title,
        "output": str(out_path.relative_to(ROOT)),
        "crop_box": list(crop_box),
        "dimensions": [cw, ch],
        "mean_rgb_delta": mean_abs_diff_rgb,
    }


def main():
    raw_webp = Image.open(STATIC_IMAGE_PATH).convert("RGB")
    ref_static_webp = raw_webp.resize((1600, 1200), Image.Resampling.LANCZOS)
    ref_f0909 = extract_video_frame(909)
    ref_f0825 = extract_video_frame(825)
    ref_f0145 = extract_video_frame(145)
    ref_f0380 = extract_video_frame(380)

    proto_solid = Image.open(
        SCREENSHOT_DIR / "02_journey_reference_1to1_solid_dark.png"
    ).convert("RGB")
    proto_dashed = Image.open(
        SCREENSHOT_DIR / "03_journey_reference_1to1_video_dashed.png"
    ).convert("RGB")
    proto_modal = Image.open(
        SCREENSHOT_DIR / "05_modal_detail_form_and_team_accordion.png"
    ).convert("RGB")
    proto_grid = Image.open(
        SCREENSHOT_DIR / "08_cases_in_progress_8card_grid.png"
    ).convert("RGB")

    comparisons = []

    # 1. Full Floating Workspace Shell (Reference static webp vs Prototype Reference 1:1 mode)
    comparisons.append(
        make_comparison_board(
            title="Comparison 01 — Full Connected Journey Workspace Shell (1600x1200)",
            subtitle="Static Reference WebP (3D Laptop Mockup) vs Live Prototype (Straight-on Browser UI, Reference 1:1 Mode)",
            ref_img=ref_static_webp,
            proto_img=proto_solid,
            crop_box=(60, 100, 1540, 1080),
            ref_label="Reference Image (reference_image_uploaded.webp — 3D Laptop Mockup)",
            proto_label="Live React Prototype (02_journey_reference_1to1_solid_dark.png — Straight-on UI)",
            notes=[
                "Preserves soft silver-grey canvas (#E5E7EC), frosted glass shell, carved top avatar notch, slim left rail, 4 stages, and bottom tables.",
                "Intentional difference: Straight-on usable browser interface vs angled 3D laptop mockup in static reference image.",
            ],
            out_path=CROPS_DIR / "comparison_01_journey_canvas.png",
        )
    )

    # 2. Connected Workflow Stages & Curved Connectors Detail Crop (Video f=0909 vs Prototype)
    comparisons.append(
        make_comparison_board(
            title="Comparison 02 — Workflow Stages, Curved SVG Connectors & Black Selected Tile",
            subtitle="Video Frame f=0909 (15,150.0 ms, zoomed stage view) vs Live Prototype Connected Canvas",
            ref_img=ref_f0909,
            proto_img=proto_solid,
            crop_box=(160, 270, 1460, 740),
            ref_label="Reference Video Frame f=0909 (pts=15150.0ms, 1.38x camera zoom)",
            proto_label="Live React Prototype Stage Columns & SVG Bezier Layer (Straight-on 1.0x)",
            notes=[
                "Stage 2 and Stage 3 render all 5 task rows (42px height, 10px gap) with solid periwinkle (#8FA8E0) and dashed coral (#D96B70) connectors.",
                "Row 3 (mgr-3 Escalation Check) connects into Stage 4 tile-4 (Request Processing) with the active dark (#18191C) curve and arrow marker.",
            ],
            out_path=CROPS_DIR / "comparison_02_stage_connectors_and_tiles.png",
        )
    )

    # 3. Detail Modal + Responsible Team Accordion Dropdown (Video f=0145 vs Prototype)
    comparisons.append(
        make_comparison_board(
            title="Comparison 03 — Detail Modal Dialog, Responsible Team Accordion & Budget Slider",
            subtitle="Video Frame f=0145 (2,416.7 ms) vs Live Prototype Detail Modal",
            ref_img=ref_f0145,
            proto_img=proto_modal,
            crop_box=(320, 150, 1280, 1040),
            ref_label="Reference Video Frame f=0145 (pts=2416.7ms — Team Dropdown Expanded)",
            proto_label="Live React Prototype DetailModal (05_modal_detail_form_and_team_accordion.png)",
            notes=[
                "Reproduces frosted modal shell, 4-team accordion with overlapping 3-avatar clusters, and two-tone Allocated Budget slider ($4,500 / $10,000).",
                "Adds accessible stage stepper, validation alerts, and Save Local Draft control required by AJ Bell operations workflow.",
            ],
            out_path=CROPS_DIR / "comparison_03_modal_form.png",
        )
    )

    # 4. Cases in Progress 4x2 8-Card Grid (Video f=0380 vs Prototype)
    comparisons.append(
        make_comparison_board(
            title="Comparison 04 — Cases in Progress 4x2 8-Card Operations Grid",
            subtitle="Video Frame f=0380 (6,333.3 ms) vs Live Prototype Cases in Progress Screen",
            ref_img=ref_f0380,
            proto_img=proto_grid,
            crop_box=(110, 210, 1490, 980),
            ref_label="Reference Video Frame f=0380 (pts=6333.3ms — Cases in Progress Grid)",
            proto_label="Live React Prototype Cases in Progress (08_cases_in_progress_8card_grid.png)",
            notes=[
                "Matches 4x2 card layout (#101..#108), status pills (Pending/Active/Escalated/New), conic progress rings, and dark Update Status CTA on #102.",
                "Maintains straight-on 1.0x workspace geometry without camera pan/zoom distortion.",
            ],
            out_path=CROPS_DIR / "comparison_04_in_progress_grid.png",
        )
    )

    out_json = CROPS_DIR / "comparison-summary.json"
    out_json.write_text(json.dumps({"comparisons": comparisons}, indent=2))
    print(f"Generated {len(comparisons)} crop comparison boards in {CROPS_DIR}")


if __name__ == "__main__":
    main()
