import PublicLayoutShell from '@/shared/components/layouts/PublicLayoutShell';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <PublicLayoutShell>{children}</PublicLayoutShell>;
}
