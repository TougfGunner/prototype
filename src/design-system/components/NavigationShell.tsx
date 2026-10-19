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
import { WorkspaceScreenMode } from '../../state/useStarterStore';
import { NotchAvatarStrip } from './AvatarAndStatus';
import {
  AJBellWordmarkLogo,
  AJBellChimeMark,
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
}) => {
  const navItems: {
    id: string;
    label: string;
    screen?: WorkspaceScreenMode;
  }[] =
    labelMode === 'reference'
      ? [
          { id: 'rel', label: 'Relationship' },
          { id: 'opp', label: 'Opportunities', screen: 'pipelines' },
          { id: 'leads', label: 'Leads', screen: 'in_progress' },
          { id: 'cal', label: 'Calendar' },
          { id: 'cases', label: 'Cases', screen: 'journey' },
          { id: 'rep', label: 'Reports' },
          { id: 'quo', label: 'Quotes' },
        ]
      : [
          { id: 'rel', label: 'Relationship' },
          { id: 'opp', label: 'Role Pipelines', screen: 'pipelines' },
          { id: 'leads', label: 'Starters in Progress', screen: 'in_progress' },
          { id: 'cal', label: 'Inductions' },
          { id: 'cases', label: 'Cases · Journey', screen: 'journey' },
          { id: 'rep', label: 'Audit Log' },
          { id: 'quo', label: 'Entitlements' },
        ];

  return (
    <header
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        gap: '14px',
        padding: '4px 6px 12px 6px',
      }}
    >
      {/* Left Cluster: Official AJ Bell Redesigned Wordmark + Quiet Horizontal Navigation */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          minWidth: 0,
        }}
      >
        <button
          type="button"
          onClick={() => onSwitchScreen('journey')}
          title="AJ Bell — Feel good, investing (ajbell.co.uk Chime Rebrand)"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '9px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '3px 6px',
            borderRadius: '10px',
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
            }}
          >
            {labelMode === 'reference' ? 'sugarcrm' : 'ops·profiling'}
          </span>
        </button>

        <nav
          aria-label="Primary workspace navigation"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            flexWrap: 'wrap',
          }}
        >
          {navItems.map((item) => {
            const isSelected =
              !isGalleryActive &&
              ((item.screen && item.screen === screenMode) ||
                (!item.screen && false));

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.screen) {
                    onSwitchScreen(item.screen);
                  }
                }}
                aria-current={isSelected ? 'page' : undefined}
                style={{
                  padding: isSelected ? '7px 15px' : '6px 10px',
                  borderRadius: '999px',
                  border: 'none',
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
                    'background-color var(--motion-duration-fast) var(--motion-ease-out-quart), color var(--motion-duration-fast) var(--motion-ease-out-quart)',
                }}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Center Carved Top Notch: 8 Participant Avatars with Numeric / '+' Badges */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '360px',
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

      {/* Right Utility Cluster: Role Switcher, Label Mode, /gallery Link, Theme Toggle, Circular Icons & Operator Avatar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '7px',
          flexWrap: 'wrap',
        }}
      >
        {/* Demo Role Switcher */}
        <label
          title="Demonstration role switcher (non-security UI perspective control)"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '11.5px',
            color: 'var(--ajb-text-secondary)',
            background: 'var(--ajb-surface-card)',
            padding: '5px 11px',
            borderRadius: '999px',
            border: '1px solid var(--ajb-border-subtle)',
            boxShadow: 'var(--ajb-shadow-pill)',
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

        {/* Label Parity Switcher */}
        <button
          type="button"
          onClick={onToggleLabelMode}
          title="Toggle between AJ Bell New Starter Journey labels and 1:1 Reference image/video labels"
          style={{
            padding: '5px 11px',
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
          }}
        >
          {labelMode === 'reference' ? 'Labels: Reference 1:1' : 'Labels: Starter Journey'}
        </button>

        {/* Theme Switcher Pill */}
        {onToggleTheme && (
          <button
            type="button"
            onClick={onToggleTheme}
            data-testid="top-theme-toggle"
            aria-label="Switch Light or Dark Theme"
            title="Switch between Light Reference and AJ Bell Obsidian Dark Mode"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 11px',
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
            }}
          >
            {theme === 'dark' ? <Sun size={12.5} /> : <Moon size={12.5} />}
            <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
          </button>
        )}

        {/* Discoverable /gallery Route Pill */}
        <button
          type="button"
          onClick={onOpenGallery}
          aria-current={isGalleryActive ? 'page' : undefined}
          style={{
            padding: '5px 12px',
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
  activeDemoRole,
  onBackToPipelines,
}) => {
  const trailLabel =
    labelMode === 'reference'
      ? screenMode === 'journey'
        ? 'Cases · Customer Issue #CS-4092'
        : screenMode === 'pipelines'
          ? 'Opportunities · Case Pipelines'
          : 'Leads · Cases in Progress'
      : screenMode === 'journey'
        ? 'New Starter Profiling · Cohort Q4 (Synthetic Demo)'
        : screenMode === 'pipelines'
          ? 'Role Pipelines · Intake Queue'
          : 'Starters in Progress · Active Cohort';

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
      <span
        style={{
          fontSize: '11.5px',
          fontWeight: 600,
          padding: '3px 10px',
          borderRadius: '999px',
          background: 'var(--ajb-surface-control)',
          border: '1px solid var(--ajb-border-subtle)',
          color: 'var(--ajb-text-primary)',
        }}
      >
        Role Token: {activeDemoRole}
      </span>
    </div>
  );
};
