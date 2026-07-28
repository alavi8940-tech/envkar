import React, { useState } from 'react'
import { useProjectStore } from '@/stores/projectStore'
import { useEnvStore } from '@/stores/envStore'
import { useVariableStore } from '@/stores/variableStore'
import { copyToClipboard, parseEnv, toEnv, toExport, toDockerCompose, toKubernetesSecret } from '@/utils/tools'

const ENV_ICONS = ['🟢', '🟡', '🔵', '🔴', '⚪', '🟣']
const ENV_COLORS = ['#22c55e', '#f59e0b', '#3b82f6', '#ef4444', '#94a3b8', '#a855f7']

export default function EnvsView() {
  const { currentProject } = useProjectStore()
  const { environments, currentEnv, createEnv, deleteEnv, setCurrentEnv, fetchEnvironments } = useEnvStore()
  const { variables, fetchVariables, createVariable, updateVariable, deleteVariable, importVariables, exportVariables } = useVariableStore()
  const [showAddEnv, setShowAddEnv] = useState(false)
  const [showAddVar, setShowAddVar] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [showExport, setShowExport] = useState(false)
  const [envName, setEnvName] = useState('')
  const [envIcon, setEnvIcon] = useState('🟢')
  const [envColor, setEnvColor] = useState('#22c55e')
  const [varKey, setVarKey] = useState('')
  const [varValue, setVarValue] = useState('')
  const [varDesc, setVarDesc] = useState('')
  const [varCategory, setVarCategory] = useState('custom')
  const [isSensitive, setIsSensitive] = useState(false)
  const [importText, setImportText] = useState('')
  const [search, setSearch] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showValues, setShowValues] = useState<Record<string, boolean>>({})

  React.useEffect(() => {
    if (currentProject) fetchEnvironments(currentProject.id)
  }, [currentProject])

  React.useEffect(() => {
    if (currentEnv) fetchVariables(currentEnv.id)
  }, [currentEnv])

  const handleCopy = async (text: string, id: string) => {
    await copyToClipboard(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleCreateEnv = () => {
    if (envName.trim() && currentProject) {
      createEnv({ projectId: currentProject.id, name: envName, icon: envIcon, color: envColor, description: '', isLocked: false, sortOrder: environments.length })
      setShowAddEnv(false)
      setEnvName('')
    }
  }

  const handleCreateVar = () => {
    if (varKey.trim() && currentEnv) {
      createVariable({ envId: currentEnv.id, key: varKey, value: varValue, description: varDesc, category: varCategory, tags: [], isSensitive, isPinned: false, isLocked: false, isRequired: false, defaultValue: '', expiresAt: null })
      setShowAddVar(false)
      setVarKey('')
      setVarValue('')
      setVarDesc('')
    }
  }

  const handleImport = () => {
    if (currentEnv && importText.trim()) {
      const vars = parseEnv(importText)
      importVariables(currentEnv.id, vars)
      setShowImport(false)
      setImportText('')
    }
  }

  const handleExport = (format: string) => {
    if (currentEnv) {
      const result = exportVariables(currentEnv.id, format)
      handleCopy(result, 'export')
    }
  }

  const filteredVars = variables.filter(v => 
    v.key.toLowerCase().includes(search.toLowerCase()) || 
    v.value.toLowerCase().includes(search.toLowerCase()) ||
    v.description.toLowerCase().includes(search.toLowerCase())
  )

  if (!currentProject) return null

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Environment Tabs */}
      <div className="flex gap-2 p-3 overflow-x-auto border-b border-[var(--border)] flex-shrink-0">
        {environments.map(env => (
          <button
            key={env.id}
            onClick={() => setCurrentEnv(env)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              currentEnv?.id === env.id ? 'text-[var(--bg-primary)]' : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
            }`}
            style={currentEnv?.id === env.id ? { backgroundColor: env.color } : {}}
          >
            <span>{env.icon}</span>
            <span>{env.name}</span>
            <button onClick={(e) => { e.stopPropagation(); deleteEnv(env.id) }} className="opacity-50 hover:opacity-100">×</button>
          </button>
        ))}
        <button onClick={() => setShowAddEnv(true)} className="px-3 py-2 rounded-xl text-xs bg-[var(--bg-tertiary)] text-[var(--text-muted)] active:bg-[var(--bg-hover)]">+</button>
      </div>

      {/* Variables List */}
      {currentEnv ? (
        <>
          <div className="p-3 border-b border-[var(--border)]">
            <div className="flex gap-2">
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="جستجو..." className="flex-1 p-2 rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--accent)]" />
              <button onClick={() => setShowAddVar(true)} className="px-3 py-2 rounded-lg bg-[var(--accent)] text-[var(--bg-primary)] text-xs font-bold">+</button>
              <button onClick={() => setShowImport(true)} className="px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-secondary)] text-xs">📥</button>
              <button onClick={() => setShowExport(true)} className="px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-secondary)] text-xs">📤</button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredVars.map(v => (
              <div key={v.id} className="p-3 border-b border-[var(--border)] active:bg-[var(--bg-tertiary)]">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[var(--accent)] font-bold">{v.key}</span>
                    {v.isSensitive && <span className="text-xs">🔒</span>}
                    {v.category !== 'custom' && <span className="px-1.5 py-0.5 rounded text-[10px] bg-[var(--bg-tertiary)] text-[var(--text-muted)]">{v.category}</span>}
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setShowValues({ ...showValues, [v.id]: !showValues[v.id] })} className="p-1 text-[var(--text-muted)]">
                      {showValues[v.id] ? '👁️' : '👁️‍🗨️'}
                    </button>
                    <button onClick={() => handleCopy(v.value, v.id)} className="p-1 text-[var(--text-muted)]">
                      {copiedId === v.id ? '✅' : '📋'}
                    </button>
                    <button onClick={() => deleteVariable(v.id)} className="p-1 text-[var(--text-muted)] active:text-[var(--danger)]">🗑️</button>
                  </div>
                </div>
                <p className={`text-xs ${showValues[v.id] ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'} font-mono`}>
                  {showValues[v.id] ? v.value : '••••••••'}
                </p>
                {v.description && <p className="text-[10px] text-[var(--text-muted)] mt-1">{v.description}</p>}
              </div>
            ))}
            {filteredVars.length === 0 && (
              <div className="p-8 text-center text-[var(--text-muted)]">
                <p className="text-3xl mb-2">📝</p>
                <p className="text-sm">متغیری وجود ندارد</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-[var(--text-muted)]">
          <div className="text-center">
            <p className="text-4xl mb-3">⚡</p>
            <p className="text-sm">یک Environment انتخاب کنید</p>
          </div>
        </div>
      )}

      {/* Add Environment Modal */}
      {showAddEnv && (
        <div className="fixed inset-0 bg-black/60 flex items-end justify-center z-[100] animate-fade-in" onClick={() => setShowAddEnv(false)}>
          <div className="bg-[var(--bg-secondary)] rounded-t-2xl w-full p-5 animate-slide-up" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-bold text-[var(--accent)] mb-4">Environment جدید</h3>
            <input value={envName} onChange={e => setEnvName(e.target.value)} placeholder="نام (مثلاً Production)" className="w-full p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] text-sm mb-4 focus:outline-none focus:border-[var(--accent)]" />
            <div className="mb-4">
              <label className="text-xs text-[var(--text-muted)] mb-2 block">آیکون</label>
              <div className="flex gap-2">{ENV_ICONS.map(i => <button key={i} onClick={() => setEnvIcon(i)} className={`w-10 h-10 rounded-lg text-lg flex items-center justify-center ${envIcon === i ? 'bg-[var(--accent-muted)] ring-2 ring-[var(--accent)]' : 'bg-[var(--bg-primary)]'}`}>{i}</button>)}</div>
            </div>
            <div className="mb-5">
              <label className="text-xs text-[var(--text-muted)] mb-2 block">رنگ</label>
              <div className="flex gap-2">{ENV_COLORS.map(c => <button key={c} onClick={() => setEnvColor(c)} className={`w-8 h-8 rounded-full ${envColor === c ? 'ring-2 ring-[var(--accent)] ring-offset-2 ring-offset-[var(--bg-secondary)]' : ''}`} style={{ backgroundColor: c }} />)}</div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleCreateEnv} className="flex-1 py-3 rounded-xl bg-[var(--accent)] text-[var(--bg-primary)] font-bold text-sm">ایجاد</button>
              <button onClick={() => setShowAddEnv(false)} className="flex-1 py-3 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] text-sm">انصراف</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Variable Modal */}
      {showAddVar && (
        <div className="fixed inset-0 bg-black/60 flex items-end justify-center z-[100] animate-fade-in" onClick={() => setShowAddVar(false)}>
          <div className="bg-[var(--bg-secondary)] rounded-t-2xl w-full p-5 animate-slide-up" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-bold text-[var(--accent)] mb-4">متغیر جدید</h3>
            <input value={varKey} onChange={e => setVarKey(e.target.value)} placeholder="KEY" className="w-full p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] text-sm mb-3 font-mono focus:outline-none focus:border-[var(--accent)]" />
            <input value={varValue} onChange={e => setVarValue(e.target.value)} placeholder="value" className="w-full p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] text-sm mb-3 font-mono focus:outline-none focus:border-[var(--accent)]" />
            <input value={varDesc} onChange={e => setVarDesc(e.target.value)} placeholder="توضیحات (اختیاری)" className="w-full p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] text-sm mb-3 focus:outline-none focus:border-[var(--accent)]" />
            <div className="mb-4">
              <label className="text-xs text-[var(--text-muted)] mb-2 block">دسته‌بندی</label>
              <div className="flex flex-wrap gap-2">{['api_key', 'database', 'auth', 'email', 'storage', 'custom'].map(c => <button key={c} onClick={() => setVarCategory(c)} className={`px-3 py-1.5 rounded-lg text-xs ${varCategory === c ? 'bg-[var(--accent)] text-[var(--bg-primary)]' : 'bg-[var(--bg-primary)] text-[var(--text-secondary)]'}`}>{c}</button>)}</div>
            </div>
            <label className="flex items-center gap-2 mb-5 text-sm text-[var(--text-secondary)]">
              <input type="checkbox" checked={isSensitive} onChange={e => setIsSensitive(e.target.checked)} className="accent-[var(--accent)]" />
              🔒 مقدار حساس
            </label>
            <div className="flex gap-3">
              <button onClick={handleCreateVar} className="flex-1 py-3 rounded-xl bg-[var(--accent)] text-[var(--bg-primary)] font-bold text-sm">ذخیره</button>
              <button onClick={() => setShowAddVar(false)} className="flex-1 py-3 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] text-sm">انصراف</button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {showImport && (
        <div className="fixed inset-0 bg-black/60 flex items-end justify-center z-[100] animate-fade-in" onClick={() => setShowImport(false)}>
          <div className="bg-[var(--bg-secondary)] rounded-t-2xl w-full p-5 animate-slide-up" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-bold text-[var(--accent)] mb-4">وارد کردن از .env</h3>
            <textarea value={importText} onChange={e => setImportText(e.target.value)} placeholder={"API_KEY=your_key\nDB_HOST=localhost\nDB_PORT=5432"} className="w-full p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] text-sm mb-4 h-40 font-mono focus:outline-none focus:border-[var(--accent)]" dir="ltr" />
            <div className="flex gap-3">
              <button onClick={handleImport} className="flex-1 py-3 rounded-xl bg-[var(--accent)] text-[var(--bg-primary)] font-bold text-sm">وارد کردن</button>
              <button onClick={() => setShowImport(false)} className="flex-1 py-3 rounded-xl border border-[var(--border)] text-[var(--text-secondary)] text-sm">انصراف</button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExport && (
        <div className="fixed inset-0 bg-black/60 flex items-end justify-center z-[100] animate-fade-in" onClick={() => setShowExport(false)}>
          <div className="bg-[var(--bg-secondary)] rounded-t-2xl w-full p-5 animate-slide-up" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-bold text-[var(--accent)] mb-4">خروجی‌گیری</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'env', label: '.env', icon: '📄' },
                { id: 'export', label: 'export', icon: '🐚' },
                { id: 'json', label: 'JSON', icon: '📋' },
                { id: 'docker', label: 'Docker', icon: '🐳' },
                { id: 'k8s', label: 'Kubernetes', icon: '☸️' },
              ].map(f => (
                <button key={f.id} onClick={() => handleExport(f.id)} className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border)] active:border-[var(--accent)] text-center">
                  <span className="text-2xl block mb-2">{f.icon}</span>
                  <span className="text-xs font-medium">{f.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
