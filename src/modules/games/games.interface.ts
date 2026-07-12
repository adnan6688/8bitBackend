import { GameStatus, WeekDay } from "../../../generated/prisma/enums"



export type IGamePayload = {
    name: string,
    price: number,
    images: string[],
    description: string,
    status: GameStatus,
    isDiscount?: boolean,
    disCountParcenTage?: number,
    categoryId: string,
    createdById: string, 
    disCountPrice :number,

   schedules: { day: WeekDay; openTime: string; endTime: string }[];
}

