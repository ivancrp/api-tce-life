/*
  Warnings:

  - You are about to drop the column `content` on the `certificates` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `medical_certificates` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `medical_exams` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `medical_exams` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `prescriptions` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.
  - You are about to alter the column `oxygenSaturation` on the `vital_signs` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - A unique constraint covering the columns `[userId,specialtyId]` on the table `user_specialties` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cpf]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `startDate` to the `certificates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `certificates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `noteType` to the `clinical_notes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `clinical_notes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `medical_certificates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `medical_certificates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `medical_certificates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `medical_certificates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `examType` to the `medical_exams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `requestDate` to the `medical_exams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `medical_exams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `medications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `medications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `medications` to the `prescriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleId` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `vital_signs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "certificates" DROP CONSTRAINT "certificates_attendanceId_fkey";

-- DropForeignKey
ALTER TABLE "clinical_notes" DROP CONSTRAINT "clinical_notes_attendanceId_fkey";

-- DropForeignKey
ALTER TABLE "medical_certificates" DROP CONSTRAINT "medical_certificates_attendanceId_fkey";

-- DropForeignKey
ALTER TABLE "medical_exams" DROP CONSTRAINT "medical_exams_attendanceId_fkey";

-- DropForeignKey
ALTER TABLE "medications" DROP CONSTRAINT "medications_attendanceId_fkey";

-- DropForeignKey
ALTER TABLE "prescriptions" DROP CONSTRAINT "prescriptions_attendanceId_fkey";

-- DropForeignKey
ALTER TABLE "vital_signs" DROP CONSTRAINT "vital_signs_attendanceId_fkey";

-- AlterTable
ALTER TABLE "attendances" ADD COLUMN     "diagnosis" TEXT,
ADD COLUMN     "observations" TEXT,
ADD COLUMN     "prescription" TEXT,
ADD COLUMN     "symptoms" TEXT;

-- AlterTable
ALTER TABLE "certificates" DROP COLUMN "content",
ADD COLUMN     "cid" TEXT,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL,
ALTER COLUMN "attendanceId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "clinical_notes" ADD COLUMN     "noteType" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "attendanceId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "medical_certificates" DROP COLUMN "content",
ADD COLUMN     "cid" TEXT,
ADD COLUMN     "daysOff" INTEGER,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "attendanceId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "medical_exams" DROP COLUMN "description",
DROP COLUMN "name",
ADD COLUMN     "attachments" JSONB,
ADD COLUMN     "examType" TEXT NOT NULL,
ADD COLUMN     "laboratory" TEXT,
ADD COLUMN     "observations" TEXT,
ADD COLUMN     "requestDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "resultDate" TIMESTAMP(3),
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "attendanceId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "medications" ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "instructions" TEXT,
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "attendanceId" DROP NOT NULL,
ALTER COLUMN "duration" DROP NOT NULL;

-- AlterTable
ALTER TABLE "prescriptions" DROP COLUMN "content",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "medications" JSONB NOT NULL,
ADD COLUMN     "observations" TEXT,
ALTER COLUMN "attendanceId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "schedules" ADD COLUMN     "notes" TEXT;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role",
ADD COLUMN     "celular" TEXT,
ADD COLUMN     "cpf" TEXT,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "escolaridade" TEXT,
ADD COLUMN     "estadoCivil" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "insurance" TEXT,
ADD COLUMN     "naturalidade" TEXT,
ADD COLUMN     "nomeMae" TEXT,
ADD COLUMN     "nomePai" TEXT,
ADD COLUMN     "nomeSocial" TEXT,
ADD COLUMN     "raca" TEXT,
ADD COLUMN     "roleId" TEXT NOT NULL,
ADD COLUMN     "telefone" TEXT,
ADD COLUMN     "tipoSanguineo" TEXT,
ALTER COLUMN "password" DROP NOT NULL;

-- AlterTable
ALTER TABLE "vital_signs" ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "attendanceId" DROP NOT NULL,
ALTER COLUMN "oxygenSaturation" SET DATA TYPE INTEGER;

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fabricantes" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "registroAnvisa" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fabricantes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medicamentos" (
    "id" TEXT NOT NULL,
    "nomeComercial" TEXT NOT NULL,
    "nomeGenerico" TEXT NOT NULL,
    "codigoInterno" TEXT NOT NULL,
    "apresentacao" TEXT NOT NULL,
    "formaFarmaceutica" TEXT NOT NULL,
    "dosagem" TEXT NOT NULL,
    "unidadeMedida" TEXT NOT NULL,
    "registroAnvisa" TEXT NOT NULL,
    "lote" TEXT NOT NULL,
    "dataFabricacao" TIMESTAMP(3) NOT NULL,
    "dataValidade" TIMESTAMP(3) NOT NULL,
    "quantidadeEstoque" INTEGER NOT NULL,
    "quantidadeMinima" INTEGER NOT NULL,
    "localArmazenamento" TEXT NOT NULL,
    "condicoesArmazenamento" TEXT NOT NULL,
    "tipoControle" TEXT NOT NULL,
    "classificacaoTerapeutica" TEXT NOT NULL,
    "necessitaPrescricao" BOOLEAN NOT NULL,
    "restricoesUso" TEXT,
    "indicacoes" TEXT,
    "contraIndicacoes" TEXT,
    "efeitosColaterais" TEXT,
    "posologiaPadrao" TEXT,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fabricanteId" TEXT NOT NULL,

    CONSTRAINT "medicamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "allergies" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "allergen" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "reactions" TEXT NOT NULL,
    "diagnosed" TIMESTAMP(3),
    "notes" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "allergies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "medicamentos_codigoInterno_key" ON "medicamentos"("codigoInterno");

-- CreateIndex
CREATE UNIQUE INDEX "user_specialties_userId_specialtyId_key" ON "user_specialties"("userId", "specialtyId");

-- CreateIndex
CREATE UNIQUE INDEX "users_cpf_key" ON "users"("cpf");

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "attendances"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "attendances"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicamentos" ADD CONSTRAINT "medicamentos_fabricanteId_fkey" FOREIGN KEY ("fabricanteId") REFERENCES "fabricantes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vital_signs" ADD CONSTRAINT "vital_signs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vital_signs" ADD CONSTRAINT "vital_signs_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "attendances"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_certificates" ADD CONSTRAINT "medical_certificates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_certificates" ADD CONSTRAINT "medical_certificates_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "attendances"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medications" ADD CONSTRAINT "medications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medications" ADD CONSTRAINT "medications_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "attendances"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_exams" ADD CONSTRAINT "medical_exams_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_exams" ADD CONSTRAINT "medical_exams_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "attendances"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinical_notes" ADD CONSTRAINT "clinical_notes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clinical_notes" ADD CONSTRAINT "clinical_notes_attendanceId_fkey" FOREIGN KEY ("attendanceId") REFERENCES "attendances"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "allergies" ADD CONSTRAINT "allergies_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
