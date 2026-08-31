import mediaManifest from '../generated/media.json' with { type: 'json' }
import socialImages from '../../data/social-images.json' with { type: 'json' }
import { MEDIA_URL } from '../seo.config.mjs'

export function socialImageDefinition(page, definitions = socialImages) {
  const definition = definitions?.[page.slug]
  const localized = definition?.locales?.[page.locale]
  if (!localized) return null
  return {
    ...localized,
    template: definition.template
  }
}

export function pageSocialImage(
  page,
  { registry = mediaManifest, mediaUrl = MEDIA_URL, definitions = socialImages } = {}
) {
  const definition = socialImageDefinition(page, definitions)
  if (!definition) return null
  const entry = registry[definition.src]
  if (!entry?.remote || !entry.key) return null
  return {
    alt: definition.alt,
    logicalPath: definition.src,
    url: `${mediaUrl.replace(/\/+$/, '')}/${entry.key}`
  }
}

export function defaultSocialImageAlt(locale) {
  return locale === 'en'
    ? 'Deshi Startup, the free, open-source manual for building startups in Bangladesh'
    : 'দেশি স্টার্টআপ, বাংলাদেশে স্টার্টআপ গড়ার ফ্রি, ওপেন-সোর্স ম্যানুয়াল'
}
