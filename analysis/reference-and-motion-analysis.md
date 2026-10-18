# Reference & Video Motion Analysis — AJ Bell Internal Operations Prototype (`Reference Operations v1`)

## 1. Executive Summary & Reference Provenance

| Asset | Path | Dimensions | Format / Codec | Role |
| :--- | :--- | :--- | :--- | :--- |
| **Uploaded Static Image** | `references/reference_image_uploaded.webp` | `1512 × 1134` (`4:3`) | WebP (lossless/high-Q) | 3D tilted laptop presentation mockup showing the *Customer Journeys → New Case Management* screen at the exact moment (`t ≈ 15,150 ms`, frame `f=0909`) when a connector line is dragged from column 3 (`Estimate Resolution Time`) onto the `Request Processing` tile (selected in `#0D0D0F` black). |
| **Motion Reference Video** | `references/93f37755fd19926a8a827c5719a7c7e2.mp4` | `1600 × 1200` (`4:3`) | MP4 (`H.264 Main`, `yuv420p`, `bt709`) + AAC 48 kHz | 17.500 s (`1,050` frames @ constant `60.00 fps`, `16.667 ms` per frame) straight-on browser recording + camera zoom showcase covering all 3 screens and 5 core interactive flows of the application. |

### Key Finding: Straight-On Browser vs. Tilted Mockup
The uploaded static image (`reference_image_uploaded.webp`) is a 3D perspective laptop render of frame `f=0909` (`15,150.0 ms`) from the same sequence captured straight-on in the video (`f=0606..1049`). In the straight-on video frames (`f=0000`, `f=0380`, `f=0680`, `f=0950`), the browser window occupies `x = 88..1512, y = 126..1080` (`1424 × 954 px`) inside the `1600 × 1200` presentation canvas.

---

## 2. Video Container & Stream Metadata (`ffprobe` + OpenCV Verification)

- **Container**: QuickTime / ISO Base Media (`mov,mp4,m4a,3gp,3g2,mj2`)
- **Resolution**: `1600 × 1200` (`4:3`)
- **Duration**: `17.500000 s` (`17,500.0 ms`)
- **Frame Count**: `1,050` decoded video frames (`frame_index = 0..1049`)
- **Frame Rate**: `60/1` (`r_frame_rate = 60/1`, `avg_frame_rate = 60/1`) — strictly **Constant Frame Rate (CFR)**
- **Stream Time Base**: `1/60000`
- **Packet / Presentation Timestamps**: Every frame has an exact duration of `1000` timebase ticks (`16.6667 ms`), with `pts = frame_index * 1000` and `pts_ms = round(frame_index * 1000 / 60, 3)`.
- **Extraction Limitations**:
  1. Sub-frame motion below the `16.667 ms` sampling interval cannot be observed directly.
  2. The video combines **virtual camera pan/zoom movements** (magnifying portions of the `1424 × 954` window up to `1.48×` scale) with **in-application UI motion** (staggered card reveals, modal scale/fade, slider drag, accordion dropdown expansion, avatar drag-and-drop, and SVG connector drawing). Both are separated explicitly in `analysis/motion-timeline.json`.
  3. Original authoring curves are not stored in the H.264 stream; CSS `cubic-bezier(...)` and `linear(...)` spring parameters are empirical fits to pixel trajectories and are labeled as estimates.

---

## 3. Visual Language & Measured Token Specification

### 3.1 Surface & Accent Palette (Measured from Straight-On Frames `f=0000`, `f=0380`, `f=0680`)
- **Outer Canvas & App Background**: `#E5E7EC` to `#EBEEF3` soft cool silver-grey with a subtle radial periwinkle ambient wash (`rgba(164, 184, 232, 0.24)`) beneath the translucent workspace shell.
- **Primary Workspace Shell (Notched Container)**: `rgba(244, 245, 248, 0.78)` with `backdrop-filter: blur(16px)`, `1px solid rgba(255, 255, 255, 0.75)` fine border, and `28px` outer border radius.
- **Carved Top-Center Notch**: The workspace shell features a signature recessed top-center cutout (`height: 54px`, smooth `26px` concave/convex shoulder curves) that cradles either:
  - Sub-view mode pills (`Pipelines` / `In Progress` / `Completed` / `Expired`), or
  - The 8 circular journey participant/starter avatars with bottom numeric/status pill badges.
