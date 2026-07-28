const DB_KEY = 'envkar-db'

interface DBData {
  projects: any[]
  environments: any[]
  variables: any[]
  apiHistory: any[]
  settings: Record<string, string>
}

const defaultDB: DBData = {
  projects: [],
  environments: [],
  variables: [],
  apiHistory: [],
  settings: { theme: 'dark', defaultFont: 'Vazirmatn', fontSize: '14' }
}

export const getDB = (): DBData => {
  try {
    const data = localStorage.getItem(DB_KEY)
    if (data) return { ...defaultDB, ...JSON.parse(data) }
  } catch {}
  return { ...defaultDB }
}

export const saveDB = (db: Partial<DBData>) => {
  const current = getDB()
  const merged = { ...current, ...db }
  localStorage.setItem(DB_KEY, JSON.stringify(merged))
}

export const getSetting = (key: string, defaultValue: string = ''): string => {
  return getDB().settings[key] || defaultValue
}

export const setSetting = (key: string, value: string) => {
  const db = getDB()
  db.settings[key] = value
  saveDB(db)
}
