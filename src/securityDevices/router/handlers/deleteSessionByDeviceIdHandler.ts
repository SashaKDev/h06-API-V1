import {Request, Response} from "express";
import jwt from "jsonwebtoken";
import {sessionsCollection} from "../../../db/mongo.db";

export const deleteSessionByDeviceIdHandler = async (req: Request, res: Response) => {

    const refreshToken = req.cookies.refreshToken;
    const payload = jwt.decode(refreshToken) as {userId: string, deviceId: string};
    const deviceToDeleteId = req.params.id;

    const userId = payload.userId;
    const deviceId = payload.deviceId;

    const session = await sessionsCollection.findOne({deviceId: deviceToDeleteId});

    if (!session) {
        res.sendStatus(404);
        return;
    }

    if (session.userId !== userId) {
        res.sendStatus(403);
        return;
    }

    const deleteResult = await sessionsCollection.deleteOne({deviceId: deviceToDeleteId});
    if (deleteResult.deletedCount === 0) {
        res.sendStatus(404);
        return;
    }
    res.sendStatus(204);

}