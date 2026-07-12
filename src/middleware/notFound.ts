import { Request, Response } from "express";
import httpStatus from 'http-status'


export const NotFound = (req : Request , res : Response)=>{

    res.status(httpStatus.NOT_FOUND).json({
        message : 'Route Not found!',
        path : req.originalUrl,
        date : Date()
    })
}