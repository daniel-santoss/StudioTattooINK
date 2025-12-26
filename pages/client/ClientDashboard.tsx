
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
    aftercare?: string[];
    cancellationReason?: string; // Reason if cancelled
    rescheduleInfo?: {
        newDate: string;
        newTime: string;
        reason: string;
        requestedBy: 'artist' | 'client';
    };
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
       image: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=200",
       aftercare: ["Manter hidratação constante", "Não expor ao sol"]
    },
    {
        id: 4,
        artist: "Elena Rosa",
        service: "Fine Line Minimalista",
        date: "20 Dez, 2024",
        time: "11:00",
        status: "pending",
        price: "A confirmar",
        image: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?q=80&w=200&auto=format&fit=crop"
    },
    {
        id: 5,
        artist: "Alex Rivera",
        service: "Retoque Realismo",
        date: "25 Nov, 2024",
        time: "09:00",
        status: "rescheduling",
        price: "R$ 0",
        image: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=200",
        rescheduleInfo: {
            newDate: "28 Nov, 2024",
            newTime: "10:00",
            reason: "O artista teve um imprevisto de saúde.",
            requestedBy: "artist"
        }
    },
    {
       id: 2,
       artist: "Sarah Vane",
       service: "Rosa Old School",
       date: "10 Out, 2024",
       time: "10:00",
       status: "completed",
       price: "R$ 450",
       image: "https://images.unsplash.com/photo-1596204368623-2895f543666f?auto=format&fit=crop&q=80&w=200",
       aftercare: ["Lavar com sabonete neutro", "Usar pomada 3x ao dia", "Não coçar"]
    },
    {
       id: 3,
       artist: "Mike Chen",
       service: "Dragão Oriental (Cancelado)",
       date: "05 Out, 2024",
       time: "16:00",
       status: "cancelled",
       price: "R$ 0",
       image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&q=80&w=200",
       cancellationReason: "Indisponibilidade de agenda do tatuador."
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

const ClientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  
  // Filter State
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled' | 'pending'>('all');

  // Modal States
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  
  // Cancellation Modal (Client cancelling)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReasonData, setCancelReasonData] = useState({ reason: 'Imprevisto pessoal', note: '' });

  // Reschedule Modal (Client rescheduling)
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [rescheduleData, setRescheduleData] = useState({ newDate: '', newTime: '', reason: '' });

  // View Reason/Details Modal (Viewing why it was cancelled or rescheduled)
  const [isDetailsInfoModalOpen, setIsDetailsInfoModalOpen] = useState(false);

  const [ratingValue, setRatingValue] = useState(0);

  const nextDays = getNextDays();

  // Filter Logic
  const filteredAppointments = appointments.filter(apt => {
      if (statusFilter === 'all') return true;
      if (statusFilter === 'pending' && apt.status === 'rescheduling') return true; // Include rescheduling in pending view usually
      return apt.status === statusFilter;
  });

  const handleView = (appointment: Appointment) => {
      setSelectedAppointment(appointment);
      setIsViewModalOpen(true);
  };

  const handleOpenRate = (appointment: Appointment) => {
      setSelectedAppointment(appointment);
      setRatingValue(0);
      setIsRateModalOpen(true);
  };

  const handleOpenReport = (appointment: Appointment) => {
      setSelectedAppointment(appointment);
      setIsReportModalOpen(true);
  };

  const handleOpenCancel = (appointment: Appointment) => {
      setSelectedAppointment(appointment);
      setCancelReasonData({ reason: 'Imprevisto pessoal', note: '' });
      setIsCancelModalOpen(true);
  };

  const handleOpenReschedule = (appointment: Appointment) => {
      setSelectedAppointment(appointment);
      setRescheduleData({ newDate: '', newTime: '', reason: '' });
      setIsRescheduleModalOpen(true);
  };

  const handleViewDetailsInfo = (appointment: Appointment) => {
      setSelectedAppointment(appointment);
      setIsDetailsInfoModalOpen(true);
  };

  const confirmCancel = (e: React.FormEvent) => {
      e.preventDefault();
      if (selectedAppointment) {
          const reasonText = `${cancelReasonData.reason}${cancelReasonData.note ? `: ${cancelReasonData.note}` : ''}`;
          setAppointments(prev => prev.map(apt => 
              apt.id === selectedAppointment.id ? { ...apt, status: 'cancelled', cancellationReason: reasonText } : apt
          ));
          setIsCancelModalOpen(false);
          alert("Agendamento cancelado com sucesso.");
      }
  };

  const confirmReschedule = (e: React.FormEvent) => {
      e.preventDefault();
      if (selectedAppointment) {
          if (!rescheduleData.newDate || !rescheduleData.newTime) {
              alert("Por favor, selecione uma data e um horário.");
              return;
          }

          // Format date for display
          const dateObj = new Date(rescheduleData.newDate);
          const formattedDate = dateObj.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' });

          setAppointments(prev => prev.map(apt => 
              apt.id === selectedAppointment.id ? { 
                  ...apt, 
                  status: 'rescheduling',
                  rescheduleInfo: {
                      newDate: formattedDate,
                      newTime: rescheduleData.newTime,
                      reason: rescheduleData.reason,
                      requestedBy: 'client'
                  }
              } : apt
          ));
          setIsRescheduleModalOpen(false);
          alert("Solicitação de reagendamento enviada. Aguarde a confirmação do tatuador.");
      }
  };

  const submitRating = (e: React.FormEvent) => {
      e.preventDefault();
      alert("Avaliação enviada com sucesso!");
      setIsRateModalOpen(false);
  };

  const submitReport = (e: React.FormEvent) => {
      e.preventDefault();
      alert("Problema reportado à administração. Entraremos em contato.");
      setIsReportModalOpen(false);
  };

  const getStatusBadge = (status: string) => {
      switch(status) {
          case 'upcoming': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
          case 'completed': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
          case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
          case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
          case 'rescheduling': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
          default: return 'bg-text-muted/10 text-text-muted border-text-muted/20';
      }
  };

  const getStatusLabel = (status: string) => {
      switch(status) {
          case 'upcoming': return 'Agendado';
          case 'completed': return 'Concluído';
          case 'cancelled': return 'Cancelado';
          case 'pending': return 'Aguardando';
          case 'rescheduling': return 'Reagendando';
          default: return status;
      }
  };

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
           <h1 className="font-tattoo text-4xl text-white mb-2">Meus Agendamentos</h1>
           <p className="text-text-muted text-sm">Gerencie suas sessões e histórico.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-text-muted">search</span>
                <input 
                    type="text" 
                    placeholder="Buscar agendamento..." 
                    className="w-full bg-surface-dark border border-border-dark rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-text-muted focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
            </div>
           <button 
                onClick={() => navigate('/book')}
                className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 whitespace-nowrap"
           >
              <span className="material-symbols-outlined text-lg">add_circle</span>
              <span className="hidden sm:inline">Novo Agendamento</span>
           </button>
        </div>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-2">
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
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide border transition-all whitespace-nowrap ${
                      statusFilter === filter.id 
                      ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                      : 'bg-surface-dark text-text-muted border-border-dark hover:border-white/30 hover:text-white'
                  }`}
              >
                  {filter.label}
              </button>
          ))}
      </div>

      <div className="bg-surface-dark border border-border-dark rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-surface-light text-text-muted uppercase text-xs font-bold tracking-wider">
                    <tr>
                        <th className="px-6 py-4">Serviço / Tatuador</th>
                        <th className="px-6 py-4">Data & Hora</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Valor</th>
                        <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border-dark">
                    {filteredAppointments.length > 0 ? filteredAppointments.map((apt) => (
                        <tr key={apt.id} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                    <img src={apt.image} alt={apt.artist} className="size-10 rounded-full bg-background-dark border border-border-dark object-cover" />
                                    <div>
                                        <p className="font-bold text-white text-base">{apt.service}</p>
                                        <p className="text-xs text-text-muted">com {apt.artist}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <p className="text-white font-medium">{apt.date}</p>
                                <p className="text-xs text-text-muted">{apt.time}</p>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusBadge(apt.status)}`}>
                                    {getStatusLabel(apt.status)}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-text-light font-mono">{apt.price}</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    {apt.status === 'rescheduling' && (
                                        <button 
                                            onClick={() => handleViewDetailsInfo(apt)}
                                            className="px-3 py-1 rounded-lg border border-orange-500/30 text-orange-500 hover:bg-orange-500/10 text-xs font-bold uppercase transition-colors"
                                        >
                                            Ver Proposta
                                        </button>
                                    )}

                                    {(apt.status === 'upcoming' || apt.status === 'pending') && (
                                        <>
                                            <button 
                                                onClick={() => handleOpenReschedule(apt)}
                                                className="size-8 rounded flex items-center justify-center text-text-muted hover:text-blue-400 hover:bg-blue-400/10 transition-colors"
                                                title="Remarcar"
                                            >
                                                <span className="material-symbols-outlined text-lg">edit_calendar</span>
                                            </button>
                                            <button 
                                                onClick={() => handleOpenCancel(apt)}
                                                className="size-8 rounded flex items-center justify-center text-text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                                title="Cancelar Agendamento"
                                            >
                                                <span className="material-symbols-outlined text-lg">cancel</span>
                                            </button>
                                        </>
                                    )}
                                    {apt.status === 'cancelled' && (
                                         <button 
                                            onClick={() => handleViewDetailsInfo(apt)}
                                            className="px-3 py-1 rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10 text-xs font-bold uppercase transition-colors"
                                         >
                                             Motivo
                                         </button>
                                    )}
                                    {apt.status === 'completed' && (
                                        <button 
                                            onClick={() => handleOpenRate(apt)}
                                            className="size-8 rounded flex items-center justify-center text-text-muted hover:text-amber-400 hover:bg-amber-400/10 transition-colors"
                                            title="Avaliar Atendimento"
                                        >
                                            <span className="material-symbols-outlined text-lg">star</span>
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => handleOpenReport(apt)}
                                        className="size-8 rounded flex items-center justify-center text-text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                        title="Reportar Problema"
                                    >
                                        <span className="material-symbols-outlined text-lg">warning</span>
                                    </button>
                                    <button 
                                        onClick={() => handleView(apt)}
                                        className="size-8 rounded flex items-center justify-center text-text-muted hover:text-white hover:bg-white/10 transition-colors"
                                        title="Ver Detalhes"
                                    >
                                        <span className="material-symbols-outlined text-lg">visibility</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={5} className="px-6 py-12 text-center text-text-muted">
                                <span className="material-symbols-outlined text-4xl mb-2">event_busy</span>
                                <p>Nenhum agendamento encontrado para este filtro.</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* Modal View Details */}
      {isViewModalOpen && selectedAppointment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
               <div className="bg-surface-dark border border-border-dark rounded-2xl w-full max-w-lg shadow-2xl relative animate-fade-in">
                  <div className="flex items-center justify-between p-6 border-b border-border-dark">
                      <h3 className="text-xl font-bold text-white">Detalhes do Agendamento</h3>
                      <button onClick={() => setIsViewModalOpen(false)} className="text-text-muted hover:text-white">
                          <span className="material-symbols-outlined">close</span>
                      </button>
                  </div>
                  <div className="p-6">
                      <div className="flex items-center gap-6 mb-8">
                          <img src={selectedAppointment.image} alt={selectedAppointment.artist} className="size-20 rounded-xl object-cover border-2 border-primary" />
                          <div>
                              <h2 className="text-xl font-bold text-white mb-1">{selectedAppointment.service}</h2>
                              <p className="text-text-muted text-sm mb-2">com <span className="text-white font-bold">{selectedAppointment.artist}</span></p>
                              <span className={`px-2 py-1 rounded text-xs font-bold uppercase border ${getStatusBadge(selectedAppointment.status)}`}>
                                  {getStatusLabel(selectedAppointment.status)}
                              </span>
                          </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="bg-surface-light/30 p-3 rounded-lg border border-white/5">
                              <label className="text-xs text-text-muted uppercase font-bold block mb-1">Data</label>
                              <span className="text-white font-bold">{selectedAppointment.date}</span>
                          </div>
                          <div className="bg-surface-light/30 p-3 rounded-lg border border-white/5">
                              <label className="text-xs text-text-muted uppercase font-bold block mb-1">Horário</label>
                              <span className="text-white font-bold">{selectedAppointment.time}</span>
                          </div>
                      </div>

                      <div className="space-y-4">
                          <div>
                              <label className="text-xs text-text-muted uppercase font-bold mb-2 block">Valor da Sessão</label>
                              <p className="text-xl text-white font-display font-bold">{selectedAppointment.price}</p>
                          </div>
                          
                          {selectedAppointment.aftercare && (
                            <div className="pt-4 border-t border-border-dark">
                                <label className="text-xs text-primary uppercase font-bold mb-3 block flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm">medical_services</span>
                                    Cuidados Pós-Tattoo
                                </label>
                                <ul className="space-y-2">
                                    {selectedAppointment.aftercare.map((tip, idx) => (
                                        <li key={idx} className="flex gap-2 text-sm text-text-light">
                                            <span className="text-text-muted">•</span>
                                            {tip}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                          )}
                      </div>
                  </div>
                  <div className="p-6 border-t border-border-dark flex justify-end gap-3">
                       <button onClick={() => setIsViewModalOpen(false)} className="px-4 py-2 rounded-lg bg-surface-light hover:bg-white/10 text-white font-bold text-sm transition-colors">
                           Fechar
                       </button>
                  </div>
               </div>
          </div>
      )}

      {/* Modal Cancel */}
      {isCancelModalOpen && selectedAppointment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
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
                          <p className="text-text-muted text-sm mb-4">Tem certeza? Informe o motivo do cancelamento.</p>
                          
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
                                  <label className="text-xs font-bold text-text-muted uppercase mb-1 block">Detalhes (Opcional)</label>
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
                          <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold text-sm uppercase tracking-wide transition-colors shadow-lg shadow-red-900/20">
                              Confirmar
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* Modal Reschedule (Client Request) */}
      {isRescheduleModalOpen && selectedAppointment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="bg-surface-dark border border-border-dark rounded-2xl w-full max-w-lg shadow-2xl relative animate-fade-in flex flex-col max-h-[90vh]">
                  <form onSubmit={confirmReschedule} className="flex flex-col h-full">
                      <div className="p-6 border-b border-border-dark flex justify-between items-center bg-blue-500/5 rounded-t-2xl">
                          <div className="flex items-center gap-2 text-blue-500">
                               <span className="material-symbols-outlined">edit_calendar</span>
                               <h3 className="text-xl font-bold">Solicitar Mudança</h3>
                          </div>
                          <button type="button" onClick={() => setIsRescheduleModalOpen(false)} className="text-text-muted hover:text-white"><span className="material-symbols-outlined">close</span></button>
                      </div>
                      <div className="p-6 overflow-y-auto space-y-8 flex-1">
                          <p className="text-text-muted text-sm">Sugira uma nova data e horário. O tatuador precisará aprovar a mudança.</p>
                          
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
                              <label className="text-xs font-bold text-text-muted uppercase mb-2 block">Motivo</label>
                              <textarea 
                                  required
                                  value={rescheduleData.reason}
                                  onChange={(e) => setRescheduleData({...rescheduleData, reason: e.target.value})}
                                  className="w-full bg-background-dark border border-border-dark rounded-lg p-3 text-white text-sm focus:border-blue-500 placeholder-zinc-700"
                                  rows={3}
                                  placeholder="Ex: Tive um imprevisto no trabalho..."
                              ></textarea>
                          </div>
                      </div>
                      <div className="p-6 border-t border-border-dark flex justify-end gap-3 bg-background-dark rounded-b-2xl">
                          <button type="button" onClick={() => setIsRescheduleModalOpen(false)} className="px-4 py-2 text-text-muted hover:text-white font-bold text-sm uppercase tracking-wide">Cancelar</button>
                          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold text-sm uppercase tracking-wide transition-colors shadow-lg shadow-blue-900/20">
                              Enviar Solicitação
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      {/* Modal View Details Info (Cancellation / Reschedule) */}
      {isDetailsInfoModalOpen && selectedAppointment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="bg-surface-dark border border-border-dark rounded-2xl w-full max-w-md shadow-2xl relative animate-fade-in">
                  <div className="p-6 border-b border-border-dark flex justify-between items-center bg-surface-light/30 rounded-t-2xl">
                       <div className="flex items-center gap-2">
                           <span className="material-symbols-outlined text-white">info</span>
                           <h3 className="text-xl font-bold text-white">
                               {selectedAppointment.status === 'rescheduling' ? 'Detalhes do Reagendamento' : 'Detalhes do Cancelamento'}
                           </h3>
                       </div>
                       <button onClick={() => setIsDetailsInfoModalOpen(false)} className="text-text-muted hover:text-white"><span className="material-symbols-outlined">close</span></button>
                  </div>
                  
                  {selectedAppointment.status === 'rescheduling' && selectedAppointment.rescheduleInfo ? (
                      <div className="p-6">
                           <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl mb-6">
                               <p className="text-orange-500 font-bold text-sm mb-2 uppercase tracking-wide">Proposta de Mudança</p>
                               <div className="grid grid-cols-2 gap-4 text-white">
                                   <div>
                                       <span className="text-xs text-text-muted block">Nova Data</span>
                                       <span className="font-bold">{selectedAppointment.rescheduleInfo.newDate}</span>
                                   </div>
                                   <div>
                                       <span className="text-xs text-text-muted block">Novo Horário</span>
                                       <span className="font-bold">{selectedAppointment.rescheduleInfo.newTime}</span>
                                   </div>
                               </div>
                           </div>
                           
                           <div>
                               <p className="text-xs text-text-muted uppercase font-bold mb-2">Motivo / Mensagem</p>
                               <div className="bg-background-dark p-3 rounded-lg border border-border-dark text-sm text-text-light">
                                    "{selectedAppointment.rescheduleInfo.reason}"
                               </div>
                           </div>

                           {/* If requested by artist, client can approve here */}
                           {selectedAppointment.rescheduleInfo.requestedBy === 'artist' && (
                               <div className="mt-6 flex gap-3">
                                   <button className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-sm uppercase tracking-wide">Aceitar</button>
                                   <button className="flex-1 py-3 border border-red-500/30 text-red-500 hover:bg-red-500/10 rounded-lg font-bold text-sm uppercase tracking-wide">Recusar</button>
                               </div>
                           )}
                      </div>
                  ) : (
                      <div className="p-8 text-center">
                          <div className="size-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                              <span className="material-symbols-outlined text-3xl">cancel</span>
                          </div>
                          <p className="text-text-muted text-sm mb-2 uppercase font-bold tracking-widest">Motivo Registrado</p>
                          <p className="text-white text-lg font-medium">
                              "{selectedAppointment.cancellationReason || 'Nenhum motivo específico informado.'}"
                          </p>
                      </div>
                  )}

                  <div className="p-6 border-t border-border-dark flex justify-center">
                       <button onClick={() => setIsDetailsInfoModalOpen(false)} className="px-6 py-2 bg-surface-light hover:bg-white/10 text-white rounded-lg font-bold text-sm transition-colors">
                           Fechar
                       </button>
                  </div>
              </div>
          </div>
      )}

      {/* Modal Rate */}
      {isRateModalOpen && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-surface-dark border border-border-dark rounded-2xl w-full max-w-md shadow-2xl relative animate-fade-in">
                <form onSubmit={submitRating}>
                    <div className="p-6 border-b border-border-dark flex justify-between items-center">
                        <h3 className="text-xl font-bold text-white">Avaliar Atendimento</h3>
                        <button type="button" onClick={() => setIsRateModalOpen(false)} className="text-text-muted hover:text-white"><span className="material-symbols-outlined">close</span></button>
                    </div>
                    <div className="p-6 text-center">
                        <p className="text-text-muted text-sm mb-4">Como foi sua experiência com <span className="text-white font-bold">{selectedAppointment.artist}</span>?</p>
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

      {/* Modal Report */}
      {isReportModalOpen && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-surface-dark border border-border-dark rounded-2xl w-full max-w-md shadow-2xl relative animate-fade-in">
                <form onSubmit={submitReport}>
                    <div className="p-6 border-b border-border-dark flex justify-between items-center bg-red-500/5">
                        <div className="flex items-center gap-2 text-red-500">
                             <span className="material-symbols-outlined">report_problem</span>
                             <h3 className="text-xl font-bold">Reportar Problema</h3>
                        </div>
                        <button type="button" onClick={() => setIsReportModalOpen(false)} className="text-text-muted hover:text-white"><span className="material-symbols-outlined">close</span></button>
                    </div>
                    <div className="p-6">
                        <p className="text-text-muted text-sm mb-4">Descreva o problema ocorrido no atendimento de <span className="text-white font-bold">{selectedAppointment.date}</span>.</p>
                        
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
                        <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold text-sm uppercase tracking-wide transition-colors shadow-lg shadow-red-900/20">
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

export default ClientDashboard;
