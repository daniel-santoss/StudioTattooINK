'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/shared/lib/prisma';
import { getCurrentUser } from '@/features/auth/data/session';

export type BookingState = { error?: string; ok?: boolean } | null;

/** Cria uma solicitação de agendamento para o cliente logado. */
export async function criarSolicitacao(_prev: BookingState, formData: FormData): Promise<BookingState> {
  const usuario = await getCurrentUser();
  if (!usuario) return { error: 'Sessão expirada. Faça login novamente.' };

  // Só clientes solicitam agendamento.
  if (!usuario.cliente) {
    return { error: 'Apenas contas de cliente podem solicitar agendamento.' };
  }

  const descricao = String(formData.get('descricao') ?? '').trim();
  if (descricao.length < 5) {
    return { error: 'Descreva sua ideia com um pouco mais de detalhe.' };
  }

  const profissionalId = String(formData.get('profissionalId') ?? '') || null;
  const servicoId = String(formData.get('servicoId') ?? '') || null;
  const periodoPreferido = String(formData.get('periodo') ?? '') || null;
  const dataRaw = String(formData.get('dataPreferida') ?? '');
  const dataPreferida = dataRaw ? new Date(`${dataRaw}T12:00:00-03:00`) : null;
  const alergias = String(formData.get('alergias') ?? '').trim() || null;

  await prisma.solicitacaoAgendamento.create({
    data: {
      clienteId: usuario.cliente.id,
      profissionalId,
      servicoId,
      descricao,
      dataPreferida,
      periodoPreferido,
      alergias,
      status: 'PENDENTE',
    },
  });

  revalidatePath('/my-appointments');
  return { ok: true };
}
