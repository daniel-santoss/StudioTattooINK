'use client';


import React, { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { confirmarData, recusarData } from '@/features/booking/actions/confirmarAgendamento';
function useNavigate() { const r = useRouter(); return (p: string | number) => typeof p === 'number' ? r.back() : r.push(p); }

interface AppointmentDetail {
    id: string;
    artist: string;
    artistRole: string;
    artistAvatar: string;
    service: string;
    fullDate: string; // Para display extenso
    time: string;
    duration: string;
    status: 'upcoming' | 'completed' | 'cancelled' | 'pending' | 'rescheduling';
    aguardandoConfirmacao: boolean; // proposta do profissional pendente de confirmação do cliente
    price: string;
    paidAmount: string; // Valor já pago
    remainingAmount: string; // Valor restante
    paymentStatus: 'Pendente' | 'Pago' | 'Parcial';
    location: string;
    description: string;
    referenceImages: string[];
    cancellationReason?: string;
    recusaAnterior?: { motivos: string[]; obs: string } | null;
}

// Opções de recusa da proposta (espelham o enum MotivoRecusaData do banco)
const REJECT_OPTIONS: { id: 'DIA' | 'HORARIO' | 'VALOR'; label: string; icon: string }[] = [
    { id: 'DIA', label: 'Dia', icon: 'event' },
    { id: 'HORARIO', label: 'Horário', icon: 'schedule' },
    { id: 'VALOR', label: 'Valor', icon: 'payments' },
];

const getPeriodFromTime = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 6 && hour < 12) return { label: 'Manhã (06h-12h)', icon: 'wb_twilight' };
    if (hour >= 12 && hour < 18) return { label: 'Tarde (12h-18h)', icon: 'wb_sunny' };
    return { label: 'Noite (18h-00h)', icon: 'dark_mode' };
};

// Selo "Em breve" para ações ainda sem backend (mantidas visíveis a pedido).
const EmBreve = () => (
    <span className="ml-1 text-[9px] uppercase tracking-wider text-text-muted border border-border-dark rounded px-1.5 py-0.5">Em breve</span>
);

