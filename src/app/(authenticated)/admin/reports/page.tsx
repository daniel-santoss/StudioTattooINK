import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/features/auth/data/session';
import { getOcorrencias } from '@/features/admin/data/gestao';

const ReportsContent = dynamic(() => import('@/legacy/Reports'));

export const metadata: Metadata = { title: 'Ocorrências', robots: { index: false } };

export default async function ReportsPage() {
  const usuario = await getCurrentUser();
  if (!usuario) redirect('/login');

  const reports = await getOcorrencias();
  return <ReportsContent reports={reports} />;
}
