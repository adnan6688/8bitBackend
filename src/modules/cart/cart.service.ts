import { prisma } from "../../lib/prisma";

const cartItemAddedService = async (payLoad: { foodId: string; quantity: number }, userId: string) => {


    let cart = await prisma.cart.findUnique({
        where: { userId: userId },
    });

    if (!cart) {
        cart = await prisma.cart.create({
            data: { userId: userId },
        });
    }


    const existingCartItem = await prisma.cartITem.findFirst({
        where: {
            cartId: cart.id,
            foodId: payLoad.foodId,
        },
    });

    if (existingCartItem) {

        await prisma.cartITem.update({
            where: { id: existingCartItem.id },
            data: {
                quantity: existingCartItem.quantity as number + Number(payLoad.quantity),
            },
        });
    } else {

        await prisma.cartITem.create({
            data: {
                cartId: cart.id,
                foodId: payLoad.foodId,
                quantity: Number(payLoad.quantity),
            },
        });
    }

    return true;
};


const myCart = async (userId: string) => {




    const data = await prisma.cart.findMany({
        where: {
            userId: userId
        },
        include: {
            CartItems: {
                include: {
                    food: {
                        omit: {
                            createdById: true,
                            categoryId: true,
                            createdAt: true,
                            updatedAt: true
                        },


                    }
                }
            },
            user: {
                omit: {
                    password: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true,
                    publicId: true,
                    isVerified: true
                }
            }
        },
        omit: {
            userId: true
        }
    })

    return data


}

const removeItemFromCart = async (userId: string, itemId: string) => {

    const cart = await prisma.cart.findUnique({
        where: {
            userId: userId
        }
    });

    if (!cart) {
        throw new Error('Your cart was not found!');
    }


    const ckItem = await prisma.cartITem.findFirst({
        where: {
            id: itemId,
            cartId: cart.id
        }
    });

    if (!ckItem) {
        throw new Error('This item was not found in your cart!');
    }


    await prisma.cartITem.delete({
        where: {
            id: itemId
        }
    });

    return true;
};



export const cartService = {
    cartItemAddedService,
    myCart,
    removeItemFromCart
}