const ClientAppointmentDetails: React.FC<{ appointment: AppointmentDetail | null }> = ({ appointment: initialAppointment }) => {
    const navigate = useNavigate();
    const router = useRouter();
    const [appointment, setAppointment] = useState<AppointmentDetail | null>(initialAppointment);
    const [isPending, startTransition] = useTransition();
    const [actionError, setActionError] = useState<string | null>(null);

    // Modal States (apenas o fluxo real de recusa de proposta)
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

    // Form States
    const [showErrors, setShowErrors] = useState(false);
    const [rejectMotivos, setRejectMotivos] = useState<('DIA' | 'HORARIO' | 'VALOR')[]>([]);
    const [rejectObs, setRejectObs] = useState('');

    // Reflete dados novos vindos do servidor (após router.refresh()).
    useEffect(() => { setAppointment(initialAppointment); }, [initialAppointment]);

    // Cliente confirma a data/valor propostos pelo profissional.
    const handleConfirmar = () => {
        if (!appointment) return;
        setActionError(null);
        startTransition(async () => {
            const res = await confirmarData(appointment.id);
            if (res?.error) { setActionError(res.error); return; }
            router.refresh();
        });
    };

    // Cliente recusa a proposta (motivos + observação obrigatórios); status permanece aguardando.
    const handleRecusar = (e: React.FormEvent) => {
        e.preventDefault();
        if (!appointment) return;
        if (rejectMotivos.length === 0 || !rejectObs.trim()) { setShowErrors(true); return; }
        setActionError(null);
        startTransition(async () => {
            const res = await recusarData(appointment.id, rejectMotivos, rejectObs.trim());
            if (res?.error) { setActionError(res.error); return; }
            setIsRejectModalOpen(false);
            router.refresh();
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'upcoming': return <span className="bg-blue-500/20 text-blue-500 border border-blue-500/30 px-3 py-1 rounded text-xs font-bold uppercase tracking-wide">Agendado</span>;
            case 'completed': return <span className="bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 px-3 py-1 rounded text-xs font-bold uppercase tracking-wide">Concluído</span>;
            case 'cancelled': return <span className="bg-red-500/20 text-red-500 border border-red-500/30 px-3 py-1 rounded text-xs font-bold uppercase tracking-wide">Cancelado</span>;
            case 'pending': return <span className="bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 px-3 py-1 rounded text-xs font-bold uppercase tracking-wide">Aguardando</span>;
            case 'rescheduling': return <span className="bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 px-3 py-1 rounded text-xs font-bold uppercase tracking-wide">Reagendando</span>;
            default: return null;
        }
    };

    if (!appointment) return <div className="min-h-screen flex items-center justify-center text-text-muted">Agendamento não encontrado.</div>;

    const periodData = getPeriodFromTime(appointment.time);

    return (
        <div className="min-h-screen bg-background-dark p-6 md:p-12">
            <div className="max-w-5xl mx-auto">
                {/* Header Navigation */}
                <button
                    onClick={() => navigate('/my-appointments')}
                    className="flex items-center gap-2 text-text-muted hover:text-white mb-8 transition-colors text-sm font-bold uppercase tracking-wide"
                >
                    <span className="material-symbols-outlined">arrow_back</span>
                    Voltar para Meus Agendamentos
                </button>

                {/* Main Card */}
                <div className="bg-surface-dark border border-border-dark rounded-3xl overflow-hidden shadow-2xl relative">

                    {/* Status Strip */}
                    <div className={`h-2 w-full ${appointment.status === 'upcoming' ? 'bg-blue-500' :
                        appointment.status === 'completed' ? 'bg-emerald-500' :
                            appointment.status === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}></div>

                    <div className="p-8 md:p-10">
                        {/* Title & Status Header & Actions */}
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-10 border-b border-border-dark pb-8">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="font-tattoo text-3xl md:text-4xl text-white">{appointment.service}</h1>
                                    {getStatusBadge(appointment.status)}
                                </div>
                                <p className="text-text-muted text-sm">ID do Agendamento: #{appointment.id}</p>
                            </div>

                            {/* Actions Group — ações ainda sem backend ficam visíveis e desabilitadas ("Em breve") */}
                            <div className="flex flex-wrap gap-3 w-full md:w-auto">
                                {(appointment.status === 'upcoming' || appointment.status === 'pending') && !appointment.aguardandoConfirmacao && (
                                    <>
                                        <button
                                            disabled
                                            title="Em breve"
                                            className="flex-1 md:flex-none px-5 py-2.5 bg-surface-light border border-border-dark text-white/40 rounded-lg font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 cursor-not-allowed"
                                        >
                                            <span className="material-symbols-outlined text-sm">edit_calendar</span>
                                            Remarcar
                                            <EmBreve />
                                        </button>
                                        <button
                                            disabled
                                            title="Em breve"
                                            className="flex-1 md:flex-none px-5 py-2.5 border border-red-500/20 text-red-500/40 rounded-lg font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 cursor-not-allowed"
                                        >
                                            <span className="material-symbols-outlined text-sm">cancel</span>
                                            Cancelar
                                            <EmBreve />
                                        </button>
                                    </>
                                )}

                                {appointment.status === 'completed' && (
                                    <>
                                        <button
                                            disabled
                                            title="Em breve"
                                            className="flex-1 md:flex-none px-5 py-2.5 bg-amber-500/10 text-amber-500/40 border border-amber-500/20 rounded-lg font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 cursor-not-allowed"
                                        >
                                            <span className="material-symbols-outlined text-sm">star</span>
                                            Avaliar Serviço
                                            <EmBreve />
                                        </button>
                                        <button
                                            disabled
                                            title="Em breve"
                                            className="flex-1 md:flex-none px-5 py-2.5 border border-border-dark text-text-muted/40 rounded-lg font-bold text-xs uppercase tracking-wide flex items-center justify-center gap-2 cursor-not-allowed"
                                        >
                                            <span className="material-symbols-outlined text-sm">flag</span>
                                            Reportar
                                            <EmBreve />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            {/* Left Column: Info */}
                            <div className="lg:col-span-2 space-y-8">

                                {/* Artist Section */}
                                <div className="bg-surface-light/20 rounded-2xl p-6 border border-white/5 flex items-center gap-5">
                                    <img src={appointment.artistAvatar} alt={appointment.artist} className="size-16 rounded-xl object-cover border-2 border-surface-dark" />
                                    <div>
                                        <p className="text-text-muted text-xs font-bold uppercase tracking-widest mb-1">Profissional</p>
                                        <h3 className="text-xl font-bold text-white">{appointment.artist}</h3>
                                        <p className="text-sm text-primary font-medium">{appointment.artistRole}</p>
                                    </div>
                                    <div className="ml-auto">
                                        <button
                                            disabled
                                            title="Ver perfil — em breve"
                                            className="size-10 rounded-lg bg-surface-dark flex items-center justify-center text-text-muted/40 border border-border-dark cursor-not-allowed"
                                        >
                                            <span className="material-symbols-outlined">person</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Project Description */}
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">description</span>
                                        Sobre o Projeto
                                    </h3>
                                    <div className="bg-background-dark border border-border-dark rounded-xl p-6 text-sm text-text-light leading-relaxed">
                                        {appointment.description}
                                    </div>
                                </div>

                                {/* References */}
                                <div>
                                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-primary">image</span>
                                        Referências Enviadas
                                    </h3>
                                    <div className="flex gap-4 overflow-x-auto pb-2">
                                        {appointment.referenceImages.length > 0 ? (
                                            appointment.referenceImages.map((img, idx) => (
                                                <div key={idx} className="relative size-24 rounded-lg overflow-hidden border border-border-dark group shrink-0">
                                                    <img src={img} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Referência" />
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-text-muted text-sm">Nenhuma referência enviada.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Logistics */}
                            <div className="space-y-6">
                                {/* Proposta do profissional aguardando a confirmação do cliente */}
                                {appointment.aguardandoConfirmacao && (
                                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-3 opacity-10">
                                            <span className="material-symbols-outlined text-6xl text-yellow-500">event_available</span>
                                        </div>
                                        <h3 className="text-xs font-bold text-yellow-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm">info</span>
                                            Aguardando sua confirmação
                                        </h3>
                                        <div className="space-y-3 relative z-10">
                                            <p className="text-sm text-white">O profissional propôs a seguinte data e valor:</p>
                                            <div className="bg-background-dark/50 p-3 rounded-lg border border-yellow-500/10">
                                                <p className="text-white font-bold">{appointment.fullDate}</p>
                                                <p className="text-sm text-text-light mt-1">{appointment.time} • {appointment.price}</p>
                                            </div>
                                            {appointment.recusaAnterior && (
                                                <p className="text-xs text-text-light italic">
                                                    Você já recusou ({appointment.recusaAnterior.motivos.join(', ')}). Aguarde o profissional repropor ou confirme abaixo.
                                                </p>
                                            )}
                                            {actionError && <p className="text-red-500 text-xs">{actionError}</p>}
                                            <div className="flex gap-2 mt-2">
                                                <button
                                                    type="button"
                                                    disabled={isPending}
                                                    onClick={handleConfirmar}
                                                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-xs uppercase disabled:opacity-50"
                                                >
                                                    {isPending ? 'Confirmando...' : 'Confirmar'}
                                                </button>
                                                <button
                                                    type="button"
                                                    disabled={isPending}
                                                    onClick={() => { setShowErrors(false); setActionError(null); setRejectMotivos([]); setRejectObs(''); setIsRejectModalOpen(true); }}
                                                    className="flex-1 py-2 bg-red-600/20 text-red-500 hover:bg-red-600/30 rounded font-bold text-xs uppercase disabled:opacity-50"
                                                >
                                                    Recusar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Date & Time Card */}
                                <div className="bg-surface-light/10 border border-white/5 rounded-2xl p-6">
                                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-6">Agenda</h3>

                                    <div className="space-y-6">
                                        {/* Data Block */}
                                        <div>
                                            <span className="text-primary font-bold text-[10px] uppercase tracking-widest block mb-2">Data</span>
                                            <div className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-white">calendar_today</span>
                                                <div>
                                                    <p className="text-white font-bold text-lg leading-tight">{appointment.fullDate}</p>
                                                    <p className="text-[10px] text-text-muted font-bold uppercase tracking-wide mt-0.5">{appointment.duration} prevista</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Turno/Horário Block - Updated to Match Requested Style */}
                                        <div>
                                            <span className="text-primary font-bold text-[10px] uppercase tracking-widest block mb-2">Turno/Horário</span>
                                            <div className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-white">{periodData.icon}</span>
                                                <span className="text-white font-bold text-xl">{periodData.label}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Location */}
                                <div className="bg-surface-light/10 border border-white/5 rounded-2xl p-6">
                                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">Localização</h3>
                                    <div className="flex items-center gap-3">
                                        <span className="material-symbols-outlined text-primary">pin_drop</span>
                                        <p className="text-white font-medium">{appointment.location}</p>
                                    </div>
                                    <p className="text-xs text-text-muted mt-2 ml-9">Av. Paulista, 1230 - São Paulo, SP</p>
                                </div>

                                {/* Financial */}
                                <div className="bg-surface-light/10 border border-white/5 rounded-2xl p-6">
                                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4">Financeiro</h3>
                                    <div className="flex justify-between items-end mb-4">
                                        <span className="text-text-muted text-sm">Valor Total</span>
                                        <span className="text-2xl font-bold text-white font-display">{appointment.price}</span>
                                    </div>
                                    <div className="space-y-3 pt-4 border-t border-white/10">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-text-muted font-bold uppercase">Valor Pago</span>
                                            <span className="text-emerald-500 font-bold font-mono">
                                                {appointment.paidAmount}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-text-muted font-bold uppercase">Restante</span>
                                            <span className="text-white font-bold font-mono">
                                                {appointment.remainingAmount}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cancellation Notice if Cancelled */}
                    {appointment.status === 'cancelled' && appointment.cancellationReason && (
                        <div className="bg-red-500/10 border-t border-red-500/20 p-6 text-center">
                            <p className="text-red-400 font-bold text-sm uppercase tracking-wide mb-1">Agendamento Cancelado</p>
                            <p className="text-white text-sm">Motivo: {appointment.cancellationReason}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Reject Proposal Modal */}
            {isRejectModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-surface-dark border border-border-dark rounded-2xl w-full max-w-md shadow-2xl relative animate-fade-in">
                        <form onSubmit={handleRecusar}>
                            <div className="p-6 border-b border-border-dark flex justify-between items-center bg-red-500/5 rounded-t-2xl">
                                <div className="flex items-center gap-2 text-red-500">
                                    <span className="material-symbols-outlined">event_busy</span>
                                    <h3 className="text-xl font-bold">Recusar Proposta</h3>
                                </div>
                                <button type="button" onClick={() => setIsRejectModalOpen(false)} className="text-text-muted hover:text-white"><span className="material-symbols-outlined">close</span></button>
                            </div>
                            <div className="p-6">
                                <p className="text-text-muted text-sm mb-4">Diga o que não funcionou para o profissional propor outra opção.</p>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-text-muted uppercase mb-2 block">O que você quer ajustar? <span className="text-primary">*</span></label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {REJECT_OPTIONS.map((opt) => {
                                                const active = rejectMotivos.includes(opt.id);
                                                return (
                                                    <button
                                                        key={opt.id}
                                                        type="button"
                                                        onClick={() => setRejectMotivos((prev) => active ? prev.filter((m) => m !== opt.id) : [...prev, opt.id])}
                                                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all gap-1 ${active
                                                            ? 'bg-[#121212] border-primary text-white shadow-[0_0_20px_rgba(212,17,50,0.2)]'
                                                            : 'bg-[#121212] border-zinc-800 text-zinc-400 hover:border-primary hover:text-white'
                                                            }`}
                                                    >
                                                        <span className="material-symbols-outlined text-xl">{opt.icon}</span>
                                                        <span className="text-xs font-bold uppercase">{opt.label}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        {showErrors && rejectMotivos.length === 0 && (
                                            <p className="text-red-500 text-xs mt-1">Selecione ao menos um motivo</p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-text-muted uppercase mb-1 block">Detalhes <span className="text-primary">*</span></label>
                                        <textarea
                                            value={rejectObs}
                                            onChange={(e) => setRejectObs(e.target.value)}
                                            className={`w-full bg-background-dark border rounded-lg p-3 text-white text-sm focus:outline-none placeholder-zinc-700 ${showErrors && !rejectObs.trim()
                                                ? 'border-red-500 focus:border-red-500'
                                                : 'border-border-dark focus:border-red-500'
                                                }`}
                                            rows={3}
                                            placeholder="Ex: o valor ficou acima do meu orçamento..."
                                        ></textarea>
                                        {showErrors && !rejectObs.trim() && (
                                            <p className="text-red-500 text-xs mt-1">Campo obrigatório</p>
                                        )}
                                    </div>
                                    {actionError && <p className="text-red-500 text-xs">{actionError}</p>}
                                </div>
                            </div>
                            <div className="p-6 border-t border-border-dark flex justify-end gap-3 bg-background-dark rounded-b-2xl">
                                <button type="button" onClick={() => setIsRejectModalOpen(false)} className="px-4 py-2 text-text-muted hover:text-white font-bold text-sm">Voltar</button>
                                <button type="submit" disabled={isPending} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold text-sm uppercase tracking-wide transition-colors disabled:opacity-50">
                                    {isPending ? 'Enviando...' : 'Enviar Recusa'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientAppointmentDetails;
