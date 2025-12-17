import {Router} from "express";
import {idValidation} from "../../core/middlewares/validation/paramValidation";
import {inputValidationResult} from "../../core/middlewares/validation/inputValidationResult";
import {commentInputDtoValidation} from "../validation/commentsValidation";
import {updateCommentHandler} from "./handlers/updateCommentHandler";
import {deleteCommentHandler} from "./handlers/deleteCommentHandler";
import {getCommentByIdHandler} from "./handlers/getCommentByIdHandler";
import {bearerAuthMiddleware} from "../../auth/middlewares/bearerAuthMiddleware";

export const commentsRouter = Router();

commentsRouter.get('/:id',
//     bearer auth
    idValidation,
    inputValidationResult,
    getCommentByIdHandler
)

commentsRouter.put('/:id',
    bearerAuthMiddleware,
    idValidation,
    commentInputDtoValidation,
    inputValidationResult,
    updateCommentHandler
);

commentsRouter.delete('/:id',
    bearerAuthMiddleware,
    idValidation,
    inputValidationResult,
    deleteCommentHandler
)