import { Router } from "express";
import { auth } from "../../middleware/checkAuth";
import { UserRole } from "../../../generated/prisma/enums";
import { validateRequest } from "../../middleware/validateRequest";
import { addGameZodSchema, updateGameZodSchema } from "./games.validation";
import { gameController } from "./games.controller";
import { upload } from "../../config/cloudinaryConfig";




const route = Router()

route.post('/addGame', auth(UserRole.ADMIN, UserRole.SUB_ADMIN), upload.array("images"), validateRequest(addGameZodSchema), gameController.addGames)
route.get('/gameDetails/:gameId', auth(...Object.values(UserRole)), gameController.gamesDetails)

route.get('/', gameController.allGames)

route.patch('/updateGame/:gameId' , auth(UserRole.ADMIN,UserRole.SUB_ADMIN) , upload.array("images") , validateRequest(updateGameZodSchema) , gameController.updateGames)

export const gamesRoute = route