import { create } from 'zustand'
import { BST, AVLTree, SplayTree, RedBlackTree, BTree } from '../algorithms/trees'
import { Heap } from '../algorithms/heaps'

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

// Instant Frame Generator Hook
let frames = [];
const sleep = async (ms) => {
    const state = useStore.getState();
    if (state.isGeneratingFrames) {
        state._recordFrame();
        return Promise.resolve(); // Skip actual wait, just capture the frame instantly
    }
    return new Promise((resolve) => setTimeout(resolve, ms));
};

let nextId = 0;

export const useStore = create((set, get) => ({
    selectedStructure: 'Singly Linked List',
    implementationMode: 'Array', 
    heapMode: 'Min', 
    logs: [],
    data: [], 
    nodes: [], 
    treeActions: [],
    
    // Highlights
    highlightIndex: -1,
    highlightNodeValue: null,
    highlightIndices: [],
    highlightType: '',

    // Playback & Animation Engine
    frames: [],
    currentFrame: 0,
    playing: false,
    speedMs: 600,
    isAnimating: false, 
    isGeneratingFrames: false,
    latestOperation: null,

    // --- FRAME GENERATION ENGINE ---
    _recordFrame: () => {
        const state = get();
        frames.push({
            data: JSON.parse(JSON.stringify(state.data)),
            nodes: JSON.parse(JSON.stringify(state.nodes)),
            treeActions: JSON.parse(JSON.stringify(state.treeActions)),
            logs: [...state.logs],
            highlightIndex: state.highlightIndex,
            highlightNodeValue: state.highlightNodeValue,
            highlightIndices: [...state.highlightIndices],
            highlightType: state.highlightType
        });
    },

    _applyFrame: (frame) => {
        if (!frame) return;
        set({
            data: frame.data,
            nodes: frame.nodes,
            treeActions: frame.treeActions,
            logs: frame.logs,
            highlightIndex: frame.highlightIndex,
            highlightNodeValue: frame.highlightNodeValue,
            highlightIndices: frame.highlightIndices,
            highlightType: frame.highlightType
        });
    },

    _runWithFrames: async (operationFn, opName, args) => {
        if (get().isAnimating && !get().isGeneratingFrames) return;
        set({ playing: false, isGeneratingFrames: true });
        
        // Save initial state before operation to allow exact replays
        const initialState = {
            data: JSON.parse(JSON.stringify(get().data)),
            nodes: JSON.parse(JSON.stringify(get().nodes)),
            treeActions: JSON.parse(JSON.stringify(get().treeActions)),
            logs: [...get().logs],
            highlightIndex: -1, highlightNodeValue: null, highlightIndices: [], highlightType: ''
        };

        frames = [];
        get()._recordFrame(); // Frame 0

        await operationFn(...args);

        get()._recordFrame(); // Final frame

        set({
            isGeneratingFrames: false,
            frames: [...frames],
            currentFrame: 0,
            playing: true,
            isAnimating: true,
            latestOperation: { fn: operationFn, opName, args, initialState }
        });

        // Apply first frame to start playback cleanly
        get()._applyFrame(frames[0]);
    },

    // --- PLAYBACK CONTROLS ---
    setPlaying: (v) => set({ playing: v, isAnimating: v }),
    setSpeed: (ms) => set({ speedMs: ms }),
    stepForward: () => {
        const { currentFrame, frames } = get();
        if (frames.length === 0) return;
        if (currentFrame < frames.length - 1) {
            const nextFrame = currentFrame + 1;
            get()._applyFrame(frames[nextFrame]);
            set({ currentFrame: nextFrame, isAnimating: true });
            if (nextFrame === frames.length - 1) set({ playing: false, isAnimating: false });
        } else {
            set({ playing: false, isAnimating: false });
        }
    },
    stepBack: () => {
        const { currentFrame, frames } = get();
        if (frames.length === 0) return;
        set({ playing: false }); 
        if (currentFrame > 0) {
            const prevFrame = currentFrame - 1;
            get()._applyFrame(frames[prevFrame]);
            set({ currentFrame: prevFrame, isAnimating: prevFrame < frames.length - 1 });
        }
    },
    replay: () => {
        const { latestOperation } = get();
        if (!latestOperation) return;
        set({ playing: false });
        get()._applyFrame(latestOperation.initialState);
        setTimeout(() => { // Small delay to visually reset before playing again
            get()._runWithFrames(latestOperation.fn, latestOperation.opName, latestOperation.args);
        }, 50);
    },
    clearData: () => {
        set({
            data: [], nodes: [], treeActions: [], logs: [],
            highlightIndex: -1, highlightNodeValue: null, highlightIndices: [], highlightType: '',
            frames: [], currentFrame: 0, playing: false, isAnimating: false, latestOperation: null
        });
        get().addLog('Data cleared.');
    },

    // --- UI CONFIGURATIONS ---
    setHeapMode: (mode) => {
        set({ heapMode: mode, data: [], highlightIndices: [], frames: [], playing: false, isAnimating: false });
        get().addLog(`Switched Heap mode to ${mode}-Heap. Array cleared.`);
    },
    setImplementationMode: (mode) => {
        set({ implementationMode: mode, highlightIndex: -1, frames: [], playing: false, isAnimating: false });
        get().addLog(`Switched implementation to ${mode}`);
    },
    setStructure: (s) => {
        set({ 
            selectedStructure: s, implementationMode: 'Array', data: [], nodes: [], treeActions: [],
            highlightIndex: -1, highlightNodeValue: null, highlightIndices: [], highlightType: '',
            frames: [], currentFrame: 0, playing: false, isAnimating: false, latestOperation: null 
        });
        get().addLog(`Switched to ${s}`);
    },
    addLog: (msg) => {
        set((state) => ({ logs: [...state.logs, `${new Date().toLocaleTimeString()} - ${msg}`] }))
    },
    clearLogs: () => set({ logs: [] }),

    randomize: (count) => {
        const n = typeof count === 'number' ? count : (4 + Math.floor(Math.random() * 2))
        const arr = Array.from({ length: n }, () => randomInt(1, 100))
        set({ 
            data: arr,
            nodes: arr.map(v => ({ id: nextId++, value: v })),
            treeActions: arr.map(v => ({ op: 'insert', val: v })),
            frames: [], currentFrame: 0, playing: false, isAnimating: false, latestOperation: null
        })
        get().addLog(`Randomized with ${n} items: [${arr.join(', ')}]`)
    },

    addItem: (value) => {
        set((state) => ({ 
            data: [...state.data, value], nodes: [...state.nodes, { id: nextId++, value }],
            treeActions: [...state.treeActions, { op: 'insert', val: value }]
        }))
        get().addLog(`Added ${value}`)
    },
    deleteItem: (value) => {
        set((state) => {
            const index = state.data.indexOf(value)
            if (index === -1) { get().addLog(`Error: ${value} not found`); return state; }
            const newData = [...state.data]; const newNodes = [...state.nodes];
            newData.splice(index, 1); newNodes.splice(index, 1);
            get().addLog(`Deleted ${value}`);
            return { data: newData, nodes: newNodes, treeActions: [...state.treeActions, { op: 'delete', val: value }] }
        })
    },

    // --- PUBLIC ACTIONS (Wrapped for Frames) ---
    addAtIndex: (index, value) => get()._runWithFrames(get()._addAtIndex, 'addAtIndex', [index, value]),
    deleteByValue: (value) => get()._runWithFrames(get()._deleteByValue, 'deleteByValue', [value]),
    deleteAtIndex: (index) => get()._runWithFrames(get()._deleteAtIndex, 'deleteAtIndex', [index]),
    updateAtIndex: (index, value) => get()._runWithFrames(get()._updateAtIndex, 'updateAtIndex', [index, value]),
    treeInsert: (value) => get()._runWithFrames(get()._treeInsert, 'treeInsert', [value]),
    treeFind: (value) => get()._runWithFrames(get()._treeFind, 'treeFind', [value]),
    treeDelete: (value) => get()._runWithFrames(get()._treeDelete, 'treeDelete', [value]),
    heapBuild: () => get()._runWithFrames(get()._heapBuild, 'heapBuild', []),
    heapInsert: (value) => get()._runWithFrames(get()._heapInsert, 'heapInsert', [value]),
    heapPop: () => get()._runWithFrames(get()._heapPop, 'heapPop', []),

    // --- INTERNAL ACTION LOGIC ---
    _addAtIndex: async (index, value) => {
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

            get().addLog(`Step 3: Merging node and updating pointers`);
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
            return { nodes: newNodes, highlightIndex: -1 };
        });
    },

    _deleteByValue: async (value) => {
        const { data, speedMs, _deleteAtIndex } = get();
        if (data.length === 0) return;

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
            set({ highlightIndex: -1 });
            return;
        }

        await _deleteAtIndex(targetIndex);
    },

    _deleteAtIndex: async (index) => {
        const { data, selectedStructure, implementationMode, speedMs } = get();
        if (index < 0 || index >= data.length) return;

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
        set({ highlightIndex: -1 });
    },

    _updateAtIndex: async (index, value) => {
        const { data, speedMs } = get();
        if (index < 0 || index >= data.length) return;

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
        set({ highlightIndex: -1 });
    },

    _getTreePath: (value) => {
        const { selectedStructure, treeActions } = get();
        let tree;
        if (selectedStructure === 'Trees - AVL') tree = new AVLTree();
        else if (selectedStructure === 'Trees - Red-Black') tree = new RedBlackTree();
        else if (selectedStructure === 'Trees - Splay') tree = new SplayTree();
        else if (selectedStructure === 'Trees - B-Tree') tree = new BTree(2);
        else tree = new BST();

        treeActions.forEach(a => {
            if (a.op === 'insert') tree.insert(a.val);
            else if (a.op === 'delete' && tree.delete) tree.delete(a.val);
            else if (a.op === 'find' && tree.searchPath) tree.searchPath(a.val);
        });

        return tree.searchPath ? tree.searchPath(value) : []; 
    },

    _treeInsert: async (value) => {
        const speed = get().speedMs;

        get().addLog(`Phase 1: Traversing from root to find insertion point...`);
        const path = get()._getTreePath(value);
        
        for (let val of path) {
            set({ highlightNodeValue: val });
            await sleep(speed / 1.5);
        }

        get().addLog(`Phase 2: Inserting node and restructuring (if applicable)...`);
        
        set((state) => ({ 
            treeActions: [...state.treeActions, { op: 'insert', val: value }],
            data: [...state.data, value], 
            highlightNodeValue: value
        }));
        
        await sleep(speed * 1.5);
        set({ highlightNodeValue: null });
    },

    _treeFind: async (value) => {
        const speed = get().speedMs;

        get().addLog(`Phase 1: Traversing from root to search for ${value}...`);
        const path = get()._getTreePath(value);
        
        for (let val of path) {
            set({ highlightNodeValue: val });
            await sleep(speed / 1.5);
        }

        const isFound = path.length > 0 && String(path[path.length - 1]).includes(String(value));

        if (isFound) get().addLog(`Phase 2: Found ${value}! Restructuring...`);
        else get().addLog(`Phase 2: ${value} not found. Restructuring from last accessed...`);

        set((state) => ({ 
            treeActions: [...state.treeActions, { op: 'find', val: value }],
            highlightNodeValue: isFound ? `FOUND-${value}` : null 
        }));
        
        await sleep(speed * 2);
        set({ highlightNodeValue: null });
    },

    _treeDelete: async (value) => {
        const speed = get().speedMs;

        get().addLog(`Phase 1: Traversing from root to locate ${value} for deletion...`);
        const path = get()._getTreePath(value);
        
        for (let val of path) {
            set({ highlightNodeValue: val });
            await sleep(speed / 1.5);
        }

        if (path.length === 0 || !String(path[path.length - 1]).includes(String(value))) {
            get().addLog(`Cannot delete: ${value} not found.`);
            set({ highlightNodeValue: null });
            return;
        }

        get().addLog(`Phase 2: Removing node and merging subtrees/rebalancing...`);

        set((state) => ({ 
            treeActions: [...state.treeActions, { op: 'delete', val: value }],
            data: state.data.filter(v => v !== value),
            highlightNodeValue: null
        }));
        
        await sleep(speed);
    },

    _heapBuild: async () => {
        set({ highlightIndices: [] });
        const speed = get().speedMs;
        
        const n = 10 + Math.floor(Math.random() * 6);
        const arr = Array.from({ length: n }, () => randomInt(1, 99));
        
        get().addLog(`Building ${get().heapMode}-Heap with [${arr.join(', ')}]`);
        set({ data: [...arr] });
        await sleep(speed);

        const tracker = new Heap(get().heapMode);
        const workArr = [...arr];
        const steps = tracker.buildHeap(workArr);

        for (let step of steps) {
            if (step.op === 'compare') {
                set({ highlightIndices: [step.i, step.j], highlightType: 'compare' });
                await sleep(speed);
            } else if (step.op === 'swap') {
                set({ highlightIndices: [step.i, step.j], highlightType: 'swap' });
                await sleep(speed);
                set(state => {
                    const nd = [...state.data];
                    [nd[step.i], nd[step.j]] = [nd[step.j], nd[step.i]];
                    return { data: nd };
                });
                await sleep(speed);
            }
        }
        
        set({ highlightIndices: [] });
        get().addLog(`Heap build complete.`);
    },

    _heapInsert: async (value) => {
        set({ highlightIndices: [] });
        const speed = get().speedMs;
        const tracker = new Heap(get().heapMode);
        
        get().addLog(`Inserting ${value} into ${get().heapMode}-Heap...`);
        
        const workArr = [...get().data];
        const steps = tracker.insert(workArr, value);
        
        for (let step of steps) {
            if (step.op === 'insert') {
                set(state => ({ data: [...state.data, step.val], highlightIndices: [step.i], highlightType: 'insert' }));
                await sleep(speed);
            } else if (step.op === 'compare') {
                set({ highlightIndices: [step.i, step.j], highlightType: 'compare' });
                await sleep(speed);
            } else if (step.op === 'swap') {
                set({ highlightIndices: [step.i, step.j], highlightType: 'swap' });
                await sleep(speed);
                set(state => {
                    const nd = [...state.data];
                    [nd[step.i], nd[step.j]] = [nd[step.j], nd[step.i]];
                    return { data: nd };
                });
                await sleep(speed);
            }
        }
        
        set({ highlightIndices: [], highlightType: '' });
        get().addLog(`Inserted ${value}.`);
    },

    _heapPop: async () => {
        if (get().data.length === 0) return;
        set({ highlightIndices: [] });
        const speed = get().speedMs;
        const tracker = new Heap(get().heapMode);
        
        get().addLog(`Popping root from ${get().heapMode}-Heap...`);
        
        const workArr = [...get().data];
        const steps = tracker.pop(workArr);
        
        for (let step of steps) {
            if (step.op === 'compare') {
                set({ highlightIndices: [step.i, step.j], highlightType: 'compare' });
                await sleep(speed);
            } else if (step.op === 'swap') {
                set({ highlightIndices: [step.i, step.j], highlightType: 'swap' });
                await sleep(speed);
                set(state => {
                    const nd = [...state.data];
                    [nd[step.i], nd[step.j]] = [nd[step.j], nd[step.i]];
                    return { data: nd };
                });
                await sleep(speed);
            } else if (step.op === 'pop') {
                set({ highlightIndices: [step.i], highlightType: 'pop' });
                await sleep(speed);
                set(state => {
                    const nd = [...state.data];
                    nd.pop(); 
                    return { data: nd };
                });
            }
        }
        
        set({ highlightIndices: [], highlightType: '' });
        get().addLog(`Pop complete.`);
    },
}))

export default useStore