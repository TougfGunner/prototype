/**
 * Reference Operations v1 — Versioned Root-Level & Role-Level Design System Tokens
 * Derived from ajbell.co.uk Chime Rebrand + straight-on reference frames (f=0000, f=0145, f=0380, f=0680, f=0909)
 * and empirical motion measurements in analysis/motion-timeline.json.
 */

export const DESIGN_SYSTEM_VERSION = {
  name: 'Reference Operations v1 · AJ Bell Chime Rebrand',
  version: '2.1.0',
  motto: 'Feel good, investing',
  baselineTheme: 'light',
  adaptationTheme: 'dark',
  sourceReference:
    'ajbell.co.uk Chime Rebrand + 93f37755fd19926a8a827c5719a7c7e2.mp4 + reference_image_uploaded.webp',
} as const;

export interface TokenEntry {
  name: string;
  cssVar: string;
  lightValue: string;
  darkValue?: string;
  category: 'color' | 'typography' | 'spacing' | 'radius' | 'elevation' | 'motion' | 'role';
  description: string;
}

export interface RoleTokenSpec {
  roleId: 'Operations Coordinator' | 'Hiring Manager' | 'Identity & Access Lead' | 'Compliance Reviewer';
  shortCode: string;
  cssPrefix: string;
  lightPrimary: string;
  darkPrimary: string;
  lightSurface: string;
  darkSurface: string;
  lightBadgeBg: string;
  darkBadgeBg: string;
  ownedStages: string[];
  capabilities: string[];
  description: string;
}

export const ROLE_LEVEL_DESIGN_TOKENS: RoleTokenSpec[] = [
  {
    roleId: 'Operations Coordinator',
    shortCode: 'OPS-COORD',
    cssPrefix: '--role-ops',
    lightPrimary: '#E81A41',
    darkPrimary: '#FF385C',
    lightSurface: 'rgba(232, 26, 65, 0.12)',
    darkSurface: 'rgba(255, 56, 92, 0.18)',
    lightBadgeBg: '#5D0A1A',
    darkBadgeBg: '#D91842',
    ownedStages: ['01 · Starter Details', '04 · Ready for Onboarding'],
    capabilities: [
      'Full end-to-end starter record orchestration',
      'Assigns top-notch specialists onto unassigned workflow rows',
      'Triggers Day-1 induction pack and audit export',
    ],
    description:
      'Primary AJ Bell Crimson (#E81A41 / #FF385C) & Deep Burgundy (#5D0A1A) token set for end-to-end onboarding orchestration.',
  },
  {
    roleId: 'Hiring Manager',
    shortCode: 'HIRE-MGR',
    cssPrefix: '--role-manager',
    lightPrimary: '#B00054',
    darkPrimary: '#F03E98',
    lightSurface: 'rgba(176, 0, 84, 0.12)',
    darkSurface: 'rgba(240, 62, 152, 0.18)',
    lightBadgeBg: '#B00054',
    darkBadgeBg: '#C81469',
    ownedStages: ['02 · Role & Access Profile', '03 · Manager Review'],
    capabilities: [
      'Approves role profile, department cost centre, and supervision tier',
      'Signs off Stage 03 Manager Review and SMCR line-management attestation',
      'Adjusts resource allocation sliders in the Detail Modal',
    ],
    description:
      'AJ Bell Secondary Berry Magenta (#B00054 / #F03E98) token set for hiring manager review, approvals, and team allocation.',
  },
  {
    roleId: 'Identity & Access Lead',
    shortCode: 'IAM-LEAD',
    cssPrefix: '--role-it',
    lightPrimary: '#18637C',
    darkPrimary: '#38A5C8',
    lightSurface: 'rgba(24, 99, 124, 0.13)',
    darkSurface: 'rgba(56, 165, 200, 0.18)',
    lightBadgeBg: '#18637C',
    darkBadgeBg: '#1E7A96',
    ownedStages: ['02 · Role & Access Profile', '04 · Ready for Onboarding'],
    capabilities: [
      'Provisions SSO, trading platform entitlements, and hardware bundle',
      'Executes 2x3 action tiles (SSO, GitHub/Cloud, Bloomberg/Calypso)',
      'Transitions Stage 02 → Stage 03 connector splines to Executed',
    ],
    description:
      'AJ Bell Teal (#18637C / #38A5C8) token set for identity, technical entitlements, hardware provisioning, and system access checks.',
  },
  {
    roleId: 'Compliance Reviewer',
    shortCode: 'SMCR-COMP',
    cssPrefix: '--role-compliance',
    lightPrimary: '#2A792A',
    darkPrimary: '#44B844',
    lightSurface: 'rgba(42, 121, 42, 0.13)',
    darkSurface: 'rgba(68, 184, 68, 0.18)',
    lightBadgeBg: '#2A792A',
    darkBadgeBg: '#2A792A',
    ownedStages: ['01 · Starter Details', '03 · Manager Review'],
    capabilities: [
      'Validates FCA / SMCR Certification Regime & Fit-and-Proper checks',
      'Clears regulatory background screening and PAD policy declarations',
      'Unlocks gated regulatory approval tasks before Day-1 activation',
    ],
    description:
      'AJ Bell Regulatory Emerald (#2A792A / #44B844) token set for FCA/SMCR regulatory sign-off and audit readiness.',
  },
];

