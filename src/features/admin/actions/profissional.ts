'use server';

import { randomBytes } from 'crypto';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/shared/lib/prisma';
import { getCurrentUser } from '@/features/auth/data/session';
import { createAdminClient } from '@/shared/lib/supabase/admin';
import { gerarUsernameUnico } from '@/features/auth/data/username';
import { cpfValido } from '@/shared/lib/masks';

export type ProfissionalAdminState = {
  ok?: boolean;
  error?: string;
  credenciais?: { email: string; senha: string };
};

async function exigirAdmin() {
  const usuario = await getCurrentUser();
  return usuario && usuario.tipo === 'ADMIN' ? usuario : null;
}

/** Cadastra um tatuador direto (sem candidatura): cria login + Usuario(PROFISSIONAL) + Profissional. */
export async function criarProfissional(formData: FormData): Promise<ProfissionalAdminState> {
  if (!(await exigirAdmin())) return { error: 'Apenas administradores podem cadastrar tatuadores.' };

  const nome = String(formData.get('nome') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const telefone = String(formData.get('telefone') ?? '').trim() || null;
  const cpf = String(formData.get('cpf') ?? '').trim() || null;
  const realizaPiercing = formData.get('realizaPiercing') === 'on' || formData.get('realizaPiercing') === 'true';

  if (!nome) return { error: 'Informe o nome.' };
  if (!/\S+@\S+\.\S+/.test(email)) return { error: 'E-mail inválido.' };
  if (cpf && !cpfValido(cpf)) return { error: 'CPF inválido.' };

  const existente = await prisma.usuario.findUnique({ where: { email } });
  if (existente) return { error: 'Já existe um usuário com este email.' };

  const username = await gerarUsernameUnico(nome);
  const supa = createAdminClient();
  const senha = randomBytes(9).toString('base64url');

  const { data, error } = await supa.auth.admin.createUser({
    email,
    password: senha,
    email_confirm: true,
    user_metadata: { nome },
  });
  if (error || !data.user) {
    return { error: `Não foi possível criar o login: ${error?.message ?? 'erro desconhecido'}` };
  }
  const authId = data.user.id;

  try {
    await prisma.usuario.create({
      data: {
        authId,
        email,
        nome,
        telefone,
        tipo: 'PROFISSIONAL',
        primeiroAcesso: true,
        profissional: {
          create: {
            titulo: realizaPiercing ? 'Tatuador(a) / Body Piercer' : 'Tatuador(a)',
            username,
            cpf,
            oferece: realizaPiercing ? ['TATUAGEM', 'PIERCING'] : ['TATUAGEM'],
          },
        },
      },
    });
  } catch {
    await supa.auth.admin.deleteUser(authId).catch(() => {});
    return { error: 'Falha ao criar o tatuador. Tente novamente.' };
  }

  revalidatePath('/admin/staff');
  return { ok: true, credenciais: { email, senha } };
}

/** Edita um tatuador (id = Profissional.id). CPF e @username NÃO são editados aqui (só via banco). */
export async function atualizarProfissional(formData: FormData): Promise<ProfissionalAdminState> {
  if (!(await exigirAdmin())) return { error: 'Apenas administradores podem editar tatuadores.' };

  const id = String(formData.get('id') ?? '');
  const nome = String(formData.get('nome') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const telefone = String(formData.get('telefone') ?? '').trim() || null;
  const bio = String(formData.get('bio') ?? '').trim() || null;
  const realizaPiercing = formData.get('realizaPiercing') === 'on' || formData.get('realizaPiercing') === 'true';

  if (!nome) return { error: 'Informe o nome.' };
  if (!/\S+@\S+\.\S+/.test(email)) return { error: 'E-mail inválido.' };

  const prof = await prisma.profissional.findFirst({
    where: { id, usuario: { deletadoEm: null } },
    select: { id: true, usuarioId: true, usuario: { select: { authId: true, email: true } } },
  });
  if (!prof) return { error: 'Tatuador não encontrado.' };

  // E-mail editável → atualiza também no Supabase Auth (é o login).
  if (email !== prof.usuario.email) {
    const outro = await prisma.usuario.findFirst({ where: { email, id: { not: prof.usuarioId } }, select: { id: true } });
    if (outro) return { error: 'Já existe um usuário com este email.' };
    if (prof.usuario.authId) {
      const supa = createAdminClient();
      const { error } = await supa.auth.admin.updateUserById(prof.usuario.authId, { email });
      if (error) return { error: `Não foi possível atualizar o e-mail: ${error.message}` };
    }
  }

  await prisma.profissional.update({
    where: { id },
    data: {
      // título derivado do serviço (não é mais campo editável)
      titulo: realizaPiercing ? 'Tatuador(a) / Body Piercer' : 'Tatuador(a)',
      bio,
      oferece: realizaPiercing ? ['TATUAGEM', 'PIERCING'] : ['TATUAGEM'],
      usuario: { update: { nome, telefone, email } },
    },
  });

  revalidatePath('/admin/staff');
  return { ok: true };
}

/** Exclui (soft-delete) o tatuador: marca Usuario.deletadoEm. Mantém histórico; bloqueia o login. */
export async function excluirProfissional(id: string): Promise<ProfissionalAdminState> {
  if (!(await exigirAdmin())) return { error: 'Apenas administradores podem excluir tatuadores.' };

  const prof = await prisma.profissional.findFirst({
    where: { id, usuario: { deletadoEm: null } },
    select: { usuarioId: true },
  });
  if (!prof) return { error: 'Tatuador não encontrado.' };

  await prisma.usuario.update({
    where: { id: prof.usuarioId },
    data: { deletadoEm: new Date() },
  });

  revalidatePath('/admin/staff');
  return { ok: true };
}

/** Reativa um tatuador desativado (limpa Usuario.deletadoEm). */
export async function reativarProfissional(id: string): Promise<ProfissionalAdminState> {
  if (!(await exigirAdmin())) return { error: 'Apenas administradores podem reativar tatuadores.' };

  const prof = await prisma.profissional.findUnique({ where: { id }, select: { usuarioId: true } });
  if (!prof) return { error: 'Tatuador não encontrado.' };

  await prisma.usuario.update({
    where: { id: prof.usuarioId },
    data: { deletadoEm: null },
  });

  revalidatePath('/admin/staff');
  return { ok: true };
}
