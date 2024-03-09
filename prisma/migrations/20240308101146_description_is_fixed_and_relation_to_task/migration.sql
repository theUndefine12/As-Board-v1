/*
  Warnings:

  - Added the required column `taskId` to the `Description` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Description" ADD COLUMN     "taskId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Description" ADD CONSTRAINT "Description_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
