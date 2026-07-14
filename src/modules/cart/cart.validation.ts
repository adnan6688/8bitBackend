import { z } from 'zod';

export const CartItemZodSchema = z.object({
    foodId: z.string({ message: "Food ID is required" }),
    
    quantity: z.coerce.number({ message: "Quantity is required" })
        .int({ message: "Quantity must be an integer" })
        .min(1, { message: "Quantity must be at least 1" })
});