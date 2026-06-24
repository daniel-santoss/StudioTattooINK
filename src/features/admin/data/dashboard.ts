import 'server-only';
import { prisma } from '@/shared/lib/prisma';

// Agregados reais para o Dashboard (Início). Sem faturamento/avaliação (não existem no schema).

export interface ResumoProfissional {
  agendadas: number;   // AGENDADO (confirmadas)
  aguardando: number;  // AGUARDANDO_CONFIRMACAO
  concluidas: number;  // CONCLUIDO
}

export interface ResumoAdmin {
  candidaturasPendentes: number;
  clientesAtivos: number;
  profissionais: number;
}

export async function getResumoProfissional(profissionalId: string | null): Promise<ResumoProfissional> {
  const base = { deletadoEm: null, ...(profissionalId ? { profissionalId } : {}) };
  const [agendadas, aguardando, concluidas] = await Promise.all([
    prisma.agendamento.count({ where: { ...base, status: 'AGENDADO' } }),
    prisma.agendamento.count({ where: { ...base, status: 'AGUARDANDO_CONFIRMACAO' } }),
    prisma.agendamento.count({ where: { ...base, status: 'CONCLUIDO' } }),
  ]);
  return { agendadas, aguardando, concluidas };
}

export async function getResumoAdmin(): Promise<ResumoAdmin> {
  const [candidaturasPendentes, clientesAtivos, profissionais] = await Promise.all([
    prisma.profissionalCandidatura.count({ where: { status: 'PENDENTE' } }),
    prisma.cliente.count({ where: { status: 'ATIVO' } }),
    prisma.profissional.count(),
  ]);
  return { candidaturasPendentes, clientesAtivos, profissionais };
}
