import {Router} from "express";
import {bearerAuthMiddleware} from "../middlewares/bearerAuthMiddleware.js";
import {userInputDtoValidation} from "../../users/validation/userInputDtoValidation.js";
import {inputValidationResult} from "../../core/middlewares/validation/inputValidationResult.js";
import {emailValidation} from "../validation/emailValidation.js";
import {refreshTokenVerifyMiddleware} from "../middlewares/refreshTokenVerifyMiddleware.js";
import {rateLimitMiddleware} from "../middlewares/rateLimitMiddleware.js";
import {passwordValidation} from "../validation/passwordValidation.js";
import {container} from "../../composition-root.js";
import { AuthController } from "./handlers/authController.js";

const authController = container.get(AuthController);

export const authRouter = Router();

authRouter.post("/login",
    rateLimitMiddleware,
    authController.loginHandler.bind(authController)
);

authRouter.post("/refresh-token",
    refreshTokenVerifyMiddleware,
    authController.refreshTokenHandler.bind(authController)
)

authRouter.post("/registration",
    rateLimitMiddleware,
    userInputDtoValidation,
    inputValidationResult,
    authController.registrationHandler.bind(authController)
)

authRouter.post("/registration-confirmation",
    rateLimitMiddleware,
    authController.registrationConfirmationHandler.bind(authController)
)

authRouter.post("/registration-email-resending",
    rateLimitMiddleware,
    emailValidation,
    inputValidationResult,
    authController.registrationEmailResendingHandler.bind(authController)
)

authRouter.post("/password-recovery",
    rateLimitMiddleware,
    emailValidation,
    inputValidationResult,
    authController.passwordRecoveryHandler.bind(authController)
)

authRouter.post("/new-password",
    rateLimitMiddleware,
    passwordValidation,
    inputValidationResult,
    authController.newPasswordHandler.bind(authController)
)

authRouter.post("/logout",
    refreshTokenVerifyMiddleware,
    authController.logoutHandler.bind(authController)
)

authRouter.get("/me",
    bearerAuthMiddleware,
    authController.getUserInfoHandler.bind(authController)
);