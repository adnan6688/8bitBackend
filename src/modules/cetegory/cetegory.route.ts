import { Router } from "express";
import { cetegoryController } from "./cetegory.controller";
import { auth } from "../../middleware/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { categoryZodSchema, updateCateogryZodSchema } from "./cetegory.validation";



const route = Router()


route.post('/addCategory', auth(UserRole.ADMIN, UserRole.SUB_ADMIN), validateRequest(categoryZodSchema), cetegoryController.addCategory)

route.get('/getCategories' , cetegoryController.getAllCategoryBYTypes)

route.patch('/updateCategory/:categoryId' , validateRequest(updateCateogryZodSchema) , auth(UserRole.ADMIN,UserRole.SUB_ADMIN) , cetegoryController.updateCategory)


export const categoryRoutes = route