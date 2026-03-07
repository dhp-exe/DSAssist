import React, { useState } from 'react'
import TopMenu from './components/layout/TopMenuBar'
import ControlPanel from './components/layout/LeftControlPanel'
import LogsPanel from './components/layout/RightLogPanel'
import MainView from './components/layout/MainView'
import { Analytics } from "@vercel/analytics/react"

export default function App() {
  const [leftOpen, setLeftOpen] = useState(true)
  const [rightOpen, setRightOpen] = useState(false)

  return (
    <>
      {/* Mobile Portrait Overlay: Forces user to rotate phone */}
      <div className="fixed inset-0 z-[9999] bg-slate-900 text-white flex-col items-center justify-center p-6 text-center hidden max-md:portrait:flex">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-6 animate-bounce">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
          <path d="M12 18h.01"></path>
        </svg>
        <h2 className="text-2xl font-bold mb-2">Please Rotate Your Device</h2>
        <p className="text-slate-400 text-sm">This visualizer requires a landscape view on mobile screens.</p>
      </div>

      {/* Main App: Hides on mobile portrait */}
      <div className="h-screen w-full flex flex-col max-md:portrait:hidden">
        <TopMenu />
        <div className="flex flex-1 overflow-hidden">
          
          {/* Left Panel */}
          <div className={`transition-all duration-200 ${leftOpen ? 'w-56 md:w-72' : 'w-12 md:w-24'} bg-white border-r h-full flex flex-col shrink-0`}>
            <div className="flex items-center justify-between p-2 border-b shrink-0 cursor-pointer md:cursor-auto" onClick={() => window.innerWidth < 768 && setLeftOpen(!leftOpen)}>
              <div className={`text-sm font-medium ${!leftOpen ? 'hidden md:block' : ''}`}>Controls</div>
              <button className="text-slate-600 px-1 md:px-2" onClick={(e) => { e.stopPropagation(); setLeftOpen(!leftOpen) }}>{leftOpen ? '«' : '»'}</button>
            </div>
            <div className={`flex-1 overflow-auto ${!leftOpen ? 'hidden md:block' : ''}`}>
              {leftOpen && <ControlPanel />}
            </div>
          </div>

          {/* Center */}
          <div className="flex-1 bg-slate-100 h-full overflow-hidden">
            <MainView />
          </div>

          {/* Right Panel */}
          <div className={`transition-all duration-200 ${rightOpen ? 'w-48 md:w-60' : 'w-12 md:w-20'} bg-white border-l h-full flex flex-col shrink-0`}>
            <div className="flex items-center justify-between p-2 border-b shrink-0 cursor-pointer md:cursor-auto" onClick={() => window.innerWidth < 768 && setRightOpen(!rightOpen)}>
              <div className={`text-sm font-medium ${!rightOpen ? 'hidden md:block' : ''}`}>Logs</div>
              <button className="text-slate-600 px-1 md:px-2" onClick={(e) => { e.stopPropagation(); setRightOpen(!rightOpen) }}>{rightOpen ? '»' : '«'}</button>
            </div>
            <div className={`flex-1 overflow-auto ${!rightOpen ? 'hidden md:block' : ''}`}>
              {rightOpen && <LogsPanel />}
            </div>
          </div>

        </div>
      </div>
      {/* Vercel Analytics */}
      <Analytics />
    </>
  )
}