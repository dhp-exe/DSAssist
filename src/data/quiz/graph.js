export const graph = [
    { id: 1, tags: ['Definition', 'Structure', 'Easy'], text: "What are the two primary components that make up a Graph?", options: ["Nodes and Leaves", "Vertices (Nodes) and Edges", "Rows and Columns", "Heads and Tails"], correct: 1, explanation: "A graph is a non-linear data structure consisting of Vertices connected by Edges." },
    { id: 2, tags: ['Concepts', 'Directed', 'Easy'], text: "What differentiates a Directed Graph from an Undirected Graph?", options: ["Directed graphs have no cycles", "Edges in a directed graph have a specific direction (A → B doesn't mean B → A)", "Directed graphs cannot have weights", "Undirected graphs are always connected"], correct: 1, explanation: "In a Directed graph, edges act like one-way streets. In Undirected, they are two-way." },
    { id: 3, tags: ['Algorithms', 'BFS', 'Easy'], text: "Breadth-First Search (BFS) uses which underlying data structure to track nodes?", options: ["Stack", "Queue", "Priority Queue", "Hash Table"], correct: 1, explanation: "BFS explores layer by layer. A FIFO Queue ensures nodes discovered first are processed first." },
    { id: 4, tags: ['Algorithms', 'DFS', 'Easy'], text: "Depth-First Search (DFS) uses which underlying data structure (or system mechanism)?", options: ["Queue", "Priority Queue", "Stack / Call Stack", "Array"], correct: 2, explanation: "DFS dives as deep as possible before backtracking, which naturally aligns with a LIFO Stack or recursive function calls." },
    {

id: 5,
tags: ['Concept', 'MST', 'Easy'],
text: "What is a Minimum Spanning Tree (MST) in a weighted graph?",
options: [
"A tree that connects all vertices with the minimum total edge weight",
"A tree that contains the maximum number of edges",
"A tree that connects all vertices with the maximum total edge weight",
"A tree that connects all vertices with the maximum total edge weight without cycles"
],
correct: 0,
explanation: "A Minimum Spanning Tree connects all vertices in a graph without cycles while minimizing the total weight of the edges."
},
    { id: 6, tags: ['Algorithms', 'Shortest Path', 'Medium'], text: "Which algorithm finds the Shortest Path from a start node to all other nodes in a Weighted Graph?", options: ["Kruskal's", "Dijkstra's", "DFS", "Topological Sort"], correct: 1, explanation: "Dijkstra's Algorithm greedily explores the closest nodes using a Priority Queue to guarantee the shortest paths." },
    { id: 7, tags: ['Algorithms', 'Dijkstra', 'Medium'], text: "What is a fatal limitation of Dijkstra's Algorithm?", options: ["It doesn't work on directed graphs", "It fails if the graph contains edges with Negative Weights", "It only finds the longest path", "It requires O(n^2) space"], correct: 1, explanation: "Dijkstra assumes that adding an edge can only INCREASE distance. Negative weights break this greedy assumption, yielding incorrect results." },
    { id: 8, tags: ['Algorithms', 'MST', 'Medium'], text: "Both Prim's and Kruskal's algorithms are used to find:", options: ["The Shortest Path", "The Minimum Spanning Tree (MST)", "Topological Order", "Negative Cycles"], correct: 1, explanation: "They both find a subset of edges that connects all vertices together with the absolute minimum total edge weight." },
    { id: 9, tags: ['Algorithms', 'Topo Sort', 'Medium'], text: "Topological Sort can ONLY be performed on which type of graph?", options: ["Directed Acyclic Graphs (DAG)", "Undirected Trees", "Graphs with negative weights", "Complete Graphs"], correct: 0, explanation: "Topological sort requires directed dependencies (A must come before B) and absolutely no cycles (otherwise an infinite loop of dependencies exists)." },
    { id: 10, tags: ['Algorithms', 'Kruskal', 'Hard'], text: "Kruskal's Algorithm sorts all edges and then uses which data structure to prevent forming cycles?", options: ["Min-Heap", "Disjoint Set (Union-Find)", "Hash Set", "Stack"], correct: 1, explanation: "Disjoint Sets efficiently track which components are connected. If two vertices of an edge share the same root parent, adding the edge would form a cycle." },
    { id: 11, tags: ['Algorithms', 'Bellman-Ford', 'Hard'], text: "Why would you choose Bellman-Ford over Dijkstra's algorithm?", options: ["It is faster (O(V+E))", "It can detect and handle Negative Weight Cycles", "It uses less memory", "It works on unweighted graphs"], correct: 1, explanation: "Bellman-Ford is slower O(V*E) but relaxes all edges V-1 times, allowing it to correctly calculate paths with negative weights and detect infinite negative loops." }
];