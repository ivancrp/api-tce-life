/*
  Warnings:

  - You are about to drop the column `anamnesis` on the `attendances` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `attendances` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `attendances` table. All the data in the column will be lost.
  - You are about to drop the `UserSpecialty` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[scheduleId]` on the table `attendances` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `doctorId` to the `attendances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `patientId` to the `attendances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduleId` to the `attendances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `symptoms` to the `attendances` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserSpecialty" DROP CONSTRAINT "UserSpecialty_specialtyId_fkey";

-- DropForeignKey
ALTER TABLE "UserSpecialty" DROP CONSTRAINT "UserSpecialty_userId_fkey";

-- DropForeignKey
ALTER TABLE "attendances" DROP CONSTRAINT "attendances_userId_fkey";

-- AlterTable
ALTER TABLE "attendances" DROP COLUMN "anamnesis",
DROP COLUMN "date",
DROP COLUMN "userId",
ADD COLUMN     "doctorId" TEXT NOT NULL,
ADD COLUMN     "patientId" TEXT NOT NULL,
ADD COLUMN     "prescription" TEXT,
ADD COLUMN     "scheduleId" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'in_progress',
ADD COLUMN     "symptoms" TEXT NOT NULL;

-- DropTable
DROP TABLE "UserSpecialty";

-- CreateTable
CREATE TABLE "user_specialties" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "specialtyId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_specialties_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_specialties_userId_specialtyId_key" ON "user_specialties"("userId", "specialtyId");

-- CreateIndex
CREATE UNIQUE INDEX "attendances_scheduleId_key" ON "attendances"("scheduleId");

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "schedules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_specialties" ADD CONSTRAINT "user_specialties_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_specialties" ADD CONSTRAINT "user_specialties_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "specialties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
