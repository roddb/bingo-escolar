'use client';

import { useEffect, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { setMuted, getMutedFromStorage } from '@/lib/sounds';
import { cn } from '@/lib/utils';

interface AudioControllerProps {
  className?: string;
}

export function AudioController({ className }: AudioControllerProps) {
  const [isMuted, setIsMutedState] = useState(false);

  // Hydration-safe: leer localStorage solo en client
  useEffect(() => {
    const initial = getMutedFromStorage();
    setIsMutedState(initial);
    setMuted(initial);
  }, []);

  const toggle = () => {
    const next = !isMuted;
    setIsMutedState(next);
    setMuted(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isMuted ? 'Activar sonido' : 'Silenciar'}
      aria-pressed={isMuted}
      className={cn(
        'clay-button h-14 w-14 flex items-center justify-center bg-surface-raised text-brand',
        className
      )}
    >
      {isMuted ? <VolumeX className="h-7 w-7" /> : <Volume2 className="h-7 w-7" />}
    </button>
  );
}
