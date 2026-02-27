export class GraphAlgorithms {
    static getAdjacencyList(nodes, edges, isDirected) {
        const adj = {};
        nodes.forEach(n => adj[n.id] = []);
        edges.forEach(e => {
            adj[e.source].push({ target: e.target, weight: e.weight });
            if (!isDirected) {
                adj[e.target].push({ target: e.source, weight: e.weight });
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
                
                const neighbors = [...adj[u]].reverse(); // Reverse so it visits alphabetical alphabetically due to stack LIFO
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
}