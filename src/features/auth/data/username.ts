import 'server-only';
import { prisma } from '@/shared/lib/prisma';
import { normalizeUsername } from '@/features/auth/lib/username';

/**
 * Disponibilidade do @username: livre se NÃO está em uso por um profissional.
 * (Candidatura não tem username — o handle só é atribuído na aprovação.)
 * `excetoProfissionalId` permite ignorar o próprio registro (ao trocar nas configurações).
 */
export async function usernameDisponivel(username: string, excetoProfissionalId?: string): Promise<boolean> {
  const prof = await prisma.profissional.findFirst({
    where: { username, ...(excetoProfissionalId ? { id: { not: excetoProfissionalId } } : {}) },
    select: { id: true },
  });
  return !prof;
}

/**
 * Gera um @username único a partir do nome (ex.: "João Silva" → "joao.silva", com sufixo
 * numérico se preciso). Usado na aprovação da candidatura e no backfill de profissionais.
 */
export async function gerarUsernameUnico(nomeBase: string): Promise<string> {
  let base = normalizeUsername(nomeBase.trim().replace(/\s+/g, '.'));
  if (base.length < 3) base = `tatuador${base}`;
  base = base.slice(0, 24); // espaço para sufixo

  if (await usernameDisponivel(base)) return base;
  for (let i = 0; i < 50; i++) {
    const sufixo = Math.floor(1000 + Math.random() * 9000);
    const candidato = `${base}.${sufixo}`.slice(0, 30);
    if (await usernameDisponivel(candidato)) return candidato;
  }
  return `${base}.${Date.now().toString(36)}`.slice(0, 30);
}
