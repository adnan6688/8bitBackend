import { z } from "zod";

const CreateGameBookingZodValidation = z.object({
    gameId: z.string({
        message: "Game ID is required",
    }).min(1, "Game ID cannot be empty"),

    startTime: z
        .string({
            message: "Start time is required",
        })
        .datetime({
            message: "Invalid ISO datetime format",
        })

        .refine(
            (val) => {
                const inputDate = new Date(val);
                const now = new Date();

                return inputDate > now;
            },
            {
                message: "Start time must be a future time",
            }
        ),

    durationMin: z.custom<number>(
        (val) => typeof val === "number" && [15, 30, 45, 60].includes(val),
        { message: "Duration must be 15, 30, 45, or 60 minutes" }
    )
});




const GetAvailableSlotsSchema = z.object({

    gameId: z.custom<string>(
        (val) => typeof val === "string" && val.trim().length > 0,
        { message: "Game ID is required and must be a string" }
    ),

    date: z.custom<string>(
        (val) => {
            if (typeof val !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(val)) return false;

            const inputDate = new Date(`${val}T00:00:00.000Z`);
            const today = new Date();
            today.setUTCHours(0, 0, 0, 0);

            return inputDate >= today;
        },
        { message: "Date is required, must be YYYY-MM-DD format, and cannot be in the past" }
    ),

    durationMin: z.custom<number>(
        (val) => typeof val === "number" && [15, 30, 45, 60].includes(val),
        { message: "Duration is required and must be 15, 30, 45, or 60 minutes" }
    ),
});






export const gameBookingValidation = {
    CreateGameBookingZodValidation,
    GetAvailableSlotsSchema
};