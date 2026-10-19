import React, { useState } from 'react';
import {
  Plus,
  SlidersHorizontal,
  Search,
  MoreHorizontal,
  Star,
  Calendar,
  ArrowUpRight,
  RotateCcw,
} from 'lucide-react';
import {
  KnowledgeRecord,
  LabelParityMode,
  RESPONSIBLE_TEAMS,
  WorkflowStatus,
} from '../../data/syntheticStarters';
import {
  ConnectorRenderVariant,
  SimulationViewStatus,
} from '../../state/useStarterStore';
import { StatusPillBadge } from './AvatarAndStatus';

export interface SuggestedKnowledgeTableProps {
  records: KnowledgeRecord[];
  labelMode: LabelParityMode;
  onToggleStar: (recordId: string) => void;
  onAddRecord: () => void;
}

export const SuggestedKnowledgeTable: React.FC<SuggestedKnowledgeTableProps> = ({
  records,
  labelMode,
  onToggleStar,
  onAddRecord,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [statusToggle, setStatusToggle] = useState<'all' | 'Executed' | 'Scheduled'>('all');

  const filtered = records.filter((rec) => {
    if (statusToggle !== 'all' && rec.status !== statusToggle) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const subj = (
        labelMode === 'reference' ? rec.referenceSubject : rec.operationsSubject
      ).toLowerCase();
      return subj.includes(q) || rec.assignedUser.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <section
      aria-label="Suggested Knowledge"
      style={{
        padding: '16px 20px',
        borderRadius: '24px',
        background: 'rgba(255, 255, 255, 0.56)',
        border: '1px solid var(--ajb-border-subtle)',
        boxShadow: 'var(--ajb-shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Header Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h3
            style={{
              margin: 0,
              fontSize: '15px',
              fontWeight: 500,
              letterSpacing: '-0.015em',
              color: 'var(--ajb-text-primary)',
            }}
          >
            {labelMode === 'reference' ? 'Suggested Knowledge' : 'Starter Governance & Runbooks'}
          </h3>
          <span
            className="ajb-tabular"
            style={{
              padding: '2px 7px',
              borderRadius: '9999px',
              background: 'rgba(235, 235, 229, 0.92)',
              fontSize: '10.5px',
              fontWeight: 600,
              color: 'var(--ajb-text-secondary)',
            }}
          >
            28
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {showSearchInput && (
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter subject..."
              aria-label="Filter Suggested Knowledge records"
              style={{
                height: '28px',
                padding: '0 10px',
                borderRadius: '9999px',
                border: '1px solid var(--ajb-border-strong)',
                background: '#FFFFFF',
                fontSize: '11px',
                color: 'var(--ajb-text-primary)',
                outline: 'none',
                width: '130px',
              }}
            />
          )}
          <button
            type="button"
            onClick={onAddRecord}
            aria-label="Add new knowledge or starter case"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '9999px',
              border: '1px solid var(--ajb-border-subtle)',
              background: 'var(--ajb-surface-card)',
              color: 'var(--ajb-text-secondary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Plus size={13} />
          </button>
          <button
            type="button"
            onClick={() =>
              setStatusToggle((prev) =>
                prev === 'all' ? 'Executed' : prev === 'Executed' ? 'Scheduled' : 'all'
              )
            }
            title={`Filter status (Current: ${statusToggle})`}
            aria-label="Cycle knowledge status filter"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '9999px',
              border:
                statusToggle !== 'all'
                  ? '1px solid var(--ajb-accent-black)'
                  : '1px solid var(--ajb-border-subtle)',
              background: 'var(--ajb-surface-card)',
              color: 'var(--ajb-text-secondary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <SlidersHorizontal size={12} />
          </button>
          <button
            type="button"
            onClick={() => setShowSearchInput((prev) => !prev)}
            aria-label="Toggle search input"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '9999px',
              border: '1px solid var(--ajb-border-subtle)',
              background: 'var(--ajb-surface-card)',
              color: 'var(--ajb-text-secondary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <Search size={12} />
          </button>
          <button
            type="button"
            aria-label="More table options"
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '9999px',
              border: '1px solid var(--ajb-border-subtle)',
              background: 'var(--ajb-surface-card)',
              color: 'var(--ajb-text-secondary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <MoreHorizontal size={13} />
          </button>
        </div>
      </div>

      {/* Column Headers */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2.1fr 0.95fr 1fr 1fr 1.25fr',
          gap: '8px',
          padding: '0 8px 6px',
          fontSize: '10px',
          color: 'var(--ajb-text-muted)',
          fontWeight: 500,
        }}
      >
        <span>Subject</span>
        <span>Status</span>
        <span>Start Date</span>
        <span>End Date</span>
        <span>Assigned User</span>
      </div>

      {/* Rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {filtered.map((rec) => {
          const subject =
            labelMode === 'reference' ? rec.referenceSubject : rec.operationsSubject;
          return (
            <div
              key={rec.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '2.1fr 0.95fr 1fr 1fr 1.25fr',
                alignItems: 'center',
                gap: '8px',
                padding: '7px 10px',
                borderRadius: '14px',
                background: 'var(--ajb-surface-card)',
                border: '1px solid rgba(36, 36, 36, 0.05)',
                fontSize: '11.5px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  minWidth: 0,
                }}
              >
                <button
                  type="button"
                  onClick={() => onToggleStar(rec.id)}
                  aria-label={`Bookmark ${subject}`}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    padding: 0,
                    cursor: 'pointer',
                    color: rec.starred ? '#E81A41' : 'var(--ajb-text-muted)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Star
                    size={12}
                    fill={rec.starred ? '#E81A41' : 'none'}
                    strokeWidth={1.8}
                  />
                </button>
                <span
                  style={{
                    fontWeight: 500,
                    color: 'var(--ajb-text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {subject}
                </span>
              </div>

              <div>
                <StatusPillBadge status={rec.status} />
              </div>

              <div
                className="ajb-tabular"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  color: 'var(--ajb-text-secondary)',
                }}
              >
                <Calendar size={11} style={{ opacity: 0.55 }} />
                {rec.startDate}
              </div>

              <div
                className="ajb-tabular"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  color: 'var(--ajb-text-secondary)',
                }}
              >
                <Calendar size={11} style={{ opacity: 0.55 }} />
                {rec.endDate}
              </div>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '2px 8px 2px 3px',
                  borderRadius: '9999px',
                  background: 'rgba(235, 235, 229, 0.85)',
                  width: 'fit-content',
                  maxWidth: '100%',
                }}
              >
                <img
                  src={rec.avatarUrl}
                  alt=""
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '9999px',
                    objectFit: 'cover',
                  }}
                />
                <span
                  style={{
                    fontSize: '10.5px',
                    fontWeight: 500,
                    color: 'var(--ajb-text-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {rec.assignedUser}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export interface SupportTicketJourneyCardProps {
  labelMode: LabelParityMode;
}

export const SupportTicketJourneyCard: React.FC<SupportTicketJourneyCardProps> = ({
  labelMode,
}) => {
  const [activeMonth, setActiveMonth] = useState<'Feb' | 'Mar'>('Feb');

  const counts =
    activeMonth === 'Feb'
      ? { executed: 5, active: 7 }
      : { executed: 8, active: 6 };

  return (
    <section
      aria-label="Support Ticket Journey"
      style={{
        padding: '16px 20px 0 20px',
        borderRadius: '26px',
        background: 'var(--ajb-surface-stage-column)',
        border: '1px solid var(--ajb-border-glass)',
        boxShadow: 'var(--ajb-shadow-stage)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '198px',
      }}
    >
      {/* Top Row: Heading + Feb/Mar Pill Toggle (Matches Reference Image 1:1) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '8px',
          zIndex: 3,
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: '15px',
            fontWeight: 500,
            lineHeight: 1.22,
            letterSpacing: '-0.015em',
            color: 'var(--ajb-text-primary)',
            maxWidth: '130px',
          }}
        >
          {labelMode === 'reference'
            ? 'Support Ticket Journey'
            : 'Support Ticket Journey'}
        </h3>

        <div
          style={{
            display: 'inline-flex',
            gap: '6px',
            alignItems: 'center',
          }}
        >
          {(['Feb', 'Mar'] as const).map((m) => {
            const active = activeMonth === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => setActiveMonth(m)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '9999px',
                  border: active ? 'none' : '1px solid rgba(255, 255, 255, 0.85)',
                  background: active ? 'var(--ajb-surface-selected-gradient)' : '#FFFFFF',
                  color: active ? '#FFFFFF' : 'var(--ajb-text-primary)',
                  boxShadow: active
                    ? '0 6px 14px rgba(93, 10, 26, 0.24)'
                    : '0 2px 6px rgba(36, 20, 24, 0.05)',
                  fontSize: '11px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all var(--ajb-duration-hover) var(--ajb-ease-standard)',
                }}
              >
                {m}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Rising Semi-Circular Domes: Executed (5, AJ Bell Crimson) & Active (7, AJ Bell Berry) */}
      <div
        style={{
          position: 'relative',
          height: '132px',
          marginTop: '8px',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
      >
        {/* Left Crimson Dome: Executed (5) */}
        <div
          style={{
            position: 'absolute',
            left: '-6px',
            bottom: '-34px',
            width: '148px',
            height: '126px',
            borderRadius: '9999px 9999px 0 0',
            background: 'var(--ajb-accent-periwinkle-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: '12px',
            zIndex: 2,
            transition: 'transform var(--ajb-duration-morph) var(--ajb-ease-spring)',
          }}
        >
          {/* Floating count circle '5' perched on top-left arc */}
          <span
            className="ajb-tabular"
            style={{
              position: 'absolute',
              top: '-6px',
              left: '22px',
              width: '26px',
              height: '26px',
              borderRadius: '9999px',
              background: '#F2F2EA',
              border: '2px solid rgba(255, 255, 255, 0.92)',
              color: '#5D0A1A',
              fontSize: '11px',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(36, 20, 24, 0.08)',
            }}
          >
            {counts.executed}
          </span>
          <span
            style={{
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '-0.01em',
            }}
          >
            Executed
          </span>
        </div>

        {/* Right Berry Dome: Active (7) */}
        <div
          style={{
            position: 'absolute',
            right: '-10px',
            bottom: '-28px',
            width: '166px',
            height: '146px',
            borderRadius: '9999px 9999px 0 0',
            background: 'var(--ajb-accent-coral-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: '18px',
            zIndex: 1,
            transition: 'transform var(--ajb-duration-morph) var(--ajb-ease-spring)',
          }}
        >
          {/* Floating count circle '7' perched on top-left arc */}
          <span
            className="ajb-tabular"
            style={{
              position: 'absolute',
              top: '-4px',
              left: '20px',
              width: '28px',
              height: '28px',
              borderRadius: '9999px',
              background: '#F2F2EA',
              border: '2px solid rgba(255, 255, 255, 0.92)',
              color: '#5D0A1A',
              fontSize: '11px',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(36, 20, 24, 0.08)',
            }}
          >
            {counts.active}
          </span>
          <span
            style={{
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '-0.01em',
            }}
          >
            Active
          </span>
        </div>
      </div>
    </section>
  );
};

export interface PipelineBottomMetricsProps {
  labelMode: LabelParityMode;
}

export const PipelineBottomMetrics: React.FC<PipelineBottomMetricsProps> = ({
  labelMode,
}) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1.85fr 1fr 0.9fr',
        gap: '16px',
        marginTop: '14px',
      }}
    >
      {/* Last Successful Cases */}
      <div
        style={{
          padding: '16px 20px',
          borderRadius: '24px',
          background: 'rgba(255, 255, 255, 0.56)',
          border: '1px solid var(--ajb-border-subtle)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '10px',
          }}
        >
          <h3 style={{ margin: 0, fontSize: '14.5px', fontWeight: 500 }}>
            {labelMode === 'reference'
              ? 'Last Successful Cases'
              : 'Recently Completed Starters'}
          </h3>
          <span
            className="ajb-tabular"
            style={{
              padding: '2px 7px',
              borderRadius: '9999px',
              background: 'rgba(235, 235, 229, 0.92)',
              fontSize: '10.5px',
              fontWeight: 600,
            }}
          >
            28
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            {
              title:
                labelMode === 'reference'
                  ? 'Account Recovery Request'
                  : 'SIPP Operations Role Pack',
              status: 'Executed' as const,
              start: '16 Feb',
              end: '16 Mar',
              user: 'John Davis',
              avatar: '/avatars/avatar-3.png',
            },
            {
              title:
                labelMode === 'reference'
                  ? 'Payment Decline Issue'
                  : 'Custody Dealing Entitlements',
              status: 'Scheduled' as const,
              start: '28 Feb',
              end: '27 Mar',
              user: 'Alex Morgan',
              avatar: '/avatars/avatar-5.png',
            },
          ].map((row, idx) => (
            <div
              key={idx}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.8fr 0.9fr 0.9fr 0.9fr 1.1fr',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 10px',
                borderRadius: '14px',
                background: 'var(--ajb-surface-card)',
                fontSize: '11px',
              }}
            >
              <span style={{ fontWeight: 500 }}>{row.title}</span>
              <StatusPillBadge status={row.status} />
              <span className="ajb-tabular" style={{ color: 'var(--ajb-text-secondary)' }}>
                {row.start}
              </span>
              <span className="ajb-tabular" style={{ color: 'var(--ajb-text-secondary)' }}>
                {row.end}
              </span>
              <span style={{ fontWeight: 500 }}>{row.user}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Workload Bar Chart (Matches f=0000 bottom middle) */}
      <div
        style={{
          padding: '16px 20px',
          borderRadius: '24px',
          background: 'rgba(255, 255, 255, 0.56)',
          border: '1px solid var(--ajb-border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '14.5px', fontWeight: 500 }}>
            {labelMode === 'reference' ? 'Agent Workload' : 'Reviewer Capacity'}
          </h3>
          <span
            className="ajb-tabular"
            style={{ fontSize: '18px', fontWeight: 600, color: 'var(--ajb-text-primary)' }}
          >
            82%
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px',
            alignItems: 'end',
            height: '86px',
            marginTop: '10px',
          }}
        >
          {[
            { pct: '68%', tone: 'rgba(232, 26, 65, 0.78)', color: '#FFFFFF', avatar: '/avatars/avatar-1.png' },
            { pct: '82%', tone: 'rgba(232, 26, 65, 0.94)', color: '#FFFFFF', avatar: '/avatars/avatar-3.png' },
            { pct: '65%', tone: 'rgba(176, 0, 84, 0.82)', color: '#FFFFFF', avatar: '/avatars/avatar-4.png' },
            { pct: '48%', tone: 'rgba(235, 235, 229, 0.95)', color: 'var(--ajb-text-primary)', avatar: '/avatars/avatar-6.png' },
          ].map((bar, idx) => (
            <div
              key={idx}
              style={{
                height: bar.pct,
                borderRadius: '14px',
                background: bar.tone,
                color: bar.color,
                padding: '6px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span className="ajb-tabular" style={{ fontSize: '9.5px', fontWeight: 600 }}>
                {bar.pct}
              </span>
              <img
                src={bar.avatar}
                alt=""
                style={{ width: '20px', height: '20px', borderRadius: '9999px' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Top Topics Pill Cloud (Matches f=0000 bottom right) */}
      <div
        style={{
          padding: '16px 20px',
          borderRadius: '24px',
          background: 'rgba(255, 255, 255, 0.56)',
          border: '1px solid var(--ajb-border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <h3 style={{ margin: 0, fontSize: '14.5px', fontWeight: 500 }}>
          {labelMode === 'reference' ? 'Top Topics' : 'Entitlement Clusters'}
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
          {['Billing', 'Platform Bugs', 'Shipping', 'Account Access', 'SMCR', 'Custody'].map(
            (tag, idx) => (
              <span
                key={tag}
                style={{
                  padding: '5px 11px',
                  borderRadius: '9999px',
                  background: idx === 1 ? 'var(--ajb-accent-black)' : '#FFFFFF',
                  color: idx === 1 ? '#FFFFFF' : 'var(--ajb-text-primary)',
                  fontSize: '10.5px',
                  fontWeight: 500,
                  border: '1px solid var(--ajb-border-subtle)',
                }}
              >
                {tag}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export interface WorkflowFilterBarProps {
  roleFilter: string;
  teamFilter: string;
  statusFilter: WorkflowStatus | 'all';
  connectorVariant: ConnectorRenderVariant;
  simulationStatus: SimulationViewStatus;
  onChangeRoleFilter: (role: string) => void;
  onChangeTeamFilter: (team: string) => void;
  onChangeStatusFilter: (status: WorkflowStatus | 'all') => void;
  onChangeConnectorVariant: (variant: ConnectorRenderVariant) => void;
  onChangeSimulationStatus: (sim: SimulationViewStatus) => void;
  onResetAll: () => void;
}

export const WorkflowFilterBar: React.FC<WorkflowFilterBarProps> = ({
  roleFilter,
  teamFilter,
  statusFilter,
  connectorVariant,
  simulationStatus,
  onChangeRoleFilter,
  onChangeTeamFilter,
  onChangeStatusFilter,
  onChangeConnectorVariant,
  onChangeSimulationStatus,
  onResetAll,
}) => {
  return (
    <div
      role="region"
      aria-label="Operations workflow filters and state controls"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
        padding: '8px 14px',
        borderRadius: '16px',
        background: 'rgba(255, 255, 255, 0.55)',
        border: '1px solid var(--ajb-border-subtle)',
        marginBottom: '12px',
        fontSize: '11px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{ fontWeight: 600, color: 'var(--ajb-text-secondary)' }}>
          Filter Journey:
        </span>

        {/* Role Filter */}
        <select
          aria-label="Filter by Role Profile"
          value={roleFilter}
          onChange={(e) => onChangeRoleFilter(e.target.value)}
          style={{
            padding: '4px 10px',
            borderRadius: '9999px',
            border: '1px solid var(--ajb-border-subtle)',
            background: '#FFFFFF',
            fontSize: '11px',
            color: 'var(--ajb-text-primary)',
            cursor: 'pointer',
          }}
        >
          <option value="all">All Roles</option>
          <option value="Investment Operations Analyst">Investment Operations Analyst</option>
          <option value="SIPP Administration Specialist">SIPP Administration Specialist</option>
          <option value="Platform Risk & Controls Lead">Platform Risk & Controls Lead</option>
          <option value="Client Assets (CASS) Associate">Client Assets (CASS) Associate</option>
        </select>

        {/* Team Filter */}
        <select
          aria-label="Filter by Responsible Team"
          value={teamFilter}
          onChange={(e) => onChangeTeamFilter(e.target.value)}
          style={{
            padding: '4px 10px',
            borderRadius: '9999px',
            border: '1px solid var(--ajb-border-subtle)',
            background: '#FFFFFF',
            fontSize: '11px',
            color: 'var(--ajb-text-primary)',
            cursor: 'pointer',
          }}
        >
          <option value="all">All Teams</option>
          {RESPONSIBLE_TEAMS.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        {/* Workflow Status Filter */}
        <select
          aria-label="Filter by Workflow Status"
          value={statusFilter}
          onChange={(e) =>
            onChangeStatusFilter(e.target.value as WorkflowStatus | 'all')
          }
          style={{
            padding: '4px 10px',
            borderRadius: '9999px',
            border: '1px solid var(--ajb-border-subtle)',
            background: '#FFFFFF',
            fontSize: '11px',
            color: 'var(--ajb-text-primary)',
            cursor: 'pointer',
          }}
        >
          <option value="all">All Statuses</option>
          <option value="Executed">Executed</option>
          <option value="Scheduled">Scheduled</option>
          <option value="In Review">In Review</option>
        </select>
      </div>

      {/* Right Side: Connector Variant + State Switcher + Reset */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
        <button
          type="button"
          onClick={() =>
            onChangeConnectorVariant(
              connectorVariant === 'static_solid_dark'
                ? 'video_dashed_coral'
                : 'static_solid_dark'
            )
          }
          title="Switch Stage 3→4 connector between static image f=0909 (solid dark arrow) and video f=0950 (routed dashed coral)"
          style={{
            padding: '4px 10px',
            borderRadius: '9999px',
            border: '1px solid var(--ajb-border-subtle)',
            background: '#FFFFFF',
            fontSize: '10.5px',
            fontWeight: 500,
            color: 'var(--ajb-text-secondary)',
            cursor: 'pointer',
          }}
        >
          Connector: {connectorVariant === 'static_solid_dark' ? 'Static Image (Dark Arrow)' : 'Video f=0950 (Dashed Berry)'}
        </button>

        {/* View State Simulator (Normal / Loading / Empty / Error / Completed) */}
        <div
          role="group"
          aria-label="Workflow state view switcher"
          style={{
            display: 'inline-flex',
            padding: '2px',
            borderRadius: '9999px',
            background: 'rgba(235, 235, 229, 0.92)',
          }}
        >
          {(['normal', 'loading', 'empty', 'error', 'completed'] as const).map((st) => {
            const active = simulationStatus === st;
            return (
              <button
                key={st}
                type="button"
                onClick={() => onChangeSimulationStatus(st)}
                style={{
                  padding: '3px 8px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: active ? 'var(--ajb-accent-black)' : 'transparent',
                  color: active ? '#FFFFFF' : 'var(--ajb-text-secondary)',
                  fontSize: '10px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {st}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onResetAll}
          title="Reset local storage draft and synthetic records"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 9px',
            borderRadius: '9999px',
            border: '1px solid var(--ajb-border-subtle)',
            background: '#FFFFFF',
            fontSize: '10.5px',
            color: 'var(--ajb-text-secondary)',
            cursor: 'pointer',
          }}
        >
          <RotateCcw size={11} />
          Reset
        </button>
      </div>
    </div>
  );
};
