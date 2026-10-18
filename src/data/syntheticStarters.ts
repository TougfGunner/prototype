/**
 * Synthetic Demonstration Data Model for AJ Bell Internal Operations Prototype
 * Strictly synthetic records for role profiling, new starter forms, and data collection.
 * No production connections or real employee information.
 */

export type JourneyStageId =
  | 'starter_details'
  | 'role_access_profile'
  | 'manager_review'
  | 'ready_for_onboarding';

export type WorkflowStatus = 'Executed' | 'Scheduled' | 'In Review' | 'Ready' | 'Blocked';

export type DemoRoleView =
  | 'Operations Coordinator'
  | 'Hiring Manager'
  | 'Identity & Access Lead'
  | 'Compliance Reviewer';

export type LabelParityMode = 'operations' | 'reference';

export interface StageMetadataItem {
  id: JourneyStageId;
  operationsTitle: string;
  referenceTitle: string;
}

export const STAGE_METADATA: StageMetadataItem[] = [
  {
    id: 'starter_details',
    operationsTitle: 'Starter details',
    referenceTitle: 'Case Allocation',
  },
  {
    id: 'role_access_profile',
    operationsTitle: 'Role and access profile',
    referenceTitle: 'Issue Identification',
  },
  {
    id: 'manager_review',
    operationsTitle: 'Manager review',
    referenceTitle: 'Technical Resolution',
  },
  {
    id: 'ready_for_onboarding',
    operationsTitle: 'Ready for onboarding',
    referenceTitle: 'New Tasks',
  },
];

export interface NotchParticipant {
  id: string;
  name: string;
  referenceName: string;
  roleTitle: string;
  teamId: string;
  department: string;
  avatarUrl: string;
  badgeCount: number | null; // null means '+' unassigned slot in top notch
  badgeTone: 'blue' | 'coral' | 'plus';
  workflowStatus: WorkflowStatus;
}

export interface ResponsibleTeamOption {
  id: string;
  code: string;
  name: string;
  referenceSubtitle: string;
  operationsSubtitle: string;
  memberAvatars: string[];
  extraCount?: number;
}

export interface AllocationCardData {
  id: string;
  stageId: 'starter_details';
  operationsTitle: string;
  referenceTitle: string;
  participantId: string;
  avatarUrl: string;
  verified: boolean;
  dueDate: string;
  targetTaskIds: string[];
  connectorTone: 'blue' | 'coral';
  connectorDashed: boolean;
  formValues: {
    starterFullName: string;
    roleProfileTitle: string;
    costCentreCode: string;
    startDate: string;
    securityClearanceLevel: 'Standard FCA' | 'SMCR Certified' | 'Privileged Platform';
    equipmentAllowance: number;
    notes: string;
  };
}

export interface StageTaskRowData {
  id: string;
  stageId: 'role_access_profile' | 'manager_review';
  operationsTitle: string;
  referenceTitle: string;
  assignedParticipantId: string | null;
  avatarUrl: string | null;
  completed: boolean;
  hasCalendarTag: boolean;
  hasDiagonalConnectorHandle?: boolean;
  incomingTone: 'blue' | 'coral';
  incomingDashed: boolean;
  targetTaskIds: string[];
  roleFilterTag: string;
  teamId: string;
  status: WorkflowStatus;
  formValues: {
    systemEntitlements: string;
    approverName: string;
    responsibleTeamId: string;
    allocatedBudget: number;
    slaHours: number;
    justification: string;
  };
}

export interface OnboardingActionTileData {
  id: string;
  stageId: 'ready_for_onboarding';
  operationsTitle: string;
  referenceTitle: string;
  selected: boolean;
  completed: boolean;
  description: string;
  checklistItems: string[];
}

export interface KnowledgeRecord {
  id: string;
  operationsSubject: string;
  referenceSubject: string;
  status: 'Executed' | 'Scheduled';
  startDate: string;
  endDate: string;
  assignedUser: string;
  avatarUrl: string;
  starred: boolean;
  teamId: string;
  roleTag: string;
}

export interface PipelineColumnItem {
  id: string;
  column: 'New Cases' | 'In Progress' | 'Pending Info' | 'Closed';
  operationsColumn: 'New Starters' | 'Role Profiling' | 'Manager Sign-off' | 'Ready Day-1';
  operationsTitle: string;
  referenceTitle: string;
  waitSubtitle: string;
  avatarUrl: string;
  participantId: string;
  teamId: string;
}

