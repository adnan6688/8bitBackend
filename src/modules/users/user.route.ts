import { Router } from "express";
import { userController } from "./user.controller";
import { validateRequest } from "../../middleware/validateRequest";
import { createUserSchema, updateUserSchma } from "./user.validation";
import { authLimiter } from "../../middleware/ratelimiting";

import { auth } from "../../middleware/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";
import { upload } from "../../config/cloudinaryConfig";


const route = Router()

route.post('/register', authLimiter, validateRequest(createUserSchema), userController.createUser)


route.get('/getMe', auth(...Object.values(UserRole)), userController.getMe)


route.patch('/updateUser',auth(...Object.values(UserRole)), upload.single("image"), validateRequest(updateUserSchma),  userController.updateUser)



export const userRoutes = route