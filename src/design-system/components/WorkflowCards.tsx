import React, { useState } from 'react';
import { Calendar, Check, Plus, ArrowUpRight } from 'lucide-react';
import {
  AllocationCardData,
  LabelParityMode,
  OnboardingActionTileData,
  PipelineColumnItem,
  ProgressGridCardItem,
  StageTaskRowData,
} from '../../data/syntheticStarters';
import { ConicProgressRing, OverlappingAvatarCluster } from './AvatarAndStatus';

export interface AllocationStageCardProps {
  card: AllocationCardData;
  labelMode: LabelParityMode;
  highlighted: boolean;
  dimmed: boolean;
  onSelect: (cardId: string) => void;
  onOpenDetail: (cardId: string) => void;
}

export const AllocationStageCard: React.FC<AllocationStageCardProps> = ({
  card,
  labelMode,
  highlighted,
  dimmed,
  onSelect,
  onOpenDetail,
}) => {
  const title = labelMode === 'reference' ? card.referenceTitle : card.operationsTitle;
  const socketColor = card.connectorTone === 'blue' ? '#8FA8E0' : '#D96B70';

  return (
    <div
      data-card-id={card.id}
      onClick={() => onSelect(card.id)}
      onDoubleClick={() => onOpenDetail(card.id)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenDetail(card.id);
        }
      }}
      aria-label={`${title} — ${card.formValues.starterFullName}. Due ${card.dueDate}. Press Enter to edit starter details.`}
      style={{
        position: 'relative',
        width: '218px',
        minHeight: '118px',
        padding: '14px 16px',
        borderRadius: '22px',
        background: 'var(--ajb-surface-card)',
        border: highlighted
          ? '1.5px solid var(--ajb-accent-black)'
          : '1px solid var(--ajb-border-subtle)',
        boxShadow: highlighted ? 'var(--ajb-shadow-floating)' : 'var(--ajb-shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        opacity: dimmed ? 0.38 : 1,
        transition:
          'transform var(--ajb-dur-hover) var(--ajb-ease-standard), box-shadow var(--ajb-dur-hover) var(--ajb-ease-standard), opacity var(--ajb-dur-hover) var(--ajb-ease-standard)',
        userSelect: 'none',
      }}
    >
      {/* Top Row: Title + Verified Check */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        <div
          style={{
            fontSize: '12.5px',
            fontWeight: 500,
            lineHeight: 1.32,
            color: 'var(--ajb-text-primary)',
            maxWidth: '148px',
          }}
        >
          {title}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetail(card.id);
          }}
          title="Open detailed starter form"
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '9999px',
            border: 'none',
            background: 'transparent',
            color: 'var(--ajb-text-secondary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          <Check size={13} strokeWidth={2} />
        </button>
      </div>

      {/* Bottom Row: Avatar + Date Pill */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '18px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img
            src={card.avatarUrl}
            alt={card.formValues.starterFullName}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '9999px',
              objectFit: 'cover',
              border: '1.5px solid #FFFFFF',
              boxShadow: '0 2px 5px rgba(18, 22, 33, 0.12)',
            }}
          />
          {labelMode === 'operations' && (
            <span
              style={{
                fontSize: '10.5px',
                color: 'var(--ajb-text-secondary)',
                fontWeight: 500,
                maxWidth: '78px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {card.formValues.starterFullName}
            </span>
          )}
        </div>

        <span
          className="ajb-tabular"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 9px',
            borderRadius: '9999px',
            background: 'rgba(235, 237, 242, 0.85)',
            color: 'var(--ajb-text-secondary)',
            fontSize: '10.5px',
            fontWeight: 500,
          }}
        >
          <Calendar size={11} strokeWidth={1.9} />
          {card.dueDate}
        </span>
      </div>

      {/* Outgoing Right Connector Socket */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: '-5px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '9px',
          height: '9px',
          borderRadius: '9999px',
          background: '#FFFFFF',
          border: `2px solid ${socketColor}`,
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
          zIndex: 3,
        }}
      />
    </div>
  );
};

export interface CompactTaskRowCardProps {
  task: StageTaskRowData;
  labelMode: LabelParityMode;
  highlighted: boolean;
  dimmed: boolean;
  onOpenDetail: (taskId: string) => void;
  onAssignParticipant: (taskId: string, participantId?: string) => void;
}

