import { prisma } from "../../lib/prisma"
import { IFood } from "./foods.interface"

const addFoods = async (payload: IFood) => {


    const data = await prisma.food.create({
        data: {
            ...payload
        }
    })

    return data

}

const foodDetails = async (id: string) => {

}


const updateFoods = async () => {

}

const getFoods = async () => {


}


export const fooodService = {
    addFoods,
    foodDetails,
    updateFoods,
    getFoods
}