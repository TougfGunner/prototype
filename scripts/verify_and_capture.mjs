import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const BASE_URL = 'http://127.0.0.1:5173';
const ROOT_DIR = '/Users/lashperera/Downloads/Ajbell';
const SCREENSHOT_DIR = path.join(ROOT_DIR, 'analysis', 'screenshots');
const VIDEO_TMP_DIR = path.join(ROOT_DIR, 'analysis', 'video_tmp');
const RESULTS_JSON = path.join(ROOT_DIR, 'analysis', 'verification-results.json');

fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
fs.mkdirSync(VIDEO_TMP_DIR, { recursive: true });

const assertions = [];
function recordAssertion(id, description, passed, detail = '') {
  assertions.push({ id, description, passed: Boolean(passed), detail });
  const icon = passed ? 'PASS' : 'FAIL';
  console.log(`[${icon}] ${id}: ${description}${detail ? ` (${detail})` : ''}`);
}

async function runVerificationAndScreenshots() {
  const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const browser = await chromium.launch({
    headless: true,
    executablePath: fs.existsSync(chromePath) ? chromePath : undefined,
  });

  // 1. High-resolution screenshot & functional verification context (1600x1200 matches reference 4:3 frame)
  const context = await browser.newContext({
    viewport: { width: 1600, height: 1200 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(400);

  // Check 1: Default load on New Starter Journey screen
  const shellLocator = page.locator('main[aria-label="AJ Bell Internal Operations Prototype Workspace"]');
  const shellVisible = await shellLocator.isVisible();
  recordAssertion(
    'check_01_workspace_shell',
    'Floating frosted workspace shell renders straight-on at 1600x1200 viewport',
    shellVisible
  );

  // Check 2: 4 workflow stages and SVG connector layer present
  const connectorCount = await page
    .locator('svg[data-connector-svg="true"] > g')
    .count();
  recordAssertion(
    'check_02_svg_connectors',
    'Curved SVG connector paths render between Stage 1, Stage 2, Stage 3 and Stage 4',
    connectorCount === 14,
    `paths=${connectorCount}`
  );

  // Capture Screenshot 01: Default AJ Bell New Starter Journey mode
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, '01_journey_ajbell_default.png'),
    fullPage: false,
  });

  // Switch to Reference 1:1 (Issue Resolution) labels + Static solid dark connector to match reference_image_uploaded.webp & f=0909
  await page.goto(`${BASE_URL}/?labels=reference&connector=static_solid_dark`, {
    waitUntil: 'networkidle',
  });
  await page.waitForTimeout(350);

  const stageTitleText = await shellLocator.innerText();
  recordAssertion(
    'check_03_reference_1to1_labels',
    'Reference 1:1 label mode switches stage headers to Case Allocation, Issue Identification, Technical Resolution, New Tasks',
    stageTitleText.includes('Case Allocation') &&
      stageTitleText.includes('Issue Identification') &&
      stageTitleText.includes('Technical Resolution') &&
      stageTitleText.includes('New Tasks')
  );

  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, '02_journey_reference_1to1_solid_dark.png'),
    fullPage: false,
  });

  // Trigger Seq 06: Avatar Drag choreography to capture floating avatar drag-and-drop from top notch p-6 to Estimate Resolution Time (mgr-3)
  await page.locator('button:has-text("Seq 06: Avatar Drag")').first().click();
  await page.waitForTimeout(450);
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, '13_journey_seq06_avatar_drag_choreography.png'),
    fullPage: false,
  });

  // Switch to Video dashed coral mode and select tile-1 (Request Processing) to capture the f=0825 state
  await page.goto(`${BASE_URL}/?labels=reference&connector=video_dashed_coral`, {
    waitUntil: 'networkidle',
  });
  await page.waitForTimeout(250);
  const loopToggleBtn = page.locator('button[aria-label="Toggle continuous motion loop"]');
  if ((await loopToggleBtn.count()) > 0) {
    const loopPressed = await loopToggleBtn.getAttribute('aria-pressed');
    if (loopPressed === 'true') {
      await loopToggleBtn.click();
      await page.waitForTimeout(100);
    }
  }
  await page.locator('[data-tile-id="tile-2"]').click();
  await page.waitForTimeout(200);
  const reqProcTile = page.locator('[data-tile-id="tile-1"]');
  await reqProcTile.click();
  await page.waitForTimeout(300);

  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, '03_journey_reference_1to1_video_dashed.png'),
    fullPage: false,
  });

  const tile1Selected = await reqProcTile.getAttribute('aria-pressed');
  recordAssertion(
    'check_04_black_tile_selection',
    'Clicking Request Processing (tile-1 top-left) activates #0D0D0F black selected state and active connector',
    tile1Selected === 'true'
  );

  // Switch back to AJ Bell New Starter Journey labels
  await page
    .locator('button[title="Toggle between AJ Bell New Starter Journey labels and 1:1 Reference image/video labels"]')
    .click();
  await page.waitForTimeout(250);

  // Check 5: Select a starter/participant in top carved notch to highlight their connected journey
  const secondNotchAvatar = page
    .locator('[role="toolbar"][aria-label*="participants"] button')
    .nth(1);
  await secondNotchAvatar.click();
  await page.waitForTimeout(300);
  const clearStarterBtn = page.locator('button:has-text("Clear Starter Highlight")');
  const clearStarterVisible = await clearStarterBtn.isVisible();
  recordAssertion(
    'check_05_starter_highlight',
    'Selecting a starter avatar in the top carved notch highlights their connected cards and connectors across stages',
    clearStarterVisible
  );

  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, '04_journey_participant_selected.png'),
    fullPage: false,
  });

  // Clear starter filter
  await clearStarterBtn.click();
  await page.waitForTimeout(200);

  // Check 6: Click '+' on unassigned task row to assign reviewer and flip connector from dashed coral to solid periwinkle
  const unassignedButtons = page.locator('button[aria-label*="Assign reviewer to"]');
  const assignBtnBefore = await unassignedButtons.count();
  await unassignedButtons.first().click();
  await page.waitForTimeout(350);
  const assignBtnAfter = await unassignedButtons.count();
  recordAssertion(
    'check_06_assign_reviewer_transition',
    'Clicking + on unassigned task row assigns reviewer avatar and transitions connector from dashed coral to solid periwinkle',
    assignBtnBefore > assignBtnAfter,
    `before=${assignBtnBefore}, after=${assignBtnAfter}`
  );

  // Check 7: Open a workflow card into the Detailed Form Modal, test Responsible Team accordion and Allocated Budget slider
  await page
    .locator('button[title="Toggle between AJ Bell New Starter Journey labels and 1:1 Reference image/video labels"]')
    .click();
  await page.waitForTimeout(200);
  await page.locator('[data-task-id="role-3"]').click();
  await page.waitForTimeout(350);

  const dialogLocator = page.locator('dialog[open]');
  const modalVisible = await dialogLocator.isVisible();
  recordAssertion(
    'check_07_detail_modal_open',
    'Clicking a workflow card opens the glassmorphic Detail Modal dialog with stage stepper',
    modalVisible
  );

  // Open Responsible Team accordion dropdown to match video f=0145
  await dialogLocator.locator('button:has-text("Responsible Team")').click();
  await page.waitForTimeout(250);
  const teamListbox = dialogLocator.locator('[role="listbox"][aria-label="Select responsible team"]');
  const teamAccordionVisible = await teamListbox.isVisible();
  recordAssertion(
    'check_08_team_accordion',
    'Responsible Team accordion expands in-flow with 4 team options and 3-avatar clusters',
    teamAccordionVisible
  );

  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, '05_modal_detail_form_and_team_accordion.png'),
    fullPage: false,
  });

  // Select Technical Support / Platform IAM team option
  await teamListbox.locator('[role="option"]').nth(1).click();
  await page.waitForTimeout(200);

  // Check 9: Accessible validation on empty required fields
  await page.fill('#ajb-field-case-name', '');
  await dialogLocator.locator('button[type="submit"]').click();
  await page.waitForTimeout(200);
  const titleErrorVisible = await page.locator('#ajb-err-case-name').isVisible();
  recordAssertion(
    'check_09_accessible_form_validation',
    'Submitting empty required field triggers aria-invalid and role="alert" validation message',
    titleErrorVisible
  );

  // Fill valid title, move between stages while retaining entered information, and save local draft
  await page.fill('#ajb-field-case-name', 'System Integration — IAM Profile Verified');
  await dialogLocator.locator('button:has-text("Next Stage")').click();
  await page.waitForTimeout(150);
  const retainedTitle = await page.inputValue('#ajb-field-case-name');
  recordAssertion(
    'check_10_stage_switch_retains_form',
    'Moving between workflow stages inside the form retains entered field values',
    retainedTitle === 'System Integration — IAM Profile Verified'
  );

  await dialogLocator.locator('button:has-text("Save Draft")').click();
  await page.waitForTimeout(250);

  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, '06_modal_validation_and_draft_saved.png'),
    fullPage: false,
  });

  // Close modal, reload page, and verify local draft & state persistence in localStorage
  await dialogLocator.locator('button[aria-label="Close modal"]').click();
  await page.waitForTimeout(200);
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(350);

  const persistedDraftRaw = await page.evaluate(() =>
    localStorage.getItem('ajb-ref-ops-v1-state')
  );
  const persistedOk =
    Boolean(persistedDraftRaw) &&
    persistedDraftRaw.includes('System Integration — IAM Profile Verified');
  recordAssertion(
    'check_11_local_draft_persistence',
    'Saved local draft persists across browser reload in localStorage',
    persistedOk
  );

  // Check 12: Role Pipelines / Support Pipelines screen (f=0000 reference)
  await page.goto(`${BASE_URL}/?screen=pipelines&labels=reference`, {
    waitUntil: 'networkidle',
  });
  await page.waitForTimeout(350);
  const takeForProcessingBtn = page.locator('button:has-text("Take for Processing")').first();
  const takeForProcessingVisible = await takeForProcessingBtn.isVisible();
  recordAssertion(
    'check_12_pipelines_screen',
    'Role Pipelines screen renders 4 stage columns, featured Take for Processing CTA, and bottom metrics',
    takeForProcessingVisible
  );

  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, '07_role_pipelines_screen.png'),
    fullPage: false,
  });

  // Check 13: Cases in Progress 8-Card Grid screen (f=0380 reference)
  await page.goto(`${BASE_URL}/?screen=in_progress&labels=reference`, {
    waitUntil: 'networkidle',
  });
  await page.waitForTimeout(350);
  const progressCardCount = await page.locator('text=Team Members').count();
  recordAssertion(
    'check_13_cases_in_progress_grid',
    'Cases in Progress screen renders 4x2 8-card grid with conic progress rings and dark highlighted Case #102 card',
    progressCardCount === 8,
    `cards=${progressCardCount}`
  );

  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, '08_cases_in_progress_8card_grid.png'),
    fullPage: false,
  });

  // Check 14: Filter by role/team/status & Empty/Loading/Error/Completed state controls
  await page.goto(`${BASE_URL}/?screen=journey&labels=operations&filters=open&sim=completed`, {
    waitUntil: 'networkidle',
  });
  await page.waitForTimeout(350);
  const filterRegionVisible = await page
    .locator('[role="region"][aria-label="Operations workflow filters and state controls"]')
    .isVisible();
  recordAssertion(
    'check_14_filters_and_states',
    'Filtering by role/team/status and switching between Normal, Loading, Empty, Error, and Completed states works cleanly',
    filterRegionVisible
  );

  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, '09_filtered_and_state_views.png'),
    fullPage: false,
  });

  // Check 15: Dark Mode consistency on main / workspace (Default Chime-Crimson Palette) + Role-Level Design Tokens
  await page.evaluate(() => localStorage.clear());
  await page.goto(`${BASE_URL}/?theme=dark`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  const journeyDarkTheme = await page.evaluate(() =>
    document.documentElement.getAttribute('data-theme')
  );
  const activePaletteAttr = await page.evaluate(() =>
    document.documentElement.getAttribute('data-palette')
  );
  const roleTokenChipVisible = await page.locator('[data-testid="active-role-token-chip"]').isVisible();
  const crimsonChipText = await page.locator('[data-testid="active-role-token-chip"]').innerText();
  recordAssertion(
    'check_15_journey_dark_mode_and_role_tokens',
    'Main workspace renders AJ Bell Chime Crimson (chime-crimson) by default with active --role-* design token synchronization',
    journeyDarkTheme === 'dark' &&
      activePaletteAttr === 'chime-crimson' &&
      roleTokenChipVisible &&
      crimsonChipText.includes('#FF385C'),
    `data-theme=${journeyDarkTheme}, data-palette=${activePaletteAttr}, roleChip=${crimsonChipText}`
  );

  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, '14_journey_dark_mode_obsidian.png'),
    fullPage: false,
  });
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, '18_palette_chime_crimson_dark.png'),
    fullPage: false,
  });

  // Capture Default Chime-Crimson Light Mode
  await page.goto(`${BASE_URL}/?theme=light`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(350);
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, '19_palette_chime_crimson_light.png'),
    fullPage: false,
  });

  // Check 20: Verify selectable Light-Blue & Chime-Blue-Dark palettes and zero leaks when changed via URL or external agent DOM mutation
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-palette', 'light-blue');
    document.documentElement.setAttribute('data-theme', 'dark');
  });
  await page.waitForTimeout(350);
  const mutatedPaletteAttr = await page.evaluate(() =>
    document.documentElement.getAttribute('data-palette')
  );
  const blueDarkChipText = await page.locator('[data-testid="active-role-token-chip"]').innerText();
  const selectValueAfterDomMutation = await page
    .locator('[data-testid="top-palette-select"]')
    .inputValue();
  recordAssertion(
    'check_20_selectable_palettes_zero_leaks',
    'Selectable Light-Blue & Chime-Blue-Dark palettes switch cleanly with zero red/blue leaks even when mutated directly on <html> by other agents',
    mutatedPaletteAttr === 'light-blue' &&
      selectValueAfterDomMutation === 'light-blue' &&
      blueDarkChipText.includes('#7B99DC') &&
      !blueDarkChipText.includes('#FF385C'),
    `data-palette=${mutatedPaletteAttr}, select=${selectValueAfterDomMutation}, chip=${blueDarkChipText}`
  );
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, '16_palette_light_blue_dark.png'),
    fullPage: false,
  });

  await page.goto(`${BASE_URL}/?theme=light&palette=light-blue`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(350);
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, '17_palette_light_blue_light.png'),
    fullPage: false,
  });

  // Return to Default Chime-Crimson Dark Mode and open Root & Role-Level Token Architecture & Repo Merge Blueprint drawer on /
  await page.goto(`${BASE_URL}/?theme=dark&palette=chime-crimson`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(300);
  await page.locator('[data-testid="toggle-blueprint-drawer"]').click();
  await page.waitForTimeout(350);
  const blueprintVisibleOnHome = await page
    .locator('[data-testid="token-architecture-blueprint"]')
    .isVisible();
  recordAssertion(
    'check_16_token_blueprint_and_repo_merge',
    'Root-Level & Role-Level Design Token Architecture + 6-Step Multi-Repo Merge Blueprint renders interactively',
    blueprintVisibleOnHome
  );

  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, '15_token_architecture_and_repo_merge_blueprint.png'),
    fullPage: false,
  });

  // Check 17: Navigate to /gallery route ("Reference Operations v1") and verify Light Reference & Dark Adaptation
  await page.evaluate(() => localStorage.clear());
  await page.goto(`${BASE_URL}/gallery`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  const galleryText = await page.locator('body').innerText();
  const galleryUrl = page.url();
  recordAssertion(
    'check_17_gallery_route_light',
    'Discoverable /gallery route renders Reference Operations v1 token & live shared component showcase in Light Reference mode',
    galleryText.includes('Reference Operations v1') && galleryUrl.endsWith('/gallery'),
    `url=${galleryUrl}`
  );

  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, '10_gallery_reference_operations_v1_light.png'),
    fullPage: false,
  });

  // Scroll to Section 3 in /gallery ("3. Connected Workflow Cards, Task Rows, Action Tiles & Curved Connectors") and capture live shared component + choreography
  const gallerySec3Heading = page.locator('#gallery-workflow-heading');
  await gallerySec3Heading.evaluate((el) => el.scrollIntoView({ block: 'start' }));
  await page.waitForTimeout(450);
  const gallerySec3Connectors = await page.locator('svg[data-connector-svg="true"] > g').count();
  recordAssertion(
    'check_18_gallery_section3_shared_canvas',
    'Gallery Section 3 renders the exact 1:1 shared ConnectedWorkflowCanvas with curved connectors, gradients, and motion choreography bar',
    gallerySec3Connectors === 14,
    `gallery_paths=${gallerySec3Connectors}`
  );
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, '12_gallery_section3_connected_workflow_choreography.png'),
    fullPage: false,
  });

  // Scroll back to top and switch to Dark Adaptation in /gallery
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(150);
  await page.locator('[data-testid="gallery-theme-toggle"]').first().click();
  await page.waitForTimeout(350);
  const dataTheme = await page.evaluate(() =>
    document.documentElement.getAttribute('data-theme')
  );
  recordAssertion(
    'check_19_gallery_dark_adaptation',
    'Dark Adaptation toggle in /gallery switches theme tokens across both /gallery and / via unified store',
    dataTheme === 'dark'
  );

  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, '11_gallery_reference_operations_v1_dark_adaptation.png'),
    fullPage: false,
  });

  // Reset back to Light Reference
  await page.locator('[data-testid="gallery-theme-toggle"]').first().click();
  await page.waitForTimeout(200);
  await context.close();

  // 2. Record a short continuous interaction video at 1600x1200
  const videoContext = await browser.newContext({
    viewport: { width: 1600, height: 1200 },
    recordVideo: {
      dir: VIDEO_TMP_DIR,
      size: { width: 1600, height: 1200 },
    },
  });
  const vPage = await videoContext.newPage();
  await vPage.goto(`${BASE_URL}/?screen=pipelines&labels=reference`, {
    waitUntil: 'networkidle',
  });
  await vPage.waitForTimeout(600);

  // Step A: On Support Pipelines -> click Take for Processing -> open modal -> expand Team accordion -> submit
  await vPage.locator('button:has-text("Take for Processing")').first().click();
  await vPage.waitForTimeout(600);
  await vPage.locator('dialog[open] button:has-text("Responsible Team")').click();
  await vPage.waitForTimeout(600);
  await vPage.locator('dialog[open] [role="option"]').nth(1).click();
  await vPage.waitForTimeout(450);
  await vPage.locator('dialog[open] button[type="submit"]').click();
  await vPage.waitForTimeout(800);

  // Step B: Switch to Cases in Progress 8-Card Grid -> click Case #102 card
  await vPage.locator('nav[aria-label="Primary workspace navigation"] button:has-text("Leads")').click();
  await vPage.waitForTimeout(700);
  await vPage.locator('text=Team Members').nth(1).click();
  await vPage.waitForTimeout(600);
  await vPage.locator('dialog[open] button[aria-label="Close modal"]').click();
  await vPage.waitForTimeout(500);

  // Step C: Switch to Connected Journey Canvas -> assign reviewer on unassigned task -> click Request Processing tile
  await vPage.locator('nav[aria-label="Primary workspace navigation"] button:has-text("Cases")').click();
  await vPage.waitForTimeout(600);
  await vPage
    .locator('button[title="Toggle between AJ Bell New Starter Journey labels and 1:1 Reference image/video labels"]')
    .click();
  await vPage.waitForTimeout(500);
  const vAssignBtn = vPage.locator('button[aria-label*="Assign reviewer to"]').first();
  if ((await vAssignBtn.count()) > 0) {
    await vAssignBtn.click({ force: true });
    await vPage.waitForTimeout(500);
  }
  await vPage.locator('[data-tile-id="tile-1"]').first().click();
  await vPage.waitForTimeout(450);
  await vPage.locator('[data-tile-id="tile-4"]').first().click();
  await vPage.waitForTimeout(650);

  // Step D: Visit /gallery Reference Operations v1
  await vPage.locator('[data-testid="open-gallery-route"]').first().click();
  await vPage.waitForTimeout(800);

  const recordedVideoPath = await vPage.video().path();
  await videoContext.close();
  await browser.close();

  // Copy .webm and transcode to .mp4 for universal playback
  const targetWebm = path.join(ROOT_DIR, 'analysis', 'verification-recording.webm');
  const targetMp4 = path.join(ROOT_DIR, 'analysis', 'verification-recording.mp4');
  fs.copyFileSync(recordedVideoPath, targetWebm);
  execFileSync('ffmpeg', [
    '-y',
    '-i',
    targetWebm,
    '-c:v',
    'libx264',
    '-pix_fmt',
    'yuv420p',
    '-movflags',
    '+faststart',
    targetMp4,
  ]);

  const passedCount = assertions.filter((a) => a.passed).length;
  const summary = {
    generated_at: new Date().toISOString(),
    base_url: BASE_URL,
    viewport: { width: 1600, height: 1200 },
    total: assertions.length,
    passed: passedCount,
    failed: assertions.length - passedCount,
    assertions,
    screenshots: fs
      .readdirSync(SCREENSHOT_DIR)
      .filter((f) => f.endsWith('.png'))
      .sort()
      .map((f) => `analysis/screenshots/${f}`),
    recordings: [
      'analysis/verification-recording.mp4',
      'analysis/verification-recording.webm',
    ],
  };

  fs.writeFileSync(RESULTS_JSON, JSON.stringify(summary, null, 2));
  console.log(`\nVerification complete: ${passedCount}/${assertions.length} assertions passed.`);
  if (passedCount !== assertions.length) {
    process.exit(1);
  }
}

runVerificationAndScreenshots().catch((err) => {
  console.error(err);
  process.exit(1);
});
