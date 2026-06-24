import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/features/auth/data/session';
import { getAgendaProfissional } from '@/features/booking/data/agenda';

const ScheduleContent = dynamic(() => import('@/legacy/Schedule'));

export const metadata: Metadata = { title: 'Agenda', robots: { index: false } };

export default async function SchedulePage() {
  const usuario = await getCurrentUser();
  if (!usuario) redirect('/login');

  const role = usuario.tipo === 'ADMIN' ? 'admin' : usuario.tipo === 'PROFISSIONAL' ? 'artist' : 'client';
  // Tatuador vê só a própria agenda; admin/gerente vê todas.
  const profissionalId = role === 'artist' ? (usuario.profissional?.id ?? null) : null;
  const items = await getAgendaProfissional(profissionalId);

  return <ScheduleContent items={items} role={role} />;
}
