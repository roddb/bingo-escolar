// Sound design del Bingo Escolar. Web Audio API (cero dependencias).
// AudioContext lazy-init en el primer gesture del usuario (anti-autoplay policy).

let ctx: AudioContext | null = null;
let muted = false;

export function setMuted(value: boolean) {
  muted = value;
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem('bingo-mute', value ? '1' : '0');
    } catch {
      /* ignore */
    }
  }
}

export function getMutedFromStorage(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem('bingo-mute') === '1';
  } catch {
    return false;
  }
}

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  // Resumir si el browser lo suspendió
  if (ctx.state === 'suspended') {
    void ctx.resume();
  }
  return ctx;
}

interface ToneOptions {
  freq: number;
  type?: OscillatorType;
  duration?: number;
  volume?: number;
  attack?: number;
  release?: number;
  startAt?: number;
}

function playTone({
  freq,
  type = 'sine',
  duration = 0.18,
  volume = 0.22,
  attack = 0.01,
  release = 0.12,
  startAt = 0,
}: ToneOptions) {
  const audio = getCtx();
  if (!audio) return;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  const t0 = audio.currentTime + startAt;

  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);

  // Envelope ADSR simple
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(volume, t0 + attack);
  gain.gain.setValueAtTime(volume, t0 + attack + duration);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + attack + duration + release);

  osc.connect(gain).connect(audio.destination);
  osc.start(t0);
  osc.stop(t0 + attack + duration + release + 0.02);
}

/**
 * Sonido cada vez que sale un número del bolillero. Tono medio agradable (D5).
 */
export function playDraw() {
  if (muted) return;
  playTone({ freq: 587.33, type: 'sine', duration: 0.12, volume: 0.18 });
}

/**
 * Sonido extra para múltiplos de 10 (más brillante).
 */
export function playTick() {
  if (muted) return;
  playTone({ freq: 1174.66, type: 'triangle', duration: 0.06, volume: 0.16, startAt: 0.05 });
}

/**
 * Sonido de victoria al apretar el botón BINGO. Arpegio C-E-G-C tipo campana.
 */
export function playBingo() {
  if (muted) return;
  const arpeggio = [
    { freq: 523.25, delay: 0.00 }, // C5
    { freq: 659.25, delay: 0.12 }, // E5
    { freq: 783.99, delay: 0.24 }, // G5
    { freq: 1046.5, delay: 0.40 }, // C6
  ];
  arpeggio.forEach(({ freq, delay }) => {
    playTone({
      freq,
      type: 'triangle',
      duration: 0.22,
      release: 0.45,
      volume: 0.28,
      startAt: delay,
    });
  });
}
