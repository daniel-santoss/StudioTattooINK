'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { criarCliente, atualizarCliente, excluirCliente, reativarCliente } from '@/features/admin/actions/cliente';
import { maskCPF, maskTelefone } from '@/shared/lib/masks';
import Avatar from '@/shared/components/Avatar';
import CopyButton from '@/shared/components/CopyButton';

interface ClientData {
    id: string;
    name: string;
    cpf: string;
    email: string;
    lastVisit: string;
    status: 'Ativo' | 'Inativo';
    statusRaw: 'PROSPECTO' | 'ATIVO' | 'INATIVO' | 'VIP';
    ativo: boolean;
    img: string;
    phone?: string;
    notes?: string;
    dob?: string;
    allergies?: string;
    medicalNotes?: string;
    totalSessoes: number;
}

const STATUS_OPCOES: { value: ClientData['statusRaw']; label: string }[] = [
    { value: 'PROSPECTO', label: 'Prospecto' },
    { value: 'ATIVO', label: 'Ativo' },
    { value: 'INATIVO', label: 'Inativo' },
    { value: 'VIP', label: 'VIP' },
];

const inputCls = 'w-full bg-background-dark border border-border-dark rounded-lg py-2.5 px-4 text-white placeholder-zinc-600 focus:border-primary outline-none transition-colors';
const labelCls = 'text-xs font-bold text-text-muted uppercase tracking-widest block mb-1.5';

