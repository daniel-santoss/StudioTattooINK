'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/shared/lib/prisma';
import { getCurrentUser } from '@/features/auth/data/session';

export type GerenciarState = { error?: string; ok?: boolean } | null;

/**
 * Profissional aprova uma solicitação lançando data+hora+valor combinados.
 * Cria o Agendamento em AGUARDANDO_CONFIRMACAO e registra os eventos no histórico.
 */
export async function aprovarSolicitacao(_prev: GerenciarState, formData: FormData): Promise<GerenciarState> {
  const usuario = await getCurrentUser();
  if (!usuario) return { error: 'Sessão expirada.' };

  const solicitacaoId = String(formData.get('solicitacaoId') ?? '');
  const dataHora = String(formData.get('dataHora') ?? ''); // "YYYY-MM-DDTHH:mm"
  const valorTotalCentavos = parseInt(String(formData.get('valorCentavos') ?? '0'), 10);
  const numeroSessoes = Math.max(1, parseInt(String(formData.get('numeroSessoes') ?? '1'), 10) || 1);

  if (!dataHora) return { error: 'Informe a data e hora combinadas.' };
  if (!valorTotalCentavos || valorTotalCentavos <= 0) return { error: 'Informe o valor combinado.' };

  const sol = await prisma.solicitacaoAgendamento.findUnique({
    where: { id: solicitacaoId },
    include: { servico: true, cliente: { select: { usuarioId: true } } },
  });
  if (!sol || sol.status !== 'PENDENTE') {
    return { error: 'Solicitação não encontrada ou já tratada.' };
  }

  const profissionalId = sol.profissionalId ?? usuario.profissional?.id ?? null;
  if (!profissionalId) return { error: 'Nenhum profissional associado a esta solicitação.' };

  const iniciaEm = new Date(`${dataHora}:00-03:00`);
  const terminaEm = new Date(iniciaEm.getTime() + 2 * 60 * 60 * 1000); // estimativa; sessão tem duração variável
  const tipo = sol.servico?.categoria === 'PIERCING' ? 'PIERCING' : 'TATUAGEM';
  const precoSessaoCentavos = Math.round(valorTotalCentavos / numeroSessoes);

  // Cria o ServicoContratado (o "trabalho") já com a SESSÃO 1 e seus eventos,
  // tudo num create aninhado (atômico e compatível com o pooler do Supabase).
  await prisma.servicoContratado.create({
    data: {
      clienteId: sol.clienteId,
      profissionalId,
      servicoId: sol.servicoId,
      descricao: sol.descricao,
      valorTotalCentavos,
      numeroSessoes,
      agendamentos: {
        create: [
          {
            clienteId: sol.clienteId,
            profissionalId,
            servicoId: sol.servicoId,
            solicitacaoId: sol.id,
            numeroSessao: 1,
            iniciaEm,
            terminaEm,
            status: 'AGUARDANDO_CONFIRMACAO',
            tipo,
            precoCentavos: precoSessaoCentavos,
            observacoes: sol.descricao,
            eventos: {
              create: [
                {
                  tipo: 'SOLICITACAO_CRIADA',
                  autorUsuarioId: sol.cliente.usuarioId,
                  descricao: 'Solicitação criada pelo cliente.',
                  criadoEm: sol.criadoEm,
                },
                {
                  tipo: 'DATA_PROPOSTA',
                  autorUsuarioId: usuario.id,
                  descricao: 'Profissional lançou data e valor; aguardando confirmação do cliente.',
                  dadosEvento: { iniciaEm: iniciaEm.toISOString(), precoCentavos: precoSessaoCentavos, numeroSessoes },
                },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.solicitacaoAgendamento.update({
    where: { id: sol.id },
    data: { status: 'APROVADA', profissionalId },
  });

  revalidatePath('/admin/booking-requests');
  revalidatePath('/my-appointments');
  return { ok: true };
}

/** Profissional recusa a solicitação inteira (com motivo + observação). */
export async function recusarSolicitacao(_prev: GerenciarState, formData: FormData): Promise<GerenciarState> {
  const usuario = await getCurrentUser();
  if (!usuario) return { error: 'Sessão expirada.' };

  const solicitacaoId = String(formData.get('solicitacaoId') ?? '');
  const motivo = String(formData.get('motivo') ?? '').trim();
  const nota = String(formData.get('nota') ?? '').trim();
  if (!nota) return { error: 'Descreva o motivo da recusa.' };

  const sol = await prisma.solicitacaoAgendamento.findUnique({ where: { id: solicitacaoId } });
  if (!sol || sol.status !== 'PENDENTE') {
    return { error: 'Solicitação não encontrada ou já tratada.' };
  }

  await prisma.solicitacaoAgendamento.update({
    where: { id: solicitacaoId },
    data: { status: 'REJEITADA', motivoRejeicao: motivo ? `${motivo} — ${nota}` : nota },
  });

  revalidatePath('/admin/booking-requests');
  revalidatePath('/my-appointments');
  return { ok: true };
}
