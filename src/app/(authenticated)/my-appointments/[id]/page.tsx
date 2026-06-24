import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { redirect, notFound } from 'next/navigation';
import { getCurrentUser } from '@/features/auth/data/session';
import { getAgendamentoDetalhe } from '@/features/booking/data/minhaAgenda';

const ClientAppointmentDetailsContent = dynamic(() => import('@/legacy/client/ClientAppointmentDetails'));

export const metadata: Metadata = {
  title: 'Detalhes do Agendamento',
  robots: { index: false },
};

export default async function AppointmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const usuario = await getCurrentUser();
  if (!usuario) redirect('/login');
  if (!usuario.cliente) notFound();

  const appointment = await getAgendamentoDetalhe(id, usuario.cliente.id);

  return <ClientAppointmentDetailsContent appointment={appointment} />;
}
