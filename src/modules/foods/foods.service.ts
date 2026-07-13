import { prisma } from "../../lib/prisma"
import { calculatePagination } from "../../utils/calculatePegination"
import { IFood, IFoodUPdate } from "./foods.interface"

const addFoods = async (payload: IFood) => {


    const data = await prisma.food.create({
        data: {
            ...payload
        }
    })

    return data

}

const foodDetails = async (id: string) => {

    const data = await prisma.food.findUnique({
        where: {
            id
        },
        include: {
            category: {
                omit: {
                    id: true,
                    type: true,
                    isDelete: true,
                    createdAt: true,
                    createdById: true
                }
            }
       
         
        },

    })

    return data
}


const updateFoods = async (payLoad: IFoodUPdate, foodId: string) => {

    const data = await prisma.food.update({
        where: {
            id: foodId
        },
        data: {
            ...payLoad
        }
    })

    return data
}


const getFoods = async (options: any, searchTerm?: string) => {

    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options)


    let whereCondition: any = {}

    if (searchTerm) {
        const trimmedTerm = searchTerm.trim()


        whereCondition.OR = [
            {
                name: {
                    contains: trimmedTerm,
                    mode: 'insensitive'
                }
            },
            {
                short_description: {
                    contains: trimmedTerm,
                    mode: 'insensitive'
                }
            }
        ]
    }




    const [foods, total] = await prisma.$transaction([

        prisma.food.findMany({
            where: whereCondition,
            skip: skip,
            take: limit,
            orderBy: {
                [sortBy]: sortOrder
            },
            include: {
                category: {
                    omit: {

                        isDelete: true,
                        type: true,
                        id: true,
                        createdAt: true,
                        createdById: true

                    }
                }
            }

        }),

        prisma.food.count({ where: whereCondition })
    ])
    return {
        meta: {
            page,
            limit,
            total
        },
        data: foods
    };
}


export const fooodService = {
    addFoods,
    foodDetails,
    updateFoods,
    getFoods
}