export interface ProgressGridCardItem {
  id: string;
  operationsTitle: string;
  referenceTitle: string;
  budgetAmount: number;
  teamMembersCount: number;
  hoursSpentMetric: number;
  hoursSpentPct: number;
  paybackPct: number;
  avatars: { url: string; badge: number; tone: 'blue' | 'coral' | 'amber' }[];
  muted?: boolean;
  teamId: string;
  roleTag: string;
}

export const RESPONSIBLE_TEAMS: ResponsibleTeamOption[] = [
  {
    id: 'team-a',
    code: 'Team-A',
    name: 'Team-A · Platform Operations',
    referenceSubtitle: 'Main Support Team',
    operationsSubtitle: 'Core Onboarding & Role Profiling',
    memberAvatars: ['/avatars/avatar-3.png', '/avatars/avatar-5.png', '/avatars/avatar-4.png'],
  },
  {
    id: 'team-b',
    code: 'Team-B',
    name: 'Team-B · Custody & Dealing Access',
    referenceSubtitle: 'Main Support Team',
    operationsSubtitle: 'Regulated Dealing & Portals Team',
    memberAvatars: ['/avatars/avatar-4.png', '/avatars/avatar-6.png', '/avatars/avatar-1.png'],
  },
  {
    id: 'team-c',
    code: 'Team-C',
    name: 'Team-C · Identity Engineering',
    referenceSubtitle: 'Development Team',
    operationsSubtitle: 'IAM & Directory Provisioning',
    memberAvatars: ['/avatars/avatar-2.png', '/avatars/avatar-3.png'],
    extraCount: 4,
  },
];

export const INITIAL_NOTCH_PARTICIPANTS: NotchParticipant[] = [
  {
    id: 'p-1',
    name: 'Callum Vance',
    referenceName: 'Alex Thompson',
    roleTitle: 'Investment Operations Analyst',
    teamId: 'team-a',
    department: 'Custody Operations',
    avatarUrl: '/avatars/avatar-1.png',
    badgeCount: 2,
    badgeTone: 'blue',
    workflowStatus: 'Executed',
  },
  {
    id: 'p-2',
    name: 'Maya Lin',
    referenceName: 'Sarah Jenkins',
    roleTitle: 'SIPP Administration Specialist',
    teamId: 'team-a',
    department: 'Pensions Operations',
    avatarUrl: '/avatars/avatar-2.png',
    badgeCount: 3,
    badgeTone: 'blue',
    workflowStatus: 'Executed',
  },
  {
    id: 'p-3',
    name: 'Elena Rostova',
    referenceName: 'Elena Rostova',
    roleTitle: 'Platform Risk & Controls Lead',
    teamId: 'team-b',
    department: 'Operational Risk',
    avatarUrl: '/avatars/avatar-3.png',
    badgeCount: 2,
    badgeTone: 'coral',
    workflowStatus: 'In Review',
  },
  {
    id: 'p-4',
    name: 'Hannah Abbott',
    referenceName: 'Hannah Abbott',
    roleTitle: 'Client Assets (CASS) Associate',
    teamId: 'team-b',
    department: 'Finance & Treasury',
    avatarUrl: '/avatars/avatar-4.png',
    badgeCount: 1,
    badgeTone: 'coral',
    workflowStatus: 'In Review',
  },
  {
    id: 'p-5',
    name: 'Liam O’Connor',
    referenceName: 'Liam O’Connor',
    roleTitle: 'Dealing Desk Technologist',
    teamId: 'team-c',
    department: 'Trading Systems',
    avatarUrl: '/avatars/avatar-5.png',
    badgeCount: 1,
    badgeTone: 'coral',
    workflowStatus: 'Scheduled',
  },
  {
    id: 'p-6',
    name: 'Brian McCartney',
    referenceName: 'Brian McCartney',
    roleTitle: 'Senior Technical Reviewer',
    teamId: 'team-b',
    department: 'Architecture & Access',
    avatarUrl: '/avatars/avatar-6.png',
    badgeCount: 1,
    badgeTone: 'coral',
    workflowStatus: 'In Review',
  },
  {
    id: 'p-7',
    name: 'Owen Sterling',
    referenceName: 'Owen Sterling',
    roleTitle: 'Digital Wealth Product Analyst',
    teamId: 'team-c',
    department: 'Digital Engineering',
    avatarUrl: '/avatars/avatar-7.png',
    badgeCount: null,
    badgeTone: 'plus',
    workflowStatus: 'Scheduled',
  },
  {
    id: 'p-8',
    name: 'Noah Patel',
    referenceName: 'Noah Patel',
    roleTitle: 'Regulatory Reporting Specialist',
    teamId: 'team-a',
    department: 'Compliance Operations',
    avatarUrl: '/avatars/avatar-8.png',
    badgeCount: null,
    badgeTone: 'plus',
    workflowStatus: 'Ready',
  },
];

