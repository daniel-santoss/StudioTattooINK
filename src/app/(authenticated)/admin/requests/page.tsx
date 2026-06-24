import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/features/auth/data/session';
import { getCandidaturas } from '@/features/admin/data/gestao';

const RequestsContent = dynamic(() => import('@/legacy/Requests'));

export const metadata: Metadata = { title: 'Solicitações', robots: { index: false } };

export default async function RequestsPage() {
  const usuario = await getCurrentUser();
  if (!usuario) redirect('/login');
  if (usuario.tipo !== 'ADMIN') redirect('/admin/dashboard');

  const requests = await getCandidaturas();
  return <RequestsContent requests={requests} />;
}