export const CompactTaskRowCard: React.FC<CompactTaskRowCardProps> = ({
  task,
  labelMode,
  highlighted,
  dimmed,
  onOpenDetail,
  onAssignParticipant,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [justAssigned, setJustAssigned] = useState(false);

  const title = labelMode === 'reference' ? task.referenceTitle : task.operationsTitle;
  const socketColor = task.incomingTone === 'blue' ? '#8FA8E0' : '#D96B70';
  const isUnassigned = !task.avatarUrl;

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const participantId = e.dataTransfer.getData('text/plain');
    onAssignParticipant(task.id, participantId || undefined);
    setJustAssigned(true);
    window.setTimeout(() => setJustAssigned(false), 750);
  };

  return (
    <div
      data-task-id={task.id}
      onClick={() => onOpenDetail(task.id)}
      onDragOver={(e) => {
        e.preventDefault();
        if (!isDragOver) setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenDetail(task.id);
        }
      }}
      aria-label={`${title} (${task.status}). ${
        isUnassigned ? 'Unassigned slot — click plus to assign reviewer or Enter to open form.' : 'Assigned.'
      }`}
      style={{
        position: 'relative',
        width: '234px',
        height: '42px',
        padding: '0 13px 0 9px',
        borderRadius: '16px',
        background: isDragOver ? '#FFFFFF' : 'var(--ajb-surface-card)',
        border: highlighted
          ? '1.5px solid var(--ajb-accent-black)'
          : isDragOver
            ? '1.5px solid var(--ajb-accent-coral)'
            : '1px solid var(--ajb-border-subtle)',
        boxShadow:
          highlighted || isDragOver ? 'var(--ajb-shadow-floating)' : 'var(--ajb-shadow-card)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
        cursor: 'pointer',
        opacity: dimmed ? 0.35 : 1,
        transition:
          'all var(--ajb-dur-hover) var(--ajb-ease-standard)',
        userSelect: 'none',
      }}
    >
      {/* Left Incoming Connector Socket */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '-5px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '8px',
          height: '8px',
          borderRadius: '9999px',
          background: '#FFFFFF',
          border: `2px solid ${socketColor}`,
          zIndex: 3,
        }}
      />

      {/* Left Avatar or Unassigned '+' Drop Target (Seq 06 f=0769..0825) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
        {task.avatarUrl ? (
          <div style={{ position: 'relative', width: '30px', height: '30px', flexShrink: 0 }}>
            <img
              src={task.avatarUrl}
              alt={task.formValues.approverName || 'Assigned reviewer'}
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '9999px',
                objectFit: 'cover',
                border: justAssigned
                  ? '2px solid var(--ajb-accent-black)'
                  : '1.5px solid #FFFFFF',
                boxShadow: '0 2px 4px rgba(18, 22, 33, 0.12)',
              }}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAssignParticipant(task.id);
              setJustAssigned(true);
              window.setTimeout(() => setJustAssigned(false), 750);
            }}
            title="Assign selected participant to this workflow task (Seq 06)"
            aria-label={`Assign reviewer to ${title}`}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '9999px',
              border: '1px dashed var(--ajb-border-strong)',
              background: isDragOver ? '#2B2D33' : 'rgba(232, 235, 241, 0.9)',
              color: isDragOver ? '#FFFFFF' : 'var(--ajb-text-secondary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              padding: 0,
              transition: 'all 140ms ease',
            }}
          >
            <Plus size={13} strokeWidth={2.2} />
          </button>
        )}

        <span
          style={{
            fontSize: '11.5px',
            fontWeight: isUnassigned ? 400 : 500,
            color: isUnassigned ? 'var(--ajb-text-muted)' : 'var(--ajb-text-primary)',
            lineHeight: 1.22,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {title}
        </span>
      </div>

      {/* Right Status Icon (Checkmark, Calendar, or Diagonal Connector Handle ↗) */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          color: task.hasDiagonalConnectorHandle
            ? 'var(--ajb-text-primary)'
            : 'var(--ajb-text-secondary)',
          flexShrink: 0,
        }}
      >
        {task.hasDiagonalConnectorHandle ? (
          <ArrowUpRight size={14} strokeWidth={2.1} />
        ) : task.hasCalendarTag ? (
          <Calendar size={13} strokeWidth={1.8} style={{ opacity: 0.55 }} />
        ) : task.completed ? (
          <Check size={13} strokeWidth={2} />
        ) : null}
      </div>

      {/* Outgoing Right Connector Socket if task has targetTaskIds */}
      {task.targetTaskIds.length > 0 && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: '-5px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '8px',
            height: '8px',
            borderRadius: '9999px',
            background: '#FFFFFF',
            border: `2px solid ${
              task.id === 'mgr-3' ? '#18191C' : '#D96B70'
            }`,
            zIndex: 3,
          }}
        />
      )}
    </div>
  );
};

