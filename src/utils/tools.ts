export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

export const generateNanoId = (size = 21): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'
  let id = ''
  const bytes = crypto.getRandomValues(new Uint8Array(size))
  for (let i = 0; i < size; i++) id += chars[bytes[i] % chars.length]
  return id
}

export const generateSecret = (length = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
  let secret = ''
  const bytes = crypto.getRandomValues(new Uint8Array(length))
  for (let i = 0; i < length; i++) secret += chars[bytes[i] % chars.length]
  return secret
}

export const generateApiKey = (prefix = 'sk'): string => {
  return `${prefix}_${generateNanoId(32)}`
}

export const generatePassword = (length = 16, options = { upper: true, lower: true, numbers: true, symbols: true }): string => {
  let chars = ''
  if (options.lower) chars += 'abcdefghijklmnopqrstuvwxyz'
  if (options.upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (options.numbers) chars += '0123456789'
  if (options.symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?'
  let pass = ''
  const bytes = crypto.getRandomValues(new Uint8Array(length))
  for (let i = 0; i < length; i++) pass += chars[bytes[i] % chars.length]
  return pass
}

export const toBase64 = (str: string): string => btoa(unescape(encodeURIComponent(str)))
export const fromBase64 = (str: string): string => decodeURIComponent(escape(atob(str)))

export const encodeURL = (str: string): string => encodeURIComponent(str)
export const decodeURL = (str: string): string => decodeURIComponent(str)

export const encodeHTML = (str: string): string => {
  const div = document.createElement('div')
  div.textContent = str
  return div.innerHTML
}

export const decodeHTML = (str: string): string => {
  const div = document.createElement('div')
  div.innerHTML = str
  return div.textContent || ''
}

export const hashString = async (str: string, algorithm: 'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512' = 'SHA-256'): Promise<string> => {
  const msgBuffer = new TextEncoder().encode(str)
  const hashBuffer = await crypto.subtle.digest(algorithm, msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

export const jsonToYaml = (obj: any, indent = 0): string => {
  const spaces = '  '.repeat(indent)
  if (Array.isArray(obj)) {
    return obj.map(item => `${spaces}- ${typeof item === 'object' ? '\n' + jsonToYaml(item, indent + 1) : item}`).join('\n')
  }
  if (typeof obj === 'object' && obj !== null) {
    return Object.entries(obj).map(([key, value]) => {
      if (typeof value === 'object') return `${spaces}${key}:\n${jsonToYaml(value, indent + 1)}`
      return `${spaces}${key}: ${value}`
    }).join('\n')
  }
  return String(obj)
}

export const parseEnv = (content: string): Record<string, string> => {
  const vars: Record<string, string> = {}
  content.split('\n').forEach(line => {
    line = line.trim()
    if (!line || line.startsWith('#')) return
    const eqIndex = line.indexOf('=')
    if (eqIndex === -1) return
    const key = line.substring(0, eqIndex).trim()
    let value = line.substring(eqIndex + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    vars[key] = value
  })
  return vars
}

export const toEnv = (vars: Record<string, string>): string => {
  return Object.entries(vars).map(([key, value]) => {
    if (value.includes(' ') || value.includes('#') || value.includes('"')) {
      return `${key}="${value.replace(/"/g, '\\"')}"`
    }
    return `${key}=${value}`
  }).join('\n')
}

export const toExport = (vars: Record<string, string>): string => {
  return Object.entries(vars).map(([key, value]) => `export ${key}="${value}"`).join('\n')
}

export const toDockerCompose = (vars: Record<string, string>): string => {
  const envVars = Object.entries(vars).map(([key, value]) => `    - ${key}=${value}`).join('\n')
  return `environment:\n${envVars}`
}

export const toKubernetesSecret = (vars: Record<string, string>): string => {
  const data = Object.entries(vars).map(([key, value]) => `  ${key}: ${btoa(value)}`).join('\n')
  return `apiVersion: v1\nkind: Secret\nmetadata:\n  name: my-secret\ntype: Opaque\ndata:\n${data}`
}

export const toVercelEnv = (vars: Record<string, string>): string => {
  return Object.entries(vars).map(([key, value]) => `${key}="${value}"`).join('\n')
}

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const textarea = document.createElement('textarea')
    textarea.value = text
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    return true
  }
}

export const downloadFile = (content: string, filename: string, type = 'text/plain') => {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export const testApi = async (request: ApiRequest): Promise<ApiResponse> => {
  const start = performance.now()
  const headers: Record<string, string> = { ...request.headers }
  
  if (request.auth.type === 'bearer' && request.auth.token) {
    headers['Authorization'] = `Bearer ${request.auth.token}`
  } else if (request.auth.type === 'basic' && request.auth.token) {
    headers['Authorization'] = `Basic ${btoa(request.auth.token)}`
  }

  const options: RequestInit = {
    method: request.method,
    headers,
  }

  if (request.method !== 'GET' && request.method !== 'HEAD' && request.body) {
    if (request.bodyType === 'json') {
      headers['Content-Type'] = 'application/json'
      options.body = request.body
    } else if (request.bodyType === 'form') {
      headers['Content-Type'] = 'application/x-www-form-urlencoded'
      options.body = request.body
    } else {
      options.body = request.body
    }
  }

  const response = await fetch(request.url, options)
  const end = performance.now()
  const body = await response.text()
  
  const responseHeaders: Record<string, string> = {}
  response.headers.forEach((value, key) => {
    responseHeaders[key] = value
  })

  return {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
    body,
    time: Math.round(end - start),
    size: new Blob([body]).size
  }
}

export const timestampToDate = (ts: number): string => {
  return new Date(ts * 1000).toISOString()
}

export const dateToTimestamp = (date: string): number => {
  return Math.floor(new Date(date).getTime() / 1000)
}

export const caseConverters = {
  upper: (s: string) => s.toUpperCase(),
  lower: (s: string) => s.toLowerCase(),
  title: (s: string) => s.replace(/\b\w/g, c => c.toUpperCase()),
  camel: (s: string) => s.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : ''),
  snake: (s: string) => s.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, ''),
  kebab: (s: string) => s.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/^-/, ''),
  pascal: (s: string) => s.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '').replace(/^./, c => c.toUpperCase()),
}

export interface ApiRequest {
  id: string
  name: string
  method: string
  url: string
  headers: Record<string, string>
  body: string
  bodyType: string
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
