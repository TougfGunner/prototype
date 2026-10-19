import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Check,
  CheckCheck,
  Calendar,
  Plus,
  MoreHorizontal,
  Share2,
  Play,
  Sparkles,
} from 'lucide-react';
import {
  AllocationCardData,
  JourneyStageId,
  LabelParityMode,
  OnboardingActionTileData,
  PipelineColumnItem,
  ProgressGridCardItem,
  STAGE_METADATA,
  StageTaskRowData,
} from '../../data/syntheticStarters';
import { ConnectorRenderVariant } from '../../state/useStarterStore';
import { ConicProgressRing, OverlappingAvatarCluster } from './AvatarAndStatus';
import { CurvedConnectorLayer } from './CurvedConnectorLayer';

export type ChoreographyPhase =
  | 'idle'
  | 'seq05_stagger'
  | 'seq06_drag'
  | 'seq06_solidify'
  | 'seq07_arrow'
  | 'seq07_press'
  | 'seq07_dashed';

export interface AllocationStageCardProps {
  card: AllocationCardData;
  labelMode: LabelParityMode;
  highlighted: boolean;
  onOpenDetail: (cardId: string) => void;
  showBottomDivider?: boolean;
  staggerIndex?: number;
}

export const AllocationStageCard: React.FC<AllocationStageCardProps> = ({
  card,
  labelMode,
  highlighted,
  onOpenDetail,
  showBottomDivider = false,
  staggerIndex = 0,
}) => {
  const title = labelMode === 'reference' ? card.referenceTitle : card.operationsTitle;
  const socketColor =
    card.connectorTone === 'blue' ? 'var(--ajb-accent-periwinkle)' : 'var(--ajb-accent-coral)';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpenDetail(card.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpenDetail(card.id);
        }
      }}
      data-card-id={card.id}
      aria-label={`${title} — Open starter detail form`}
      className="ref-task-row-reveal ajb-smooth-card"
      style={{
        position: 'relative',
        padding: '14px 12px',
        minHeight: '116px',
        borderBottom: showBottomDivider ? '1px solid var(--ajb-border-row-divider)' : 'none',
        background: 'transparent',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '14px',
        cursor: 'pointer',
        opacity: highlighted ? 1 : 0.42,
        animationDelay: `${staggerIndex * 55}ms`,
        transition:
          'transform var(--ajb-duration-hover) var(--ajb-ease-standard), opacity var(--ajb-duration-hover) var(--ajb-ease-standard)',
      }}
    >
      {/* Top Row: Avatar on Top-Left + Double-Check & Circular Calendar Button on Top-Right (Matches Reference 1:1) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        <img
          src={card.avatarUrl}
          alt=""
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '9999px',
            objectFit: 'cover',
            border: '1.5px solid #FFFFFF',
            boxShadow: '0 3px 8px rgba(36, 20, 24, 0.10)',
          }}
        />

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <CheckCheck
            size={14}
            strokeWidth={2}
            style={{ color: 'var(--ajb-text-primary)', opacity: 0.82 }}
          />
          <span
            title={`Target date: ${card.dueDate}`}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '9999px',
              background: 'var(--ajb-surface-socket)',
              border: '1px solid var(--ajb-border-subtle)',
              boxShadow: 'var(--ajb-shadow-plus-circle)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--ajb-text-primary)',
            }}
          >
            <Calendar size={14} strokeWidth={1.9} />
          </span>
        </div>
      </div>

      {/* Bottom Row: 2-Line Action Label on Bottom-Left (Matches Reference 1:1) */}
      <span
        style={{
          fontSize: '13px',
          fontWeight: 500,
          lineHeight: 1.3,
          color: 'var(--ajb-text-primary)',
          letterSpacing: '-0.01em',
          maxWidth: '165px',
        }}
      >
        {title}
      </span>

      {/* Recessed Outgoing Connector Cutout Socket on Right Frosted Stage Edge */}
      <span
        data-port-out={card.id}
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: '-19px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '18px',
          height: '18px',
          borderRadius: '9999px',
          background: 'var(--ajb-surface-subpanel, #F2F2EA)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 5,
        }}
      >
        <span
          style={{
            width: '7px',
            height: '7px',
            borderRadius: '9999px',
            background: socketColor,
          }}
        />
      </span>
    </div>
  );
};

export interface CompactTaskRowCardProps {
  task: StageTaskRowData;
  labelMode: LabelParityMode;
  highlighted: boolean;
  onAssignSlot: (taskId: string) => void;
  onOpenDetail: (taskId: string) => void;
  /** Whether this row is non-last inside its frosted column (adds subtle horizontal divider) */
  showBottomDivider?: boolean;
  /** Choreography override: temporarily force unassigned during Seq 06 drag flight */
  forceUnassignedDuringDrag?: boolean;
  /** Choreography override: dark circular hover state when floating avatar passes over '+' slot (f=0785..0801) */
  isDropTargetHighlighted?: boolean;
  /** Choreography override: play snap spring when avatar lands in slot (f=0809) */
  justSnappedAvatar?: boolean;
  choreographyPhase?: ChoreographyPhase;
  connectorVariant?: ConnectorRenderVariant;
  staggerIndex?: number;
}

