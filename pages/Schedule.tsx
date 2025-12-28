
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface ScheduleItem {
  id: number;
  time: string;
  endTime: string;
  clientName: string;
  clientAvatar: string;
  artistName: string;
  service: string;
  status: 'confirmado' | 'pendente' | 'em-andamento' | 'cancelado' | 'rescheduling';
  type: 'tattoo' | 'piercing' | 'orcamento';
  rescheduleInfo?: {
      newDate: string;
      newTime: string;
      reason: string;
      requestedBy: 'artist' | 'client';
  };
}

const initialSchedule: ScheduleItem[] = [
  {
    id: 1,
    time: "10:00",
    endTime: "13:00",
    clientName: "Marcus Thorn",
    clientAvatar: "https://i.pravatar.cc/150?u=1",
    artistName: "Alex Rivera",
    service: "Fechamento de Braço",
    status: "em-andamento",
    type: "tattoo"
  },
  {
    id: 2,
    time: "11:00",
    endTime: "12:00",
    clientName: "Sarah Jones",
    clientAvatar: "https://i.pravatar.cc/150?u=5",
    artistName: "Sarah Vane",
    service: "Rosas Ombro",
    status: "confirmado",
    type: "tattoo"
  },
  {
    id: 3,
    time: "14:00",
    endTime: "16:00",
    clientName: "Jessica Rabbit",
    clientAvatar: "https://i.pravatar.cc/150?u=3",
    artistName: "Alex Rivera",
    service: "Design Cobertura",
    status: "pendente",
    type: "orcamento"
  },
  {
    id: 6,
    time: "16:30",
    endTime: "17:30",
    clientName: "Ana Silva",
    clientAvatar: "https://i.pravatar.cc/150?u=9",
    artistName: "Alex Rivera",
    service: "Fine Line Floral",
    status: "rescheduling",
    type: "tattoo",
    rescheduleInfo: {
        newDate: "2025-12-22",
        newTime: "09:00",
        reason: "Cliente solicitou mudança por imprevisto no trabalho.",
        requestedBy: "client"
    }
  },
  {
    id: 4,
    time: "15:00",
    endTime: "15:30",
    clientName: "Mike Ross",
    clientAvatar: "https://i.pravatar.cc/150?u=8",
    artistName: "Mike Chen",
    service: "Perfuração Septo",
    status: "confirmado",
    type: "piercing"
  },
  {
    id: 5,
    time: "17:00",
    endTime: "19:00",
    clientName: "John Doe",
    clientAvatar: "https://i.pravatar.cc/150?u=4",
    artistName: "Sarah Vane",
    service: "Old School Adaga",
    status: "cancelado",
    type: "tattoo"
  }
];

// Helper to generate next 7 days
const getNextDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        days.push({
            dateObj: date,
            dayName: date.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '').toUpperCase(),
            dayNumber: date.getDate(),
            fullDate: date.toISOString().split('T')[0] // YYYY-MM-DD
        });
    }
    return days;
};

const availableTimeSlots = ["10:00", "11:00", "13:00", "14:30", "16:00", "18:00"];