- **Floating Stage Columns**: `rgba(248, 249, 251, 0.88)` with `1px solid rgba(255, 255, 255, 0.85)`, `26px` border radius, and restrained ambient elevation (`0 8px 24px rgba(22, 27, 38, 0.04)`).
- **Task Row Pills & Action Tiles**: `#FFFFFF` pure crisp surface (`18px–22px` border radius) transitioning on active selection/hover-action to `#0D0D0F` deep carbon black with `#FFFFFF` text.
- **Restrained Pastel Accents**:
  - **Periwinkle Blue (`--accent-blue`)**: `#8FA8E0` / `#7C97D6` (completed/executed connectors, active progress tracks, executed support bubble, numeric badge `2` / `3`).
  - **Soft Coral Rose (`--accent-coral`)**: `#D96B70` / `#DF6E73` (pending/dashed connectors, active support bubble, numeric badge `1` / `2`, secondary progress ring).
  - **Warm Amber Sand (`--accent-amber`)**: `#F2D06B` (tertiary gauge and metric highlight).

### 3.2 Typography & Hierarchy
- **Font Stack**: Geometric grotesk sans-serif (`'Plus Jakarta Sans', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif`) with tabular numerals (`font-variant-numeric: tabular-nums`) on all counters, dates, and currency/score sliders.
- **Scale**:
  - Page Title (`Customer Journeys` / `New Starter Journey`): `22px` (`1.375rem`), weight `600`, tracking `-0.02em`, `#151619`.
  - Section / Modal Header (`Processing of the New Case`, `Suggested Knowledge`): `14px`, weight `600`, `#1C1D21`.
  - Card / Task Row Label: `11.5px–12.5px`, weight `500` (`600` when active/assigned), line-height `1.28`.
  - Meta / Timestamps / Table Cells: `11px`, weight `500`, `#6E7381` (muted) and `#1F2126` (primary).

---

## 4. Frame-by-Frame Interaction & Motion Breakdown

### Sequence 01 (`f=0035..0145` | `583.3 ms .. 2,416.7 ms`): Hover Flip & Modal Entrance
- **Evidence**: `analysis/sequences/seq_01_camera_zoom_and_modal_open.png`
- **Mechanism**:
  1. While the presentation camera zooms (`1.0× → 1.48×`) toward the `New Cases` column (`f=0035..0100`), the pointer moves to the 3rd row card (`Identify Issue Impact`).
  2. At `f=0100..0115` (`1,666.7..1,916.7 ms`), the white row card morphs into a solid black action pill (`#0D0D0F`) showing the assignee avatar, an overlapping grey `+` circle, and the centered label `"Take for Processing"`.
  3. Clicking this black pill at `f=0120` (`2,000.0 ms`) opens the centered `"Processing of the New Case"` modal (`width: 420px`, `border-radius: 28px`) over a frosted translucent backdrop (`f=0125..0145`, `~333 ms` settle).

### Sequence 02 (`f=0165..0315` | `2,750.0 ms .. 5,250.0 ms`): Live Typing & Pill Budget Slider
- **Evidence**: `analysis/sequences/seq_02_typing_and_budget_slider.png`
- **Mechanism**:
  1. Clicking the `"Create a case name"` pill input focuses the field; `"Conversion Issues"` (17 characters) types in across `f=0183..0213` (`500 ms`, `~29 ms/char`).
  2. At `f=0237..0265` (`3,950.0..4,416.7 ms`), the pointer drags the `"Allocated Budget"` white pill handle (which has a vertical `⋮` grip icon on its right edge) rightward along the periwinkle track (`#8FA8E0`), updating the tabular readout continuously from `22,500 $` (`f=0237`) → `24,156 $` (`f=0249`) → `24,985 $` (`f=0261`).
  3. At `f=0297..0315`, the pointer presses the black `"Take for Processing"` pill button.

### Sequence 03 (`f=0315..0385` | `5,250.0 ms .. 6,416.7 ms`): Staggered 8-Card Grid & Conic Progress Rings
- **Evidence**: `analysis/sequences/seq_03_transition_to_cases_in_progress.png`
- **Mechanism**:
  1. Modal dismisses (`f=0318..0329`) and the workspace transitions to `"Cases in Progress"`.
  2. The 8 cards in the `4 × 2` grid reveal left-to-right across `f=0336..0371` (`583 ms` total, `~45 ms` stagger per card).
  3. Inside each card, dual circular progress rings (`Hours spent` in coral `#D96B70` and `Payback` in blue `#8FA8E0`) sweep smoothly from `0%` to their target values.

