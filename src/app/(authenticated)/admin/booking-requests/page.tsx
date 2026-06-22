import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const BookingRequestsContent = dynamic(() => import('@/legacy/BookingRequests'));

export const metadata: Metadata = { title: 'Solicitações de Booking', robots: { index: false } };

export default function BookingRequestsPage() {
  return <BookingRequestsContent />;
}
