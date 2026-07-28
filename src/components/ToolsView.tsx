import React, { useState } from 'react'
import { generateUUID, generateNanoId, generateSecret, generateApiKey, generatePassword, toBase64, fromBase64, encodeURL, decodeURL, hashString, timestampToDate, dateToTimestamp, caseConverters, testApi } from '@/utils/tools'
import { copyToClipboard } from '@/utils/tools'

const TOOLS = [
  { id: 'uuid', icon: '🆔', label: 'UUID Generator' },
  { id: 'nanoid', icon: '🔑', label: 'Nano ID' },
  { id: 'secret', icon: '🔐', label: 'Secret Generator' },
  { id: 'apikey', icon: '⚡', label: 'API Key' },
  { id: 'password', icon: '🔒', label: 'Password' },
  { id: 'base64', icon: '📝', label: 'Base64' },
  { id: 'url', icon: '🔗', label: 'URL Encode' },
  { id: 'hash', icon: '#️⃣', label: 'Hash' },
  { id: 'timestamp', icon: '⏰', label: 'Timestamp' },
  { id: 'case', icon: '🔤', label: 'Case Converter' },
  { id: 'api', icon: '🌐', label: 'API Tester' },
  { id: 'jwt', icon: '🎫', label: 'JWT Decoder' },
]

