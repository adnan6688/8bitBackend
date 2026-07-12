import { prisma } from "../../lib/prisma"
import { calculatePagination } from "../../utils/calculatePegination"
import { IGamePayload } from "./games.interface"


const addGames = async (payload: IGamePayload) => {

    const { schedules, ...gameFields } = payload

    // game_schedule 
    const transection = await prisma.$transaction(async (tx) => {


        const game = await tx.game.create({
            data: {
                ...gameFields,
                schedules: {
                    createMany: {
                        data: schedules
                    }
                }
            },
            include: {
                schedules: true
            }
        })

        return game


    })
    return transection
}


const updatedGames = async () => {

}

const gamesDetails = async (id: string) => {


    const ckgame = await prisma.game.findUnique({
        where: {
            id
        },
        include: {
            schedules: true
        }
    })

    if (!ckgame) {
        throw new Error('This game not found!')
    }

    return ckgame
}

const allGames = async (options: any, searchTerm?: string) => {


    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options)


    let whereCondition: any = {}



    if (searchTerm) {
        const trimmedTerm = searchTerm.trim();

        whereCondition.OR = [
            {
                name: {
                    contains: trimmedTerm,
                    mode: 'insensitive'
                }
            },
            {
                description: {
                    contains: trimmedTerm,
                    mode: 'insensitive'
                }
            }
        ];
    }


    const [gameData, total] = await prisma.$transaction([

        prisma.game.findMany({
            where: whereCondition,
            skip: skip,
            take: limit,
            orderBy: {
                [sortBy]: sortOrder
            },

        })

        ,
        prisma.game.count({ where: whereCondition })

    ])

    return {
        meta: {
            page,
            limit,
            total
        },
        data: gameData
    };
}


export const gameService = {
    addGames,
    updatedGames,
    gamesDetails,
    allGames
}