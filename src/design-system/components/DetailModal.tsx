import React, { useEffect, useRef, useState } from 'react';
import { X, ChevronDown, ChevronUp, DollarSign, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import {
  JourneyStageId,
  LabelParityMode,
  RESPONSIBLE_TEAMS,
  STAGE_METADATA,
} from '../../data/syntheticStarters';
import { ModalFormDraft, ValidationErrors } from '../../state/useStarterStore';

export interface DetailModalProps {
  open: boolean;
  labelMode: LabelParityMode;
  draft: ModalFormDraft;
  errors: ValidationErrors;
  onClose: () => void;
  onUpdateDraft: (patch: Partial<ModalFormDraft>) => void;
  onSaveDraft: () => void;
  onSubmit: () => boolean;
}

export const DetailModal: React.FC<DetailModalProps> = ({
  open,
  labelMode,
  draft,
  errors,
  onClose,
  onUpdateDraft,
  onSaveDraft,
  onSubmit,
}) => {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [teamDropdownOpen, setTeamDropdownOpen] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const selectedTeam =
    RESPONSIBLE_TEAMS.find((t) => t.id === draft.responsibleTeamId) || RESPONSIBLE_TEAMS[0];

  const budgetMin = 5000;
  const budgetMax = 80000;
  const budgetPct = Math.min(
    100,
    Math.max(0, ((draft.allocatedBudget - budgetMin) / (budgetMax - budgetMin)) * 100)
  );

  const modalHeading =
    draft.mode === 'add_case'
      ? labelMode === 'reference'
        ? 'Add New Case'
        : 'Add New Starter Profile'
      : labelMode === 'reference'
        ? 'Processing of the New Case'
        : 'Starter Role & Entitlement Profile';

  const submitLabel =
    draft.mode === 'add_case'
      ? labelMode === 'reference'
        ? 'Add Case'
        : 'Create Starter Case'
      : labelMode === 'reference'
        ? 'Take for Processing'
        : 'Save & Confirm Stage';

  const stageOrder: JourneyStageId[] = [
    'starter_details',
    'role_access_profile',
    'manager_review',
    'ready_for_onboarding',
  ];

  const handleStageStep = (direction: 'prev' | 'next') => {
    const idx = stageOrder.indexOf(draft.activeStageTab);
    if (direction === 'prev' && idx > 0) {
      onUpdateDraft({ activeStageTab: stageOrder[idx - 1] });
    } else if (direction === 'next' && idx < stageOrder.length - 1) {
      onUpdateDraft({ activeStageTab: stageOrder[idx + 1] });
    }
  };

  return (
    <dialog
      ref={dialogRef}
      {...({ closedby: 'any' } as Record<string, string>)}
      onClose={onClose}
      aria-labelledby="ajb-modal-title"
      style={{
        margin: 'auto',
        width: '560px',
        maxWidth: 'calc(100vw - 32px)',
        borderRadius: '30px',
        padding: '28px 30px 26px',
        background: 'var(--ajb-surface-modal)',
        border: '1px solid var(--ajb-border-subtle)',
        boxShadow: 'var(--ajb-shadow-modal)',
        color: 'var(--ajb-text-primary)',
        overflow: 'visible',
      }}
    >
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        {/* Modal Header (Matches f=0145 / f=0461) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
          }}
        >
          <div>
            <h2
              id="ajb-modal-title"
              style={{
                margin: 0,
                fontSize: '21px',
                fontWeight: 500,
                letterSpacing: '-0.02em',
                color: 'var(--ajb-text-primary)',
              }}
            >
              {modalHeading}
            </h2>
            {draft.lastSavedAt && (
              <div
                style={{
                  fontSize: '10.5px',
                  color: 'var(--ajb-status-executed)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginTop: '3px',
                }}
              >
                <CheckCircle2 size={11} />
                Local draft saved at {draft.lastSavedAt}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '9999px',
              border: '1px solid var(--ajb-border-subtle)',
              background: 'var(--ajb-surface-elevated)',
              color: 'var(--ajb-text-secondary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: 'var(--ajb-shadow-pill)',
            }}
          >
            <X size={16} strokeWidth={1.9} />
          </button>
        </div>

        {/* Stage Switcher Tabs (Retains entered information while moving between stages) */}
        <div
          role="tablist"
          aria-label="Starter journey stages"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '6px',
            padding: '4px',
            borderRadius: '14px',
            background: 'var(--ajb-surface-input-pill)',
            marginBottom: '16px',
          }}
        >
          {STAGE_METADATA.map((st, idx) => {
            const active = draft.activeStageTab === st.id;
            const tabLabel =
              labelMode === 'reference' ? st.referenceTitle : st.operationsTitle;
            return (
              <button
                key={st.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onUpdateDraft({ activeStageTab: st.id })}
                style={{
                  padding: '6px 8px',
                  borderRadius: '10px',
                  border: 'none',
                  background: active ? 'var(--ajb-accent-black)' : 'transparent',
                  color: active ? '#FFFFFF' : 'var(--ajb-text-secondary)',
                  fontSize: '11px',
                  fontWeight: active ? 600 : 500,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  transition: 'all 150ms ease',
                }}
              >
                {idx + 1}. {tabLabel}
              </button>
            );
          })}
        </div>

        {/* Field 1: Case Name / Starter Role Title (Pill Container matching f=0145) */}
        <div
          style={{
            padding: '12px 18px',
            borderRadius: '20px',
            background: 'var(--ajb-surface-input-pill)',
            border: errors.caseName
              ? '1.5px solid var(--ajb-accent-coral)'
              : '1px solid var(--ajb-border-subtle)',
            marginBottom: '10px',
          }}
        >
          <label
            htmlFor="ajb-field-case-name"
            style={{
              display: 'block',
              fontSize: '11px',
              color: 'var(--ajb-text-muted)',
              marginBottom: '3px',
            }}
          >
            {labelMode === 'reference' ? 'Case Name' : 'Starter / Case Name'}
          </label>
          <input
            id="ajb-field-case-name"
            type="text"
            required
            minLength={3}
            value={draft.caseName}
            aria-invalid={Boolean(errors.caseName)}
            aria-describedby={errors.caseName ? 'ajb-err-case-name' : undefined}
            onChange={(e) => onUpdateDraft({ caseName: e.target.value })}
            style={{
              width: '100%',
              border: 'none',
              background: 'transparent',
              fontSize: '14.5px',
              fontWeight: 600,
              color: 'var(--ajb-text-primary)',
              outline: 'none',
              padding: 0,
            }}
          />
          {errors.caseName && (
            <div
              id="ajb-err-case-name"
              role="alert"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                marginTop: '4px',
                fontSize: '11px',
                color: 'var(--ajb-accent-coral)',
              }}
            >
              <AlertCircle size={12} />
              {errors.caseName}
            </div>
          )}
        </div>

        {/* Field 2: Case Creator / Hiring Lead (Pill with Avatar matching f=0145) */}
        <div
          style={{
            padding: '10px 18px',
            borderRadius: '20px',
            background: 'var(--ajb-surface-input-pill)',
            border: '1px solid var(--ajb-border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '10px',
          }}
        >
          <div>
            <div style={{ fontSize: '11px', color: 'var(--ajb-text-muted)' }}>
              {labelMode === 'reference' ? 'Case Creator' : 'Sponsoring Manager / Creator'}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginTop: '4px',
              }}
            >
              <img
                src={draft.creatorAvatar}
                alt={draft.creatorName}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '9999px',
                  objectFit: 'cover',
                  border: '1.5px solid var(--ajb-border-subtle)',
                }}
              />
              <div>
                <div
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--ajb-text-primary)',
                  }}
                >
                  {draft.creatorName}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--ajb-text-muted)' }}>
                  {draft.creatorRole}
                </div>
              </div>
            </div>
          </div>
          <span
            style={{
              fontSize: '11px',
              padding: '3px 9px',
              borderRadius: '9999px',
              background: 'var(--ajb-surface-elevated)',
              border: '1px solid var(--ajb-border-subtle)',
              color: 'var(--ajb-text-secondary)',
            }}
          >
            Synthetic Profile
          </span>
        </div>

        {/* Field 3: Responsible Team Accordion (Reproduces Seq 04 f=0461..0531) */}
        <div
          style={{
            borderRadius: '20px',
            background: 'var(--ajb-surface-input-pill)',
            border: '1px solid var(--ajb-border-subtle)',
            marginBottom: '10px',
            overflow: 'hidden',
            transition: 'all 220ms var(--ajb-ease-panel)',
          }}
        >
          <button
            type="button"
            onClick={() => setTeamDropdownOpen((prev) => !prev)}
            aria-expanded={teamDropdownOpen}
            style={{
              width: '100%',
              padding: '12px 18px',
              border: 'none',
              background: 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: 'var(--ajb-text-muted)' }}>
                Responsible Team
              </div>
              <div
                style={{
                  fontSize: '14.5px',
                  fontWeight: 600,
                  color: 'var(--ajb-text-primary)',
                  marginTop: '2px',
                }}
              >
                {labelMode === 'reference' ? selectedTeam.code : selectedTeam.name}
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {selectedTeam.memberAvatars.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt=""
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '9999px',
                      objectFit: 'cover',
                      border: '1.5px solid var(--ajb-surface-elevated)',
                      marginLeft: idx === 0 ? 0 : '-7px',
                    }}
                  />
                ))}
                {selectedTeam.extraCount && (
                  <span
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '9999px',
                      background: 'var(--ajb-accent-black)',
                      color: '#FFFFFF',
                      fontSize: '10px',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginLeft: '-7px',
                      border: '1.5px solid var(--ajb-surface-elevated)',
                    }}
                  >
                    +{selectedTeam.extraCount}
                  </span>
                )}
              </div>
              {teamDropdownOpen ? (
                <ChevronUp size={16} color="var(--ajb-text-secondary)" />
              ) : (
                <ChevronDown size={16} color="var(--ajb-text-secondary)" />
              )}
            </div>
          </button>

          {teamDropdownOpen && (
            <div
              role="listbox"
              aria-label="Select responsible team"
              style={{
                padding: '4px 12px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                borderTop: '1px solid var(--ajb-border-subtle)',
              }}
            >
              {RESPONSIBLE_TEAMS.map((team) => {
                const isSelected = team.id === draft.responsibleTeamId;
                return (
                  <button
                    key={team.id}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onUpdateDraft({ responsibleTeamId: team.id });
                      setTeamDropdownOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      borderRadius: '14px',
                      border: isSelected
                        ? '1px solid var(--ajb-accent-black)'
                        : '1px solid transparent',
                      background: isSelected ? 'var(--ajb-surface-elevated)' : 'var(--ajb-surface-subpanel)',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '13.5px',
                          fontWeight: 600,
                          color: 'var(--ajb-text-primary)',
                        }}
                      >
                        {labelMode === 'reference' ? team.code : team.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--ajb-text-muted)' }}>
                        {labelMode === 'reference'
                          ? team.referenceSubtitle
                          : team.operationsSubtitle}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {team.memberAvatars.map((url, idx) => (
                        <img
                          key={idx}
                          src={url}
                          alt=""
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '9999px',
                            objectFit: 'cover',
                            border: '1.5px solid var(--ajb-surface-elevated)',
                            marginLeft: idx === 0 ? 0 : '-7px',
                          }}
                        />
                      ))}
                      {team.extraCount && (
                        <span
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '9999px',
                            background: 'var(--ajb-accent-black)',
                            color: '#FFFFFF',
                            fontSize: '10px',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginLeft: '-7px',
                            border: '1.5px solid var(--ajb-surface-elevated)',
                          }}
                        >
                          +{team.extraCount}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Field 4: Allocated Budget Pill Slider (Reproduces Seq 02 f=0220..0275 & Seq 04 f=0510..0545) */}
        <div
          style={{
            marginBottom: '12px',
          }}
        >
          <div
            style={{
              position: 'relative',
              height: '58px',
              borderRadius: '22px',
              background: 'var(--ajb-surface-input-pill)',
              border: '1px solid var(--ajb-border-subtle)',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 18px 0 12px',
            }}
          >
            {/* Active elevated fill bar proportional to slider value */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: '4px',
                top: '4px',
                bottom: '4px',
                width: `calc(${Math.max(38, budgetPct)}% - 8px)`,
                borderRadius: '18px',
                background: 'var(--ajb-surface-elevated)',
                boxShadow: 'var(--ajb-shadow-pill)',
                transition: 'width 60ms linear',
              }}
            />

            <div
              style={{
                position: 'relative',
                zIndex: 2,
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <span
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '9999px',
                  background: 'var(--ajb-accent-black)',
                  color: '#FFFFFF',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <DollarSign size={15} />
              </span>
              <div>
                <div style={{ fontSize: '10.5px', color: 'var(--ajb-text-muted)' }}>
                  {labelMode === 'reference' ? 'Allocated Budget' : 'Provisioning & Role Budget'}
                </div>
                <div
                  className="ajb-tabular"
                  style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: 'var(--ajb-text-primary)',
                  }}
                >
                  {draft.allocatedBudget.toLocaleString('en-US')} $
                </div>
              </div>
            </div>

            {/* Interactive range slider overlaid for smooth dragging + keyboard arrows */}
            <input
              type="range"
              aria-label="Allocated Budget"
              min={budgetMin}
              max={budgetMax}
              step={250}
              value={draft.allocatedBudget}
              onChange={(e) =>
                onUpdateDraft({ allocatedBudget: Number(e.target.value) })
              }
              style={{
                position: 'relative',
                zIndex: 3,
                width: '170px',
                accentColor: 'var(--ajb-accent-periwinkle)',
                cursor: 'ew-resize',
              }}
            />
          </div>
          {errors.allocatedBudget && (
            <div
              role="alert"
              style={{
                marginTop: '4px',
                fontSize: '11px',
                color: 'var(--ajb-accent-coral)',
              }}
            >
              {errors.allocatedBudget}
            </div>
          )}
        </div>

        {/* Stage-Specific Operations Fields (Cost Centre, Clearance, Entitlements, Description) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '10px',
            marginBottom: '10px',
          }}
        >
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '16px',
              background: 'var(--ajb-surface-input-pill)',
              border: errors.costCentreCode
                ? '1.5px solid var(--ajb-accent-coral)'
                : '1px solid var(--ajb-border-subtle)',
            }}
          >
            <label
              htmlFor="ajb-field-cost-centre"
              style={{
                display: 'block',
                fontSize: '10.5px',
                color: 'var(--ajb-text-muted)',
                marginBottom: '2px',
              }}
            >
              Cost Centre Code
            </label>
            <input
              id="ajb-field-cost-centre"
              type="text"
              required
              value={draft.costCentreCode}
              onChange={(e) => onUpdateDraft({ costCentreCode: e.target.value })}
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                fontSize: '12.5px',
                fontWeight: 600,
                color: 'var(--ajb-text-primary)',
                outline: 'none',
                padding: 0,
              }}
            />
            {errors.costCentreCode && (
              <div
                role="alert"
                style={{ fontSize: '10.5px', color: 'var(--ajb-accent-coral)', marginTop: '2px' }}
              >
                {errors.costCentreCode}
              </div>
            )}
          </div>

          <div
            style={{
              padding: '10px 14px',
              borderRadius: '16px',
              background: 'var(--ajb-surface-input-pill)',
              border: '1px solid var(--ajb-border-subtle)',
            }}
          >
            <label
              htmlFor="ajb-field-clearance"
              style={{
                display: 'block',
                fontSize: '10.5px',
                color: 'var(--ajb-text-muted)',
                marginBottom: '2px',
              }}
            >
              Regulatory Regime
            </label>
            <select
              id="ajb-field-clearance"
              value={draft.securityClearanceLevel}
              onChange={(e) =>
                onUpdateDraft({
                  securityClearanceLevel: e.target
                    .value as ModalFormDraft['securityClearanceLevel'],
                })
              }
              style={{
                width: '100%',
                border: 'none',
                background: 'transparent',
                fontSize: '12.5px',
                fontWeight: 600,
                color: 'var(--ajb-text-primary)',
                outline: 'none',
                padding: 0,
              }}
            >
              <option value="Standard FCA">Standard FCA Conduct</option>
              <option value="SMCR Certified">SMCR Certified Role</option>
              <option value="Privileged Platform">Privileged Custody Access</option>
            </select>
          </div>
        </div>

        {/* Description / Entitlement Notes */}
        <div
          style={{
            padding: '12px 18px',
            borderRadius: '18px',
            background: 'var(--ajb-surface-input-pill)',
            border: errors.caseDescription
              ? '1.5px solid var(--ajb-accent-coral)'
              : '1px solid var(--ajb-border-subtle)',
            marginBottom: '18px',
          }}
        >
          <label
            htmlFor="ajb-field-description"
            style={{
              display: 'block',
              fontSize: '11px',
              color: 'var(--ajb-text-muted)',
              marginBottom: '4px',
            }}
          >
            {labelMode === 'reference'
              ? 'Add Case Description'
              : 'Role Entitlements & Manager Review Notes'}
          </label>
          <textarea
            id="ajb-field-description"
            rows={2}
            required
            minLength={10}
            value={draft.caseDescription}
            onChange={(e) => onUpdateDraft({ caseDescription: e.target.value })}
            style={{
              width: '100%',
              border: 'none',
              background: 'transparent',
              fontSize: '12.5px',
              color: 'var(--ajb-text-primary)',
              resize: 'none',
              outline: 'none',
              padding: 0,
              fontFamily: 'inherit',
            }}
          />
          {errors.caseDescription && (
            <div
              role="alert"
              style={{
                marginTop: '4px',
                fontSize: '11px',
                color: 'var(--ajb-accent-coral)',
              }}
            >
              {errors.caseDescription}
            </div>
          )}
        </div>

        {/* Footer Actions: Stage Navigation, Save Local Draft, and Primary Black Submit Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              type="button"
              onClick={() => handleStageStep('prev')}
              disabled={draft.activeStageTab === 'starter_details'}
              style={{
                padding: '9px 12px',
                borderRadius: '9999px',
                border: '1px solid var(--ajb-border-subtle)',
                background: 'var(--ajb-surface-elevated)',
                color: 'var(--ajb-text-secondary)',
                fontSize: '11.5px',
                fontWeight: 600,
                cursor: draft.activeStageTab === 'starter_details' ? 'not-allowed' : 'pointer',
                opacity: draft.activeStageTab === 'starter_details' ? 0.45 : 1,
              }}
            >
              Prev Stage
            </button>
            <button
              type="button"
              onClick={() => handleStageStep('next')}
              disabled={draft.activeStageTab === 'ready_for_onboarding'}
              style={{
                padding: '9px 12px',
                borderRadius: '9999px',
                border: '1px solid var(--ajb-border-subtle)',
                background: 'var(--ajb-surface-elevated)',
                color: 'var(--ajb-text-secondary)',
                fontSize: '11.5px',
                fontWeight: 600,
                cursor:
                  draft.activeStageTab === 'ready_for_onboarding' ? 'not-allowed' : 'pointer',
                opacity: draft.activeStageTab === 'ready_for_onboarding' ? 0.45 : 1,
              }}
            >
              Next Stage
            </button>
            <button
              type="button"
              onClick={onSaveDraft}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '9px 14px',
                borderRadius: '9999px',
                border: '1px solid var(--ajb-border-subtle)',
                background: 'var(--ajb-surface-elevated)',
                color: 'var(--ajb-text-primary)',
                fontSize: '11.5px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Save size={12} />
              Save Draft
            </button>
          </div>

          <button
            type="submit"
            style={{
              padding: '12px 24px',
              borderRadius: '9999px',
              border: 'none',
              background: 'var(--ajb-accent-black)',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(13, 13, 15, 0.22)',
            }}
          >
            {submitLabel}
          </button>
        </div>
      </form>
    </dialog>
  );
};
