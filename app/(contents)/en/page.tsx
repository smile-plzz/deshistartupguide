import { FounderPathSelector } from '../../components/FounderPathSelector'
import { JourneyMap } from '../../components/JourneyMap'
import { ResourceCard } from '../../components/ResourceCard'

const SITUATIONS = [
  {
    id: 'idea',
    title: "I have an idea",
    sub: "I haven't done much yet. Want to make sure I'm starting in the right place.",
    href: "/en/start-here",
  },
  {
    id: 'validate',
    title: "I want to test demand",
    sub: "Will people actually pay? Learn to validate before building in earnest.",
    href: "/en/journeys/test-demand",
  },
  {
    id: 'building',
    title: "Building my first product",
    sub: "MVP, tech, pricing — decisions for starting small and fast.",
    href: "/en/product",
  },
  {
    id: 'customers',
    title: "I have customers, now organizing",
    sub: "From Facebook page to paperwork, payments, delivery — getting organized.",
    href: "/en/journeys/start-an-online-business",
  },
  {
    id: 'formalize',
    title: "I want to formalize my business",
    sub: "Registration, TIN, VAT, company — when and how in Bangladesh.",
    href: "/en/registration",
  },
  {
    id: 'funding',
    title: "Looking for funding or credit",
    sub: "Angel, VC, grants, credit — where money comes from and what to prepare.",
    href: "/en/funding",
  },
]

const JOURNEY_STEPS = [
  {
    id: 'idea',
    title: 'Idea & problem',
    description: "Whose problem are you solving",
  },
  {
    id: 'validate',
    title: 'Validation',
    description: 'Customers, demand, and commitment',
  },
  {
    id: 'business-model',
    title: 'Business model',
    description: 'How you make money and from whom',
  },
  {
    id: 'mvp',
    title: 'First product',
    description: 'Small, fast, low cost',
  },
  {
    id: 'first-customers',
    title: 'First customers',
    description: 'Sales, trust, channels',
  },
  {
    id: 'payments',
    title: 'Payments & operations',
    description: 'Bank, MFS, gateways, delivery',
  },
  {
    id: 'formalization',
    title: 'Formalization',
    description: 'Registration, TIN, VAT, licenses',
  },
  {
    id: 'revenue',
    title: 'Revenue & profit',
    description: 'Pricing, margin, cash flow',
  },
  {
    id: 'team',
    title: 'Team & hiring',
    description: 'First people, culture, retention',
  },
  {
    id: 'funding',
    title: 'Funding & growth',
    description: 'Angel, VC, grants, scale',
  },
]

