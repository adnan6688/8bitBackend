import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";
import httpStatusCode from 'http-status'



export const GlobalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    let statusCode;
    let errorMessage = err.message || "Internal server error"
    let errorName = err.name || "Internal server error"
    let errorDetails = err.stack



    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = httpStatusCode.BAD_REQUEST
        errorMessage = "You have provided incorrect field type or missing fields"
    }
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {

        if (err.code == "P2002") {
            statusCode = httpStatusCode.BAD_REQUEST
            errorMessage = "Duplicate Key Error"
        }
        else if (err.code == "P2003") {

            statusCode = httpStatusCode.BAD_REQUEST
            errorMessage = "Foreign key constraint failed"
        }
        else if (err.code === "P2025") {
            statusCode = httpStatusCode.BAD_REQUEST,
                errorMessage = "An operation failed because it depends on one or more records that were required but not found."
        }
    } else if (err instanceof Prisma.PrismaClientInitializationError) {

        if (err.errorCode == "P1000") {
            statusCode = httpStatusCode.UNAUTHORIZED
            errorMessage = "Authentication failed against database server. Please Check Your Credentialds"
        }
        else if (err.errorCode == "P1001") {
            statusCode = httpStatusCode.BAD_REQUEST
            errorMessage = "Can't reach database server"
        }
    }
    else if (err instanceof Prisma.PrismaClientUnknownRequestError) {

        statusCode = httpStatusCode.INTERNAL_SERVER_ERROR
        errorMessage = "Error Occured during query execution"
    }



    res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode: statusCode || httpStatusCode.INTERNAL_SERVER_ERROR,
        message: errorMessage,
        name: errorName,
        error: errorDetails
    })
}