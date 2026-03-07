export const singlyLinkedList = [
    { id: 1, tags: ['Definition', 'Node', 'Easy'], text: "What two pieces of information does a Singly Linked List node typically hold?", options: ["Index and Value", "Value and Next Pointer", "Previous Pointer and Next Pointer", "Value and Memory Address of Head"], correct: 1, explanation: "A node in a singly linked list stores the data (value) and a reference (pointer) to the next node." },
    { id: 2, tags: ['Traversal', 'Access', 'Easy'], text: "What is the time complexity to access the nth element in a Singly Linked List?", options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"], correct: 2, explanation: "Unlike arrays, linked lists do not have contiguous memory, so you must start at the head and traverse node by node (O(n))." },
    { id: 3, tags: ['Insertion', 'Head', 'Easy'], text: "What is the time complexity of inserting a new node at the HEAD of a Singly Linked List?", options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"], correct: 0, explanation: "You only need to update the new node's next pointer to the current head, and update the head reference. This takes constant time." },
    { id: 4, tags: ['Algorithm', 'Middle', 'Medium'], text: "What is the most efficient way to find the middle node of a Singly Linked List in a single pass?", options: ["Count all nodes, then divide by 2", "Use a slow pointer (1 step) and a fast pointer (2 steps)", "Hash all node addresses", "Traverse backwards from the tail"], correct: 1, explanation: "The 'Tortoise and Hare' algorithm moves one pointer at 1x speed and another at 2x speed. When the fast one hits the end, the slow one is in the middle." },
    {
id: 5,
tags: ['Pointers', 'Deletion', 'Medium'],
text: "Which operation on a Singly Linked List requires maintaining a pointer to the previous node?",
options: [
"Inserting a new node at the head",
"Traversing the list",
"Deleting a specific node when only the head pointer is known",
"Accessing the first element"
],
correct: 2,
explanation: "To delete a node in a singly linked list, you must update the previous node’s 'next' pointer to skip the node being removed. Therefore, a reference to the previous node is required during traversal."
},
    { id: 6, tags: ['Deletion', 'Tail', 'Medium'], text: "Even if you have a pointer directly to the TAIL node, why does deleting the tail of a Singly Linked List still take O(n) time?", options: ["You must shift all values left", "You need to traverse from the head to find the second-to-last node to update its next pointer", "Memory deallocation takes O(n)", "It actually takes O(1)"], correct: 1, explanation: "To remove the tail, the node preceding it must have its 'next' pointer set to null. In a singly linked list, you can't step backward, so you must traverse from the head." },
    { id: 7, tags: ['Algorithm', 'Cycles', 'Hard'], text: "Which algorithm is used to detect if a Singly Linked List contains a cycle?", options: ["Dijkstra's Algorithm", "Kahn's Algorithm", "Floyd's Cycle-Finding Algorithm", "Bellman-Ford Algorithm"], correct: 2, explanation: "Floyd's Cycle-Finding (Tortoise and Hare) uses a slow and fast pointer. If they eventually point to the same node, a cycle exists." },
    {id: 8,tags: ['Sorting', 'Merge Sort', 'Hard'],text: "Why is Merge Sort preferred over Quick Sort for Linked Lists?",options: ["Merge Sort can merge lists efficiently using pointer manipulation","Quick Sort cannot compare values","Merge Sort runs in O(n)","Quick Sort requires extra arrays"],correct: 0,explanation: "Merge sort splits and merges linked lists efficiently using pointer adjustments without expensive random access."}
];