import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/useStore'

export default function HashVisualizer() {
    const isGeneratingFrames = useStore((s) => s.isGeneratingFrames)
    const rawTable = useStore((s) => s.hashTable)
    const rawMode = useStore((s) => s.hashMode)
    const rawStaged = useStore((s) => s.stagedHashValue)

    const hIndices = useStore((s) => s.highlightIndices)
    const hType = useStore((s) => s.highlightType)

    // Flash-prevention Cache
    const cache = React.useRef({ table: rawTable, mode: rawMode, staged: rawStaged })
    if (!isGeneratingFrames) {
        cache.current = { table: rawTable, mode: rawMode, staged: rawStaged }
    }
    const hashTable = isGeneratingFrames ? cache.current.table : rawTable
    const hashMode = isGeneratingFrames ? cache.current.mode : rawMode
    const stagedHashValue = isGeneratingFrames ? cache.current.staged : rawStaged

    const getHighlightClass = (idx) => {
        if (!hIndices.includes(idx)) return 'border-slate-300 bg-white text-slate-700'
        if (hType === 'probe') return 'bg-yellow-100 border-yellow-500 text-yellow-800 ring-4 ring-yellow-200 z-20 scale-105 shadow-md'
        if (hType === 'insert') return 'bg-emerald-100 border-emerald-500 text-emerald-800 ring-4 ring-emerald-200 z-20 scale-110 shadow-md'
        if (hType === 'delete') return 'bg-rose-100 border-rose-500 text-rose-800 ring-4 ring-rose-200 z-20 scale-105 shadow-md'
        if (hType === 'error') return 'bg-red-100 border-red-500 text-red-800 ring-4 ring-red-200 z-20'
        return 'border-slate-300 bg-white'
    }

    return (
        <div className="h-full w-full flex p-8 bg-slate-50 overflow-auto">
            
            {/* Left Panel: Staging Area */}
            <div className="w-1/4 flex flex-col items-center border-r border-slate-200 mr-8">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-8 text-center">
                    Inserting
                </div>
                <div className="h-20 flex justify-center items-center">
                    <AnimatePresence>
                        {stagedHashValue !== null && (
                            <motion.div
                                layoutId={`hash-item-${stagedHashValue}`}
                                initial={{ opacity: 0, scale: 0.5, y: -20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                                className="w-16 h-16 bg-emerald-100 border-2 border-emerald-500 text-emerald-800 rounded-lg flex items-center justify-center font-bold text-xl shadow-lg z-50 relative"
                            >
                                {stagedHashValue}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Right Panel: Hash Table */}
            <div className="flex-1 flex flex-col min-w-[300px]">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                    Hash Table 
                </div>
                
                {hashTable.map((slot, i) => (
                    <div key={i} className="flex items-center relative gap-4 mb-2 h-14">
                        <div className="w-8 text-right text-slate-400 font-mono text-sm shrink-0">{i}</div>
                        
                        {/* Base Array Slot */}
                        <div className={`relative w-14 h-14 border-2 flex items-center justify-center font-bold transition-all duration-300 rounded shrink-0 overflow-hidden ${getHighlightClass(i)}`}>
                            {hashMode === 'Open Addressing' && slot !== null && slot !== 'DELETED' && (
                                <motion.div 
                                    layoutId={`hash-item-${slot}`}
                                    className="w-full h-full flex items-center justify-center relative z-10"
                                >
                                    {slot}
                                </motion.div>
                            )}
                            {hashMode === 'Open Addressing' && slot === 'DELETED' && (
                                <span className="text-[10px] text-rose-500 font-bold uppercase tracking-tighter">Del</span>
                            )}
                        </div>

                        {/* Chaining Elements */}
                        {hashMode === 'Linked-list resolution' && slot && slot.length > 0 && (
                            <div className="flex items-center gap-3">
                                <AnimatePresence mode="popLayout">
                                    {slot.map((val, j) => (
                                        <motion.div 
                                            key={`${val}-${j}`}
                                            layout
                                            initial={{ opacity: 0, x: -20, scale: 0.5 }}
                                            animate={{ opacity: 1, x: 0, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.5 }}
                                            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                                            className="flex items-center gap-3"
                                        >
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M5 12h14M12 5l7 7-7 7" />
                                            </svg>
                                            <motion.div 
                                                layoutId={`hash-item-${val}`}
                                                className="w-14 h-14 flex items-center justify-center border-2 border-indigo-300 bg-indigo-50 rounded-lg font-bold text-indigo-800 shadow-sm relative z-10"
                                            >
                                                {val}
                                            </motion.div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}

                        {/* Bucket Elements */}
                        {hashMode === 'Bucket hashing' && (
                            <div className="flex items-center gap-1 border-2 border-slate-300 bg-slate-100 p-1.5 rounded-lg shadow-inner">
                                {[0, 1, 2].map((j) => (
                                    <div key={j} className="w-12 h-10 flex items-center justify-center border border-slate-300 bg-white font-bold text-slate-700 shadow-sm rounded overflow-hidden">
                                        {slot[j] !== undefined ? (
                                            <motion.div 
                                                layoutId={`hash-item-${slot[j]}`} 
                                                className="w-full h-full flex items-center justify-center relative z-10"
                                            >
                                                {slot[j]}
                                            </motion.div>
                                        ) : ''}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}