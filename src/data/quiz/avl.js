export const avl = [
    { id: 1, tags: ['Definition', 'Balance Factor', 'Easy'], text: "What is an AVL Tree?", options: ["A tree where nodes have up to 3 children", "A strictly balanced Binary Search Tree", "A tree used only for strings", "A tree that is not sorted"], correct: 1, explanation: "An AVL Tree is a self-balancing BST where the heights of the two child subtrees of any node differ by at most one." },
    { id: 2, tags: ['Property', 'Balance Factor', 'Easy'], text: "In an AVL tree, the Balance Factor of any node must be within what range?", options: ["0 to 1", "-1, 0, or 1", "-2 to 2", "1 to 10"], correct: 1, explanation: "Balance Factor = Height(Left) - Height(Right). If it falls outside [-1, 0, 1], rotations are triggered to fix it." },
    { id: 3, tags: ['Complexity', 'Search', 'Easy'], text: "What is the worst-case time complexity for finding a node in an AVL Tree?", options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"], correct: 1, explanation: "Because it strictly enforces balancing, it never degrades into a linked list, guaranteeing O(log n) worst-case search." },
    { id: 4, tags: ['Operation', 'Rotations', 'Medium'], text: "If an insertion causes a Left-Left (LL) imbalance, what rotation is required?", options: ["A single Right rotation", "A single Left rotation", "A Left followed by a Right rotation", "No rotation"], correct: 0, explanation: "A Left-Left heavy tree is pulled back into balance by performing a single Right rotation around the unbalanced node." },
    { id: 5, tags: ['Operation', 'Rotations', 'Medium'], text: "A Left-Right (LR) imbalance requires which sequence of rotations?", options: ["Right then Left", "Left then Right", "Left then Left", "Right then Right"], correct: 1, explanation: "First, a Left rotation on the child converts it to an LL imbalance. Then, a Right rotation on the parent fixes it." },
    { id: 6, tags: ['Comparison', 'Red-Black', 'Medium'], text: "Compared to a Red-Black tree, an AVL tree is:", options: ["Faster at inserting, slower at searching", "More strictly balanced, making searches faster but inserts slightly slower", "Exactly the same", "Uses less memory"], correct: 1, explanation: "AVL trees are more rigidly balanced, meaning lookups are faster, but they may require more rotations during insertions/deletions." },
    {
id: 7,
tags: ['Insertion', 'Rotation', 'Hard'],
text: "If the values [10, 20, 30, 40, 50, 60] are inserted into an AVL Tree in this order, what will be the root value after all insertions and rebalancing?",
options: [
"20",
"30",
"40",
"50"
],
correct: 2,
explanation: "AVL trees rebalance using rotations whenever the balance factor exceeds ±1. After inserting 10,20,30 the tree rotates to make 20 the root. Later insertions cause further rotations in the right subtree. When 60 is inserted, the tree performs a rotation that promotes 40 to the root to maintain AVL balance."
},
    { id: 8, tags: ['Algorithm', 'Deletion', 'Hard'], text: "During a deletion in an AVL tree, what is the maximum number of rotations that might occur?", options: ["At most 1", "At most 2", "O(log n) rotations all the way up to the root", "O(n) rotations"], correct: 2, explanation: "Unlike insertion which fixes the height with max 2 rotations, deleting a node might alter heights such that the imbalance propagates all the way to the root." }
];