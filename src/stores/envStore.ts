import { create } from 'zustand'
import { getDB, saveDB } from '@/utils/storage'
import { Environment } from '@/types'

interface EnvStore {
  environments: Environment[]
  currentEnv: Environment | null
  fetchEnvironments: (projectId: string) => void
  createEnv: (e: Omit<Environment, 'id' | 'createdAt'>) => string
  updateEnv: (id: string, e: Partial<Environment>) => void
  deleteEnv: (id: string) => void
  setCurrentEnv: (e: Environment | null) => void
}

export const useEnvStore = create<EnvStore>((set, get) => ({
  environments: [],
  currentEnv: null,

  fetchEnvironments: (projectId) => {
    const db = getDB()
    set({ environments: db.environments.filter(e => e.projectId === projectId) })
  },

  createEnv: (e) => {
    const id = crypto.randomUUID()
    const db = getDB()
    const env = { ...e, id, createdAt: new Date().toISOString() }
    db.environments.push(env)
    saveDB({ environments: db.environments })
    if (get().environments.length === 0 || env.projectId === get().environments[0]?.projectId) {
      get().fetchEnvironments(env.projectId)
    }
    return id
  },

  updateEnv: (id, e) => {
    const db = getDB()
    const index = db.environments.findIndex(env => env.id === id)
    if (index !== -1) {
      db.environments[index] = { ...db.environments[index], ...e }
      saveDB({ environments: db.environments })
      const projectId = db.environments[index].projectId
      get().fetchEnvironments(projectId)
    }
  },

  deleteEnv: (id) => {
    const db = getDB()
    const env = db.environments.find(e => e.id === id)
    db.environments = db.environments.filter(e => e.id !== id)
    db.variables = db.variables.filter(v => v.envId !== id)
    saveDB({ environments: db.environments, variables: db.variables })
    if (env) get().fetchEnvironments(env.projectId)
    if (get().currentEnv?.id === id) set({ currentEnv: null })
  },

  setCurrentEnv: (e) => set({ currentEnv: e }),
}))
