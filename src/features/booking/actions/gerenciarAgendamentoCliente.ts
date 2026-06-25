'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/shared/lib/prisma';
import { getCurrentUser } from '@/features/auth/data/session';

export type ClienteAgendamentoState = { ok?: boolean; error?: string };

function revalidar(agendamentoId: string) {
  revalidatePath(`/my-appointments/${agendamentoId}`);
  revalidatePath('/my-appointments');
  revalidatePath(`/admin/appointment/${agendamentoId}`);
  revalidatePath('/admin/schedule');
  revalidatePath('/admin/history');
}

// Carrega o agendamento garantindo que pertence ao cliente logado (autorização).
async function carregar(agendamentoId: string) {
  const usuario = await getCurrentUser();
  if (!usuario?.cliente) return { error: 'Sessão expirada.' as const };
  const ag = await prisma.agendamento.findFirst({
    where: { id: agendamentoId, clienteId: usuario.cliente.id, deletadoEm: null },
    select: { id: true, status: true },
  });
  if (!ag) return { error: 'Agendamento não encontrado.' as const };
  return { usuario, ag };
}

/** Cliente cancela (sem aprovação, mas com motivo obrigatório). */
export async function clienteCancelar(agendamentoId: string, motivo: string): Promise<ClienteAgendamentoState> {
  const r = await carregar(agendamentoId);
  if ('error' in r) return { error: r.error };
  const { usuario, ag } = r;

  const m = motivo.trim();
  if (!m) return { error: 'Descreva o motivo do cancelamento.' };
  if (ag.status === 'CANCELADO') return { error: 'Este agendamento já está cancelado.' };
  if (ag.status === 'CONCLUIDO') return { error: 'Não é possível cancelar uma sessão concluída.' };
  if (ag.status === 'EM_ANDAMENTO') return { error: 'A sessão está em andamento; fale com o profissional.' };

  await prisma.agendamento.update({
    where: { id: ag.id },
    data: {
      status: 'CANCELADO',
      motivoCancelamento: m,
      eventos: {
        create: {
          tipo: 'CANCELADO',
          autorUsuarioId: usuario.id,
          descricao: 'Cancelado pelo cliente.',
          dadosEvento: { de: ag.status, motivo: m },
        },
      },
    },
  });

  revalidar(ag.id);
  return { ok: true };
}

/**
 * Cliente propõe uma nova data. Volta para AGUARDANDO_CONFIRMACAO, mas agora quem confirma
 * é o PROFISSIONAL (a direção é inferida pelo autor do evento DATA_PROPOSTA). Pode partir de
 * AGENDADO, AGUARDANDO_CONFIRMACAO (renegociando) ou CANCELADO (revivendo o agendamento).
 */
export async function clienteRemarcar(agendamentoId: string, novaDataHora: string): Promise<ClienteAgendamentoState> {
  const r = await carregar(agendamentoId);
  if ('error' in r) return { error: r.error };
  const { usuario, ag } = r;

  if (!novaDataHora) return { error: 'Informe a nova data e hora.' };
  if (!['AGENDADO', 'AGUARDANDO_CONFIRMACAO', 'CANCELADO'].includes(ag.status)) {
    return { error: 'Não é possível remarcar esta sessão.' };
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
      motivoCancelamento: null, // se estava cancelado, limpa ao reviver
      eventos: {
        create: {
          tipo: 'DATA_PROPOSTA',
          autorUsuarioId: usuario.id,
          descricao: 'Cliente propôs uma nova data; aguardando confirmação do profissional.',
          dadosEvento: { iniciaEm: iniciaEm.toISOString(), de: ag.status },
        },
      },
    },
  });

  revalidar(ag.id);
  return { ok: true };
}
