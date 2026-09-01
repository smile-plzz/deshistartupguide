import { JourneyMap } from '../../../components/JourneyMap'

export const metadata = {
  title: 'ধাপে ধাপে রোডম্যাপ – আইডিয়া থেকে স্কেল',
  description: 'বাংলাদেশে স্টার্টআপ গড়ার চার ধাপের রোডম্যাপ: যাচাই ও ভিত্তি, পণ্য ও টিম, বিক্রি ও ফান্ডিং, স্কেল ও প্রতিষ্ঠান।',
}

const STEPS = [
  {
    id: 'idea',
    title: 'আইডিয়া ও সমস্যা',
    description: 'কার কী সমস্যা সমাধান করছেন — এক লাইনে লিখুন',
    note: 'আইডিয়াটা সত্যিই নিজের কি? নাকি অন্যরা ইতিমধ্যে করছে?',
  },
  {
    id: 'validate',
    title: 'যাচাই',
    description: 'গ্রাহক কি সত্যিই এই সমস্যায় আছে, টাকা দেবে কি',
    note: 'পণ্য বানানোর আগেই গ্রাহকের সাথে কথা বলুন। সমস্যাটা কি আপনার মনের মতোই?',
  },
  {
    id: 'business-model',
    title: 'ব্যবসার মডেল',
    description: 'কে আপনার গ্রাহক, আপনি কীভাবে আয় করবেন',
  },
  {
    id: 'mvp',
    title: 'প্রথম পণ্য',
    description: 'কম খরচে, কম সময়ে, ছোট শুরু',
    note: 'এমভিপিও অপশন — নিউজলেটার, ফর্ম, হাতে লেখা সার্ভিস, নো-কোড। প্রথম পণ্যটা "সুন্দর" হবে না, "কাজ করবে"।',
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
    note: 'পেমেন্ট নেওয়া আর হিসাব রাখা দুটোই শুরু থেকেই প্রতিষ্ঠিত থাকা উচিত।',
  },
  {
    id: 'formalization',
    title: 'আনুষ্ঠানিকতা',
    description: 'রেজিস্ট্রেশন, টিআইএন, ভ্যাট, লাইসেন্স',
    note: 'সব কাগজ একসাথে না হলেও, সময়মতো কাগজ শুরু করুন। টিআইএন বেশিরভাগ ক্ষেত্রেই প্রথম প্রয়োজন।',
  },
  {
    id: 'revenue',
    title: 'আয় ও মুনাফা',
    description: 'মূল্য, মার্জিন, ক্যাশফ্লো',
  },
  {
    id: 'team',
    title: 'টিম ও নিয়োগ',
    description: 'প্রথম লোক, সংগঠন, রাখায়',
  },
  {
    id: 'funding',
    title: 'ফান্ডিং ও বৃদ্ধি',
    description: 'অ্যাঞ্জেল, ভিসি, গ্রান্ট, স্কেল',
    note: 'ফান্ডিং সব ব্যবসার জন্য জরুরি নয়। প্রথমে ব্যবসাটা স্বয়ংসম্পূর্ণ হয়েছে কি না, সেটা প্রশ্ন।',
  },
]

const BRANCHES = [
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

export default function RoadmapPage() {
  return (
    <>
      <section className="roadmap-hero" aria-label="Roadmap">
        <span className="roadmap-hero__eyebrow">রোডম্যাপ</span>
        <h1 className="roadmap-hero__title">
          ব্যবসা গড়ার ধাপে ধাপে পথ
        </h1>
        <p className="roadmap-hero__sub">
          আইডিয়া থেকে বৃদ্ধি — কোন পর্যায়ে আপনি আছেন, এর পর কী করতে হবে,
          কোন শাখায় যেতে হবে — এক জায়গায়।
        </p>
      </section>

      <section aria-labelledby="main-roadmap-heading">
        <div className="section-head section-head--sm">
          <h2 className="section-head__title" id="main-roadmap-heading">
            প্রধান পথ
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
            কিছু ধাপে শাখা পথ
          </h2>
          <span className="section-head__hint">
            কোন ধাপগুলোতে আপনার নির্দিষ্ট পথ বা সাইটে গভীর গাইড বেশি প্রাসঙ্গিক
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
                        ? `/validation/${child.id}`
                        : branch.id === 'building'
                          ? `/product/${child.id}`
                          : branch.id === 'payments'
                            ? `/payments/${child.id}`
                            : branch.id === 'formalization'
                              ? child.id === 'trade-license'
                                ? '/trade-license'
                                : `/tax/${child.id}`
                              : branch.id === 'funding'
                                ? `/funding/${child.id}`
                                : `/${branch.id}/${child.id}`
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
        <span className="roadmap-cta__label">আপনার পথ খুঁজে পেতে</span>
        <a href="/" className="roadmap-cta__btn">
          বর্তমান অবস্থা বলুন
        </a>
      </section>
    </>
  )
}
