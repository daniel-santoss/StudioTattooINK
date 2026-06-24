'use client';


import React from 'react';
import { useRouter } from 'next/navigation';
function useNavigate() { const r = useRouter(); return (p: string | number) => typeof p === 'number' ? r.back() : r.push(p); }

// Interface adaptada para a visão do Artista (dados reais via prop)
interface ArtistAppointmentView {
    id: string;
    clientName: string;
    clientAvatar: string;
    clientType: 'Novo Cliente' | 'Recorrente' | 'VIP';
    clientPhone: string;
    clientSessions: number;
    service: string;
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
    internalNotes: string;
}

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

const ArtistAppointmentDetails: React.FC<{ appointment: ArtistAppointmentView | null }> = ({ appointment }) => {
    const navigate = useNavigate();

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmado': return <span className="bg-blue-500/20 text-blue-500 border border-blue-500/30 px-3 py-1 rounded text-xs font-bold uppercase tracking-wide">Confirmado</span>;
            case 'concluido': return <span className="bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 px-3 py-1 rounded text-xs font-bold uppercase tracking-wide">Finalizado</span>;
            case 'em-andamento': return <span className="bg-purple-500/20 text-purple-500 border border-purple-500/30 px-3 py-1 rounded text-xs font-bold uppercase tracking-wide animate-pulse">Em Andamento</span>;
            case 'cancelado': return <span className="bg-red-500/20 text-red-500 border border-red-500/30 px-3 py-1 rounded text-xs font-bold uppercase tracking-wide">Cancelado</span>;
            case 'noshow': return <span className="bg-red-500/20 text-red-500 border border-red-500/30 px-3 py-1 rounded text-xs font-bold uppercase tracking-wide">Não Compareceu</span>;
            case 'rescheduling': return <span className="bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 px-3 py-1 rounded text-xs font-bold uppercase tracking-wide">Reagendando</span>;
            default: return null;
        }
    };

    if (!appointment) return <div className="min-h-screen flex items-center justify-center text-text-muted">Agendamento não encontrado.</div>;

    const periodData = getPeriodFromTime(appointment.time);

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
                    <div className={`h-2 w-full ${appointment.status === 'em-andamento' ? 'bg-purple-500 animate-pulse' :
                        appointment.status === 'concluido' ? 'bg-emerald-500' :
                            appointment.status === 'cancelado' || appointment.status === 'noshow' ? 'bg-red-500' :
                                appointment.status === 'rescheduling' ? 'bg-yellow-500' : 'bg-blue-500'
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
                                    ID Sessão: #{appointment.id}
                                </p>
                            </div>

                            {/* Operational Actions — ainda sem backend, visíveis e desabilitadas ("Em breve") */}
                            <div className="flex flex-wrap items-center gap-3">
                                {appointment.status === 'confirmado' && (
                                    <button
                                        disabled
                                        title="Em breve"
                                        className="px-6 py-3 bg-emerald-600/40 text-white/60 rounded-xl font-bold text-sm uppercase tracking-wide flex items-center gap-2 cursor-not-allowed"
                                    >
                                        <span className="material-symbols-outlined">play_arrow</span>
                                        Iniciar Sessão
                                        <EmBreve />
                                    </button>
                                )}

                                {appointment.status === 'em-andamento' && (
                                    <button
                                        disabled
                                        title="Em breve"
                                        className="px-6 py-3 bg-primary/40 text-white/60 rounded-xl font-bold text-sm uppercase tracking-wide flex items-center gap-2 cursor-not-allowed"
                                    >
                                        <span className="material-symbols-outlined">check_circle</span>
                                        Finalizar Sessão
                                        <EmBreve />
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
                                    <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-[10px] font-bold uppercase tracking-widest ${appointment.clientType === 'VIP' ? 'bg-amber-500 text-black' :
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
                                            <span className="flex items-center gap-1 bg-surface-dark px-2.5 py-1 rounded-lg border border-white/5 shadow-sm text-[11px] font-bold">
                                                <span className="material-symbols-outlined text-sm">history</span>
                                                {appointment.clientSessions} sessões
                                            </span>
                                        </div>
                                        <div className="flex justify-center sm:justify-start gap-3">
                                            <button
                                                disabled
                                                title="Em breve"
                                                className="px-4 py-2 bg-surface-dark border border-border-dark text-white/40 rounded-lg text-xs font-bold uppercase tracking-wide cursor-not-allowed flex items-center gap-1"
                                            >
                                                Ver Perfil
                                                <EmBreve />
                                            </button>
                                            <button
                                                disabled
                                                title="Em breve"
                                                className="px-4 py-2 bg-emerald-600/10 border border-emerald-600/20 text-emerald-500/40 rounded-lg text-xs font-bold uppercase tracking-wide cursor-not-allowed flex items-center gap-1"
                                            >
                                                <span className="material-symbols-outlined text-sm">chat</span>
                                                WhatsApp
                                                <EmBreve />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Medical Alert (Critical for Artists) */}
                                <div className={`rounded-2xl p-6 border ${appointment.medicalInfo.allergies !== "Nenhuma"
                                    ? 'bg-red-500/10 border-red-500/30'
                                    : 'bg-surface-light/10 border-white/5'
                                    }`}>
                                    <h3 className={`text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2 ${appointment.medicalInfo.allergies !== "Nenhuma" ? 'text-red-500' : 'text-text-muted'
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
                                                {appointment.medicalInfo.conditions}{appointment.medicalInfo.skinType ? ` • ${appointment.medicalInfo.skinType}` : ''}
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
                                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-6">Agenda</h3>

                                    <div className="space-y-6">
                                        {/* Data Block */}
                                        <div>
                                            <span className="text-primary font-bold text-[10px] uppercase tracking-widest block mb-2">Data</span>
                                            <div className="flex items-center gap-3">
                                                <span className="material-symbols-outlined text-white">calendar_today</span>
                                                <div>
                                                    <p className="text-white font-bold text-lg leading-tight">{appointment.fullDate}</p>
                                                    <p className="text-[10px] text-text-muted font-bold uppercase tracking-wide mt-0.5">{appointment.duration} estimada</p>
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

                                {/* Financial (somente leitura) */}
                                <div className="bg-surface-light/10 border border-white/5 rounded-2xl p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest">Financeiro</h3>
                                        <button
                                            disabled
                                            title="Editar valores — em breve"
                                            className="text-text-muted/40 cursor-not-allowed"
                                        >
                                            <span className="material-symbols-outlined text-sm">edit</span>
                                        </button>
                                    </div>

                                    <div className="space-y-3 mb-2">
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
                                </div>

                                {/* Internal Notes (somente leitura por enquanto) */}
                                <div className="bg-surface-light/10 border border-white/5 rounded-2xl p-6">
                                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-4 flex items-center justify-between">
                                        Notas Internas
                                        <span className="material-symbols-outlined text-xs">lock</span>
                                    </h3>
                                    <textarea
                                        readOnly
                                        className="w-full bg-background-dark border border-border-dark rounded-xl p-3 text-white text-sm placeholder-zinc-700 resize-none"
                                        rows={4}
                                        placeholder="Nenhuma nota registrada."
                                        value={appointment.internalNotes}
                                    />
                                    <button
                                        disabled
                                        title="Em breve"
                                        className="w-full mt-3 py-2 bg-surface-dark border border-border-dark text-text-muted/40 rounded-lg text-xs font-bold uppercase tracking-wide cursor-not-allowed flex items-center justify-center gap-1"
                                    >
                                        Salvar Notas
                                        <EmBreve />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArtistAppointmentDetails;
