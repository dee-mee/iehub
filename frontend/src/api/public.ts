import type { EventItem, NewsArticle, Resource, AccessLevel } from '@/types/content'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api'

type Paginated<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

type ResourceApi = {
  id: number
  title: string
  description: string
  resource_type: Resource['resourceType']
  access_level: AccessLevel
  language: string
  countries: string[]
  topics: string[]
  published_at: string
  download_count: number
  is_featured: boolean
}

type NewsApi = {
  id: number
  slug: string
  title: string
  excerpt: string
  content: string
  category: NewsArticle['category']
  published_at: string
  author_name: string
}

type EventApi = {
  id: number
  title: string
  description: string
  event_type: EventItem['eventType']
  start_datetime: string
  end_datetime: string
  location_type: EventItem['locationType']
  location_address?: string
  online_link?: string
}

type ContactPayload = {
  fullName: string
  email: string
  organization: string
  subject: string
  message: string
}

function toQuery(params: Record<string, string | number | undefined>): string {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') query.set(key, String(value))
  }
  const encoded = query.toString()
  return encoded ? `?${encoded}` : ''
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Request failed with status ${response.status}`)
  }

  return (await response.json()) as T
}

function mapResource(item: ResourceApi): Resource {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    resourceType: item.resource_type,
    accessLevel: item.access_level,
    language: item.language,
    countries: item.countries,
    topics: item.topics,
    publishedAt: item.published_at,
    downloadCount: item.download_count,
    isFeatured: item.is_featured,
  }
}

function mapNews(item: NewsApi): NewsArticle {
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt,
    content: item.content,
    category: item.category,
    publishedAt: item.published_at,
    author: item.author_name,
  }
}

function mapEvent(item: EventApi): EventItem {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    eventType: item.event_type,
    startDatetime: item.start_datetime,
    endDatetime: item.end_datetime,
    locationType: item.location_type,
    locationAddress: item.location_address,
    onlineLink: item.online_link,
  }
}

export async function fetchResources(params?: {
  page?: number
  search?: string
  ordering?: string
}): Promise<Paginated<Resource>> {
  const query = toQuery({
    page: params?.page,
    search: params?.search,
    ordering: params?.ordering,
  })
  const data = await request<Paginated<ResourceApi>>(`/resources/${query}`)
  return { ...data, results: data.results.map(mapResource) }
}

export async function fetchResourceById(id: string): Promise<Resource> {
  const data = await request<ResourceApi>(`/resources/${id}/`)
  return mapResource(data)
}

export async function fetchNews(params?: { page?: number; search?: string }): Promise<Paginated<NewsArticle>> {
  const query = toQuery({ page: params?.page, search: params?.search })
  const data = await request<Paginated<NewsApi>>(`/news/${query}`)
  return { ...data, results: data.results.map(mapNews) }
}

export async function fetchNewsBySlug(slug: string): Promise<NewsArticle> {
  const data = await request<NewsApi>(`/news/${slug}/`)
  return mapNews(data)
}

export async function fetchEvents(params?: { page?: number; search?: string }): Promise<Paginated<EventItem>> {
  const query = toQuery({ page: params?.page, search: params?.search })
  const data = await request<Paginated<EventApi>>(`/events/${query}`)
  return { ...data, results: data.results.map(mapEvent) }
}

export async function submitContactMessage(payload: ContactPayload): Promise<void> {
  await request('/contact-messages/', {
    method: 'POST',
    body: JSON.stringify({
      full_name: payload.fullName,
      email: payload.email,
      organization: payload.organization,
      subject: payload.subject,
      message: payload.message,
    }),
  })
}
