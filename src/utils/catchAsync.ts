import { NextFunction, Request, Response } from "express";



type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<void>




export const catchAsync = (fn: AsyncHandler) => {

    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await fn(req, res, next)
        } catch (err) {
            next(err)
        }
    }
}