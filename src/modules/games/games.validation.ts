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

    price30Min: z.coerce.number({ message: "Price for 30 minutes is required" })
        .min(0, { message: "Price cannot be negative" }),

    price60Min: z.coerce.number({ message: "Price for 60 minutes is required" })
        .min(0, { message: "Price cannot be negative" }),

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
    disCountParcenTage: z.coerce.number().int().min(0).max(100).optional(),
    disCountPrice: z.coerce.number().optional()
});




const GameStatusEnum = z.enum(["AVAILABLE", "UNAVAILABLE"]);
const WeekDayEnum = z.enum(["SATURDAY", "SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]);



export const updateGameZodSchema = z.object({
    name: z.string()
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(100, { message: "Name cannot exceed 100 characters" })
        .optional(),


    price30Min: z.coerce.number()
        .min(0, { message: "Price cannot be negative" })
        .optional(),

    price60Min: z.coerce.number()
        .min(0, { message: "Price cannot be negative" })
        .optional(),

    description: z.string()
        .min(10, { message: "Description must be at least 10 characters long" })
        .optional(),

    status: GameStatusEnum.optional(),

    categoryId: z.string().optional(),

    isDiscount: z.preprocess(
        (val) => {
            if (val === "false") return false;
            if (val === "true") return true;
            return val;
        },
        z.boolean({ message: "Discount status must be a boolean" })
    ).optional(),

    disCountParcenTage: z.coerce.number()
        .int({ message: "Percentage must be a whole number" })
        .min(0, { message: "Discount percentage cannot be less than 0" })
        .max(100, { message: "Discount percentage cannot exceed 100" })
        .optional(),

    schedules: z.preprocess((val) => {
        if (typeof val === "string") {
            try {
                return JSON.parse(val);
            } catch {
                return val;
            }
        }
        return val;
    }, z.array(
        z.object({
            id: z.string().optional(),
            day: WeekDayEnum,
            openTime: z.string(),
            endTime: z.string()
        })
    )).optional()
}).refine((data) => {
    if (data.isDiscount === true && (data.disCountParcenTage === undefined || data.disCountParcenTage === 0)) {
        return false;
    }
    return true;
}, {
    message: "If discount is active, discount percentage must be provided and greater than 0",
    path: ["disCountParcenTage"],
});