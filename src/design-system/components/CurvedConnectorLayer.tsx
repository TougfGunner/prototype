import React from 'react';
import {
  AllocationCardData,
  OnboardingActionTileData,
  StageTaskRowData,
} from '../../data/syntheticStarters';
import { ConnectorRenderVariant } from '../../state/useStarterStore';

export interface CurvedConnectorLayerProps {
  allocationCards: AllocationCardData[];
  stageTasks: StageTaskRowData[];
  onboardingTiles: OnboardingActionTileData[];
  selectedParticipantId: string | null;
  connectorVariant: ConnectorRenderVariant;
}

/**
 * Generates a smooth cubic S-curve between (x1, y1) and (x2, y2)
 * matching the reference UI's rounded-elbow and cubic workflow splines.
 */
function buildSmoothSpline(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  midOffset = 0
): string {
  const dx = x2 - x1;
  const c1x = x1 + dx * 0.48 + midOffset;
  const c2x = x1 + dx * 0.52 + midOffset;
  return `M ${x1} ${y1} C ${c1x} ${y1}, ${c2x} ${y2}, ${x2} ${y2}`;
}

export const CurvedConnectorLayer: React.FC<CurvedConnectorLayerProps> = ({
  allocationCards,
  stageTasks,
  onboardingTiles,
  selectedParticipantId,
  connectorVariant,
}) => {
  // Deterministic layout geometry matching our 4-column Journey stage grid (1110px × 296px stage area)
  // Stage Header Offset = 30px
  // Column 1 (Allocation Cards, 218px wide, 118px tall, gap 12px): xRight = 218, y centers = [89, 219]
  // Column 2 (Role Profile Tasks, 5 rows, 234px wide, 42px tall, gap 10px): xLeft = 278, xRight = 512, y = [51, 103, 155, 207, 259]
  // Column 3 (Manager Review Tasks, 5 rows, 234px wide, 42px tall, gap 10px): xLeft = 572, xRight = 806, y = [51, 103, 155, 207, 259]
  // Column 4 (Onboarding Action Tiles 2x3, 112px wide, 74px tall, gap 10px):
  //   Col 4A xLeft = 866, Col 4B xLeft = 988

  const allocY: Record<string, number> = {
    'alloc-1': 89,
    'alloc-2': 219,
  };

  const roleY: Record<string, number> = {
    'role-1': 51,
    'role-2': 103,
    'role-3': 155,
    'role-4': 207,
    'role-5': 259,
  };

  const mgrY: Record<string, number> = {
    'mgr-1': 51,
    'mgr-2': 103,
    'mgr-3': 155,
    'mgr-4': 207,
    'mgr-5': 259,
  };

  const tilePos: Record<string, { x: number; y: number }> = {
    'tile-1': { x: 866, y: 88 },
    'tile-2': { x: 988, y: 88 },
    'tile-3': { x: 866, y: 172 },
    'tile-4': { x: 988, y: 172 },
    'tile-5': { x: 866, y: 256 },
    'tile-6': { x: 988, y: 256 },
  };

  const selectedTile =
    onboardingTiles.find((t) => t.selected) || onboardingTiles[3];
  const mgr3 = stageTasks.find((t) => t.id === 'mgr-3');
  const role3 = stageTasks.find((t) => t.id === 'role-3');

  const isParticipantActive = (pId: string | null | undefined) => {
    if (!selectedParticipantId) return true;
    return pId === selectedParticipantId;
  };

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1110 296"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 2,
        overflow: 'visible',
      }}
    >
      <defs>
        <marker
          id="ajb-dark-arrow"
          viewBox="0 0 10 10"
          refX="7"
          refY="5"
          markerWidth="5.5"
          markerHeight="5.5"
          orient="auto-start-reverse"
        >
          <path
            d="M 1 1.5 L 8.5 5 L 1 8.5"
            fill="none"
            stroke="#18191C"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </marker>
      </defs>

      {/* Stage 1 -> Stage 2 Connectors */}
      {allocationCards.map((alloc) => {
        const y1 = allocY[alloc.id] ?? 89;
        const active = isParticipantActive(alloc.participantId);
        return alloc.targetTaskIds.map((targetId, idx) => {
          const y2 = roleY[targetId] ?? 51;
          const targetTask = stageTasks.find((t) => t.id === targetId);
          const isBlue = targetTask
            ? targetTask.incomingTone === 'blue'
            : alloc.connectorTone === 'blue';
          const isDashed = targetTask
            ? targetTask.incomingDashed
            : alloc.connectorDashed;
          const strokeColor = isBlue ? '#8FA8E0' : '#D96B70';

          return (
            <path
              key={`${alloc.id}->${targetId}`}
              d={buildSmoothSpline(218, y1, 278, y2, idx === 0 ? -4 : 4)}
              fill="none"
              stroke={strokeColor}
              strokeWidth={active ? 1.65 : 1.25}
              strokeDasharray={isDashed ? '3.5 3.5' : undefined}
              strokeLinecap="round"
              style={{
                opacity: active ? 0.92 : 0.25,
                transition: 'opacity 220ms ease, stroke 220ms ease',
              }}
            />
          );
        });
      })}

      {/* Stage 2 -> Stage 3 Connectors (including Seq 06 dynamic assignment update) */}
      {/* role-1 -> mgr-1 (solid periwinkle) */}
      <path
        d={buildSmoothSpline(512, roleY['role-1'], 572, mgrY['mgr-1'], -3)}
        fill="none"
        stroke="#8FA8E0"
        strokeWidth="1.65"
        strokeLinecap="round"
        style={{
          opacity:
            selectedParticipantId && selectedParticipantId !== 'p-1'
              ? 0.3
              : 0.92,
        }}
      />

      {/* role-2 -> mgr-2 (dashed coral) */}
      <path
        d={buildSmoothSpline(512, roleY['role-2'], 572, mgrY['mgr-2'], 2)}
        fill="none"
        stroke="#D96B70"
        strokeWidth="1.5"
        strokeDasharray="3.5 3.5"
        strokeLinecap="round"
        style={{ opacity: selectedParticipantId ? 0.35 : 0.85 }}
      />

      {/* role-3 -> mgr-3 & mgr-4 (turns solid blue on mgr-3 once assigned in Seq 06) */}
      <path
        d={buildSmoothSpline(512, roleY['role-3'], 572, mgrY['mgr-3'], -2)}
        fill="none"
        stroke={mgr3?.incomingTone === 'blue' ? '#8FA8E0' : '#D96B70'}
        strokeWidth="1.65"
        strokeDasharray={mgr3?.incomingDashed ? '3.5 3.5' : undefined}
        strokeLinecap="round"
        style={{
          opacity:
            !selectedParticipantId ||
            selectedParticipantId === mgr3?.assignedParticipantId ||
            selectedParticipantId === role3?.assignedParticipantId
              ? 0.95
              : 0.3,
          transition: 'stroke 240ms ease, opacity 240ms ease',
        }}
      />

      <path
        d={buildSmoothSpline(512, roleY['role-3'], 572, mgrY['mgr-4'], 5)}
        fill="none"
        stroke="#D96B70"
        strokeWidth="1.5"
        strokeDasharray="3.5 3.5"
        strokeLinecap="round"
        style={{ opacity: selectedParticipantId ? 0.3 : 0.82 }}
      />

      {/* role-5 -> mgr-5 (subtle dashed coral link for bottom row) */}
      <path
        d={buildSmoothSpline(512, roleY['role-5'], 572, mgrY['mgr-5'], 0)}
        fill="none"
        stroke="#D96B70"
        strokeWidth="1.4"
        strokeDasharray="3.5 3.5"
        strokeLinecap="round"
        style={{ opacity: selectedParticipantId ? 0.25 : 0.72 }}
      />

      {/* Stage 3 (mgr-3: Estimate Resolution Time) -> Stage 4 Selected Tile (Request Processing) */}
      {selectedTile &&
        (() => {
          const x1 = 806;
          const y1 = mgrY['mgr-3'];
          const target = tilePos[selectedTile.id] || tilePos['tile-4'];

          if (connectorVariant === 'static_solid_dark') {
            // Exact match to static reference image (f=0909): crisp dark diagonal line with arrow into bottom-left of Request Processing
            return (
              <path
                d={`M ${x1} ${y1} L ${target.x - 4} ${target.y}`}
                fill="none"
                stroke="#18191C"
                strokeWidth="1.65"
                strokeLinecap="round"
                markerEnd="url(#ajb-dark-arrow)"
              />
            );
          }

          // Exact match to settled video frame (f=0950): routed dashed coral spline from mgr-3 to bottom-left of Request Processing
          const midX = x1 + 30;
          const dropY = target.y + 16;
          return (
            <path
              d={`M ${x1} ${y1} L ${midX} ${y1} Q ${midX + 10} ${y1} ${midX + 10} ${y1 + 10} L ${midX + 10} ${dropY - 8} Q ${midX + 10} ${dropY} ${midX + 18} ${dropY} L ${target.x - 14} ${dropY} Q ${target.x - 4} ${dropY} ${target.x - 4} ${target.y}`}
              fill="none"
              stroke="#D96B70"
              strokeWidth="1.6"
              strokeDasharray="3.5 3.5"
              strokeLinecap="round"
            />
          );
        })()}
    </svg>
  );
};