export const INITIAL_ALLOCATION_CARDS: AllocationCardData[] = [
  {
    id: 'alloc-1',
    stageId: 'starter_details',
    operationsTitle: 'Verify Starter Identity & HR Record!',
    referenceTitle: 'Allocate Case to User!',
    participantId: 'p-3',
    avatarUrl: '/avatars/avatar-3.png',
    verified: true,
    dueDate: '2026-10-21',
    targetTaskIds: ['role-1', 'role-2', 'role-3'],
    connectorTone: 'blue',
    connectorDashed: false,
    formValues: {
      starterFullName: 'Callum Vance (SYNTH-AJB-0142)',
      roleProfileTitle: 'Investment Operations Analyst — Tier 2',
      costCentreCode: 'CC-4102-CUSTODY',
      startDate: '2026-11-02',
      securityClearanceLevel: 'Standard FCA',
      equipmentAllowance: 24985,
      notes: 'Synthetic starter intake verified against HR sandbox profile.',
    },
  },
  {
    id: 'alloc-2',
    stageId: 'starter_details',
    operationsTitle: 'Issue Welcome & Role Profile Pack!',
    referenceTitle: 'Acknowledge Case receipt to customer!',
    participantId: 'p-4',
    avatarUrl: '/avatars/avatar-4.png',
    verified: true,
    dueDate: '2026-10-22',
    targetTaskIds: ['role-4', 'role-5'],
    connectorTone: 'coral',
    connectorDashed: true,
    formValues: {
      starterFullName: 'Maya Lin (SYNTH-AJB-0148)',
      roleProfileTitle: 'SIPP Administration Specialist',
      costCentreCode: 'CC-3090-SIPP',
      startDate: '2026-11-09',
      securityClearanceLevel: 'SMCR Certified',
      equipmentAllowance: 22500,
      notes: 'Pre-boarding disclosures and role matrix sent to candidate.',
    },
  },
];

