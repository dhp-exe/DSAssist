import React, { useMemo, useRef, useEffect, useState } from 'react'
import { useStore } from '../../store/useStore'
import { BST, AVLTree, SplayTree, RedBlackTree, BTree } from '../../algorithms/trees'
import { AnimatedEdge, AnimatedNode } from './AnimatedTreeElements'

export default function TreeVisualizer({ type }) {
  const data = useStore((s) => s.data)
  const treeActions = useStore((s) => s.treeActions)
  const highlightNodeValue = useStore((s) => s.highlightNodeValue)
  
  const containerRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: Math.max(800, containerRef.current.clientWidth),
        height: Math.max(600, containerRef.current.clientHeight)
      })
    }
  }, [])

  const { nodes, edges } = useMemo(() => {
    let tree;
    const isBTree = type === 'Trees - B-Tree'

    if (type === 'Trees - AVL') tree = new AVLTree()
    else if (type === 'Trees - Red-Black') tree = new RedBlackTree()
    else if (type === 'Trees - Splay') tree = new SplayTree()
    else if (isBTree) tree = new BTree(2) 
    else tree = new BST() 

    // Replay actions to generate the current specific tree shape (Vital for Splay Trees)
    const actions = treeActions && treeActions.length > 0 ? treeActions : data.map(val => ({op: 'insert', val}));
    
    actions.forEach((a) => {
        if (a.op === 'insert') tree.insert(a.val);
        else if (a.op === 'delete' && tree.delete) tree.delete(a.val);
        else if (a.op === 'find' && tree.searchPath) tree.searchPath(a.val);
    });

    const nodesList = []
    const edgesList = []
    const levelHeight = 80 

    const traverseBinary = (node, depth, leftBound, rightBound, yOffset, parentX, parentY, parentVal) => {
      if (!node || node.value === null || node.value === undefined) return

      const x = leftBound + (rightBound - leftBound) / 2
      const y = yOffset

      if (parentX !== null && parentY !== null) {
        edgesList.push({ id: `e-${parentVal}-${node.value}`, x1: parentX, y1: parentY, x2: x, y2: y })
      }

      let colorType = 'default'
      if (node.color === 0) colorType = 'red'
      if (node.color === 1) colorType = 'black'

      nodesList.push({ id: `n-${node.value}`, value: node.value, x, y, colorType })

      traverseBinary(node.left, depth + 1, leftBound, x, yOffset + levelHeight, x, y, node.value)
      traverseBinary(node.right, depth + 1, x, rightBound, yOffset + levelHeight, x, y, node.value)
    }

    const traverseBTree = (node, depth, leftBound, rightBound, yOffset, parentX, parentY, parentId) => {
      if (!node || node.keys.length === 0) return

      const x = leftBound + (rightBound - leftBound) / 2
      const y = yOffset
      const nodeId = node.keys.join(',')

      if (parentX !== null && parentY !== null) {
        edgesList.push({ id: `e-${parentId}-${nodeId}`, x1: parentX, y1: parentY, x2: x, y2: y })
      }

      nodesList.push({ id: `n-${nodeId}`, value: `[${node.keys.join(', ')}]`, x, y, colorType: 'btree' })

      if (!node.isLeaf) {
        const numChildren = node.children.length;
        const sectionWidth = (rightBound - leftBound) / numChildren;
        node.children.forEach((child, i) => {
           traverseBTree(child, depth + 1, leftBound + i * sectionWidth, leftBound + (i + 1) * sectionWidth, yOffset + levelHeight, x, y, nodeId)
        })
      }
    }

    if (tree.root) {
      if (isBTree && tree.root.keys.length > 0) traverseBTree(tree.root, 0, 0, dimensions.width, 60, null, null, null)
      else if (!isBTree && tree.root.value !== null) traverseBinary(tree.root, 0, 0, dimensions.width, 60, null, null, null)
    }

    return { nodes: nodesList, edges: edgesList }
  }, [data, treeActions, type, dimensions.width])

  if (!nodes || nodes.length === 0) {
    return <div className="h-full flex items-center justify-center text-slate-400">Empty tree — add elements.</div>
  }

  return (
    <div className="h-full w-full overflow-auto relative bg-slate-50" ref={containerRef}>
      <svg className="absolute top-0 left-0 pointer-events-none z-0" style={{ width: dimensions.width, height: Math.max(dimensions.height, nodes.length > 0 ? Math.max(...nodes.map(n => n.y)) + 100 : 0) }}>
        {edges.map((e) => (<AnimatedEdge key={e.id} edge={e} />))}
      </svg>

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
        {nodes.map((n) => {
          let bgClass = "bg-white border-slate-300 text-slate-700 rounded-full"
          if (n.colorType === 'red') bgClass = "bg-red-500 border-red-600 text-white rounded-full"
          else if (n.colorType === 'black') bgClass = "bg-slate-800 border-slate-900 text-white rounded-full"
          else if (n.colorType === 'btree') bgClass = "bg-emerald-100 border-emerald-500 text-emerald-800 rounded-lg" 

          let isHighlighted = false;
          let isFound = false;

          // Animation highlight resolver
          if (highlightNodeValue !== null) {
              const strVal = String(highlightNodeValue);
              if (strVal.startsWith('FOUND-')) {
                  const target = Number(strVal.replace('FOUND-', ''));
                  isHighlighted = n.colorType === 'btree' ? n.id.includes(target) : n.value === target;
                  isFound = isHighlighted;
              } else {
                  isHighlighted = n.colorType === 'btree' ? n.id === `n-${highlightNodeValue}` : n.value === highlightNodeValue;
              }
          }

          if (isFound) bgClass += " ring-4 ring-green-400 bg-green-100 scale-110 text-green-900 shadow-lg z-20 transition-all";
          else if (isHighlighted) bgClass += " ring-4 ring-yellow-400 bg-yellow-100 scale-110 text-yellow-900 shadow-lg z-20 transition-all";

          return <AnimatedNode key={n.id} node={n} bgClass={bgClass} />
        })}
      </div>
    </div>
  )
}