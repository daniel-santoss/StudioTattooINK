import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/features/auth/data/session';
import { getClientes } from '@/features/admin/data/gestao';

const ClientsContent = dynamic(() => import('@/legacy/Clients'));

export const metadata: Metadata = { title: 'Clientes', robots: { index: false } };

export default async function ClientsPage() {
  const usuario = await getCurrentUser();
  if (!usuario) redirect('/login');
  if (usuario.tipo !== 'ADMIN') redirect('/admin/dashboard');

  const clients = await getClientes();
  return <ClientsContent clients={clients} />;
}
