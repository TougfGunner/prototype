import { useState, useEffect, useCallback } from 'react';
import {
  AllocationCardData,
  DemoRoleView,
  INITIAL_ALLOCATION_CARDS,
  INITIAL_KNOWLEDGE_RECORDS,
  INITIAL_NOTCH_PARTICIPANTS,
  INITIAL_ONBOARDING_TILES,
  INITIAL_PIPELINE_ITEMS,
  INITIAL_PROGRESS_GRID_CARDS,
  INITIAL_STAGE_TASKS,
  JourneyStageId,
  KnowledgeRecord,
  LabelParityMode,
  NotchParticipant,
  OnboardingActionTileData,
  PipelineColumnItem,
  ProgressGridCardItem,
  StageTaskRowData,
  WorkflowStatus,
} from '../data/syntheticStarters';

export type WorkspaceScreenMode = 'journey' | 'pipelines' | 'in_progress';
export type SimulationViewStatus = 'normal' | 'loading' | 'empty' | 'error' | 'completed';
export type ConnectorRenderVariant = 'video_dashed_coral' | 'static_solid_dark';

export interface ModalFormDraft {
  mode: 'process_case' | 'add_case' | 'edit_task';
  sourceCardId: string | null;
  activeStageTab: JourneyStageId;
  caseName: string;
  creatorName: string;
  creatorRole: string;
  creatorAvatar: string;
  responsibleTeamId: string;
  allocatedBudget: number;
  caseDescription: string;
  costCentreCode: string;
  securityClearanceLevel: 'Standard FCA' | 'SMCR Certified' | 'Privileged Platform';
  systemEntitlements: string;
  lastSavedAt: string | null;
}

export interface ValidationErrors {
  caseName?: string;
  allocatedBudget?: string;
  caseDescription?: string;
  costCentreCode?: string;
}

interface PersistedOperationsState {
  schemaVersion: number;
  screenMode: WorkspaceScreenMode;
  labelMode: LabelParityMode;
  activeDemoRole: DemoRoleView;
  selectedParticipantId: string | null;
  activeStageFilter: JourneyStageId | 'all';
  roleFilter: string;
  teamFilter: string;
  statusFilter: WorkflowStatus | 'all';
  connectorVariant: ConnectorRenderVariant;
  participants: NotchParticipant[];
  allocationCards: AllocationCardData[];
  stageTasks: StageTaskRowData[];
  onboardingTiles: OnboardingActionTileData[];
  knowledgeRecords: KnowledgeRecord[];
  pipelineItems: PipelineColumnItem[];
  progressGridCards: ProgressGridCardItem[];
  modalDraft: ModalFormDraft;
}

const STORAGE_KEY = 'ajb-ref-ops-v1-state';
const SCHEMA_VERSION = 2;

const DEFAULT_MODAL_DRAFT: ModalFormDraft = {
  mode: 'process_case',
  sourceCardId: 'role-3',
  activeStageTab: 'starter_details',
  caseName: 'Conversion Issues',
  creatorName: 'Brian McCartney',
  creatorRole: 'Senior Technical Lead of the Project',
  creatorAvatar: '/avatars/avatar-6.png',
  responsibleTeamId: 'team-a',
  allocatedBudget: 24985,
  caseDescription:
    'Synthetic new starter role profile and custody system entitlement package for Day-1 onboarding.',
  costCentreCode: 'CC-4102-CUSTODY',
  securityClearanceLevel: 'Standard FCA',
  systemEntitlements: 'Settlements Workbench Read/Write, SIPP Core Portal, SWIFT Viewer',
  lastSavedAt: null,
};

function getInitialLabelModeFromUrl(): LabelParityMode {
  if (typeof window === 'undefined') return 'operations';
  const params = new URLSearchParams(window.location.search);
  const mode = params.get('labels');
  if (mode === 'reference') return 'reference';
  return 'operations';
}

