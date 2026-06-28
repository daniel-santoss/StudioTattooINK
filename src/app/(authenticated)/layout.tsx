import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/features/auth/data/session';
import AuthenticatedLayoutShell from '@/shared/components/layouts/AuthenticatedLayoutShell';
import type { UserRole } from '@/shared/types';

const TIPO_TO_ROLE: Record<string, UserRole> = {
  CLIENTE: 'client',
  PROFISSIONAL: 'artist',
  ADMIN: 'admin',
};

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  // Autorização real (defesa em profundidade — o middleware é só roteamento otimista).
  const usuario = await getCurrentUser();
  if (!usuario) redirect('/login');

  const role = TIPO_TO_ROLE[usuario.tipo] ?? 'client';

  return (
    <AuthenticatedLayoutShell
      role={role}
      name={usuario.nome}
      avatarUrl={usuario.avatarUrl ?? undefined}
      primeiroAcesso={usuario.primeiroAcesso}
    >
      {children}
    </AuthenticatedLayoutShell>
  );
}

