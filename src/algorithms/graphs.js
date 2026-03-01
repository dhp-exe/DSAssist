export class GraphAlgorithms {
    static getAdjacencyList(nodes, edges, isDirected) {
        const adj = {};
        nodes.forEach(n => adj[n.id] = []);
        edges.forEach(e => {
            adj[e.source].push({ target: e.target, weight: e.weight, edgeId: e.id });
            if (!isDirected) {
                adj[e.target].push({ target: e.source, weight: e.weight, edgeId: e.id });
            }
        });
        for (let key in adj) {
            adj[key].sort((a, b) => a.target.localeCompare(b.target));
        }
        return adj;
    }

    static bfs(nodes, edges, startNodeId, isDirected) {
        const steps = [];
        const adj = this.getAdjacencyList(nodes, edges, isDirected);
        const visited = new Set();
        const queue = [];
        const traversal = [];
        
        visited.add(startNodeId);
        queue.push(startNodeId);
        
        steps.push({ op: 'init', queue: [...queue], visited: Array.from(visited), traversal: [...traversal] });
        
        while (queue.length > 0) {
            const u = queue.shift();
            traversal.push(u);
            steps.push({ op: 'visit', curr: u, queue: [...queue], visited: Array.from(visited), traversal: [...traversal] });
            
            for (let neighbor of adj[u]) {
                const v = neighbor.target;
                steps.push({ op: 'check_edge', curr: u, neighbor: v, queue: [...queue], visited: Array.from(visited), traversal: [...traversal] });
                
                if (!visited.has(v)) {
                    visited.add(v);
                    queue.push(v);
                    steps.push({ op: 'enqueue', curr: u, neighbor: v, queue: [...queue], visited: Array.from(visited), traversal: [...traversal] });
                }
            }
            steps.push({ op: 'done_node', curr: u, queue: [...queue], visited: Array.from(visited), traversal: [...traversal] });
        }
        return steps;
    }

    static dfs(nodes, edges, startNodeId, isDirected) {
        const steps = [];
        const adj = this.getAdjacencyList(nodes, edges, isDirected);
        const visited = new Set();
        const stack = [];
        const traversal = [];
        const backEdges = [];
        
        stack.push(startNodeId);
        steps.push({ op: 'init', stack: [...stack], visited: Array.from(visited), traversal: [...traversal], backEdges: [...backEdges] });
        
        while (stack.length > 0) {
            const u = stack.pop();
            
            if (!visited.has(u)) {
                visited.add(u);
                traversal.push(u);
                steps.push({ op: 'visit', curr: u, stack: [...stack], visited: Array.from(visited), traversal: [...traversal], backEdges: [...backEdges] });
                
                const neighbors = [...adj[u]].reverse(); 
                for (let neighbor of neighbors) {
                    const v = neighbor.target;
                    steps.push({ op: 'check_edge', curr: u, neighbor: v, stack: [...stack], visited: Array.from(visited), traversal: [...traversal], backEdges: [...backEdges] });
                    
                    if (!visited.has(v)) {
                        stack.push(v);
                        steps.push({ op: 'push', curr: u, neighbor: v, stack: [...stack], visited: Array.from(visited), traversal: [...traversal], backEdges: [...backEdges] });
                    } else {
                        backEdges.push({ source: u, target: v });
                        steps.push({ op: 'back_edge', curr: u, neighbor: v, stack: [...stack], visited: Array.from(visited), traversal: [...traversal], backEdges: [...backEdges] });
                    }
                }
                steps.push({ op: 'done_node', curr: u, stack: [...stack], visited: Array.from(visited), traversal: [...traversal], backEdges: [...backEdges] });
            }
        }
        return steps;
    }

    static dijkstra(nodes, edges, startNodeId, isDirected) {
        const steps = [];
        const adj = this.getAdjacencyList(nodes, edges, isDirected);
        const distances = {};
        const visited = new Set();
        const traversal = [];
        
        nodes.forEach(n => distances[n.id] = Infinity);
        distances[startNodeId] = 0;
        
        const pq = [{ id: startNodeId, dist: 0 }];
        steps.push({ op: 'init', pq: [...pq], distances: { ...distances }, visited: Array.from(visited), traversal: [...traversal] });
        
        while (pq.length > 0) {
            pq.sort((a, b) => a.dist - b.dist);
            const { id: u, dist: d } = pq.shift();
            
            if (visited.has(u)) continue;
            
            visited.add(u);
            traversal.push(u);
            steps.push({ op: 'visit', curr: u, pq: [...pq], distances: { ...distances }, visited: Array.from(visited), traversal: [...traversal] });
            
            for (let neighbor of adj[u]) {
                const v = neighbor.target;
                const weight = parseFloat(neighbor.weight);
                if (isNaN(weight)) continue; 
                
                if (visited.has(v)) continue;
                
                steps.push({ op: 'check_edge', curr: u, neighbor: v, pq: [...pq], distances: { ...distances }, visited: Array.from(visited), traversal: [...traversal] });
                
                if (distances[u] + weight < distances[v]) {
                    distances[v] = distances[u] + weight;
                    const existingIdx = pq.findIndex(item => item.id === v);
                    if (existingIdx > -1) pq[existingIdx].dist = distances[v];
                    else pq.push({ id: v, dist: distances[v] });
                    
                    steps.push({ op: 'update_dist', curr: u, neighbor: v, pq: [...pq], distances: { ...distances }, visited: Array.from(visited), traversal: [...traversal] });
                }
            }
            steps.push({ op: 'done_node', curr: u, pq: [...pq], distances: { ...distances }, visited: Array.from(visited), traversal: [...traversal] });
        }
        return steps;
    }

    static prim(nodes, edges, startNodeId, isDirected) {
        const steps = [];
        const adj = this.getAdjacencyList(nodes, edges, isDirected);
        const visited = new Set();
        const pq = []; // stores { weight, source, target, id }
        const mstEdges = [];

        visited.add(startNodeId);
        steps.push({ op: 'init', visited: Array.from(visited), pq: [...pq], mstEdges: [...mstEdges] });

        for (let nbr of adj[startNodeId]) {
            const weight = parseFloat(nbr.weight);
            if (!isNaN(weight)) {
                pq.push({ weight, source: startNodeId, target: nbr.target, id: nbr.edgeId });
            }
        }
        steps.push({ op: 'visit', curr: startNodeId, pq: [...pq], visited: Array.from(visited), mstEdges: [...mstEdges] });

        while (pq.length > 0) {
            pq.sort((a, b) => a.weight - b.weight);
            const edge = pq.shift();

            steps.push({ op: 'check_edge', edge, pq: [...pq], visited: Array.from(visited), mstEdges: [...mstEdges] });

            if (!visited.has(edge.target)) {
                visited.add(edge.target);
                mstEdges.push(edge);
                steps.push({ op: 'add_mst', edge, pq: [...pq], visited: Array.from(visited), mstEdges: [...mstEdges] });

                for (let nbr of adj[edge.target]) {
                    if (!visited.has(nbr.target)) {
                        const weight = parseFloat(nbr.weight);
                        if (!isNaN(weight)) {
                            pq.push({ weight, source: edge.target, target: nbr.target, id: nbr.edgeId });
                        }
                    }
                }
            }
        }
        return steps;
    }

    static kruskal(nodes, edges) {
        const steps = [];
        const sortedEdges = [...edges]
            .map(e => ({ ...e, weight: parseFloat(e.weight) }))
            .filter(e => !isNaN(e.weight))
            .sort((a, b) => a.weight - b.weight);
        
        const parent = {};
        nodes.forEach(n => parent[n.id] = n.id);

        const find = (i) => {
            if (parent[i] === i) return i;
            return find(parent[i]);
        };
        const union = (i, j) => {
            const rootI = find(i);
            const rootJ = find(j);
            parent[rootI] = rootJ;
        };

        const mstEdges = [];
        const visited = new Set();
        steps.push({ op: 'init', disjointSets: { ...parent }, mstEdges: [...mstEdges], visited: Array.from(visited) });

        for (let edge of sortedEdges) {
            steps.push({ op: 'check_edge', edge, disjointSets: { ...parent }, mstEdges: [...mstEdges], visited: Array.from(visited) });
            const rootU = find(edge.source);
            const rootV = find(edge.target);

            if (rootU !== rootV) {
                union(edge.source, edge.target);
                mstEdges.push(edge);
                visited.add(edge.source);
                visited.add(edge.target);
                steps.push({ op: 'add_mst', edge, disjointSets: { ...parent }, mstEdges: [...mstEdges], visited: Array.from(visited) });
            }
        }
        return steps;
    }

    static isDAG(nodes, edges) {
        const adj = this.getAdjacencyList(nodes, edges, true);
        const visited = new Set();
        const recStack = new Set();

        for (let node of nodes) {
            if (this._isCyclic(node.id, adj, visited, recStack)) return false;
        }
        return true;
    }

    static _isCyclic(curr, adj, visited, recStack) {
        if (recStack.has(curr)) return true;
        if (visited.has(curr)) return false;

        visited.add(curr);
        recStack.add(curr);

        for (let nbr of (adj[curr] || [])) {
            if (this._isCyclic(nbr.target, adj, visited, recStack)) return true;
        }
        recStack.delete(curr);
        return false;
    }

    static topologicalSort(nodes, edges) {
        const steps = [];
        const adj = this.getAdjacencyList(nodes, edges, true);
        const inDegree = {};
        nodes.forEach(n => inDegree[n.id] = 0);

        edges.forEach(e => {
            inDegree[e.target] = (inDegree[e.target] || 0) + 1;
        });

        const queue = [];
        const traversal = [];
        const visited = new Set();

        nodes.forEach(n => {
            if (inDegree[n.id] === 0) queue.push(n.id);
        });

        steps.push({ op: 'init', queue: [...queue], inDegree: { ...inDegree }, traversal: [...traversal], visited: Array.from(visited) });

        while (queue.length > 0) {
            const u = queue.shift();
            traversal.push(u);
            visited.add(u);
            steps.push({ op: 'visit', curr: u, queue: [...queue], inDegree: { ...inDegree }, traversal: [...traversal], visited: Array.from(visited) });

            for (let nbr of adj[u]) {
                const v = nbr.target;
                steps.push({ op: 'check_edge', curr: u, neighbor: v, queue: [...queue], inDegree: { ...inDegree }, traversal: [...traversal], visited: Array.from(visited) });

                inDegree[v]--;
                steps.push({ op: 'update_indegree', curr: u, neighbor: v, queue: [...queue], inDegree: { ...inDegree }, traversal: [...traversal], visited: Array.from(visited) });

                if (inDegree[v] === 0) {
                    queue.push(v);
                    steps.push({ op: 'enqueue', curr: u, neighbor: v, queue: [...queue], inDegree: { ...inDegree }, traversal: [...traversal], visited: Array.from(visited) });
                }
            }
            steps.push({ op: 'done_node', curr: u, queue: [...queue], inDegree: { ...inDegree }, traversal: [...traversal], visited: Array.from(visited) });
        }
        return steps;
    }

    static bellmanFord(nodes, edges, startNodeId, isDirected) {
        const steps = [];
        const distances = {};
        nodes.forEach(n => distances[n.id] = Infinity);
        distances[startNodeId] = 0;

        const allEdges = [];
        edges.forEach(e => {
            const weight = parseFloat(e.weight);
            if (!isNaN(weight)) {
                allEdges.push({ u: e.source, v: e.target, weight, id: e.id });
                if (!isDirected) {
                    allEdges.push({ u: e.target, v: e.source, weight, id: e.id });
                }
            }
        });

        steps.push({ op: 'init', distances: { ...distances }, iteration: 0 });

        // Relax edges |V| - 1 times
        for (let i = 1; i <= nodes.length - 1; i++) {
            steps.push({ op: 'iteration', iteration: i, distances: { ...distances } });
            for (let edge of allEdges) {
                steps.push({ op: 'check_edge', curr: edge.u, neighbor: edge.v, edgeId: edge.id, distances: { ...distances }, iteration: i });
                if (distances[edge.u] !== Infinity && distances[edge.u] + edge.weight < distances[edge.v]) {
                    distances[edge.v] = distances[edge.u] + edge.weight;
                    steps.push({ op: 'update_dist', curr: edge.u, neighbor: edge.v, edgeId: edge.id, distances: { ...distances }, iteration: i });
                }
            }
        }

        // Check for negative weight cycle
        let hasNegativeCycle = false;
        for (let edge of allEdges) {
            if (distances[edge.u] !== Infinity && distances[edge.u] + edge.weight < distances[edge.v]) {
                hasNegativeCycle = true;
                steps.push({ op: 'negative_cycle', edgeId: edge.id });
                break;
            }
        }

        steps.push({ op: 'done', distances: { ...distances }, hasNegativeCycle });
        return steps;
    }
}