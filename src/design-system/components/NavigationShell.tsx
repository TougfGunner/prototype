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
        gap: '12px',
        padding: '2px 4px 10px 4px',
      }}
    >
      {/* Left Cluster: Official AJ Bell Redesigned Wordmark + Quiet Horizontal Navigation */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
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
            gap: '8px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '2px 4px',
            borderRadius: '8px',
          }}
        >
          <AJBellWordmarkLogo height={20} variant="crimson" />
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '-0.01em',
              color: 'var(--ref-surface-selected)',
              paddingLeft: '6px',
              borderLeft: '1px solid var(--ref-border-subtle)',
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
            gap: '2px',
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
                  padding: isSelected ? '6px 13px' : '5px 8px',
                  borderRadius: '999px',
                  border: 'none',
                  background: isSelected
                    ? 'var(--ref-surface-selected)'
                    : 'transparent',
                  color: isSelected
                    ? 'var(--ref-text-on-selected)'
                    : 'var(--ref-text-secondary)',
                  fontSize: '11px',
                  fontWeight: isSelected ? 600 : 500,
                  cursor: 'pointer',
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
          minWidth: '350px',
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

      {/* Right Utility Cluster: Role Switcher, Label Mode, /gallery Link, Circular Icons & Operator Avatar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '6px',
          flexWrap: 'wrap',
        }}
      >
        {/* Demo Role Switcher */}
        <label
          title="Demonstration role switcher (non-security UI perspective control)"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '10px',
            color: 'var(--ref-text-secondary)',
            background: 'var(--ref-surface-card)',
            padding: '4px 9px',
            borderRadius: '999px',
            border: '1px solid var(--ref-border-subtle)',
          }}
        >
          <span style={{ fontWeight: 600 }}>Role:</span>
          <select
            aria-label="Demonstration role switcher"
            value={activeDemoRole}
            onChange={(e) => onChangeDemoRole(e.target.value as DemoRoleView)}
            style={{
              border: 'none',
              background: 'transparent',
              fontSize: '10px',
              fontWeight: 600,
              color: 'var(--ref-text-primary)',
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
            padding: '4px 9px',
            borderRadius: '999px',
            border: '1px solid var(--ref-border-subtle)',
            background:
              labelMode === 'reference'
                ? 'var(--ref-accent-blue-soft)'
                : 'var(--ref-surface-card)',
            color: 'var(--ref-text-primary)',
            fontSize: '10px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          {labelMode === 'reference' ? 'Labels: Reference 1:1' : 'Labels: Starter Journey'}
        </button>

        {/* Discoverable /gallery Route Pill */}
        <button
          type="button"
          onClick={onOpenGallery}
          aria-current={isGalleryActive ? 'page' : undefined}
          style={{
            padding: '4px 10px',
            borderRadius: '999px',
            border: '1px solid var(--ref-border-subtle)',
            background: isGalleryActive
              ? 'var(--ref-surface-selected)'
              : 'var(--ref-surface-card)',
            color: isGalleryActive
              ? 'var(--ref-text-on-selected)'
              : 'var(--ref-text-primary)',
            fontSize: '10px',
            fontWeight: 600,
            cursor: 'pointer',
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
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              border: '1px solid var(--ref-border-subtle)',
              background: 'var(--ref-surface-card)',
              color: 'var(--ref-text-secondary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Icon size={12.5} strokeWidth={1.8} />
          </button>
        ))}

        {/* Top-Right Operator Avatar */}
        <span
          style={{
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '2px solid var(--ref-surface-card)',
            boxShadow: '0 2px 5px rgba(0,0,0,0.08)',
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
}

export const SlimNavigationRail: React.FC<SlimNavigationRailProps> = ({
  screenMode,
  onSwitchScreen,
  onOpenNewStarterModal,
  onOpenGallery,
}) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return document.documentElement.getAttribute('data-theme') === 'dark'
      ? 'dark'
      : 'light';
  });

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('ajb-theme', next);
    } catch {
      // ignore storage errors
    }
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
        width: '38px',
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
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          border: '1px solid var(--ref-border-subtle)',
          background: 'var(--ref-surface-card)',
          color: 'var(--ref-text-secondary)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: 'var(--ref-shadow-card)',
        }}
      >
        <ChevronRight size={13} />
      </button>

      {/* Center Vertical Action Stack */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '7px',
          padding: '8px 4px',
          borderRadius: '999px',
          background: 'rgba(255, 255, 255, 0.45)',
          border: '1px solid var(--ref-border-hairline)',
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
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              border: active ? '1px solid var(--ref-surface-selected)' : 'none',
              background: active
                ? 'var(--ref-surface-selected)'
                : 'var(--ref-surface-card)',
              color: active
                ? 'var(--ref-text-on-selected)'
                : 'var(--ref-text-secondary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'var(--ref-shadow-card)',
              transition: 'all 150ms ease',
            }}
          >
            <Icon size={12} strokeWidth={1.8} />
          </button>
        ))}
      </div>

      {/* Bottom Black Moon/Sun Button (Matches Bottom-Left of Reference Image) */}
      <button
        type="button"
        onClick={toggleTheme}
        aria-label="Toggle light reference or dark adaptation theme"
        title="Toggle Light Reference / Dark Adaptation"
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          border: 'none',
          background: 'var(--ref-surface-selected)',
          color: 'var(--ref-text-on-selected)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.18)',
        }}
      >
        {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
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
          width: '26px',
          height: '26px',
          borderRadius: '50%',
          border: '1px solid var(--ref-border-subtle)',
          background: 'var(--ref-surface-card)',
          color: 'var(--ref-text-secondary)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: 'var(--ref-shadow-card)',
        }}
      >
        <ChevronLeft size={14} />
      </button>
      <span
        style={{
          fontSize: '11px',
          fontWeight: 500,
          color: 'var(--ref-text-secondary)',
        }}
      >
        {trailLabel}
      </span>
      <span
        style={{
          fontSize: '10px',
          padding: '2px 8px',
          borderRadius: '999px',
          background: 'rgba(255, 255, 255, 0.66)',
          border: '1px solid var(--ref-border-subtle)',
          color: 'var(--ref-text-muted)',
        }}
      >
        View: {activeDemoRole}
      </span>
    </div>
  );
};
