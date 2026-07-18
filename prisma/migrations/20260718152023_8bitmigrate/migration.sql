-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER', 'SUB_ADMIN');

-- CreateEnum
CREATE TYPE "CatType" AS ENUM ('FOOD', 'GAME');

-- CreateEnum
CREATE TYPE "WeekDay" AS ENUM ('SATURDAY', 'SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY');

-- CreateEnum
CREATE TYPE "GameStatus" AS ENUM ('AVAILABLE', 'UNAVAILABLE');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'PAID', 'UNPAID', 'CANCELLED', 'FAILED');

-- CreateEnum
CREATE TYPE "BookingGameStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'ENDED');

-- CreateEnum
CREATE TYPE "GameDuration" AS ENUM ('MIN_30', 'MIN_60', 'MIN_120');

-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartITem" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER DEFAULT 1,
    "cartId" TEXT NOT NULL,
    "foodId" TEXT,

    CONSTRAINT "CartITem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "type" "CatType" NOT NULL,
    "name" VARCHAR(40) NOT NULL,
    "isDelete" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Food" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "images" TEXT[],
    "delivery_time" INTEGER NOT NULL,
    "delivery_fee" INTEGER NOT NULL DEFAULT 0,
    "short_description" VARCHAR(500) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDisCount" BOOLEAN NOT NULL DEFAULT false,
    "disCountParcentage" INTEGER,
    "discountPrice" INTEGER,
    "createdById" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "Food_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "price30Min" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "price60Min" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "images" TEXT[],
    "description" VARCHAR(500) NOT NULL,
    "status" "GameStatus" NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isDiscount" BOOLEAN NOT NULL DEFAULT false,
    "disCountParcenTage" INTEGER,
    "categoryId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameSchedule" (
    "id" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "day" "WeekDay" NOT NULL,
    "openTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,

    CONSTRAINT "GameSchedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameBooking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "durationMin" INTEGER NOT NULL,
    "totalAmount" DECIMAL(65,30) NOT NULL DEFAULT 0.00,
    "merchantTransactionId" TEXT,
    "transactionId" TEXT,
    "paymentMethod" TEXT,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "gameStatus" "BookingGameStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GameBooking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "image" TEXT,
    "publicId" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cart_userId_key" ON "Cart"("userId");

-- CreateIndex
CREATE INDEX "CartITem_cartId_idx" ON "CartITem"("cartId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_type_name_key" ON "Category"("type", "name");

-- CreateIndex
CREATE INDEX "Food_isDisCount_idx" ON "Food"("isDisCount");

-- CreateIndex
CREATE INDEX "Food_createdById_idx" ON "Food"("createdById");

-- CreateIndex
CREATE INDEX "Game_categoryId_idx" ON "Game"("categoryId");

-- CreateIndex
CREATE INDEX "Game_createdById_idx" ON "Game"("createdById");

-- CreateIndex
CREATE INDEX "GameSchedule_gameId_idx" ON "GameSchedule"("gameId");

-- CreateIndex
CREATE INDEX "GameSchedule_day_idx" ON "GameSchedule"("day");

-- CreateIndex
CREATE UNIQUE INDEX "GameBooking_merchantTransactionId_key" ON "GameBooking"("merchantTransactionId");

-- CreateIndex
CREATE UNIQUE INDEX "GameBooking_transactionId_key" ON "GameBooking"("transactionId");

-- CreateIndex
CREATE INDEX "GameBooking_startTime_idx" ON "GameBooking"("startTime");

-- CreateIndex
CREATE INDEX "GameBooking_status_idx" ON "GameBooking"("status");

-- CreateIndex
CREATE INDEX "GameBooking_gameStatus_idx" ON "GameBooking"("gameStatus");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartITem" ADD CONSTRAINT "CartITem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartITem" ADD CONSTRAINT "CartITem_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Food" ADD CONSTRAINT "Food_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Food" ADD CONSTRAINT "Food_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameSchedule" ADD CONSTRAINT "GameSchedule_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameBooking" ADD CONSTRAINT "GameBooking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameBooking" ADD CONSTRAINT "GameBooking_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
