'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Dices, RotateCcw, PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bolillero } from '@/components/Bolillero';
import { Tablero } from '@/components/Tablero';
import { Historial } from '@/components/Historial';
import { BingoModal } from '@/components/BingoModal';
import { AudioController } from '@/components/AudioController';
import { fireSmall, fireBig, fireFullscreen } from '@/components/ConfettiCannon';
import { playDraw, playTick, playBingo } from '@/lib/sounds';

const TOTAL_NUMBERS = 90;

export default function BingoEscolar() {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [calledNumbers, setCalledNumbers] = useState<number[]>([]);
  const [availableNumbers, setAvailableNumbers] = useState<number[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [bingoModalOpen, setBingoModalOpen] = useState(false);
  const [winnerName, setWinnerName] = useState<string | null>(null);
  const winnerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Inicializar números 1-90 al montar
  useEffect(() => {
    setAvailableNumbers(Array.from({ length: TOTAL_NUMBERS }, (_, i) => i + 1));
  }, []);

  // Cleanup timer del banner ganador
  useEffect(() => {
    return () => {
      if (winnerTimerRef.current) clearTimeout(winnerTimerRef.current);
    };
  }, []);

  const startGame = () => {
    setGameStarted(true);
    setCurrentNumber(null);
    setCalledNumbers([]);
    setAvailableNumbers(Array.from({ length: TOTAL_NUMBERS }, (_, i) => i + 1));
    if (winnerTimerRef.current) clearTimeout(winnerTimerRef.current);
    setWinnerName(null);
  };

  const drawNumber = () => {
    if (availableNumbers.length === 0 || isDrawing) return;

    setIsDrawing(true);

    // Esperar a que termine la coreografía del bolillero (~1.6s)
    setTimeout(() => {
      const idx = Math.floor(Math.random() * availableNumbers.length);
      const drawn = availableNumbers[idx];

      setCurrentNumber(drawn);
      setCalledNumbers((prev) => [...prev, drawn]);
      setAvailableNumbers((prev) => prev.filter((n) => n !== drawn));
      setIsDrawing(false);

      // Celebración
      const isMultipleOfTen = drawn % 10 === 0;
      if (isMultipleOfTen) {
        fireBig();
        playDraw();
        setTimeout(() => playTick(), 80);
      } else {
        fireSmall(0.22, 0.55);
        playDraw();
      }
    }, 1700);
  };

  const handleBingoClick = () => {
    fireFullscreen();
    playBingo();
    setTimeout(() => setBingoModalOpen(true), 350);
  };

  const handleResetWithWinner = (name: string) => {
    setBingoModalOpen(false);
    if (name) {
      setWinnerName(name);
      if (winnerTimerRef.current) clearTimeout(winnerTimerRef.current);
      winnerTimerRef.current = setTimeout(() => setWinnerName(null), 30000);
    }
    startGame();
  };

  const resetOnly = () => {
    setGameStarted(false);
    setCurrentNumber(null);
    setCalledNumbers([]);
    setAvailableNumbers(Array.from({ length: TOTAL_NUMBERS }, (_, i) => i + 1));
    setIsDrawing(false);
  };

  return (
    <div className="min-h-dvh bg-surface text-ink p-4 md:p-6">
      {/* Banner ganador (efímero, 30s) */}
      <AnimatePresence>
        {winnerName && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-30 clay px-8 py-4 bg-cta/95 text-white"
          >
            <div className="flex items-center gap-3">
              <PartyPopper className="h-7 w-7" />
              <span className="text-xl font-extrabold">
                ¡Ganador: {winnerName}!
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1600px] mx-auto flex flex-col gap-4 md:gap-6">
        {/* Header */}
        <header className="clay flex items-center justify-between px-5 py-3 md:px-7 md:py-4">
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-14 md:h-16 md:w-16 shrink-0">
              <Image
                src="/img/escudo-sta.png"
                alt="Escudo Colegio Santo Tomás de Aquino"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col leading-tight">
              <h1 className="text-2xl md:text-4xl font-extrabold text-brand tracking-tight">
                BINGO ESCOLAR
              </h1>
              <span className="text-xs md:text-sm text-ink-muted font-bold uppercase tracking-wider">
                Colegio Santo Tomás de Aquino
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <AudioController />
            <Button
              type="button"
              variant="danger"
              size="lg"
              onClick={handleBingoClick}
              disabled={!gameStarted}
              className="animate-attention"
            >
              <PartyPopper className="h-6 w-6 mr-2" />
              ¡BINGO!
            </Button>
          </div>
        </header>

        {/* Layout principal: 2 columnas (izq controles + bolillero + historial · der tablero) */}
        <main className="grid grid-cols-1 lg:grid-cols-[minmax(280px,2fr)_5fr] gap-4 md:gap-6">
          {/* Columna izquierda */}
          <div className="flex flex-col gap-4 md:gap-6">
            {/* Bolillero */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Bolillero</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-5 pt-2">
                <Bolillero isDrawing={isDrawing} currentNumber={currentNumber} />

                {/* Controles */}
                {!gameStarted ? (
                  <Button
                    type="button"
                    variant="success"
                    size="xl"
                    onClick={startGame}
                    className="w-full"
                  >
                    <Rocket className="h-6 w-6 mr-2" />
                    COMENZAR
                  </Button>
                ) : (
                  <div className="flex flex-col gap-3 w-full">
                    <Button
                      type="button"
                      variant="cta"
                      size="xl"
                      onClick={drawNumber}
                      disabled={isDrawing || availableNumbers.length === 0}
                      className="w-full"
                    >
                      <Dices className="h-6 w-6 mr-2" />
                      {isDrawing ? 'Tirando…' : 'TIRAR'}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="lg"
                      onClick={resetOnly}
                      className="w-full"
                    >
                      <RotateCcw className="h-5 w-5 mr-2" />
                      Reiniciar
                    </Button>
                  </div>
                )}

                {/* Stats */}
                {gameStarted && (
                  <div className="w-full grid grid-cols-2 gap-3 pt-2">
                    <div className="clay-cell text-center py-3">
                      <div className="text-xs uppercase tracking-wide text-ink-muted font-bold">
                        Salidos
                      </div>
                      <div className="text-3xl font-extrabold text-danger">
                        {calledNumbers.length}
                      </div>
                    </div>
                    <div className="clay-cell text-center py-3">
                      <div className="text-xs uppercase tracking-wide text-ink-muted font-bold">
                        Faltan
                      </div>
                      <div className="text-3xl font-extrabold text-success">
                        {availableNumbers.length}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Historial */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Historial</CardTitle>
              </CardHeader>
              <CardContent>
                <Historial calledNumbers={calledNumbers} />
              </CardContent>
            </Card>
          </div>

          {/* Columna derecha: Tablero */}
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Tablero</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <Tablero calledNumbers={calledNumbers} />
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Modal BINGO */}
      <BingoModal
        open={bingoModalOpen}
        onClose={() => setBingoModalOpen(false)}
        onReset={handleResetWithWinner}
      />
    </div>
  );
}
