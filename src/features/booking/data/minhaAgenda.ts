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
      where: { clienteId },
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
