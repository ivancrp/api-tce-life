/*
  Warnings:

  - You are about to drop the column `specialty` on the `user_specialties` table. All the data in the column will be lost.
  - Added the required column `specialtyId` to the `user_specialties` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_specialties" DROP COLUMN "specialty",
ADD COLUMN     "specialtyId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "specialties" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "specialties_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "specialties_name_key" ON "specialties"("name");

-- AddForeignKey
ALTER TABLE "user_specialties" ADD CONSTRAINT "user_specialties_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "specialties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
