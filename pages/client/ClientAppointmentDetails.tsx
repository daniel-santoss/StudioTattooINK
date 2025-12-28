
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Interface expandida para incluir detalhes do projeto
interface AppointmentDetail {
    id: number;
    artist: string;
    artistRole: string;
    artistAvatar: string;
    service: string;
    date: string;
    fullDate: string; // Para display extenso
    time: string;
    duration: string;
    status: 'upcoming' | 'completed' | 'cancelled' | 'pending' | 'rescheduling';
    price: string;
    paidAmount: string; // Novo campo: Valor já pago
    remainingAmount: string; // Novo campo: Valor restante
    paymentStatus: 'Pendente' | 'Pago' | 'Parcial';
    location: string;
    description: string;
    referenceImages: string[];
    cancellationReason?: string;
    rescheduleInfo?: {
        newDate: string;
        newTime: string; // Armazena "Manhã", "Tarde" etc.
        reason: string;
        requestedBy: 'artist' | 'client';
    };
}

// Mock Data Database
const appointmentsDB: AppointmentDetail[] = [
    {
       id: 1,
       artist: "Alex Rivera",
       artistRole: "Realismo Preto e Cinza",
       artistAvatar: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=200",
       service: "Fechamento de Braço - Sessão 2",
       date: "15 Nov, 2024",
       fullDate: "Sexta-feira, 15 de Novembro de 2024",
       time: "14:00",
       duration: "4 horas",
       status: "upcoming",
       price: "R$ 1.200,00",
       paidAmount: "R$ 400,00", // Sinal
       remainingAmount: "R$ 800,00",
       paymentStatus: "Pendente",
       location: "Ink Studio - Sala 02",
       description: "Continuação do fechamento do braço esquerdo. Foco na parte interna do antebraço, sombreamento do leão e início do fundo geométrico.",
       referenceImages: [
           "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=300",
           "https://images.unsplash.com/photo-1562962230-16bc46364924?auto=format&fit=crop&q=80&w=300"
       ]
    },
    {
        id: 4,
        artist: "Elena Rosa",
        artistRole: "Fine Line",
        artistAvatar: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?q=80&w=200&auto=format&fit=crop",
        service: "Fine Line Minimalista",
        date: "20 Dez, 2024",
        fullDate: "Sexta-feira, 20 de Dezembro de 2024",
        time: "11:00",
        duration: "1h 30min",
        status: "pending",
        price: "A confirmar",
        paidAmount: "R$ 0,00",
        remainingAmount: "A confirmar",
        paymentStatus: "Pendente",
        location: "Ink Studio - Sala 01",
        description: "Borboleta delicada no pulso com traços finos e pequenos detalhes pontilhados. Tamanho aprox. 5cm.",
        referenceImages: [
            "https://images.unsplash.com/photo-1550537687-c91357422f5c?auto=format&fit=crop&q=80&w=300"
        ]
    },
    {
        id: 5,
        artist: "Alex Rivera",
        artistRole: "Realismo",
        artistAvatar: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=200",
        service: "Retoque Realismo",
        date: "25 Nov, 2024",
        fullDate: "Segunda-feira, 25 de Novembro de 2024",
        time: "09:00",
        duration: "1 hora",
        status: "rescheduling",
        price: "R$ 0,00",
        paidAmount: "R$ 0,00",
        remainingAmount: "R$ 0,00",
        paymentStatus: "Pago",
        location: "Ink Studio - Sala 02",
        description: "Retoque na pigmentação do olho do tigre feito há 2 meses. Pequenas falhas na cicatrização.",
        referenceImages: [],
        rescheduleInfo: {
            newDate: "28 Nov, 2024",
            newTime: "Manhã",
            reason: "Imprevisto de saúde.",
            requestedBy: "artist"
        }
    },
    {
       id: 2,
       artist: "Sarah Vane",
       artistRole: "Neo Traditional",
       artistAvatar: "https://images.unsplash.com/photo-1596204368623-2895f543666f?auto=format&fit=crop&q=80&w=200",
       service: "Rosa Old School",
       date: "10 Out, 2024",
       fullDate: "Quinta-feira, 10 de Outubro de 2024",
       time: "10:00",
       duration: "2 horas",
       status: "completed",
       price: "R$ 450,00",
       paidAmount: "R$ 450,00",
       remainingAmount: "R$ 0,00",
       paymentStatus: "Pago",
       location: "Ink Studio - Sala 03",
       description: "Rosa clássica old school na mão direita. Cores sólidas: Vermelho, Verde e Amarelo.",
       referenceImages: [
           "https://images.unsplash.com/photo-1590246255075-e9b9c072b9a0?auto=format&fit=crop&q=80&w=300"
       ]
    },
    {
       id: 3,
       artist: "Mike Chen",
       artistRole: "Oriental",
       artistAvatar: "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&q=80&w=200",
       service: "Dragão Oriental",
       date: "05 Out, 2024",
       fullDate: "Sábado, 05 de Outubro de 2024",
       time: "16:00",
       duration: "4 horas",
       status: "cancelled",
       price: "R$ 0,00",
       paidAmount: "R$ 0,00",
       remainingAmount: "R$ 0,00",
       paymentStatus: "Pendente",
       location: "Ink Studio - Sala 04",
       description: "Sessão cancelada.",
       referenceImages: [],
       cancellationReason: "Indisponibilidade de agenda do tatuador."
    }
];

