import { create } from 'zustand'

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

export const useStore = create((set, get) => ({
    selectedStructure: 'Singly Linked List',
    logs: [],
    data: [],

    // Playback state for algorithm visualization
    playing: false,
    speedMs: 600,
    currentStep: 0,
    highlightIndex: -1,

    setStructure: (s) => {
        set({ selectedStructure: s })
        get().addLog(`Switched to ${s}`)
    },

    addLog: (msg) => {
        set((state) => ({ logs: [...state.logs, `${new Date().toLocaleTimeString()} - ${msg}`] }))
    },

    clearLogs: () => set({ logs: [] }),

    // data operations (generic array used by many visualizers)
    setData: (arr) => set({ data: arr }),

    addItem: (value) => {
        set((state) => ({ data: [...state.data, value] }))
        get().addLog(`Added ${value}`)
    },

    deleteItem: (value) => {
        set((state) => {
            const index = state.data.indexOf(value)

            if (index === -1) {
                get().addLog(`Error: ${value} not found`)
                return state
            }

            const newData = [...state.data]
            newData.splice(index, 1)

            get().addLog(`Deleted ${value}`)

            return { data: newData }
        })
    },

    randomize: (count) => {
        const n = typeof count === 'number' ? count : (4 + Math.floor(Math.random() * 2))
        const arr = Array.from({ length: n }, () => randomInt(1, 100))
        set({ data: arr })
        get().addLog(`Randomized with ${n} items: [${arr.join(', ')}]`)
    },

    // Playback controls
    setPlaying: (v) => set({ playing: v }),
    setSpeed: (ms) => set({ speedMs: ms }),
    setCurrentStep: (i) => set({ currentStep: i }),
    setHighlight: (i) => set({ highlightIndex: i }),
    stepForward: () => {
        const s = get()
        const next = s.currentStep + 1
        if (next >= s.data.length) {
        // stop at end
        set({ playing: false, currentStep: s.data.length - 1 })
        set({ highlightIndex: s.data.length - 1 })
        return
        }
        set({ currentStep: next, highlightIndex: next })
    },
    stepBack: () => {
        const s = get()
        const prev = Math.max(0, s.currentStep - 1)
        set({ currentStep: prev, highlightIndex: prev })
    },
    resetPlayback: () => {
        set({ playing: false, currentStep: 0, highlightIndex: -1 })
    }
}))

export default useStore
