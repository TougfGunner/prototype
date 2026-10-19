import React, { useState } from 'react';
import {
  Bell,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Copy,
  Edit3,
  FileText,
  Mail,
  Moon,
  MoreVertical,
  Plus,
  Search,
  Settings,
  Share2,
  Sparkles,
  Sun,
  Trash2,
} from 'lucide-react';
import {
  DemoRoleView,
  LabelParityMode,
  NotchParticipant,
} from '../../data/syntheticStarters';
import { PalettePresetMode, WorkspaceScreenMode } from '../../state/useStarterStore';
import { NotchAvatarStrip } from './AvatarAndStatus';
import {
  AJBellWordmarkLogo,
  AJBellMottoPill,
} from './AJBellBrandAssets';

export interface TopNavigationBarProps {
  screenMode: WorkspaceScreenMode;
  labelMode: LabelParityMode;
  activeDemoRole: DemoRoleView;
  participants: NotchParticipant[];
  selectedParticipantId: string | null;
  onSelectParticipant: (id: string | null) => void;
  onSwitchScreen: (mode: WorkspaceScreenMode) => void;
  onToggleLabelMode: () => void;
  onChangeDemoRole: (role: DemoRoleView) => void;
  onOpenGallery: () => void;
  isGalleryActive?: boolean;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
  paletteMode?: PalettePresetMode;
  onChangePaletteMode?: (palette: PalettePresetMode) => void;
}

