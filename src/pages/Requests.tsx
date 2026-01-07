import React, { useState } from 'react';

// Interfaces for mock data
interface RequestData {
  id: number;
  name: string;
  email: string;
  phone: string;
  dob: string;
  portfolio: string;
  experience: string;
  styles: string[];
  customStyle?: string;
  requestDate: string;
  avatarUrl: string;
}

// Mock Data
const initialRequests: RequestData[] = [
  {
    id: 1,
    name: "Lucas Mendes",
    email: "lucas.arts@email.com",
    phone: "(11) 98888-7777",
    dob: "1995-05-20",
    portfolio: "https://instagram.com/lucas_ink",
    experience: "3-5",
    styles: ["Blackwork", "Pontilhismo"],
    requestDate: "24 Out, 2024",
    avatarUrl: "https://i.pravatar.cc/150?u=lucas"
  },
  {
    id: 2,
    name: "Fernanda Takahashi",
    email: "fer.taka@email.com",
    phone: "(11) 97777-6666",
    dob: "1998-12-10",
    portfolio: "https://behance.net/fertaka",
    experience: "beginner",
    styles: ["Oriental", "Aquarela", "Outros"],
    customStyle: "Anime / Geek",
    requestDate: "23 Out, 2024",
    avatarUrl: "https://i.pravatar.cc/150?u=fernanda"
  }
];

