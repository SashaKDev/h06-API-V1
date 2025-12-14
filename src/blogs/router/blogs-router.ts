import {Router} from "express";
import {blogsInputDtoValidation} from "../validation/blogsInputDtoValidation";
import {inputValidationResult} from "../../core/middlewares/validation/inputValidationResult";
import {basicAuthMiddleware} from "../../auth/middlewares/basicAuthMiddleware";
import {idValidation} from "../../core/middlewares/validation/paramValidation";
import {deleteBlogHandler} from "./handlers/deleteBlogHandler";
import {updateBlogHandler} from "./handlers/updateBlogHandler";
import {createBlogHandler} from "./handlers/createBlogHandler";
import {getBlogHandler} from "./handlers/getBlogHandler";
import {getAllBlogsHandler} from "./handlers/getAllBlogsHandler";
import {
    paginationAndSortingInputValidation
} from "../../core/middlewares/validation/paginatoinAndSortingInputValidation";
import {getBlogPostsHandler} from "./handlers/getBlogPostsHandler";
import {createPostForBlogHandler} from "./handlers/createPostForBlogHandler";
import {postInputDtoValidation} from "../../posts/validation/postInputDtoValidation";

export const blogsRouter = Router({});

blogsRouter.get('/',
    paginationAndSortingInputValidation,
    inputValidationResult,
    getAllBlogsHandler
);

blogsRouter.get('/:id',
    idValidation,
    inputValidationResult,
    getBlogHandler
);

blogsRouter.get('/:id/posts',
    idValidation,
    paginationAndSortingInputValidation,
    inputValidationResult,
    getBlogPostsHandler
);

blogsRouter.post('/',
    basicAuthMiddleware,
    blogsInputDtoValidation,
    inputValidationResult,
    createBlogHandler
);
blogsRouter.post('/:id/posts',
    basicAuthMiddleware,
    idValidation,
    postInputDtoValidation,
    inputValidationResult,
    createPostForBlogHandler
);


blogsRouter.put('/:id',
    basicAuthMiddleware,
    idValidation,
    blogsInputDtoValidation,
    inputValidationResult,
    updateBlogHandler
);

blogsRouter.delete('/:id',
    basicAuthMiddleware,
    idValidation,
    inputValidationResult,
    deleteBlogHandler
);