export const DESIGN_TOKENS: TokenEntry[] = [
  // Root Colour Tokens (ajbell.co.uk Chime Rebrand Light + Obsidian Dark)
  {
    name: 'Canvas Warm Stone / Obsidian Background',
    cssVar: '--ajb-bg-canvas',
    lightValue: '#E6E5DD',
    darkValue: '#110E13',
    category: 'color',
    description:
      'AJ Bell Chime Rebrand Warm Stone outer canvas (#E6E5DD) in Light Mode and Rich Obsidian (#110E13) in Dark Mode.',
  },
  {
    name: 'Canvas Radial Crimson & Burgundy Wash',
    cssVar: '--ref-bg-ambient-wash',
    lightValue: 'rgba(232, 26, 65, 0.15)',
    darkValue: 'rgba(232, 26, 65, 0.22)',
    category: 'color',
    description:
      'Subtle AJ Bell Crimson (#E81A41) and Deep Burgundy (#5D0A1A) radial wash beneath the workspace shell.',
  },
  {
    name: 'Notched Workspace Shell Surface',
    cssVar: '--ajb-surface-shell',
    lightValue: 'rgba(247, 246, 241, 0.94)',
    darkValue: 'rgba(24, 20, 28, 0.94)',
    category: 'color',
    description:
      'Warm Alabaster floating workspace container (#F7F6F1) in Light Mode and Deep Warm Charcoal (#18141C) in Dark Mode.',
  },
  {
    name: 'Stage Column Container Surface',
    cssVar: '--ajb-surface-panel',
    lightValue: 'rgba(252, 252, 249, 0.95)',
    darkValue: 'rgba(31, 26, 36, 0.96)',
    category: 'color',
    description: 'Floating workflow stage column and bottom split metric/table panel surface.',
  },
  {
    name: 'Card & Task Row Surface',
    cssVar: '--ajb-surface-card',
    lightValue: '#FAFAF9',
    darkValue: '#28212D',
    category: 'color',
    description:
      'Crisp AJ Bell Warm White (#FAFAF9) in Light Mode and Warm Charcoal Card (#28212D) in Dark Mode.',
  },
  {
    name: 'Elevated Control & Pill Surface',
    cssVar: '--ajb-surface-elevated',
    lightValue: '#FFFFFF',
    darkValue: '#2F2735',
    category: 'color',
    description:
      'Elevated interactive control, circular icon button, and SVG port socket surface across Light and Dark themes.',
  },
  {
    name: 'Selected / Active Deep Burgundy State',
    cssVar: '--ajb-surface-selected',
    lightValue: '#5D0A1A',
    darkValue: '#9E1132',
    category: 'color',
    description:
      'AJ Bell signature Deep Burgundy (#5D0A1A) in Light Mode and Luminous Burgundy-Crimson (#9E1132) in Dark Mode.',
  },
  {
    name: 'Selected Foreground Text',
    cssVar: '--ref-text-on-selected',
    lightValue: '#FFFFFF',
    darkValue: '#FFFFFF',
    category: 'color',
    description: 'High-contrast crisp white label colour inside Deep Burgundy selected pills and tiles.',
  },
  {
    name: 'Primary Charcoal / Alabaster Text',
    cssVar: '--ajb-text-primary',
    lightValue: '#242424',
    darkValue: '#FAF9F5',
    category: 'color',
    description: 'AJ Bell primary Charcoal (#242424) in Light Mode and Crisp Warm Alabaster (#FAF9F5) in Dark Mode.',
  },
  {
    name: 'Secondary Warm Slate Text',
    cssVar: '--ajb-text-secondary',
    lightValue: '#524F48',
    darkValue: '#CEC9C0',
    category: 'color',
    description: 'High-clarity secondary labels, subtitles, and table metadata text.',
  },
  {
    name: 'Unassigned / Pending Task Text',
    cssVar: '--ajb-text-muted',
    lightValue: '#76736A',
    darkValue: '#9D968D',
    category: 'color',
    description: 'Readable warm stone label colour for unassigned workflow tasks prior to avatar drop.',
  },
  {
    name: 'AJ Bell Primary Crimson',
    cssVar: '--ajb-accent-periwinkle',
    lightValue: '#E81A41',
    darkValue: '#FF385C',
    category: 'color',
    description:
      'AJ Bell Primary Brand Crimson (#E81A41 Light / #FF385C Dark) for executed connectors, sliders, and gauges.',
  },
  {
    name: 'AJ Bell Berry Magenta',
    cssVar: '--ajb-accent-coral',
    lightValue: '#B00054',
    darkValue: '#F03E98',
    category: 'color',
    description:
      'AJ Bell Secondary Berry (#B00054 Light / #F03E98 Dark) for dashed pending connectors, badges, and rings.',
  },
  {
    name: 'AJ Bell Warm Gold Highlight',
    cssVar: '--ajb-accent-amber',
    lightValue: '#FFE272',
    darkValue: '#FFE272',
    category: 'color',
    description:
      'AJ Bell Warm Gold (#FFE272) for tertiary metrics, bell clapper emblem, and dark-mode Stage 03→04 active splines.',
  },
  {
    name: 'AJ Bell Regulatory Emerald',
    cssVar: '--ajb-accent-emerald',
    lightValue: '#2A792A',
    darkValue: '#44B844',
    category: 'color',
    description: 'AJ Bell Green (#2A792A Light / #44B844 Dark) for completed stages and SMCR compliance verification.',
  },
  {
    name: 'Fine Hairline Glass Border',
    cssVar: '--ajb-border-glass',
    lightValue: 'rgba(255, 255, 255, 0.92)',
    darkValue: 'rgba(255, 255, 255, 0.14)',
    category: 'color',
    description: '1px luminous border around floating stage panels, cards, and modals.',
  },
  {
    name: 'Subtle Divider Border',
    cssVar: '--ajb-border-subtle',
    lightValue: 'rgba(36, 36, 36, 0.088)',
    darkValue: 'rgba(255, 255, 255, 0.11)',
    category: 'color',
    description: 'Quiet warm divider line for table rows, ports, and input outlines.',
  },

  // Role-Level Design Tokens (--role-*)
  {
    name: 'Role Token · Operations Coordinator',
    cssVar: '--role-ops-primary',
    lightValue: '#E81A41',
    darkValue: '#FF385C',
    category: 'role',
    description: 'Operations Coordinator role accent (Stages 01 & 04 owner, full starter orchestration).',
  },
  {
    name: 'Role Token · Line Manager',
    cssVar: '--role-manager-primary',
    lightValue: '#B00054',
    darkValue: '#F03E98',
    category: 'role',
    description: 'Line Manager role accent (Stages 02 & 03 sign-off and resource allocation sliders).',
  },
  {
    name: 'Role Token · IT Provisioning',
    cssVar: '--role-it-primary',
    lightValue: '#18637C',
    darkValue: '#38A5C8',
    category: 'role',
    description: 'IT Provisioning role accent (Stage 02 entitlements & Stage 04 2x3 action tile execution).',
  },
  {
    name: 'Role Token · Compliance & SMCR',
    cssVar: '--role-compliance-primary',
    lightValue: '#2A792A',
    darkValue: '#44B844',
    category: 'role',
    description: 'Compliance & SMCR role accent (FCA Fit & Proper certification and regulatory gating).',
  },

  // Ultra-Clear Scaled Typography Tokens
  {
    name: 'Primary Sans Font Family',
    cssVar: '--ajb-font-sans',
    lightValue: "'Mona Sans', 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Inter', sans-serif",
    category: 'typography',
    description: 'AJ Bell Chime Rebrand Mona Sans + Plus Jakarta Sans geometric grotesk with tabular numeric support.',
  },
  {
    name: 'View Title Size (24px)',
    cssVar: '--ajb-text-xl',
    lightValue: '24px',
    category: 'typography',
    description: 'Ultra-clear 24px bold screen header (e.g. New Starter Journey / Customer Journeys).',
  },
  {
    name: 'Section & Modal Title Size (17.5px)',
    cssVar: '--ajb-text-lg',
    lightValue: '17.5px',
    category: 'typography',
    description: '17.5px bold modal, table, and architecture section header typography.',
  },
  {
    name: 'Stage Header Size (15px)',
    cssVar: '--ajb-text-md',
    lightValue: '15px',
    category: 'typography',
    description: '15px semi-bold workflow stage header and primary card title typography.',
  },
  {
    name: 'Primary Body & Control Size (13.5px)',
    cssVar: '--ajb-text-base',
    lightValue: '13.5px',
    category: 'typography',
    description: '13.5px high-legibility navigation pill, filter select, and table cell typography.',
  },
  {
    name: 'Task Row & Subpanel Label Size (12.5px)',
    cssVar: '--ajb-text-sm',
    lightValue: '12.5px',
    category: 'typography',
    description: '12.5px crisp workflow task row, action tile, and form label typography.',
  },
  {
    name: 'Micro Counter & Badge Size (11.5px)',
    cssVar: '--ajb-text-xs',
    lightValue: '11.5px',
    category: 'typography',
    description: '11.5px tabular badge counter, stage code, and port coordinate metadata.',
  },

  // Spacing Tokens
  {
    name: 'Space XS (4px)',
    cssVar: '--ref-space-1',
    lightValue: '4px',
    category: 'spacing',
    description: 'Tight avatar overlap and micro badge padding.',
  },
  {
    name: 'Space SM (9px)',
    cssVar: '--ref-space-2',
    lightValue: '9px',
    category: 'spacing',
    description: 'Vertical gap between workflow task rows.',
  },
  {
    name: 'Space MD (15px)',
    cssVar: '--ref-space-3',
    lightValue: '15px',
    category: 'spacing',
    description: 'Internal padding of floating stage containers.',
  },
  {
    name: 'Space LG (24px)',
    cssVar: '--ref-space-4',
    lightValue: '24px',
    category: 'spacing',
    description: 'Horizontal gutter between connected workflow stage columns (for SVG bezier routing).',
  },

  // Radius Tokens
  {
    name: 'Workspace Outer Radius',
    cssVar: '--ajb-radius-shell',
    lightValue: '38px',
    category: 'radius',
    description: 'Generous outer corner radius for the notched workspace shell.',
  },
  {
    name: 'Stage Panel Radius',
    cssVar: '--ajb-radius-stage',
    lightValue: '26px',
    category: 'radius',
    description: 'Rounded container radius for the 4 workflow stage panels and bottom cards.',
  },
  {
    name: 'Task Card & Tile Radius',
    cssVar: '--ajb-radius-md',
    lightValue: '17px',
    category: 'radius',
    description: 'Rounded square/pill radius for allocation cards and 2x3 New Tasks tiles.',
  },
  {
    name: 'Pill Control Radius',
    cssVar: '--ajb-radius-pill',
    lightValue: '9999px',
    category: 'radius',
    description: 'Full capsule radius for navigation tabs, status badges, and slider tracks.',
  },

  // Elevation Tokens
  {
    name: 'Restrained Floating Panel Shadow',
    cssVar: '--ajb-shadow-stage',
    lightValue: '0 10px 26px -8px rgba(48, 14, 22, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.94)',
    darkValue: '0 12px 28px -8px rgba(0, 0, 0, 0.48), inset 0 1px 0 rgba(255, 255, 255, 0.11)',
    category: 'elevation',
    description: 'Soft ambient shadow and top specular highlight beneath workflow stage columns.',
  },
  {
    name: 'Task Row Micro Shadow',
    cssVar: '--ajb-shadow-card',
    lightValue: '0 4px 14px -2px rgba(36, 20, 24, 0.055)',
    darkValue: '0 4px 14px -2px rgba(0, 0, 0, 0.44)',
    category: 'elevation',
    description: 'Restrained lift for task pills inside stage columns.',
  },
  {
    name: 'Modal Overlay Shadow',
    cssVar: '--ajb-shadow-modal',
    lightValue: '0 32px 72px -12px rgba(58, 8, 18, 0.28), 0 4px 16px rgba(36, 20, 24, 0.10)',
    darkValue: '0 32px 76px -12px rgba(0, 0, 0, 0.82), 0 4px 18px rgba(232, 26, 65, 0.18)',
    category: 'elevation',
    description: 'Elevated dialog shadow measured from f=0145 and f=0433.',
  },

  // Motion Tokens (Translated from analysis/motion-timeline.json)
  {
    name: 'Motion Duration Instant',
    cssVar: '--motion-duration-instant',
    lightValue: '90ms',
    category: 'motion',
    description: 'Immediate hover highlight and button press feedback.',
  },
  {
    name: 'Motion Duration Fast',
    cssVar: '--motion-duration-fast',
    lightValue: '160ms',
    category: 'motion',
    description: 'Badge counter updates, port highlight, and focus ring transitions.',
  },
  {
    name: 'Motion Duration Normal (Tile Invert)',
    cssVar: '--motion-duration-normal',
    lightValue: '260ms',
    category: 'motion',
    description: 'Measured 16-frame (266.7ms) Deep Burgundy tile selection inversion (f=0906..0922).',
  },
  {
    name: 'Motion Duration Modal & Dropdown',
    cssVar: '--motion-duration-modal',
    lightValue: '320ms',
    category: 'motion',
    description: 'Modal dialog entrance/exit and Responsible Team accordion expansion.',
  },
  {
    name: 'Motion Duration SVG Connector Draw',
    cssVar: '--motion-duration-connector',
    lightValue: '380ms',
    category: 'motion',
    description: 'Cubic bezier connector stroke-dashoffset draw and dashed-to-solid transition.',
  },
  {
    name: 'Motion Stagger Step',
    cssVar: '--motion-duration-stagger',
    lightValue: '42ms',
    category: 'motion',
    description: 'Measured ~40-45ms per-item stagger for top-notch avatars and stage cards (f=0615..0665).',
  },
  {
    name: 'Easing Out Quart (UI Default)',
    cssVar: '--motion-ease-out-quart',
    lightValue: 'cubic-bezier(0.22, 1, 0.36, 1)',
    category: 'motion',
    description: 'Primary deceleration curve for modals, cards, and dropdown expansion.',
  },
  {
    name: 'Easing Spring Gentle (Avatar Pop)',
    cssVar: '--motion-ease-spring',
    lightValue: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    category: 'motion',
    description: 'Subtle overshoot spring for top-notch avatar pop-in and slot assignment snap.',
  },
];

