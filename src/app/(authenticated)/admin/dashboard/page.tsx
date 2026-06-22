import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const DashboardContent = dynamic(() => import('@/legacy/Dashboard'));

export const metadata: Metadata = { title: 'Dashboard', robots: { index: false } };

export default function AdminDashboardPage() {
  return <DashboardContent />;
}
