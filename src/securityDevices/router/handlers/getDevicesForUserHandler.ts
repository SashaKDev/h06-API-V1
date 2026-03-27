import {Request, Response} from "express";
import jwt, {JwtPayload} from "jsonwebtoken";
import {sessionsCollection} from "../../../db/mongo.db.js";
import {mapDeviceToViewModel} from "../../mappers/mapDeviceToViewModel.js";

export const getDevicesForUserHandler = async (req: Request, res: Response) => {

    const refreshToken = req.cookies.refreshToken;

    const payload = jwt.decode(refreshToken) as JwtPayload;
    const userId = payload.userId;

    const sessions = await sessionsCollection.find({userId: userId}).toArray();
    const devices = sessions.map(mapDeviceToViewModel)
    res
        .status(200)
        .json(
            devices
        )

}