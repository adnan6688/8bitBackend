import { Worker } from "bullmq";
import { prisma } from "../../lib/prisma";
import { BookingStatus } from "../../../generated/prisma/enums";


const redisConnection = process.env.REDIS_URL
    ? { url: process.env.REDIS_URL }
    : {
        host: process.env.REDIS_HOST || "127.0.0.1",
        port: Number(process.env.REDIS_PORT || 6379),
    };

export const startBookingWorker = () => {
    const worker = new Worker(
        "booking-updates",
        async (job) => {
            const { bookingId } = job.data as { bookingId: string };

            const booking = await prisma.gameBooking.findUnique({
                where: { id: bookingId },
                select: { id: true, status: true },
            });

            if (!booking) {
                return;
            }

            if ((booking.status as string) === BookingStatus.CONFIRMED) {
                return;
            }

            await prisma.gameBooking.update({
                where: { id: bookingId },
                data: {
                    status: BookingStatus.CONFIRMED as any,
                },
            });
        },
        {
            connection: redisConnection,
            autorun: true,
        }
    );

    worker.on("completed", (job) => {
        console.log(`[booking-worker] completed: ${job.id}`);
    });

    worker.on("failed", (job, err) => {
        console.error(`[booking-worker] failed: ${job?.id}`, err.message);
    });

    return worker;
};
