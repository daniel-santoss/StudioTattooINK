import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const ServiceHistoryContent = dynamic(() => import('@/legacy/ServiceHistory'));

export const metadata: Metadata = { title: 'Histórico de Serviços', robots: { index: false } };

export default function HistoryPage() {
  return <ServiceHistoryContent />;
}
