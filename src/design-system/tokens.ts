/**
 * Reference Operations v1 — Versioned Design System Tokens
 * Derived from straight-on reference frames (f=0000, f=0145, f=0380, f=0680, f=0909)
 * and empirical motion measurements in analysis/motion-timeline.json.
 */

export const DESIGN_SYSTEM_VERSION = {
  name: 'Reference Operations v1',
  version: '1.0.0',
  baselineTheme: 'light',
  adaptationTheme: 'dark',
  sourceReference: '93f37755fd19926a8a827c5719a7c7e2.mp4 + reference_image_uploaded.webp',
} as const;

export interface TokenEntry {
  name: string;
  cssVar: string;
  lightValue: string;
  darkValue?: string;
  category: 'color' | 'typography' | 'spacing' | 'radius' | 'elevation' | 'motion';
  description: string;
}

export const DESIGN_TOKENS: TokenEntry[] = [
  // Colour Tokens
  {
    name: 'Canvas Outer Background',
    cssVar: '--ref-bg-canvas',
    lightValue: '#E5E7EC',
    darkValue: '#111318',
    category: 'color',
    description: 'Soft silver-grey outer application canvas measured at f=0680.',
  },
  {
    name: 'Canvas Radial Periwinkle Wash',
    cssVar: '--ref-bg-ambient-wash',
    lightValue: 'rgba(155, 178, 232, 0.28)',
    darkValue: 'rgba(84, 112, 184, 0.16)',
    category: 'color',
    description: 'Subtle cool radial mesh wash beneath the translucent workspace shell.',
  },
  {
    name: 'Notched Workspace Shell Surface',
    cssVar: '--ref-surface-workspace',
    lightValue: 'rgba(241, 243, 247, 0.78)',
    darkValue: 'rgba(24, 27, 34, 0.84)',
    category: 'color',
    description: 'Frosted floating workspace container with carved top-center notch.',
  },
  {
    name: 'Stage Column Container Surface',
    cssVar: '--ref-surface-stage',
    lightValue: 'rgba(248, 249, 252, 0.88)',
    darkValue: 'rgba(31, 35, 44, 0.90)',
    category: 'color',
    description: 'Pale floating workflow stage container and bottom split panel surface.',
  },
  {
    name: 'Card & Task Row Surface',
    cssVar: '--ref-surface-card',
    lightValue: '#FFFFFF',
    darkValue: '#262B36',
    category: 'color',
    description: 'Crisp white task row pill, allocation card, and modal input field surface.',
  },
  {
    name: 'Selected / Active Carbon State',
    cssVar: '--ref-surface-selected',
    lightValue: '#0D0D0F',
    darkValue: '#F3F5F8',
    category: 'color',
    description: 'Signature solid carbon-black active pill, tile, and primary button state.',
  },
  {
    name: 'Selected Foreground Text',
    cssVar: '--ref-text-on-selected',
    lightValue: '#FFFFFF',
    darkValue: '#0D0D0F',
    category: 'color',
    description: 'High-contrast label colour inside black selected pills and tiles.',
  },
  {
    name: 'Primary Ink Text',
    cssVar: '--ref-text-primary',
    lightValue: '#17181C',
    darkValue: '#F1F3F7',
    category: 'color',
    description: 'Primary heading, active task row, and control label colour.',
  },
  {
    name: 'Secondary / Muted Text',
    cssVar: '--ref-text-secondary',
    lightValue: '#6E7381',
    darkValue: '#9BA2B2',
    category: 'color',
    description: 'Quiet horizontal navigation, subtitles, and table metadata text.',
  },
  {
    name: 'Unassigned / Pending Task Text',
    cssVar: '--ref-text-muted',
    lightValue: '#9AA0AE',
    darkValue: '#6B7282',
    category: 'color',
    description: 'Subdued label colour for unassigned workflow tasks prior to avatar drop.',
  },
  {
    name: 'Accent Periwinkle Blue',
    cssVar: '--ref-accent-blue',
    lightValue: '#8FA8E0',
    darkValue: '#7B99DC',
    category: 'color',
    description: 'Restrained pastel blue for executed connectors, sliders, and gauges.',
  },
  {
    name: 'Accent Coral Rose',
    cssVar: '--ref-accent-coral',
    lightValue: '#D96B70',
    darkValue: '#E0757A',
    category: 'color',
    description: 'Restrained pastel coral for dashed pending connectors, badges, and active rings.',
  },
  {
    name: 'Accent Warm Amber',
    cssVar: '--ref-accent-amber',
    lightValue: '#F2D06B',
    darkValue: '#E5C358',
    category: 'color',
    description: 'Restrained warm yellow for tertiary metrics and scheduled highlights.',
  },
  {
    name: 'Fine Hairline Border',
    cssVar: '--ref-border-hairline',
    lightValue: 'rgba(255, 255, 255, 0.82)',
    darkValue: 'rgba(255, 255, 255, 0.09)',
    category: 'color',
    description: '1px luminous border around floating stage panels and modals.',
  },
  {
    name: 'Subtle Divider Border',
    cssVar: '--ref-border-subtle',
    lightValue: 'rgba(23, 24, 28, 0.07)',
    darkValue: 'rgba(255, 255, 255, 0.08)',
    category: 'color',
    description: 'Quiet divider line for table rows, ports, and input outlines.',
  },

  // Typography Tokens
  {
    name: 'Primary Sans Font Family',
    cssVar: '--ref-font-sans',
    lightValue: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    category: 'typography',
    description: 'Compact geometric grotesk typeface with tabular numeric support.',
  },
  {
    name: 'View Title Size',
    cssVar: '--ref-text-title',
    lightValue: '1.375rem',
    category: 'typography',
    description: '22px bold screen header (e.g. Customer Journeys / New Starter Journey).',
  },
  {
    name: 'Panel Header Size',
    cssVar: '--ref-text-panel',
    lightValue: '0.84375rem',
    category: 'typography',
    description: '13.5px semi-bold panel, modal, and stage header typography.',
  },
  {
    name: 'Compact Task Label Size',
    cssVar: '--ref-text-body-sm',
    lightValue: '0.71875rem',
    category: 'typography',
    description: '11.5px compact task card and table cell label size.',
  },
  {
    name: 'Micro Counter & Badge Size',
    cssVar: '--ref-text-micro',
    lightValue: '0.625rem',
    category: 'typography',
    description: '10px micro badge counter and port metadata.',
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
    name: 'Space SM (8px)',
    cssVar: '--ref-space-2',
    lightValue: '8px',
    category: 'spacing',
    description: 'Vertical gap between compact workflow task rows.',
  },
  {
    name: 'Space MD (14px)',
    cssVar: '--ref-space-3',
    lightValue: '14px',
    category: 'spacing',
    description: 'Internal padding of floating stage containers.',
  },
  {
    name: 'Space LG (22px)',
    cssVar: '--ref-space-4',
    lightValue: '22px',
    category: 'spacing',
    description: 'Horizontal gutter between connected workflow stage columns (for SVG bezier routing).',
  },

  // Radius Tokens
  {
    name: 'Workspace Outer Radius',
    cssVar: '--ref-radius-workspace',
    lightValue: '28px',
    category: 'radius',
    description: 'Generous outer corner radius for the notched workspace shell and modals.',
  },
  {
    name: 'Stage Panel Radius',
    cssVar: '--ref-radius-stage',
    lightValue: '26px',
    category: 'radius',
    description: 'Rounded container radius for the 4 workflow stage panels and bottom cards.',
  },
  {
    name: 'Task Card & Tile Radius',
    cssVar: '--ref-radius-card',
    lightValue: '18px',
    category: 'radius',
    description: 'Rounded square/pill radius for allocation cards and 2x3 New Tasks tiles.',
  },
  {
    name: 'Pill Control Radius',
    cssVar: '--ref-radius-pill',
    lightValue: '9999px',
    category: 'radius',
    description: 'Full capsule radius for navigation tabs, status badges, and slider tracks.',
  },

  // Elevation Tokens
  {
    name: 'Restrained Floating Panel Shadow',
    cssVar: '--ref-shadow-panel',
    lightValue: '0 8px 24px -4px rgba(20, 25, 38, 0.04), 0 2px 6px -1px rgba(20, 25, 38, 0.02)',
    darkValue: '0 10px 28px -4px rgba(0, 0, 0, 0.38)',
    category: 'elevation',
    description: 'Soft ambient shadow beneath workflow stage columns.',
  },
  {
    name: 'Task Row Micro Shadow',
    cssVar: '--ref-shadow-card',
    lightValue: '0 2px 8px rgba(18, 22, 33, 0.035)',
    darkValue: '0 2px 8px rgba(0, 0, 0, 0.28)',
    category: 'elevation',
    description: 'Restrained lift for white task pills inside stage columns.',
  },
  {
    name: 'Modal Overlay Shadow',
    cssVar: '--ref-shadow-modal',
    lightValue: '0 24px 60px -12px rgba(15, 20, 32, 0.16), 0 4px 16px rgba(15, 20, 32, 0.06)',
    darkValue: '0 24px 60px -12px rgba(0, 0, 0, 0.65)',
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
    description: 'Measured 16-frame (266.7ms) black tile selection inversion (f=0906..0922).',
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
  color: {
    light: {
      canvasOuter: '#E5E7EC',
      surfaceCard: '#FFFFFF',
      accentBlack: '#0D0D0F',
      accentPeriwinkle: '#8FA8E0',
      accentCoral: '#D96B70',
      statusExecuted: '#8FA8E0',
      statusScheduled: '#9AA0AE',
    },
    dark: {
      canvasOuter: '#111318',
      surfaceCard: '#252A35',
      accentBlack: '#F3F5F8',
      accentPeriwinkle: '#7B99DC',
      accentCoral: '#E0757A',
      statusExecuted: '#7B99DC',
      statusScheduled: '#697082',
    },
  },
  radius: {
    shellOuter: '38px',
    notch: '32px',
    stageCard: '22px',
    taskRow: '16px',
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

