import type { Metadata } from 'next';
import { getGallery } from '@/features/portfolio/data/gallery';
import GalleryPageContent from '@/features/portfolio/components/GalleryPageContent';

export const revalidate = 120; // ISR: revalida a galeria a partir do banco a cada 2 min

export const metadata: Metadata = {
  title: 'Galeria',
  description: 'Explore a galeria de trabalhos dos artistas do Ink Studio. Tatuagens, piercings e arte corporal.',
  openGraph: {
    title: 'Galeria | Ink Studio',
    description: 'Veja os trabalhos mais recentes dos nossos artistas.',
  },
};

export default async function GalleryPage() {
  const gallery = await getGallery();
  return <GalleryPageContent gallery={gallery} />;
}
