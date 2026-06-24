'use client';

import React, { useState } from 'react';

interface ClientData {
    id: string;
    name: string;
    cpf: string;
    email: string;
    lastVisit: string;
    status: 'Ativo' | 'Inativo';
    img: string;
    phone?: string;
    notes?: string;
}

const Clients: React.FC<{ clients: ClientData[] }> = ({ clients }) => {
    const [search, setSearch] = useState('');

    const filtered = clients.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.cpf.includes(search)
    );

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
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar clientes..."
                            className="w-full bg-surface-dark border border-border-dark rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-text-muted focus:border-primary transition-all"
                        />
                    </div>
                    {/* Cadastro de cliente ainda sem backend ("Em breve") */}
                    <button
                        disabled
                        title="Em breve"
                        className="bg-white/40 text-black/60 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 whitespace-nowrap cursor-not-allowed"
                    >
                        <span className="material-symbols-outlined text-lg">person_add</span>
                        <span className="hidden sm:inline">Adicionar Novo</span>
                        <span className="text-[9px] tracking-wider border border-black/20 rounded px-1.5 py-0.5">Em breve</span>
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
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-text-muted">Nenhum cliente encontrado.</td>
                                </tr>
                            ) : filtered.map((client) => (
                                <tr key={client.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <img src={client.img} alt={client.name} className="size-10 rounded-full bg-background-dark border border-border-dark" />
                                            <div>
                                                <p className="font-bold text-white text-base">{client.name}</p>
                                                <p className="text-xs text-text-muted">{client.lastVisit}</p>
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
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${client.status === 'Ativo' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                            'bg-red-500/10 text-red-500 border-red-500/20'
                                            }`}>
                                            {client.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {/* Ações ainda sem backend ("Em breve") */}
                                        <div className="flex items-center justify-end gap-2">
                                            <button disabled title="Em breve" className="size-8 rounded flex items-center justify-center text-text-muted/30 cursor-not-allowed">
                                                <span className="material-symbols-outlined text-lg">visibility</span>
                                            </button>
                                            <button disabled title="Em breve" className="size-8 rounded flex items-center justify-center text-text-muted/30 cursor-not-allowed">
                                                <span className="material-symbols-outlined text-lg">edit_note</span>
                                            </button>
                                            <button disabled title="Em breve" className="size-8 rounded flex items-center justify-center text-text-muted/30 cursor-not-allowed">
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
        </div>
    );
};

export default Clients;