export const INITIAL_STAGE_TASKS: StageTaskRowData[] = [
  // Stage 2: Role and access profile (Reference: Issue Identification)
  {
    id: 'role-1',
    stageId: 'role_access_profile',
    operationsTitle: 'Select Core Role Family',
    referenceTitle: 'Identify Issue Category',
    assignedParticipantId: 'p-2',
    avatarUrl: '/avatars/avatar-2.png',
    completed: true,
    hasCalendarTag: true,
    incomingTone: 'blue',
    incomingDashed: false,
    targetTaskIds: ['mgr-1', 'mgr-2'],
    roleFilterTag: 'Investment Operations Analyst',
    teamId: 'team-a',
    status: 'Executed',
    formValues: {
      systemEntitlements: 'Settlements Workbench Read/Write, SWIFT Viewer',
      approverName: 'Brian McCartney',
      responsibleTeamId: 'team-a',
      allocatedBudget: 24985,
      slaHours: 12,
      justification: 'Standard role baseline for Custody & Settlements analysts.',
    },
  },
  {
    id: 'role-2',
    stageId: 'role_access_profile',
    operationsTitle: 'Assign FCA / SMCR Tier',
    referenceTitle: 'Identify Issue Severity',
    assignedParticipantId: 'p-2',
    avatarUrl: '/avatars/avatar-2.png',
    completed: true,
    hasCalendarTag: true,
    incomingTone: 'blue',
    incomingDashed: false,
    targetTaskIds: ['mgr-3'],
    roleFilterTag: 'Investment Operations Analyst',
    teamId: 'team-a',
    status: 'Executed',
    formValues: {
      systemEntitlements: 'FCA Conduct Rules Tier 1 + CASS Oversight Read',
      approverName: 'Elena Rostova',
      responsibleTeamId: 'team-b',
      allocatedBudget: 18500,
      slaHours: 24,
      justification: 'Mandatory regulatory classification for client money touchpoints.',
    },
  },
  {
    id: 'role-3',
    stageId: 'role_access_profile',
    operationsTitle: 'Map Platform Entitlements',
    referenceTitle: 'Identify Issue Impact',
    assignedParticipantId: 'p-3',
    avatarUrl: '/avatars/avatar-3.png',
    completed: true,
    hasCalendarTag: true,
    incomingTone: 'blue',
    incomingDashed: false,
    targetTaskIds: ['mgr-3'],
    roleFilterTag: 'SIPP Administration Specialist',
    teamId: 'team-b',
    status: 'Executed',
    formValues: {
      systemEntitlements: 'SIPP Core Portal, Document Vault, BACS Queue Viewer',
      approverName: 'Alex Thompson',
      responsibleTeamId: 'team-b',
      allocatedBudget: 24985,
      slaHours: 16,
      justification: 'Mapped to Team-B custody and pension administration bundle.',
    },
  },
  {
    id: 'role-4',
    stageId: 'role_access_profile',
    operationsTitle: 'Allocate Provisioning Squad',
    referenceTitle: 'Allocate to Resolution Team',
    assignedParticipantId: 'p-2',
    avatarUrl: '/avatars/avatar-2.png',
    completed: false,
    hasCalendarTag: false,
    hasDiagonalConnectorHandle: true,
    incomingTone: 'coral',
    incomingDashed: true,
    targetTaskIds: ['mgr-4'],
    roleFilterTag: 'SIPP Administration Specialist',
    teamId: 'team-b',
    status: 'In Review',
    formValues: {
      systemEntitlements: 'Active Directory Group: AJB-OPS-SIPP-PROD',
      approverName: 'Brian McCartney',
      responsibleTeamId: 'team-b',
      allocatedBudget: 42650,
      slaHours: 8,
      justification: 'Routed to Identity Squad for automated group binding.',
    },
  },
  {
    id: 'role-5',
    stageId: 'role_access_profile',
    operationsTitle: 'Confirm SLA & Day-1 Target',
    referenceTitle: 'Advise Customer of Resolution estimate',
    assignedParticipantId: 'p-4',
    avatarUrl: '/avatars/avatar-4.png',
    completed: false,
    hasCalendarTag: false,
    incomingTone: 'coral',
    incomingDashed: true,
    targetTaskIds: ['mgr-5'],
    roleFilterTag: 'Client Assets (CASS) Associate',
    teamId: 'team-a',
    status: 'Scheduled',
    formValues: {
      systemEntitlements: 'Day-1 Hardware + VPN Token + SSO Enrolment',
      approverName: 'Hannah Abbott',
      responsibleTeamId: 'team-a',
      allocatedBudget: 19200,
      slaHours: 36,
      justification: 'Target completion 48 hours ahead of starter induction.',
    },
  },

  // Stage 3: Manager review (Reference: Technical Resolution)
  {
    id: 'mgr-1',
    stageId: 'manager_review',
    operationsTitle: 'Check Segregation of Duties',
    referenceTitle: 'Identify Issue Dependencies',
    assignedParticipantId: null,
    avatarUrl: null,
    completed: false,
    hasCalendarTag: false,
    incomingTone: 'coral',
    incomingDashed: true,
    targetTaskIds: [],
    roleFilterTag: 'Investment Operations Analyst',
    teamId: 'team-a',
    status: 'Scheduled',
    formValues: {
      systemEntitlements: 'SoD Matrix Check: Maker vs Checker Split',
      approverName: 'Unassigned Reviewer',
      responsibleTeamId: 'team-a',
      allocatedBudget: 15000,
      slaHours: 24,
      justification: 'Awaiting reviewer assignment from top-notch bar.',
    },
  },
  {
    id: 'mgr-2',
    stageId: 'manager_review',
    operationsTitle: 'Approve Dealing Limit Tier',
    referenceTitle: 'Identify Issue Resolution',
    assignedParticipantId: null,
    avatarUrl: null,
    completed: false,
    hasCalendarTag: false,
    incomingTone: 'coral',
    incomingDashed: true,
    targetTaskIds: [],
    roleFilterTag: 'Dealing Desk Technologist',
    teamId: 'team-b',
    status: 'Scheduled',
    formValues: {
      systemEntitlements: 'Dealing Approval Threshold: Tier-1 (£50k ceiling)',
      approverName: 'Unassigned Reviewer',
      responsibleTeamId: 'team-b',
      allocatedBudget: 21400,
      slaHours: 18,
      justification: 'Requires Line Manager sign-off before trading sandbox access.',
    },
  },
  {
    id: 'mgr-3',
    stageId: 'manager_review',
    operationsTitle: 'Sign Off Access Readiness',
    referenceTitle: 'Estimate Resolution Time',
    assignedParticipantId: 'p-6',
    avatarUrl: '/avatars/avatar-6.png',
    completed: true,
    hasCalendarTag: false,
    hasDiagonalConnectorHandle: true,
    incomingTone: 'coral',
    incomingDashed: true,
    targetTaskIds: ['tile-4'],
    roleFilterTag: 'Investment Operations Analyst',
    teamId: 'team-b',
    status: 'In Review',
    formValues: {
      systemEntitlements: 'Full Role Profile Signed Off — Ready for Provisioning',
      approverName: 'Brian McCartney',
      responsibleTeamId: 'team-b',
      allocatedBudget: 24985,
      slaHours: 6,
      justification: 'Assigned to Brian McCartney (frame f=0809 interaction) and connected to Request Processing.',
    },
  },
  {
    id: 'mgr-4',
    stageId: 'manager_review',
    operationsTitle: 'Confirm Line Manager Sign-Off',
    referenceTitle: 'Advise Customer of Resolution Estimate',
    assignedParticipantId: 'p-2',
    avatarUrl: '/avatars/avatar-2.png',
    completed: false,
    hasCalendarTag: false,
    incomingTone: 'coral',
    incomingDashed: true,
    targetTaskIds: ['tile-2'],
    roleFilterTag: 'SIPP Administration Specialist',
    teamId: 'team-a',
    status: 'Executed',
    formValues: {
      systemEntitlements: 'Manager Attestation Recorded in Audit Log',
      approverName: 'Maya Lin',
      responsibleTeamId: 'team-a',
      allocatedBudget: 28400,
      slaHours: 12,
      justification: 'Attestation complete for quarterly audit trail.',
    },
  },
  {
    id: 'mgr-5',
    stageId: 'manager_review',
    operationsTitle: 'Release Onboarding Clearance',
    referenceTitle: 'Advise Customer Issue Resolved',
    assignedParticipantId: null,
    avatarUrl: null,
    completed: false,
    hasCalendarTag: false,
    incomingTone: 'coral',
    incomingDashed: true,
    targetTaskIds: [],
    roleFilterTag: 'Client Assets (CASS) Associate',
    teamId: 'team-c',
    status: 'Scheduled',
    formValues: {
      systemEntitlements: 'Final Day-1 Badge & SSO Activation Release',
      approverName: 'Unassigned Reviewer',
      responsibleTeamId: 'team-c',
      allocatedBudget: 16800,
      slaHours: 8,
      justification: 'Final gate prior to Day-1 induction.',
    },
  },
];

