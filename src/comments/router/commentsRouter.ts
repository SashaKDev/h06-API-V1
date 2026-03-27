import {Router} from "express";
import {idValidation} from "../../core/middlewares/validation/paramValidation.js";
import {inputValidationResult} from "../../core/middlewares/validation/inputValidationResult.js";
import {commentInputDtoValidation} from "../validation/commentsValidation.js";
import {bearerAuthMiddleware} from "../../auth/middlewares/bearerAuthMiddleware.js";
import {CommentsController} from "./handlers/commentsController.js";
import {container} from "../../composition-root.js";

const commentsController = container.get(CommentsController);

export const commentsRouter = Router();

commentsRouter.get('/:id',
    idValidation,
    inputValidationResult,
    commentsController.getCommentById.bind(commentsController)
)

commentsRouter.put('/:id',
    bearerAuthMiddleware,
    idValidation,
    commentInputDtoValidation,
    inputValidationResult,
    commentsController.updateComment.bind(commentsController)
);

commentsRouter.delete('/:id',
    bearerAuthMiddleware,
    idValidation,
    inputValidationResult,
    commentsController.deleteComment.bind(commentsController)
)