import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const ClientsContent = dynamic(() => import('@/legacy/Clients'));

export const metadata: Metadata = { title: 'Clientes', robots: { index: false } };

export default function ClientsPage() {
  return <ClientsContent />;
}
