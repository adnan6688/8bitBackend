import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { loginZodSchema } from "./auth.validation";
import { authController } from "./auth.controller";
import { auth } from "../../middleware/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";



const route = Router()


route.post('/login', validateRequest(loginZodSchema) ,  authController.login)
route.post('/logout' , auth(...Object.values(UserRole)) , authController.logout)

export const authRoutes = route