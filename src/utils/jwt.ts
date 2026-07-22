

import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken'

const createToken = (payload: JwtPayload, secret: string, expiresIn: string) => {

    const token = jwt.sign(payload, secret, {
        expiresIn: expiresIn
    } as SignOptions)

    return token
}


const verifyToken = (token: string, secret: string) => {
    try {
        const verifiedResult = jwt.verify(token, secret)
        return {
            success: true,
            data: verifiedResult
        }
    } catch (err: any) {
        return {
            success: false,
            error: err.message
        }
    }
}

export const jwtUtils = {
    createToken,
    verifyToken
}