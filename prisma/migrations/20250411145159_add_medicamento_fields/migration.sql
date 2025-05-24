/*
  Warnings:

  - You are about to drop the column `fabricante` on the `medicamentos` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `medicamentos` table. All the data in the column will be lost.
  - You are about to drop the column `quantidade` on the `medicamentos` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[codigoInterno]` on the table `medicamentos` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `apresentacao` to the `medicamentos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classificacaoTerapeutica` to the `medicamentos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `codigoInterno` to the `medicamentos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `condicoesArmazenamento` to the `medicamentos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataFabricacao` to the `medicamentos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dosagem` to the `medicamentos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fabricanteId` to the `medicamentos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `formaFarmaceutica` to the `medicamentos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `localArmazenamento` to the `medicamentos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `necessitaPrescricao` to the `medicamentos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomeComercial` to the `medicamentos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomeGenerico` to the `medicamentos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantidadeEstoque` to the `medicamentos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantidadeMinima` to the `medicamentos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registroAnvisa` to the `medicamentos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoControle` to the `medicamentos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unidadeMedida` to the `medicamentos` table without a default value. This is not possible if the table is not empty.

*/
-- Primeiro, criar a tabela de fabricantes
CREATE TABLE "fabricantes" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "registroAnvisa" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fabricantes_pkey" PRIMARY KEY ("id")
);

-- Inserir um fabricante padrão para os medicamentos existentes
INSERT INTO "fabricantes" ("id", "nome", "registroAnvisa", "createdAt", "updatedAt")
VALUES ('default-fabricante', 'Fabricante Padrão', 'REG-0001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Adicionar as novas colunas com valores padrão
ALTER TABLE "medicamentos" 
    ADD COLUMN "nomeComercial" TEXT,
    ADD COLUMN "nomeGenerico" TEXT,
    ADD COLUMN "codigoInterno" TEXT,
    ADD COLUMN "apresentacao" TEXT,
    ADD COLUMN "formaFarmaceutica" TEXT,
    ADD COLUMN "dosagem" TEXT,
    ADD COLUMN "unidadeMedida" TEXT,
    ADD COLUMN "registroAnvisa" TEXT,
    ADD COLUMN "dataFabricacao" TIMESTAMP(3),
    ADD COLUMN "quantidadeEstoque" INTEGER,
    ADD COLUMN "quantidadeMinima" INTEGER,
    ADD COLUMN "localArmazenamento" TEXT,
    ADD COLUMN "condicoesArmazenamento" TEXT,
    ADD COLUMN "tipoControle" TEXT,
    ADD COLUMN "classificacaoTerapeutica" TEXT,
    ADD COLUMN "necessitaPrescricao" BOOLEAN DEFAULT false,
    ADD COLUMN "restricoesUso" TEXT,
    ADD COLUMN "indicacoes" TEXT,
    ADD COLUMN "contraIndicacoes" TEXT,
    ADD COLUMN "efeitosColaterais" TEXT,
    ADD COLUMN "posologiaPadrao" TEXT,
    ADD COLUMN "observacoes" TEXT,
    ADD COLUMN "fabricanteId" TEXT;

-- Atualizar os registros existentes
UPDATE "medicamentos" SET
    "nomeComercial" = "nome",
    "nomeGenerico" = "nome",
    "codigoInterno" = CONCAT('MED-', "id"),
    "apresentacao" = 'Comprimido',
    "formaFarmaceutica" = 'Sólida',
    "dosagem" = '500mg',
    "unidadeMedida" = 'mg',
    "registroAnvisa" = 'REG-0001',
    "dataFabricacao" = CURRENT_TIMESTAMP,
    "quantidadeEstoque" = "quantidade",
    "quantidadeMinima" = 10,
    "localArmazenamento" = 'Sala de Medicamentos',
    "condicoesArmazenamento" = 'Temperatura ambiente',
    "tipoControle" = 'Uso comum',
    "classificacaoTerapeutica" = 'Analgésico',
    "fabricanteId" = 'default-fabricante';

-- Tornar as colunas obrigatórias
ALTER TABLE "medicamentos" 
    ALTER COLUMN "nomeComercial" SET NOT NULL,
    ALTER COLUMN "nomeGenerico" SET NOT NULL,
    ALTER COLUMN "codigoInterno" SET NOT NULL,
    ALTER COLUMN "apresentacao" SET NOT NULL,
    ALTER COLUMN "formaFarmaceutica" SET NOT NULL,
    ALTER COLUMN "dosagem" SET NOT NULL,
    ALTER COLUMN "unidadeMedida" SET NOT NULL,
    ALTER COLUMN "registroAnvisa" SET NOT NULL,
    ALTER COLUMN "dataFabricacao" SET NOT NULL,
    ALTER COLUMN "quantidadeEstoque" SET NOT NULL,
    ALTER COLUMN "quantidadeMinima" SET NOT NULL,
    ALTER COLUMN "localArmazenamento" SET NOT NULL,
    ALTER COLUMN "condicoesArmazenamento" SET NOT NULL,
    ALTER COLUMN "tipoControle" SET NOT NULL,
    ALTER COLUMN "classificacaoTerapeutica" SET NOT NULL,
    ALTER COLUMN "fabricanteId" SET NOT NULL;

-- Remover as colunas antigas
ALTER TABLE "medicamentos" 
    DROP COLUMN "nome",
    DROP COLUMN "fabricante",
    DROP COLUMN "quantidade";

-- Criar índices e chaves estrangeiras
CREATE UNIQUE INDEX "medicamentos_codigoInterno_key" ON "medicamentos"("codigoInterno");
ALTER TABLE "medicamentos" ADD CONSTRAINT "medicamentos_fabricanteId_fkey" 
    FOREIGN KEY ("fabricanteId") REFERENCES "fabricantes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
