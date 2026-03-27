import express, {Request, Response} from "express";
import {
    AUTH_PATH,
    BLOGS_PATH,
    COMMENTS_PATH,
    POSTS_PATH,
    SECURITY_DEVICES_PATH,
    TESTING_PATH,
    USERS_PATH
} from "./core/paths/paths.js";
import {blogsRouter} from "./blogs/router/blogs-router.js";
import {testingRouter} from "./testing/router/testing-router.js";
import {postsRouter} from "./posts/router/postsRouter.js";
import {usersRouter} from "./users/router/usersRouter.js";
import {authRouter} from "./auth/router/authRouter.js";
import {commentsRouter} from "./comments/router/commentsRouter.js";
import cookieParser from "cookie-parser";
import {securityDevicesRouter} from "./securityDevices/router/securityDevicesRouter.js";


export const setupApp = () => {
    const app = express();
    app.use(express.json());
    app.use(cookieParser());

    app.set('trust proxy', true)

    app.get('/', (req: Request, res: Response) => {
        console.log(1)
        res.json({message: 'Hello World!'});
    })
    app.use(BLOGS_PATH, blogsRouter);
    app.use(POSTS_PATH, postsRouter);
    app.use(USERS_PATH, usersRouter);
    app.use(AUTH_PATH, authRouter)
    app.use(TESTING_PATH, testingRouter);
    app.use(COMMENTS_PATH, commentsRouter);
    app.use(SECURITY_DEVICES_PATH, securityDevicesRouter);

    return app;
}

