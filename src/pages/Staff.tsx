
import React, { useState } from 'react';

interface StaffMember {
    id: number;
    name: string;
    cpf: string;
    role: string;
    specialty: string;
    status: string;
    email: string;
    phone: string;
    avatar: string;
    performance: { revenue: string; rating: number; ratingCount: number };
    password?: string;
}

const initialStaff: StaffMember[] = [
    {
        id: 1,
        name: "Alex Rivera",
        cpf: "567.890.123-44",
        role: "Especialista em Realismo",
        specialty: "Realismo Preto e Cinza",
        status: "Disponível",
        email: "alex@inkstudio.com",
        phone: "(11) 99999-0001",
        avatar: "/images/tatuadores/tatuador1.jpg",
        performance: { revenue: "R$ 12.5k", rating: 4.7, ratingCount: 2899 }
    },
    {
        id: 2,
        name: "Lucas Vane",
        cpf: "678.901.234-55",
        role: "Neo Tradicional",
        specialty: "Neo Tradicional & Colorido",
        status: "Em Sessão",
        email: "lucas@inkstudio.com",
        phone: "(11) 99999-0002",
        avatar: "/images/tatuadores/tatuador2.jpg",
        performance: { revenue: "R$ 9.2k", rating: 5.0, ratingCount: 1450 }
    },
    {
        id: 3,
        name: "Mika Chen",
        cpf: "789.012.345-66",
        role: "Oriental / Irezumi",
        specialty: "Irezumi & Dragões",
        status: "Folga",
        email: "mika@inkstudio.com",
        phone: "(11) 99999-0003",
        avatar: "/images/tatuadores/tatuador3.jpg",
        performance: { revenue: "R$ 15.1k", rating: 4.8, ratingCount: 920 }
    },
    {
        id: 4,
        name: "Elena Rosa",
        cpf: "890.123.456-77",
        role: "Fine Line",
        specialty: "Fine Line & Minimalismo",
        status: "Disponível",
        email: "elena@inkstudio.com",
        phone: "(11) 99999-0004",
        avatar: "/images/tatuadores/tatuador4.jpg",
        performance: { revenue: "R$ 11.8k", rating: 4.9, ratingCount: 1105 }
    },
    {
        id: 5,
        name: "Lucas Ferreira",
        cpf: "901.234.567-88",
        role: "Blackwork & Pontilhismo",
        specialty: "Blackwork & Mandalas",
        status: "Disponível",
        email: "ferreira@inkstudio.com",
        phone: "(11) 99999-0005",
        avatar: "/images/tatuadores/tatuador5.jpg",
        performance: { revenue: "R$ 8.5k", rating: 4.5, ratingCount: 780 }
    },
    {
        id: 6,
        name: "André Costa",
        cpf: "012.345.678-99",
        role: "Aquarela & Colorido",
        specialty: "Aquarela & Abstrato",
        status: "Em Sessão",
        email: "andre@inkstudio.com",
        phone: "(11) 99999-0006",
        avatar: "/images/tatuadores/tatuador6.jpg",
        performance: { revenue: "R$ 13.2k", rating: 4.9, ratingCount: 1230 }
    },
    {
        id: 7,
        name: "Rafael Santos",
        cpf: "123.456.789-00",
        role: "Old School",
        specialty: "Tradicional Americano",
        status: "Folga",
        email: "rafael@inkstudio.com",
        phone: "(11) 99999-0007",
        avatar: "/images/tatuadores/tatuador7.jpg",
        performance: { revenue: "R$ 7.8k", rating: 4.4, ratingCount: 650 }
    },
    {
        id: 8,
        name: "Juliana Mendes",
        cpf: "234.567.890-11",
        role: "Lettering & Script",
        specialty: "Caligrafia & Chicano",
        status: "Disponível",
        email: "juliana@inkstudio.com",
        phone: "(11) 99999-0008",
        avatar: "/images/tatuadores/tatuador8.jpg",
        performance: { revenue: "R$ 10.1k", rating: 4.6, ratingCount: 890 }
    }
];