export const TopNavigationBar: React.FC<TopNavigationBarProps> = ({
  screenMode,
  labelMode,
  activeDemoRole,
  participants,
  selectedParticipantId,
  onSelectParticipant,
  onSwitchScreen,
  onToggleLabelMode,
  onChangeDemoRole,
  onOpenGallery,
  isGalleryActive = false,
  theme = 'light',
  onToggleTheme,
  paletteMode = 'chime-crimson',
  onChangePaletteMode,
}) => {
  const navItems: {
    id: string;
    label: string;
    screen: WorkspaceScreenMode;
    badgeCount: string;
    description: string;
  }[] =
    labelMode === 'reference'
      ? [
          {
            id: 'rel',
            label: 'Relationship',
            screen: 'relationship',
            badgeCount: '8',
            description: 'Participant & stakeholder ownership map',
          },
          {
            id: 'opp',
            label: 'Opportunities',
            screen: 'pipelines',
            badgeCount: '12',
            description: 'Multi-column stage intake pipelines',
          },
          {
            id: 'leads',
            label: 'Leads',
            screen: 'in_progress',
            badgeCount: '24',
            description: 'Active cohort progress cards & SLA metrics',
          },
          {
            id: 'cal',
            label: 'Calendar',
            screen: 'inductions',
            badgeCount: '6',
            description: 'Day-1 induction schedule & milestone readiness',
          },
          {
            id: 'cases',
            label: 'Cases',
            screen: 'journey',
            badgeCount: '4 Stages',
            description: 'Connected workflow cards, task rows & curved connectors',
          },
          {
            id: 'rep',
            label: 'Reports',
            screen: 'audit_log',
            badgeCount: '18',
            description: 'Operational audit log & compliance sign-off ledger',
          },
          {
            id: 'quo',
            label: 'Quotes',
            screen: 'entitlements',
            badgeCount: '9',
            description: 'System access packages, cost centres & clearance matrix',
          },
        ]
      : [
          {
            id: 'rel',
            label: 'Relationship',
            screen: 'relationship',
            badgeCount: '8',
            description: 'Sponsor, buddy, line manager & reviewer relationships',
          },
          {
            id: 'opp',
            label: 'Role Pipelines',
            screen: 'pipelines',
            badgeCount: '12',
            description: 'Role profiling & department intake pipelines',
          },
          {
            id: 'leads',
            label: 'Starters in Progress',
            screen: 'in_progress',
            badgeCount: '24',
            description: 'Active new starter cohort cards & onboarding SLA telemetry',
          },
          {
            id: 'cal',
            label: 'Inductions',
            screen: 'inductions',
            badgeCount: '6',
            description: 'Day-1 / Week-1 regulatory & platform induction schedule',
          },
          {
            id: 'cases',
            label: 'Cases · Journey',
            screen: 'journey',
            badgeCount: '4 Stages',
            description: 'Connected New Starter Journey workflow & Bezier connectors',
          },
          {
            id: 'rep',
            label: 'Audit Log',
            screen: 'audit_log',
            badgeCount: '18',
            description: 'SMCR / FCA approval trail & local draft mutation history',
          },
          {
            id: 'quo',
            label: 'Entitlements',
            screen: 'entitlements',
            badgeCount: '9',
            description: 'Custody, SIPP, Dealing & SWIFT system entitlement matrix',
          },
        ];

  const activeNavMeta =
    navItems.find((item) => item.screen === screenMode) || navItems[4];

  return (
    <header
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '2px 4px 10px 4px',
      }}
    >
      {/* TIER 1: Top Row aligned 1:1 with the Carved Center Notch (Brand + Role Left | 8 People Icons Center | Palette, Labels, Theme & Gallery Right) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          gap: '12px',
          minHeight: '46px',
        }}
      >
        {/* Left Brand, Motto & Role Switcher Cluster */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            minWidth: 0,
            flexWrap: 'nowrap',
          }}
        >
          <button
            type="button"
            onClick={() => onSwitchScreen('journey')}
            title="AJ Bell — Feel good, investing (ajbell.co.uk Chime Rebrand & Reference Operations v1)"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 6px',
              borderRadius: '10px',
              flexShrink: 0,
            }}
          >
            <AJBellWordmarkLogo height={23} variant="auto" />
            <span
              style={{
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '-0.01em',
                color: 'var(--ajb-text-primary)',
                paddingLeft: '7px',
                borderLeft: '1px solid var(--ajb-border-subtle)',
                whiteSpace: 'nowrap',
              }}
            >
              {labelMode === 'reference' ? 'sugarcrm' : 'ops·profiling'}
            </span>
          </button>

          <div style={{ flexShrink: 0 }}>
            <AJBellMottoPill compact />
          </div>

          {/* Demo Role Switcher (Placed on Left to balance Center Notch) */}
          <label
            title="Demonstration role switcher (non-security UI perspective control)"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '11.5px',
              color: 'var(--ajb-text-secondary)',
              background: 'var(--ajb-surface-card)',
              padding: '4px 9px',
              borderRadius: '999px',
              border: '1px solid var(--ajb-border-subtle)',
              boxShadow: 'var(--ajb-shadow-pill)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            <span style={{ fontWeight: 700, color: 'var(--ajb-accent-periwinkle)' }}>Role:</span>
            <select
              aria-label="Demonstration role switcher"
              value={activeDemoRole}
              onChange={(e) => onChangeDemoRole(e.target.value as DemoRoleView)}
              style={{
                border: 'none',
                background: 'transparent',
                fontSize: '11.5px',
                fontWeight: 700,
                color: 'var(--ajb-text-primary)',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              <option value="Operations Coordinator">Operations Coordinator</option>
              <option value="Hiring Manager">Hiring Manager</option>
              <option value="Identity & Access Lead">Identity & Access Lead</option>
              <option value="Compliance Reviewer">Compliance Reviewer</option>
            </select>
          </label>
        </div>

        {/* Center Carved Top Notch: 8 Participant People Icons with Numeric / '+' Badges */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '376px',
            padding: '0 4px',
          }}
        >
          <NotchAvatarStrip
            participants={participants}
            selectedParticipantId={selectedParticipantId}
            onSelectParticipant={(id) =>
              onSelectParticipant(selectedParticipantId === id ? null : id)
            }
            labelMode={labelMode}
          />
        </div>

        {/* Right Utility Cluster: Perfectly Aligned Single-Row Controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '6px',
            flexWrap: 'nowrap',
            minWidth: 0,
          }}
        >
          {/* Label Parity Switcher */}
          <button
            type="button"
            onClick={onToggleLabelMode}
            title="Toggle between AJ Bell New Starter Journey labels and 1:1 Reference image/video labels"
            style={{
              padding: '4px 9px',
              borderRadius: '999px',
              border: '1px solid var(--ajb-border-subtle)',
              background:
                labelMode === 'reference'
                  ? 'var(--ref-accent-blue-soft)'
                  : 'var(--ajb-surface-card)',
              color: 'var(--ajb-text-primary)',
              fontSize: '11.5px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: 'var(--ajb-shadow-pill)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {labelMode === 'reference' ? 'Labels: Ref 1:1' : 'Labels: Journey'}
          </button>

          {/* Theme Switcher Pill */}
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              data-testid="top-theme-toggle"
              aria-label="Switch Light or Dark Theme"
              title="Switch between Light Mode and Dark Mode"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 9px',
                borderRadius: '999px',
                border: '1px solid var(--ajb-border-subtle)',
                background:
                  theme === 'dark'
                    ? 'var(--ajb-surface-selected-gradient)'
                    : 'var(--ajb-surface-card)',
                color:
                  theme === 'dark'
                    ? 'var(--ref-text-on-selected)'
                    : 'var(--ajb-text-primary)',
                fontSize: '11.5px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: 'var(--ajb-shadow-pill)',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {theme === 'dark' ? <Sun size={12.5} /> : <Moon size={12.5} />}
              <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
            </button>
          )}

          {/* Discoverable /gallery Route Pill */}
          <button
            type="button"
            data-testid="open-gallery-route"
            onClick={onOpenGallery}
            aria-current={isGalleryActive ? 'page' : undefined}
            style={{
              padding: '4px 9px',
              borderRadius: '999px',
              border: '1px solid var(--ajb-border-subtle)',
              background: isGalleryActive
                ? 'var(--ajb-surface-selected-gradient)'
                : 'var(--ajb-surface-card)',
              color: isGalleryActive
                ? 'var(--ref-text-on-selected)'
                : 'var(--ajb-text-primary)',
              fontSize: '11.5px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: 'var(--ajb-shadow-pill)',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            /gallery
          </button>

          {/* Reference Right-Side Circular Icon Cluster */}
          {[
            { Icon: Search, label: 'Search records' },
            { Icon: Mail, label: 'Notifications inbox' },
            { Icon: Bell, label: 'Workflow alerts' },
            { Icon: Settings, label: 'Workspace preferences' },
          ].map(({ Icon, label }) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                border: '1px solid var(--ajb-border-subtle)',
                background: 'var(--ajb-surface-card)',
                color: 'var(--ajb-text-secondary)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: 'var(--ajb-shadow-pill)',
                flexShrink: 0,
              }}
            >
              <Icon size={13.5} strokeWidth={1.85} />
            </button>
          ))}

          {/* Top-Right Operator Avatar */}
          <span
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid var(--ajb-surface-elevated)',
              boxShadow: '0 2px 6px rgba(0,0,0,0.14)',
              display: 'inline-block',
              flexShrink: 0,
            }}
          >
            <img
              src="/avatars/avatar-3.png"
              alt="Signed-in operator avatar"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </span>
        </div>
      </div>

      {/* TIER 2: Full-Width Aligned Primary Navigation Tab Bar (All 7 Operational Views) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          padding: '6px 12px',
          borderRadius: '16px',
          background: 'var(--ajb-surface-panel)',
          border: '1px solid var(--ajb-border-subtle)',
          boxShadow: 'var(--ajb-shadow-card)',
        }}
      >
        <nav
          aria-label="Primary workspace navigation"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            flexWrap: 'nowrap',
            overflowX: 'auto',
          }}
        >
          {navItems.map((item) => {
            const isSelected = !isGalleryActive && item.screen === screenMode;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSwitchScreen(item.screen)}
                title={item.description}
                aria-current={isSelected ? 'page' : undefined}
                data-testid={`nav-tab-${item.screen}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: isSelected ? '6px 12px' : '5px 10px',
                  borderRadius: '999px',
                  border: isSelected
                    ? '1px solid var(--ajb-border-glass)'
                    : '1px solid transparent',
                  background: isSelected
                    ? 'var(--ajb-surface-selected-gradient)'
                    : 'transparent',
                  color: isSelected
                    ? 'var(--ref-text-on-selected)'
                    : 'var(--ajb-text-secondary)',
                  fontSize: '12.5px',
                  fontWeight: isSelected ? 700 : 600,
                  cursor: 'pointer',
                  boxShadow: isSelected ? 'var(--ajb-shadow-pill)' : 'none',
                  transition:
                    'all var(--motion-duration-fast) var(--motion-ease-out-quart)',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                <span>{item.label}</span>
                <span
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 700,
                    padding: '1px 6px',
                    borderRadius: '999px',
                    background: isSelected
                      ? 'rgba(255, 255, 255, 0.22)'
                      : 'var(--ajb-surface-control)',
                    color: isSelected
                      ? 'var(--ref-text-on-selected)'
                      : 'var(--ajb-text-muted)',
                  }}
                >
                  {item.badgeCount}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Active Tab Operational Context Indicator + Preserved Palette Switcher */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '11.5px',
            color: 'var(--ajb-text-muted)',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: 'var(--ajb-accent-periwinkle)',
                display: 'inline-block',
              }}
            />
            <span
              style={{
                fontWeight: 600,
                color: 'var(--ajb-text-secondary)',
                maxWidth: '250px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {activeNavMeta.description}
            </span>
          </span>

          {onChangePaletteMode && (
            <label
              title="Switch between preserved colour palettes (Light-Blue Reference, AJ Bell Chime + Light-Blue Dark, or AJ Bell Chime Crimson-Burgundy)"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '11.5px',
                color: 'var(--ajb-text-secondary)',
                background: 'var(--ajb-surface-card)',
                padding: '4px 10px',
                borderRadius: '999px',
                border: '1px solid var(--ajb-border-subtle)',
                boxShadow: 'var(--ajb-shadow-pill)',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              <span style={{ fontWeight: 700, color: 'var(--ajb-accent-coral)' }}>Palette:</span>
              <select
                aria-label="Colour palette reference preset"
                data-testid="top-palette-select"
                value={paletteMode}
                onChange={(e) => onChangePaletteMode(e.target.value as PalettePresetMode)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  color: 'var(--ajb-text-primary)',
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                <option value="chime-crimson">Crimson (Red)</option>
                <option value="light-blue">Blue · Slate-Navy</option>
                <option value="chime-blue-dark">Chime + Blue Dark</option>
              </select>
            </label>
          )}
        </div>
      </div>
    </header>
  );
};

export interface SlimNavigationRailProps {
  screenMode: WorkspaceScreenMode;
  onSwitchScreen: (mode: WorkspaceScreenMode) => void;
  onOpenNewStarterModal: () => void;
  onOpenGallery: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const SlimNavigationRail: React.FC<SlimNavigationRailProps> = ({
  screenMode,
  onSwitchScreen,
  onOpenNewStarterModal,
  onOpenGallery,
  theme: externalTheme,
  onToggleTheme: externalToggleTheme,
}) => {
  const [localTheme, setLocalTheme] = useState<'light' | 'dark'>(() => {
    return document.documentElement.getAttribute('data-theme') === 'dark'
      ? 'dark'
      : 'light';
  });

  const activeTheme = externalTheme ?? localTheme;

  const handleToggleTheme = () => {
    if (externalToggleTheme) {
      externalToggleTheme();
      return;
    }
    const next = activeTheme === 'light' ? 'dark' : 'light';
    setLocalTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const railButtons = [
    {
      Icon: Plus,
      label: 'Create new starter or case',
      onClick: onOpenNewStarterModal,
      active: false,
    },
    {
      Icon: Share2,
      label: 'Connected New Starter Journey',
      onClick: () => onSwitchScreen('journey'),
      active: screenMode === 'journey',
    },
    {
      Icon: Edit3,
      label: 'Role Pipelines view',
      onClick: () => onSwitchScreen('pipelines'),
      active: screenMode === 'pipelines',
    },
    {
      Icon: Sparkles,
      label: 'Starters in Progress grid',
      onClick: () => onSwitchScreen('in_progress'),
      active: screenMode === 'in_progress',
    },
    {
      Icon: Copy,
      label: 'Open Reference Operations v1 Gallery (/gallery)',
      onClick: onOpenGallery,
      active: false,
    },
    {
      Icon: FileText,
      label: 'Edit current stage form',
      onClick: onOpenNewStarterModal,
      active: false,
    },
    {
      Icon: Bookmark,
      label: 'Bookmark starter cohort',
      onClick: () => onSwitchScreen('in_progress'),
      active: false,
    },
    {
      Icon: Trash2,
      label: 'Review blocked items',
      onClick: () => onSwitchScreen('journey'),
      active: false,
    },
    {
      Icon: MoreVertical,
      label: 'More rail tools',
      onClick: onOpenGallery,
      active: false,
    },
  ];

  return (
    <aside
      aria-label="Slim tool rail"
      style={{
        width: '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '4px 0',
        flexShrink: 0,
      }}
    >
      {/* Top Collapse/Expand Chevron */}
      <button
        type="button"
        onClick={() =>
          onSwitchScreen(screenMode === 'journey' ? 'pipelines' : 'journey')
        }
        aria-label="Cycle workspace view"
        style={{
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          border: '1px solid var(--ajb-border-subtle)',
          background: 'var(--ajb-surface-card)',
          color: 'var(--ajb-text-secondary)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: 'var(--ajb-shadow-card)',
        }}
      >
        <ChevronRight size={14} />
      </button>

      {/* Center Vertical Action Stack */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '7px',
          padding: '8px 5px',
          borderRadius: '999px',
          background: 'var(--ajb-surface-toolbar)',
          border: '1px solid var(--ajb-border-glass)',
          boxShadow: 'var(--ajb-shadow-card)',
        }}
      >
        {railButtons.map(({ Icon, label, onClick, active }) => (
          <button
            key={label}
            type="button"
            aria-label={label}
            title={label}
            onClick={onClick}
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              border: active ? '1px solid var(--ajb-surface-selected)' : 'none',
              background: active
                ? 'var(--ajb-surface-selected-gradient)'
                : 'var(--ajb-surface-card)',
              color: active
                ? 'var(--ref-text-on-selected)'
                : 'var(--ajb-text-secondary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'var(--ajb-shadow-card)',
              transition: 'all 150ms ease',
            }}
          >
            <Icon size={13} strokeWidth={1.85} />
          </button>
        ))}
      </div>

      {/* Bottom Burgundy Moon/Sun Button (Matches Bottom-Left of Reference Image) */}
      <button
        type="button"
        onClick={handleToggleTheme}
        data-testid="rail-theme-toggle"
        aria-label="Toggle light reference or dark adaptation theme"
        title="Toggle Light Reference / Dark Adaptation"
        style={{
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          border: '1px solid var(--ajb-border-glass)',
          background: 'var(--ajb-surface-selected-gradient)',
          color: 'var(--ref-text-on-selected)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.24)',
        }}
      >
        {activeTheme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
      </button>
    </aside>
  );
};

export interface SubHeaderBreadcrumbProps {
  screenMode: WorkspaceScreenMode;
  labelMode: LabelParityMode;
  activeDemoRole: DemoRoleView;
  onBackToPipelines: () => void;
}

export const SubHeaderBreadcrumb: React.FC<SubHeaderBreadcrumbProps> = ({
  screenMode,
  labelMode,
  activeDemoRole: _activeDemoRole,
  onBackToPipelines,
}) => {
  const trailLabel =
    labelMode === 'reference'
      ? screenMode === 'journey'
        ? 'Cases · Customer Issue #CS-4092'
        : screenMode === 'pipelines'
          ? 'Opportunities · Case Pipelines'
          : screenMode === 'in_progress'
            ? 'Leads · Cases in Progress'
            : screenMode === 'relationship'
              ? 'Relationship · Stakeholder & Reviewer Graph'
              : screenMode === 'inductions'
                ? 'Calendar · Scheduled Inductions & Day-1 Sessions'
                : screenMode === 'audit_log'
                  ? 'Reports · Immutable Operational Audit Log'
                  : 'Quotes · Role Entitlements & Access Matrix'
      : screenMode === 'journey'
        ? 'Cases · Journey · New Starter Profiling Cohort Q4 (Synthetic Demo)'
        : screenMode === 'pipelines'
          ? 'Role Pipelines · Intake & Approval Queue'
          : screenMode === 'in_progress'
            ? 'Starters in Progress · Active Cohort'
            : screenMode === 'relationship'
              ? 'Relationship · Reviewer Ownership & Reporting Lines'
              : screenMode === 'inductions'
                ? 'Inductions · Day-1 IT & Compliance Schedule'
                : screenMode === 'audit_log'
                  ? 'Audit Log · SMCR & Entitlement Sign-off Ledger'
                  : 'Entitlements · Role Access Bundles & Provisioning';

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      <button
        type="button"
        onClick={onBackToPipelines}
        aria-label="Previous workspace view"
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          border: '1px solid var(--ajb-border-subtle)',
          background: 'var(--ajb-surface-card)',
          color: 'var(--ajb-text-secondary)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: 'var(--ajb-shadow-card)',
        }}
      >
        <ChevronLeft size={14.5} />
      </button>
      <span
        style={{
          fontSize: '12.5px',
          fontWeight: 600,
          color: 'var(--ajb-text-secondary)',
        }}
      >
        {trailLabel}
      </span>
    </div>
  );
};
