import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/features/auth/data/session';
import { getResumoProfissional, getResumoAdmin } from '@/features/admin/data/dashboard';

const DashboardContent = dynamic(() => import('@/legacy/Dashboard'));

export const metadata: Metadata = { title: 'Dashboard', robots: { index: false } };

export default async function AdminDashboardPage() {
  const usuario = await getCurrentUser();
  if (!usuario) redirect('/login');

  if (usuario.tipo === 'PROFISSIONAL') {
    const resumo = await getResumoProfissional(usuario.profissional?.id ?? null);
    return <DashboardContent role="artist" artistResumo={resumo} />;
  }

  const resumo = await getResumoAdmin();
  return <DashboardContent role="admin" adminResumo={resumo} />;
}
