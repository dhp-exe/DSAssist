import React, { useRef, useEffect } from 'react'
import { useStore } from '../../store/useStore'

export default function LogsPanel() {
  const logs = useStore((s) => s.logs)
  const clearLogs = useStore((s) => s.clearLogs)
  const ref = useRef()

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight
  }, [logs])

  return (
    <div className="p-3 h-full flex flex-col">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold">Logs</div>
        <button className="text-sm text-red-600" onClick={clearLogs}>
          Clear
        </button>
      </div>
      <div ref={ref} className="bg-slate-50 border rounded p-2 flex-1 overflow-auto text-sm">
        {logs.length === 0 ? (
          <div className="text-slate-500">No logs yet.</div>
        ) : (
          logs.map((l, i) => (
            <div key={i} className="mb-1 whitespace-pre-wrap">
              {l}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
