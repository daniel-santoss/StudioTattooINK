import type { Metadata } from 'next';
import { Suspense } from 'react';
import LandingContent from '@/features/landing/components/LandingContent';
import { getAllArtists } from '@/features/portfolio/data/artists';
import { getGallery } from '@/features/portfolio/data/gallery';
import { getCurrentUser } from '@/features/auth/data/session';

const AVATAR_FALLBACK = '/images/tatuadores/tatuador1.jpg';

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

export default async function HomePage() {
  const [allArtists, gallery, usuario] = await Promise.all([getAllArtists(), getGallery(), getCurrentUser()]);

  const artists = allArtists.slice(0, 3).map((a) => ({
    id: a.id,
    name: a.name,
    style: a.styles[0] ?? a.role,
    img: a.avatarUrl || AVATAR_FALLBACK,
  }));

  const galleryPreview = gallery.slice(0, 6).map((g) => ({
    id: g.id,
    artistId: g.artistId,
    name: g.artist,
    category: g.category,
    img: g.imageUrl,
  }));

  return (
    <Suspense fallback={<div className="min-h-screen bg-background-dark"></div>}>
      <LandingContent artists={artists} galleryPreview={galleryPreview} isAuthenticated={!!usuario} />
    </Suspense>
  );
}
