'use client';


import React from 'react';
import { useRouter } from 'next/navigation';
function useNavigate() { const r = useRouter(); return (p: string | number) => typeof p === 'number' ? r.back() : r.push(p); }

interface ArtistResumo { agendadas: number; aguardando: number; concluidas: number; }
interface AdminResumo { candidaturasPendentes: number; clientesAtivos: number; profissionais: number; }

interface DashboardProps {
    role: 'admin' | 'artist' | 'client';
    artistResumo?: ArtistResumo;
    adminResumo?: AdminResumo;
}

const Dashboard: React.FC<DashboardProps> = ({ role, artistResumo, adminResumo }) => {
    const navigate = useNavigate();

    // --- Visão do Tatuador: agregados reais da própria agenda ---
    if (role === 'artist') {
        const r = artistResumo ?? { agendadas: 0, aguardando: 0, concluidas: 0 };
        const cards = [
            { label: 'Sessões agendadas', value: r.agendadas, icon: 'event_available', color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { label: 'Aguardando confirmação', value: r.aguardando, icon: 'hourglass_top', color: 'text-amber-500', bg: 'bg-amber-500/10' },
            { label: 'Concluídas', value: r.concluidas, icon: 'task_alt', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
        ];
        return (
            <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto w-full">
                <div className="mb-10">
                    <h1 className="font-tattoo text-4xl text-white mb-2">Visão Geral</h1>
                    <p className="text-text-muted text-sm">Acompanhe suas sessões.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {cards.map((c) => (
                        <div key={c.label} className="bg-surface-dark border border-border-dark rounded-2xl p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <span className={`material-symbols-outlined text-6xl ${c.color}`}>{c.icon}</span>
                            </div>
                            <div className="relative z-10">
                                <p className="text-text-muted text-xs font-bold uppercase tracking-widest mb-1">{c.label}</p>
                                <h2 className="text-4xl font-display font-bold text-white">{c.value}</h2>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button onClick={() => navigate('/admin/schedule')} className="flex items-center justify-between p-6 bg-surface-dark border border-border-dark rounded-2xl transition-all group hover:border-primary/50">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><span className="material-symbols-outlined text-2xl">calendar_month</span></div>
                            <span className="text-lg font-bold text-white">Ver Agenda</span>
                        </div>
                        <span className="material-symbols-outlined text-white transition-transform group-hover:translate-x-1">arrow_forward</span>
                    </button>
                    <button onClick={() => navigate('/admin/history')} className="flex items-center justify-between p-6 bg-surface-dark border border-border-dark rounded-2xl transition-all group hover:border-primary/50">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center"><span className="material-symbols-outlined text-2xl">history</span></div>
                            <span className="text-lg font-bold text-white">Histórico</span>
                        </div>
                        <span className="material-symbols-outlined text-white transition-transform group-hover:translate-x-1">arrow_forward</span>
                    </button>
                </div>
            </div>
        );
    }

    // --- Visão do Gerente/Admin: cards de navegação com contagens reais ---
    const a = adminResumo ?? { candidaturasPendentes: 0, clientesAtivos: 0, profissionais: 0 };
    const adminCards = [
        {
            title: 'Solicitações',
            count: `${a.candidaturasPendentes} Pendentes`,
            description: 'Gerencie novas candidaturas de tatuadores.',
            icon: 'person_add', path: '/admin/requests',
            color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'hover:border-blue-500/50',
        },
        {
            title: 'Clientes',
            count: `${a.clientesAtivos} Ativos`,
            description: 'Visualize, adicione ou remova clientes.',
            icon: 'groups', path: '/admin/clients',
            color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'hover:border-emerald-500/50',
        },
        {
            title: 'Tatuadores',
            count: `${a.profissionais} Membros`,
            description: 'Gerencie a equipe do estúdio.',
            icon: 'badge', path: '/admin/staff',
            color: 'text-primary', bg: 'bg-primary/10', border: 'hover:border-primary/50',
        },
    ];

    return (
        <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto w-full h-full flex flex-col justify-center">
            <div className="mb-12 text-center md:text-left">
                <h1 className="font-tattoo text-4xl md:text-6xl text-white mb-4">Gerenciamento</h1>
                <p className="text-text-muted font-display text-lg tracking-wide max-w-2xl">Acesse as ferramentas administrativas do Ink Studio.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {adminCards.map((card, idx) => (
                    <button key={idx} onClick={() => navigate(card.path)} className={`flex flex-col items-start p-8 bg-surface-dark border border-border-dark rounded-2xl transition-all group hover:-translate-y-2 hover:shadow-2xl ${card.border}`}>
                        <div className={`size-16 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}><span className="material-symbols-outlined text-4xl">{card.icon}</span></div>
                        <h2 className="text-3xl font-bold text-white mb-2">{card.title}</h2>
                        <span className={`text-sm font-bold uppercase tracking-wider mb-4 ${card.color}`}>{card.count}</span>
                        <p className="text-text-muted text-left mb-8 flex-1">{card.description}</p>
                        <div className="w-full flex items-center justify-between pt-6 border-t border-border-dark group-hover:border-white/10"><span className="text-sm font-bold text-white group-hover:underline decoration-primary underline-offset-4">Acessar</span><span className="material-symbols-outlined text-white transition-transform group-hover:translate-x-1">arrow_forward</span></div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
