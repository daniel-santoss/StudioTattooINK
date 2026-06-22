import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const ReportsContent = dynamic(() => import('@/legacy/Reports'));

export const metadata: Metadata = { title: 'Ocorrências', robots: { index: false } };

export default function ReportsPage() {
  return <ReportsContent />;
}