export const REFERENCE_OPERATIONS_TOKENS = {
  name: DESIGN_SYSTEM_VERSION.name,
  version: DESIGN_SYSTEM_VERSION.version,
  motto: DESIGN_SYSTEM_VERSION.motto,
  color: {
    light: {
      canvasOuter: '#E6E5DD',
      surfaceShell: '#F2F2EA',
      surfaceCard: '#FAFAF9',
      surfaceElevated: '#FFFFFF',
      accentBlack: '#5D0A1A',
      accentPeriwinkle: '#E81A41',
      accentCoral: '#B00054',
      accentAmber: '#FFE272',
      accentEmerald: '#2A792A',
      accentTeal: '#18637C',
      textPrimary: '#242424',
      textSecondary: '#524F48',
      statusExecuted: '#E81A41',
      statusScheduled: '#76736A',
    },
    dark: {
      canvasOuter: '#110E13',
      surfaceShell: '#18141C',
      surfaceCard: '#28212D',
      surfaceElevated: '#2F2735',
      accentBlack: '#9E1132',
      accentPeriwinkle: '#FF385C',
      accentCoral: '#F03E98',
      accentAmber: '#FFE272',
      accentEmerald: '#44B844',
      accentTeal: '#38A5C8',
      textPrimary: '#FAF9F5',
      textSecondary: '#CEC9C0',
      statusExecuted: '#FF385C',
      statusScheduled: '#9D968D',
    },
  },
  radius: {
    shellOuter: '38px',
    notch: '32px',
    stageCard: '23px',
    taskRow: '17px',
    modal: '30px',
  },
  motion: {
    duration: {
      hoverFlip: '160ms',
      modalOpen: '320ms',
      panelMorph: '360ms',
      connectorDraw: '380ms',
      staggerStep: '42ms',
    },
    easing: {
      modalSpring: 'cubic-bezier(0.22, 1, 0.36, 1)',
      standard: 'cubic-bezier(0.22, 1, 0.36, 1)',
    },
  },
} as const;

