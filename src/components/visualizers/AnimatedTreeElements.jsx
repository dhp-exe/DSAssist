// src/components/visualizers/AnimatedTreeElements.jsx
import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedEdge = ({ edge }) => {
  return (
    <motion.line
      initial={{ x1: edge.x1, y1: edge.y1, x2: edge.x2, y2: edge.y2 }}
      animate={{
        x1: edge.x1,
        y1: edge.y1,
        x2: edge.x2,
        y2: edge.y2,
      }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      stroke="#94a3b8"
      strokeWidth="2"
    />
  );
};

export const AnimatedNode = ({ node, bgClass }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, x: "-50%", y: "-50%", left: node.x, top: node.y }}
      animate={{
        opacity: 1,
        scale: 1,
        x: "-50%", 
        y: "-50%",
        left: node.x,
        top: node.y,
      }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className={`absolute w-auto min-w-[3rem] px-3 h-12 border-2 flex items-center justify-center font-bold shadow-sm z-10 ${bgClass}`}
    >
      {node.value}
    </motion.div>
  );
};