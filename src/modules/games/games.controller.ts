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


const updateGames = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

})


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