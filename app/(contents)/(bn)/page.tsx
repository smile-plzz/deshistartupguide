import { FounderPathSelector } from '../../components/FounderPathSelector'
import { JourneyMap } from '../../components/JourneyMap'
import { ResourceCard } from '../../components/ResourceCard'

const SITUATIONS = [
  {
    id: 'idea',
    title: 'আমার মাথায় একটা আইডিয়া আছে',
    sub: 'আর কিছু করিনি। শুরু করতে চাই এখনো সঠিক জায়গায় আছি কিনা জানতে।',
    icon: '💡',
    href: '/start-here',
  },
  {
    id: 'validate',
    title: 'আইডিয়া যাচাই করতে চাই',
    sub: 'গ্রাহক কি সত্যিই এই সমস্যায় আছে, টাকা দেবে কি — সেটা যাচাই করার ধাপ।',
    icon: '🔍',
    href: '/journeys/test-demand',
  },
  {
    id: 'building',
    title: 'প্রথম পণ্য বানাচ্ছি',
    sub: 'এমভিপি, প্রযুক্তি, দাম — কীভাবে ছোট করে শুরু করব, সেই সিদ্ধান্ত।',
    icon: '⚒️',
    href: '/product',
  },
  {
    id: 'customers',
    title: 'আমার গ্রাহক আছে, এখন গোছাতে চাই',
    sub: 'ফেসবুক পেজ থেকে কাগজপত্র, পেমেন্ট, ডেলিভারি — গোছানোর পথ।',
    icon: '📦',
    href: '/journeys/start-an-online-business',
  },
  {
    id: 'formalize',
    title: 'ব্যবসাকে আনুষ্ঠানিক করতে চাই',
    sub: 'রেজিস্ট্রেশন, টিআইএন, ভ্যাট, কোম্পানি — কখন ও কীভাবে।',
    icon: '📄',
    href: '/registration',
  },
  {
    id: 'funding',
    title: 'ফান্ডিং বা ঋণ চাই',
    sub: 'অ্যাঞ্জেল, ভিসি, গ্রান্ট, ঋণ — কোথা থেকে টাকা আসে, কী প্রস্তুতি লাগে।',
    icon: '💰',
    href: '/funding',
  },
]

const JOURNEY_STEPS = [
  {
    id: 'idea',
    title: 'আইডিয়া ও সমস্যা',
    description: 'কার কী সমস্যা সমাধান করছেন',
  },
  {
    id: 'validate',
    title: 'যাচাই',
    description: 'গ্রাহক, চাহিদা ও প্রতিশ্রুতি',
  },
  {
    id: 'business-model',
    title: 'ব্যবসার মডেল',
    description: 'আয়ের উৎস ও গ্রাহক',
  },
  {
    id: 'mvp',
    title: 'প্রথম পণ্য',
    description: 'ছোট, দ্রুত, টাকা-সময়-সাশ্রয়ী',
  },
  {
    id: 'first-customers',
    title: 'প্রথম গ্রাহক',
    description: 'বিক্রি, বিশ্বাস ও চ্যানেল',
  },
  {
    id: 'payments',
    title: 'পেমেন্ট ও অপারেশন',
    description: 'ব্যাংক, MFS, গেটওয়ে, ডেলিভারি',
  },
  {
    id: 'formalization',
    title: 'আনুষ্ঠানিকতা',
    description: 'রেজিস্ট্রেশন, টিআইএন, ভ্যাট, লাইসেন্স',
  },
  {
    id: 'revenue',
    title: 'আয় ও মুনাফা',
    description: 'মূল্য, মার্জিন, ক্যাশফ্লো',
  },
  {
    id: 'team',
    title: 'টিম ও নিয়োগ',
    description: 'প্রথম লোক, সংস্কার, রাখায়',
  },
  {
    id: 'funding',
    title: 'ফান্ডিং ও বৃদ্ধি',
    description: 'অ্যাঞ্জেল, ভিসি, গ্রান্ট, স্কেল',
  },
]