### Sequence 04 (`f=0405..0565` | `6,750.0 ms .. 9,416.7 ms`): Add Case Modal & Accordion Team Selector
- **Evidence**: `analysis/sequences/seq_04_add_case_modal_and_team_dropdown.png`
- **Mechanism**:
  1. Clicking `+ Add New Case` opens the `"Add New Case"` modal (`f=0405..0433`) pre-filled with `"New Case Managment"` and `"Alex Thompson"`.
  2. Clicking the `"Responsible Team"` field (`f=0461`, `7,683.3 ms`) expands an inline rounded dropdown list (`f=0461..0489`, `~466 ms`) displaying three rich rows, each with an overlapping 3-avatar cluster and subtitle (`Team-A Main Support Team`, `Team-B Main Support Team`, `Team-C +4 Development Team`).
  3. Clicking `Team-B` (`f=0503..0517`) updates the header slot and collapses the accordion (`f=0517..0531`, `~233 ms`), followed by clicking `"Add Case"` (`f=0585`).

### Sequence 05 (`f=0585..0675` | `9,750.0 ms .. 11,250.0 ms`): Customer Journeys Staggered Canvas Reveal
- **Evidence**: `analysis/sequences/seq_05_journey_stagger_reveal.png`
- **Mechanism**:
  1. The canvas clears (`f=0609`) and reveals the 4 workflow stage columns sequentially from left to right:
     - Col 1 (`Case Allocation`): `f=0617` (`10,283.3 ms`)
     - Col 2 (`Issue Identification`): `f=0625` (`10,416.7 ms`)
     - Col 3 (`Technical Resolution`): `f=0649` (`10,816.7 ms`)
     - Col 4 (`New Tasks` 2×3 tile grid): `f=0665` (`11,083.3 ms`)
  2. Simultaneously (`f=0625..0665`), the 8 circular avatars in the top-center notch pop in sequentially from left to right (`scale(0) → scale(1)` with slight overshoot), while the bottom panels (`Suggested Knowledge` table and `Support Ticket Journey` bubbles) slide up into place (`f=0633..0665`).

### Sequence 06 (`f=0745..0835` | `12,416.7 ms .. 13,916.7 ms`): Top-Notch Avatar Drag-and-Drop Assignment
- **Evidence**: `analysis/sequences/seq_06_avatar_drag_assign_and_connector.png`
- **Mechanism**:
  1. At `f=0769` (`12,816.7 ms`), the pointer grabs the 6th top-notch avatar (which initially has a `+` badge underneath) and drags a floating circular avatar downward across Col 3 (`Technical Resolution`).
  2. As the avatar passes over the `+` circles of `Identify Issue Dependencies` (`f=0785`), `Identify Issue Resolution` (`f=0793`), and `Estimate Resolution Time` (`f=0801`), each hovered `+` slot highlights as a dark charcoal circle (`#3A3C42`).
  3. Dropping onto `Estimate Resolution Time` (`f=0809..0825`) triggers a quick dark circular ring sweep (`f=0809`), seats the avatar in the row, promotes the row label from muted grey (`#8C909E`) to active dark (`#1C1D21`), rotates the right-side `...` icon to a diagonal `...` connector handle, and updates the 6th top-notch avatar's badge from `+` to coral `1` (`#D96B70`).

### Sequence 07 (`f=0895..0965` | `14,916.7 ms .. 16,083.3 ms`): Connector Drag & Black Tile Selection
- **Evidence**: `analysis/sequences/seq_07_new_task_black_select_and_connector.png`
- **Mechanism**:
  1. At `f=0895..0901` (`14,916.7..15,016.7 ms`), the pointer drags a straight dark line (`#1C1D21`) from the right port of `Estimate Resolution Time` (Col 3) onto the `Request Processing` tile (Col 4, top-left).
  2. At `f=0907..0913` (`15,116.7..15,216.7 ms`), `Request Processing` inverts to solid `#0D0D0F` black with crisp white text while the straight dark connector line terminates on its left edge. **This exact moment (`f=0909`) is the frame rendered in the static 3D laptop image (`reference_image_uploaded.webp`).**
  3. At `f=0919..0925` (`15,316.7..15,416.7 ms`), releasing the pointer routes the connection into a stepped/curved dashed coral bezier path (`#D96B70`) and fades the tile back, before the presentation camera zooms out (`f=0937..0955`) to the full straight-on browser view.
  4. **Prototype Adaptation Note**: In our interactive browser prototype, selecting any `New Tasks` tile (such as `Request Processing`) preserves the signature `#0D0D0F` black selected state (matching the static reference image and prompt requirement *"Black selected states with restrained pastel accents"*), and provides a toggle to inspect either the **Static Reference (Solid Dark Arrow)** or **Video Post-Drop (Dashed Coral Curve)** connector style.
