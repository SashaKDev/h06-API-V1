import express, {Request, Response} from "express";
import {
    AUTH_PATH,
    BLOGS_PATH,
    COMMENTS_PATH,
    POSTS_PATH,
    SECURITY_DEVICES_PATH,
    TESTING_PATH,
    USERS_PATH
} from "./core/paths/paths";
import {blogsRouter} from "./blogs/router/blogs-router";
import {testingRouter} from "./testing/router/testing-router";
import {postsRouter} from "./posts/router/postsRouter";
import {usersRouter} from "./users/router/usersRouter";
import {authRouter} from "./auth/router/authRouter";
import {commentsRouter} from "./comments/router/commentsRouter";
import cookieParser from "cookie-parser";
import {securityDevicesRouter} from "./securityDevices/router/securityDevicesRouter";


export const setupApp = () => {
    const app = express();
    app.use(express.json());
    app.use(cookieParser());

    app.set('trust proxy', true)

    app.get('/', (req: Request, res: Response) => {
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