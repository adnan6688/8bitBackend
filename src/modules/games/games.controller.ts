import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import statusCode from "http-status";
import { cloudinaryUpload } from "../../config/cloudinaryConfig";
import { gameService } from "./games.service";
import { prisma } from "../../lib/prisma";

const addGames = catchAsync(async (req: Request, res: Response, next: NextFunction) => {





    if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
      throw new Error("At least one game image is required!");
    }

    if (req?.body.isDiscount && !req.body?.disCountParcenTage) {
      throw new Error(
        "Discount percentage is required when isDiscount is true!",
      );
    }

    const { name } = req.body;
    const isGameExist = await prisma.game.findFirst({
      where: { name: name },
    });
    if (isGameExist) {
      throw new Error("This game already exists! Choose a different name.");
    }

    const files = req.files as Express.Multer.File[];
    const imageUrls: string[] = [];
    const upLoad_publicIds: string[] = [];


    for (const file of files) {
      const uploadResult = await cloudinaryUpload(file.buffer);

      imageUrls.push(uploadResult.secure_url);
      upLoad_publicIds.push(uploadResult.public_id);
    }

    const gameData = {
      ...req.body,
      images: imageUrls,
      createdById: req?.user?.id as string,
    };

    gameData.price = Number(gameData.price);
    gameData.isDiscount = Boolean(gameData.isDiscount);
    gameData.disCountParcenTage = Number(gameData.disCountParcenTage);

    if (gameData.isDiscount) {
      const price = Number(gameData.price) || 0;
      const discountPercentage = Number(gameData.disCountParcenTage) || 0;

      const discountAmount = (price * discountPercentage) / 100;
      gameData.discountPrice = price - discountAmount;
    } else {
      gameData.discountPrice = 0;
      gameData.disCountParcenTage = 0;
    }
    if (typeof gameData.schedules === "string") {
      gameData.schedules = JSON.parse(gameData.schedules);
    }



    const game = await gameService.addGames(gameData);

    sendResponse(res, {
      success: true,
      data: game,
      message: "Game created successfully!",
      statusCode: statusCode.OK,
    });
  },
);

const gamesDetails = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.gameId as string;
    const data = await gameService.gamesDetails(id);

    sendResponse(res, {
      success: true,
      data,
      message: "Game retrieved successfully!",
      statusCode: statusCode.OK,
    });
  },
);

const updateGames = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { gameId } = req.params;

    if (!gameId) {
      throw new Error("Game Id must be added!");
    }

    const existingGame = await prisma.game.findUnique({
      where: { id: gameId as string },
      include: { schedules: true },
    });

    if (!existingGame) {
      throw new Error("Game not found!");
    }

    const files = req.files as Express.Multer.File[];
    let finalImages: string[] = existingGame.images;

    if (files && files.length > 0) {
      const imageUrls: string[] = [];
      for (const file of files) {
        const uploadResult = await cloudinaryUpload(file.buffer);
        imageUrls.push(uploadResult.secure_url);
      }

      finalImages = [...existingGame.images, ...imageUrls];
    }

    const updatePayload = {
      ...req.body,
      images: finalImages,
    };

    if (
      updatePayload.schedules &&
      typeof updatePayload.schedules === "string"
    ) {
      updatePayload.schedules = JSON.parse(updatePayload.schedules);
    }

    if (updatePayload.price30Min !== undefined)
      updatePayload.price30Min = Number(updatePayload.price30Min);
    if (updatePayload.price60Min !== undefined)
      updatePayload.price60Min = Number(updatePayload.price60Min);
    if (updatePayload.disCountParcenTage !== undefined)
      updatePayload.disCountParcenTage = Number(
        updatePayload.disCountParcenTage,
      );

    if (
      updatePayload.isDiscount === true ||
      updatePayload.isDiscount === "true"
    ) {
      updatePayload.isDiscount = true;
    } else if (
      updatePayload.isDiscount === false ||
      updatePayload.isDiscount === "false"
    ) {
      updatePayload.isDiscount = false;
      updatePayload.disCountParcenTage = null;
    }

    const data = await gameService.updateGamesNew(
      updatePayload,
      gameId as string,
    );

    sendResponse(res, {
      success: true,
      message: "Game updated successfully!",
      data: data,
      statusCode: statusCode.OK,
    });
  },
);

const allGames = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const searchTerm = req?.query?.searchTerm as string;

    const options = {
      page: req.query.page,
      limit: req.query.limit,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
    };

    const data = await gameService.allGames(options, searchTerm);
    sendResponse(res, {
      data,
      message: "Games fetched successfully!",
      success: true,
      statusCode: statusCode.OK,
    });
  },
);

export const gameController = {
  addGames,
  gamesDetails,
  updateGames,
  allGames,
};
