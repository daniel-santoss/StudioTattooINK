# 🖋️ Ink Studio Tattoo

Plataforma de gestão para estúdios de **tatuagem e piercing**. Conecta clientes a profissionais, expõe portfólios de forma indexável pelo Google e dá ao estúdio as ferramentas para gerenciar agendamentos, solicitações e a operação do dia a dia.

## O problema que resolve

Estúdios geralmente dependem de DM no Instagram e WhatsApp para divulgar trabalho e receber pedidos de orçamento — um fluxo desorganizado, sem histórico e invisível para buscas. O Ink Studio centraliza isso em três frentes:

- **Vitrine pública indexável** — portfólio dos artistas e galeria com SEO real, para o estúdio ser encontrado no Google.
- **Solicitação de agendamento** — o cliente descreve a ideia, escolhe profissional e período; o estúdio recebe a solicitação para orçar e confirmar.
- **Painel de gestão** — áreas por papel (cliente, profissional, gerente) para acompanhar agenda, solicitações e clientes.

---

## 🚀 Tecnologias

| Camada | Stack |
|---|---|
| Framework | **Next.js 16** (App Router, Turbopack) |
| UI | **React 19** + **TypeScript** |
| Estilização | **Tailwind CSS** (variáveis CSS, `next/font`, tipografia customizada) |
| Banco de dados | **PostgreSQL** (hospedado no **Supabase**) |
| ORM | **Prisma 7** (driver adapter sobre conexão pooled) |
| Autenticação | **Supabase Auth** (cookies `httpOnly`, sessão no servidor) |
| Testes | **Vitest** + Testing Library |
| Qualidade | ESLint + Prettier |

---

## 🏗️ Arquitetura

Monólito modular organizado em **Feature-Sliced Design** com camadas leves por feature (princípio de inversão de dependência da Clean Architecture, sem a cerimônia):

```
src/
  app/          Rotas, layouts, metadata/SEO (camada fina do Next)
  features/     Domínios: auth, portfolio, booking, matchmaker…
    <feature>/
      data/        DAL — única camada que fala com o banco (server-only)
      actions/     Server Actions (mutações)
      components/  UI da feature
  shared/       libs (prisma, supabase), tipos, layouts e utilitários
  legacy/       Telas em migração progressiva (não são rotas; importadas sob demanda)
```

- **Leitura** de dados acontece via **DAL** (`features/*/data`), consumida diretamente por Server Components — sem HTTP interno.
- **Escrita** acontece via **Server Actions** (`features/*/actions`), que rodam no servidor com a sessão do usuário.
- O **domínio de dados é modelado em português** (tabelas/colunas em `snake_case`, ex.: `solicitacao_agendamento`), com enums para conjuntos fixos e relações N:N explícitas para vocabulários extensíveis (ex.: estilos de tatuagem).

---

## 🎯 Estratégias de renderização (e o porquê de cada uma)

O ganho central da migração para o App Router foi poder escolher o modelo de renderização **por rota**, conforme a natureza do conteúdo:

### Estático / SSG — `/`, `/login`, `/signup`, `/match`
Páginas que **não dependem de dados por requisição**. São pré-renderizadas em build, servidas como HTML estático.
**Por quê:** TTFB praticamente instantâneo e SEO máximo. Não há motivo para envolver o servidor a cada acesso de uma landing ou de um formulário de login.

### ISR (Incremental Static Regeneration) — `/artists`, `/artists/[id]`, `/gallery`
Páginas **públicas, SEO-críticas e baseadas em dados que mudam** (portfólio, galeria), mas **não a cada requisição**. São geradas estaticamente a partir do banco e revalidadas em background (ex.: a cada 60s); `generateStaticParams` pré-gera os perfis conhecidos.
**Por quê:** combina a velocidade/indexação do estático com a frescor do dado real. O estúdio atualiza um portfólio no banco e a página reflete em segundos, **sem rebuild** — algo que CSR puro não daria ao SEO e que SSR puro pagaria caro a cada visita.

### Dinâmico / SSR — área autenticada: `/admin/*`, `/book`, `/my-appointments`, `/profile`
Conteúdo **por usuário/sessão**, lido de cookies e do banco no servidor, **não indexável**.
**Por quê:** os dados dependem de quem está logado e do seu papel; precisam ser sempre atuais e protegidos. Renderizar no servidor com a sessão garante autorização real e dados frescos. Como não há valor de SEO aqui, abrir mão do estático é o trade-off correto.

> Resumo: **estático** onde o conteúdo é igual para todos e estável; **ISR** onde é igual para todos mas muda; **dinâmico** onde é específico do usuário.

---

## 🔐 Autenticação e segurança

- Login/cadastro via **Supabase Auth** (email/senha). A sessão vive em **cookies `httpOnly`** — invisível a XSS e legível pelo servidor.
- O **proxy** (`src/proxy.ts`, convenção do Next 16) faz o refresh da sessão e o redirecionamento otimista das rotas autenticadas.
- A **autorização real** (por papel: `CLIENTE` / `PROFISSIONAL` / `ADMIN`) é feita **server-side** nas páginas/Server Actions via `getCurrentUser()` — defesa em profundidade, sem depender do middleware como fronteira de segurança.
- O papel é fonte de verdade no banco (`usuario.tipo`).

---

## ▶️ Como rodar

Pré-requisitos: Node 20+ e um banco PostgreSQL (ex.: projeto no Supabase).

```bash
# 1. Dependências
npm install

# 2. Variáveis de ambiente — crie um .env.local (NÃO versionado)
#    DATABASE_URL              -> conexão pooled (Prisma, runtime)
#    DIRECT_URL                -> conexão direta (Prisma CLI / migrations)
#    NEXT_PUBLIC_SUPABASE_URL  -> URL do projeto Supabase
#    NEXT_PUBLIC_SUPABASE_ANON_KEY -> chave publishable (pública)

# 3. Banco: aplicar migrations e popular dados de exemplo
npx prisma migrate dev
npm run db:seed

# 4. Desenvolvimento
npm run dev
```

Scripts úteis: `npm run build`, `npm run test`, `npm run db:studio` (Prisma Studio).

---

## 📈 Status

Migração de SPA (Vite) → Next.js concluída. Camada pública (artistas, galeria) e o fluxo de **solicitação de agendamento** já são servidos pelo banco real. As telas administrativas estão sendo religadas ao banco progressivamente, preservando o design existente.