export interface ActionTileCardProps {
  tile: OnboardingActionTileData;
  labelMode: LabelParityMode;
  onSelectTile: (tileId: string) => void;
  onOpenDetail: (tileId: string) => void;
}

export const ActionTileCard: React.FC<ActionTileCardProps> = ({
  tile,
  labelMode,
  onSelectTile,
  onOpenDetail,
}) => {
  const title = labelMode === 'reference' ? tile.referenceTitle : tile.operationsTitle;

  return (
    <div
      data-tile-id={tile.id}
      onClick={() => onSelectTile(tile.id)}
      onDoubleClick={() => onOpenDetail(tile.id)}
      role="button"
      tabIndex={0}
      aria-pressed={tile.selected}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelectTile(tile.id);
        }
      }}
      style={{
        position: 'relative',
        width: '112px',
        height: '74px',
        padding: '12px 13px',
        borderRadius: '18px',
        background: tile.selected
          ? 'var(--ajb-surface-card-selected)'
          : 'var(--ajb-surface-card)',
        color: tile.selected ? 'var(--ajb-text-on-dark)' : 'var(--ajb-text-secondary)',
        border: tile.selected
          ? '1px solid var(--ajb-surface-card-selected)'
          : '1px solid var(--ajb-border-subtle)',
        boxShadow: tile.selected
          ? '0 10px 22px rgba(13, 13, 15, 0.24)'
          : 'var(--ajb-shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        transition:
          'background var(--ajb-dur-hover) var(--ajb-ease-standard), color var(--ajb-dur-hover) var(--ajb-ease-standard), transform var(--ajb-dur-hover) var(--ajb-ease-standard), box-shadow var(--ajb-dur-hover) var(--ajb-ease-standard)',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          fontSize: '11.5px',
          fontWeight: tile.selected ? 500 : 400,
          lineHeight: 1.28,
          color: tile.selected ? '#FFFFFF' : 'var(--ajb-text-secondary)',
        }}
      >
        {title}
      </div>

      {/* Top-right subtle checkmark on completed unselected tiles */}
      {!tile.selected && tile.completed && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: '10px',
            bottom: '10px',
            color: 'var(--ajb-text-muted)',
            opacity: 0.7,
          }}
        >
          <Check size={12} strokeWidth={1.9} />
        </span>
      )}

      {/* Incoming connector dot on bottom-left corner when selected (Seq 07 f=0909 / f=0950) */}
      {tile.selected && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '-4px',
            bottom: '12px',
            width: '8px',
            height: '8px',
            borderRadius: '9999px',
            background: '#FFFFFF',
            border: '2px solid #D96B70',
            zIndex: 4,
          }}
        />
      )}
    </div>
  );
};

export interface PipelineRowCardProps {
  item: PipelineColumnItem;
  labelMode: LabelParityMode;
  isFeaturedActionable?: boolean;
  onTakeForProcessing: (item: PipelineColumnItem) => void;
}

