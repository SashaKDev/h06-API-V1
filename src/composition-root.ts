import 'reflect-metadata';
import { Container } from 'inversify';
import {UsersRepository} from "./users/repository/usersRepository.js";
import {UsersQueryRepository} from "./users/repository/usersQueryRepository.js";
import {UsersService} from "./users/application/usersService.js";
import {UsersController} from "./users/router/handlers/usersController.js";
import {AuthController} from "./auth/router/handlers/authController.js";
import {AuthService} from "./adapters/authService.js";
import {MailService} from "./adapters/mailService.js";
import {CommentsService} from "./comments/application/commentsService.js";
import {CommentsQueryRepository} from "./comments/repositories/commentsQueryRepository.js";
import {CommentsRepository} from "./comments/repositories/commentsRepository.js";
import {CommentsController} from "./comments/router/handlers/commentsController.js";
import {PostsQueryRepository} from "./posts/repositories/postsQueryRepository.js";
import {PostsRepository} from "./posts/repositories/postsRepository.js";
import {PostsService} from "./posts/application/postsService.js";
import {PostsController} from "./posts/router/handlers/postsController.js";
import {BlogsRepository} from "./blogs/repositories/blogsRepository.js";
import {BlogsQueryRepository} from "./blogs/repositories/blogsQueryRepository.js";
import {BlogsService} from "./blogs/application/blogsService.js";
import {BlogsController} from "./blogs/router/handlers/blogsController.js";
import {PostsLikesRepository} from "./posts/postsLikes/postsLikesRepository.js";

// export const usersRepository = new UsersRepository();
// export const usersQueryRepository = new UsersQueryRepository();
//
// export const usersService = new UsersService(usersRepository);
// export const mailService = new MailService()
// export const authService = new AuthService(mailService)
//
// export const usersController = new UsersController(usersService, usersQueryRepository);
// export const authController = new AuthController(usersQueryRepository, authService);

export const container = new Container();

container.bind(UsersRepository).to(UsersRepository);
container.bind(UsersQueryRepository).to(UsersQueryRepository);
container.bind(UsersService).to(UsersService);
container.bind(UsersController).to(UsersController);

container.bind(BlogsRepository).to(BlogsRepository);
container.bind(BlogsQueryRepository).to(BlogsQueryRepository);
container.bind(BlogsService).to(BlogsService);
container.bind(BlogsController).to(BlogsController);

container.bind(PostsQueryRepository).to(PostsQueryRepository);
container.bind(PostsRepository).to(PostsRepository);
container.bind(PostsLikesRepository).to(PostsLikesRepository);
container.bind(PostsService).to(PostsService);
container.bind(PostsController).to(PostsController);

container.bind(CommentsQueryRepository).to(CommentsQueryRepository);
container.bind(CommentsRepository).to(CommentsRepository);
container.bind(CommentsService).to(CommentsService)
container.bind(CommentsController).to(CommentsController);

container.bind(AuthService).to(AuthService);
container.bind(AuthController).to(AuthController);

container.bind(MailService).to(MailService);




