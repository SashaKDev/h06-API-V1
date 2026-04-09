import {Request, Response, NextFunction} from "express";
import {jwtService} from "../../adapters/jwtService.js";

export const lightBearerAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const auth = req.headers['authorization'] as string;
    if (auth === undefined) {

        next();
        return;
    }

    const authType = auth.split(' ')[0];
    const authToken = auth.split(' ')[1];

    const tokenVerifyResult = await jwtService.verifyJWT(authToken);

    if (!tokenVerifyResult) {
        res.sendStatus(401);
        return;
    }
    req.userId = tokenVerifyResult
    next();
}