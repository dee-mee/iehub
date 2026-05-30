import type { EventItem, NewsArticle, Resource, ResourceFile, AccessLevel, Topic, DisabilityType } from '@/types/content'

// Use a relative URL so requests go through the Vite dev-server proxy
// (which forwards to the backend). An explicit VITE_API_URL env var can
// override this for production builds pointing at a real API host.
const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

type Paginated<T> = {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

type ResourceFileApi = {
  id: number
  file_url: string | null
  file_type: ResourceFile['fileType']
  label: string
  order: number
}

type ResourceApi = {
  id: number
  title: string
  description: string
  resource_type: Resource['resourceType']
  access_level: AccessLevel
  file_url: string | null
  external_url: string
  thumbnail_url: string | null
  language: string
  countries: string[]
  topics: Topic[]
  disability_types: DisabilityType[]
  files: ResourceFileApi[]
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

function mapResourceFile(item: ResourceFileApi): ResourceFile {
  return {
    id: item.id,
    fileUrl: item.file_url,
    fileType: item.file_type,
    label: item.label,
    order: item.order,
  }
}

function mapResource(item: ResourceApi): Resource {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    resourceType: item.resource_type,
    accessLevel: item.access_level,
    language: item.language,
    countries: item.countries ?? [],
    topics: item.topics,
    disabilityTypes: item.disability_types,
    publishedAt: item.published_at,
    downloadCount: item.download_count,
    isFeatured: item.is_featured,
    fileUrl: item.file_url ?? null,
    externalUrl: item.external_url ?? '',
    thumbnailUrl: item.thumbnail_url ?? null,
    files: (item.files ?? []).map(mapResourceFile),
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

export async function incrementDownload(id: number | string): Promise<void> {
  await request(`/resources/${id}/download/`, { method: 'POST' })
}
