-- AlterTable
ALTER TABLE "agendamento" ADD COLUMN     "numero_sessao" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "servico_contratado_id" TEXT;

-- CreateTable
CREATE TABLE "servico_contratado" (
    "id" TEXT NOT NULL,
    "cliente_id" TEXT NOT NULL,
    "profissional_id" TEXT NOT NULL,
    "servico_id" TEXT,
    "descricao" TEXT NOT NULL,
    "valor_total_centavos" INTEGER,
    "numero_sessoes" INTEGER NOT NULL DEFAULT 1,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "servico_contratado_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "servico_contratado_cliente_id_idx" ON "servico_contratado"("cliente_id");

-- CreateIndex
CREATE INDEX "servico_contratado_profissional_id_idx" ON "servico_contratado"("profissional_id");

-- CreateIndex
CREATE INDEX "agendamento_servico_contratado_id_idx" ON "agendamento"("servico_contratado_id");

-- AddForeignKey
ALTER TABLE "agendamento" ADD CONSTRAINT "agendamento_servico_contratado_id_fkey" FOREIGN KEY ("servico_contratado_id") REFERENCES "servico_contratado"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servico_contratado" ADD CONSTRAINT "servico_contratado_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "cliente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servico_contratado" ADD CONSTRAINT "servico_contratado_profissional_id_fkey" FOREIGN KEY ("profissional_id") REFERENCES "profissional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "servico_contratado" ADD CONSTRAINT "servico_contratado_servico_id_fkey" FOREIGN KEY ("servico_id") REFERENCES "servico"("id") ON DELETE SET NULL ON UPDATE CASCADE;
