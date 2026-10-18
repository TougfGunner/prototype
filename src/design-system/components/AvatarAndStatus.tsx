import React from 'react';
import { NotchParticipant, WorkflowStatus } from '../../data/syntheticStarters';

export interface NotchAvatarStripProps {
  participants: NotchParticipant[];
  selectedParticipantId: string | null;
  onSelectParticipant: (id: string) => void;
  onDragStartParticipant?: (id: string) => void;
  labelMode?: 'operations' | 'reference';
}

export const NotchAvatarStrip: React.FC<NotchAvatarStripProps> = ({
  participants,
  selectedParticipantId,
  onSelectParticipant,
  onDragStartParticipant,
  labelMode = 'operations',
}) => {
  return (
    <div
      role="toolbar"
      aria-label="Starter and reviewer participants"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        padding: '4px 18px 8px',
      }}
    >
      {participants.map((p, index) => {
        const isSelected = selectedParticipantId === p.id;
        const displayName = labelMode === 'reference' ? p.referenceName : p.name;
        const badgeBg =
          p.badgeTone === 'blue'
            ? 'var(--ref-accent-blue)'
            : p.badgeTone === 'coral'
              ? 'var(--ref-accent-coral)'
              : 'var(--ref-surface-card)';
        const badgeColor = p.badgeTone === 'plus' ? 'var(--ref-text-primary)' : '#ffffff';

        return (
          <button
            key={p.id}
            type="button"
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', p.id);
              onDragStartParticipant?.(p.id);
            }}
            onClick={() => onSelectParticipant(p.id)}
            title={`${displayName} — ${p.roleTitle} (Click to highlight journey or drag to + slot)`}
            aria-pressed={isSelected}
            style={{
              position: 'relative',
              width: '36px',
              height: '42px',
              border: 'none',
              background: 'transparent',
              cursor: 'grab',
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              animation: `refAvatarPop var(--motion-duration-modal) var(--motion-ease-spring) both`,
              animationDelay: `calc(${index} * var(--motion-duration-stagger))`,
              transform: isSelected ? 'translateY(-2px) scale(1.06)' : 'none',
              transition:
                'transform var(--motion-duration-fast) var(--motion-ease-out-quart)',
            }}
          >
            <span
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: isSelected
                  ? '2px solid var(--ref-surface-selected)'
                  : '2px solid var(--ref-surface-card)',
                boxShadow: isSelected
                  ? '0 0 0 2px var(--ref-accent-blue)'
                  : '0 2px 6px rgba(0,0,0,0.08)',
                display: 'block',
                background: '#fff',
              }}
            >
              <img
                src={p.avatarUrl}
                alt={displayName}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </span>
            <span
              className="tabular-nums"
              style={{
                position: 'absolute',
                bottom: '0px',
                minWidth: '16px',
                height: '13px',
                padding: '0 4px',
                borderRadius: '999px',
                background: badgeBg,
                color: badgeColor,
                fontSize: '9px',
                fontWeight: 700,
                lineHeight: '13px',
                textAlign: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                border: '1px solid rgba(255,255,255,0.75)',
              }}
            >
              {p.badgeCount !== null ? p.badgeCount : '+'}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export interface OverlappingAvatarItem {
  url: string;
  badge?: number;
  tone?: 'blue' | 'coral' | 'amber';
}

export interface OverlappingAvatarClusterProps {
  avatars?: string[];
  items?: OverlappingAvatarItem[];
  extraCount?: number;
  size?: number;
}

