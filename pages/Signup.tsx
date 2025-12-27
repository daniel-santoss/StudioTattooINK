
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState<'client' | 'artist'>('client');
  const [step, setStep] = useState(1); // Controla a etapa do formulário
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Address (New)
    cep: '',
    street: '',
    number: '',
    complement: '',
    city: '',
    state: '',
    // Artist specific
    artistRole: 'Tatuador', 
    portfolio: '',
    experience: '',
    styles: [] as string[],
    customStyle: '',
    // Client specific
    allergies: '',
    medicalNotes: ''
  });

  useEffect(() => {
    if (searchParams.get('type') === 'artist') {
      setRole('artist');
    }
  }, [searchParams]);

  const availableStyles = [
      "Realismo", "Old School", "Neo Traditional", "Blackwork", 
      "Fine Line", "Oriental", "Pontilhismo", "Aquarela", "Lettering", "Outros"
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStyleToggle = (style: string) => {
      setFormData(prev => {
          const newStyles = prev.styles.includes(style)
              ? prev.styles.filter(s => s !== style)
              : [...prev.styles, style];
          return { ...prev, styles: newStyles };
      });
  };

  const handleNextStep = (e: React.FormEvent) => {
      e.preventDefault();
      // Validação básica da etapa 1
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
          alert("Por favor, preencha todos os campos obrigatórios.");
          return;
      }
      if (formData.password !== formData.confirmPassword) {
          // Alert mantido como fallback, mas a UI já mostrará o erro
          return;
      }
      setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulação de cadastro
    setTimeout(() => {
        setLoading(false);
        
        if (role === 'artist' && formData.styles.length === 0) {
            alert("Selecione pelo menos um estilo de tatuagem.");
            setLoading(false);
            return;
        }

        alert(role === 'artist' ? "Solicitação enviada! Entraremos em contato." : "Conta criada com sucesso!");
        navigate('/login');
    }, 1500);
  };

  // Helper para verificar senha
  const passwordsMismatch = formData.confirmPassword && formData.password !== formData.confirmPassword;

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-background-dark p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
         <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="w-full max-w-2xl bg-surface-dark border border-border-dark rounded-2xl p-8 shadow-2xl relative z-10 animate-fade-in my-8">
        <div className="text-center mb-8">
          <h1 className="font-tattoo text-4xl text-white mb-2">Crie sua Conta</h1>
          <p className="text-text-muted text-sm font-display tracking-wide">
              {step === 1 ? 'Passo 1: Dados de Acesso' : 'Passo 2: Perfil e Localização'}
          </p>
          
          {/* Progress Bar */}
          <div className="w-full h-1 bg-surface-light mt-4 rounded-full overflow-hidden max-w-xs mx-auto">
              <div 
                className="h-full bg-primary transition-all duration-500 ease-out" 
                style={{ width: step === 1 ? '50%' : '100%' }}
              ></div>
          </div>
        </div>

        {/* Role Switcher - Apenas visível no passo 1 */}
        {step === 1 && (
            <div className="flex p-1 bg-background-dark rounded-lg border border-border-dark mb-8">
                <button 
                    type="button"
                    onClick={() => setRole('client')}
                    className={`flex-1 py-2 rounded font-bold text-xs uppercase tracking-wide transition-all ${role === 'client' ? 'bg-surface-light text-white shadow' : 'text-text-muted hover:text-white'}`}
                >
                    Cliente
                </button>
                <button 
                    type="button"
                    onClick={() => setRole('artist')}
                    className={`flex-1 py-2 rounded font-bold text-xs uppercase tracking-wide transition-all ${role === 'artist' ? 'bg-surface-light text-white shadow' : 'text-text-muted hover:text-white'}`}
                >
                    Sou Profissional
                </button>
            </div>
        )}

        <form onSubmit={step === 1 ? handleNextStep : handleSubmit}>
            
            {/* ETAPA 1: DADOS BÁSICOS */}
            {step === 1 && (
                <div className="space-y-4 animate-fade-in">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Nome Completo</label>
                        <input 
                            type="text" 
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-background-dark border border-border-dark rounded-lg p-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary"
                            placeholder="Seu nome"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest">E-mail</label>
                        <input 
                            type="email" 
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-background-dark border border-border-dark rounded-lg p-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary"
                            placeholder="seu@email.com"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Senha</label>
                            <input 
                                type="password" 
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-background-dark border border-border-dark rounded-lg p-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary"
                                placeholder="••••••••"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Confirmar</label>
                            <input 
                                type="password" 
                                name="confirmPassword"
                                required
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`w-full bg-background-dark border rounded-lg p-2.5 text-white focus:ring-1 transition-colors ${
                                    passwordsMismatch 
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                                    : 'border-border-dark focus:border-primary focus:ring-primary'
                                }`}
                                placeholder="••••••••"
                            />
                            {passwordsMismatch && (
                                <p className="text-xs text-red-500 font-bold flex items-center gap-1 mt-1 animate-pulse">
                                    <span className="material-symbols-outlined text-[14px]">error</span>
                                    As senhas não coincidem.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ETAPA 2: ENDEREÇO + ESPECÍFICOS */}
            {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                    
                    {/* Seção de Endereço (Comum para ambos) */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2 text-primary">
                            <span className="material-symbols-outlined text-sm">location_on</span>
                            <h3 className="text-sm font-bold uppercase tracking-wider">Localização</h3>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1 col-span-1">
                                <label className="text-xs font-bold text-text-muted uppercase tracking-widest">CEP</label>
                                <input 
                                    type="text" 
                                    name="cep"
                                    required
                                    value={formData.cep}
                                    onChange={handleChange}
                                    className="w-full bg-background-dark border border-border-dark rounded-lg p-2.5 text-white focus:border-primary text-sm"
                                    placeholder="00000-000"
                                />
                            </div>
                            <div className="space-y-1 col-span-2">
                                <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Cidade</label>
                                <input 
                                    type="text" 
                                    name="city"
                                    required
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full bg-background-dark border border-border-dark rounded-lg p-2.5 text-white focus:border-primary text-sm"
                                    placeholder="Cidade"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4">
                            <div className="space-y-1 col-span-3">
                                <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Rua</label>
                                <input 
                                    type="text" 
                                    name="street"
                                    required
                                    value={formData.street}
                                    onChange={handleChange}
                                    className="w-full bg-background-dark border border-border-dark rounded-lg p-2.5 text-white focus:border-primary text-sm"
                                    placeholder="Nome da rua"
                                />
                            </div>
                            <div className="space-y-1 col-span-1">
                                <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Nº</label>
                                <input 
                                    type="text" 
                                    name="number"
                                    required
                                    value={formData.number}
                                    onChange={handleChange}
                                    className="w-full bg-background-dark border border-border-dark rounded-lg p-2.5 text-white focus:border-primary text-sm"
                                    placeholder="123"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-text-muted uppercase tracking-widest">
                                    Complemento <span className="text-[10px] lowercase font-normal opacity-70">(Opcional)</span>
                                </label>
                                <input 
                                    type="text" 
                                    name="complement"
                                    value={formData.complement}
                                    onChange={handleChange}
                                    className="w-full bg-background-dark border border-border-dark rounded-lg p-2.5 text-white focus:border-primary text-sm placeholder-zinc-700"
                                    placeholder="Apto, Bloco..."
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Estado (UF)</label>
                                <input 
                                    type="text" 
                                    name="state"
                                    required
                                    maxLength={2}
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="w-full bg-background-dark border border-border-dark rounded-lg p-2.5 text-white focus:border-primary text-sm"
                                    placeholder="SP"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-border-dark my-4"></div>

                    {/* Dados Específicos do Cliente */}
                    {role === 'client' && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2 text-primary">
                                <span className="material-symbols-outlined text-sm">medical_information</span>
                                <h3 className="text-sm font-bold uppercase tracking-wider">Ficha de Saúde (Privado)</h3>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Alergias / Medicamentos</label>
                                    <textarea 
                                        name="allergies"
                                        value={formData.allergies}
                                        onChange={handleChange}
                                        rows={2}
                                        className="w-full bg-background-dark border border-border-dark rounded-lg p-3 text-white focus:border-primary placeholder-zinc-700 text-sm"
                                        placeholder="Tem alergia a látex, tintas ou toma algum remédio controlado? (Opcional)"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Condições Médicas</label>
                                    <textarea 
                                        name="medicalNotes"
                                        value={formData.medicalNotes}
                                        onChange={handleChange}
                                        rows={2}
                                        className="w-full bg-background-dark border border-border-dark rounded-lg p-3 text-white focus:border-primary placeholder-zinc-700 text-sm"
                                        placeholder="Diabetes, problemas cardíacos, pele sensível, quelóides... (Opcional)"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Dados Específicos do Artista */}
                    {role === 'artist' && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-2 text-primary">
                                <span className="material-symbols-outlined text-sm">palette</span>
                                <h3 className="text-sm font-bold uppercase tracking-wider">Perfil Profissional</h3>
                            </div>

                            <div className="space-y-1">
                                <label className="flex items-center gap-2 p-3 border border-border-dark rounded-lg bg-background-dark cursor-pointer hover:border-white/30 transition-colors">
                                    <input 
                                        type="checkbox"
                                        checked={formData.artistRole.includes('Piercer')}
                                        onChange={(e) => setFormData({
                                            ...formData, 
                                            artistRole: e.target.checked ? 'Tatuador & Piercer' : 'Tatuador'
                                        })}
                                        className="rounded border-border-dark bg-surface-light text-primary focus:ring-primary"
                                    />
                                    <span className="text-xs font-bold text-white select-none">Também faz Piercer?</span>
                                </label>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Link do Portfólio</label>
                                    <input 
                                        type="url" 
                                        name="portfolio"
                                        required
                                        value={formData.portfolio}
                                        onChange={handleChange}
                                        className="w-full bg-background-dark border border-border-dark rounded-lg p-2.5 text-white focus:border-primary text-sm"
                                        placeholder="Instagram / Behance"
                                    />
                                </div>
                                
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Experiência</label>
                                    <select 
                                        name="experience"
                                        required
                                        value={formData.experience}
                                        onChange={handleChange}
                                        className="w-full bg-background-dark border border-border-dark rounded-lg p-2.5 text-white focus:border-primary text-sm"
                                    >
                                        <option value="" disabled selected>Selecione...</option>
                                        <option value="beginner">Iniciante (Aprendiz)</option>
                                        <option value="1-3">1 a 3 anos</option>
                                        <option value="3-5">3 a 5 anos</option>
                                        <option value="5+">Mais de 5 anos</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-text-muted uppercase tracking-widest block">Especialidades (Múltipla escolha)</label>
                                <div className="flex flex-wrap gap-2">
                                    {availableStyles.map(style => (
                                        <button
                                            type="button"
                                            key={style}
                                            onClick={() => handleStyleToggle(style)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                                                formData.styles.includes(style)
                                                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                                                : 'bg-surface-light text-text-muted border-border-dark hover:border-white/30 hover:text-white'
                                            }`}
                                        >
                                            {style}
                                        </button>
                                    ))}
                                </div>
                                
                                {formData.styles.includes('Outros') && (
                                    <div className="mt-2 animate-fade-in">
                                        <input 
                                            type="text"
                                            name="customStyle"
                                            value={formData.customStyle}
                                            onChange={handleChange}
                                            className="w-full bg-background-dark border border-border-dark rounded-lg p-2.5 text-white focus:border-primary text-sm"
                                            placeholder="Especifique seu estilo..."
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 mt-8">
                {step === 2 && (
                    <button 
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 py-3 rounded-lg border border-border-dark text-text-muted hover:text-white font-bold text-sm uppercase tracking-wide transition-colors"
                    >
                        Voltar
                    </button>
                )}
                
                <button 
                    type="submit" 
                    disabled={loading || (step === 1 && passwordsMismatch)}
                    className="flex-1 bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-lg shadow-[0_0_20px_rgba(212,17,50,0.3)] hover:shadow-[0_0_25px_rgba(212,17,50,0.5)] transition-all uppercase tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading 
                        ? 'Processando...' 
                        : (step === 1 ? 'Continuar' : (role === 'artist' ? 'Enviar Candidatura' : 'Concluir Cadastro'))
                    }
                    {!loading && <span className="material-symbols-outlined text-lg">arrow_forward</span>}
                </button>
            </div>
        </form>

        <div className="mt-6 text-center pt-6 border-t border-border-dark">
            <p className="text-xs text-text-muted">
                Já tem uma conta? <Link to="/login" className="text-white hover:text-primary transition-colors font-bold ml-1 underline">Faça Login</Link>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
