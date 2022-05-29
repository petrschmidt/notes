/*
  Warnings:

  - A unique constraint covering the columns `[uid]` on the table `Note` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Note_uid_key` ON `Note`(`uid`);
