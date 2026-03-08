import {Request, Response} from "express";
import {sessionsCollection} from "../../../db/mongo.db";
import jwt from "jsonwebtoken";

export const logoutHandler = async (req: Request, res: Response) => {

    const oldRefreshToken = req.cookies.refreshToken;

    const {userId, deviceId} = jwt.decode(oldRefreshToken) as {userId: string, deviceId: string};

    await sessionsCollection.deleteOne({userId: userId, deviceId: deviceId});

    res.sendStatus(204);


}