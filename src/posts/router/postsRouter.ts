import {Router} from "express";
import {basicAuthMiddleware} from "../../auth/middlewares/basicAuthMiddleware";
import {postInputDtoValidation} from "../validation/postInputDtoValidation";
import {inputValidationResult} from "../../core/middlewares/validation/inputValidationResult";
import {idValidation} from "../../core/middlewares/validation/paramValidation";
import {getAllPostsHandler} from "./handlers/getAllPostsHandler";
import {getPostHandler} from "./handlers/getPostHandler";
import {createPostHandler} from "./handlers/createPostHandler";
import {updatePostHandler} from "./handlers/updatePostHandler";
import {deletePostHandler} from "./handlers/deletePostHandler";
import {
    paginationAndSortingInputValidation
} from "../../core/middlewares/validation/paginatoinAndSortingInputValidation";

export const postsRouter = Router({});

postsRouter.get('/',
    paginationAndSortingInputValidation,
    inputValidationResult,
    getAllPostsHandler);

postsRouter.get('/:id', getPostHandler);

postsRouter.post('/',
    basicAuthMiddleware,
    postInputDtoValidation,
    inputValidationResult,
    createPostHandler
);

postsRouter.put('/:id',
    basicAuthMiddleware,
    idValidation,
    postInputDtoValidation,
    inputValidationResult,
    updatePostHandler
);

postsRouter.delete('/:id',
    basicAuthMiddleware,
    idValidation,
    inputValidationResult,
    deletePostHandler
);