import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/features/auth/data/session';
import { getSolicitacoesPendentes } from '@/features/booking/data/booking';
import BookingRequests from '@/legacy/BookingRequests';

export const metadata: Metadata = {
  title: 'Solicitações de Booking',
  robots: { index: false },
};

export default async function BookingRequestsPage() {
  const usuario = await getCurrentUser();
  if (!usuario) redirect('/login');

  const requests = await getSolicitacoesPendentes(usuario.profissional?.id ?? null);

  return <BookingRequests requests={requests} />;
}
