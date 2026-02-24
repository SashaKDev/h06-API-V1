import {Request, Response} from "express";
import {jwtService} from "../../../adapters/jwtService";
import {refreshTokenRepository} from "../../repositories/refreshTokenRepository";

export const logoutHandler = async (req: Request, res: Response) => {

    const oldRefreshToken = req.cookies.refreshToken;

    const verifyResult = await jwtService.verifyRefreshToken(oldRefreshToken);
    if (!verifyResult) {
        res.sendStatus(401);
        return;
    }

    await refreshTokenRepository.addTokenToBlackList(oldRefreshToken);
    res.sendStatus(204);

}