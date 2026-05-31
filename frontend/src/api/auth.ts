const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

export type AuthTokens = { access: string; refresh: string }

export type AuthUser = {
  id: number
  email: string
  username: string
  first_name: string
  last_name: string
  role: string
  country: string
  organization: string
  organization_type?: string
  professional_title?: string
  bio?: string
  how_heard?: string
  is_verified: boolean
  is_approved: boolean
  profile?: {
    linkedin_url?: string
    twitter_url?: string
    website_url?: string
    is_visible_in_directory: boolean
    expertise_areas: Array<{ id: number; name: string; slug: string }>
    countries_of_work: string[]
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const { headers, ...rest } = init ?? {}
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...rest,
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Auth request failed: ${response.status}`)
  }
  return (await response.json()) as T
}

export function login(email: string, password: string): Promise<AuthTokens> {
  return request<AuthTokens>('/auth/login/', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function refresh(refreshToken: string): Promise<{ access: string }> {
  return request<{ access: string }>('/auth/refresh/', {
    method: 'POST',
    body: JSON.stringify({ refresh: refreshToken }),
  })
}

export function register(payload: {
  email: string
  username: string
  password: string
  first_name: string
  last_name: string
  organization: string
  organization_type: string
  professional_title: string
  bio: string
  how_heard: string
  country: string
}): Promise<AuthUser> {
  return request<AuthUser>('/auth/register/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function me(accessToken: string): Promise<AuthUser> {
  return request<AuthUser>('/auth/me/', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}

export function updateMe(accessToken: string, payload: Partial<AuthUser>): Promise<AuthUser> {
  return request<AuthUser>('/auth/me/', {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(payload),
  })
}