const JOURNEY_BRANCHES = [
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

const POPULAR_TASKS = [
  { title: 'Test my idea', sub: 'Customer interviews, small tests, commitment', href: '/en/journeys/test-demand' },
  { title: 'Register a company', sub: 'RJSC, MoA, shares, regular reporting', href: '/en/registration' },
  { title: 'Get a TIN', sub: 'Individual vs company, when it is needed', href: '/en/tax/e-tin' },
  { title: 'Set up payments', sub: 'Bank, MFS, payment gateway', href: '/en/payments' },
  { title: 'Get my first customer', sub: 'Online, Facebook, Messenger, trust', href: '/en/customers' },
  { title: 'Understand VAT', sub: 'When it applies, when it does not, returns', href: '/en/tax/vat-bin' },
  { title: 'Get funding', sub: 'Angel, VC, grants, credit', href: '/en/funding' },
  { title: 'Hire my first person', sub: 'Who, how, how much, paperwork', href: '/en/team' },
]

const TOOLS_CARDS = [
  { href: '/en/tools/landed-cost-calculator', title: 'Landed cost calculator', sub: 'Find the real cost of imports or products', icon: '🧮', tag: 'tool' },
  { href: '/en/tools/break-even-calculator', title: 'Break-even calculator', sub: 'Sales needed to break even', icon: '📊', tag: 'tool' },
  { href: '/en/tools/runway-calculator', title: 'Runway calculator', sub: 'How long current spend will last', icon: '⏳', tag: 'tool' },
  { href: '/en/tools/vat-calculator', title: 'VAT calculator', sub: 'Price and VAT calculation', icon: '🧾', tag: 'tool' },
  { href: '/en/tools/salary-pf-calculator', title: 'Salary & PF calculator', sub: 'Payroll and provident fund estimates', icon: '💼', tag: 'tool' },
  { href: '/en/tools/affordable-tools', title: 'Affordable tools', sub: 'Lower-cost tools for small businesses', icon: '🛠️', tag: 'tool' },
]

const ECOSYSTEM_CARDS = [
  { href: '/en/ecosystem/where-to-start', title: 'Where to start in the ecosystem', sub: 'A picture of the ecosystem', icon: '🗺️', tag: 'guide' },
  { href: '/en/ecosystem/founder-communities', title: 'Founder communities', sub: 'Where other founders are', icon: '👥', tag: 'guide' },
  { href: '/en/ecosystem/mentorship', title: 'Mentorship', sub: 'Learning from experienced founders', icon: '🎯', tag: 'guide' },
  { href: '/en/ecosystem/government-programs', title: 'Government programs', sub: 'BIDA, hi-tech parks, tax handbooks', icon: '🏛️', tag: 'government' },
  { href: '/en/directory/investors', title: 'Investor directory', sub: 'Angels and VCs', icon: '💼', tag: 'guide' },
  { href: '/en/directory/accelerators', title: 'Accelerators', sub: 'Programs and events', icon: '🚀', tag: 'guide' },
]

const OSS_LINKS = [
  { href: 'https://github.com/smile-plzz/deshistartupguide', label: 'Source on GitHub →' },
  { href: '/en/contribute', label: 'How to contribute' },
  { href: '/en/start-here/how-to-use', label: 'How to use this site' },
]

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="hero" aria-label="Welcome">
        <span className="hero__eyebrow">Starting a startup or small business in Bangladesh — step by step</span>
        <h1 className="hero__title">
          Starting a business?
        </h1>
        <p className="hero__sub">
          Idea to first customer, formalization, payments — everything in one place, step by step.
          Tell us where you are, and we will show you your next step.
        </p>
        <div className="hero__actions">
          <a href="#where-are-you" className="hero__btn">
            Show my path
          </a>
          <a href="/en/start-here" className="hero__btn hero__btn--ghost">
            See everything
          </a>
        </div>
        <p className="hero__info">
          For Bangladesh, by Bangladesh — local law, tax, payments, delivery, customers.
        </p>
      </section>

      {/* Situation selector */}
      <section id="where-are-you" aria-labelledby="where-heading">
        <div className="section-head">
          <span className="section-head__num">01</span>
          <h2 className="section-head__title" id="where-heading">
            Where are you right now?
          </h2>
          <span className="section-head__hint">
            The path depends on your situation
          </span>
        </div>

        <FounderPathSelector
          paths={SITUATIONS}
          heading="Where are you right now?"
          subheading="Below are six familiar situations. Match yours — it will take you to the first page on that path."
        />
      </section>

      {/* Visual roadmap */}
      <section aria-labelledby="roadmap-heading">
        <div className="section-head">
          <span className="section-head__num">02</span>
          <h2 className="section-head__title" id="roadmap-heading">
            Building a business roadmap
          </h2>
          <span className="section-head__hint">
            Idea to growth — step by step
          </span>
        </div>

        <div className="roadmap-card">
          <JourneyMap
            nodes={JOURNEY_STEPS}
            currentId="idea"
            orientation="vertical"
            showConnectors
          />
        </div>

        {/* Branch preview */}
        <div className="branch-preview">
          <p className="branch-preview__label">
            Some steps have branch paths
          </p>
          {JOURNEY_BRANCHES.map((branch) => (
            <div key={branch.id} className="branch-preview__item">
              <span className="branch-preview__title">
                → {branch.title}
              </span>
              <div className="branch-preview__children">
                {branch.children.map((child) => (
                  <span key={child.id} className="branch-preview__child">
                    {child.title}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular tasks */}
      <section aria-labelledby="tasks-heading">
        <div className="section-head">
          <span className="section-head__num">03</span>
          <h2 className="section-head__title" id="tasks-heading">
            Founders usually do these next
          </h2>
          <span className="section-head__hint">
            Tasks, not just topics — what you want to do
          </span>
        </div>

        <div className="task-list">
          {POPULAR_TASKS.map((task) => (
            <a key={task.title} href={task.href} className="task-card">
              <span className="task-card__title">{task.title}</span>
              <span className="task-card__sub">{task.sub}</span>
            </a>
          ))}
        </div>
      </section>

      {/* Tools */}
      <section aria-labelledby="tools-heading">
        <div className="section-head">
          <span className="section-head__num">04</span>
          <h2 className="section-head__title" id="tools-heading">
            Tools & calculators
          </h2>
          <span className="section-head__hint">
            Calculations, planning, decisions
          </span>
        </div>
        <div className="cards-grid">
          {TOOLS_CARDS.map((c) => (
            <ResourceCard key={c.title} {...c} />
          ))}
        </div>
      </section>

      {/* Ecosystem */}
      <section aria-labelledby="ecosystem-heading">
        <div className="section-head">
          <span className="section-head__num">05</span>
          <h2 className="section-head__title" id="ecosystem-heading">
            Bangladesh startup ecosystem
          </h2>
          <span className="section-head__hint">
            Where to connect, who to reach
          </span>
        </div>
        <div className="cards-grid">
          {ECOSYSTEM_CARDS.map((c) => (
            <ResourceCard key={c.title} {...c} />
          ))}
        </div>
      </section>

      {/* Open source */}
      <section className="open-source">
        <h2 className="open-source__title">
          An open-source guide
        </h2>
        <p className="open-source__text">
          This site is open source — anyone can add correct information, new guides, or fix mistakes.
          Use, change, and contribute are all welcome.
        </p>
        <div className="open-source__links">
          {OSS_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="open-source__link">
              {l.label}
            </a>
          ))}
        </div>
      </section>
    </>
  )
}
