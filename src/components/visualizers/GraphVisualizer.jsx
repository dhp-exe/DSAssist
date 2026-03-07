import React, { useRef, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../../store/useStore'

export default function GraphVisualizer() {
    const isGeneratingFrames = useStore((s) => s.isGeneratingFrames)
    const isAnimating = useStore(s => s.isAnimating)
    const isDarkMode = useStore(s => s.isDarkMode)

    // Fetch raw state
    const rawIsDirected = useStore(s => s.isDirected)
    const rawIsWeighted = useStore(s => s.isWeighted)
    const rawRep = useStore(s => s.graphRepresentation)
    const rawNodes = useStore(s => s.graphNodes)
    const rawEdges = useStore(s => s.graphEdges)
    const rawSelected = useStore(s => s.graphSelectedNode)
    const rawMode = useStore(s => s.graphMode)
    const rawEdgeSource = useStore(s => s.graphEdgeSource)
    const rawSelectedEdge = useStore(s => s.graphSelectedEdge)
    const rawShowGuide = useStore(s => s.showGraphGuide)
    
    const rawAlgorithm = useStore(s => s.graphAlgorithm)
    const rawQ = useStore(s => s.graphQueue)
    const rawS = useStore(s => s.graphStack)
    const rawPQ = useStore(s => s.graphPQ)
    const rawDistances = useStore(s => s.graphDistances)
    const rawInDegrees = useStore(s => s.graphInDegrees)
    const rawIteration = useStore(s => s.graphIteration)
    const rawVis = useStore(s => s.graphVisited)
    const rawTrav = useStore(s => s.graphTraversal)
    const rawMST = useStore(s => s.graphMSTEdges)     
    const rawDS = useStore(s => s.graphDisjointSets)  
    const rawHN = useStore(s => s.graphHighlightNodes)
    const rawHE = useStore(s => s.graphHighlightEdges)
    const rawHBE = useStore(s => s.graphHighlightBackEdges)

    const cache = useRef({})
    if (!isGeneratingFrames) {
        cache.current = { 
            isDirected: rawIsDirected, isWeighted: rawIsWeighted, rep: rawRep, 
            nodes: rawNodes, edges: rawEdges, sel: rawSelected, graphMode: rawMode, graphEdgeSource: rawEdgeSource, graphSelectedEdge: rawSelectedEdge, showGraphGuide: rawShowGuide,
            graphAlgorithm: rawAlgorithm, q: rawQ, s: rawS, pq: rawPQ, distances: rawDistances, inDegrees: rawInDegrees, iteration: rawIteration, vis: rawVis, trav: rawTrav, mst: rawMST, ds: rawDS, hn: rawHN, he: rawHE, hbe: rawHBE
        }
    }

    const c = isGeneratingFrames ? cache.current : {
        isDirected: rawIsDirected, isWeighted: rawIsWeighted, rep: rawRep, 
        nodes: rawNodes, edges: rawEdges, sel: rawSelected, graphMode: rawMode, graphEdgeSource: rawEdgeSource, graphSelectedEdge: rawSelectedEdge, showGraphGuide: rawShowGuide,
        graphAlgorithm: rawAlgorithm, q: rawQ, s: rawS, pq: rawPQ, distances: rawDistances, inDegrees: rawInDegrees, iteration: rawIteration, vis: rawVis, trav: rawTrav, mst: rawMST, ds: rawDS, hn: rawHN, he: rawHE, hbe: rawHBE
    };

    // Actions
    const setGraphMode = useStore(s => s.setGraphMode)
    const setGraphSelectedNode = useStore(s => s.setGraphSelectedNode)
    const setGraphSelectedEdge = useStore(s => s.setGraphSelectedEdge)
    const setGraphEdgeSource = useStore(s => s.setGraphEdgeSource)
    const createGraphEdge = useStore(s => s.createGraphEdge)
    const addGraphNodeAtPos = useStore(s => s.addGraphNodeAtPos)
    const updateGraphNodePosition = useStore(s => s.updateGraphNodePosition)
    const removeGraphNode = useStore(s => s.removeGraphNode)
    const removeGraphEdge = useStore(s => s.removeGraphEdge)
    const updateGraphEdgeWeight = useStore(s => s.updateGraphEdgeWeight)
    const deleteSelectedGraphItem = useStore(s => s.deleteSelectedGraphItem)

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            const state = useStore.getState();
            if (state.graphMode === 'select' && (e.key === 'Delete' || e.key === 'Backspace')) {
                state.deleteSelectedGraphItem();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleNodeClick = (id, e) => {
        e.stopPropagation();
        if (isAnimating) return;

        if (c.graphMode === 'select') {
            setGraphSelectedNode(id);
        } else if (c.graphMode === 'add-edge') {
            if (!c.graphEdgeSource) {
                setGraphEdgeSource(id);
            } else if (c.graphEdgeSource === id) {
                setGraphEdgeSource(null);
            } else {
                createGraphEdge(c.graphEdgeSource, id);
                setGraphEdgeSource(null);
            }
        } else if (c.graphMode === 'delete') {
            removeGraphNode(id);
        }
    }

    const handleEdgeClick = (edge, e) => {
        e.stopPropagation();
        if (isAnimating) return;

        if (c.graphMode === 'select') {
            setGraphSelectedEdge(edge.id);
        } else if (c.graphMode === 'delete') {
            removeGraphEdge(edge.id);
        }
    }

    const handleEdgeDoubleClick = (edge, e) => {
        e.stopPropagation();
        if (isAnimating) return;
        
        if (c.graphMode === 'select') {
            const val = window.prompt(`Edit weight for ${edge.source}-${edge.target}:`, edge.weight);
            if (val !== null && val.trim() !== '') {
                const num = Number(val);
                if (isNaN(num)) {
                    alert('Weight must be a valid number.');
                } else {
                    updateGraphEdgeWeight(edge.id, val.trim());
                }
            }
        }
    }

    const handleCanvasClick = (e) => {
        if (isAnimating) return;
        
        if (c.graphMode === 'add-node') {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left - 24; 
            const y = e.clientY - rect.top - 24;
            addGraphNodeAtPos(x, y);
        } else if (c.graphMode === 'add-edge') {
            setGraphEdgeSource(null);
        } else if (c.graphMode === 'select') {
            if (c.sel) setGraphSelectedNode(null);
            if (c.graphSelectedEdge) setGraphSelectedEdge(null);
        }
    }

    const renderGraph = () => {
        return (
            <div className="relative w-full h-full min-h-[500px]" onClick={handleCanvasClick}>
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                    {c.edges.map(edge => {
                        const source = c.nodes.find(n => n.id === edge.source);
                        const target = c.nodes.find(n => n.id === edge.target);
                        if (!source || !target) return null;
                        
                        const sx = source.x + 24; const sy = source.y + 24;
                        const tx = target.x + 24; const ty = target.y + 24;
                        const angle = Math.atan2(ty - sy, tx - sx);
                        const r = 24; 
                        
                        const startX = sx + r * Math.cos(angle); 
                        const startY = sy + r * Math.sin(angle);
                        
                        const endX = tx - r * Math.cos(angle); 
                        const endY = ty - r * Math.sin(angle);
                        
                        const isMST = c.mst && c.mst.includes(edge.id);
                        const isHighlighted = c.he.includes(edge.id) || (!c.isDirected && c.he.includes(`${edge.target}-${edge.source}`));
                        const isBackEdge = c.hbe.some(be => (be.source === edge.source && be.target === edge.target) || (!c.isDirected && be.source === edge.target && be.target === edge.source));
                        const isSelectedEdge = c.graphSelectedEdge === edge.id;

                        let color = '#cbd5e1'; 
                        let width = 2;
                        let opacity = 1;
                        
                        if (isMST) { color = '#10b981'; width = 5; } // Thicker MST Line
                        if (isHighlighted) { color = '#eab308'; width = 4; opacity = 1; } 
                        else if (isBackEdge) { color = '#f43f5e'; width = 3; opacity = 1; } 
                        else if (isSelectedEdge) { color = '#6366f1'; width = 4; opacity = 1; }

                        // Dim inactive edges dynamically if a Spanning Tree is building
                        if ((c.graphAlgorithm === 'Prim' || c.graphAlgorithm === 'Kruskal') && c.mst && c.mst.length > 0) {
                            if (!isMST && !isHighlighted) opacity = 0.15;
                        }
                        
                        return (
                            <g key={edge.id} style={{ opacity, transition: 'opacity 0.3s' }} className={!isAnimating ? "cursor-pointer pointer-events-auto" : "pointer-events-none"} onClick={(e) => handleEdgeClick(edge, e)} onDoubleClick={(e) => handleEdgeDoubleClick(edge, e)}>
                                <line x1={startX} y1={startY} x2={endX} y2={endY} stroke={color} strokeWidth={width} />
                                {c.isDirected && (
                                    <polygon points="-12,-6 0,0 -12,6" transform={`translate(${endX},${endY}) rotate(${angle * 180 / Math.PI})`} fill={color} />
                                )}
                                {c.isWeighted && (
                                    <text x={(startX + endX)/2} y={(startY + endY)/2 - 8} fill={
                                        isSelectedEdge
                                            ? "#6366f1"
                                            : (isDarkMode ? "#cbd5f5" : "#475569")
                                        } fontSize="14" fontWeight="bold" textAnchor="middle">
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
                    const isSource = c.graphEdgeSource === node.id;
                    
                    let bg = isDarkMode? "bg-slate-200 border-slate-300" : "bg-white border-slate-300";
                    let opacity = 1;

                    if (isSelected) bg = "bg-indigo-100 border-indigo-500 ring-4 ring-indigo-200 z-10";
                    else if (isHighlighted) bg = "bg-yellow-100 border-yellow-500 ring-4 ring-yellow-200 z-10";
                    else if (isSource) bg = "bg-blue-100 border-blue-500 ring-4 ring-blue-200 z-10";
                    else if (isVisited) bg = "bg-emerald-100 border-emerald-500 ring-4 ring-emerald-200 z-10";

                    // Dim inactive nodes dynamically if a Spanning Tree is building
                    if ((c.graphAlgorithm === 'Prim' || c.graphAlgorithm === 'Kruskal') && c.mst && c.mst.length > 0) {
                        if (!isVisited && !isHighlighted) opacity = 0.25;
                    }

                    return (
                        <motion.div
                            key={node.id}
                            drag={!isAnimating && c.graphMode === 'select'}
                            dragMomentum={false}
                            onDragEnd={(e, info) => {
                                updateGraphNodePosition(
                                    node.id,
                                    node.x + info.offset.x,
                                    node.y + info.offset.y
                                )
                            }}
                            initial={false}
                            transition={{ type: "tween", duration: 0 }}
                            className={`absolute w-12 h-12 rounded-full border-2 flex items-center justify-center font-bold text-slate-450 shadow-sm z-10 transition-opacity duration-300 ${!isAnimating && c.graphMode === 'select' ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'} ${bg}`}
                            onClick={(e) => handleNodeClick(node.id, e)}
                            style={{
                                x: node.x,
                                y: node.y,
                                top: 0,
                                left: 0,
                                opacity
                            }}
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
                        <tr><th className="border p-3 bg-slate-100"></th>{sorted.map(n => <th key={n.id} className="border p-3 bg-slate-100 min-w-[3rem] text-slate-600">{n.id}</th>)}</tr>
                    </thead>
                    <tbody>
                        {sorted.map(row => (
                            <tr key={row.id}>
                                <th className="border p-3 bg-slate-100 text-slate-600">{row.id}</th>
                                {sorted.map(col => {
                                    const edge = c.edges.find(e => (e.source === row.id && e.target === col.id) || (!c.isDirected && e.source === col.id && e.target === row.id));
                                    const isHighlighted = c.he.includes(`${row.id}-${col.id}`) || (!c.isDirected && c.he.includes(`${col.id}-${row.id}`));
                                    const cellBg = isHighlighted ? 'bg-yellow-100 text-yellow-800 font-bold border-yellow-300' : 'text-slate-500';
                                    return <td key={col.id} className={`border p-3 text-center ${cellBg}`}>{edge ? (c.isWeighted ? edge.weight : '1') : '0'}</td>
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
                        const target = e.source === n.id ? e.target : e.source; return { target, weight: e.weight, edgeId: e.id };
                    }).sort((a,b) => a.target.localeCompare(b.target));

                    return (
                        <div key={n.id} className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded bg-indigo-100 border-2 border-indigo-400 flex items-center justify-center font-bold text-indigo-800 shadow-sm ${c.hn.includes(n.id) ? 'ring-4 ring-yellow-300' : ''}`}>{n.id}</div>
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
            
            {/* Interaction Toolbar Overlay */}
            {c.rep === 'Graph' && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 flex flex-col items-center z-30">
                    <div className="bg-white border border-slate-300 shadow-sm rounded-lg flex p-1">
                        {['select', 'add-node', 'add-edge', 'delete'].map(mode => (
                            <button
                                key={mode}
                                onClick={() => { if (!isAnimating) setGraphMode(mode); }}
                                disabled={isAnimating}
                                className={`px-4 py-1.5 text-sm font-semibold rounded capitalize transition-colors ${c.graphMode === mode ? 'bg-indigo-100 text-indigo-800' : 'text-slate-600 hover:bg-slate-100'}`}
                            >
                                {mode.replace('-', ' ')}
                            </button>
                        ))}
                    </div>
                    {c.showGraphGuide && !isAnimating && (
                        <div className="mt-2 px-4 py-1.5 bg-slate-800/80 text-white text-xs rounded-full shadow-md animate-fade-in backdrop-blur-sm">
                            {c.graphMode === 'select' && "Drag nodes or click to select. Press Delete to remove."}
                            {c.graphMode === 'add-node' && "Click empty space to add a node."}
                            {c.graphMode === 'add-edge' && "Click two nodes to make an edge"}
                            {c.graphMode === 'delete' && "Click a node or edge to delete it."}
                        </div>
                    )}
                </div>
            )}

            <div className="flex-1 overflow-auto relative">
                {c.rep === 'Graph' && renderGraph()}
                {c.rep === 'Adjacency Matrix' && renderMatrix()}
                {c.rep === 'Adjacency List' && renderList()}
            </div>
            
            {/* Traversal Info Bar */}
            {(c.graphAlgorithm) && (
                <div className="bg-white border-t p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] flex flex-col gap-3 z-20 overflow-auto max-h-48">
                    
                    {/* Queue */}
                    {(c.graphAlgorithm === 'BFS' || c.graphAlgorithm === 'TopoSort') && (
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold uppercase text-slate-500 w-24 text-right shrink-0">Queue:</span>
                            <div className="flex gap-2 flex-wrap min-h-[32px]">
                                <div className="text-slate-400 font-mono text-sm self-center">Front →</div>
                                {c.q && c.q.map((item, i) => (
                                    <div key={i} className="w-8 h-8 border bg-indigo-50 border-indigo-200 flex items-center justify-center rounded font-bold text-indigo-650 shadow-sm">{item}</div>
                                ))}
                            </div>
                        </div>
                    )}
                    {/* Stack */}
                    {c.graphAlgorithm === 'DFS' && (
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold uppercase text-slate-500 w-24 text-right shrink-0">Stack:</span>
                            <div className="flex gap-2 flex-wrap min-h-[32px]">
                                <div className="text-slate-400 font-mono text-sm self-center">Top →</div>
                                {c.s && [...c.s].reverse().map((item, i) => (
                                    <div key={i} className="w-8 h-8 border bg-rose-50 border-rose-200 flex items-center justify-center rounded font-bold text-rose-650 shadow-sm">{item}</div>
                                ))}
                            </div>
                        </div>
                    )}

                    {c.graphAlgorithm === 'Dijkstra' && (
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold uppercase text-slate-500 w-24 text-right shrink-0">PQ:</span>
                                <div className="flex gap-2 flex-wrap min-h-[32px]">
                                    {c.pq && c.pq.map((item, i) => (
                                        <div key={i} className="px-2 h-8 border bg-indigo-50 border-indigo-200 flex items-center justify-center rounded text-indigo-650 shadow-sm text-sm">
                                            <span className="font-bold">{item.id}</span>
                                            <span className="text-xs ml-1 font-mono">({item.dist === Infinity ? '∞' : item.dist})</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold uppercase text-slate-500 w-24 text-right shrink-0">Distances:</span>
                                <div className="flex gap-2 flex-wrap min-h-[32px]">
                                    {Object.entries(c.distances || {}).map(([id, dist]) => (
                                        <div key={id} className="px-2 py-1 border bg-slate-50 border-slate-200 flex items-center justify-center rounded text-slate-600 text-sm">
                                            <span className="font-bold mr-1">{id}:</span>
                                            <span className="font-mono">{dist === Infinity ? '∞' : dist}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {c.graphAlgorithm === 'Prim' && (
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold uppercase text-slate-500 w-24 text-right shrink-0">Edges (PQ):</span>
                            <div className="flex gap-2 flex-wrap min-h-[32px]">
                                {c.pq && c.pq.map((item, i) => (
                                    <div key={i} className="px-2 h-8 border bg-indigo-50 border-indigo-200 flex items-center justify-center rounded text-indigo-650 shadow-sm text-sm">
                                        <span className="font-bold">{item.source}-{item.target}</span>
                                        <span className="text-xs ml-1 font-mono">({item.weight})</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {c.graphAlgorithm === 'Kruskal' && (
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold uppercase text-slate-500 w-24 text-right shrink-0">Sets:</span>
                            <div className="flex gap-2 flex-wrap min-h-[32px]">
                                {Object.entries(c.ds || {}).map(([node, parent]) => (
                                    <div key={node} className="px-2 py-1 border bg-slate-50 border-slate-200 flex items-center justify-center rounded text-slate-600 text-sm">
                                        <span className="font-bold mr-1">{node}:</span>
                                        <span className="font-mono text-indigo-600 font-bold">{parent}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {c.graphAlgorithm === 'TopoSort' && (
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold uppercase text-slate-500 w-24 text-right shrink-0">In-Degrees:</span>
                            <div className="flex gap-2 flex-wrap min-h-[32px]">
                                {Object.entries(c.inDegrees || {}).map(([id, deg]) => (
                                    <div key={id} className="px-2 py-1 border bg-slate-50 border-slate-200 flex items-center justify-center rounded text-slate-600 text-sm">
                                        <span className="font-bold mr-1">{id}:</span>
                                        <span className="font-mono">{deg}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {c.graphAlgorithm === 'BellmanFord' && (
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold uppercase text-slate-500 w-24 text-right shrink-0">Iteration:</span>
                                <div className="flex gap-2 flex-wrap min-h-[32px] items-center text-sm font-bold text-indigo-650">
                                    {c.iteration > 0 ? `${c.iteration} / ${c.nodes.length - 1}` : 'Init'}
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-xs font-bold uppercase text-slate-500 w-24 text-right shrink-0">Distances:</span>
                                <div className="flex gap-2 flex-wrap min-h-[32px]">
                                    {Object.entries(c.distances || {}).map(([id, dist]) => (
                                        <div key={id} className="px-2 py-1 border bg-slate-50 border-slate-200 flex items-center justify-center rounded text-slate-600 text-sm">
                                            <span className="font-bold mr-1">{id}:</span>
                                            <span className="font-mono">{dist === Infinity ? '∞' : dist}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Visited Array */}
                    {(c.graphAlgorithm === 'BFS' || c.graphAlgorithm === 'DFS' || c.graphAlgorithm === 'Dijkstra' || 
                    c.graphAlgorithm === 'Prim' || c.graphAlgorithm === 'Kruskal' || c.graphAlgorithm === 'TopoSort') && (
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-bold uppercase text-slate-500 w-24 text-right shrink-0">Visited:</span>
                            <div className="flex gap-2 flex-wrap min-h-[32px]">
                                {c.vis && c.vis.map((item, i) => (
                                    <div key={i} className="w-8 h-8 border bg-emerald-50 border-emerald-300 flex items-center justify-center rounded-full font-bold text-emerald-650">{item}</div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Order display */}
                    {(c.graphAlgorithm === 'BFS' || c.graphAlgorithm === 'DFS' || c.graphAlgorithm === 'Dijkstra' || c.graphAlgorithm === 'TopoSort') && (
                        <div className="flex items-center gap-3 mt-1 pt-3 border-t min-h-[40px]">
                            <span className="text-xs font-bold uppercase text-slate-500 w-24 text-right shrink-0">Order:</span>
                            <div className="flex gap-2 text-slate-700 font-bold tracking-widest flex-wrap">
                                {c.trav && c.trav.join(' → ')}
                            </div>
                        </div>
                    )}
                    {/* MST Weight */}
                    {(c.graphAlgorithm === 'Prim' || c.graphAlgorithm === 'Kruskal') && (
                        <div className="flex items-center gap-3 mt-1 pt-3 border-t min-h-[40px]">
                            <span className="text-xs font-bold uppercase text-slate-500 w-24 text-right shrink-0">MST Weight:</span>
                            <div className="flex gap-2 text-emerald-650 font-bold tracking-widest flex-wrap text-lg">
                                {c.mst ? c.edges.filter(e => c.mst.includes(e.id)).reduce((sum, e) => sum + (parseFloat(e.weight) || 0), 0) : 0}
                            </div>
                        </div>
                    )}
                    
                </div>
            )}
        </div>
    )
}