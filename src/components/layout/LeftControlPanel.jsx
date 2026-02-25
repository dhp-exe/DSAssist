import React, { useState } from 'react'
import { useStore } from '../../store/useStore'

export default function ControlPanel() {
  const [value, setValue] = useState('')
  const [index, setIndex] = useState('')
  const { 
    randomize, addAtIndex, deleteAtIndex, deleteByValue, updateAtIndex, addItem, deleteItem, 
    treeInsert, treeDelete, treeFind,
    heapMode, setHeapMode, heapInsert, heapPop, heapBuild,
    selectedStructure, implementationMode, setImplementationMode, data, isAnimating 
  } = useStore()

  const isList = selectedStructure.includes('Linked List')
  const isArray = selectedStructure === 'ArrayList'
  const isStack = selectedStructure === 'Stack'
  const isQueue = selectedStructure === 'Queue'
  const isTree = selectedStructure.startsWith('Trees')
  const isHeap = selectedStructure === 'Heaps'

  const handleTreeInsert = () => {
      const v = Number(value)
      if (treeInsert) treeInsert(v);
      else addItem(v); 
      setValue('');
  }

  const handleTreeDelete = () => {
      const v = Number(value)
      if (treeDelete) treeDelete(v);
      else deleteItem(v); 
      setValue('');
  }

  const handleTreeFind = () => {
      const v = Number(value)
      if (treeFind) treeFind(v);
      else console.log(`Find ${v} not implemented in store yet`);
  }

  return (
    <div className="p-3">
        <div className="mb-2 font-semibold">Control Panel</div>

        <div className="flex flex-col gap-3 mb-4">
            {(isStack || isQueue) && (
                <div className="flex flex-col gap-1 mb-2">
                    <div className="text-xs font-semibold text-slate-500 uppercase">Implementation</div>
                    <div className="flex gap-10 bg-slate-100 p-2 rounded border">
                        <label className="text-sm flex items-center gap-1 cursor-pointer">
                            <input
                                type="radio"
                                name="implementation"
                                value="Array"
                                checked={implementationMode === 'Array'}
                                onChange={() => setImplementationMode('Array')}
                                disabled={isAnimating}
                            />
                            Array
                        </label>
                        <label className="text-sm flex items-center gap-1 cursor-pointer">
                            <input
                                type="radio"
                                name="implementation"
                                value="Linked List"
                                checked={implementationMode === 'Linked List'}
                                onChange={() => setImplementationMode('Linked List')}
                                disabled={isAnimating}
                            />
                            Linked List
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

            <input
                type="number"
                placeholder="Value (e.g., 42)"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="px-2 py-1 border rounded w-full disabled:bg-slate-100"
                disabled={isAnimating}
            />
            
            {(isList || isArray) && (
                <input
                    type="number"
                    placeholder="Index (e.g., 2)"
                    value={index}
                    onChange={(e) => setIndex(e.target.value)}
                    className="px-2 py-1 border rounded w-full disabled:bg-slate-100"
                    disabled={isAnimating}
                />
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
        </div>

        <div className="mb-2">
            {isHeap ? (
                <button disabled={isAnimating} className="w-full py-1 bg-indigo-600 text-white rounded disabled:opacity-50 font-semibold" onClick={() => heapBuild()}>
                    Build Heap
                </button>
            ) : (
                <button disabled={isAnimating} className="w-full py-1 bg-slate-800 text-white rounded disabled:opacity-50" onClick={() => randomize()}>
                    Randomize
                </button>
            )}
        </div>
    </div>
  )
}