import type { Metadata } from 'next';
import { getAllArtists } from '@/features/portfolio/data/artists';
import ArtistsPageContent from '@/features/portfolio/components/ArtistsPageContent';

export const revalidate = 60; // ISR real: revalida a lista a partir do banco a cada 60s

export const metadata: Metadata = {
  title: 'Artistas',
  description: 'Conheça nossos artistas tatuadores e body piercers. Veja portfólios, avaliações e agende sua sessão.',
  openGraph: {
    title: 'Artistas | Ink Studio',
    description: 'Conheça nossos artistas e encontre o profissional ideal.',
  },
};

export default async function ArtistsPage() {
  const artists = await getAllArtists();
  return <ArtistsPageContent artists={artists} />;
}