function getInitialScreenFromUrl(): WorkspaceScreenMode {
  if (typeof window === 'undefined') return 'journey';
  const params = new URLSearchParams(window.location.search);
  const screen = params.get('screen');
  if (screen === 'pipelines' || screen === 'in_progress' || screen === 'journey') {
    return screen;
  }
  return 'journey';
}

function loadState(): PersistedOperationsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as PersistedOperationsState;
      if (parsed && parsed.schemaVersion === SCHEMA_VERSION) {
        return {
          ...parsed,
          labelMode:
            new URLSearchParams(window.location.search).get('labels') === 'reference'
              ? 'reference'
              : parsed.labelMode,
          screenMode:
            (new URLSearchParams(window.location.search).get('screen') as WorkspaceScreenMode) ||
            parsed.screenMode,
        };
      }
    }
  } catch {
    // Ignore localStorage read errors in restricted modes
  }

  return {
    schemaVersion: SCHEMA_VERSION,
    screenMode: getInitialScreenFromUrl(),
    labelMode: getInitialLabelModeFromUrl(),
    activeDemoRole: 'Operations Coordinator',
    selectedParticipantId: null,
    activeStageFilter: 'all',
    roleFilter: 'all',
    teamFilter: 'all',
    statusFilter: 'all',
    connectorVariant: 'static_solid_dark',
    participants: INITIAL_NOTCH_PARTICIPANTS,
    allocationCards: INITIAL_ALLOCATION_CARDS,
    stageTasks: INITIAL_STAGE_TASKS,
    onboardingTiles: INITIAL_ONBOARDING_TILES,
    knowledgeRecords: INITIAL_KNOWLEDGE_RECORDS,
    pipelineItems: INITIAL_PIPELINE_ITEMS,
    progressGridCards: INITIAL_PROGRESS_GRID_CARDS,
    modalDraft: DEFAULT_MODAL_DRAFT,
  };
}

export function validateModalDraft(draft: ModalFormDraft): ValidationErrors {
  const errors: ValidationErrors = {};
  if (!draft.caseName || draft.caseName.trim().length < 3) {
    errors.caseName = 'Please enter a starter or case title (minimum 3 characters).';
  }
  if (
    typeof draft.allocatedBudget !== 'number' ||
    Number.isNaN(draft.allocatedBudget) ||
    draft.allocatedBudget < 5000 ||
    draft.allocatedBudget > 100000
  ) {
    errors.allocatedBudget = 'Allocated budget must be between 5,000 $ and 100,000 $.';
  }
  if (!draft.caseDescription || draft.caseDescription.trim().length < 10) {
    errors.caseDescription =
      'Please provide a role profile summary or case description (minimum 10 characters).';
  }
  if (!draft.costCentreCode || draft.costCentreCode.trim().length < 4) {
    errors.costCentreCode = 'Cost centre code is required (e.g. CC-4102-CUSTODY).';
  }
  return errors;
}

