import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const StaffContent = dynamic(() => import('@/legacy/Staff'));

export const metadata: Metadata = { title: 'Tatuadores', robots: { index: false } };

export default function StaffPage() {
  return <StaffContent />;
}
