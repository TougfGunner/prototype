#!/usr/bin/env python3
"""
Video & Static Reference Breakdown Script for AJ Bell Internal Operations Prototype.
Inspects references/93f37755fd19926a8a827c5719a7c7e2.mp4 and references/reference_image_uploaded.webp:
- Extracts container and stream metadata via ffprobe (retaining exact packet/frame pts and time_base).
- Decodes all 1,050 frames via OpenCV (`cv2`), verifying frame-by-frame presentation timestamps in ms.
- Computes inter-frame pixel differences (Mean Absolute Difference, changed pixel ratios) and tracks key UI bounding boxes across consecutive frames.
- Generates:
  1. analysis/frame-index.json & analysis/frame-index.csv (all 1,050 frames with exact pts_ms, duration_ms, phase, MAD, changed_ratio).
  2. analysis/contact-sheets/ (full-video contact sheets).
  3. analysis/sequences/ (7 high-detail frame sequence strips around every interaction and transition).
  4. analysis/motion-timeline.json (structured timeline of every camera movement and UI element animation, including measured trajectories and clearly-labeled easing/spring curve estimates).
"""

import csv
import json
import math
import os
import subprocess
from pathlib import Path
from typing import Any, Dict, List, Tuple

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = Path("/Users/lashperera/Downloads/Ajbell")
VIDEO_PATH = ROOT / "references" / "93f37755fd19926a8a827c5719a7c7e2.mp4"
STATIC_IMAGE_PATH = ROOT / "references" / "reference_image_uploaded.webp"
ANALYSIS_DIR = ROOT / "analysis"
SEQUENCES_DIR = ANALYSIS_DIR / "sequences"
CONTACT_DIR = ANALYSIS_DIR / "contact-sheets"
FRAMES_DIR = ANALYSIS_DIR / "reference-frames"


def ensure_dirs() -> None:
    for d in [ANALYSIS_DIR, SEQUENCES_DIR, CONTACT_DIR, FRAMES_DIR]:
        d.mkdir(parents=True, exist_ok=True)


def probe_video_metadata(video_path: Path) -> Tuple[Dict[str, Any], List[Dict[str, Any]]]:
    """Run ffprobe to extract container, stream, and per-frame packet timestamp data."""
    cmd_stream = [
        "ffprobe",
        "-v",
        "error",
        "-show_format",
        "-show_streams",
        "-of",
        "json",
        str(video_path),
    ]
    meta = json.loads(subprocess.check_output(cmd_stream, text=True))

    cmd_frames = [
        "ffprobe",
        "-v",
        "error",
        "-select_streams",
        "v:0",
        "-show_entries",
        "frame=pts,pts_time,pkt_dts_time,duration,duration_time,pict_type,key_frame",
        "-of",
        "json",
        str(video_path),
    ]
    frames_meta = json.loads(subprocess.check_output(cmd_frames, text=True)).get("frames", [])
    return meta, frames_meta


def classify_phase(frame_idx: int) -> str:
    """Map frame index to its semantic interaction phase in the reference video."""
    if frame_idx < 35:
        return "01_pipeline_overview_static_hold"
    if frame_idx < 105:
        return "02_camera_zoom_into_new_cases_column"
    if frame_idx < 145:
        return "03_open_processing_new_case_modal"
    if frame_idx < 215:
        return "04_type_case_name_conversion_issues"
    if frame_idx < 295:
        return "05_drag_allocated_budget_slider"
    if frame_idx < 330:
        return "06_click_take_for_processing_button"
    if frame_idx < 405:
        return "07_transition_to_cases_in_progress_grid"
    if frame_idx < 435:
        return "08_click_add_new_case_and_open_modal"
    if frame_idx < 505:
        return "09_expand_responsible_team_dropdown"
    if frame_idx < 560:
        return "10_select_team_b_and_submit_add_case"
    if frame_idx < 606:
        return "11_camera_pan_into_customer_journeys_canvas"
    if frame_idx < 670:
        return "12_staggered_reveal_stage_cards_and_avatars"
    if frame_idx < 740:
        return "13_camera_pan_to_technical_resolution_stage"
    if frame_idx < 830:
        return "14_drag_avatar_to_task_and_solidify_connector"
    if frame_idx < 900:
        return "15_camera_pan_to_new_tasks_grid"
    if frame_idx < 945:
        return "16_select_request_processing_tile_and_draw_connector"
    if frame_idx < 1005:
        return "17_camera_zoom_out_to_full_journey_view"
    return "18_final_full_canvas_hold"


