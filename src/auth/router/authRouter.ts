import {Router} from "express";
import {authHandler} from "./handlers/authHandler";

export const authRouter = Router();

authRouter.post('/login', authHandler)