import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../../store/useStore'

export default function GraphVisualizer() {
    const isGeneratingFrames = useStore((s) => s.isGeneratingFrames)
    
    // We fetch raw state, and cache it to prevent flashing during frame generation
    const rawIsDirected = useStore(s => s.isDirected)
    const rawIsWeighted = useStore(s => s.isWeighted)
    const rawRep = useStore(s => s.graphRepresentation)
    const rawNodes = useStore(s => s.graphNodes)
    const rawEdges = useStore(s => s.graphEdges)
    const rawSelected = useStore(s => s.graphSelectedNode)
    
    const rawQ = useStore(s => s.graphQueue)
    const rawS = useStore(s => s.graphStack)
    const rawVis = useStore(s => s.graphVisited)
    const rawTrav = useStore(s => s.graphTraversal)
    const rawHN = useStore(s => s.graphHighlightNodes)
    const rawHE = useStore(s => s.graphHighlightEdges)
    const rawHBE = useStore(s => s.graphHighlightBackEdges)

    const cache = useRef({})
    if (!isGeneratingFrames) {
        cache.current = { 
            isDirected: rawIsDirected, isWeighted: rawIsWeighted, rep: rawRep, 
            nodes: rawNodes, edges: rawEdges, sel: rawSelected,
            q: rawQ, s: rawS, vis: rawVis, trav: rawTrav, hn: rawHN, he: rawHE, hbe: rawHBE
        }
    }

    const c = isGeneratingFrames ? cache.current : {
        isDirected: rawIsDirected, isWeighted: rawIsWeighted, rep: rawRep, 
        nodes: rawNodes, edges: rawEdges, sel: rawSelected,
        q: rawQ, s: rawS, vis: rawVis, trav: rawTrav, hn: rawHN, he: rawHE, hbe: rawHBE
    };

    const setGraphSelectedNode = useStore(s => s.setGraphSelectedNode)
    const updateGraphNodePosition = useStore(s => s.updateGraphNodePosition)
    const removeGraphEdge = useStore(s => s.removeGraphEdge)
    const updateGraphEdgeWeight = useStore(s => s.updateGraphEdgeWeight)
    const isAnimating = useStore(s => s.isAnimating)

    const handleNodeClick = (id) => {
        if (isAnimating) return;
        setGraphSelectedNode(id);
    }

    const handleEdgeClick = (edge) => {
        if (isAnimating) return;
        const val = window.prompt(`Edge ${edge.source}-${edge.target}. Enter new weight to update, or leave empty to delete:`, edge.weight);
        if (val === null) return; 
        if (val.trim() === '') {
            removeGraphEdge(edge.id);
        } else {
            updateGraphEdgeWeight(edge.id, val);
        }
    }

    const renderGraph = () => {
        return (
            <div className="relative w-full h-full min-h-[500px]">
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                    {c.edges.map(edge => {
                        const source = c.nodes.find(n => n.id === edge.source);
                        const target = c.nodes.find(n => n.id === edge.target);
                        if (!source || !target) return null;
                        
                        const sx = source.x + 24;
                        const sy = source.y + 24;
                        const tx = target.x + 24;
                        const ty = target.y + 24;
                        
                        const angle = Math.atan2(ty - sy, tx - sx);
                        const r = 24; 
                        const startX = sx + r * Math.cos(angle);
                        const startY = sy + r * Math.sin(angle);
                        const endX = tx - r * Math.cos(angle);
                        const endY = ty - r * Math.sin(angle);
                        
                        const isHighlighted = c.he.includes(edge.id) || (!c.isDirected && c.he.includes(`${edge.target}-${edge.source}`));
                        const isBackEdge = c.hbe.some(be => (be.source === edge.source && be.target === edge.target) || (!c.isDirected && be.source === edge.target && be.target === edge.source));
                        
                        let color = '#cbd5e1'; 
                        let width = 2;
                        if (isHighlighted) { color = '#eab308'; width = 4; } 
                        if (isBackEdge) { color = '#f43f5e'; width = 3; } 
                        
                        return (
                            <g key={edge.id} className={!isAnimating ? "cursor-pointer pointer-events-auto" : "pointer-events-none"} onClick={() => handleEdgeClick(edge)}>
                                <line x1={startX} y1={startY} x2={endX} y2={endY} stroke={color} strokeWidth={width} />
                                {c.isDirected && (
                                    <polygon points="0,-6 12,0 0,6" transform={`translate(${endX},${endY}) rotate(${angle * 180 / Math.PI})`} fill={color} />
                                )}
                                {c.isWeighted && (
                                    <text x={(startX + endX)/2} y={(startY + endY)/2 - 8} fill="#475569" fontSize="14" fontWeight="bold" textAnchor="middle">
                                        {edge.weight}
                                    </text>
                                )}
                                <line x1={startX} y1={startY} x2={endX} y2={endY} stroke="transparent" strokeWidth="15" />
                            </g>
                        )
                    })}
                </svg>

                {c.nodes.map(node => {
                    const isSelected = c.sel === node.id;
                    const isVisited = c.vis.includes(node.id);
                    const isHighlighted = c.hn.includes(node.id);
                    
                    let bg = "bg-white border-slate-300";
                    if (isSelected) bg = "bg-indigo-100 border-indigo-500 ring-4 ring-indigo-200 z-10";
                    else if (isHighlighted) bg = "bg-yellow-100 border-yellow-500 ring-4 ring-yellow-200 z-10";
                    else if (isVisited) bg = "bg-emerald-100 border-emerald-500 z-10";

                    return (
                        <motion.div
                            key={node.id}
                            drag={!isAnimating}
                            dragMomentum={false}
                            onDragEnd={(e, info) => updateGraphNodePosition(node.id, node.x + info.offset.x, node.y + info.offset.y)}
                            initial={false}
                            animate={{ x: node.x, y: node.y }}
                            transition={{ type: "tween", duration: 0 }}
                            className={`absolute w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-slate-700 shadow-sm cursor-grab active:cursor-grabbing ${bg}`}
                            onClick={() => handleNodeClick(node.id)}
                            style={{ top: 0, left: 0 }}
                        >
                            {node.id}
                        </motion.div>
                    )
                })}
            </div>
        )
    }

    const renderMatrix = () => {
        const sorted = [...c.nodes].sort((a,b) => a.id.localeCompare(b.id));
        return (
            <div className="p-8">
                <table className="border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
                    <thead>
                        <tr>
                            <th className="border p-3 bg-slate-100"></th>
                            {sorted.map(n => <th key={n.id} className="border p-3 bg-slate-100 min-w-[3rem] text-slate-600">{n.id}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.map(row => (
                            <tr key={row.id}>
                                <th className="border p-3 bg-slate-100 text-slate-600">{row.id}</th>
                                {sorted.map(col => {
                                    const edge = c.edges.find(e => (e.source === row.id && e.target === col.id) || (!c.isDirected && e.source === col.id && e.target === row.id));
                                    const isHighlighted = c.he.includes(`${row.id}-${col.id}`) || (!c.isDirected && c.he.includes(`${col.id}-${row.id}`));
                                    const cellBg = isHighlighted ? 'bg-yellow-100 text-yellow-800 font-bold border-yellow-300' : 'text-slate-500';
                                    return (
                                        <td key={col.id} className={`border p-3 text-center ${cellBg}`}>
                                            {edge ? (c.isWeighted ? edge.weight : '1') : '0'}
                                        </td>
                                    )
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }

    const renderList = () => {
        const sorted = [...c.nodes].sort((a,b) => a.id.localeCompare(b.id));
        return (
            <div className="p-8 flex flex-col gap-3">
                {sorted.map(n => {
                    const neighbors = c.edges.filter(e => e.source === n.id || (!c.isDirected && e.target === n.id)).map(e => {
                        const target = e.source === n.id ? e.target : e.source;
                        return { target, weight: e.weight, edgeId: e.id };
                    }).sort((a,b) => a.target.localeCompare(b.target));

                    return (
                        <div key={n.id} className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded bg-indigo-100 border-2 border-indigo-400 flex items-center justify-center font-bold text-indigo-800 shadow-sm ${c.hn.includes(n.id) ? 'ring-4 ring-yellow-300' : ''}`}>
                                {n.id}
                            </div>
                            <div className="text-slate-400 font-bold">→</div>
                            {neighbors.map((nbr, idx) => {
                                const isHighlighted = c.he.includes(nbr.edgeId) || (!c.isDirected && (c.he.includes(`${n.id}-${nbr.target}`) || c.he.includes(`${nbr.target}-${n.id}`)));
                                return (
                                    <React.Fragment key={nbr.target + idx}>
                                        <div className={`px-4 h-10 bg-white border-2 border-slate-300 flex items-center justify-center font-bold shadow-sm rounded ${isHighlighted ? 'bg-yellow-100 border-yellow-500 ring-4 ring-yellow-200' : 'text-slate-600'}`}>
                                            {nbr.target} {c.isWeighted && <span className="text-xs text-slate-400 ml-1 font-mono">({nbr.weight})</span>}
                                        </div>
                                        {idx < neighbors.length - 1 && <div className="text-slate-300">→</div>}
                                    </React.Fragment>
                                )
                            })}
                            {neighbors.length === 0 && <div className="text-slate-400 italic">null</div>}
                        </div>
                    )
                })}
            </div>
        )
    }

    return (
        <div className="h-full w-full flex flex-col bg-slate-50 relative overflow-hidden border rounded-lg">
            <div className="flex-1 overflow-auto relative">
                {c.rep === 'Graph' && renderGraph()}
                {c.rep === 'Adjacency Matrix' && renderMatrix()}
                {c.rep === 'Adjacency List' && renderList()}
            </div>
            
            {/* Traversal Info Bar */}
            {(c.q.length > 0 || c.s.length > 0 || c.vis.length > 0) && (
                <div className="bg-white border-t p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] flex flex-col gap-3 z-20 overflow-auto max-h-48">
                    {c.q.length > 0 && (
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold uppercase text-slate-500 w-20 text-right shrink-0">Queue:</span>
                            <div className="flex gap-2 flex-wrap">
                                <div className="text-slate-400 font-mono text-sm self-center">Front →</div>
                                {c.q.map((item, i) => (
                                    <div key={i} className="w-8 h-8 border bg-indigo-50 border-indigo-200 flex items-center justify-center rounded font-bold text-indigo-700 shadow-sm">{item}</div>
                                ))}
                            </div>
                        </div>
                    )}
                    {c.s.length > 0 && (
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold uppercase text-slate-500 w-20 text-right shrink-0">Stack:</span>
                            <div className="flex gap-2 flex-wrap">
                                <div className="text-slate-400 font-mono text-sm self-center">Top →</div>
                                {[...c.s].reverse().map((item, i) => (
                                    <div key={i} className="w-8 h-8 border bg-rose-50 border-rose-200 flex items-center justify-center rounded font-bold text-rose-700 shadow-sm">{item}</div>
                                ))}
                            </div>
                        </div>
                    )}
                    {c.vis.length > 0 && (
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold uppercase text-slate-500 w-20 text-right shrink-0">Visited:</span>
                            <div className="flex gap-2 flex-wrap">
                                {c.vis.map((item, i) => (
                                    <div key={i} className="w-8 h-8 border bg-emerald-50 border-emerald-300 flex items-center justify-center rounded-full font-bold text-emerald-800">{item}</div>
                                ))}
                            </div>
                        </div>
                    )}
                    {c.trav.length > 0 && (
                        <div className="flex items-center gap-3 mt-1 pt-3 border-t">
                            <span className="text-xs font-bold uppercase text-slate-500 w-20 text-right shrink-0">Order:</span>
                            <div className="flex gap-2 text-slate-700 font-bold tracking-widest flex-wrap">
                                {c.trav.join(' → ')}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}