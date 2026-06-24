import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/features/auth/data/session';

// Guarda da área administrativa (defesa em profundidade — o middleware é só roteamento).
// Clientes não têm acesso a nenhuma tela /admin/*; telas só-de-gerente checam ADMIN em cada página.
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const usuario = await getCurrentUser();
  if (!usuario) redirect('/login');
  if (usuario.tipo === 'CLIENTE') redirect('/my-appointments');

  return <>{children}</>;
}
