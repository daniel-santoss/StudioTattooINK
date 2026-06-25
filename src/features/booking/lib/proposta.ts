import 'server-only';
import { prisma } from '@/shared/lib/prisma';

/**
 * Direção da confirmação de data.
 *
 * O status AGUARDANDO_CONFIRMACAO não diz QUEM precisa confirmar — isso depende de quem
 * fez a última proposta (evento DATA_PROPOSTA, log append-only = fonte da verdade):
 * - proposta feita pelo PROFISSIONAL  → o CLIENTE confirma.
 * - proposta feita pelo CLIENTE       → o PROFISSIONAL confirma.
 */

// Pura: compara o autor da última proposta com o usuário do cliente.
export function propostaDoCliente(
  clienteUsuarioId?: string | null,
  ultimoAutorPropostaId?: string | null,
): boolean {
  return !!clienteUsuarioId && clienteUsuarioId === ultimoAutorPropostaId;
}

// Para uso nas Server Actions: consulta o banco e diz se a proposta pendente é do cliente.
export async function propostaPendentePorCliente(agendamentoId: string): Promise<boolean> {
  const ag = await prisma.agendamento.findUnique({
    where: { id: agendamentoId },
    select: {
      cliente: { select: { usuarioId: true } },
      eventos: {
        where: { tipo: 'DATA_PROPOSTA' },
        orderBy: { criadoEm: 'desc' },
        take: 1,
        select: { autorUsuarioId: true },
      },
    },
  });
  return propostaDoCliente(ag?.cliente?.usuarioId, ag?.eventos[0]?.autorUsuarioId);
}
