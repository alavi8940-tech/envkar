import React from 'react'
import { getDB } from '@/utils/storage'

export default function DashboardView() {
  const db = getDB()
  const stats = {
    projects: db.projects.length,
    environments: db.environments.length,
    variables: db.variables.length,
    sensitive: db.variables.filter(v => v.isSensitive).length,
    pinned: db.variables.filter(v => v.isPinned).length,
  }

  const recentVars = [...db.variables].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()).slice(0, 5)

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: '📁', label: 'پروژه', value: stats.projects, color: '#22c55e' },
          { icon: '🌐', label: 'Environment', value: stats.environments, color: '#3b82f6' },
          { icon: '📝', label: 'متغیر', value: stats.variables, color: '#a855f7' },
          { icon: '🔒', label: 'حساس', value: stats.sensitive, color: '#ef4444' },
        ].map((stat, i) => (
          <div key={i} className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">{stat.icon}</span>
              <span className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</span>
            </div>
            <p className="text-xs text-[var(--text-muted)]">{stat.label}</p>
          </div>
        ))}
      </div>

      <div>
        <h3 className="text-sm font-bold text-[var(--text-secondary)] mb-3">📋 آخرین تغییرات</h3>
        <div className="space-y-2">
          {recentVars.map(v => (
            <div key={v.id} className="p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] flex items-center justify-between">
              <div>
                <p className="text-xs font-mono text-[var(--accent)]">{v.key}</p>
                <p className="text-[10px] text-[var(--text-muted)]">{new Date(v.updatedAt).toLocaleDateString('fa-IR')}</p>
              </div>
              {v.isSensitive && <span className="text-xs">🔒</span>}
            </div>
          ))}
          {recentVars.length === 0 && (
            <p className="text-center text-sm text-[var(--text-muted)] py-4">هنوز متغیری وجود ندارد</p>
          )}
        </div>
      </div>
    </div>
  )
}