export const RatingDisplay: React.FC<{
    rating: number;
    count?: number;
    size?: string;
    showText?: boolean;
    activeColor?: string; // e.g. "text-amber-500" or "text-blue-500"
    bgColor?: string; // e.g. "text-white/10"
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

const Staff: React.FC = () => {
    const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingMember, setEditingMember] = useState<StaffMember | null>(null);

    const handleOpenEdit = (member: StaffMember) => {
        setEditingMember(member);
        setIsEditModalOpen(true);
    };

    return (
        <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto w-full relative">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="font-tattoo text-4xl text-white mb-2">Tatuadores</h1>
                    <p className="text-text-muted text-sm">Gerencie os membros da equipe artística.</p>
                </div>
                <button onClick={() => setIsAddModalOpen(true)} className="bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg font-bold text-sm shadow-lg shadow-primary/20 transition-all flex items-center gap-2 uppercase tracking-wide">
                    <span className="material-symbols-outlined">person_add</span>
                    Adicionar Novo
                </button>
            </div>

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
                                    <div className="mt-1 transform scale-90 origin-left">
                                        <RatingDisplay rating={member.performance.rating} count={member.performance.ratingCount} size="14px" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-border-dark">
                            <button onClick={() => handleOpenEdit(member)} className="flex items-center justify-center gap-2 py-2 rounded-lg bg-surface-light hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wide transition-colors">
                                <span className="material-symbols-outlined text-sm">edit_note</span>
                                Visualizar
                            </button>
                            <button className="flex items-center justify-center gap-2 py-2 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500/10 text-xs font-bold uppercase tracking-wide transition-colors">
                                <span className="material-symbols-outlined text-sm">delete</span>
                                Excluir
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {isEditModalOpen && editingMember && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-surface-dark border border-border-dark rounded-2xl w-full max-w-lg shadow-2xl relative animate-fade-in my-8">
                        <div className="flex items-center justify-between p-6 border-b border-border-dark">
                            <h3 className="text-xl font-bold text-white">Perfil do Tatuador</h3>
                            <button type="button" onClick={() => setIsEditModalOpen(false)} className="text-text-muted hover:text-white">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center gap-6 mb-8">
                                <img src={editingMember.avatar} alt={editingMember.name} className="size-24 rounded-xl object-cover border-2 border-primary" />
                                <div className="flex-1">
                                    <label className="text-xs font-bold text-text-muted uppercase mb-1 block">Nome Completo</label>
                                    <p className="text-white font-bold text-xl mb-2">{editingMember.name}</p>
                                    <div className="bg-surface-light/30 p-3 rounded-xl border border-white/5 inline-block">
                                        <RatingDisplay rating={editingMember.performance.rating} count={editingMember.performance.ratingCount} size="20px" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-border-dark">
                                <div>
                                    <label className="text-xs text-text-muted uppercase font-bold mb-1 block">CPF</label>
                                    <input type="text" value={editingMember.cpf} disabled className="w-full bg-surface-light border border-border-dark rounded-lg p-2.5 text-text-muted cursor-not-allowed" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs text-text-muted uppercase font-bold mb-1 block">Especialidade</label>
                                        <p className="text-white bg-background-dark p-2.5 rounded-lg border border-border-dark font-medium">{editingMember.specialty}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs text-text-muted uppercase font-bold mb-1 block">Telefone</label>
                                        <p className="text-white bg-background-dark p-2.5 rounded-lg border border-border-dark font-medium">{editingMember.phone}</p>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs text-text-muted uppercase font-bold mb-1 block">Email</label>
                                    <p className="text-white bg-background-dark p-2.5 rounded-lg border border-border-dark font-medium">{editingMember.email}</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-border-dark flex justify-end gap-3 bg-surface-dark rounded-b-2xl">
                            <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-6 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold text-sm uppercase tracking-wide">
                                Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Staff;
