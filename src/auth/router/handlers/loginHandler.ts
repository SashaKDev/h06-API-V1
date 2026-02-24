import {Request, Response} from "express";
import {authService} from "../../../adapters/authService";

export const loginHandler = async (req: Request, res: Response) => {

    const loginOrEmail = req.body.loginOrEmail;
    const password = req.body.password;

    const authResult = await authService.loginUser(loginOrEmail, password);

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