const Clients: React.FC<{ clients: ClientData[] }> = ({ clients }) => {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [filtroStatus, setFiltroStatus] = useState<'ativos' | 'desativados' | 'todos'>('ativos');
    const [isPending, startTransition] = useTransition();
    const [actionError, setActionError] = useState<string | null>(null);

    const [view, setView] = useState<ClientData | null>(null);
    const [edit, setEdit] = useState<ClientData | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<ClientData | null>(null);
    const [addOpen, setAddOpen] = useState(false);
    const [credenciais, setCredenciais] = useState<{ email: string; senha: string } | null>(null);

    // Formulários controlados (máscaras precisam de estado).
    const [editForm, setEditForm] = useState({ nome: '', email: '', telefone: '', status: 'ATIVO' as ClientData['statusRaw'], observacoes: '', alergias: '', observacoesMedicas: '' });
    const [addForm, setAddForm] = useState({ nome: '', email: '', telefone: '', cpf: '' });

    const filtered = clients
        .filter((c) => filtroStatus === 'todos' ? true : filtroStatus === 'ativos' ? c.ativo : !c.ativo)
        .filter((c) =>
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()) ||
            c.cpf.includes(search)
        );

    const abrirEditar = (c: ClientData) => {
        setActionError(null);
        setEditForm({
            nome: c.name, email: c.email, telefone: c.phone ?? '', status: c.statusRaw,
            observacoes: c.notes ?? '', alergias: c.allergies ?? '', observacoesMedicas: c.medicalNotes ?? '',
        });
        setEdit(c);
    };
    const abrirAdicionar = () => {
        setActionError(null);
        setAddForm({ nome: '', email: '', telefone: '', cpf: '' });
        setAddOpen(true);
    };

    const salvarEdicao = () => {
        if (!edit) return;
        setActionError(null);
        const fd = new FormData();
        fd.set('id', edit.id);
        fd.set('nome', editForm.nome);
        fd.set('email', editForm.email);
        fd.set('telefone', editForm.telefone);
        fd.set('status', editForm.status);
        fd.set('observacoes', editForm.observacoes);
        fd.set('alergias', editForm.alergias);
        fd.set('observacoesMedicas', editForm.observacoesMedicas);
        startTransition(async () => {
            const res = await atualizarCliente(fd);
            if (res?.error) { setActionError(res.error); return; }
            setEdit(null);
            router.refresh();
        });
    };

    const salvarNovo = () => {
        setActionError(null);
        const fd = new FormData();
        fd.set('nome', addForm.nome);
        fd.set('email', addForm.email);
        fd.set('telefone', addForm.telefone);
        fd.set('cpf', addForm.cpf);
        startTransition(async () => {
            const res = await criarCliente(fd);
            if (res?.error) { setActionError(res.error); return; }
            setAddOpen(false);
            if (res?.credenciais) setCredenciais(res.credenciais);
            router.refresh();
        });
    };

    const excluir = () => {
        if (!confirmDelete) return;
        setActionError(null);
        startTransition(async () => {
            const res = await excluirCliente(confirmDelete.id);
            if (res?.error) { setActionError(res.error); return; }
            setConfirmDelete(null);
            router.refresh();
        });
    };

    const reativar = (id: string) => {
        setActionError(null);
        startTransition(async () => {
            const res = await reativarCliente(id);
            if (res?.error) { setActionError(res.error); return; }
            router.refresh();
        });
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
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar clientes..."
                            className="w-full bg-surface-dark border border-border-dark rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-text-muted focus:border-primary transition-all"
                        />
                    </div>
                    <button
                        onClick={abrirAdicionar}
                        className="bg-white text-black hover:bg-gray-200 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 whitespace-nowrap transition-colors"
                    >
                        <span className="material-symbols-outlined text-lg">person_add</span>
                        <span className="hidden sm:inline">Adicionar Novo</span>
                    </button>
                </div>
            </div>

            {actionError && !view && !edit && !confirmDelete && !addOpen && (
                <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">{actionError}</div>
            )}

            <div className="flex gap-1 bg-surface-dark border border-border-dark rounded-lg p-1 mb-4 w-fit">
                {([['ativos', 'Ativos'], ['desativados', 'Desativados'], ['todos', 'Todos']] as const).map(([val, label]) => (
                    <button
                        key={val}
                        onClick={() => setFiltroStatus(val)}
                        className={`px-4 py-1.5 rounded text-xs font-bold uppercase tracking-wide transition-all ${filtroStatus === val ? 'bg-primary text-white' : 'text-text-muted hover:text-white'}`}
                    >
                        {label}
                    </button>
                ))}
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
                                            <Avatar src={client.img || undefined} name={client.name} className="size-10 rounded-full" />
                                            <div>
                                                <p className="font-bold text-white text-base">{client.name}</p>
                                                <p className="text-xs text-text-muted">{client.lastVisit}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-text-light font-mono text-xs">{client.cpf || '—'}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-text-light">{client.email}</p>
                                        <p className="text-xs text-text-muted">{client.phone}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        {client.ativo ? (
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${client.status === 'Ativo' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                'bg-red-500/10 text-red-500 border-red-500/20'
                                                }`}>
                                                {client.status}
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border bg-zinc-500/10 text-zinc-400 border-zinc-500/30">Desativado</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => setView(client)} title="Ver detalhes" className="size-8 rounded flex items-center justify-center text-text-muted hover:text-white hover:bg-white/10 transition-colors">
                                                <span className="material-symbols-outlined text-lg">visibility</span>
                                            </button>
                                            {client.ativo ? (
                                                <>
                                                    <button onClick={() => abrirEditar(client)} title="Editar" className="size-8 rounded flex items-center justify-center text-text-muted hover:text-white hover:bg-white/10 transition-colors">
                                                        <span className="material-symbols-outlined text-lg">edit_note</span>
                                                    </button>
                                                    <button onClick={() => { setActionError(null); setConfirmDelete(client); }} title="Desativar" className="size-8 rounded flex items-center justify-center text-red-500/70 hover:text-red-500 hover:bg-red-500/10 transition-colors">
                                                        <span className="material-symbols-outlined text-lg">delete</span>
                                                    </button>
                                                </>
                                            ) : (
                                                <button onClick={() => reativar(client.id)} disabled={isPending} title="Reativar" className="size-8 rounded flex items-center justify-center text-emerald-500/80 hover:text-emerald-500 hover:bg-emerald-500/10 transition-colors disabled:opacity-50">
                                                    <span className="material-symbols-outlined text-lg">restore</span>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Ver detalhes */}
            {view && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setView(null)}>
                    <div className="bg-surface-dark border border-border-dark rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-border-dark flex items-center gap-4">
                            <Avatar src={view.img || undefined} name={view.name} className="size-14 rounded-xl" textClassName="text-xl" />
                            <div>
                                <h3 className="text-xl font-bold text-white">{view.name}</h3>
                                <p className="text-text-muted text-sm">{view.email}</p>
                            </div>
                        </div>
                        <div className="p-6 overflow-y-auto grid grid-cols-2 gap-5 text-sm">
                            <Info label="CPF" value={view.cpf || '—'} />
                            <Info label="Telefone" value={view.phone || '—'} />
                            <Info label="Status" value={STATUS_OPCOES.find(s => s.value === view.statusRaw)?.label ?? view.status} />
                            <Info label="Total de sessões" value={String(view.totalSessoes)} />
                            <Info label="Última visita" value={view.lastVisit} />
                            <Info label="Nascimento" value={view.dob ? new Date(view.dob).toLocaleDateString('pt-BR') : '—'} />
                            <Info label="Alergias" value={view.allergies || 'Nenhuma'} full />
                            <Info label="Observações médicas" value={view.medicalNotes || 'Nenhuma'} full />
                            <Info label="Observações" value={view.notes || '—'} full />
                        </div>
                        <div className="p-6 border-t border-border-dark flex justify-end gap-3 bg-background-dark">
                            <button onClick={() => setView(null)} className="px-4 py-2 text-text-muted hover:text-white font-bold text-sm">Fechar</button>
                            <button onClick={() => { setView(null); abrirEditar(view); }} className="bg-primary hover:bg-primary-hover text-white px-5 py-2 rounded-lg font-bold text-sm uppercase tracking-wide transition-colors">Editar</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Editar */}
            {edit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => !isPending && setEdit(null)}>
                    <div className="bg-surface-dark border border-border-dark rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-border-dark flex items-center gap-2 text-primary">
                            <span className="material-symbols-outlined">edit_note</span>
                            <h3 className="text-xl font-bold text-white">Editar cliente</h3>
                        </div>
                        <div className="p-6 overflow-y-auto space-y-4">
                            <div>
                                <label className={labelCls}>Nome</label>
                                <input value={editForm.nome} onChange={(e) => setEditForm(p => ({ ...p, nome: e.target.value }))} className={inputCls} />
                            </div>
                            <div>
                                <label className={labelCls}>E-mail</label>
                                <input value={editForm.email} onChange={(e) => setEditForm(p => ({ ...p, email: e.target.value }))} type="email" className={inputCls} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelCls}>Telefone</label>
                                    <input value={editForm.telefone} onChange={(e) => setEditForm(p => ({ ...p, telefone: maskTelefone(e.target.value) }))} maxLength={15} inputMode="numeric" className={inputCls} placeholder="(00) 00000-0000" />
                                </div>
                                <div>
                                    <label className={labelCls}>CPF (somente no banco)</label>
                                    <input value={edit.cpf || '—'} disabled className={`${inputCls} opacity-60 cursor-not-allowed`} />
                                </div>
                            </div>
                            <div>
                                <label className={labelCls}>Status</label>
                                <select value={editForm.status} onChange={(e) => setEditForm(p => ({ ...p, status: e.target.value as ClientData['statusRaw'] }))} className={inputCls}>
                                    {STATUS_OPCOES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={labelCls}>Alergias</label>
                                <input value={editForm.alergias} onChange={(e) => setEditForm(p => ({ ...p, alergias: e.target.value }))} className={inputCls} placeholder="Nenhuma" />
                            </div>
                            <div>
                                <label className={labelCls}>Observações médicas</label>
                                <input value={editForm.observacoesMedicas} onChange={(e) => setEditForm(p => ({ ...p, observacoesMedicas: e.target.value }))} className={inputCls} placeholder="Nenhuma" />
                            </div>
                            <div>
                                <label className={labelCls}>Observações</label>
                                <textarea value={editForm.observacoes} onChange={(e) => setEditForm(p => ({ ...p, observacoes: e.target.value }))} rows={2} className={`${inputCls} resize-none`} placeholder="Anotações internas" />
                            </div>
                            {actionError && <p className="text-red-500 text-xs">{actionError}</p>}
                        </div>
                        <div className="p-6 border-t border-border-dark flex justify-end gap-3 bg-background-dark">
                            <button onClick={() => setEdit(null)} disabled={isPending} className="px-4 py-2 text-text-muted hover:text-white font-bold text-sm disabled:opacity-50">Cancelar</button>
                            <button onClick={salvarEdicao} disabled={!editForm.nome.trim() || isPending} className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg font-bold text-sm uppercase tracking-wide transition-colors disabled:opacity-50">
                                {isPending ? 'Salvando...' : 'Salvar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Adicionar */}
            {addOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => !isPending && setAddOpen(false)}>
                    <div className="bg-surface-dark border border-border-dark rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-border-dark flex items-center gap-2 text-primary">
                            <span className="material-symbols-outlined">person_add</span>
                            <h3 className="text-xl font-bold text-white">Novo cliente</h3>
                        </div>
                        <div className="p-6 overflow-y-auto space-y-4">
                            <p className="text-text-muted text-xs">Cria um acesso com senha temporária (mostrada uma vez). O cliente troca no primeiro login.</p>
                            <div>
                                <label className={labelCls}>Nome <span className="text-primary">*</span></label>
                                <input value={addForm.nome} onChange={(e) => setAddForm(p => ({ ...p, nome: e.target.value }))} className={inputCls} placeholder="Nome do cliente" />
                            </div>
                            <div>
                                <label className={labelCls}>E-mail <span className="text-primary">*</span></label>
                                <input value={addForm.email} onChange={(e) => setAddForm(p => ({ ...p, email: e.target.value }))} type="email" className={inputCls} placeholder="cliente@email.com" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={labelCls}>Telefone</label>
                                    <input value={addForm.telefone} onChange={(e) => setAddForm(p => ({ ...p, telefone: maskTelefone(e.target.value) }))} maxLength={15} inputMode="numeric" className={inputCls} placeholder="(00) 00000-0000" />
                                </div>
                                <div>
                                    <label className={labelCls}>CPF</label>
                                    <input value={addForm.cpf} onChange={(e) => setAddForm(p => ({ ...p, cpf: maskCPF(e.target.value) }))} maxLength={14} inputMode="numeric" className={inputCls} placeholder="000.000.000-00" />
                                </div>
                            </div>
                            {actionError && <p className="text-red-500 text-xs">{actionError}</p>}
                        </div>
                        <div className="p-6 border-t border-border-dark flex justify-end gap-3 bg-background-dark">
                            <button onClick={() => setAddOpen(false)} disabled={isPending} className="px-4 py-2 text-text-muted hover:text-white font-bold text-sm disabled:opacity-50">Cancelar</button>
                            <button onClick={salvarNovo} disabled={!addForm.nome.trim() || !addForm.email.trim() || isPending} className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg font-bold text-sm uppercase tracking-wide transition-colors disabled:opacity-50">
                                {isPending ? 'Criando...' : 'Criar cliente'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmar exclusão */}
            {confirmDelete && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => !isPending && setConfirmDelete(null)}>
                    <div className="bg-surface-dark border border-border-dark rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 text-center">
                            <div className="size-12 rounded-full flex items-center justify-center mx-auto mb-4 bg-red-500/10 text-red-500">
                                <span className="material-symbols-outlined text-3xl">delete</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Excluir cliente</h3>
                            <p className="text-text-muted text-sm">Remover <strong className="text-white">{confirmDelete.name}</strong> da lista? O histórico é preservado e o acesso é bloqueado.</p>
                            {actionError && <p className="text-red-500 text-xs mt-3">{actionError}</p>}
                        </div>
                        <div className="flex border-t border-border-dark">
                            <button onClick={() => setConfirmDelete(null)} disabled={isPending} className="flex-1 py-4 text-sm font-bold text-text-muted hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50">Cancelar</button>
                            <div className="w-px bg-border-dark"></div>
                            <button onClick={excluir} disabled={isPending} className="flex-1 py-4 text-sm font-bold uppercase tracking-wide text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50">
                                {isPending ? 'Excluindo...' : 'Excluir'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Credenciais geradas */}
            {credenciais && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-surface-dark border border-border-dark rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-border-dark flex items-center gap-2 text-emerald-500">
                            <span className="material-symbols-outlined">check_circle</span>
                            <h3 className="text-xl font-bold text-white">Cliente criado</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <p className="text-text-muted text-sm"><strong className="text-white">Anote e repasse</strong> a senha temporária agora — ela não será exibida de novo. O cliente troca no primeiro acesso.</p>
                            <div className="bg-background-dark border border-border-dark rounded-xl p-4 space-y-3">
                                <div>
                                    <label className="text-[10px] text-text-muted uppercase font-bold block mb-1">E-mail</label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-mono text-sm break-all">{credenciais.email}</span>
                                        <CopyButton value={credenciais.email} title="Copiar e-mail" />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] text-text-muted uppercase font-bold block mb-1">Senha temporária</label>
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-mono text-sm break-all">{credenciais.senha}</span>
                                        <CopyButton value={credenciais.senha} title="Copiar senha" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-border-dark flex justify-end bg-background-dark">
                            <button onClick={() => setCredenciais(null)} className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg font-bold text-sm uppercase tracking-wide transition-colors">Concluir</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const Info: React.FC<{ label: string; value: string; full?: boolean }> = ({ label, value, full }) => (
    <div className={full ? 'col-span-2' : ''}>
        <p className="text-[10px] text-text-muted uppercase font-bold mb-1">{label}</p>
        <p className="text-white">{value}</p>
    </div>
);

export default Clients;
