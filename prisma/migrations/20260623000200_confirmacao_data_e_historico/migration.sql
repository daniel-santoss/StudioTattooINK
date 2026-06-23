-- CreateEnum
CREATE TYPE "motivo_recusa_data" AS ENUM ('DIA', 'HORARIO', 'VALOR');

-- CreateEnum
CREATE TYPE "tipo_evento_agendamento" AS ENUM ('SOLICITACAO_CRIADA', 'DATA_PROPOSTA', 'DATA_CONFIRMADA', 'DATA_RECUSADA', 'STATUS_ALTERADO', 'CANCELADO');

-- AlterEnum
ALTER TYPE "status_agendamento" ADD VALUE 'AGUARDANDO_CONFIRMACAO';

-- AlterTable
ALTER TABLE "agendamento" ADD COLUMN     "motivos_recusa_data" "motivo_recusa_data"[],
ADD COLUMN     "obs_recusa_data" TEXT;

-- CreateTable
CREATE TABLE "agendamento_evento" (
    "id" TEXT NOT NULL,
    "agendamento_id" TEXT NOT NULL,
    "tipo" "tipo_evento_agendamento" NOT NULL,
    "autor_usuario_id" TEXT,
    "descricao" TEXT,
    "dados_evento" JSONB,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agendamento_evento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "agendamento_evento_agendamento_id_criado_em_idx" ON "agendamento_evento"("agendamento_id", "criado_em");

-- AddForeignKey
ALTER TABLE "agendamento_evento" ADD CONSTRAINT "agendamento_evento_agendamento_id_fkey" FOREIGN KEY ("agendamento_id") REFERENCES "agendamento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agendamento_evento" ADD CONSTRAINT "agendamento_evento_autor_usuario_id_fkey" FOREIGN KEY ("autor_usuario_id") REFERENCES "usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
