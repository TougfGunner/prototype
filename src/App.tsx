import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Inbox,
  SlidersHorizontal,
} from 'lucide-react';
import {
  TopNavigationBar,
  SlimNavigationRail,
  SubHeaderBreadcrumb,
} from './design-system/components/NavigationShell';
import {
  ConnectedWorkflowCanvas,
  PipelineRowCard,
  ProgressGridCard,
} from './design-system/components/WorkflowCards';
import { DetailModal } from './design-system/components/DetailModal';
import {
  SuggestedKnowledgeTable,
  SupportTicketJourneyCard,
  PipelineBottomMetrics,
  WorkflowFilterBar,
} from './design-system/components/TablesAndMetrics';
import { GalleryPage } from './pages/GalleryPage';
import { SimulationViewStatus, useStarterStore } from './state/useStarterStore';

export const App: React.FC = () => {
  const [pathname, setPathname] = useState<string>(() => window.location.pathname);
  const [showFilterDrawer, setShowFilterDrawer] = useState<boolean>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('filters') === 'open' || Boolean(params.get('sim'));
  });

  const store = useStarterStore();
  const { state } = store;

  // Support URL query parameter ?sim=loading|empty|error|completed for automated verification
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sim = params.get('sim') as SimulationViewStatus | null;
    if (
      sim &&
      (['normal', 'loading', 'empty', 'error', 'completed'] as const).includes(sim)
    ) {
      store.setSimulationStatus(sim);
    }
    const conn = params.get('connector');
    if (conn === 'video_dashed_coral' || conn === 'static_solid_dark') {
      store.setConnectorVariant(conn);
    }
    const labelParam = params.get('labels');
    if (labelParam === 'reference' || labelParam === 'operations') {
      store.setLabelMode(labelParam);
    }
    const screenParam = params.get('screen');
    if (
      screenParam === 'journey' ||
      screenParam === 'pipelines' ||
      screenParam === 'in_progress'
    ) {
      store.setScreenMode(screenParam);
    }
  }, []);

  useEffect(() => {
    const handlePop = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  const navigateTo = (path: string) => {
    window.history.pushState({}, '', path);
    setPathname(path);
  };

  if (pathname.startsWith('/gallery')) {
    return <GalleryPage onNavigateToPrototype={() => navigateTo('/')} />;
  }

  // Filter logic for Stage Tasks
  const matchesTaskFilter = (task: (typeof state.stageTasks)[number]) => {
    if (state.roleFilter !== 'all' && task.roleFilterTag !== state.roleFilter) {
      return false;
    }
    if (state.teamFilter !== 'all' && state.teamFilter !== task.teamId) {
      return false;
    }
    if (state.statusFilter !== 'all' && task.status !== state.statusFilter) {
      return false;
    }
    if (
      state.selectedParticipantId &&
      task.assignedParticipantId &&
      task.assignedParticipantId !== state.selectedParticipantId
    ) {
      return false;
    }
    return true;
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '18px 24px',
        position: 'relative',
      }}
    >
      {/* Floating Operations Workspace Shell (Matches straight-on reference frame 1396x860) */}
      <main
        aria-label="AJ Bell Internal Operations Prototype Workspace"
        style={{
          position: 'relative',
          width: '1368px',
          maxWidth: '100%',
          minHeight: '856px',
          borderRadius: '38px',
          padding: '22px 28px 24px',
          background: 'var(--ajb-bg-ambient-wash)',
          backdropFilter: 'blur(22px)',
          border: '1.5px solid rgba(255, 255, 255, 0.88)',
          boxShadow: 'var(--ajb-shadow-shell)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden',
        }}
      >
        {/* Top Carved Recessed Center Notch Background Visual */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: '-6px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '490px',
            height: '66px',
            borderRadius: '0 0 32px 32px',
            background: 'rgba(224, 227, 234, 0.85)',
            border: '1px solid rgba(255, 255, 255, 0.72)',
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />

        {/* Top Navigation Bar + Center 8-Avatar Notch Strip / Section Tabs */}
        <div style={{ position: 'relative', zIndex: 5 }}>
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
            onOpenGallery={() => navigateTo('/gallery')}
          />

          {/* Sub-header Breadcrumb + Quick Filter Drawer Toggle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingRight: '8px',
            }}
          >
            <SubHeaderBreadcrumb
              screenMode={state.screenMode}
              labelMode={state.labelMode}
              activeDemoRole={state.activeDemoRole}
              onBackToPipelines={() =>
                store.setScreenMode(
                  state.screenMode === 'pipelines' ? 'journey' : 'pipelines'
                )
              }
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {state.selectedParticipantId && (
                <button
                  type="button"
                  onClick={() => store.setSelectedParticipantId(null)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    border: '1px solid var(--ajb-accent-black)',
                    background: 'var(--ajb-accent-black)',
                    color: '#FFFFFF',
                    fontSize: '10.5px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Clear Starter Highlight ×
                </button>
              )}

              <button
                type="button"
                onClick={() => setShowFilterDrawer((prev) => !prev)}
                aria-expanded={showFilterDrawer}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 11px',
                  borderRadius: '9999px',
                  border: '1px solid var(--ajb-border-subtle)',
                  background: showFilterDrawer
                    ? 'var(--ajb-accent-black)'
                    : 'rgba(255, 255, 255, 0.72)',
                  color: showFilterDrawer ? '#FFFFFF' : 'var(--ajb-text-secondary)',
                  fontSize: '10.5px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                <SlidersHorizontal size={11} />
                {showFilterDrawer ? 'Hide Filters & States' : 'Filters & States'}
              </button>
            </div>
          </div>

          {showFilterDrawer && (
            <div style={{ marginTop: '8px' }}>
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
            </div>
          )}
        </div>

        {/* Body Layout: Slim Left Icon Rail + Main Screen Content */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '48px 1fr',
            gap: '24px',
            alignItems: 'stretch',
            flex: 1,
            marginTop: '4px',
            position: 'relative',
            zIndex: 4,
          }}
        >
          {/* Left Vertical Icon Rail */}
          <SlimNavigationRail
            screenMode={state.screenMode}
            onSwitchScreen={store.setScreenMode}
            onOpenNewStarterModal={() => store.openModalForCard('add_case')}
            onOpenGallery={() => navigateTo('/gallery')}
          />

          {/* Main Workspace Area */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minWidth: 0,
            }}
          >
            {/* Title + Right Action Controls */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px',
              }}
            >
              <h1
                style={{
                  margin: 0,
                  fontSize: '30px',
                  fontWeight: 500,
                  letterSpacing: '-0.025em',
                  lineHeight: 1.12,
                  color: 'var(--ajb-text-primary)',
                }}
              >
                {state.screenMode === 'journey'
                  ? state.labelMode === 'reference'
                    ? 'Customer Issue'
                    : 'New Starter Journey'
                  : state.screenMode === 'pipelines'
                    ? state.labelMode === 'reference'
                      ? 'Case Pipelines'
                      : 'Starter Role Pipelines'
                    : state.labelMode === 'reference'
                      ? 'Cases in Progress'
                      : 'Starters in Progress'}
              </h1>

              {state.screenMode === 'in_progress' && (
                <button
                  type="button"
                  onClick={() => store.openModalForCard('add_case')}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
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
                  <span>+</span>
                  <span>
                    {state.labelMode === 'reference'
                      ? 'Add New Case'
                      : 'Add New Starter'}
                  </span>
                </button>
              )}
            </div>

            {/* SIMULATED STATES: LOADING / EMPTY / ERROR / COMPLETED */}
            {store.simulationStatus !== 'normal' ? (
              <div
                role="status"
                aria-live="polite"
                style={{
                  flex: 1,
                  borderRadius: '26px',
                  background: 'rgba(255, 255, 255, 0.68)',
                  border: '1px solid var(--ajb-border-subtle)',
                  padding: '36px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  gap: '12px',
                  marginBottom: '16px',
                }}
              >
                {store.simulationStatus === 'loading' && (
                  <>
                    <Loader2 size={32} color="#8FA8E0" />
                    <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 500 }}>
                      Synchronising Synthetic Role Profiles & Entitlements…
                    </h2>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '12.5px',
                        color: 'var(--ajb-text-secondary)',
                        maxWidth: '460px',
                      }}
                    >
                      Loading stage connectors, SMCR certification checks, and Custody dealing desk approvals from local storage.
                    </p>
                  </>
                )}

                {store.simulationStatus === 'empty' && (
                  <>
                    <Inbox size={32} color="var(--ajb-text-secondary)" />
                    <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 500 }}>
                      No Matching Starter Workflows Found
                    </h2>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '12.5px',
                        color: 'var(--ajb-text-secondary)',
                        maxWidth: '460px',
                      }}
                    >
                      No synthetic records match the current Role, Team, or Status filter criteria. Reset filters or create a new starter profile.
                    </p>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                      <button
                        type="button"
                        onClick={() => store.setSimulationStatus('normal')}
                        style={{
                          padding: '9px 18px',
                          borderRadius: '9999px',
                          border: 'none',
                          background: 'var(--ajb-accent-black)',
                          color: '#FFFFFF',
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        Restore Default Records
                      </button>
                      <button
                        type="button"
                        onClick={() => store.openModalForCard('add_case')}
                        style={{
                          padding: '9px 18px',
                          borderRadius: '9999px',
                          border: '1px solid var(--ajb-border-subtle)',
                          background: '#FFFFFF',
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        + Create Starter Profile
                      </button>
                    </div>
                  </>
                )}

                {store.simulationStatus === 'error' && (
                  <>
                    <AlertTriangle size={32} color="#D96B70" />
                    <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 500 }}>
                      Entitlement Provisioning Validation Halted
                    </h2>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '12.5px',
                        color: 'var(--ajb-text-secondary)',
                        maxWidth: '480px',
                      }}
                    >
                      Synthetic simulation: Stage 3 Manager Review detected a missing CASS segregation sign-off on role pack <code>CC-4102-CUSTODY</code>.
                    </p>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          store.setSimulationStatus('normal');
                          store.openModalForCard('process_case', 'role-3');
                        }}
                        style={{
                          padding: '9px 18px',
                          borderRadius: '9999px',
                          border: 'none',
                          background: 'var(--ajb-accent-black)',
                          color: '#FFFFFF',
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        Open Form to Resolve
                      </button>
                      <button
                        type="button"
                        onClick={() => store.setSimulationStatus('normal')}
                        style={{
                          padding: '9px 18px',
                          borderRadius: '9999px',
                          border: '1px solid var(--ajb-border-subtle)',
                          background: '#FFFFFF',
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                      >
                        Dismiss Error State
                      </button>
                    </div>
                  </>
                )}

                {store.simulationStatus === 'completed' && (
                  <>
                    <CheckCircle2 size={34} color="#58B67E" />
                    <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 500 }}>
                      All 4 New Starter Journey Stages Completed
                    </h2>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '12.5px',
                        color: 'var(--ajb-text-secondary)',
                        maxWidth: '480px',
                      }}
                    >
                      Starter details, Role &amp; Access Profile, Manager Review, and Day-1 Onboarding provisioning have been verified and recorded locally.
                    </p>
                    <button
                      type="button"
                      onClick={() => store.setSimulationStatus('normal')}
                      style={{
                        padding: '9px 18px',
                        borderRadius: '9999px',
                        border: 'none',
                        background: 'var(--ajb-accent-black)',
                        color: '#FFFFFF',
                        fontSize: '12px',
                        cursor: 'pointer',
                        marginTop: '6px',
                      }}
                    >
                      Return to Live Workflow Canvas
                    </button>
                  </>
                )}
              </div>
            ) : (
              <>
                {/* SCREEN MODE 1: NEW STARTER JOURNEY / CUSTOMER ISSUE CANVAS */}
                {state.screenMode === 'journey' && (
                  <>
                    <div style={{ marginBottom: '16px' }}>
                      <ConnectedWorkflowCanvas
                        labelMode={state.labelMode}
                        allocationCards={state.allocationCards}
                        stageTasks={state.stageTasks}
                        onboardingTiles={state.onboardingTiles}
                        selectedParticipantId={state.selectedParticipantId}
                        activeStageFilter={state.activeStageFilter}
                        connectorVariant={state.connectorVariant}
                        onSetConnectorVariant={store.setConnectorVariant}
                        onAssignSlot={store.assignParticipantToTask}
                        onSelectTile={store.selectOnboardingTile}
                        onOpenDetail={(id) => {
                          if (id.startsWith('role-') || id.startsWith('mgr-')) {
                            store.openModalForCard('edit_task', id);
                          } else {
                            store.openModalForCard('process_case', id);
                          }
                        }}
                        onAddNewCase={() => store.openModalForCard('add_case')}
                        matchesTaskFilter={matchesTaskFilter}
                      />
                    </div>

                    {/* Bottom Panels: Suggested Knowledge Table + Support Ticket Journey */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '2.18fr 1fr',
                        gap: '18px',
                        alignItems: 'stretch',
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
                  </>
                )}

                {/* SCREEN MODE 2: CASE PIPELINES / STARTER ROLE PIPELINES (Seq 01 f=0000..0125) */}
                {state.screenMode === 'pipelines' && (
                  <div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '16px',
                      }}
                    >
                      {(
                        [
                          {
                            col: 'New Cases' as const,
                            ops: 'New Starters',
                            count: 12,
                          },
                          {
                            col: 'In Progress' as const,
                            ops: 'Role Profiling',
                            count: 4,
                          },
                          {
                            col: 'Pending Info' as const,
                            ops: 'Manager Sign-off',
                            count: 8,
                          },
                          {
                            col: 'Closed' as const,
                            ops: 'Ready Day-1',
                            count: 5,
                          },
                        ] as const
                      ).map((group) => {
                        const colItems = state.pipelineItems.filter(
                          (item) => item.column === group.col
                        );
                        return (
                          <div key={group.col}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginBottom: '10px',
                              }}
                            >
                              <span
                                style={{
                                  fontSize: '13px',
                                  fontWeight: 500,
                                  color: 'var(--ajb-text-primary)',
                                }}
                              >
                                {state.labelMode === 'reference'
                                  ? group.col
                                  : group.ops}
                              </span>
                              <span
                                className="ajb-tabular"
                                style={{
                                  padding: '2px 7px',
                                  borderRadius: '9999px',
                                  background: 'rgba(225, 229, 237, 0.9)',
                                  fontSize: '10.5px',
                                  fontWeight: 600,
                                  color: 'var(--ajb-text-secondary)',
                                }}
                              >
                                {group.count}
                              </span>
                            </div>

                            <div
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                              }}
                            >
                              {colItems.map((item) => (
                                <PipelineRowCard
                                  key={item.id}
                                  item={item}
                                  labelMode={state.labelMode}
                                  isFeaturedActionable={item.id === 'pipe-3'}
                                  onTakeForProcessing={() =>
                                    store.openModalForCard('process_case', 'role-3')
                                  }
                                />
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <PipelineBottomMetrics labelMode={state.labelMode} />
                  </div>
                )}

                {/* SCREEN MODE 3: CASES IN PROGRESS 8-CARD GRID (Seq 02/03/05 f=0320..0600) */}
                {state.screenMode === 'in_progress' && (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(4, 1fr)',
                      gap: '16px',
                      marginTop: '4px',
                    }}
                  >
                    {state.progressGridCards.map((card) => (
                      <ProgressGridCard
                        key={card.id}
                        card={card}
                        labelMode={state.labelMode}
                        onOpenCard={() =>
                          store.openModalForCard('process_case', 'role-3')
                        }
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Subtle Synthetic Data & Persistence Footer Notice */}
        <footer
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '12px',
            paddingTop: '8px',
            borderTop: '1px solid rgba(18, 22, 33, 0.05)',
            fontSize: '10.5px',
            color: 'var(--ajb-text-muted)',
          }}
        >
          <span>
            AJ Bell Internal Operations Prototype · Synthetic Demonstration Data Only · Local Storage Persistence Active
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span>
              Active Role View: <strong style={{ color: 'var(--ajb-text-secondary)' }}>{state.activeDemoRole}</strong>
            </span>
            <a
              href="/gallery"
              onClick={(e) => {
                e.preventDefault();
                navigateTo('/gallery');
              }}
              style={{
                color: 'var(--ajb-text-primary)',
                fontWeight: 500,
                textDecoration: 'none',
              }}
            >
              Reference Operations v1 (/gallery) →
            </a>
          </div>
        </footer>
      </main>

      {/* Toast Notification for Local Draft Save / Reviewer Assignment */}
      {store.toastMessage && (
        <div
          role="status"
          aria-live="polite"
          style={{
            position: 'fixed',
            bottom: '22px',
            right: '28px',
            padding: '10px 18px',
            borderRadius: '9999px',
            background: '#18191C',
            color: '#FFFFFF',
            fontSize: '12px',
            fontWeight: 500,
            boxShadow: '0 10px 28px rgba(13, 13, 15, 0.25)',
            zIndex: 60,
          }}
        >
          {store.toastMessage}
        </div>
      )}

      {/* Detail Form Modal (Native <dialog closedby="any">) */}
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
