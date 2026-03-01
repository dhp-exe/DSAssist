import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../../store/useStore'

const Arrow = ({ horizontal = true, color = "#93C5FD" }) => {
    if (horizontal) {
        return (
        <svg width="36" height="24" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 12h26" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M28 6l6 6-6 6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        )
    }
    return (
        <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0v14" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M6 8l6 6 6-6" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

const Pointer = ({ label, color, orientation = 'vertical' }) => {
    if (orientation === 'horizontal') {
        return (
            <motion.div 
                initial={{ opacity: 0, x: -15 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -15 }}
                className={`absolute -left-24 top-1/2 -translate-y-1/2 flex items-center justify-end w-20 font-bold text-sm ${color} whitespace-nowrap`}
            >
                <span>{label}</span>
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="ml-2 shrink-0">
                    <path d="M4 16H28M20 8l8 8-8 8" />
                </svg>
            </motion.div>
        )
    }
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 15 }}
            className={`absolute -bottom-14 flex flex-col items-center font-bold text-sm ${color} whitespace-nowrap`}
        >
            <svg width="18" height="24" viewBox="0 0 24 32" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mb-0.5">
                <path d="M12 30V4M5 12l7-7 7 7" />
            </svg>
            <span>{label}</span>
        </motion.div>
    )
}

