import {Request, Response} from "express";
import {authService} from "../../../adapters/authService";
import {getDeviceTitle} from "../../../adapters/getDeviceTitle";

export const loginHandler = async (req: Request, res: Response) => {

    const loginOrEmail = req.body.loginOrEmail;
    const password = req.body.password;
    const userAgent = req.headers['user-agent'];

    const title = getDeviceTitle(userAgent);
    const ip = req.ip ? req.ip : "0:0:0:0";
    console.log(title);
    console.log(ip);


    const authResult = await authService.loginUser(loginOrEmail, password, title, ip);

    if (!authResult) {
        res.sendStatus(401);
        return;
    }

    const jwtToken = authResult.jwtToken;
    const refreshToken = authResult.refreshToken;

    res.cookie("refreshToken", refreshToken, {httpOnly: true,secure: true});
    res
        .status(200)
        .json({
            accessToken: jwtToken,
        })

}