import type { Metadata } from 'next';
import LandingContent from '@/features/landing/components/LandingContent';

export const metadata: Metadata = {
  title: 'Ink Studio — Tatuagem & Piercing | Agende sua Sessão',
  description:
    'Conectamos você aos melhores tatuadores e body piercers do mercado. Explore portfólios, descubra designs exclusivos e agende sua sessão com segurança.',
  openGraph: {
    title: 'Ink Studio — Tatuagem & Piercing',
    description: 'Agende sua tatuagem ou piercing com os melhores artistas do mercado.',
    type: 'website',
    locale: 'pt_BR',
  },
};

import { Suspense } from 'react';

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background-dark"></div>}>
      <LandingContent />
    </Suspense>
  );
}
