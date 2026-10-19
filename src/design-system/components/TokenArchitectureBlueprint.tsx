import React, { useState } from 'react';
import {
  DESIGN_SYSTEM_VERSION,
  DESIGN_TOKENS,
  PORTABLE_REPO_MERGE_MANIFEST,
  ROLE_LEVEL_DESIGN_TOKENS,
  SYSTEM_CONNECTIVITY_GRAPH,
} from '../tokens';
import { DemoRoleView as DemoRolePersona } from '../../data/syntheticStarters';

export interface TokenArchitectureBlueprintProps {
  activeDemoRole: DemoRolePersona;
  theme: 'light' | 'dark';
  onChangeDemoRole: (role: DemoRolePersona) => void;
  onToggleTheme: () => void;
  compact?: boolean;
}

export const TokenArchitectureBlueprint: React.FC<TokenArchitectureBlueprintProps> = ({
  activeDemoRole,
  theme,
  onChangeDemoRole,
  onToggleTheme,
  compact = false,
}) => {
  const [activeTab, setActiveTab] = useState<'role-tokens' | 'root-tokens' | 'connectivity' | 'repo-merge'>('role-tokens');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopiedSnippet(id);
    window.setTimeout(() => {
      setCopiedSnippet((prev) => (prev === id ? null : prev));
    }, 1800);
  };

  const rootColorAndSurfaceTokens = DESIGN_TOKENS.filter((t) => t.category === 'color' || t.category === 'elevation');

  return (
    <section
      data-testid="token-architecture-blueprint"
      aria-label="Root & Role-Level Design Tokens, System Connectivity & Portable Repo Merge Blueprint"
      style={{
        background: 'var(--ajb-surface-panel)',
        borderRadius: '26px',
        padding: compact ? '20px 22px' : '24px 26px',
        border: '1px solid var(--ajb-border-glass)',
        boxShadow: 'var(--ajb-shadow-stage)',
        color: 'var(--ajb-text-primary)',
        transition: 'background 220ms ease, border-color 220ms ease',
      }}
    >
      {/* Header Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
          paddingBottom: '18px',
          borderBottom: '1px solid var(--ajb-border-subtle)',
          marginBottom: '18px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
            <span
              style={{
                padding: '4px 10px',
                borderRadius: '9999px',
                background: 'var(--role-active-badge-bg, #5D0A1A)',
                color: '#FFFFFF',
                fontSize: '11px',
                fontWeight: 800,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              v{DESIGN_SYSTEM_VERSION.version} · Architecture & Token Blueprint
            </span>
            <span
              style={{
                padding: '4px 10px',
                borderRadius: '9999px',
                background: 'var(--ajb-surface-badge-neutral)',
                color: 'var(--ajb-text-primary)',
                border: '1px solid var(--ajb-border-subtle)',
                fontSize: '11.5px',
                fontWeight: 700,
              }}
            >
              Active Theme: {theme === 'dark' ? 'Obsidian Dark (html[data-theme="dark"])' : 'Warm Stone Light (:root)'}
            </span>
            <span
              style={{
                padding: '4px 10px',
                borderRadius: '9999px',
                background: 'var(--role-active-surface)',
                color: 'var(--role-active-primary)',
                border: '1px solid var(--role-active-border)',
                fontSize: '11.5px',
                fontWeight: 800,
              }}
            >
              Active Role Token: {activeDemoRole}
            </span>
          </div>
          <h2
            style={{
              margin: 0,
              fontSize: compact ? '18px' : '20px',
              fontWeight: 800,
              letterSpacing: '-0.025em',
              color: 'var(--ajb-text-primary)',
            }}
          >
            Root-Level & Role-Level Design Tokens · System Connectivity · Portable Repo Merge Guide
          </h2>
          <p
            style={{
              margin: '4px 0 0',
              fontSize: '13px',
              color: 'var(--ajb-text-secondary)',
              lineHeight: 1.45,
            }}
          >
            Complete token hierarchy showing how <code style={{ fontFamily: 'var(--ajb-font-mono)' }}>:root</code>,{' '}
            <code style={{ fontFamily: 'var(--ajb-font-mono)' }}>html[data-theme=&quot;dark&quot;]</code>, and{' '}
            <code style={{ fontFamily: 'var(--ajb-font-mono)' }}>--role-*</code> tokens cascade into the 4-stage workflow
            canvas and how the entire design system merges cleanly into any external repository.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={onToggleTheme}
            data-testid="blueprint-theme-toggle"
            style={{
              height: '36px',
              padding: '0 14px',
              borderRadius: '9999px',
              border: '1px solid var(--ajb-border-subtle)',
              background: 'var(--ajb-surface-elevated)',
              color: 'var(--ajb-text-primary)',
              fontSize: '12.5px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              boxShadow: 'var(--ajb-shadow-card)',
            }}
          >
            <span
              style={{
                width: '9px',
                height: '9px',
                borderRadius: '9999px',
                background: theme === 'dark' ? '#FFE272' : '#E81A41',
              }}
            />
            Switch to {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>

          <a
            href="/ajbell-design-tokens.json"
            target="_blank"
            rel="noreferrer"
            data-testid="download-tokens-json"
            style={{
              height: '36px',
              padding: '0 14px',
              borderRadius: '9999px',
              border: '1px solid var(--ajb-border-subtle)',
              background: 'var(--ajb-surface-subpanel)',
              color: 'var(--ajb-text-primary)',
              fontSize: '12.5px',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>{ }</span>
            <span>ajbell-design-tokens.json (DTCG)</span>
          </a>
        </div>
      </div>

      {/* Interactive Section Tabs */}
      <div
        role="tablist"
        aria-label="Architecture Blueprint Views"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          marginBottom: '18px',
        }}
      >
        {(
          [
            { id: 'role-tokens', label: '1. Role-Level Design Tokens (--role-*)' },
            { id: 'root-tokens', label: '2. Root-Level Light & Dark Tokens (:root / [data-theme="dark"])' },
            { id: 'connectivity', label: '3. How Everything Connects (4-Layer Graph)' },
            { id: 'repo-merge', label: '4. How to Merge into Any Repo (Portable Bundle)' },
          ] as const
        ).map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              data-testid={`blueprint-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              style={{
                height: '36px',
                padding: '0 16px',
                borderRadius: '9999px',
                border: isSelected ? '1px solid transparent' : '1px solid var(--ajb-border-subtle)',
                background: isSelected ? 'var(--ajb-surface-selected)' : 'var(--ajb-surface-elevated)',
                color: isSelected ? '#FFFFFF' : 'var(--ajb-text-primary)',
                fontSize: '12.5px',
                fontWeight: isSelected ? 800 : 700,
                cursor: 'pointer',
                transition: 'all 180ms cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: Role-Level Design Tokens */}
      {activeTab === 'role-tokens' && (
        <div data-testid="blueprint-panel-role-tokens">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              gap: '14px',
              marginBottom: '16px',
            }}
          >
            {ROLE_LEVEL_DESIGN_TOKENS.map((roleSpec) => {
              const isCurrentRole = activeDemoRole === roleSpec.roleId;
              const activePrimary = theme === 'dark' ? roleSpec.darkPrimary : roleSpec.lightPrimary;
              const activeSurface = theme === 'dark' ? roleSpec.darkSurface : roleSpec.lightSurface;
              const activeBadge = theme === 'dark' ? roleSpec.darkBadgeBg : roleSpec.lightBadgeBg;

              return (
                <div
                  key={roleSpec.roleId}
                  data-testid={`role-token-card-${roleSpec.shortCode}`}
                  onClick={() => onChangeDemoRole(roleSpec.roleId)}
                  style={{
                    background: isCurrentRole ? activeSurface : 'var(--ajb-surface-card)',
                    borderRadius: '20px',
                    padding: '16px',
                    border: isCurrentRole
                      ? `2px solid ${activePrimary}`
                      : '1px solid var(--ajb-border-subtle)',
                    boxShadow: 'var(--ajb-shadow-card)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px',
                    transition: 'all 200ms cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                        marginBottom: '10px',
                      }}
                    >
                      <span
                        style={{
                          padding: '3px 9px',
                          borderRadius: '9999px',
                          background: activeBadge,
                          color: '#FFFFFF',
                          fontSize: '10.5px',
                          fontWeight: 800,
                          letterSpacing: '0.04em',
                        }}
                      >
                        {roleSpec.shortCode}
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 800,
                          color: isCurrentRole ? activePrimary : 'var(--ajb-text-muted)',
                        }}
                      >
                        {isCurrentRole ? '● ACTIVE ROLE' : 'Click to preview'}
                      </span>
                    </div>

                    <div
                      style={{
                        fontSize: '15px',
                        fontWeight: 800,
                        color: 'var(--ajb-text-primary)',
                        marginBottom: '4px',
                      }}
                    >
                      {roleSpec.roleId}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'var(--ajb-text-secondary)',
                        lineHeight: 1.4,
                        marginBottom: '10px',
                      }}
                    >
                      {roleSpec.description}
                    </div>

                    {/* CSS Variable bindings */}
                    <div
                      style={{
                        background: 'var(--ajb-surface-elevated)',
                        borderRadius: '12px',
                        padding: '9px 10px',
                        border: '1px solid var(--ajb-border-subtle)',
                        marginBottom: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '5px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                        <code style={{ fontSize: '11px', fontFamily: 'var(--ajb-font-mono)', color: 'var(--ajb-text-primary)' }}>
                          {roleSpec.cssPrefix}-primary
                        </code>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: 700 }}>
                          <span
                            style={{
                              width: '12px',
                              height: '12px',
                              borderRadius: '4px',
                              background: activePrimary,
                              border: '1px solid rgba(255,255,255,0.25)',
                            }}
                          />
                          {activePrimary}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                        <code style={{ fontSize: '11px', fontFamily: 'var(--ajb-font-mono)', color: 'var(--ajb-text-secondary)' }}>
                          Light / Dark
                        </code>
                        <span style={{ fontSize: '10.5px', fontFamily: 'var(--ajb-font-mono)', color: 'var(--ajb-text-secondary)' }}>
                          {roleSpec.lightPrimary} → {roleSpec.darkPrimary}
                        </span>
                      </div>
                    </div>

                    {/* Owned Stages */}
                    <div style={{ marginBottom: '8px' }}>
                      <div
                        style={{
                          fontSize: '10.5px',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          letterSpacing: '0.04em',
                          color: 'var(--ajb-text-muted)',
                          marginBottom: '5px',
                        }}
                      >
                        Owned Workflow Stages
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                        {roleSpec.ownedStages.map((stg) => (
                          <span
                            key={stg}
                            style={{
                              padding: '3px 8px',
                              borderRadius: '9999px',
                              background: 'var(--ajb-surface-badge-neutral)',
                              color: 'var(--ajb-text-primary)',
                              fontSize: '11px',
                              fontWeight: 700,
                            }}
                          >
                            {stg}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Capabilities */}
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: '16px',
                      fontSize: '11.5px',
                      color: 'var(--ajb-text-secondary)',
                      lineHeight: 1.4,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '3px',
                    }}
                  >
                    {roleSpec.capabilities.map((cap) => (
                      <li key={cap}>{cap}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Root-Level Light & Dark Tokens */}
      {activeTab === 'root-tokens' && (
        <div data-testid="blueprint-panel-root-tokens">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: '10px',
            }}
          >
            {rootColorAndSurfaceTokens.map((tok) => {
              const activeVal = theme === 'dark' && tok.darkValue ? tok.darkValue : tok.lightValue;
              return (
                <div
                  key={tok.cssVar}
                  style={{
                    background: 'var(--ajb-surface-card)',
                    borderRadius: '16px',
                    padding: '12px 14px',
                    border: '1px solid var(--ajb-border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--ajb-text-primary)' }}>
                      {tok.name}
                    </span>
                    <span
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '7px',
                        background: tok.category === 'color' ? activeVal : 'var(--ajb-surface-elevated)',
                        border: '1px solid var(--ajb-border-subtle)',
                        flexShrink: 0,
                      }}
                    />
                  </div>
                  <code
                    style={{
                      fontSize: '11.5px',
                      fontFamily: 'var(--ajb-font-mono)',
                      color: 'var(--ajb-accent-periwinkle)',
                      fontWeight: 700,
                    }}
                  >
                    {tok.cssVar}
                  </code>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '11px',
                      fontFamily: 'var(--ajb-font-mono)',
                      color: 'var(--ajb-text-secondary)',
                      background: 'var(--ajb-surface-elevated)',
                      padding: '5px 8px',
                      borderRadius: '8px',
                    }}
                  >
                    <span>Light: {tok.lightValue}</span>
                    {tok.darkValue && <span>Dark: {tok.darkValue}</span>}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--ajb-text-secondary)', lineHeight: 1.35 }}>
                    {tok.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: How Everything Connects (4-Layer Architecture Graph) */}
      {activeTab === 'connectivity' && (
        <div data-testid="blueprint-panel-connectivity">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              gap: '14px',
            }}
          >
            {SYSTEM_CONNECTIVITY_GRAPH.map((node, index) => (
              <div
                key={node.id}
                data-testid={`connectivity-node-${node.id}`}
                style={{
                  background: 'var(--ajb-surface-card)',
                  borderRadius: '20px',
                  padding: '16px',
                  border: '1px solid var(--ajb-border-subtle)',
                  boxShadow: 'var(--ajb-shadow-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px',
                  position: 'relative',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                    }}
                  >
                    <span
                      style={{
                        padding: '3px 9px',
                        borderRadius: '9999px',
                        background: 'var(--ajb-surface-selected)',
                        color: '#FFFFFF',
                        fontSize: '11px',
                        fontWeight: 800,
                      }}
                    >
                      STEP 0{index + 1}
                    </span>
                    <span style={{ fontSize: '11.5px', fontWeight: 800, color: 'var(--ajb-accent-periwinkle)' }}>
                      {index < SYSTEM_CONNECTIVITY_GRAPH.length - 1 ? 'Flows →' : 'Host Ready ✓'}
                    </span>
                  </div>

                  <div
                    style={{
                      fontSize: '14.5px',
                      fontWeight: 800,
                      color: 'var(--ajb-text-primary)',
                      marginBottom: '6px',
                    }}
                  >
                    {node.layer}
                  </div>
                  <code
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      fontFamily: 'var(--ajb-font-mono)',
                      color: 'var(--ajb-accent-periwinkle)',
                      background: 'var(--ajb-surface-elevated)',
                      padding: '6px 8px',
                      borderRadius: '8px',
                      marginBottom: '10px',
                      wordBreak: 'break-word',
                    }}
                  >
                    {node.modulePath}
                  </code>
                  <p
                    style={{
                      margin: '0 0 10px',
                      fontSize: '12px',
                      color: 'var(--ajb-text-secondary)',
                      lineHeight: 1.4,
                    }}
                  >
                    {node.description}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div>
                    <div
                      style={{
                        fontSize: '10.5px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        color: 'var(--ajb-text-muted)',
                        marginBottom: '4px',
                      }}
                    >
                      Exports
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {node.exports.map((exp) => (
                        <span
                          key={exp}
                          style={{
                            padding: '2px 7px',
                            borderRadius: '6px',
                            background: 'var(--ajb-surface-badge-neutral)',
                            color: 'var(--ajb-text-primary)',
                            fontSize: '10.5px',
                            fontFamily: 'var(--ajb-font-mono)',
                            fontWeight: 600,
                          }}
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: '10.5px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        color: 'var(--ajb-text-muted)',
                        marginBottom: '4px',
                      }}
                    >
                      Provides To
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--ajb-text-secondary)', lineHeight: 1.35 }}>
                      {node.providesTo.join(' · ')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: How Everything Merges into Any Repo */}
      {activeTab === 'repo-merge' && (
        <div data-testid="blueprint-panel-repo-merge">
          <div
            style={{
              background: 'var(--ajb-surface-subpanel)',
              borderRadius: '18px',
              padding: '14px 18px',
              border: '1px solid var(--ajb-border-subtle)',
              marginBottom: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <div style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--ajb-text-primary)' }}>
                Zero-Conflict CSS & Component Merge Strategy ({PORTABLE_REPO_MERGE_MANIFEST.packageId})
              </div>
              <div style={{ fontSize: '12px', color: 'var(--ajb-text-secondary)', marginTop: '2px' }}>
                {PORTABLE_REPO_MERGE_MANIFEST.cssScopingStrategy}
              </div>
            </div>
            <span
              style={{
                padding: '5px 12px',
                borderRadius: '9999px',
                background: 'var(--ajb-accent-emerald)',
                color: '#FFFFFF',
                fontSize: '11.5px',
                fontWeight: 800,
              }}
            >
              Zero External UI Runtime Dependencies
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
              gap: '12px',
            }}
          >
            {PORTABLE_REPO_MERGE_MANIFEST.mergeSteps.map((stepObj) => (
              <div
                key={stepObj.step}
                style={{
                  background: 'var(--ajb-surface-card)',
                  borderRadius: '18px',
                  padding: '15px 16px',
                  border: '1px solid var(--ajb-border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '10px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: 800, color: 'var(--ajb-text-primary)' }}>
                      Step {stepObj.step} · {stepObj.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(stepObj.step, stepObj.command)}
                      style={{
                        padding: '3px 10px',
                        borderRadius: '9999px',
                        border: '1px solid var(--ajb-border-subtle)',
                        background: 'var(--ajb-surface-elevated)',
                        color: 'var(--ajb-text-primary)',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {copiedSnippet === stepObj.step ? 'Copied ✓' : 'Copy Snippet'}
                    </button>
                  </div>
                  <p style={{ margin: '0 0 8px', fontSize: '12px', color: 'var(--ajb-text-secondary)', lineHeight: 1.4 }}>
                    {stepObj.detail}
                  </p>
                </div>

                <pre
                  style={{
                    margin: 0,
                    padding: '10px 12px',
                    borderRadius: '12px',
                    background: 'var(--ajb-surface-elevated)',
                    border: '1px solid var(--ajb-border-subtle)',
                    color: 'var(--ajb-accent-periwinkle)',
                    fontSize: '11.5px',
                    fontFamily: 'var(--ajb-font-mono)',
                    overflowX: 'auto',
                  }}
                >
                  <code>{stepObj.command}</code>
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
