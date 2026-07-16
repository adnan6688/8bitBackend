import { Worker } from "bullmq";
import { prisma } from "../../lib/prisma";
import { BookingGameStatus, BookingStatus } from "../../../generated/prisma/enums";


const redisConnection = process.env.REDIS_URL
    ? { url: process.env.REDIS_URL }
    : {
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: Number(process.env.REDIS_PORT || 6379),
    };




export const startBookingWorker = () => {

    const worker = new Worker(
        "booking-lifecycle",
        async (job) => {

            console.log("worker working...")
            const { bookingId } = job.data as { bookingId: string };

            const booking = await prisma.gameBooking.findUnique({
                where: { id: bookingId }
            });

            // বুকing না থাকলে বা বুকিং যদি ক্যানসেল হয়ে যায়, তবে গেম স্টার্ট করার দরকার নেই
            if (!booking || booking.status === BookingStatus.CANCELLED) {
                console.log(`[Worker] Booking ${bookingId} is cancelled or not found. Skipping.`);
                return;
            }

            // ১. খেলা শুরু করার জব
            if (job.name === "start-game") {
                console.log("job : start game", job.name)
                if (booking.status === BookingStatus.CONFIRMED && booking.gameStatus === BookingGameStatus.NOT_STARTED) {
                    await prisma.gameBooking.update({
                        where: {
                            id: bookingId,
                            status: BookingStatus.CONFIRMED,
                            gameStatus: BookingGameStatus.NOT_STARTED
                        },
                        data: { gameStatus: BookingGameStatus.IN_PROGRESS }
                    });
                    console.log(`[Worker] Game is now LIVE for Booking: ${bookingId}`);
                }
            }

            // ২. খেলা শেষ করার জব
            if (job.name === "end-game") {
                console.log("job : end game", job.name)
                if (booking.gameStatus === BookingGameStatus.IN_PROGRESS) {
                    await prisma.gameBooking.update({
                        where: { id: bookingId },
                        data: { gameStatus: BookingGameStatus.ENDED }
                    });
                    console.log(`[Worker] Game has ENDED for Booking: ${bookingId}`);
                }
            }
        },
        {
            connection: {
                host: process.env.REDIS_HOST || "127.0.0.1",
                port: Number(process.env.REDIS_PORT || 6379),
                maxRetriesPerRequest: null,
            },
            autorun: true,
        }
    );

    return worker;
};