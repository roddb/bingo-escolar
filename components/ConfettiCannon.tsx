'use client';

import confetti from 'canvas-confetti';
import { CONFETTI_COLORS } from '@/lib/colors';

const COLORS = [...CONFETTI_COLORS];

/**
 * Pequeño puff desde el bolillero (cada número sale).
 */
export function fireSmall(originX = 0.25, originY = 0.55) {
  confetti({
    particleCount: 35,
    spread: 60,
    startVelocity: 30,
    origin: { x: originX, y: originY },
    colors: COLORS,
    scalar: 0.8,
    ticks: 120,
    disableForReducedMotion: true,
  });
}

/**
 * Burst grande desde los 2 laterales (múltiplo de 10).
 */
export function fireBig() {
  const opts = {
    particleCount: 100,
    spread: 75,
    startVelocity: 45,
    colors: COLORS,
    ticks: 180,
    disableForReducedMotion: true,
  };
  confetti({ ...opts, origin: { x: 0, y: 0.6 }, angle: 60 });
  confetti({ ...opts, origin: { x: 1, y: 0.6 }, angle: 120 });
}

/**
 * Celebración pantalla completa (botón BINGO).
 * Repite 3 ráfagas con delay para efecto sostenido.
 */
export function fireFullscreen() {
  const burst = () => {
    confetti({
      particleCount: 220,
      spread: 130,
      startVelocity: 55,
      origin: { y: 0.6 },
      colors: COLORS,
      ticks: 250,
      gravity: 0.9,
      scalar: 1.1,
      disableForReducedMotion: true,
    });
  };
  burst();
  setTimeout(burst, 300);
  setTimeout(burst, 600);
}
