import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { authService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";
import statusCode from 'http-status'
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";
import { getTokens } from "../../utils/tokens";

const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const data = await authService.login(req.body)


    const PayLoadForJwt = {
        id: data?.id,
        role: data?.role,
        email: data?.email,
        name: `${data?.firstName} ${data?.lastName}`
    }

    const { accessToken, refreshToken } = getTokens(PayLoadForJwt)


    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 // 24 hour or one day
    })

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 7
    })


    sendResponse(res, {
        success: true,
        data: {
            accessToken,
            refreshToken
        },
        message: 'Login Successfully!',
        statusCode: statusCode.OK
    })

})



const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 // 24 hour or one day
    })


    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: false,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 7
    })

})

export const authController = {
    login,
    logout
}