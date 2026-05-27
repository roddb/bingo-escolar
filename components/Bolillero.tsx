'use client';

import { motion, AnimatePresence, useAnimate } from 'framer-motion';
import { useEffect } from 'react';
import { Dices } from 'lucide-react';

interface BolilleroProps {
  isDrawing: boolean;
  currentNumber: number | null;
}

/**
 * Bolillero institucional con secuencia coreografiada:
 * idle → shake (400ms) → spin (1400ms con custom bezier) → reveal número (spring bounce)
 */
export function Bolillero({ isDrawing, currentNumber }: BolilleroProps) {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    if (!isDrawing) return;
    const sequence = async () => {
      // 1. Shake (anticipación)
      await animate(
        scope.current,
        { x: [-8, 8, -8, 8, -4, 4, 0], rotate: [-2, 2, -2, 2, -1, 1, 0] },
        { duration: 0.45, ease: 'easeInOut' }
      );
      // 2. Spin (giro rápido + easing custom para sensación de inercia)
      await animate(
        scope.current,
        { rotate: 720 },
        { duration: 1.2, ease: [0.4, 0, 0.2, 1] }
      );
      // 3. Settle: vuelve a rotación 0 con micro-overshoot
      await animate(
        scope.current,
        { rotate: 0 },
        { type: 'spring', stiffness: 180, damping: 14, mass: 0.7 }
      );
    };
    void sequence();
  }, [isDrawing, animate, scope]);

  return (
    <div className="relative flex flex-col items-center gap-4">
      {/* Esfera del bolillero con 3D look */}
      <div className="relative">
        {/* Glow detrás del bolillero */}
        <div
          aria-hidden
          className="absolute inset-0 rounded-full bg-brand-soft/30 blur-2xl"
          style={{ transform: 'scale(1.1)' }}
        />
        <motion.div
          ref={scope}
          className="relative h-48 w-48 rounded-full flex items-center justify-center preserve-3d"
          style={{
            background: 'radial-gradient(circle at 30% 30%, #F59E0B 0%, #F97316 50%, #C2410C 100%)',
            boxShadow:
              'inset -10px -12px 24px rgba(0,0,0,0.35), inset 8px 10px 16px rgba(255,255,255,0.5), 12px 16px 32px rgba(31,27,75,0.30)',
          }}
        >
          {isDrawing ? (
            <Dices className="h-16 w-16 text-white drop-shadow-lg" strokeWidth={2.5} />
          ) : currentNumber !== null ? (
            <span className="text-7xl font-extrabold text-white drop-shadow-lg">{currentNumber}</span>
          ) : (
            <div className="text-center text-white/90 font-bold leading-tight text-base px-3">
              Presioná
              <br />
              TIRAR
            </div>
          )}
        </motion.div>
      </div>

      {/* Número "que sale" del bolillero — drop con bounce */}
      <AnimatePresence mode="wait">
        {currentNumber !== null && !isDrawing && (
          <motion.div
            key={`drop-${currentNumber}`}
            initial={{ y: -120, opacity: 0, scale: 0.4 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 280, damping: 14, mass: 1 }}
            className="clay px-8 py-4 flex flex-col items-center gap-1"
          >
            <span className="text-xs uppercase tracking-widest text-ink-muted font-bold">
              Último número
            </span>
            <motion.span
              key={`num-${currentNumber}`}
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
              className="text-6xl font-extrabold text-danger leading-none"
            >
              {currentNumber}
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
