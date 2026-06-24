import 'server-only';
import { prisma } from '@/shared/lib/prisma';

// Agenda vista por profissional/admin (tela Schedule). Dados reais de Agendamento.

export interface ScheduleItem {
  id: string;
  time: string;
  endTime: string;
  clientName: string;
  clientAvatar: string;
  artistName: string;
  service: string;
  status: 'confirmado' | 'pendente' | 'em-andamento' | 'cancelado' | 'rescheduling' | 'concluido';
  type: 'tattoo' | 'piercing' | 'orcamento';
}

const timeFmt = new Intl.DateTimeFormat('pt-BR', {
  hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo',
});
const fullDateFmt = new Intl.DateTimeFormat('pt-BR', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Sao_Paulo',
});
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
function reais(centavos: number | null): string {
  if (centavos == null) return 'A confirmar';
  return `R$ ${(centavos / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const AVATAR_FALLBACK = '/images/tatuadores/tatuador1.jpg';

const SCHED_STATUS: Record<string, ScheduleItem['status']> = {
  AGENDADO: 'confirmado', AGUARDANDO_CONFIRMACAO: 'pendente', EM_ANDAMENTO: 'em-andamento',
  CONCLUIDO: 'concluido', CANCELADO: 'cancelado', BLOQUEADO: 'confirmado', DISPONIVEL: 'confirmado',
};
const SCHED_TYPE: Record<string, ScheduleItem['type']> = {
  TATUAGEM: 'tattoo', PIERCING: 'piercing', ORCAMENTO: 'orcamento',
};

/**
 * Agendamentos para a tela de Agenda.
 * - profissionalId definido → só os daquele profissional (visão do tatuador).
 * - profissionalId null → todos (visão do admin/gerente).
 */
export async function getAgendaProfissional(profissionalId: string | null): Promise<ScheduleItem[]> {
  const agendamentos = await prisma.agendamento.findMany({
    where: {
      deletadoEm: null,
      ...(profissionalId ? { profissionalId } : {}),
    },
    include: {
      cliente: { include: { usuario: true } },
      profissional: { include: { usuario: true } },
      servico: true,
    },
    orderBy: { iniciaEm: 'asc' },
  });

  return agendamentos.map((a) => ({
    id: a.id,
    time: timeFmt.format(a.iniciaEm),
    endTime: timeFmt.format(a.terminaEm),
    clientName: a.cliente?.usuario.nome ?? 'Cliente',
    clientAvatar: a.cliente?.usuario.avatarUrl ?? AVATAR_FALLBACK,
    artistName: a.profissional.usuario.nome,
    service: a.servico?.nome ?? a.observacoes ?? 'Sessão',
    status: SCHED_STATUS[a.status] ?? 'confirmado',
    type: SCHED_TYPE[a.tipo] ?? 'tattoo',
  }));
}

// ============================================================
// Histórico de atendimentos (ServiceHistory)
// ============================================================

export interface HistoryItem {
  id: string;
  day: string;
  month: string;
  year: string;
  time: string;
  clientName: string;
  clientAvatar: string;
  service: string;
  status: 'concluido' | 'cancelado' | 'retoque';
  type: 'tattoo' | 'piercing' | 'orcamento';
}

const MESES_ABBR = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
function dmy(d: Date): { day: string; month: string; year: string } {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  return { day: get('day'), month: MESES_ABBR[parseInt(get('month'), 10) - 1] ?? '', year: get('year') };
}

export async function getHistoricoProfissional(profissionalId: string | null): Promise<HistoryItem[]> {
  const agendamentos = await prisma.agendamento.findMany({
    where: {
      deletadoEm: null,
      status: { in: ['CONCLUIDO', 'CANCELADO'] },
      ...(profissionalId ? { profissionalId } : {}),
    },
    include: { cliente: { include: { usuario: true } }, servico: true },
    orderBy: { iniciaEm: 'desc' },
  });

  return agendamentos.map((a) => {
    const { day, month, year } = dmy(a.iniciaEm);
    return {
      id: a.id,
      day, month, year,
      time: timeFmt.format(a.iniciaEm),
      clientName: a.cliente?.usuario.nome ?? 'Cliente',
      clientAvatar: a.cliente?.usuario.avatarUrl ?? AVATAR_FALLBACK,
      service: a.servico?.nome ?? a.observacoes ?? 'Sessão',
      status: a.status === 'CANCELADO' ? 'cancelado' : 'concluido',
      type: SCHED_TYPE[a.tipo] ?? 'tattoo',
    };
  });
}

// ============================================================
// Detalhe do agendamento na visão do profissional (ArtistAppointmentDetails)
// ============================================================

export interface AgendaDetalheProfissional {
  id: string;
  clientName: string;
  clientAvatar: string;
  clientType: 'Novo Cliente' | 'Recorrente' | 'VIP';
  clientPhone: string;
  clientSessions: number;
  service: string;
  fullDate: string;
  time: string;
  duration: string;
  status: 'confirmado' | 'em-andamento' | 'concluido' | 'cancelado' | 'rescheduling' | 'noshow';
  price: string;
  deposit: string;
  remaining: string;
  paymentStatus: 'Pendente' | 'Sinal Pago' | 'Total Pago';
  description: string;
  referenceImages: string[];
  medicalInfo: { allergies: string; conditions: string; skinType: string };
  internalNotes: string;
}

const ART_STATUS: Record<string, AgendaDetalheProfissional['status']> = {
  AGENDADO: 'confirmado', AGUARDANDO_CONFIRMACAO: 'confirmado', EM_ANDAMENTO: 'em-andamento',
  CONCLUIDO: 'concluido', CANCELADO: 'cancelado', BLOQUEADO: 'confirmado', DISPONIVEL: 'confirmado',
};
const PAG_STATUS_ART: Record<string, AgendaDetalheProfissional['paymentStatus']> = {
  PENDENTE: 'Pendente', SINAL_PAGO: 'Sinal Pago', PAGO_TOTAL: 'Total Pago',
};

export async function getAgendamentoDetalheProfissional(
  id: string,
  profissionalId: string | null,
): Promise<AgendaDetalheProfissional | null> {
  const a = await prisma.agendamento.findFirst({
    where: { id, deletadoEm: null, ...(profissionalId ? { profissionalId } : {}) },
    include: {
      cliente: { include: { usuario: true } },
      servico: true,
      servicoContratado: true,
    },
  });
  if (!a) return null;

  const horas = Math.max(1, Math.round((a.terminaEm.getTime() - a.iniciaEm.getTime()) / 3_600_000));
  const total = a.precoCentavos;
  const sinal = a.sinalCentavos ?? 0;
  const restante = total != null ? Math.max(0, total - sinal) : null;
  const statusCliente = a.cliente?.status;
  const clientType: AgendaDetalheProfissional['clientType'] =
    statusCliente === 'VIP' ? 'VIP' : statusCliente === 'ATIVO' ? 'Recorrente' : 'Novo Cliente';
  const nomeBase = a.servico?.nome ?? a.servicoContratado?.descricao ?? a.observacoes ?? 'Sessão';

  return {
    id: a.id,
    clientName: a.cliente?.usuario.nome ?? 'Cliente',
    clientAvatar: a.cliente?.usuario.avatarUrl ?? AVATAR_FALLBACK,
    clientType,
    clientPhone: a.cliente?.usuario.telefone ?? '—',
    clientSessions: a.cliente?.totalSessoes ?? 0,
    service: a.servicoContratado && a.servicoContratado.numeroSessoes > 1
      ? `${nomeBase} — Sessão ${a.numeroSessao}/${a.servicoContratado.numeroSessoes}`
      : nomeBase,
    fullDate: cap(fullDateFmt.format(a.iniciaEm)),
    time: timeFmt.format(a.iniciaEm),
    duration: `${horas} hora${horas > 1 ? 's' : ''}`,
    status: ART_STATUS[a.status] ?? 'confirmado',
    price: reais(total),
    deposit: reais(sinal),
    remaining: restante != null ? reais(restante) : 'A confirmar',
    paymentStatus: PAG_STATUS_ART[a.statusPagamento] ?? 'Pendente',
    description: a.observacoes ?? a.servicoContratado?.descricao ?? '',
    referenceImages: a.imagensReferencia ?? [],
    medicalInfo: {
      allergies: a.cliente?.alergias ?? 'Nenhuma',
      conditions: a.cliente?.observacoesMedicas ?? 'Nenhuma',
      skinType: '',
    },
    internalNotes: a.observacoesInternas ?? '',
  };
}
