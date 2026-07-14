/*
  Warnings:

  - You are about to drop the column `disCountPrice` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Game` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "disCountPrice",
DROP COLUMN "price",
ADD COLUMN     "price30Min" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "price60Min" DOUBLE PRECISION NOT NULL DEFAULT 0;
