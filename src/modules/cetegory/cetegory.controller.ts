import { NextFunction, Response, Request } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { cetegoryService } from "./cetegor.service";
import { sendResponse } from "../../utils/sendResponse";
import statusCode from 'http-status'
import { CatType } from "../../../generated/prisma/enums";


const addCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {


    const userId = req?.user?.id as string

    const data = await cetegoryService.addCategory(req.body, userId)


    sendResponse(res, {
        success: true,
        data,
        message: 'Category created successfully!',
        statusCode: statusCode.OK
    })
})


const updateCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const catId = req.params.categoryId as string

    const body = req.body

    const result = await cetegoryService.updateCategory(catId, body)


    sendResponse(res, {
        success: true,
        statusCode: statusCode.OK,
        message: '',
        data: result
    })
})


const getAllCategoryBYTypes = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const type = req.query.type as CatType || 'all'
    const searchTerm = req?.query?.searchTerm

    const options = {
        page: req.query.page,
        limit: req.query.limit,
        sortBy: req.query.sortBy,
        sortOrder: req.query.sortOrder
    };
    const data = await cetegoryService.getAllCategoryBYTypes(type, options, searchTerm as string)



    sendResponse(res, {
        data,
        message: 'Categories fetched successfully!',
        success: true,
        statusCode: statusCode.OK
    })
})


export const cetegoryController = {
    addCategory,
    updateCategory,
    getAllCategoryBYTypes
}