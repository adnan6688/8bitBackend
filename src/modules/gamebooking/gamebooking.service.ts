
import { createClient } from "redis";
import { prisma } from "../../lib/prisma";
import { BookingStatus } from "../../../generated/prisma/enums";
import { createBookingCompletionJob } from "./bookingQueue";
import { startBookingWorker } from "./bookingWorker";

// Redis Client Setup
const redisClient = createClient({ url: "redis://localhost:6379" });
redisClient.connect().catch(console.error);

startBookingWorker();

const CreateGameBooking = async (userId: string, payload: { gameId: string; startTime: string; durationMin: number }) => {
    const { gameId, startTime, durationMin } = payload;


    const lockKey = `lock:game:${gameId}:slot:${startTime}`;
    const expireInSeconds = 600;


    const isLocked = await redisClient.set(lockKey, userId, {
        NX: true,
        EX: expireInSeconds,
    });

    if (!isLocked) {
        throw new Error("SLOT_LOCKED_BY_ANOTHER_USER");
    }


    const expiresAt = new Date(Date.now() + expireInSeconds * 1000);

    const newBooking = await prisma.gameBooking.create({
        data: {
            userId,
            gameId,
            startTime: new Date(startTime),
            durationMin,
            status: BookingStatus.PENDING,
            expiresAt,
        },
    });

    const delayMs = durationMin * 60 * 1000;
    await createBookingCompletionJob(newBooking.id, delayMs);

    return newBooking;
};

export const gameBookingService = {
    CreateGameBooking,
};