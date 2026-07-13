import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import htppStatus from 'http-status'
import { userService } from "./user.service";
import sharp from "sharp";
import { cloudinaryUpload } from "../../config/cloudinaryConfig";
import 'multer';


const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const result = await userService.createUser(req.body)

    sendResponse(res, {
        data: result,
        success: true,
        statusCode: htppStatus.CREATED,
        message: "Registration successfully!"
    })
})



const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const { role, password, id: usId, isVerified, status, email } = req.body
    if (role || password || usId || isVerified || status || email) {
        throw new Error('You cannot update role, password,status,email, isVerified, or user ID through this route.');
    }

    if (req.file) {
        const compressedImage = await sharp(req.file.buffer)
            .resize({ width: 1200, withoutEnlargement: true })
            .jpeg({
                quality: 70,
                mozjpeg: true,
            })
            .toBuffer();
        const result: any = await cloudinaryUpload(compressedImage);
        req.body.image = result.secure_url;
        req.body.publicId = result.public_id;

    }

    const id = req?.user?.id as string
    const result = await userService.updateUser({ id, ...req.body })


    sendResponse(res, {
        success: true,
        data: result,
        statusCode: htppStatus.OK,
        message: "Your profile has been updated successfully!"
    })

})


const getAllUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

     
})


const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const id = req.user?.id as string
    const email = req.user?.email as string
    const user = await userService.getMe(id, email)
    sendResponse(res, {
        success: true,
        data: user,
        statusCode: htppStatus.OK,
        message: 'User Details Retrive successfully!'
    })
})





export const userController = {
    createUser,
    updateUser,
    getAllUser,
    getMe
}