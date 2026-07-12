import { Response } from "express"



type TMeta = {
    page: number,
    limit: number,
    totalPages: number,
    total: number
}

type TResponse<T> = {
    message: string,
    success: boolean,
    statusCode: number,
    data?: T,
    meta?: TMeta
}


export const sendResponse = <T>(res: Response, data: TResponse<T>) => {


    res.status(data.statusCode).send({
        data: data.data,
        success: data.success,
        message: data.message,
        meta: data?.meta
    })
}