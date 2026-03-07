export const stack = [
    { id: 1, tags: ['Definition', 'Concept', 'Easy'], text: "Which principle dictates how elements are added and removed from a Stack?", options: ["FIFO (First In, First Out)", "LIFO (Last In, First Out)", "Random Access", "Sorted Access"], correct: 1, explanation: "A stack operates on Last In, First Out. The most recently added element is the first one removed." },
    { id: 2, tags: ['Operations', 'Terminology', 'Easy'], text: "What is the operation used to remove the top element from a stack?", options: ["Push", "Pop", "Peek", "Dequeue"], correct: 1, explanation: "Pop removes and returns the top element. Push adds an element. Peek views the top element without removing it." },
    { id: 3, tags: ['Time Complexity', 'Access', 'Easy'], text: "What is the time complexity of a Push operation in a Linked-List based Stack?", options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"], correct: 0, explanation: "Pushing simply means adding a new node at the head of the linked list, which takes O(1) time." },
    { id: 4, tags: ['Sequence', 'Logic', 'Medium'], text: "Given an empty stack, after executing: Push(1), Push(2), Pop(), Push(3), what is the top element?", options: ["1", "2", "3", "null"], correct: 2, explanation: "Stack state: [1] -> [1,2] -> [1] -> [1,3]. The top element is 3." },
    { id: 5, tags: ['Algorithm', 'Parentheses', 'Medium'], text: "How is a stack used to check for balanced parentheses?", options: ["Push open brackets, pop when a matching close bracket is found", "Push all brackets, then pop them to reverse the string", "Count the number of items pushed", "You cannot use a stack for this"], correct: 0, explanation: "By pushing open brackets, you ensure that the most recent open bracket (top of stack) matches the next close bracket encountered." },
    { id: 6, tags: ['Algorithm', 'Postfix', 'Medium'], text: "When evaluating a Postfix expression (e.g., '3 4 +') using a stack, what happens when an operator is encountered?", options: ["Push the operator to the stack", "Pop the top two numbers, apply the operator, and push the result", "Clear the stack", "Pop one number and return it"], correct: 1, explanation: "Operators pop their operands from the stack, compute the mathematical result, and push the result back onto the stack." },
{
id: 7,
tags: ['Algorithm', 'DFS', 'Medium'],
text: "Which graph traversal algorithm naturally uses a Stack (either explicitly or via recursion)?",
options: [
"Breadth-First Search (BFS)",
"Depth-First Search (DFS)",
"Dijkstra's Algorithm",
"Kruskal's Algorithm"
],
correct: 1,
explanation: "Depth-First Search explores nodes by going as deep as possible before backtracking. This behavior is implemented using a stack, either explicitly or through the call stack in recursive implementations."
},
    { id: 8, tags: ['Architecture', 'System', 'Hard'], text: "What happens when a recursive function calls itself infinitely?", options: ["Queue Underflow", "Stack Overflow", "Heap Fragmentation", "Cache Miss"], correct: 1, explanation: "The Call Stack stores memory for each function call. Infinite recursion exceeds the allocated memory, causing a Stack Overflow." }
];