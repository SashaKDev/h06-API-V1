import {Router} from "express";
import {loginHandler} from "./handlers/loginHandler";
import {getUserInfoHandler} from "./handlers/getUserInfoHandler";
import {bearerAuthMiddleware} from "../middlewares/bearerAuthMiddleware";
import {registrationHandler} from "./handlers/registrationHandler";
import {userInputDtoValidation} from "../../users/validation/userInputDtoValidation";
import {registrationConfirmationHandler} from "./handlers/registrationConfirmationHandler";

export const authRouter = Router();

authRouter.post("/login", loginHandler);
authRouter.post("/registration",
    userInputDtoValidation,
    registrationHandler)
authRouter.post("/registration-confirmation", registrationConfirmationHandler)
authRouter.get("/me",
    bearerAuthMiddleware,
    getUserInfoHandler);