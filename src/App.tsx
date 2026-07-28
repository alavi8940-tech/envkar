import React, { useEffect, useState } from 'react'
import { getSetting } from '@/utils/storage'
import { useProjectStore } from '@/stores/projectStore'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import DashboardView from './components/DashboardView'
import ProjectsView from './components/ProjectsView'
import EnvsView from './components/EnvsView'
import ToolsView from './components/ToolsView'
import SettingsView from './components/SettingsView'

export default function App() {
  const { currentProject } = useProjectStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeView, setActiveView] = useState('dashboard')

  useEffect(() => {
    const theme = getSetting('theme', 'dark')
    document.documentElement.setAttribute('data-theme', theme)
    const fontSize = getSetting('fontSize', '14')
    document.documentElement.style.fontSize = fontSize + 'px'
  }, [])

  const getTitle = () => {
    switch (activeView) {
      case 'dashboard': return 'داشبورد'
      case 'projects': return 'پروژه‌ها'
      case 'envs': return currentProject?.name || 'Environment ها'
      case 'tools': return 'ابزارها'
      case 'settings': return 'تنظیمات'
      default: return 'ENV کار'
    }
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard': return <DashboardView />
      case 'projects': return <ProjectsView />
      case 'envs': return <EnvsView />
      case 'tools': return <ToolsView />
      case 'settings': return <SettingsView />
      default: return <DashboardView />
    }
  }

  return (
    <div className="h-[100dvh] flex flex-col bg-[var(--bg-primary)] overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} activeView={activeView} onViewChange={setActiveView} />
      <TopBar
        title={getTitle()}
        subtitle={activeView === 'envs' ? `${currentProject?.icon} ${currentProject?.name}` : undefined}
        onMenuClick={() => setSidebarOpen(true)}
        onBack={activeView === 'envs' ? () => setActiveView('projects') : undefined}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        {renderView()}
      </main>
    </div>
  )
}
