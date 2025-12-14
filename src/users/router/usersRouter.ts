import {Router} from "express";
import {basicAuthMiddleware} from "../../auth/middlewares/basicAuthMiddleware";
import {userInputDtoValidation} from "../validation/userInputDtoValidation";
import {idValidation} from "../../core/middlewares/validation/paramValidation";
import {inputValidationResult} from "../../core/middlewares/validation/inputValidationResult";
import {createUserHandler} from "./handlers/createUserHandler";
import {deleteUserHandler} from "./handlers/deleteUserHandler";
import {
    paginationAndSortingInputValidation
} from "../../core/middlewares/validation/paginatoinAndSortingInputValidation";
import {getAllUsersHandler} from "./handlers/getAllUsersHandler";

export const usersRouter = Router({});

usersRouter.get('/',
    basicAuthMiddleware,
    paginationAndSortingInputValidation,
    inputValidationResult,
    getAllUsersHandler
);

usersRouter.post('/',
    basicAuthMiddleware,
    userInputDtoValidation,
    inputValidationResult,
    createUserHandler
);

usersRouter.delete('/:id',
    basicAuthMiddleware,
    idValidation,
    inputValidationResult,
    deleteUserHandler
);