/*
  Warnings:

  - You are about to drop the column `duration` on the `CartITem` table. All the data in the column will be lost.
  - You are about to drop the column `gameId` on the `CartITem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CartITem" DROP CONSTRAINT "CartITem_gameId_fkey";

-- AlterTable
ALTER TABLE "CartITem" DROP COLUMN "duration",
DROP COLUMN "gameId";
