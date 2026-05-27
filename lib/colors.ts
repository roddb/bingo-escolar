// Paleta institucional STA. Misma fuente de verdad para Tailwind (via CSS variables)
// y para JS (canvas-confetti, etc). Mantener sincronizado con app/globals.css.

export const COLORS = {
  brand: '#4F46E5',
  brandSoft: '#818CF8',
  cta: '#F97316',
  success: '#10B981',
  danger: '#EF4444',
  surface: '#EEF2FF',
  surfaceRaised: '#FFFFFF',
  ink: '#1E1B4B',
  inkMuted: '#6366F1',
} as const;

// Confetti palette: indigo + naranja + dorados para look festivo institucional
export const CONFETTI_COLORS = [
  COLORS.brand,
  COLORS.brandSoft,
  COLORS.cta,
  '#FBBF24', // amber-400 (toque dorado)
  '#FFFFFF',
] as const;
