'use server';

import { randomBytes } from 'crypto';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/shared/lib/prisma';
import { getCurrentUser } from '@/features/auth/data/session';
import { createAdminClient } from '@/shared/lib/supabase/admin';
import { cpfValido } from '@/shared/lib/masks';

export type ClienteAdminState = {
  ok?: boolean;
  error?: string;
  credenciais?: { email: string; senha: string };
};

const STATUS_VALIDOS = ['PROSPECTO', 'ATIVO', 'INATIVO', 'VIP'] as const;
type StatusClienteT = (typeof STATUS_VALIDOS)[number];

async function exigirAdmin() {
  const usuario = await getCurrentUser();
  return usuario && usuario.tipo === 'ADMIN' ? usuario : null;
}

/** Cria um cliente com login (senha temporária, mostrada uma vez ao admin). */
export async function criarCliente(formData: FormData): Promise<ClienteAdminState> {
  if (!(await exigirAdmin())) return { error: 'Apenas administradores podem cadastrar clientes.' };

  const nome = String(formData.get('nome') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const telefone = String(formData.get('telefone') ?? '').trim() || null;
  const cpf = String(formData.get('cpf') ?? '').trim() || null;

  if (!nome) return { error: 'Informe o nome.' };
  if (!/\S+@\S+\.\S+/.test(email)) return { error: 'E-mail inválido.' };
  if (cpf && !cpfValido(cpf)) return { error: 'CPF inválido.' };

  const existente = await prisma.usuario.findUnique({ where: { email } });
  if (existente) return { error: 'Já existe um usuário com este email.' };

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
        tipo: 'CLIENTE',
        primeiroAcesso: true, // troca a senha temporária no 1º acesso
        cliente: { create: { cpf, status: 'ATIVO' } },
      },
    });
  } catch {
    await supa.auth.admin.deleteUser(authId).catch(() => {});
    return { error: 'Falha ao criar o cliente. Tente novamente.' };
  }

  revalidatePath('/admin/clients');
  return { ok: true, credenciais: { email, senha } };
}

/** Edita os dados de um cliente (id = Cliente.id). CPF NÃO é editável aqui (só via banco). */
export async function atualizarCliente(formData: FormData): Promise<ClienteAdminState> {
  if (!(await exigirAdmin())) return { error: 'Apenas administradores podem editar clientes.' };

  const id = String(formData.get('id') ?? '');
  const nome = String(formData.get('nome') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const telefone = String(formData.get('telefone') ?? '').trim() || null;
  const status = String(formData.get('status') ?? 'ATIVO') as StatusClienteT;
  const observacoes = String(formData.get('observacoes') ?? '').trim() || null;
  const alergias = String(formData.get('alergias') ?? '').trim() || null;
  const observacoesMedicas = String(formData.get('observacoesMedicas') ?? '').trim() || null;

  if (!nome) return { error: 'Informe o nome.' };
  if (!/\S+@\S+\.\S+/.test(email)) return { error: 'E-mail inválido.' };
  if (!STATUS_VALIDOS.includes(status)) return { error: 'Status inválido.' };

  const cliente = await prisma.cliente.findFirst({
    where: { id, usuario: { deletadoEm: null } },
    select: { id: true, usuarioId: true, usuario: { select: { authId: true, email: true } } },
  });
  if (!cliente) return { error: 'Cliente não encontrado.' };

  // E-mail editável → atualiza também no Supabase Auth (é o login).
  if (email !== cliente.usuario.email) {
    const outro = await prisma.usuario.findFirst({ where: { email, id: { not: cliente.usuarioId } }, select: { id: true } });
    if (outro) return { error: 'Já existe um usuário com este email.' };
    if (cliente.usuario.authId) {
      const supa = createAdminClient();
      const { error } = await supa.auth.admin.updateUserById(cliente.usuario.authId, { email });
      if (error) return { error: `Não foi possível atualizar o e-mail: ${error.message}` };
    }
  }

  await prisma.cliente.update({
    where: { id },
    data: {
      status,
      observacoes,
      alergias,
      observacoesMedicas,
      usuario: { update: { nome, telefone, email } },
    },
  });

  revalidatePath('/admin/clients');
  return { ok: true };
}

/** Exclui (soft-delete) o cliente: marca Usuario.deletadoEm. Mantém histórico; bloqueia o login. */
export async function excluirCliente(id: string): Promise<ClienteAdminState> {
  if (!(await exigirAdmin())) return { error: 'Apenas administradores podem excluir clientes.' };

  const cliente = await prisma.cliente.findFirst({
    where: { id, usuario: { deletadoEm: null } },
    select: { usuarioId: true },
  });
  if (!cliente) return { error: 'Cliente não encontrado.' };

  await prisma.usuario.update({
    where: { id: cliente.usuarioId },
    data: { deletadoEm: new Date() },
  });

  revalidatePath('/admin/clients');
  return { ok: true };
}
