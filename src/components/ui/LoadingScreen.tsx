import React from 'react';
import { motion } from 'framer-motion';

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          times: [0, 0.5, 1],
          repeat: Infinity,
        }}
        className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full"
      />
    </div>
  );
}
