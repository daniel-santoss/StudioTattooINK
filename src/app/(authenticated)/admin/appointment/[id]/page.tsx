import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/features/auth/data/session';
import { getAgendamentoDetalheProfissional } from '@/features/booking/data/agenda';

const AppointmentDetailsContent = dynamic(() => import('@/legacy/ArtistAppointmentDetails'));

export const metadata: Metadata = { title: 'Detalhes do Agendamento', robots: { index: false } };

export default async function AdminAppointmentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const usuario = await getCurrentUser();
  if (!usuario) redirect('/login');

  // Tatuador só acessa os próprios; admin/gerente acessa qualquer um.
  const profissionalId = usuario.tipo === 'PROFISSIONAL' ? (usuario.profissional?.id ?? null) : null;
  const appointment = await getAgendamentoDetalheProfissional(id, profissionalId);

  return <AppointmentDetailsContent appointment={appointment} />;
}
