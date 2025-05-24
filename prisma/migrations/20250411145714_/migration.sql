/*
  Warnings:

  - Made the column `necessitaPrescricao` on table `medicamentos` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "medicamentos" ALTER COLUMN "necessitaPrescricao" SET NOT NULL,
ALTER COLUMN "necessitaPrescricao" DROP DEFAULT;
