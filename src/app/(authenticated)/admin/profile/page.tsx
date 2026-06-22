import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const ProfileContent = dynamic(() => import('@/legacy/Profile'));

export const metadata: Metadata = { title: 'Perfil', robots: { index: false } };

export default function AdminProfilePage() {
  return <ProfileContent />;
}
