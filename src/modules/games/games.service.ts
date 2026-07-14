import { prisma } from "../../lib/prisma"
import { calculatePagination } from "../../utils/calculatePegination"
import { IGamePayload } from "./games.interface"


const addGames = async (payload: IGamePayload) => {

    const { schedules, ...gameFields } = payload;

    const transaction = await prisma.$transaction(async (tx) => {
        const game = await tx.game.create({
            data: {
                name: gameFields.name,
                price30Min: gameFields.price30Min, 
                price60Min: gameFields.price60Min,
                description: gameFields.description,
                categoryId: gameFields.categoryId,
                createdById: gameFields.createdById,
                images: gameFields.images,
                status: gameFields.status,
                isDiscount: gameFields.isDiscount || false,
                disCountParcenTage: gameFields.disCountParcenTage || null,
                
            
                schedules: {
                    createMany: {
                        data: schedules 
                    }
                }
            },
            include: {
                schedules: true 
            }
        });

        return game;
    });

    return transaction;
};



const updateGamesNew = async (payLoad: any, gameId: string) => {
    const { schedules, ...gameData } = payLoad;

    const result = await prisma.$transaction(async (tx) => {

        if (schedules && Array.isArray(schedules)) {
            // ১. ইনকামিং রিকোয়েস্টে কোন কোন দিন (Days) পাঠানো হয়েছে তাদের একটা লিস্ট বের করি
            // উদাহরণ: ['FRIDAY']
            const incomingDays = schedules.map(s => s.day);

            // ২. যে দিনগুলো এই ইনকামিং লিস্টে নাই, ডাটাবেজ থেকে সেগুলোকে একবারে ডিলিট করে দাও!
            await tx.gameSchedule.deleteMany({
                where: {
                    gameId: gameId,
                    day: {
                        notIn: incomingDays // ইনকামিং লিস্টের বাইরের সব দিন মুছে যাবে
                    }
                }
            });

            // ৩. এবার বাকি দিনগুলোর জন্য লুপ চালিয়ে আপডেট বা ক্রিয়েট (Upsert) করা
            for (const schedule of schedules) {
                // ডাটাবেজে এই দিনটি অলরেডি আছে কিনা চেক করা
                const existingDaySchedule = await tx.gameSchedule.findFirst({
                    where: {
                        gameId: gameId,
                        day: schedule.day
                    }
                });

                if (existingDaySchedule) {
                    // দিনটি থাকলে শুধু টাইম আপডেট হবে
                    await tx.gameSchedule.update({
                        where: { id: existingDaySchedule.id },
                        data: {
                            openTime: schedule.openTime,
                            endTime: schedule.endTime
                        }
                    });
                } else {
                    // দিনটি না থাকলে নতুন করে ক্রিয়েট হবে
                    await tx.gameSchedule.create({
                        data: {
                            gameId: gameId,
                            day: schedule.day,
                            openTime: schedule.openTime,
                            endTime: schedule.endTime
                        }
                    });
                }
            }
        }


        const updatedGame = await tx.game.update({
            where: { id: gameId },
            data: { ...gameData },
            include: { schedules: true }
        });

        return updatedGame;
    });

    return result;
};

const gamesDetails = async (id: string) => {
    const ckgame = await prisma.game.findUnique({
        where: {
            id
        },
        include: {
            schedules: true
        }
    });

    if (!ckgame) {
        throw new Error('This game not found!');
    }

  
    const gameData = { ...ckgame };


    if (gameData.isDiscount && gameData.disCountParcenTage && gameData.disCountParcenTage > 0) {
        const percentage = gameData.disCountParcenTage;


        const discountPrice30Min = gameData.price30Min - (gameData.price30Min * percentage / 100);
        const discountPrice60Min = gameData.price60Min - (gameData.price60Min * percentage / 100);


        return {
            ...gameData,
            discountPrice30Min: Number(discountPrice30Min.toFixed(2)), 
            discountPrice60Min: Number(discountPrice60Min.toFixed(2))
        };
    }

    
    return gameData;
};

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

            include: {
                category: {
                    omit: {
                        id: true,
                        isDelete: true,
                        type: true,
                        createdAt: true,
                        createdById: true
                    }
                },
                schedules: {
                    omit: {
                        gameId: true
                    }
                }
            }

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
    updateGamesNew,
    gamesDetails,
    allGames
}