export const CompactTaskRowCard: React.FC<CompactTaskRowCardProps> = ({
  task,
  labelMode,
  highlighted,
  onAssignSlot,
  onOpenDetail,
  showBottomDivider = false,
  forceUnassignedDuringDrag = false,
  isDropTargetHighlighted = false,
  justSnappedAvatar = false,
  choreographyPhase = 'idle',
  connectorVariant = 'static_solid_dark',
  staggerIndex = 0,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const title = labelMode === 'reference' ? task.referenceTitle : task.operationsTitle;
  const isAssigned = !forceUnassignedDuringDrag && Boolean(task.avatarUrl);

  // In reference video f=0740..0801 (before avatar drop onto mgr-3), role-4 has bold text + '...' handle.
  // Once avatar drops onto mgr-3 (seq06_solidify / idle, f=0815..0950 & static reference), role-4 transitions to regular text + CheckCheck + Calendar!
  const isRole4PreDrop =
    task.id === 'role-4' &&
    (choreographyPhase === 'seq05_stagger' || choreographyPhase === 'seq06_drag');

  const showCompletedCalendar = isRole4PreDrop
    ? false
    : Boolean(task.completed && task.hasCalendarTag);

  const showDiagonalHandle = isRole4PreDrop
    ? true
    : Boolean(task.hasDiagonalConnectorHandle);

  const isBoldActiveRow =
    isAssigned &&
    (isRole4PreDrop ||
      task.id === 'role-5' ||
      task.id === 'mgr-3' ||
      task.id === 'mgr-4');

  const incomingDotColor =
    task.incomingTone === 'blue'
      ? 'var(--ajb-accent-periwinkle)'
      : 'var(--ajb-accent-coral)';

  const isPrimaryOutgoing =
    task.id === 'role-1' || task.id === 'role-2' || task.id === 'role-3';

  const useDarkStage3Socket =
    task.id === 'mgr-3' &&
    choreographyPhase !== 'seq07_dashed' &&
    !(choreographyPhase === 'idle' && connectorVariant === 'video_dashed_coral');

  const outgoingDotColor = isPrimaryOutgoing
    ? 'var(--ajb-accent-periwinkle)'
    : useDarkStage3Socket
      ? 'var(--ajb-connector-dark-stroke)'
      : 'var(--ajb-accent-coral)';

  const hasOutgoingSocket =
    task.targetTaskIds.length > 0 ||
    showDiagonalHandle ||
    task.stageId === 'manager_review';

  const showDropHighlight = isDragOver || isDropTargetHighlighted;

  return (
    <div
      data-task-id={task.id}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        onAssignSlot(task.id);
      }}
      className="ref-task-row-reveal ajb-smooth-task-row"
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
        padding: '8px 10px',
        minHeight: '52px',
        borderBottom: showBottomDivider ? '1px solid var(--ajb-border-row-divider)' : 'none',
        background: showDropHighlight ? 'var(--ajb-surface-elevated)' : 'transparent',
        borderRadius: showDropHighlight ? '14px' : undefined,
        opacity: highlighted ? 1 : 0.38,
        animationDelay: `${staggerIndex * 42}ms`,
        transition:
          'background var(--ajb-duration-hover) var(--ajb-ease-standard), opacity var(--ajb-duration-hover) var(--ajb-ease-standard)',
      }}
    >
      {/* Left Recessed Incoming Connector Cutout Socket on Frosted Stage Edge */}
      <span
        data-port-in={task.id}
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '-19px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '18px',
          height: '18px',
          borderRadius: '9999px',
          background: 'var(--ajb-surface-subpanel, #F2F2EA)',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 5,
        }}
      >
        <span
          style={{
            width: '7px',
            height: '7px',
            borderRadius: '9999px',
            background: incomingDotColor,
            transition: 'background var(--ajb-duration-connector) var(--ajb-ease-standard)',
          }}
        />
      </span>

      {/* Left Avatar or Circular '+' Assignment Slot */}
      {isAssigned ? (
        <button
          type="button"
          onClick={() => onOpenDetail(task.id)}
          aria-label={`Open ${title} details`}
          className={justSnappedAvatar ? 'ref-avatar-slot-snap' : undefined}
          style={{
            padding: 0,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            flexShrink: 0,
            display: 'inline-flex',
            borderRadius: '9999px',
          }}
        >
          <img
            src={task.avatarUrl!}
            alt=""
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '9999px',
              objectFit: 'cover',
              border: '1.5px solid #FFFFFF',
              boxShadow: '0 2px 6px rgba(18, 23, 38, 0.14)',
            }}
          />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => onAssignSlot(task.id)}
          aria-label={`Assign reviewer to ${title}`}
          title="Click or drop a top-notch participant here to assign"
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '9999px',
            border: showDropHighlight
              ? '1.5px solid var(--ajb-accent-black)'
              : '1px solid var(--ajb-border-subtle)',
            background: showDropHighlight ? 'var(--ajb-accent-black)' : 'var(--ajb-surface-socket)',
            color: showDropHighlight ? '#FFFFFF' : 'var(--ajb-text-primary)',
            boxShadow: showDropHighlight
              ? 'var(--ajb-shadow-card-active)'
              : 'var(--ajb-shadow-plus-circle)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
            transform: showDropHighlight ? 'scale(1.08)' : 'scale(1)',
            transition:
              'background 140ms var(--ajb-ease-standard), color 140ms var(--ajb-ease-standard), transform 140ms var(--ajb-ease-spring)',
          }}
        >
          <Plus size={14} strokeWidth={2.1} />
        </button>
      )}

      {/* Middle 2-Line Task Title */}
      <button
        type="button"
        onClick={() => onOpenDetail(task.id)}
        style={{
          flex: 1,
          border: 'none',
          background: 'transparent',
          padding: 0,
          textAlign: 'left',
          cursor: 'pointer',
          fontFamily: 'var(--ajb-font-sans)',
          fontSize: '12.5px',
          fontWeight: isBoldActiveRow ? 600 : isAssigned ? 500 : 450,
          lineHeight: 1.25,
          letterSpacing: '-0.01em',
          color: isAssigned ? 'var(--ajb-text-primary)' : 'var(--ajb-text-secondary)',
          transition: 'color var(--ajb-duration-hover) var(--ajb-ease-standard)',
        }}
      >
        {title}
      </button>

      {/* Right Status / Action Cluster (Matches Reference: CheckCheck + Circular Calendar OR Diagonal 3-Dots) */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          flexShrink: 0,
        }}
      >
        {isAssigned && showCompletedCalendar && (
          <CheckCheck
            size={14}
            strokeWidth={2}
            style={{ color: 'var(--ajb-text-primary)', opacity: 0.84 }}
          />
        )}

        {showCompletedCalendar && (
          <button
            type="button"
            onClick={() => onOpenDetail(task.id)}
            aria-label={`Schedule ${title}`}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '9999px',
              border: '1px solid var(--ajb-border-subtle)',
              background: 'var(--ajb-surface-socket)',
              boxShadow: 'var(--ajb-shadow-plus-circle)',
              color: 'var(--ajb-text-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Calendar size={13} strokeWidth={1.8} />
          </button>
        )}

        {isAssigned && showDiagonalHandle && (
          <button
            type="button"
            onClick={() => onOpenDetail(task.id)}
            aria-label={`Configure connector for ${title}`}
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '9999px',
              border: 'none',
              background: 'transparent',
              color: 'var(--ajb-text-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              opacity: 0.78,
            }}
          >
            <MoreHorizontal
              size={14}
              strokeWidth={2.2}
              style={{ transform: 'rotate(-35deg)' }}
            />
          </button>
        )}
      </div>

      {/* Right Recessed Outgoing Connector Cutout Socket */}
      {hasOutgoingSocket && (
        <span
          data-port-out={task.id}
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: '-19px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '18px',
            height: '18px',
            borderRadius: '9999px',
            background: 'var(--ajb-surface-subpanel, #F2F2EA)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 5,
          }}
        >
          <span
            style={{
              width: '6.5px',
              height: '6.5px',
              borderRadius: '9999px',
              background: outgoingDotColor,
              transition: 'background var(--ajb-duration-connector) var(--ajb-ease-standard)',
            }}
          />
        </span>
      )}
    </div>
  );
};

