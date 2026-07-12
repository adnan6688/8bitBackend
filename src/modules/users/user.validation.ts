import { z } from 'zod';

export const createUserSchema = z.object({
    firstName: z
        .string()
        .min(1, "First name is required")
        .min(2, "First name must be at least 2 characters long")
        .max(50, "First name cannot exceed 50 characters"),

    lastName: z
        .string()
        .min(1, "Last name is required")
        .min(2, "Last name must be at least 2 characters long")
        .max(50, "Last name cannot exceed 50 characters"),

    email: z
        .string()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),

    password: z
        .string()
        .min(1, "Password is required")
        .min(6, "Password must be at least 6 characters long")
        .max(100, "Password cannot exceed 100 characters"),

    image: z.string().url("Invalid image URL").optional(),

    phone: z
        .string()
        .min(1, "Phone number is required")
        .regex(/^01[3-9]\d{8}$/, "Please enter a valid Bangladeshi mobile number (e.g., 01712345678)"),
});


export const updateUserSchma = z.object({

    firstName: z
        .string()
        .min(1, "First name is required")
        .min(2, "First name must be at least 2 characters long")
        .max(50, "First name cannot exceed 50 characters").optional(),


    lastName: z
        .string()
        .min(1, "Last name is required")
        .min(2, "Last name must be at least 2 characters long")
        .max(50, "Last name cannot exceed 50 characters").optional(),

    image: z.string().url("Invalid image URL").optional(),
    phone: z
        .string()
        .min(1, "Phone number is required")
        .regex(/^01[3-9]\d{8}$/, "Please enter a valid Bangladeshi mobile number (e.g., 01712345678)").optional()
})

