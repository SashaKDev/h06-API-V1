import {usersQueryRepository} from "../../../users/repository/usersQueryRepository";
import {Request, Response} from "express";

export const getUserInfoHandler = async (req: Request, res: Response) => {
    const userAuthInfo = await usersQueryRepository.findUserAuthInfo(req.userId!);
    if (!userAuthInfo) {
        res.sendStatus(404);
        return;
    }
    res
        .status(200)
        .json(userAuthInfo);
}