export const PipelineRowCard: React.FC<PipelineRowCardProps> = ({
  item,
  labelMode,
  isFeaturedActionable = false,
  onTakeForProcessing,
}) => {
  const [hovered, setHovered] = useState(false);
  const title = labelMode === 'reference' ? item.referenceTitle : item.operationsTitle;
  const showBlackTakeCta = hovered || isFeaturedActionable;

  return (
    <button
      type="button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      onClick={() => onTakeForProcessing(item)}
      style={{
        width: '100%',
        height: '54px',
        padding: '0 14px 0 10px',
        borderRadius: '18px',
        border: showBlackTakeCta
          ? '1px solid var(--ajb-accent-black)'
          : '1px solid var(--ajb-border-subtle)',
        background: showBlackTakeCta
          ? 'var(--ajb-surface-card-selected)'
          : 'var(--ajb-surface-card)',
        color: showBlackTakeCta ? '#FFFFFF' : 'var(--ajb-text-primary)',
        boxShadow: showBlackTakeCta
          ? '0 10px 24px rgba(13, 13, 15, 0.22)'
          : 'var(--ajb-shadow-card)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 180ms var(--ajb-ease-standard)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
        <img
          src={item.avatarUrl}
          alt=""
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '9999px',
            objectFit: 'cover',
            border: '1.5px solid #FFFFFF',
            flexShrink: 0,
          }}
        />
        {showBlackTakeCta ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '9999px',
                border: '1px solid rgba(255,255,255,0.28)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Plus size={13} />
            </span>
            <span style={{ fontSize: '12px', fontWeight: 500, color: '#FFFFFF' }}>
              {labelMode === 'reference' ? 'Take for Processing' : 'Open Starter Review'}
            </span>
          </div>
        ) : (
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: '12px',
                fontWeight: 500,
                color: 'var(--ajb-text-primary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: '10.5px',
                color: 'var(--ajb-text-muted)',
                marginTop: '2px',
              }}
            >
              {item.waitSubtitle}
            </div>
          </div>
        )}
      </div>

      {!showBlackTakeCta && (
        <span style={{ color: 'var(--ajb-text-secondary)', flexShrink: 0 }}>
          <Check size={13} strokeWidth={1.9} />
        </span>
      )}
    </button>
  );
};

export interface ProgressGridCardProps {
  card: ProgressGridCardItem;
  labelMode: LabelParityMode;
  onOpenCard: (card: ProgressGridCardItem) => void;
}

export const ProgressGridCard: React.FC<ProgressGridCardProps> = ({
  card,
  labelMode,
  onOpenCard,
}) => {
  const title = labelMode === 'reference' ? card.referenceTitle : card.operationsTitle;

  return (
    <div
      onClick={() => onOpenCard(card)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenCard(card);
        }
      }}
      style={{
        padding: '18px 20px',
        borderRadius: '24px',
        background: card.muted ? 'rgba(255, 255, 255, 0.52)' : 'var(--ajb-surface-card)',
        border: '1px solid var(--ajb-border-subtle)',
        boxShadow: 'var(--ajb-shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '214px',
        cursor: 'pointer',
        opacity: card.muted ? 0.68 : 1,
        transition: 'transform 180ms var(--ajb-ease-standard), box-shadow 180ms var(--ajb-ease-standard)',
      }}
    >
      {/* Top Row: Title + Overlapping Avatar Cluster */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        <div
          style={{
            fontSize: '14px',
            fontWeight: 500,
            lineHeight: 1.28,
            color: 'var(--ajb-text-primary)',
            maxWidth: '130px',
          }}
        >
          {title}
        </div>
        <OverlappingAvatarCluster items={card.avatars} size={30} />
      </div>

      {/* Middle Metrics Row */}
      <div
        style={{
          display: 'flex',
           flexDirection: 'column',
          gap: '6px',
          margin: '16px 0',
          paddingTop: '10px',
          borderTop: '1px solid rgba(18, 22, 33, 0.05)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11px',
          }}
        >
          <span style={{ color: 'var(--ajb-text-muted)' }}>
            {labelMode === 'reference' ? 'Allocated Budget' : 'Onboarding Allowance'}
          </span>
          <span
            className="ajb-tabular"
            style={{ fontWeight: 600, color: 'var(--ajb-text-primary)' }}
          >
            {card.budgetAmount.toLocaleString('en-US')} $
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11px',
          }}
        >
          <span style={{ color: 'var(--ajb-text-muted)' }}>Team Members</span>
          <span
            className="ajb-tabular"
            style={{ fontWeight: 600, color: 'var(--ajb-text-primary)' }}
          >
            {card.teamMembersCount}
          </span>
        </div>
      </div>

      {/* Bottom Dual Conic Progress Rings */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          paddingTop: '6px',
        }}
      >
        <ConicProgressRing
          valuePct={card.hoursSpentPct}
          displayValue={String(card.hoursSpentMetric)}
          label={labelMode === 'reference' ? 'Hours Spent' : 'SLA Hours'}
          tone="coral"
        />
        <ConicProgressRing
          valuePct={card.paybackPct}
          displayValue={`${card.paybackPct}%`}
          label={labelMode === 'reference' ? 'Payback' : 'Readiness'}
          tone="blue"
        />
      </div>
    </div>
  );
};
