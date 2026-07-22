import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";
import { paymentController } from "./payment.controller";


const route = Router()

route.post('/initialize' , auth(...Object.values(UserRole)) , paymentController.paymentInitialize)

export const paymentRoutes = route