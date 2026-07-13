import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import statusCode from 'http-status'
import { cloudinaryUpload } from "../../config/cloudinaryConfig";
import { gameService } from "./games.service";
import { prisma } from "../../lib/prisma";

const addGames = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
        throw new Error('At least one game image is required!')
    }

    if (req?.body.isDiscount && !req.body?.disCountParcenTage) {
        throw new Error('Discount percentage is required when isDiscount is true!');
    }



    const { name } = req.body;
    const isGameExist = await prisma.game.findFirst({
        where: { name: name }
    });
    if (isGameExist) {
        throw new Error("This game already exists! Choose a different name.")
    }

    const files = req.files as Express.Multer.File[];
    const imageUrls: string[] = [];


    for (const file of files) {
        const uploadResult = await cloudinaryUpload(file.buffer);
        imageUrls.push(uploadResult.secure_url);
    }
    const gameData = {
        ...req.body,
        images: imageUrls,
        createdById: req?.user?.id as string
    };

    gameData.price = Number(gameData.price)
    gameData.isDiscount = Boolean(gameData.isDiscount)
    gameData.disCountParcenTage = Number(gameData.disCountParcenTage)

    if (gameData.isDiscount) {

        const price = Number(gameData.price) || 0;
        const discountPercentage = Number(gameData.disCountParcenTage) || 0;

        const discountAmount = (price * discountPercentage) / 100;
        gameData.disCountPrice = price - discountAmount;
    } else {

        gameData.disCountPrice = 0;
        gameData.disCountParcenTage = 0;
    }
    if (typeof gameData.schedules === 'string') {
        gameData.schedules = JSON.parse(gameData.schedules);
    }
    const game = await gameService.addGames(gameData)



    sendResponse(res, {
        success: true,
        data: game,
        message: 'Game created successfully!',
        statusCode: statusCode.OK
    })
})

const gamesDetails = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.gameId as string
    const data = await gameService.gamesDetails(id)

    sendResponse(res, {
        success: true,
        data,
        message: 'Game retrieved successfully!',
        statusCode: statusCode.OK
    })

})



export const updateGames = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { gameId } = req.params;

    if (!gameId) {
        throw new Error('Game Id must be added!');
    }

    // ১. ডাটাবেজে গেমটি আছে কিনা চেক করা
    const existingGame = await prisma.game.findUnique({
        where: { id: gameId as string },
        include: { schedules: true }
    });

    if (!existingGame) {
        throw new Error('Game not found!');
    }

    // ২. Multer ফাইল আপলোড হ্যান্ডেল করা (Cloudinary)
    const files = req.files as Express.Multer.File[];
    let finalImages: string[] = existingGame.images;

    if (files && files.length > 0) {
        const imageUrls: string[] = [];
        for (const file of files) {
            const uploadResult = await cloudinaryUpload(file.buffer); // আপনার ক্লাউডিনারি ফাংশন
            imageUrls.push(uploadResult.secure_url);
        }
        // আগের ইমেজের সাথে নতুন ইমেজ যোগ করা
        finalImages = [...existingGame.images, ...imageUrls];
    }

    // ৩. রিকোয়েস্ট পে-লোড তৈরি করা
    const updatePayload = {
        ...req.body,
        images: finalImages
    };

    // ৪. ফর্ম-ডেটা দিয়ে schedules পাঠালে সেটি string থাকে, তাই JSON Parse করে অ্যারেতে কনভার্ট করা
    if (updatePayload.schedules && typeof updatePayload.schedules === 'string') {
        updatePayload.schedules = JSON.parse(updatePayload.schedules);
    }

    // ৫. ডিসকাউন্ট ক্যালকুলেশন লজিক (হুবহু ফুড এর মতো)
    const finalPercentage = updatePayload.disCountParcenTage !== undefined
        ? Number(updatePayload.disCountParcenTage)
        : existingGame?.disCountParcenTage;

    if (updatePayload.isDiscount === true || updatePayload.isDiscount === "true" || (updatePayload.isDiscount === undefined && existingGame.isDiscount)) {
        const activePrice = updatePayload.price ? Number(updatePayload.price) : existingGame.price;
        updatePayload.disCountPrice = activePrice - (activePrice * (finalPercentage as  number / 100));
        updatePayload.isDiscount = true; // নিশ্চিত করার জন্য বুনিয়ান করা
    } else if (updatePayload.isDiscount === false || updatePayload.isDiscount === "false") {
        updatePayload.disCountPrice = 0;
        updatePayload.disCountParcenTage = 0;
        updatePayload.isDiscount = false;
    }


    
    // কোয়ার্স করা ফিল্ডগুলো নাম্বার ফরম্যাটে রাখা (ফর্ম ডেটা অনেক সময় স্ট্রিং পাঠায়)
    if (updatePayload.price) updatePayload.price = Number(updatePayload.price);
    if (updatePayload.disCountParcenTage) updatePayload.disCountParcenTage = Number(updatePayload.disCountParcenTage);

    // ৬. সার্ভিস কল করে ডাটাবেজ আপডেট
    const data = await gameService.updateGamesNew(updatePayload, gameId as string);

    // ৭. রেসপন্স পাঠানো
    sendResponse(res, {
        success: true,
        message: 'Game updated successfully!',
        data: data,
        statusCode: statusCode.OK
    });
});






const allGames = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const searchTerm = req?.query?.searchTerm as string

    const options = {
        page: req.query.page,
        limit: req.query.limit,
        sortBy: req.query.sortBy,
        sortOrder: req.query.sortOrder
    };

    const data = await gameService.allGames(options, searchTerm)
    sendResponse(res, {
        data,
        message: 'Games fetched successfully!',
        success: true,
        statusCode: statusCode.OK
    })
})


export const gameController = {
    addGames,
    gamesDetails,
    updateGames,
    allGames
}