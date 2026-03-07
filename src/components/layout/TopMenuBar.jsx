import React from 'react'
import { useStore } from '../../store/useStore'

const OPTIONS = [
  'ArrayList',
  'Singly Linked List',
  'Doubly Linked List',
  'Stack',
  'Queue',
  'Trees - BST',
  'Trees - AVL',
  'Trees - Splay',
  'Trees - Red-Black',
  'Trees - B-Tree',
  'Heaps',
  'Hash',
  'Graphs',
]

export default function TopMenu() {
  const selectedStructure = useStore((s) => s.selectedStructure)
  const setStructure = useStore((s) => s.setStructure)
  const isDarkMode = useStore((s) => s.isDarkMode)
  const toggleDarkMode = useStore((s) => s.toggleDarkMode)

  return (
    <div className="flex items-center justify-between w-full p-1.5 md:p-3 bg-slate-50 border-b">
      <div className="flex items-center gap-2 md:gap-4 md:ml-4">
        <div className="font-semibold text-sm md:text-base ml-2 md:ml-0 hidden sm:block">DSAssist</div>
        <select
          value={selectedStructure}
          onChange={(e) => setStructure(e.target.value)}
          className="px-2 py-1 md:px-3 md:py-1 text-sm md:text-base border rounded shadow-sm bg-white"
        >
          {OPTIONS.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        {/* Quiz Button Trigger */}
      <button 
        onClick={() => useStore.getState().setIsQuizOpen(true)}
        className="ml-2 md:ml-4 px-4 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded shadow-sm transition-colors flex items-center gap-2"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12h.01"/><path d="M15 12h.01"/><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/><path d="M12 2c5.5 0 10 4.5 10 10s-4.5 10-10 10S2 17.5 2 12 6.5 2 12 2z"/></svg>
        Take Quiz
      </button>
      {/* Dark Mode Toggle Switch */}
      <button 
        onClick={toggleDarkMode}
        className={`ml-auto flex items-center gap-2 px-3 py-1.5 md:px-3 md:py-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${
          isDarkMode ? "text-slate-300" : "text-slate-900"
        }`}
        title="Toggle Dark Mode"
      >
        {isDarkMode ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
        )}

        <span className="text-sm font-medium">Mode</span>
      </button>
      </div>
    </div>
  )
}
