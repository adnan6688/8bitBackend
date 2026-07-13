import { z } from "zod";

export const addFoodZodSchema = z.object({
    name: z.string({ message: "Food name is required" })
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(100, { message: "Name cannot exceed 100 characters" }),

    price: z.coerce.number({ message: "Price is required" })
        .min(0, { message: "Price cannot be negative" }),

    images: z.string().optional(),

    delivery_time: z.coerce.number({ message: "Delivery time is required" })
        .min(1, { message: "Delivery time must be at least 1 minute" }),

    delivery_fee: z.coerce.number({ message: "Delivery fee is required" })
        .min(0, { message: "Delivery fee cannot be negative" }),

    short_description: z.string({ message: "Short description is required" })
        .min(10, { message: "Description must be at least 10 characters long" })
        .max(250, { message: "Description cannot exceed 250 characters" }),

    isDisCount: z.coerce.boolean({ message: "Discount status must be a boolean" })
        .default(false),

    disCountParcentage: z.coerce.number()
        .int({ message: "Percentage must be a whole number" })
        .min(0, { message: "Discount percentage cannot be less than 0" })
        .max(100, { message: "Discount percentage cannot exceed 100" })
        .default(0),

    disCountPrice: z.coerce.number()
        .min(0, { message: "Discount price cannot be negative" })
        .default(0),


    categoryId: z.string({ message: "Category ID is required" })
});



export const updateFoodZodSchema = z.object({
    name: z.string()
        .min(3, { message: "Name must be at least 3 characters long" })
        .max(100, { message: "Name cannot exceed 100 characters" })
        .optional(),

    price: z.coerce.number()
        .min(0, { message: "Price cannot be negative" })
        .optional(),

    images: z.string().optional(),

    delivery_time: z.coerce.number()
        .min(1, { message: "Delivery time must be at least 1 minute" })
        .optional(),

    delivery_fee: z.coerce.number()
        .min(0, { message: "Delivery fee cannot be negative" })
        .optional(),

    short_description: z.string()
        .min(10, { message: "Description must be at least 10 characters long" })
        .max(250, { message: "Description cannot exceed 250 characters" })
        .optional(),

    isDisCount: z.preprocess(
        (val) => {
            if (val === "false") return false;
            if (val === "true") return true;
            return val;
        },
        z.boolean({ message: "Discount status must be a boolean" })
    ).optional(),

    disCountParcentage: z.coerce.number()
        .int({ message: "Percentage must be a whole number" })
        .min(0, { message: "Discount percentage cannot be less than 0" })
        .max(100, { message: "Discount percentage cannot exceed 100" })
        .optional(),

    disCountPrice: z.coerce.number()
        .min(0, { message: "Discount price cannot be negative" })
        .optional(),

    categoryId: z.string()
        .optional()
}).refine((data) => {

    if (data.isDisCount === true && (data.disCountParcentage === undefined || data.disCountParcentage === 0)) {
        return false;
    }
    return true;
}, {
    message: "If discount is active, discount percentage must be provided and greater than 0",
    path: ["disCountParcentage"],
});