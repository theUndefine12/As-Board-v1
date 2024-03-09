-- AlterTable
ALTER TABLE "Dashboard" ADD COLUMN     "comunityId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "comunityId" TEXT;

-- CreateTable
CREATE TABLE "Comunity" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "Comunity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_comunityId_fkey" FOREIGN KEY ("comunityId") REFERENCES "Comunity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dashboard" ADD CONSTRAINT "Dashboard_comunityId_fkey" FOREIGN KEY ("comunityId") REFERENCES "Comunity"("id") ON DELETE SET NULL ON UPDATE CASCADE;
