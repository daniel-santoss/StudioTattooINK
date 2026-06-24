import 'server-only';
import { prisma } from '@/shared/lib/prisma';

// ============================================================
// Data Access Layer — Booking (catálogos para o formulário)
// ============================================================

/** Profissionais (com portfólio) para o passo "escolher profissional" do booking. */
export async function getProfissionaisParaBooking() {
  const profs = await prisma.profissional.findMany({
    where: { usuario: { deletadoEm: null }, aceitandoAgendamentos: true },
    include: {
      usuario: true,
      portfolio: { orderBy: { ordem: 'asc' } },
    },
    orderBy: { usuario: { nome: 'asc' } },
  });

  return profs.map((p) => ({
    id: p.id,
    name: p.usuario.nome,
    role: p.titulo,
    img: p.usuario.avatarUrl ?? '',
    portfolio: p.portfolio.map((a) => ({ id: a.id, title: a.titulo, imageUrl: a.imagemUrl })),
  }));
}

/** Serviços ativos para o seletor do formulário. */
export async function getServicos() {
  const servicos = await prisma.servico.findMany({
    where: { ativo: true },
    orderBy: [{ categoria: 'asc' }, { nome: 'asc' }],
    select: { id: true, nome: true, categoria: true },
  });
  return servicos;
}

const REQ_FMT = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo',
});

/**
 * Solicitações PENDENTES para o profissional (as dele + as sem preferência).
 * Se profissionalId for null (ex.: admin), retorna todas as pendentes.
 */
export async function getSolicitacoesPendentes(profissionalId: string | null) {
  const sols = await prisma.solicitacaoAgendamento.findMany({
    where: {
      status: 'PENDENTE',
      ...(profissionalId ? { OR: [{ profissionalId }, { profissionalId: null }] } : {}),
    },
    include: { cliente: { include: { usuario: true } }, servico: true },
    orderBy: { criadoEm: 'desc' },
  });

  return sols.map((s) => ({
    id: s.id,
    clientName: s.cliente.usuario.nome,
    clientEmail: s.cliente.usuario.email,
    clientPhone: s.cliente.usuario.telefone ?? '—',
    clientAvatar: s.cliente.usuario.avatarUrl ?? '/images/tatuadores/tatuador1.jpg',
    service: s.servico?.nome ?? 'A definir',
    periodo: s.periodoPreferido ?? 'Sem preferência',
    description: s.descricao,
    medicalInfo: { allergies: s.alergias ?? '', notes: s.observacoesMedicas ?? '' },
    requestedAt: REQ_FMT.format(s.criadoEm),
  }));
}
