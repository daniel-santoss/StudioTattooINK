'use server';

import { randomBytes } from 'crypto';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/shared/lib/prisma';
import { getCurrentUser } from '@/features/auth/data/session';
import { createAdminClient } from '@/shared/lib/supabase/admin';
import { gerarUsernameUnico } from '@/features/auth/data/username';

export type CandidaturaState = {
  ok?: boolean;
  error?: string;
  credenciais?: { email: string; senha: string };
};

/**
 * Aprova a candidatura: cria o login no Supabase Auth (Admin API) + Usuario(PROFISSIONAL)
 * com o Profissional aninhado, e marca a candidatura como APROVADA.
 * Retorna uma senha temporária (mostrada uma vez ao admin) — o profissional troca depois.
 */
export async function aprovarCandidatura(candidaturaId: string): Promise<CandidaturaState> {
  const usuario = await getCurrentUser();
  if (!usuario || usuario.tipo !== 'ADMIN') {
    return { error: 'Apenas administradores podem aprovar candidaturas.' };
  }

  const cand = await prisma.profissionalCandidatura.findUnique({ where: { id: candidaturaId } });
  if (!cand || cand.status !== 'PENDENTE') {
    return { error: 'Candidatura não encontrada ou já tratada.' };
  }

  // Não pode colidir com um usuário já existente (email é único).
  const existente = await prisma.usuario.findUnique({ where: { email: cand.email } });
  if (existente) {
    return { error: 'Já existe um usuário com este email.' };
  }

  // @username é gerado automaticamente na aprovação (o profissional troca depois nas configurações).
  const username = await gerarUsernameUnico(cand.nome);

  const admin = createAdminClient();
  const senha = randomBytes(9).toString('base64url'); // senha temporária forte

  // 1) Cria o usuário de autenticação (email já confirmado).
  const { data, error } = await admin.auth.admin.createUser({
    email: cand.email,
    password: senha,
    email_confirm: true,
    user_metadata: { nome: cand.nome },
  });
  if (error || !data.user) {
    return { error: `Não foi possível criar o login: ${error?.message ?? 'erro desconhecido'}` };
  }
  const authId = data.user.id;

  // 2) Cria Usuario + Profissional (create aninhado — sem $transaction interativo, ver pooler).
  try {
    await prisma.usuario.create({
      data: {
        authId,
        email: cand.email,
        nome: cand.nome,
        telefone: cand.telefone,
        avatarUrl: cand.avatarUrl,
        tipo: 'PROFISSIONAL',
        primeiroAcesso: true,
        profissional: {
          create: {
            titulo: cand.realizaPiercing ? 'Tatuador(a) / Body Piercer' : 'Tatuador(a)',
            username,
            cpf: cand.cpf,
            bio: cand.bio,
            portfolioUrl: cand.portfolioUrl,
            experiencia: cand.experiencia,
            oferece: cand.realizaPiercing ? ['TATUAGEM', 'PIERCING'] : ['TATUAGEM'],
          },
        },
      },
    });
  } catch {
    // Evita login órfão se a gravação no banco falhar.
    await admin.auth.admin.deleteUser(authId).catch(() => {});
    return { error: 'Falha ao criar o profissional. Tente novamente.' };
  }

  await prisma.profissionalCandidatura.update({
    where: { id: cand.id },
    data: { status: 'APROVADA' },
  });

  revalidatePath('/admin/requests');
  revalidatePath('/admin/staff');
  return { ok: true, credenciais: { email: cand.email, senha } };
}

/** Recusa a candidatura (marca REJEITADA). */
export async function recusarCandidatura(candidaturaId: string): Promise<CandidaturaState> {
  const usuario = await getCurrentUser();
  if (!usuario || usuario.tipo !== 'ADMIN') {
    return { error: 'Apenas administradores podem recusar candidaturas.' };
  }

  const cand = await prisma.profissionalCandidatura.findUnique({ where: { id: candidaturaId } });
  if (!cand || cand.status !== 'PENDENTE') {
    return { error: 'Candidatura não encontrada ou já tratada.' };
  }

  await prisma.profissionalCandidatura.update({
    where: { id: candidaturaId },
    data: { status: 'REJEITADA' },
  });

  revalidatePath('/admin/requests');
  return { ok: true };
}
