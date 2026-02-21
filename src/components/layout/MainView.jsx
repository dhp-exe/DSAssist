import React from 'react'
import { useStore } from '../../store/useStore'
import PlaybackToolbar from '../PlaybackToolbar'
import LinearVisualizer from '../visualizers/LinearVisualizer'

export default function MainView() {
  const selected = useStore((s) => s.selectedStructure)

  const linearTypes = ['Singly Linked List', 'Doubly Linked List', 'ArrayList', 'Stack', 'Queue']

  return (
    <div className="h-full flex flex-col">
      <PlaybackToolbar />
      <div className="flex-1 p-4">
        {linearTypes.includes(selected) ? (
          <LinearVisualizer type={selected} />
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500">
            Visualization for "{selected}" is not implemented yet.
          </div>
        )}
      </div>
    </div>
  )
}
