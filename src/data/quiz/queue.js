export const queue = [
    { id: 1, tags: ['Definition', 'Concept', 'Easy'], text: "Which principle dictates how elements are added and removed from a standard Queue?", options: ["LIFO", "FIFO", "FILO", "Randomized"], correct: 1, explanation: "Queue operates on First In, First Out (FIFO), just like a line of people waiting at a store." },
{
id: 2,
tags: ['Operations', 'Queue', 'Easy'],
text: "Where is a new element inserted in a Queue?",
options: [
"At the front",
"In the middle",
"At the rear (back)",
"At a random position"
],
correct: 2,
explanation: "In a queue, new elements are always inserted at the rear (back), while elements are removed from the front, maintaining the FIFO order."
},{
id: 3,
tags: ['Implementation', 'Linked List', 'Easy'],
text: "When implementing a Queue using a Linked List, how many pointers are typically maintained to support efficient operations?",
options: [
"1 pointer (head only)",
"2 pointers (front and rear)",
"3 pointers (front, rear, middle)",
"4 pointers (front, rear, prev, next)"
],
correct: 1,
explanation: "A linked-list-based queue maintains two pointers: a front pointer for dequeue operations and a rear pointer for enqueue operations. This allows both operations to run in O(1) time."
},
    { id: 4, tags: ['Sequence', 'Logic', 'Medium'], text: "Given an empty queue: Enqueue(5), Enqueue(7), Dequeue(), Enqueue(3). What is the FRONT element?", options: ["3", "5", "7", "null"], correct: 2, explanation: "Queue state: [5] -> [5,7] -> [7] -> [7,3]. The front element waiting to be removed next is 7." },
    { id: 5, tags: ['Structure', 'Circular Queue', 'Medium'], text: "How does a Circular Queue solve the wasted space problem of an Array Queue?", options: ["By shifting all elements left on every dequeue", "By using a Linked List instead", "By wrapping the rear pointer back to index 0 using modulo arithmetic", "By deleting the array and making a new one"], correct: 2, explanation: "Using `(rear + 1) % capacity` allows the queue to wrap around to the unused spaces at the front of the array." },
    { id: 6, tags: ['Graph', 'Algorithm', 'Medium'], text: "Which Graph Traversal algorithm strictly relies on a Queue?", options: ["Depth-First Search (DFS)", "Breadth-First Search (BFS)", "Dijkstra's Algorithm", "Kruskal's Algorithm"], correct: 1, explanation: "BFS visits nodes level by level. A FIFO queue ensures nodes discovered first are explored first." },
    { id: 7, tags: ['Advanced', 'Stacks', 'Hard'], text: "How many Stacks are required to successfully implement a fully functional Queue?", options: ["1", "2", "3", "It is impossible"], correct: 1, explanation: "You need 2 stacks: an Inbox stack for enqueuing, and an Outbox stack. When dequeuing, if Outbox is empty, pop everything from Inbox to Outbox to reverse the LIFO order into FIFO." },
    { id: 8, tags: ['Variants', 'Priority Queue', 'Hard'], text: "A Priority Queue is typically implemented using which data structure to achieve O(log n) insertions?", options: ["A sorted Linked List", "A Hash Table", "A Binary Heap", "An ArrayList"], correct: 2, explanation: "Binary Heaps allow a Priority Queue to enqueue and dequeue the highest-priority element in O(log n) time." }
];