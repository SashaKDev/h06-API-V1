import {Request, Response, NextFunction} from "express";
import {rateLimitCollection} from "../../db/mongo.db";


export const rateLimitMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const ip = req.ip;
    const url = req.originalUrl;

    const newPing = {
        ip: ip,
        url: url,
        date: new Date(),
    }

    await rateLimitCollection.insertOne(newPing)

    const pingsCount = await rateLimitCollection.countDocuments({ip: ip, url: url, date: { $gte: new Date(Date.now() - 10000) }})
    if (pingsCount > 5) {
        res.sendStatus(429);
        return;
    }


    next();

}