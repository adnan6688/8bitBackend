import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { loginZodSchema } from "./auth.validation";
import { authController } from "./auth.controller";



const route = Router()


route.post('/login', validateRequest(loginZodSchema) ,  authController.login)

export const authRoutes = route