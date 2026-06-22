import type { Metadata } from 'next';
import { getArtistById, getArtistIds } from '@/features/portfolio/data/artists';
import ArtistProfileContent from '@/features/portfolio/components/ArtistProfileContent';

export const revalidate = 60; // ISR: revalida o perfil a partir do banco a cada 60s

export async function generateStaticParams() {
  const ids = await getArtistIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const artist = await getArtistById(id);
  if (!artist) {
    return { title: 'Artista não encontrado' };
  }
  return {
    title: `${artist.name} — Portfólio`,
    description: `Confira o portfólio de ${artist.name}. Especialista em ${artist.styles.slice(0, 3).join(', ')}.`,
    openGraph: {
      title: `${artist.name} | Ink Studio`,
      description: `Portfólio e agendamento com ${artist.name}.`,
      images: artist.avatarUrl ? [artist.avatarUrl] : undefined,
    },
  };
}

export default async function ArtistProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const artist = await getArtistById(id);

  if (!artist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-text-muted">Artista não encontrado.</p>
      </div>
    );
  }

  return <ArtistProfileContent artist={artist} />;
}
