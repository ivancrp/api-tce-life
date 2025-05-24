-- AlterTable
ALTER TABLE "patients" ADD COLUMN "email" TEXT DEFAULT NULL;
ALTER TABLE "patients" ADD COLUMN "password" TEXT DEFAULT NULL;
ALTER TABLE "patients" ADD COLUMN "roleId" TEXT DEFAULT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "patients_email_key" ON "patients"("email") WHERE "email" IS NOT NULL;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
