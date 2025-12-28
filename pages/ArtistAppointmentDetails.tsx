
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RatingDisplay } from './Staff'; // Importando componente de estrelas existente

// Interface adaptada para a visão do Artista
interface ArtistAppointmentView {
    id: number;
    clientName: string;
    clientAvatar: string;
    clientType: 'Novo Cliente' | 'Recorrente' | 'VIP';
    clientPhone: string;
    clientRating: number;
    clientRatingCount: number;
    service: string;
    date: string;
    fullDate: string;
    time: string;
    duration: string;
    status: 'confirmado' | 'em-andamento' | 'concluido' | 'cancelado' | 'rescheduling' | 'noshow';
    price: string;
    deposit: string; // Sinal pago
    remaining: string; // Restante a pagar
    paymentStatus: 'Pendente' | 'Sinal Pago' | 'Total Pago';
    description: string;
    referenceImages: string[];
    medicalInfo: {
        allergies: string;
        conditions: string;
        skinType?: string;
    };
    internalNotes?: string; // Notas privadas do tatuador
}

// Mock Data Database
const artistAppointmentsDB: ArtistAppointmentView[] = [
    {
       id: 1,
       clientName: "Marcus Thorn",
       clientAvatar: "https://i.pravatar.cc/150?u=1",
       clientType: "Recorrente",
       clientPhone: "(11) 99999-1234",
       clientRating: 4.8,
       clientRatingCount: 12,
       service: "Fechamento de Braço - Sessão 2",
       date: "15 Nov, 2024",
       fullDate: "Sexta-feira, 15 de Novembro de 2024",
       time: "14:00",
       duration: "4 horas",
       status: "confirmado",
       price: "R$ 1.200,00",
       deposit: "R$ 400,00",
       remaining: "R$ 800,00",
       paymentStatus: "Sinal Pago",
       description: "Continuação do fechamento do braço esquerdo. Foco na parte interna do antebraço, sombreamento do leão e início do fundo geométrico.",
       referenceImages: [
           "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=300",
           "https://images.unsplash.com/photo-1562962230-16bc46364924?auto=format&fit=crop&q=80&w=300"
       ],
       medicalInfo: {
           allergies: "Nenhuma",
           conditions: "Nenhuma",
           skinType: "Normal, boa cicatrização"
       },
       internalNotes: "Cliente aguenta bem sessões longas. Gosta de conversar."
    },
    {
       id: 2,
       clientName: "Sarah Jones",
       clientAvatar: "https://i.pravatar.cc/150?u=5",
       clientType: "Novo Cliente",
       clientPhone: "(11) 98888-5555",
       clientRating: 5.0,
       clientRatingCount: 1,
       service: "Rosas Ombro",
       date: "15 Nov, 2024",
       fullDate: "Sexta-feira, 15 de Novembro de 2024",
       time: "11:00",
       duration: "2 horas",
       status: "concluido",
       price: "R$ 600,00",
       deposit: "R$ 200,00",
       remaining: "R$ 0,00",
       paymentStatus: "Total Pago",
       description: "Duas rosas no estilo Neo Tradicional no ombro direito.",
       referenceImages: [],
       medicalInfo: {
           allergies: "Látex (Usar luva Nitrílica)",
           conditions: "Pele sensível",
           skinType: "Clara"
       }
    }
];

// Helper Functions for Currency
const parseCurrency = (value: string): number => {
    // Remove R$, dots, replace comma with dot
    const cleanStr = value.replace(/[^\d,]/g, '').replace(',', '.');
    return parseFloat(cleanStr) || 0;
};

