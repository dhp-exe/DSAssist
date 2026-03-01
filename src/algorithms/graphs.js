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
}