const JOURNEY_BRANCHES = [
  {
    id: 'validate',
    title: 'যাচাই',
    description: 'গ্রাহক ও চাহিদা যাচাই',
    children: [
      { id: 'customer-interviews', title: 'গ্রাহকের সাথে কথা' },
      { id: 'demand-without-building', title: 'পণ্য বানানোর আগে প্রতিশ্রুতি' },
      { id: 'mvp-experiment-planner', title: 'এমভিপি পরীক্ষা' },
    ],
  },
  {
    id: 'building',
    title: 'প্রণয়ন',
    description: 'প্রথম পণ্য তৈরি',
    children: [
      { id: 'no-code-mvp', title: 'নো-কোড দিয়ে শুরু' },
      { id: 'tech-stack', title: 'প্রযুক্তি পছন্দ' },
      { id: 'building-basics', title: 'বেসিক নির্মাণ' },
    ],
  },
  {
    id: 'payments',
    title: 'পেমেন্ট',
    description: 'টাকা নেওয়া ও হিসাব',
    children: [
      { id: 'bank-account', title: 'ব্যাংক অ্যাকাউন্ট' },
      { id: 'mfs-and-gateways', title: 'MFS ও গেটওয়ে' },
      { id: 'reconciliation', title: 'হিসাব মেলানো' },
    ],
  },
  {
    id: 'formalization',
    title: 'আনুষ্ঠানিকতা',
    description: 'রেজিস্ট্রেশন, কর ও লাইসেন্স',
    children: [
      { id: 'e-tin', title: 'e-TIN' },
      { id: 'vat-bin', title: 'ভ্যাট / বিআইএন' },
      { id: 'trade-license', title: 'ট্রেড লাইসেন্স' },
    ],
  },
  {
    id: 'funding',
    title: 'ফান্ডিং',
    description: 'অ্যাঞ্জেল, ভিসি, গ্রান্ট',
    children: [
      { id: 'angel-investors', title: 'অ্যাঞ্জেল' },
      { id: 'local-vcs', title: 'স্থানীয় ভিসি' },
      { id: 'grants-competitions', title: 'গ্রান্ট ও প্রতিযোগিতা' },
    ],
  },
]

const POPULAR_TASKS = [
  { title: 'আইডিয়া যাচাই করতে চাই', sub: 'গ্রাহকের সাথে কথা, ছোট পরীক্ষা, প্রতিশ্রুতি', href: '/journeys/test-demand' },
  { title: 'কোম্পানি রেজিস্ট্রেশন', sub: 'আরজেএসসি, এমওএ, শেয়ার, নিয়মিত 보고', href: '/registration' },
  { title: 'টিআইএন নিতে চাই', sub: 'ব্যক্তিগত নাকি কোম্পানি, কখন লাগে', href: '/tax/e-tin' },
  { title: 'পেমেন্ট সেটআপ করতে চাই', sub: 'ব্যাংক, MFS, পেমেন্ট গেটওয়ে', href: '/payments' },
  { title: 'প্রথম গ্রাহক পেতে চাই', sub: 'অনলাইন, ফেসবুক, মেসেঞ্জার, বিশ্বাস', href: '/customers' },
  { title: 'ভ্যাট বুঝতে চাই', sub: 'কখন লাগে, কখন লাগে না, রিটার্ন', href: '/tax/vat-bin' },
  { title: 'ফান্ডিং নিতে চাই', sub: 'অ্যাঞ্জেল, ভিসি, গ্রান্ট, ঋণ', href: '/funding' },
  { title: 'প্রথম লোক ভাড়াতে চাই', sub: 'কাকে, কীভাবে, কত টাকা, কাগজ', href: '/team' },
]

const TOOLS_CARDS = [
  { href: '/tools/landed-cost-calculator', title: 'ল্যান্ডেড কস্ট ক্যালকুলেটর', sub: 'আমদানি বা পণ্যের আসল খরচ বের করুন', icon: '🧮', tag: 'tool' },
  { href: '/tools/break-even-calculator', title: 'ব্রেক-ইভেন ক্যালকুলেটর', sub: 'কত বিক্রি করলে লাভ হবে', icon: '📊', tag: 'tool' },
  { href: '/tools/runway-calculator', title: 'রানওয়ে ক্যালকুলেটর', sub: 'বর্তমান খরচে কতদিন টিকে থাকবেন', icon: '⏳', tag: 'tool' },
  { href: '/tools/vat-calculator', title: 'ভ্যাট ক্যালকুলেটর', sub: 'মূল্য ও ভ্যাটের হিসাব', icon: '🧾', tag: 'tool' },
  { href: '/tools/salary-pf-calculator', title: 'স্যালারি ও পিএফ ক্যালকুলেটর', sub: 'বেতন ও সংবরণ হিসাব', icon: '💼', tag: 'tool' },
  { href: '/tools/affordable-tools', title: 'সাশ্রয়ী টুলস', sub: 'ছোট ব্যবসার জন্য কম খরচের টুল', icon: '🛠️', tag: 'tool' },
]

