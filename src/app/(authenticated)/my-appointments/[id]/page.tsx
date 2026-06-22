import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const ClientAppointmentDetailsContent = dynamic(() => import('@/legacy/client/ClientAppointmentDetails'));

export const metadata: Metadata = {
  title: 'Detalhes do Agendamento',
  robots: { index: false },
};

export default function AppointmentDetailPage() {
  return <ClientAppointmentDetailsContent />;
}