const Requests: React.FC = () => {
  const [requests, setRequests] = useState<RequestData[]>(initialRequests);
  const [selectedRequest, setSelectedRequest] = useState<RequestData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenDetails = (request: RequestData) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const handleApprove = (id: number) => {
    // Aqui entraria a lógica de API para aprovar
    setRequests(prev => prev.filter(req => req.id !== id));
    handleCloseModal();
    alert("Candidato aprovado e adicionado à equipe!");
  };

  const handleReject = (id: number) => {
    // Aqui entraria a lógica de API para recusar
    if(window.confirm("Tem certeza que deseja recusar esta candidatura?")) {
        setRequests(prev => prev.filter(req => req.id !== id));
        handleCloseModal();
    }
  };

  const getExperienceLabel = (exp: string) => {
      const map: Record<string, string> = {
          'beginner': 'Iniciante (Aprendiz)',
          '1-3': '1 a 3 anos',
          '3-5': '3 a 5 anos',
          '5+': 'Mais de 5 anos'
      };
      return map[exp] || exp;
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto w-full">
      <div className="flex flex-col justify-between gap-4 mb-6 md:mb-10">
        <div>
           <h1 className="font-tattoo text-3xl md:text-5xl text-white mb-2">Solicitações</h1>
           <p className="text-text-muted text-sm font-display tracking-wide">Analise e gerencie candidaturas de novos artistas.</p>
        </div>
      </div>

      {requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-surface-dark border border-border-dark rounded-2xl text-center">
              <div className="size-16 bg-surface-light rounded-full flex items-center justify-center mb-4 text-text-muted">
                  <span className="material-symbols-outlined text-3xl">inbox</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Tudo limpo por aqui!</h3>
              <p className="text-text-muted">Não há novas solicitações de cadastro no momento.</p>
          </div>
      ) : (
          <div className="grid grid-cols-1 gap-4">
              {requests.map((req) => (
                  <div key={req.id} className="bg-surface-dark border border-border-dark rounded-xl p-5 flex flex-col md:flex-row items-center gap-4 hover:border-primary/30 transition-all group">
                      {/* Avatar & Basic Info - Simplificado: Apenas Nome, Email, Data */}
                      <div className="flex items-center gap-4 w-full md:flex-1">
                          <img src={req.avatarUrl} alt={req.name} className="size-14 md:size-16 rounded-xl object-cover bg-surface-light border border-border-dark shrink-0" />
                          <div className="min-w-0 flex-1">
                              <h3 className="text-lg font-bold text-white truncate">{req.name}</h3>
                              <p className="text-sm text-text-muted mb-1 truncate">{req.email}</p>
                              <div className="flex items-center gap-1.5 text-xs text-text-muted">
                                  <span className="material-symbols-outlined text-sm">calendar_today</span>
                                  <span className="whitespace-nowrap">{req.requestDate}</span>
                              </div>
                          </div>
                      </div>

                      {/* Actions - Responsivo */}
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
                            title="Aprovar Rápido"
                          >
                              <span className="material-symbols-outlined">check</span>
                          </button>
                          <button 
                            onClick={() => handleReject(req.id)}
                            className="size-10 shrink-0 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg transition-colors"
                            title="Recusar Rápido"
                          >
                              <span className="material-symbols-outlined">close</span>
                          </button>
                      </div>
                  </div>
              ))}
          </div>
      )}

      {/* Details Modal */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto">
            <div className="bg-surface-dark border border-border-dark rounded-t-2xl sm:rounded-2xl w-full max-w-2xl shadow-2xl relative animate-fade-in max-h-[90vh] flex flex-col">
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-border-dark bg-surface-light/30 rounded-t-2xl sticky top-0 z-10 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <img src={selectedRequest.avatarUrl} alt={selectedRequest.name} className="size-12 sm:size-16 rounded-xl object-cover border border-white/10" />
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-white">{selectedRequest.name}</h2>
                            <p className="text-text-muted text-xs sm:text-sm">Solicitação de Cadastro</p>
                        </div>
                    </div>
                    {/* Botão X para fechar */}
                    <button 
                        onClick={handleCloseModal}
                        className="size-10 rounded-full bg-black/20 hover:bg-white/10 text-text-muted hover:text-white transition-colors flex items-center justify-center"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>
                
                {/* Modal Body - Scrollable */}
                <div className="p-6 space-y-8 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-surface-light">
                    {/* Personal Info */}
                    <section>
                        <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Dados Pessoais</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs text-text-muted mb-1">E-mail</label>
                                <p className="text-white font-medium break-all">{selectedRequest.email}</p>
                            </div>
                            <div>
                                <label className="block text-xs text-text-muted mb-1">Telefone</label>
                                <p className="text-white font-medium">{selectedRequest.phone}</p>
                            </div>
                            <div>
                                <label className="block text-xs text-text-muted mb-1">Data de Nascimento</label>
                                <p className="text-white font-medium">{new Date(selectedRequest.dob).toLocaleDateString('pt-BR')}</p>
                            </div>
                            <div>
                                <label className="block text-xs text-text-muted mb-1">Data da Solicitação</label>
                                <p className="text-white font-medium">{selectedRequest.requestDate}</p>
                            </div>
                        </div>
                    </section>

                    {/* Professional Info */}
                    <section>
                        <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Perfil Profissional</h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs text-text-muted mb-1">Link do Portfólio / Instagram</label>
                                <a 
                                    href={selectedRequest.portfolio} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="text-blue-400 hover:text-blue-300 underline font-medium flex items-center gap-1 break-all"
                                >
                                    {selectedRequest.portfolio}
                                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                                </a>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs text-text-muted mb-1">Experiência</label>
                                    <p className="text-white font-medium">{getExperienceLabel(selectedRequest.experience)}</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs text-text-muted mb-2">Estilos Selecionados</label>
                                <div className="flex flex-wrap gap-2">
                                    {selectedRequest.styles.map(style => (
                                        <span key={style} className="px-3 py-1.5 bg-surface-light border border-white/10 rounded-lg text-sm text-white font-medium">
                                            {style}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {selectedRequest.styles.includes('Outros') && selectedRequest.customStyle && (
                                <div className="bg-surface-light/20 p-4 rounded-lg border border-white/5">
                                    <label className="block text-xs text-text-muted mb-1">Estilo Personalizado ("Outros")</label>
                                    <p className="text-white italic">"{selectedRequest.customStyle}"</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-border-dark bg-background-dark/50 flex flex-col sm:flex-row gap-4 justify-end rounded-b-2xl sticky bottom-0 backdrop-blur-md">
                    <button 
                        onClick={() => handleReject(selectedRequest.id)}
                        className="px-6 py-3 border border-red-500/30 text-red-500 hover:bg-red-500/10 rounded-lg font-bold text-sm uppercase tracking-wide transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                        <span className="material-symbols-outlined text-lg">block</span>
                        Recusar
                    </button>
                    <button 
                        onClick={() => handleApprove(selectedRequest.id)}
                        className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-sm uppercase tracking-wide transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 w-full sm:w-auto"
                    >
                        <span className="material-symbols-outlined text-lg">check_circle</span>
                        Aprovar
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Requests;