import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/features/auth/data/session';
import { getPerfil } from '@/features/auth/data/perfil';

const ProfileContent = dynamic(() => import('@/legacy/Profile'));

export const metadata: Metadata = { title: 'Perfil', robots: { index: false } };

export default async function AdminProfilePage() {
  const usuario = await getCurrentUser();
  if (!usuario) redirect('/login');

  const profile = await getPerfil(usuario.id);
  return <ProfileContent profile={profile} />;
}
