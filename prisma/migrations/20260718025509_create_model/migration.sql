/*
  Warnings:

  - Made the column `expiresAt` on table `GameBooking` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "GameDuration" AS ENUM ('MIN_30', 'MIN_60', 'MIN_120');

-- AlterTable
ALTER TABLE "GameBooking" ALTER COLUMN "expiresAt" SET NOT NULL;