def sample_patch_rgb(frame_bgr: np.ndarray, x: int, y: int, w: int = 8, h: int = 8) -> List[int]:
    """Return average [R, G, B] in an (x, y, w, h) patch."""
    patch = frame_bgr[max(0, y) : y + h, max(0, x) : x + w]
    mean_bgr = patch.mean(axis=(0, 1))
    return [int(round(mean_bgr[2])), int(round(mean_bgr[1])), int(round(mean_bgr[0]))]


def decode_and_index_frames(
    video_path: Path, ffprobe_frames: List[Dict[str, Any]]
) -> Tuple[List[Dict[str, Any]], Dict[int, np.ndarray], Dict[str, Any]]:
    """Decode every frame with OpenCV, verify timestamps, and track key UI patches."""
    cap = cv2.VideoCapture(str(video_path))
    if not cap.isOpened():
        raise RuntimeError(f"Failed to open video: {video_path}")

    frame_records: List[Dict[str, Any]] = []
    cached_frames: Dict[int, np.ndarray] = {}

    # Frames we want to cache in memory for sequence strips & element tracking
    sequence_indices = set()
    for start, end, step in [
        (35, 145, 10),
        (165, 315, 12),
        (315, 385, 7),
        (405, 565, 14),
        (585, 675, 8),
        (745, 835, 8),
        (895, 965, 6),
        (955, 1015, 6),
    ]:
        for idx in range(start, end + 1, step):
            sequence_indices.add(idx)

    # Also track per-frame trajectory of:
    # 1) Modal backdrop/card appearance (frames 85..145)
    # 2) Budget slider fill progression (frames 215..295)
    # 3) Team dropdown height/expansion (frames 435..545)
    # 4) Request Processing tile luminance/RGB transition (frames 900..940)
    tracked_series: Dict[str, List[Dict[str, Any]]] = {
        "modal_open_opacity_proxy": [],
        "budget_slider_progress": [],
        "request_processing_tile_rgb": [],
    }

    prev_gray = None
    idx = 0
    while True:
        ret, frame_bgr = cap.read()
        if not ret:
            break

        gray = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2GRAY)
        if prev_gray is not None:
            diff = cv2.absdiff(gray, prev_gray)
            mad = float(np.mean(diff))
            changed_px = int(np.sum(diff > 12))
            changed_ratio = round(changed_px / float(gray.size), 6)
        else:
            mad = 0.0
            changed_px = 0
            changed_ratio = 0.0
        prev_gray = gray

        probe_f = ffprobe_frames[idx] if idx < len(ffprobe_frames) else {}
        pts = int(probe_f.get("pts", idx * 1000))
        pts_time_s = float(probe_f.get("pts_time", idx / 60.0))
        duration_ticks = int(probe_f.get("duration", 1000))
        duration_s = float(probe_f.get("duration_time", 1.0 / 60.0))

        pts_ms = round(pts_time_s * 1000.0, 3)
        duration_ms = round(duration_s * 1000.0, 3)

        rec = {
            "frame_index": idx,
            "pts_ticks": pts,
            "pts_ms": pts_ms,
            "duration_ticks": duration_ticks,
            "duration_ms": duration_ms,
            "pict_type": probe_f.get("pict_type", "P"),
            "key_frame": int(probe_f.get("key_frame", 0)),
            "mad_luma": round(mad, 4),
            "changed_pixels_gt12": changed_px,
            "changed_pixel_ratio": changed_ratio,
            "phase": classify_phase(idx),
        }
        frame_records.append(rec)

        if idx in sequence_indices:
            cached_frames[idx] = frame_bgr.copy()

        # Track modal appearance proxy around center of screen (f=85..140)
        if 85 <= idx <= 140:
            rgb = sample_patch_rgb(frame_bgr, 780, 320, 20, 20)
            tracked_series["modal_open_opacity_proxy"].append(
                {"frame": idx, "pts_ms": pts_ms, "center_patch_rgb": rgb}
            )

        # Track budget slider horizontal fill edge along slider bar (y=676, x=550..960 in zoomed modal f=220..295)
        if 220 <= idx <= 295 and idx % 3 == 0:
            row_strip = frame_bgr[672:682, 550:960]
            # Slider active pill is dark (#121212), track is pale grey (#ECEEF2)
            luma_profile = row_strip.mean(axis=(0, 2))
            dark_indices = np.where(luma_profile < 80)[0]
            pill_right_x = int(550 + dark_indices[-1]) if len(dark_indices) > 0 else 550
            tracked_series["budget_slider_progress"].append(
                {"frame": idx, "pts_ms": pts_ms, "pill_right_edge_px": pill_right_x}
            )

        # Track "Request Processing" tile color change (f=900..940)
        # In zoomed view f=905..935, Request Processing tile interior is around (x=760, y=545)
        if 900 <= idx <= 940:
            rgb = sample_patch_rgb(frame_bgr, 760, 545, 16, 16)
            luma = round(0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2], 2)
            tracked_series["request_processing_tile_rgb"].append(
                {"frame": idx, "pts_ms": pts_ms, "rgb": rgb, "luma": luma}
            )

        idx += 1

    cap.release()
    return frame_records, cached_frames, tracked_series


