-- CreateEnum
CREATE TYPE "BookingGameStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'ENDED');

-- AlterTable
ALTER TABLE "GameBooking" ADD COLUMN     "gameStatus" "BookingGameStatus" NOT NULL DEFAULT 'NOT_STARTED';
