import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchEvents,
  fetchNews,
  fetchNewsBySlug,
  fetchResourceById,
  fetchResources,
  submitContactMessage,
} from './public'
import { login, me, refresh, register } from './auth'

// Resource hooks
export function useResources(params?: { page?: number; search?: string; ordering?: string }) {
  return useQuery({
    queryKey: ['resources', params],
    queryFn: () => fetchResources(params),
  })
}

export function useResource(id: string) {
  return useQuery({
    queryKey: ['resource', id],
    queryFn: () => fetchResourceById(id),
    enabled: !!id,
  })
}

// News hooks
export function useNews(params?: { page?: number; search?: string }) {
  return useQuery({
    queryKey: ['news', params],
    queryFn: () => fetchNews(params),
  })
}

export function useNewsBySlug(slug: string) {
  return useQuery({
    queryKey: ['news', slug],
    queryFn: () => fetchNewsBySlug(slug),
    enabled: !!slug,
  })
}

// Events hooks
export function useEvents(params?: { page?: number; search?: string }) {
  return useQuery({
    queryKey: ['events', params],
    queryFn: () => fetchEvents(params),
  })
}

// Contact form hook
export function useContactMessage() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: submitContactMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact'] })
    },
  })
}

// Auth hooks
export function useLogin() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => login(email, password),
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'tokens'], data)
    },
  })
}

export function useRegister() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'user'], data)
    },
  })
}

export function useCurrentUser(accessToken?: string) {
  return useQuery({
    queryKey: ['auth', 'user'],
    queryFn: () => me(accessToken || ''),
    enabled: !!accessToken,
  })
}

export function useRefreshToken() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: refresh,
    onSuccess: (data) => {
      queryClient.setQueryData(['auth', 'tokens'], (old: { access: string; refresh: string } | undefined) => ({
        ...old,
        access: data.access,
      }))
    },
  })
}
