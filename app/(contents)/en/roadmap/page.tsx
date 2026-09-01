import { JourneyMap } from '../../../components/JourneyMap'

export const metadata = {
  title: 'Step-by-step Roadmap – Idea to Scale',
  description: 'The four-phase roadmap for building a startup in Bangladesh: validate and set up, product and team, sell and fund, scale.',
}

const STEPS = [
  {
    id: 'idea',
    title: 'Idea & problem',
    description: "Whose problem are you solving — write it in one line",
    note: 'Is the idea genuinely yours? Or is someone already doing this?',
  },
  {
    id: 'validate',
    title: 'Validation',
    description: 'Do customers actually have this problem, will they pay?',
    note: 'Talk to customers before building the product. Is the problem what you think it is?',
  },
  {
    id: 'business-model',
    title: 'Business model',
    description: 'Who is your customer, and how will you earn?',
  },
  {
    id: 'mvp',
    title: 'First product',
    description: 'Low cost, low time, small start',
    note: 'MVP options — newsletter, form, hand-built service, no-code. The first product will not be pretty; it will work.',
  },
  {
    id: 'first-customers',
    title: 'First customers',
    description: 'Sales, trust, channels',
  },
  {
    id: 'payments',
    title: 'Payments & operations',
    description: 'Bank, MFS, gateway, delivery',
    note: 'Taking payment and keeping records should both be in place from the start.',
  },
  {
    id: 'formalization',
    title: 'Formalization',
    description: 'Registration, TIN, VAT, licenses',
    note: 'Not all paperwork at once — but start paperwork on time. e-TIN is often the first step.',
  },
  {
    id: 'revenue',
    title: 'Revenue & profit',
    description: 'Pricing, margin, cash flow',
  },
  {
    id: 'team',
    title: 'Team & hiring',
    description: 'First people, organization, retention',
  },
  {
    id: 'funding',
    title: 'Funding & growth',
    description: 'Angel, VC, grants, scale',
    note: 'Funding is not essential for every business. First ask whether the business stands on its own.',
  },
]

const BRANCHES = [
  {
    id: 'validate',
    title: 'Validation',
    description: 'Verify customers and demand',
    children: [
      { id: 'customer-interviews', title: 'Talking to customers' },
      { id: 'demand-without-building', title: 'Commitment before product' },
      { id: 'mvp-experiment-planner', title: 'MVP experiments' },
    ],
  },
  {
    id: 'building',
    title: 'Building',
    description: 'Making the first product',
    children: [
      { id: 'no-code-mvp', title: 'Starting with no-code' },
      { id: 'tech-stack', title: 'Tech choices' },
      { id: 'building-basics', title: 'Basics of building' },
    ],
  },
  {
    id: 'payments',
    title: 'Payments',
    description: 'Taking money & keeping records',
    children: [
      { id: 'bank-account', title: 'Bank account' },
      { id: 'mfs-and-gateways', title: 'MFS & gateways' },
      { id: 'reconciliation', title: 'Reconciliation' },
    ],
  },
  {
    id: 'formalization',
    title: 'Formalization',
    description: 'Registration, tax, licenses',
    children: [
      { id: 'e-tin', title: 'e-TIN' },
      { id: 'vat-bin', title: 'VAT / BIN' },
      { id: 'trade-license', title: 'Trade license' },
    ],
  },
  {
    id: 'funding',
    title: 'Funding',
    description: 'Angel, VC, grants',
    children: [
      { id: 'angel-investors', title: 'Angel investors' },
      { id: 'local-vcs', title: 'Local VCs' },
      { id: 'grants-competitions', title: 'Grants & competitions' },
    ],
  },
]

export default function RoadmapPage() {
  return (
    <>
      <section className="roadmap-hero" aria-label="Roadmap">
        <span className="roadmap-hero__eyebrow">Roadmap</span>
        <h1 className="roadmap-hero__title">
          Step by step path to build a business
        </h1>
        <p className="roadmap-hero__sub">
          Idea to growth — where you are, what to do next, which branch to take — all in one place.
        </p>
      </section>

      <section aria-labelledby="main-roadmap-heading">
        <div className="section-head section-head--sm">
          <h2 className="section-head__title" id="main-roadmap-heading">
            Main path
          </h2>
        </div>

        <div className="roadmap-card roadmap-card--wide">
          <JourneyMap
            nodes={STEPS}
            currentId="idea"
            orientation="vertical"
            showConnectors
          />
        </div>
      </section>

      <section aria-labelledby="branches-heading">
        <div className="section-head section-head--sm">
          <h2 className="section-head__title" id="branches-heading">
            Branch paths on some steps
          </h2>
          <span className="section-head__hint">
            Which steps have specific paths or deeper guides on the site
          </span>
        </div>

        <div className="branch-preview">
          {BRANCHES.map((branch) => (
            <div key={branch.id} className="branch-block">
              <div className="branch-block__head">
                <span className="branch-block__title">→ {branch.title}</span>
                {branch.description && (
                  <span className="branch-block__sub">{branch.description}</span>
                )}
              </div>
              <div className="branch-preview__children">
                {branch.children.map((child) => (
                  <a
                    key={child.id}
                    href={
                      branch.id === 'validate'
                        ? `/en/validation/${child.id}`
                        : branch.id === 'building'
                          ? `/en/product/${child.id}`
                          : branch.id === 'payments'
                            ? `/en/payments/${child.id}`
                            : branch.id === 'formalization'
                              ? child.id === 'trade-license'
                                ? '/en/trade-license'
                                : `/en/tax/${child.id}`
                              : branch.id === 'funding'
                                ? `/en/funding/${child.id}`
                                : `/en/${branch.id}/${child.id}`
                    }
                    className="branch-child"
                  >
                    {child.title}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="roadmap-cta">
        <span className="roadmap-cta__label">Find your path</span>
        <a href="/en" className="roadmap-cta__btn">
          Tell us your situation
        </a>
      </section>
    </>
  )
}
