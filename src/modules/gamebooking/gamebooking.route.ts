import { Router } from "express";
import { gameBookingController } from "./gamebooking.controller";
import { gameBookingValidation } from "./gamebooking.validation";
import { validateRequest } from "../../middleware/validateRequest";
import { auth } from "../../middleware/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";

const route = Router();


route.post(
  "/create-booking",
  validateRequest(gameBookingValidation.CreateGameBookingZodValidation),
  auth(...Object.values(UserRole)),
  gameBookingController.CreateGameBooking
);

export const gameBookingRoute = route;