import 'server-only';
import { cache } from 'react';
import { createClient } from '@/shared/lib/supabase/server';
import { prisma } from '@/shared/lib/prisma';

/**
 * Usuário autenticado atual (sessão Supabase → registro Usuario no banco).
 * `cache` deduplica a consulta dentro do mesmo request.
 * Fonte de verdade do papel: Usuario.tipo no banco.
 */
export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  return prisma.usuario.findUnique({
    where: { authId: user.id },
    include: { cliente: true, profissional: true },
  });
});
