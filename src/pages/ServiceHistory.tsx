
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface HistoryItem {
    id: number;
    day: string; // "28"
    month: string; // "DEZ"
    year: string; // "2025"
    time: string; // "09:00"
    clientName: string;
    clientAvatar: string;
    service: string;
    status: 'concluido' | 'cancelado' | 'retoque';
    type: 'tattoo' | 'piercing' | 'orcamento';
}

const initialHistory: HistoryItem[] = [
    {
        id: 7,
        day: "28",
        month: "DEZ",
        year: "2025",
        time: "09:00",
        clientName: "Leticia Sabatella",
        clientAvatar: "https://i.pravatar.cc/150?u=30",
        service: "Piercing Umbigo",
        status: "concluido",
        type: "piercing"
    },
    {
        id: 1,
        day: "20",
        month: "OUT",
        year: "2024",
        time: "14:00",
        clientName: "Marcus Thorn",
        clientAvatar: "https://i.pravatar.cc/150?u=1",
        service: "Fechamento de Braço - Sessão 1",
        status: "concluido",
        type: "tattoo"
    },
    {
        id: 2,
        day: "18",
        month: "OUT",
        year: "2024",
        time: "10:00",
        clientName: "Lucas Vane",
        clientAvatar: "https://i.pravatar.cc/150?u=2",
        service: "Rosa Old School",
        status: "concluido",
        type: "tattoo"
    },
    {
        id: 3,
        day: "15",
        month: "OUT",
        year: "2024",
        time: "16:00",
        clientName: "Jessica Rabbit",
        clientAvatar: "https://i.pravatar.cc/150?u=3",
        service: "Micro Realismo Pet",
        status: "retoque",
        type: "tattoo"
    },
    {
        id: 99,
        day: "05",
        month: "OUT",
        year: "2024",
        time: "13:00",
        clientName: "John Doe",
        clientAvatar: "https://i.pravatar.cc/150?u=4",
        service: "Dragão Oriental",
        status: "cancelado",
        type: "tattoo"
    }
];

