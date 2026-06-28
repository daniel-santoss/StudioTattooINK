'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { aprovarCandidatura, recusarCandidatura } from '@/features/admin/actions/candidatura';
import Avatar from '@/shared/components/Avatar';
import CopyButton from '@/shared/components/CopyButton';

interface RequestData {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string; // ISO ou ''
  portfolio: string;
  experience: string; // label legível
  styles: string[];
  customStyle?: string;
  requestDate: string;
  avatarUrl: string;
  realizaPiercing?: boolean;
}

const Requests: React.FC<{ requests: RequestData[] }> = ({ requests }) => {
  const router = useRouter();
  const [selectedRequest, setSelectedRequest] = useState<RequestData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isPending, startTransition] = useTransition();
  const [actionError, setActionError] = useState<string | null>(null);
  const [confirmRejectId, setConfirmRejectId] = useState<string | null>(null);
  const [credenciais, setCredenciais] = useState<{ email: string; senha: string } | null>(null);

  const handleOpenDetails = (request: RequestData) => {
    setActionError(null);
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const aprovar = (id: string) => {
    setActionError(null);
    startTransition(async () => {
      const res = await aprovarCandidatura(id);
      if (res?.error) { setActionError(res.error); return; }
      handleCloseModal();
      if (res?.credenciais) setCredenciais(res.credenciais);
      router.refresh();
    });
  };

  const recusar = (id: string) => {
    setActionError(null);
    startTransition(async () => {
      const res = await recusarCandidatura(id);
      if (res?.error) { setActionError(res.error); return; }
      setConfirmRejectId(null);
      handleCloseModal();
      router.refresh();
    });
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto w-full">
      <div className="flex flex-col justify-between gap-4 mb-6 md:mb-10">
        <div>
           <h1 className="font-tattoo text-3xl md:text-5xl text-white mb-2">Solicitações</h1>
           <p className="text-text-muted text-sm font-display tracking-wide">Analise e gerencie candidaturas de novos artistas.</p>
        </div>
      </div>

      {actionError && !isModalOpen && !confirmRejectId && (
        <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3">{actionError}</div>
      )}

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
                      <div className="flex items-center gap-4 w-full md:flex-1">
                          <Avatar src={req.avatarUrl || undefined} name={req.name} className="size-14 md:size-16 rounded-xl shrink-0" textClassName="text-2xl" />
                          <div className="min-w-0 flex-1">
                              <h3 className="text-lg font-bold text-white truncate">{req.name}</h3>
                              <p className="text-sm text-text-muted mb-1 truncate">{req.email}</p>
                              <div className="flex items-center gap-1.5 text-xs text-text-muted">
                                  <span className="material-symbols-outlined text-sm">calendar_today</span>
                                  <span className="whitespace-nowrap">{req.requestDate}</span>
                              </div>
                          </div>
                      </div>

                      <div className="flex items-center gap-3 w-full md:w-auto pt-4 md:pt-0 border-t border-border-dark/50 md:border-0">
                          <button
                            onClick={() => handleOpenDetails(req)}
                            className="flex-1 md:flex-none px-4 py-2 border border-border-dark hover:bg-white/5 text-white rounded-lg font-bold text-sm transition-colors whitespace-nowrap"
                          >
                              Ver Detalhes
                          </button>
                          <button
                            onClick={() => aprovar(req.id)}
                            disabled={isPending}
                            title="Aprovar candidatura"
                            className="size-10 shrink-0 flex items-center justify-center bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                              <span className="material-symbols-outlined">check</span>
                          </button>
                          <button
                            onClick={() => setConfirmRejectId(req.id)}
                            disabled={isPending}
                            title="Recusar candidatura"
                            className="size-10 shrink-0 flex items-center justify-center bg-red-500/10 text-red-500 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
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
                <div className="flex items-center justify-between p-6 border-b border-border-dark bg-surface-light/30 rounded-t-2xl sticky top-0 z-10 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <Avatar src={selectedRequest.avatarUrl || undefined} name={selectedRequest.name} className="size-12 sm:size-16 rounded-xl" textClassName="text-2xl" />
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold text-white">{selectedRequest.name}</h2>
                            <p className="text-text-muted text-xs sm:text-sm">Solicitação de Cadastro</p>
                        </div>
                    </div>
                    <button
                        onClick={handleCloseModal}
                        className="size-10 rounded-full bg-black/20 hover:bg-white/10 text-text-muted hover:text-white transition-colors flex items-center justify-center"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="p-6 space-y-8 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-surface-light">
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
                                <p className="text-white font-medium">{selectedRequest.dob ? new Date(selectedRequest.dob).toLocaleDateString('pt-BR') : '—'}</p>
                            </div>
                            <div>
                                <label className="block text-xs text-text-muted mb-1">Data da Solicitação</label>
                                <p className="text-white font-medium">{selectedRequest.requestDate}</p>
                            </div>
                        </div>
                    </section>

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
                                    <p className="text-white font-medium">{selectedRequest.experience}</p>
                                </div>
                                {selectedRequest.realizaPiercing && (
                                  <div>
                                    <label className="block text-xs text-text-muted mb-1">Serviços Adicionais</label>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-full text-xs font-bold">
                                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>more_horiz</span>
                                      Realiza Body Piercing
                                    </span>
                                  </div>
                                )}
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

                <div className="p-6 border-t border-border-dark bg-background-dark/50 flex flex-col gap-3 rounded-b-2xl sticky bottom-0 backdrop-blur-md">
                    {actionError && <p className="text-red-500 text-xs text-center">{actionError}</p>}
                    <div className="flex flex-col sm:flex-row gap-4 justify-end">
                        <button
                            onClick={() => setConfirmRejectId(selectedRequest.id)}
                            disabled={isPending}
                            className="px-6 py-3 border border-red-500/30 text-red-500 hover:bg-red-500/10 rounded-lg font-bold text-sm uppercase tracking-wide flex items-center justify-center gap-2 w-full sm:w-auto transition-colors disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined text-lg">block</span>
                            Recusar
                        </button>
                        <button
                            onClick={() => aprovar(selectedRequest.id)}
                            disabled={isPending}
                            className="px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-sm uppercase tracking-wide flex items-center justify-center gap-2 w-full sm:w-auto transition-colors disabled:opacity-50"
                        >
                            <span className="material-symbols-outlined text-lg">check_circle</span>
                            {isPending ? 'Aprovando...' : 'Aprovar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Confirmar recusa */}
      {confirmRejectId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in" onClick={() => !isPending && setConfirmRejectId(null)}>
          <div className="bg-surface-dark border border-border-dark rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 text-center">
              <div className="size-12 rounded-full flex items-center justify-center mx-auto mb-4 bg-red-500/10 text-red-500">
                <span className="material-symbols-outlined text-3xl">block</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Recusar candidatura</h3>
              <p className="text-text-muted text-sm">A candidatura será marcada como recusada e sairá da lista. Esta ação não cria login.</p>
              {actionError && <p className="text-red-500 text-xs mt-3">{actionError}</p>}
            </div>
            <div className="flex border-t border-border-dark">
              <button onClick={() => setConfirmRejectId(null)} disabled={isPending} className="flex-1 py-4 text-sm font-bold text-text-muted hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50">Voltar</button>
              <div className="w-px bg-border-dark"></div>
              <button onClick={() => recusar(confirmRejectId)} disabled={isPending} className="flex-1 py-4 text-sm font-bold uppercase tracking-wide text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50">
                {isPending ? 'Recusando...' : 'Recusar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Credenciais geradas (mostradas uma única vez) */}
      {credenciais && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface-dark border border-border-dark rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-border-dark flex items-center gap-2 text-emerald-500">
              <span className="material-symbols-outlined">check_circle</span>
              <h3 className="text-xl font-bold text-white">Candidatura aprovada</h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-text-muted text-sm">
                O login do profissional foi criado. <strong className="text-white">Anote e repasse</strong> a senha temporária agora — ela não será exibida de novo. O profissional deve trocá-la no primeiro acesso.
              </p>
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
              <button onClick={() => setCredenciais(null)} className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg font-bold text-sm uppercase tracking-wide transition-colors">
                Concluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests;
