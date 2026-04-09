import {Router} from "express";
import {blogsInputDtoValidation} from "../validation/blogsInputDtoValidation.js";
import {inputValidationResult} from "../../core/middlewares/validation/inputValidationResult.js";
import {basicAuthMiddleware} from "../../auth/middlewares/basicAuthMiddleware.js";
import {idValidation} from "../../core/middlewares/validation/paramValidation.js";
import {
    paginationAndSortingInputValidation
} from "../../core/middlewares/validation/paginatoinAndSortingInputValidation.js";
import {postInputDtoValidation} from "../../posts/validation/postInputDtoValidation.js";
import {BlogsController} from "./handlers/blogsController.js";
import {container} from "../../composition-root.js";

const blogsController = container.get(BlogsController);

export const blogsRouter = Router({});

blogsRouter.get('/',
    paginationAndSortingInputValidation,
    inputValidationResult,
    blogsController.getAllBlogs.bind(blogsController)
);

blogsRouter.get('/:id',
    idValidation,
    inputValidationResult,
    blogsController.getBlog.bind(blogsController)
);

blogsRouter.get('/:id/posts',
    idValidation,
    paginationAndSortingInputValidation,
    inputValidationResult,
    blogsController.getBlogPosts.bind(blogsController)
);

blogsRouter.post('/',
    // basicAuthMiddleware,
    blogsInputDtoValidation,
    inputValidationResult,
    blogsController.createBlog.bind(blogsController)
);
blogsRouter.post('/:id/posts',
    basicAuthMiddleware,
    idValidation,
    postInputDtoValidation,
    inputValidationResult,
    blogsController.createPostForBlog.bind(blogsController)
);


blogsRouter.put('/:id',
    // basicAuthMiddleware,
    idValidation,
    blogsInputDtoValidation,
    inputValidationResult,
    blogsController.updateBlog.bind(blogsController)
);

blogsRouter.delete('/:id',
    // basicAuthMiddleware,
    idValidation,
    inputValidationResult,
    blogsController.deleteBlog.bind(blogsController)
);