
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
  status: 'confirmado' | 'pendente' | 'em-andamento' | 'cancelado' | 'rescheduling' | 'concluido';
  type: 'tattoo' | 'piercing' | 'orcamento';
  rescheduleInfo?: {
      newDate: string;
      newTime: string; // Will store "Manhã", "Tarde", "Noite"
      reason: string;
      requestedBy: 'artist' | 'client';
  };
}

const initialSchedule: ScheduleItem[] = [
  {
    id: 7,
    time: "09:00",
    endTime: "10:30",
    clientName: "Leticia Sabatella",
    clientAvatar: "https://i.pravatar.cc/150?u=30",
    artistName: "Alex Rivera",
    service: "Piercing Umbigo",
    status: "concluido",
    type: "piercing"
  },
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
        newTime: "Manhã",
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

const periods = [
    { id: 'Manhã', label: 'Manhã', range: '06h - 12h', icon: 'wb_twilight' },
    { id: 'Tarde', label: 'Tarde', range: '12h - 18h', icon: 'wb_sunny' },
    { id: 'Noite', label: 'Noite', range: '18h - 00h', icon: 'dark_mode' },
];

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
  const [rescheduleData, setRescheduleData] = useState({ newDate: '', newPeriod: '', reason: '' });

  // Calendar State
  const [viewDate, setViewDate] = useState(new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dateInput, setDateInput] = useState("");
  const calendarRef = useRef<HTMLDivElement>(null);

  // View Details Modal (for Rescheduling)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ScheduleItem | null>(null);

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
        if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
            setIsCalendarOpen(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Calendar Logic ---
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
          const daysInMonth = new Date(year, month, 0).getDate();
          
          if (month < 1 || month > 12 || day < 1 || day > daysInMonth) {
              setRescheduleData({...rescheduleData, newDate: ''}); // Data inválida
              return;
          }

          const testDate = new Date(year, month - 1, day);
          const today = new Date();
          today.setHours(0,0,0,0);

          if (testDate >= today) {
              const isoDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              setRescheduleData({...rescheduleData, newDate: isoDate});
              setViewDate(testDate);
          } else {
              setRescheduleData({...rescheduleData, newDate: ''}); // Data no passado
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
      setRescheduleData({ newDate: '', newPeriod: '', reason: '' });
      setDateInput("");
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
          if (!rescheduleData.newDate || !rescheduleData.newPeriod) {
              alert("Por favor, selecione uma data e um período.");
              return;
          }
          
          // Format date for display
          const [y, m, d] = rescheduleData.newDate.split('-');
          const dateObj = new Date(parseInt(y), parseInt(m)-1, parseInt(d));
          const formattedDate = dateObj.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' });

          setSchedule(prev => prev.map(item => 
              item.id === itemToReschedule ? { 
                  ...item, 
                  status: 'rescheduling',
                  rescheduleInfo: {
                      newDate: formattedDate,
                      newTime: rescheduleData.newPeriod, // Saving period label instead of exact time
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
    .filter(item => item.status !== 'concluido')
    .sort((a, b) => a.time.localeCompare(b.time));

  const getStatusStyle = (status: string) => {
      switch(status) {
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
                                                    <span className="material-symbols-outlined text-amber-500 text-lg">info</span>
                                                    Ver Detalhes
                                                </button>
                                            )}
                                            
                                            <button 
                                                onClick={() => handleCardClick(item.id)}
                                                className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/10 rounded-lg flex items-center gap-2 font-medium"
                                            >
                                                <span className="material-symbols-outlined text-lg">visibility</span>
                                                Ver Detalhes
                                            </button>

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

      {/* Reschedule Modal (Com Períodos) */}
      {isRescheduleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={(e) => e.stopPropagation()}>
              <div className="bg-surface-dark border border-border-dark rounded-2xl w-full max-w-lg shadow-2xl relative animate-fade-in flex flex-col max-h-[90vh]">
                  <form onSubmit={confirmReschedule} className="flex flex-col h-full">
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
                                          isCalendarOpen 
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
                                  required
                                  value={rescheduleData.reason}
                                  onChange={(e) => setRescheduleData({...rescheduleData, reason: e.target.value})}
                                  className="w-full bg-background-dark border border-border-dark rounded-lg p-3 text-white text-sm focus:border-primary placeholder-zinc-700"
                                  rows={3}
                                  placeholder="Ex: Tive um imprevisto no trabalho..."
                              ></textarea>
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
                              <p className="text-xs text-text-muted uppercase font-bold mb-1">Novo Período</p>
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
                       <button onClick={() => setIsDetailsModalOpen(false)} className="px-4 py-2 text-text-muted hover:text-white font-bold text-sm">Fechar</button>
                       {selectedItem.rescheduleInfo.requestedBy === 'client' && (
                           <button onClick={() => {
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
