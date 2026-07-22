import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { paymentSerivce } from "./payment.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status'

const paymentInitialize = catchAsync(async (req : Request , res : Response , next : NextFunction)=>{

    const data = await paymentSerivce.paymentInitialize()


    sendResponse(res, {
        success : true , 
        data , 
        message : 'Payment initialize',
        statusCode : httpStatus.OK
    })
})

export const paymentController = {
    paymentInitialize
}