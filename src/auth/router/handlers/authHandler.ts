import {Request, Response} from "express";
import {authService} from "../../application/authService";

export const authHandler = async (req: Request, res: Response) => {

    const loginOrEmail = req.body.loginOrEmail;
    const password = req.body.password;

    const authResult = await authService.checkCredentials(loginOrEmail, password);
    if (authResult) {
        res.sendStatus(204);
        return;
    }
    res.sendStatus(401);
}