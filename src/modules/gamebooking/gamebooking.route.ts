import { Router } from "express";
import { gameBookingController } from "./gamebooking.controller";
import { gameBookingValidation } from "./gamebooking.validation";
import { validateRequest } from "../../middleware/validateRequest";

const route = Router();


route.post(
  "/create-booking",
  validateRequest(gameBookingValidation.CreateGameBookingZodValidation),
  gameBookingController.CreateGameBooking
);

export const gameBookingRoute = route;