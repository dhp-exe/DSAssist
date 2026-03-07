export const redBlack = [
    { id: 1, tags: ['Definition', 'Colors', 'Easy'], text: "In a Red-Black Tree, what color must the Root node be?", options: ["Red", "Black", "Either", "Alternating"], correct: 1, explanation: "By rule, the root of a valid Red-Black tree is always Black." },
    { id: 2, tags: ['Rules', 'Red Nodes', 'Easy'], text: "If a node is Red, what color MUST its children be?", options: ["Red", "Black", "Either", "Null"], correct: 1, explanation: "A Red-Black tree strictly forbids two Red nodes from appearing consecutively (a red node cannot have a red child)." },
    { id: 3, tags: ['Rules', 'Leaves', 'Easy'], text: "What color are the empty (Null/NIL) leaves considered to be?", options: ["Red", "Black", "Colorless", "Grey"], correct: 1, explanation: "All NIL leaves are treated as Black nodes to simplify edge-case handling in balancing algorithms." },
    { id: 4, tags: ['Rules', 'Black Height', 'Medium'], text: "The 'Black-Height' property of a Red-Black Tree states that:", options: ["The left side has more black nodes than right", "Every path from a node to its descendant leaves contains the same number of Black nodes", "All black nodes must have red children", "The tree is entirely black"], correct: 1, explanation: "This crucial property ensures the tree remains roughly balanced, as the longest path can be at most twice the shortest path." },
    { id: 5, tags: ['Insertion', 'Default', 'Medium'], text: "When a new node is inserted into a Red-Black tree, what is its initial color?", options: ["Black", "Red", "Random", "Based on parent"], correct: 1, explanation: "New nodes are always inserted as Red to prevent immediately violating the Black-Height property." },
    { id: 6, tags: ['Fixing', 'Uncle Node', 'Medium'], text: "During insertion, if a newly inserted Red node's parent is Red, and its 'Uncle' node is also Red, what action is taken?", options: ["Rotation", "Recoloring the parent, uncle, and grandparent", "Deleting the node", "Making the root Red"], correct: 1, explanation: "If the uncle is Red, we push the 'Redness' up the tree by recoloring the parent/uncle to Black and the grandparent to Red." },
    { id: 7, tags: ['Math', 'Max Height', 'Hard'], text: "What is the mathematical upper bound for the height of a Red-Black Tree with N internal nodes?", options: ["log2(N)", "2 * log2(N + 1)", "N / 2", "1.44 * log2(N)"], correct: 1, explanation: "Because red nodes cannot be consecutive, the longest path (alternating red/black) is at most twice the shortest path (all black), bounded by 2log(N+1)." },
{
id: 8,
tags: ['Insertion', 'Coloring', 'Hard'],
text: "If the values [10, 20, 30, 40] are inserted into a Red-Black Tree in this order, what will be the color of the node containing value 20 after rebalancing?",
options: [
"Red",
"Black",
"Yellow",
"Depends on implementation"
],
correct: 1,
explanation: "After inserting 10 (black) and 20 (red), inserting 30 causes a rotation that makes 20 the root and recolors it black. When 40 is inserted, recoloring occurs but 20 remains black. Therefore the node with value 20 is black."
}];