import { config } from 'dotenv';
config({ path: '.env.local' });

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import {
  TipoUsuario,
  CategoriaServico,
  StatusAgendamento,
  TipoAgendamento,
  StatusCliente,
} from '../src/generated/prisma/enums';

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL });
const prisma = new PrismaClient({ adapter });

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------

function read(name: string): any[] {
  return JSON.parse(readFileSync(join(process.cwd(), 'src', 'data', `${name}.json`), 'utf8'));
}

function slug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.|\.$/g, '');
}

/** "Tatuagem - Realismo" -> { categoria, nome } */
function parseServico(s: string): { categoria: CategoriaServico; nome: string } {
  const [rawCat, ...rest] = s.split(' - ');
  const nome = rest.join(' - ').trim() || rawCat.trim();
  const categoria = /piercing/i.test(rawCat) ? CategoriaServico.PIERCING : CategoriaServico.TATUAGEM;
  return { categoria, nome };
}

function buildDate(date: string, time: string): Date {
  return new Date(`${date}T${time}:00-03:00`);
}

const STATUS_MAP: Record<string, StatusAgendamento> = {
  upcoming: StatusAgendamento.AGENDADO,
  completed: StatusAgendamento.CONCLUIDO,
  'in-progress': StatusAgendamento.EM_ANDAMENTO,
  available: StatusAgendamento.DISPONIVEL,
  blocked: StatusAgendamento.BLOQUEADO,
};

// Marcadores de capacidade que não são "estilo artístico"
const CAPACIDADE = new Set(['tatuagem', 'piercing']);

// Ícones base para estilos conhecidos (espelha o wizard do matchmaker)
const ICONES_ESTILO: Record<string, string> = {
  Realismo: 'face',
  'Fine Line': 'edit',
  Oriental: 'dragon',
  'Old School': 'anchor',
  'Neo Tradicional': 'local_florist',
};

// ----------------------------------------------------------------
// Seed
// ----------------------------------------------------------------

async function main() {
  console.log('🌱 Limpando tabelas...');
  await prisma.agendamento.deleteMany();
  await prisma.solicitacaoAgendamento.deleteMany();
  await prisma.profissionalEstilo.deleteMany();
  await prisma.profissionalPortfolio.deleteMany();
  await prisma.profissionalGaleria.deleteMany();
  await prisma.profissionalCandidatura.deleteMany();
  await prisma.ocorrencia.deleteMany();
  await prisma.tattooEstilo.deleteMany();
  await prisma.servico.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.profissional.deleteMany();
  await prisma.usuario.deleteMany();

  const artists = read('artists');
  const gallery = read('gallery');
  const appointments = read('appointments');

  // --- Estilos (catálogo) ---
  const estiloByNome = new Map<string, string>();
  async function ensureEstilo(nome: string): Promise<string> {
    const existing = estiloByNome.get(nome);
    if (existing) return existing;
    const e = await prisma.tattooEstilo.upsert({
      where: { nome },
      update: {},
      create: { nome, icone: ICONES_ESTILO[nome] ?? null },
    });
    estiloByNome.set(nome, e.id);
    return e.id;
  }

  // --- Profissionais (Usuario + Profissional + portfólio + estilos) ---
  const profByLegacyId = new Map<string, string>();
  const profByNome = new Map<string, string>();

  for (const a of artists) {
    const styles: string[] = a.styles ?? [];
    const oferece: CategoriaServico[] = [];
    const role: string = a.role ?? '';
    if (styles.some((s) => /tatuagem/i.test(s)) || /tatuad/i.test(role)) oferece.push(CategoriaServico.TATUAGEM);
    if (styles.some((s) => /piercing/i.test(s)) || /piercer/i.test(role)) oferece.push(CategoriaServico.PIERCING);
    if (oferece.length === 0) oferece.push(CategoriaServico.TATUAGEM);

    const estilosArtisticos = styles.filter((s) => !CAPACIDADE.has(s.toLowerCase()));

    const prof = await prisma.profissional.create({
      data: {
        titulo: a.role,
        bio: a.summary ?? null,
        instagram: a.instagram ?? null,
        oferece,
        usuario: {
          create: {
            nome: a.name,
            email: `${slug(a.instagram ?? a.name)}@inkstudio.test`,
            avatarUrl: a.avatarUrl ?? null,
            tipo: TipoUsuario.PROFISSIONAL,
          },
        },
        portfolio: {
          create: (a.portfolio ?? []).map((p: any, i: number) => ({
            titulo: p.title,
            descricao: p.desc ?? null,
            imagemUrl: p.img,
            ordem: i,
          })),
        },
      },
    });

    // Estilos via junção N:N explícita
    for (const nome of estilosArtisticos) {
      const estiloId = await ensureEstilo(nome);
      await prisma.profissionalEstilo.create({
        data: { profissionalId: prof.id, estiloId },
      });
    }

    profByLegacyId.set(String(a.id), prof.id);
    profByNome.set(a.name, prof.id);
  }
  console.log(`✅ ${artists.length} profissionais (+ portfólio, estilos N:N)`);

  // --- Galeria ---
  let galeriaCount = 0;
  for (const g of gallery) {
    const profissionalId = profByLegacyId.get(String(g.artistId)) ?? profByNome.get(g.artist);
    if (!profissionalId) continue;
    await prisma.profissionalGaleria.create({
      data: {
        titulo: g.title,
        categoria: g.category,
        imagemUrl: g.imageUrl,
        descricao: g.description ?? null,
        profissionalId,
      },
    });
    galeriaCount++;
  }
  console.log(`✅ ${galeriaCount} itens de galeria`);

  // --- Agendamentos (deriva Usuario+Cliente e Servico) ---
  const servicoCache = new Map<string, string>();
  const clienteCache = new Map<string, string>();

  for (const ap of appointments) {
    const { categoria, nome } = parseServico(ap.service);
    const skey = `${categoria}|${nome}`;
    let servicoId = servicoCache.get(skey);
    if (!servicoId) {
      const svc = await prisma.servico.upsert({
        where: { categoria_nome: { categoria, nome } },
        update: {},
        create: { categoria, nome },
      });
      servicoId = svc.id;
      servicoCache.set(skey, servicoId);
    }

    let clienteId = clienteCache.get(ap.clientName);
    if (!clienteId) {
      const cli = await prisma.cliente.create({
        data: {
          status: StatusCliente.ATIVO,
          usuario: {
            create: {
              nome: ap.clientName,
              email: `${slug(ap.clientName)}@cliente.inkstudio.test`,
              tipo: TipoUsuario.CLIENTE,
            },
          },
        },
      });
      clienteId = cli.id;
      clienteCache.set(ap.clientName, clienteId);
    }

    const profissionalId = profByNome.get(ap.artistName);
    if (!profissionalId) continue;

    await prisma.agendamento.create({
      data: {
        iniciaEm: buildDate(ap.date, ap.startTime),
        terminaEm: buildDate(ap.date, ap.endTime),
        status: STATUS_MAP[ap.status] ?? StatusAgendamento.AGENDADO,
        tipo: categoria === CategoriaServico.PIERCING ? TipoAgendamento.PIERCING : TipoAgendamento.TATUAGEM,
        observacoes: ap.description ?? null,
        clienteId,
        profissionalId,
        servicoId,
      },
    });
  }
  console.log(`✅ ${appointments.length} agendamentos (clientes e serviços derivados)`);

  console.log('🌱 Seed concluído.');
}

main()
  .catch((e) => {
    console.error('❌ Seed falhou:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
