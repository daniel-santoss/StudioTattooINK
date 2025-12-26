import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ClientData {
    id: number;
    name: string;
    cpf: string;
    email: string;
    lastVisit: string;
    status: 'Ativo' | 'Inativo';
    img: string;
    phone?: string;
    notes?: string;
    password?: string; // For creating new clients
}

const initialClients: ClientData[] = [
    { id: 1, name: "Marcus Thorn", cpf: "123.456.789-00", email: "marcus.t@email.com", lastVisit: "12 Out, 2023", status: "Ativo", img: "https://i.pravatar.cc/150?u=1", phone: "(11) 99999-1234", notes: "Prefere sessões à tarde." },
    { id: 2, name: "Sarah Vane", cpf: "234.567.890-11", email: "s.vane@email.com", lastVisit: "28 Set, 2023", status: "Ativo", img: "https://i.pravatar.cc/150?u=2", phone: "(11) 98888-5678", notes: "Cliente antiga, gosta de café sem açúcar." },
    { id: 3, name: "Jessica Rabbit", cpf: "345.678.901-22", email: "jess.r@email.com", lastVisit: "Novo Cliente", status: "Ativo", img: "https://i.pravatar.cc/150?u=3", phone: "(21) 97777-0000" },
    { id: 4, name: "John Doe", cpf: "456.789.012-33", email: "j.doe@email.com", lastVisit: "15 Jan, 2023", status: "Inativo", img: "https://i.pravatar.cc/150?u=4", phone: "(11) 90000-0000", notes: "Não compareceu na última sessão." },
];

