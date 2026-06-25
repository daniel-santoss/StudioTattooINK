'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/shared/lib/prisma';
import { getCurrentUser } from '@/features/auth/data/session';
import { propostaPendentePorCliente } from '@/features/booking/lib/proposta';

export type ConfirmacaoState = { ok?: boolean; error?: string };

type MotivoRecusa = 'DIA' | 'HORARIO' | 'VALOR';

/**
 * Cliente confirma a data + valor que o profissional propôs.
 * Agendamento sai de AGUARDANDO_CONFIRMACAO para AGENDADO e registra o evento no histórico.
 */
export async function confirmarData(agendamentoId: string): Promise<ConfirmacaoState> {
  const usuario = await getCurrentUser();
  if (!usuario?.cliente) return { error: 'Sessão expirada.' };

  const ag = await prisma.agendamento.findFirst({
    where: { id: agendamentoId, clienteId: usuario.cliente.id, deletadoEm: null },
    select: { id: true, status: true },
  });
  if (!ag) return { error: 'Agendamento não encontrado.' };
  if (ag.status !== 'AGUARDANDO_CONFIRMACAO') {
    return { error: 'Este agendamento não está aguardando confirmação.' };
  }
  // Se foi o próprio cliente que propôs a data (reagendamento), quem confirma é o profissional.
  if (await propostaPendentePorCliente(ag.id)) {
    return { error: 'Aguardando o profissional confirmar a data que você propôs.' };
  }

  revalidatePath(`/my-appointments/${ag.id}`);
  revalidatePath('/my-appointments');
  return { ok: true };
}

/**
 * Cliente recusa a proposta. Motivos (DIA/HORARIO/VALOR) e observação são obrigatórios.
 * O status PERMANECE AGUARDANDO_CONFIRMACAO — cabe ao profissional repropor.
 */
export async function recusarData(
  agendamentoId: string,
  motivos: MotivoRecusa[],
  obs: string,
): Promise<ConfirmacaoState> {
  const usuario = await getCurrentUser();
  if (!usuario?.cliente) return { error: 'Sessão expirada.' };

  const motivosValidos = motivos.filter((m): m is MotivoRecusa => ['DIA', 'HORARIO', 'VALOR'].includes(m));
  if (motivosValidos.length === 0) return { error: 'Selecione ao menos um motivo.' };
  const observacao = obs.trim();
  if (!observacao) return { error: 'Descreva o motivo da recusa.' };

  const ag = await prisma.agendamento.findFirst({
    where: { id: agendamentoId, clienteId: usuario.cliente.id, deletadoEm: null },
    select: { id: true, status: true },
  });
  if (!ag) return { error: 'Agendamento não encontrado.' };
  if (ag.status !== 'AGUARDANDO_CONFIRMACAO') {
    return { error: 'Este agendamento não está aguardando confirmação.' };
  }
  if (await propostaPendentePorCliente(ag.id)) {
    return { error: 'Você propôs esta data; aguarde o profissional responder.' };
  }

  await prisma.agendamento.update({
    where: { id: ag.id },
    data: {
      motivosRecusaData: motivosValidos,
      obsRecusaData: observacao,
      eventos: {
        create: {
          tipo: 'DATA_RECUSADA',
          autorUsuarioId: usuario.id,
          descricao: 'Cliente recusou a data/valor propostos.',
          dadosEvento: { motivos: motivosValidos, obs: observacao },
        },
      },
    },
  });

  revalidatePath(`/my-appointments/${ag.id}`);
  revalidatePath('/my-appointments');
  return { ok: true };
}
