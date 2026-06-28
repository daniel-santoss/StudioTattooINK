import 'server-only';
import { prisma } from '@/shared/lib/prisma';

// Dados reais do perfil do usuário logado (tela Profile, somente leitura por enquanto).

export interface PerfilPortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export interface PerfilData {
  role: 'client' | 'artist' | 'admin';
  name: string;
  email: string;
  phone: string;
  avatar: string;
  coverUrl?: string;
  dob?: string; // ISO
  // cliente
  allergies?: string;
  medicalNotes?: string;
  // profissional
  artistRole?: string;
  bio?: string;
  experience?: string;
  specialties?: string[];
  portfolioUrl?: string;
  portfolio?: PerfilPortfolioItem[];
}

const EXP_LABEL: Record<string, string> = {
  INICIANTE: 'Iniciante (Aprendiz)', DE_1_A_3: '1 a 3 anos', DE_3_A_5: '3 a 5 anos', MAIS_DE_5: 'Mais de 5 anos',
};

export async function getPerfil(usuarioId: string): Promise<PerfilData | null> {
  const u = await prisma.usuario.findUnique({
    where: { id: usuarioId },
    include: {
      cliente: true,
      profissional: {
        include: {
          estilos: { include: { estilo: true } },
          portfolio: { orderBy: { ordem: 'asc' } },
        },
      },
    },
  });
  if (!u) return null;

  const base = {
    name: u.nome,
    email: u.email,
    phone: u.telefone ?? '',
    avatar: u.avatarUrl ?? '',
  };

  if (u.tipo === 'PROFISSIONAL' && u.profissional) {
    const p = u.profissional;
    return {
      ...base,
      role: 'artist',
      coverUrl: p.capaUrl ?? undefined,
      artistRole: p.oferece.includes('PIERCING') ? 'Tatuador & Piercer' : 'Tatuador',
      bio: p.bio ?? '',
      experience: p.experiencia ? (EXP_LABEL[p.experiencia] ?? p.experiencia) : '',
      specialties: p.estilos.map((e) => e.estilo.nome),
      portfolioUrl: p.portfolioUrl ?? p.instagram ?? '',
      portfolio: p.portfolio.map((art) => ({
        id: art.id, title: art.titulo, description: art.descricao ?? '', imageUrl: art.imagemUrl,
      })),
    };
  }

  if (u.tipo === 'CLIENTE' && u.cliente) {
    const c = u.cliente;
    return {
      ...base,
      role: 'client',
      dob: c.dataNascimento ? c.dataNascimento.toISOString() : undefined,
      allergies: c.alergias ?? '',
      medicalNotes: c.observacoesMedicas ?? '',
    };
  }

  return { ...base, role: 'admin', bio: 'Gerente Geral' };
}
