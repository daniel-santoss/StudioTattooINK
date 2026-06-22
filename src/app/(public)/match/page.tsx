import { Suspense } from 'react';
import type { Metadata } from 'next';
import MatchmakerWizard from '@/features/matchmaker/components/MatchmakerWizard';

export const metadata: Metadata = {
  title: 'Encontre seu Artista',
  description:
    'Use nosso matchmaker inteligente para encontrar o tatuador ou body piercer ideal para o seu projeto.',
  openGraph: {
    title: 'Encontre seu Artista | Ink Studio',
    description: 'Responda algumas perguntas e descubra o profissional perfeito para transformar sua ideia em realidade.',
  },
};

export default function MatchPage() {
  return (<Suspense fallback={<div>Carregando...</div>}><MatchmakerWizard /></Suspense>);
}
