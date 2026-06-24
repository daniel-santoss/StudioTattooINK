'use client';

import React from 'react';

interface PortfolioItem {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
}

interface UserProfile {
    role: 'client' | 'artist' | 'admin';
    name: string;
    email: string;
    phone: string;
    avatar: string;
    coverUrl?: string;
    dob?: string;
    allergies?: string;
    medicalNotes?: string;
    artistRole?: string;
    bio?: string;
    experience?: string;
    specialties?: string[];
    portfolioUrl?: string;
    portfolio?: PortfolioItem[];
}

// Selo "Em breve" para ações ainda sem backend (mantidas visíveis a pedido).
const EmBreve = () => (
    <span className="text-[9px] uppercase tracking-wider text-text-muted border border-white/20 rounded px-1.5 py-0.5">Em breve</span>
);

const formatDateToBrazilian = (isoDate: string | undefined): string => {
    if (!isoDate) return '';
    const datePart = isoDate.split('T')[0];
    const parts = datePart.split('-');
    if (parts.length !== 3) return isoDate;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
};

const Profile: React.FC<{ profile: UserProfile | null }> = ({ profile }) => {
    if (!profile) {
        return <div className="min-h-screen flex items-center justify-center text-text-muted">Perfil não encontrado.</div>;
    }

    const role = profile.role;
    const roleLabel = role === 'client' ? 'Cliente' : role === 'artist' ? (profile.artistRole || 'Tatuador') : 'Gerente';

    return (
        <div className="p-6 md:p-8 lg:p-12 max-w-4xl mx-auto w-full">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="font-tattoo text-4xl text-white mb-2">Meu Perfil</h1>
                    <p className="text-text-muted text-sm">Gerencie suas informações pessoais e preferências.</p>
                </div>
                {/* Edição ainda sem backend ("Em breve") */}
                <button
                    disabled
                    title="Em breve"
                    className="bg-surface-light text-white/40 px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 border border-white/5 cursor-not-allowed"
                >
                    <span className="material-symbols-outlined">edit</span>
                    Editar Perfil
                    <EmBreve />
                </button>
            </div>

            <div className="bg-surface-dark border border-border-dark rounded-2xl p-8 relative overflow-hidden shadow-2xl mb-10">
                {/* Header / Cover */}
                <div className="absolute top-0 left-0 right-0 h-48 bg-surface-light border-b border-border-dark">
                    {profile.coverUrl ? (
                        <img src={profile.coverUrl} alt="Capa" className="w-full h-full object-cover opacity-60" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-r from-primary/20 to-blue-500/10"></div>
                    )}
                </div>

                <div className="relative pt-24 mb-8 flex flex-col md:flex-row items-end md:items-end gap-6">
                    <div className="relative">
                        <img src={profile.avatar} alt="Avatar" className="size-32 rounded-2xl border-4 border-surface-dark bg-surface-dark object-cover shadow-2xl" />
                    </div>
                    <div className="mb-2">
                        <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
                        <p className="text-text-muted text-sm uppercase tracking-wider font-bold">{roleLabel}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Nome Completo</label>
                        <p className="text-white p-2.5 px-0">{profile.name}</p>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest">E-mail</label>
                        <p className="text-white p-2.5 px-0">{profile.email}</p>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Telefone</label>
                        <p className="text-white p-2.5 px-0">{profile.phone || '—'}</p>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Data de Nascimento</label>
                        <p className="text-white p-2.5 px-0">{formatDateToBrazilian(profile.dob) || '—'}</p>
                    </div>
                </div>

                <div className="h-px bg-border-dark my-8 w-full"></div>

                {/* Client Medical Section */}
                {role === 'client' && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-2 text-primary">
                            <span className="material-symbols-outlined text-lg">medical_information</span>
                            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Ficha de Saúde (Privado)</h3>
                        </div>
                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Alergias / Medicamentos</label>
                                <div className="p-4 bg-surface-light/30 rounded-xl border border-white/5">
                                    <p className="text-white font-medium text-sm">{profile.allergies || 'Nenhuma alergia registrada.'}</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Observações Médicas</label>
                                <div className="p-4 bg-surface-light/30 rounded-xl border border-white/5">
                                    <p className="text-white font-medium text-sm">{profile.medicalNotes || 'Nenhuma observação registrada.'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Artist Professional Section */}
                {role === 'artist' && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 mb-2 text-primary">
                            <span className="material-symbols-outlined text-lg">palette</span>
                            <h3 className="text-lg font-bold text-white uppercase tracking-wider">Perfil Artístico</h3>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Link do Portfólio</label>
                            <p className="text-blue-400 p-2.5 px-0 break-all">{profile.portfolioUrl || '—'}</p>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Tempo de Experiência</label>
                            <p className="text-white font-medium p-2.5 px-0">{profile.experience || '—'}</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Especialidades</label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {profile.specialties && profile.specialties.length > 0 ? (
                                    profile.specialties.map(s => (
                                        <span key={s} className="px-3 py-1 bg-surface-light border border-white/10 rounded-full text-xs font-bold text-white">
                                            {s}
                                        </span>
                                    ))
                                ) : <span className="text-text-muted text-sm">Nenhuma selecionada.</span>}
                            </div>
                        </div>
                    </div>
                )}

                {(role === 'artist' || role === 'admin') && (
                    <div className="mt-6 space-y-1">
                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest">Bio / Sobre</label>
                        <p className="text-white p-2.5 px-0 whitespace-pre-wrap">{profile.bio || '—'}</p>
                    </div>
                )}
            </div>

            {/* Portfolio (Artist Only) — somente leitura; gestão "Em breve" */}
            {role === 'artist' && (
                <div className="bg-surface-dark border border-border-dark rounded-2xl p-8 shadow-2xl">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2 text-white">
                            <span className="material-symbols-outlined text-2xl text-primary">collections</span>
                            <h3 className="text-xl font-bold uppercase tracking-wider">Portfólio</h3>
                        </div>
                        <button
                            disabled
                            title="Em breve"
                            className="bg-surface-light text-white/40 px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 border border-white/5 uppercase tracking-wide cursor-not-allowed"
                        >
                            <span className="material-symbols-outlined text-sm">add</span>
                            Adicionar Arte
                            <EmBreve />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {profile.portfolio && profile.portfolio.length > 0 ? (
                            profile.portfolio.map(art => (
                                <div key={art.id} className="group relative bg-black rounded-xl overflow-hidden aspect-square border border-border-dark">
                                    <img src={art.imageUrl} alt={art.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                        <h5 className="text-white font-bold">{art.title}</h5>
                                        <p className="text-xs text-text-muted truncate">{art.description}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-10 text-center border-2 border-dashed border-border-dark rounded-xl">
                                <p className="text-text-muted text-sm">Seu portfólio está vazio.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
