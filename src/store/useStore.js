import { create } from 'zustand'
import { BST, AVLTree, SplayTree, RedBlackTree, BTree } from '../algorithms/trees'
import { Heap } from '../algorithms/heaps'
import { Hash } from '../algorithms/hash'
import { GraphAlgorithms } from '../algorithms/graphs'
import { SearchAlgorithms } from '../algorithms/search'
import { SortingAlgorithms } from '../algorithms/sorting'

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

const getEmptyHashTable = (mode) => {
    if (mode === 'Open Addressing') return Array(10).fill(null);
    return Array.from({ length: 10 }, () => []);
};

// Default Graph Map
const initialGraphNodes = [
    { id: 'A', x: 200, y: 150 },
    { id: 'B', x: 400, y: 100 },
    { id: 'C', x: 450, y: 250 },
    { id: 'D', x: 250, y: 300 },
];
const initialGraphEdges = [
    { id: 'A-B', source: 'A', target: 'B', weight: '1' },
    { id: 'B-C', source: 'B', target: 'C', weight: '2' },
    { id: 'A-D', source: 'A', target: 'D', weight: '3' },
    { id: 'D-C', source: 'D', target: 'C', weight: '4' },
];

// Instant Frame Generator Hook
let frames = [];
const sleep = async (ms) => {
    const state = useStore.getState();
    if (state.isGeneratingFrames) {
        state._recordFrame();
        return Promise.resolve(); 
    }
    return new Promise((resolve) => setTimeout(resolve, ms));
};

let nextId = 0;