const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const ArtistAppointmentDetails: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [appointment, setAppointment] = useState<ArtistAppointmentView | null>(null);
    const [loading, setLoading] = useState(true);
    
    // Actions State
    const [notes, setNotes] = useState("");
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success'>('idle');
    const MAX_NOTES_LENGTH = 500;

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Finance Editing State
    const [isEditingFinance, setIsEditingFinance] = useState(false);
    const [financeData, setFinanceData] = useState({ total: '', deposit: '' });

    // Confirmation Modal State
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        type: 'danger' | 'primary' | 'neutral';
        onConfirm: () => void;
    }>({
        isOpen: false,
        title: '',
        message: '',
        type: 'neutral',
        onConfirm: () => {}
    });

    useEffect(() => {
        // Simulating fetch matching string ID from params to number ID in mock
        setTimeout(() => {
            const found = artistAppointmentsDB.find(apt => apt.id === Number(id));
            setAppointment(found || artistAppointmentsDB[0]); // Fallback to first item for demo if ID matches nothing
            if (found) setNotes(found.internalNotes || "");
            setLoading(false);
        }, 500);

        // Click outside to close menu
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [id]);

    const handleConfirmation = (action: 'reschedule' | 'noshow' | 'report' | 'start' | 'finish') => {
        setIsMenuOpen(false); // Fecha menu se estiver aberto

        switch(action) {
            case 'start':
                setConfirmModal({
                    isOpen: true,
                    title: 'Iniciar Sessão',
                    message: 'Confirma o início do atendimento? O cronômetro da sessão será iniciado.',
                    type: 'primary',
                    onConfirm: () => {
                        if (appointment) setAppointment({ ...appointment, status: 'em-andamento' });
                        setConfirmModal(prev => ({ ...prev, isOpen: false }));
                    }
                });
                break;
            case 'finish':
                setConfirmModal({
                    isOpen: true,
                    title: 'Finalizar Sessão',
                    message: 'Tem certeza que deseja finalizar? Isso liberará o checkout e cobrança.',
                    type: 'primary',
                    onConfirm: () => {
                        if (appointment) setAppointment({ ...appointment, status: 'concluido' });
                        setConfirmModal(prev => ({ ...prev, isOpen: false }));
                    }
                });
                break;
            case 'reschedule':
                setConfirmModal({
                    isOpen: true,
                    title: 'Solicitar Reagendamento',
                    message: 'Deseja solicitar uma nova data? Uma notificação será enviada ao cliente.',
                    type: 'neutral',
                    onConfirm: () => {
                        alert("Solicitação de reagendamento enviada.");
                        setConfirmModal(prev => ({ ...prev, isOpen: false }));
                    }
                });
                break;
            case 'noshow':
                setConfirmModal({
                    isOpen: true,
                    title: 'Registrar No-Show',
                    message: 'Confirmar que o cliente NÃO compareceu? Esta ação impacta negativamente o histórico do cliente.',
                    type: 'danger',
                    onConfirm: () => {
                        if (appointment) setAppointment({ ...appointment, status: 'noshow' });
                        setConfirmModal(prev => ({ ...prev, isOpen: false }));
                    }
                });
                break;
            case 'report':
                setConfirmModal({
                    isOpen: true,
                    title: 'Reportar Problema',
                    message: 'Deseja abrir uma ocorrência para este atendimento? A gerência será notificada.',
                    type: 'danger',
                    onConfirm: () => {
                        alert("Ocorrência registrada com sucesso.");
                        setConfirmModal(prev => ({ ...prev, isOpen: false }));
                    }
                });
                break;
        }
    };

    // Finance Handlers
    const handleEditFinanceClick = () => {
        if (!appointment) return;
        // Limpa o "R$" para o input, mantendo formatação numérica (Ex: 1.200,00)
        const cleanTotal = appointment.price.replace('R$', '').trim();
        const cleanDeposit = appointment.deposit.replace('R$', '').trim();
        
        setFinanceData({
            total: cleanTotal,
            deposit: cleanDeposit
        });
        setIsEditingFinance(true);
    };

    const handleDepositChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value;
        value = value.replace(/\D/g, ""); // Apenas números

        if (value === "") {
            setFinanceData({ ...financeData, deposit: "" });
            return;
        }

        const amount = parseFloat(value) / 100;
        const formatted = amount.toLocaleString("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        setFinanceData({ ...financeData, deposit: formatted });
    };

    const handleSaveFinance = () => {
        if (!appointment) return;
        
        const totalVal = parseCurrency(financeData.total);
        const depositVal = parseCurrency(financeData.deposit);
        const remainingVal = totalVal - depositVal;
        
        // Determine payment status based on math
        let newStatus: 'Pendente' | 'Sinal Pago' | 'Total Pago' = 'Pendente';
        if (remainingVal <= 0) newStatus = 'Total Pago';
        else if (depositVal > 0) newStatus = 'Sinal Pago';

        setAppointment({
            ...appointment,
            price: formatCurrency(totalVal),
            deposit: formatCurrency(depositVal),
            remaining: formatCurrency(Math.max(0, remainingVal)),
            paymentStatus: newStatus
        });
        setIsEditingFinance(false);
    };

    // Notes Handlers
    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNotes(e.target.value);
        if (saveStatus === 'success') setSaveStatus('idle');
    };

    const handleSaveNotes = () => {
        setSaveStatus('saving');
        // Simulate API Request
        setTimeout(() => {
            setSaveStatus('success');
            // Reset status after a few seconds
            setTimeout(() => setSaveStatus('idle'), 3000);
        }, 800);
    };

    // Calcular restante em tempo real para display
    const currentRemaining = isEditingFinance 
        ? formatCurrency(Math.max(0, parseCurrency(financeData.total) - parseCurrency(financeData.deposit)))
        : "R$ 0,00";

    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'confirmado': return <span className="bg-blue-500/20 text-blue-500 border border-blue-500/30 px-3 py-1 rounded text-xs font-bold uppercase tracking-wide">Confirmado</span>;
            case 'concluido': return <span className="bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 px-3 py-1 rounded text-xs font-bold uppercase tracking-wide">Finalizado</span>;
            case 'em-andamento': return <span className="bg-purple-500/20 text-purple-500 border border-purple-500/30 px-3 py-1 rounded text-xs font-bold uppercase tracking-wide animate-pulse">Em Andamento</span>;
            case 'cancelado': return <span className="bg-red-500/20 text-red-500 border border-red-500/30 px-3 py-1 rounded text-xs font-bold uppercase tracking-wide">Cancelado</span>;
            case 'noshow': return <span className="bg-red-500/20 text-red-500 border border-red-500/30 px-3 py-1 rounded text-xs font-bold uppercase tracking-wide">Não Compareceu</span>;
            default: return null;
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-text-muted">Carregando dados da sessão...</div>;
    if (!appointment) return <div className="min-h-screen flex items-center justify-center text-text-muted">Agendamento não encontrado.</div>;

    return (
        <div className="min-h-screen bg-background-dark p-6 md:p-12">
            <div className="max-w-6xl mx-auto">
                {/* Header Navigation */}
                <button 
                    onClick={() => navigate('/admin/schedule')} 
                    className="flex items-center gap-2 text-text-muted hover:text-white mb-8 transition-colors text-sm font-bold uppercase tracking-wide"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                    Voltar para Agenda
                </button>

                {/* Main Card */}
                <div className="bg-surface-dark border border-border-dark rounded-3xl overflow-hidden shadow-2xl relative">
                    
                    {/* Status Strip */}
                    <div className={`h-2 w-full ${
                        appointment.status === 'em-andamento' ? 'bg-purple-500 animate-pulse' : 
                        appointment.status === 'concluido' ? 'bg-emerald-500' :
                        appointment.status === 'cancelado' || appointment.status === 'noshow' ? 'bg-red-500' : 'bg-blue-500'
                    }`}></div>

                    <div className="p-8 md:p-10">
                        {/* Title & Status Header */}
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-10 border-b border-border-dark pb-8">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="font-tattoo text-3xl md:text-4xl text-white">{appointment.service}</h1>
                                    {getStatusBadge(appointment.status)}
                                </div>
                                <p className="text-text-muted text-sm flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">tag</span>
                                    ID Sessão: #{appointment.id}882024
                                </p>
                            </div>
                            
                            {/* Operational Actions */}
                            <div className="flex flex-wrap items-center gap-3">
                                {appointment.status === 'confirmado' && (
                                    <>
                                        <button 
                                            onClick={() => handleConfirmation('start')}
                                            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-sm uppercase tracking-wide shadow-lg shadow-emerald-900/20 flex items-center gap-2 transition-all"
                                        >
                                            <span className="material-symbols-outlined">play_arrow</span>
                                            Iniciar Sessão
                                        </button>
                                        
                                        {/* Botão de Menu com 3 pontos */}
                                        <div className="relative" ref={menuRef}>
                                            <button 
                                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                                className={`size-11 flex items-center justify-center rounded-xl border border-border-dark hover:bg-white/10 text-text-muted hover:text-white transition-all ${isMenuOpen ? 'bg-white/10 text-white' : ''}`}
                                            >
                                                <span className="material-symbols-outlined">more_vert</span>
                                            </button>

                                            {/* Dropdown Menu */}
                                            {isMenuOpen && (
                                                <div className="absolute right-0 top-full mt-2 w-56 bg-surface-light border border-border-dark rounded-xl shadow-2xl z-50 overflow-hidden animate-fade-in">
                                                    <div className="p-1.5 flex flex-col gap-0.5">
                                                        <button 
                                                            onClick={() => handleConfirmation('reschedule')}
                                                            className="w-full text-left px-3 py-2.5 text-sm text-white hover:bg-white/10 rounded-lg flex items-center gap-3 font-medium transition-colors"
                                                        >
                                                            <span className="material-symbols-outlined text-blue-400">edit_calendar</span>
                                                            Remarcar
                                                        </button>
                                                        <button 
                                                            onClick={() => handleConfirmation('noshow')}
                                                            className="w-full text-left px-3 py-2.5 text-sm text-white hover:bg-white/10 rounded-lg flex items-center gap-3 font-medium transition-colors"
                                                        >
                                                            <span className="material-symbols-outlined text-amber-500">person_off</span>
                                                            No-Show
                                                        </button>
                                                        <div className="h-px bg-white/10 my-1"></div>
                                                        <button 
                                                            onClick={() => handleConfirmation('report')}
                                                            className="w-full text-left px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-3 font-medium transition-colors"
                                                        >
                                                            <span className="material-symbols-outlined">report_problem</span>
                                                            Reportar Problema
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                                
                                {appointment.status === 'em-andamento' && (
                                    <button 
                                        onClick={() => handleConfirmation('finish')}
                                        className="px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-sm uppercase tracking-wide shadow-lg shadow-primary/20 flex items-center gap-2 transition-all"
                                    >
                                        <span className="material-symbols-outlined">check_circle</span>
                                        Finalizar Sessão
                                    </button>
                                )}

                                {appointment.status === 'concluido' && (
                                    <button className="px-6 py-3 border border-emerald-500/30 text-emerald-500 bg-emerald-500/10 rounded-xl font-bold text-sm uppercase tracking-wide cursor-default flex items-center gap-2">
                                        <span className="material-symbols-outlined">verified</span>
                                        Concluído
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            {/* Left Column: Client & Project Info */}
                            <div className="lg:col-span-2 space-y-8">
                                
                                {/* Client Card */}
                                <div className="bg-surface-light/20 rounded-2xl p-6 border border-white/5 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden">
                                    {/* Client Label */}
                                    <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-[10px] font-bold uppercase tracking-widest ${
                                        appointment.clientType === 'VIP' ? 'bg-amber-500 text-black' : 
                                        appointment.clientType === 'Novo Cliente' ? 'bg-blue-500 text-white' : 'bg-surface-light text-text-muted'
                                    }`}>
                                        {appointment.clientType}
                                    </div>

                                    <img src={appointment.clientAvatar} alt={appointment.clientName} className="size-24 rounded-2xl object-cover border-2 border-surface-dark shadow-lg" />
                                    <div className="flex-1 text-center sm:text-left">
                                        <h3 className="text-2xl font-bold text-white mb-2">{appointment.clientName}</h3>
                                        <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-text-muted mb-4">
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">phone</span>
                                                {appointment.clientPhone}
                                            </span>
                                            {/* Rating do Cliente substituindo o Instagram */}
                                            <div className="flex items-center gap-2 bg-surface-dark px-2.5 py-1 rounded-lg border border-white/5 shadow-sm">
                                                <RatingDisplay rating={appointment.clientRating} count={undefined} size="14px" showText={true} activeColor="text-amber-500" />
                                                <span className="text-[10px] font-bold text-text-muted border-l border-white/10 pl-2">
                                                    {appointment.clientRatingCount} sessões
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex justify-center sm:justify-start gap-3">
                                            <button className="px-4 py-2 bg-surface-dark border border-border-dark hover:border-primary/50 text-white rounded-lg text-xs font-bold uppercase tracking-wide transition-colors">
                                                Ver Perfil
                                            </button>
                                            <button className="px-4 py-2 bg-emerald-600/10 border border-emerald-600/30 text-emerald-500 rounded-lg text-xs font-bold uppercase tracking-wide transition-colors flex items-center gap-1">
                                                <span className="material-symbols-outlined text-sm">chat</span>
                                                WhatsApp
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Medical Alert (Critical for Artists) */}
                                <div className={`rounded-2xl p-6 border ${
                                    appointment.medicalInfo.allergies !== "Nenhuma" 
                                    ? 'bg-red-500/10 border-red-500/30' 
                                    : 'bg-surface-light/10 border-white/5'
                                }`}>
                                    <h3 className={`text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2 ${
                                        appointment.medicalInfo.allergies !== "Nenhuma" ? 'text-red-500' : 'text-text-muted'
                                    }`}>
                                        <span className="material-symbols-outlined">medical_information</span>
                                        Ficha Médica
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-[10px] text-text-muted uppercase font-bold block mb-1">Alergias</label>
                                            <p className={`font-medium ${appointment.medicalInfo.allergies !== "Nenhuma" ? 'text-red-400' : 'text-white'}`}>
                                                {appointment.medicalInfo.allergies}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-text-muted uppercase font-bold block mb-1">Condições / Pele</label>
                                            <p className="text-white font-medium">
                                                {appointment.medicalInfo.conditions} • {appointment.medicalInfo.skinType}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Project Description */}
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">ink_pen</span>
                                        Detalhes do Projeto
                                    </h3>
                                    <div className="bg-background-dark border border-border-dark rounded-xl p-6 text-sm text-text-light leading-relaxed mb-6">
                                        {appointment.description}
                                    </div>

                                    {/* References */}
                                    {appointment.referenceImages.length > 0 && (
                                        <div>
                                            <label className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3 block">Referências</label>
                                            <div className="flex gap-4 overflow-x-auto pb-2">
                                                {appointment.referenceImages.map((img, idx) => (
                                                    <div key={idx} className="relative size-32 rounded-xl overflow-hidden border border-border-dark group shrink-0 cursor-pointer hover:border-primary transition-colors">
                                                        <img src={img} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Referência" />
                                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                            <span className="material-symbols-outlined text-white">zoom_in</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right Column: Logistics & Finance */}
                            <div className="space-y-6">
                                {/* Date & Time Card */}
                                <div className="bg-surface-light/10 border border-white/5 rounded-2xl p-6">
                                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">Agenda</h3>
                                    
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="bg-surface-dark p-3 rounded-lg border border-border-dark text-white">
                                            <span className="material-symbols-outlined">calendar_month</span>
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-lg leading-tight">{appointment.fullDate}</p>
                                            <p className="text-sm text-text-muted mt-1">{appointment.duration} estimada</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="bg-surface-dark p-3 rounded-lg border border-border-dark text-white">
                                            <span className="material-symbols-outlined">schedule</span>
                                        </div>
                                        <div>
                                            <p className="text-white font-bold text-3xl font-display">{appointment.time}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Financial */}
                                <div className="bg-surface-light/10 border border-white/5 rounded-2xl p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest">Financeiro</h3>
                                        {!isEditingFinance && (
                                            <button onClick={handleEditFinanceClick} className="text-text-muted hover:text-white transition-colors" title="Editar Valores">
                                                <span className="material-symbols-outlined text-sm">edit</span>
                                            </button>
                                        )}
                                    </div>
                                    
                                    {isEditingFinance ? (
                                        <div className="space-y-4 mb-6 animate-fade-in">
                                            <div>
                                                <label className="text-xs text-text-muted uppercase font-bold block mb-1">Valor Total (Fixo)</label>
                                                <input 
                                                    type="text"
                                                    value={financeData.total}
                                                    disabled
                                                    className="w-full bg-surface-dark border border-border-dark rounded-lg p-2 text-text-muted font-bold cursor-not-allowed opacity-70"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-text-muted uppercase font-bold block mb-1">Sinal Pago</label>
                                                <input 
                                                    type="text"
                                                    inputMode="numeric"
                                                    value={financeData.deposit}
                                                    onChange={handleDepositChange}
                                                    className="w-full bg-background-dark border border-border-dark rounded-lg p-2 text-white font-bold focus:border-primary focus:ring-1 focus:ring-primary"
                                                    placeholder="0,00"
                                                />
                                            </div>
                                            <div className="pt-2 flex justify-between items-center text-sm font-bold border-t border-white/10">
                                                <span className="text-text-muted">Novo Restante:</span>
                                                <span className="text-white">{currentRemaining}</span>
                                            </div>
                                            <div className="flex gap-2 pt-2">
                                                <button onClick={() => setIsEditingFinance(false)} className="flex-1 py-2 rounded-lg border border-border-dark text-text-muted hover:text-white text-xs font-bold uppercase">Cancelar</button>
                                                <button onClick={handleSaveFinance} className="flex-1 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold uppercase">Salvar</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3 mb-6">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-text-muted">Valor Total</span>
                                                <span className="text-white font-bold">{appointment.price}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-text-muted">Sinal Pago</span>
                                                <span className="text-emerald-500 font-bold">- {appointment.deposit}</span>
                                            </div>
                                            <div className="h-px bg-white/10 my-2"></div>
                                            <div className="flex justify-between items-end">
                                                <span className="text-white font-bold uppercase text-xs tracking-wider">Restante</span>
                                                <span className="text-3xl font-bold text-white font-display">{appointment.remaining}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Internal Notes */}
                                <div className="bg-surface-light/10 border border-white/5 rounded-2xl p-6">
                                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4 flex items-center justify-between">
                                        Notas Internas
                                        <span className="material-symbols-outlined text-xs">lock</span>
                                    </h3>
                                    <textarea 
                                        className="w-full bg-background-dark border border-border-dark rounded-xl p-3 text-white text-sm focus:border-primary placeholder-zinc-700 resize-none transition-all"
                                        rows={4}
                                        maxLength={MAX_NOTES_LENGTH}
                                        placeholder="Adicione observações sobre a pele, agulhas usadas, cores, etc..."
                                        value={notes}
                                        onChange={handleNotesChange}
                                    />
                                    <div className="flex justify-between items-center mt-2 mb-3">
                                        <span className={`text-[10px] font-bold ${notes.length >= MAX_NOTES_LENGTH ? 'text-red-500' : 'text-text-muted'}`}>
                                            {notes.length}/{MAX_NOTES_LENGTH} {notes.length >= MAX_NOTES_LENGTH && "(Limite atingido)"}
                                        </span>
                                        {saveStatus === 'success' && (
                                            <span className="text-emerald-500 text-[10px] font-bold uppercase tracking-wide animate-fade-in flex items-center gap-1">
                                                <span className="material-symbols-outlined text-xs">check_circle</span>
                                                Notas salvas com sucesso
                                            </span>
                                        )}
                                    </div>
                                    <button 
                                        onClick={handleSaveNotes}
                                        disabled={saveStatus === 'saving'}
                                        className="w-full py-2 bg-surface-dark hover:bg-white/5 border border-border-dark text-text-muted hover:text-white rounded-lg text-xs font-bold uppercase tracking-wide transition-all disabled:opacity-50"
                                    >
                                        {saveStatus === 'saving' ? 'Salvando...' : 'Salvar Notas'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {confirmModal.isOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-surface-dark border border-border-dark rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden">
                        <div className="p-6 text-center">
                            <div className={`size-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
                                confirmModal.type === 'danger' ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'
                            }`}>
                                <span className="material-symbols-outlined text-3xl">
                                    {confirmModal.type === 'danger' ? 'warning' : 'info'}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{confirmModal.title}</h3>
                            <p className="text-text-muted text-sm leading-relaxed">{confirmModal.message}</p>
                        </div>
                        <div className="flex border-t border-border-dark">
                            <button 
                                onClick={() => setConfirmModal(prev => ({...prev, isOpen: false}))}
                                className="flex-1 py-4 text-sm font-bold text-text-muted hover:text-white hover:bg-white/5 transition-colors"
                            >
                                Cancelar
                            </button>
                            <div className="w-px bg-border-dark"></div>
                            <button 
                                onClick={confirmModal.onConfirm}
                                className={`flex-1 py-4 text-sm font-bold uppercase tracking-wide hover:bg-white/5 transition-colors ${
                                    confirmModal.type === 'danger' ? 'text-red-500' : 'text-primary'
                                }`}
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ArtistAppointmentDetails;
