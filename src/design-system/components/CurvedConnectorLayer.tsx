import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  AllocationCardData,
  OnboardingActionTileData,
  StageTaskRowData,
} from '../../data/syntheticStarters';
import { ConnectorRenderVariant } from '../../state/useStarterStore';

export interface CurvedConnectorLayerProps {
  containerRef?: React.RefObject<HTMLElement | null>;
  allocationCards: AllocationCardData[];
  stageTasks: StageTaskRowData[];
  onboardingTiles: OnboardingActionTileData[];
  selectedParticipantId: string | null;
  connectorVariant: ConnectorRenderVariant;
  /** Optional animation phase override from the Motion Choreography Engine */
  choreographyPhase?:
    | 'idle'
    | 'seq05_stagger'
    | 'seq06_drag'
    | 'seq06_solidify'
    | 'seq07_arrow'
    | 'seq07_press'
    | 'seq07_dashed';
  /** Key counter to re-trigger SVG stroke-dashoffset draw animations */
  animationTriggerKey?: number;
}

interface ComputedPath {
  id: string;
  d: string;
  color: string;
  dashed: boolean;
  strokeWidth: number;
  highlighted: boolean;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  hasArrowhead?: boolean;
  isStage3To4?: boolean;
  solidifying?: boolean;
  staggerIndex: number;
}

/**
 * Builds the 1:1 stepped orthogonal path with smooth rounded corners (quadratic Bézier 90° bends)
 * matching reference_image_uploaded.webp and Reference Video Frame f=0909.
 */
function buildSteppedRoundedPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  midRatio = 0.5,
  cornerRadius = 8
): string {
  const dy = y2 - y1;
  if (Math.abs(dy) < 5) {
    return `M ${x1.toFixed(1)} ${y1.toFixed(1)} L ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  }
  const midX = x1 + (x2 - x1) * midRatio;
  const r = Math.max(
    2,
    Math.min(
      cornerRadius,
      Math.abs(dy) / 2,
      Math.abs(midX - x1) * 0.82,
      Math.abs(x2 - midX) * 0.82
    )
  );
  const dirY = dy >= 0 ? 1 : -1;
  return [
    `M ${x1.toFixed(1)} ${y1.toFixed(1)}`,
    `L ${(midX - r).toFixed(1)} ${y1.toFixed(1)}`,
    `Q ${midX.toFixed(1)} ${y1.toFixed(1)} ${midX.toFixed(1)} ${(y1 + dirY * r).toFixed(1)}`,
    `L ${midX.toFixed(1)} ${(y2 - dirY * r).toFixed(1)}`,
    `Q ${midX.toFixed(1)} ${y2.toFixed(1)} ${(midX + r).toFixed(1)} ${y2.toFixed(1)}`,
    `L ${x2.toFixed(1)} ${y2.toFixed(1)}`,
  ].join(' ');
}

export const CurvedConnectorLayer: React.FC<CurvedConnectorLayerProps> = ({
  containerRef,
  allocationCards,
  stageTasks,
  onboardingTiles,
  selectedParticipantId,
  connectorVariant,
  choreographyPhase = 'idle',
  animationTriggerKey = 0,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [paths, setPaths] = useState<ComputedPath[]>([]);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: 1120,
    height: 310,
  });

  const recomputePaths = useCallback(() => {
    const container = containerRef?.current ?? svgRef.current?.parentElement ?? null;
    if (!container) return;

    const cRect = container.getBoundingClientRect();
    if (cRect.width === 0 || cRect.height === 0) return;

    setDimensions({ width: cRect.width, height: cRect.height });

    const nextPaths: ComputedPath[] = [];
    let staggerIdx = 0;

    // 1. Stage 1 (Allocation Cards) -> Stage 2 (Role & Access Tasks)
    for (const alloc of allocationCards) {
      const sourceEl = container.querySelector(
        `[data-port-out="${alloc.id}"]`
      ) as HTMLElement | null;
      if (!sourceEl) continue;
      const sRect = sourceEl.getBoundingClientRect();
      const x1 = sRect.left + sRect.width / 2 - cRect.left;
      const y1 = sRect.top + sRect.height / 2 - cRect.top;

      for (const targetId of alloc.targetTaskIds) {
        const targetEl = container.querySelector(
          `[data-port-in="${targetId}"]`
        ) as HTMLElement | null;
        if (!targetEl) continue;
        const tRect = targetEl.getBoundingClientRect();
        const x2 = tRect.left + tRect.width / 2 - cRect.left;
        const y2 = tRect.top + tRect.height / 2 - cRect.top;

        const d = buildSteppedRoundedPath(x1, y1, x2, y2, 0.5, 8);

        const targetTask = stageTasks.find((t) => t.id === targetId);
        const isHighlighted =
          !selectedParticipantId ||
          alloc.participantId === selectedParticipantId ||
          targetTask?.assignedParticipantId === selectedParticipantId;

        nextPaths.push({
          id: `${alloc.id}->${targetId}`,
          d,
          color: alloc.connectorTone === 'blue' ? '#8FA8E0' : '#D96B70',
          dashed: alloc.connectorDashed,
          strokeWidth: isHighlighted ? 1.85 : 1.35,
          highlighted: isHighlighted,
          startX: x1,
          startY: y1,
          endX: x2,
          endY: y2,
          staggerIndex: staggerIdx++,
        });
      }
    }

    // 2. Stage 2 (Role & Access Profile) -> Stage 3 (Manager Review)
    const stage2Tasks = stageTasks.filter((t) => t.stageId === 'role_access_profile');
    for (const s2 of stage2Tasks) {
      const sourceEl = container.querySelector(
        `[data-port-out="${s2.id}"]`
      ) as HTMLElement | null;
      if (!sourceEl) continue;
      const sRect = sourceEl.getBoundingClientRect();
      const x1 = sRect.left + sRect.width / 2 - cRect.left;
      const y1 = sRect.top + sRect.height / 2 - cRect.top;

      for (const targetId of s2.targetTaskIds) {
        const targetEl = container.querySelector(
          `[data-port-in="${targetId}"]`
        ) as HTMLElement | null;
        if (!targetEl) continue;
        const tRect = targetEl.getBoundingClientRect();
        const x2 = tRect.left + tRect.width / 2 - cRect.left;
        const y2 = tRect.top + tRect.height / 2 - cRect.top;

        const midRatio = s2.id === 'role-1' && targetId === 'mgr-2' ? 0.48 : 0.5;
        const d = buildSteppedRoundedPath(x1, y1, x2, y2, midRatio, 8);

        const targetTask = stageTasks.find((t) => t.id === targetId);
        // During seq06_drag (before drop), show role-3 -> mgr-3 as dashed coral, then solidify to blue on seq06_solidify!
        const isRole3ToMgr3 = s2.id === 'role-3' && targetId === 'mgr-3';
        let isSolidBlue =
          targetTask?.incomingTone === 'blue' && !targetTask.incomingDashed;
        if (isRole3ToMgr3 && choreographyPhase === 'seq06_drag') {
          isSolidBlue = false;
        } else if (isRole3ToMgr3 && choreographyPhase === 'seq06_solidify') {
          isSolidBlue = true;
        }

        const isHighlighted =
          !selectedParticipantId ||
          s2.assignedParticipantId === selectedParticipantId ||
          targetTask?.assignedParticipantId === selectedParticipantId;

        nextPaths.push({
          id: `${s2.id}->${targetId}`,
          d,
          color: isSolidBlue ? '#8FA8E0' : '#D96B70',
          dashed: !isSolidBlue,
          strokeWidth: isSolidBlue ? 2.15 : 1.75,
          highlighted: isHighlighted,
          startX: x1,
          startY: y1,
          endX: x2,
          endY: y2,
          solidifying: isRole3ToMgr3 && choreographyPhase === 'seq06_solidify',
          staggerIndex: staggerIdx++,
        });
      }
    }

    // 3. Stage 3 (Manager Review) -> Stage 4 (Ready for Onboarding / New Tasks 2x3 Grid)
    // Hide during seq05_stagger and seq06_drag so Seq 07 visibly draws it in!
    const hideStage3To4 =
      choreographyPhase === 'seq05_stagger' || choreographyPhase === 'seq06_drag';

    if (!hideStage3To4) {
      const selectedTile =
        onboardingTiles.find((t) => t.selected) || onboardingTiles[0];
      const stage3Tasks = stageTasks.filter((t) => t.stageId === 'manager_review');

      for (const s3 of stage3Tasks) {
        if (s3.targetTaskIds.length === 0) continue;
        const sourceEl = container.querySelector(
          `[data-port-out="${s3.id}"]`
        ) as HTMLElement | null;
        if (!sourceEl) continue;
        const sRect = sourceEl.getBoundingClientRect();
        const x1 = sRect.left + sRect.width / 2 - cRect.left;
        const y1 = sRect.top + sRect.height / 2 - cRect.top;

        for (const rawTargetId of s3.targetTaskIds) {
          const targetId = s3.id === 'mgr-3' && selectedTile ? selectedTile.id : rawTargetId;
          const targetEl = container.querySelector(
            `[data-port-in="${targetId}"]`
          ) as HTMLElement | null;
          if (!targetEl) continue;
          const tRect = targetEl.getBoundingClientRect();
          const x2 = tRect.left + tRect.width / 2 - cRect.left;
          const y2 = tRect.top + tRect.height / 2 - cRect.top;

          const useDashedCoral =
            choreographyPhase === 'seq07_dashed' ||
            (choreographyPhase === 'idle' && connectorVariant === 'video_dashed_coral');

          let d = '';
          if (!useDashedCoral) {
            // Exact straight/gentle diagonal dark arrow from Estimate Resolution Time (mgr-3)
            // up-and-right into the bottom-left socket of Request Processing (tile-1),
            // matching reference_image_uploaded.webp and Seq 07 f=0895..0913
            d = `M ${x1.toFixed(1)} ${y1.toFixed(1)} L ${(x2 - 2).toFixed(1)} ${(y2 + 2).toFixed(1)}`;
          } else {
            // Video frame f=0925..0961 stepped/routed dashed coral spline
            d = buildSteppedRoundedPath(x1, y1, x2, y2, 0.46, 9);
          }

          const isHighlighted =
            !selectedParticipantId || s3.assignedParticipantId === selectedParticipantId;

          nextPaths.push({
            id: `${s3.id}->${targetId}-${useDashedCoral ? 'coral' : 'dark'}`,
            d,
            color: useDashedCoral ? '#D96B70' : '#18191C',
            dashed: useDashedCoral,
            strokeWidth: useDashedCoral ? 1.85 : 1.75,
            highlighted: isHighlighted,
            startX: x1,
            startY: y1,
            endX: x2,
            endY: y2,
            hasArrowhead: !useDashedCoral,
            isStage3To4: true,
            staggerIndex: staggerIdx++,
          });
        }
      }
    }

    setPaths(nextPaths);
  }, [
    containerRef,
    allocationCards,
    stageTasks,
    onboardingTiles,
    selectedParticipantId,
    connectorVariant,
    choreographyPhase,
  ]);

  useEffect(() => {
    recomputePaths();
    const timer = window.setTimeout(recomputePaths, 60);
    const timer2 = window.setTimeout(recomputePaths, 240);
    window.addEventListener('resize', recomputePaths);
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(timer2);
      window.removeEventListener('resize', recomputePaths);
    };
  }, [recomputePaths, animationTriggerKey]);

  return (
    <svg
      ref={svgRef}
      key={animationTriggerKey}
      data-connector-svg="true"
      aria-hidden="true"
      width={dimensions.width}
      height={dimensions.height}
      viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 4,
        overflow: 'visible',
      }}
    >
      <defs>
        <linearGradient id="ajb-periwinkle-stroke-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#9AB2E8" />
          <stop offset="100%" stopColor="#839CD8" />
        </linearGradient>
        <linearGradient id="ajb-coral-stroke-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#E2787D" />
          <stop offset="100%" stopColor="#D35F65" />
        </linearGradient>
        <marker
          id="ref-dark-arrowhead"
          viewBox="0 0 10 10"
          refX="7.5"
          refY="5"
          markerWidth="5.5"
          markerHeight="5.5"
          orient="auto-start-reverse"
        >
          <path d="M 1 1.5 L 8.5 5 L 1 8.5 z" fill="#18191C" />
        </marker>
      </defs>

      {paths.map((p) => {
        const shouldAnimateDraw =
          !p.dashed &&
          (choreographyPhase === 'idle' ||
            choreographyPhase === 'seq05_stagger' ||
            (p.solidifying && choreographyPhase === 'seq06_solidify') ||
            (p.isStage3To4 &&
              (choreographyPhase === 'seq07_arrow' || choreographyPhase === 'seq07_dashed')));

        return (
          <g
            key={p.id}
            style={{
              opacity: p.highlighted ? 1 : 0.24,
              transition: 'opacity var(--ajb-duration-hover) var(--ajb-ease-standard)',
            }}
          >
            {/* Subtle luminous glow under solidifying or active solid paths */}
            {(!p.dashed || p.solidifying) && (
              <path
                d={p.d}
                fill="none"
                stroke={
                  p.color === '#8FA8E0'
                    ? 'url(#ajb-periwinkle-stroke-grad)'
                    : p.color === '#D96B70'
                      ? 'url(#ajb-coral-stroke-grad)'
                      : p.color
                }
                strokeWidth={p.solidifying ? 6.5 : 4.2}
                strokeOpacity={p.solidifying ? 0.30 : 0.14}
                strokeLinecap="round"
              />
            )}

            <path
              d={p.d}
              fill="none"
              stroke={p.color}
              strokeWidth={p.strokeWidth}
              strokeDasharray={p.dashed ? '4 4' : shouldAnimateDraw ? '320' : undefined}
              strokeLinecap="round"
              strokeLinejoin="round"
              markerEnd={p.hasArrowhead ? 'url(#ref-dark-arrowhead)' : undefined}
              className={
                shouldAnimateDraw
                  ? 'ref-connector-draw'
                  : p.dashed
                    ? 'ref-connector-dashed-flow'
                    : undefined
              }
              style={{
                animationDelay:
                  choreographyPhase === 'seq05_stagger' ? `${p.staggerIndex * 38}ms` : '0ms',
                transition:
                  'stroke var(--ajb-duration-connector) var(--ajb-ease-standard), stroke-width var(--ajb-duration-hover) var(--ajb-ease-standard)',
              }}
            />

            {/* Endpoint anchor dots on connector sockets */}
            <circle
              cx={p.startX}
              cy={p.startY}
              r={2.8}
              fill={p.color}
              style={{
                transition: 'fill var(--ajb-duration-connector) var(--ajb-ease-standard)',
              }}
            />
            {!p.hasArrowhead && (
              <circle
                cx={p.endX}
                cy={p.endY}
                r={2.8}
                fill={p.color}
                style={{
                  transition: 'fill var(--ajb-duration-connector) var(--ajb-ease-standard)',
                }}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
};