export interface ActionTileCardProps {
  tile: OnboardingActionTileData;
  labelMode: LabelParityMode;
  onSelectTile: (tileId: string) => void;
  onOpenDetail: (tileId: string) => void;
  /** Choreography override: temporary unselected before Seq 07 click */
  forceUnselected?: boolean;
  /** Choreography override: medium slate-grey press state at f=0919 */
  isPressingTile?: boolean;
  staggerIndex?: number;
}

export const ActionTileCard: React.FC<ActionTileCardProps> = ({
  tile,
  labelMode,
  onSelectTile,
  onOpenDetail,
  forceUnselected = false,
  isPressingTile = false,
  staggerIndex = 0,
}) => {
  const title = labelMode === 'reference' ? tile.referenceTitle : tile.operationsTitle;
  const isSelected = !forceUnselected && tile.selected;

  let backgroundStyle = 'var(--ajb-surface-card-gradient)';
  let textColor = 'var(--ajb-text-primary)';
  if (isSelected && isPressingTile) {
    backgroundStyle = 'var(--ajb-surface-selected-press)';
    textColor = '#FFFFFF';
  } else if (isSelected) {
    backgroundStyle = 'var(--ajb-surface-selected-gradient)';
    textColor = 'var(--ajb-text-on-dark)';
  }

  return (
    <button
      type="button"
      data-tile-id={tile.id}
      onClick={() => onSelectTile(tile.id)}
      onDoubleClick={() => onOpenDetail(tile.id)}
      aria-pressed={isSelected}
      className="ref-action-tile-pop ajb-smooth-action-tile"
      style={{
        position: 'relative',
        minHeight: '80px',
        padding: '14px 15px',
        borderRadius: '20px',
        border: isSelected
          ? '1px solid var(--ajb-accent-black)'
          : '1px solid var(--ajb-border-subtle)',
        background: backgroundStyle,
        color: textColor,
        boxShadow: isSelected ? 'var(--ajb-shadow-card-active)' : 'var(--ajb-shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        textAlign: 'left',
        cursor: 'pointer',
        fontFamily: 'var(--ajb-font-sans)',
        animationDelay: `${staggerIndex * 45}ms`,
        transform: isPressingTile ? 'scale(0.96)' : 'scale(1)',
        transition:
          'background var(--ajb-duration-tile-select) var(--ajb-ease-standard), color var(--ajb-duration-tile-select) var(--ajb-ease-standard), transform var(--ajb-duration-hover) var(--ajb-ease-standard), box-shadow var(--ajb-duration-tile-select) var(--ajb-ease-standard)',
      }}
    >
      {/* Incoming Connector Socket on Bottom-Left of Tile (Matches Reference f=0909 & Static Image) */}
      <span
        data-port-in={tile.id}
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '-4px',
          bottom: '12px',
          width: '8px',
          height: '8px',
          borderRadius: '9999px',
          background: isSelected ? 'var(--ajb-connector-dark-stroke)' : 'transparent',
          border: isSelected ? '1.5px solid #FFFFFF' : 'none',
          pointerEvents: 'none',
        }}
      />

      <span
        style={{
          fontSize: '12.5px',
          fontWeight: isSelected ? 600 : 500,
          lineHeight: 1.26,
          letterSpacing: '-0.01em',
          maxWidth: '108px',
        }}
      >
        {title}
      </span>
    </button>
  );
};

