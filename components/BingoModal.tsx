'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Trophy, RotateCcw, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BingoModalProps {
  open: boolean;
  onClose: () => void;
  onReset: (winnerName: string) => void;
}

export function BingoModal({ open, onClose, onReset }: BingoModalProps) {
  const [winner, setWinner] = useState('');

  const handleReset = () => {
    onReset(winner.trim());
    setWinner('');
  };

  const handleClose = () => {
    onClose();
    setWinner('');
  };

  return (
    <Dialog.Root open={open} onOpenChange={(o) => !o && handleClose()}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-40"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 10 }}
                transition={{ type: 'spring', stiffness: 320, damping: 24 }}
                className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[min(92vw,480px)]"
              >
                <div className="clay p-8 flex flex-col items-center gap-5">
                  <div className="rounded-full bg-cta/15 p-5">
                    <Trophy className="h-14 w-14 text-cta" strokeWidth={2.2} />
                  </div>

                  <div className="text-center space-y-1">
                    <Dialog.Title asChild>
                      <h2 className="text-3xl font-extrabold text-brand">¡BINGO!</h2>
                    </Dialog.Title>
                    <Dialog.Description className="text-ink-muted">
                      Alguien cantó bingo. Anotá el nombre si querés mostrarlo en pantalla.
                    </Dialog.Description>
                  </div>

                  <div className="w-full">
                    <label
                      htmlFor="winner-name"
                      className="block text-sm font-bold text-ink mb-2"
                    >
                      Nombre del ganador (opcional)
                    </label>
                    <input
                      id="winner-name"
                      type="text"
                      value={winner}
                      onChange={(e) => setWinner(e.target.value)}
                      placeholder="Ej: Familia García"
                      maxLength={60}
                      autoFocus
                      className="w-full rounded-clay-md border-2 border-brand/20 bg-surface-raised px-4 py-3 text-lg text-ink focus:border-brand focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="flex gap-3 w-full mt-2">
                    <Button
                      type="button"
                      variant="success"
                      size="lg"
                      onClick={handleReset}
                      className="flex-1"
                    >
                      <RotateCcw className="h-5 w-5 mr-2" />
                      Nueva partida
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="lg"
                      onClick={handleClose}
                      className="flex-1"
                    >
                      <X className="h-5 w-5 mr-2" />
                      Cerrar
                    </Button>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