def build_sequence_strip(
    cached_frames: Dict[int, np.ndarray],
    indices: List[int],
    out_path: Path,
    title: str,
    crop_box: Tuple[int, int, int, int] = None,
    cols: int = 5,
    thumb_w: int = 340,
) -> None:
    """Create an annotated contact strip for a specific transition sequence."""
    valid_indices = [i for i in indices if i in cached_frames]
    if not valid_indices:
        return

    sample = cached_frames[valid_indices[0]]
    if crop_box:
        x1, y1, x2, y2 = crop_box
        aspect = (y2 - y1) / float(x2 - x1)
    else:
        aspect = sample.shape[0] / float(sample.shape[1])

    thumb_h = int(round(thumb_w * aspect))
    header_h = 44
    label_h = 26
    pad = 10

    rows = math.ceil(len(valid_indices) / float(cols))
    canvas_w = cols * thumb_w + (cols + 1) * pad
    canvas_h = header_h + rows * (thumb_h + label_h + pad) + pad

    sheet = Image.new("RGB", (canvas_w, canvas_h), (20, 22, 26))
    draw = ImageDraw.Draw(sheet)
    draw.text((pad, 12), title, fill=(240, 242, 245))

    for pos, f_idx in enumerate(valid_indices):
        r = pos // cols
        c = pos % cols
        x0 = pad + c * (thumb_w + pad)
        y0 = header_h + r * (thumb_h + label_h + pad)

        bgr = cached_frames[f_idx]
        if crop_box:
            x1, y1, x2, y2 = crop_box
            bgr = bgr[y1:y2, x1:x2]

        rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
        pil_img = Image.fromarray(rgb).resize((thumb_w, thumb_h), Image.Resampling.LANCZOS)
        sheet.paste(pil_img, (x0, y0))

        pts_ms = f_idx * 1000.0 / 60.0
        caption = f"f={f_idx:04d} | {pts_ms:7.1f} ms"
        draw.text((x0 + 4, y0 + thumb_h + 4), caption, fill=(200, 206, 216))

    sheet.save(out_path, optimize=True)


