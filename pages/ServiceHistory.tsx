
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface HistoryItem {
    id: number;
    clientName: string;
    clientImage: string;
    service: string;
    date: string;
    duration: string;
    price: string;
    rating: number; // 1-5
    status: 'Finalizado' | 'Retoque';
}

const initialHistory: HistoryItem[] = [
    {
        id: 1,
        clientName: "Marcus Thorn",
        clientImage: "https://i.pravatar.cc/150?u=1",
        service: "Fechamento de Braço - Sessão 1",
        date: "20 Out, 2024",
        duration: "4h",
        price: "R$ 1.200",
        rating: 5,
        status: 'Finalizado'
    },
    {
        id: 2,
        clientName: "Sarah Vane",
        clientImage: "https://i.pravatar.cc/150?u=2",
        service: "Rosa Old School",
        date: "18 Out, 2024",
        duration: "2h",
        price: "R$ 450",
        rating: 5,
        status: 'Finalizado'
    },
    {
        id: 3,
        clientName: "Jessica Rabbit",
        clientImage: "https://i.pravatar.cc/150?u=3",
        service: "Micro Realismo Pet",
        date: "15 Out, 2024",
        duration: "3h",
        price: "R$ 800",
        rating: 4,
        status: 'Retoque'
    }
];

const ServiceHistory: React.FC = () => {
  const navigate = useNavigate();
  const [history] = useState<HistoryItem[]>(initialHistory);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal States
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [clientRating, setClientRating] = useState(0);

  const filteredHistory = history.filter(item => 
    item.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenRate = (item: HistoryItem) => {
      setSelectedItem(item);
      setClientRating(0);
      setIsRateModalOpen(true);
  };

  const handleOpenReport = (item: HistoryItem) => {
      setSelectedItem(item);
      setIsReportModalOpen(true);
  };

  const submitClientRating = (e: React.FormEvent) => {
      e.preventDefault();
      alert(`Avaliação registrada para o cliente ${selectedItem?.clientName}`);
      setIsRateModalOpen(false);
  };

  const submitReport = (e: React.FormEvent) => {
      e.preventDefault();
      alert(`Ocorrência registrada sobre o atendimento #${selectedItem?.id}`);
      setIsReportModalOpen(false);
  };

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
           <h1 className="font-tattoo text-4xl text-white mb-2">Histórico de Atendimentos</h1>
           <p className="text-text-muted text-sm">Visualize os trabalhos realizados e avaliações.</p>
        </div>
        <div className="relative flex-1 md:max-w-xs">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-text-muted">search</span>
            <input 
                type="text" 
                placeholder="Buscar por cliente ou serviço..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-surface-dark border border-border-dark rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-text-muted focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            />
        </div>
      </div>

      <div className="bg-surface-dark border border-border-dark rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-surface-light text-text-muted uppercase text-xs font-bold tracking-wider">
                    <tr>
                        <th className="px-6 py-4">Cliente</th>
                        <th className="px-6 py-4">Serviço</th>
                        <th className="px-6 py-4">Data & Duração</th>
                        <th className="px-6 py-4">Valor</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border-dark">
                    {filteredHistory.map((item) => (
                        <tr key={item.id} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                    <img src={item.clientImage} alt={item.clientName} className="size-10 rounded-full bg-background-dark border border-border-dark object-cover" />
                                    <div>
                                        <p className="font-bold text-white text-base">{item.clientName}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-text-light">{item.service}</span>
                            </td>
                            <td className="px-6 py-4">
                                <p className="text-white font-medium">{item.date}</p>
                                <p className="text-xs text-text-muted">{item.duration}</p>
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-emerald-500 font-mono font-bold">{item.price}</span>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                                    item.status === 'Finalizado' 
                                    ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' 
                                    : 'bg-purple-500/10 text-purple-500 border-purple-500/20'
                                }`}>
                                    {item.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button 
                                        onClick={() => navigate('/admin/profile')}
                                        className="size-8 rounded flex items-center justify-center text-text-muted hover:text-primary hover:bg-primary/10 transition-colors"
                                        title="Visualizar Perfil"
                                    >
                                        <span className="material-symbols-outlined text-lg">visibility</span>
                                    </button>
                                    <button 
                                        onClick={() => handleOpenRate(item)}
                                        className="size-8 rounded flex items-center justify-center text-text-muted hover:text-white hover:bg-white/10 transition-colors"
                                        title="Avaliar Cliente"
                                    >
                                        <span className="material-symbols-outlined text-lg">thumb_up</span>
                                    </button>
                                    <button 
                                        onClick={() => handleOpenReport(item)}
                                        className="size-8 rounded flex items-center justify-center text-text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                        title="Reportar Incidente"
                                    >
                                        <span className="material-symbols-outlined text-lg">flag</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {filteredHistory.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-text-muted">
                                Nenhum atendimento encontrado.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* Modal Rate Client */}
      {isRateModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-surface-dark border border-border-dark rounded-2xl w-full max-w-md shadow-2xl relative animate-fade-in">
                <form onSubmit={submitClientRating}>
                    <div className="p-6 border-b border-border-dark flex justify-between items-center">
                        <h3 className="text-xl font-bold text-white">Avaliar Cliente</h3>
                        <button type="button" onClick={() => setIsRateModalOpen(false)} className="text-text-muted hover:text-white"><span className="material-symbols-outlined">close</span></button>
                    </div>
                    <div className="p-6 text-center">
                        <img src={selectedItem.clientImage} className="size-16 rounded-full mx-auto mb-4 border border-border-dark"/>
                        <p className="text-text-muted text-sm mb-4">Como foi atender <span className="text-white font-bold">{selectedItem.clientName}</span>?</p>
                        
                        <div className="flex justify-center gap-2 mb-6">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setClientRating(star)}
                                    className={`text-3xl transition-transform hover:scale-110 ${star <= clientRating ? 'text-amber-500 fill-current' : 'text-border-dark'}`}
                                >
                                    <span className={`material-symbols-outlined ${star <= clientRating ? 'fill-current' : ''}`}>star</span>
                                </button>
                            ))}
                        </div>
                        <textarea 
                            className="w-full bg-background-dark border border-border-dark rounded-lg p-3 text-white text-sm focus:border-primary placeholder-zinc-700"
                            rows={3}
                            placeholder="Observações internas sobre o cliente..."
                        ></textarea>
                    </div>
                    <div className="p-6 border-t border-border-dark flex justify-end">
                        <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-lg font-bold text-sm uppercase tracking-wide transition-colors">
                            Salvar Avaliação
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* Modal Report Incident */}
      {isReportModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-surface-dark border border-border-dark rounded-2xl w-full max-w-md shadow-2xl relative animate-fade-in">
                <form onSubmit={submitReport}>
                    <div className="p-6 border-b border-border-dark flex justify-between items-center bg-red-500/5">
                        <div className="flex items-center gap-2 text-red-500">
                             <span className="material-symbols-outlined">report_problem</span>
                             <h3 className="text-xl font-bold">Reportar Incidente</h3>
                        </div>
                        <button type="button" onClick={() => setIsReportModalOpen(false)} className="text-text-muted hover:text-white"><span className="material-symbols-outlined">close</span></button>
                    </div>
                    <div className="p-6">
                        <p className="text-text-muted text-sm mb-4">Registrar ocorrência com o cliente <span className="text-white font-bold">{selectedItem.clientName}</span>.</p>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-text-muted uppercase mb-1 block">Tipo de Incidente</label>
                                <select className="w-full bg-background-dark border border-border-dark rounded-lg p-2.5 text-white text-sm focus:border-red-500">
                                    <option>Não comparecimento (No-show)</option>
                                    <option>Atraso excessivo</option>
                                    <option>Problemas no pagamento</option>
                                    <option>Comportamento inadequado</option>
                                    <option>Cuidados pós-tattoo negligenciados</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-text-muted uppercase mb-1 block">Observações</label>
                                <textarea 
                                    required
                                    className="w-full bg-background-dark border border-border-dark rounded-lg p-3 text-white text-sm focus:border-red-500 placeholder-zinc-700"
                                    rows={4}
                                    placeholder="Descreva o ocorrido para registro interno..."
                                ></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 border-t border-border-dark flex justify-end gap-3">
                        <button type="button" onClick={() => setIsReportModalOpen(false)} className="px-4 py-2 text-text-muted hover:text-white font-bold text-sm">Cancelar</button>
                        <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-bold text-sm uppercase tracking-wide transition-colors shadow-lg shadow-red-900/20">
                            Registrar
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default ServiceHistory;
