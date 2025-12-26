
import React, { useState } from 'react';

// Interface para os dados da solicitação
interface BookingRequest {
  id: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAvatar: string;
  clientRating: number; // 1-5
  service: string;
  requestedDate: string;
  requestedTime: string;
  description: string; // Ideia da tattoo
  medicalInfo: {
      allergies: string;
      notes: string;
  };
  requestTimestamp: string;
}

// Mock Data
const initialRequests: BookingRequest[] = [
  {
    id: 1,
    clientName: "Juliana Paiva",
    clientEmail: "ju.paiva@email.com",
    clientPhone: "(11) 99876-5432",
    clientAvatar: "https://i.pravatar.cc/150?u=juliana",
    clientRating: 5.0,
    service: "Realismo Preto e Cinza",
    requestedDate: "20 Nov, 2024",
    requestedTime: "14:00",
    description: "Gostaria de fazer um retrato realista do meu cachorro no antebraço. Tenho uma foto de referência em alta qualidade.",
    medicalInfo: {
        allergies: "Nenhuma conhecida",
        notes: "Pele sensível, costuma ficar bem vermelha."
    },
    requestTimestamp: "Há 2 horas"
  },
  {
    id: 2,
    clientName: "Roberto Alves",
    clientEmail: "roberto.a@email.com",
    clientPhone: "(11) 91234-5678",
    clientAvatar: "https://i.pravatar.cc/150?u=roberto",
    clientRating: 4.8,
    service: "Old School",
    requestedDate: "22 Nov, 2024",
    requestedTime: "10:00",
    description: "Quero uma adaga atravessando uma rosa no estilo clássico, colorida. Local: Panturrilha.",
    medicalInfo: {
        allergies: "Látex (Precisa de luva nitrílica)",
        notes: "Diabetes controlada."
    },
    requestTimestamp: "Há 5 horas"
  }
];

