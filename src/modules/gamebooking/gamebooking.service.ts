
import { createClient } from "redis";
import { prisma } from "../../lib/prisma";
import { BookingStatus } from "../../../generated/prisma/enums";
import {  scheduleGameLifecycleJobs } from "./bookingQueue";
import { startBookingWorker } from "./bookingWorker";
import { GetAvailableSlotsPayload } from "./gamebooking.interface";

// Redis Client Setup
const redisClient = createClient({ url: "redis://localhost:6379" });
redisClient.connect().catch(console.error);

startBookingWorker();


type Tpayload = {
    gameId: string,
    startTime: string,
    durationMin: 15 | 30 | 45 | 60
}


const CreateGameBooking = async (userId: string, payload: Tpayload) => {
    const { gameId, startTime, durationMin } = payload;


    const ckGame = await prisma.game.findUnique({
        where : {
            id : gameId 
        }
    })
    if(!ckGame){
        throw new Error('This game is not found!')
    }


    const requestedStart = new Date(startTime);
    const requestedEnd = new Date(requestedStart.getTime() + durationMin * 60 * 1000);


    const overlappingBooking = await prisma.gameBooking.findFirst({
        where: {
            gameId: gameId,
            status: {
                in: [BookingStatus.PAID]
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


    let totalAmount = 0;
    if(Number(payload.durationMin) == 30){
        totalAmount = ckGame.price30Min
    }
    else if(Number(payload.durationMin) == 60){
        totalAmount = ckGame.price60Min
    }

    const newBooking = await prisma.gameBooking.create({
        data: {
            userId,
            gameId,
            totalAmount,
            startTime: new Date(startTime),
            durationMin,
            status: BookingStatus.PENDING,
            expiresAt,
        },
    });


    await scheduleGameLifecycleJobs(newBooking.id, newBooking.startTime, durationMin); // create a bulmq job

    return newBooking;
};


const getAvailableSlots = async (payload: GetAvailableSlotsPayload) => {
    const { gameId, date, durationMin } = payload; 

    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);

    const existingBookings = await prisma.gameBooking.findMany({
        where: {
            gameId,
            status: BookingStatus.PAID,
            startTime: { gte: startOfDay, lte: endOfDay }
        },
        select: {
            startTime: true,
            expiresAt: true,
            durationMin: true 
        },
        orderBy: { startTime: 'asc' }
    });

    const businessStart = new Date(`${date}T08:00:00+06:00`); // BD Local Time 08:00 AM
    const businessEnd = new Date(`${date}T22:00:00+06:00`);   // BD Local Time 10:00 PM

    const availableSlots = [];
    let currentSlotStart = new Date(businessStart);

    while (currentSlotStart.getTime() + durationMin * 60 * 1000 <= businessEnd.getTime()) {
        const currentSlotEnd = new Date(currentSlotStart.getTime() + durationMin * 60 * 1000);
        const now = new Date();
        const isFuture = currentSlotStart > now;

        const isOverlapping = existingBookings.some(booking => {
            const bookedStart = new Date(booking.startTime);
            const bookedEnd = booking.expiresAt 
                ? new Date(booking.expiresAt) 
                : new Date(bookedStart.getTime() + (booking as any).durationMin * 60 * 1000);

            return currentSlotStart < bookedEnd && currentSlotEnd > bookedStart;
        });

        if (isFuture && !isOverlapping) {
            const formatTime = (date: Date) =>
                date.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    hour12: true, 
                    timeZone: 'Asia/Dhaka' 
                });

            availableSlots.push({
                display: `${formatTime(currentSlotStart)} - ${formatTime(currentSlotEnd)}`,
                startTime: currentSlotStart.toISOString(),
                endTime: currentSlotEnd.toISOString()
            });
        }

        currentSlotStart = new Date(currentSlotStart.getTime() + 15 * 60 * 1000);
    }

    return availableSlots;
};

export const gameBookingService = {
    CreateGameBooking,
    getAvailableSlots
};






