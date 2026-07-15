import z from "zod";

const CreateGameBookingZodValidation = z.object({
    body: z.object({
        gameId: z.string({
            message: "Game ID is required",
        }).min(1, "Game ID cannot be empty"),

        startTime: z.string({
            message: "Start time is required",
        }).datetime({ message: "Invalid ISO datetime format" }),

        durationMin: z.number({
            message: "Duration in minutes is required",

        }).positive("Duration must be a positive number"),
    }, {
        message: "Request body is missing",
    }),
});

export const gameBookingValidation = {
    CreateGameBookingZodValidation,
};