export function useStarterStore() {
  const [state, setState] = useState<PersistedOperationsState>(loadState);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('modal') === 'open';
  });
  const [simulationStatus, setSimulationStatus] = useState<SimulationViewStatus>('normal');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persist to localStorage automatically
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore quota errors
    }
  }, [state]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    window.setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  }, []);

  const setScreenMode = useCallback((screenMode: WorkspaceScreenMode) => {
    setState((prev) => ({ ...prev, screenMode }));
  }, []);

  const setLabelMode = useCallback((labelMode: LabelParityMode) => {
    setState((prev) => ({ ...prev, labelMode }));
  }, []);

  const setActiveDemoRole = useCallback((activeDemoRole: DemoRoleView) => {
    setState((prev) => ({ ...prev, activeDemoRole }));
  }, []);

  const setSelectedParticipantId = useCallback((participantId: string | null) => {
    setState((prev) => ({
      ...prev,
      selectedParticipantId: prev.selectedParticipantId === participantId ? null : participantId,
    }));
  }, []);

  const setActiveStageFilter = useCallback((activeStageFilter: JourneyStageId | 'all') => {
    setState((prev) => ({ ...prev, activeStageFilter }));
  }, []);

  const setRoleFilter = useCallback((roleFilter: string) => {
    setState((prev) => ({ ...prev, roleFilter }));
  }, []);

  const setTeamFilter = useCallback((teamFilter: string) => {
    setState((prev) => ({ ...prev, teamFilter }));
  }, []);

  const setStatusFilter = useCallback((statusFilter: WorkflowStatus | 'all') => {
    setState((prev) => ({ ...prev, statusFilter }));
  }, []);

  const setConnectorVariant = useCallback((connectorVariant: ConnectorRenderVariant) => {
    setState((prev) => ({ ...prev, connectorVariant }));
  }, []);

  // Reproduces Sequence 06 (f=0769..0825): Assigning a top-notch participant to an unassigned task slot
  const assignParticipantToTask = useCallback(
    (taskId: string, participantId?: string) => {
      setState((prev) => {
        const chosenId =
          participantId || prev.selectedParticipantId || prev.participants[5]?.id || 'p-6';
        const participant =
          prev.participants.find((p) => p.id === chosenId) || prev.participants[5];
        if (!participant) return prev;

        const updatedTasks = prev.stageTasks.map((t) => {
          if (t.id !== taskId) return t;
          return {
            ...t,
            assignedParticipantId: participant.id,
            avatarUrl: participant.avatarUrl,
            completed: true,
            hasDiagonalConnectorHandle: true,
            incomingTone: 'blue' as const,
            incomingDashed: false,
            status: 'Executed' as WorkflowStatus,
            formValues: {
              ...t.formValues,
              approverName: participant.name,
            },
          };
        });

        const updatedParticipants = prev.participants.map((p) => {
          if (p.id !== participant.id) return p;
          const nextCount = (p.badgeCount ?? 0) + 1;
          return {
            ...p,
            badgeCount: nextCount,
            badgeTone: nextCount >= 2 ? ('blue' as const) : ('coral' as const),
          };
        });

        return {
          ...prev,
          stageTasks: updatedTasks,
          participants: updatedParticipants,
        };
      });
      showToast('Reviewer assigned to task slot; incoming workflow connector updated.');
    },
    [showToast]
  );

  // Reproduces Sequence 07 (f=0905..0935): Clicking/selecting a tile in 'New Tasks' / 'Ready for onboarding'
  const selectOnboardingTile = useCallback((tileId: string) => {
    setState((prev) => {
      const updatedTiles = prev.onboardingTiles.map((tile) => ({
        ...tile,
        selected: tile.id === tileId,
      }));
      // Also connect mgr-3 to this tile
      const updatedTasks = prev.stageTasks.map((t) =>
        t.id === 'mgr-3' ? { ...t, targetTaskIds: [tileId] } : t
      );
      return {
        ...prev,
        onboardingTiles: updatedTiles,
        stageTasks: updatedTasks,
      };
    });
  }, []);

  const toggleKnowledgeStar = useCallback((recordId: string) => {
    setState((prev) => ({
      ...prev,
      knowledgeRecords: prev.knowledgeRecords.map((r) =>
        r.id === recordId ? { ...r, starred: !r.starred } : r
      ),
    }));
  }, []);

  // Open detail modal for a specific card/task or '+ Add New Case'
  const openModalForCard = useCallback(
    (mode: 'process_case' | 'add_case' | 'edit_task', cardId?: string) => {
      setValidationErrors({});
      setState((prev) => {
        if (mode === 'add_case') {
          return {
            ...prev,
            modalDraft: {
              ...prev.modalDraft,
              mode: 'add_case',
              sourceCardId: null,
              activeStageTab: 'starter_details',
              caseName:
                prev.labelMode === 'reference'
                  ? 'New Case Managment'
                  : 'New Starter Role Profile',
              creatorName: 'Alex Thompson',
              creatorRole: 'Lead Engineer for the Initiative',
              creatorAvatar: '/avatars/avatar-1.png',
              responsibleTeamId: 'team-b',
              allocatedBudget: 42650,
            },
          };
        }

        const task = prev.stageTasks.find((t) => t.id === cardId);
        const alloc = prev.allocationCards.find((a) => a.id === cardId);

        if (task) {
          return {
            ...prev,
            modalDraft: {
              ...prev.modalDraft,
              mode,
              sourceCardId: task.id,
              activeStageTab: task.stageId,
              caseName:
                prev.labelMode === 'reference' ? task.referenceTitle : task.operationsTitle,
              creatorName: task.formValues.approverName || 'Brian McCartney',
              creatorRole: 'Senior Technical Lead of the Project',
              creatorAvatar: task.avatarUrl || '/avatars/avatar-6.png',
              responsibleTeamId: task.formValues.responsibleTeamId,
              allocatedBudget: task.formValues.allocatedBudget,
              caseDescription: task.formValues.justification,
              systemEntitlements: task.formValues.systemEntitlements,
            },
          };
        }

        if (alloc) {
          return {
            ...prev,
            modalDraft: {
              ...prev.modalDraft,
              mode,
              sourceCardId: alloc.id,
              activeStageTab: 'starter_details',
              caseName: alloc.formValues.starterFullName,
              creatorName: 'Brian McCartney',
              creatorRole: alloc.formValues.roleProfileTitle,
              creatorAvatar: alloc.avatarUrl,
              responsibleTeamId: 'team-a',
              allocatedBudget: alloc.formValues.equipmentAllowance,
              caseDescription: alloc.formValues.notes,
              costCentreCode: alloc.formValues.costCentreCode,
              securityClearanceLevel: alloc.formValues.securityClearanceLevel,
            },
          };
        }

        return {
          ...prev,
          modalDraft: {
            ...prev.modalDraft,
            mode: 'process_case',
            sourceCardId: cardId || null,
            caseName: 'Conversion Issues',
            creatorName: 'Brian McCartney',
            creatorRole: 'Senior Technical Lead of the Project',
            creatorAvatar: '/avatars/avatar-6.png',
            responsibleTeamId: 'team-a',
            allocatedBudget: 24985,
          },
        };
      });
      setIsModalOpen(true);
    },
    []
  );

  const updateModalDraft = useCallback((patch: Partial<ModalFormDraft>) => {
    setState((prev) => ({
      ...prev,
      modalDraft: {
        ...prev.modalDraft,
        ...patch,
      },
    }));
  }, []);

  const saveDraftLocally = useCallback(() => {
    const nowIso = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    setState((prev) => ({
      ...prev,
      modalDraft: {
        ...prev.modalDraft,
        lastSavedAt: nowIso,
      },
    }));
    showToast(`Draft saved locally at ${nowIso} (persists across reload).`);
  }, [showToast]);

  const submitModalForm = useCallback((): boolean => {
    const errors = validateModalDraft(state.modalDraft);
    setValidationErrors(errors);
    if (Object.keys(errors).length > 0) {
      return false;
    }

    const nowIso = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    setState((prev) => {
      const draft = prev.modalDraft;
      let updatedTasks = prev.stageTasks;
      let updatedAlloc = prev.allocationCards;
      let updatedGrid = prev.progressGridCards;

      if (draft.sourceCardId) {
        updatedTasks = prev.stageTasks.map((t) =>
          t.id === draft.sourceCardId
            ? {
                ...t,
                operationsTitle:
                  prev.labelMode === 'operations' ? draft.caseName : t.operationsTitle,
                referenceTitle:
                  prev.labelMode === 'reference' ? draft.caseName : t.referenceTitle,
                completed: true,
                status: 'Executed' as WorkflowStatus,
                teamId: draft.responsibleTeamId,
                formValues: {
                  ...t.formValues,
                  approverName: draft.creatorName,
                  responsibleTeamId: draft.responsibleTeamId,
                  allocatedBudget: draft.allocatedBudget,
                  justification: draft.caseDescription,
                  systemEntitlements: draft.systemEntitlements,
                },
              }
            : t
        );

        updatedAlloc = prev.allocationCards.map((a) =>
          a.id === draft.sourceCardId
            ? {
                ...a,
                formValues: {
                  ...a.formValues,
                  starterFullName: draft.caseName,
                  equipmentAllowance: draft.allocatedBudget,
                  costCentreCode: draft.costCentreCode,
                  securityClearanceLevel: draft.securityClearanceLevel,
                  notes: draft.caseDescription,
                },
              }
            : a
        );
      } else if (draft.mode === 'add_case') {
        const newCard: ProgressGridCardItem = {
          id: `grid-${Date.now()}`,
          operationsTitle: draft.caseName,
          referenceTitle: draft.caseName,
          budgetAmount: draft.allocatedBudget,
          teamMembersCount: 3,
          hoursSpentMetric: 14.5,
          hoursSpentPct: 35,
          paybackPct: 62,
          avatars: [
            { url: '/avatars/avatar-4.png', badge: 2, tone: 'blue' },
            { url: '/avatars/avatar-6.png', badge: 1, tone: 'coral' },
            { url: '/avatars/avatar-1.png', badge: 2, tone: 'blue' },
          ],
          teamId: draft.responsibleTeamId,
          roleTag: 'Investment Operations Analyst',
        };
        updatedGrid = [newCard, ...prev.progressGridCards.slice(0, 7)];
      }

      return {
        ...prev,
        stageTasks: updatedTasks,
        allocationCards: updatedAlloc,
        progressGridCards: updatedGrid,
        modalDraft: {
          ...prev.modalDraft,
          lastSavedAt: nowIso,
        },
      };
    });

    setIsModalOpen(false);
    showToast('Starter workflow record updated and saved to local storage.');
    return true;
  }, [state.modalDraft, showToast]);

  const resetAllDemoData = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState({
      schemaVersion: SCHEMA_VERSION,
      screenMode: getInitialScreenFromUrl(),
      labelMode: getInitialLabelModeFromUrl(),
      activeDemoRole: 'Operations Coordinator',
      selectedParticipantId: null,
      activeStageFilter: 'all',
      roleFilter: 'all',
      teamFilter: 'all',
      statusFilter: 'all',
      connectorVariant: 'static_solid_dark',
      participants: INITIAL_NOTCH_PARTICIPANTS,
      allocationCards: INITIAL_ALLOCATION_CARDS,
      stageTasks: INITIAL_STAGE_TASKS,
      onboardingTiles: INITIAL_ONBOARDING_TILES,
      knowledgeRecords: INITIAL_KNOWLEDGE_RECORDS,
      pipelineItems: INITIAL_PIPELINE_ITEMS,
      progressGridCards: INITIAL_PROGRESS_GRID_CARDS,
      modalDraft: DEFAULT_MODAL_DRAFT,
    });
    setSimulationStatus('normal');
    showToast('Reset synthetic demonstration dataset to reference defaults.');
  }, [showToast]);

  return {
    state,
    isModalOpen,
    setIsModalOpen,
    simulationStatus,
    setSimulationStatus,
    validationErrors,
    setValidationErrors,
    toastMessage,
    setScreenMode,
    setLabelMode,
    setActiveDemoRole,
    setSelectedParticipantId,
    setActiveStageFilter,
    setRoleFilter,
    setTeamFilter,
    setStatusFilter,
    setConnectorVariant,
    assignParticipantToTask,
    selectOnboardingTile,
    toggleKnowledgeStar,
    openModalForCard,
    updateModalDraft,
    saveDraftLocally,
    submitModalForm,
    resetAllDemoData,
  };
}
