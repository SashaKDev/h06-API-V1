import {Router} from "express";
import {basicAuthMiddleware} from "../../auth/middlewares/basicAuthMiddleware.js";
import {postInputDtoValidation} from "../validation/postInputDtoValidation.js";
import {inputValidationResult} from "../../core/middlewares/validation/inputValidationResult.js";
import {idValidation} from "../../core/middlewares/validation/paramValidation.js";
import {
    paginationAndSortingInputValidation
} from "../../core/middlewares/validation/paginatoinAndSortingInputValidation.js";
import {commentInputDtoValidation} from "../../comments/validation/commentsValidation.js";
import {bearerAuthMiddleware} from "../../auth/middlewares/bearerAuthMiddleware.js";
import {PostsController} from "./handlers/postsController.js";
import {container} from "../../composition-root.js";

const postsController = container.get(PostsController);

export const postsRouter = Router({});

postsRouter.get('/',
    paginationAndSortingInputValidation,
    inputValidationResult,
    postsController.getAllPosts.bind(postsController)
);

postsRouter.get('/:id', postsController.getPost.bind(postsController));

postsRouter.post('/',
    basicAuthMiddleware,
    postInputDtoValidation,
    inputValidationResult,
    postsController.createPost.bind(postsController)
);

postsRouter.put('/:id',
    basicAuthMiddleware,
    idValidation,
    postInputDtoValidation,
    inputValidationResult,
    postsController.updatePost.bind(postsController)
);

postsRouter.delete('/:id',
    basicAuthMiddleware,
    idValidation,
    inputValidationResult,
    postsController.deletePost.bind(postsController)
);

postsRouter.post('/:id/comments',
    bearerAuthMiddleware,
    idValidation,
    commentInputDtoValidation,
    inputValidationResult,
    postsController.createCommentForPost.bind(postsController)
)

postsRouter.get('/:id/comments',
    idValidation,
    paginationAndSortingInputValidation,
    // commentInputDtoValidation,
    inputValidationResult,
    postsController.getCommentsForPost.bind(postsController)
)