import React, { useState, useEffect } from 'react';
import { ArrowLeft, Sun, Moon, Layers } from 'lucide-react';
import { REFERENCE_OPERATIONS_TOKENS } from '../design-system/tokens';
import {
  OverlappingAvatarCluster,
  StatusPillBadge,
  ConicProgressRing,
} from '../design-system/components/AvatarAndStatus';
import {
  TopNavigationBar,
} from '../design-system/components/NavigationShell';
import {
  AllocationStageCard,
  CompactTaskRowCard,
  ActionTileCard,
  PipelineRowCard,
  ProgressGridCard,
} from '../design-system/components/WorkflowCards';
import { CurvedConnectorLayer } from '../design-system/components/CurvedConnectorLayer';
import { DetailModal } from '../design-system/components/DetailModal';
import {
  SuggestedKnowledgeTable,
  SupportTicketJourneyCard,
  WorkflowFilterBar,
} from '../design-system/components/TablesAndMetrics';
import { useStarterStore } from '../state/useStarterStore';

export interface GalleryPageProps {
  onNavigateToPrototype: () => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ onNavigateToPrototype }) => {
  const store = useStarterStore();
  const { state } = store;

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (document.documentElement.getAttribute('data-theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem('ajb-theme', theme);
    } catch {
      // Ignore storage restrictions
    }
  }, [theme]);

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '28px 36px 64px',
        maxWidth: '1440px',
        margin: '0 auto',
        color: 'var(--ajb-text-primary)',
      }}
    >
      {/* Top Gallery Banner */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px',
          padding: '20px 26px',
          borderRadius: '28px',
          background: 'var(--ajb-surface-shell)',
          backdropFilter: 'blur(20px)',
          border: '1px solid var(--ajb-border-subtle)',
          boxShadow: 'var(--ajb-shadow-shell)',
          marginBottom: '28px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            type="button"
            onClick={onNavigateToPrototype}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '9px 16px',
              borderRadius: '9999px',
              border: '1px solid var(--ajb-border-subtle)',
              background: 'var(--ajb-surface-card)',
              color: 'var(--ajb-text-primary)',
              fontSize: '12px',
              fontWeight: 500,
              cursor: 'pointer',
              boxShadow: 'var(--ajb-shadow-pill)',
            }}
          >
            <ArrowLeft size={14} />
            Back to Operations Prototype (/)
          </button>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: '22px',
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                }}
              >
                Reference Operations v1
              </h1>
              <span
                style={{
                  padding: '3px 10px',
                  borderRadius: '9999px',
                  background: 'var(--ajb-accent-black)',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: 500,
                }}
              >
                v{REFERENCE_OPERATIONS_TOKENS.version} · Shared Component Registry
              </span>
            </div>
            <p
              style={{
                margin: '4px 0 0',
                fontSize: '12px',
                color: 'var(--ajb-text-secondary)',
              }}
            >
              Reusable design system tokens and live interactive components shared 1:1 with the AJ Bell New Starter Operations Prototype. Synthetic demonstration data only.
            </p>
          </div>
        </div>

        {/* Controls: Label Mode + Separate Dark Adaptation Switch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() =>
              store.setLabelMode(
                state.labelMode === 'operations' ? 'reference' : 'operations'
              )
            }
            style={{
              padding: '8px 14px',
              borderRadius: '9999px',
              border: '1px solid var(--ajb-border-subtle)',
              background: 'var(--ajb-surface-card)',
              color: 'var(--ajb-text-primary)',
              fontSize: '11.5px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Labels: {state.labelMode === 'operations' ? 'Operations (New Starter)' : 'Reference 1:1'}
          </button>

          <button
            type="button"
            onClick={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              padding: '8px 16px',
              borderRadius: '9999px',
              border: '1px solid var(--ajb-border-subtle)',
              background:
                theme === 'dark' ? 'var(--ajb-accent-black)' : 'var(--ajb-surface-card)',
              color: theme === 'dark' ? '#FFFFFF' : 'var(--ajb-text-primary)',
              fontSize: '11.5px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            {theme === 'light' ? <Sun size={14} /> : <Moon size={14} />}
            {theme === 'light'
              ? 'Light Reference (Primary)'
              : 'Dark Adaptation (Experimental Adaptation)'}
          </button>
        </div>
      </header>

      {theme === 'dark' && (
        <div
          role="note"
          style={{
            padding: '12px 18px',
            borderRadius: '16px',
            background: 'rgba(143, 168, 224, 0.16)',
            border: '1px solid var(--ajb-border-strong)',
            marginBottom: '22px',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>
            <strong>Dark Presentation Adaptation:</strong> The supplied reference image and video use the soft silver-grey Light Reference palette first. This dark mode is kept separate and clearly identified as an adaptation.
          </span>
          <button
            type="button"
            onClick={() => setTheme('light')}
            style={{
              padding: '5px 12px',
              borderRadius: '9999px',
              border: '1px solid var(--ajb-border-strong)',
              background: 'var(--ajb-surface-card)',
              color: 'var(--ajb-text-primary)',
              fontSize: '11px',
              cursor: 'pointer',
            }}
          >
            Restore Light Reference
          </button>
        </div>
      )}

      {/* SECTION 1: VERSIONED DESIGN TOKENS */}
      <section
        aria-labelledby="gallery-tokens-heading"
        style={{
          padding: '24px 28px',
          borderRadius: '28px',
          background: 'var(--ajb-surface-shell)',
          border: '1px solid var(--ajb-border-subtle)',
          boxShadow: 'var(--ajb-shadow-card)',
          marginBottom: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <Layers size={18} />
          <h2 id="gallery-tokens-heading" style={{ margin: 0, fontSize: '17px', fontWeight: 600 }}>
            1. Versioned Design Tokens (Colour, Typography, Spacing, Radius, Elevation & Motion)
          </h2>
        </div>

        {/* Colour Swatches */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))',
            gap: '12px',
            marginBottom: '20px',
          }}
        >
          {[
            { name: 'canvasOuter', hex: REFERENCE_OPERATIONS_TOKENS.color.light.canvasOuter, desc: 'Soft Silver-Grey Canvas' },
            { name: 'surfaceCard', hex: '#F7F8FA', desc: 'Pale Floating Panel' },
            { name: 'accentBlack', hex: REFERENCE_OPERATIONS_TOKENS.color.light.accentBlack, desc: 'Selected Action State' },
            { name: 'accentPeriwinkle', hex: REFERENCE_OPERATIONS_TOKENS.color.light.accentPeriwinkle, desc: 'Primary Connector / Badge' },
            { name: 'accentCoral', hex: REFERENCE_OPERATIONS_TOKENS.color.light.accentCoral, desc: 'Dashed Connector / Alert' },
            { name: 'statusExecuted', hex: REFERENCE_OPERATIONS_TOKENS.color.light.statusExecuted, desc: 'Executed Status Dot' },
            { name: 'statusScheduled', hex: REFERENCE_OPERATIONS_TOKENS.color.light.statusScheduled, desc: 'Scheduled Status Dot' },
          ].map((sw) => (
            <div
              key={sw.name}
              style={{
                padding: '12px',
                borderRadius: '18px',
                background: 'var(--ajb-surface-card)',
                border: '1px solid var(--ajb-border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <span
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '12px',
                  background: sw.hex,
                  border: '1px solid rgba(18,22,33,0.12)',
                  flexShrink: 0,
                }}
              />
              <div>
                <div style={{ fontSize: '11.5px', fontWeight: 600 }}>{sw.name}</div>
                <div className="ajb-tabular" style={{ fontSize: '10.5px', color: 'var(--ajb-text-secondary)' }}>
                  {sw.hex}
                </div>
                <div style={{ fontSize: '9.5px', color: 'var(--ajb-text-muted)' }}>{sw.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Motion & Geometry Token Summary Table */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '14px',
          }}
        >
          <div
            style={{
              padding: '14px 16px',
              borderRadius: '18px',
              background: 'var(--ajb-surface-card)',
              border: '1px solid var(--ajb-border-subtle)',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>
              Measured Video Motion Tokens (60.00 fps CFR)
            </div>
            <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11px', lineHeight: 1.65, color: 'var(--ajb-text-secondary)' }}>
              <li><strong>hoverFlip:</strong> <code>{REFERENCE_OPERATIONS_TOKENS.motion.duration.hoverFlip}</code> (Seq 01 black CTA flip)</li>
              <li><strong>modalOpen:</strong> <code>{REFERENCE_OPERATIONS_TOKENS.motion.duration.modalOpen}</code> @ <code>{REFERENCE_OPERATIONS_TOKENS.motion.easing.modalSpring}</code></li>
              <li><strong>panelMorph:</strong> <code>{REFERENCE_OPERATIONS_TOKENS.motion.duration.panelMorph}</code> (Seq 03/05 screen cross-fade)</li>
              <li><strong>connectorDraw:</strong> <code>{REFERENCE_OPERATIONS_TOKENS.motion.duration.connectorDraw}</code> (Seq 07 spline route)</li>
              <li><strong>staggerStep:</strong> <code>{REFERENCE_OPERATIONS_TOKENS.motion.duration.staggerStep}</code> per grid card</li>
            </ul>
          </div>

          <div
            style={{
              padding: '14px 16px',
              borderRadius: '18px',
              background: 'var(--ajb-surface-card)',
              border: '1px solid var(--ajb-border-subtle)',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: 600, marginBottom: '8px' }}>
              Radius, Spacing & Typography Hierarchy
            </div>
            <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11px', lineHeight: 1.65, color: 'var(--ajb-text-secondary)' }}>
              <li><strong>Shell & Notch Radius:</strong> <code>{REFERENCE_OPERATIONS_TOKENS.radius.shellOuter}</code> / <code>{REFERENCE_OPERATIONS_TOKENS.radius.notch}</code></li>
              <li><strong>Card & Row Radius:</strong> <code>{REFERENCE_OPERATIONS_TOKENS.radius.stageCard}</code> / <code>{REFERENCE_OPERATIONS_TOKENS.radius.taskRow}</code></li>
              <li><strong>Modal Radius:</strong> <code>{REFERENCE_OPERATIONS_TOKENS.radius.modal}</code></li>
              <li><strong>Typography Scale:</strong> Page <code>30px</code>, Modal <code>20px</code>, Section <code>15px</code>, Card <code>12.5px</code></li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 2: NAVIGATION & AVATAR STRIP */}
      <section
        aria-labelledby="gallery-nav-heading"
        style={{
          padding: '24px 28px',
          borderRadius: '28px',
          background: 'var(--ajb-surface-shell)',
          border: '1px solid var(--ajb-border-subtle)',
          boxShadow: 'var(--ajb-shadow-card)',
          marginBottom: '24px',
        }}
      >
        <h2 id="gallery-nav-heading" style={{ margin: '0 0 14px', fontSize: '17px', fontWeight: 600 }}>
          2. Navigation Shell, Carved Notch Avatar Strip & Status Indicators
        </h2>
        <div
          style={{
            padding: '16px',
            borderRadius: '22px',
            background: 'rgba(229, 231, 236, 0.55)',
            border: '1px solid var(--ajb-border-subtle)',
          }}
        >
          <TopNavigationBar
            screenMode={state.screenMode}
            labelMode={state.labelMode}
            activeDemoRole={state.activeDemoRole}
            participants={state.participants}
            selectedParticipantId={state.selectedParticipantId}
            onSelectParticipant={store.setSelectedParticipantId}
            onSwitchScreen={store.setScreenMode}
            onToggleLabelMode={() =>
              store.setLabelMode(
                state.labelMode === 'operations' ? 'reference' : 'operations'
              )
            }
            onChangeDemoRole={store.setActiveDemoRole}
            onOpenGallery={() => {}}
            isGalleryActive={true}
          />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              marginTop: '14px',
              padding: '12px 16px',
              borderRadius: '18px',
              background: 'var(--ajb-surface-card)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 600 }}>Status Pills:</span>
              <StatusPillBadge status="Executed" />
              <StatusPillBadge status="Scheduled" />
              <StatusPillBadge status="In Review" />
              <StatusPillBadge status="Ready" />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: 600 }}>Overlapping Clusters & Rings:</span>
              <OverlappingAvatarCluster
                items={[
                  { url: '/avatars/avatar-3.png', badge: 2, tone: 'blue' },
                  { url: '/avatars/avatar-5.png', badge: 2, tone: 'coral' },
                  { url: '/avatars/avatar-4.png', badge: 1, tone: 'blue' },
                ]}
              />
              <ConicProgressRing valuePct={64} displayValue="18.2" label="Hours Spent" tone="coral" />
              <ConicProgressRing valuePct={83} displayValue="83%" label="Payback" tone="blue" />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: CONNECTED WORKFLOW CARDS & CURVED SVG CONNECTORS */}
      <section
        aria-labelledby="gallery-workflow-heading"
        style={{
          padding: '24px 28px',
          borderRadius: '28px',
          background: 'var(--ajb-surface-shell)',
          border: '1px solid var(--ajb-border-subtle)',
          boxShadow: 'var(--ajb-shadow-card)',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '14px',
          }}
        >
          <h2 id="gallery-workflow-heading" style={{ margin: 0, fontSize: '17px', fontWeight: 600 }}>
            3. Connected Workflow Cards, Task Rows, Action Tiles & Curved Connectors
          </h2>
          <button
            type="button"
            onClick={() =>
              store.setConnectorVariant(
                state.connectorVariant === 'static_solid_dark'
                  ? 'video_dashed_coral'
                  : 'static_solid_dark'
              )
            }
            style={{
              padding: '6px 14px',
              borderRadius: '9999px',
              border: '1px solid var(--ajb-border-subtle)',
              background: 'var(--ajb-surface-card)',
              fontSize: '11px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Toggle Stage 3→4 Connector ({state.connectorVariant})
          </button>
        </div>

        {/* Live 4-Stage Connected Canvas inside Gallery */}
        <div
          style={{
            position: 'relative',
            width: '1110px',
            maxWidth: '100%',
            height: '300px',
            margin: '0 auto',
          }}
        >
          <CurvedConnectorLayer
            allocationCards={state.allocationCards}
            stageTasks={state.stageTasks}
            onboardingTiles={state.onboardingTiles}
            selectedParticipantId={state.selectedParticipantId}
            connectorVariant={state.connectorVariant}
          />

          <div
            style={{
              position: 'relative',
              zIndex: 3,
              display: 'grid',
              gridTemplateColumns: '218px 234px 234px 234px',
              columnGap: '60px',
              alignItems: 'start',
              paddingTop: '34px',
            }}
          >
            {/* Stage 1 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {state.allocationCards.map((card) => (
                <AllocationStageCard
                  key={card.id}
                  card={card}
                  labelMode={state.labelMode}
                  highlighted={false}
                  dimmed={false}
                  onSelect={() => store.openModalForCard('process_case', card.id)}
                  onOpenDetail={(id) => store.openModalForCard('process_case', id)}
                />
              ))}
            </div>

            {/* Stage 2 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {state.stageTasks
                .filter((t) => t.stageId === 'role_access_profile')
                .map((task) => (
                  <CompactTaskRowCard
                    key={task.id}
                    task={task}
                    labelMode={state.labelMode}
                    highlighted={false}
                    dimmed={false}
                    onOpenDetail={(id) => store.openModalForCard('edit_task', id)}
                    onAssignParticipant={store.assignParticipantToTask}
                  />
                ))}
            </div>

            {/* Stage 3 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {state.stageTasks
                .filter((t) => t.stageId === 'manager_review')
                .map((task) => (
                  <CompactTaskRowCard
                    key={task.id}
                    task={task}
                    labelMode={state.labelMode}
                    highlighted={false}
                    dimmed={false}
                    onOpenDetail={(id) => store.openModalForCard('edit_task', id)}
                    onAssignParticipant={store.assignParticipantToTask}
                  />
                ))}
            </div>

            {/* Stage 4 */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '112px 112px',
                gap: '10px',
              }}
            >
              {state.onboardingTiles.map((tile) => (
                <ActionTileCard
                  key={tile.id}
                  tile={tile}
                  labelMode={state.labelMode}
                  onSelectTile={store.selectOnboardingTile}
                  onOpenDetail={(id) => store.openModalForCard('process_case', id)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: PIPELINE CARDS, IN-PROGRESS GRID CARDS & MODAL LAUNCHER */}
      <section
        aria-labelledby="gallery-cards-heading"
        style={{
          padding: '24px 28px',
          borderRadius: '28px',
          background: 'var(--ajb-surface-shell)',
          border: '1px solid var(--ajb-border-subtle)',
          boxShadow: 'var(--ajb-shadow-card)',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}
        >
          <h2 id="gallery-cards-heading" style={{ margin: 0, fontSize: '17px', fontWeight: 600 }}>
            4. Pipeline Interactive Flip Cards, Progress Grid Cards & Detail Modal
          </h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={() => store.openModalForCard('process_case', 'role-3')}
              style={{
                padding: '8px 16px',
                borderRadius: '9999px',
                border: 'none',
                background: 'var(--ajb-accent-black)',
                color: '#FFFFFF',
                fontSize: '11.5px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Open &ldquo;Processing of the New Case&rdquo; Modal
            </button>
            <button
              type="button"
              onClick={() => store.openModalForCard('add_case')}
              style={{
                padding: '8px 16px',
                borderRadius: '9999px',
                border: '1px solid var(--ajb-border-subtle)',
                background: 'var(--ajb-surface-card)',
                color: 'var(--ajb-text-primary)',
                fontSize: '11.5px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Open &ldquo;Add New Case&rdquo; Modal
            </button>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '280px 1fr',
            gap: '20px',
            alignItems: 'start',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ajb-text-secondary)' }}>
              Pipeline Cards (Default + Black Flip State)
            </div>
            {state.pipelineItems.slice(0, 3).map((item, idx) => (
              <PipelineRowCard
                key={item.id}
                item={item}
                labelMode={state.labelMode}
                isFeaturedActionable={idx === 2}
                onTakeForProcessing={() => store.openModalForCard('process_case', 'role-3')}
              />
            ))}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: '14px',
            }}
          >
            {state.progressGridCards.slice(0, 3).map((card) => (
              <ProgressGridCard
                key={card.id}
                card={card}
                labelMode={state.labelMode}
                onOpenCard={() => store.openModalForCard('process_case', 'role-3')}
              />
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: TABLES, METRIC BUBBLES & FILTERS */}
      <section
        aria-labelledby="gallery-tables-heading"
        style={{
          padding: '24px 28px',
          borderRadius: '28px',
          background: 'var(--ajb-surface-shell)',
          border: '1px solid var(--ajb-border-subtle)',
          boxShadow: 'var(--ajb-shadow-card)',
        }}
      >
        <h2 id="gallery-tables-heading" style={{ margin: '0 0 14px', fontSize: '17px', fontWeight: 600 }}>
          5. Tables, Proportional Metric Bubbles & Workflow Filter Bar
        </h2>

        <WorkflowFilterBar
          roleFilter={state.roleFilter}
          teamFilter={state.teamFilter}
          statusFilter={state.statusFilter}
          connectorVariant={state.connectorVariant}
          simulationStatus={store.simulationStatus}
          onChangeRoleFilter={store.setRoleFilter}
          onChangeTeamFilter={store.setTeamFilter}
          onChangeStatusFilter={store.setStatusFilter}
          onChangeConnectorVariant={store.setConnectorVariant}
          onChangeSimulationStatus={store.setSimulationStatus}
          onResetAll={store.resetAllDemoData}
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2.15fr 1fr',
            gap: '18px',
          }}
        >
          <SuggestedKnowledgeTable
            records={state.knowledgeRecords}
            labelMode={state.labelMode}
            onToggleStar={store.toggleKnowledgeStar}
            onAddRecord={() => store.openModalForCard('add_case')}
          />
          <SupportTicketJourneyCard labelMode={state.labelMode} />
        </div>
      </section>

      {/* Shared Detail Modal */}
      <DetailModal
        open={store.isModalOpen}
        labelMode={state.labelMode}
        draft={state.modalDraft}
        errors={store.validationErrors}
        onClose={() => store.setIsModalOpen(false)}
        onUpdateDraft={store.updateModalDraft}
        onSaveDraft={store.saveDraftLocally}
        onSubmit={store.submitModalForm}
      />
    </div>
  );
};
