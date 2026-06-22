import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getProfissionaisParaBooking } from '@/features/booking/data/booking';
import Booking from '@/legacy/client/Booking';

export const metadata: Metadata = {
  title: 'Agendar Sessão',
  description: 'Agende sua sessão de tatuagem ou piercing no Ink Studio.',
  robots: { index: false },
};

export default async function BookPage() {
  const artists = await getProfissionaisParaBooking();
  return (
    <Suspense fallback={<div className="p-8 text-text-muted">Carregando...</div>}>
      <Booking artists={artists} />
    </Suspense>
  );
}
