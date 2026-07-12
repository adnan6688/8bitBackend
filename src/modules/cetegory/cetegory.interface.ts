import { CatType } from "../../../generated/prisma/enums"



export type ICetegoryPayload = {

    type : CatType,
    name : string
}

export type IUpdateCategory = {
    type? : CatType,
    name? : string,
    isDelete? : boolean
}