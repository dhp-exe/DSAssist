export const doublyLinkedList = [
    { id: 1, tags: ['Definition', 'Pointers', 'Easy'], text: "How does a Doubly Linked List differ from a Singly Linked List?", options: ["It uses two heads", "Each node contains a pointer to both the next and previous node", "It stores two values per node", "It connects the tail back to the head"], correct: 1, explanation: "Doubly linked lists maintain bidirectional links, allowing traversal in both directions." },
    { id: 2, tags: ['Memory', 'Overhead', 'Easy'], text: "What is a major disadvantage of a Doubly Linked List compared to a Singly Linked List?", options: ["Slower traversal", "Higher memory overhead per node", "Slower insertions at the head", "Inability to implement a queue"], correct: 1, explanation: "Because every node stores an extra pointer (previous), it consumes more memory than a singly linked list." },
    { id: 3, tags: ['Deletion', 'Time Complexity', 'Easy'], text: "If you have a direct pointer to the node you want to delete, what is the time complexity of deleting it in a Doubly Linked List?", options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"], correct: 0, explanation: "You can instantly access the previous and next nodes via the target node's pointers and link them together, bypassing the target in O(1) time." },
    { id: 4, tags: ['Insertion', 'Tail', 'Medium'], text: "Assuming you have a Tail pointer, what happens when you insert a new node at the end of a Doubly Linked List?", options: ["Traverse from head to tail, then insert", "Update new node's prev to tail, tail's next to new node, then update tail pointer", "You cannot insert at the tail", "Copy list to a new array, add element, convert back"], correct: 1, explanation: "With a tail pointer, insertion at the end is O(1) by updating the adjacent pointers and moving the tail reference." },
    { id: 5, tags: ['Traversal', 'Reverse', 'Medium'], text: "How do you traverse a Doubly Linked List in reverse order?", options: ["Start at head and recursively backtrack", "Start at tail and follow 'prev' pointers until reaching null", "Use a stack to store all nodes then pop them", "It's impossible without converting to an array"], correct: 1, explanation: "The primary benefit of the 'prev' pointer is the ability to start at the tail and cleanly walk backward." },
    { id: 6, tags: ['Edge Case', 'Single Node', 'Medium'], text: "When deleting the ONLY node in a Doubly Linked List, what must occur?", options: ["Set head to null and tail to null", "Set head's next to null", "Throw an exception", "Leave the node but set its value to 0"], correct: 0, explanation: "When the list goes from size 1 to size 0, both the global Head and Tail pointers must be reset to null." },
{
id: 7,
tags: ['Algorithm', 'Two Pointers', 'Hard'],
text: "Why are Doubly Linked Lists more suitable than Singly Linked Lists for implementing undo/redo functionality?",
options: [
"They allow traversal in both forward and backward directions",
"They store elements in sorted order automatically",
"They require fewer nodes",
"They prevent duplicate values"
],
correct: 0,
explanation: "Undo/redo systems require moving both backward (undo) and forward (redo) through states. Doubly linked lists support this efficiently because each node maintains both next and previous pointers."
},];