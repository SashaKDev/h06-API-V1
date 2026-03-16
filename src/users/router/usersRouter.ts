import {Router} from "express";
import {basicAuthMiddleware} from "../../auth/middlewares/basicAuthMiddleware";
import {userInputDtoValidation} from "../validation/userInputDtoValidation";
import {idValidation} from "../../core/middlewares/validation/paramValidation";
import {inputValidationResult} from "../../core/middlewares/validation/inputValidationResult";

import {
    paginationAndSortingInputValidation
} from "../../core/middlewares/validation/paginatoinAndSortingInputValidation";
import {usersController} from "./composition-root";

export const usersRouter = Router({});

usersRouter.get('/',
    basicAuthMiddleware,
    paginationAndSortingInputValidation,
    inputValidationResult,
    usersController.getAllUsers.bind(usersController)
);

usersRouter.post('/',
    basicAuthMiddleware,
    userInputDtoValidation,
    inputValidationResult,
    usersController.createUser.bind(usersController)
);

usersRouter.delete('/:id',
    basicAuthMiddleware,
    idValidation,
    inputValidationResult,
    usersController.deleteUser.bind(usersController)
);