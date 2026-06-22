'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/shared/lib/supabase/server';
import { prisma } from '@/shared/lib/prisma';

export type AuthState = { error?: string } | null;

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
  const password = String(formData.get('password') ?? '');
  const confirmPassword = String(formData.get('confirmPassword') ?? '');

  if (password.length < 8) return { error: 'A senha deve ter ao menos 8 caracteres.' };
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
        tipo: 'CLIENTE',
        cliente: { create: {} },
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
  if (!nome || !email) return { error: 'Preencha ao menos nome e email.' };

  const telefone = String(formData.get('phone') ?? '').trim() || null;
  const instagram = String(formData.get('instagram') ?? '').trim();
  const exp = String(formData.get('experience') ?? '');
  const estilos = String(formData.get('styles') ?? '').split(',').map((s) => s.trim()).filter(Boolean);

  await prisma.profissionalCandidatura.create({
    data: {
      nome,
      email,
      telefone,
      portfolioUrl: instagram || 'não informado',
      experiencia: EXP_MAP[exp] ?? null,
      estilos,
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
