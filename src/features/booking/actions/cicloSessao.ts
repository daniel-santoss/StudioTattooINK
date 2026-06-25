'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/shared/lib/prisma';
import { getCurrentUser } from '@/features/auth/data/session';

export type CicloState = { ok?: boolean; error?: string };

// Carrega a sessão garantindo que pertence ao profissional logado (autorização).
async function carregarSessao(agendamentoId: string) {
  const usuario = await getCurrentUser();
  if (!usuario?.profissional) {
    return { error: 'Apenas o profissional responsável pode alterar a sessão.' as const };
  }
  const ag = await prisma.agendamento.findFirst({
    where: { id: agendamentoId, profissionalId: usuario.profissional.id, deletadoEm: null },
    select: { id: true, status: true, clienteId: true },
  });
  if (!ag) return { error: 'Agendamento não encontrado.' as const };
  return { usuario, ag };
}

/** AGENDADO → EM_ANDAMENTO (só o profissional dono; só se já confirmado pelo cliente). */
export async function iniciarSessao(agendamentoId: string): Promise<CicloState> {
  const r = await carregarSessao(agendamentoId);
  if ('error' in r) return { error: r.error };
  const { usuario, ag } = r;
  if (ag.status !== 'AGENDADO') {
    return { error: 'Só é possível iniciar uma sessão já confirmada (AGENDADA).' };
  }

  await prisma.agendamento.update({
    where: { id: ag.id },
    data: {
      status: 'EM_ANDAMENTO',
      eventos: {
        create: {
          tipo: 'STATUS_ALTERADO',
          autorUsuarioId: usuario.id,
          descricao: 'Sessão iniciada pelo profissional.',
          dadosEvento: { de: 'AGENDADO', para: 'EM_ANDAMENTO' },
        },
      },
    },
  });

  revalidatePath(`/admin/appointment/${ag.id}`);
  revalidatePath('/admin/schedule');
  return { ok: true };
}

/**
 * EM_ANDAMENTO → CONCLUIDO (+ métricas do cliente).
 * Apenas finaliza a sessão atual. Marcar a próxima sessão (em contrato multi-sessão) é uma
 * ação separada e opcional — ver `agendarProximaSessao`. Uma sessão pode ser finalizada sem
 * que a próxima esteja agendada (fica "aguardando agendamento da próxima sessão").
 */
export async function finalizarSessao(agendamentoId: string): Promise<CicloState> {
  const usuario = await getCurrentUser();
  if (!usuario?.profissional) {
    return { error: 'Apenas o profissional responsável pode alterar a sessão.' };
  }
  const ag = await prisma.agendamento.findFirst({
    where: { id: agendamentoId, profissionalId: usuario.profissional.id, deletadoEm: null },
    select: { id: true, status: true, clienteId: true },
  });
  if (!ag) return { error: 'Agendamento não encontrado.' };
  if (ag.status !== 'EM_ANDAMENTO') {
    return { error: 'Só é possível finalizar uma sessão em andamento.' };
  }

  await prisma.agendamento.update({
    where: { id: ag.id },
    data: {
      status: 'CONCLUIDO',
      eventos: {
        create: {
          tipo: 'STATUS_ALTERADO',
          autorUsuarioId: usuario.id,
          descricao: 'Sessão finalizada pelo profissional.',
          dadosEvento: { de: 'EM_ANDAMENTO', para: 'CONCLUIDO' },
        },
      },
    },
  });

  if (ag.clienteId) {
    await prisma.cliente.update({
      where: { id: ag.clienteId },
      data: { totalSessoes: { increment: 1 }, ultimaVisitaEm: new Date() },
    });
  }

  revalidatePath(`/admin/appointment/${ag.id}`);
  revalidatePath('/admin/schedule');
  revalidatePath('/admin/history');
  revalidatePath('/my-appointments');
  return { ok: true };
}

/**
 * Agenda a PRÓXIMA sessão de um contrato multi-sessão a partir de uma sessão já concluída.
 * Cria a sessão N+1 em AGUARDANDO_CONFIRMACAO (mesmo preço/sessão, evento DATA_PROPOSTA) →
 * o cliente confirma/recusa pelo fluxo existente. NÃO há agendamento automático.
 */
export async function agendarProximaSessao(agendamentoId: string, proximaDataHora: string): Promise<CicloState> {
  const usuario = await getCurrentUser();
  if (!usuario?.profissional) {
    return { error: 'Apenas o profissional responsável pode agendar a próxima sessão.' };
  }
  if (!proximaDataHora) {
    return { error: 'Defina a data da próxima sessão.' };
  }
  const ag = await prisma.agendamento.findFirst({
    where: { id: agendamentoId, profissionalId: usuario.profissional.id, deletadoEm: null },
    include: { servicoContratado: { include: { agendamentos: { select: { numeroSessao: true } } } } },
  });
  if (!ag) return { error: 'Agendamento não encontrado.' };
  if (ag.status !== 'CONCLUIDO') {
    return { error: 'Só é possível agendar a próxima sessão após concluir a atual.' };
  }

  const sc = ag.servicoContratado;
  if (!sc || ag.numeroSessao >= sc.numeroSessoes) {
    return { error: 'Este contrato não tem mais sessões a agendar.' };
  }
  const proximoNumero = ag.numeroSessao + 1;
  if (sc.agendamentos.some((s) => s.numeroSessao === proximoNumero)) {
    return { error: 'A próxima sessão já foi agendada.' };
  }

  const iniciaEm = new Date(`${proximaDataHora}:00-03:00`);
  if (iniciaEm.getTime() <= Date.now()) {
    return { error: 'A data e hora da próxima sessão devem ser futuras.' };
  }
  const terminaEm = new Date(iniciaEm.getTime() + 2 * 60 * 60 * 1000); // estimativa
  const precoSessao = sc.valorTotalCentavos != null ? Math.round(sc.valorTotalCentavos / sc.numeroSessoes) : null;

  const nova = await prisma.agendamento.create({
    data: {
      clienteId: ag.clienteId,
      profissionalId: ag.profissionalId,
      servicoId: ag.servicoId,
      servicoContratadoId: sc.id,
      numeroSessao: proximoNumero,
      iniciaEm,
      terminaEm,
      status: 'AGUARDANDO_CONFIRMACAO',
      tipo: ag.tipo,
      precoCentavos: precoSessao,
      observacoes: sc.descricao,
      eventos: {
        create: {
          tipo: 'DATA_PROPOSTA',
          autorUsuarioId: usuario.id,
          descricao: 'Profissional agendou a próxima sessão; aguardando confirmação do cliente.',
          dadosEvento: { iniciaEm: iniciaEm.toISOString(), numeroSessao: proximoNumero },
        },
      },
    },
  });

  revalidatePath(`/admin/appointment/${ag.id}`);
  revalidatePath(`/admin/appointment/${nova.id}`);
  revalidatePath('/admin/schedule');
  revalidatePath('/admin/history');
  revalidatePath('/my-appointments');
  return { ok: true };
}
