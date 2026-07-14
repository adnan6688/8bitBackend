

import config from "../../config"
import { prisma } from "../../lib/prisma"
import { TUpdatePayload, userPayload } from "./user.interface"
import bcrypt from 'bcrypt'


const createUser = async (payload: userPayload) => {

    const { email, image, firstName, lastName, password, phone } = payload
    const user = await prisma.user.findUnique({
        where: {
            email
        },
        omit: {
            password: true
        }
    })


    if (user) {
        throw new Error('User account already exists with this email address')
    }


    const hashPass = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds))
    const result = await prisma.user.create({
        data: {
            email,
            firstName,
            lastName, image,
            phone,
            password: hashPass
        }
    })
    return result
}



const getMe = async (id: string, email: string) => {

    const user = await prisma.user.findUnique({
        where: {
            email,
            id
        },
        omit: {
            password: true
        }
    })

    return user
}



const updateUser = async (updatePayload: TUpdatePayload) => {

    const { id } = updatePayload

    const user = await prisma.user.update({
        where: {
            id: id
        },
        data: {
            ...updatePayload
        },
        omit: {
            password: true,
            publicId: true
        }
    })



    return user

}

const getAllUser = async () => {

}


export const userService = {
    createUser,
    getMe,
    updateUser,
    getAllUser
}