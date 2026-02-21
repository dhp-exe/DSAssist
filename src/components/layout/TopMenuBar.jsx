import React from 'react'
import { useStore } from '../../store/useStore'

const OPTIONS = [
  'ArrayList',
  'Singly Linked List',
  'Doubly Linked List',
  'Stack',
  'Queue',
  'Trees - BST',
  'Trees - AVL',
  'Trees - Red-Black',
  'Heaps',
  'Hash',
  'Graphs',
  'Algorithms - DFS',
  'Algorithms - BFS',
  'Algorithms - Sorting',
  "Algorithms - Dijkstra"
]

export default function TopMenu() {
  const selectedStructure = useStore((s) => s.selectedStructure)
  const setStructure = useStore((s) => s.setStructure)

  return (
    <div className="flex items-center gap-4 p-3 bg-slate-50 border-b">
      <div className="font-semibold">DSAssist</div>
      <select
        value={selectedStructure}
        onChange={(e) => setStructure(e.target.value)}
        className="px-3 py-1 border rounded"
      >
        {OPTIONS.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  )
}
