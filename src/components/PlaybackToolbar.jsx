import React, { useEffect } from 'react'
import { useStore } from '../store/useStore'

export default function PlaybackToolbar() {
  const playing = useStore((s) => s.playing)
  const speedMs = useStore((s) => s.speedMs)
  const setPlaying = useStore((s) => s.setPlaying)
  const setSpeed = useStore((s) => s.setSpeed)
  const stepForward = useStore((s) => s.stepForward)
  const stepBack = useStore((s) => s.stepBack)
  const resetPlayback = useStore((s) => s.resetPlayback)
  const dataLen = useStore((s) => s.data.length)

  // interval effect
  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => {
      stepForward()
    }, speedMs)
    return () => clearInterval(id)
  }, [playing, speedMs, stepForward])

  return (
    <div className="p-3 flex items-center gap-3 bg-white border-b">
      <button
        onClick={() => setPlaying(!playing)}
        className="px-3 py-1 rounded bg-blue-600 text-white"
      >
        {playing ? 'Pause' : 'Play'}
      </button>

      <button onClick={stepBack} className="px-3 py-1 border rounded">Step</button>
      <button onClick={stepForward} className="px-3 py-1 border rounded">Next</button>
      <button onClick={resetPlayback} className="px-3 py-1 border rounded">Reset</button>

      <div className="ml-4 text-sm text-slate-600">Speed</div>
      <input
        type="range"
        min="100"
        max="1500"
        value={speedMs}
        onChange={(e) => setSpeed(Number(e.target.value))}
        className="w-40"
      />

      <div className="text-sm text-slate-500">{(speedMs / 1000).toFixed(2)}s</div>

      <div className="ml-auto text-xs text-slate-500">Steps: {dataLen}</div>
    </div>
  )
}
