import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { cartService } from "./cart.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status'




const cartItemAdded = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const userId = req?.user?.id as string
    await cartService.cartItemAddedService(req.body, userId)

    sendResponse(res, {
        success: true,
        message: 'Food item added to cart successfully!',
        statusCode: httpStatus.OK
    })

})

const myCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const user = req?.user?.id as string
    const data = await cartService.myCart(user)

    sendResponse(res, {
        success: true,
        data,
        message: 'Your cart items get successfully!',
        statusCode: httpStatus.OK
    })
})


const removeItemFromCart = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const userId = req.user?.id as string

    const cartItemId = req.params.cartItemId as string

    await cartService.removeItemFromCart(userId, cartItemId)

    sendResponse(res, {
        success : true , 
        message : 'Item removed from your cart successfully!',
        statusCode : httpStatus.OK
    })
})

export const cartController = {
    cartItemAdded,
    myCart ,
    removeItemFromCart
}