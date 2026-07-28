import React from 'react'
import { useProjectStore } from '@/stores/projectStore'
import { useEnvStore } from '@/stores/envStore'

const CATEGORIES = [
  { id: 'all', label: 'همه', icon: '📋' },
  { id: 'work', label: 'کاری', icon: '💼' },
  { id: 'personal', label: 'شخصی', icon: '👤' },
  { id: 'test', label: 'تست', icon: '🧪' },
  { id: 'opensource', label: 'اوپن‌سورس', icon: '🌐' },
]

interface Props {
  isOpen: boolean
  onClose: () => void
  activeView: string
  onViewChange: (view: string) => void
}

export default function Sidebar({ isOpen, onClose, activeView, onViewChange }: Props) {
  const { projects, currentProject, setCurrentProject } = useProjectStore()

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed top-0 right-0 h-full w-[280px] bg-[var(--bg-secondary)] border-l border-[var(--border)] z-50 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 border-b border-[var(--border)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <h1 className="text-lg font-bold text-[var(--accent)]">ENV کار</h1>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg active:bg-[var(--bg-tertiary)]">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <nav className="p-3 border-b border-[var(--border)]">
          {[
            { id: 'dashboard', icon: '📊', label: 'داشبورد' },
            { id: 'projects', icon: '📁', label: 'پروژه‌ها' },
            { id: 'tools', icon: '🔧', label: 'ابزارها' },
            { id: 'settings', icon: '⚙️', label: 'تنظیمات' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => { onViewChange(item.id); onClose() }}
              className={`w-full flex items-center gap-3 p-3 rounded-xl mb-1 text-sm transition-all ${
                activeView === item.id ? 'bg-[var(--accent-muted)] text-[var(--accent)]' : 'text-[var(--text-secondary)] active:bg-[var(--bg-tertiary)]'
              }`}
            >
              <span>{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="flex-1 overflow-y-auto p-3">
          <h3 className="text-xs font-medium text-[var(--text-muted)] mb-2 px-2">پروژه‌ها</h3>
          {projects.filter(p => !p.isArchived).map(project => (
            <button
              key={project.id}
              onClick={() => { setCurrentProject(project); onViewChange('envs'); onClose() }}
              className={`w-full flex items-center gap-3 p-3 rounded-xl mb-1 text-sm transition-all ${
                currentProject?.id === project.id ? 'bg-[var(--accent-muted)] text-[var(--accent)]' : 'text-[var(--text-secondary)] active:bg-[var(--bg-tertiary)]'
              }`}
            >
              <span className="text-lg">{project.icon}</span>
              <span className="font-medium line-clamp-1 flex-1 text-right">{project.name}</span>
              {project.isPinned && <span className="text-xs">📌</span>}
            </button>
          ))}
        </div>
      </aside>
    </>
  )
}
