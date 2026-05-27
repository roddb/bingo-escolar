'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';

interface CellProps {
  num: number;
  called: boolean;
}

const Cell = memo(function Cell({ num, called }: CellProps) {
  return (
    <motion.div
      layout
      initial={false}
      animate={called ? 'called' : 'available'}
      variants={{
        available: {
          scale: 1,
          rotateY: 0,
        },
        called: {
          scale: [1, 1.18, 1.08],
          rotateY: [0, 180, 360],
          transition: {
            scale: { type: 'spring', stiffness: 280, damping: 14 },
            rotateY: { duration: 0.7, ease: [0.34, 1.56, 0.64, 1] },
          },
        },
      }}
      className={`${called ? 'clay-cell-called' : 'clay-cell'} flex aspect-square items-center justify-center text-xl font-extrabold preserve-3d ${called ? '' : 'text-ink'}`}
    >
      {num}
    </motion.div>
  );
});

interface TableroProps {
  calledNumbers: number[];
}

/**
 * Tablero 9x10 con 90 números. Cada celda es un `Cell` memoizado para evitar
 * re-renders. Cuando un número entra a `calledNumbers`, la celda dispara
 * scale + rotateY 360 con spring physics.
 */
export function Tablero({ calledNumbers }: TableroProps) {
  const called = new Set(calledNumbers);
  const numbers = Array.from({ length: 90 }, (_, i) => i + 1);

  return (
    <div className="grid grid-cols-9 gap-2 sm:gap-3 w-full max-w-2xl mx-auto">
      {numbers.map((n) => (
        <Cell key={n} num={n} called={called.has(n)} />
      ))}
    </div>
  );
}
