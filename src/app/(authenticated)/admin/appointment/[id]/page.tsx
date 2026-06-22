import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const AppointmentDetailsContent = dynamic(() => import('@/legacy/ArtistAppointmentDetails'));

export const metadata: Metadata = { title: 'Detalhes do Agendamento', robots: { index: false } };

export default function AdminAppointmentPage() {
  return <AppointmentDetailsContent />;
}