const Schedule: React.FC = () => {
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState<ScheduleItem[]>(initialSchedule);
  const [role, setRole] = useState<string | null>(null);
  const [filterArtist, setFilterArtist] = useState<string>('Todos');

  // Menu Dropdown State
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Cancel Modal State
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [itemToCancel, setItemToCancel] = useState<number | null>(null);
  const [cancellationData, setCancellationData] = useState({ reason: '', note: '' });

  // Reschedule Modal State
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [itemToReschedule, setItemToReschedule] = useState<number | null>(null);
  const [rescheduleData, setRescheduleData] = useState({ newDate: '', newTime: '', reason: '' });

  // View Details Modal (for Rescheduling)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ScheduleItem | null>(null);

  const nextDays = getNextDays();

  const cancellationReasons = [
      "Imprevisto pessoal do tatuador",
      "Cliente solicitou cancelamento",
      "Problema de saúde",
      "Conflito de agenda",
      "Outros"
  ];

  useEffect(() => {
    const userRole = localStorage.getItem('ink_role');
    setRole(userRole);
    
    if (userRole === 'artist') {
        setFilterArtist('Alex Rivera'); 
    }

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

  const handleCardClick = (id: number) => {
      navigate(`/admin/appointment/${id}`);
  };

  const toggleMenu = (id: number, e: React.MouseEvent) => {
      e.stopPropagation();
      setActiveMenuId(activeMenuId === id ? null : id);
  };

  const handleOpenCancel = (id: number) => {
      setItemToCancel(id);
      setCancellationData({ reason: cancellationReasons[0], note: '' });
      setIsCancelModalOpen(true);
      setActiveMenuId(null);
  };

  const handleOpenReschedule = (id: number) => {
      setItemToReschedule(id);
      setRescheduleData({ newDate: '', newTime: '', reason: '' });
      setIsRescheduleModalOpen(true);
      setActiveMenuId(null);
  };

  const handleViewRescheduleDetails = (item: ScheduleItem) => {
      setSelectedItem(item);
      setIsDetailsModalOpen(true);
      setActiveMenuId(null);
  };

  const confirmCancel = (e: React.FormEvent) => {
      e.preventDefault();
      if (itemToCancel) {
          setSchedule(prev => prev.map(item => 
              item.id === itemToCancel ? { ...item, status: 'cancelado' } : item
          ));
          setIsCancelModalOpen(false);
          setItemToCancel(null);
          alert("Agendamento cancelado e notificação enviada.");
      }
  };

  const confirmReschedule = (e: React.FormEvent) => {
      e.preventDefault();
      if (itemToReschedule) {
          if (!rescheduleData.newDate || !rescheduleData.newTime) {
              alert("Por favor, selecione uma data e um horário.");
              return;
          }
          
          // Format date for display
          const dateObj = new Date(rescheduleData.newDate);
          const formattedDate = dateObj.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' });

          setSchedule(prev => prev.map(item => 
              item.id === itemToReschedule ? { 
                  ...item, 
                  status: 'rescheduling',
                  rescheduleInfo: {
                      newDate: formattedDate,
                      newTime: rescheduleData.newTime,
                      reason: rescheduleData.reason,
                      requestedBy: 'artist'
                  }
              } : item
          ));
          setIsRescheduleModalOpen(false);
          setItemToReschedule(null);
          alert("Solicitação de reagendamento enviada para o cliente.");
      }
  };

  const handleReport = (item: ScheduleItem) => {
      alert(`Reportando incidente com o cliente ${item.clientName}. O suporte entrará em contato.`);
      setActiveMenuId(null);
  };

  // Filter Logic
  const filteredSchedule = schedule
    .filter(item => {
        if (role === 'artist') return item.artistName === 'Alex Rivera'; 
        if (filterArtist === 'Todos') return true;
        return item.artistName === filterArtist;
    })
    .sort((a, b) => a.time.localeCompare(b.time));

  const getStatusStyle = (status: string) => {
      switch(status) {
          case 'confirmado': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
          case 'em-andamento': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 animate-pulse';
          case 'pendente': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
          case 'rescheduling': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
          case 'cancelado': return 'bg-red-500/10 text-red-500 border-red-500/20 opacity-60';
          default: return 'bg-surface-light text-text-muted';
      }
  };

  const getTypeIcon = (type: string) => {
      switch(type) {
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
           <h1 className="font-tattoo text-4xl text-white mb-2">Agenda do Dia</h1>
           <p className="text-text-muted text-sm">
               {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
           </p>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
           <div className="flex items-center gap-2 bg-surface-dark border border-border-dark rounded-lg p-1 mr-2">
              <button className="p-2 hover:bg-white/10 rounded text-text-muted hover:text-white transition-colors">
                 <span className="material-symbols-outlined text-lg">chevron_left</span>
              </button>
              <span className="text-sm font-bold text-white px-2">Hoje</span>
              <button className="p-2 hover:bg-white/10 rounded text-text-muted hover:text-white transition-colors">
                 <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
           </div>

           <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg shadow-primary/20 transition-all flex items-center gap-2 whitespace-nowrap">
              <span className="material-symbols-outlined text-lg">add</span>
              <span className="hidden sm:inline">Novo Agendamento</span>
           </button>
        </div>
      </div>

      {/* Admin Filters */}
      {role === 'admin' && (
          <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
              {['Todos', 'Alex Rivera', 'Sarah Vane', 'Mike Chen'].map(artist => (
                  <button
                    key={artist}
                    onClick={() => setFilterArtist(artist)}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide border transition-all whitespace-nowrap ${
                        filterArtist === artist 
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
                  <p className="text-text-muted text-sm">Nenhum agendamento encontrado para este filtro.</p>
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
                        <div className={`size-8 rounded-full flex items-center justify-center ${
                            item.type === 'tattoo' ? 'bg-purple-500/20 text-purple-500' : 
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
                                            {item.status === 'rescheduling' && (
                                                <button 
                                                    onClick={() => handleViewRescheduleDetails(item)}
                                                    className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10 rounded-lg flex items-center gap-2 font-medium"
                                                >
                                                    <span className="material-symbols-outlined text-orange-500 text-lg">info</span>
                                                    Ver Detalhes
                                                </button>
                                            )}
                                            
                                            {item.status !== 'cancelado' && item.status !== 'em-andamento' && (
                                                <button 
                                                    onClick={() => handleOpenReschedule(item.id)}
                                                    className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10 rounded-lg flex items-center gap-2 font-medium"
                                                >
                                                    <span className="material-symbols-outlined text-blue-400 text-lg">edit_calendar</span>
                                                    Remarcar
                                                </button>
                                            )}

                                            {item.status !== 'cancelado' && (
                                                <button 
                                                    onClick={() => handleOpenCancel(item.id)}
                                                    className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-2 font-medium"
                                                >
                                                    <span className="material-symbols-outlined text-lg">block</span>
                                                    Cancelar
                                                </button>
                                            )}
                                            
                                            <div className="h-px bg-white/10 my-1"></div>
                                            
                                            <button 
                                                onClick={() => handleReport(item)}
                                                className="w-full text-left px-3 py-2 text-sm text-text-muted hover:text-white hover:bg-white/10 rounded-lg flex items-center gap-2 font-medium"
                                            >
                                                <span className="material-symbols-outlined text-lg">flag</span>
                                                Reportar Cliente
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

      {/* Cancel Modal */}
      {isCancelModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={(e) => e.stopPropagation()}>
              <div className="bg-surface-dark border border-border-dark rounded-2xl w-full max-w-md shadow-2xl relative animate-fade-in">
                  <form onSubmit={confirmCancel}>
                      <div className="p-6 border-b border-border-dark flex justify-between items-center bg-red-500/5 rounded-t-2xl">
                          <div className="flex items-center gap-2 text-red-500">
                               <span className="material-symbols-outlined">event_busy</span>
                               <h3 className="text-xl font-bold">Cancelar Agendamento</h3>
                          </div>
                          <button type="button" onClick={() => setIsCancelModalOpen(false)} className="text-text-muted hover:text-white"><span className="material-symbols-outlined">close</span></button>
                      </div>
                      <div className="p-6">
                          <p className="text-text-muted text-sm mb-4">Informe o motivo do cancelamento para registro.</p>
                          
                          <div className="space-y-4">
                              <div>
                                  <label className="text-xs font-bold text-text-muted uppercase mb-1 block">Motivo Principal</label>
                                  <select 
                                    value={cancellationData.reason}
                                    onChange={(e) => setCancellationData({...cancellationData, reason: e.target.value})}
                                    className="w-full bg-background-dark border border-border-dark rounded-lg p-2.5 text-white text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                  >
                                      {cancellationReasons.map(r => <option key={r} value={r}>{r}</option>)}
                                  </select>
                              </div>
                              <div>
                                  <label className="text-xs font-bold text-text-muted uppercase mb-1 block">Detalhes / Observações</label>
                                  <textarea 
                                      required
                                      value={cancellationData.note}
                                      onChange={(e) => setCancellationData({...cancellationData, note: e.target.value})}
                                      className="w-full bg-background-dark border border-border-dark rounded-lg p-3 text-white text-sm focus:border-red-500 placeholder-zinc-700 focus:ring-1 focus:ring-red-500"
                                      rows={4}
                                      placeholder="Ex: Cliente informou imprevisto de saúde..."
                                  ></textarea>
                              </div>
                          </div>
                      </div>
                      <div className="p-6 border-t border-border-dark flex justify-end gap-3 bg-background-dark rounded-b-2xl">
                          <button type="button" onClick={() => setIsCancelModalOpen(false)} className="px-4 py-2 text-text-muted hover:text-white font-bold text-sm">Voltar</button>
                          <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold text-sm uppercase tracking-wide transition-colors shadow-lg shadow-red-900/20">
                              Confirmar Cancelamento
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* Reschedule Modal (Visual Customizado) */}
      {isRescheduleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={(e) => e.stopPropagation()}>
              <div className="bg-surface-dark border border-border-dark rounded-2xl w-full max-w-lg shadow-2xl relative animate-fade-in flex flex-col max-h-[90vh]">
                  <form onSubmit={confirmReschedule} className="flex flex-col h-full">
                      <div className="p-6 border-b border-border-dark flex justify-between items-center bg-surface-dark rounded-t-2xl">
                          <div>
                              <h3 className="text-2xl font-display font-bold text-white mb-1">Disponibilidade</h3>
                              <p className="text-text-muted text-xs">Selecione uma nova data e horário.</p>
                          </div>
                          <button type="button" onClick={() => setIsRescheduleModalOpen(false)} className="text-text-muted hover:text-white"><span className="material-symbols-outlined">close</span></button>
                      </div>
                      
                      <div className="p-6 overflow-y-auto space-y-8 flex-1">
                          
                          {/* Date Selection */}
                          <div>
                              <label className="text-xs font-bold text-text-muted uppercase tracking-widest block mb-3">Escolha a Data</label>
                              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                                  {nextDays.map((day) => {
                                      const isSelected = rescheduleData.newDate === day.fullDate;
                                      return (
                                          <button
                                              key={day.fullDate}
                                              type="button"
                                              onClick={() => setRescheduleData({...rescheduleData, newDate: day.fullDate})}
                                              className={`flex flex-col items-center justify-center min-w-[80px] h-24 rounded-xl border transition-all ${
                                                  isSelected 
                                                  ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105' 
                                                  : 'bg-surface-light/30 border-border-dark text-text-muted hover:border-white/30 hover:bg-surface-light'
                                              }`}
                                          >
                                              <span className="text-[10px] font-bold uppercase tracking-wider mb-1 opacity-80">{day.dayName}</span>
                                              <span className="text-3xl font-display font-bold">{day.dayNumber}</span>
                                          </button>
                                      );
                                  })}
                              </div>
                          </div>

                          {/* Time Selection */}
                          <div>
                              <label className="text-xs font-bold text-text-muted uppercase tracking-widest block mb-3">Horários Disponíveis</label>
                              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                  {availableTimeSlots.map((time) => (
                                      <button
                                          key={time}
                                          type="button"
                                          onClick={() => setRescheduleData({...rescheduleData, newTime: time})}
                                          className={`py-2 px-3 rounded-lg border text-sm font-bold transition-all ${
                                              rescheduleData.newTime === time 
                                              ? 'bg-white text-black border-white shadow-lg' 
                                              : 'bg-transparent border-border-dark text-white hover:border-primary hover:text-primary'
                                          }`}
                                      >
                                          {time}
                                      </button>
                                  ))}
                              </div>
                          </div>

                          {/* Reason */}
                          <div>
                              <label className="text-xs font-bold text-text-muted uppercase mb-2 block">Motivo da Alteração</label>
                              <textarea 
                                  required
                                  value={rescheduleData.reason}
                                  onChange={(e) => setRescheduleData({...rescheduleData, reason: e.target.value})}
                                  className="w-full bg-background-dark border border-border-dark rounded-lg p-3 text-white text-sm focus:border-primary placeholder-zinc-700"
                                  rows={3}
                                  placeholder="Informe o motivo para o cliente..."
                              ></textarea>
                          </div>
                      </div>

                      <div className="p-6 border-t border-border-dark flex justify-end gap-3 bg-background-dark rounded-b-2xl">
                          <button type="button" onClick={() => setIsRescheduleModalOpen(false)} className="px-4 py-2 text-text-muted hover:text-white font-bold text-sm uppercase tracking-wide">Voltar</button>
                          <button type="submit" className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-lg font-bold text-sm uppercase tracking-wide transition-colors shadow-lg shadow-primary/20">
                              Continuar
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* Details Modal (For Rescheduling Info) */}
      {isDetailsModalOpen && selectedItem && selectedItem.rescheduleInfo && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={(e) => e.stopPropagation()}>
              <div className="bg-surface-dark border border-border-dark rounded-2xl w-full max-w-md shadow-2xl relative animate-fade-in">
                  <div className="p-6 border-b border-border-dark flex justify-between items-center bg-orange-500/5 rounded-t-2xl">
                       <div className="flex items-center gap-2 text-orange-500">
                           <span className="material-symbols-outlined">info</span>
                           <h3 className="text-xl font-bold">Solicitação de Mudança</h3>
                       </div>
                       <button onClick={() => setIsDetailsModalOpen(false)} className="text-text-muted hover:text-white"><span className="material-symbols-outlined">close</span></button>
                  </div>
                  <div className="p-6">
                      <div className="bg-surface-light/30 p-4 rounded-xl border border-white/5 mb-6">
                          <p className="text-xs text-text-muted uppercase font-bold mb-1">Solicitado por</p>
                          <p className="text-white font-bold capitalize">{selectedItem.rescheduleInfo.requestedBy === 'artist' ? 'Você (Tatuador)' : 'Cliente'}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                          <div>
                              <p className="text-xs text-text-muted uppercase font-bold mb-1">Nova Data</p>
                              <p className="text-lg font-bold text-white">{selectedItem.rescheduleInfo.newDate}</p>
                          </div>
                          <div>
                              <p className="text-xs text-text-muted uppercase font-bold mb-1">Novo Horário</p>
                              <p className="text-lg font-bold text-white">{selectedItem.rescheduleInfo.newTime}</p>
                          </div>
                      </div>

                      <div>
                          <p className="text-xs text-text-muted uppercase font-bold mb-2">Motivo</p>
                          <div className="bg-background-dark p-3 rounded-lg border border-border-dark text-sm text-text-light">
                              "{selectedItem.rescheduleInfo.reason}"
                          </div>
                      </div>
                  </div>
                  <div className="p-6 border-t border-border-dark flex justify-end gap-3 bg-background-dark rounded-b-2xl">
                        {/* Se foi o cliente que pediu, o tatuador pode aceitar ou recusar */}
                       <button onClick={() => setIsDetailsModalOpen(false)} className="px-4 py-2 text-text-muted hover:text-white font-bold text-sm">Fechar</button>
                       {selectedItem.rescheduleInfo.requestedBy === 'client' && (
                           <button onClick={() => {
                               // Lógica de aceitar
                               setIsDetailsModalOpen(false);
                               alert("Mudança aceita!");
                           }} className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-sm uppercase tracking-wide">
                               Confirmar Mudança
                           </button>
                       )}
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Schedule;
