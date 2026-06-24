'use client';

import React from 'react';

interface StaffMember {
    id: string;
    name: string;
    cpf: string;
    role: string;
    specialty: string;
    status: string;
    email: string;
    phone: string;
    avatar: string;
}

// Componente de estrelas mantido apenas porque telas legadas (não roteadas) ainda o importam.
// Não é usado nesta tela — o domínio não possui avaliação/nota.
export const RatingDisplay: React.FC<{
    rating: number;
    count?: number;
    size?: string;
    showText?: boolean;
    activeColor?: string;
    bgColor?: string;
}> = ({
    rating,
    count,
    size = "18px",
    showText = true,
    activeColor = "text-amber-500",
    bgColor = "text-white/10"
}) => {
        return (
            <div className="flex items-center gap-1.5 font-inter">
                {showText && <span className="text-white font-bold leading-none" style={{ fontSize: `calc(${size} * 0.9)` }}>{rating.toFixed(1)}</span>}
                <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((starIndex) => {
                        const fillAmount = Math.min(Math.max(rating - (starIndex - 1), 0), 1) * 100;
                        return (
                            <div key={starIndex} className="relative flex items-center justify-center" style={{ width: size, height: size }}>
                                <span
                                    className={`material-symbols-outlined absolute ${bgColor} select-none leading-none`}
                                    style={{ fontSize: size, fontVariationSettings: "'FILL' 1", lineHeight: 1 }}
                                >
                                    star
                                </span>
                                <div
                                    className="absolute left-0 top-0 overflow-hidden select-none h-full flex items-center"
                                    style={{ width: `${fillAmount}%` }}
                                >
                                    <span
                                        className={`material-symbols-outlined ${activeColor} leading-none`}
                                        style={{ fontSize: size, fontVariationSettings: "'FILL' 1", lineHeight: 1 }}
                                    >
                                        star
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {count !== undefined && (
                    <span className="text-text-muted font-medium ml-0.5 leading-none" style={{ fontSize: `calc(${size} * 0.8)` }}>
                        ({count >= 1000 ? count.toLocaleString('pt-BR') : count})
                    </span>
                )}
            </div>
        );
    };

const Staff: React.FC<{ staff: StaffMember[] }> = ({ staff }) => {
    return (
        <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto w-full relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="font-tattoo text-4xl text-white mb-2">Tatuadores</h1>
                    <p className="text-text-muted text-sm">Gerencie os membros da equipe artística.</p>
                </div>
                {/* Cadastro de tatuador ainda sem backend ("Em breve") */}
                <button
                    disabled
                    title="Em breve"
                    className="bg-primary/40 text-white/60 px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 uppercase tracking-wide cursor-not-allowed"
                >
                    <span className="material-symbols-outlined">person_add</span>
                    Adicionar Novo
                    <span className="text-[9px] tracking-wider border border-white/20 rounded px-1.5 py-0.5">Em breve</span>
                </button>
            </div>

            {staff.length === 0 ? (
                <div className="text-center py-20 bg-surface-dark border border-border-dark rounded-2xl">
                    <span className="material-symbols-outlined text-text-muted text-4xl mb-3">badge</span>
                    <h3 className="text-white font-bold text-lg">Nenhum tatuador cadastrado</h3>
                    <p className="text-text-muted text-sm">A equipe aparecerá aqui assim que cadastrada.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {staff.map((member) => (
                        <div key={member.id} className="bg-surface-dark border border-border-dark rounded-2xl p-6 group hover:border-primary/30 transition-all flex flex-col">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <img src={member.avatar} alt={member.name} className="size-16 rounded-xl object-cover bg-surface-light border border-border-dark" />
                                        <div className={`absolute -bottom-1 -right-1 size-3.5 rounded-full border-2 border-surface-dark ${member.status === 'Disponível' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white text-lg leading-tight">{member.name}</h3>
                                        <p className="text-primary text-xs font-bold uppercase tracking-wider mb-1">{member.role}</p>
                                        <p className="text-text-muted text-xs">{member.specialty}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-border-dark">
                                {/* Ações ainda sem backend ("Em breve") */}
                                <button disabled title="Em breve" className="flex items-center justify-center gap-2 py-2 rounded-lg bg-surface-light text-white/40 text-xs font-bold uppercase tracking-wide cursor-not-allowed">
                                    <span className="material-symbols-outlined text-sm">edit_note</span>
                                    Visualizar
                                </button>
                                <button disabled title="Em breve" className="flex items-center justify-center gap-2 py-2 rounded-lg border border-red-500/20 text-red-500/40 text-xs font-bold uppercase tracking-wide cursor-not-allowed">
                                    <span className="material-symbols-outlined text-sm">delete</span>
                                    Excluir
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Staff;
