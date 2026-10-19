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
      const x1 = sRect.left + sRect.width / 2 - cRect.left + 3.5;
      const y1 = sRect.top + sRect.height / 2 - cRect.top;

      const stage1MidRatio = alloc.id === 'alloc-1' ? 0.42 : 0.64;

      for (const targetId of alloc.targetTaskIds) {
        const targetEl = container.querySelector(
          `[data-port-in="${targetId}"]`
        ) as HTMLElement | null;
        if (!targetEl) continue;
        const tRect = targetEl.getBoundingClientRect();
        const x2 = tRect.left + tRect.width / 2 - cRect.left - 4;
        const y2 = tRect.top + tRect.height / 2 - cRect.top;

        const d = buildSteppedRoundedPath(x1, y1, x2, y2, stage1MidRatio, 8);

        const targetTask = stageTasks.find((t) => t.id === targetId);
        const isHighlighted =
          !selectedParticipantId ||
          alloc.participantId === selectedParticipantId ||
          targetTask?.assignedParticipantId === selectedParticipantId;

        nextPaths.push({
          id: `${alloc.id}->${targetId}`,
          d,
          color: alloc.connectorTone === 'blue' ? '#E81A41' : '#B00054',
          dashed: alloc.connectorDashed,
          strokeWidth: isHighlighted ? 1.85 : 1.35,
          highlighted: isHighlighted,
          startX: x1,
          startY: y1,
          endX: x2,
          endY: y2,
          hasArrowhead: true,
          staggerIndex: staggerIdx++,
        });
      }
    }

    // 1b. Stage 1 vertical continuation from alloc-1 trunk down into alloc-2 socket (Matches reference frames)
    if (allocationCards.length >= 2) {
      const alloc1El = container.querySelector(
        `[data-port-out="${allocationCards[0].id}"]`
      ) as HTMLElement | null;
      const alloc2El = container.querySelector(
        `[data-port-out="${allocationCards[1].id}"]`
      ) as HTMLElement | null;
      const role3El = container.querySelector(`[data-port-in="role-3"]`) as HTMLElement | null;
      if (alloc1El && alloc2El && role3El) {
        const a1Rect = alloc1El.getBoundingClientRect();
        const a2Rect = alloc2El.getBoundingClientRect();
        const r3Rect = role3El.getBoundingClientRect();
        const x1 = a1Rect.left + a1Rect.width / 2 - cRect.left + 3.5;
        const x2 = r3Rect.left + r3Rect.width / 2 - cRect.left - 4;
        const trunkX = x1 + (x2 - x1) * 0.42;
        const startY = r3Rect.top + r3Rect.height / 2 - cRect.top;
        const endX = a2Rect.left + a2Rect.width / 2 - cRect.left + 3.5;
        const endY = a2Rect.top + a2Rect.height / 2 - cRect.top;
        const r = 7;
        const dTrunkLink = [
          `M ${trunkX.toFixed(1)} ${startY.toFixed(1)}`,
          `L ${trunkX.toFixed(1)} ${(endY - r).toFixed(1)}`,
          `Q ${trunkX.toFixed(1)} ${endY.toFixed(1)} ${(trunkX - r).toFixed(1)} ${endY.toFixed(1)}`,
          `L ${endX.toFixed(1)} ${endY.toFixed(1)}`,
        ].join(' ');
        nextPaths.push({
          id: `alloc-1->alloc-2-link`,
          d: dTrunkLink,
          color: '#E81A41',
          dashed: false,
          strokeWidth: 1.75,
          highlighted: !selectedParticipantId,
          startX: trunkX,
          startY,
          endX,
          endY,
          hasArrowhead: false,
          staggerIndex: staggerIdx++,
        });
      }
    }

    // 2. Stage 2 (Role & Access Profile) -> Stage 3 (Manager Review)
    // Dual-lane vertical trunk routing matching reference frames:
    // Lane 1 (midRatio 0.36): role-1 -> mgr-3, role-2 -> mgr-3, role-4 -> mgr-3
    // Lane 2 (midRatio 0.66): role-3 -> mgr-1, role-3 -> mgr-2, role-5 -> mgr-4, role-5 -> mgr-5
    const stage2Tasks = stageTasks.filter((t) => t.stageId === 'role_access_profile');
    for (const s2 of stage2Tasks) {
      const sourceEl = container.querySelector(
        `[data-port-out="${s2.id}"]`
      ) as HTMLElement | null;
      if (!sourceEl) continue;
      const sRect = sourceEl.getBoundingClientRect();
      const x1 = sRect.left + sRect.width / 2 - cRect.left + 3.5;
      const y1 = sRect.top + sRect.height / 2 - cRect.top;

      for (const targetId of s2.targetTaskIds) {
        const targetEl = container.querySelector(
          `[data-port-in="${targetId}"]`
        ) as HTMLElement | null;
        if (!targetEl) continue;
        const tRect = targetEl.getBoundingClientRect();
        const x2 = tRect.left + tRect.width / 2 - cRect.left - 4;
        const y2 = tRect.top + tRect.height / 2 - cRect.top;

        const isLane1 =
          s2.id === 'role-1' || s2.id === 'role-2' || s2.id === 'role-4';
        const midRatio = isLane1 ? 0.36 : 0.66;
        const d = buildSteppedRoundedPath(x1, y1, x2, y2, midRatio, 8);

        const targetTask = stageTasks.find((t) => t.id === targetId);
        const isRole4ToMgr3 = s2.id === 'role-4' && targetId === 'mgr-3';
        const isPrimaryBranch =
          s2.id === 'role-1' || s2.id === 'role-2' || s2.id === 'role-3';

        // In reference video:
        // - role-1, role-2 -> mgr-3 and role-3 -> mgr-1, mgr-2 are always solid primary (#E81A41)
        // - role-4 -> mgr-3 is dashed secondary (#B00054) during seq05_stagger & seq06_drag (f=0740..0801),
        //   then solidifies to solid secondary (#B00054) on seq06_solidify / idle (f=0809..0950 & static reference)!
        // - role-5 -> mgr-4, mgr-5 are dashed secondary (#B00054)
        const isDashed = isPrimaryBranch
          ? false
          : isRole4ToMgr3
            ? choreographyPhase === 'seq05_stagger' || choreographyPhase === 'seq06_drag'
            : true;

        const strokeColor = isPrimaryBranch ? '#E81A41' : '#B00054';

        const isHighlighted =
          !selectedParticipantId ||
          s2.assignedParticipantId === selectedParticipantId ||
          targetTask?.assignedParticipantId === selectedParticipantId;

        nextPaths.push({
          id: `${s2.id}->${targetId}`,
          d,
          color: strokeColor,
          dashed: isDashed,
          strokeWidth: !isDashed ? 2.0 : 1.75,
          highlighted: isHighlighted,
          startX: x1,
          startY: y1,
          endX: x2,
          endY: y2,
          hasArrowhead: !isDashed,
          solidifying: isRole4ToMgr3 && choreographyPhase === 'seq06_solidify',
          staggerIndex: staggerIdx++,
        });
      }
    }

    // 3. Stage 3 (Manager Review) -> Stage 4 (Ready for Onboarding / New Tasks 2x3 Grid)
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
      const x1 = sRect.left + sRect.width / 2 - cRect.left + 3.5;
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
          // matching reference_image_uploaded.webp and Seq 07 f=0895..0915
          d = `M ${x1.toFixed(1)} ${y1.toFixed(1)} L ${(x2 - 2).toFixed(1)} ${(y2 + 2).toFixed(1)}`;
        } else {
          // Video frame f=0925..0961 stepped/routed dashed spline
          d = buildSteppedRoundedPath(x1, y1, x2, y2, 0.46, 9);
        }

        const isHighlighted =
          !selectedParticipantId || s3.assignedParticipantId === selectedParticipantId;

        nextPaths.push({
          id: `${s3.id}->${targetId}-${useDashedCoral ? 'coral' : 'dark'}`,
          d,
          color: useDashedCoral ? '#B00054' : '#5D0A1A',
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
          <stop offset="0%" stopColor="#F2385A" />
          <stop offset="100%" stopColor="#E81A41" />
        </linearGradient>
        <linearGradient id="ajb-coral-stroke-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C81469" />
          <stop offset="100%" stopColor="#970148" />
        </linearGradient>
        <marker
          id="ref-primary-chevron"
          viewBox="0 0 8 8"
          refX="6.2"
          refY="4"
          markerWidth="4.5"
          markerHeight="4.5"
          orient="auto"
        >
          <path
            d="M 1.5 1.2 L 6.5 4 L 1.5 6.8"
            fill="none"
            stroke="#E81A41"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </marker>
        <marker
          id="ref-secondary-chevron"
          viewBox="0 0 8 8"
          refX="6.2"
          refY="4"
          markerWidth="4.5"
          markerHeight="4.5"
          orient="auto"
        >
          <path
            d="M 1.5 1.2 L 6.5 4 L 1.5 6.8"
            fill="none"
            stroke="#B00054"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </marker>
        <marker
          id="ref-dark-arrowhead"
          viewBox="0 0 10 10"
          refX="7.5"
          refY="5"
          markerWidth="5.5"
          markerHeight="5.5"
          orient="auto-start-reverse"
        >
          <path d="M 1 1.5 L 8.5 5 L 1 8.5 z" fill="#5D0A1A" />
        </marker>
      </defs>

      {paths.map((p) => {
        const hideStage3To4 =
          p.isStage3To4 &&
          (choreographyPhase === 'seq05_stagger' ||
            choreographyPhase === 'seq06_drag' ||
            choreographyPhase === 'seq06_solidify');

        const shouldAnimateDraw =
          !p.dashed &&
          (choreographyPhase === 'idle' ||
            choreographyPhase === 'seq05_stagger' ||
            (p.solidifying && choreographyPhase === 'seq06_solidify') ||
            (p.isStage3To4 &&
              (choreographyPhase === 'seq07_arrow' || choreographyPhase === 'seq07_dashed')));

        const markerEndUrl = !p.hasArrowhead
          ? undefined
          : p.isStage3To4
            ? 'url(#ref-dark-arrowhead)'
            : p.color === '#E81A41'
              ? 'url(#ref-primary-chevron)'
              : 'url(#ref-secondary-chevron)';

        return (
          <g
            key={p.id}
            style={{
              opacity: hideStage3To4 ? 0 : p.highlighted ? 1 : 0.24,
              transition: 'opacity var(--ajb-duration-hover) var(--ajb-ease-standard)',
            }}
          >
            {/* Subtle luminous glow under solidifying or active solid paths */}
            {(!p.dashed || p.solidifying) && (
              <path
                d={p.d}
                fill="none"
                stroke={
                  p.color === '#E81A41'
                    ? 'url(#ajb-periwinkle-stroke-grad)'
                    : p.color === '#B00054'
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
              markerEnd={markerEndUrl}
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
          </g>
        );
      })}
    </svg>
  );
};

