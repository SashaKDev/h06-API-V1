import {Request, Response, NextFunction} from "express";
import {jwtService} from "../../adapters/jwtService";

export const bearerAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const auth = req.headers['authorization'] as string;
    if (!auth) {
        res.sendStatus(401);
        return;
    }

    const authType = auth.split(' ')[0];
    const authToken = auth.split(' ')[1];

    if (authType !== 'Bearer') {
        res.sendStatus(401);
        return;
    }

    const tokenVerifyResult = await jwtService.verifyJWT(authToken);
    req.userId = tokenVerifyResult
    if (!tokenVerifyResult) {
        res.sendStatus(401);
        return;
    }
    next();
}