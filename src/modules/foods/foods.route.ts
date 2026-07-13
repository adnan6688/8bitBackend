import { Router } from "express";
import { foodController } from "./foods.controller";
import { auth } from "../../middleware/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";
import { upload } from "../../config/cloudinaryConfig";
import { validateRequest } from "../../middleware/validateRequest";
import { addFoodZodSchema, updateFoodZodSchema } from "./foods.validation";



const route = Router()

route.post('/addFood', auth(UserRole.ADMIN, UserRole.SUB_ADMIN), upload.array("images"), validateRequest(addFoodZodSchema), foodController.addFoods)

route.get('/getFoods', foodController.getFoods)

route.patch('/updateFood/:foodId', auth(UserRole.ADMIN, UserRole.SUB_ADMIN), upload.array("images"), validateRequest(updateFoodZodSchema), foodController.updateFoods)


route.get('/foodDetails/:foodId' , auth(...Object.values(UserRole)) , foodController.foodDetails)

export const foodsRoute = route