export const INITIAL_ONBOARDING_TILES: OnboardingActionTileData[] = [
  {
    id: 'tile-1',
    stageId: 'ready_for_onboarding',
    operationsTitle: 'Access Provisioning',
    referenceTitle: 'Problem Resolution',
    selected: false,
    completed: false,
    description: 'Configure regulated custody, SIPP, and dealing platform entitlements.',
    checklistItems: [
      'Apply Segregation of Duties (SoD) Guardrails',
      'Enable Read/Write Custody Queues',
    ],
  },
  {
    id: 'tile-2',
    stageId: 'ready_for_onboarding',
    operationsTitle: 'Starter Welcome Pack',
    referenceTitle: 'Customer Communication',
    selected: false,
    completed: false,
    description: 'Send pre-boarding schedule, hybrid equipment tracker, and Day-1 agenda.',
    checklistItems: [
      'Issue Day-1 Induction Schedule',
      'Confirm Manchester / Hybrid Desk Booking',
    ],
  },
  {
    id: 'tile-3',
    stageId: 'ready_for_onboarding',
    operationsTitle: 'Policy & FCA Checks',
    referenceTitle: 'Testing and Verification',
    selected: false,
    completed: false,
    description: 'Verify FCA conduct attestation, CASS training module, and background checks.',
    checklistItems: [
      'Verify Conduct Rules Attestation',
      'Confirm Anti-Money Laundering (AML) Enrolment',
    ],
  },
  {
    id: 'tile-4',
    stageId: 'ready_for_onboarding',
    operationsTitle: 'Request Processing',
    referenceTitle: 'Request Processing',
    selected: true, // Matches static reference image & video f=0909 black tile (#0D0D0F) at Row 2 Col 2
    completed: true,
    description: 'Trigger automated IAM role provisioning and workspace account creation.',
    checklistItems: [
      'Provision Active Directory & SSO Role Bundle',
      'Bind Cost Centre & Approval Hierarchy',
      'Dispatch Welcome Credentials to Line Manager',
    ],
  },
  {
    id: 'tile-5',
    stageId: 'ready_for_onboarding',
    operationsTitle: 'IT & Hardware Dispatch',
    referenceTitle: 'Customer Notification',
    selected: false,
    completed: false,
    description: 'Confirm encrypted laptop build, YubiKey pairing, and courier tracking.',
    checklistItems: [
      'Image MacBook / Windows Ops Workstation',
      'Pair Hardware FIDO2 Security Key',
    ],
  },
  {
    id: 'tile-6',
    stageId: 'ready_for_onboarding',
    operationsTitle: 'Day-1 Readiness Sign-off',
    referenceTitle: 'Customer Satisfaction',
    selected: false,
    completed: false,
    description: 'Record final operations sign-off and close the new starter intake ticket.',
    checklistItems: [
      'Complete 30-Day Buddy Assignment',
      'Archive Signed Role Profile Snapshot',
    ],
  },
];

