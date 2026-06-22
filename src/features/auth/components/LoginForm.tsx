'use client';

import React, { useActionState, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { login, type AuthState } from '@/features/auth/actions/auth';
import type { UserRole } from '@/shared/types';

const LoginForm: React.FC = () => {
  const searchParams = useSearchParams();
  const redirectPath = searchParams?.get('redirect') || '/';

  const [role, setRole] = useState<UserRole>('client');
  const [state, formAction, pending] = useActionState<AuthState, FormData>(login, null);

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-background-dark p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
        <div className="absolute inset-0 bg-[url('/images/tattooPiercing/tattooRealista1.jpg')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
      </div>

      <div className="w-full max-w-md bg-surface-dark border border-border-dark rounded-2xl p-8 shadow-2xl relative z-10 backdrop-blur-sm">
        <div className="text-center mb-8">
          <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
            <span className="material-symbols-outlined text-primary text-3xl">ink_pen</span>
          </div>
          <h1 className="font-tattoo text-4xl text-white mb-2">Bem-vindo</h1>
          <p className="text-text-muted text-sm font-display tracking-wide">Acesse sua conta para continuar.</p>
        </div>

        {/* Role Switcher */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-background-dark rounded-lg border border-border-dark mb-8">
          <button type="button" onClick={() => setRole('client')} className={`py-2 rounded font-bold text-xs uppercase tracking-wide transition-all ${role === 'client' ? 'bg-surface-light text-white shadow' : 'text-text-muted hover:text-white'}`}>
            Cliente
          </button>
          <button type="button" onClick={() => setRole('artist')} className={`py-2 rounded font-bold text-xs uppercase tracking-wide transition-all ${role === 'artist' ? 'bg-surface-light text-white shadow' : 'text-text-muted hover:text-white'}`}>
            Tatuador
          </button>
          <button type="button" onClick={() => setRole('admin')} className={`py-2 rounded font-bold text-xs uppercase tracking-wide transition-all ${role === 'admin' ? 'bg-surface-light text-white shadow' : 'text-text-muted hover:text-white'}`}>
            Gerente
          </button>
        </div>

        <form action={formAction} className="space-y-6">
          <input type="hidden" name="redirect" value={redirectPath} />
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest">E-mail</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-text-muted group-focus-within:text-white transition-colors">mail</span>
              <input key={role} name="email" type="email" required defaultValue={role === 'client' ? 'cliente@email.com' : (role === 'artist' ? 'artista@inkstudio.com' : 'admin@inkstudio.com')} className="w-full bg-background-dark border border-border-dark rounded-lg py-2.5 pl-10 text-white placeholder-zinc-700 focus:border-primary transition-all" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Senha</label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-text-muted group-focus-within:text-white transition-colors">lock</span>
              <input name="password" type="password" required placeholder="••••••••" className="w-full bg-background-dark border border-border-dark rounded-lg py-2.5 pl-10 text-white placeholder-zinc-700 focus:border-primary transition-all" />
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded border-border-dark bg-background-dark text-primary" />
              <span className="text-text-muted">Lembrar-me</span>
            </label>
            <Link href="/forgot-password" className="text-primary hover:text-white transition-colors font-medium">Esqueceu a senha?</Link>
          </div>

          {state?.error && (
            <p className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/30 rounded-lg py-2">{state.error}</p>
          )}

          <button type="submit" disabled={pending} className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-lg shadow-[0_0_20px_rgba(212,17,50,0.3)] hover:shadow-[0_0_25px_rgba(212,17,50,0.5)] transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed">
            {pending ? 'Autenticando...' : (role === 'client' ? 'Entrar como Cliente' : 'Acessar Painel')}
            {!pending && <span className="material-symbols-outlined text-lg">arrow_forward</span>}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-border-dark pt-6">
          {role === 'admin' ? (
            <p className="text-xs text-text-muted">Acesso restrito a funcionários autorizados.</p>
          ) : (
            <p className="text-xs text-text-muted">
              Não tem uma conta? <Link href="/signup" className="text-white hover:text-primary transition-colors font-bold ml-1 underline">Cadastre-se</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
