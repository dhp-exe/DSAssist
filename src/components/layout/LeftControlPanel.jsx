import React, { useState } from 'react'
import { useStore } from '../../store/useStore'
import { GraphAlgorithms } from '../../algorithms/graphs'

export default function ControlPanel() {
  const [value, setValue] = useState('')
  const [index, setIndex] = useState('')
  const [graphStartNode, setGraphStartNode] = useState('') 

  const { 
    randomize, addAtIndex, deleteAtIndex, deleteByValue, updateAtIndex, addItem, deleteItem, 
    treeInsert, treeDelete, treeFind, bTreeDegree, setBTreeDegree,
    heapMode, setHeapMode, heapInsert, heapPop, heapBuild,
    hashMode, setHashMode, hashProbingMode, setHashProbingMode, hashInsert, hashDelete,
    isDirected, setIsDirected, isWeighted, setIsWeighted, graphRepresentation, setGraphRepresentation, 
    graphBFS, graphDFS, graphDijkstra, graphBellmanFord, graphPrim, graphKruskal, graphTopoSort,
    selectedStructure, implementationMode, setImplementationMode, data, isAnimating,
    graphEdges, graphNodes
  } = useStore()

  const negativeExists = isWeighted && graphEdges.some(e => {
    const w = parseFloat(e.weight);
    return !isNaN(w) && w < 0;
  });
  const isDAG = isDirected && GraphAlgorithms.isDAG(graphNodes, graphEdges);
  
  const isList = selectedStructure.includes('Linked List')
  const isArray = selectedStructure === 'ArrayList'
  const isStack = selectedStructure === 'Stack'
  const isQueue = selectedStructure === 'Queue'
  const isTree = selectedStructure.startsWith('Trees')
  const isHeap = selectedStructure === 'Heaps'
  const isHash = selectedStructure === 'Hash'
  const isGraph = selectedStructure === 'Graphs' || selectedStructure === 'Algorithms - DFS' || selectedStructure === 'Algorithms - BFS'

  const handleTreeInsert = () => { const v = Number(value); if (treeInsert) treeInsert(v); else addItem(v); setValue(''); }
  const handleTreeDelete = () => { const v = Number(value); if (treeDelete) treeDelete(v); else deleteItem(v); setValue(''); }
  const handleTreeFind = () => { const v = Number(value); if (treeFind) treeFind(v); }

  return (
    <div className="p-3">
        <div className="mb-2 font-semibold">Control Panel</div>

        <div className="flex flex-col gap-3 mb-4">
            {(isStack || isQueue) && (
                <div className="flex flex-col gap-1 mb-2">
                    <div className="text-xs font-semibold text-slate-500 uppercase">Implementation</div>
                    <div className="flex gap-10 bg-slate-100 p-2 rounded border">
                        <label className="text-sm flex items-center gap-1 cursor-pointer">
                            <input type="radio" value="Array" checked={implementationMode === 'Array'} onChange={() => setImplementationMode('Array')} disabled={isAnimating} /> Array
                        </label>
                        <label className="text-sm flex items-center gap-1 cursor-pointer">
                            <input type="radio" value="Linked List" checked={implementationMode === 'Linked List'} onChange={() => setImplementationMode('Linked List')} disabled={isAnimating} /> Linked List
                        </label>
                    </div>
                </div>
            )}

            {isHeap && (
                <div className="flex flex-col gap-1 mb-2">
                    <div className="text-xs font-semibold text-slate-500 uppercase">Heap Mode</div>
                    <div className="flex gap-4 bg-slate-100 p-2 rounded border">
                        <label className="text-sm flex items-center gap-1 cursor-pointer">
                            <input type="radio" value="Min" checked={heapMode === 'Min'} onChange={() => setHeapMode('Min')} disabled={isAnimating} /> Min-Heap
                        </label>
                        <label className="text-sm flex items-center gap-1 cursor-pointer">
                            <input type="radio" value="Max" checked={heapMode === 'Max'} onChange={() => setHeapMode('Max')} disabled={isAnimating} /> Max-Heap
                        </label>
                    </div>
                </div>
            )}

            {isTree && selectedStructure === 'Trees - B-Tree' && (
                <div className="flex flex-col gap-1 mb-2">
                    <div className="text-xs font-semibold text-slate-500 uppercase">Degree (t)</div>
                    <div className="flex gap-4 bg-slate-100 p-2 rounded border">
                        {[3, 4, 5].map(d => (
                            <label key={d} className="text-sm flex items-center gap-1 cursor-pointer">
                                <input type="radio" name="btree-degree" value={d} checked={bTreeDegree === d} onChange={() => setBTreeDegree(d)} disabled={isAnimating} /> {d}
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {isHash && (
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <div className="text-xs font-semibold text-slate-500 uppercase">Hash Mode</div>
                        <div className="flex flex-col gap-2 bg-slate-100 p-2 rounded border">
                            <label className="text-sm flex items-center gap-2 cursor-pointer">
                                <input type="radio" value="Open Addressing" checked={hashMode === 'Open Addressing'} onChange={() => setHashMode('Open Addressing')} disabled={isAnimating} /> Open Addressing
                            </label>
                            <label className="text-sm flex items-center gap-2 cursor-pointer">
                                <input type="radio" value="Linked-list resolution" checked={hashMode === 'Linked-list resolution'} onChange={() => setHashMode('Linked-list resolution')} disabled={isAnimating} /> Linked-list resolution
                            </label>
                            <label className="text-sm flex items-center gap-2 cursor-pointer">
                                <input type="radio" value="Bucket hashing" checked={hashMode === 'Bucket hashing'} onChange={() => setHashMode('Bucket hashing')} disabled={isAnimating} /> Bucket hashing
                            </label>
                        </div>
                    </div>

                    {hashMode === 'Open Addressing' && (
                        <div className="flex flex-col gap-1">
                            <div className="text-xs font-semibold text-slate-500 uppercase">Probing Strategy</div>
                            <div className="flex flex-col gap-2 bg-slate-100 p-2 rounded border">
                                <label className="text-sm flex items-start gap-2 cursor-pointer">
                                    <input type="radio" className="mt-1" value="Linear" checked={hashProbingMode === 'Linear'} onChange={() => setHashProbingMode('Linear')} disabled={isAnimating} />
                                    <div><div>Linear probing</div><div className="text-xs text-slate-500 font-mono">(h(k) + i) % M</div></div>
                                </label>
                                <label className="text-sm flex items-start gap-2 cursor-pointer">
                                    <input type="radio" className="mt-1" value="Quadratic" checked={hashProbingMode === 'Quadratic'} onChange={() => setHashProbingMode('Quadratic')} disabled={isAnimating} />
                                    <div><div>Quadratic probing</div><div className="text-xs text-slate-500 font-mono">(h(k) + i²) % M</div></div>
                                </label>
                                <label className="text-sm flex items-start gap-2 cursor-pointer">
                                    <input type="radio" className="mt-1" value="Double" checked={hashProbingMode === 'Double'} onChange={() => setHashProbingMode('Double')} disabled={isAnimating} />
                                    <div><div>Double hashing</div><div className="text-xs text-slate-500 font-mono">(h1(k) + i * h2(k)) % M</div></div>
                                </label>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {isGraph && (
                <div className="flex flex-col gap-3 mb-2">
                    <div className="flex flex-col gap-1">
                        <div className="text-xs font-semibold text-slate-500 uppercase">Graph Configuration</div>
                        <div className="flex gap-4 bg-slate-100 p-2 rounded border">
                            <label className="text-sm flex items-center gap-1 cursor-pointer">
                                <input type="checkbox" checked={isDirected} onChange={() => setIsDirected(!isDirected)} disabled={isAnimating} /> Directed
                            </label>
                            <label className="text-sm flex items-center gap-1 cursor-pointer">
                                <input type="checkbox" checked={isWeighted} onChange={() => setIsWeighted(!isWeighted)} disabled={isAnimating} /> Weighted
                            </label>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <div className="text-xs font-semibold text-slate-500 uppercase">Representation</div>
                        <select className="px-2 py-1 border rounded text-sm bg-white" value={graphRepresentation} onChange={(e) => setGraphRepresentation(e.target.value)} disabled={isAnimating}>
                            <option value="Graph">Visual Graph</option>
                            <option value="Adjacency Matrix">Adjacency Matrix</option>
                            <option value="Adjacency List">Adjacency List</option>
                        </select>
                    </div>
                </div>
            )}

            {!isGraph && (
                <input type="number" placeholder="Value (e.g., 42)" value={value} onChange={(e) => setValue(e.target.value)} className="px-2 py-1 border rounded w-full disabled:bg-slate-100" disabled={isAnimating} />
            )}
            
            {(isList || isArray) && (
                <input type="number" placeholder="Index (e.g., 2)" value={index} onChange={(e) => setIndex(e.target.value)} className="px-2 py-1 border rounded w-full disabled:bg-slate-100" disabled={isAnimating} />
            )}
            
            {isArray && (
                <>
                    <div className="text-xs font-semibold text-slate-500 uppercase mt-2">Array Operations</div>
                    <div className="grid grid-cols-2 gap-2">
                        <button disabled={isAnimating || !value || index===''} className="py-1 bg-emerald-500 text-white text-sm rounded disabled:opacity-50" onClick={() => { addAtIndex(Number(index), Number(value)); setValue(''); setIndex(''); }}>Add at Idx</button>
                        <button disabled={isAnimating || !value || index===''} className="py-1 bg-blue-500 text-white text-sm rounded disabled:opacity-50" onClick={() => { updateAtIndex(Number(index), Number(value)); setValue(''); setIndex(''); }}>Update at Idx</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <button disabled={isAnimating || index===''} className="py-1 bg-rose-500 text-white text-sm rounded disabled:opacity-50" onClick={() => { deleteAtIndex(Number(index)); setIndex(''); }}>Rm by Idx</button>
                        <button disabled={isAnimating || !value} className="py-1 bg-rose-500 text-white text-sm rounded disabled:opacity-50" onClick={() => { deleteByValue(Number(value)); setValue(''); }}>Rm by Val</button>
                    </div>
                </>
            )}

            {isStack && (
                <>
                    <div className="text-xs font-semibold text-slate-500 uppercase mt-2">Stack Operations</div>
                    <div className="grid grid-cols-2 gap-2">
                        <button disabled={isAnimating || !value} className="py-1 bg-emerald-500 text-white text-sm rounded disabled:opacity-50" onClick={() => { addAtIndex(0, Number(value)); setValue(''); }}>Push</button>
                        <button disabled={isAnimating || data.length === 0} className="py-1 bg-rose-500 text-white text-sm rounded disabled:opacity-50" onClick={() => { deleteAtIndex(0); }}>Pop</button>
                    </div>
                </>
            )}

            {isQueue && (
                <>
                    <div className="text-xs font-semibold text-slate-500 uppercase mt-2">Queue Operations</div>
                    <div className="grid grid-cols-2 gap-2">
                        <button disabled={isAnimating || !value} className="py-1 bg-emerald-500 text-white text-sm rounded disabled:opacity-50" onClick={() => { addAtIndex(data.length, Number(value)); setValue(''); }}>Enqueue</button>
                        <button disabled={isAnimating || data.length === 0} className="py-1 bg-rose-500 text-white text-sm rounded disabled:opacity-50" onClick={() => { deleteAtIndex(0); }}>Dequeue</button>
                    </div>
                </>
            )}

            {isList && (
                <>
                    <div className="text-xs font-semibold text-slate-500 uppercase mt-2">Add Node</div>
                    <div className="grid grid-cols-3 gap-2">
                        <button disabled={isAnimating || !value} className="py-1 bg-emerald-500 text-white text-sm rounded disabled:opacity-50" onClick={() => { addAtIndex(0, Number(value)); setValue(''); setIndex(''); }}>Head</button>
                        <button disabled={isAnimating || !value} className="py-1 bg-emerald-500 text-white text-sm rounded disabled:opacity-50" onClick={() => { addAtIndex(data.length, Number(value)); setValue(''); setIndex(''); }}>Tail</button>
                        <button disabled={isAnimating || !value || index===''} className="py-1 bg-emerald-600 text-white text-sm rounded disabled:opacity-50" onClick={() => { addAtIndex(Number(index), Number(value)); setValue(''); setIndex(''); }}>Idx</button>
                    </div>

                    <div className="text-xs font-semibold text-slate-500 uppercase mt-2">Delete Node</div>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                        <button disabled={isAnimating || data.length === 0} className="py-1 bg-rose-500 text-white text-sm rounded disabled:opacity-50" onClick={() => { deleteAtIndex(0); setIndex(''); }}>Head</button>
                        <button disabled={isAnimating || data.length === 0} className="py-1 bg-rose-500 text-white text-sm rounded disabled:opacity-50" onClick={() => { deleteAtIndex(data.length - 1); setIndex(''); }}>Tail</button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <button disabled={isAnimating || index===''} className="py-1 bg-rose-600 text-white text-sm rounded disabled:opacity-50" onClick={() => { deleteAtIndex(Number(index)); setIndex(''); }}>By Idx</button>
                        <button disabled={isAnimating || !value} className="py-1 bg-rose-600 text-white text-sm rounded disabled:opacity-50" onClick={() => { deleteByValue(Number(value)); setValue(''); setIndex(''); }}>By Val</button>
                    </div>
                </>
            )}

            {isTree && (
                <>
                    <div className="text-xs font-semibold text-slate-500 uppercase mt-2">Tree Operations</div>
                    <div className="grid grid-cols-2 gap-2">
                        <button disabled={isAnimating || !value} className="py-1 bg-emerald-500 text-white text-sm rounded disabled:opacity-50" onClick={handleTreeInsert}>Insert</button>
                        <button disabled={isAnimating || !value} className="py-1 bg-blue-500 text-white text-sm rounded disabled:opacity-50" onClick={handleTreeFind}>Find</button>
                    </div>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                        <button disabled={isAnimating || !value} className="py-1 bg-rose-500 text-white text-sm rounded disabled:opacity-50" onClick={handleTreeDelete}>Remove</button>
                    </div>
                </>
            )}

            {isHeap && (
                <>
                    <div className="text-xs font-semibold text-slate-500 uppercase mt-2">Heap Operations</div>
                    <div className="grid grid-cols-2 gap-2">
                        <button disabled={isAnimating || !value} className="py-1 bg-emerald-500 text-white text-sm rounded disabled:opacity-50" onClick={() => { heapInsert(Number(value)); setValue(''); }}>Insert</button>
                        <button disabled={isAnimating || data.length === 0} className="py-1 bg-rose-500 text-white text-sm rounded disabled:opacity-50" onClick={() => { heapPop(); }}>Pop</button>
                    </div>
                </>
            )}

            {isHash && (
                <>
                    <div className="text-xs font-semibold text-slate-500 uppercase mt-2">Hash Operations</div>
                    <div className="grid grid-cols-2 gap-2">
                        <button disabled={isAnimating || !value} className="py-1 bg-emerald-500 text-white text-sm rounded disabled:opacity-50" onClick={() => { hashInsert(Number(value)); setValue(''); }}>Insert</button>
                        <button disabled={isAnimating || !value} className="py-1 bg-rose-500 text-white text-sm rounded disabled:opacity-50" onClick={() => { hashDelete(Number(value)); setValue(''); }}>Delete</button>
                    </div>
                </>
            )}

            {isGraph && (
                <>
                    <input 
                        type="text" 
                        placeholder="Start Node (e.g. A)" 
                        value={graphStartNode} 
                        onChange={(e) => {
                            const val = e.target.value.toUpperCase();
                            if (/^[A-Z0-9]*$/.test(val)) setGraphStartNode(val);
                        }} 
                        className="px-2 py-1 border rounded w-full disabled:bg-slate-100 mb-2 font-bold text-slate-700 uppercase" 
                        disabled={isAnimating} 
                        maxLength={4}
                    />

                    <div className="text-xs font-semibold text-slate-500 uppercase mt-2 mb-2">Traversal</div>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                        <button disabled={isAnimating || !graphStartNode} className="py-1 bg-purple-500 text-white text-sm rounded disabled:opacity-50 font-semibold shadow-sm" onClick={() => graphBFS(graphStartNode)}>BFS</button>
                        <button disabled={isAnimating || !graphStartNode} className="py-1 bg-purple-600 text-white text-sm rounded disabled:opacity-50 font-semibold shadow-sm" onClick={() => graphDFS(graphStartNode)}>DFS</button>
                    </div>

                    <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Shortest Path</div>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                        <button disabled={isAnimating || !graphStartNode || !isWeighted || negativeExists} title={negativeExists ? "Negative edge exists" : !isWeighted ? "Requires Weighted Graph" : undefined} className="py-1 bg-cyan-500 text-white text-sm rounded disabled:opacity-50 font-semibold shadow-sm" onClick={() => graphDijkstra(graphStartNode)}>Dijkstra</button>
                        <button disabled={isAnimating || !graphStartNode || !isWeighted} title={!isWeighted ? "Requires Weighted Graph" : undefined} className="py-1 bg-cyan-600 text-white text-sm rounded disabled:opacity-50 font-semibold shadow-sm" onClick={() => graphBellmanFord(graphStartNode)}>Bellman-Ford</button>
                    </div>

                    <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Graph Ordering</div>
                    <div className="grid grid-cols-1 gap-2 mb-3">
                        <button disabled={isAnimating || !isDAG} title={!isDirected ? "Requires Directed Graph" : !isDAG ? "Graph contains cycles" : undefined} className="py-1 bg-orange-500 text-white text-sm rounded disabled:opacity-50 font-semibold shadow-sm" onClick={() => graphTopoSort()}>Topo Sort</button>
                    </div>
                    
                    <div className="text-xs font-semibold text-slate-500 uppercase mb-2">Minimum Spanning Tree</div>
                    <div className="grid grid-cols-2 gap-2">
                        <button disabled={isAnimating || !graphStartNode || !isWeighted || isDirected} title={isDirected ? "Requires Undirected Graph" : !isWeighted ? "Requires Weighted Graph" : undefined} className="py-1 bg-emerald-500 text-white text-sm rounded disabled:opacity-50 font-semibold shadow-sm" onClick={() => graphPrim(graphStartNode)}>Prim's</button>
                        <button disabled={isAnimating || !isWeighted || isDirected} title={isDirected ? "Requires Undirected Graph" : !isWeighted ? "Requires Weighted Graph" : undefined} className="py-1 bg-emerald-600 text-white text-sm rounded disabled:opacity-50 font-semibold shadow-sm" onClick={() => graphKruskal()}>Kruskal's</button>
                    </div>

                    <div className="text-xs text-slate-500 mt-4 bg-slate-50 p-2.5 rounded border border-slate-200">
                        <span className="font-bold text-slate-600">Tip:</span> Use the <span className="font-semibold text-indigo-500">Toolbar</span> inside the canvas map to create and delete nodes/edges.
                    </div>
                </>
            )}
        </div>

        <div className="mb-2">
            {isHeap ? (
                <button disabled={isAnimating} className="w-full py-1 bg-indigo-600 text-white rounded disabled:opacity-50 font-semibold" onClick={() => heapBuild()}>Build Heap</button>
            ) : !isGraph ? (
                <button disabled={isAnimating} className="w-full py-1 bg-slate-800 text-white rounded disabled:opacity-50" onClick={() => randomize()}>Randomize</button>
            ) : null}
        </div>
    </div>
  )
}