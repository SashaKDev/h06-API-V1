import {Router} from "express";
import {idValidation} from "../../core/middlewares/validation/paramValidation.js";
import {inputValidationResult} from "../../core/middlewares/validation/inputValidationResult.js";
import {commentInputDtoValidation} from "../validation/commentsValidation.js";
import {bearerAuthMiddleware} from "../../auth/middlewares/bearerAuthMiddleware.js";
import {CommentsController} from "./handlers/commentsController.js";
import {container} from "../../composition-root.js";
import {likeStatusInputValidation} from "../validation/likeStatusInputValidation.js";
import {lightBearerAuthMiddleware} from "../../auth/middlewares/lightBearerAuthMiddleware.js";

const commentsController = container.get(CommentsController);

export const commentsRouter = Router();

commentsRouter.get('/:id',
    lightBearerAuthMiddleware,
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

commentsRouter.put("/:id/like-status",
    bearerAuthMiddleware,
    idValidation,
    likeStatusInputValidation,
    inputValidationResult,
    commentsController.changeLikeStatus.bind(commentsController)
)

commentsRouter.delete('/:id',
    bearerAuthMiddleware,
    idValidation,
    inputValidationResult,
    commentsController.deleteComment.bind(commentsController)
)