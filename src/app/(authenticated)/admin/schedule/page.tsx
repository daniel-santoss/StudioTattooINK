import type { Metadata } from 'next';
import dynamic from 'next/dynamic';

const ScheduleContent = dynamic(() => import('@/legacy/Schedule'));

export const metadata: Metadata = { title: 'Agenda', robots: { index: false } };

export default function SchedulePage() {
  return <ScheduleContent />;
}
