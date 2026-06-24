import 'server-only';
import { prisma } from '@/shared/lib/prisma';

// Agenda do cliente: agendamentos confirmados + solicitações pendentes,
// mapeados para o formato que o componente ClientDashboard já espera.

export interface AgendaItem {
  id: string;
  artist: string;
  service: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled' | 'pending' | 'rescheduling';
  price: string;
  image: string;
}

const dateFmt = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit', month: 'short', year: 'numeric', timeZone: 'America/Sao_Paulo',
});
const timeFmt = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo',
});

const AVATAR_FALLBACK = '/images/tatuadores/tatuador1.jpg';

function reais(centavos: number | null): string {
  if (centavos == null) return 'A confirmar';
  return `R$ ${(centavos / 100).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`;
}

const AG_STATUS: Record<string, AgendaItem['status']> = {
  AGUARDANDO_CONFIRMACAO: 'pending', AGENDADO: 'upcoming', EM_ANDAMENTO: 'upcoming',
  CONCLUIDO: 'completed', CANCELADO: 'cancelled', BLOQUEADO: 'upcoming', DISPONIVEL: 'upcoming',
};
const SOL_STATUS: Record<string, AgendaItem['status']> = {
  PENDENTE: 'pending', APROVADA: 'upcoming', REJEITADA: 'cancelled', CANCELADA: 'cancelled',
};

export async function getMinhaAgenda(clienteId: string): Promise<AgendaItem[]> {
  const [agendamentos, solicitacoes] = await Promise.all([
    prisma.agendamento.findMany({
      where: { clienteId, deletadoEm: null },
      include: { profissional: { include: { usuario: true } }, servico: true },
      orderBy: { iniciaEm: 'desc' },
    }),
    prisma.solicitacaoAgendamento.findMany({
      // APROVADA já vira Agendamento; não duplica o card aqui.
      where: { clienteId, status: { not: 'APROVADA' } },
      include: { profissional: { include: { usuario: true } } },
      orderBy: { criadoEm: 'desc' },
    }),
  ]);

  const doAgendamento: AgendaItem[] = agendamentos.map((a) => ({
    id: a.id,
    artist: a.profissional.usuario.nome,
    service: a.servico?.nome ?? a.observacoes ?? 'Sessão',
    date: dateFmt.format(a.iniciaEm),
    time: timeFmt.format(a.iniciaEm),
    status: AG_STATUS[a.status] ?? 'upcoming',
    price: reais(a.precoCentavos),
    image: a.profissional.usuario.avatarUrl ?? AVATAR_FALLBACK,
  }));

  const daSolicitacao: AgendaItem[] = solicitacoes.map((s) => ({
    id: s.id,
    artist: s.profissional?.usuario.nome ?? 'A definir',
    service: s.descricao.length > 60 ? `${s.descricao.slice(0, 57)}…` : s.descricao,
    date: s.dataPreferida ? dateFmt.format(s.dataPreferida) : 'A combinar',
    time: s.periodoPreferido ?? '',
    status: SOL_STATUS[s.status] ?? 'pending',
    price: 'A confirmar',
    image: s.profissional?.usuario.avatarUrl ?? AVATAR_FALLBACK,
  }));

  return [...doAgendamento, ...daSolicitacao];
}

// ============================================================
// Detalhe de um agendamento (tela ClientAppointmentDetails)
// ============================================================

export interface AgendaDetalhe {
  id: string;
  artist: string;
  artistRole: string;
  artistAvatar: string;
  service: string;
  fullDate: string;
  time: string;
  duration: string;
  status: AgendaItem['status'];
  aguardandoConfirmacao: boolean;
  price: string;
  paidAmount: string;
  remainingAmount: string;
  paymentStatus: 'Pendente' | 'Pago' | 'Parcial';
  location: string;
  description: string;
  referenceImages: string[];
  cancellationReason?: string;
  recusaAnterior?: { motivos: string[]; obs: string } | null;
}

