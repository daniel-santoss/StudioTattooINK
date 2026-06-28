'use client';


import React, { useState, useEffect, useRef, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { cancelarAgendamento, remarcarAgendamento } from '@/features/booking/actions/gerenciarAgendamento';
import DateTimePicker from '@/features/booking/components/DateTimePicker';
import Avatar from '@/shared/components/Avatar';
function useNavigate() { const r = useRouter(); return (p: string | number) => typeof p === 'number' ? r.back() : r.push(p); }

interface ScheduleItem {
    id: string;
    time: string;
    endTime: string;
    dateISO: string;
    dateLabel: string;
    clientName: string;
    clientAvatar: string;
    artistName: string;
    service: string;
    status: 'confirmado' | 'pendente' | 'em-andamento' | 'cancelado' | 'rescheduling' | 'concluido';
    type: 'tattoo' | 'piercing' | 'orcamento';
}

const Schedule: React.FC<{ items: ScheduleItem[]; role: string }> = ({ items, role }) => {
    const navigate = useNavigate();
    const router = useRouter();
    const [filterArtist, setFilterArtist] = useState<string>('Todos');
    const [filterName, setFilterName] = useState('');
    const [filterDate, setFilterDate] = useState('');

    // Menu Dropdown State
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Cancelar / Remarcar
    const [isPending, startTransition] = useTransition();
    const [actionError, setActionError] = useState<string | null>(null);
    const [cancelar, setCancelar] = useState<ScheduleItem | null>(null);
    const [remarcar, setRemarcar] = useState<ScheduleItem | null>(null);
    const [motivo, setMotivo] = useState('');
    const [novaData, setNovaData] = useState('');

    const abrirCancelar = (item: ScheduleItem, e: React.MouseEvent) => {
        e.stopPropagation(); setActionError(null); setMotivo(''); setCancelar(item); setActiveMenuId(null);
    };
    const abrirRemarcar = (item: ScheduleItem, e: React.MouseEvent) => {
        e.stopPropagation(); setActionError(null); setNovaData(''); setRemarcar(item); setActiveMenuId(null);
    };
    const confirmarCancelar = () => {
        if (!cancelar) return;
        setActionError(null);
        startTransition(async () => {
            const res = await cancelarAgendamento(cancelar.id, motivo);
            if (res?.error) { setActionError(res.error); return; }
            setCancelar(null);
            router.refresh();
        });
    };
    const confirmarRemarcar = () => {
        if (!remarcar) return;
        setActionError(null);
        startTransition(async () => {
            const res = await remarcarAgendamento(remarcar.id, novaData);
            if (res?.error) { setActionError(res.error); return; }
            setRemarcar(null);
            router.refresh();
        });
    };

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
    const nomeBusca = filterName.trim().toLowerCase();
    const filteredSchedule = items
        .filter(item => {
            if (role !== 'admin') return true; // tatuador já vê só a própria agenda (filtrada no servidor)
            if (filterArtist === 'Todos') return true;
            return item.artistName === filterArtist;
        })
        .filter(item => nomeBusca === '' || item.clientName.toLowerCase().includes(nomeBusca))
        .filter(item => filterDate === '' || item.dateISO === filterDate)
        .filter(item => item.status !== 'concluido' && item.status !== 'cancelado')
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

            {/* Filtros por cliente e data */}
            <div className="mb-6 flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 sm:max-w-xs">
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-text-muted">search</span>
                    <input
                        type="text"
                        value={filterName}
                        onChange={(e) => setFilterName(e.target.value)}
                        placeholder="Buscar por cliente..."
                        className="w-full bg-surface-dark border border-border-dark rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-text-muted focus:border-primary transition-all"
                    />
                </div>
                <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="bg-surface-dark border border-border-dark rounded-lg py-2.5 px-4 text-white focus:border-primary transition-all [color-scheme:dark]"
                />
                {(filterName || filterDate) && (
                    <button
                        onClick={() => { setFilterName(''); setFilterDate(''); }}
                        className="px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wide border border-border-dark bg-surface-dark text-text-muted hover:text-white hover:border-white/30 transition-all flex items-center gap-1.5 whitespace-nowrap"
                    >
                        <span className="material-symbols-outlined text-sm">close</span>
                        Limpar
                    </button>
                )}
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
                            <div className="bg-surface-light/30 md:w-32 p-6 flex flex-col items-center border-b md:border-b-0 md:border-r border-border-dark rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
                                <span className="text-[11px] text-primary font-bold uppercase tracking-wider mb-1">{item.dateLabel}</span>
                                <span className="text-2xl font-display font-bold text-white">{item.time}</span>
                                <span className="text-xs text-text-muted font-bold uppercase tracking-wider mb-2">até {item.endTime}</span>
                                <div className={`size-8 rounded-full flex items-center justify-center ${item.type === 'tattoo' ? 'bg-purple-500/20 text-purple-500' :
                                    item.type === 'piercing' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-orange-500/20 text-orange-500'
                                    }`}>
                                    <span className="material-symbols-outlined text-sm">{getTypeIcon(item.type)}</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 p-6 flex flex-col gap-3">
                                {/* Nome do agendamento — no topo, alinhado com a data */}
                                <h3 className="text-xl font-bold text-white leading-tight group-hover:text-primary transition-colors truncate">{item.service}</h3>

                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 min-w-0">
                                        <Avatar src={item.clientAvatar || undefined} name={item.clientName} className="size-12 rounded-full border border-border-dark shrink-0" textClassName="text-lg" />
                                        <div className="min-w-0">
                                            <p className="text-sm text-text-light flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-[15px] text-text-muted">person</span>
                                                {item.clientName}
                                            </p>
                                            {role === 'admin' && (
                                                <div className="flex items-center gap-1 text-xs text-text-muted mt-0.5">
                                                    <span className="material-symbols-outlined text-[14px]">brush</span>
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

                                                    <button
                                                        onClick={(e) => abrirRemarcar(item, e)}
                                                        className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10 rounded-lg flex items-center gap-2 font-medium"
                                                    >
                                                        <span className="material-symbols-outlined text-blue-400 text-lg">edit_calendar</span>
                                                        Remarcar
                                                    </button>

                                                    <button
                                                        onClick={(e) => abrirCancelar(item, e)}
                                                        className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-2 font-medium"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">block</span>
                                                        Cancelar
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
                        </div>
                    ))
                )}
            </div>

            {/* Modal — Cancelar agendamento */}
            {cancelar && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in" onClick={() => !isPending && setCancelar(null)}>
                    <div className="bg-surface-dark border border-border-dark rounded-2xl w-full max-w-md shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-border-dark flex items-center gap-2 text-red-500">
                            <span className="material-symbols-outlined">block</span>
                            <h3 className="text-xl font-bold text-white">Cancelar agendamento</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <p className="text-text-muted text-sm">
                                Cancelando a sessão de <strong className="text-white">{cancelar.clientName}</strong> ({cancelar.service}). Esta ação registra o motivo no histórico.
                            </p>
                            <div>
                                <label className="text-[10px] text-text-muted uppercase font-bold block mb-2">Motivo do cancelamento</label>
                                <textarea
                                    autoFocus
                                    rows={3}
                                    value={motivo}
                                    onChange={(e) => setMotivo(e.target.value)}
                                    placeholder="Descreva o motivo..."
                                    className="w-full bg-background-dark border border-border-dark rounded-xl p-3 text-white text-sm placeholder-zinc-600 resize-none focus:border-primary outline-none"
                                />
                            </div>
                            {actionError && <p className="text-red-500 text-xs">{actionError}</p>}
                        </div>
                        <div className="p-6 border-t border-border-dark flex justify-end gap-3 bg-background-dark">
                            <button type="button" onClick={() => setCancelar(null)} disabled={isPending} className="px-4 py-2 text-text-muted hover:text-white font-bold text-sm disabled:opacity-50">Voltar</button>
                            <button
                                type="button"
                                onClick={confirmarCancelar}
                                disabled={!motivo.trim() || isPending}
                                className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg font-bold text-sm uppercase tracking-wide transition-colors disabled:opacity-50"
                            >
                                {isPending ? 'Cancelando...' : 'Confirmar cancelamento'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal — Remarcar agendamento */}
            {remarcar && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in" onClick={() => !isPending && setRemarcar(null)}>
                    <div className="bg-surface-dark border border-border-dark rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-border-dark flex justify-between items-center">
                            <div className="flex items-center gap-2 text-primary">
                                <span className="material-symbols-outlined">edit_calendar</span>
                                <h3 className="text-xl font-bold text-white">Remarcar sessão</h3>
                            </div>
                            <button type="button" onClick={() => setRemarcar(null)} className="text-text-muted hover:text-white"><span className="material-symbols-outlined">close</span></button>
                        </div>
                        <div className="p-6 overflow-y-auto space-y-4">
                            <p className="text-text-muted text-sm">
                                Nova data para a sessão de <strong className="text-white">{remarcar.clientName}</strong> ({remarcar.service}). O cliente vai precisar confirmar a nova data.
                            </p>
                            <DateTimePicker onChange={setNovaData} />
                            {actionError && <p className="text-red-500 text-xs">{actionError}</p>}
                        </div>
                        <div className="p-6 border-t border-border-dark flex justify-end gap-3 bg-background-dark rounded-b-2xl">
                            <button type="button" onClick={() => setRemarcar(null)} disabled={isPending} className="px-4 py-2 text-text-muted hover:text-white font-bold text-sm disabled:opacity-50">Voltar</button>
                            <button
                                type="button"
                                onClick={confirmarRemarcar}
                                disabled={!novaData || isPending}
                                className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg font-bold text-sm uppercase tracking-wide transition-colors disabled:opacity-50"
                            >
                                {isPending ? 'Remarcando...' : 'Remarcar e reenviar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Schedule;
