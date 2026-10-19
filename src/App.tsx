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
import { AJBellMottoPill } from './design-system/components/AJBellBrandAssets';
import { TokenArchitectureBlueprint } from './design-system/components/TokenArchitectureBlueprint';
import { ROLE_LEVEL_DESIGN_TOKENS } from './design-system/tokens';
import { SimulationViewStatus, useStarterStore } from './state/useStarterStore';

export const App: React.FC = () => {
  const [pathname, setPathname] = useState<string>(() => window.location.pathname);
  const [showFilterDrawer, setShowFilterDrawer] = useState<boolean>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('filters') === 'open' || Boolean(params.get('sim'));
  });
  const [showBlueprintDrawer, setShowBlueprintDrawer] = useState<boolean>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('blueprint') === 'open';
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
      screenParam === 'relationship' ||
      screenParam === 'pipelines' ||
      screenParam === 'in_progress' ||
      screenParam === 'inductions' ||
      screenParam === 'journey' ||
      screenParam === 'audit_log' ||
      screenParam === 'entitlements'
    ) {
      store.setScreenMode(screenParam);
    }
    const paletteParam = params.get('palette');
    if (
      paletteParam === 'light-blue' ||
      paletteParam === 'chime-blue-dark' ||
      paletteParam === 'chime-crimson'
    ) {
      store.setPaletteMode(paletteParam);
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
        padding: '10px 14px',
        position: 'relative',
      }}
    >
      {/* Floating Operations Workspace Shell (Full-bleed responsive shell for Light & Dark modes) */}
      <main
        aria-label="AJ Bell Internal Operations Prototype Workspace"
        style={{
          position: 'relative',
          width: 'min(98.5vw, 1680px)',
          maxWidth: '100%',
          minHeight: 'calc(100vh - 20px)',
          borderRadius: '30px',
          padding: '18px 24px 20px',
          background: 'var(--ajb-bg-ambient-wash)',
          backdropFilter: 'blur(22px)',
          border: '1.5px solid var(--ajb-border-glass)',
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
            width: '380px',
            height: '64px',
            borderRadius: '0 0 28px 28px',
            background: 'var(--ajb-surface-notch)',
            border: '1px solid var(--ajb-border-glass)',
            zIndex: 1,
            pointerEvents: 'none',
            transition: 'background 220ms ease, border-color 220ms ease',
          }}
        />

        {/* Top Navigation Bar + Center 8-Avatar Notch Strip / Section Tabs */}
        <div style={{ position: 'relative', zIndex: 5 }}>
          <TopNavigationBar
            screenMode={state.screenMode}
            labelMode={state.labelMode}
            activeDemoRole={state.activeDemoRole}
            theme={state.theme}
            paletteMode={state.paletteMode}
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
            onToggleTheme={store.toggleTheme}
            onChangePaletteMode={store.setPaletteMode}
            onOpenGallery={() => navigateTo('/gallery')}
          />

          {/* Sub-header Breadcrumb + Live Role Token Pill + Blueprint & Filter Toggles */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingRight: '8px',
              flexWrap: 'wrap',
              gap: '8px',
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {/* Live Role-Level Token Indicator Pill (Zero-leak CSS Variable driven) */}
              {(() => {
                const activeRoleSpec =
                  ROLE_LEVEL_DESIGN_TOKENS.find((r) => r.roleId === state.activeDemoRole) ||
                  ROLE_LEVEL_DESIGN_TOKENS[0];
                const isBlueActive =
                  state.paletteMode === 'light-blue' ||
                  (state.paletteMode === 'chime-blue-dark' && state.theme === 'dark');
                const blueRoleMap: Record<string, { light: string; dark: string }> = {
                  '--role-ops': { light: '#6F8ED6', dark: '#7B99DC' },
                  '--role-manager': { light: '#D96B70', dark: '#E0757A' },
                  '--role-it': { light: '#2889A8', dark: '#38BDF8' },
                  '--role-compliance': { light: '#218A65', dark: '#34D399' },
                };
                const roleHex = isBlueActive
                  ? state.theme === 'dark'
                    ? blueRoleMap[activeRoleSpec.cssPrefix]?.dark ?? activeRoleSpec.darkPrimary
                    : blueRoleMap[activeRoleSpec.cssPrefix]?.light ?? activeRoleSpec.lightPrimary
                  : state.theme === 'dark'
                    ? activeRoleSpec.darkPrimary
                    : activeRoleSpec.lightPrimary;
                return (
                  <button
                    type="button"
                    data-testid="active-role-token-chip"
                    onClick={() => setShowBlueprintDrawer((prev) => !prev)}
                    title="Click to inspect Root-Level & Role-Level Design Tokens and Repo Merge Blueprint"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '5px 11px',
                      borderRadius: '9999px',
                      border: '1px solid var(--role-active-border, var(--ajb-border-subtle))',
                      background: 'var(--role-active-surface, var(--ajb-surface-elevated))',
                      color: 'var(--ajb-text-primary)',
                      fontSize: '11.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '9999px',
                        background: `var(${activeRoleSpec.cssPrefix}-primary, var(--ajb-accent-periwinkle))`,
                      }}
                    />
                    <code style={{ fontFamily: 'var(--ajb-font-mono)', fontSize: '11px' }}>
                      {activeRoleSpec.cssPrefix}-primary: {roleHex}
                    </code>
                  </button>
                );
              })()}

              {state.selectedParticipantId && (
                <button
                  type="button"
                  onClick={() => store.setSelectedParticipantId(null)}
                  style={{
                    padding: '5px 11px',
                    borderRadius: '9999px',
                    border: '1px solid var(--ajb-accent-black)',
                    background: 'var(--ajb-accent-black)',
                    color: '#FFFFFF',
                    fontSize: '11.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Clear Starter Highlight ×
                </button>
              )}

              <button
                type="button"
                data-testid="toggle-blueprint-drawer"
                onClick={() => setShowBlueprintDrawer((prev) => !prev)}
                aria-expanded={showBlueprintDrawer}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  border: '1px solid var(--ajb-border-subtle)',
                  background: showBlueprintDrawer
                    ? 'var(--ajb-accent-black)'
                    : 'var(--ajb-surface-elevated)',
                  color: showBlueprintDrawer ? '#FFFFFF' : 'var(--ajb-text-primary)',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <span>✦</span>
                <span>
                  {showBlueprintDrawer
                    ? 'Hide Tokens & Repo Merge'
                    : 'Root & Role Tokens · Repo Merge'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setShowFilterDrawer((prev) => !prev)}
                aria-expanded={showFilterDrawer}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  border: '1px solid var(--ajb-border-subtle)',
                  background: showFilterDrawer
                    ? 'var(--ajb-accent-black)'
                    : 'var(--ajb-surface-elevated)',
                  color: showFilterDrawer ? '#FFFFFF' : 'var(--ajb-text-primary)',
                  fontSize: '11.5px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <SlidersHorizontal size={12} />
                {showFilterDrawer ? 'Hide Filters & States' : 'Filters & States'}
              </button>
            </div>
          </div>

          {showBlueprintDrawer && (
            <div style={{ marginTop: '10px', marginBottom: '6px' }}>
              <TokenArchitectureBlueprint
                activeDemoRole={state.activeDemoRole}
                theme={state.theme}
                paletteMode={state.paletteMode}
                onChangeDemoRole={store.setActiveDemoRole}
                onToggleTheme={store.toggleTheme}
                onChangePaletteMode={store.setPaletteMode}
                compact
              />
            </div>
          )}

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
            gap: '20px',
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
            theme={state.theme}
            onSwitchScreen={store.setScreenMode}
            onOpenNewStarterModal={() => store.openModalForCard('add_case')}
            onOpenGallery={() => navigateTo('/gallery')}
            onToggleTheme={store.toggleTheme}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <h1
                  style={{
                    margin: 0,
                    fontSize: '31px',
                    fontWeight: 600,
                    fontFamily: 'var(--ajb-font-display)',
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
                      : state.screenMode === 'in_progress'
                        ? state.labelMode === 'reference'
                          ? 'Cases in Progress'
                          : 'Starters in Progress'
                        : state.screenMode === 'relationship'
                          ? 'Relationship & Starter Directory'
                          : state.screenMode === 'inductions'
                            ? 'Day-1 Inductions & Provisioning'
                            : state.screenMode === 'audit_log'
                              ? 'SMCR & CASS Audit Log'
                              : 'Role Entitlements Matrix'}
                </h1>
                <AJBellMottoPill />
              </div>

              {(state.screenMode === 'in_progress' || state.screenMode === 'relationship') && (
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
                  background: 'var(--ajb-surface-subpanel)',
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
                    <Loader2 size={32} color="var(--ajb-accent-periwinkle)" />
                    <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: 'var(--ajb-text-primary)' }}>
                      Synchronising Synthetic Role Profiles & Entitlements…
                    </h2>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '13px',
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
                    <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: 'var(--ajb-text-primary)' }}>
                      No Matching Starter Workflows Found
                    </h2>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '13px',
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
                          fontSize: '12.5px',
                          fontWeight: 600,
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
                          background: 'var(--ajb-surface-elevated)',
                          color: 'var(--ajb-text-primary)',
                          fontSize: '12.5px',
                          fontWeight: 600,
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
                    <AlertTriangle size={32} color="var(--ajb-accent-coral)" />
                    <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: 'var(--ajb-text-primary)' }}>
                      Entitlement Provisioning Validation Halted
                    </h2>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '13px',
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
                          fontSize: '12.5px',
                          fontWeight: 600,
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
                          background: 'var(--ajb-surface-elevated)',
                          color: 'var(--ajb-text-primary)',
                          fontSize: '12.5px',
                          fontWeight: 600,
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
                    <CheckCircle2 size={34} color="var(--ajb-accent-emerald)" />
                    <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: 'var(--ajb-text-primary)' }}>
                      All 4 New Starter Journey Stages Completed
                    </h2>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '13px',
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
                        fontSize: '12.5px',
                        fontWeight: 600,
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
                                  fontSize: '13.5px',
                                  fontWeight: 600,
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
                                  padding: '2px 8px',
                                  borderRadius: '9999px',
                                  background: 'var(--ajb-surface-badge-neutral)',
                                  fontSize: '11px',
                                  fontWeight: 700,
                                  color: 'var(--ajb-text-primary)',
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

                {/* SCREEN MODE 4: RELATIONSHIP & STARTER DIRECTORY */}
                {state.screenMode === 'relationship' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '14px',
                      }}
                    >
                      {state.participants.map((p) => {
                        const isSelected = state.selectedParticipantId === p.id;
                        return (
                          <div
                            key={p.id}
                            onClick={() =>
                              store.setSelectedParticipantId(isSelected ? null : p.id)
                            }
                            style={{
                              padding: '16px 18px',
                              borderRadius: '22px',
                              background: isSelected
                                ? 'var(--ajb-accent-black)'
                                : 'var(--ajb-surface-card)',
                              color: isSelected ? '#FFFFFF' : 'var(--ajb-text-primary)',
                              border: '1px solid var(--ajb-border-subtle)',
                              boxShadow: 'var(--ajb-shadow-card)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                            }}
                          >
                            <img
                              src={p.avatarUrl}
                              alt={p.name}
                              style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '9999px',
                                objectFit: 'cover',
                                border: '2px solid var(--ajb-accent-periwinkle)',
                              }}
                            />
                            <div style={{ minWidth: 0, flex: 1 }}>
                              <div style={{ fontSize: '14px', fontWeight: 700 }}>{p.name}</div>
                              <div
                                style={{
                                  fontSize: '12px',
                                  color: isSelected
                                    ? 'rgba(255,255,255,0.78)'
                                    : 'var(--ajb-text-secondary)',
                                }}
                              >
                                {p.roleTitle} · {p.department}
                              </div>
                            </div>
                            <span
                              className="ajb-tabular"
                              style={{
                                padding: '3px 9px',
                                borderRadius: '9999px',
                                background: 'var(--ajb-accent-periwinkle)',
                                color: '#FFFFFF',
                                fontSize: '11px',
                                fontWeight: 700,
                              }}
                            >
                              {p.badgeCount ?? 1} tasks
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <SuggestedKnowledgeTable
                      records={state.knowledgeRecords}
                      labelMode={state.labelMode}
                      onToggleStar={store.toggleKnowledgeStar}
                      onAddRecord={() => store.openModalForCard('add_case')}
                    />
                  </div>
                )}

                {/* SCREEN MODE 5: DAY-1 INDUCTIONS & PROVISIONING */}
                {state.screenMode === 'inductions' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '14px',
                      }}
                    >
                      {state.onboardingTiles.map((tile) => (
                        <div
                          key={tile.id}
                          onClick={() => store.selectOnboardingTile(tile.id)}
                          style={{
                            padding: '18px 20px',
                            borderRadius: '22px',
                            background: tile.selected
                              ? 'var(--ajb-accent-black)'
                              : 'var(--ajb-surface-card)',
                            color: tile.selected ? '#FFFFFF' : 'var(--ajb-text-primary)',
                            border: '1px solid var(--ajb-border-subtle)',
                            boxShadow: 'var(--ajb-shadow-card)',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: '10px',
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '11.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', opacity: 0.78 }}>
                              Day-1 Induction Module
                            </span>
                            <span
                              style={{
                                padding: '3px 10px',
                                borderRadius: '9999px',
                                background: tile.selected
                                  ? 'var(--ajb-accent-periwinkle)'
                                  : 'var(--ajb-surface-badge-neutral)',
                                color: tile.selected ? '#FFFFFF' : 'var(--ajb-text-primary)',
                                fontSize: '11px',
                                fontWeight: 700,
                              }}
                            >
                              {tile.selected ? 'Active Priority' : 'Scheduled'}
                            </span>
                          </div>
                          <div style={{ fontSize: '16px', fontWeight: 700 }}>
                            {state.labelMode === 'reference' ? tile.referenceTitle : tile.operationsTitle}
                          </div>
                          <div style={{ fontSize: '12px', opacity: 0.8 }}>
                            Automated Day-1 workspace, security key, and compliance orientation checkpoint.
                          </div>
                        </div>
                      ))}
                    </div>
                    <PipelineBottomMetrics labelMode={state.labelMode} />
                  </div>
                )}

                {/* SCREEN MODE 6: SMCR & CASS AUDIT LOG */}
                {state.screenMode === 'audit_log' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '2.18fr 1fr', gap: '18px' }}>
                    <SuggestedKnowledgeTable
                      records={state.knowledgeRecords}
                      labelMode={state.labelMode}
                      onToggleStar={store.toggleKnowledgeStar}
                      onAddRecord={() => store.openModalForCard('add_case')}
                    />
                    <SupportTicketJourneyCard labelMode={state.labelMode} />
                  </div>
                )}

                {/* SCREEN MODE 7: ROLE ENTITLEMENTS MATRIX */}
                {state.screenMode === 'entitlements' && (
                  <TokenArchitectureBlueprint
                    activeDemoRole={state.activeDemoRole}
                    theme={state.theme}
                    paletteMode={state.paletteMode}
                    onChangeDemoRole={store.setActiveDemoRole}
                    onToggleTheme={store.toggleTheme}
                    onChangePaletteMode={store.setPaletteMode}
                  />
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
            borderTop: '1px solid var(--ajb-border-subtle)',
            fontSize: '11px',
            color: 'var(--ajb-text-muted)',
          }}
        >
          <span>
            AJ Bell (ajbell.co.uk · &ldquo;Feel good, investing&rdquo;) · Internal Operations Prototype · Synthetic Demonstration Data Only
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
                fontWeight: 600,
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
            background: 'var(--ajb-accent-black)',
            color: '#FFFFFF',
            fontSize: '12px',
            fontWeight: 500,
            boxShadow: '0 10px 28px rgba(93, 10, 26, 0.28)',
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
