import {Request, Response} from "express";
import {authService} from "../../../adapters/authService";

export const loginHandler = async (req: Request, res: Response) => {

    const loginOrEmail = req.body.loginOrEmail;
    const password = req.body.password;

    const authResultJWT = await authService.loginUser(loginOrEmail, password);
    if (authResultJWT) {
        res
            .status(200)
            .json({
                "accessToken": authResultJWT
            });
    } else {
        res.sendStatus(401);
    }

}