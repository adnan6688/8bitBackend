import z from "zod";
import { CatType } from "../../../generated/prisma/enums";

export const categoryZodSchema = z.object({
    type: z.nativeEnum(CatType, {
        message: "Invalid category type. Must be a valid CatType"
    }),

    name: z.string()
        .trim()
        .min(1, { message: "Category name cannot be empty and is required" })
});

export const updateCateogryZodSchema = z.object({

    type: z.nativeEnum(CatType, {
        message: "Invalid category type. Must be a valid CatType"
    }).optional(),


    name: z.string()
        .trim()
        .min(1, { message: "Category name cannot be empty and is required" }).optional(),


    isDelete: z.boolean().optional()

})