export const INITIAL_KNOWLEDGE_RECORDS: KnowledgeRecord[] = [
  {
    id: 'kr-1',
    operationsSubject: 'Role Profile Matrix',
    referenceSubject: 'Design Sprint',
    status: 'Executed',
    startDate: '2023-08-20 11:15',
    endDate: '2023-09-21 15:30',
    assignedUser: 'Dan Patrick',
    avatarUrl: '/avatars/avatar-3.png',
    starred: true,
    teamId: 'team-a',
    roleTag: 'Investment Operations Analyst',
  },
  {
    id: 'kr-2',
    operationsSubject: 'CASS & FCA Access Pack',
    referenceSubject: 'Market Analysis',
    status: 'Scheduled',
    startDate: '2023-09-12 09:00',
    endDate: '2023-09-15 17:00',
    assignedUser: 'Sam Peters',
    avatarUrl: '/avatars/avatar-5.png',
    starred: false,
    teamId: 'team-b',
    roleTag: 'SIPP Administration Specialist',
  },
  {
    id: 'kr-3',
    operationsSubject: 'SIPP Dealing Entitlements',
    referenceSubject: 'Policy Review',
    status: 'Executed',
    startDate: '2023-10-02 10:00',
    endDate: '2023-10-05 16:45',
    assignedUser: 'Elena Rostova',
    avatarUrl: '/avatars/avatar-4.png',
    starred: true,
    teamId: 'team-b',
    roleTag: 'Client Assets (CASS) Associate',
  },
];