const fullDateFmt = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Sao_Paulo',
});
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const PAG_STATUS: Record<string, AgendaDetalhe['paymentStatus']> = {
  PENDENTE: 'Pendente', SINAL_PAGO: 'Parcial', PAGO_TOTAL: 'Pago',
};
const MOTIVO_LABEL: Record<string, string> = { DIA: 'Dia', HORARIO: 'Horário', VALOR: 'Valor' };

export async function getAgendamentoDetalhe(id: string, clienteId: string): Promise<AgendaDetalhe | null> {
  const a = await prisma.agendamento.findFirst({
    where: { id, clienteId, deletadoEm: null },
    include: {
      profissional: { include: { usuario: true } },
      servico: true,
      servicoContratado: true,
    },
  });

  if (a) {
    const horas = Math.max(1, Math.round((a.terminaEm.getTime() - a.iniciaEm.getTime()) / 3_600_000));
    const pago = a.sinalCentavos ?? 0;
    const total = a.precoCentavos;
    const nomeBase = a.servico?.nome ?? a.servicoContratado?.descricao ?? a.observacoes ?? 'Sessão';
    return {
      id: a.id,
      artist: a.profissional.usuario.nome,
      artistRole: a.profissional.titulo,
      artistAvatar: a.profissional.usuario.avatarUrl ?? AVATAR_FALLBACK,
      service: a.servicoContratado && a.servicoContratado.numeroSessoes > 1
        ? `${nomeBase} — Sessão ${a.numeroSessao}/${a.servicoContratado.numeroSessoes}`
        : nomeBase,
      fullDate: cap(fullDateFmt.format(a.iniciaEm)),
      time: timeFmt.format(a.iniciaEm),
      duration: `${horas} hora${horas > 1 ? 's' : ''}`,
      status: AG_STATUS[a.status] ?? 'upcoming',
      aguardandoConfirmacao: a.status === 'AGUARDANDO_CONFIRMACAO',
      price: reais(total),
      paidAmount: reais(pago),
      remainingAmount: total != null ? reais(total - pago) : 'A confirmar',
      paymentStatus: PAG_STATUS[a.statusPagamento] ?? 'Pendente',
      location: a.local ?? 'Ink Studio',
      description: a.observacoes ?? a.servicoContratado?.descricao ?? '',
      referenceImages: a.imagensReferencia ?? [],
      cancellationReason: a.motivoCancelamento ?? undefined,
      recusaAnterior: a.motivosRecusaData.length
        ? { motivos: a.motivosRecusaData.map((m) => MOTIVO_LABEL[m] ?? m), obs: a.obsRecusaData ?? '' }
        : null,
    };
  }

  // Sem agendamento: pode ser uma solicitação ainda pendente do profissional (read-only).
  const s = await prisma.solicitacaoAgendamento.findFirst({
    where: { id, clienteId },
    include: { profissional: { include: { usuario: true } }, servico: true },
  });
  if (!s) return null;

  return {
    id: s.id,
    artist: s.profissional?.usuario.nome ?? 'A definir',
    artistRole: s.profissional?.titulo ?? 'A definir',
    artistAvatar: s.profissional?.usuario.avatarUrl ?? AVATAR_FALLBACK,
    service: s.servico?.nome ?? s.descricao,
    fullDate: s.dataPreferida ? cap(fullDateFmt.format(s.dataPreferida)) : 'A combinar',
    time: s.periodoPreferido ?? 'A combinar',
    duration: 'A definir',
    status: SOL_STATUS[s.status] ?? 'pending',
    aguardandoConfirmacao: false,
    price: reais(s.precoOrcadoCentavos),
    paidAmount: reais(0),
    remainingAmount: 'A confirmar',
    paymentStatus: 'Pendente',
    location: 'Ink Studio',
    description: s.descricao,
    referenceImages: s.imagensReferencia ?? [],
    recusaAnterior: null,
  };
}