export interface FrostedStageColumnProps {
  stageTitle: string;
  children: React.ReactNode;
  dimmed?: boolean;
  staggerIndex?: number;
  contentPadding?: string;
}

export const FrostedStageColumn: React.FC<FrostedStageColumnProps> = ({
  stageTitle,
  children,
  dimmed = false,
  staggerIndex = 0,
  contentPadding = '12px',
}) => {
  return (
    <div
      className="ref-stage-cascade"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        opacity: dimmed ? 0.35 : 1,
        animationDelay: `${staggerIndex * 70}ms`,
        transition: 'opacity var(--ajb-duration-hover) var(--ajb-ease-standard)',
      }}
    >
      {/* Tall Translucent Frosted Stage Container (Matches Reference Image 1:1) */}
      <div
        style={{
          position: 'relative',
          flex: 1,
          minHeight: '274px',
          padding: contentPadding,
          borderRadius: 'var(--ajb-radius-stage)',
          background: 'var(--ajb-surface-stage-column)',
          backdropFilter: 'blur(14px)',
          border: '1px solid var(--ajb-border-glass)',
          boxShadow: 'var(--ajb-shadow-stage)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {children}
      </div>

      {/* Centered Stage Label BELOW the Frosted Container (Matches Reference Image 1:1) */}
      <div
        style={{
          marginTop: '10px',
          textAlign: 'center',
          fontSize: '13px',
          fontWeight: 550,
          letterSpacing: '-0.01em',
          color: 'var(--ajb-text-primary)',
        }}
      >
        {stageTitle}
      </div>
    </div>
  );
};

export interface ConnectedWorkflowCanvasProps {
  labelMode: LabelParityMode;
  allocationCards: AllocationCardData[];
  stageTasks: StageTaskRowData[];
  onboardingTiles: OnboardingActionTileData[];
  selectedParticipantId: string | null;
  activeStageFilter?: JourneyStageId | 'all';
  connectorVariant: ConnectorRenderVariant;
  onSetConnectorVariant?: (variant: ConnectorRenderVariant) => void;
  onAssignSlot: (taskId: string, participantId?: string) => void;
  onSelectTile: (tileId: string) => void;
  onOpenDetail: (cardId: string) => void;
  onAddNewCase?: () => void;
  matchesTaskFilter?: (task: StageTaskRowData) => boolean;
  /** If true, automatically loops the Seq 05 -> Seq 06 -> Seq 07 motion choreography */
  autoLoopDefault?: boolean;
}

