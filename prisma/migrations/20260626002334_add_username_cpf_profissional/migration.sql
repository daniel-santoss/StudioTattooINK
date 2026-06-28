/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `profissional` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "profissional" ADD COLUMN     "cpf" TEXT,
ADD COLUMN     "username" TEXT,
ADD COLUMN     "username_alterado_em" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "profissional_candidatura" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "cpf" TEXT,
ADD COLUMN     "username" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "profissional_username_key" ON "profissional"("username");
