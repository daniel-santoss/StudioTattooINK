'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { criarProfissional, atualizarProfissional, excluirProfissional } from '@/features/admin/actions/profissional';
import { maskCPF, maskTelefone } from '@/shared/lib/masks';
import Avatar from '@/shared/components/Avatar';
import CopyButton from '@/shared/components/CopyButton';

interface StaffMember {
    id: string;
    name: string;
    cpf: string;
    role: string;
    specialty: string;
    status: string;
    statusRaw: 'DISPONIVEL' | 'EM_SESSAO' | 'FOLGA';
    email: string;
    phone: string;
    avatar: string;
    username: string;
    bio: string;
    realizaPiercing: boolean;
}

const inputCls = 'w-full bg-background-dark border border-border-dark rounded-lg py-2.5 px-4 text-white placeholder-zinc-600 focus:border-primary outline-none transition-colors';
const labelCls = 'text-xs font-bold text-text-muted uppercase tracking-widest block mb-1.5';

// Componente de estrelas mantido apenas porque telas legadas (não roteadas) ainda o importam.
// Não é usado nesta tela — o domínio não possui avaliação/nota.
export const RatingDisplay: React.FC<{
    rating: number;
    count?: number;
    size?: string;
    showText?: boolean;
    activeColor?: string;
    bgColor?: string;
}> = ({
    rating,
    count,
    size = "18px",
    showText = true,
    activeColor = "text-amber-500",
    bgColor = "text-white/10"
}) => {
        return (
            <div className="flex items-center gap-1.5 font-inter">
                {showText && <span className="text-white font-bold leading-none" style={{ fontSize: `calc(${size} * 0.9)` }}>{rating.toFixed(1)}</span>}
                <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((starIndex) => {
                        const fillAmount = Math.min(Math.max(rating - (starIndex - 1), 0), 1) * 100;
                        return (
                            <div key={starIndex} className="relative flex items-center justify-center" style={{ width: size, height: size }}>
                                <span
                                    className={`material-symbols-outlined absolute ${bgColor} select-none leading-none`}
                                    style={{ fontSize: size, fontVariationSettings: "'FILL' 1", lineHeight: 1 }}
                                >
                                    star
                                </span>
                                <div
                                    className="absolute left-0 top-0 overflow-hidden select-none h-full flex items-center"
                                    style={{ width: `${fillAmount}%` }}
                                >
                                    <span
                                        className={`material-symbols-outlined ${activeColor} leading-none`}
                                        style={{ fontSize: size, fontVariationSettings: "'FILL' 1", lineHeight: 1 }}
                                    >
                                        star
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {count !== undefined && (
                    <span className="text-text-muted font-medium ml-0.5 leading-none" style={{ fontSize: `calc(${size} * 0.8)` }}>
                        ({count >= 1000 ? count.toLocaleString('pt-BR') : count})
                    </span>
                )}
            </div>
        );
    };

const Staff: React.FC<{ staff: StaffMember[] }> = ({ staff }) => {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [isPending, startTransition] = useTransition();
    const [actionError, setActionError] = useState<string | null>(null);

    const [view, setView] = useState<StaffMember | null>(null);
    const [edit, setEdit] = useState<StaffMember | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<StaffMember | null>(null);
    const [addOpen, setAddOpen] = useState(false);
    const [credenciais, setCredenciais] = useState<{ email: string; senha: string } | null>(null);

    const [editForm, setEditForm] = useState({ nome: '', email: '', telefone: '', realizaPiercing: false, bio: '' });
    const [addForm, setAddForm] = useState({ nome: '', email: '', telefone: '', cpf: '', realizaPiercing: false });

    const filtered = staff.filter((m) =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase()) ||
        m.cpf.includes(search)
    );

    const abrirEditar = (m: StaffMember) => {
        setActionError(null);
        setEditForm({ nome: m.name, email: m.email, telefone: m.phone, realizaPiercing: m.realizaPiercing, bio: m.bio });
        setEdit(m);
    };
    const abrirAdicionar = () => {
        setActionError(null);
        setAddForm({ nome: '', email: '', telefone: '', cpf: '', realizaPiercing: false });
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
        fd.set('bio', editForm.bio);
        if (editForm.realizaPiercing) fd.set('realizaPiercing', 'on');
        startTransition(async () => {
            const res = await atualizarProfissional(fd);
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
        if (addForm.realizaPiercing) fd.set('realizaPiercing', 'on');
        startTransition(async () => {
            const res = await criarProfissional(fd);
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
            const res = await excluirProfissional(confirmDelete.id);
            if (res?.error) { setActionError(res.error); return; }
            setConfirmDelete(null);
            router.refresh();
        });
    };

    const servicos = (m: StaffMember) => m.realizaPiercing ? 'Tatuagem · Piercing' : 'Tatuagem';

    return (
        <div className="p-6 md:p-8 lg:p-12 max-w-7xl mx-auto w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                    <h1 className="font-tattoo text-4xl text-white mb-2">Tatuadores</h1>
                    <p className="text-text-muted text-sm">Gerencie os membros da equipe artística.</p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-text-muted">search</span>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Buscar por nome ou CPF..."
                            className="w-full bg-surface-dark border border-border-dark rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-text-muted focus:border-primary transition-all"
                        />
                    </div>
                    <button
                        onClick={abrirAdicionar}
                        className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 whitespace-nowrap transition-colors uppercase tracking-wide"
                    >
                        <span className="material-symbols-outlined text-lg">person_add</span>
                        <span className="hidden sm:inline">Adicionar Novo</span>
                    </button>
                </div>
            </div>

            {actionError && !view && !edit && !confirmDelete && !addOpen && (
                <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">{actionError}</div>
            )}

            <div className="bg-surface-dark border border-border-dark rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-surface-light text-text-muted uppercase text-xs font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Tatuador</th>
                                <th className="px-6 py-4">CPF</th>
                                <th className="px-6 py-4">Contato</th>
                                <th className="px-6 py-4">Serviços</th>
                                <th className="px-6 py-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-dark">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-text-muted">Nenhum tatuador encontrado.</td>
                                </tr>
                            ) : filtered.map((member) => (
                                <tr key={member.id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <Avatar src={member.avatar || undefined} name={member.name} className="size-10 rounded-full" />
                                            <div>
                                                <p className="font-bold text-white text-base">{member.name}</p>
                                                {member.username && <p className="text-xs text-text-muted">@{member.username}</p>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-text-light font-mono text-xs">{member.cpf || '—'}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-text-light">{member.email}</p>
                                        <p className="text-xs text-text-muted">{member.phone}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-text-light">{servicos(member)}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <button onClick={() => setView(member)} title="Ver detalhes" className="size-8 rounded flex items-center justify-center text-text-muted hover:text-white hover:bg-white/10 transition-colors">
                                                <span className="material-symbols-outlined text-lg">visibility</span>
                                            </button>
                                            <button onClick={() => abrirEditar(member)} title="Editar" className="size-8 rounded flex items-center justify-center text-text-muted hover:text-white hover:bg-white/10 transition-colors">
                                                <span className="material-symbols-outlined text-lg">edit_note</span>
                                            </button>
                                            <button onClick={() => { setActionError(null); setConfirmDelete(member); }} title="Excluir" className="size-8 rounded flex items-center justify-center text-red-500/70 hover:text-red-500 hover:bg-red-500/10 transition-colors">
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

            {/* Ver */}
            {view && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setView(null)}>
                    <div className="bg-surface-dark border border-border-dark rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-border-dark flex items-center gap-4">
                            <Avatar src={view.avatar || undefined} name={view.name} className="size-14 rounded-xl" textClassName="text-xl" />
                            <div>
                                <h3 className="text-xl font-bold text-white">{view.name}</h3>
                                {view.username && <p className="text-primary text-xs font-bold uppercase tracking-wide">@{view.username}</p>}
                            </div>
                        </div>
                        <div className="p-6 overflow-y-auto grid grid-cols-2 gap-5 text-sm">
                            <Info label="E-mail" value={view.email} full />
                            <Info label="Telefone" value={view.phone || '—'} />
                            <Info label="CPF" value={view.cpf || '—'} />
                            <Info label="Serviços" value={servicos(view)} />
                            <Info label="Especialidades" value={view.specialty || '—'} full />
                            <Info label="Bio" value={view.bio || '—'} full />
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
                            <h3 className="text-xl font-bold text-white">Editar tatuador</h3>
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
                            <label className="flex items-center gap-2.5 cursor-pointer select-none">
                                <input type="checkbox" checked={editForm.realizaPiercing} onChange={(e) => setEditForm(p => ({ ...p, realizaPiercing: e.target.checked }))} className="rounded border-border-dark bg-background-dark text-primary size-4" />
                                <span className="text-sm text-white">Também realiza piercing</span>
                            </label>
                            <div>
                                <label className={labelCls}>Bio</label>
                                <textarea value={editForm.bio} onChange={(e) => setEditForm(p => ({ ...p, bio: e.target.value }))} rows={3} className={`${inputCls} resize-none`} placeholder="Sobre o profissional" />
                            </div>
                            {actionError && <p className="text-red-500 text-xs">{actionError}</p>}
                        </div>
                        <div className="p-6 border-t border-border-dark flex justify-end gap-3 bg-background-dark">
                            <button onClick={() => setEdit(null)} disabled={isPending} className="px-4 py-2 text-text-muted hover:text-white font-bold text-sm disabled:opacity-50">Cancelar</button>
                            <button onClick={salvarEdicao} disabled={!editForm.nome.trim() || !editForm.email.trim() || isPending} className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg font-bold text-sm uppercase tracking-wide transition-colors disabled:opacity-50">
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
                            <h3 className="text-xl font-bold text-white">Novo tatuador</h3>
                        </div>
                        <div className="p-6 overflow-y-auto space-y-4">
                            <p className="text-text-muted text-xs">Cria o acesso com senha temporária (mostrada uma vez) e gera o @username automaticamente. O tatuador troca a senha no primeiro login.</p>
                            <div>
                                <label className={labelCls}>Nome <span className="text-primary">*</span></label>
                                <input value={addForm.nome} onChange={(e) => setAddForm(p => ({ ...p, nome: e.target.value }))} className={inputCls} placeholder="Nome do tatuador" />
                            </div>
                            <div>
                                <label className={labelCls}>E-mail <span className="text-primary">*</span></label>
                                <input value={addForm.email} onChange={(e) => setAddForm(p => ({ ...p, email: e.target.value }))} type="email" className={inputCls} placeholder="tatuador@email.com" />
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
                            <label className="flex items-center gap-2.5 cursor-pointer select-none">
                                <input type="checkbox" checked={addForm.realizaPiercing} onChange={(e) => setAddForm(p => ({ ...p, realizaPiercing: e.target.checked }))} className="rounded border-border-dark bg-background-dark text-primary size-4" />
                                <span className="text-sm text-white">Também realiza piercing</span>
                            </label>
                            {actionError && <p className="text-red-500 text-xs">{actionError}</p>}
                        </div>
                        <div className="p-6 border-t border-border-dark flex justify-end gap-3 bg-background-dark">
                            <button onClick={() => setAddOpen(false)} disabled={isPending} className="px-4 py-2 text-text-muted hover:text-white font-bold text-sm disabled:opacity-50">Cancelar</button>
                            <button onClick={salvarNovo} disabled={!addForm.nome.trim() || !addForm.email.trim() || isPending} className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg font-bold text-sm uppercase tracking-wide transition-colors disabled:opacity-50">
                                {isPending ? 'Criando...' : 'Criar tatuador'}
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
                            <h3 className="text-xl font-bold text-white mb-2">Excluir tatuador</h3>
                            <p className="text-text-muted text-sm">Remover <strong className="text-white">{confirmDelete.name}</strong> da equipe? O histórico é preservado e o acesso é bloqueado.</p>
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
                            <h3 className="text-xl font-bold text-white">Tatuador criado</h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <p className="text-text-muted text-sm"><strong className="text-white">Anote e repasse</strong> a senha temporária agora — ela não será exibida de novo. O tatuador troca no primeiro acesso.</p>
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

export default Staff;
