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

// Optional: Extract the TypeScript type directly from the schema to verify it matches IFood
export type FoodSchemaType = z.infer<typeof addFoodZodSchema>;