import {Request, Response, NextFunction} from 'express';
import {SETTINGS} from "../../core/settings/settings";

export const basicAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const auth = req.headers['authorization'] as string;

    if (!auth) {
        res.sendStatus(401);
        return;
    }
    const authType = auth.split(' ')[0];
    const authToken = auth.split(' ')[1];

    if (authType !== 'Basic') {
        res.sendStatus(401);
        return;
    }

    const credentials = Buffer.from(authToken, 'base64').toString('utf-8');
    const username = credentials.split(':')[0];
    const password = credentials.split(':')[1];

    if (username !== SETTINGS.USERNAME || password !== SETTINGS.PASSWORD) {
        res.sendStatus(401);
        return;
    }
    next();
}