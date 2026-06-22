-- CreateEnum
CREATE TYPE "tipo_usuario" AS ENUM ('CLIENTE', 'PROFISSIONAL', 'ADMIN');

-- CreateEnum
CREATE TYPE "categoria_servico" AS ENUM ('TATUAGEM', 'PIERCING');

-- CreateEnum
CREATE TYPE "status_cliente" AS ENUM ('PROSPECTO', 'ATIVO', 'INATIVO', 'VIP');

-- CreateEnum
CREATE TYPE "status_disponibilidade" AS ENUM ('DISPONIVEL', 'EM_SESSAO', 'FOLGA');

-- CreateEnum
CREATE TYPE "nivel_experiencia" AS ENUM ('INICIANTE', 'DE_1_A_3', 'DE_3_A_5', 'MAIS_DE_5');

-- CreateEnum
CREATE TYPE "status_agendamento" AS ENUM ('DISPONIVEL', 'AGENDADO', 'EM_ANDAMENTO', 'CONCLUIDO', 'BLOQUEADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "tipo_agendamento" AS ENUM ('TATUAGEM', 'PIERCING', 'ORCAMENTO');

-- CreateEnum
CREATE TYPE "status_pagamento" AS ENUM ('PENDENTE', 'SINAL_PAGO', 'PAGO_TOTAL');

-- CreateEnum
CREATE TYPE "status_solicitacao" AS ENUM ('PENDENTE', 'APROVADA', 'REJEITADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "status_candidatura" AS ENUM ('PENDENTE', 'APROVADA', 'REJEITADA');

-- CreateEnum
CREATE TYPE "status_ocorrencia" AS ENUM ('PENDENTE', 'EM_ANALISE', 'RESOLVIDA');

-- CreateEnum
CREATE TYPE "severidade_ocorrencia" AS ENUM ('BAIXA', 'MEDIA', 'ALTA');

-- CreateTable
CREATE TABLE "usuario" (
    "id" TEXT NOT NULL,
    "auth_id" TEXT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT,
    "avatar_url" TEXT,
    "tipo" "tipo_usuario" NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "deletado_em" TIMESTAMP(3),

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cliente" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "cpf" TEXT,
    "data_nascimento" TIMESTAMP(3),
    "status" "status_cliente" NOT NULL DEFAULT 'PROSPECTO',
    "alergias" TEXT,
    "observacoes_medicas" TEXT,
    "observacoes" TEXT,
    "total_sessoes" INTEGER NOT NULL DEFAULT 0,
    "ultima_visita_em" TIMESTAMP(3),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profissional" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "bio" TEXT,
    "instagram" TEXT,
    "portfolio_url" TEXT,
    "capa_url" TEXT,
    "oferece" "categoria_servico"[],
    "experiencia" "nivel_experiencia",
    "disponibilidade" "status_disponibilidade" NOT NULL DEFAULT 'DISPONIVEL',
    "aceitando_agendamentos" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profissional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profissional_portfolio" (
    "id" TEXT NOT NULL,
    "profissional_id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT,
    "imagem_url" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profissional_portfolio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profissional_galeria" (
    "id" TEXT NOT NULL,
    "profissional_id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "imagem_url" TEXT NOT NULL,
    "descricao" TEXT,
    "destaque" BOOLEAN NOT NULL DEFAULT false,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profissional_galeria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profissional_candidatura" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT,
    "data_nascimento" TIMESTAMP(3),
    "portfolio_url" TEXT NOT NULL,
    "experiencia" "nivel_experiencia",
    "estilos" TEXT[],
    "estilo_custom" TEXT,
    "avatar_url" TEXT,
    "status" "status_candidatura" NOT NULL DEFAULT 'PENDENTE',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profissional_candidatura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profissional_estilo" (
    "profissional_id" TEXT NOT NULL,
    "estilo_id" TEXT NOT NULL,

    CONSTRAINT "profissional_estilo_pkey" PRIMARY KEY ("profissional_id","estilo_id")
);

-- CreateTable
CREATE TABLE "servico" (
    "id" TEXT NOT NULL,
    "categoria" "categoria_servico" NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "duracao_min" INTEGER,
    "preco_centavos" INTEGER,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "servico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tattoo_estilo" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "icone" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tattoo_estilo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agendamento" (
    "id" TEXT NOT NULL,
    "cliente_id" TEXT,
    "profissional_id" TEXT NOT NULL,
    "servico_id" TEXT,
    "solicitacao_id" TEXT,
    "inicia_em" TIMESTAMP(3) NOT NULL,
    "termina_em" TIMESTAMP(3) NOT NULL,
    "status" "status_agendamento" NOT NULL DEFAULT 'AGENDADO',
    "tipo" "tipo_agendamento" NOT NULL,
    "preco_centavos" INTEGER,
    "sinal_centavos" INTEGER,
    "status_pagamento" "status_pagamento" NOT NULL DEFAULT 'PENDENTE',
    "local" TEXT,
    "imagens_referencia" TEXT[],
    "observacoes" TEXT,
    "observacoes_internas" TEXT,
    "motivo_cancelamento" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,
    "deletado_em" TIMESTAMP(3),

    CONSTRAINT "agendamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solicitacao_agendamento" (
    "id" TEXT NOT NULL,
    "cliente_id" TEXT NOT NULL,
    "profissional_id" TEXT,
    "servico_id" TEXT,
    "data_preferida" TIMESTAMP(3),
    "periodo_preferido" TEXT,
    "descricao" TEXT NOT NULL,
    "imagens_referencia" TEXT[],
    "alergias" TEXT,
    "observacoes_medicas" TEXT,
    "status" "status_solicitacao" NOT NULL DEFAULT 'PENDENTE',
    "preco_orcado_centavos" INTEGER,
    "motivo_rejeicao" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "solicitacao_agendamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ocorrencia" (
    "id" TEXT NOT NULL,
    "relator_usuario_id" TEXT,
    "reportado_usuario_id" TEXT,
    "categoria" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "severidade" "severidade_ocorrencia" NOT NULL,
    "status" "status_ocorrencia" NOT NULL DEFAULT 'PENDENTE',
    "resolvida_em" TIMESTAMP(3),
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ocorrencia_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuario_auth_id_key" ON "usuario"("auth_id");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "cliente_usuario_id_key" ON "cliente"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "profissional_usuario_id_key" ON "profissional"("usuario_id");

-- CreateIndex
CREATE INDEX "profissional_portfolio_profissional_id_idx" ON "profissional_portfolio"("profissional_id");

-- CreateIndex
CREATE INDEX "profissional_galeria_profissional_id_idx" ON "profissional_galeria"("profissional_id");

-- CreateIndex
CREATE INDEX "profissional_estilo_estilo_id_idx" ON "profissional_estilo"("estilo_id");

-- CreateIndex
CREATE UNIQUE INDEX "servico_categoria_nome_key" ON "servico"("categoria", "nome");

-- CreateIndex
CREATE UNIQUE INDEX "tattoo_estilo_nome_key" ON "tattoo_estilo"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "agendamento_solicitacao_id_key" ON "agendamento"("solicitacao_id");

-- CreateIndex
CREATE INDEX "agendamento_profissional_id_inicia_em_idx" ON "agendamento"("profissional_id", "inicia_em");

-- CreateIndex
CREATE INDEX "agendamento_cliente_id_idx" ON "agendamento"("cliente_id");

-- CreateIndex
CREATE INDEX "solicitacao_agendamento_cliente_id_idx" ON "solicitacao_agendamento"("cliente_id");

-- AddForeignKey
ALTER TABLE "cliente" ADD CONSTRAINT "cliente_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profissional" ADD CONSTRAINT "profissional_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profissional_portfolio" ADD CONSTRAINT "profissional_portfolio_profissional_id_fkey" FOREIGN KEY ("profissional_id") REFERENCES "profissional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profissional_galeria" ADD CONSTRAINT "profissional_galeria_profissional_id_fkey" FOREIGN KEY ("profissional_id") REFERENCES "profissional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profissional_estilo" ADD CONSTRAINT "profissional_estilo_profissional_id_fkey" FOREIGN KEY ("profissional_id") REFERENCES "profissional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profissional_estilo" ADD CONSTRAINT "profissional_estilo_estilo_id_fkey" FOREIGN KEY ("estilo_id") REFERENCES "tattoo_estilo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamento" ADD CONSTRAINT "agendamento_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "cliente"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamento" ADD CONSTRAINT "agendamento_profissional_id_fkey" FOREIGN KEY ("profissional_id") REFERENCES "profissional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamento" ADD CONSTRAINT "agendamento_servico_id_fkey" FOREIGN KEY ("servico_id") REFERENCES "servico"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamento" ADD CONSTRAINT "agendamento_solicitacao_id_fkey" FOREIGN KEY ("solicitacao_id") REFERENCES "solicitacao_agendamento"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitacao_agendamento" ADD CONSTRAINT "solicitacao_agendamento_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "cliente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitacao_agendamento" ADD CONSTRAINT "solicitacao_agendamento_profissional_id_fkey" FOREIGN KEY ("profissional_id") REFERENCES "profissional"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitacao_agendamento" ADD CONSTRAINT "solicitacao_agendamento_servico_id_fkey" FOREIGN KEY ("servico_id") REFERENCES "servico"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ocorrencia" ADD CONSTRAINT "ocorrencia_relator_usuario_id_fkey" FOREIGN KEY ("relator_usuario_id") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ocorrencia" ADD CONSTRAINT "ocorrencia_reportado_usuario_id_fkey" FOREIGN KEY ("reportado_usuario_id") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