const periods = [
    { id: 'Manhã', label: 'Manhã', range: '06h - 12h', icon: 'wb_twilight' },
    { id: 'Tarde', label: 'Tarde', range: '12h - 18h', icon: 'wb_sunny' },
    { id: 'Noite', label: 'Noite', range: '18h - 00h', icon: 'dark_mode' },
];

const getPeriodFromTime = (time: string) => {
    const hour = parseInt(time.split(':')[0]);
    if (hour >= 6 && hour < 12) return { label: 'Manhã (06h-12h)', icon: 'wb_twilight' };
    if (hour >= 12 && hour < 18) return { label: 'Tarde (12h-18h)', icon: 'wb_sunny' };
    return { label: 'Noite (18h-00h)', icon: 'dark_mode' };
};

const ClientAppointmentDetails: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [appointment, setAppointment] = useState<AppointmentDetail | null>(null);
    const [loading, setLoading] = useState(true);

    // Modal States
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
    const [isRateModalOpen, setIsRateModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    // Form States
    const [cancelReasonData, setCancelReasonData] = useState({ reason: 'Imprevisto pessoal', note: '' });
    const [rescheduleData, setRescheduleData] = useState({ newDate: '', newPeriod: '', reason: '' });
    const [ratingValue, setRatingValue] = useState(0);
    const [showErrors, setShowErrors] = useState(false);

    // Calendar State & Manual Input
    const [viewDate, setViewDate] = useState(new Date());
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [dateInput, setDateInput] = useState("");
    const calendarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Simulating fetch
        setTimeout(() => {
            const found = appointmentsDB.find(apt => apt.id === Number(id));
            setAppointment(found || null);
            setLoading(false);
        }, 500);
    }, [id]);

    // Close calendar when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setIsCalendarOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [calendarRef]);

    const handleCancel = (e: React.FormEvent) => {
        e.preventDefault();
        if (appointment) {
            setAppointment({ 
                ...appointment, 
                status: 'cancelled', 
                cancellationReason: `${cancelReasonData.reason}: ${cancelReasonData.note}` 
            });
            setIsCancelModalOpen(false);
            alert("Agendamento cancelado com sucesso.");
        }
    };

    const handleReschedule = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Show validation errors if any field is invalid
        const isDateValid = !!rescheduleData.newDate;
        const isTimeValid = !!rescheduleData.newPeriod;
        const isReasonValid = !!rescheduleData.reason.trim();

        if (!isDateValid || !isTimeValid || !isReasonValid) {
            setShowErrors(true);
            return;
        }

        if (appointment) {
            // Format for display: DD/MM/YYYY
            const [y, m, d] = rescheduleData.newDate.split('-');
            // Simples string build para evitar timezone shift na exibição
            
            const formattedFullDate = new Date(rescheduleData.newDate).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

            setAppointment({
                ...appointment,
                status: 'rescheduling',
                rescheduleInfo: {
                    newDate: formattedFullDate,
                    newTime: rescheduleData.newPeriod, // Saving period label
                    reason: rescheduleData.reason,
                    requestedBy: 'client'
                }
            });
            setIsRescheduleModalOpen(false);
            alert("Solicitação de reagendamento enviada.");
        }
    };

    const handleRate = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Obrigado pela sua avaliação!");
        setIsRateModalOpen(false);
    };

    const handleReport = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Problema reportado. Nossa equipe entrará em contato.");
        setIsReportModalOpen(false);
    };

    // --- Calendar & Input Logic ---

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const handlePrevMonth = () => {
        const newDate = new Date(viewDate);
        newDate.setMonth(newDate.getMonth() - 1);
        setViewDate(newDate);
    };

    const handleNextMonth = () => {
        const newDate = new Date(viewDate);
        newDate.setMonth(newDate.getMonth() + 1);
        setViewDate(newDate);
    };

    const handleDateSelect = (day: number) => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth() + 1;
        
        // Format ISO for State
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        setRescheduleData({...rescheduleData, newDate: dateStr});
        
        // Format DD/MM/YYYY for Input
        const displayStr = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
        setDateInput(displayStr);
        
        setIsCalendarOpen(false);
        // Reset errors for date if present
        if (showErrors && dateStr) setShowErrors(false); 
    };

    const handleManualDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value.replace(/\D/g, ''); // Remove não dígitos
        
        if (val.length > 8) val = val.substring(0, 8); // Max 8 digitos

        // Máscara DD/MM/AAAA
        if (val.length >= 5) {
            val = val.replace(/(\d{2})(\d{2})(\d{1,4})/, '$1/$2/$3');
        } else if (val.length >= 3) {
            val = val.replace(/(\d{2})(\d{1,2})/, '$1/$2');
        }

        setDateInput(val);

        // Validação ao completar a data (10 chars = DD/MM/AAAA)
        if (val.length === 10) {
            const [day, month, year] = val.split('/').map(Number);
            
            // Check for valid day in month (e.g. 30/02)
            const daysInMonth = new Date(year, month, 0).getDate();
            
            if (month < 1 || month > 12 || day < 1 || day > daysInMonth) {
                setRescheduleData({...rescheduleData, newDate: ''}); // Data inválida
                return;
            }

            const testDate = new Date(year, month - 1, day);
            const today = new Date();
            today.setHours(0,0,0,0);

            const isValid = 
                testDate.getFullYear() === year &&
                year >= today.getFullYear() && 
                testDate >= today;

            if (isValid) {
                const isoDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                setRescheduleData({...rescheduleData, newDate: isoDate});
                setViewDate(testDate); // Sincroniza o calendário visual
            } else {
                setRescheduleData({...rescheduleData, newDate: ''}); // Data inválida
            }
        } else {
            setRescheduleData({...rescheduleData, newDate: ''}); // Data incompleta
        }
    };

    const isPastDate = (day: number) => {
        const today = new Date();
        today.setHours(0,0,0,0);
        const checkDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        return checkDate < today;
    };

    const isSelected = (day: number) => {
        if (!rescheduleData.newDate) return false;
        const [y, m, d] = rescheduleData.newDate.split('-').map(Number);
        return viewDate.getFullYear() === y && viewDate.getMonth() + 1 === m && day === d;
    };

    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'upcoming': return <span className="bg-blue-500/20 text-blue-500 border border-blue-500/30 px-3 py-1 rounded text-xs font-bold uppercase tracking-wide">Agendado</span>;
            case 'completed': return <span className="bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 px-3 py-1 rounded text-xs font-bold uppercase tracking-wide">Concluído</span>;
            case 'cancelled': return <span className="bg-red-500/20 text-red-500 border border-red-500/30 px-3 py-1 rounded text-xs font-bold uppercase tracking-wide">Cancelado</span>;
            case 'pending': return <span className="bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 px-3 py-1 rounded text-xs font-bold uppercase tracking-wide">Aguardando</span>;
            case 'rescheduling': return <span className="bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 px-3 py-1 rounded text-xs font-bold uppercase tracking-wide">Reagendando</span>;
            default: return null;
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-text-muted">Carregando detalhes...</div>;
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
                    <div className={`h-2 w-full ${
                        appointment.status === 'upcoming' ? 'bg-blue-500' : 
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
                                <p className="text-text-muted text-sm">ID do Agendamento: #{appointment.id}882024</p>
                            </div>
                            
                            {/* Actions Group */}
                            <div className="flex flex-wrap gap-3 w-full md:w-auto">
                                {(appointment.status === 'upcoming' || appointment.status === 'pending') && (
                                    <>
                                        <button 
                                            onClick={() => {
                                                // Reset reschedule state when opening
                                                setRescheduleData({ newDate: '', newPeriod: '', reason: '' });
                                                setDateInput('');
                                                setShowErrors(false);
                                                setIsRescheduleModalOpen(true);
                                            }}
                                            className="flex-1 md:flex-none px-5 py-2.5 bg-surface-light border border-border-dark text-white hover:bg-white/10 rounded-lg font-bold text-xs uppercase tracking-wide transition-all flex items-center justify-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-sm">edit_calendar</span>
                                            Remarcar
                                        </button>
                                        <button 
                                            onClick={() => setIsCancelModalOpen(true)}
                                            className="flex-1 md:flex-none px-5 py-2.5 border border-red-500/30 text-red-500 hover:bg-red-500/10 rounded-lg font-bold text-xs uppercase tracking-wide transition-all flex items-center justify-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-sm">cancel</span>
                                            Cancelar
                                        </button>
                                    </>
                                )}

                                {appointment.status === 'completed' && (
                                    <>
                                        <button 
                                            onClick={() => setIsRateModalOpen(true)}
                                            className="flex-1 md:flex-none px-5 py-2.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20 rounded-lg font-bold text-xs uppercase tracking-wide transition-all flex items-center justify-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-sm">star</span>
                                            Avaliar Serviço
                                        </button>
                                        <button 
                                            onClick={() => setIsReportModalOpen(true)}
                                            className="flex-1 md:flex-none px-5 py-2.5 border border-border-dark text-text-muted hover:text-red-400 hover:border-red-500/30 rounded-lg font-bold text-xs uppercase tracking-wide transition-all flex items-center justify-center gap-2"
                                        >
                                            <span className="material-symbols-outlined text-sm">flag</span>
                                            Reportar
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
                                            onClick={() => navigate('/artist-profile?id=1')} // Mock ID
                                            className="size-10 rounded-lg bg-surface-dark hover:bg-white/10 flex items-center justify-center text-text-muted hover:text-white transition-colors border border-border-dark"
                                            title="Ver Perfil"
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
                                        Referências
                                    </h3>
                                    <div className="flex gap-4 overflow-x-auto pb-2">
                                        {appointment.referenceImages.map((img, idx) => (
                                            <div key={idx} className="relative size-24 rounded-lg overflow-hidden border border-border-dark group shrink-0">
                                                <img src={img} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Referência" />
                                            </div>
                                        ))}
                                        {/* Botão Adicionar Foto */}
                                        <button className="size-24 rounded-lg border border-dashed border-zinc-700 hover:border-white hover:bg-white/5 flex flex-col items-center justify-center text-text-muted hover:text-white transition-all shrink-0">
                                            <span className="material-symbols-outlined text-2xl mb-1">add_a_photo</span>
                                            <span className="text-[10px] font-bold uppercase">Add Foto</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Logistics */}
                            <div className="space-y-6">
                                {/* Reschedule Info Box if Active */}
                                {appointment.status === 'rescheduling' && appointment.rescheduleInfo && (
                                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-3 opacity-10">
                                            <span className="material-symbols-outlined text-6xl text-yellow-500">change_circle</span>
                                        </div>
                                        <h3 className="text-xs font-bold text-yellow-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm">info</span>
                                            Em Reagendamento
                                        </h3>
                                        <div className="space-y-3 relative z-10">
                                            <p className="text-sm text-white">Solicitado por: <strong>{appointment.rescheduleInfo.requestedBy === 'client' ? 'Você' : 'Profissional'}</strong></p>
                                            <div className="bg-background-dark/50 p-3 rounded-lg border border-yellow-500/10">
                                                <p className="text-xs text-text-muted uppercase font-bold mb-1">Sugestão</p>
                                                <p className="text-white font-bold">{appointment.rescheduleInfo.newDate} • {appointment.rescheduleInfo.newTime}</p>
                                            </div>
                                            <p className="text-xs text-text-light italic">"{appointment.rescheduleInfo.reason}"</p>
                                            
                                            {appointment.rescheduleInfo.requestedBy === 'artist' && (
                                                <div className="flex gap-2 mt-2">
                                                    <button className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-xs uppercase">Aceitar</button>
                                                    <button className="flex-1 py-2 bg-red-600/20 text-red-500 hover:bg-red-600/30 rounded font-bold text-xs uppercase">Recusar</button>
                                                </div>
                                            )}
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
                    {appointment.status === 'cancelled' && (
                        <div className="bg-red-500/10 border-t border-red-500/20 p-6 text-center">
                            <p className="text-red-400 font-bold text-sm uppercase tracking-wide mb-1">Agendamento Cancelado</p>
                            <p className="text-white text-sm">Motivo: {appointment.cancellationReason}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- MODALS --- */}

            {/* Cancel Modal */}
            {isCancelModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-surface-dark border border-border-dark rounded-2xl w-full max-w-md shadow-2xl relative animate-fade-in">
                        <form onSubmit={handleCancel}>
                            <div className="p-6 border-b border-border-dark flex justify-between items-center bg-red-500/5 rounded-t-2xl">
                                <div className="flex items-center gap-2 text-red-500">
                                    <span className="material-symbols-outlined">event_busy</span>
                                    <h3 className="text-xl font-bold">Cancelar</h3>
                                </div>
                                <button type="button" onClick={() => setIsCancelModalOpen(false)} className="text-text-muted hover:text-white"><span className="material-symbols-outlined">close</span></button>
                            </div>
                            <div className="p-6">
                                <p className="text-text-muted text-sm mb-4">Tem certeza? Esta ação não pode ser desfeita.</p>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-text-muted uppercase mb-1 block">Motivo</label>
                                        <select 
                                            value={cancelReasonData.reason}
                                            onChange={(e) => setCancelReasonData({...cancelReasonData, reason: e.target.value})}
                                            className="w-full bg-background-dark border border-border-dark rounded-lg p-2.5 text-white text-sm focus:border-red-500"
                                        >
                                            <option>Imprevisto pessoal</option>
                                            <option>Problema financeiro</option>
                                            <option>Problema de saúde</option>
                                            <option>Outros</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-text-muted uppercase mb-1 block">Detalhes</label>
                                        <textarea 
                                            value={cancelReasonData.note}
                                            onChange={(e) => setCancelReasonData({...cancelReasonData, note: e.target.value})}
                                            className="w-full bg-background-dark border border-border-dark rounded-lg p-3 text-white text-sm focus:border-red-500 placeholder-zinc-700"
                                            rows={3}
                                            placeholder="Explique melhor se desejar..."
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 border-t border-border-dark flex justify-end gap-3 bg-background-dark rounded-b-2xl">
                                <button type="button" onClick={() => setIsCancelModalOpen(false)} className="px-4 py-2 text-text-muted hover:text-white font-bold text-sm">Voltar</button>
                                <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold text-sm uppercase tracking-wide transition-colors">
                                    Confirmar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Reschedule Modal (Visual Padronizado em Vermelho) */}
            {isRescheduleModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-surface-dark border border-border-dark rounded-2xl w-full max-w-lg shadow-2xl relative animate-fade-in flex flex-col max-h-[90vh]">
                        <form onSubmit={handleReschedule} className="flex flex-col h-full">
                            <div className="p-6 border-b border-border-dark flex justify-between items-center bg-surface-dark rounded-t-2xl">
                                <div className="flex items-center gap-2 text-primary">
                                    <span className="material-symbols-outlined">edit_calendar</span>
                                    <h3 className="text-xl font-bold text-white">Solicitar Mudança</h3>
                                </div>
                                <button type="button" onClick={() => setIsRescheduleModalOpen(false)} className="text-text-muted hover:text-white"><span className="material-symbols-outlined">close</span></button>
                            </div>
                            
                            <div className="p-6 overflow-y-auto space-y-8 flex-1">
                                <p className="text-text-muted text-sm">Sugira uma nova data e turno. O tatuador precisará aprovar.</p>
                                
                                {/* Date Selection (Input Manual + Calendar Popover) */}
                                <div className="relative" ref={calendarRef}>
                                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest block mb-3">Nova Data <span className="text-primary">*</span></label>
                                    
                                    {/* Input com ícone */}
                                    <div className="relative">
                                        <input 
                                            type="text"
                                            value={dateInput}
                                            onChange={handleManualDateChange}
                                            onClick={() => setIsCalendarOpen(true)}
                                            placeholder="DD/MM/AAAA"
                                            maxLength={10}
                                            className={`w-full bg-background-dark border rounded-lg p-3 text-sm text-white placeholder-text-muted focus:outline-none transition-all ${
                                                showErrors && !rescheduleData.newDate
                                                ? 'border-red-500 focus:border-red-500'
                                                : isCalendarOpen 
                                                    ? 'border-primary ring-1 ring-primary' 
                                                    : 'border-border-dark hover:border-white/30'
                                            }`}
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-white"
                                        >
                                            <span className="material-symbols-outlined text-xl">calendar_month</span>
                                        </button>
                                    </div>
                                    {showErrors && !rescheduleData.newDate && (
                                        <p className="text-red-500 text-xs mt-1">Data inválida ou inexistente</p>
                                    )}

                                    {/* Floating Calendar */}
                                    {isCalendarOpen && (
                                        <div className="absolute top-full left-0 mt-2 z-20 bg-[#1a1a1a] border border-border-dark rounded-xl p-3 shadow-2xl w-full max-w-[280px] animate-fade-in select-none">
                                            {/* Header */}
                                            <div className="flex items-center justify-between mb-3">
                                                <button type="button" onClick={handlePrevMonth} className="text-text-muted hover:text-white p-1 rounded hover:bg-white/10 transition-colors">
                                                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                                                </button>
                                                <span className="text-white font-bold capitalize text-xs">
                                                    {viewDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                                                </span>
                                                <button type="button" onClick={handleNextMonth} className="text-text-muted hover:text-white p-1 rounded hover:bg-white/10 transition-colors">
                                                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                                                </button>
                                            </div>

                                            {/* Grid */}
                                            <div className="grid grid-cols-7 gap-1 text-center mb-1">
                                                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => (
                                                    <span key={d} className="text-[9px] font-black text-text-muted uppercase">{d}</span>
                                                ))}
                                            </div>
                                            <div className="grid grid-cols-7 gap-1">
                                                {/* Empty slots */}
                                                {Array.from({ length: getFirstDayOfMonth(viewDate.getFullYear(), viewDate.getMonth()) }).map((_, i) => (
                                                    <div key={`empty-${i}`} />
                                                ))}
                                                {/* Days */}
                                                {Array.from({ length: getDaysInMonth(viewDate.getFullYear(), viewDate.getMonth()) }).map((_, i) => {
                                                    const day = i + 1;
                                                    const disabled = isPastDate(day);
                                                    const selected = isSelected(day);

                                                    return (
                                                        <button 
                                                            key={day}
                                                            type="button"
                                                            disabled={disabled}
                                                            onClick={() => handleDateSelect(day)}
                                                            className={`
                                                                size-7 rounded-md flex items-center justify-center text-xs font-bold transition-all
                                                                ${selected 
                                                                    ? 'bg-primary text-white shadow-md' 
                                                                    : disabled 
                                                                        ? 'text-zinc-700 cursor-not-allowed' 
                                                                        : 'text-zinc-300 hover:bg-surface-light hover:text-white'
                                                                }
                                                            `}
                                                        >
                                                            {day}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Period Selection (Cards) */}
                                <div>
                                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest block mb-3">Turno de Preferência <span className="text-primary">*</span></label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {periods.map((period) => (
                                            <button
                                                key={period.id}
                                                type="button"
                                                onClick={() => setRescheduleData({...rescheduleData, newPeriod: period.id})}
                                                className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300 gap-1 ${
                                                    rescheduleData.newPeriod === period.id 
                                                    ? 'bg-[#121212] border-primary text-white shadow-[0_0_20px_rgba(212,17,50,0.2)] scale-105' 
                                                    : 'bg-[#121212] border-zinc-800 text-zinc-400 hover:border-primary hover:text-white'
                                                }`}
                                            >
                                                <span className="material-symbols-outlined text-xl">{period.icon}</span>
                                                <span className="text-xs font-bold uppercase">{period.label}</span>
                                                <span className="text-[9px] font-medium opacity-80">{period.range}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Reason */}
                                <div>
                                    <label className="text-xs font-bold text-text-muted uppercase mb-2 block">Motivo <span className="text-primary">*</span></label>
                                    <textarea 
                                        value={rescheduleData.reason}
                                        onChange={(e) => setRescheduleData({...rescheduleData, reason: e.target.value})}
                                        className={`w-full bg-background-dark border rounded-lg p-3 text-white text-sm focus:outline-none placeholder-zinc-700 ${
                                            showErrors && !rescheduleData.reason.trim()
                                            ? 'border-red-500 focus:border-red-500'
                                            : 'border-border-dark focus:border-primary'
                                        }`}
                                        rows={3}
                                        placeholder="Ex: Tive um imprevisto no trabalho..."
                                    ></textarea>
                                    {showErrors && !rescheduleData.reason.trim() && (
                                        <p className="text-red-500 text-xs mt-1">Campo obrigatório</p>
                                    )}
                                </div>
                            </div>
                            <div className="p-6 border-t border-border-dark flex justify-end gap-3 bg-background-dark rounded-b-2xl">
                                <button type="button" onClick={() => setIsRescheduleModalOpen(false)} className="px-4 py-2 text-text-muted hover:text-white font-bold text-sm uppercase tracking-wide">Cancelar</button>
                                <button type="submit" className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-lg font-bold text-sm uppercase tracking-wide transition-colors shadow-lg shadow-primary/20">
                                    ENVIAR
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Rate Modal */}
            {isRateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-surface-dark border border-border-dark rounded-2xl w-full max-w-md shadow-2xl relative animate-fade-in">
                        <form onSubmit={handleRate}>
                            <div className="p-6 border-b border-border-dark flex justify-between items-center">
                                <h3 className="text-xl font-bold text-white">Avaliar Atendimento</h3>
                                <button type="button" onClick={() => setIsRateModalOpen(false)} className="text-text-muted hover:text-white"><span className="material-symbols-outlined">close</span></button>
                            </div>
                            <div className="p-6 text-center">
                                <p className="text-text-muted text-sm mb-4">Como foi sua experiência com <span className="text-white font-bold">{appointment.artist}</span>?</p>
                                <div className="flex justify-center gap-2 mb-6">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRatingValue(star)}
                                            className="group p-1 transition-transform hover:scale-110 focus:outline-none"
                                        >
                                            <span 
                                                className={`material-symbols-outlined text-4xl transition-colors duration-200 ${
                                                    star <= ratingValue ? 'text-amber-500' : 'text-zinc-600'
                                                }`}
                                                style={{ 
                                                    fontVariationSettings: `'FILL' ${star <= ratingValue ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24` 
                                                }}
                                            >
                                                star
                                            </span>
                                        </button>
                                    ))}
                                </div>
                                <textarea 
                                    className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder-zinc-600 resize-none transition-all"
                                    rows={3}
                                    placeholder="Deixe um comentário (opcional)..."
                                ></textarea>
                            </div>
                            <div className="p-6 border-t border-border-dark flex justify-end">
                                <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-lg font-bold text-sm uppercase tracking-wide transition-colors">
                                    Enviar Avaliação
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Report Modal */}
            {isReportModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-surface-dark border border-border-dark rounded-2xl w-full max-w-md shadow-2xl relative animate-fade-in">
                        <form onSubmit={handleReport}>
                            <div className="p-6 border-b border-border-dark flex justify-between items-center bg-red-500/5">
                                <div className="flex items-center gap-2 text-red-500">
                                    <span className="material-symbols-outlined">report_problem</span>
                                    <h3 className="text-xl font-bold">Reportar Problema</h3>
                                </div>
                                <button type="button" onClick={() => setIsReportModalOpen(false)} className="text-text-muted hover:text-white"><span className="material-symbols-outlined">close</span></button>
                            </div>
                            <div className="p-6">
                                <p className="text-text-muted text-sm mb-4">Descreva o problema ocorrido no atendimento.</p>
                                
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-text-muted uppercase mb-1 block">Motivo</label>
                                        <select className="w-full bg-background-dark border border-border-dark rounded-lg p-2.5 text-white text-sm focus:border-red-500">
                                            <option>Atraso excessivo</option>
                                            <option>Comportamento inadequado</option>
                                            <option>Resultado insatisfatório</option>
                                            <option>Cobrança indevida</option>
                                            <option>Outro</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-text-muted uppercase mb-1 block">Descrição</label>
                                        <textarea 
                                            required
                                            className="w-full bg-background-dark border border-border-dark rounded-lg p-3 text-white text-sm focus:border-red-500 placeholder-zinc-700"
                                            rows={4}
                                            placeholder="Dê detalhes sobre o ocorrido..."
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 border-t border-border-dark flex justify-end gap-3">
                                <button type="button" onClick={() => setIsReportModalOpen(false)} className="px-4 py-2 text-text-muted hover:text-white font-bold text-sm">Cancelar</button>
                                <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold text-sm uppercase tracking-wide transition-colors">
                                    Enviar Report
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
