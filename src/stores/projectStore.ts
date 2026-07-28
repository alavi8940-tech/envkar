import { create } from 'zustand'
import { getDB, saveDB } from '@/utils/storage'
import { Project } from '@/types'

interface ProjectStore {
  projects: Project[]
  currentProject: Project | null
  fetchProjects: () => void
  createProject: (p: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => string
  updateProject: (id: string, p: Partial<Project>) => void
  deleteProject: (id: string) => void
  setCurrentProject: (p: Project | null) => void
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  currentProject: null,

  fetchProjects: () => {
    const db = getDB()
    set({ projects: db.projects })
  },

  createProject: (p) => {
    const id = crypto.randomUUID()
    const now = new Date().toISOString()
    const db = getDB()
    const project = { ...p, id, createdAt: now, updatedAt: now }
    db.projects.push(project)
    saveDB({ projects: db.projects })
    get().fetchProjects()
    return id
  },

  updateProject: (id, p) => {
    const db = getDB()
    const index = db.projects.findIndex(proj => proj.id === id)
    if (index !== -1) {
      db.projects[index] = { ...db.projects[index], ...p, updatedAt: new Date().toISOString() }
      saveDB({ projects: db.projects })
      get().fetchProjects()
    }
  },

  deleteProject: (id) => {
    const db = getDB()
    db.projects = db.projects.filter(p => p.id !== id)
    db.environments = db.environments.filter(e => e.projectId !== id)
    db.variables = db.variables.filter(v => {
      const env = db.environments.find(e => e.id === v.envId)
      return env?.projectId !== id
    })
    saveDB({ projects: db.projects, environments: db.environments, variables: db.variables })
    get().fetchProjects()
    if (get().currentProject?.id === id) set({ currentProject: null })
  },

  setCurrentProject: (p) => set({ currentProject: p }),
}))
