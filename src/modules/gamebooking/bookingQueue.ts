import { Queue } from "bullmq";

const redisConnection = process.env.REDIS_URL
  ? { url: process.env.REDIS_URL }
  : {
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: Number(process.env.REDIS_PORT || 6379),
    };

export const bookingQueue = new Queue("booking-updates", {
  connection: redisConnection,
});

export const createBookingCompletionJob = async (bookingId: string, delayMs: number) => {
  await bookingQueue.add(
    "mark-completed",
    { bookingId },
    {
      delay: delayMs,
      removeOnComplete: true,
      removeOnFail: true,
    }
  );
};