const ECOSYSTEM_CARDS = [
  { href: '/ecosystem/where-to-start', title: 'কোথা থেকে শুরু করবেন', sub: 'ইকোসিস্টেমের ছবি', icon: '🗺️', tag: 'guide' },
  { href: '/ecosystem/founder-communities', title: 'ফাউন্ডার কমিউনিটি', sub: 'যেখানে অন্যরা আছেন', icon: '👥', tag: 'guide' },
  { href: '/ecosystem/mentorship', title: 'মেন্টরশিপ', sub: 'অভিজ্ঞদের কাছ থেকে শেখা', icon: '🎯', tag: 'guide' },
  { href: '/ecosystem/government-programs', title: 'সরকারি সুবিধা', sub: 'BIDA, হাই-টেক পার্ক, কর হাতল', icon: '🏛️', tag: 'government' },
  { href: '/directory/investors', title: 'ইনভেস্টর ডিরেক্টরি', sub: 'অ্যাঞ্জেল ও ভিসি', icon: '💼', tag: 'guide' },
  { href: '/directory/accelerators', title: 'অ্যাক্সেলারেটর', sub: 'অনুষ্ঠান ও প্রোগ্রাম', icon: '🚀', tag: 'guide' },
]

const OSS_LINKS = [
  { href: 'https://github.com/smile-plzz/deshistartupguide', label: 'উৎস গিটহাব →' },
  { href: '/contribute', label: 'কীভাবে যোগ দিবেন' },
  { href: '/start-here/how-to-use', label: 'সাইট কীভাবে ব্যবহার করবেন' },
]

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="hero" aria-label="Welcome">
        <span className="hero__eyebrow">বাংলাদেশে স্টার্টআপ বা ছোট ব্যবসা — ধাপে ধাপে গাইড</span>
        <h1 className="hero__title">
          ব্যবসা শুরু করছেন?
        </h1>
        <p className="hero__sub">
          আইডিয়া থেকে প্রথম গ্রাহক, আনুষ্ঠানিকতা, পেমেন্ট — সবকিছু এক জায়গায়, ধাপে ধাপে।
          কোথায় আছেন, তা বলুন — আমরা কী করবেন তা দেখাব।
        </p>
        <div className="hero__actions">
          <a href="#where-are-you" className="hero__btn">
            আমার পথ দেখান
          </a>
          <a href="/start-here" className="hero__btn hero__btn--ghost">
            সব দেখতে চাই
          </a>
        </div>
        <p className="hero__info">
          বাংলাদেশের জন্য, বাংলাদেশের ব্যবসার জন্য — স্থানীয় আইন, কর, পেমেন্ট, ডেলিভারি, গ্রাহক।
        </p>
      </section>

      {/* Situation selector */}
      <section id="where-are-you" aria-labelledby="where-heading">
        <div className="section-head">
          <span className="section-head__num">০১</span>
          <h2 className="section-head__title" id="where-heading">
            আপনি এখন কোথায়?
          </h2>
          <span className="section-head__hint">
            পথটা আপনার অবস্থার ওপর নির্ভর করে
          </span>
        </div>

        <FounderPathSelector
          paths={SITUATIONS}
          heading="আপনি এখন কোথায়?"
          subheading="নিচে ছয়টি চেনা পরিস্থিতি দেওয়া আছে। নিজেরটা মিলিয়ে নিন — সেই পথের প্রথম পৃষ্ঠায় নিয়ে যাবে।"
        />
      </section>

      {/* Visual roadmap */}
      <section aria-labelledby="roadmap-heading">
        <div className="section-head">
          <span className="section-head__num">০২</span>
          <h2 className="section-head__title" id="roadmap-heading">
            ব্যবসা গড়ার রোডম্যাপ
          </h2>
          <span className="section-head__hint">
            আইডিয়া থেকে বৃদ্ধি — ধাপে ধাপে
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
            কিছু ধাপে শাখা পথ
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
          <span className="section-head__num">০৩</span>
          <h2 className="section-head__title" id="tasks-heading">
            ফাউন্ডাররা সাধারণত এইগুলো করেন
          </h2>
          <span className="section-head__hint">
            বিষয় না, কাজ — সরাসরি কী করতে চান
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
          <span className="section-head__num">০৪</span>
          <h2 className="section-head__title" id="tools-heading">
            টুলস ও ক্যালকুলেটর
          </h2>
          <span className="section-head__hint">
            হিসাব, প্ল্যানিং, সিদ্ধান্ত
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
          <span className="section-head__num">০৫</span>
          <h2 className="section-head__title" id="ecosystem-heading">
            বাংলাদেশ স্টার্টআপ ইকোসিস্টেম
          </h2>
          <span className="section-head__hint">
            কোথায় যুক্ত হবেন, কার কাছে যাবেন
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
          একটি উন্মুক্ত উৎসের গাইড
        </h2>
        <p className="open-source__text">
          এই সাইটটি উন্মুক্ত উৎসের (open source) — যেকেউ সঠিক তথ্য, নতুন গাইড বা ভুল সংশোধন যোগ করতে পারেন।
          ব্যবহার, পরিবর্তন, এবং অবদান উভয়ই স্বাগত।
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
