import 'server-only';
import { prisma } from '@/shared/lib/prisma';

// ============================================================
// Data Access Layer — Portfólio / Profissionais
// Única camada que conhece o banco. Server Components consomem
// estas funções; trocar a fonte não toca em nenhuma página.
// ============================================================

/** Lista resumida de profissionais (cards de /artists). */
export async function getAllArtists() {
  const profs = await prisma.profissional.findMany({
    where: { usuario: { deletadoEm: null } },
    include: {
      usuario: true,
      estilos: { include: { estilo: true } },
    },
    orderBy: { usuario: { nome: 'asc' } },
  });

  return profs.map((p) => ({
    id: p.id,
    name: p.usuario.nome,
    role: p.titulo,
    avatarUrl: p.usuario.avatarUrl ?? '',
    styles: p.estilos.map((e) => e.estilo.nome),
    summary: p.bio ?? undefined,
  }));
}

/** Perfil completo de um profissional, com portfólio. Retorna null se não existir. */
export async function getArtistById(id: string) {
  const p = await prisma.profissional.findUnique({
    where: { id },
    include: {
      usuario: true,
      estilos: { include: { estilo: true } },
      portfolio: { orderBy: { ordem: 'asc' } },
    },
  });
  if (!p) return null;

  return {
    id: p.id,
    name: p.usuario.nome,
    role: p.titulo,
    avatarUrl: p.usuario.avatarUrl ?? '',
    styles: p.estilos.map((e) => e.estilo.nome),
    instagram: p.instagram ?? '',
    summary: p.bio ?? undefined,
    portfolio: p.portfolio.map((item) => ({
      title: item.titulo,
      desc: item.descricao ?? '',
      img: item.imagemUrl,
    })),
  };
}

/** IDs para generateStaticParams (ISR). */
export async function getArtistIds(): Promise<string[]> {
  const profs = await prisma.profissional.findMany({ select: { id: true } });
  return profs.map((p) => p.id);
}
