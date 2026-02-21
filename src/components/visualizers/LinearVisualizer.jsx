import React from 'react'
import { useStore } from '../../store/useStore'

const Arrow = ({ horizontal = true }) => {
    if (horizontal) {
        return (
        <svg width="36" height="24" viewBox="0 0 36 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 12h26" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M28 6l6 6-6 6" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        )
    }
    return (
        <svg width="24" height="36" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2v26" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M6 28l6 6 6-6" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    )
}

export default function LinearVisualizer({ type }) {
    const data = useStore((s) => s.data)
    const highlight = useStore((s) => s.highlightIndex)

    if (!data || data.length === 0) {
        return <div className="h-full flex items-center justify-center text-slate-400">Empty - add elements.</div>
    }

    const isStack = type === 'Stack'
    const isQueue = type === 'Queue'
    const isDoubly = type === 'Doubly Linked List'
    const isSingly = type === 'Singly Linked List'
    const isArray = type === 'ArrayList'

    if (isStack) {
        return (
        <div className="h-full flex flex-col items-center justify-center gap-3 p-6">
            {data.map((v, i) => (
            <div
                key={i}
                className={`w-36 h-14 bg-white border rounded-lg flex items-center justify-center shadow transition-transform ${highlight === i ? 'ring-4 ring-indigo-200 scale-105' : ''}`}
            >
                <div className="font-bold text-lg text-slate-700">{v}</div>
            </div>
            ))}
        </div>
        )
    }

    if (isQueue || isArray || isSingly || isDoubly) {
        return (
        <div className="h-full flex items-center justify-center p-6">
            <div className="flex items-center gap-4">
            {data.map((v, i) => (
                <React.Fragment key={i}>
                <div className={`flex flex-col items-center justify-center transition-transform ${highlight === i ? 'scale-105' : ''}`}>
                    <div className="w-16 h-16 bg-white border-2 border-slate-200 rounded-lg flex items-center justify-center shadow-md">
                    <div className={`font-bold text-lg ${highlight === i ? 'text-indigo-600' : 'text-slate-700'}`}>{v}</div>
                    </div>
                    {isArray && <div className="text-xs text-slate-400 mt-2">idx: {i}</div>}
                </div>

                {i !== data.length - 1 && (
                    <div className="flex items-center">
                        
                        {!isArray && isDoubly ? (
                        /* 2 stacked arrows for doubly */
                        <svg width="36" height="32" viewBox="0 0 36 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* Top arrow */}
                            <path d="M4 6h28" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
                            <path d="M26 0l6 6-6 6" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />

                            {/* Bottom arrow */}
                            <path d="M32 22H4" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
                            <path d="M10 16l-6 6 6 6" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        ) : !isArray ? (
                        /* one-way arrow for SLL / Queue */
                        <Arrow horizontal={true} />
                        ) : null /* no arrow for arraylist */
                        }
                    </div>
                )}
                </React.Fragment>
            ))}
            </div>
        </div>
        )
    }

    return null
}
