import { Queue } from "bullmq";


const redisConnection = process.env.REDIS_URL
  ? { url: process.env.REDIS_URL }
  : {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT || 6379),
    maxRetriesPerRequest: null,
  };


export const bookingQueue = new Queue("booking-lifecycle", {
  connection: redisConnection,
});


export const scheduleGameLifecycleJobs = async (bookingId: string, startTime: Date, durationMin: number) => {
  const now = Date.now();


  const startDelayMs = new Date(startTime).getTime() - now;


  const endDelayMs = (new Date(startTime).getTime() + (durationMin * 60 * 1000)) - now;


  if (startDelayMs > 0) {
    await bookingQueue.add(
      "start-game",
      { bookingId },
      {
        delay: startDelayMs,
        removeOnComplete: true,
        removeOnFail: true,
      }
    );
  }


  if (endDelayMs > 0) {
    await bookingQueue.add(
      "end-game",
      { bookingId },
      {
        delay: endDelayMs,
        removeOnComplete: true,
        removeOnFail: true,
      }
    );
  }
};