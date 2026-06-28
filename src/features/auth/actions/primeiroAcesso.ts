'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/shared/lib/supabase/server';
import { prisma } from '@/shared/lib/prisma';
import { getCurrentUser } from '@/features/auth/data/session';
import { senhaForte } from '@/features/auth/lib/senha';

export type PrimeiroAcessoState = { error?: string } | null;

/**
 * Troca a senha temporária pelo valor escolhido pelo profissional no primeiro acesso.
 * 1. Valida força da senha server-side.
 * 2. Atualiza a senha no Supabase Auth.
 * 3. Marca primeiroAcesso = false no banco.
 * 4. Faz logout e redireciona para /login.
 */
export async function definirNovaSenha(
  _prev: PrimeiroAcessoState,
  formData: FormData,
): Promise<PrimeiroAcessoState> {
  const senha = String(formData.get('senha') ?? '');
  const confirmar = String(formData.get('confirmar') ?? '');

  const erroForca = senhaForte(senha);
  if (erroForca) return { error: erroForca };
  if (senha !== confirmar) return { error: 'As senhas não conferem.' };

  const usuario = await getCurrentUser();
  if (!usuario) return { error: 'Sessão expirada. Faça login novamente.' };
  if (!usuario.primeiroAcesso) return { error: 'Operação não permitida.' };

  const supabase = await createClient();

  const { error: errAuth } = await supabase.auth.updateUser({ password: senha });
  if (errAuth) return { error: `Não foi possível atualizar a senha: ${errAuth.message}` };

  await prisma.usuario.update({
    where: { id: usuario.id },
    data: { primeiroAcesso: false },
  });

  // Encerra a sessão — o profissional fará login com a nova senha
  await supabase.auth.signOut();
  redirect('/login?senha_criada=1');
}
