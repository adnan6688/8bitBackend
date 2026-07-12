import { UserRole } from "../../generated/prisma/enums"
import config from "../config"
import { jwtUtils } from "./jwt"

type PayLoadForJwt = {
    id: string,
    role: UserRole,
    email: string,
    name: string
}


export const getTokens = (payload: PayLoadForJwt) => {

    const accessToken = jwtUtils.createToken(payload, config.jwt_access_secret as string, config.jwt_access_expires as string)
    const refreshToken = jwtUtils.createToken(payload, config.jwt_refresh_secret as string, config.jwt_refresh_expires as string)

    return {
        accessToken,
        refreshToken
    }
}