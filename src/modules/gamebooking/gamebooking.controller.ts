import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { gameBookingService } from "./gamebooking.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status'

const CreateGameBooking = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const userId = req.user?.id as string


    const result = await gameBookingService.CreateGameBooking(userId, req.body);

    sendResponse(res, {
        success: true,
        message: "Booking initiated successfully! Slot locked for 10 minutes.",
        data: result,
        statusCode: httpStatus.CREATED
    })
});

const getAvailableSlots = catchAsync(async (req: Request, res: Response, next: NextFunction) => {




    const data = await gameBookingService.getAvailableSlots(req.body)

    sendResponse(res, {
        data,
        message: 'All Available slot this game!',
        statusCode: httpStatus.OK,
        success: true
    })
})

export const gameBookingController = {
    CreateGameBooking,
    getAvailableSlots
};