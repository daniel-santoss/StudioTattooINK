import 'server-only';
import { prisma } from '@/shared/lib/prisma';

// Leitura (DAL) das telas de gestão do admin. Apenas dados reais do banco.

const AVATAR_FALLBACK = '/images/tatuadores/tatuador1.jpg';
const MESES_CAP = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function ddMonYear(d: Date | null): string {
  if (!d) return '';
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  return `${get('day')} ${MESES_CAP[parseInt(get('month'), 10) - 1] ?? ''}, ${get('year')}`;
}

// ---------- Clientes ----------

export interface ClientData {
  id: string;
  name: string;
  cpf: string;
  email: string;
  lastVisit: string;
  status: 'Ativo' | 'Inativo';
  img: string;
  phone?: string;
  notes?: string;
}

export async function getClientes(): Promise<ClientData[]> {
  const clientes = await prisma.cliente.findMany({
    where: { usuario: { deletadoEm: null } },
    include: { usuario: true },
    orderBy: { usuario: { nome: 'asc' } },
  });

  return clientes.map((c) => ({
    id: c.id,
    name: c.usuario.nome,
    cpf: c.cpf ?? '—',
    email: c.usuario.email,
    lastVisit: c.ultimaVisitaEm ? ddMonYear(c.ultimaVisitaEm) : 'Novo Cliente',
    status: c.status === 'INATIVO' ? 'Inativo' : 'Ativo',
    img: c.usuario.avatarUrl ?? AVATAR_FALLBACK,
    phone: c.usuario.telefone ?? '',
    notes: c.observacoes ?? '',
  }));
}

// ---------- Tatuadores ----------

export interface StaffMember {
  id: string;
  name: string;
  cpf: string;
  role: string;
  specialty: string;
  status: string;
  email: string;
  phone: string;
  avatar: string;
}

const DISP_LABEL: Record<string, string> = {
  DISPONIVEL: 'Disponível', EM_SESSAO: 'Em Sessão', FOLGA: 'Folga',
};

export async function getProfissionais(): Promise<StaffMember[]> {
  const profissionais = await prisma.profissional.findMany({
    where: { usuario: { deletadoEm: null } },
    include: { usuario: true, estilos: { include: { estilo: true } } },
    orderBy: { usuario: { nome: 'asc' } },
  });

  return profissionais.map((p) => ({
    id: p.id,
    name: p.usuario.nome,
    cpf: '—',
    role: p.titulo,
    specialty: p.estilos.map((e) => e.estilo.nome).join(', ') || p.titulo,
    status: DISP_LABEL[p.disponibilidade] ?? 'Disponível',
    email: p.usuario.email,
    phone: p.usuario.telefone ?? '—',
    avatar: p.usuario.avatarUrl ?? AVATAR_FALLBACK,
  }));
}

// ---------- Candidaturas ----------

export interface RequestData {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string; // ISO ou ''
  portfolio: string;
  experience: string; // label legível
  styles: string[];
  customStyle?: string;
  requestDate: string;
  avatarUrl: string;
}

const EXP_LABEL: Record<string, string> = {
  INICIANTE: 'Iniciante (Aprendiz)', DE_1_A_3: '1 a 3 anos', DE_3_A_5: '3 a 5 anos', MAIS_DE_5: 'Mais de 5 anos',
};

export async function getCandidaturas(): Promise<RequestData[]> {
  const candidaturas = await prisma.profissionalCandidatura.findMany({
    where: { status: 'PENDENTE' },
    orderBy: { criadoEm: 'desc' },
  });

  return candidaturas.map((c) => ({
    id: c.id,
    name: c.nome,
    email: c.email,
    phone: c.telefone ?? '—',
    dob: c.dataNascimento ? c.dataNascimento.toISOString() : '',
    portfolio: c.portfolioUrl,
    experience: c.experiencia ? (EXP_LABEL[c.experiencia] ?? c.experiencia) : '—',
    styles: c.estiloCustom ? [...c.estilos, 'Outros'] : c.estilos,
    customStyle: c.estiloCustom ?? undefined,
    requestDate: ddMonYear(c.criadoEm),
    avatarUrl: c.avatarUrl ?? AVATAR_FALLBACK,
  }));
}

// ---------- Ocorrências ----------

export interface ReportItem {
  id: string;
  type: 'client_report' | 'artist_report';
  reporterName: string;
  reporterImage: string;
  reportedName: string;
  reportedImage: string;
  date: string;
  category: string;
  description: string;
  status: 'Pendente' | 'Em Análise' | 'Resolvido';
  severity: 'Baixa' | 'Média' | 'Alta';
}

const OCO_STATUS: Record<string, ReportItem['status']> = {
  PENDENTE: 'Pendente', EM_ANALISE: 'Em Análise', RESOLVIDA: 'Resolvido',
};
const OCO_SEV: Record<string, ReportItem['severity']> = {
  BAIXA: 'Baixa', MEDIA: 'Média', ALTA: 'Alta',
};

export async function getOcorrencias(): Promise<ReportItem[]> {
  const ocorrencias = await prisma.ocorrencia.findMany({
    include: { relator: true, reportado: true },
    orderBy: { criadoEm: 'desc' },
  });

  return ocorrencias.map((o) => ({
    id: o.id,
    type: o.relator?.tipo === 'PROFISSIONAL' ? 'artist_report' : 'client_report',
    reporterName: o.relator?.nome ?? '—',
    reporterImage: o.relator?.avatarUrl ?? AVATAR_FALLBACK,
    reportedName: o.reportado?.nome ?? '—',
    reportedImage: o.reportado?.avatarUrl ?? AVATAR_FALLBACK,
    date: ddMonYear(o.criadoEm),
    category: o.categoria,
    description: o.descricao,
    status: OCO_STATUS[o.status] ?? 'Pendente',
    severity: OCO_SEV[o.severidade] ?? 'Baixa',
  }));
}
