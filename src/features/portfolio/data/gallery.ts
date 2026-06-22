import 'server-only';
import { prisma } from '@/shared/lib/prisma';

// ============================================================
// Data Access Layer — Galeria pública
// ============================================================

/** Itens da galeria com o profissional autor (para o card e o link de perfil). */
export async function getGallery() {
  const items = await prisma.profissionalGaleria.findMany({
    include: { profissional: { include: { usuario: true } } },
    orderBy: { criadoEm: 'desc' },
  });

  return items.map((g) => ({
    id: g.id,
    title: g.titulo,
    artist: g.profissional.usuario.nome,
    artistId: g.profissionalId,
    category: g.categoria,
    imageUrl: g.imagemUrl,
  }));
}
