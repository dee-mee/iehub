export type ResourceType =
  | 'REPORT'
  | 'PUBLICATION'
  | 'TOOLKIT'
  | 'POLICY_BRIEF'
  | 'RESEARCH'
  | 'VIDEO'
  | 'OTHER'

export interface Resource {
  id: number | string
  title: string
  description: string
  resourceType: ResourceType
  language: string
  countries: string[]
  topics: string[]
  publishedAt: string
  downloadCount: number
  isFeatured?: boolean
}

export interface NewsArticle {
  id: number | string
  slug: string
  title: string
  excerpt: string
  content: string
  category: 'NEWS' | 'BLOG' | 'STORY' | 'PRESS_RELEASE'
  publishedAt: string
  author: string
}

export interface EventItem {
  id: number | string
  title: string
  description: string
  eventType: 'WEBINAR' | 'WORKSHOP' | 'CONFERENCE' | 'TRAINING' | 'OTHER'
  startDatetime: string
  endDatetime: string
  locationType: 'ONLINE' | 'IN_PERSON' | 'HYBRID'
  locationAddress?: string
  onlineLink?: string
}

export interface ImpactStat {
  id: string
  value: string
  label: string
  description: string
}

export interface FocusArea {
  id: string
  title: string
  description: string
  href: string
}
