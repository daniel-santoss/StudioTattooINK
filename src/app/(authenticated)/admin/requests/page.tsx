import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const RequestsContent = dynamic(() => import('@/legacy/Requests'));

export const metadata: Metadata = { title: 'Solicitações', robots: { index: false } };

export default function RequestsPage() {
  return <RequestsContent />;
}
