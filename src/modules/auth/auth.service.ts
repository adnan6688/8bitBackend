import { prisma } from "../../lib/prisma"
import { TLoginPayload } from "./auth.interface"
import bcrypt from 'bcrypt'





const login = async (payload: TLoginPayload) => {

    const { email, password } = payload
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })

    
    if (!user) {
        throw new Error('User not found with this email address!')
    }

    const ckPass = await bcrypt.compare(password, user.password)

    if (!ckPass) {
        throw new Error("Password doesn't match!")
    }

    return user
}


export const authService = {
    login
}