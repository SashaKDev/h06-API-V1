import {Request, Response} from 'express';
import {authService} from "../../../adapters/authService";
import {mailService} from "../../../adapters/mailService";

export const registrationHandler = async (req: Request, res: Response) => {

    console.log(111111111111111111111111);

    const login = req.body.login;
    const password = req.body.password;
    const email = req.body.email;

    const userId = await authService.registerUser(login, password, email);
    if (userId === null) {
        res.sendStatus(400);
        return;
    }
    await mailService.sendMail(email);
    console.log(userId);
    res
        .status(204)
        .json(userId)

}