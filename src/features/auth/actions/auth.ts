'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/shared/lib/supabase/server';
import { prisma } from '@/shared/lib/prisma';
import { cpfValido, telefoneValido } from '@/shared/lib/masks';
import { senhaForte } from '@/features/auth/lib/senha';
import { normalizeUsername, usernameValido } from '@/features/auth/lib/username';
import { usernameDisponivel } from '@/features/auth/data/username';

export type AuthState = { error?: string } | null;

/** Checagem de disponibilidade do @username em tempo real (chamada do formulário). */
export type UsernameCheck = { valido: boolean; disponivel: boolean; erro?: string };
export async function checarUsername(raw: string): Promise<UsernameCheck> {
  const u = normalizeUsername(raw);
  if (!usernameValido(u)) {
    return { valido: false, disponivel: false, erro: 'Use 3–30 caracteres: letras, números, "_" e ".".' };
  }
  const disponivel = await usernameDisponivel(u);
  return { valido: true, disponivel, erro: disponivel ? undefined : 'Esse nome de usuário já está em uso.' };
}

/** Login por email/senha. Redireciona conforme o papel do usuário. */
export async function login(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const redirectTo = String(formData.get('redirect') ?? '');

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: 'Email ou senha inválidos.' };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const usuario = user
    ? await prisma.usuario.findUnique({ where: { authId: user.id } })
    : null;

  let dest = redirectTo && redirectTo !== '/' ? redirectTo : '';
  if (!dest) dest = usuario?.tipo === 'CLIENTE' ? '/my-appointments' : '/admin/dashboard';

  revalidatePath('/', 'layout');
  redirect(dest);
}

/** Cadastro público → sempre CLIENTE (profissionais entram via candidatura). */
export async function signup(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const nome = String(formData.get('nome') ?? formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const telefone = String(formData.get('phone') ?? '').trim();
  const cpf = String(formData.get('cpf') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const confirmPassword = String(formData.get('confirmPassword') ?? '');

  if (!nome) return { error: 'Informe seu nome.' };
  if (!telefoneValido(telefone)) return { error: 'Telefone inválido.' };
  if (!cpfValido(cpf)) return { error: 'CPF inválido.' };
  const erroForca = senhaForte(password);
  if (erroForca) return { error: erroForca };
  if (confirmPassword && password !== confirmPassword) return { error: 'As senhas não conferem.' };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { nome } },
  });
  if (error) return { error: error.message };

  if (data.user) {
    // Cria o perfil no banco (idempotente — futuramente pode vir de trigger).
    await prisma.usuario.upsert({
      where: { authId: data.user.id },
      update: {},
      create: {
        authId: data.user.id,
        email,
        nome,
        telefone,
        tipo: 'CLIENTE',
        cliente: { create: { cpf } },
      },
    });
  }

  // Se a confirmação de email estiver ativa, ainda não há sessão.
  if (!data.session) redirect('/login?check=1');

  revalidatePath('/', 'layout');
  redirect('/my-appointments');
}

const EXP_MAP: Record<string, 'DE_1_A_3' | 'DE_3_A_5' | 'MAIS_DE_5'> = {
  '1-2': 'DE_1_A_3',
  '3-5': 'DE_3_A_5',
  '5+': 'MAIS_DE_5',
};

/** Cadastro de artista = candidatura (admin aprova depois). Não cria login. */
export async function criarCandidatura(formData: FormData): Promise<AuthState> {
  const nome = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const telefone = String(formData.get('phone') ?? '').trim();
  const cpf = String(formData.get('cpf') ?? '').trim();
  const bio = String(formData.get('bio') ?? '').trim();
  const instagram = String(formData.get('instagram') ?? '').trim(); // opcional
  const exp = String(formData.get('experience') ?? '');
  const estilos = String(formData.get('styles') ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  const realizaPiercing = formData.get('realizaPiercing') === 'on';

  // Validação no servidor (front é só UX) — todos obrigatórios exceto Instagram/Portfólio.
  if (!nome) return { error: 'Informe seu nome.' };
  if (!email) return { error: 'Informe seu email.' };
  if (!telefoneValido(telefone)) return { error: 'Telefone inválido.' };
  if (!cpfValido(cpf)) return { error: 'CPF inválido.' };
  if (!exp) return { error: 'Selecione sua experiência.' };
  if (estilos.length === 0) return { error: 'Selecione ao menos um estilo.' };
  if (!bio) return { error: 'Conte um pouco sobre você (bio).' };

  // @username NÃO é coletado aqui — só faz sentido após a aprovação (gerado em aprovarCandidatura).

  await prisma.profissionalCandidatura.create({
    data: {
      nome,
      email,
      telefone,
      cpf,
      bio,
      portfolioUrl: instagram || 'não informado',
      experiencia: EXP_MAP[exp] ?? null,
      estilos,
      realizaPiercing,
      status: 'PENDENTE',
    },
  });

  redirect('/login?candidatura=1');
}

export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}
