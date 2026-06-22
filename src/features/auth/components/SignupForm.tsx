'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signup, criarCandidatura } from '@/features/auth/actions/auth';

const SignupForm: React.FC = () => {
  const searchParams = useSearchParams();
  const signupType = searchParams?.get('type') || 'client';

  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<'client' | 'artist'>(signupType === 'artist' ? 'artist' : 'client');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
    styles: [] as string[], instagram: '', experience: '', bio: '',
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const fd = new FormData();
    fd.set('name', formData.name);
    fd.set('email', formData.email);
    fd.set('phone', formData.phone);
    fd.set('password', formData.password);
    fd.set('confirmPassword', formData.confirmPassword);
    fd.set('instagram', formData.instagram);
    fd.set('experience', formData.experience);
    fd.set('bio', formData.bio);
    fd.set('styles', formData.styles.join(','));

    const res = userType === 'artist' ? await criarCandidatura(fd) : await signup(null, fd);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    }
  };

  const allStyles = ['Realismo', 'Fine Line', 'Oriental', 'Old School', 'Neo Tradicional', 'Blackwork', 'Aquarela', 'Lettering', 'Geométrico', 'Pontilhismo', 'Minimalismo', 'Colorido'];

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
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Nome completo</label>
                <input name="name" value={formData.name} onChange={handleInputChange} required className="w-full bg-background-dark border border-border-dark rounded-lg py-2.5 px-4 text-white" placeholder="Seu nome" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest">E-mail</label>
                <input name="email" type="email" value={formData.email} onChange={handleInputChange} required className="w-full bg-background-dark border border-border-dark rounded-lg py-2.5 px-4 text-white" placeholder="seu@email.com" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Telefone</label>
                <input name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-background-dark border border-border-dark rounded-lg py-2.5 px-4 text-white" placeholder="(00) 00000-0000" />
              </div>
              {userType === 'client' && (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Senha</label>
                    <input name="password" type="password" value={formData.password} onChange={handleInputChange} required className="w-full bg-background-dark border border-border-dark rounded-lg py-2.5 px-4 text-white" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Confirmar senha</label>
                    <input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} required className="w-full bg-background-dark border border-border-dark rounded-lg py-2.5 px-4 text-white" placeholder="••••••••" />
                  </div>
                </>
              )}
            </>
          )}

          {/* Step 2: Artist Professional Info */}
          {step === 2 && userType === 'artist' && (
            <>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Instagram</label>
                <input name="instagram" value={formData.instagram} onChange={handleInputChange} className="w-full bg-background-dark border border-border-dark rounded-lg py-2.5 px-4 text-white" placeholder="@seu_perfil" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Estilos</label>
                <div className="grid grid-cols-3 gap-2">
                  {allStyles.map(style => (
                    <button key={style} type="button" onClick={() => handleStyleToggle(style)} className={`py-2 rounded text-xs font-bold uppercase transition-all border ${formData.styles.includes(style) ? 'bg-primary/20 border-primary text-primary' : 'border-border-dark text-text-muted hover:border-white/30'}`}>
                      {style}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Experiência</label>
                <select name="experience" value={formData.experience} onChange={handleInputChange} className="w-full bg-background-dark border border-border-dark rounded-lg py-2.5 px-4 text-white">
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
              <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Bio / Sobre você</label>
              <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows={6} className="w-full bg-background-dark border border-border-dark rounded-lg py-2.5 px-4 text-white resize-none" placeholder="Conte um pouco sobre sua trajetória..." />
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
              <button type="button" onClick={() => setStep(s => s + 1)} className="flex-1 bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-lg transition-all uppercase tracking-wider text-sm">
                Próximo
              </button>
            ) : (
              <button type="submit" disabled={loading} className="flex-1 bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-lg shadow-[0_0_20px_rgba(212,17,50,0.3)] transition-all uppercase tracking-wider text-sm disabled:opacity-50 flex items-center justify-center gap-2">
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
