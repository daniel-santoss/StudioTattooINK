'use server';

import { getCurrentUser } from '@/features/auth/data/session';

export type SessaoHeader = {
  isAuthenticated: boolean;
  role: 'client' | 'artist' | 'admin' | null;
};

/**
 * Estado de sessão real (cookies do Supabase) para o header público.
 * Invocada do cliente para não tornar as páginas públicas dinâmicas (preserva o ISR de /artists e /gallery).
 */
export async function getSessaoHeader(): Promise<SessaoHeader> {
  const usuario = await getCurrentUser();
  if (!usuario) return { isAuthenticated: false, role: null };
  const role = usuario.tipo === 'CLIENTE' ? 'client' : usuario.tipo === 'PROFISSIONAL' ? 'artist' : 'admin';
  return { isAuthenticated: true, role };
}
