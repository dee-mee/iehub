export type ResourceType =
  | 'REPORT'
  | 'PUBLICATION'
  | 'TOOLKIT'
  | 'POLICY_BRIEF'
  | 'RESEARCH'
  | 'VIDEO'
  | 'OTHER'

export type AccessLevel = 'PUBLIC' | 'MEMBERS_ONLY'

export interface Topic {
  id: number
  name: string
  slug: string
  description?: string
  icon?: string
}

export interface DisabilityType {
  id: number
  name: string
  slug: string
}

export interface Resource {
  id: number | string
  title: string
  description: string
  resourceType: ResourceType
  accessLevel: AccessLevel
  language: string
  countries: string[]
  topics: Topic[]
  disabilityTypes: DisabilityType[]
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

export type ForumThread = {
  id: number
  title: string
  slug: string
  author: {
    first_name: string
    username: string
  }
  post_count: number
  last_activity: string
}
