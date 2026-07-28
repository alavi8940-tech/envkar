import React from 'react'

interface Props {
  title: string
  subtitle?: string
  onMenuClick: () => void
  onBack?: () => void
  rightAction?: React.ReactNode
}

export default function TopBar({ title, subtitle, onMenuClick, onBack, rightAction }: Props) {
  return (
    <header className="h-14 bg-[var(--bg-secondary)] border-b border-[var(--border)] flex items-center justify-between px-3 flex-shrink-0 safe-area-top">
      <div className="flex items-center gap-2">
        {onBack ? (
          <button onClick={onBack} className="p-2 rounded-xl active:bg-[var(--bg-tertiary)]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ) : (
          <button onClick={onMenuClick} className="p-2 rounded-xl active:bg-[var(--bg-tertiary)]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        <div>
          <h1 className="text-sm font-bold text-[var(--text-primary)]">{title}</h1>
          {subtitle && <p className="text-xs text-[var(--text-muted)]">{subtitle}</p>}
        </div>
      </div>
      {rightAction && <div className="flex items-center gap-2">{rightAction}</div>}
    </header>
  )
}
