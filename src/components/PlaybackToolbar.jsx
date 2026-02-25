import React, { useEffect } from 'react'
import { useStore } from '../store/useStore'

export default function PlaybackToolbar() {
  const playing = useStore((s) => s.playing)
  const speedMs = useStore((s) => s.speedMs)
  const setPlaying = useStore((s) => s.setPlaying)
  const setSpeed = useStore((s) => s.setSpeed)
  
  const stepForward = useStore((s) => s.stepForward)
  const stepBack = useStore((s) => s.stepBack)
  const replay = useStore((s) => s.replay)
  const clearData = useStore((s) => s.clearData)
  
  const currentFrame = useStore((s) => s.currentFrame)
  const frames = useStore((s) => s.frames)
  const isGeneratingFrames = useStore((s) => s.isGeneratingFrames)
  const latestOperation = useStore((s) => s.latestOperation)

  // Autoplay engine
  useEffect(() => {
    if (!playing || frames.length === 0 || isGeneratingFrames) return
    const id = setInterval(() => {
      stepForward()
    }, speedMs)
    return () => clearInterval(id)
  }, [playing, speedMs, stepForward, frames.length, isGeneratingFrames])

  const totalFrames = frames.length;

  return (
    <div className="p-3 flex items-center gap-3 bg-white border-b shadow-sm z-50">
      
      {/* Primary Play/Pause Control */}
      <button
        onClick={() => setPlaying(!playing)}
        disabled={isGeneratingFrames || totalFrames === 0}
        className="px-4 py-1.5 rounded bg-blue-600 text-white font-semibold disabled:opacity-50 min-w-[80px] shadow-sm transition-colors"
      >
        {playing ? 'Pause' : 'Play'}
      </button>

      {/* Step by Step Operations */}
      <div className="flex bg-slate-100 rounded border border-slate-200 p-0.5">
          <button onClick={stepBack} disabled={isGeneratingFrames || totalFrames === 0 || currentFrame === 0} className="px-3 py-1 rounded text-slate-700 hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent transition-all">
              <span className="mr-1">«</span> Step Back
          </button>
          <button onClick={stepForward} disabled={isGeneratingFrames || totalFrames === 0 || currentFrame >= totalFrames - 1} className="px-3 py-1 rounded text-slate-700 hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent transition-all">
              Step Fwd <span className="ml-1">»</span>
          </button>
      </div>
      
      {/* History and Data Operations */}
      <button onClick={replay} disabled={isGeneratingFrames || !latestOperation} className="px-3 py-1.5 rounded disabled:opacity-50 bg-indigo-50 text-indigo-700 border border-indigo-200 font-medium ml-2">Replay</button>
      <button onClick={clearData} disabled={isGeneratingFrames} className="px-3 py-1.5 rounded disabled:opacity-50 bg-rose-50 text-rose-700 border border-rose-200 font-medium">Clear</button>

      {/* Speed Control */}
      <div className="ml-auto text-sm text-slate-600 font-medium flex items-center gap-2">
        <span>Speed:</span>
        <input
            type="range"
            min="100"
            max="1500"
            value={speedMs}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="w-24 accent-blue-600"
            disabled={isGeneratingFrames}
        />
        <span className="text-slate-500 w-10 text-right">{(speedMs / 1000).toFixed(1)}s</span>
      </div>

      {/* Scrubbing & Progress */}
      {totalFrames > 0 && !isGeneratingFrames && (
          <div className="ml-4 flex items-center gap-2 pl-4 border-l">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Progress</div>
              <input 
                  type="range" 
                  min="0" 
                  max={totalFrames - 1} 
                  value={currentFrame} 
                  onChange={(e) => {
                      setPlaying(false);
                      const frame = Number(e.target.value);
                      useStore.getState()._applyFrame(frames[frame]);
                      useStore.setState({ currentFrame: frame, isAnimating: frame < frames.length - 1 });
                  }}
                  className="w-32 accent-indigo-500 cursor-pointer"
              />
              <div className="text-xs text-slate-500 font-mono w-12 text-right">{currentFrame + 1} / {totalFrames}</div>
          </div>
      )}
      
      {isGeneratingFrames && (
          <div className="ml-4 text-xs text-indigo-600 font-semibold animate-pulse uppercase tracking-widest pl-4 border-l">Building Animation...</div>
      )}
    </div>
  )
}