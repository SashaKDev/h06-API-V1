import {Request, Response} from 'express';
import {authService} from "../../../adapters/authService";
import {mailService} from "../../../adapters/mailService";

export const registrationHandler = async (req: Request, res: Response) => {

    const login = req.body.login;
    const password = req.body.password;
    const email = req.body.email;

    const confirmationCode = await authService.registerUser(login, password, email);
    if (confirmationCode === null) {
        res.sendStatus(400);
        return;
    }
    await mailService.sendMail(email, confirmationCode);
        res
        .sendStatus(204)
}