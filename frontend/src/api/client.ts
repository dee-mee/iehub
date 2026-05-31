const API_BASE_URL = import.meta.env.VITE_API_URL ?? '/api'
const TOKEN_KEY = 'iehub_tokens'

export function getAccessToken(): string | null {
  try {
    const raw = localStorage.getItem(TOKEN_KEY)
    if (!raw) return null
    const tokens = JSON.parse(raw) as { access?: string }
    return tokens.access ?? null
  } catch {
    return null
  }
}

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = getAccessToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string> | undefined),
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers })
  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || `Request failed: ${response.status}`)
  }
  if (response.status === 204) {
    return undefined as T
  }
  return (await response.json()) as T
}

export function apiList<T>(data: { results?: T[] } | T[]): T[] {
  if (Array.isArray(data)) return data
  return data.results ?? []
}

export { API_BASE_URL }
