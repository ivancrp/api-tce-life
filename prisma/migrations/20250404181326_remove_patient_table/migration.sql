/*
  Warnings:

  - You are about to drop the column `patientId` on the `attendances` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `certificates` table. All the data in the column will be lost.
  - You are about to drop the column `patientId` on the `certificates` table. All the data in the column will be lost.
  - You are about to drop the column `patientId` on the `prescriptions` table. All the data in the column will be lost.
  - You are about to drop the column `patientId` on the `schedules` table. All the data in the column will be lost.
  - You are about to drop the column `patientId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `patients` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `attendances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `certificates` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `prescriptions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "attendances" DROP CONSTRAINT "attendances_patientId_fkey";

-- DropForeignKey
ALTER TABLE "certificates" DROP CONSTRAINT "certificates_patientId_fkey";

-- DropForeignKey
ALTER TABLE "patients" DROP CONSTRAINT "patients_roleId_fkey";

-- DropForeignKey
ALTER TABLE "prescriptions" DROP CONSTRAINT "prescriptions_patientId_fkey";

-- DropForeignKey
ALTER TABLE "schedules" DROP CONSTRAINT "schedules_patientId_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_patientId_fkey";

-- DropIndex
DROP INDEX "users_patientId_key";

-- AlterTable
ALTER TABLE "attendances" DROP COLUMN "patientId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "certificates" DROP COLUMN "description",
DROP COLUMN "patientId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "prescriptions" DROP COLUMN "patientId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "schedules" DROP COLUMN "patientId";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "patientId",
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "insurance" TEXT;

-- DropTable
DROP TABLE "patients";

-- AddForeignKey
ALTER TABLE "attendances" ADD CONSTRAINT "attendances_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
