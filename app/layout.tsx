import type { Metadata } from 'next';
import { Baloo_2 } from 'next/font/google';
import './globals.css';

const baloo = Baloo_2({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Bingo Escolar — Colegio Santo Tomás de Aquino',
  description: 'Bingo interactivo para actividades escolares del Colegio Santo Tomás de Aquino',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={baloo.className}>{children}</body>
    </html>
  );
}