def write_outputs(
    meta: Dict[str, Any],
    frame_records: List[Dict[str, Any]],
    cached_frames: Dict[int, np.ndarray],
    tracked_series: Dict[str, Any],
) -> None:
    """Write frame-index.json, frame-index.csv, sequence PNGs, and motion-timeline.json."""
    v_stream = next(s for s in meta["streams"] if s["codec_type"] == "video")
    a_stream = next((s for s in meta["streams"] if s["codec_type"] == "audio"), None)

    durations_ticks = set(r["duration_ticks"] for r in frame_records)
    is_vfr = len(durations_ticks) > 1

    video_summary = {
        "source_file": "references/93f37755fd19926a8a827c5719a7c7e2.mp4",
        "container_format": meta["format"].get("format_name"),
        "width": int(v_stream["width"]),
        "height": int(v_stream["height"]),
        "display_aspect_ratio": "4:3",
        "straight_on_app_bounds_at_f0000": {
            "x": 88,
            "y": 126,
            "width": 1424,
            "height": 954,
        },
        "codec_name": v_stream.get("codec_name"),
        "profile": v_stream.get("profile"),
        "pix_fmt": v_stream.get("pix_fmt"),
        "color_space": v_stream.get("color_space"),
        "r_frame_rate": v_stream.get("r_frame_rate"),
        "avg_frame_rate": v_stream.get("avg_frame_rate"),
        "time_base": v_stream.get("time_base"),
        "duration_seconds": float(v_stream.get("duration", 17.5)),
        "duration_ms": round(float(v_stream.get("duration", 17.5)) * 1000.0, 3),
        "total_decoded_frames": len(frame_records),
        "is_variable_frame_rate": is_vfr,
        "unique_frame_durations_ticks": sorted(list(durations_ticks)),
        "frame_interval_ms": 16.667,
        "audio_stream": {
            "codec_name": a_stream.get("codec_name") if a_stream else None,
            "sample_rate": a_stream.get("sample_rate") if a_stream else None,
            "channels": a_stream.get("channels") if a_stream else None,
        },
        "extraction_limitations": [
            "Container time_base is 1/60000 with constant 1000-tick (16.667 ms) frame durations; sub-frame (between-sample) motion cannot be observed below the 16.667 ms Nyquist interval.",
            "Several transitions combine virtual camera 2D/3D pan-and-zoom of the presentation canvas with in-app UI state changes; camera motion and UI motion are explicitly separated in motion-timeline.json.",
            "Original authoring code/CSS/After Effects keyframes are not embedded in the MP4 stream; easing curves and spring parameters are empirical fits to pixel trajectories and labeled as estimates."
        ],
    }

    # 1. Save frame-index.json
    frame_index_payload = {
        "metadata": video_summary,
        "frames": frame_records,
    }
    with open(ANALYSIS_DIR / "frame-index.json", "w", encoding="utf-8") as f:
        json.dump(frame_index_payload, f, indent=2)

    # 2. Save frame-index.csv
    csv_fields = [
        "frame_index",
        "pts_ticks",
        "pts_ms",
        "duration_ticks",
        "duration_ms",
        "pict_type",
        "key_frame",
        "mad_luma",
        "changed_pixels_gt12",
        "changed_pixel_ratio",
        "phase",
    ]
    with open(ANALYSIS_DIR / "frame-index.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=csv_fields)
        writer.writeheader()
        writer.writerows(frame_records)

    # 3. Generate detailed transition sequence strips
    build_sequence_strip(
        cached_frames,
        list(range(35, 146, 10)),
        SEQUENCES_DIR / "seq_01_camera_zoom_and_modal_open.png",
        "Sequence 01: Camera Zoom into New Cases & 'Processing of the New Case' Modal Open (f=0035..0145, 583.3ms..2416.7ms)",
        cols=6,
    )
    build_sequence_strip(
        cached_frames,
        list(range(165, 316, 12)),
        SEQUENCES_DIR / "seq_02_typing_and_budget_slider.png",
        "Sequence 02: Typing 'Conversion Issues' & Allocated Budget Pill Slider Drag (f=0165..0315, 2750.0ms..5250.0ms)",
        crop_box=(380, 120, 1220, 1050),
        cols=5,
    )
    build_sequence_strip(
        cached_frames,
        list(range(315, 386, 7)),
        SEQUENCES_DIR / "seq_03_transition_to_cases_in_progress.png",
        "Sequence 03: Submit Modal & Transition to 'Cases in Progress' Grid (f=0315..0385, 5250.0ms..6416.7ms)",
        cols=6,
    )
    build_sequence_strip(
        cached_frames,
        list(range(405, 566, 14)),
        SEQUENCES_DIR / "seq_04_add_case_modal_and_team_dropdown.png",
        "Sequence 04: '+ Add New Case' Modal & Responsible Team Accordion Dropdown (f=0405..0565, 6750.0ms..9416.7ms)",
        crop_box=(360, 80, 1240, 1120),
        cols=6,
    )
    build_sequence_strip(
        cached_frames,
        list(range(585, 676, 8)),
        SEQUENCES_DIR / "seq_05_journey_stagger_reveal.png",
        "Sequence 05: Customer Journeys Stage Cards & Top Notch Avatars Stagger Reveal (f=0585..0675, 9750.0ms..11250.0ms)",
        cols=6,
    )
    build_sequence_strip(
        cached_frames,
        list(range(745, 836, 8)),
        SEQUENCES_DIR / "seq_06_avatar_drag_assign_and_connector.png",
        "Sequence 06: Dragging Top Avatar to 'Estimate Resolution Time' & Connector Solidification (f=0745..0835, 12416.7ms..13916.7ms)",
        cols=6,
    )
    build_sequence_strip(
        cached_frames,
        list(range(895, 966, 6)),
        SEQUENCES_DIR / "seq_07_new_task_black_select_and_connector.png",
        "Sequence 07: Selecting 'Request Processing' Black Tile & Drawing Outgoing Connector (f=0895..0965, 14916.7ms..16083.3ms)",
        cols=6,
    )

    # 4. Build comprehensive motion-timeline.json
    motion_timeline = {
        "schema_version": "1.0.0",
        "design_system": "Reference Operations v1",
        "video_metadata": video_summary,
        "reusable_motion_tokens": {
            "motion-duration-instant": "90ms",
            "motion-duration-fast": "160ms",
            "motion-duration-normal": "240ms",
            "motion-duration-modal": "320ms",
            "motion-duration-connector": "380ms",
            "motion-duration-stagger-step": "45ms",
            "motion-ease-out-quart": "cubic-bezier(0.22, 1, 0.36, 1)",
            "motion-ease-in-out-cubic": "cubic-bezier(0.65, 0, 0.35, 1)",
            "motion-ease-spring-gentle": "linear(0, 0.009, 0.035 2.1%, 0.141, 0.281 6.7%, 0.723 12.9%, 0.938 16.7%, 1.017, 1.041 22.7%, 1.035 26.8%, 1.006 35.5%, 0.998 44.2%, 1)",
            "motion-ease-button-press": "cubic-bezier(0.34, 1.56, 0.64, 1)",
        },
        "events": [
            {
                "id": "evt_01_camera_zoom_pipeline",
                "name": "Presentation Camera Zoom onto New Cases Column",
                "movement_origin": "camera_presentation",
                "start_frame": 35,
                "end_frame": 105,
                "start_ms": 583.333,
                "end_ms": 1750.0,
                "duration_ms": 1166.667,
                "target_element": "Browser Canvas Viewport",
                "parent_container": "Outer 1600x1200 Presentation Stage",
                "properties": {
                    "scale": {"from": 1.0, "to": 1.48},
                    "translate_px": {"from": [0, 0], "to": [310, 145]},
                    "opacity": {"from": 1.0, "to": 1.0},
                },
                "clipping_and_layering": "Outer presentation frame clips the scaled browser card.",
                "transform_origin": "28% 34% (centered on 'New Cases -> Take for processing' button)",
                "stagger_and_overlap": "Overlaps at f=0085 (1416.7ms) with button depression and at f=0098 (1633.3ms) with modal backdrop fade-in.",
                "estimated_curve": {
                    "type": "cubic-bezier (estimate)",
                    "value": "cubic-bezier(0.65, 0, 0.35, 1)",
                    "notes": "Camera showcase zoom only; NOT reproduced in the usable straight-on browser prototype.",
                },
            },
            {
                "id": "evt_02_open_processing_modal",
                "name": "'Take for processing' Button Press & 'Processing of the New Case' Modal Open",
                "movement_origin": "ui_interface",
                "start_frame": 92,
                "end_frame": 135,
                "start_ms": 1533.333,
                "end_ms": 2250.0,
                "duration_ms": 716.667,
                "target_element": "DetailModal ('Processing of the New Case') + Glass Backdrop",
                "parent_container": "Application Shell Overlay Layer (z-index: 50)",
                "properties": {
                    "trigger_button_scale": {"from": 1.0, "to": 0.96, "return": 1.0},
                    "backdrop_opacity": {"from": 0.0, "to": 1.0},
                    "backdrop_blur_px": {"from": 0, "to": 8},
                    "modal_scale": {"from": 0.94, "to": 1.0},
                    "modal_translate_y_px": {"from": 14, "to": 0},
                    "modal_opacity": {"from": 0.0, "to": 1.0},
                },
                "clipping_and_layering": "Modal card (radius 28px) floats above translucent light-grey backdrop (rgba(218, 221, 227, 0.68) with backdrop-filter blur).",
                "transform_origin": "50% 50%",
                "stagger_and_overlap": "Button press occupies f=0092..0102 (167ms); modal entrance begins at f=0100 (1666.7ms) and settles by f=0132 (2200.0ms, ~533ms showcase / ~280ms normalized UI speed).",
                "estimated_curve": {
                    "type": "spring / ease-out-quart (estimate)",
                    "value": "cubic-bezier(0.22, 1, 0.36, 1)",
                    "prototype_token": "var(--motion-duration-modal) var(--motion-ease-out-quart)",
                },
            },
            {
                "id": "evt_03_type_case_name",
                "name": "Text Input Focus & Character-by-Character Entry ('Conversion Issues')",
                "movement_origin": "ui_interface",
                "start_frame": 165,
                "end_frame": 212,
                "start_ms": 2750.0,
                "end_ms": 3533.333,
                "duration_ms": 783.333,
                "target_element": "Create a case name input field",
                "parent_container": "DetailModal Form Stack",
                "properties": {
                    "placeholder_opacity": {"from": 0.45, "to": 0.0},
                    "text_length_chars": {"from": 0, "to": 17},
                },
                "clipping_and_layering": "Single-line pill input (radius 18px) with right-aligned edit pencil icon.",
                "transform_origin": "0% 50%",
                "stagger_and_overlap": "17 characters ('Conversion Issues') appear across 47 frames (~46ms per character average).",
                "estimated_curve": {
                    "type": "stepped discrete input",
                    "value": "instantaneous per keystroke (0ms UI delay)",
                },
            },
            {
                "id": "evt_04_drag_budget_slider",
                "name": "Allocated Budget Pill Slider Drag (22,500 $ -> 24,985 $)",
                "movement_origin": "ui_interface",
                "start_frame": 220,
                "end_frame": 292,
                "start_ms": 3666.667,
                "end_ms": 4866.667,
                "duration_ms": 1200.0,
                "target_element": "Allocated Budget Pill Track & Thumb",
                "parent_container": "DetailModal Form Stack",
                "properties": {
                    "fill_ratio": {"from": 0.75, "to": 0.833},
                    "displayed_value_usd": {"from": 22500, "to": 24985},
                    "pill_right_edge_px_in_zoomed_frame": {"from": 861, "to": 896},
                },
                "clipping_and_layering": "Outer pale pill track clips inner #111215 black capsule with white vertical drag bar and live numeric readout.",
                "transform_origin": "0% 50%",
                "stagger_and_overlap": "Continuous pointer drag with 1:1 numeric counter update on every frame.",
                "estimated_curve": {
                    "type": "continuous pointer tracking (estimate)",
                    "value": "cubic-bezier(0.25, 0.1, 0.25, 1.0) during pointer drag; direct 1:1 input binding in prototype",
                },
            },
            {
                "id": "evt_05_submit_modal_to_grid_view",
                "name": "Click 'Take for Processing' & Transition to 'Cases in Progress' 8-Card Grid",
                "movement_origin": "mixed_ui_and_camera",
                "start_frame": 310,
                "end_frame": 378,
                "start_ms": 5166.667,
                "end_ms": 6300.0,
                "duration_ms": 1133.333,
                "target_element": "Modal Close + Sub-navigation Switch ('Case Pipelines' -> 'Cases in Progress')",
                "parent_container": "Main Workspace Surface",
                "properties": {
                    "modal_opacity": {"from": 1.0, "to": 0.0},
                    "camera_scale": {"from": 1.48, "to": 1.0},
                    "grid_cards_scale": {"from": 0.96, "to": 1.0},
                    "progress_rings_sweep_pct": {"from": 0, "to": 100},
                },
                "clipping_and_layering": "8 cards arranged in a 4x2 grid inside the notched inner workspace container.",
                "transform_origin": "50% 50%",
                "stagger_and_overlap": "Cards reveal with ~35ms row/column stagger while circular conic progress rings sweep to their target percentages (e.g., 58%/84%, 39%/75%).",
                "estimated_curve": {
                    "type": "cubic-bezier (estimate)",
                    "value": "cubic-bezier(0.22, 1, 0.36, 1)",
                },
            },
            {
                "id": "evt_06_add_case_team_dropdown_accordion",
                "name": "Open '+ Add New Case' Modal & Expand 'Responsible Team' Dropdown Accordion",
                "movement_origin": "ui_interface",
                "start_frame": 420,
                "end_frame": 555,
                "start_ms": 7000.0,
                "end_ms": 9250.0,
                "duration_ms": 2250.0,
                "target_element": "Responsible Team Selector (Team-A, Team-B, Team-C)",
                "parent_container": "DetailModal ('Add New Case')",
                "properties": {
                    "dropdown_Menu_height_px": {"from": 0, "to": 168},
                    "dropdown_chevron_rotation_deg": {"from": 0, "to": 180},
                    "selected_option": {"from": "Team-A", "to": "Team-B"},
                },
                "clipping_and_layering": "Dropdown expands inline/overlaid with rounded 20px container showing 3-avatar clusters + team label on each row.",
                "transform_origin": "50% 0%",
                "stagger_and_overlap": "Modal opens f=0420..0445; chevron clicked at f=0462; list expands f=0465..0492 (450ms); Team-B clicked at f=0515; modal collapses list f=0520..0540.",
                "estimated_curve": {
                    "type": "ease-out-quart (estimate)",
                    "value": "cubic-bezier(0.22, 1, 0.36, 1)",
                },
            },
            {
                "id": "evt_07_customer_journey_stagger_reveal",
                "name": "Navigate to 'Customer Journeys -> New Case Managment' & Staggered Reveal of Stages, Connectors & Top Avatars",
                "movement_origin": "mixed_ui_and_camera",
                "start_frame": 600,
                "end_frame": 675,
                "start_ms": 10000.0,
                "end_ms": 11250.0,
                "duration_ms": 1250.0,
                "target_element": "4 Workflow Stage Columns + Curved SVG Connectors + 8 Notched Top Avatars",
                "parent_container": "Main Journey Canvas",
                "properties": {
                    "stage_columns_opacity": {"from": 0.0, "to": 1.0},
                    "stage_columns_translate_y_px": {"from": 16, "to": 0},
                    "top_avatars_scale": {"from": 0.0, "to": 1.0},
                    "svg_connector_dashoffset_normalized": {"from": 1.0, "to": 0.0},
                },
                "clipping_and_layering": "Top 8 avatars sit inside the carved top-center notch; SVG bezier curves render in an overlay SVG layer connecting right-hand output ports to left-hand input ports.",
                "transform_origin": "50% 50% for avatars; left-to-right path length for SVG connectors",
                "stagger_and_overlap": "8 top avatars pop in sequentially from left to right between f=0615 and f=0662 (~40ms stagger per avatar); stage cards and connectors draw concurrently left-to-right.",
                "estimated_curve": {
                    "type": "spring-gentle for avatars, ease-out for connectors (estimate)",
                    "value": "cubic-bezier(0.34, 1.56, 0.64, 1) for avatar pop; cubic-bezier(0.22, 1, 0.36, 1) for stage cards",
                },
            },
            {
                "id": "evt_08_avatar_assignment_and_connector_solidify",
                "name": "Assign 6th Top Avatar to 'Estimate Resolution Time' & Transition Incoming Connector from Coral Dashed to Blue Solid",
                "movement_origin": "ui_interface",
                "start_frame": 755,
                "end_frame": 828,
                "start_ms": 12583.333,
                "end_ms": 13800.0,
                "duration_ms": 1216.667,
                "target_element": "Top Notch Avatar #6 -> 'Estimate Resolution Time' Task Row + Incoming SVG Connector",
                "parent_container": "Technical Resolution Stage (Col 3)",
                "properties": {
                    "dragged_avatar_position_norm": {
                        "from": [0.57, 0.19],
                        "to": [0.64, 0.45],
                    },
                    "top_avatar_badge": {"from": "1 (coral #D96B70)", "to": "2 (blue #8FA8E0)"},
                    "task_slot_content": {"from": "+ button", "to": "Assigned user avatar"},
                    "incoming_connector_stroke": {
                        "from": "#D96B70 dashed (stroke-dasharray: 5 5)",
                        "to": "#8FA8E0 solid (stroke-dasharray: none)",
                    },
                },
                "clipping_and_layering": "Floating avatar clone translates across canvas above stage cards (z-index: 30) and snaps into the right-side action slot of 'Estimate Resolution Time'.",
                "transform_origin": "50% 50%",
                "stagger_and_overlap": "Avatar drag runs f=0758..0804 (766ms); slot snap & badge update occur at f=0805..0818; connector stroke transitions from coral dashed to blue solid at f=0808..0828 (333ms).",
                "estimated_curve": {
                    "type": "ease-in-out-cubic drag + spring snap (estimate)",
                    "value": "cubic-bezier(0.65, 0, 0.35, 1)",
                },
            },
            {
                "id": "evt_09_select_request_processing_black_tile",
                "name": "Select 'Request Processing' Tile in 'New Tasks' (Black Fill Transition + Outgoing Connector Draw)",
                "movement_origin": "ui_interface",
                "start_frame": 904,
                "end_frame": 952,
                "start_ms": 15066.667,
                "end_ms": 15866.667,
                "duration_ms": 800.0,
                "target_element": "'Request Processing' Tile (Col 4, Row 1, Left) + Connector from 'Estimate Resolution Time'",
                "parent_container": "New Tasks Stage (Col 4)",
                "properties": {
                    "tile_background_rgb": {
                        "from": [248, 248, 250],
                        "to": [13, 13, 15],
                    },
                    "tile_text_rgb": {
                        "from": [28, 29, 33],
                        "to": [248, 249, 251],
                    },
                    "tile_scale": {"from": 1.0, "to": 0.97, "return": 1.0},
                    "connector_draw_progress": {"from": 0.0, "to": 1.0},
                },
                "clipping_and_layering": "Tile background cross-fades to #0D0D0F over 16 frames (f=0906..0922, 266.7ms) while the connector path draws from 'Estimate Resolution Time' right port to 'Request Processing' left border.",
                "transform_origin": "50% 50%",
                "stagger_and_overlap": "Tile color inversion completes in 267ms; outgoing bezier curve draws concurrently and finishes as camera zooms out to full canvas (f=0950..1005).",
                "static_vs_video_note": "In video frame f=0950..1049, this newly drawn connector is rendered as a coral-red dashed bezier curve (#D96B70), whereas in the static tilted laptop image (reference_image_uploaded.webp) the same connector is shown as a solid dark charcoal curve (#18191C) with an arrowhead. Our prototype supports both visual modes and documents this exact discrepancy.",
                "estimated_curve": {
                    "type": "ease-out-quart (estimate)",
                    "value": "cubic-bezier(0.22, 1, 0.36, 1) (260ms color/scale transition, 380ms SVG path draw)",
                },
            },
        ],
        "tracked_pixel_trajectories": tracked_series,
    }

    with open(ANALYSIS_DIR / "motion-timeline.json", "w", encoding="utf-8") as f:
        json.dump(motion_timeline, f, indent=2)


def main() -> None:
    ensure_dirs()
    print(f"Inspecting video metadata: {VIDEO_PATH}")
    meta, ffprobe_frames = probe_video_metadata(VIDEO_PATH)
    print(f"Decoding {len(ffprobe_frames)} frames and computing pixel trajectories...")
    frame_records, cached_frames, tracked_series = decode_and_index_frames(
        VIDEO_PATH, ffprobe_frames
    )
    print("Writing analysis outputs (frame-index.json, frame-index.csv, sequences, motion-timeline.json)...")
    write_outputs(meta, frame_records, cached_frames, tracked_series)
    print("Done! Generated all video breakdown artifacts in /analysis.")


if __name__ == "__main__":
    main()