const Clients: React.FC = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<ClientData[]>(initialClients);
  
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // State for Editing
  const [editingClient, setEditingClient] = useState<ClientData | null>(null);

  // State for New Client
  const [newClient, setNewClient] = useState({
      name: '',
      cpf: '',
      email: '',
      status: 'Ativo' as 'Ativo' | 'Inativo',
      phone: '',
      password: ''
  });

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    const client: ClientData = {
        id: clients.length + 1,
        name: newClient.name,
        cpf: newClient.cpf,
        email: newClient.email,
        status: newClient.status,
        phone: newClient.phone,
        lastVisit: "Novo Cliente",
        img: `https://i.pravatar.cc/150?u=${Date.now()}`
    };
    setClients([...clients, client]);
    setIsAddModalOpen(false);
    // Reset form
    setNewClient({ name: '', cpf: '', email: '', status: 'Ativo', phone: '', password: '' });
  };

  const handleDelete = (id: number) => {
      if (window.confirm("Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.")) {
          setClients(prev => prev.filter(c => c.id !== id));
      }
  };

  const handleOpenEdit = (client: ClientData) => {
      setEditingClient(client);
      setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingClient) return;

      setClients(prev => prev.map(c => c.id === editingClient.id ? editingClient : c));
      setIsEditModalOpen(false);
      setEditingClient(null);
  };

  return (
    <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
           <h1 className="font-tattoo text-4xl text-white mb-2">Clientes</h1>
           <p className="text-text-muted text-sm">Gerencie perfis e histórico de clientes.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
                <span className="material-symbols-outlined absolute left-3 top-2.5 text-text-muted">search</span>
                <input 
                    type="text" 
                    placeholder="Buscar clientes..." 
                    className="w-full bg-surface-dark border border-border-dark rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-text-muted focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                />
            </div>
           <button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 whitespace-nowrap"
           >
              <span className="material-symbols-outlined text-lg">person_add</span>
              <span className="hidden sm:inline">Adicionar Novo</span>
           </button>
        </div>
      </div>

      <div className="bg-surface-dark border border-border-dark rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead className="bg-surface-light text-text-muted uppercase text-xs font-bold tracking-wider">
                    <tr>
                        <th className="px-6 py-4">Cliente</th>
                        <th className="px-6 py-4">CPF</th>
                        <th className="px-6 py-4">Contato</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border-dark">
                    {clients.map((client) => (
                        <tr key={client.id} className="hover:bg-white/[0.02] transition-colors group">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-4">
                                    <img src={client.img} alt={client.name} className="size-10 rounded-full bg-background-dark border border-border-dark" />
                                    <div>
                                        <p className="font-bold text-white text-base">{client.name}</p>
                                        <p className="text-xs text-text-muted">ID: #882{client.id}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="text-text-light font-mono text-xs">{client.cpf}</span>
                            </td>
                            <td className="px-6 py-4">
                                <p className="text-text-light">{client.email}</p>
                                <p className="text-xs text-text-muted">{client.phone}</p>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                                    client.status === 'Ativo' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                    'bg-red-500/10 text-red-500 border-red-500/20'
                                }`}>
                                    {client.status}
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
                                        onClick={() => handleOpenEdit(client)}
                                        className="size-8 rounded flex items-center justify-center text-text-muted hover:text-white hover:bg-white/10 transition-colors"
                                        title="Editar Dados"
                                    >
                                        <span className="material-symbols-outlined text-lg">edit_note</span>
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(client.id)}
                                        className="size-8 rounded flex items-center justify-center text-text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors"
                                        title="Excluir"
                                    >
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>

      {/* Modal View & Edit Client */}
      {isEditModalOpen && editingClient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
              <div className="bg-surface-dark border border-border-dark rounded-2xl w-full max-w-lg shadow-2xl relative animate-fade-in my-8">
                  <form onSubmit={handleSaveEdit}>
                    <div className="flex items-center justify-between p-6 border-b border-border-dark sticky top-0 bg-surface-dark z-10 rounded-t-2xl">
                        <h3 className="text-xl font-bold text-white">Editar Cliente</h3>
                        <button type="button" onClick={() => setIsEditModalOpen(false)} className="text-text-muted hover:text-white">
                            <span className="material-symbols-outlined">close</span>
                        </button>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <img src={editingClient.img} alt={editingClient.name} className="size-20 rounded-full border-2 border-primary" />
                            <div className="flex-1">
                                <label className="text-xs font-bold text-text-muted uppercase mb-1 block">Nome do Cliente</label>
                                <input 
                                    type="text" 
                                    value={editingClient.name}
                                    onChange={e => setEditingClient({...editingClient, name: e.target.value})}
                                    className="w-full bg-background-dark border border-border-dark rounded-lg p-2 text-white focus:border-primary text-lg font-bold"
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-text-muted uppercase font-bold mb-1 block">CPF (Não editável)</label>
                                    <input 
                                        type="text" 
                                        value={editingClient.cpf}
                                        disabled
                                        className="w-full bg-surface-light border border-border-dark rounded-lg p-2.5 text-text-muted cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-text-muted uppercase font-bold mb-1 block">Status</label>
                                    <select 
                                        value={editingClient.status}
                                        onChange={e => setEditingClient({...editingClient, status: e.target.value as 'Ativo' | 'Inativo'})}
                                        className="w-full bg-background-dark border border-border-dark rounded-lg p-2.5 text-white focus:border-primary"
                                    >
                                        <option value="Ativo">Ativo</option>
                                        <option value="Inativo">Inativo</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-text-muted uppercase font-bold mb-1 block">Email</label>
                                    <input 
                                        type="email" 
                                        value={editingClient.email}
                                        onChange={e => setEditingClient({...editingClient, email: e.target.value})}
                                        className="w-full bg-background-dark border border-border-dark rounded-lg p-2.5 text-white focus:border-primary"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-text-muted uppercase font-bold mb-1 block">Telefone</label>
                                    <input 
                                        type="text" 
                                        value={editingClient.phone}
                                        onChange={e => setEditingClient({...editingClient, phone: e.target.value})}
                                        className="w-full bg-background-dark border border-border-dark rounded-lg p-2.5 text-white focus:border-primary"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-text-muted uppercase font-bold mb-1 block">Observações</label>
                                <textarea 
                                    value={editingClient.notes || ''}
                                    onChange={e => setEditingClient({...editingClient, notes: e.target.value})}
                                    rows={3}
                                    className="w-full bg-background-dark border border-border-dark rounded-lg p-2.5 text-white focus:border-primary placeholder-zinc-700"
                                    placeholder="Adicione observações sobre o cliente..."
                                />
                            </div>
                        </div>
                    </div>
                    <div className="p-6 border-t border-border-dark flex justify-end gap-3 bg-surface-dark sticky bottom-0 rounded-b-2xl">
                        <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-4 py-2 rounded-lg border border-border-dark text-text-muted hover:text-white font-bold text-sm transition-colors">
                            Cancelar
                        </button>
                        <button type="submit" className="px-6 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white font-bold text-sm transition-colors shadow-lg shadow-primary/20">
                            Salvar Alterações
                        </button>
                    </div>
                  </form>
              </div>
          </div>
      )}

      {/* Modal Add Client */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="bg-surface-dark border border-border-dark rounded-2xl p-8 w-full max-w-md shadow-2xl relative animate-fade-in my-8">
                <button 
                    onClick={() => setIsAddModalOpen(false)}
                    className="absolute top-4 right-4 text-text-muted hover:text-white"
                >
                    <span className="material-symbols-outlined">close</span>
                </button>
                
                <h2 className="font-tattoo text-3xl text-white mb-6">Novo Cliente</h2>
                
                <form onSubmit={handleAddClient} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest block mb-1">Nome Completo</label>
                        <input 
                            required
                            type="text" 
                            value={newClient.name}
                            onChange={e => setNewClient({...newClient, name: e.target.value})}
                            className="w-full bg-background-dark border border-border-dark rounded-lg p-2.5 text-white focus:border-primary"
                            placeholder="Ex: Maria Oliveira"
                        />
                    </div>
                    
                    <div>
                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest block mb-1">CPF</label>
                        <input 
                            required
                            type="text" 
                            value={newClient.cpf}
                            onChange={e => setNewClient({...newClient, cpf: e.target.value})}
                            className="w-full bg-background-dark border border-border-dark rounded-lg p-2.5 text-white focus:border-primary"
                            placeholder="000.000.000-00"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest block mb-1">E-mail</label>
                        <input 
                            required
                            type="email" 
                            value={newClient.email}
                            onChange={e => setNewClient({...newClient, email: e.target.value})}
                            className="w-full bg-background-dark border border-border-dark rounded-lg p-2.5 text-white focus:border-primary"
                            placeholder="cliente@email.com"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest block mb-1">Telefone</label>
                        <input 
                            type="tel" 
                            value={newClient.phone}
                            onChange={e => setNewClient({...newClient, phone: e.target.value})}
                            className="w-full bg-background-dark border border-border-dark rounded-lg p-2.5 text-white focus:border-primary"
                            placeholder="(00) 00000-0000"
                        />
                    </div>
                    
                    <div>
                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest block mb-1">Definir Senha de Acesso</label>
                        <input 
                            required
                            type="password" 
                            value={newClient.password}
                            onChange={e => setNewClient({...newClient, password: e.target.value})}
                            className="w-full bg-background-dark border border-border-dark rounded-lg p-2.5 text-white focus:border-primary"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-text-muted uppercase tracking-widest block mb-1">Status Inicial</label>
                        <select 
                            value={newClient.status}
                            onChange={e => setNewClient({...newClient, status: e.target.value as 'Ativo' | 'Inativo'})}
                            className="w-full bg-background-dark border border-border-dark rounded-lg p-2.5 text-white focus:border-primary"
                        >
                            <option value="Ativo">Ativo</option>
                            <option value="Inativo">Inativo</option>
                        </select>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button 
                            type="button" 
                            onClick={() => setIsAddModalOpen(false)}
                            className="flex-1 py-3 rounded-lg border border-border-dark text-text-muted font-bold hover:bg-white/5 hover:text-white transition-colors"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            className="flex-1 py-3 rounded-lg bg-white text-black font-bold hover:bg-gray-200 shadow-lg transition-colors uppercase tracking-wide text-sm"
                        >
                            Cadastrar
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default Clients;