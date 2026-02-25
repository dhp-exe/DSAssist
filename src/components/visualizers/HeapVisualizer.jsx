import React, { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/useStore'
import { AnimatedEdge, AnimatedNode } from './AnimatedTreeElements'

export default function HeapVisualizer() {
  const data = useStore((s) => s.data)
  const hIndices = useStore((s) => s.highlightIndices)
  const hType = useStore((s) => s.highlightType)
  
  const containerRef = useRef(null)
  const [width, setWidth] = useState(800)

  useEffect(() => {
    if (containerRef.current) {
      setWidth(Math.max(800, containerRef.current.clientWidth))
    }
  }, [])

  // Determines color highlights based on action
  const getHighlightClass = (idx) => {
    if (!hIndices.includes(idx)) return 'bg-white border-slate-300 text-slate-700'
    if (hType === 'compare') return 'bg-yellow-100 border-yellow-500 text-yellow-800 ring-4 ring-yellow-200 z-20'
    if (hType === 'swap') return 'bg-rose-100 border-rose-500 text-rose-800 ring-4 ring-rose-200 z-20'
    if (hType === 'insert') return 'bg-emerald-100 border-emerald-500 text-emerald-800 ring-4 ring-emerald-200 z-20'
    if (hType === 'pop') return 'bg-slate-200 border-slate-800 text-slate-400 opacity-50 z-20 scale-90'
    return 'bg-white border-slate-300'
  }

  const getTreeLayout = () => {
    const nodes = []
    const edges = []
    const levelHeight = 70

    const traverse = (idx, depth, leftBound, rightBound) => {
        if (idx >= data.length) return null
        
        const x = leftBound + (rightBound - leftBound) / 2
        const y = depth * levelHeight + 30 
        
        nodes.push({ id: `h-${idx}`, value: data[idx], x, y, idx })

        const leftIdx = 2 * idx + 1
        const rightIdx = 2 * idx + 2

        if (leftIdx < data.length) {
            const leftPos = traverse(leftIdx, depth + 1, leftBound, x)
            edges.push({ id: `e-${idx}-${leftIdx}`, x1: x, y1: y, x2: leftPos.x, y2: leftPos.y })
        }
        if (rightIdx < data.length) {
            const rightPos = traverse(rightIdx, depth + 1, x, rightBound)
            edges.push({ id: `e-${idx}-${rightIdx}`, x1: x, y1: y, x2: rightPos.x, y2: rightPos.y })
        }

        return { x, y }
    }

    if (data.length > 0) traverse(0, 0, 0, width)
    return { nodes, edges }
  }

  const { nodes, edges } = getTreeLayout()

  return (
    <div className="h-full w-full flex flex-col p-4 bg-slate-50 overflow-hidden">
      
      {/* Top: Array Representation */}
      <div className="flex-none mb-6">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 text-center">Array Representation</div>
        <div className="flex justify-center overflow-x-auto pb-4 px-2">
            <AnimatePresence mode="popLayout">
                {data.map((val, i) => (
                    <motion.div 
                        key={`arr-${val}-${i}`} // Include value in key to trick framer into swapping nicely
                        layout
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="flex flex-col items-center mx-[2px]"
                    >
                        <div className={`w-12 h-12 border-2 flex items-center justify-center font-bold shadow-sm transition-colors ${getHighlightClass(i)}`}>
                            {val}
                        </div>
                        <div className={`text-xs mt-1 font-mono ${hIndices.includes(i) ? 'text-indigo-600 font-bold' : 'text-slate-400'}`}>{i}</div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
      </div>

      <hr className="border-slate-200 mb-4" />

      {/* Bottom: Tree Representation */}
      <div className="flex-1 relative overflow-auto" ref={containerRef}>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest absolute top-2 left-2 z-10">Tree Representation</div>
        
        {data.length === 0 && <div className="absolute inset-0 flex items-center justify-center text-slate-400">Empty Heap</div>}

        <svg className="absolute top-0 left-0 pointer-events-none z-0" style={{ width, height: Math.max(600, nodes.length > 0 ? Math.max(...nodes.map(n => n.y)) + 100 : 0) }}>
          {edges.map((e) => (<AnimatedEdge key={e.id} edge={e} />))}
        </svg>

        <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
          {nodes.map((n) => {
            const bgClass = getHighlightClass(n.idx) + ' rounded-full'
            return <AnimatedNode key={`node-${n.idx}`} node={n} bgClass={bgClass} />
          })}
        </div>
      </div>
    </div>
  )
}