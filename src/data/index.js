import { arrayList } from './quiz/arrayList';
import { singlyLinkedList } from './quiz/singlyLinkedList';
import { doublyLinkedList } from './quiz/doublyLinkedList';
import { stack } from './quiz/stack';
import { queue } from './quiz/queue';
import { bst } from './quiz/bst';
import { avl } from './quiz/avl';
import { splay } from './quiz/splay';
import { redBlack } from './quiz/redBlack';
import { btree } from './quiz/btree';
import { heap } from './quiz/heap';
import { hash } from './quiz/hash';
import { graph } from './quiz/graph';

export const QUIZ_DATA = {
  'ArrayList': arrayList,
  'Singly Linked List': singlyLinkedList,
  'Doubly Linked List': doublyLinkedList,
  'Stack': stack,
  'Queue': queue,
  'Trees - BST': bst,
  'Trees - AVL': avl,
  'Trees - Splay': splay,
  'Trees - Red-Black': redBlack,
  'Trees - B-Tree': btree,
  'Heaps': heap,
  'Hash': hash,
  'Graphs': graph,
  'Default': [
    {
      id: 1, tags: ['General', 'Concepts', 'Placeholder'],
      text: "Quiz not found for this structure.",
      options: ["A", "B", "C", "D"],
      correct: 0,
      explanation: "Please ensure the mapping in index.js matches the TopMenuBar options exactly."
    }
  ]
};