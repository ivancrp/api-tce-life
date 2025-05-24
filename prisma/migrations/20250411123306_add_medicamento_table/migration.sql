-- CreateTable
CREATE TABLE "medicamentos" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "fabricante" TEXT NOT NULL,
    "lote" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "dataValidade" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medicamentos_pkey" PRIMARY KEY ("id")
);