export const OverlappingAvatarCluster: React.FC<OverlappingAvatarClusterProps> = ({
  avatars,
  items,
  extraCount,
  size = 30,
}) => {
  const normalized: OverlappingAvatarItem[] =
    items ?? (avatars ? avatars.map((url) => ({ url })) : []);

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {normalized.map((item, idx) => {
        const badgeBg =
          item.tone === 'coral'
            ? 'var(--ref-accent-coral)'
            : item.tone === 'amber'
              ? 'var(--ref-accent-amber)'
              : 'var(--ref-accent-blue)';

        return (
          <span
            key={`${item.url}-${idx}`}
            style={{
              position: 'relative',
              width: `${size}px`,
              height: `${size}px`,
              marginLeft: idx === 0 ? 0 : '-8px',
              display: 'inline-block',
              flexShrink: 0,
            }}
          >
            <span
              style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid var(--ref-surface-card)',
                background: '#fff',
                boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                display: 'block',
              }}
            >
              <img
                src={item.url}
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </span>
            {item.badge !== undefined && (
              <span
                className="tabular-nums"
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  minWidth: '14px',
                  height: '13px',
                  padding: '0 3px',
                  borderRadius: '999px',
                  background: badgeBg,
                  color: '#ffffff',
                  fontSize: '8.5px',
                  fontWeight: 700,
                  lineHeight: '13px',
                  textAlign: 'center',
                  border: '1px solid #ffffff',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.14)',
                }}
              >
                {item.badge}
              </span>
            )}
          </span>
        );
      })}
      {extraCount && extraCount > 0 ? (
        <span
          className="tabular-nums"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: '50%',
            border: '2px solid var(--ref-surface-card)',
            marginLeft: '-8px',
            background: 'var(--ref-surface-stage)',
            color: 'var(--ref-text-primary)',
            fontSize: '10px',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          }}
        >
          +{extraCount}
        </span>
      ) : null}
    </div>
  );
};

export interface StatusPillBadgeProps {
  status: WorkflowStatus;
}

export const StatusPillBadge: React.FC<StatusPillBadgeProps> = ({ status }) => {
  const stylesByStatus: Record<
    WorkflowStatus,
    { bg: string; color: string; border: string }
  > = {
    Executed: {
      bg: 'var(--ref-accent-blue)',
      color: '#ffffff',
      border: 'transparent',
    },
    Scheduled: {
      bg: 'var(--ref-surface-card)',
      color: 'var(--ref-text-secondary)',
      border: 'var(--ref-border-subtle)',
    },
    'In Review': {
      bg: 'var(--ref-accent-coral)',
      color: '#ffffff',
      border: 'transparent',
    },
    Ready: {
      bg: 'var(--ref-surface-selected)',
      color: 'var(--ref-text-on-selected)',
      border: 'transparent',
    },
    Blocked: {
      bg: 'var(--ref-accent-coral-soft)',
      color: 'var(--ref-accent-coral)',
      border: 'var(--ref-accent-coral)',
    },
  };

  const s = stylesByStatus[status] || stylesByStatus.Scheduled;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3px 10px',
        borderRadius: '999px',
        fontSize: '10px',
        fontWeight: 600,
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        lineHeight: 1.2,
        whiteSpace: 'nowrap',
      }}
    >
      {status}
    </span>
  );
};

export interface ConicProgressRingProps {
  valuePct: number;
  centerLabel?: string;
  displayValue?: string;
  caption?: string;
  label?: string;
  tone: 'coral' | 'blue' | 'amber';
  size?: number;
}

export const ConicProgressRing: React.FC<ConicProgressRingProps> = ({
  valuePct,
  centerLabel,
  displayValue,
  caption,
  label,
  tone,
  size = 64,
}) => {
  const textValue = centerLabel ?? displayValue ?? '';
  const textCaption = caption ?? label ?? '';
  const clamped = Math.max(0, Math.min(100, valuePct));
  const strokeColor =
    tone === 'coral'
      ? 'var(--ref-accent-coral)'
      : tone === 'amber'
        ? 'var(--ref-accent-amber)'
        : 'var(--ref-accent-blue)';

  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - clamped / 100);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
      }}
    >
      <div style={{ position: 'relative', width: `${size}px`, height: `${size}px` }}>
        {/* Semantic progress element for assistive technology (modern-web-guidance: progress-ring) */}
        <progress
          className="ref-progress-ring"
          max={100}
          value={clamped}
          aria-label={`${textCaption}: ${textValue}`}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            pointerEvents: 'none',
          }}
        />
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          aria-hidden="true"
          style={{ transform: 'rotate(-90deg)' }}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--ref-border-subtle)"
            strokeWidth="3.5"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{
              transition:
                'stroke-dashoffset var(--motion-duration-connector) var(--motion-ease-out-quart)',
            }}
          />
        </svg>
        <div
          className="tabular-nums"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 700,
            color: 'var(--ref-text-primary)',
          }}
        >
          {textValue}
        </div>
      </div>
      <span
        style={{
          fontSize: '9.5px',
          color: 'var(--ref-text-secondary)',
          fontWeight: 500,
        }}
      >
        {textCaption}
      </span>
    </div>
  );
};
