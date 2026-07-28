import { create } from 'zustand'
import { getDB, saveDB } from '@/utils/storage'
import { Variable } from '@/types'

interface VariableStore {
  variables: Variable[]
  fetchVariables: (envId: string) => void
  createVariable: (v: Omit<Variable, 'id' | 'createdAt' | 'updatedAt'>) => string
  updateVariable: (id: string, v: Partial<Variable>) => void
  deleteVariable: (id: string) => void
  bulkDelete: (ids: string[]) => void
  bulkCopy: (ids: string[], targetEnvId: string) => void
  importVariables: (envId: string, vars: Record<string, string>) => void
  exportVariables: (envId: string, format: string) => string
}

export const useVariableStore = create<VariableStore>((set, get) => ({
  variables: [],

  fetchVariables: (envId) => {
    const db = getDB()
    set({ variables: db.variables.filter(v => v.envId === envId) })
  },

  createVariable: (v) => {
    const id = crypto.randomUUID()
    const now = new Date().toISOString()
    const db = getDB()
    const variable = { ...v, id, createdAt: now, updatedAt: now }
    db.variables.push(variable)
    saveDB({ variables: db.variables })
    get().fetchVariables(v.envId)
    return id
  },

  updateVariable: (id, v) => {
    const db = getDB()
    const index = db.variables.findIndex(vr => vr.id === id)
    if (index !== -1) {
      db.variables[index] = { ...db.variables[index], ...v, updatedAt: new Date().toISOString() }
      saveDB({ variables: db.variables })
      get().fetchVariables(db.variables[index].envId)
    }
  },

  deleteVariable: (id) => {
    const db = getDB()
    const v = db.variables.find(vr => vr.id === id)
    db.variables = db.variables.filter(vr => vr.id !== id)
    saveDB({ variables: db.variables })
    if (v) get().fetchVariables(v.envId)
  },

  bulkDelete: (ids) => {
    const db = getDB()
    const envId = db.variables.find(v => ids.includes(v.id))?.envId
    db.variables = db.variables.filter(v => !ids.includes(v.id))
    saveDB({ variables: db.variables })
    if (envId) get().fetchVariables(envId)
  },

  bulkCopy: (ids, targetEnvId) => {
    const db = getDB()
    const now = new Date().toISOString()
    ids.forEach(id => {
      const v = db.variables.find(vr => vr.id === id)
      if (v) {
        db.variables.push({ ...v, id: crypto.randomUUID(), envId: targetEnvId, createdAt: now, updatedAt: now })
      }
    })
    saveDB({ variables: db.variables })
    get().fetchVariables(targetEnvId)
  },

  importVariables: (envId, vars) => {
    const db = getDB()
    const now = new Date().toISOString()
    Object.entries(vars).forEach(([key, value]) => {
      const exists = db.variables.find(v => v.envId === envId && v.key === key)
      if (exists) {
        exists.value = value
        exists.updatedAt = now
      } else {
        db.variables.push({
          id: crypto.randomUUID(), envId, key, value,
          description: '', category: 'custom', tags: [],
          isSensitive: false, isPinned: false, isLocked: false, isRequired: false,
          defaultValue: '', expiresAt: null, createdAt: now, updatedAt: now
        })
      }
    })
    saveDB({ variables: db.variables })
    get().fetchVariables(envId)
  },

  exportVariables: (envId, format) => {
    const db = getDB()
    const vars = db.variables.filter(v => v.envId === envId)
    const obj: Record<string, string> = {}
    vars.forEach(v => { obj[v.key] = v.value })
    
    switch (format) {
      case 'env': return Object.entries(obj).map(([k, v]) => `${k}=${v}`).join('\n')
      case 'export': return Object.entries(obj).map(([k, v]) => `export ${k}="${v}"`).join('\n')
      case 'json': return JSON.stringify(obj, null, 2)
      case 'docker': return Object.entries(obj).map(([k, v]) => `    - ${k}=${v}`).join('\n')
      case 'k8s': {
        const data = Object.entries(obj).map(([k, v]) => `  ${k}: ${btoa(v)}`).join('\n')
        return `apiVersion: v1\nkind: Secret\nmetadata:\n  name: my-secret\ntype: Opaque\ndata:\n${data}`
      }
      default: return Object.entries(obj).map(([k, v]) => `${k}=${v}`).join('\n')
    }
  },
}))