export const ConnectedWorkflowCanvas: React.FC<ConnectedWorkflowCanvasProps> = ({
  labelMode,
  allocationCards,
  stageTasks,
  onboardingTiles,
  selectedParticipantId,
  activeStageFilter = 'all',
  connectorVariant,
  onSetConnectorVariant,
  onAssignSlot,
  onSelectTile,
  onOpenDetail,
  onAddNewCase,
  matchesTaskFilter,
  autoLoopDefault = true,
}) => {
  const stageCanvasRef = useRef<HTMLDivElement | null>(null);
  const [phase, setPhase] = useState<ChoreographyPhase>('idle');
  const [autoLoop, setAutoLoop] = useState<boolean>(autoLoopDefault);
  const [animTriggerKey, setAnimTriggerKey] = useState<number>(1);
  const [hoveredDropSlotId, setHoveredDropSlotId] = useState<string | null>(null);
  const [floatingAvatarPos, setFloatingAvatarPos] = useState<{
    visible: boolean;
    x: string;
    y: string;
    scale: number;
  }>({ visible: false, x: '56%', y: '-18px', scale: 1 });

  const timersRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id));
    timersRef.current = [];
  }, []);

  const runFullChoreography = useCallback(() => {
    clearTimers();
    setAnimTriggerKey((k) => k + 1);

    // Phase 1: Seq 05 Staggered Stage & Row Reveal (0ms -> 900ms)
    setPhase('seq05_stagger');
    setHoveredDropSlotId(null);
    setFloatingAvatarPos({ visible: false, x: '55%', y: '-22px', scale: 0.9 });

    // Phase 2: Seq 06 Floating Avatar Pickup from Top Notch (900ms)
    timersRef.current.push(
      window.setTimeout(() => {
        setPhase('seq06_drag');
        setFloatingAvatarPos({ visible: true, x: '55%', y: '-14px', scale: 1.08 });
      }, 900)
    );

    // Glide over Stage 3 Row 1 (mgr-1, f=0785)
    timersRef.current.push(
      window.setTimeout(() => {
        setHoveredDropSlotId('mgr-1');
        setFloatingAvatarPos({ visible: true, x: '54.5%', y: '36px', scale: 1.06 });
      }, 1350)
    );

    // Glide over Stage 3 Row 2 (mgr-2, f=0793)
    timersRef.current.push(
      window.setTimeout(() => {
        setHoveredDropSlotId('mgr-2');
        setFloatingAvatarPos({ visible: true, x: '54.5%', y: '86px', scale: 1.06 });
      }, 1720)
    );

    // Hover Stage 3 Row 3 (mgr-3: Estimate Resolution Time, f=0801)
    timersRef.current.push(
      window.setTimeout(() => {
        setHoveredDropSlotId('mgr-3');
        setFloatingAvatarPos({ visible: true, x: '54.5%', y: '134px', scale: 1.02 });
      }, 2080)
    );

    // Drop into mgr-3 & Solidify Coral->Blue Connector (f=0809..0833)
    timersRef.current.push(
      window.setTimeout(() => {
        setHoveredDropSlotId(null);
        setFloatingAvatarPos({ visible: false, x: '54.5%', y: '134px', scale: 0.8 });
        setPhase('seq06_solidify');
      }, 2440)
    );

    // Phase 3: Seq 07 Diagonal Dark Arrow Draw to Request Processing (f=0895..0907)
    timersRef.current.push(
      window.setTimeout(() => {
        setPhase('seq07_arrow');
      }, 3150)
    );

    // Tile Press Slate Grey Pulse (f=0919)
    timersRef.current.push(
      window.setTimeout(() => {
        setPhase('seq07_press');
      }, 3700)
    );

    // Routed Dashed Coral Connector & Black Tile Settled (f=0925..0961)
    timersRef.current.push(
      window.setTimeout(() => {
        setPhase('seq07_dashed');
      }, 4020)
    );

    // Return to settled idle state
    timersRef.current.push(
      window.setTimeout(() => {
        setPhase('idle');
      }, 5200)
    );
  }, [clearTimers]);

  useEffect(() => {
    if (!autoLoop) return;
    const initialTimer = window.setTimeout(() => {
      runFullChoreography();
    }, 4500);
    const interval = window.setInterval(() => {
      runFullChoreography();
    }, 8500);
    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(interval);
      clearTimers();
    };
  }, [autoLoop, runFullChoreography, clearTimers]);

  useEffect(() => {
    return () => clearTimers();
  }, [clearTimers]);

  const stage2Tasks = stageTasks.filter((t) => t.stageId === 'role_access_profile');
  const stage3Tasks = stageTasks.filter((t) => t.stageId === 'manager_review');

  const getStageTitle = (id: JourneyStageId) => {
    const meta = STAGE_METADATA.find((s) => s.id === id);
    if (!meta) return '';
    return labelMode === 'reference' ? meta.referenceTitle : meta.operationsTitle;
  };

  return (
    <div
      style={{
        padding: '18px 22px 20px',
        borderRadius: '30px',
        background: 'var(--ajb-surface-subpanel)',
        border: '1px solid var(--ajb-border-glass)',
        boxShadow: '0 8px 28px -8px rgba(18, 23, 38, 0.04)',
        position: 'relative',
      }}
    >
      {/* Sub-Panel Top Bar: "New Case Management" + Replay Motion Controls + 3 Circular Action Icons */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '14px',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <h2
            style={{
              margin: 0,
              fontSize: '16.5px',
              fontWeight: 550,
              letterSpacing: '-0.015em',
              color: 'var(--ajb-text-primary)',
            }}
          >
            {labelMode === 'reference' ? 'New Case Management' : 'New Starter Journey'}
          </h2>

          {/* Live Motion Choreography Controls (Seq 05 -> Seq 06 -> Seq 07) */}
          <div
            role="group"
            aria-label="Workflow motion choreography controls"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 6px',
              borderRadius: '9999px',
              background: 'var(--ajb-surface-toolbar)',
              border: '1px solid var(--ajb-border-subtle)',
            }}
          >
            <button
              type="button"
              onClick={runFullChoreography}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 10px',
                borderRadius: '9999px',
                border: 'none',
                background:
                  phase !== 'idle'
                    ? 'var(--ajb-accent-black)'
                    : 'var(--ajb-accent-periwinkle-soft)',
                color: phase !== 'idle' ? '#FFFFFF' : 'var(--ajb-accent-periwinkle)',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Play size={10} fill="currentColor" />
              {phase === 'idle' ? 'Replay Motion (Seq 05–07)' : `Playing: ${phase}`}
            </button>

            <button
              type="button"
              onClick={() => {
                setAutoLoop(false);
                clearTimers();
                setPhase('seq06_drag');
                setHoveredDropSlotId('mgr-3');
                setFloatingAvatarPos({ visible: true, x: '54.5%', y: '134px', scale: 1.04 });
                timersRef.current.push(
                  window.setTimeout(() => {
                    setHoveredDropSlotId(null);
                    setFloatingAvatarPos({ visible: false, x: '54.5%', y: '134px', scale: 0.85 });
                    setPhase('seq06_solidify');
                  }, 2200),
                  window.setTimeout(() => {
                    setPhase('idle');
                  }, 3600)
                );
              }}
              style={{
                padding: '4px 9px',
                borderRadius: '9999px',
                border: 'none',
                background:
                  phase === 'seq06_drag' || phase === 'seq06_solidify'
                    ? 'var(--ajb-accent-black)'
                    : 'transparent',
                color:
                  phase === 'seq06_drag' || phase === 'seq06_solidify'
                    ? '#FFFFFF'
                    : 'var(--ajb-text-secondary)',
                fontSize: '11px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Seq 06: Avatar Drag
            </button>

            <button
              type="button"
              onClick={() => {
                setAutoLoop(false);
                clearTimers();
                setAnimTriggerKey((k) => k + 1);
                setPhase('seq07_arrow');
                timersRef.current.push(
                  window.setTimeout(() => setPhase('seq07_press'), 650),
                  window.setTimeout(() => setPhase('seq07_dashed'), 1050),
                  window.setTimeout(() => setPhase('idle'), 2600)
                );
              }}
              style={{
                padding: '4px 9px',
                borderRadius: '9999px',
                border: 'none',
                background:
                  phase === 'seq07_arrow' || phase === 'seq07_press' || phase === 'seq07_dashed'
                    ? 'var(--ajb-accent-black)'
                    : 'transparent',
                color:
                  phase === 'seq07_arrow' || phase === 'seq07_press' || phase === 'seq07_dashed'
                    ? '#FFFFFF'
                    : 'var(--ajb-text-secondary)',
                fontSize: '11px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Seq 07: Arrow & Tile
            </button>

            <button
              type="button"
              onClick={() => setAutoLoop((prev) => !prev)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 9px',
                borderRadius: '9999px',
                border: 'none',
                background: autoLoop ? 'var(--ajb-accent-black)' : 'transparent',
                color: autoLoop ? '#FFFFFF' : 'var(--ajb-text-secondary)',
                fontSize: '11px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              <Sparkles size={10} />
              {autoLoop ? 'Looping ON' : 'Auto-Loop'}
            </button>

            {onSetConnectorVariant && (
              <button
                type="button"
                onClick={() =>
                  onSetConnectorVariant(
                    connectorVariant === 'static_solid_dark'
                      ? 'video_dashed_coral'
                      : 'static_solid_dark'
                  )
                }
                title="Toggle Stage 3→4 connector between Static Reference (solid dark arrow) and Video f=0925 (dashed berry spline)"
                style={{
                  padding: '4px 9px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: 'transparent',
                  color: 'var(--ajb-text-secondary)',
                  fontSize: '11px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                {connectorVariant === 'static_solid_dark'
                  ? 'Spline: Burgundy Arrow (Ref)'
                  : 'Spline: Dashed Berry (f=0925)'}
              </button>
            )}
          </div>
        </div>

        {/* Top-Right 3 Circular Action Icons (+, Share/Upload, Calendar — Matches Reference Image 1:1) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            onClick={onAddNewCase}
            aria-label="Add new starter case"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '9999px',
              border: '1px solid var(--ajb-border-subtle)',
              background: 'var(--ajb-surface-elevated)',
              boxShadow: 'var(--ajb-shadow-plus-circle)',
              color: 'var(--ajb-text-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Plus size={14} strokeWidth={1.9} />
          </button>
          <button
            type="button"
            onClick={runFullChoreography}
            aria-label="Share or replay workflow"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '9999px',
              border: '1px solid var(--ajb-border-subtle)',
              background: 'var(--ajb-surface-elevated)',
              boxShadow: 'var(--ajb-shadow-plus-circle)',
              color: 'var(--ajb-text-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Share2 size={13} strokeWidth={1.8} />
          </button>
          <button
            type="button"
            onClick={() => onOpenDetail('alloc-1')}
            aria-label="Open schedule calendar"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '9999px',
              border: '1px solid var(--ajb-border-subtle)',
              background: 'var(--ajb-surface-elevated)',
              boxShadow: 'var(--ajb-shadow-plus-circle)',
              color: 'var(--ajb-text-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Calendar size={13} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* 4 Connected Stage Columns + SVG Cubic Bézier Connector Overlay */}
      <div
        ref={stageCanvasRef}
        style={{
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: '0.88fr 1.15fr 1.15fr 1.08fr',
          gap: '24px',
          alignItems: 'stretch',
        }}
      >
        {/* Animated Floating Avatar Sprite for Seq 06 (f=0769..0809) */}
        {floatingAvatarPos.visible && (
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: floatingAvatarPos.x,
              top: floatingAvatarPos.y,
              transform: `translate(-50%, -50%) scale(${floatingAvatarPos.scale})`,
              zIndex: 30,
              pointerEvents: 'none',
              transition:
                'left 340ms cubic-bezier(0.22, 1, 0.36, 1), top 340ms cubic-bezier(0.22, 1, 0.36, 1), transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src="/avatars/avatar-6.png"
              alt=""
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '9999px',
                objectFit: 'cover',
                border: '2px solid #FFFFFF',
                boxShadow: 'var(--ajb-shadow-floating)',
              }}
            />
            <span
              style={{
                position: 'absolute',
                right: '-6px',
                bottom: '-6px',
                width: '18px',
                height: '18px',
                borderRadius: '9999px',
                background: 'var(--ajb-accent-black)',
                color: '#FFFFFF',
                border: '1.5px solid #FFFFFF',
                boxShadow: 'var(--ajb-shadow-pill)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Plus size={10} strokeWidth={2.5} />
            </span>
          </div>
        )}

        {/* SVG Connector Layer */}
        <CurvedConnectorLayer
          containerRef={stageCanvasRef}
          allocationCards={allocationCards}
          stageTasks={stageTasks}
          onboardingTiles={onboardingTiles}
          selectedParticipantId={selectedParticipantId}
          connectorVariant={connectorVariant}
          choreographyPhase={phase}
          animationTriggerKey={animTriggerKey}
        />

        {/* Column 1: Case Allocation / Starter details */}
        <FrostedStageColumn
          key={`col1-${animTriggerKey}`}
          stageTitle={getStageTitle('starter_details')}
          dimmed={activeStageFilter !== 'all' && activeStageFilter !== 'starter_details'}
          staggerIndex={0}
          contentPadding="8px 10px"
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              flex: 1,
            }}
          >
            {allocationCards.map((card, idx) => (
              <AllocationStageCard
                key={card.id}
                card={card}
                labelMode={labelMode}
                highlighted={
                  !selectedParticipantId || card.participantId === selectedParticipantId
                }
                onOpenDetail={onOpenDetail}
                showBottomDivider={idx < allocationCards.length - 1}
                staggerIndex={idx}
              />
            ))}
          </div>
        </FrostedStageColumn>

        {/* Column 2: Issue Identification / Role and access profile */}
        <FrostedStageColumn
          key={`col2-${animTriggerKey}`}
          stageTitle={getStageTitle('role_access_profile')}
          dimmed={activeStageFilter !== 'all' && activeStageFilter !== 'role_access_profile'}
          staggerIndex={1}
          contentPadding="6px 10px"
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              flex: 1,
            }}
          >
            {stage2Tasks.map((task, idx) => {
              const matched = matchesTaskFilter ? matchesTaskFilter(task) : true;
              const isHighlighted =
                matched &&
                (!selectedParticipantId || task.assignedParticipantId === selectedParticipantId);
              return (
                <CompactTaskRowCard
                  key={task.id}
                  task={task}
                  labelMode={labelMode}
                  highlighted={isHighlighted}
                  onAssignSlot={(taskId) => onAssignSlot(taskId)}
                  onOpenDetail={onOpenDetail}
                  showBottomDivider={idx < stage2Tasks.length - 1}
                  choreographyPhase={phase}
                  connectorVariant={connectorVariant}
                  staggerIndex={idx + 2}
                />
              );
            })}
          </div>
        </FrostedStageColumn>

        {/* Column 3: Technical Resolution / Manager review */}
        <FrostedStageColumn
          key={`col3-${animTriggerKey}`}
          stageTitle={getStageTitle('manager_review')}
          dimmed={activeStageFilter !== 'all' && activeStageFilter !== 'manager_review'}
          staggerIndex={2}
          contentPadding="6px 10px"
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              flex: 1,
            }}
          >
            {stage3Tasks.map((task, idx) => {
              const isMgr3 = task.id === 'mgr-3';
              const forceUnassigned =
                isMgr3 && (phase === 'seq05_stagger' || phase === 'seq06_drag');
              const justSnapped = isMgr3 && phase === 'seq06_solidify';
              const matched = matchesTaskFilter ? matchesTaskFilter(task) : true;
              const isHighlighted =
                matched &&
                (!selectedParticipantId ||
                  task.assignedParticipantId === selectedParticipantId ||
                  !task.assignedParticipantId);

              return (
                <CompactTaskRowCard
                  key={task.id}
                  task={task}
                  labelMode={labelMode}
                  highlighted={isHighlighted}
                  onAssignSlot={(taskId) => onAssignSlot(taskId)}
                  onOpenDetail={onOpenDetail}
                  showBottomDivider={idx < stage3Tasks.length - 1}
                  forceUnassignedDuringDrag={forceUnassigned}
                  isDropTargetHighlighted={hoveredDropSlotId === task.id}
                  justSnappedAvatar={justSnapped}
                  choreographyPhase={phase}
                  connectorVariant={connectorVariant}
                  staggerIndex={idx + 4}
                />
              );
            })}
          </div>
        </FrostedStageColumn>

        {/* Column 4: New Tasks / Ready for onboarding (2x3 Grid) */}
        <FrostedStageColumn
          key={`col4-${animTriggerKey}`}
          stageTitle={getStageTitle('ready_for_onboarding')}
          dimmed={activeStageFilter !== 'all' && activeStageFilter !== 'ready_for_onboarding'}
          staggerIndex={3}
          contentPadding="12px"
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px',
              flex: 1,
              alignContent: 'space-between',
            }}
          >
            {onboardingTiles.map((tile, idx) => {
              const isRequestProcessing = tile.id === 'tile-1';
              const forceUnselected =
                isRequestProcessing &&
                (phase === 'seq05_stagger' ||
                  phase === 'seq06_drag' ||
                  phase === 'seq06_solidify');
              const isPressingTile = isRequestProcessing && phase === 'seq07_press';

              return (
                <ActionTileCard
                  key={tile.id}
                  tile={tile}
                  labelMode={labelMode}
                  onSelectTile={(id) => {
                    setAutoLoop(false);
                    clearTimers();
                    setPhase('idle');
                    onSelectTile(id);
                  }}
                  onOpenDetail={onOpenDetail}
                  forceUnselected={forceUnselected}
                  isPressingTile={isPressingTile}
                  staggerIndex={idx + 6}
                />
              );
            })}
          </div>
        </FrostedStageColumn>
      </div>
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
        height: '58px',
        padding: '0 14px 0 10px',
        borderRadius: '18px',
        border: showBlackTakeCta
          ? '1px solid var(--ajb-accent-black)'
          : '1px solid var(--ajb-border-subtle)',
        background: showBlackTakeCta
          ? 'var(--ajb-surface-selected-gradient)'
          : 'var(--ajb-surface-card-gradient)',
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
            width: '36px',
            height: '36px',
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
            <span style={{ fontSize: '13px', fontWeight: 550, color: '#FFFFFF' }}>
              {labelMode === 'reference' ? 'Take for Processing' : 'Open Starter Review'}
            </span>
          </div>
        ) : (
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: '13px',
                fontWeight: 550,
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
                fontSize: '11.5px',
                color: 'var(--ajb-text-secondary)',
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
          <Check size={14} strokeWidth={2} />
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
        background: card.muted
          ? 'var(--ajb-surface-card)'
          : 'var(--ajb-surface-card-gradient)',
        border: '1px solid var(--ajb-border-subtle)',
        boxShadow: 'var(--ajb-shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '220px',
        cursor: 'pointer',
        opacity: card.muted ? 0.72 : 1,
        transition:
          'transform 180ms var(--ajb-ease-standard), box-shadow 180ms var(--ajb-ease-standard)',
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
            fontSize: '15px',
            fontWeight: 550,
            lineHeight: 1.28,
            color: 'var(--ajb-text-primary)',
            maxWidth: '140px',
          }}
        >
          {title}
        </div>
        <OverlappingAvatarCluster items={card.avatars} size={32} />
      </div>

      {/* Middle Metrics Row */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          margin: '16px 0',
          paddingTop: '10px',
          borderTop: '1px solid var(--ajb-border-row-divider)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
          }}
        >
          <span style={{ color: 'var(--ajb-text-secondary)' }}>
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
            fontSize: '12px',
          }}
        >
          <span style={{ color: 'var(--ajb-text-secondary)' }}>Team Members</span>
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

