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
import {refreshTokenHandler} from "./handlers/refreshTokenHandler";
import {logoutHandler} from "./handlers/logoutHandler";
import {refreshTokenVerifyMiddleware} from "../middlewares/refreshTokenVerifyMiddleware";
import {rateLimitMiddleware} from "../middlewares/rateLimitMiddleware";

export const authRouter = Router();

authRouter.post("/login",
    rateLimitMiddleware,
    loginHandler);

authRouter.post("/refresh-token",
    // refreshTokenVerifyMiddleware,
    refreshTokenHandler)

authRouter.post("/registration",
    rateLimitMiddleware,
    userInputDtoValidation,
    inputValidationResult,
    registrationHandler)

authRouter.post("/registration-confirmation",
    rateLimitMiddleware,
    registrationConfirmationHandler)

authRouter.post("/registration-email-resending",
    rateLimitMiddleware,
    emailValidation,
    inputValidationResult,
    registrationEmailResendingHandler)

authRouter.post("/logout",
    refreshTokenVerifyMiddleware,
    logoutHandler)

authRouter.get("/me",
    bearerAuthMiddleware,
    getUserInfoHandler);