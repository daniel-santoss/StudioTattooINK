'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signup, criarCandidatura } from '@/features/auth/actions/auth';
import { maskCPF, maskTelefone, cpfValido, telefoneValido } from '@/shared/lib/masks';
import { REGRAS_SENHA, senhaForte } from '@/features/auth/lib/senha';

const Req = () => <span className="text-primary">*</span>;

const SignupForm: React.FC = () => {
  const searchParams = useSearchParams();
  const signupType = searchParams?.get('type') || 'client';

  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<'client' | 'artist'>(signupType === 'artist' ? 'artist' : 'client');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', cpf: '', password: '', confirmPassword: '',
    styles: [] as string[], instagram: '', experience: '', bio: '',
    realizaPiercing: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleStyleToggle = (style: string) => {
    setFormData(prev => ({
      ...prev,
      styles: prev.styles.includes(style) ? prev.styles.filter(s => s !== style) : [...prev.styles, style],
    }));
  };

  const emailOk = /\S+@\S+\.\S+/.test(formData.email);
  const step1Ok =
    !!formData.name.trim() && emailOk && telefoneValido(formData.phone) && cpfValido(formData.cpf) &&
    (userType === 'artist' || (senhaForte(formData.password) === null && formData.password === formData.confirmPassword));
  const step2Ok = formData.styles.length > 0 && !!formData.experience;
  const step3Ok = !!formData.bio.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const fd = new FormData();
    fd.set('name', formData.name);
    fd.set('email', formData.email);
    fd.set('phone', formData.phone);
    fd.set('cpf', formData.cpf);
    fd.set('password', formData.password);
    fd.set('confirmPassword', formData.confirmPassword);
    fd.set('instagram', formData.instagram);
    fd.set('experience', formData.experience);
    fd.set('bio', formData.bio);
    fd.set('styles', formData.styles.join(','));
    fd.set('realizaPiercing', formData.realizaPiercing ? 'on' : 'off');

    const res = userType === 'artist' ? await criarCandidatura(fd) : await signup(null, fd);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    }
  };

  const allStyles = ['Realismo', 'Fine Line', 'Oriental', 'Old School', 'Neo Tradicional', 'Blackwork', 'Aquarela', 'Lettering', 'Geométrico', 'Pontilhismo', 'Minimalismo', 'Colorido'];

  const inputCls = 'w-full bg-background-dark border border-border-dark rounded-lg py-2.5 px-4 text-white focus:border-primary outline-none transition-colors';
  const labelCls = 'text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-1';

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-background-dark p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
      </div>

      <div className="w-full max-w-lg bg-surface-dark border border-border-dark rounded-2xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
            <span className="material-symbols-outlined text-primary text-3xl">person_add</span>
          </div>
          <h1 className="font-tattoo text-4xl text-white mb-2">Criar Conta</h1>
          <p className="text-text-muted text-sm font-display">
            {userType === 'artist' ? 'Cadastre-se como artista parceiro.' : 'Registre-se para agendar sua sessão.'}
          </p>
        </div>

        {/* Type Switcher */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-background-dark rounded-lg border border-border-dark mb-8">
          <button type="button" onClick={() => { setUserType('client'); setStep(1); }} className={`py-2.5 rounded font-bold text-xs uppercase tracking-wide transition-all ${userType === 'client' ? 'bg-surface-light text-white shadow' : 'text-text-muted hover:text-white'}`}>
            <span className="material-symbols-outlined text-sm mr-1 align-middle">person</span> Cliente
          </button>
          <button type="button" onClick={() => { setUserType('artist'); setStep(1); }} className={`py-2.5 rounded font-bold text-xs uppercase tracking-wide transition-all ${userType === 'artist' ? 'bg-surface-light text-white shadow' : 'text-text-muted hover:text-white'}`}>
            <span className="material-symbols-outlined text-sm mr-1 align-middle">brush</span> Artista
          </button>
        </div>

        {/* Steps indicator */}
        {userType === 'artist' && (
          <div className="flex items-center gap-2 mb-8">
            {[1, 2, 3].map(s => (
              <div key={s} className={`flex-1 h-1 rounded-full transition-all ${step >= s ? 'bg-primary' : 'bg-border-dark'}`} />
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Step 1: Basic Info (cliente e artista) */}
          {step === 1 && (
            <>
              <div className="space-y-2">
                <label className={labelCls}>Nome completo <Req /></label>
                <input name="name" value={formData.name} onChange={handleInputChange} required className={inputCls} placeholder="Seu nome" />
              </div>
              <div className="space-y-2">
                <label className={labelCls}>E-mail <Req /></label>
                <input name="email" type="email" value={formData.email} onChange={handleInputChange} required className={inputCls} placeholder="seu@email.com" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className={labelCls}>Telefone <Req /></label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(p => ({ ...p, phone: maskTelefone(e.target.value) }))}
                    maxLength={15}
                    inputMode="numeric"
                    required
                    className={inputCls}
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div className="space-y-2">
                  <label className={labelCls}>CPF <Req /></label>
                  <input
                    name="cpf"
                    value={formData.cpf}
                    onChange={(e) => setFormData(p => ({ ...p, cpf: maskCPF(e.target.value) }))}
                    maxLength={14}
                    inputMode="numeric"
                    required
                    className={inputCls}
                    placeholder="000.000.000-00"
                  />
                </div>
              </div>
              {userType === 'client' && (
                <>
                  <div className="space-y-2">
                    <label className={labelCls}>Senha <Req /></label>
                    <input name="password" type="password" value={formData.password} onChange={handleInputChange} required className={inputCls} placeholder="Crie uma senha segura" />
                  </div>

                  {/* Checklist de senha forte (mesma UX do primeiro acesso) */}
                  {formData.password && (
                    <div className="bg-background-dark border border-border-dark rounded-xl p-4 space-y-2.5">
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">Requisitos da senha</p>
                      {REGRAS_SENHA.map((r) => {
                        const ok = r.test(formData.password);
                        return (
                          <div key={r.id} className={`flex items-center gap-2.5 text-xs transition-colors ${ok ? 'text-emerald-400' : 'text-text-muted'}`}>
                            <span className="material-symbols-outlined text-base flex-shrink-0" style={{ fontVariationSettings: ok ? "'FILL' 1" : "'FILL' 0" }}>
                              {ok ? 'check_circle' : 'radio_button_unchecked'}
                            </span>
                            <span>{r.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className={labelCls}>Confirmar senha <Req /></label>
                    <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} required className={inputCls} placeholder="••••••••" />
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="text-red-400 text-xs">As senhas não conferem.</p>
                    )}
                  </div>
                </>
              )}
            </>
          )}

          {/* Step 2: Artist Professional Info */}
          {step === 2 && userType === 'artist' && (
            <>
              <div className="space-y-2">
                <label className={labelCls}>
                  Instagram / Portfólio
                  <span className="relative group inline-flex">
                    <span className="material-symbols-outlined text-sm text-text-muted cursor-help">info</span>
                    <span className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 bg-black text-white text-[11px] leading-snug normal-case font-normal tracking-normal rounded-lg p-2.5 opacity-0 group-hover:opacity-100 transition-opacity z-20 border border-border-dark shadow-xl">
                      Embora não seja obrigatório, recomendamos informar um Instagram ou portfólio para aumentar suas chances de aprovação na plataforma.
                    </span>
                  </span>
                  <span className="ml-auto text-[10px] text-text-muted normal-case tracking-normal">opcional</span>
                </label>
                <input name="instagram" value={formData.instagram} onChange={handleInputChange} className={inputCls} placeholder="@seu_perfil ou link do portfólio" />
              </div>

              <div>
                <label className="flex items-center gap-3 cursor-pointer group select-none">
                  <div className="relative flex-shrink-0">
                    <input
                      type="checkbox"
                      id="realizaPiercing"
                      name="realizaPiercing"
                      checked={formData.realizaPiercing}
                      onChange={(e) => setFormData(p => ({ ...p, realizaPiercing: e.target.checked }))}
                      className="sr-only"
                    />
                    <div className={`size-5 rounded border-2 flex items-center justify-center transition-all ${
                      formData.realizaPiercing
                        ? 'bg-primary border-primary'
                        : 'border-border-dark bg-background-dark group-hover:border-white/40'
                    }`}>
                      {formData.realizaPiercing && (
                        <span className="material-symbols-outlined text-white text-[14px] leading-none" style={{ fontVariationSettings: "'FILL' 1, 'wght' 700" }}>check</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-white">Realiza Body Piercing?</span>
                    <p className="text-xs text-text-muted mt-0.5">Marque se você também oferece serviços de body piercing.</p>
                  </div>
                </label>
              </div>

              <div className="space-y-2">
                <label className={labelCls}>Estilos <Req /></label>
                <div className="grid grid-cols-3 gap-2">
                  {allStyles.map(style => (
                    <button key={style} type="button" onClick={() => handleStyleToggle(style)} className={`py-2 rounded text-xs font-bold uppercase transition-all border ${formData.styles.includes(style) ? 'bg-primary/20 border-primary text-primary' : 'border-border-dark text-text-muted hover:border-white/30'}`}>
                      {style}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className={labelCls}>Experiência <Req /></label>
                <select name="experience" value={formData.experience} onChange={handleInputChange} required className={inputCls}>
                  <option value="">Selecione</option>
                  <option value="1-2">1-2 anos</option>
                  <option value="3-5">3-5 anos</option>
                  <option value="5+">5+ anos</option>
                </select>
              </div>
            </>
          )}

          {/* Step 3: Artist Bio */}
          {step === 3 && userType === 'artist' && (
            <div className="space-y-2">
              <label className={labelCls}>Bio / Sobre você <Req /></label>
              <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows={6} required className={`${inputCls} resize-none`} placeholder="Conte um pouco sobre sua trajetória..." />
            </div>
          )}

          {error && (
            <p className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/30 rounded-lg py-2">{error}</p>
          )}

          {/* Navigation */}
          <div className="flex gap-3">
            {step > 1 && (
              <button type="button" onClick={() => setStep(s => s - 1)} className="flex-1 py-3 border border-border-dark rounded-lg text-text-muted hover:text-white font-bold text-sm uppercase tracking-wider transition-all">
                Voltar
              </button>
            )}
            {userType === 'artist' && step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(s => s + 1)}
                disabled={(step === 1 && !step1Ok) || (step === 2 && !step2Ok)}
                className="flex-1 bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-lg transition-all uppercase tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Próximo
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading || (userType === 'client' ? !step1Ok : !step3Ok)}
                className="flex-1 bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-lg shadow-[0_0_20px_rgba(212,17,50,0.3)] transition-all uppercase tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? 'Criando conta...' : (userType === 'artist' ? 'Enviar Candidatura' : 'Criar Conta')}
              </button>
            )}
          </div>
        </form>

        <div className="mt-8 text-center border-t border-border-dark pt-6">
          <p className="text-xs text-text-muted">
            Já tem uma conta? <Link href="/login" className="text-white hover:text-primary transition-colors font-bold ml-1 underline">Entrar</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
