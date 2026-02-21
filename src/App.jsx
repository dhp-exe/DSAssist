import React, { useState } from 'react'
import TopMenu from './components/layout/TopMenuBar'
import ControlPanel from './components/layout/LeftControlPanel'
import LogsPanel from './components/layout/RightLogPanel'
import MainView from './components/layout/MainView'

export default function App() {
  const [leftOpen, setLeftOpen] = useState(true)
  const [rightOpen, setRightOpen] = useState(false)

  return (
    <div className="h-screen flex flex-col">
      <TopMenu />
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div className={`transition-all duration-200 ${leftOpen ? 'w-72' : 'w-24'} bg-white border-r h-full` }>
          <div className="flex items-center justify-between p-2 border-b">
            <div className="text-sm font-medium">Controls</div>
            <button className="text-slate-600" onClick={() => setLeftOpen(!leftOpen)}>{leftOpen ? '«' : '»'}</button>
          </div>
          {leftOpen && <ControlPanel />}
        </div>

        {/* Center */}
        <div className="flex-1 bg-slate-100 h-full">
          <MainView />
        </div>

        {/* Right Panel */}
        <div className={`${rightOpen ? 'w-60' : 'w-20'} bg-white border-l h-full transition-all duration-200`}>
          <div className="flex items-center justify-between p-2 border-b">
            <div className="text-sm font-medium">Logs</div>
            <button className="text-slate-600" onClick={() => setRightOpen(!rightOpen)}>{rightOpen ? '»' : '«'}</button>
          </div>
          {rightOpen && <LogsPanel />}
        </div>
      </div>
    </div>
  )
}
