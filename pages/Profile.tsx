
import React, { useState, useEffect } from 'react';
import { Artwork } from '../types';

// Interfaces for better type safety (optional but good practice)
interface UserProfile {
    name: string;
    email: string;
    phone: string;
    avatar: string;
    coverUrl?: string; // New field for cover photo
    // Client specific
    allergies?: string;
    medicalNotes?: string;
    dob?: string;
    // Artist specific
    artistRole?: string; // "Tatuador" or "Tatuador & Piercer"
    bio?: string;
    experience?: string;
    specialties?: string[]; 
    customStyle?: string;
    portfolioUrl?: string;
    // Portfolio local management
    portfolio?: Artwork[];
}

const Profile: React.FC = () => {
  const [role, setRole] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // States for Artwork Upload
  const [isAddingArt, setIsAddingArt] = useState(false);
  const [newArt, setNewArt] = useState({ title: '', description: '', imageUrl: '' });

  const availableStyles = [
      "Realismo", "Old School", "Neo Traditional", "Blackwork", 
      "Fine Line", "Oriental", "Pontilhismo", "Aquarela", "Lettering", "Outros"
  ];

  // Mock data structure
  const [profile, setProfile] = useState<UserProfile>({
      name: '',
      email: '',
      phone: '',
      avatar: 'https://i.pravatar.cc/150?u=default',
      specialties: [],
      portfolio: []
  });

  useEffect(() => {
    const userRole = localStorage.getItem('ink_role');
    setRole(userRole);

    // Load mock data based on role
    if (userRole === 'artist') {
        setProfile({
            name: 'Alex Rivera',
            email: 'alex@inkstudio.com',
            phone: '(11) 99999-0001',
            artistRole: 'Tatuador',
            bio: 'Especialista em realismo preto e cinza com mais de 10 anos de mercado.',
            experience: '5+',
            specialties: ['Realismo', 'Preto e Cinza', 'Retratos'],
            portfolioUrl: 'https://instagram.com/alexrivera_ink',
            avatar: 'https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=200',
            coverUrl: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&q=80&w=1200',
            portfolio: [
                { id: 101, title: "Olhar Profundo", description: "Estudo de realismo ocular com foco em texturas de pele.", imageUrl: "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&q=80&w=600" },
                { id: 102, title: "Guerreiro", description: "Retrato histórico preto e cinza, cicatrização de 6 meses.", imageUrl: "https://images.unsplash.com/photo-1562962230-16bc46364924?auto=format&fit=crop&q=80&w=600" },
            ]
        });
    } else if (userRole === 'client') {
         setProfile({
            name: 'Cliente Exemplo',
            email: 'cliente@email.com',
            phone: '(11) 98888-8888',
            dob: '1995-05-20',
            allergies: 'Dipirona, Látex',
            medicalNotes: 'Histórico de quelóide na família',
            avatar: 'https://i.pravatar.cc/150?u=client',
            specialties: []
        });
    } else { // Admin
         setProfile({
            name: 'Admin Manager',
            email: 'admin@inkstudio.com',
            phone: '(11) 90000-0000',
            bio: 'Gerente Geral',
            experience: '',
            specialties: [],
            avatar: 'https://i.pravatar.cc/150?u=admin'
        });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSpecialtyToggle = (style: string) => {
      setProfile(prev => {
          const currentStyles = prev.specialties || [];
          const newStyles = currentStyles.includes(style)
              ? currentStyles.filter(s => s !== style)
              : [...currentStyles, style];
          return { ...prev, specialties: newStyles };
      });
  };

  const handleSave = (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setTimeout(() => {
          setLoading(false);
          setIsEditing(false);
          alert("Perfil atualizado com sucesso!");
      }, 1000);
  };

  // Handler for Profile Picture Upload
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setProfile(prev => ({ ...prev, avatar: reader.result as string }));
          };
          reader.readAsDataURL(file);
      }
  };

  // Handler for Cover Photo Upload
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setProfile(prev => ({ ...prev, coverUrl: reader.result as string }));
          };
          reader.readAsDataURL(file);
      }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setNewArt(prev => ({ ...prev, imageUrl: reader.result as string }));
          };
          reader.readAsDataURL(file);
      }
  };

  const handleAddArtwork = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newArt.imageUrl || !newArt.title) return;

      const artwork: Artwork = {
          id: Date.now(),
          title: newArt.title,
          description: newArt.description,
          imageUrl: newArt.imageUrl
      };

      setProfile(prev => ({
          ...prev,
          portfolio: [...(prev.portfolio || []), artwork]
      }));

      setNewArt({ title: '', description: '', imageUrl: '' });
      setIsAddingArt(false);
      alert("Arte adicionada ao portfólio com sucesso!");
  };

  const handleDeleteArtwork = (id: number) => {
      if(window.confirm("Deseja remover esta arte do seu portfólio?")) {
          setProfile(prev => ({
              ...prev,
              portfolio: prev.portfolio?.filter(art => art.id !== id)
          }));
      }
  };

  const getExperienceLabel = (exp: string | undefined) => {
      if (!exp) return '';
      const map: Record<string, string> = {
          'beginner': 'Iniciante (Aprendiz)',
          '1-3': '1 a 3 anos',
          '3-5': '3 a 5 anos',
          '5+': 'Mais de 5 anos'
      };
      return map[exp] || exp;
  };

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-4xl mx-auto w-full">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
            <div>
                <h1 className="font-tattoo text-4xl text-white mb-2">Meu Perfil</h1>
                <p className="text-text-muted text-sm">Gerencie suas informações pessoais e preferências.</p>
            </div>
            {!isEditing && (
                <button 
                    onClick={() => setIsEditing(true)}
                    className="bg-surface-light hover:bg-white/10 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 border border-white/5"
                >
                    <span className="material-symbols-outlined">edit</span>
                    Editar Perfil
                </button>
            )}
        </div>

        <form onSubmit={handleSave} className="bg-surface-dark border border-border-dark rounded-2xl p-8 relative overflow-hidden shadow-2xl mb-10">
            {/* Header / Cover */}
            <div className="absolute top-0 left-0 right-0 h-48 bg-surface-light border-b border-border-dark group">
                {profile.coverUrl ? (
                    <img src={profile.coverUrl} alt="Capa" className="w-full h-full object-cover opacity-60" />
                ) : (
                    <div className="w-full h-full bg-gradient-to-r from-primary/20 to-blue-500/10"></div>
                )}
                
                {isEditing && (
                    <div className="absolute top-4 right-4 z-10">
                         <input 
                            type="file" 
                            id="cover-upload" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleCoverChange} 
                        />
                        <label 
                            htmlFor="cover-upload"
                            className="bg-black/60 hover:bg-black/80 text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide cursor-pointer flex items-center gap-2 border border-white/20 transition-colors"
                        >
                            <span className="material-symbols-outlined text-sm">edit</span>
                            Alterar Capa
                        </label>
                    </div>
                )}
            </div>
            
            <div className="relative pt-24 mb-8 flex flex-col md:flex-row items-end md:items-end gap-6">
                <div className="relative group">
                     <img src={profile.avatar} alt="Avatar" className="size-32 rounded-2xl border-4 border-surface-dark bg-surface-dark object-cover shadow-2xl" />
                     {isEditing && (
                        <>
                             <input 
                                type="file" 
                                id="avatar-upload" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={handleAvatarChange} 
                             />
                             <label 
                                htmlFor="avatar-upload"
                                className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-2xl border-4 border-transparent z-10"
                             >
                                 <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
                             </label>
                        </>
                     )}
                </div>
                <div className="mb-2">
                    <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
                    <p className="text-text-muted text-sm uppercase tracking-wider font-bold">
                        {role === 'client' ? 'Cliente' : (role === 'artist' ? (profile.artistRole || 'Tatuador') : 'Gerente')}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Nome Completo</label>
                    <input 
                        type="text" 
                        name="name"
                        disabled={!isEditing}
                        value={profile.name}
                        onChange={handleChange}
                        className={`w-full rounded-lg p-2.5 text-white border transition-all ${isEditing ? 'bg-background-dark border-border-dark focus:border-primary' : 'bg-transparent border-transparent px-0'}`}
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest">E-mail</label>
                    <input 
                        type="email" 
                        name="email"
                        disabled={!isEditing}
                        value={profile.email}
                        onChange={handleChange}
                        className={`w-full rounded-lg p-2.5 text-white border transition-all ${isEditing ? 'bg-background-dark border-border-dark focus:border-primary' : 'bg-transparent border-transparent px-0'}`}
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Telefone</label>
                    <input 
                        type="text" 
                        name="phone"
                        disabled={!isEditing}
                        value={profile.phone}
                        onChange={handleChange}
                        className={`w-full rounded-lg p-2.5 text-white border transition-all ${isEditing ? 'bg-background-dark border-border-dark focus:border-primary' : 'bg-transparent border-transparent px-0'}`}
                    />
                </div>

                {role === 'client' && (
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Data de Nascimento</label>
                        <input 
                            type="text" 
                            disabled
                            value={profile.dob}
                            className="w-full bg-transparent border-transparent px-0 text-white rounded-lg p-2.5"
                        />
                    </div>
                )}
            </div>

            <div className="h-px bg-border-dark my-8 w-full"></div>

            {/* Client Medical Section */}
            {role === 'client' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center gap-2 mb-2 text-primary">
                        <span className="material-symbols-outlined text-lg">medical_information</span>
                        <h3 className="text-lg font-bold text-white uppercase tracking-wider">Ficha de Saúde (Privado)</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Alergias / Medicamentos</label>
                            {isEditing ? (
                                <textarea 
                                    name="allergies"
                                    value={profile.allergies}
                                    onChange={handleChange}
                                    rows={2}
                                    className="w-full bg-background-dark border border-border-dark rounded-lg p-3 text-white focus:border-primary placeholder-zinc-700"
                                    placeholder="Liste alergias a medicamentos, látex ou uso contínuo de remédios"
                                />
                            ) : (
                                <div className="p-4 bg-surface-light/30 rounded-xl border border-white/5">
                                    <p className="text-white font-medium text-sm">
                                        {profile.allergies || 'Nenhuma alergia registrada.'}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Observações Médicas</label>
                            {isEditing ? (
                                <textarea 
                                    name="medicalNotes"
                                    value={profile.medicalNotes}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full bg-background-dark border border-border-dark rounded-lg p-3 text-white focus:border-primary placeholder-zinc-700"
                                    placeholder="Histórico de quelóides, problemas cardíacos, etc."
                                />
                            ) : (
                                <div className="p-4 bg-surface-light/30 rounded-xl border border-white/5">
                                    <p className="text-white font-medium text-sm">
                                        {profile.medicalNotes || 'Nenhuma observação registrada.'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Artist Professional Section */}
            {role === 'artist' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center gap-2 mb-2 text-primary">
                        <span className="material-symbols-outlined text-lg">palette</span>
                        <h3 className="text-lg font-bold text-white uppercase tracking-wider">Perfil Artístico</h3>
                    </div>

                    {isEditing && (
                        <div className="space-y-1">
                             <label className="flex items-center gap-2 p-3 border border-border-dark rounded-lg bg-background-dark cursor-pointer hover:border-white/30 transition-colors">
                                <input 
                                    type="checkbox"
                                    checked={profile.artistRole?.includes('Piercer')}
                                    onChange={(e) => setProfile({
                                        ...profile, 
                                        artistRole: e.target.checked ? 'Tatuador & Piercer' : 'Tatuador'
                                    })}
                                    className="rounded border-border-dark bg-surface-light text-primary focus:ring-primary"
                                />
                                <span className="text-xs font-bold text-white select-none">Também faz Piercer?</span>
                            </label>
                        </div>
                    )}

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Link do Portfólio</label>
                        <input 
                            type="url" 
                            name="portfolioUrl"
                            disabled={!isEditing}
                            value={profile.portfolioUrl}
                            onChange={handleChange}
                            className={`w-full rounded-lg p-2.5 text-blue-400 border transition-all ${isEditing ? 'bg-background-dark border-border-dark focus:border-primary text-white' : 'bg-transparent border-transparent px-0'}`}
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Tempo de Experiência</label>
                        {isEditing ? (
                            <select 
                                name="experience"
                                required
                                value={profile.experience}
                                onChange={handleChange}
                                className="w-full bg-background-dark border border-border-dark rounded-lg p-2.5 text-white focus:border-primary"
                            >
                                <option value="" disabled>Selecione...</option>
                                <option value="beginner">Iniciante (Aprendiz)</option>
                                <option value="1-3">1 a 3 anos</option>
                                <option value="3-5">3 a 5 anos</option>
                                <option value="5+">Mais de 5 anos</option>
                            </select>
                        ) : (
                            <p className="text-white font-medium p-2.5 border border-transparent px-0">
                                {getExperienceLabel(profile.experience)}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                         <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Especialidades</label>
                         {isEditing ? (
                             <>
                                <div className="flex flex-wrap gap-2">
                                    {availableStyles.map(style => (
                                        <button
                                            type="button"
                                            key={style}
                                            onClick={() => handleSpecialtyToggle(style)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                                                profile.specialties?.includes(style)
                                                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                                                : 'bg-surface-light text-text-muted border-border-dark hover:border-white/30 hover:text-white'
                                            }`}
                                        >
                                            {style}
                                        </button>
                                    ))}
                                </div>
                                {profile.specialties?.includes('Outros') && (
                                    <div className="mt-2 animate-fade-in">
                                        <input 
                                            type="text"
                                            name="customStyle"
                                            value={profile.customStyle || ''}
                                            onChange={handleChange}
                                            className="w-full bg-background-dark border border-border-dark rounded-lg p-2.5 text-white focus:border-primary text-sm"
                                            placeholder="Especifique seu estilo..."
                                        />
                                    </div>
                                )}
                             </>
                         ) : (
                             <div className="flex flex-wrap gap-2 mt-2">
                                 {profile.specialties && profile.specialties.length > 0 ? (
                                     profile.specialties.map(s => (
                                         <span key={s} className="px-3 py-1 bg-surface-light border border-white/10 rounded-full text-xs font-bold text-white">
                                             {s}
                                         </span>
                                     ))
                                 ) : <span className="text-text-muted text-sm">Nenhuma selecionada.</span>}
                             </div>
                         )}
                    </div>
                </div>
            )}
            
            {(role === 'artist' || role === 'admin') && (
                 <div className="mt-6 space-y-1">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Bio / Sobre</label>
                    <textarea 
                        name="bio"
                        rows={4}
                        disabled={!isEditing}
                        value={profile.bio}
                        onChange={handleChange}
                        className={`w-full rounded-lg p-2.5 text-white border transition-all ${isEditing ? 'bg-background-dark border-border-dark focus:border-primary' : 'bg-transparent border-transparent px-0'}`}
                    />
                </div>
            )}

            {isEditing && (
                <div className="mt-8 pt-6 border-t border-border-dark flex justify-end gap-3">
                    <button 
                        type="button" 
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-2 rounded-lg border border-border-dark text-text-muted hover:text-white font-bold text-sm transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="px-8 py-2 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold text-sm transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
                    >
                        {loading ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                </div>
            )}
        </form>

        {/* Portfolio Management Section (Artist Only) */}
        {role === 'artist' && (
            <div className="bg-surface-dark border border-border-dark rounded-2xl p-8 shadow-2xl animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2 text-white">
                        <span className="material-symbols-outlined text-2xl text-primary">collections</span>
                        <h3 className="text-xl font-bold uppercase tracking-wider">Gerenciar Portfólio</h3>
                    </div>
                    <button 
                        onClick={() => setIsAddingArt(!isAddingArt)}
                        className="bg-surface-light hover:bg-white/10 text-white px-4 py-2 rounded-lg font-bold text-xs transition-colors flex items-center gap-2 border border-white/5 uppercase tracking-wide"
                    >
                        <span className="material-symbols-outlined text-sm">{isAddingArt ? 'close' : 'add'}</span>
                        {isAddingArt ? 'Cancelar' : 'Adicionar Arte'}
                    </button>
                </div>

                {isAddingArt && (
                    <form onSubmit={handleAddArtwork} className="bg-background-dark p-6 rounded-xl border border-border-dark mb-8 animate-fade-in">
                        <h4 className="text-white font-bold mb-4 text-sm">Novo Item do Portfólio</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Título da Obra</label>
                                <input 
                                    type="text" 
                                    required
                                    value={newArt.title}
                                    onChange={e => setNewArt({...newArt, title: e.target.value})}
                                    className="w-full bg-surface-dark border border-border-dark rounded-lg p-2.5 text-white focus:border-primary text-sm"
                                    placeholder="Ex: Leão Geométrico"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Imagem</label>
                                <div className="relative">
                                    <input 
                                        type="file" 
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        id="art-upload"
                                    />
                                    <label 
                                        htmlFor="art-upload" 
                                        className="w-full bg-surface-dark border border-border-dark border-dashed rounded-lg p-3 text-text-muted hover:text-white hover:border-primary cursor-pointer transition-all flex items-center justify-center gap-2"
                                    >
                                        <span className="material-symbols-outlined">upload_file</span>
                                        {newArt.imageUrl ? 'Imagem Selecionada (Clique para alterar)' : 'Carregar do Dispositivo'}
                                    </label>
                                </div>
                                {newArt.imageUrl && (
                                    <div className="mt-2 relative w-full h-32 rounded-lg overflow-hidden border border-border-dark">
                                        <img src={newArt.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="space-y-1 mb-4">
                            <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Descrição</label>
                            <textarea 
                                value={newArt.description}
                                onChange={e => setNewArt({...newArt, description: e.target.value})}
                                rows={2}
                                className="w-full bg-surface-dark border border-border-dark rounded-lg p-2.5 text-white focus:border-primary text-sm placeholder-zinc-700"
                                placeholder="Descreva o estilo, tempo de sessão, etc."
                            />
                        </div>
                        <div className="flex justify-end">
                             <button type="submit" disabled={!newArt.imageUrl || !newArt.title} className="bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg shadow-primary/20 transition-all">
                                 Adicionar ao Portfólio
                             </button>
                        </div>
                    </form>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {profile.portfolio && profile.portfolio.length > 0 ? (
                        profile.portfolio.map(art => (
                            <div key={art.id} className="group relative bg-black rounded-xl overflow-hidden aspect-square border border-border-dark">
                                <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                    <h5 className="text-white font-bold">{art.title}</h5>
                                    <p className="text-xs text-text-muted truncate">{art.description}</p>
                                    <button 
                                        onClick={() => handleDeleteArtwork(art.id)}
                                        className="absolute top-2 right-2 p-2 bg-red-500/80 text-white rounded-lg hover:bg-red-600 transition-colors"
                                        title="Remover"
                                    >
                                        <span className="material-symbols-outlined text-sm">delete</span>
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-10 text-center border-2 border-dashed border-border-dark rounded-xl">
                            <p className="text-text-muted text-sm">Seu portfólio está vazio. Adicione suas melhores artes.</p>
                        </div>
                    )}
                </div>
            </div>
        )}
    </div>
  );
};

export default Profile;
