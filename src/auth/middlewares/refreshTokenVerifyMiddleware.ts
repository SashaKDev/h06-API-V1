import {Request, Response, NextFunction} from "express";
import {jwtService} from "../../adapters/jwtService";
import jwt, {JwtPayload} from "jsonwebtoken";
import {sessionsCollection} from "../../db/mongo.db";

export const refreshTokenVerifyMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const refreshToken = req.cookies.refreshToken;
    const payload = await jwtService.verifyRefreshToken(refreshToken);
    if (!payload) {
        console.log(1)
        res.sendStatus(401);
        return;
    }

    const userId = payload.userId;
    const deviceId = payload.deviceId;

    const session = await sessionsCollection.findOne({userId: userId, deviceId: deviceId});
    if (!session) {
        console.log(2)
        res.sendStatus(401);
        return;
    }

    const iat = (jwt.decode(refreshToken) as JwtPayload).iat as number;
    if (iat !== session.iat) {
        console.log(3)
        res.sendStatus(401);
        return;
    }

    next();

}