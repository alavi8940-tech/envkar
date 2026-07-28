import React, { useState } from 'react'
import { useProjectStore } from '@/stores/projectStore'

const ICONS = ['📁', '💼', '🚀', '🌐', '📱', '🖥️', '⚡', '🔧', '🎯', '💡', '🔥', '✨', '🎮', '📊', '🛒', '💬']
const COLORS = ['#22c55e', '#3b82f6', '#a855f7', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#8b5cf6']

export default function ProjectsView() {
  const { projects, createProject, deleteProject, setCurrentProject } = useProjectStore()
  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState('')
  const [icon, setIcon] = useState('📁')
  const [color, setColor] = useState('#22c55e')
  const [category, setCategory] = useState<string>('personal')

  const handleCreate = () => {
    if (name.trim()) {
      createProject({ name, icon, color, description: '', repoUrl: '', category: category as any, tags: [], isPinned: false, isArchived: false })
      setShowModal(false)
      setName('')
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="grid grid-cols-2 gap-3">
        {projects.filter(p => !p.isArchived).map(project => (
          <div
            key={project.id}
            onClick={() => setCurrentProject(project)}
            className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] active:border-[var(--accent)] transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{project.icon}</span>
              <button onClick={(e) => { e.stopPropagation(); deleteProject(project.id) }} className="p-1 text-[var(--text-muted)] active:text-[var(--danger)]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            <h3 className="font-bold text-sm mb-1 line-clamp-1">{project.name}</h3>
            <div className="w-full h-1 rounded-full mt-2" style={{ backgroundColor: project.color + '40' }}>
              <div className="h-full rounded-full" style={{ backgroundColor: project.color, width: '60%' }} />
            </div>
          </div>
        ))}

        <button
          onClick={() => setShowModal(true)}
          className="p-4 rounded-2xl border-2 border-dashed border-[var(--border)] active:border-[var(--accent)] transition-all flex flex-col items-center justify-center gap-2 min-h-[120px]"
        >
          <svg className="w-8 h-8 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-xs text-[var(--text-muted)]">پروژه جدید</span>
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-end justify-center z-[100] animate-fade-in" onClick={() => setShowModal(false)}>
          <div className="bg-[var(--bg-secondary)] rounded-t-2xl w-full p-5 animate-slide-up" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-bold text-[var(--accent)] mb-4">پروژه جدید</h3>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="نام پروژه" className="w-full p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] text-sm mb-4 focus:outline-none focus:border-[var(--accent)]" />
            <div className="mb-4">
              <label className="text-xs text-[var(--text-muted)] mb-2 block">آیکون</label>
              <div className="flex flex-wrap gap-2">{ICONS.map(i => <button key={i} onClick={() => setIcon(i)} className={`w-10 h-10 rounded-lg text-lg flex items-center justify-center ${icon === i ? 'bg-[var(--accent-muted)] ring-2 ring-[var(--accent)]' : 'bg-[var(--bg-primary)]'}`}>{i}</button>)}</div>
            </div>
            <div className="mb-4">
              <label className="text-xs text-[var(--text-muted)] mb-2 block">رنگ</label>
              <div className="flex gap-2">{COLORS.map(c => <button key={c} onClick={() => setColor(c)} className={`w-8 h-8 rounded-full ${color === c ? 'ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--bg-secondary)]' : ''}`} style={{ backgroundColor: c }} />)}</div>
            </div>
            <div className="mb-5">
              <label className="text-xs text-[var(--text-muted)] mb-2 block">دسته‌بندی</label>
              <div className="flex gap-2">{['work','personal','test','opensource'].map(c => <button key={c} onClick={() => setCategory(c)} className={`px-3 py-1.5 rounded-lg text-xs ${category === c ? 'bg-[var(--accent)] text-[var(--bg-primary)]' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)]'}`}>{c === 'work' ? 'کاری' : c === 'personal' ? 'شخصی' : c === 'test' ? 'تست' : 'اوپن‌سورس'}</button>)}</div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleCreate} className="flex-1 py-3 rounded-xl bg-[var(--accent)] text-[var(--bg-primary)] font-bold text-sm">ایجاد</button>
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] text-sm">انصراف</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