export interface ArchitectureNodeConnection {
  id: string;
  layer: 'Layer 1 · Root & Role Tokens' | 'Layer 2 · Headless State & Persistence' | 'Layer 3 · Connected Canvas & SVG Spline Engine' | 'Layer 4 · Interactive Modals, Tables & Host Repo Merge';
  modulePath: string;
  exports: string[];
  consumesFrom: string[];
  providesTo: string[];
  description: string;
}

export const SYSTEM_CONNECTIVITY_GRAPH: ArchitectureNodeConnection[] = [
  {
    id: 'tokens-layer',
    layer: 'Layer 1 · Root & Role Tokens',
    modulePath: 'src/design-system/tokens.css + src/design-system/tokens.ts + public/ajbell-design-tokens.json',
    exports: [
      ':root & [data-theme="dark"] (--ajb-*, --ref-*, --motion-*, --role-*)',
      'DESIGN_TOKENS',
      'ROLE_LEVEL_DESIGN_TOKENS',
      'REFERENCE_OPERATIONS_TOKENS',
    ],
    consumesFrom: ['ajbell.co.uk Chime Rebrand Spec', 'analysis/motion-timeline.json (60fps video telemetry)'],
    providesTo: [
      'NavigationShell.tsx',
      'WorkflowCards.tsx',
      'CurvedConnectorLayer.tsx',
      'DetailModal.tsx',
      'TablesAndMetrics.tsx',
      'Any External Host Repo via CSS/JSON import',
    ],
    description:
      'Single source of truth for Light & Dark palettes, role-scoped accents, scaled typography, elevation, and 60fps cubic-bezier/spring motion variables.',
  },
  {
    id: 'state-store-layer',
    layer: 'Layer 2 · Headless State & Persistence',
    modulePath: 'src/state/useStarterStore.ts + src/data/syntheticStarters.ts + src/types/workflow.ts',
    exports: ['useStarterStore()', 'SYNTHETIC_STARTERS', 'NOTCH_AVATARS', 'StarterJourneyRecord'],
    consumesFrom: ['window.localStorage (ajbell_ops_starter_v1)', 'document.documentElement.dataset.theme'],
    providesTo: ['App.tsx', 'GalleryPage.tsx', 'ConnectedWorkflowCanvas', 'DetailModal', 'StarterDirectoryTable'],
    description:
      'Decoupled headless state store managing active starter selection, role persona switching, theme synchronization (light/dark), task completion, and draft form persistence.',
  },
  {
    id: 'canvas-spline-layer',
    layer: 'Layer 3 · Connected Canvas & SVG Spline Engine',
    modulePath: 'src/design-system/components/WorkflowCards.tsx + src/design-system/components/CurvedConnectorLayer.tsx',
    exports: [
      'ConnectedWorkflowCanvas',
      'StageCardShell',
      'TaskRowCard',
      'ActionTileGrid',
      'CurvedConnectorLayer',
    ],
    consumesFrom: ['tokens.css (--ajb-connector-*, --motion-*)', 'DOM data-port-id anchor attributes'],
    providesTo: ['New Starter Journey Screen (/)', 'Reference Operations v1 Gallery (/gallery)'],
    description:
      'Measures real-time DOM port coordinates via ResizeObserver + requestAnimationFrame and renders cubic-bezier C(x1,y1 x2,y2 x,y) splines with stroke-dashoffset draw & dashed flow animations.',
  },
  {
    id: 'modal-table-merge-layer',
    layer: 'Layer 4 · Interactive Modals, Tables & Host Repo Merge',
    modulePath:
      'src/design-system/components/DetailModal.tsx + TablesAndMetrics.tsx + NavigationShell.tsx + AJBellBrandAssets.tsx',
    exports: [
      'StarterDetailModal',
      'CustomerAllocationModal',
      'StarterDirectoryTable',
      'OnboardingProgressCard',
      'AJBellWordmarkLogo',
      'NotchedWorkspaceShell',
    ],
    consumesFrom: ['useStarterStore()', 'tokens.css', 'ROLE_LEVEL_DESIGN_TOKENS'],
    providesTo: ['Host Application Router (/ and /gallery)', 'External React / Next.js / Vite Repositories'],
    description:
      'Accessible native <dialog> modals, validation forms, circular SVG gauges, and self-contained components engineered for zero-conflict drop-in adoption into any repository.',
  },
];

