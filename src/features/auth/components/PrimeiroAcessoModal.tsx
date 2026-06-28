'use client';

import React, { useState, useActionState } from 'react';
import { definirNovaSenha } from '@/features/auth/actions/primeiroAcesso';
import { REGRAS_SENHA } from '@/features/auth/lib/senha';

interface PrimeiroAcessoModalProps {
  nomeUsuario: string;
}

export default function PrimeiroAcessoModal({ nomeUsuario }: PrimeiroAcessoModalProps) {
  const [senha, setSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);

  const [state, action, isPending] = useActionState(definirNovaSenha, null);

  const regrasOk = REGRAS_SENHA.map((r) => ({ ...r, ok: r.test(senha) }));
  const todasOk = regrasOk.every((r) => r.ok);
  const confirmacaoOk = senha !== '' && senha === confirmar;
  const podeSubmit = todasOk && confirmacaoOk && !isPending;

  const inputCls =
    'w-full bg-background-dark border border-border-dark rounded-xl py-3 px-4 pr-12 text-white focus:border-primary outline-none transition-colors font-mono tracking-wider placeholder:font-sans placeholder:tracking-normal';

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="bg-surface-dark border border-border-dark rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="relative bg-gradient-to-br from-primary/20 via-surface-dark to-surface-dark p-8 text-center border-b border-border-dark">
          <div className="size-16 bg-primary/10 border border-primary/30 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/10">
            <span
              className="material-symbols-outlined text-primary text-3xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              lock_reset
            </span>
          </div>
          <h2 className="font-tattoo text-3xl text-white mb-1">Bem-vindo(a)!</h2>
          <p className="text-text-muted text-sm">
            Olá, <strong className="text-white">{nomeUsuario}</strong>. Para continuar, defina uma senha pessoal segura.
          </p>
        </div>

        {/* Form */}
        <form action={action} className="p-6 space-y-5">

          {/* Nova senha */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Nova senha</label>
            <div className="relative">
              <input
                name="senha"
                type={mostrarSenha ? 'text' : 'password'}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                autoComplete="new-password"
                className={inputCls}
                placeholder="Digite sua nova senha"
              />
              <button
                type="button"
                onClick={() => setMostrarSenha((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                tabIndex={-1}
                aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
              >
                <span className="material-symbols-outlined text-xl">
                  {mostrarSenha ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Checklist de segurança */}
          <div className="bg-background-dark border border-border-dark rounded-xl p-4 space-y-2.5">
            <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-3">
              Requisitos da senha
            </p>
            {regrasOk.map((r) => (
              <div
                key={r.id}
                className={`flex items-center gap-2.5 text-xs transition-colors duration-200 ${
                  r.ok ? 'text-emerald-400' : 'text-text-muted'
                }`}
              >
                <span
                  className="material-symbols-outlined text-base flex-shrink-0 transition-all duration-200"
                  style={{ fontVariationSettings: r.ok ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {r.ok ? 'check_circle' : 'radio_button_unchecked'}
                </span>
                <span>{r.label}</span>
              </div>
            ))}
          </div>

          {/* Confirmar senha */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest">
              Confirmar nova senha
            </label>
            <div className="relative">
              <input
                name="confirmar"
                type={mostrarConfirmar ? 'text' : 'password'}
                value={confirmar}
                onChange={(e) => setConfirmar(e.target.value)}
                required
                autoComplete="new-password"
                className={`${inputCls} transition-colors ${
                  confirmar && !confirmacaoOk
                    ? 'border-red-500/60'
                    : confirmar && confirmacaoOk
                    ? 'border-emerald-500/60'
                    : ''
                }`}
                placeholder="Repita a nova senha"
              />
              <button
                type="button"
                onClick={() => setMostrarConfirmar((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                tabIndex={-1}
                aria-label={mostrarConfirmar ? 'Ocultar confirmação' : 'Mostrar confirmação'}
              >
                <span className="material-symbols-outlined text-xl">
                  {mostrarConfirmar ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
            {confirmar && !confirmacaoOk && (
              <p className="text-red-400 text-xs flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">error</span>
                As senhas não conferem.
              </p>
            )}
            {confirmar && confirmacaoOk && (
              <p className="text-emerald-400 text-xs flex items-center gap-1">
                <span
                  className="material-symbols-outlined text-sm"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
                Senhas conferem.
              </p>
            )}
          </div>

          {/* Erro da action */}
          {state?.error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg flex-shrink-0">error</span>
              {state.error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={!podeSubmit}
            className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3.5 rounded-xl transition-all uppercase tracking-wider text-sm disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(212,17,50,0.2)] hover:shadow-[0_0_30px_rgba(212,17,50,0.35)]"
          >
            {isPending ? (
              <>
                <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Salvando...
              </>
            ) : (
              <>
                <span
                  className="material-symbols-outlined text-lg"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  lock
                </span>
                Salvar nova senha
              </>
            )}
          </button>

          <p className="text-center text-[11px] text-text-muted">
            Você será redirecionado(a) ao login após salvar.
          </p>
        </form>
      </div>
    </div>
  );
}
