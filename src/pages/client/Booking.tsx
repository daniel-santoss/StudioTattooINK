
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RatingDisplay } from '../Staff';

const artists = [
    { id: 1, name: "Alex Rivera", role: "Especialista em Realismo", price: 150, rating: 4.7, ratingCount: 2899, img: "/src/assets/images/tatuadores/tatuador1.jpg" },
    { id: 2, name: "Lucas Vane", role: "Neo Tradicional", price: 130, rating: 5.0, ratingCount: 1450, img: "/src/assets/images/tatuadores/tatuador2.jpg" },
    { id: 3, name: "Mika Chen", role: "Oriental", price: 180, rating: 4.2, ratingCount: 920, img: "/src/assets/images/tatuadores/tatuador3.jpg" },
    { id: 4, name: "Elena Rosa", role: "Fine Line", price: 120, rating: 4.8, ratingCount: 1105, img: "/src/assets/images/tatuadores/tatuador4.jpg" },
    { id: 5, name: "Lucas Ferreira", role: "Blackwork", price: 140, rating: 4.5, ratingCount: 780, img: "/src/assets/images/tatuadores/tatuador5.jpg" },
    { id: 6, name: "André Costa", role: "Aquarela", price: 160, rating: 4.9, ratingCount: 1230, img: "/src/assets/images/tatuadores/tatuador6.jpg" },
    { id: 7, name: "Rafael Santos", role: "Old School", price: 125, rating: 4.4, ratingCount: 650, img: "/src/assets/images/tatuadores/tatuador7.jpg" },
    { id: 8, name: "Juliana Mendes", role: "Lettering", price: 110, rating: 4.6, ratingCount: 890, img: "/src/assets/images/tatuadores/tatuador8.jpg" }
];

const periods = [
    { id: 'Manhã', label: 'Manhã', range: '06:00 - 12:00', icon: 'wb_twilight' },
    { id: 'Tarde', label: 'Tarde', range: '12:00 - 18:00', icon: 'wb_sunny' },
    { id: 'Noite', label: 'Noite', range: '18:00 - 00:00', icon: 'dark_mode' },
];

