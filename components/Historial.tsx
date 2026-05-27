'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface HistorialProps {
  calledNumbers: number[];
}

const containerVariants = {
  show: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { x: -50, opacity: 0, scale: 0.85 },
  show: { x: 0, opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 320, damping: 22 } },
  exit: { x: 50, opacity: 0, transition: { duration: 0.2 } },
};

export function Historial({ calledNumbers }: HistorialProps) {
  if (calledNumbers.length === 0) {
    return (
      <div className="text-center text-ink-muted italic text-sm py-6">
        Los números aparecerán acá apenas comience el juego.
      </div>
    );
  }

  // Más reciente primero
  const reversed = [...calledNumbers].reverse();

  return (
    <motion.ol
      variants={containerVariants}
      initial="show"
      animate="show"
      className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1"
    >
      <AnimatePresence initial={false}>
        {reversed.map((num, idx) => {
          const order = calledNumbers.length - idx;
          const isLatest = idx === 0;
          return (
            <motion.li
              key={num}
              variants={itemVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className={`flex items-center justify-between px-3 py-2 rounded-clay-md text-sm font-bold ${
                isLatest
                  ? 'bg-danger/10 border-2 border-danger/40 text-danger'
                  : 'bg-surface/70 text-ink'
              }`}
            >
              <span className="text-xl">{num}</span>
              <span className="text-xs text-ink-muted">#{order}</span>
            </motion.li>
          );
        })}
      </AnimatePresence>
    </motion.ol>
  );
}
