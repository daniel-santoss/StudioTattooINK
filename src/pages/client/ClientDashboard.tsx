
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Appointment {
    id: number;
    artist: string;
    service: string;
    date: string;
    time: string;
    status: 'upcoming' | 'completed' | 'cancelled' | 'pending' | 'rescheduling';
    price: string;
    image: string;
}

const initialAppointments: Appointment[] = [
    {
        id: 1,
        artist: "Alex Rivera",
        service: "Fechamento de Braço - Sessão 2",
        date: "15 Nov, 2024",
        time: "14:00",
        status: "upcoming",
        price: "R$ 1.200",
        image: "/src/assets/images/tatuadores/tatuador1.jpg",
    },
    {
        id: 4,
        artist: "Elena Rosa",
        service: "Fine Line Minimalista",
        date: "20 Dez, 2024",
        time: "11:00",
        status: "pending",
        price: "A confirmar",
        image: "/src/assets/images/tatuadores/tatuador4.jpg"
    },
    {
        id: 5,
        artist: "Alex Rivera",
        service: "Retoque Realismo",
        date: "25 Nov, 2024",
        time: "09:00",
        status: "rescheduling",
        price: "R$ 0",
        image: "/src/assets/images/tatuadores/tatuador1.jpg",
    },
    {
        id: 2,
        artist: "Lucas Vane",
        service: "Rosa Old School",
        date: "10 Out, 2024",
        time: "10:00",
        status: "completed",
        price: "R$ 450",
        image: "/src/assets/images/tatuadores/tatuador2.jpg",
    },
    {
        id: 3,
        artist: "Mika Chen",
        service: "Dragão Oriental (Cancelado)",
        date: "05 Out, 2024",
        time: "16:00",
        status: "cancelled",
        price: "R$ 0",
        image: "/src/assets/images/tatuadores/tatuador3.jpg",
    }
];

const ClientDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [appointments] = useState<Appointment[]>(initialAppointments);
    const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled' | 'pending'>('all');

    // Filter Logic
    const filteredAppointments = appointments.filter(apt => {
        if (statusFilter === 'all') return true;
        if (statusFilter === 'pending' && apt.status === 'rescheduling') return true;
        return apt.status === statusFilter;
    });

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'upcoming': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'completed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20 opacity-70';
            case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            case 'rescheduling': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
            default: return 'bg-text-muted/10 text-text-muted border-text-muted/20';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'upcoming': return 'Agendado';
            case 'completed': return 'Concluído';
            case 'cancelled': return 'Cancelado';
            case 'pending': return 'Aguardando';
            case 'rescheduling': return 'Reagendando';
            default: return status;
        }
    };

    return (
        <div className="p-6 md:p-8 lg:p-12 max-w-6xl mx-auto w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="font-tattoo text-4xl md:text-5xl text-white mb-2">Meus Agendamentos</h1>
                    <p className="text-text-muted text-sm">Gerencie suas sessões e histórico.</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <button
                        onClick={() => navigate('/book')}
                        className="bg-white text-black hover:bg-gray-200 px-5 py-2.5 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 whitespace-nowrap shadow-lg shadow-white/10"
                    >
                        <span className="material-symbols-outlined text-lg">add_circle</span>
                        <span className="hidden sm:inline">Novo Agendamento</span>
                    </button>
                </div>
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-thin scrollbar-thumb-surface-light">
                {[
                    { id: 'all', label: 'Todos' },
                    { id: 'upcoming', label: 'Agendado' },
                    { id: 'pending', label: 'Pendente' },
                    { id: 'completed', label: 'Concluído' },
                    { id: 'cancelled', label: 'Cancelado' }
                ].map((filter) => (
                    <button
                        key={filter.id}
                        onClick={() => setStatusFilter(filter.id as any)}
                        className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wide border transition-all whitespace-nowrap ${statusFilter === filter.id
                            ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
                            : 'bg-surface-dark text-text-muted border-border-dark hover:border-white/30 hover:text-white'
                            }`}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>

            {/* Appointment List (Cards Limpos) */}
            <div className="flex flex-col gap-4 animate-fade-in">
                {filteredAppointments.length > 0 ? filteredAppointments.map((apt) => (
                    <div
                        key={apt.id}
                        className="bg-[#121212] border border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center hover:border-primary/40 transition-all duration-300 group relative overflow-hidden"
                    >
                        {/* Visual Status Indicator Strip */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${apt.status === 'upcoming' ? 'bg-blue-500' :
                            apt.status === 'completed' ? 'bg-emerald-500' :
                                apt.status === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500'
                            }`}></div>

                        {/* Info Container */}
                        <div className="flex flex-1 items-center gap-6 w-full">
                            {/* Image */}
                            <div className="relative shrink-0">
                                <img
                                    src={apt.image}
                                    alt={apt.artist}
                                    className="size-20 rounded-xl bg-zinc-900 border border-zinc-700 object-cover shadow-lg"
                                />
                            </div>

                            {/* Text Details */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-1">
                                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${getStatusBadge(apt.status)}`}>
                                        {getStatusLabel(apt.status)}
                                    </span>
                                    <span className="text-xs text-text-muted hidden sm:inline-block">•</span>
                                    <span className="text-xs text-text-muted hidden sm:inline-block">{apt.date} às {apt.time}</span>
                                </div>
                                <h3 className="text-xl font-display font-bold text-white mb-1 leading-tight truncate">{apt.service}</h3>
                                <p className="text-text-muted text-sm flex items-center gap-2">
                                    com <span className="text-white font-bold">{apt.artist}</span>
                                </p>
                            </div>
                        </div>

                        {/* Action Button - Apenas UM botão claro */}
                        <div className="w-full md:w-auto">
                            <button
                                onClick={() => navigate(`/my-appointments/${apt.id}`)}
                                className="w-full md:w-auto px-6 py-3 rounded-xl bg-surface-light hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest transition-all border border-transparent hover:border-zinc-600 flex items-center justify-center gap-2"
                            >
                                Ver Detalhes
                                <span className="material-symbols-outlined text-sm">arrow_forward</span>
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-zinc-800 rounded-2xl text-center">
                        <span className="material-symbols-outlined text-5xl text-zinc-700 mb-4">calendar_today</span>
                        <h3 className="text-xl font-bold text-white mb-1">Nenhum agendamento encontrado</h3>
                        <p className="text-text-muted">Não há sessões com este status no momento.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientDashboard;