const ServiceHistory: React.FC = () => {
    const navigate = useNavigate();
    const [history] = useState<HistoryItem[]>(initialHistory);
    const [searchTerm, setSearchTerm] = useState('');

    // Menu State
    const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Modal States
    const [isRateModalOpen, setIsRateModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
    const [clientRating, setClientRating] = useState(0);
    const [ratingComment, setRatingComment] = useState("");

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setActiveMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleMenu = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setActiveMenuId(activeMenuId === id ? null : id);
    };

    const handleCardClick = (id: number) => {
        navigate(`/admin/appointment/${id}`);
    };

    const handleOpenRate = (item: HistoryItem) => {
        setSelectedItem(item);
        setClientRating(0);
        setRatingComment("");
        setIsRateModalOpen(true);
        setActiveMenuId(null);
    };

    const handleOpenReport = (item: HistoryItem) => {
        setSelectedItem(item);
        setIsReportModalOpen(true);
        setActiveMenuId(null);
    };

    const submitClientRating = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Avaliação enviada com sucesso para ${selectedItem?.clientName}!`);
        setIsRateModalOpen(false);
    };

    const submitReport = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Ocorrência registrada sobre o atendimento #${selectedItem?.id}`);
        setIsReportModalOpen(false);
    };

    const filteredHistory = history.filter(item =>
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
                    <p className="text-text-muted text-sm">Visualize os trabalhos realizados e avaliações.</p>
                </div>

                <div className="relative flex-1 md:max-w-xs">
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-text-muted">search</span>
                    <input
                        type="text"
                        placeholder="Buscar por cliente ou serviço..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-surface-dark border border-border-dark rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-text-muted focus:border-primary focus:ring-1 focus:ring-primary transition-all"
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
                                    <img src={item.clientAvatar} alt={item.clientName} className="size-12 rounded-full border border-border-dark object-cover" />
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

                                                    {(item.status === 'concluido' || item.status === 'retoque') && (
                                                        <button
                                                            onClick={() => handleOpenRate(item)}
                                                            className="w-full text-left px-3 py-2 text-sm text-amber-500 hover:bg-white/10 rounded-lg flex items-center gap-2 font-medium"
                                                        >
                                                            <span className="material-symbols-outlined text-lg">star</span>
                                                            Avaliar Cliente
                                                        </button>
                                                    )}

                                                    <div className="h-px bg-white/10 my-1"></div>

                                                    <button
                                                        onClick={() => handleOpenReport(item)}
                                                        className="w-full text-left px-3 py-2 text-sm text-text-muted hover:text-white hover:bg-white/10 rounded-lg flex items-center gap-2 font-medium"
                                                    >
                                                        <span className="material-symbols-outlined text-lg">flag</span>
                                                        Reportar
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

            {/* Rate Client Modal (Matches Client Side Style) */}
            {isRateModalOpen && selectedItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-surface-dark border border-border-dark rounded-2xl w-full max-w-md shadow-2xl relative animate-fade-in">
                        <form onSubmit={submitClientRating}>
                            <div className="p-6 border-b border-border-dark flex justify-between items-center">
                                <h3 className="text-xl font-bold text-white">Avaliar Atendimento</h3>
                                <button type="button" onClick={() => setIsRateModalOpen(false)} className="text-text-muted hover:text-white"><span className="material-symbols-outlined">close</span></button>
                            </div>
                            <div className="p-6 text-center">
                                <p className="text-text-muted text-sm mb-4">Como foi atender <span className="text-white font-bold">{selectedItem.clientName}</span>?</p>
                                <div className="flex justify-center gap-2 mb-6">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setClientRating(star)}
                                            className="group p-1 transition-transform hover:scale-110 focus:outline-none"
                                        >
                                            <span
                                                className={`material-symbols-outlined text-4xl transition-colors duration-200 ${star <= clientRating ? 'text-amber-500' : 'text-zinc-600'
                                                    }`}
                                                style={{
                                                    fontVariationSettings: `'FILL' ${star <= clientRating ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`
                                                }}
                                            >
                                                star
                                            </span>
                                        </button>
                                    ))}
                                </div>
                                <textarea
                                    value={ratingComment}
                                    onChange={(e) => setRatingComment(e.target.value)}
                                    className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-zinc-600 resize-none transition-all"
                                    rows={3}
                                    placeholder="Deixe um comentário (opcional)..."
                                ></textarea>
                            </div>
                            <div className="p-6 border-t border-border-dark flex justify-end">
                                <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-lg font-bold text-sm uppercase tracking-wide transition-colors">
                                    ENVIAR AVALIAÇÃO
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Report Incident */}
            {isReportModalOpen && selectedItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-surface-dark border border-border-dark rounded-2xl w-full max-w-md shadow-2xl relative animate-fade-in">
                        <form onSubmit={submitReport}>
                            <div className="p-6 border-b border-border-dark flex justify-between items-center bg-red-500/5">
                                <div className="flex items-center gap-2 text-red-500">
                                    <span className="material-symbols-outlined">report_problem</span>
                                    <h3 className="text-xl font-bold">Reportar Incidente</h3>
                                </div>
                                <button type="button" onClick={() => setIsReportModalOpen(false)} className="text-text-muted hover:text-white"><span className="material-symbols-outlined">close</span></button>
                            </div>
                            <div className="p-6">
                                <p className="text-text-muted text-sm mb-4">Registrar ocorrência com o cliente <span className="text-white font-bold">{selectedItem.clientName}</span>.</p>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-text-muted uppercase mb-1 block">Tipo de Incidente</label>
                                        <select className="w-full bg-background-dark border border-border-dark rounded-lg p-2.5 text-white text-sm focus:border-red-500">
                                            <option>Não comparecimento (No-show)</option>
                                            <option>Atraso excessivo</option>
                                            <option>Problemas no pagamento</option>
                                            <option>Comportamento inadequado</option>
                                            <option>Cuidados pós-tattoo negligenciados</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-text-muted uppercase mb-1 block">Observações</label>
                                        <textarea
                                            required
                                            className="w-full bg-background-dark border border-border-dark rounded-lg p-3 text-white text-sm focus:border-red-500 placeholder-zinc-700"
                                            rows={4}
                                            placeholder="Descreva o ocorrido para registro interno..."
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 border-t border-border-dark flex justify-end gap-3">
                                <button type="button" onClick={() => setIsReportModalOpen(false)} className="px-4 py-2 text-text-muted hover:text-white font-bold text-sm">Cancelar</button>
                                <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold text-sm uppercase tracking-wide transition-colors shadow-lg shadow-red-900/20">
                                    Registrar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServiceHistory;
