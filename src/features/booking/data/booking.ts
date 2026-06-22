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