const BookingRequests: React.FC = () => {
  const [requests, setRequests] = useState<BookingRequest[]>(initialRequests);
  const [selectedRequest, setSelectedRequest] = useState<BookingRequest | null>(null);
  
  // Modals
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

  // Rejection State
  const [rejectionData, setRejectionData] = useState({ reason: '', note: '' });
  const [requestToRejectId, setRequestToRejectId] = useState<number | null>(null);

  const rejectionReasons = [
      "Agenda indisponível para esta data",
      "Estilo não compatível com o artista",
      "Projeto não realizável (Tamanho/Local)",
      "Valor da proposta incompatível",
      "Outros motivos"
  ];

  const handleOpenDetails = (req: BookingRequest) => {
    setSelectedRequest(req);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false);
    setSelectedRequest(null);
  };

  const handleApprove = (id: number) => {
    // Lógica de aprovação (API call)
    alert("Agendamento confirmado! O cliente será notificado.");
    setRequests(prev => prev.filter(req => req.id !== id));
    handleCloseDetails();
  };

  const handleOpenReject = (id: number) => {
      setRequestToRejectId(id);
      setRejectionData({ reason: rejectionReasons[0], note: '' });
      setIsRejectModalOpen(true);
  };

  const confirmReject = (e: React.FormEvent) => {
      e.preventDefault();
      if (requestToRejectId) {
          // Lógica de API para recusar com motivo
          console.log("Recusando ID:", requestToRejectId, rejectionData);
          setRequests(prev => prev.filter(req => req.id !== requestToRejectId));
          setIsRejectModalOpen(false);
          setIsDetailsModalOpen(false); // Fecha o detalhe se estiver aberto
          setRequestToRejectId(null);
          alert("Solicitação recusada. O motivo foi enviado ao cliente.");
      }
  };

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto w-full">
      <div className="mb-10">
         <h1 className="font-tattoo text-4xl text-white mb-2">Solicitações de Agendamento</h1>
         <p className="text-text-muted text-sm">Analise e aprove sessões pendentes.</p>
      </div>

      {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-surface-dark border border-border-dark rounded-2xl text-center">
              <div className="size-16 bg-surface-light rounded-full flex items-center justify-center mb-4 text-text-muted">
                  <span className="material-symbols-outlined text-3xl">calendar_today</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Agenda em dia!</h3>
              <p className="text-text-muted">Não há novas solicitações pendentes.</p>
          </div>
      ) : (
          <div className="grid grid-cols-1 gap-4">
              {requests.map((req) => (
                  <div key={req.id} className="bg-surface-dark border border-border-dark rounded-xl p-5 flex flex-col md:flex-row items-center gap-4 hover:border-primary/30 transition-all group shadow-lg">
                      {/* Avatar & Basic Info */}
                      <div className="flex items-center gap-4 w-full md:flex-1">
                          <div className="relative">
                            <img src={req.clientAvatar} alt={req.clientName} className="size-16 rounded-xl object-cover bg-surface-light border border-border-dark" />
                            <div className="absolute -bottom-2 -right-2 bg-surface-dark rounded-full px-1.5 py-0.5 border border-border-dark flex items-center gap-0.5 shadow-sm">
                                <span className="text-[10px] font-bold text-white">{req.clientRating}</span>
                                <span className="material-symbols-outlined text-[10px] text-amber-500 fill-current">star</span>
                            </div>
                          </div>
                          
                          <div className="min-w-0 flex-1">
                              <h3 className="text-lg font-bold text-white truncate">{req.clientName}</h3>
                              <p className="text-sm text-text-muted mb-1 truncate">{req.clientEmail}</p>
                              <div className="flex items-center gap-3 text-xs text-text-muted">
                                  <div className="flex items-center gap-1">
                                      <span className="material-symbols-outlined text-sm text-primary">event</span>
                                      <span className="text-white font-bold">{req.requestedDate}</span>
                                  </div>
                                  <span>•</span>
                                  <span>{req.requestTimestamp}</span>
                              </div>
                          </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 w-full md:w-auto pt-4 md:pt-0 border-t border-border-dark/50 md:border-0">
                          <button 
                            onClick={() => handleOpenDetails(req)}
                            className="flex-1 md:flex-none px-4 py-2 border border-border-dark hover:bg-white/5 text-white rounded-lg font-bold text-sm transition-colors whitespace-nowrap"
                          >
                              Ver Detalhes
                          </button>
                          <button 
                            onClick={() => handleApprove(req.id)}
                            className="size-10 shrink-0 flex items-center justify-center bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 rounded-lg transition-colors"
                            title="Aprovar Agendamento"
                          >
                              <span className="material-symbols-outlined">check</span>
                          </button>
                          <button 
                            onClick={() => handleOpenReject(req.id)}
                            className="size-10 shrink-0 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg transition-colors"
                            title="Recusar"
                          >
                              <span className="material-symbols-outlined">close</span>
                          </button>
                      </div>
                  </div>
              ))}
          </div>
      )}

      {/* Details Modal */}
      {isDetailsModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-surface-dark border border-border-dark rounded-2xl w-full max-w-2xl shadow-2xl relative animate-fade-in my-8 flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border-dark bg-surface-dark z-10 rounded-t-2xl sticky top-0">
                    <div className="flex items-center gap-4">
                        <img src={selectedRequest.clientAvatar} alt={selectedRequest.clientName} className="size-14 rounded-full border-2 border-primary" />
                        <div>
                            <h2 className="text-xl font-bold text-white leading-none">{selectedRequest.clientName}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-text-muted bg-surface-light px-2 py-0.5 rounded uppercase tracking-wider font-bold">Cliente</span>
                                <div className="flex items-center gap-1 text-amber-500">
                                    <span className="text-xs font-bold">{selectedRequest.clientRating}</span>
                                    <span className="material-symbols-outlined text-xs fill-current">star</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button onClick={handleCloseDetails} className="text-text-muted hover:text-white">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto space-y-6">
                    
                    {/* Booking Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-surface-light/30 p-4 rounded-xl border border-white/5">
                            <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-1">Data Solicitada</span>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-white">calendar_month</span>
                                <span className="text-lg font-bold text-white">{selectedRequest.requestedDate}</span>
                            </div>
                        </div>
                        <div className="bg-surface-light/30 p-4 rounded-xl border border-white/5">
                            <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-1">Horário</span>
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-white">schedule</span>
                                <span className="text-lg font-bold text-white">{selectedRequest.requestedTime}</span>
                            </div>
                        </div>
                    </div>

                    {/* Idea Description */}
                    <div>
                        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">ink_pen</span>
                            Ideia / Projeto
                        </h3>
                        <div className="bg-background-dark p-4 rounded-lg border border-border-dark">
                            <p className="text-sm text-text-light leading-relaxed">"{selectedRequest.description}"</p>
                            <div className="mt-3 pt-3 border-t border-border-dark flex items-center justify-between">
                                <span className="text-xs text-text-muted font-bold uppercase">Estilo Sugerido</span>
                                <span className="text-xs text-white bg-primary/20 px-2 py-1 rounded border border-primary/20">{selectedRequest.service}</span>
                            </div>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">perm_contact_calendar</span>
                            Dados de Contato
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-background-dark p-3 rounded-lg border border-border-dark flex items-center gap-3">
                                <span className="material-symbols-outlined text-text-muted">mail</span>
                                <div>
                                    <span className="block text-[10px] text-text-muted uppercase font-bold">Email</span>
                                    <span className="text-sm text-white truncate block">{selectedRequest.clientEmail}</span>
                                </div>
                            </div>
                            <div className="bg-background-dark p-3 rounded-lg border border-border-dark flex items-center gap-3">
                                <span className="material-symbols-outlined text-text-muted">phone_iphone</span>
                                <div>
                                    <span className="block text-[10px] text-text-muted uppercase font-bold">Telefone</span>
                                    <span className="text-sm text-white">{selectedRequest.clientPhone}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Medical Info - Highlighted */}
                    <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                        <h3 className="text-sm font-bold text-red-500 mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined">medical_services</span>
                            Ficha Médica
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest block mb-1">Alergias</span>
                                <p className="text-sm text-white font-medium">
                                    {selectedRequest.medicalInfo.allergies || "Nenhuma registrada"}
                                </p>
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest block mb-1">Condições / Notas</span>
                                <p className="text-sm text-white font-medium">
                                    {selectedRequest.medicalInfo.notes || "Nenhuma registrada"}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-border-dark bg-background-dark/80 backdrop-blur rounded-b-2xl sticky bottom-0 flex justify-end gap-3">
                     <button 
                        onClick={() => handleOpenReject(selectedRequest.id)}
                        className="px-6 py-3 border border-red-500/30 text-red-500 hover:bg-red-500/10 rounded-lg font-bold text-sm uppercase tracking-wide transition-all flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">block</span>
                        Recusar
                    </button>
                    <button 
                        onClick={() => handleApprove(selectedRequest.id)}
                        className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-sm uppercase tracking-wide transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">check_circle</span>
                        Aprovar Agendamento
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Reject Modal */}
      {isRejectModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="bg-surface-dark border border-border-dark rounded-2xl w-full max-w-md shadow-2xl relative animate-fade-in">
                  <form onSubmit={confirmReject}>
                      <div className="p-6 border-b border-border-dark flex justify-between items-center bg-red-500/5 rounded-t-2xl">
                          <div className="flex items-center gap-2 text-red-500">
                               <span className="material-symbols-outlined">event_busy</span>
                               <h3 className="text-xl font-bold">Recusar Solicitação</h3>
                          </div>
                          <button type="button" onClick={() => setIsRejectModalOpen(false)} className="text-text-muted hover:text-white"><span className="material-symbols-outlined">close</span></button>
                      </div>
                      <div className="p-6">
                          <p className="text-text-muted text-sm mb-4">Informe o motivo da recusa para notificar o cliente.</p>
                          
                          <div className="space-y-4">
                              <div>
                                  <label className="text-xs font-bold text-text-muted uppercase mb-1 block">Motivo Principal</label>
                                  <select 
                                    value={rejectionData.reason}
                                    onChange={(e) => setRejectionData({...rejectionData, reason: e.target.value})}
                                    className="w-full bg-background-dark border border-border-dark rounded-lg p-2.5 text-white text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                  >
                                      {rejectionReasons.map(r => <option key={r} value={r}>{r}</option>)}
                                  </select>
                              </div>
                              <div>
                                  <label className="text-xs font-bold text-text-muted uppercase mb-1 block">Observações / Sugestão</label>
                                  <textarea 
                                      required
                                      value={rejectionData.note}
                                      onChange={(e) => setRejectionData({...rejectionData, note: e.target.value})}
                                      className="w-full bg-background-dark border border-border-dark rounded-lg p-3 text-white text-sm focus:border-red-500 placeholder-zinc-700 focus:ring-1 focus:ring-red-500"
                                      rows={4}
                                      placeholder="Ex: Infelizmente não tenho horários livres este mês, mas posso recomendar..."
                                  ></textarea>
                              </div>
                          </div>
                      </div>
                      <div className="p-6 border-t border-border-dark flex justify-end gap-3 bg-background-dark rounded-b-2xl">
                          <button type="button" onClick={() => setIsRejectModalOpen(false)} className="px-4 py-2 text-text-muted hover:text-white font-bold text-sm">Cancelar</button>
                          <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold text-sm uppercase tracking-wide transition-colors shadow-lg shadow-red-900/20">
                              Confirmar Recusa
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default BookingRequests;
