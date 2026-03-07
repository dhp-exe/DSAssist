export const splay = [
    { id: 1, tags: ['Definition', 'Property', 'Easy'], text: "What unique property defines a Splay Tree?", options: ["It uses colors to balance", "Recently accessed elements are moved to the root", "It allows duplicate keys", "It guarantees strict O(log n) height"], correct: 1, explanation: "Splay trees reorganize themselves via rotations so that any inserted, searched, or accessed node becomes the new root." },
    { id: 2, tags: ['Performance', 'Cache', 'Easy'], text: "Splay Trees are particularly excellent for systems that experience:", options: ["Completely random access", "Spatial locality / heavily repeated access to the same items", "Write-only logging", "Strict real-time latency constraints"], correct: 1, explanation: "Because accessed items jump to the root, subsequent accesses to the same item take O(1) time." },
    { id: 3, tags: ['Complexity', 'Time', 'Easy'], text: "What is the Amortized time complexity of Splay Tree operations?", options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"], correct: 1, explanation: "While a single operation might take O(n), a sequence of M operations takes O(M log n), making the amortized cost O(log n)." },
    { id: 4, tags: ['Operation', 'Rotations', 'Medium'], text: "If a node 'X' is the left child of its parent, and its parent is the left child of the grandparent, which Splay step is used?", options: ["Zig", "Zig-Zig", "Zig-Zag", "Zag"], correct: 1, explanation: "A Left-Left alignment triggers a 'Zig-Zig' step, rotating the grandparent right, then the parent right." },
    { id: 5, tags: ['Operation', 'Rotations', 'Medium'], text: "Which Splay step is used when the node is a right child of a left child (LR alignment)?", options: ["Zig", "Zig-Zig", "Zig-Zag", "Zag-Zag"], correct: 2, explanation: "This triggers a 'Zig-Zag' step, which is equivalent to a standard Left-Right double rotation in an AVL tree." },
    { id: 6, tags: ['Complexity', 'Worst Case', 'Medium'], text: "What is the worst-case time complexity of a SINGLE access operation in a Splay Tree?", options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"], correct: 2, explanation: "Since a Splay Tree does not enforce strict height bounds, it can temporarily become a linked list of height O(n) before splaying fixes it." },
{
id: 7,
tags: ['Deletion', 'Strategy', 'Hard'],
text: "What is the key difference between bottom-up deletion and top-down deletion in a Splay Tree?",
options: [
"Bottom-up deletion splays the target node after removal, while top-down deletion splays it before removal",
"Bottom-up deletion splays the node to the root first then removes it, while top-down deletion restructures the tree during the search before deletion",
"Bottom-up deletion uses recursion while top-down deletion cannot use recursion",
"Bottom-up deletion only works on balanced trees"
],
correct: 1,
explanation: "In bottom-up deletion, the node is first splayed to the root and then removed, after which the left and right subtrees are rejoined. In top-down deletion, restructuring occurs during the search phase itself, splitting the tree and avoiding a separate splay step afterward."
}];