export const useStore = create((set, get) => ({
    selectedStructure: 'ArrayList',
    implementationMode: 'Array', 
    heapMode: 'Min', 
    bTreeDegree: 3,
    hashMode: 'Open Addressing', 
    hashProbingMode: 'Linear',
    hashTable: getEmptyHashTable('Open Addressing'),
    stagedHashValue: null,

    // GRAPHS
    isDirected: false,
    isWeighted: false,
    graphRepresentation: 'Graph',
    graphNodes: initialGraphNodes,
    graphEdges: initialGraphEdges,
    
    // Graph Interaction State
    graphMode: 'select', 
    graphSelectedNode: null,
    graphSelectedEdge: null,
    graphEdgeSource: null,
    showGraphGuide: false,
    
    // Graph Anim Hooks
    graphAlgorithm: null, 
    graphQueue: [],
    graphStack: [],
    graphPQ: [],
    graphDistances: {},
    graphInDegrees: {},
    graphIteration: 0,
    graphVisited: [],
    graphTraversal: [],
    graphMSTEdges: [],
    graphDisjointSets: {},
    graphHighlightNodes: [],
    graphHighlightEdges: [],
    graphHighlightBackEdges: [],

    logs: [],
    data: [], 
    nodes: [], 
    treeActions: [],
    
    // Highlights & Search
    highlightIndex: -1,
    highlightNodeValue: null,
    highlightIndices: [],
    highlightType: '',
    searchLeft: null,
    searchRight: null,
    searchMid: null,
    searchResult: null,
    sortI: null,
    sortJ: null,
    sortK: null,
    sortPivot: null,
    sortMin: null,
    sortedIndices: [],
    sortChunks: [],

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
            data: JSON.parse(JSON.stringify(state.data)), nodes: JSON.parse(JSON.stringify(state.nodes)), treeActions: JSON.parse(JSON.stringify(state.treeActions)),
            hashTable: JSON.parse(JSON.stringify(state.hashTable)), hashMode: state.hashMode, hashProbingMode: state.hashProbingMode, stagedHashValue: state.stagedHashValue,
            
            isDirected: state.isDirected, isWeighted: state.isWeighted, graphRepresentation: state.graphRepresentation,
            graphNodes: JSON.parse(JSON.stringify(state.graphNodes)), graphEdges: JSON.parse(JSON.stringify(state.graphEdges)), 
            graphMode: state.graphMode, graphSelectedNode: state.graphSelectedNode, graphSelectedEdge: state.graphSelectedEdge, graphEdgeSource: state.graphEdgeSource, showGraphGuide: state.showGraphGuide,
            
            graphAlgorithm: state.graphAlgorithm, graphQueue: [...state.graphQueue], graphStack: [...state.graphStack], 
            graphPQ: JSON.parse(JSON.stringify(state.graphPQ)), graphDistances: JSON.parse(JSON.stringify(state.graphDistances)),
            graphInDegrees: JSON.parse(JSON.stringify(state.graphInDegrees)), graphIteration: state.graphIteration,
            graphVisited: [...state.graphVisited], graphTraversal: [...state.graphTraversal],
            graphMSTEdges: [...state.graphMSTEdges], graphDisjointSets: JSON.parse(JSON.stringify(state.graphDisjointSets)),
            graphHighlightNodes: [...state.graphHighlightNodes], graphHighlightEdges: [...state.graphHighlightEdges], graphHighlightBackEdges: JSON.parse(JSON.stringify(state.graphHighlightBackEdges)),

            logs: [...state.logs], highlightIndex: state.highlightIndex, highlightNodeValue: state.highlightNodeValue,
            highlightIndices: [...state.highlightIndices], highlightType: state.highlightType, bTreeDegree: state.bTreeDegree,
            searchLeft: state.searchLeft, searchRight: state.searchRight, searchMid: state.searchMid, searchResult: state.searchResult,
            sortI: state.sortI, sortJ: state.sortJ, sortK: state.sortK, sortPivot: state.sortPivot, sortMin: state.sortMin, sortedIndices: [...state.sortedIndices], sortChunks: JSON.parse(JSON.stringify(state.sortChunks || [])),});
    },

    _applyFrame: (frame) => {
        if (!frame) return;
        set({
            data: frame.data, nodes: frame.nodes, treeActions: frame.treeActions,
            hashTable: frame.hashTable, hashMode: frame.hashMode, hashProbingMode: frame.hashProbingMode, stagedHashValue: frame.stagedHashValue,
            
            isDirected: frame.isDirected, isWeighted: frame.isWeighted, graphRepresentation: frame.graphRepresentation,
            graphNodes: frame.graphNodes, graphEdges: frame.graphEdges, 
            graphMode: frame.graphMode, graphSelectedNode: frame.graphSelectedNode, graphSelectedEdge: frame.graphSelectedEdge, graphEdgeSource: frame.graphEdgeSource, showGraphGuide: frame.showGraphGuide,
            
            graphAlgorithm: frame.graphAlgorithm, graphQueue: frame.graphQueue, graphStack: frame.graphStack, 
            graphPQ: frame.graphPQ, graphDistances: frame.graphDistances, graphInDegrees: frame.graphInDegrees, graphIteration: frame.graphIteration,
            graphVisited: frame.graphVisited, graphTraversal: frame.graphTraversal,
            graphMSTEdges: frame.graphMSTEdges, graphDisjointSets: frame.graphDisjointSets,
            graphHighlightNodes: frame.graphHighlightNodes, graphHighlightEdges: frame.graphHighlightEdges, graphHighlightBackEdges: frame.graphHighlightBackEdges,

            logs: frame.logs, highlightIndex: frame.highlightIndex, highlightNodeValue: frame.highlightNodeValue,
            highlightIndices: frame.highlightIndices, highlightType: frame.highlightType, bTreeDegree: frame.bTreeDegree,
            searchLeft: frame.searchLeft, searchRight: frame.searchRight, searchMid: frame.searchMid, searchResult: frame.searchResult,
            sortI: frame.sortI, sortJ: frame.sortJ, sortK: frame.sortK, sortPivot: frame.sortPivot, sortMin: frame.sortMin, sortedIndices: frame.sortedIndices, sortChunks: frame.sortChunks || [], });
    },

    _runWithFrames: async (operationFn, opName, args) => {
        if (get().isAnimating && !get().isGeneratingFrames) return;
        set({ playing: false, isGeneratingFrames: true });
        
        const initialState = {
            data: JSON.parse(JSON.stringify(get().data)), nodes: JSON.parse(JSON.stringify(get().nodes)), treeActions: JSON.parse(JSON.stringify(get().treeActions)),
            hashTable: JSON.parse(JSON.stringify(get().hashTable)), logs: [...get().logs], 
            highlightIndex: -1, highlightNodeValue: null, highlightIndices: [], highlightType: '',
            bTreeDegree: get().bTreeDegree, hashMode: get().hashMode, hashProbingMode: get().hashProbingMode, stagedHashValue: null,
            
            isDirected: get().isDirected, isWeighted: get().isWeighted, graphRepresentation: get().graphRepresentation,
            graphNodes: JSON.parse(JSON.stringify(get().graphNodes)), graphEdges: JSON.parse(JSON.stringify(get().graphEdges)), 
            graphMode: get().graphMode, graphSelectedNode: null, graphSelectedEdge: null, graphEdgeSource: null, showGraphGuide: false,
            
            graphAlgorithm: get().graphAlgorithm, graphQueue: [], graphStack: [], graphPQ: [], graphDistances: {}, graphInDegrees: {}, graphIteration: 0,
            graphVisited: [], graphTraversal: [], graphMSTEdges: [], graphDisjointSets: {}, graphHighlightNodes: [], graphHighlightEdges: [], graphHighlightBackEdges: [],
            searchLeft: null, searchRight: null, searchMid: null, searchResult: null,
            sortI: null, sortJ: null, sortK: null, sortPivot: null, sortMin: null, sortedIndices: [], sortChunks: []
        };

        frames = []; get()._recordFrame(); 
        await operationFn(...args);
        get()._recordFrame(); 

        set({
            isGeneratingFrames: false, frames: [...frames], currentFrame: 0,
            playing: true, isAnimating: true, latestOperation: { fn: operationFn, opName, args, initialState }
        });
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
        setTimeout(() => { 
            get()._runWithFrames(latestOperation.fn, latestOperation.opName, latestOperation.args);
        }, 50);
    },
    clearData: () => {
        set({
            data: [], nodes: [], treeActions: [], hashTable: getEmptyHashTable(get().hashMode), logs: [],
            highlightIndex: -1, highlightNodeValue: null, highlightIndices: [], highlightType: '',
            searchLeft: null, searchRight: null, searchMid: null, searchResult: null,
            sortI: null, sortJ: null, sortK: null, sortPivot: null, sortMin: null, sortedIndices: [],
            graphAlgorithm: null, graphQueue: [], graphStack: [], graphPQ: [], graphDistances: {}, graphInDegrees: {}, graphIteration: 0, graphVisited: [], graphTraversal: [], 
            graphMSTEdges: [], graphDisjointSets: {}, graphHighlightNodes: [], graphHighlightEdges: [], graphHighlightBackEdges: [],
            graphNodes: [], graphEdges: [], graphSelectedNode: null, graphSelectedEdge: null, graphEdgeSource: null, showGraphGuide: false,
            frames: [], currentFrame: 0, playing: false, isAnimating: false, latestOperation: null
        });
        get().addLog('Data cleared.');
    },

    // --- UI CONFIGURATIONS ---
    setBTreeDegree: (degree) => {
        set({ 
            bTreeDegree: degree, data: [], nodes: [], treeActions: [],
            highlightIndex: -1, highlightNodeValue: null, highlightIndices: [], highlightType: '',
            searchLeft: null, searchRight: null, searchMid: null, searchResult: null,
            sortI: null, sortJ: null, sortK: null, sortPivot: null, sortMin: null, sortedIndices: [],
            frames: [], currentFrame: 0, playing: false, isAnimating: false, latestOperation: null 
        });
        get().addLog(`B-Tree degree set to ${degree}. Data cleared.`);
    },
    setHeapMode: (mode) => {
        set({ heapMode: mode, data: [], highlightIndices: [],
            searchLeft: null, searchRight: null, searchMid: null, searchResult: null,
            sortI: null, sortJ: null, sortK: null, sortPivot: null, sortMin: null, sortedIndices: [],
            frames: [], playing: false, isAnimating: false });
        get().addLog(`Switched Heap mode to ${mode}-Heap. Array cleared.`);
    },
    setImplementationMode: (mode) => {
        set({ implementationMode: mode, highlightIndex: -1, frames: [],
            searchLeft: null, searchRight: null, searchMid: null, searchResult: null,
            sortI: null, sortJ: null, sortK: null, sortPivot: null, sortMin: null, sortedIndices: [],
            playing: false, isAnimating: false });
        get().addLog(`Switched implementation to ${mode}`);
    },
    setHashMode: (mode) => {
        set({ hashMode: mode, hashTable: getEmptyHashTable(mode), frames: [], playing: false, isAnimating: false });
        get().addLog(`Switched Hash mode to ${mode}`);
    },
    setHashProbingMode: (mode) => {
        set({ hashProbingMode: mode, hashTable: getEmptyHashTable(get().hashMode), frames: [], playing: false, isAnimating: false });
        get().addLog(`Switched Probing mode to ${mode}`);
    },

    setIsDirected: (v) => set({ isDirected: v }),
    setIsWeighted: (v) => set({ isWeighted: v }),
    setGraphRepresentation: (v) => set({ graphRepresentation: v }),

    setStructure: (s) => {
        const wasGraph = get().selectedStructure.includes('Graph') || get().selectedStructure.includes('DFS') || get().selectedStructure.includes('BFS');
        const isGraph = s.includes('Graph') || s.includes('DFS') || s.includes('BFS');
        
        const updates = { 
            selectedStructure: s, implementationMode: 'Array', data: [], nodes: [], treeActions: [],
            hashTable: getEmptyHashTable('Open Addressing'), hashMode: 'Open Addressing', hashProbingMode: 'Linear',
            highlightIndex: -1, highlightNodeValue: null, highlightIndices: [], highlightType: '', 
            searchLeft: null, searchRight: null, searchMid: null, searchResult: null,
            sortI: null, sortJ: null, sortK: null, sortPivot: null, sortMin: null, sortedIndices: [],
            frames: [], currentFrame: 0, playing: false, isAnimating: false, latestOperation: null 
        };

        if (!wasGraph || !isGraph) {
            updates.graphAlgorithm = null; updates.graphQueue = []; updates.graphStack = []; updates.graphPQ = []; updates.graphDistances = {}; 
            updates.graphInDegrees = {}; updates.graphIteration = 0; updates.graphVisited = []; updates.graphTraversal = []; updates.graphMSTEdges = []; updates.graphDisjointSets = {};
            updates.graphHighlightNodes = []; updates.graphHighlightEdges = []; updates.graphHighlightBackEdges = [];
            updates.graphMode = 'select'; updates.graphSelectedNode = null; updates.graphSelectedEdge = null; updates.graphEdgeSource = null; updates.showGraphGuide = false;
        }

        set(updates);
        get().addLog(`Switched to ${s}`);
    },

    addLog: (msg) => {
        set((state) => ({ logs: [...state.logs, `${new Date().toLocaleTimeString()} - ${msg}`] }))
    },
    clearLogs: () => set({ logs: [] }),

    randomize: (count) => {
        const { selectedStructure, bTreeDegree, hashMode, hashProbingMode } = get();
        let n;
        if (selectedStructure === 'Trees - B-Tree') {
            if (bTreeDegree === 3) n = 8; else if (bTreeDegree === 4) n = 9; else if (bTreeDegree === 5) n = 10;
        } else {
            n = typeof count === 'number' ? count : (5 + Math.floor(Math.random() * 2));
        }

        const arr = Array.from({ length: n }, () => randomInt(1, 100));

        let newHashTable = getEmptyHashTable(hashMode);
        if (selectedStructure === 'Hash') {
            const tracker = new Hash(hashMode, hashProbingMode);
            arr.forEach(val => tracker.insert(newHashTable, val)); 
        }

        set({ 
            data: arr, nodes: arr.map(v => ({ id: nextId++, value: v })), treeActions: arr.map(v => ({ op: 'insert', val: v })),
            hashTable: newHashTable, searchLeft: null, searchRight: null, searchMid: null, searchResult: null,
            sortI: null, sortJ: null, sortK: null, sortPivot: null, sortMin: null, sortedIndices: [],
            highlightIndex: -1, frames: [], currentFrame: 0, playing: false, isAnimating: false, latestOperation: null
        });
        get().addLog(`Randomized with ${n} items`);
    },

    addItem: (value) => {
        set((state) => ({ 
            data: [...state.data, value], nodes: [...state.nodes, { id: nextId++, value }],
            treeActions: [...state.treeActions, { op: 'insert', val: value }],
            searchLeft: null, searchRight: null, searchMid: null, searchResult: null,
            sortI: null, sortJ: null, sortK: null, sortPivot: null, sortMin: null, sortedIndices: [], highlightIndex: -1
        }))
        get().addLog(`Added ${value}`)
    },

    deleteItem: (value) => {
        const index = get().data.indexOf(value);
        if (index === -1) {
            get().addLog(`Error: ${value} not found`);
            return;
        }
        set((state) => {
            const newData = [...state.data];
            const newNodes = [...state.nodes];

            newData.splice(index, 1);
            newNodes.splice(index, 1);
            return {
                data: newData, nodes: newNodes, treeActions: [...state.treeActions, { op: 'delete', val: value }],
                searchLeft: null, searchRight: null, searchMid: null, searchResult: null,
                sortI: null, sortJ: null, sortK: null, sortPivot: null, sortMin: null, sortedIndices: [], highlightIndex: -1
            };
        });
        get().addLog(`Deleted ${value}`);
    },
    // --- QUIZ STATE ENGINE ---
    isQuizOpen: false,
    setIsQuizOpen: (v) => set({ isQuizOpen: v }),
    quizProgress: {}, // Persists answers per structure: { 'ArrayList': { currentIndex: 0, answers: { 0: 1, 2: 3 } } }
    
    setQuizAnswer: (structure, qIndex, aIndex) => set((state) => {
        const prog = state.quizProgress[structure] || { currentIndex: 0, answers: {} };
        return {
            quizProgress: {
                ...state.quizProgress,
                [structure]: { ...prog, answers: { ...prog.answers, [qIndex]: aIndex } }
            }
        };
    }),
    
    setQuizIndex: (structure, newIndex) => set((state) => {
        const prog = state.quizProgress[structure] || { currentIndex: 0, answers: {} };
        return {
            quizProgress: {
                ...state.quizProgress,
                [structure]: { ...prog, currentIndex: newIndex }
            }
        };
    }),

    // --- PUBLIC ACTIONS ---
    addAtIndex: (index, value) => get()._runWithFrames(get()._addAtIndex, 'addAtIndex', [index, value]),
    deleteByValue: (value) => get()._runWithFrames(get()._deleteByValue, 'deleteByValue', [value]),
    deleteAtIndex: (index) => get()._runWithFrames(get()._deleteAtIndex, 'deleteAtIndex', [index]),
    updateAtIndex: (index, value) => get()._runWithFrames(get()._updateAtIndex, 'updateAtIndex', [index, value]),

    arrayBinarySearch: (value) => get()._runWithFrames(get()._arrayBinarySearch, 'arrayBinarySearch', [value]),
    arrayLowerBound: (value) => get()._runWithFrames(get()._arrayLowerBound, 'arrayLowerBound', [value]),
    arrayUpperBound: (value) => get()._runWithFrames(get()._arrayUpperBound, 'arrayUpperBound', [value]),

    arrayInsertionSort: () => get()._runWithFrames(() => get()._runSortAlgorithm('Insertion Sort', 'insertionSort'), 'arrayInsertionSort', []),
    arrayShellSort: () => get()._runWithFrames(() => get()._runSortAlgorithm('Shell Sort', 'shellSort'), 'arrayShellSort', []),
    arraySelectionSort: () => get()._runWithFrames(() => get()._runSortAlgorithm('Selection Sort', 'selectionSort'), 'arraySelectionSort', []),
    arrayBubbleSort: () => get()._runWithFrames(() => get()._runSortAlgorithm('Bubble Sort', 'bubbleSort'), 'arrayBubbleSort', []),
    arrayQuickSort: () => get()._runWithFrames(() => get()._runSortAlgorithm('Quick Sort', 'quickSort'), 'arrayQuickSort', []),
    arrayMergeSort: () => get()._runWithFrames(() => get()._runSortAlgorithm('Merge Sort', 'mergeSort'), 'arrayMergeSort', []),

    treeInsert: (value) => get()._runWithFrames(get()._treeInsert, 'treeInsert', [value]),
    treeFind: (value) => get()._runWithFrames(get()._treeFind, 'treeFind', [value]),
    treeDelete: (value) => get()._runWithFrames(get()._treeDelete, 'treeDelete', [value]),

    heapBuild: () => get()._runWithFrames(get()._heapBuild, 'heapBuild', []),
    heapInsert: (value) => get()._runWithFrames(get()._heapInsert, 'heapInsert', [value]),
    heapPop: () => get()._runWithFrames(get()._heapPop, 'heapPop', []),

    hashInsert: (value) => get()._runWithFrames(get()._hashInsert, 'hashInsert', [value]),
    hashDelete: (value) => get()._runWithFrames(get()._hashDelete, 'hashDelete', [value]),

    graphBFS: (startNodeId) => get()._runWithFrames(get()._graphBFS, 'graphBFS', [startNodeId]),
    graphDFS: (startNodeId) => get()._runWithFrames(get()._graphDFS, 'graphDFS', [startNodeId]),
    graphDijkstra: (startNodeId) => get()._runWithFrames(get()._graphDijkstra, 'graphDijkstra', [startNodeId]),
    graphPrim: (startNodeId) => get()._runWithFrames(get()._graphPrim, 'graphPrim', [startNodeId]),
    graphKruskal: () => get()._runWithFrames(get()._graphKruskal, 'graphKruskal', []),
    graphTopoSort: () => get()._runWithFrames(get()._graphTopoSort, 'graphTopoSort', []),
    graphBellmanFord: (startNodeId) => get()._runWithFrames(get()._graphBellmanFord, 'graphBellmanFord', [startNodeId]),

    // --- INTERNAL ACTION LOGIC ---
    _addAtIndex: async (index, value) => {
        set({ searchLeft: null, searchRight: null, searchMid: null, searchResult: null, sortI: null, sortJ: null, sortK: null, sortPivot: null, sortMin: null, sortedIndices: [], highlightIndices: [] });
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
        set({ searchLeft: null, searchRight: null, searchMid: null, searchResult: null, sortI: null, sortJ: null, sortK: null, sortPivot: null, sortMin: null, sortedIndices: [], highlightIndices: [] });        const { data, speedMs, _deleteAtIndex } = get();
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
        set({ searchLeft: null, searchRight: null, searchMid: null, searchResult: null, sortI: null, sortJ: null, sortK: null, sortPivot: null, sortMin: null, sortedIndices: [], highlightIndices: [] });        const { data, selectedStructure, implementationMode, speedMs } = get();
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
        set({ searchLeft: null, searchRight: null, searchMid: null, searchResult: null, sortI: null, sortJ: null, sortK: null, sortPivot: null, sortMin: null, sortedIndices: [], highlightIndices: [] });        const { data, speedMs } = get();
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
    _ensureSorted: async () => {
        const state = get();
        const isAlreadySorted = state.data.every((val, i, arr) => !i || (val >= arr[i - 1]));
        if (!isAlreadySorted) {
            get().addLog("Sorting array automatically for binary search...");
            const sortedPairs = state.data.map((val, idx) => ({val, id: state.nodes[idx].id})).sort((a,b)=>a.val - b.val);
            set({
                data: sortedPairs.map(p => p.val),
                nodes: sortedPairs.map(p => ({ id: p.id, value: p.val }))
            });
            await sleep(get().speedMs);
        }
    },

    _arrayBinarySearch: async (value) => {
        await get()._ensureSorted();
        set({ searchLeft: null, searchRight: null, searchMid: null, searchResult: null, sortI: null, sortJ: null, sortK: null, sortPivot: null, sortMin: null, sortedIndices: [], highlightIndices: [] });        const speed = get().speedMs;
        const data = get().data;
        if (data.length === 0) return;

        get().addLog(`Starting Binary Search for ${value}...`);
        const steps = SearchAlgorithms.binarySearch(data, value);

        for (let step of steps) {
            if (step.op === 'init' || step.op === 'update_bounds') {
                set({ searchLeft: step.left, searchRight: step.right, searchMid: null, highlightIndex: -1 });
                await sleep(speed);
            } else if (step.op === 'mid') {
                set({ searchMid: step.mid });
                await sleep(speed);
            } else if (step.op === 'check') {
                set({ highlightIndex: step.mid });
                get().addLog(`Checking if ${step.val} === ${value}`);
                await sleep(speed);
            } else if (step.op === 'found') {
                set({ searchResult: step.index, highlightIndex: step.index });
                get().addLog(`Found ${value} at index ${step.index}!`);
                await sleep(speed);
            } else if (step.op === 'not_found') {
                set({ searchResult: -1, highlightIndex: -1 });
                get().addLog(`Value ${value} not found.`);
                await sleep(speed);
            }
        }
    },

    _arrayLowerBound: async (value) => {
        await get()._ensureSorted();
        set({ searchLeft: null, searchRight: null, searchMid: null, searchResult: null, sortI: null, sortJ: null, sortK: null, sortPivot: null, sortMin: null, sortedIndices: [], highlightIndices: [] });        const speed = get().speedMs;
        const data = get().data;
        if (data.length === 0) return;

        get().addLog(`Starting Lower Bound search for ${value}...`);
        const steps = SearchAlgorithms.lowerBound(data, value);

        for (let step of steps) {
            if (step.op === 'init' || step.op === 'update_bounds') {
                set({ searchLeft: step.left, searchRight: step.right, searchMid: null, highlightIndex: -1 });
                await sleep(speed);
            } else if (step.op === 'mid') {
                set({ searchMid: step.mid });
                await sleep(speed);
            } else if (step.op === 'check') {
                set({ highlightIndex: step.mid });
                get().addLog(`Checking if ${step.val} < ${value}`);
                await sleep(speed);
            } else if (step.op === 'found') {
                set({ searchResult: step.index, highlightIndex: step.index });
                get().addLog(`Lower Bound for ${value} is at index ${step.index}`);
                await sleep(speed);
            }
        }
    },

    _arrayUpperBound: async (value) => {
        await get()._ensureSorted();
        set({ searchLeft: null, searchRight: null, searchMid: null, searchResult: null, sortI: null, sortJ: null, sortK: null, sortPivot: null, sortMin: null, sortedIndices: [], highlightIndices: [] });        const speed = get().speedMs;
        const data = get().data;
        if (data.length === 0) return;

        get().addLog(`Starting Upper Bound search for ${value}...`);
        const steps = SearchAlgorithms.upperBound(data, value);

        for (let step of steps) {
            if (step.op === 'init' || step.op === 'update_bounds') {
                set({ searchLeft: step.left, searchRight: step.right, searchMid: null, highlightIndex: -1 });
                await sleep(speed);
            } else if (step.op === 'mid') {
                set({ searchMid: step.mid });
                await sleep(speed);
            } else if (step.op === 'check') {
                set({ highlightIndex: step.mid });
                get().addLog(`Checking if ${step.val} <= ${value}`);
                await sleep(speed);
            } else if (step.op === 'found') {
                set({ searchResult: step.index, highlightIndex: step.index });
                get().addLog(`Upper Bound for ${value} is at index ${step.index}`);
                await sleep(speed);
            }
        }
    },

    _runSortAlgorithm: async (algName, opName) => {
        set({ searchLeft: null, searchRight: null, searchMid: null, searchResult: null, highlightIndex: -1, highlightIndices: [], sortI: null, sortJ: null, sortK: null, sortPivot: null, sortMin: null, sortedIndices: [] });
        const speed = get().speedMs;
        const data = get().data;
        if (data.length <= 1) return;

        get().addLog(`Starting ${algName}...`);
        const steps = SortingAlgorithms[opName](data);

        for (let step of steps) {
            if (step.op === 'set_chunks') {
                set({ sortChunks: step.chunks });
                await sleep(speed);
            } else if (step.op === 'set_pointers') {
                set({ sortI: step.i ?? null, sortJ: step.j ?? null, sortK: step.k ?? null, sortPivot: step.pivot ?? null, sortMin: step.min ?? null, highlightIndices: [] });
                await sleep(speed / 1.5);
            } else if (step.op === 'compare') {
                set({ highlightIndices: [step.i, step.j] });
                await sleep(speed / 1.5);
            } else if (step.op === 'swap') {
                set({ highlightIndices: [step.i, step.j] });
                await sleep(speed / 2);
                set(state => {
                    const newData = [...state.data];
                    const newNodes = [...state.nodes];
                    [newData[step.i], newData[step.j]] = [newData[step.j], newData[step.i]];
                    [newNodes[step.i], newNodes[step.j]] = [newNodes[step.j], newNodes[step.i]];
                    return { data: newData, nodes: newNodes };
                });
                await sleep(speed / 1.5);
            } else if (step.op === 'overwrite') {
                set({ highlightIndices: [step.idx] });
                await sleep(speed / 2);
                set(state => {
                    const newData = [...state.data];
                    const newNodes = [...state.nodes];
                    newData[step.idx] = step.val;
                    newNodes[step.idx] = { ...newNodes[step.idx], value: step.val };
                    return { data: newData, nodes: newNodes };
                });
                await sleep(speed / 1.5);
            } else if (step.op === 'mark_sorted') {
                set(state => ({ sortedIndices: [...new Set([...state.sortedIndices, step.idx])] }));
            }
        }
        set({ sortI: null, sortJ: null, sortK: null, sortPivot: null, sortMin: null, highlightIndices: [], highlightIndex: -1, sortChunks: [] });
        set({ sortedIndices: data.map((_, i) => i) });
        get().addLog(`${algName} complete.`);
    },

    // ==========================================
    // TREE
    // ==========================================
    _getTreePath: (value) => {
        const { selectedStructure, treeActions, bTreeDegree } = get();
        let tree;
        if (selectedStructure === 'Trees - AVL') tree = new AVLTree();
        else if (selectedStructure === 'Trees - Red-Black') tree = new RedBlackTree();
        else if (selectedStructure === 'Trees - Splay') tree = new SplayTree();
        else if (selectedStructure === 'Trees - B-Tree') tree = new BTree(bTreeDegree);
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

    // ==========================================
    // HEAP
    // ==========================================
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

    // ==========================================
    // HASH
    // ==========================================
    _hashInsert: async (value) => {
        set({ highlightIndices: [], highlightType: '', stagedHashValue: null });
        const speed = get().speedMs;
        const tracker = new Hash(get().hashMode, get().hashProbingMode);
        
        get().addLog(`Inserting ${value} into Hash Table...`);
        const workTable = JSON.parse(JSON.stringify(get().hashTable));
        const steps = tracker.insert(workTable, value);
        
        for (let step of steps) {
            if (step.op === 'start_insert') {
                set({ stagedHashValue: step.val });
                await sleep(speed);
            } else if (step.op === 'calc_hash') {
                get().addLog(`Calculated hash: h(${step.val}) = ${step.hash}`);
            } else if (step.op === 'probe') {
                set({ highlightIndices: [step.idx], highlightType: 'probe' });
                await sleep(speed / 1.5);
            } else if (step.op === 'insert') {
                // Phase 2: Unmount staged block and Mount table block EXACTLY at the same time
                set({ 
                    highlightIndices: [step.idx], 
                    highlightType: 'insert', 
                    stagedHashValue: null,
                    hashTable: JSON.parse(JSON.stringify(workTable)) // Appears in the table
                });
                await sleep(speed);
                get().addLog(`Inserted ${step.val} at index ${step.idx}`);
                await sleep(speed / 2);
            } else if (step.op === 'error' || step.op === 'found') {
                get().addLog(step.msg || `Value ${step.val} already exists.`);
                set({ highlightIndices: [step.idx], highlightType: 'error', stagedHashValue: null });
                await sleep(speed);
            }
        }
        set({ highlightIndices: [], highlightType: '', stagedHashValue: null });
    },

    _hashDelete: async (value) => {
        set({ highlightIndices: [], highlightType: '', stagedHashValue: null });
        const speed = get().speedMs;
        const tracker = new Hash(get().hashMode, get().hashProbingMode);
        
        get().addLog(`Deleting ${value} from Hash Table...`);
        const workTable = JSON.parse(JSON.stringify(get().hashTable));
        const steps = tracker.delete(workTable, value);
        
        for (let step of steps) {
            if (step.op === 'calc_hash') {
                get().addLog(`Calculated hash: h(${step.val}) = ${step.hash}`);
            } else if (step.op === 'probe') {
                set({ highlightIndices: [step.idx], highlightType: 'probe' });
                await sleep(speed / 1.5);
            } else if (step.op === 'delete') {
                set({ highlightIndices: [step.idx], highlightType: 'delete' });
                await sleep(speed);
                set({ hashTable: JSON.parse(JSON.stringify(workTable)) });
                get().addLog(`Deleted ${step.val}`);
                await sleep(speed / 2);
            } else if (step.op === 'error' || step.op === 'not_found') {
                get().addLog(step.msg || `${value} not found.`);
                set({ highlightIndices: [step.idx], highlightType: 'error' });
                await sleep(speed);
            }
        }
        set({ highlightIndices: [], highlightType: '' });
    },

    // ==========================================
    // GRAPH
    // ==========================================
    setGraphMode: (mode) => set({ graphMode: mode, graphEdgeSource: null, graphSelectedNode: null, graphSelectedEdge: null, showGraphGuide: true }),
    setGraphEdgeSource: (id) => set({ graphEdgeSource: id, showGraphGuide: false }),
    setGraphSelectedEdge: (id) => set({ graphSelectedEdge: id, graphSelectedNode: null, showGraphGuide: false }),
    setGraphSelectedNode: (id) => {
        const { graphSelectedNode } = get();
        if (graphSelectedNode === id) set({ graphSelectedNode: null, showGraphGuide: false });
        else set({ graphSelectedNode: id, graphSelectedEdge: null, showGraphGuide: false });
    },
    updateGraphNodePosition: (id, x, y) => {
        set(state => ({ graphNodes: state.graphNodes.map(n => n.id === id ? { ...n, x, y } : n) }));
    },
    generateNextNodeId: () => {
        const existingIds = new Set(get().graphNodes.map(n => n.id));
        for (let i = 0; i < 26; i++) {
            const char = String.fromCharCode(65 + i);
            if (!existingIds.has(char)) return char;
        }
        return `N${Math.floor(Math.random() * 1000)}`;
    },
    addGraphNodeAtPos: (x, y) => {
        const id = get().generateNextNodeId();
        set(state => ({ graphNodes: [...state.graphNodes, { id, x, y }], showGraphGuide: false }));
        get().addLog(`Added node ${id}`);
    },
    createGraphEdge: (source, target) => {
        const { graphEdges, isDirected } = get();
        const newEdgeId = `${source}-${target}`;
        const exists = graphEdges.some(e => e.id === newEdgeId || (!isDirected && e.id === `${target}-${source}`));
        if (!exists) {
            set({ graphEdges: [...graphEdges, { id: newEdgeId, source, target, weight: '1' }], showGraphGuide: false });
            get().addLog(`Added edge ${source} → ${target}`);
        } else {
            set({ showGraphGuide: false });
        }
    },
    removeGraphNode: (id) => {
        set(state => {
            const newEdges = state.graphEdges.filter(e => e.source !== id && e.target !== id);
            return {
                graphNodes: state.graphNodes.filter(n => n.id !== id),
                graphEdges: newEdges,
                graphSelectedNode: state.graphSelectedNode === id ? null : state.graphSelectedNode,
                graphEdgeSource: state.graphEdgeSource === id ? null : state.graphEdgeSource,
                graphSelectedEdge: state.graphSelectedEdge && !newEdges.find(e => e.id === state.graphSelectedEdge) ? null : state.graphSelectedEdge,
                showGraphGuide: false
            };
        });
        get().addLog(`Removed node ${id}`);
    },
    removeGraphEdge: (id) => {
        set(state => ({ 
            graphEdges: state.graphEdges.filter(e => e.id !== id),
            graphSelectedEdge: state.graphSelectedEdge === id ? null : state.graphSelectedEdge,
            showGraphGuide: false 
        }));
        get().addLog(`Removed edge ${id}`);
    },
    updateGraphEdgeWeight: (id, weight) => {
        set(state => ({ graphEdges: state.graphEdges.map(e => e.id === id ? { ...e, weight } : e), showGraphGuide: false }));
        get().addLog(`Updated edge weight for ${id}`);
    },
    deleteSelectedGraphItem: () => {
        const { graphSelectedNode, graphSelectedEdge } = get();
        if (graphSelectedNode) get().removeGraphNode(graphSelectedNode);
        else if (graphSelectedEdge) get().removeGraphEdge(graphSelectedEdge);
    },

    // Graph algorithms
    _graphBFS: async (startNodeId) => {
        set({ graphHighlightNodes: [], graphHighlightEdges: [], graphHighlightBackEdges: [], graphAlgorithm: 'BFS', graphQueue: [], graphStack: [], graphPQ: [], graphDistances: {}, graphVisited: [], graphTraversal: [], graphMSTEdges: [], graphDisjointSets: {}, graphIteration: 0, });
        const speed = get().speedMs;
        const { graphNodes, graphEdges, isDirected } = get();
        if (!graphNodes.some(n => n.id === startNodeId)) { get().addLog(`Node ${startNodeId} not found.`); return; }
        
        get().addLog(`Starting BFS from ${startNodeId}...`);
        const steps = GraphAlgorithms.bfs(graphNodes, graphEdges, startNodeId, isDirected);
        
        for (let step of steps) {
            if (step.op === 'init') { set({ graphQueue: step.queue, graphVisited: step.visited, graphTraversal: step.traversal }); await sleep(speed); }
            else if (step.op === 'visit') { set({ graphHighlightNodes: [step.curr], graphQueue: step.queue, graphVisited: step.visited, graphTraversal: step.traversal, graphHighlightEdges: [] }); get().addLog(`Visiting node ${step.curr}`); await sleep(speed); }
            else if (step.op === 'check_edge') { set({ graphHighlightNodes: [step.curr, step.neighbor], graphHighlightEdges: [`${step.curr}-${step.neighbor}`, `${step.neighbor}-${step.curr}`] }); await sleep(speed / 1.5); }
            else if (step.op === 'enqueue') { set({ graphQueue: step.queue, graphVisited: step.visited, graphTraversal: step.traversal }); get().addLog(`Enqueued node ${step.neighbor}`); await sleep(speed); }
            else if (step.op === 'done_node') { set({ graphHighlightEdges: [] }); }
        }
        set({ graphHighlightNodes: [], graphHighlightEdges: [] });
        get().addLog(`BFS complete.`);
    },

    _graphDFS: async (startNodeId) => {
        set({ graphHighlightNodes: [], graphHighlightEdges: [], graphHighlightBackEdges: [], graphAlgorithm: 'DFS', graphQueue: [], graphStack: [], graphPQ: [], graphDistances: {}, graphVisited: [], graphTraversal: [], graphMSTEdges: [], graphDisjointSets: {}, graphIteration: 0,});
        const speed = get().speedMs;
        const { graphNodes, graphEdges, isDirected } = get();
        if (!graphNodes.some(n => n.id === startNodeId)) { get().addLog(`Node ${startNodeId} not found.`); return; }
        
        get().addLog(`Starting DFS from ${startNodeId}...`);
        const steps = GraphAlgorithms.dfs(graphNodes, graphEdges, startNodeId, isDirected);
        
        for (let step of steps) {
            if (step.op === 'init') { set({ graphStack: step.stack, graphVisited: step.visited, graphTraversal: step.traversal, graphHighlightBackEdges: step.backEdges }); await sleep(speed); }
            else if (step.op === 'visit') { set({ graphHighlightNodes: [step.curr], graphStack: step.stack, graphVisited: step.visited, graphTraversal: step.traversal, graphHighlightEdges: [] }); get().addLog(`Visiting node ${step.curr}`); await sleep(speed); }
            else if (step.op === 'check_edge') { set({ graphHighlightNodes: [step.curr, step.neighbor], graphHighlightEdges: [`${step.curr}-${step.neighbor}`, `${step.neighbor}-${step.curr}`] }); await sleep(speed / 1.5); }
            else if (step.op === 'push') { set({ graphStack: step.stack, graphVisited: step.visited, graphTraversal: step.traversal }); get().addLog(`Pushed node ${step.neighbor} to stack`); await sleep(speed); }
            else if (step.op === 'back_edge') { set({ graphHighlightBackEdges: step.backEdges }); get().addLog(`Back edge detected to ${step.neighbor}`); await sleep(speed); }
            else if (step.op === 'done_node') { set({ graphHighlightEdges: [] }); }
        }
        set({ graphHighlightNodes: [], graphHighlightEdges: [] });
        get().addLog(`DFS complete.`);
    },

    _graphDijkstra: async (startNodeId) => {
        set({ graphHighlightNodes: [], graphHighlightEdges: [], graphHighlightBackEdges: [], graphAlgorithm: 'Dijkstra', graphQueue: [], graphStack: [], graphPQ: [], graphDistances: {}, graphVisited: [], graphTraversal: [], graphMSTEdges: [], graphDisjointSets: {}, graphIteration: 0, });
        const speed = get().speedMs;
        const { graphNodes, graphEdges, isDirected } = get();
        if (!graphNodes.some(n => n.id === startNodeId)) { get().addLog(`Node ${startNodeId} not found.`); return; }
        
        get().addLog(`Starting Dijkstra from ${startNodeId}...`);
        const steps = GraphAlgorithms.dijkstra(graphNodes, graphEdges, startNodeId, isDirected);
        
        for (let step of steps) {
            if (step.op === 'init') { set({ graphPQ: step.pq, graphDistances: step.distances, graphVisited: step.visited, graphTraversal: step.traversal }); await sleep(speed); }
            else if (step.op === 'visit') { set({ graphHighlightNodes: [step.curr], graphPQ: step.pq, graphDistances: step.distances, graphVisited: step.visited, graphTraversal: step.traversal, graphHighlightEdges: [] }); get().addLog(`Visiting node ${step.curr} with distance ${step.distances[step.curr]}`); await sleep(speed); }
            else if (step.op === 'check_edge') { set({ graphHighlightNodes: [step.curr, step.neighbor], graphHighlightEdges: [`${step.curr}-${step.neighbor}`, `${step.neighbor}-${step.curr}`] }); await sleep(speed / 1.5); }
            else if (step.op === 'update_dist') { set({ graphPQ: step.pq, graphDistances: step.distances }); get().addLog(`Updated distance for ${step.neighbor} to ${step.distances[step.neighbor]}`); await sleep(speed); }
            else if (step.op === 'done_node') { set({ graphHighlightEdges: [] }); }
        }
        set({ graphHighlightNodes: [], graphHighlightEdges: [] });
        get().addLog(`Dijkstra complete.`);
    },

    _graphPrim: async (startNodeId) => {
        set({ graphHighlightNodes: [], graphHighlightEdges: [], graphHighlightBackEdges: [], graphAlgorithm: 'Prim', graphQueue: [], graphStack: [], graphPQ: [], graphDistances: {}, graphVisited: [], graphTraversal: [], graphMSTEdges: [], graphDisjointSets: {}, graphIteration: 0, });
        const speed = get().speedMs;
        const { graphNodes, graphEdges, isDirected } = get();
        if (!graphNodes.some(n => n.id === startNodeId)) { get().addLog(`Node ${startNodeId} not found.`); return; }
        
        get().addLog(`Starting Prim's MST from ${startNodeId}...`);
        const steps = GraphAlgorithms.prim(graphNodes, graphEdges, startNodeId, isDirected);
        
        for (let step of steps) {
            if (step.op === 'init') { set({ graphVisited: step.visited, graphPQ: step.pq, graphMSTEdges: step.mstEdges.map(e => e.id) }); await sleep(speed); }
            else if (step.op === 'visit') { set({ graphHighlightNodes: [step.curr], graphPQ: step.pq, graphVisited: step.visited, graphHighlightEdges: [] }); await sleep(speed); }
            else if (step.op === 'check_edge') { set({ graphHighlightNodes: [step.edge.source, step.edge.target], graphHighlightEdges: [step.edge.id] }); await sleep(speed / 1.5); }
            else if (step.op === 'add_mst') { set({ graphMSTEdges: step.mstEdges.map(e => e.id), graphVisited: step.visited, graphPQ: step.pq }); get().addLog(`Added edge ${step.edge.source}-${step.edge.target} to MST.`); await sleep(speed); }
        }
        set({ graphHighlightNodes: [], graphHighlightEdges: [] });
        get().addLog(`Prim's MST complete.`);
    },

    _graphKruskal: async () => {
        set({ graphHighlightNodes: [], graphHighlightEdges: [], graphHighlightBackEdges: [], graphAlgorithm: 'Kruskal', graphQueue: [], graphStack: [], graphPQ: [], graphDistances: {}, graphVisited: [], graphTraversal: [], graphMSTEdges: [], graphDisjointSets: {}, graphIteration: 0, });
        const speed = get().speedMs;
        const { graphNodes, graphEdges } = get();
        
        get().addLog(`Starting Kruskal's MST...`);
        const steps = GraphAlgorithms.kruskal(graphNodes, graphEdges);
        
        for (let step of steps) {
            if (step.op === 'init') { set({ graphDisjointSets: step.disjointSets, graphMSTEdges: step.mstEdges.map(e => e.id), graphVisited: step.visited }); await sleep(speed); }
            else if (step.op === 'check_edge') { set({ graphHighlightEdges: [step.edge.id], graphHighlightNodes: [step.edge.source, step.edge.target] }); await sleep(speed / 1.5); }
            else if (step.op === 'add_mst') { set({ graphMSTEdges: step.mstEdges.map(e => e.id), graphDisjointSets: step.disjointSets, graphVisited: step.visited }); get().addLog(`Added edge ${step.edge.source}-${step.edge.target} to MST.`); await sleep(speed); }
        }
        set({ graphHighlightNodes: [], graphHighlightEdges: [] });
        get().addLog(`Kruskal's MST complete.`);
    },
    _graphTopoSort: async () => {
        set({ graphHighlightNodes: [], graphHighlightEdges: [], graphHighlightBackEdges: [], graphAlgorithm: 'TopoSort', graphQueue: [], graphInDegrees: {}, graphVisited: [], graphTraversal: [], graphMSTEdges: [], graphDisjointSets: {}, graphIteration: 0, });
        const speed = get().speedMs;
        const { graphNodes, graphEdges, isDirected } = get();
        if (!isDirected) { get().addLog(`Topological Sort requires a directed graph.`); return; }
        
        get().addLog(`Starting Topological Sort (Kahn's Algorithm)...`);
        const steps = GraphAlgorithms.topologicalSort(graphNodes, graphEdges);
        
        for (let step of steps) {
            if (step.op === 'init') { set({ graphQueue: step.queue, graphInDegrees: step.inDegree, graphVisited: step.visited, graphTraversal: step.traversal }); await sleep(speed); }
            else if (step.op === 'visit') { set({ graphHighlightNodes: [step.curr], graphQueue: step.queue, graphInDegrees: step.inDegree, graphVisited: step.visited, graphTraversal: step.traversal, graphHighlightEdges: [] }); get().addLog(`Popped node ${step.curr}`); await sleep(speed); }
            else if (step.op === 'check_edge') { set({ graphHighlightNodes: [step.curr, step.neighbor], graphHighlightEdges: [`${step.curr}-${step.neighbor}`] }); await sleep(speed / 1.5); }
            else if (step.op === 'update_indegree') { set({ graphInDegrees: step.inDegree }); get().addLog(`Decremented in-degree of ${step.neighbor} to ${step.inDegree[step.neighbor]}`); await sleep(speed); }
            else if (step.op === 'enqueue') { set({ graphQueue: step.queue, graphVisited: step.visited, graphTraversal: step.traversal }); get().addLog(`In-degree of ${step.neighbor} is 0, enqueueing`); await sleep(speed); }
            else if (step.op === 'done_node') { set({ graphHighlightEdges: [] }); }
        }
        set({ graphHighlightNodes: [], graphHighlightEdges: [] });
        get().addLog(`Topological Sort complete.`);
    },

    _graphBellmanFord: async (startNodeId) => {
        set({ graphHighlightNodes: [], graphHighlightEdges: [], graphHighlightBackEdges: [], graphAlgorithm: 'BellmanFord', graphDistances: {}, graphIteration: 0, graphVisited: [], graphTraversal: [], graphMSTEdges: [], graphDisjointSets: {} });
        const speed = get().speedMs;
        const { graphNodes, graphEdges, isDirected } = get();
        if (!graphNodes.some(n => n.id === startNodeId)) { get().addLog(`Node ${startNodeId} not found.`); return; }
        
        get().addLog(`Starting Bellman-Ford from ${startNodeId}...`);
        const steps = GraphAlgorithms.bellmanFord(graphNodes, graphEdges, startNodeId, isDirected);
        
        for (let step of steps) {
            if (step.op === 'init') { set({ graphDistances: step.distances, graphIteration: step.iteration }); await sleep(speed); }
            else if (step.op === 'iteration') { set({ graphIteration: step.iteration, graphHighlightEdges: [], graphHighlightNodes: [] }); get().addLog(`Iteration ${step.iteration} of ${graphNodes.length - 1}`); await sleep(speed); }
            else if (step.op === 'check_edge') { set({ graphHighlightNodes: [step.curr, step.neighbor], graphHighlightEdges: [step.edgeId] }); await sleep(speed / 1.5); }
            else if (step.op === 'update_dist') { set({ graphDistances: step.distances }); get().addLog(`Updated distance for ${step.neighbor} to ${step.distances[step.neighbor]}`); await sleep(speed); }
            else if (step.op === 'negative_cycle') { set({ graphHighlightEdges: [step.edgeId] }); get().addLog(`WARNING: Negative weight cycle detected!`); await sleep(speed); }
            else if (step.op === 'done') { set({ graphHighlightEdges: [], graphHighlightNodes: [] }); }
        }
        get().addLog(`Bellman-Ford complete.`);
    },
}))

export default useStore