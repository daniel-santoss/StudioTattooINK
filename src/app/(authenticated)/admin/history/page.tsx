import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/features/auth/data/session';
import { getHistoricoProfissional } from '@/features/booking/data/agenda';

const ServiceHistoryContent = dynamic(() => import('@/legacy/ServiceHistory'));

export const metadata: Metadata = { title: 'Histórico de Serviços', robots: { index: false } };

export default async function HistoryPage() {
  const usuario = await getCurrentUser();
  if (!usuario) redirect('/login');

  const profissionalId = usuario.tipo === 'PROFISSIONAL' ? (usuario.profissional?.id ?? null) : null;
  const items = await getHistoricoProfissional(profissionalId);

  return <ServiceHistoryContent items={items} />;
}
