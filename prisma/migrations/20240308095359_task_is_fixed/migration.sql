/*
  Warnings:

  - You are about to drop the column `descriptionId` on the `Task` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Task" DROP CONSTRAINT "Task_descriptionId_fkey";

-- DropIndex
DROP INDEX "Task_descriptionId_key";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "descriptionId";