export const INITIAL_PIPELINE_ITEMS: PipelineColumnItem[] = [
  // Column 1: New Cases / New Starters
  {
    id: 'pipe-1',
    column: 'New Cases',
    operationsColumn: 'New Starters',
    operationsTitle: 'Callum Vance · Custody Ops',
    referenceTitle: 'Retro of Issues',
    waitSubtitle: 'Current wait time: 30 minutes',
    avatarUrl: '/avatars/avatar-6.png',
    participantId: 'p-1',
    teamId: 'team-a',
  },
  {
    id: 'pipe-2',
    column: 'New Cases',
    operationsColumn: 'New Starters',
    operationsTitle: 'Conversion Issues · Role Sync',
    referenceTitle: 'Conversion Issues',
    waitSubtitle: 'Approximate wait: 10 minutes',
    avatarUrl: '/avatars/avatar-1.png',
    participantId: 'p-2',
    teamId: 'team-a',
  },
  {
    id: 'pipe-3',
    column: 'New Cases',
    operationsColumn: 'New Starters',
    operationsTitle: 'Identify Role Access Impact',
    referenceTitle: 'Identify Issue Impact',
    waitSubtitle: 'Anticipated wait: 25 minutes',
    avatarUrl: '/avatars/avatar-4.png',
    participantId: 'p-4',
    teamId: 'team-b',
  },
  {
    id: 'pipe-4',
    column: 'New Cases',
    operationsColumn: 'New Starters',
    operationsTitle: 'SIPP Tier-2 Entitlements',
    referenceTitle: 'Identify Issue Resolution ...',
    waitSubtitle: 'Expected wait: 35 minutes',
    avatarUrl: '/avatars/avatar-3.png',
    participantId: 'p-3',
    teamId: 'team-b',
  },

  // Column 2: In Progress / Role Profiling
  {
    id: 'pipe-5',
    column: 'In Progress',
    operationsColumn: 'Role Profiling',
    operationsTitle: 'Tech Visionaries · IAM',
    referenceTitle: 'Tech Visionaries',
    waitSubtitle: 'Wait time: 22 minutes',
    avatarUrl: '/avatars/avatar-6.png',
    participantId: 'p-6',
    teamId: 'team-b',
  },
  {
    id: 'pipe-6',
    column: 'In Progress',
    operationsColumn: 'Role Profiling',
    operationsTitle: 'Innovative Solutions · SIPP',
    referenceTitle: 'Innovative Solutions',
    waitSubtitle: 'Estimated wait: 28 minutes',
    avatarUrl: '/avatars/avatar-1.png',
    participantId: 'p-1',
    teamId: 'team-a',
  },
  {
    id: 'pipe-7',
    column: 'In Progress',
    operationsColumn: 'Role Profiling',
    operationsTitle: 'Future Tech Alliance · CASS',
    referenceTitle: 'Future Tech Alliance',
    waitSubtitle: 'Projected wait: 33 minutes',
    avatarUrl: '/avatars/avatar-2.png',
    participantId: 'p-2',
    teamId: 'team-b',
  },
  {
    id: 'pipe-8',
    column: 'In Progress',
    operationsColumn: 'Role Profiling',
    operationsTitle: 'NextGen Innovators · Desk',
    referenceTitle: 'NextGen Innovators',
    waitSubtitle: 'Anticipated wait: 15 minutes',
    avatarUrl: '/avatars/avatar-4.png',
    participantId: 'p-4',
    teamId: 'team-c',
  },

  // Column 3: Pending Info / Manager Sign-off
  {
    id: 'pipe-9',
    column: 'Pending Info',
    operationsColumn: 'Manager Sign-off',
    operationsTitle: 'SMCR Conduct Sign-off',
    referenceTitle: 'Retro of Issues',
    waitSubtitle: 'Projected wait: 40 minutes',
    avatarUrl: '/avatars/avatar-3.png',
    participantId: 'p-3',
    teamId: 'team-a',
  },
  {
    id: 'pipe-10',
    column: 'Pending Info',
    operationsColumn: 'Manager Sign-off',
    operationsTitle: 'Dealing Limit Dependencies',
    referenceTitle: 'Identify Dependencies',
    waitSubtitle: 'Estimated wait: 12 minutes',
    avatarUrl: '/avatars/avatar-5.png',
    participantId: 'p-5',
    teamId: 'team-b',
  },
  {
    id: 'pipe-11',
    column: 'Pending Info',
    operationsColumn: 'Manager Sign-off',
    operationsTitle: 'Digital Pioneers · Wealth',
    referenceTitle: 'Digital Pioneers',
    waitSubtitle: 'Expected wait: 8 minutes',
    avatarUrl: '/avatars/avatar-7.png',
    participantId: 'p-7',
    teamId: 'team-c',
  },

  // Column 4: Closed / Ready Day-1
  {
    id: 'pipe-12',
    column: 'Closed',
    operationsColumn: 'Ready Day-1',
    operationsTitle: 'Completed Day-1 Cohort',
    referenceTitle: 'Retro of Issues',
    waitSubtitle: 'Completed 18 minutes ago',
    avatarUrl: '/avatars/avatar-3.png',
    participantId: 'p-8',
    teamId: 'team-a',
  },
];

