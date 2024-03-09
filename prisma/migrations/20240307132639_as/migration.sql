/*
  Warnings:

  - A unique constraint covering the columns `[descriptionId]` on the table `Task` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Task_descriptionId_key" ON "Task"("descriptionId");
