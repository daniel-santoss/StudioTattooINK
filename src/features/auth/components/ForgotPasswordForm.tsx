'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const ForgotPasswordForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-background-dark p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
      </div>

      <div className="w-full max-w-md bg-surface-dark border border-border-dark rounded-2xl p-8 shadow-2xl relative z-10">
        {submitted ? (
          <div className="text-center py-8">
            <div className="size-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20">
              <span className="material-symbols-outlined text-emerald-500 text-4xl">mark_email_read</span>
            </div>
            <h1 className="font-tattoo text-3xl text-white mb-3">E-mail Enviado</h1>
            <p className="text-text-muted text-sm mb-8">Se o endereço <span className="text-white font-bold">{email}</span> estiver cadastrado, você receberá um link para redefinir sua senha.</p>
            <Link href="/login" className="inline-block bg-primary hover:bg-primary-hover text-white font-bold py-3 px-8 rounded-lg uppercase tracking-wider text-sm transition-all">
              Voltar ao Login
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
                <span className="material-symbols-outlined text-primary text-3xl">lock_reset</span>
              </div>
              <h1 className="font-tattoo text-4xl text-white mb-2">Recuperar Senha</h1>
              <p className="text-text-muted text-sm font-display">Informe seu e-mail para receber o link de redefinição.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest">E-mail</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-text-muted group-focus-within:text-white transition-colors">mail</span>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-background-dark border border-border-dark rounded-lg py-2.5 pl-10 text-white placeholder-zinc-700 focus:border-primary transition-all" placeholder="seu@email.com" />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-lg shadow-[0_0_20px_rgba(212,17,50,0.3)] transition-all flex items-center justify-center gap-2 uppercase tracking-wider text-sm disabled:opacity-50">
                {loading ? 'Enviando...' : 'Enviar Link'}
                {!loading && <span className="material-symbols-outlined text-lg">send</span>}
              </button>
            </form>

            <div className="mt-8 text-center border-t border-border-dark pt-6">
              <p className="text-xs text-text-muted">
                Lembrou a senha? <Link href="/login" className="text-white hover:text-primary transition-colors font-bold ml-1 underline">Voltar ao Login</Link>
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
