import { Router } from "express";
import { foodController } from "./foods.controller";
import { auth } from "../../middleware/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";
import { upload } from "../../config/cloudinaryConfig";
import { validateRequest } from "../../middleware/validateRequest";
import { addFoodZodSchema } from "./foods.validation";



const route = Router()

route.post('/addFood', auth(UserRole.ADMIN, UserRole.SUB_ADMIN), upload.array("images"), validateRequest(addFoodZodSchema), foodController.addFoods)

export const foodsRoute = route