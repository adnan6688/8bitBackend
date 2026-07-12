

export type userPayload = {
    phone: string,
    password: string,
    email: string,
    lastName: string,
    firstName: string,
    image?: string
}

export type TUpdatePayload = {
    firstName?: string,
    lastName?: string,
    phone?: string,
    image?: string,
    id: string
}