export default function LinearVisualizer({ type }) {
    const nodes = useStore((s) => s.nodes)
    const highlight = useStore((s) => s.highlightIndex)
    const impl = useStore((s) => s.implementationMode)

    const searchLeft = useStore(s => s.searchLeft)
    const searchRight = useStore(s => s.searchRight)
    const searchMid = useStore(s => s.searchMid)
    const searchResult = useStore(s => s.searchResult)

    if (!nodes || nodes.length === 0) {
        return <div className="h-full flex items-center justify-center text-slate-400">Empty - add elements.</div>
    }

    const isStack = type === 'Stack' && impl === 'Array'
    const isQueue = type === 'Queue' && impl === 'Array'
    const isDoubly = type === 'Doubly Linked List'
    const isSingly = type === 'Singly Linked List' || ((type === 'Stack' || type === 'Queue') && impl === 'Linked List')
    const isArray = type === 'ArrayList'

    if (isArray) {
        return (
            <div className="h-full flex items-center justify-center p-6 overflow-auto">
                <div className="border-4 border-slate-300 bg-slate-100 p-2 rounded-xl flex items-center shadow-inner">
                    <AnimatePresence mode="popLayout">
                        {nodes.map((node, i) => {
                            const isFound = searchResult === i;
                            const isHighlight = highlight === i;
                            let bg = isFound ? 'bg-emerald-200 shadow-inner' : (isHighlight ? 'bg-indigo-200 shadow-inner' : 'bg-white');
                            let txt = isFound ? 'text-emerald-800' : (isHighlight ? 'text-indigo-800' : 'text-slate-700');

                            let topLabel = [];
                            if (searchLeft === i) topLabel.push('L');
                            if (searchRight === i) topLabel.push('R');
                            let topLabelStr = topLabel.join(', ');

                            return (
                                <motion.div
                                    key={node.id}
                                    layout
                                    initial={{ opacity: 0, y: -40, scale: 0.8 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 40, scale: 0.8 }}
                                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                                    className={`relative w-16 h-16 border-r-2 border-slate-300 last:border-r-0 flex flex-col items-center justify-center transition-colors ${bg}`}
                                >
                                    <div className={`font-bold text-lg ${txt}`}>{node.value}</div>
                                    <div className="absolute -bottom-7 text-xs font-mono text-slate-500">{i}</div>
                                    
                                    {topLabelStr && <Pointer label={topLabelStr} color={searchLeft === searchRight ? "text-purple-600" : (searchLeft === i ? "text-rose-500" : "text-blue-500")} orientation="vertical" />}
                                    {searchMid === i && <Pointer label="M" color="text-yellow-500" orientation="vertical" />}
                                </motion.div>
                            )
                        })}
                        {(searchLeft === nodes.length || searchRight === nodes.length || searchMid === nodes.length || searchResult === nodes.length) && (
                            <motion.div layout className="relative w-16 h-16 flex flex-col items-center justify-center border-l-2 border-dashed border-slate-300 bg-transparent opacity-50">
                                <div className="absolute -bottom-7 text-xs font-mono text-slate-500">{nodes.length}</div>
                                {((searchLeft === nodes.length ? 'L' : '') + (searchLeft === nodes.length && searchRight === nodes.length ? ', ' : '') + (searchRight === nodes.length ? 'R' : '')) && 
                                    <Pointer label={
                                        [searchLeft === nodes.length ? 'L' : null, searchRight === nodes.length ? 'R' : null].filter(Boolean).join(', ')
                                    } color="text-purple-600" orientation="vertical" />
                                }
                                {searchMid === nodes.length && <Pointer label="M" color="text-yellow-500" orientation="vertical" />}
                                {searchResult === nodes.length && <div className="absolute inset-0 bg-emerald-200 opacity-30 shadow-inner"></div>}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        )
    }

    if (isStack) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-6 overflow-auto">
                <div className="border-b-8 border-l-8 border-r-8 border-slate-400 p-4 rounded-b-2xl flex flex-col items-center min-w-[200px] min-h-[100px] justify-end bg-slate-50 shadow-inner">
                    <AnimatePresence mode="popLayout">
                        {nodes.map((node, i) => (
                            <motion.div
                                key={node.id}
                                layout
                                initial={{ opacity: 0, y: -80, scale: 0.5 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -80, scale: 0.5 }}
                                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                                className={`w-32 h-14 mb-2 bg-white border-2 rounded-lg flex items-center justify-center shadow-md ${highlight === i ? 'border-indigo-500 bg-indigo-50 scale-105' : 'border-slate-300'}`}
                            >
                                <div className="font-bold text-lg text-slate-700">{node.value}</div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
                <div className="mt-4 text-sm font-semibold text-slate-400 uppercase tracking-widest">Stack</div>
            </div>
        )
    }

    if (isQueue) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-6 overflow-auto">
                <div className="border-t-8 border-b-8 border-slate-400 p-4 flex items-center min-w-[250px] min-h-[120px] relative bg-slate-50 shadow-inner">
                    <div className="absolute -top-8 left-0 text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">←Front</div>
                    <div className="absolute -top-8 right-0 text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Back←</div>
                    <AnimatePresence mode="popLayout">
                        {nodes.map((node, i) => (
                            <motion.div
                                key={node.id}
                                layout
                                initial={{ opacity: 0, x: 100, scale: 0.5 }} // Enters from Right
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: -100, scale: 0.5 }} // Exits to Left
                                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                                className={`w-16 h-16 mx-1 bg-white border-2 rounded-lg flex items-center justify-center shadow-md ${highlight === i ? 'border-indigo-500 bg-indigo-50 scale-110' : 'border-slate-300'}`}
                            >
                                <div className="font-bold text-lg text-slate-700">{node.value}</div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
                <div className="mt-4 text-sm font-semibold text-slate-400 uppercase tracking-widest">Queue</div>
            </div>
        )
    }

    // --- Linked List Block ---
    let headTarget = nodes.findIndex(n => !n.isStaged || n.phase === 'unlink');
    if (headTarget === -1 && nodes.length > 0) headTarget = 0;
    let tailTarget = nodes.findLastIndex(n => !n.isStaged || n.phase === 'unlink');
    if (tailTarget === -1 && nodes.length > 0) tailTarget = nodes.length - 1;

    const getArrowOpacity = (n1, n2) => {
        if (n1?.phase === 'appear' || n2?.phase === 'appear') return 0; 
        if (n1?.phase === 'bypass' || n2?.phase === 'bypass') return 0; 
        return 1;
    };
    
    const getArrowColor = (n1, n2) => {
        if (n1?.phase === 'link' || n2?.phase === 'link') return '#10b981'; 
        if (n1?.phase === 'unlink' || n2?.phase === 'unlink') return '#f43f5e'; 
        return '#93C5FD'; 
    };

    let headLabel = 'Head';
    let tailLabel = 'Tail';
    let showTailPointer = true;
    let isVertical = false;
    
    // Dynamic container styles
    let containerClasses = "flex items-center gap-4 mt-8"; 

    if (type === 'Queue') {
        headLabel = 'Front';
        tailLabel = 'Back';
        containerClasses = "border-t-4 border-b-4 border-slate-400 flex items-center bg-slate-50 shadow-inner p-4 min-w-[250px] min-h-[120px] gap-2";
    } else if (type === 'Stack') {
        headLabel = 'Top';
        showTailPointer = false; 
        isVertical = true;
        containerClasses = "border-b-4 border-l-4 border-r-4 border-slate-400 rounded-b-xl flex flex-col justify-end bg-slate-50 shadow-inner p-4 min-w-[150px] min-h-[120px] gap-1 mt-4";
    }

    if (isSingly || isDoubly) {
        return (
            <div className="h-full flex items-center justify-center p-6 overflow-auto">
                <div className={containerClasses}>
                    <AnimatePresence mode="popLayout">
                        {nodes.map((node, i) => {
                            let yOffset = 0;
                            let borderColor = highlight === i ? 'border-indigo-400' : 'border-slate-200';
                            let bgColor = highlight === i ? 'bg-indigo-50' : 'bg-white';
                            let textColor = highlight === i ? 'text-indigo-600' : 'text-slate-700';

                            if (node.isStaged) {
                                if (node.phase === 'appear' || node.phase === 'link') {
                                    yOffset = 0; 
                                    borderColor = 'border-emerald-400';
                                    bgColor = 'bg-emerald-50';
                                    textColor = 'text-emerald-700';
                                } else if (node.phase === 'unlink' || node.phase === 'bypass') {
                                    yOffset = 0; 
                                    borderColor = 'border-rose-400';
                                    bgColor = 'bg-rose-50';
                                    textColor = 'text-rose-700';
                                }
                            }

                            const isHead = i === headTarget;
                            const isTail = i === tailTarget;

                            return (
                                <React.Fragment key={node.id}>
                                    <motion.div 
                                        layout
                                        initial={{ opacity: 0, scale: 0.5, y: yOffset }}
                                        animate={{ opacity: 1, scale: 1, y: yOffset }}
                                        exit={{ opacity: 0, scale: 0.5, y: 50 }}
                                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                        className={`relative flex flex-col items-center justify-center transition-all ${highlight === i ? 'scale-110' : ''}`}
                                    >
                                        <div className={`w-16 h-16 border-2 rounded-lg flex items-center justify-center shadow-md transition-colors ${bgColor} ${borderColor}`}>
                                            <div className={`font-bold text-lg ${textColor}`}>{node.value}</div>
                                        </div>
                                        
                                        {isHead && <Pointer label={headLabel} color="text-emerald-500" orientation={isVertical ? 'horizontal' : 'vertical'} />}
                                        {isTail && showTailPointer && <Pointer label={tailLabel} color="text-orange-500" orientation={isVertical ? 'horizontal' : 'vertical'} />}
                                    </motion.div>

                                    {i !== nodes.length - 1 && (
                                        <motion.div 
                                            layout
                                            initial={{ opacity: 0, [isVertical ? 'height' : 'width']: 0 }}
                                            animate={{ opacity: getArrowOpacity(nodes[i], nodes[i+1]), [isVertical ? 'height' : 'width']: 'auto' }}
                                            transition={{ duration: 0.4 }}
                                            className={`flex ${isVertical ? 'justify-center' : 'items-center'}`}
                                        >
                                            {isDoubly ? (
                                                <svg width="36" height="32" viewBox="0 0 36 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M4 6h28" stroke={getArrowColor(nodes[i], nodes[i+1])} strokeWidth="2" strokeLinecap="round" />
                                                    <path d="M26 0l6 6-6 6" stroke={getArrowColor(nodes[i], nodes[i+1])} strokeWidth="2" strokeLinecap="round" />
                                                    <path d="M32 22H4" stroke={getArrowColor(nodes[i], nodes[i+1])} strokeWidth="2" strokeLinecap="round" />
                                                    <path d="M10 16l-6 6 6 6" stroke={getArrowColor(nodes[i], nodes[i+1])} strokeWidth="2" strokeLinecap="round" />
                                                </svg>
                                            ) : (
                                                <Arrow horizontal={!isVertical} color={getArrowColor(nodes[i], nodes[i+1])} />
                                            )}
                                        </motion.div>
                                    )}
                                </React.Fragment>
                            )
                        })}
                    </AnimatePresence>
                </div>
            </div>
        )
    }

    return null
}