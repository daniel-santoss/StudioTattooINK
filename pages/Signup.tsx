
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<'client' | 'artist'>('client');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    // Artist specific
    artistRole: 'Tatuador', // Default base role
    portfolio: '',
    experience: '',
    styles: [] as string[],
    customStyle: '',
    // Client specific
    allergies: '',
    medicalNotes: ''
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulação de cadastro
    setTimeout(() => {
        setLoading(false);
        if (formData.password !== formData.confirmPassword) {
            alert("As senhas não coincidem!");
            return;
        }
        
        if (role === 'artist' && formData.styles.length === 0) {
            alert("Selecione pelo menos um estilo de tatuagem.");
            return;
        }

        alert(role === 'artist' ? "Solicitação enviada! Entraremos em contato." : "Conta criada com sucesso!");
        navigate('/login');
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-background-dark p-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
         <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="w-full max-w-xl bg-surface-dark border border-border-dark rounded-2xl p-8 shadow-2xl relative z-10 animate-fade-in my-8">
        <div className="text-center mb-8">
          <h1 className="font-tattoo text-4xl text-white mb-2">Crie sua Conta</h1>
          <p className="text-text-muted text-sm font-display tracking-wide">Junte-se ao Ink Studio.</p>
        </div>

        {/* Role Switcher */}
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

        <form onSubmit={handleSubmit} className="space-y-4">
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
                        className="w-full bg-background-dark border border-border-dark rounded-lg p-2.5 text-white focus:border-primary focus:ring-1 focus:ring-primary"
                        placeholder="••••••••"
                    />
                </div>
            </div>
            
            <div className="h-px bg-border-dark my-6"></div>

            {role === 'client' && (
                <div className="space-y-5 animate-fade-in">
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

            {role === 'artist' && (
                <div className="space-y-5 animate-fade-in">
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
                                className="w-full bg-background-dark border border-border-dark rounded-lg p-2.5 text-white focus:border-primary"
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
                                className="w-full bg-background-dark border border-border-dark rounded-lg p-2.5 text-white focus:border-primary"
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

            <button 
                type="submit" 
                disabled={loading}
                className="w-full mt-6 bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-lg shadow-[0_0_20px_rgba(212,17,50,0.3)] hover:shadow-[0_0_25px_rgba(212,17,50,0.5)] transition-all uppercase tracking-wider text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Processando...' : (role === 'artist' ? 'Enviar Candidatura' : 'Criar Conta')}
            </button>
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
