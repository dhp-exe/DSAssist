import { create } from 'zustand'
import { BST, AVLTree, SplayTree, RedBlackTree, BTree } from '../algorithms/trees'

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

let nextId = 0;

export const useStore = create((set, get) => ({
    selectedStructure: 'Singly Linked List',
    implementationMode: 'Array', // 'Array' or 'Linked List'
    logs: [],
    data: [], 
    nodes: [], 

    playing: false,
    speedMs: 600,
    currentStep: 0,
    highlightIndex: -1,
    isAnimating: false, 

    setImplementationMode: (mode) => {
        set({ implementationMode: mode, highlightIndex: -1 });
        get().addLog(`Switched implementation to ${mode}`);
    },

    setStructure: (s) => {
        set({ 
            selectedStructure: s, 
            implementationMode: 'Array', // Reset to Array default
            data: [], 
            nodes: [], 
            treeActions: [],
            highlightIndex: -1,
            highlightNodeValue: null 
        });
        get().addLog(`Switched to ${s}`);
    },

    addLog: (msg) => {
        set((state) => ({ logs: [...state.logs, `${new Date().toLocaleTimeString()} - ${msg}`] }))
    },

    clearLogs: () => set({ logs: [] }),

    setData: (arr) => set({ 
        data: arr, 
        nodes: arr.map(v => ({ id: nextId++, value: v })),
        treeActions: arr.map(v => ({ op: 'insert', val: v })) 
    }),

    addItem: (value) => {
        set((state) => ({ 
            data: [...state.data, value],
            nodes: [...state.nodes, { id: nextId++, value }],
            treeActions: [...state.treeActions, { op: 'insert', val: value }]
        }))
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
            const newNodes = [...state.nodes]
            newData.splice(index, 1)
            newNodes.splice(index, 1)
            get().addLog(`Deleted ${value}`)
            return { 
                data: newData, 
                nodes: newNodes, 
                treeActions: [...state.treeActions, { op: 'delete', val: value }] 
            }
        })
    },

    randomize: (count) => {
        const n = typeof count === 'number' ? count : (4 + Math.floor(Math.random() * 2))
        const arr = Array.from({ length: n }, () => randomInt(1, 100))
        set({ 
            data: arr,
            nodes: arr.map(v => ({ id: nextId++, value: v })),
            treeActions: arr.map(v => ({ op: 'insert', val: v })) 
        })
        get().addLog(`Randomized with ${n} items: [${arr.join(', ')}]`)
    },

    addAtIndex: async (index, value) => {
        if (get().isAnimating) return;
        set({ isAnimating: true });

        const { selectedStructure, implementationMode, speedMs, data, nodes } = get();
        const isStack = selectedStructure === 'Stack';
        const isQueue = selectedStructure === 'Queue';

        const isList = selectedStructure.includes('Linked List') || ((isStack || isQueue) && implementationMode === 'Linked List');
        const isArray = selectedStructure === 'ArrayList';
        const isStackAnim = isStack && implementationMode === 'Array';
        const isQueueAnim = isQueue && implementationMode === 'Array';
        
        let target = Math.min(index, data.length);
        target = Math.max(0, target);

        if (isList) {
            if (target === data.length && data.length > 0) {
                get().addLog(`Using Tail pointer to instantly insert at the end...`);
                set({ highlightIndex: target - 1 });
                await sleep(speedMs);
            } else if (target > 0) {
                get().addLog(`Traversing to index ${target - 1} to find insertion point...`);
                for (let i = 0; i < target; i++) {
                    set({ highlightIndex: i });
                    await sleep(speedMs);
                }
            }
        }

        const stagedId = nextId++;

        if (isList) {
            get().addLog(`Step 1: Creating new node (${value}) in memory`);
            set((state) => {
                const newData = [...state.data];
                const newNodes = [...state.nodes];
                newData.splice(target, 0, value);
                newNodes.splice(target, 0, { id: stagedId, value, isStaged: true, phase: 'appear' });
                return { data: newData, nodes: newNodes, highlightIndex: target };
            });
            await sleep(1500);

            if (nodes.length > 0) {
                get().addLog(`Step 2: Pointing new node to the existing structure`);
                set((state) => {
                    const newNodes = state.nodes.map(n => n.id === stagedId ? { ...n, phase: 'link' } : n);
                    return { nodes: newNodes };
                });
                await sleep(1500); 
            }

            get().addLog(`Step 3: Merging node and updating Head/Tail pointers`);
        } else if (isArray) {
            if (target < data.length) {
                get().addLog(`Shifting elements right to make space for ${value}...`);
                for (let i = data.length - 1; i >= target; i--) {
                    set({ highlightIndex: i });
                    await sleep(speedMs / 1.5);
                }
            }
            get().addLog(`Inserting ${value} at index ${target}`);
            set((state) => {
                const newData = [...state.data];
                const newNodes = [...state.nodes];
                newData.splice(target, 0, value);
                newNodes.splice(target, 0, { id: stagedId, value });
                return { data: newData, nodes: newNodes, highlightIndex: target };
            });
            await sleep(speedMs);
        } else if (isStackAnim) {
            get().addLog(`Pushing ${value} onto the stack`);
            set((state) => {
                const newData = [value, ...state.data];
                const newNodes = [{ id: stagedId, value }, ...state.nodes];
                return { data: newData, nodes: newNodes, highlightIndex: 0 };
            });
            await sleep(speedMs);
        } else if (isQueueAnim) {
            get().addLog(`Enqueueing ${value} to the back`);
            set((state) => {
                const newData = [...state.data, value];
                const newNodes = [...state.nodes, { id: stagedId, value }];
                return { data: newData, nodes: newNodes, highlightIndex: state.data.length };
            });
            await sleep(speedMs);
        }

        set((state) => {
            const newNodes = state.nodes.map(n => n.id === stagedId ? { id: n.id, value: n.value } : n);
            return { nodes: newNodes, highlightIndex: -1, isAnimating: false };
        });
    },

    deleteByValue: async (value) => {
        if (get().isAnimating) return;
        const { data, speedMs, deleteAtIndex } = get();
        
        if (data.length === 0) return;
        set({ isAnimating: true });

        get().addLog(`Searching for value ${value} to delete...`);
        let targetIndex = -1;

        for (let i = 0; i < data.length; i++) {
            set({ highlightIndex: i });
            await sleep(speedMs / 1.5);
            if (data[i] === value) {
                targetIndex = i;
                get().addLog(`Found ${value} at index ${i}`);
                break;
            }
        }

        if (targetIndex === -1) {
            get().addLog(`Value ${value} not found.`);
            set({ highlightIndex: -1, isAnimating: false });
            return;
        }

        set({ isAnimating: false });
        await deleteAtIndex(targetIndex);
    },

    deleteAtIndex: async (index) => {
        if (get().isAnimating) return;
        const { data, selectedStructure, implementationMode, speedMs } = get();
        
        if (index < 0 || index >= data.length) return;

        set({ isAnimating: true });
        
        const isDoubly = selectedStructure === 'Doubly Linked List';
        const isStack = selectedStructure === 'Stack';
        const isQueue = selectedStructure === 'Queue';
        
        const isList = selectedStructure.includes('Linked List') || ((isStack || isQueue) && implementationMode === 'Linked List');
        const isArray = selectedStructure === 'ArrayList';
        const isStackAnim = isStack && implementationMode === 'Array';
        const isQueueAnim = isQueue && implementationMode === 'Array';

        if (isList) {
            if (isDoubly && index === data.length - 1 && data.length > 0) {
                get().addLog(`Using Tail pointer to find node to delete...`);
                set({ highlightIndex: index });
                await sleep(speedMs);
            } else {
                get().addLog(`Traversing to index ${index} to find node to delete...`);
                for (let i = 0; i <= index; i++) {
                    set({ highlightIndex: i });
                    await sleep(speedMs);
                }
            }

            get().addLog(`Step 1: Identified node ${data[index]} for removal`);
            set((state) => {
                const newNodes = [...state.nodes];
                newNodes[index] = { ...newNodes[index], isStaged: true, phase: 'unlink' };
                return { nodes: newNodes };
            });
            await sleep(1500);

            get().addLog(`Step 2: Bypassing pointers around the node`);
            set((state) => {
                const newNodes = [...state.nodes];
                newNodes[index] = { ...newNodes[index], phase: 'bypass' };
                return { nodes: newNodes };
            });
            await sleep(1500);

            get().addLog(`Step 3: Node deleted from memory`);
        } else if (isArray) {
            get().addLog(`Removing element at index ${index}`);
            set({ highlightIndex: index });
            await sleep(speedMs);
        } else if (isStackAnim) {
            get().addLog(`Popping top element from the stack`);
            set({ highlightIndex: 0 });
            await sleep(speedMs);
        } else if (isQueueAnim) {
            get().addLog(`Dequeueing front element from the queue`);
            set({ highlightIndex: 0 });
            await sleep(speedMs);
        }

        set((state) => {
            const newData = [...state.data];
            const newNodes = [...state.nodes];
            newData.splice(index, 1);
            newNodes.splice(index, 1);
            return { data: newData, nodes: newNodes, highlightIndex: index }; 
        });

        if (isArray && index < data.length - 1) {
            await sleep(speedMs / 1.5);
            get().addLog(`Shifting remaining elements left...`);
            for (let i = index; i < get().data.length; i++) {
                set({ highlightIndex: i });
                await sleep(speedMs / 1.5);
            }
        }

        await sleep(500);
        set({ highlightIndex: -1, isAnimating: false });
    },

    updateAtIndex: async (index, value) => {
        if (get().isAnimating) return;
        const { data, speedMs } = get();
        if (index < 0 || index >= data.length) return;

        set({ isAnimating: true });
        get().addLog(`Updating index ${index} to ${value}...`);
        
        set({ highlightIndex: index });
        await sleep(speedMs);

        set((state) => {
            const newData = [...state.data];
            const newNodes = [...state.nodes];
            newData[index] = value;
            newNodes[index] = { ...newNodes[index], value };
            return { data: newData, nodes: newNodes };
        });

        await sleep(speedMs);
        set({ highlightIndex: -1, isAnimating: false });
    },

    // --- PLAYBACK CONTROLS ---
    setPlaying: (v) => set({ playing: v }),
    setSpeed: (ms) => set({ speedMs: ms }),
    setCurrentStep: (i) => set({ currentStep: i }),
    setHighlight: (i) => set({ highlightIndex: i }),
    stepForward: () => {
        const s = get()
        const next = s.currentStep + 1
        if (next >= s.data.length) {
            set({ playing: false, currentStep: s.data.length - 1, highlightIndex: s.data.length - 1 })
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
    },

    treeActions: [], // Crucial for Splay Tree: retains sequence of operations (Insert/Search)
    highlightNodeValue: null,

    // Add this helper internally
    _getTreePath: (value) => {
        const { selectedStructure, treeActions } = get();
        let tree;
        if (selectedStructure === 'Trees - AVL') tree = new AVLTree();
        else if (selectedStructure === 'Trees - Red-Black') tree = new RedBlackTree();
        else if (selectedStructure === 'Trees - Splay') tree = new SplayTree();
        else if (selectedStructure === 'Trees - B-Tree') tree = new BTree(2);
        else tree = new BST();

        // Replay history to get current tree state
        treeActions.forEach(a => {
            if (a.op === 'insert') tree.insert(a.val);
            else if (a.op === 'delete' && tree.delete) tree.delete(a.val);
            else if (a.op === 'find' && tree.searchPath) tree.searchPath(a.val);
        });

        // Simulates the path traversal before action applies
        return tree.searchPath ? tree.searchPath(value) : []; 
    },

    treeInsert: async (value) => {
        if (get().isAnimating) return;
        set({ isAnimating: true });
        const speed = get().speedMs;

        get().addLog(`Phase 1: Traversing from root to find insertion point...`);
        const path = get()._getTreePath(value);
        
        // Phase 1: Animate traversal
        for (let val of path) {
            set({ highlightNodeValue: val });
            await sleep(speed / 1.5);
        }

        get().addLog(`Phase 2: Inserting node and restructuring (if applicable)...`);
        
        // Phase 2: Restructure (Splay kicks in here via treeActions replay in UI)
        set((state) => ({ 
            treeActions: [...state.treeActions, { op: 'insert', val: value }],
            data: [...state.data, value], 
            highlightNodeValue: value // Highlight the final resulting node
        }));
        
        await sleep(speed * 1.5);
        set({ highlightNodeValue: null, isAnimating: false });
    },

    treeFind: async (value) => {
        if (get().isAnimating) return;
        set({ isAnimating: true });
        const speed = get().speedMs;

        get().addLog(`Phase 1: Traversing from root to search for ${value}...`);
        const path = get()._getTreePath(value);
        
        // Phase 1: Animate traversal
        for (let val of path) {
            set({ highlightNodeValue: val });
            await sleep(speed / 1.5);
        }

        const isFound = path.length > 0 && String(path[path.length - 1]).includes(String(value));

        if (isFound) get().addLog(`Phase 2: Found ${value}! Restructuring...`);
        else get().addLog(`Phase 2: ${value} not found. Restructuring from last accessed...`);

        // Phase 2: Record find operation (Crucial for Splay Tree to move node/parent to root)
        set((state) => ({ 
            treeActions: [...state.treeActions, { op: 'find', val: value }],
            highlightNodeValue: isFound ? `FOUND-${value}` : null 
        }));
        
        await sleep(speed * 2);
        set({ highlightNodeValue: null, isAnimating: false });
    },

    treeDelete: async (value) => {
        if (get().isAnimating) return;
        set({ isAnimating: true });
        const speed = get().speedMs;

        get().addLog(`Phase 1: Traversing from root to locate ${value} for deletion...`);
        const path = get()._getTreePath(value);
        
        // Phase 1: Animate traversal
        for (let val of path) {
            set({ highlightNodeValue: val });
            await sleep(speed / 1.5);
        }

        if (path.length === 0 || !String(path[path.length - 1]).includes(String(value))) {
            get().addLog(`Cannot delete: ${value} not found.`);
            set({ highlightNodeValue: null, isAnimating: false });
            return;
        }

        get().addLog(`Phase 2: Removing node and merging subtrees/rebalancing...`);

        // Phase 2: Restructure
        set((state) => ({ 
            treeActions: [...state.treeActions, { op: 'delete', val: value }],
            data: state.data.filter(v => v !== value),
            highlightNodeValue: null
        }));
        
        await sleep(speed);
        set({ isAnimating: false });
    },
}))

export default useStore