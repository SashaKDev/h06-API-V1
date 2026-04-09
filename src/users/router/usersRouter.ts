import {Router} from "express";
import {basicAuthMiddleware} from "../../auth/middlewares/basicAuthMiddleware.js";
import {userInputDtoValidation} from "../validation/userInputDtoValidation.js";
import {idValidation} from "../../core/middlewares/validation/paramValidation.js";
import {inputValidationResult} from "../../core/middlewares/validation/inputValidationResult.js";

import {
    paginationAndSortingInputValidation
} from "../../core/middlewares/validation/paginatoinAndSortingInputValidation.js";
import {container} from "../../composition-root.js";
import {UsersController} from "./handlers/usersController.js";


const usersController = container.get(UsersController)

export const usersRouter = Router({});

usersRouter.get('/',
    // basicAuthMiddleware,
    paginationAndSortingInputValidation,
    inputValidationResult,
    usersController.getAllUsers.bind(usersController)
);

usersRouter.post('/',
    // basicAuthMiddleware,
    userInputDtoValidation,
    inputValidationResult,
    usersController.createUser.bind(usersController)
);

usersRouter.delete('/:id',
    // basicAuthMiddleware,
    idValidation,
    inputValidationResult,
    usersController.deleteUser.bind(usersController)
);