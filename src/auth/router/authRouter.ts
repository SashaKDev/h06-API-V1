import {Router} from "express";
import {loginHandler} from "./handlers/loginHandler";
import {getUserInfoHandler} from "./handlers/getUserInfoHandler";
import {bearerAuthMiddleware} from "../middlewares/bearerAuthMiddleware";
import {registrationHandler} from "./handlers/registrationHandler";
import {userInputDtoValidation} from "../../users/validation/userInputDtoValidation";
import {registrationConfirmationHandler} from "./handlers/registrationConfirmationHandler";
import {registrationEmailResendingHandler} from "./handlers/registrationEmailResendingHandler";
import {inputValidationResult} from "../../core/middlewares/validation/inputValidationResult";
import {emailValidation} from "../validation/emailValidation";

export const authRouter = Router();

authRouter.post("/login",
    loginHandler);

authRouter.post("/registration",
    userInputDtoValidation,
    inputValidationResult,
    registrationHandler)

authRouter.post("/registration-confirmation",
    registrationConfirmationHandler)

authRouter.post("/registration-email-resending",
    emailValidation,
    inputValidationResult,
    registrationEmailResendingHandler)

authRouter.get("/me",
    bearerAuthMiddleware,
    getUserInfoHandler);