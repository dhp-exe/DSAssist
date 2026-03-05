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
  'Trees - Splay',
  'Trees - Red-Black',
  'Trees - B-Tree',
  'Heaps',
  'Hash',
  'Graphs',
]

export default function TopMenu() {
  const selectedStructure = useStore((s) => s.selectedStructure)
  const setStructure = useStore((s) => s.setStructure)

  return (
    <div className="flex items-center gap-2 md:gap-4 p-1.5 md:p-3 bg-slate-50 border-b md:ml-4">
      <div className="font-semibold text-sm md:text-base ml-2 md:ml-0 hidden sm:block">DSAssist</div>
      <select
        value={selectedStructure}
        onChange={(e) => setStructure(e.target.value)}
        className="px-2 py-1 md:px-3 md:py-1 text-sm md:text-base border rounded"
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
