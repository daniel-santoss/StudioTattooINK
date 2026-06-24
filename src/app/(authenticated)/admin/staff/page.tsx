import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/features/auth/data/session';
import { getProfissionais } from '@/features/admin/data/gestao';

const StaffContent = dynamic(() => import('@/legacy/Staff'));

export const metadata: Metadata = { title: 'Tatuadores', robots: { index: false } };

export default async function StaffPage() {
  const usuario = await getCurrentUser();
  if (!usuario) redirect('/login');

  const staff = await getProfissionais();
  return <StaffContent staff={staff} />;
}
