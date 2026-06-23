# Studio Tattoo INK — Guia para Agentes de IA

Plataforma de gestão para estúdio de tatuagem/piercing. Originalmente uma SPA estática (Vite, só UI/UX), migrada para **Next.js 16 (App Router)** com backend próprio e banco relacional.

> Este arquivo é a fonte da verdade para qualquer agente de IA (Claude Code, Cursor, Copilot, etc.). O `CLAUDE.md` apenas importa este arquivo.

---

## ⚠️ Regras invioláveis

1. **NÃO trocar o design existente.** Religar telas = ligar lógica real por baixo do design atual (dados via prop + submit via Server Action). Só altere UI se o pedido for **explícito e direto**.
2. **Remover TODOS os dados mockados** ao religar uma tela ao banco — nada de mock remanescente.
3. **Nunca commitar segredos.** `.env.local`, chaves Supabase, credenciais de seed e `src/generated/prisma` são gitignored. Quem faz commit/push é o desenvolvedor, não o agente.

---

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19**
- **Prisma 7** + **Supabase Postgres** (driver adapter `@prisma/adapter-pg`)
- **Supabase Auth** (`@supabase/ssr`, cookies httpOnly)
- **Tailwind CSS 3**
- Testes: **Vitest** + Testing Library
- Deploy: **Vercel** (`vercel.json` → `framework: nextjs`; env vars no painel)

## Arquitetura

- **Feature-Sliced Design (FSD)** + Clean Architecture leve. **Monolito modular.**
- **Leitura** sempre via **DAL** (`src/features/*/data`, marcado `server-only`).
- **Escrita** sempre via **Server Actions** (`src/features/*/actions`).
- React Server Components por padrão; `'use client'` só quando necessário.

## Convenções

- **Banco em português, SEM acento/ç, `snake_case`** no nome físico (via `@@map`/`@map` no Prisma).
- Dinheiro em centavos: `*Centavos Int`.
- Soft-delete via coluna `deletadoEm`.
- Conjunto fixo → `enum`. Vocabulário extensível → tabela + N:N explícita.
- Código/identificadores em português acompanhando o domínio.

## Comandos

| Comando | O quê |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | `prisma generate && next build` |
| `npm run start` | Produção local |
| `npm run lint` | ESLint (next) |
| `npm run test` | Vitest (`test:watch` para watch) |
| `npm run db:seed` | Seed de dados |
| `npm run db:seed-auth` | Seed de usuários de auth (script gitignored) |
| `npm run db:reset` | `prisma migrate reset` |
| `npm run db:studio` | Prisma Studio |

## Gotchas (aprendidos na marra)

- **NÃO usar `$transaction` interativo** — falha no pooler (pgbouncer) do Supabase. Use **create aninhado**.
- **Prisma 7:** `directUrl` foi removido. CLI lê a conexão direta do `prisma.config.ts` (`DIRECT_URL`); o Client em runtime usa o `DATABASE_URL` **pooled** via driver adapter. Client gerado em `src/generated/prisma`.
- **Next 16:** o middleware é `src/proxy.ts` (convenção `proxy`, não `middleware.ts`).
- Variáveis `NEXT_PUBLIC_*` são embutidas em **build time** (configurar no painel da Vercel antes do deploy).

---

## Mapa do projeto

Raiz: `C:\StudioTattooINK`.

### Banco / Prisma
- Schema: `prisma/schema.prisma` · migrations: `prisma/migrations/`
- Client singleton (driver adapter, pooled): `src/shared/lib/prisma.ts`
- Config (lê `.env.local`; CLI usa `DIRECT_URL`): `prisma.config.ts`
- Seeds: `prisma/seed.ts`, `prisma/seed-auth.ts` *(gitignored)*, `prisma/create-admin.ts` *(gitignored)*

### Supabase / Auth
- Clients: `src/shared/lib/supabase/{server,client,middleware}.ts`
- Middleware (Next 16): `src/proxy.ts` (matcher: `/admin`, `/book`, `/my-appointments`, `/profile`)
- Sessão/papel: `src/features/auth/data/session.ts` → `getCurrentUser()`
- Actions: `src/features/auth/actions/auth.ts` (login/signup/logout/criarCandidatura)
- UI: `src/features/auth/components/{LoginForm,SignupForm}.tsx`

### Features
- **booking** `src/features/booking/`: `data/booking.ts`, `data/minhaAgenda.ts`, `actions/criarSolicitacao.ts`, `actions/gerenciarSolicitacao.ts` (aprovar/recusar), `components/DateTimePicker.tsx`
- **portfolio** `src/features/portfolio/`: `data/{artists,gallery}.ts`, `components/*`
- Layout autenticado (nav por papel + logout): `src/shared/components/layouts/AuthenticatedLayoutShell.tsx`

### Rotas (`src/app/`)
- `(public)/`: landing, `artists`, `artists/[id]`, `gallery`, `match`, `login`, `signup`, `forgot-password`
- `(authenticated)/`: `admin/{dashboard,clients,staff,schedule,booking-requests,requests,reports,history,profile,appointment/[id]}`, `book`, `my-appointments[/[id]]`, `profile`

### Legacy (`src/legacy/`)
UIs do design original importadas pelas rotas (não são rotas em si — via `dynamic(import('@/legacy/...'))`). Religar uma = trocar mock por dado real via prop + ligar submit à action, **sem mudar o design**.

---

## Modelo de dados (resumo)

Tabelas: `usuario`, `cliente`, `profissional`, `profissional_portfolio`, `profissional_galeria`, `profissional_candidatura`, `profissional_estilo` (N:N), `tattoo_estilo`, `servico`, `agendamento`, `solicitacao_agendamento`, `ocorrencia`, `agendamento_evento`, `servico_contratado`.

Decisões-chave:
- `Profissional.oferece CategoriaServico[]` (capacidade como enum-array, não boolean). Estilos via N:N `ProfissionalEstilo` ↔ `TattooEstilo`.
- **SEM avaliação/nota** de profissional (removido por completo — não readicionar).
- `Usuario.authId` liga ao `auth.users` do Supabase.

### Fluxo de agendamento
1. Cliente solicita por **período** (manhã/tarde/noite — **sem calendário**) → cria `SolicitacaoAgendamento`.
2. Profissional **aprova** lançando data/hora + nº de sessões + valor total → cria `ServicoContratado` (o "trabalho") + sessão 1 (`Agendamento` com status `AGUARDANDO_CONFIRMACAO`) + eventos. Ou **recusa** com motivo.
3. Cliente **confirma** (→ `AGENDADO`) ou **recusa** (motivos `{DIA,HORARIO,VALOR}` ≥1 + observação, ambos obrigatórios; status permanece `AGUARDANDO_CONFIRMACAO`).

`ServicoContratado` (cliente, profissional, descrição, valorTotalCentavos, numeroSessoes) → 1:N `Agendamento` (sessões; `servicoContratadoId`, `numeroSessao`).

`agendamento_evento` = histórico **append-only/imutável** para auditoria (disputas): `tipo` (`TipoEventoAgendamento`), `autorUsuarioId`, `descricao`, `dadosEvento` Json.
