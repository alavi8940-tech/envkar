export interface Project {
  id: string
  name: string
  icon: string
  color: string
  description: string
  repoUrl: string
  category: 'work' | 'personal' | 'test' | 'opensource'
  tags: string[]
  isPinned: boolean
  isArchived: boolean
  createdAt: string
  updatedAt: string
}

export interface Environment {
  id: string
  projectId: string
  name: string
  icon: string
  color: string
  description: string
  isLocked: boolean
  sortOrder: number
  createdAt: string
}

export interface Variable {
  id: string
  envId: string
  key: string
  value: string
  description: string
  category: string
  tags: string[]
  isSensitive: boolean
  isPinned: boolean
  isLocked: boolean
  isRequired: boolean
  defaultValue: string
  expiresAt: string | null
  createdAt: string
  updatedAt: string
}

export interface ApiRequest {
  id: string
  name: string
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS'
  url: string
  headers: Record<string, string>
  body: string
  bodyType: 'json' | 'form' | 'raw' | 'none'
  auth: { type: string; token: string }
}

export interface ApiResponse {
  status: number
  statusText: string
  headers: Record<string, string>
  body: string
  time: number
  size: number
}

export type Theme = 'dark' | 'light' | 'green' | 'blue' | 'purple'
