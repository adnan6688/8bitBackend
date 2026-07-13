import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { prisma } from "../../lib/prisma";
import { cloudinaryUpload } from "../../config/cloudinaryConfig";
import { fooodService } from "./foods.service";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from 'http-status'


const addFoods = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
        throw new Error('At least one food image is required!')
    }


    if (req?.body.isDiscount && !req.body?.disCountParcenTage) {
        throw new Error('Discount percentage is required when isDiscount is true!');
    }

    const { name } = req.body;
    const isGameExist = await prisma.food.findFirst({
        where: { name: name }
    });
    if (isGameExist) {
        throw new Error("This food already exists! Choose a different name.")
    }

    const files = req.files as Express.Multer.File[];
    const imageUrls: string[] = [];

    for (const file of files) {
        const uploadResult = await cloudinaryUpload(file.buffer);
        imageUrls.push(uploadResult.secure_url);
    }
    const foodData = {
        ...req.body,
        images: imageUrls,
        createdById: req?.user?.id as string
    };


    foodData.price = Number(foodData.price) || 0;
    foodData.delivery_time = Number(foodData.delivery_time) || 0;
    foodData.delivery_fee = Number(foodData.delivery_fee) || 0;


    foodData.isDisCount = String(foodData.isDiscount) === 'true' || foodData.isDisCount === true;
    foodData.disCountParcentage = Number(foodData.disCountParcentage) || 0;

    if (foodData.isDiscount) {
        const price = foodData.price;
        const disCountParcentage = foodData.disCountParcenTage;

        const discountAmount = (price * disCountParcentage) / 100;
        foodData.discountPrice = price - discountAmount;
    } else {
        foodData.discountPrice = 0;
        foodData.disCountParcentage = 0;
    }



    const data = await fooodService.addFoods(foodData)



    sendResponse(res, {
        success: true,
        message: 'Yum! Your new food item has been added successfully!',
        data,
        statusCode: httpStatus.CREATED
    })
})


const getFoods = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const searchTerm = req.query?.searchTerm || ""
    const options = {
        page: req?.query.page,
        limit: req?.query.limit,
        sortBy: req.query?.sortBy,
        sortOrder: req.query.sortOrder
    }

    const data = await fooodService.getFoods(options, searchTerm as string)
    sendResponse(res, {
        data,
        message: 'Foods fetched successfully!',
        success: true,
        statusCode: httpStatus.OK
    })

})




export const updateFoods = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { foodId } = req.params;

    if (!foodId) {
        throw new Error('Food Id must be added!')
    }

    const existingFood = await prisma.food.findUnique({ where: { id: foodId as string } });

    if (!existingFood) {
        throw new Error('Food not found!');
    }


    const files = req.files as Express.Multer.File[];
    let finalImages: string[] = existingFood.images;


    if (files && files.length > 0) {
        const imageUrls: string[] = [];
        for (const file of files) {
            const uploadResult = await cloudinaryUpload(file.buffer);
            imageUrls.push(uploadResult.secure_url);
        }

        finalImages = [...existingFood.images, ...imageUrls];
    }


    const updatePayload = {
        ...req.body,
        images: finalImages
    };


    const finalPercentage = updatePayload.disCountParcentage !== undefined
        ? updatePayload.disCountParcentage
        : existingFood?.disCountParcentage;

    if (updatePayload.isDisCount === true || (updatePayload.isDisCount === undefined && existingFood.isDisCount)) {
        const activePrice = updatePayload.price || existingFood.price;
        updatePayload.discountPrice = activePrice - (activePrice * (finalPercentage / 100));
    } else if (updatePayload.isDisCount === false) {

        updatePayload.discountPrice = 0;
        updatePayload.disCountParcentage = 0;
    }


    const data = await fooodService.updateFoods(updatePayload, foodId as string);


    sendResponse(res, {
        success: true,
        message: 'Food update successfully!',
        data: data,
        statusCode: httpStatus.OK
    });
});




const foodDetails = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const foodId = req.params.foodId as string
    if (!foodId) {
        throw new Error('Food Id not found!')
    }
    const data = await fooodService.foodDetails(foodId)
    sendResponse(res, {
        data,
        message: 'Food fetched successfully!',
        success: true,
        statusCode: httpStatus.OK
    })
})



export const foodController = {
    addFoods,
    getFoods,
    foodDetails,
    updateFoods
}