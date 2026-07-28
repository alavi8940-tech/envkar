import React from 'react'
import { getSetting, setSetting } from '@/utils/storage'

const THEMES = [
  { id: 'dark', label: 'تاریک', icon: '🌙', colors: ['#0f172a', '#1e293b', '#22c55e'] },
  { id: 'light', label: 'روشن', icon: '☀️', colors: ['#ffffff', '#f8fafc', '#16a34a'] },
  { id: 'green', label: 'سبز', icon: '🟢', colors: ['#052e16', '#14532d', '#4ade80'] },
  { id: 'blue', label: 'آبی', icon: '🔵', colors: ['#0c1929', '#1e3a5f', '#38bdf8'] },
  { id: 'purple', label: 'بنفش', icon: '🟣', colors: ['#1a0a2e', '#2d1b4e', '#a855f7'] },
]

export default function SettingsView() {
  const [theme, setThemeState] = React.useState(getSetting('theme', 'dark'))
  const [fontSize, setFontSizeState] = React.useState(getSetting('fontSize', '14'))

  const setTheme = (t: string) => {
    setThemeState(t)
    setSetting('theme', t)
    document.documentElement.setAttribute('data-theme', t)
  }

  const setFontSize = (s: string) => {
    setFontSizeState(s)
    setSetting('fontSize', s)
    document.documentElement.style.fontSize = s + 'px'
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6">
      {/* Theme */}
      <div>
        <h3 className="text-sm font-bold text-[var(--text-secondary)] mb-3">🎨 تم برنامه</h3>
        <div className="grid grid-cols-2 gap-3">
          {THEMES.map(t => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`p-4 rounded-2xl border-2 transition-all ${theme === t.id ? 'border-[var(--accent)]' : 'border-[var(--border)]'}`}
            >
              <div className="flex gap-1 mb-3 justify-center">
                {t.colors.map((c, i) => <div key={i} className="w-6 h-6 rounded-full" style={{ backgroundColor: c }} />)}
              </div>
              <p className="text-xs font-medium">{t.icon} {t.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div>
        <h3 className="text-sm font-bold text-[var(--text-secondary)] mb-3">🔤 اندازه فونت: {fontSize}px</h3>
        <input type="range" min="12" max="20" value={fontSize} onChange={e => setFontSize(e.target.value)} className="w-full accent-[var(--accent)]" />
        <div className="flex justify-between text-xs text-[var(--text-muted)]"><span>۱۲</span><span>۲۰</span></div>
      </div>

      {/* Backup */}
      <div>
        <h3 className="text-sm font-bold text-[var(--text-secondary)] mb-3">💾 پشتیبان‌گیری</h3>
        <div className="space-y-2">
          <button onClick={() => {
            const data = localStorage.getItem('envkar-db')
            if (data) {
              const blob = new Blob([data], { type: 'application/json' })
              const url = URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `envkar-backup-${new Date().toISOString().split('T')[0]}.json`
              a.click()
              URL.revokeObjectURL(url)
            }
          }} className="w-full p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-sm text-right active:border-[var(--accent)]">
            📤 خروجی پشتیبان (JSON)
          </button>
          <button onClick={() => {
            const input = document.createElement('input')
            input.type = 'file'
            input.accept = '.json'
            input.onchange = (e: any) => {
              const file = e.target.files[0]
              if (file) {
                const reader = new FileReader()
                reader.onload = (ev) => {
                  const result = ev.target?.result as string
                  localStorage.setItem('envkar-db', result)
                  alert('بازیابی با موفقیت انجام شد! برنامه را رفرش کنید.')
                }
                reader.readAsText(file)
              }
            }
            input.click()
          }} className="w-full p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-sm text-right active:border-[var(--accent)]">
            📥 بازیابی از پشتیبان
          </button>
        </div>
      </div>

      {/* About */}
      <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-center">
        <p className="text-2xl mb-2">⚡</p>
        <p className="font-bold text-[var(--accent)]">ENV کار</p>
        <p className="text-xs text-[var(--text-muted)] mt-1">نسخه ۱.۰.۰</p>
        <p className="text-xs text-[var(--text-muted)] mt-2">مدیریت حرفه‌ای متغیرهای محیطی</p>
      </div>
    </div>
  )
}
