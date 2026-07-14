import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { CartItemZodSchema } from "./cart.validation";
import { cartController } from "./cart.controller";



const route = Router()

route.post('/itemAdd' , auth(...Object.values(UserRole)) ,  validateRequest(CartItemZodSchema) , cartController.cartItemAdded)

route.get('/mycart' , auth(...Object.values(UserRole)) , cartController.myCart)

route.delete('/removeItem/:cartItemId' , auth(...Object.values(UserRole)) , cartController.removeItemFromCart)

export const cartRoutes = route