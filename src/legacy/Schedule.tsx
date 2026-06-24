'use client';


import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
function useNavigate() { const r = useRouter(); return (p: string | number) => typeof p === 'number' ? r.back() : r.push(p); }

interface ScheduleItem {
    id: string;
    time: string;
    endTime: string;
    clientName: string;
    clientAvatar: string;
    artistName: string;
    service: string;
    status: 'confirmado' | 'pendente' | 'em-andamento' | 'cancelado' | 'rescheduling' | 'concluido';
    type: 'tattoo' | 'piercing' | 'orcamento';
}

const Schedule: React.FC<{ items: ScheduleItem[]; role: string }> = ({ items, role }) => {
    const navigate = useNavigate();
    const [filterArtist, setFilterArtist] = useState<string>('Todos');

    // Menu Dropdown State
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Close menu when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setActiveMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // --- Handlers ---

    const handleCardClick = (id: string) => {
        navigate(`/admin/appointment/${id}`);
    };

    const toggleMenu = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveMenuId(activeMenuId === id ? null : id);
    };

    // Lista de artistas para o filtro do admin (derivada dos dados reais).
    const artistNames = Array.from(new Set(items.map((i) => i.artistName))).sort();

    // Filter Logic
    const filteredSchedule = items
        .filter(item => {
            if (role !== 'admin') return true; // tatuador já vê só a própria agenda (filtrada no servidor)
            if (filterArtist === 'Todos') return true;
            return item.artistName === filterArtist;
        })
        .filter(item => item.status !== 'concluido')
        .sort((a, b) => a.time.localeCompare(b.time));

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'confirmado': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'em-andamento': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 animate-pulse';
            case 'concluido': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'pendente': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'rescheduling': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
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
                    <h1 className="font-tattoo text-4xl text-white mb-2">Agenda</h1>
                    <p className="text-text-muted text-sm">Sessões agendadas e pendentes de confirmação.</p>
                </div>
            </div>

            {/* Admin Filters */}
            {role === 'admin' && artistNames.length > 0 && (
                <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
                    {['Todos', ...artistNames].map(artist => (
                        <button
                            key={artist}
                            onClick={() => setFilterArtist(artist)}
                            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide border transition-all whitespace-nowrap ${filterArtist === artist
                                ? 'bg-white text-black border-white'
                                : 'bg-surface-dark text-text-muted border-border-dark hover:border-white/30'
                                }`}
                        >
                            {artist}
                        </button>
                    ))}
                </div>
            )}

            {/* Agenda List */}
            <div className="space-y-4">
                {filteredSchedule.length === 0 ? (
                    <div className="text-center py-20 bg-surface-dark border border-border-dark rounded-2xl">
                        <div className="size-16 bg-surface-light rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-text-muted text-3xl">event_busy</span>
                        </div>
                        <h3 className="text-white font-bold text-lg">Agenda Livre</h3>
                        <p className="text-text-muted text-sm">Nenhum agendamento pendente para este filtro.</p>
                    </div>
                ) : (
                    filteredSchedule.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => handleCardClick(item.id)}
                            className="group flex flex-col md:flex-row bg-surface-dark border border-border-dark hover:border-primary/50 rounded-2xl overflow-visible transition-all shadow-lg hover:shadow-xl relative cursor-pointer"
                        >

                            {/* Time Column */}
                            <div className="bg-surface-light/30 md:w-32 p-6 flex flex-col justify-center items-center border-b md:border-b-0 md:border-r border-border-dark rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
                                <span className="text-2xl font-display font-bold text-white">{item.time}</span>
                                <span className="text-xs text-text-muted font-bold uppercase tracking-wider mb-2">até {item.endTime}</span>
                                <div className={`size-8 rounded-full flex items-center justify-center ${item.type === 'tattoo' ? 'bg-purple-500/20 text-purple-500' :
                                    item.type === 'piercing' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-orange-500/20 text-orange-500'
                                    }`}>
                                    <span className="material-symbols-outlined text-sm">{getTypeIcon(item.type)}</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <img src={item.clientAvatar} alt={item.clientName} className="size-12 rounded-full border border-border-dark object-cover" />
                                    <div>
                                        <h3 className="text-lg font-bold text-white leading-tight group-hover:text-primary transition-colors">{item.clientName}</h3>
                                        <p className="text-sm text-text-light mb-1">{item.service}</p>
                                        {role === 'admin' && (
                                            <div className="flex items-center gap-1 text-xs text-text-muted">
                                                <span className="material-symbols-outlined text-[14px]">person</span>
                                                {item.artistName}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Status & Menu Actions */}
                                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end mt-2 md:mt-0 relative">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border whitespace-nowrap ${getStatusStyle(item.status)}`}>
                                        {item.status === 'rescheduling' ? 'Reagendando' : item.status.replace('-', ' ')}
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
                                                        className="w-full text-left px-3 py-2 text-sm text-white/40 rounded-lg flex items-center gap-2 font-medium cursor-not-allowed"
                                                    >
                                                        <span className="material-symbols-outlined text-blue-400/40 text-lg">edit_calendar</span>
                                                        Remarcar
                                                        <span className="ml-auto text-[9px] uppercase tracking-wider text-text-muted border border-border-dark rounded px-1.5 py-0.5">Em breve</span>
                                                    </button>

                                                    <button
                                                        disabled
                                                        title="Em breve"
                                                        className="w-full text-left px-3 py-2 text-sm text-red-400/40 rounded-lg flex items-center gap-2 font-medium cursor-not-allowed"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">block</span>
                                                        Cancelar
                                                        <span className="ml-auto text-[9px] uppercase tracking-wider text-text-muted border border-border-dark rounded px-1.5 py-0.5">Em breve</span>
                                                    </button>

                                                    <div className="h-px bg-white/10 my-1"></div>

                                                    <button
                                                        disabled
                                                        title="Em breve"
                                                        className="w-full text-left px-3 py-2 text-sm text-text-muted/50 rounded-lg flex items-center gap-2 font-medium cursor-not-allowed"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">flag</span>
                                                        Reportar Cliente
                                                        <span className="ml-auto text-[9px] uppercase tracking-wider text-text-muted border border-border-dark rounded px-1.5 py-0.5">Em breve</span>
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

export default Schedule;
