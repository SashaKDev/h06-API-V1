import {Request, Response} from 'express';
import {authService} from "../../../adapters/authService";
import {mailService} from "../../../adapters/mailService";

export const registrationHandler = async (req: Request, res: Response) => {

    const login = req.body.login;
    const password = req.body.password;
    const email = req.body.email;

    // НОРМАЛЬНО ЛИ ВРУЧНУЮ ОТПРАВЛЯТЬ ОШИБКУ
    // ЕСЛИ НЕТ ТО КАК ЕЕ ЗАКИНУТЬ К ОСТАЛЬНЫМ ОШИБКАМ
    let confirmationCode = "";
    try {
        confirmationCode = await authService.registerUser(login, password, email);
    } catch (error: any) {
        const field = error.message.split(" ")[0];
        res
            .status(400)
            .json({errorsMessages: [{message: error.message, field: field}]});
        return;
    }
    // if (confirmationCode === null) {
    //     res
    //         .status(400)
    //         .json({
    //             "errorsMessages": [
    //                 {
    //                     "message": "Email already exists",
    //                     "field": "email"
    //                 }
    //             ]
    //         })
    //     return;
    // }
    await mailService.sendMail(email, confirmationCode);
        res
        .sendStatus(204)
}