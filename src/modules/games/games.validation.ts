import { z } from "zod";


const scheduleSchema = z.object({
    day: z.string({ message: "Day is required" }).min(1, "Day cannot be empty"),
    openTime: z.string({ message: "Open time is required" }).min(1, "Open time cannot be empty"),
    endTime: z.string({ message: "End time is required" }).min(1, "End time cannot be empty")
});


export const addGameZodSchema = z.object({
    name: z.string({ message: "Game name is required" })
        .min(4, { message: "Name must be at least 4 characters long" })
        .max(50, { message: "Name cannot exceed 50 characters" }),

    price: z.coerce.number({ message: "Price is required" })
        .min(20, { message: "Price must be at least 20" }),

    description: z.string({ message: "Description is required" })
        .min(10, { message: "Description must be at least 10 characters long" })
        .max(500, { message: "Description cannot exceed 500 characters" }),

    categoryId: z.string({ message: "Category ID is required" }),


    images: z.array(z.string()).optional(),

    schedules: z.string({ message: "Schedules are required" })
        .transform((val) => {
            try {
                return JSON.parse(val);
            } catch {
                return [];
            }
        })
        .pipe(
            z.array(scheduleSchema)
                .min(1, { message: "At least one day's schedule must be provided" })
        ),
    isDiscount: z.coerce.boolean().optional(),
    disCountParcenTage: z.coerce.number().int().min(0).max(100).optional()
});