
import { createClient } from "redis";
import { prisma } from "../../lib/prisma";
import { BookingStatus } from "../../../generated/prisma/enums";
import { bookingQueue, scheduleGameLifecycleJobs } from "./bookingQueue";
import { startBookingWorker } from "./bookingWorker";

// Redis Client Setup
const redisClient = createClient({ url: "redis://localhost:6379" });
redisClient.connect().catch(console.error);

startBookingWorker();

const CreateGameBooking = async (userId: string, payload: { gameId: string; startTime: string; durationMin: number }) => {
    const { gameId, startTime, durationMin } = payload;



    const requestedStart = new Date(startTime);
    const requestedEnd = new Date(requestedStart.getTime() + durationMin * 60 * 1000);
   

    const overlappingBooking = await prisma.gameBooking.findFirst({
        where: {
            gameId: gameId,
            status: {
                in: [BookingStatus.CONFIRMED]
            },
            startTime: { lt: requestedEnd },
            expiresAt: { gt: requestedStart }
        }
    });

    if (overlappingBooking) {
        const start = new Date(overlappingBooking?.startTime as Date);
        const end = new Date(overlappingBooking?.expiresAt as Date)
        const timeStr = start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        const endSTr = end.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

        console.log(timeStr, endSTr)
        throw new Error("SLOT_OVERLAPS_WITH_ANOTHER_BOOKING");
    }



    const lockKey = `lock:game:${gameId}:slot:${startTime}`; //slot key
    const expireInSeconds = 10; // 5min ar jonno ai slot ti hold a thakbe


    const isLocked = await redisClient.set(lockKey, userId, {
        NX: true,
        EX: expireInSeconds,
    });



    if (!isLocked) {
        throw new Error("SLOT_LOCKED_BY_ANOTHER_USER");
    }



    const expiresAt = new Date(new Date(startTime).getTime() + durationMin * 60 * 1000);


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


    await scheduleGameLifecycleJobs(newBooking.id, newBooking.startTime, durationMin); // create a bulmq job

    return newBooking;
};

export const gameBookingService = {
    CreateGameBooking,
};