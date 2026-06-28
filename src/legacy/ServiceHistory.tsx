'use client';


import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Avatar from '@/shared/components/Avatar';
function useNavigate() { const r = useRouter(); return (p: string | number) => typeof p === 'number' ? r.back() : r.push(p); }

interface HistoryItem {
    id: string;
    day: string; // "28"
    month: string; // "DEZ"
    year: string; // "2025"
    time: string; // "09:00"
    clientName: string;
    clientAvatar: string;
    service: string;
    status: 'concluido' | 'cancelado' | 'retoque';
    type: 'tattoo' | 'piercing' | 'orcamento';
    proximaSessaoPendente: boolean;
}

// Selo "Em breve" para ações ainda sem backend (mantidas visíveis a pedido).
const EmBreve = () => (
    <span className="ml-auto text-[9px] uppercase tracking-wider text-text-muted border border-border-dark rounded px-1.5 py-0.5">Em breve</span>
);

const ServiceHistory: React.FC<{ items: HistoryItem[] }> = ({ items }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    // Menu State
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setActiveMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleMenu = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveMenuId(activeMenuId === id ? null : id);
    };

    const handleCardClick = (id: string) => {
        navigate(`/admin/appointment/${id}`);
    };

    const filteredHistory = items.filter(item =>
        item.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.service.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'concluido': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'retoque': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
            case 'cancelado': return 'bg-red-500/10 text-red-500 border-red-500/20 opacity-60';
            default: return 'bg-surface-light text-text-muted';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'tattoo': return 'ink_pen';
            case 'piercing': return 'ring_volume';
            case 'orcamento': return 'attach_money';
            default: return 'event';
        }
    };

    return (
        <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto w-full min-h-[calc(100vh-5rem)]" onClick={() => setActiveMenuId(null)}>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="font-tattoo text-4xl text-white mb-2">Histórico de Atendimentos</h1>
                    <p className="text-text-muted text-sm">Visualize os trabalhos realizados.</p>
                </div>

                <div className="relative flex-1 md:max-w-xs">
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-text-muted">search</span>
                    <input
                        type="text"
                        placeholder="Buscar por cliente ou serviço..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-surface-dark border border-border-dark rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-text-muted focus:border-primary transition-all"
                    />
                </div>
            </div>

            {/* History List (Cards View) */}
            <div className="space-y-4">
                {filteredHistory.length === 0 ? (
                    <div className="text-center py-20 bg-surface-dark border border-border-dark rounded-2xl">
                        <div className="size-16 bg-surface-light rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-text-muted text-3xl">history_toggle_off</span>
                        </div>
                        <h3 className="text-white font-bold text-lg">Histórico Vazio</h3>
                        <p className="text-text-muted text-sm">Nenhum atendimento encontrado para este filtro.</p>
                    </div>
                ) : (
                    filteredHistory.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => handleCardClick(item.id)}
                            className="group flex flex-col md:flex-row bg-surface-dark border border-border-dark hover:border-primary/50 rounded-2xl overflow-visible transition-all shadow-lg hover:shadow-xl relative cursor-pointer"
                        >

                            {/* Date Column (Replaces Time Column from Schedule) */}
                            <div className="bg-surface-light/30 md:w-32 p-6 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-border-dark rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
                                <span className="text-3xl font-display font-bold text-white leading-none">{item.day}</span>
                                <span className="text-xs text-text-muted font-bold uppercase tracking-wider mb-2">{item.month}</span>
                                <span className="text-[10px] text-text-muted font-bold opacity-60 mb-2">{item.year}</span>
                                <div className={`size-8 rounded-full flex items-center justify-center ${item.type === 'tattoo' ? 'bg-purple-500/20 text-purple-500' :
                                    item.type === 'piercing' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-orange-500/20 text-orange-500'
                                    }`}>
                                    <span className="material-symbols-outlined text-sm">{getTypeIcon(item.type)}</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <Avatar src={item.clientAvatar || undefined} name={item.clientName} className="size-12 rounded-full border border-border-dark" textClassName="text-lg" />
                                    <div>
                                        <h3 className="text-lg font-bold text-white leading-tight group-hover:text-primary transition-colors">{item.clientName}</h3>
                                        <p className="text-sm text-text-light mb-1">{item.service}</p>
                                        <div className="flex items-center gap-1 text-xs text-text-muted">
                                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                                            Iniciado às {item.time}
                                        </div>
                                    </div>
                                </div>

                                {/* Status & Menu Actions */}
                                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end mt-2 md:mt-0 relative">
                                    {item.proximaSessaoPendente && (
                                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border whitespace-nowrap bg-yellow-500/10 text-yellow-500 border-yellow-500/30 flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-[14px]">hourglass_top</span>
                                            Aguardando próxima sessão
                                        </span>
                                    )}
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border whitespace-nowrap ${getStatusStyle(item.status)}`}>
                                        {item.status === 'retoque' ? 'Retoque' : item.status.replace('-', ' ')}
                                    </span>

                                    {/* Three Dots Button */}
                                    <div className="relative">
                                        <button
                                            onClick={(e) => toggleMenu(item.id, e)}
                                            className={`size-8 rounded flex items-center justify-center transition-colors ${activeMenuId === item.id ? 'bg-primary text-white' : 'bg-surface-light hover:bg-white/10 text-text-muted hover:text-white'}`}
                                        >
                                            <span className="material-symbols-outlined text-lg">more_vert</span>
                                        </button>

                                        {/* Dropdown Menu */}
                                        {activeMenuId === item.id && (
                                            <div
                                                ref={menuRef}
                                                className="absolute right-0 top-full mt-2 w-52 bg-surface-light border border-border-dark rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <div className="p-1.5 flex flex-col gap-0.5">
                                                    <button
                                                        onClick={() => handleCardClick(item.id)}
                                                        className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10 rounded-lg flex items-center gap-2 font-medium"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">visibility</span>
                                                        Ver Detalhes
                                                    </button>

                                                    {/* Ações ainda sem backend — visíveis, sinalizadas como "Em breve" */}
                                                    <button
                                                        disabled
                                                        title="Em breve"
                                                        className="w-full text-left px-3 py-2 text-sm text-amber-500/40 rounded-lg flex items-center gap-2 font-medium cursor-not-allowed"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">star</span>
                                                        Avaliar Cliente
                                                        <EmBreve />
                                                    </button>

                                                    <div className="h-px bg-white/10 my-1"></div>

                                                    <button
                                                        disabled
                                                        title="Em breve"
                                                        className="w-full text-left px-3 py-2 text-sm text-text-muted/50 rounded-lg flex items-center gap-2 font-medium cursor-not-allowed"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">flag</span>
                                                        Reportar
                                                        <EmBreve />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ServiceHistory;