export default function ToolsView() {
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const [result, setResult] = useState('')
  const [input, setInput] = useState('')
  const [copied, setCopied] = useState(false)
  const [apiMethod, setApiMethod] = useState('GET')
  const [apiUrl, setApiUrl] = useState('')
  const [apiResult, setApiResult] = useState<any>(null)

  const handleCopy = async (text: string) => {
    await copyToClipboard(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const generate = (type: string) => {
    let res = ''
    switch (type) {
      case 'uuid': res = generateUUID(); break
      case 'nanoid': res = generateNanoId(); break
      case 'secret': res = generateSecret(); break
      case 'apikey': res = generateApiKey(); break
      case 'password': res = generatePassword(); break
      case 'base64enc': res = toBase64(input); break
      case 'base64dec': res = fromBase64(input); break
      case 'urlencode': res = encodeURL(input); break
      case 'urldecode': res = decodeURL(input); break
      case 'timestamp': res = timestampToDate(Number(input)); break
      case 'datetotimestamp': res = String(dateToTimestamp(input)); break
      case 'upper': res = caseConverters.upper(input); break
      case 'lower': res = caseConverters.lower(input); break
      case 'camel': res = caseConverters.camel(input); break
      case 'snake': res = caseConverters.snake(input); break
      case 'kebab': res = caseConverters.kebab(input); break
      case 'pascal': res = caseConverters.pascal(input); break
    }
    setResult(res)
  }

  const handleHash = async (algo: string) => {
    const res = await hashString(input, algo as any)
    setResult(res)
  }

  const handleApiTest = async () => {
    try {
      const res = await testApi({ id: '', name: '', method: apiMethod, url: apiUrl, headers: {}, body: '', bodyType: 'json', auth: { type: 'none', token: '' } })
      setApiResult(res)
    } catch (e: any) {
      setApiResult({ error: e.message })
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-4">
      {!activeTool ? (
        <div className="grid grid-cols-3 gap-3">
          {TOOLS.map(tool => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className="p-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border)] active:border-[var(--accent)] transition-all text-center"
            >
              <span className="text-2xl block mb-2">{tool.icon}</span>
              <span className="text-xs font-medium text-[var(--text-secondary)]">{tool.label}</span>
            </button>
          ))}
        </div>
      ) : (
        <div>
          <button onClick={() => { setActiveTool(null); setResult(''); setInput('') }} className="flex items-center gap-2 text-sm text-[var(--text-muted)] mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            بازگشت
          </button>

          {/* UUID, NanoID, Secret, APIKey, Password */}
          {['uuid', 'nanoid', 'secret', 'apikey', 'password'].includes(activeTool) && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[var(--accent)]">{TOOLS.find(t => t.id === activeTool)?.label}</h3>
              <button onClick={() => generate(activeTool)} className="w-full py-3 rounded-xl bg-[var(--accent)] text-[var(--bg-primary)] font-bold text-sm">تولید</button>
              {result && (
                <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                  <p className="font-mono text-sm break-all mb-3" dir="ltr">{result}</p>
                  <button onClick={() => handleCopy(result)} className="w-full py-2 rounded-lg bg-[var(--bg-tertiary)] text-xs">{copied ? '✅ کپی شد' : '📋 کپی'}</button>
                </div>
              )}
            </div>
          )}

          {/* Base64, URL, Case */}
          {['base64', 'url', 'case'].includes(activeTool) && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[var(--accent)]">{TOOLS.find(t => t.id === activeTool)?.label}</h3>
              <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="متن ورودی..." className="w-full p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-sm h-32 focus:outline-none focus:border-[var(--accent)]" />
              <div className="grid grid-cols-2 gap-2">
                {activeTool === 'base64' && (<>
                  <button onClick={() => generate('base64enc')} className="py-2 rounded-lg bg-[var(--accent)] text-[var(--bg-primary)] text-xs font-bold">Encode</button>
                  <button onClick={() => generate('base64dec')} className="py-2 rounded-lg bg-[var(--bg-tertiary)] text-xs">Decode</button>
                </>)}
                {activeTool === 'url' && (<>
                  <button onClick={() => generate('urlencode')} className="py-2 rounded-lg bg-[var(--accent)] text-[var(--bg-primary)] text-xs font-bold">Encode</button>
                  <button onClick={() => generate('urldecode')} className="py-2 rounded-lg bg-[var(--bg-tertiary)] text-xs">Decode</button>
                </>)}
                {activeTool === 'case' && (<>
                  <button onClick={() => generate('upper')} className="py-2 rounded-lg bg-[var(--bg-tertiary)] text-xs">UPPER</button>
                  <button onClick={() => generate('lower')} className="py-2 rounded-lg bg-[var(--bg-tertiary)] text-xs">lower</button>
                  <button onClick={() => generate('camel')} className="py-2 rounded-lg bg-[var(--bg-tertiary)] text-xs">camelCase</button>
                  <button onClick={() => generate('snake')} className="py-2 rounded-lg bg-[var(--bg-tertiary)] text-xs">snake_case</button>
                  <button onClick={() => generate('kebab')} className="py-2 rounded-lg bg-[var(--bg-tertiary)] text-xs">kebab-case</button>
                  <button onClick={() => generate('pascal')} className="py-2 rounded-lg bg-[var(--bg-tertiary)] text-xs">PascalCase</button>
                </>)}
              </div>
              {result && (
                <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                  <p className="font-mono text-sm break-all mb-3" dir="ltr">{result}</p>
                  <button onClick={() => handleCopy(result)} className="w-full py-2 rounded-lg bg-[var(--bg-tertiary)] text-xs">{copied ? '✅ کپی شد' : '📋 کپی'}</button>
                </div>
              )}
            </div>
          )}

          {/* Hash */}
          {activeTool === 'hash' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[var(--accent)]">Hash Generator</h3>
              <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="متن ورودی..." className="w-full p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-sm h-32 focus:outline-none focus:border-[var(--accent)]" />
              <div className="grid grid-cols-2 gap-2">
                {['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'].map(algo => (
                  <button key={algo} onClick={() => handleHash(algo)} className="py-2 rounded-lg bg-[var(--bg-tertiary)] text-xs">{algo}</button>
                ))}
              </div>
              {result && (
                <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                  <p className="font-mono text-xs break-all mb-3" dir="ltr">{result}</p>
                  <button onClick={() => handleCopy(result)} className="w-full py-2 rounded-lg bg-[var(--bg-tertiary)] text-xs">{copied ? '✅ کپی شد' : '📋 کپی'}</button>
                </div>
              )}
            </div>
          )}

          {/* Timestamp */}
          {activeTool === 'timestamp' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[var(--accent)]">Timestamp Converter</h3>
              <input value={input} onChange={e => setInput(e.target.value)} placeholder="Timestamp یا تاریخ" className="w-full p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--accent)]" />
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => generate('timestamp')} className="py-2 rounded-lg bg-[var(--accent)] text-[var(--bg-primary)] text-xs font-bold">Timestamp → Date</button>
                <button onClick={() => generate('datetotimestamp')} className="py-2 rounded-lg bg-[var(--bg-tertiary)] text-xs">Date → Timestamp</button>
              </div>
              {result && (
                <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                  <p className="font-mono text-sm break-all" dir="ltr">{result}</p>
                  <button onClick={() => handleCopy(result)} className="w-full py-2 rounded-lg bg-[var(--bg-tertiary)] text-xs mt-3">{copied ? '✅ کپی شد' : '📋 کپی'}</button>
                </div>
              )}
            </div>
          )}

          {/* API Tester */}
          {activeTool === 'api' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[var(--accent)]">API Tester</h3>
              <div className="flex gap-2">
                <select value={apiMethod} onChange={e => setApiMethod(e.target.value)} className="px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-xs">
                  {['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].map(m => <option key={m}>{m}</option>)}
                </select>
                <input value={apiUrl} onChange={e => setApiUrl(e.target.value)} placeholder="https://api.example.com" className="flex-1 p-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-sm focus:outline-none focus:border-[var(--accent)]" dir="ltr" />
              </div>
              <button onClick={handleApiTest} className="w-full py-3 rounded-xl bg-[var(--accent)] text-[var(--bg-primary)] font-bold text-sm">ارسال</button>
              {apiResult && (
                <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                  {apiResult.error ? (
                    <p className="text-red-400 text-sm">{apiResult.error}</p>
                  ) : (
                    <>
                      <div className="flex gap-3 mb-3 text-xs">
                        <span className={`px-2 py-1 rounded ${apiResult.status < 400 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{apiResult.status} {apiResult.statusText}</span>
                        <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400">{apiResult.time}ms</span>
                        <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-400">{apiResult.size}B</span>
                      </div>
                      <pre className="font-mono text-xs overflow-x-auto max-h-60 overflow-y-auto" dir="ltr">{(() => { try { return JSON.stringify(JSON.parse(apiResult.body), null, 2) } catch { return apiResult.body } })()}</pre>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {/* JWT Decoder */}
          {activeTool === 'jwt' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[var(--accent)]">JWT Decoder</h3>
              <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="eyJhbGciOiJIUzI1NiIs..." className="w-full p-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)] text-sm h-32 font-mono focus:outline-none focus:border-[var(--accent)]" dir="ltr" />
              <button onClick={() => {
                try {
                  const parts = input.split('.')
                  const header = JSON.parse(atob(parts[0]))
                  const payload = JSON.parse(atob(parts[1]))
                  setResult(JSON.stringify({ header, payload }, null, 2))
                } catch { setResult('JWT نامعتبر') }
              }} className="w-full py-3 rounded-xl bg-[var(--accent)] text-[var(--bg-primary)] font-bold text-sm">Decode</button>
              {result && (
                <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                  <pre className="font-mono text-xs overflow-x-auto" dir="ltr">{result}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
