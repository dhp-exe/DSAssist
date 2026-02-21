import React, { useState } from 'react'
import { useStore } from '../../store/useStore'

export default function ControlPanel() {
  const [value, setValue] = useState('')
  const addItem = useStore((s) => s.addItem)
  const deleteItem = useStore((s) => s.deleteItem)
  const randomize = useStore((s) => s.randomize)

  return (
    <div className="p-3">
        <div className="mb-2 font-semibold">Control Panel</div>

        <div className="flex gap-2 items-center mb-2">
            <input
            type="number"
            min="1"
            max="9999"
            placeholder="value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="px-2 py-1 border rounded w-24"
            />
            <button
            className="px-3 py-1 bg-green-500 text-white rounded"
            onClick={() => {
                const v = Number(value)
                if (!isNaN(v)) addItem(v)
                setValue('')
            }}
            >
            +
            </button>
            <button
            className="px-3 py-1 bg-red-500 text-white rounded"
            onClick={() => {
                const v = Number(value)
                if (!isNaN(v)) deleteItem(v)
                setValue('')
            }}
            >
            -
            </button>
        </div>

        <div className="mb-2">
            <button
            className="px-3 py-1 bg-blue-600 text-white rounded"
            onClick={() => randomize()}
            >
            Randomize
            </button>
        </div>

        <div className="text-sm text-slate-600">Use + to append, - to delete.</div>
    </div>
  )
}
