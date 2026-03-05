import {Request, Response} from "express";
import {jwtService} from "../../../adapters/jwtService";
import {refreshTokenRepository} from "../../repositories/refreshTokenRepository";

export const logoutHandler = async (req: Request, res: Response) => {
    console.log("handler")
    const oldRefreshToken = req.cookies.refreshToken;

    const findResult = await refreshTokenRepository.findRefreshToken(oldRefreshToken);

    if (findResult) {
        res.sendStatus(401);
        return;
    }

    const verifyResult = await jwtService.verifyRefreshToken(oldRefreshToken);
    // console.log("result " + verifyResult);
    if (!verifyResult) {
        res.sendStatus(401);
        return;
    }

    await refreshTokenRepository.addTokenToBlackList(oldRefreshToken);
    res.sendStatus(204);

}