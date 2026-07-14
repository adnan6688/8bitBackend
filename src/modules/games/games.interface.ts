import { GameStatus, WeekDay } from "../../../generated/prisma/enums";

export type IGamePayload = {
    name: string;
    

    price30Min: number;
    price60Min: number;
    
    images: string[];
    description: string;
    status: GameStatus;
    isDiscount?: boolean;
    disCountParcenTage?: number;
 
    
    categoryId: string;
    createdById: string; 

    schedules: { day: WeekDay; openTime: string; endTime: string }[];
}