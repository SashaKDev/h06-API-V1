import {Router} from "express";
import {authHandler} from "./handlers/authHandler";
import {getUserInfoHandler} from "./handlers/getUserInfoHandler";
import {bearerAuthMiddleware} from "../middlewares/bearerAuthMiddleware";

export const authRouter = Router();

authRouter.post('/login', authHandler);
authRouter.get('/me',
    bearerAuthMiddleware,
    getUserInfoHandler);