export const INITIAL_PROGRESS_GRID_CARDS: ProgressGridCardItem[] = [
  {
    id: 'grid-1',
    operationsTitle: 'Conversion Issues · Intake',
    referenceTitle: 'Conversion Issues',
    budgetAmount: 22500,
    teamMembersCount: 4,
    hoursSpentMetric: 0.2,
    hoursSpentPct: 12,
    paybackPct: 3,
    avatars: [
      { url: '/avatars/avatar-3.png', badge: 2, tone: 'coral' },
      { url: '/avatars/avatar-5.png', badge: 1, tone: 'blue' },
      { url: '/avatars/avatar-4.png', badge: 1, tone: 'coral' },
      { url: '/avatars/avatar-6.png', badge: 2, tone: 'blue' },
    ],
    teamId: 'team-a',
    roleTag: 'Investment Operations Analyst',
  },
  {
    id: 'grid-2',
    operationsTitle: 'Tech Visionaries · Custody',
    referenceTitle: 'Tech Visionaries',
    budgetAmount: 12310,
    teamMembersCount: 5,
    hoursSpentMetric: 142.3,
    hoursSpentPct: 68,
    paybackPct: 57,
    avatars: [
      { url: '/avatars/avatar-3.png', badge: 3, tone: 'coral' },
      { url: '/avatars/avatar-5.png', badge: 2, tone: 'blue' },
      { url: '/avatars/avatar-4.png', badge: 1, tone: 'coral' },
      { url: '/avatars/avatar-6.png', badge: 1, tone: 'blue' },
      { url: '/avatars/avatar-7.png', badge: 2, tone: 'amber' },
    ],
    teamId: 'team-b',
    roleTag: 'SIPP Administration Specialist',
  },
  {
    id: 'grid-3',
    operationsTitle: 'Innovative Solutions · IAM',
    referenceTitle: 'Innovative Solutions',
    budgetAmount: 9874,
    teamMembersCount: 2,
    hoursSpentMetric: 89.4,
    hoursSpentPct: 48,
    paybackPct: 45,
    avatars: [
      { url: '/avatars/avatar-2.png', badge: 2, tone: 'blue' },
      { url: '/avatars/avatar-8.png', badge: 3, tone: 'blue' },
    ],
    teamId: 'team-a',
    roleTag: 'Investment Operations Analyst',
  },
  {
    id: 'grid-4',
    operationsTitle: 'Future Tech Alliance · CASS',
    referenceTitle: 'Future Tech Alliance',
    budgetAmount: 15642,
    teamMembersCount: 3,
    hoursSpentMetric: 256.7,
    hoursSpentPct: 76,
    paybackPct: 73,
    avatars: [
      { url: '/avatars/avatar-3.png', badge: 2, tone: 'coral' },
      { url: '/avatars/avatar-5.png', badge: 1, tone: 'amber' },
      { url: '/avatars/avatar-7.png', badge: 3, tone: 'blue' },
    ],
    teamId: 'team-b',
    roleTag: 'Client Assets (CASS) Associate',
  },
  {
    id: 'grid-5',
    operationsTitle: 'NextGen Innovators · SIPP',
    referenceTitle: 'NextGen Innovators',
    budgetAmount: 10200,
    teamMembersCount: 3,
    hoursSpentMetric: 92.5,
    hoursSpentPct: 52,
    paybackPct: 50,
    avatars: [
      { url: '/avatars/avatar-2.png', badge: 1, tone: 'coral' },
      { url: '/avatars/avatar-6.png', badge: 2, tone: 'blue' },
      { url: '/avatars/avatar-8.png', badge: 2, tone: 'blue' },
    ],
    teamId: 'team-c',
    roleTag: 'Dealing Desk Technologist',
  },
  {
    id: 'grid-6',
    operationsTitle: 'Cloud Champions · Platform',
    referenceTitle: 'Cloud Champions',
    budgetAmount: 23000,
    teamMembersCount: 6,
    hoursSpentMetric: 325.4,
    hoursSpentPct: 82,
    paybackPct: 65,
    avatars: [
      { url: '/avatars/avatar-3.png', badge: 2, tone: 'coral' },
      { url: '/avatars/avatar-5.png', badge: 3, tone: 'blue' },
      { url: '/avatars/avatar-4.png', badge: 1, tone: 'coral' },
      { url: '/avatars/avatar-6.png', badge: 2, tone: 'blue' },
      { url: '/avatars/avatar-8.png', badge: 1, tone: 'amber' },
    ],
    teamId: 'team-b',
    roleTag: 'SIPP Administration Specialist',
  },
  {
    id: 'grid-7',
    operationsTitle: 'Smart Systems Group · Risk',
    referenceTitle: 'Smart Systems Group',
    budgetAmount: 9874,
    teamMembersCount: 5,
    hoursSpentMetric: 92.5,
    hoursSpentPct: 54,
    paybackPct: 50,
    avatars: [
      { url: '/avatars/avatar-3.png', badge: 2, tone: 'coral' },
      { url: '/avatars/avatar-5.png', badge: 2, tone: 'blue' },
      { url: '/avatars/avatar-4.png', badge: 1, tone: 'coral' },
      { url: '/avatars/avatar-1.png', badge: 3, tone: 'blue' },
      { url: '/avatars/avatar-7.png', badge: 2, tone: 'amber' },
    ],
    teamId: 'team-a',
    roleTag: 'Client Assets (CASS) Associate',
  },
  {
    id: 'grid-8',
    operationsTitle: 'Data Dynamics · Reporting',
    referenceTitle: 'Data Dynamics',
    budgetAmount: 15642,
    teamMembersCount: 4,
    hoursSpentMetric: 260.1,
    hoursSpentPct: 78,
    paybackPct: 75,
    avatars: [
      { url: '/avatars/avatar-2.png', badge: 1, tone: 'coral' },
      { url: '/avatars/avatar-6.png', badge: 2, tone: 'blue' },
      { url: '/avatars/avatar-7.png', badge: 2, tone: 'amber' },
      { url: '/avatars/avatar-8.png', badge: 3, tone: 'blue' },
    ],
    teamId: 'team-c',
    roleTag: 'Dealing Desk Technologist',
  },
];
