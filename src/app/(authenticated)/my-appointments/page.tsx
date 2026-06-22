import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/features/auth/data/session';
import { getMinhaAgenda } from '@/features/booking/data/minhaAgenda';
import ClientDashboard from '@/legacy/client/ClientDashboard';

export const metadata: Metadata = {
  title: 'Meus Agendamentos',
  robots: { index: false },
};

export default async function MyAppointmentsPage() {
  const usuario = await getCurrentUser();
  if (!usuario) redirect('/login');

  // Sem perfil de cliente (ex: profissional/admin) → lista vazia.
  const appointments = usuario.cliente ? await getMinhaAgenda(usuario.cliente.id) : [];

  return <ClientDashboard appointments={appointments} />;
}
