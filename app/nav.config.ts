/**
 * Curated sidebar navigation. Section hub pages list their own children
 * automatically (see SectionIndex) – only top-level curation lives here.
 * Primary IA is five stable choices (Start Here, Guides, Tools, Case Studies,
 * Directory) plus the contributor group; /guides lists every
 * topic hub, so the sidebar only surfaces the most-used ones.
 */
import { REPOSITORY_URL, SOCIAL_PROFILE_URLS } from './seo.config.mjs'

export const REPO_URL = REPOSITORY_URL
export const DISCORD_URL = 'https://discord.gg/Wsgn3CaFyD'
export const FACEBOOK_GROUP_URL = 'https://www.facebook.com/groups/deshistartup/'
export const FACEBOOK_URL = SOCIAL_PROFILE_URLS.facebook
export const LINKEDIN_URL = SOCIAL_PROFILE_URLS.linkedin
export const YOUTUBE_URL = SOCIAL_PROFILE_URLS.youtube

export interface NavSection {
  label: string
  items: [string, string][]
}

export const bnNav: NavSection[] = [
  {
    label: 'শুরু করুন',
    items: [
      ['/start-here', 'শুরুটা হোক এখান থেকে'],
      ['/roadmap', 'সাজানো রোডম্যাপগুলো দেখুন'],
      ['/ecosystem', 'বাংলাদেশের স্টার্টআপ ইকোসিস্টেম']
    ]
  },
  {
    label: 'টপিক ধরে খুঁজুন',
    items: [
      ['/guides', 'সব টপিকের তালিকা'],
      ['/ideas', 'আইডিয়া ও মার্কেট রিসার্চ'],
      ['/validation', 'আইডিয়া ভ্যালিডেশন'],
      ['/registration', 'ব্যবসা রেজিস্ট্রেশন'],
      ['/tax', 'ট্যাক্স, ভ্যাট ও অ্যাকাউন্টিং'],
      ['/payments', 'পেমেন্ট ও অপারেশন'],
      ['/customers', 'কাস্টমার ও সেলস'],
      ['/team', 'টিম ও নিয়োগ'],
      ['/funding', 'ফান্ডিং ও স্কেলিং'],
      ['/founder-life', 'ফাউন্ডার লাইফ']
    ]
  },
  {
    label: 'টেমপ্লেট ও টুলস',
    items: [['/tools', 'চেকলিস্ট, স্ক্রিপ্ট ও ক্যালকুলেটর']]
  },
  {
    label: 'কেস স্টাডি',
    items: [['/case-studies', 'বাংলাদেশি স্টার্টআপের গল্প']]
  },
  {
    label: 'ডিরেক্টরি',
    items: [
      ['/directory', 'ইকোসিস্টেম ডিরেক্টরি'],
      ['/startup-50', 'দেশি স্টার্টআপ ৫০']
    ]
  },
  {
    label: 'আমাদের সম্পর্কে',
    items: [
      ['/about', 'দেশি স্টার্টআপ ও সম্পাদকীয় নীতি'],
      ['/contact', 'যোগাযোগ করুন'],
      ['/contribute', 'কন্ট্রিবিউট করুন'],
      ['/contributors', 'কন্ট্রিবিউটরস্‌'],
      [REPO_URL, 'GitHub রিপোজিটরি'],
      [FACEBOOK_GROUP_URL, 'ফেসবুক কমিউনিটিতে যোগ দিন'],
      [DISCORD_URL, 'কন্ট্রিবিউটর ডিসকর্ড'],
      [`${REPO_URL}/issues/new?template=report-mistake.yml`, 'ফিডব্যাক দিন']
    ]
  }
]

export const enNav: NavSection[] = [
  {
    label: 'Start Here',
    items: [
      ['/en/start-here', 'Start here'],
      ['/en/roadmap', 'Step-by-step roadmap'],
      ['/en/ecosystem', 'Bangladesh ecosystem']
    ]
  },
  {
    label: 'Guides',
    items: [
      ['/en/guides', 'All topics'],
      ['/en/ideas', 'Ideas & market research'],
      ['/en/validation', 'Idea validation'],
      ['/en/registration', 'Business registration'],
      ['/en/tax', 'Tax, VAT & accounting'],
      ['/en/payments', 'Payments & operations'],
      ['/en/customers', 'Customers & sales'],
      ['/en/team', 'Team & hiring'],
      ['/en/funding', 'Funding & scaling'],
      ['/en/founder-life', 'Founder life']
    ]
  },
  {
    label: 'Templates & Tools',
    items: [['/en/tools', 'Checklists, scripts & calculators']]
  },
  {
    label: 'Case Studies',
    items: [['/en/case-studies', 'Bangladeshi startup stories']]
  },
  {
    label: 'Directory',
    items: [
      ['/en/directory', 'Ecosystem directory'],
      ['/en/startup-50', 'Deshi Startup 50']
    ]
  },
  {
    label: 'About & Community',
    items: [
      ['/en/about', 'About & editorial policy'],
      ['/en/contact', 'Contact us'],
      ['/en/contribute', 'Contribute'],
      ['/en/contributors', 'Contributors'],
      [REPO_URL, 'View on GitHub'],
      [FACEBOOK_GROUP_URL, 'Join the Facebook community'],
      [DISCORD_URL, 'Contributor Discord'],
      [`${REPO_URL}/issues/new?template=report-mistake.yml`, 'Report a mistake']
    ]
  }
]
