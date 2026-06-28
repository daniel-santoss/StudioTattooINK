'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/shared/lib/prisma';
import { getCurrentUser, MSG_PRIMEIRO_ACESSO } from '@/features/auth/data/session';
import { propostaPendentePorCliente } from '@/features/booking/lib/proposta';

export type GestaoAgendamentoState = { ok?: boolean; error?: string };

// Revalida todas as telas que listam/exibem o agendamento.
function revalidar(agendamentoId: string) {
  revalidatePath(`/admin/appointment/${agendamentoId}`);
  revalidatePath('/admin/schedule');
  revalidatePath('/admin/history');
  revalidatePath(`/my-appointments/${agendamentoId}`);
  revalidatePath('/my-appointments');
}

/**
 * Carrega o agendamento garantindo que o usuário pode gerenciá-lo:
 * profissional DONO (filtra por profissionalId) ou ADMIN (vê todos).
 */
async function carregarParaGestao(agendamentoId: string) {
  const usuario = await getCurrentUser();
  if (!usuario) return { error: 'Sessão expirada.' as const };
  if (usuario.primeiroAcesso) return { error: MSG_PRIMEIRO_ACESSO };

  const ehAdmin = usuario.tipo === 'ADMIN';
  const meuProfId = usuario.profissional?.id ?? null;
  if (!ehAdmin && !meuProfId) {
    return { error: 'Você não tem permissão para gerenciar agendamentos.' as const };
  }

  const ag = await prisma.agendamento.findFirst({
    where: {
      id: agendamentoId,
      deletadoEm: null,
      ...(ehAdmin ? {} : { profissionalId: meuProfId! }),
    },
    select: { id: true, status: true },
  });
  if (!ag) return { error: 'Agendamento não encontrado.' as const };
  return { usuario, ag };
}

/** Cancela o agendamento (motivo obrigatório). Não é possível cancelar concluído/já cancelado. */
export async function cancelarAgendamento(agendamentoId: string, motivo: string): Promise<GestaoAgendamentoState> {
  const r = await carregarParaGestao(agendamentoId);
  if ('error' in r) return { error: r.error };
  const { usuario, ag } = r;

  const m = motivo.trim();
  if (!m) return { error: 'Descreva o motivo do cancelamento.' };
  if (ag.status === 'CANCELADO') return { error: 'Este agendamento já está cancelado.' };
  if (ag.status === 'CONCLUIDO') return { error: 'Não é possível cancelar uma sessão concluída.' };

  await prisma.agendamento.update({
    where: { id: ag.id },
    data: {
      status: 'CANCELADO',
      motivoCancelamento: m,
      eventos: {
        create: {
          tipo: 'CANCELADO',
          autorUsuarioId: usuario.id,
          descricao: 'Agendamento cancelado.',
          dadosEvento: { de: ag.status, motivo: m },
        },
      },
    },
  });

  revalidar(ag.id);
  return { ok: true };
}

/**
 * Profissional confirma a data que o CLIENTE propôs (reagendamento). → AGENDADO.
 * Só vale quando a última proposta foi do cliente (senão é o cliente quem deve confirmar).
 * Para recusar a data do cliente, o profissional usa `remarcarAgendamento` (contrapropõe).
 */
export async function confirmarRemarcacaoCliente(agendamentoId: string): Promise<GestaoAgendamentoState> {
  const r = await carregarParaGestao(agendamentoId);
  if ('error' in r) return { error: r.error };
  const { usuario, ag } = r;

  if (ag.status !== 'AGUARDANDO_CONFIRMACAO') {
    return { error: 'Não há proposta de data para confirmar.' };
  }
  if (!(await propostaPendentePorCliente(ag.id))) {
    return { error: 'Esta data foi proposta por você; aguarde a confirmação do cliente.' };
  }

  await prisma.agendamento.update({
    where: { id: ag.id },
    data: {
      status: 'AGENDADO',
      eventos: {
        create: {
          tipo: 'DATA_CONFIRMADA',
          autorUsuarioId: usuario.id,
          descricao: 'Profissional confirmou a data proposta pelo cliente.',
        },
      },
    },
  });

  revalidar(ag.id);
  return { ok: true };
}

/**
 * Remarca o agendamento para nova data/hora. Volta para AGUARDANDO_CONFIRMACAO
 * (o cliente reconfirma, como no fluxo de novo agendamento) e registra DATA_PROPOSTA.
 * Só a partir de AGENDADO ou AGUARDANDO_CONFIRMACAO; data deve ser futura.
 */
export async function remarcarAgendamento(agendamentoId: string, novaDataHora: string): Promise<GestaoAgendamentoState> {
  const r = await carregarParaGestao(agendamentoId);
  if ('error' in r) return { error: r.error };
  const { usuario, ag } = r;

  if (!novaDataHora) return { error: 'Informe a nova data e hora.' };
  if (ag.status !== 'AGENDADO' && ag.status !== 'AGUARDANDO_CONFIRMACAO') {
    return { error: 'Só é possível remarcar sessões agendadas ou aguardando confirmação.' };
  }

  const iniciaEm = new Date(`${novaDataHora}:00-03:00`);
  if (iniciaEm.getTime() <= Date.now()) {
    return { error: 'A nova data e hora devem ser futuras.' };
  }
  const terminaEm = new Date(iniciaEm.getTime() + 2 * 60 * 60 * 1000); // estimativa

  await prisma.agendamento.update({
    where: { id: ag.id },
    data: {
      iniciaEm,
      terminaEm,
      status: 'AGUARDANDO_CONFIRMACAO',
      eventos: {
        create: {
          tipo: 'DATA_PROPOSTA',
          autorUsuarioId: usuario.id,
          descricao: 'Profissional remarcou a sessão; aguardando confirmação do cliente.',
          dadosEvento: { iniciaEm: iniciaEm.toISOString(), de: ag.status },
        },
      },
    },
  });

  revalidar(ag.id);
  return { ok: true };
}