const Booking: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [step, setStep] = useState(1);
    const [selectedArtist, setSelectedArtist] = useState<number | null>(null);

    // Date State
    const [selectedDate, setSelectedDate] = useState<string>(""); // Format: Display String
    const [viewDate, setViewDate] = useState(new Date()); // Controls the calendar month view

    const [selectedPeriod, setSelectedPeriod] = useState<string>("");

    useEffect(() => {
        const artistParam = searchParams.get('artistId');
        if (artistParam) {
            const artistId = parseInt(artistParam);
            if (artists.find(a => a.id === artistId)) {
                setSelectedArtist(artistId);
                setStep(2);
            }
        }
    }, [searchParams]);

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    // Calendar Logic
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
        const newDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        // Using localized string for display logic
        const displayStr = newDate.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' });
        setSelectedDate(displayStr);
    };

    // Helper to check if a day is in the past
    const isPastDate = (day: number) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        return checkDate < today;
    };

    // Check if date is selected
    const isSelected = (day: number) => {
        if (!selectedDate) return false;
        // Reconstruct date object from viewDate and day
        const checkDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        const checkStr = checkDate.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' });
        return selectedDate === checkStr;
    };

    return (
        <div className="min-h-[85vh] p-4 md:p-8">
            <div className="w-full max-w-6xl mx-auto">

                {/* Header com Título */}
                <div className="text-center mb-8">
                    <h2 className="font-tattoo text-4xl md:text-5xl text-white mb-2">Agendamento</h2>
                    <p className="text-zinc-500 text-sm">Siga os passos para agendar sua sessão</p>
                </div>

                {/* Stepper Horizontal */}
                <div className="mb-10 bg-[#0d0d0d] border border-zinc-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between max-w-2xl mx-auto">
                        {['Profissional', 'Data e Turno', 'Detalhes', 'Confirmar'].map((label, idx) => {
                            const s = idx + 1;
                            const active = step === s;
                            const completed = step > s;

                            return (
                                <React.Fragment key={idx}>
                                    <div className="flex flex-col items-center gap-2">
                                        <div className={`size-10 rounded-full flex items-center justify-center text-sm font-black transition-all duration-300 border-2 ${active
                                            ? 'bg-primary border-primary text-white shadow-[0_0_20px_rgba(212,17,50,0.5)]'
                                            : completed
                                                ? 'bg-primary border-primary text-white'
                                                : 'bg-[#1a1a1a] border-zinc-700 text-zinc-500'
                                            }`}>
                                            {completed ? (
                                                <span className="material-symbols-outlined text-lg">check</span>
                                            ) : s}
                                        </div>
                                        <span className={`text-[10px] font-black uppercase tracking-wider hidden sm:block ${active ? 'text-white' : completed ? 'text-zinc-400' : 'text-zinc-600'}`}>
                                            {label}
                                        </span>
                                    </div>
                                    {idx < 3 && (
                                        <div className={`flex-1 h-[2px] mx-2 transition-colors duration-300 ${completed ? 'bg-primary' : 'bg-zinc-800'}`} />
                                    )}
                                </React.Fragment>
                            )
                        })}
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-[#0a0a0a] border border-zinc-800 rounded-3xl overflow-hidden">
                    <div className="p-6 md:p-10">
                        {step === 1 && (
                            <div className="animate-fade-in">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                    <div>
                                        <h3 className="text-2xl font-display font-bold text-white mb-1">Escolha seu Profissional</h3>
                                        <p className="text-zinc-500 text-sm">Selecione o artista que melhor se adapta ao seu projeto.</p>
                                    </div>
                                    <button onClick={() => navigate('/match')} className="text-primary hover:text-white text-[10px] font-black uppercase tracking-widest border border-primary/20 px-4 py-2 rounded-lg hover:bg-primary/10 transition-all whitespace-nowrap">
                                        Ajuda para escolher
                                    </button>
                                </div>

                                {/* Grid de Cards Compactos */}
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {artists.map(artist => (
                                        <div
                                            key={artist.id}
                                            onClick={() => setSelectedArtist(artist.id)}
                                            className={`relative p-4 rounded-2xl border cursor-pointer transition-all duration-300 group ${selectedArtist === artist.id
                                                ? 'bg-[#121212] border-primary shadow-[0_0_25px_rgba(212,17,50,0.15)]'
                                                : 'bg-[#121212] border-zinc-800 hover:border-zinc-600'
                                                }`}
                                        >
                                            {/* Checkbox de seleção */}
                                            {selectedArtist === artist.id && (
                                                <div className="absolute top-3 right-3 size-6 bg-primary rounded-full flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-white text-sm">check</span>
                                                </div>
                                            )}

                                            {/* Foto */}
                                            <img
                                                src={artist.img}
                                                alt={artist.name}
                                                className="w-full aspect-square rounded-xl object-cover bg-zinc-900 mb-3 group-hover:scale-[1.02] transition-transform"
                                            />

                                            {/* Info */}
                                            <h4 className="font-bold text-white text-sm truncate mb-1">{artist.name}</h4>
                                            <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-black truncate mb-2">{artist.role}</p>

                                            {/* Rating e Preço */}
                                            <div className="flex items-center justify-between">
                                                <RatingDisplay rating={artist.rating} count={artist.ratingCount} size="11px" />
                                                <span className="text-primary font-black text-xs">R${artist.price}/h</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="animate-fade-in">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Coluna Esquerda: Calendário */}
                                    <div>
                                        <h3 className="text-2xl font-display font-bold text-white mb-1">Data</h3>
                                        <p className="text-zinc-500 mb-6 text-sm">Selecione o dia ideal.</p>

                                        <div className="bg-[#121212] border border-zinc-800 rounded-2xl p-6 select-none">
                                            {/* Calendar Header */}
                                            <div className="flex items-center justify-between mb-6">
                                                <button onClick={handlePrevMonth} className="text-zinc-400 hover:text-white p-2">
                                                    <span className="material-symbols-outlined">chevron_left</span>
                                                </button>
                                                <span className="text-white font-bold capitalize">
                                                    {viewDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                                                </span>
                                                <button onClick={handleNextMonth} className="text-zinc-400 hover:text-white p-2">
                                                    <span className="material-symbols-outlined">chevron_right</span>
                                                </button>
                                            </div>

                                            {/* Calendar Grid */}
                                            <div className="grid grid-cols-7 gap-1 text-center mb-2">
                                                {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
                                                    <span key={i} className="text-[10px] font-black text-zinc-600 uppercase">{d}</span>
                                                ))}
                                            </div>
                                            <div className="grid grid-cols-7 gap-2">
                                                {/* Empty slots for start of month */}
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
                                                            disabled={disabled}
                                                            onClick={() => handleDateSelect(day)}
                                                            className={`
                                                                size-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-300
                                                                ${selected
                                                                    ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                                                                    : disabled
                                                                        ? 'text-zinc-700 cursor-not-allowed'
                                                                        : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                                                                }
                                                            `}
                                                        >
                                                            {day}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Coluna Direita: Períodos */}
                                    <div className={`flex flex-col transition-all duration-500 ${selectedDate ? 'opacity-100' : 'opacity-30 pointer-events-none'}`}>
                                        <h3 className="text-2xl font-display font-bold text-white mb-1">Período</h3>
                                        <p className="text-zinc-500 mb-6 text-sm">Escolha seu turno de preferência.</p>

                                        <div className="flex flex-col gap-3">
                                            {periods.map(period => (
                                                <button
                                                    key={period.id}
                                                    onClick={() => setSelectedPeriod(period.id)}
                                                    className={`flex items-center justify-between p-5 rounded-2xl border transition-all duration-300 group ${selectedPeriod === period.id
                                                        ? 'bg-[#121212] border-primary text-white shadow-[0_0_20px_rgba(212,17,50,0.2)]'
                                                        : 'bg-[#121212] border-zinc-800 text-zinc-400 hover:border-primary hover:text-white'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <span className={`material-symbols-outlined text-3xl ${selectedPeriod === period.id ? 'text-primary' : 'text-zinc-600 group-hover:text-primary'}`}>
                                                            {period.icon}
                                                        </span>
                                                        <div className="text-left">
                                                            <span className="block font-black text-base uppercase tracking-wide">{period.label}</span>
                                                            <span className={`text-xs font-bold ${selectedPeriod === period.id ? 'text-zinc-300' : 'text-zinc-600'}`}>{period.range}</span>
                                                        </div>
                                                    </div>
                                                    {selectedPeriod === period.id && (
                                                        <span className="material-symbols-outlined text-primary text-2xl">check_circle</span>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="animate-fade-in max-w-2xl mx-auto">
                                <h3 className="text-2xl font-display font-bold text-white mb-1">Detalhes do Projeto</h3>
                                <p className="text-zinc-500 mb-8 text-sm">Conte-nos um pouco mais sobre o que você deseja.</p>

                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">DESCRIÇÃO DO PROJETO</label>
                                        <textarea
                                            rows={5}
                                            className="w-full bg-[#121212] border border-zinc-800 rounded-2xl p-5 text-white focus:border-primary focus:ring-1 focus:ring-primary placeholder-zinc-700 transition-all resize-none text-sm leading-relaxed"
                                            placeholder="Descreva o local do corpo, tamanho aproximado em cm e a ideia da arte..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">REFERÊNCIAS</label>
                                            <button className="w-full h-32 border border-dashed border-zinc-700 rounded-2xl flex flex-col items-center justify-center text-zinc-500 hover:text-white hover:border-primary hover:bg-white/5 transition-all gap-2">
                                                <span className="material-symbols-outlined text-2xl">add_photo_alternate</span>
                                                <span className="text-xs font-bold uppercase tracking-wide">Adicionar Fotos</span>
                                            </button>
                                        </div>
                                        <div className="p-5 rounded-2xl bg-[#121212] border border-zinc-800 flex flex-col justify-center gap-3">
                                            <div className="flex items-center gap-2 text-primary">
                                                <span className="material-symbols-outlined">info</span>
                                                <span className="text-xs font-black uppercase tracking-wider">Importante</span>
                                            </div>
                                            <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                                                Entraremos em contato via WhatsApp para confirmar o horário exato dentro do período <strong>{selectedPeriod}</strong>, ver as referências e enviar o orçamento final.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="animate-fade-in flex flex-col items-center justify-center py-16 text-center">
                                <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(212,17,50,0.2)]">
                                    <span className="material-symbols-outlined text-5xl text-primary animate-pulse">check_circle</span>
                                </div>
                                <h3 className="font-tattoo text-4xl md:text-5xl text-white mb-4">Solicitação Enviada!</h3>
                                <p className="text-zinc-400 max-w-md mx-auto text-sm leading-relaxed mb-10">
                                    Seu pedido foi encaminhado para <strong className="text-white">{artists.find(a => a.id === selectedArtist)?.name}</strong>.
                                    <br />Você receberá uma confirmação via WhatsApp e E-mail em breve com o orçamento e horário definido.
                                </p>
                                <button
                                    onClick={() => navigate('/my-appointments')}
                                    className="text-white border border-zinc-700 hover:bg-white hover:text-black px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all"
                                >
                                    Voltar ao Início
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Footer Navigation */}
                    {step < 4 && (
                        <div className="px-6 md:px-10 py-6 border-t border-zinc-800 flex justify-between items-center bg-[#0d0d0d]">
                            {step > 1 ? (
                                <button onClick={handleBack} className="text-zinc-500 hover:text-white font-black uppercase text-[10px] tracking-[0.2em] px-4 py-2 transition-colors flex items-center gap-2">
                                    <span className="material-symbols-outlined text-base">arrow_back</span>
                                    VOLTAR
                                </button>
                            ) : <div />}

                            <button
                                onClick={handleNext}
                                disabled={step === 1 && !selectedArtist || step === 2 && (!selectedDate || !selectedPeriod)}
                                className={`px-8 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[11px] transition-all flex items-center gap-2 bg-primary hover:bg-primary-hover text-white shadow-[0_0_25px_rgba(212,17,50,0.4)] hover:shadow-[0_0_35px_rgba(212,17,50,0.6)] disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none`}
                            >
                                {step === 3 ? 'ENVIAR SOLICITAÇÃO' : 'CONTINUAR'}
                                {step !== 3 && <span className="material-symbols-outlined text-base">arrow_forward</span>}
                            </button>
                        </div>
                    )}
                </div>

                {/* Resumo Selecionado (Fixo na parte inferior em Mobile) */}
                {step < 4 && selectedArtist && (
                    <div className="mt-6 bg-[#0d0d0d] border border-zinc-800 rounded-2xl p-5 flex items-center gap-4">
                        <img
                            src={artists.find(a => a.id === selectedArtist)?.img}
                            alt="Artista"
                            className="size-14 rounded-xl object-cover border border-zinc-700"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black mb-1">Resumo</p>
                            <p className="text-white font-bold truncate">{artists.find(a => a.id === selectedArtist)?.name}</p>
                            <p className="text-sm text-zinc-400 truncate">
                                {selectedDate ? `${selectedDate} • ${selectedPeriod || 'Turno a definir'}` : 'Data a definir'}
                            </p>
                        </div>
                        <div className="text-right shrink-0">
                            <p className="text-primary font-black text-lg">R$ {artists.find(a => a.id === selectedArtist)?.price}/h</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Booking;
