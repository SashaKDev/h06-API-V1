import {Request, Response} from "express";
import jwt from "jsonwebtoken";
import {sessionsCollection} from "../../../db/mongo.db";

export const deleteAllOtherSessionsHandler = async (req: Request, res: Response) => {

    const refreshToken = req.cookies.refreshToken;
    const payload = jwt.decode(refreshToken) as {userId: string, deviceId: string};
    const userId = payload.userId;
    const deviceId = payload.deviceId;

    await sessionsCollection.deleteMany({userId: userId, deviceId: {$ne: deviceId}});

    res.sendStatus(204);

}