import { GuideSummary } from '../components/GuideSummary'
import { ActionChecklist } from '../components/ActionChecklist'
import { ContextualWarning } from '../components/ContextualWarning'
import { NextStep } from '../components/NextStep'

export function GuideActionLayer({
  summary,
  beforeStart,
  actionSteps,
  completionCue,
  bangladeshNotes,
  commonMistakes,
  tools,
  nextHref,
  nextLabel,
  checklistTitle,
  storageKey,
}: {
  summary?: string
  beforeStart?: Array<{ text: string; hint?: string }>
  actionSteps?: Array<{ text: string; hint?: string }>
  completionCue?: string
  bangladeshNotes?: string
  commonMistakes?: Array<{ text: string }>
  tools?: Array<{ title: string; href: string; description?: string; tag?: 'guide' | 'tool' | 'government' }>
  nextHref?: string
  nextLabel?: string
  checklistTitle?: string
  storageKey?: string
}) {
  const tagClass = (tag: string) => {
    if (tag === 'government') return { background: 'rgba(40,100,140,0.07)', color: '#1f5570', border: '1px solid var(--gov-line)' }
    if (tag === 'tool') return { background: 'rgba(47,107,58,0.08)', color: '#2f6b3a', border: '1px solid #7ba06a' }
    if (tag === 'guide') return { background: 'rgba(28,95,178,0.08)', color: '#1c5fb2', border: '1px solid #6f93c9' }
    return {}
  }

  const tagLabel = (tag: string) => {
    if (tag === 'government') return 'সরকারি উৎস'
    if (tag === 'tool') return 'টুল'
    if (tag === 'guide') return 'গাইড'
    return ''
  }

  return (
    <>
      {summary && (
        <GuideSummary label="লক্ষ্য / Goal">
          {summary}
        </GuideSummary>
      )}

      {beforeStart && beforeStart.length > 0 && (
        <section
          style={{
            margin: '18px 0',
            padding: '14px 16px',
            background: 'rgba(0,0,0,0.02)',
            border: '1px solid var(--rule)',
            borderLeft: '3px solid var(--accent-green)',
            borderRadius: '0 4px 4px 0',
          }}
        >
          <span
            style={{
              fontSize: '0.72rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--accent-green)',
              fontWeight: 600,
              fontFamily: 'var(--sans)',
              display: 'block',
              marginBottom: '6px',
            }}
          >
            শুরু করার আগে / Before you start
          </span>
          <ul style={{ margin: '0', padding: '0 0 0 18px', fontSize: '0.9rem', color: 'var(--ink)', lineHeight: 1.6 }}>
            {beforeStart.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '4px' }}>
                {item.text}
                {item.hint && <em style={{ color: 'var(--ink-soft)', fontSize: '0.84rem' }}> — {item.hint}</em>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {actionSteps && actionSteps.length > 0 && (
        <div className="guide-action">
          <div className="guide-action__head">
            <span className="guide-action__glyph" aria-hidden="true">→</span>
            <div className="guide-action__titles">
              <span className="guide-action__label">আপনার করণীয় / Your action plan</span>
              <span className="guide-action__title">কীভাবে এগোবেন</span>
            </div>
          </div>

          {actionSteps.length === 1 && actionSteps[0].hint ? (
            <p className="guide-action__intro" style={{ color: 'var(--ink-soft)', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '14px' }}>
              {actionSteps[0].text}
              <br />
              <span style={{ fontSize: '0.84rem', color: 'var(--ink-soft)' }}>{actionSteps[0].hint}</span>
            </p>
          ) : (
            <ol className="guide-action__steps">
              {actionSteps.map((step, idx) => (
                <li key={idx} className="guide-action__step">
                  {step.text}
                  {step.hint && (
                    <span style={{ fontSize: '0.82rem', color: 'var(--ink-soft)', display: 'block', marginTop: '2px' }}>
                      {step.hint}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          )}

          {completionCue && (
            <div className="guide-action__ready">
              <span className="guide-action__ready-label">আপনি পরের ধাপে যাবেন যখন...</span>
              <span className="guide-action__text" style={{ color: 'var(--ink)', fontSize: '0.9rem', lineHeight: 1.55 }}>
                {completionCue}
              </span>
            </div>
          )}

          {nextHref && nextLabel && (
            <div className="guide-action__next">
              <span className="guide-action__next-label">পরের ধাপ →</span>
              <a
                href={nextHref}
                className="guide-action__next-link"
                style={{ color: 'var(--link)', fontWeight: 500, textDecoration: 'none' }}
              >
                {nextLabel}
              </a>
            </div>
          )}
        </div>
      )}

      {checklistTitle && actionSteps && actionSteps.length > 0 && (
        <ActionChecklist
          title={checklistTitle}
          items={actionSteps.map((s) => ({ id: s.text, text: s.text, hint: s.hint }))}
          storageKey={storageKey}
        />
      )}

      {bangladeshNotes && (
        <div
          style={{
            margin: '16px 0',
            padding: '12px 14px',
            background: 'rgba(40,100,140,0.06)',
            border: '1px solid var(--gov-line)',
            borderLeft: '3px solid var(--gov-line)',
            borderRadius: '0 4px 4px 0',
          }}
        >
          <span
            style={{
              fontSize: '0.72rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#1f5570',
              fontWeight: 600,
              fontFamily: 'var(--sans)',
              display: 'block',
              marginBottom: '4px',
            }}
          >
            বাংলাদেশি প্রেক্ষাপট / Bangladesh context
          </span>
          <span style={{ color: 'var(--ink)', fontSize: '0.9rem', lineHeight: 1.55 }}>
            {bangladeshNotes}
          </span>
        </div>
      )}

      {commonMistakes && commonMistakes.length > 0 && (
        <div style={{ margin: '16px 0' }}>
          <span
            style={{
              fontSize: '0.72rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: '#7a5f1a',
              fontWeight: 600,
              fontFamily: 'var(--sans)',
              display: 'block',
              marginBottom: '6px',
            }}
          >
            সাধারণ ভুল / Common mistakes
          </span>
          <ul style={{ margin: '0', padding: '0 0 0 18px', fontSize: '0.9rem', color: 'var(--ink)', lineHeight: 1.6 }}>
            {commonMistakes.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '4px' }}>
                {item.text}
              </li>
            ))}
          </ul>
        </div>
      )}

      {tools && tools.length > 0 && (
        <section style={{ margin: '20px 0', borderTop: '1px solid var(--rule-mute)', paddingTop: '16px' }}>
          <span
            style={{
              fontSize: '0.72rem',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--accent-green)',
              fontWeight: 600,
              fontFamily: 'var(--sans)',
              display: 'block',
              marginBottom: '8px',
            }}
          >
            টুলস ও সম্পদ / Tools & resources
          </span>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '10px',
            }}
          >
            {tools.map((t) => (
              <div key={t.title} style={{ borderRadius: '6px' }}>
                <a
                  href={t.href}
                  style={{
                    display: 'block',
                    background: 'var(--page)',
                    border: '1px solid var(--rule)',
                    borderRadius: '6px',
                    padding: '10px 12px',
                    color: 'var(--ink)',
                    textDecoration: 'none',
                    transition: 'border-color 120ms ease, box-shadow 120ms ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-green)'
                    e.currentTarget.style.boxShadow = '0 1px 0 var(--accent-green) inset'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--rule)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--ink)', display: 'block', lineHeight: 1.3 }}>
                    {t.title}
                  </span>
                  {t.description && (
                    <span style={{ fontSize: '0.78rem', color: 'var(--ink-soft)', lineHeight: 1.45, display: 'block', marginTop: '2px' }}>
                      {t.description}
                    </span>
                  )}
                  {t.tag && (
                    <span
                      style={{
                        display: 'inline-block',
                        fontSize: '0.64rem',
                        marginTop: '6px',
                        fontFamily: 'var(--sans)',
                        letterSpacing: '0.03em',
                        textTransform: 'lowercase',
                        ...tagClass(t.tag),
                        padding: '1px 6px',
                        borderRadius: '4px',
                      }}
                    >
                      {tagLabel(t.tag)}
                    </span>
                  )}
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {nextHref && nextLabel && (
        <NextStep
          href={nextHref}
          label={nextLabel}
          title={nextLabel}
        />
      )}
    </>
  )
}
