
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RatingDisplay } from '../Staff';

const artists = [
   { id: 1, name: "Alex Rivera", role: "Especialista em Realismo", price: 150, rating: 4.7, ratingCount: 2899, img: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=200" },
   { id: 2, name: "Sarah Vane", role: "Neo Tradicional", price: 130, rating: 5.0, ratingCount: 1450, img: "https://images.unsplash.com/photo-1596204368623-2895f543666f?auto=format&fit=crop&q=80&w=200" },
   { id: 3, name: "Mike Chen", role: "Oriental", price: 180, rating: 4.2, ratingCount: 920, img: "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&q=80&w=200" },
   { id: 4, name: "Elena Rosa", role: "Fine Line", price: 120, rating: 4.8, ratingCount: 1105, img: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?q=80&w=200&auto=format&fit=crop" }
];

const timeSlots = ["10:00", "11:00", "13:00", "14:30", "16:00", "18:00"];

const Booking: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [selectedArtist, setSelectedArtist] = useState<number | null>(null);
  
  // Date State
  const [selectedDate, setSelectedDate] = useState<string>(""); // Format: YYYY-MM-DD
  const [viewDate, setViewDate] = useState(new Date()); // Controls the calendar month view
  
  const [selectedTime, setSelectedTime] = useState<string>("");

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
      // Format YYYY-MM-DD manually to avoid timezone issues or use ISO split
      const dateStr = newDate.toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' });
      // Store as pt-BR string for display consistency with previous logic, or ISO
      // Using localized string for display logic later
      const displayStr = newDate.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' });
      setSelectedDate(displayStr);
  };

  // Helper to check if a day is in the past
  const isPastDate = (day: number) => {
      const today = new Date();
      today.setHours(0,0,0,0);
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
    <div className="min-h-[85vh] flex items-center justify-center p-4 md:p-8">
       <div className="w-full max-w-5xl bg-[#0a0a0a] border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row min-h-[650px]">
          
          {/* Progress Sidebar - FIXED LAYOUT */}
          <div className="w-full md:w-80 bg-[#0d0d0d] p-8 md:p-10 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col relative overflow-hidden shrink-0">
             
             {/* Header */}
             <div className="relative z-10 mb-10">
                <h2 className="font-tattoo text-4xl text-white tracking-wide">Agendamento</h2>
             </div>

             {/* Steps Container */}
             <div className="relative z-10 flex-1">
                <div className="relative flex flex-col gap-10 pl-2">
                    {/* Linha de fundo (cinza) - Posicionada Absolutamente em relação ao container das bolinhas */}
                    <div className="absolute left-[13px] top-4 bottom-4 w-[2px] bg-zinc-800/50 -z-10"></div>
                    
                    {/* Linha de progresso (vermelha) */}
                    <div 
                        className="absolute left-[13px] top-4 w-[2px] bg-primary transition-all duration-500 ease-in-out -z-10"
                        style={{ height: `${Math.max(0, (step - 1) * 33.33)}%` }} // Aproximadamente 33% por passo num gap-10
                    ></div>

                    {['PROFISSIONAL', 'DATA', 'DETALHES', 'CONFIRMAR'].map((label, idx) => {
                        const s = idx + 1;
                        const active = step === s;
                        const completed = step > s;
                        
                        return (
                            <div key={idx} className="flex items-center gap-5">
                                <div className={`size-[28px] rounded-full flex shrink-0 items-center justify-center text-xs font-black transition-all duration-500 border-[2px] z-20 ${
                                    active 
                                    ? 'bg-primary border-primary text-white scale-110 shadow-[0_0_15px_rgba(212,17,50,0.5)]' 
                                    : completed 
                                        ? 'bg-primary border-primary text-white' 
                                        : 'bg-[#1a1a1a] border-zinc-700 text-zinc-600'
                                }`}>
                                    {completed ? (
                                        <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                                    ) : s}
                                </div>
                                <span className={`text-[11px] font-black uppercase tracking-[0.15em] transition-colors duration-300 ${
                                    active ? 'text-white' : completed ? 'text-white' : 'text-zinc-600'
                                }`}>{label}</span>
                            </div>
                        )
                    })}
                </div>
             </div>
             
             {/* Resumo */}
             <div className="pt-8 border-t border-zinc-800 relative z-10 mt-auto">
                 <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-black mb-4">RESUMO</p>
                 <div className="space-y-1.5">
                     <p className="text-base font-bold text-white leading-tight">
                        {selectedArtist ? artists.find(a => a.id === selectedArtist)?.name : 'Selecione um Artista'}
                     </p>
                     <p className="text-sm text-zinc-400 font-medium">
                         {selectedDate ? `${selectedDate.toLowerCase()} às ${selectedTime || '--:--'}` : 'Data a definir'}
                     </p>
                 </div>
             </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6 md:p-12 relative bg-[#0a0a0a] flex flex-col overflow-y-auto">
             <div className="flex-1">
                 {step === 1 && (
                     <div className="animate-fade-in">
                         <div className="flex justify-between items-center mb-4">
                            <h3 className="text-3xl font-display font-bold text-white">Profissional</h3>
                            <button onClick={() => navigate('/match')} className="text-primary hover:text-white text-[10px] font-black uppercase tracking-widest border border-primary/20 px-4 py-2 rounded-lg hover:bg-primary/10 transition-all">
                                Ajuda para escolher
                            </button>
                         </div>
                         <p className="text-zinc-500 mb-8 text-sm max-w-md">Escolha o artista que melhor se adapta ao estilo do seu projeto.</p>
                         
                         <div className="grid grid-cols-1 gap-4">
                             {artists.map(artist => (
                                 <div 
                                    key={artist.id} 
                                    onClick={() => setSelectedArtist(artist.id)}
                                    className={`flex items-center gap-5 p-5 rounded-2xl border cursor-pointer transition-all duration-300 group ${
                                        selectedArtist === artist.id 
                                        ? 'bg-[#121212] border-primary shadow-[0_0_20px_rgba(212,17,50,0.1)]' 
                                        : 'bg-[#121212] border-zinc-800 hover:border-zinc-600'
                                    }`}
                                 >
                                     <img src={artist.img} alt={artist.name} className="size-16 rounded-xl object-cover bg-zinc-900 shrink-0 border border-zinc-700 group-hover:scale-105 transition-transform" />
                                     <div className="flex-1 min-w-0">
                                         <h4 className="font-bold text-white text-lg truncate mb-1">{artist.name}</h4>
                                         <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                            <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-black truncate">{artist.role}</p>
                                            <RatingDisplay rating={artist.rating} count={artist.ratingCount} size="13px" />
                                         </div>
                                     </div>
                                     <div className="text-right shrink-0">
                                         <span className="block text-white font-black text-lg">R$ {artist.price}/h</span>
                                         <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">A partir de</span>
                                     </div>
                                 </div>
                             ))}
                         </div>
                     </div>
                 )}

                 {step === 2 && (
                     <div className="animate-fade-in flex flex-col md:flex-row gap-8">
                         {/* Coluna Esquerda: Calendário */}
                         <div className="flex-1">
                             <h3 className="text-3xl font-display font-bold text-white mb-2">Data</h3>
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
                                    {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map(d => (
                                        <span key={d} className="text-[10px] font-black text-zinc-600 uppercase">{d}</span>
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

                         {/* Coluna Direita: Horários (Só aparece se data selecionada) */}
                         <div className={`md:w-48 transition-all duration-500 ${selectedDate ? 'opacity-100 translate-x-0' : 'opacity-30 translate-x-4 pointer-events-none'}`}>
                            <h3 className="text-3xl font-display font-bold text-white mb-2">Hora</h3>
                             <p className="text-zinc-500 mb-6 text-sm">Disponibilidade.</p>

                            <div className="flex flex-col gap-3">
                                {timeSlots.map(time => (
                                    <button 
                                        key={time} 
                                        onClick={() => setSelectedTime(time)} 
                                        className={`py-3 rounded-xl border text-sm font-black transition-all duration-300 ${selectedTime === time ? 'bg-white text-black border-white shadow-lg scale-105' : 'bg-transparent border-zinc-800 text-white hover:border-primary hover:text-primary'}`}
                                    >
                                        {time}
                                    </button>
                                ))}
                            </div>
                         </div>
                     </div>
                 )}

                 {step === 3 && (
                     <div className="animate-fade-in">
                         <h3 className="text-3xl font-display font-bold text-white mb-2">Detalhes</h3>
                         <p className="text-zinc-500 mb-10 text-sm">Conte-nos um pouco mais sobre o projeto.</p>
                         
                         <div className="space-y-8">
                             <div className="space-y-3">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">DESCRIÇÃO DO PROJETO</label>
                                <textarea 
                                    rows={6}
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
                                         Entraremos em contato via WhatsApp para confirmar os detalhes, ver as referências e enviar o orçamento final antes da sessão.
                                     </p>
                                 </div>
                             </div>
                         </div>
                     </div>
                 )}

                 {step === 4 && (
                     <div className="animate-fade-in flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                         <div className="size-24 rounded-full bg-primary/10 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(212,17,50,0.2)]">
                             <span className="material-symbols-outlined text-5xl text-primary animate-pulse">check_circle</span>
                         </div>
                         <h3 className="font-tattoo text-5xl text-white mb-4">Solicitação Enviada!</h3>
                         <p className="text-zinc-400 max-w-md mx-auto text-sm leading-relaxed mb-10">
                             Seu pedido foi encaminhado para <strong className="text-white">{artists.find(a => a.id === selectedArtist)?.name}</strong>. 
                             <br/>Você receberá uma confirmação via WhatsApp e E-mail em breve com o orçamento.
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

             {/* Footer Navigation - Always at bottom via flex-col + mt-auto */}
             {step < 4 && (
                <div className="mt-auto pt-10 border-t border-zinc-900/50 flex justify-between items-center">
                    {step > 1 ? (
                        <button onClick={handleBack} className="text-zinc-500 hover:text-white font-black uppercase text-[10px] tracking-[0.2em] px-4 py-2 transition-colors flex items-center gap-2">
                            <span className="material-symbols-outlined text-base">arrow_back</span>
                            VOLTAR
                        </button>
                    ) : <div />}
                    
                    <button 
                        onClick={handleNext}
                        disabled={step === 1 && !selectedArtist || step === 2 && (!selectedDate || !selectedTime)}
                        className={`px-10 py-4 rounded-xl font-black uppercase tracking-[0.2em] text-[11px] transition-all flex items-center gap-2 ${
                            step === 3 
                            ? 'bg-primary hover:bg-primary-hover text-white shadow-[0_0_25px_rgba(212,17,50,0.4)] hover:shadow-[0_0_35px_rgba(212,17,50,0.6)] hover:-translate-y-0.5' 
                            : 'bg-white text-black hover:bg-zinc-200 shadow-lg shadow-white/10'
                        } disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none`}
                    >
                        {step === 3 ? 'ENVIAR SOLICITAÇÃO' : 'CONTINUAR'}
                        {step !== 3 && <span className="material-symbols-outlined text-base">arrow_forward</span>}
                    </button>
                </div>
             )}
          </div>
       </div>
    </div>
  );
};

export default Booking;
