

export interface IFood {
    name: string,
    price: number,
    images: string[],
    delivery_time: number,
    delivery_fee: number,
    short_description: string,

    isDisCount?: boolean,
    disCountParcentage?: number,
    disCountPrice?: number,

    createdById: string,
    categoryId: string

}