export const PORTABLE_REPO_MERGE_MANIFEST = {
  packageId: '@ajbell-ops/reference-operations-v1',
  zeroExternalRuntimeDeps: true,
  peerRequirements: ['react >= 18', 'react-dom >= 18'],
  portableFiles: [
    'src/design-system/tokens.css',
    'src/design-system/tokens.ts',
    'src/design-system/components/AJBellBrandAssets.tsx',
    'src/design-system/components/NavigationShell.tsx',
    'src/design-system/components/WorkflowCards.tsx',
    'src/design-system/components/CurvedConnectorLayer.tsx',
    'src/design-system/components/DetailModal.tsx',
    'src/design-system/components/TablesAndMetrics.tsx',
    'src/design-system/components/TokenArchitectureBlueprint.tsx',
    'public/ajbell-design-tokens.json',
  ],
  cssScopingStrategy:
    'All CSS custom properties are namespaced with --ajb-*, --ref-*, --motion-*, and --role-*. Theme switching uses html[data-theme="light" | "dark"] and role scoping uses [data-active-role], guaranteeing zero global class collisions when merged into an existing Tailwind, CSS-Modules, or Styled-Components codebase.',
  mergeSteps: [
    {
      step: '01',
      title: 'Copy Portable Design System & Token Bundle',
      command:
        'cp -R src/design-system src/types public/ajbell-design-tokens.json <TARGET_REPO>/src/',
      detail:
        'Copies the self-contained token stylesheet, TypeScript definitions, W3C DTCG JSON token manifest, and all 7 reusable UI component modules.',
    },
    {
      step: '02',
      title: 'Import Root & Role Tokens Once at Application Entry',
      command: "import './design-system/tokens.css';",
      detail:
        'Registers :root Light Mode, html[data-theme="dark"] Obsidian Mode, Role-Level (--role-*) tokens, and 60fps keyframe animations globally without resetting host styles.',
    },
    {
      step: '03',
      title: 'Mount Connected Workflow Canvas or Individual Components',
      command:
        "import { ConnectedWorkflowCanvas } from './design-system/components/WorkflowCards';",
      detail:
        'Pass your domain data or connect to your existing Redux/Zustand/React-Query store via the StarterJourneyRecord interface.',
    },
    {
      step: '04',
      title: 'Sync Theme & Role Attributes with Host Auth/Theme Provider',
      command:
        'document.documentElement.dataset.theme = theme; document.documentElement.dataset.activeRole = role;',
      detail:
        'Automatically switches all surfaces, SVG splines, role badges, and the AJ Bell wordmark between Light and Dark mode in <1 frame.',
    },
  ],
} as const;
